import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      // On successful login, user will be redirected to dashboard
      // through the route protection in App.jsx
    } catch (err) {
      console.error('Login error:', err);
      setError(
          err.response?.data ||
          'Invalid credentials or server error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9]">

    <div className="bg-white px-8 py-10 rounded-xl shadow-sm border border-blue-50 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-black tracking-tight">
        Welcome Back
      </h2>
      <p className="text-sm text-black mt-2">
        Login with your PEC credentials
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-1">
          <Input
            type="email"
            placeholder="Email"
            icon={<Mail className="text-blue-400 w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Password"
            icon={<Lock className="text-blue-400 w-5 h-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-black">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-black font-medium hover:underline focus:outline-none"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Login;