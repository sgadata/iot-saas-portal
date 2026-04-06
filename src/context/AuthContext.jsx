import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Check local storage for initial auth state
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('sga_iot_auth');
        return storedAuth === 'true';
    });

    const [user, setUser] = useState(() => {
         const storedUser = localStorage.getItem('sga_iot_user');
         return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (email, password) => {
        // Mock authentication logic
        if (email === 'admin@sga.com' && password === 'admin') {
            setIsAuthenticated(true);
            const dummyUser = { email, role: 'admin', name: 'SGA Admin' };
            setUser(dummyUser);
            localStorage.setItem('sga_iot_auth', 'true');
            localStorage.setItem('sga_iot_user', JSON.stringify(dummyUser));
            return { success: true };
        } else if (email === 'tecnico@sga.com' && password === 'tech123') {
            setIsAuthenticated(true);
            const dummyUser = { email, role: 'tecnico', name: 'Carlos Tech' };
            setUser(dummyUser);
            localStorage.setItem('sga_iot_auth', 'true');
            localStorage.setItem('sga_iot_user', JSON.stringify(dummyUser));
            return { success: true };
        }
        return { success: false, message: 'Credenciales inválidas. Usa admin@sga.com / admin O tecnico@sga.com / tech123' };
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('sga_iot_auth');
        localStorage.removeItem('sga_iot_user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
