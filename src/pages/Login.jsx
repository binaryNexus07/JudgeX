import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(formData);
        if (res.success) {
            navigate('/problems');
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper flex-center animate-fade-in">
            <div className="glass-card auth-card">
                <div className="auth-header text-center">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to continue</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="text" 
                            name="email" 
                            className="glass-input with-icon" 
                            placeholder="Email or Username"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={18} />
                        <input 
                            type="password" 
                            name="password" 
                            className="glass-input with-icon" 
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-options flex-between">
                        <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'} <LogIn size={18} />
                    </button>
                </form>

                <div className="auth-footer text-center">
                    <p>Don't have an account? <Link to="/register" className="auth-link text-gradient">Register</Link></p>
                </div>
            </div>
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2 delay-200"></div>
        </div>
    );
};

export default Login;
