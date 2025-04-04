import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../components/AuthContext';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  useEffect(() => {
    // Get email from sessionStorage
    const verificationEmail = sessionStorage.getItem('verificationEmail');

    if (!verificationEmail) {
      console.warn("No email found for verification, redirecting to signup");
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

    setLoading(true);

    try {
      await verifyOtp(email, otp);

      // Clear storage
      sessionStorage.removeItem('verificationEmail');

      // Show success and redirect
      alert('Email verified successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error("OTP verification error:", err);
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      // In a production app, you would call an API to resend OTP
      // For now, we'll just reset the timer
      alert('A new verification code has been sent to your email.');

      // Reset timer
      setTimer(180);
      setIsResendDisabled(true);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-700">
        <div className="bg-white px-8 py-10 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
          <div className="flex items-center mb-6">
            <button
                onClick={() => navigate('/signup')}
                className="p-1 mr-4 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                We've sent a verification code to <span className="font-medium">{email}</span>
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleVerify}>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
            )}

            <div className="space-y-1">
              <Input
                  type="text"
                  placeholder="Enter verification code"
                  icon={<CheckCircle className="text-gray-400 w-5 h-5" />}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
              />
            </div>

            <div className="text-center text-sm text-gray-600">
              Time remaining: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
            </div>

            <Button
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors duration-200"
                disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <button
                  type="button"
                  className={`text-gray-900 font-medium hover:underline focus:outline-none ${isResendDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleResend}
                  disabled={isResendDisabled || loading}
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