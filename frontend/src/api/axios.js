import axios from 'axios';

// Create an axios instance with the base URL of your Spring Boot backend
const api = axios.create({
    baseURL: 'http://43.204.149.202:8080',
});

// Add a request interceptor to include the auth token for authenticated requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;