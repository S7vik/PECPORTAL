import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get email from both localStorage and sessionStorage
    const verificationEmail = sessionStorage.getItem('verificationEmail') || localStorage.getItem('verificationEmail');
    console.log("Retrieved email for verification:", verificationEmail);

    if (!verificationEmail) {
      console.warn("No email found for verification, redirecting to signup");
      navigate('/Signup');
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
    setLoading(true);

    if (!otp) {
      setError('Please enter the verification code');
      setLoading(false);
      return;
    }

    try {
      console.log("Sending OTP verification for email:", email);

      // Use query parameters instead of JSON body to match backend's @RequestParam
      const response = await axios.post(
          `http://localhost:8080/api/user/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );

      console.log("OTP verification response:", response);

      // For your specific backend, the success response will be text like "Signup complete..."
      if (response.status === 200) {
        // Clear storage
        localStorage.removeItem('verificationEmail');
        sessionStorage.removeItem('verificationEmail');

        // Show success message from the backend or a default
        alert(response.data || 'Email verified successfully! Please log in.');

        // Redirect to login page
        navigate('/Login');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      console.error("OTP verification error:", err);

      if (err.response) {
        if (err.response.status === 400) {
          setError('Invalid or expired OTP. Please try again.');
        } else {
          setError(err.response.data || 'Error verifying OTP');
        }
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error verifying code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      console.log("Requesting OTP resend for email:", email);

      // Adjust this to match your backend's resend-otp endpoint format
      const response = await axios.post(
          `http://localhost:8080/api/user/resend-otp?email=${encodeURIComponent(email)}`
      );

      console.log("Resend OTP response:", response);

      if (response.status === 200) {
        // Reset timer
        setTimer(180);
        setIsResendDisabled(true);
        alert('Verification code resent successfully!');
      } else {
        setError('Failed to resend code');
      }
    } catch (err) {
      console.error("Resend OTP error:", err);

      if (err.response) {
        setError(err.response.data || 'Failed to resend code');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error resending code. Please try again.');
      }
    } finally {
      setLoading(false);
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