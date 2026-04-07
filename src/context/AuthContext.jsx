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
        } else if (email === 'sebastian@sga.com' && password === 'seb123') {
            setIsAuthenticated(true);
            const dummyUser = { email, role: 'admin', name: 'Sebastian', canProvision: true };
            setUser(dummyUser);
            localStorage.setItem('sga_iot_auth', 'true');
            localStorage.setItem('sga_iot_user', JSON.stringify(dummyUser));
            return { success: true };
        } else if (email === 'gerardo@sga.com' && password === 'ger123') {
            setIsAuthenticated(true);
            const dummyUser = { email, role: 'admin', name: 'Gerardo', canProvision: true };
            setUser(dummyUser);
            localStorage.setItem('sga_iot_auth', 'true');
            localStorage.setItem('sga_iot_user', JSON.stringify(dummyUser));
            return { success: true };
        } else if (email === 'angel@sga.com' && password === 'ang123') {
            setIsAuthenticated(true);
            const dummyUser = { email, role: 'admin', name: 'Angel', canProvision: true };
            setUser(dummyUser);
            localStorage.setItem('sga_iot_auth', 'true');
            localStorage.setItem('sga_iot_user', JSON.stringify(dummyUser));
            return { success: true };
        } else if (email === 'tecnico@sga.com' && password === 'tech123') {
            setIsAuthenticated(true);
            const dummyUser = { email, role: 'tecnico', name: 'Carlos Tech', canProvision: false };
            setUser(dummyUser);
            localStorage.setItem('sga_iot_auth', 'true');
            localStorage.setItem('sga_iot_user', JSON.stringify(dummyUser));
            return { success: true };
        }
        return { success: false, message: 'Credenciales inválidas. Prueba con sebastian@sga.com, gerardo@sga.com o angel@sga.com.' };
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
