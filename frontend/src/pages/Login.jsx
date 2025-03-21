import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { email, password: "****" });

      // Create the login request using fetch instead of axios
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      console.log("Login response status:", response.status);

      // Check if response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Try to parse the response as text first
      const responseText = await response.text();
      console.log("Response text:", responseText);

      let responseData;
      // Try to parse as JSON if possible
      try {
        responseData = JSON.parse(responseText);
        console.log("Parsed response data:", responseData);
      } catch (e) {
        console.log("Response is not valid JSON, using text response");
        responseData = { token: responseText }; // Treat the response as the token itself
      }

      if (responseData.token) {
        // Store user token
        localStorage.setItem('token', responseData.token);
        console.log("Token stored in localStorage");

        // Redirect to dashboard
        navigate('/Dashboard');
      } else {
        // If no token in response
        setError('Login successful but no token received');
      }
    }
    catch (err) {
      console.error("Login error:", err);

      if (err.name === 'SyntaxError') {
        setError('Error parsing server response');
      } else {
        setError('Invalid credentials or server error. Please try again.');
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-700">
        <div className="bg-white px-8 py-10 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Login with your details
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                  to="/signup"
                  className="text-gray-900 font-medium hover:underline focus:outline-none"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Login;