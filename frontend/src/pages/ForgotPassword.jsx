import React, { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
   
    try {
       const res = await fetch(`/api/user/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });

      const text = await res.text();
      if (!res.ok) {
        setError(text);
      } else {
        setMessage( text);
        navigate('/verify-reset-otp', { state: { email } });
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] px-4">
      <div className="bg-white px-6 py-8 sm:px-8 sm:py-10 rounded-xl shadow-sm border border-blue-50 w-full max-w-xs sm:max-w-md">
        <h2 className="text-2xl font-semibold text-black tracking-tight">Forgot Password</h2>
        <p className="text-sm text-black mt-2">Enter your email to receive a password reset OTP.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm"><AlertCircle className="w-5 h-5 mr-2" />{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center text-sm">{message}</div>}

          <Input type="email" placeholder="Email" icon={<Mail className="text-gray-400 w-5 h-5" />} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />

          <Button type="submit" className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
