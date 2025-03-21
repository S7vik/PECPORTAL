import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/api/user/signup', {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        // Store email in session storage to pass to OTP verification page
        sessionStorage.setItem('verificationEmail', email);
        navigate('/verify-otp');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700 ">
      <div className="bg-white px-8 py-10 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Sign up with your email to get started
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSignup}>
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Full Name"
              icon={<User className="text-gray-400 w-5 h-5" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="Email"
              icon={<Mail className="text-gray-400 w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Password"
              icon={<Lock className="text-gray-400 w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors duration-200"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-gray-900 font-medium hover:underline focus:outline-none"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;