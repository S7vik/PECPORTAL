import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Info } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../components/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const adminEmail = "ajinkyashivpure@gmail.com";
    if (email !== adminEmail && !email.endsWith('@pec.edu.in')) {
      setError('Please use a valid PEC email address (@pec.edu.in) or the admin email');
      return;
    }

    setLoading(true);

    try {
      // Save email for OTP verification
      sessionStorage.setItem('verificationEmail', email);

      await signup(name, email, password);

      setInfoMessage('Signup successful! Please check your email for OTP verification.');

      // Redirect to OTP verification page after a short delay
      setTimeout(() => {
        navigate('/otp-verification');
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
      setError(
          err.response?.data ||
          'Error creating account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9]">
        <div className="bg-white px-8 py-10 rounded-xl shadow-sm border border-blue-50 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-black tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-black mt-2">
            Sign up with your PEC email to get started
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSignup}>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
            )}

            {infoMessage && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-center text-sm">
                  <Info className="w-5 h-5 mr-2" />
                  {infoMessage}
                </div>
            )}

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
                  placeholder="Email (@pec.edu.in)"
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

            <Button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors duration-200"
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