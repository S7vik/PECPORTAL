import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from session storage
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      // If no email in session storage, redirect to signup
      navigate('/signup');
      return;
    }
    setEmail(verificationEmail);

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    try {
      const response = await axios.post('/api/user/verify-otp', {
        email,
        otp
      });

      if (response.data.success) {
        // Clear session storage
        sessionStorage.removeItem('verificationEmail');
        // Show success message
        alert('Email verified successfully! Please log in.');
        // Redirect to login page
        navigate('/login');
      } else {
        setError(response.data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Error verifying code. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post('/api/user/signup', {
        email,
        resendOtp: true
      });

      if (response.data.success) {
        // Reset timer
        setTimer(180);
        setIsResendDisabled(true);
        alert('Verification code resent successfully!');
      } else {
        setError(response.data.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Error resending code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-white px-8 py-10 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleVerify}>
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              icon={<CheckCircle className="text-gray-400 w-5 h-5" />}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <div className="text-center text-sm text-gray-600">
            Time remaining: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors duration-200"
          >
            Verify Email
          </Button>

          <div className="text-center">
            <button
              type="button"
              className={`text-gray-900 font-medium hover:underline focus:outline-none ${isResendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResend}
              disabled={isResendDisabled}
            >
              Resend verification code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;