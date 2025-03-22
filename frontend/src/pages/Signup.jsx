import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Store the email in sessionStorage right away (before API call)
    // This ensures it's available even if the response handling has issues
    sessionStorage.setItem('verificationEmail', email);

    try {
      console.log("Sending signup request with data:", { name, email, password });

      const response = await api.post('/api/user/signup', {
        name,
        email,
        password
      });

      console.log("Signup response received:", response);

      // Navigate regardless of specific success format
      // If we got a 200 response, assume signup was successful
      navigate('/OtpVerification');

    } catch (err) {
      console.error("Signup error:", err);

      // Check if we received a success status but with error in data
      // Some APIs return 200 even for business logic errors
      if (err.response && err.response.status === 200) {
        console.log("Got 200 status but with error, navigating anyway");
        navigate('/OtpVerification');
        return;
      }

      if (err.response) {
        setError(err.response.data.message || 'Error creating account. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please try again later.');

        // If we're getting no response, it could be a CORS issue
        console.error("No response received - possible CORS issue");
      } else {
        setError('Error during signup. Please try again.');
      }
    } finally {
      setLoading(false);
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
                disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
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