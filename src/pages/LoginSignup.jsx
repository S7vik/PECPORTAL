import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GitBranch } from 'lucide-react'; 
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const LoginSignup = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignup) {
      // Handle signup logic (mocked for now)
      if (email === 'satvik.raina@college.edu') {
        setError('User already exists. Please log in.');
      } else {
        alert('Account created successfully! You can now log in.');
        toggleMode(); // Switch to login mode
      }
    } else {
      // Call the login function and check if login is successful
      if (onLogin(email, password)) {
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        setError('Invalid credentials. Only Satvik Raina can log in.');
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-center text-gray-500 mt-2">
          {isSignup ? 'Sign up with your college email to get started' : 'Login with your details'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Full Name"
                icon={<User className="text-gray-400" />}
                value={name}
                onChange={(e) => setName(e.target.value)} // Bind input to state
              />
            </div>
          )}
          <div className="relative">
            <Input
              type="email"
              placeholder="College Email"
              icon={<Mail className="text-gray-400" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Bind input to state
            />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              icon={<Lock className="text-gray-400" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Bind input to state
            />
          </div>

          {isSignup && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Branch (e.g., CSE, ECE)"
                icon={<GitBranch className="text-gray-400" />} 
                value={branch}
                onChange={(e) => setBranch(e.target.value)} // Bind input to state
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition">
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
              onClick={toggleMode}
            >
              {isSignup ? 'Login here' : 'Sign up here'}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSignup;
