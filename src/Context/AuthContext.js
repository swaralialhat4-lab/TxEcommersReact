import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useCallback } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Set axios default headers
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://localhost:7064/api/Auth/login', {
                email,
                password
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('https://localhost:7064/api/Auth/register', userData);
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

   const fetchProfile = useCallback(async () => {
    try {
        const response = await axios.get('https://localhost:7064/api/Auth/profile');
        setUser(response.data);
    } catch (error) {
        logout();
    } finally {
        setLoading(false);
    }
}, []);

   useEffect(() => {
    if (token) {
        fetchProfile();
    } else {
        setLoading(false);
    }
}, [token, fetchProfile]);

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};