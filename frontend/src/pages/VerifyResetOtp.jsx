import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

const VerifyResetOtp = () => {
const [otp, setOtp] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const location = useLocation();
const navigate = useNavigate();
const email = location.state?.email;

const handleVerify = async (e) => {
e.preventDefault();
setError('');
setLoading(true);
try {
const res = await fetch(`/api/user/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
method: 'POST'
});
const data = await res.json();
if (!res.ok) {
setError(data || 'Failed to verify OTP');
} else {
navigate('/reset-password', {
state: {
email: email,
resetToken: data.resetToken
}
});
}
} catch (err) {
setError('Network error. Try again.');
} finally {
setLoading(false);
}
};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] px-2">
  <div className="bg-white px-4 py-8 sm:px-8 sm:py-10 rounded-xl shadow-sm border border-blue-50 w-full max-w-xs sm:max-w-md">
    <h2 className="text-2xl font-semibold text-black tracking-tight">
      Verify OTP
    </h2>
    <p className="text-sm text-black mt-2">
      Enter the OTP sent to your email
    </p>

    <form onSubmit={handleVerify} className="mt-8 space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-1">
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
    </form>
  </div>
</div>
);
};

export default VerifyResetOtp;