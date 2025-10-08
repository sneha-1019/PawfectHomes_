import express from 'express';
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  googleAuth,
  getMe,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', protect, logout);

router.get('/me', protect, getMe);


export default router;
