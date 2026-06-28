import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import Workspace from './pages/Workspace';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import Profile from './pages/Profile';
import { AdminLogin, AdminPanel } from './pages/Admin';
import AddProblem from './pages/AddProblem';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="page-wrapper flex-center"><div className="skeleton" style={{width: 200, height: 20}}></div></div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="page-wrapper flex-center"><div className="skeleton" style={{width: 200, height: 20}}></div></div>;
    if (!user || user.role !== 'admin') return <Navigate to="/403" />;
    return children;
};

function App() {
  return (
    <>
      <Navbar />
      <div className="animate-fade-in">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:slug" element={<Workspace />} />
            
            <Route path="/contests" element={<Contests />} />
            <Route path="/contests/:id" element={<ContestDetail />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/sudo" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/admin/problems/new" element={<AdminRoute><AddProblem /></AdminRoute>} />

            
            <Route path="*" element={
                <div className="page-wrapper flex-center">
                    <h1 className="text-gradient">404 Not Found</h1>
                </div>
            } />
        </Routes>
      </div>
    </>
  );
}

export default App;
