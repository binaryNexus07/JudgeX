import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogIn, Plus, Edit2, Users, Activity, Eye, UserCheck } from 'lucide-react';
import apiClient from '../api/client';
import './Auth.css';
import './Admin.css';

export const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user && user.role === 'admin') {
        return <Navigate to="/admin" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(credentials);
        if (res.success) {
            navigate('/admin');
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper flex-center animate-fade-in">
            <div className="glass-card auth-card" style={{borderTop: '4px solid var(--status-danger)'}}>
                <div className="auth-header text-center">
                    <h2><Shield className="text-danger" style={{display: 'inline', marginBottom: -4, color: 'var(--status-danger)'}}/> Sudo Access</h2>
                    <p>Restricted Area</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input type="text" name="email" className="glass-input" placeholder="Admin Email" required 
                               onChange={e => setCredentials({...credentials, email: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <input type="password" name="password" className="glass-input" placeholder="Admin Password" required 
                               onChange={e => setCredentials({...credentials, password: e.target.value})} />
                    </div>
                    <button type="submit" className="btn btn-danger auth-submit-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Authorize'} <LogIn size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export const AdminPanel = () => {
    const [timeframe, setTimeframe] = useState('Weekly');

    // Mock data for the CSS chart based on timeframe
    const chartData = {
        Daily: [
            { label: '00:00', val: 20 }, { label: '04:00', val: 10 }, { label: '08:00', val: 45 }, 
            { label: '12:00', val: 80 }, { label: '16:00', val: 65 }, { label: '20:00', val: 90 }
        ],
        Weekly: [
            { label: 'Mon', val: 60 }, { label: 'Tue', val: 75 }, { label: 'Wed', val: 85 }, 
            { label: 'Thu', val: 55 }, { label: 'Fri', val: 95 }, { label: 'Sat', val: 100 }, { label: 'Sun', val: 80 }
        ],
        Monthly: [
            { label: 'Week 1', val: 70 }, { label: 'Week 2', val: 85 }, 
            { label: 'Week 3', val: 65 }, { label: 'Week 4', val: 95 }
        ]
    };

    const currentData = chartData[timeframe];
    const maxVal = Math.max(...currentData.map(d => d.val)) || 100;

    return (
        <div className="page-wrapper container animate-fade-in admin-dashboard">
            
            <div className="dashboard-header">
                <h2><Shield className="text-danger" style={{display: 'inline', color: 'var(--status-danger)'}}/> Sudo Dashboard</h2>
                <div className="timeframe-toggles">
                    {['Daily', 'Weekly', 'Monthly'].map(tf => (
                        <button 
                            key={tf} 
                            className={timeframe === tf ? 'active' : ''}
                            onClick={() => setTimeframe(tf)}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stats */}
            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-card-header">
                        <h3>Live Users</h3>
                        <Activity size={20} className="text-accent-blue" />
                    </div>
                    <div className="stat-value">1,204</div>
                    <div className="stat-trend">+12% vs last {timeframe.toLowerCase()}</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-card-header">
                        <h3>Total Visits</h3>
                        <Eye size={20} className="text-accent-purple" />
                    </div>
                    <div className="stat-value">45.2K</div>
                    <div className="stat-trend">+5% vs last {timeframe.toLowerCase()}</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-card-header">
                        <h3>Registered Users</h3>
                        <Users size={20} className="text-accent-cyan" />
                    </div>
                    <div className="stat-value">8,592</div>
                    <div className="stat-trend">+2% vs last {timeframe.toLowerCase()}</div>
                </div>
            </div>

            {/* CSS Bar Chart */}
            <div className="glass-panel chart-container">
                <h3 className="text-secondary" style={{fontSize: '1rem'}}>Active Users Over Time</h3>
                <div className="chart-bars">
                    {currentData.map((data, idx) => (
                        <div className="bar-wrapper" key={idx}>
                            <div 
                                className="bar" 
                                style={{ height: `${(data.val / maxVal) * 100}%` }}
                                data-val={data.val}
                            ></div>
                            <span className="bar-label">{data.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Management Blocks */}
            <div className="management-grid">
                
                {/* Problem Management */}
                <div className="glass-panel manage-card">
                    <h2>Problem Management</h2>
                    <p className="text-secondary mb-4">Total problems available on the platform categorized by difficulty.</p>
                    
                    <div className="diff-stats">
                        <div className="diff-stat">
                            <span className="diff-easy">142</span>
                            Easy
                        </div>
                        <div className="diff-stat">
                            <span className="diff-medium">89</span>
                            Medium
                        </div>
                        <div className="diff-stat">
                            <span className="diff-hard">34</span>
                            Hard
                        </div>
                    </div>

                    <div className="manage-actions">
                        <Link to="/admin/problems/new" className="btn btn-primary">
                            <Plus size={18} /> Add New Problem
                        </Link>
                        <button className="btn btn-secondary">
                            <Edit2 size={18} /> Modify Existing
                        </button>
                    </div>
                </div>

                {/* User Management */}
                <div className="glass-panel manage-card">
                    <h2>User Access Control</h2>
                    <p className="text-secondary mb-4">Monitor suspicious activities, ban violating accounts, or reinstate users.</p>
                    
                    <div className="diff-stats" style={{flexDirection: 'column', gap: 8}}>
                        <div className="flex-between p-3" style={{background: 'rgba(0,0,0,0.2)', borderRadius: 8}}>
                            <span>Active Accounts</span>
                            <strong className="text-accent-blue">8,450</strong>
                        </div>
                        <div className="flex-between p-3" style={{background: 'rgba(0,0,0,0.2)', borderRadius: 8}}>
                            <span>Banned Accounts</span>
                            <strong className="text-danger" style={{color: 'var(--status-danger)'}}>142</strong>
                        </div>
                    </div>

                    <div className="manage-actions mt-4">
                        <button className="btn btn-danger" style={{flex: 1}}>
                            Ban User
                        </button>
                        <button className="btn btn-secondary" style={{flex: 1}}>
                            <UserCheck size={18} /> Unban User
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
