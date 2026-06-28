import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save, Activity } from 'lucide-react';
import apiClient from '../api/client';
import './Profile.css';

const Profile = () => {
    const { user, checkAuth } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
            fetchSubmissions();
        }
    }, [user]);

    const fetchSubmissions = async () => {
        try {
            const res = await apiClient.get('/submission/my-submissions');
            if (res.success && res.data) {
                setSubmissions(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch submissions', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ text: '', type: '' });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiClient.patch('/auth/update', formData);
            if (res.success) {
                setMessage({ text: 'Profile updated successfully', type: 'success' });
                await checkAuth(); // refresh user data
            } else {
                setMessage({ text: res.message || 'Update failed', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: err.message || 'Server error', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="page-wrapper container animate-fade-in">
            <div className="profile-grid">
                {/* Left Column: Settings */}
                <div className="profile-settings glass-panel">
                    <div className="profile-header">
                        <div className="avatar-placeholder">
                            <User size={32} />
                        </div>
                        <div>
                            <h2>{user.userName}</h2>
                            <p className="text-secondary">{user.role}</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="profile-form mt-4">
                        <h3>Account Settings</h3>
                        
                        {message.text && (
                            <div className={`alert alert-${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text"
                                name="name"
                                className="glass-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input 
                                type="email"
                                name="email"
                                className="glass-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                    </form>
                </div>

                {/* Right Column: Stats & Submissions */}
                <div className="profile-stats">
                    <div className="glass-panel stat-card mb-4">
                        <Activity size={24} className="text-gradient" />
                        <div className="stat-info">
                            <h3>Total Submissions</h3>
                            <span className="stat-value">{submissions.length}</span>
                        </div>
                    </div>

                    <div className="glass-panel submissions-panel">
                        <h3>Recent Submissions</h3>
                        <div className="table-responsive mt-3">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Problem</th>
                                        <th>Status</th>
                                        <th>Language</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length > 0 ? (
                                        submissions.slice(0, 5).map(sub => (
                                            <tr key={sub._id}>
                                                <td>{sub.problemId?.title || 'Unknown Problem'}</td>
                                                <td>
                                                    <span className={`badge ${sub.status === 'accepted' ? 'badge-easy' : 'badge-hard'}`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="mono text-secondary">{sub.language}</td>
                                                <td className="text-secondary">{new Date(sub.submissionTime || sub.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-secondary">
                                                No submissions yet. Start solving!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
