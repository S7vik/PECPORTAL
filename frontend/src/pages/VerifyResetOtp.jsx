import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState(new Array(4).fill('')); // Changed to array for individual blocks
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Add verification success state
  
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    const fullOtp = otp.join('');
    if (!fullOtp || fullOtp.length < 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`https://pecportal.store/api/user/verify-reset-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(fullOtp)}`, {
        method: 'POST'
      });
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // If not JSON, get as text
        data = await res.text();
      }
      
      if (!res.ok) {
        // Handle different error response formats
        if (typeof data === 'string') {
          setError(data);
        } else if (data.message) {
          setError(data.message);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Failed to verify OTP');
        }
        setIsVerified(false);
      } else {
        // Set verified state to trigger animation
        setIsVerified(true);
        
        // Handle success - data might be string or object
        let resetToken;
        if (typeof data === 'string') {
          // If server returns just the token as string
          resetToken = data;
        } else if (data.resetToken) {
          resetToken = data.resetToken;
        }
        
        // Short delay before redirect to show the animation
        setTimeout(() => {
          navigate('/reset-password', {
            state: {
              email: email,
              resetToken: resetToken
            }
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again.');
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, ''); // Only allow digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if available
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

  // Add email validation
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] px-2">
        <div className="bg-white px-4 py-8 sm:px-8 sm:py-10 rounded-xl shadow-sm border border-blue-50 w-full max-w-xs sm:max-w-md">
          <h2 className="text-2xl font-semibold text-black tracking-tight">Error</h2>
          <p className="text-sm text-red-600 mt-2">No email provided. Please go back to forgot password.</p>
          <Button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 mt-4"
          >
            Back to Forgot Password
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] px-2">
      <div className="bg-white px-4 py-8 sm:px-8 sm:py-10 rounded-xl shadow-sm border border-blue-50 w-full max-w-xs sm:max-w-md">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/forgot-password')}
            className="p-1 mr-4 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Verify Reset Code
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              We've sent a 4-digit code to <span className="font-medium">{email}</span>.
              <br />
              <span className="text-gray-500">
                Please enter it below to reset your password.
              </span>
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
              <div key={index} className="relative">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 text-center rounded-lg focus:outline-none focus:ring-2 text-lg transition-all duration-300 ${
                    isVerified
                      ? 'border-green-500 bg-green-50 text-green-700 focus:ring-green-300'
                      : 'border border-gray-300 focus:ring-gray-300'
                  }`}
                  style={{ borderWidth: isVerified ? '2px' : '1px' }}
                />
                {isVerified && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 animate-fadeIn">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className={`w-full py-3 font-medium rounded-lg transition-colors duration-300 ${
              isVerified
                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                : 'bg-blue-600 hover:bg-gray-800 active:bg-gray-950'
            } text-white`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : isVerified ? 'Verified!' : 'Verify Reset Code'}
          </Button>
        </form>
      </div>
    </div>
  );
};

// Add this animation to your global CSS or in a style tag
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out forwards;
  animation-delay: 0.2s;
}
`;

export default VerifyResetOtp;