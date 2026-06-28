import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        userName: '',
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await register(formData);
        if (res.success) {
            setSuccess('Registration successful! Please check your email to verify your account.');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper flex-center animate-fade-in">
            <div className="glass-card auth-card">
                <div className="auth-header text-center">
                    <h2>Join JudgeX</h2>
                    <p>Start your competitive programming journey</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <User className="input-icon" size={18} />
                        <input 
                            type="text" 
                            name="userName" 
                            className="glass-input with-icon" 
                            placeholder="Username (unique)"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <User className="input-icon" size={18} />
                        <input 
                            type="text" 
                            name="name" 
                            className="glass-input with-icon" 
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="email" 
                            name="email" 
                            className="glass-input with-icon" 
                            placeholder="Email Address"
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
                            placeholder="Password (min 8 chars, 1 uppercase, 1 special)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading || success}>
                        {loading ? 'Creating account...' : 'Create Account'} <UserPlus size={18} />
                    </button>
                </form>

                <div className="auth-footer text-center">
                    <p>Already have an account? <Link to="/login" className="auth-link text-gradient">Log in</Link></p>
                </div>
            </div>
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-3 delay-300"></div>
        </div>
    );
};

export default Register;
