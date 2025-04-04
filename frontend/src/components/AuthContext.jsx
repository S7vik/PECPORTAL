import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setToken(storedToken);
            fetchUserProfile(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Fetch user profile using token
    const fetchUserProfile = async (authToken) => {
        try {
            // Set token in axios headers
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            // Get user profile from backend
            const response = await api.get('/api/dashboard');
            setCurrentUser(response.data);
        } catch (err) {
            console.error('Error fetching user profile:', err);
            // If token is invalid, clear it
            if (err.response && err.response.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setError(null);
        try {
            const response = await api.post('/api/user/login', { email, password });

            // Store token in localStorage
            const authToken = response.data.token;
            localStorage.setItem('token', authToken);

            // Set token in state and axios headers
            setToken(authToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            // Set user data
            setCurrentUser(response.data);

            return response.data;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data || 'Invalid credentials or server error');
            throw err;
        }
    };

    // Signup function
    const signup = async (name, email, password) => {
        setError(null);
        try {
            const response = await api.post('/api/user/signup', { name, email, password });
            return response.data;
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data || 'Error creating account');
            throw err;
        }
    };

    // Verify OTP function
    const verifyOtp = async (email, otp) => {
        setError(null);
        try {
            const response = await api.post(`/api/user/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
            return response.data;
        } catch (err) {
            console.error('OTP verification error:', err);
            setError(err.response?.data || 'Invalid or expired OTP');
            throw err;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        // Remove Authorization header
        delete api.defaults.headers.common['Authorization'];
    };

    // Context value
    const value = {
        currentUser,
        token,
        loading,
        error,
        login,
        signup,
        verifyOtp,
        logout,
        isAuthenticated: !!token,
        isAdmin: currentUser?.dashboardType === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;