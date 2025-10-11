import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import '../styles/auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await API.post('/auth/login', formData);
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      } else {
        const res = await API.post('/auth/register', formData);
        setUserId(res.data.userId);
        setShowOTPModal(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/verify-otp', { userId, otp });
      login(res.data.token, res.data.user);
      setShowOTPModal(false);
      navigate('/dashboard');
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await API.post('/auth/resend-otp', { userId });
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error('Error resending OTP');
    }
  };

 const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    setLoading(true);
    try {
      console.log('Google token response:', tokenResponse);
      const res = await API.post('/auth/google', { 
        code: tokenResponse.code 
      });
      
      // CRITICAL FIX: Ensure login completes before navigation
      await login(res.data.token, res.data.user);
      
      // Wait a bit for state to propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(error.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  },
  onError: (error) => {
    console.error('Google login error:', error);
    toast.error('Google login failed. Please try again.');
  },
  flow: 'auth-code',
});


  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? 'Welcome Back' : 'Join Pawfect Home'}</h2>
          <p>{isLogin ? 'Sign in to continue' : 'Create an account to get started'}</p>

          <button 
            className="btn-google" 
            onClick={() => googleLogin()}
            disabled={loading}
          >
            <FaGoogle /> Continue with Google
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                {/* <FaUser className="input-icon" /> */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              {/* <FaEnvelope className="input-icon" /> */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              {/* <FaLock className="input-icon" /> */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} disabled={loading}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="modal-overlay">
          <div className="modal-content otp-modal">
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit OTP to your email</p>
            <form onSubmit={handleOTPSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                disabled={loading}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
            <button onClick={handleResendOTP} className="btn-link" disabled={loading}>
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
