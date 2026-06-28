import axios from 'axios';

const apiClient = axios.create({
    // Since we assume it hasn't been deployed on Render yet, use local backend URL
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Response interceptor to handle global errors (like token expiration)
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // If 401, we could potentially redirect to login or show toast
        return Promise.reject(error.response?.data || error);
    }
);

export default apiClient;
