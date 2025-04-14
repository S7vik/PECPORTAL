import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PECPortalLandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard';
import {AuthProvider, useAuth} from "./components/AuthContext.jsx";
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function AppRoutes() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    return (
        <Routes>
            {/* Landing page as the root route */}
            <Route path="/" element={<PECPortalLandingPage />} />
            
            {/* Public routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
            />
            <Route
                path="/otp-verification"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <OtpVerification />}
            />

            {/* Protected routes */}
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Fallback route - redirect to landing page if path doesn't match */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;