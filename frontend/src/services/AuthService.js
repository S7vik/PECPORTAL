import axios from 'axios';

const API_URL = 'https://pecportal.store/api/user/';

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(API_URL + 'login', {
                email,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                return { success: true, data: response.data };
            } else {
                return { success: false, message: 'Login failed: No token received' };
            }
        } catch (error) {
            let errorMessage = 'Login failed';

            if (error.response) {
                errorMessage = error.response.data || `Error (${error.response.status})`;
            } else if (error.request) {
                errorMessage = 'No response from server';
            } else {
                errorMessage = error.message;
            }

            return { success: false, message: errorMessage, error };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        // If you want to decode JWT token to get user info:
        // This is a simple JWT decoder for the client side
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default AuthService;