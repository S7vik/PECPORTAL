import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../components/AuthContext';

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  useEffect(() => {
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      console.warn("No email found for verification, redirecting to signup");
      navigate('/signup');
      return;
    }
    setEmail(verificationEmail);

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

    const fullOtp = otp.join('');
    if (!fullOtp) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, fullOtp);
      sessionStorage.removeItem('verificationEmail');
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
      alert('A new verification code has been sent to your email.');
      setTimer(180);
      setIsResendDisabled(true);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 3 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
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

          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-lg"
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-600">
            Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
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
