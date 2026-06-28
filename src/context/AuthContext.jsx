import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get('/auth/user');
            if (response.success && response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.success) {
            await checkAuth(); // Refresh user data
            return { success: true };
        }
        return { success: false, message: response.message || 'Login failed' };
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            setUser(null);
        }
    };

    const register = async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.success) {
            return { success: true, message: response.message };
        }
        return { success: false, message: response.message || 'Registration failed' };
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
