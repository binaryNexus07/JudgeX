import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth(); // Connect context logic

    useEffect(() => {
        // Connect to the API Gateway
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/v1', '');
        
        const newSocket = io(baseUrl, {
            withCredentials: true,
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('Connected to JudgeX WebSocket:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
