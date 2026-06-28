import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="glass-navbar">
            <div className="nav-fluid-container flex-between nav-container">
                <Link to="/" className="nav-brand">
                    <Code2 className="nav-logo" size={28} />
                    <span className="text-gradient">JudgeX</span>
                </Link>

                <div className="nav-links">
                    <Link to="/problems" className="nav-link">Problems</Link>
                    <Link to="/contests" className="nav-link">Contests</Link>
                    
                    {user ? (
                        <div className="nav-user-menu">
                            <Link to="/profile" className="btn btn-secondary nav-profile-btn">
                                <UserIcon size={16} />
                                {user.userName}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-danger nav-logout-btn">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
