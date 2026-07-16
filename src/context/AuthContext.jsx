import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(() => {
        if (typeof window === 'undefined') return null;

        const storedUser = window.sessionStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });
    const [token, setToken] = useState(() => {
        if (typeof window === 'undefined') return null;
        return window.sessionStorage.getItem('token');
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('token');
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.status === 'success' || response.ok) {
                if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('user', JSON.stringify(data.user));
                    window.sessionStorage.setItem('token', data.token);
                    window.localStorage.removeItem('user');
                    window.localStorage.removeItem('token');
                }
                setUser(data.user);
                setToken(data.token);
                showToast(`Welcome back, ${data.user.name}!`, 'success');
                navigate('/dashboard');
                return { success: true, user: data.user };
            } else {
                showToast(data.message || 'Login failed', 'error');
                return { success: false, message: data.message };
            }
        } catch (err) {
            showToast('Connection error. Please try again.', 'error');
            console.error(err);
            return { success: false, message: 'Connection error' };
        } finally {
            setLoading(false);
        }
    }, [navigate, showToast]);

    const register = useCallback(async (formData) => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const result = await response.json();

            if (response.ok) {
                const userData = {
                    id: result.user_id,
                    name: formData.name,
                    email: formData.email,
                    image: null,
                    tokens: result.tokens
                };
                if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('user', JSON.stringify(userData));
                    window.sessionStorage.setItem('token', result.token);
                    window.localStorage.removeItem('user');
                    window.localStorage.removeItem('token');
                }
                setUser(userData);
                setToken(result.token);
                showToast('Registration successful! Please verify your email.', 'success');
                navigate('/dashboard', { replace: true });
                return { success: true, user: userData };
            } else {
                showToast(result.message || 'Registration failed', 'error');
                return { success: false, message: result.message };
            }
        } catch (err) {
            showToast('Connection error. Please try again.', 'error');
            console.error(err);
            return { success: false, message: 'Connection error' };
        } finally {
            setLoading(false);
        }
    }, [navigate, showToast]);

    const logout = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem('user');
            window.sessionStorage.removeItem('token');
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('token');
        }
        setUser(null);
        setToken(null);
        showToast('Logged out successfully', 'info');
        navigate('/login');
    }, [navigate, showToast]);

    const updateUser = useCallback((updatedData) => {
        const newUser = { ...user, ...updatedData };
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('user', JSON.stringify(newUser));
        }
        setUser(newUser);
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
