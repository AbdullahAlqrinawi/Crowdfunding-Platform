import express from 'express';
import { registerUser, gettingUser, loginUser, getUserProfile, updateUserProfile, verifyOTP, resendOTP } from '../controllers/userController.js';
import { upload } from '../utilities.js';
import { authenticateToken } from '../utilities.js'; 

const router = express.Router();

router.post('/register', upload.single('profile_pic'), registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/:id', getUserProfile);
router.put('/:id', authenticateToken, upload.single('profile_pic'), updateUserProfile);
router.get('/me', authenticateToken, gettingUser);

export default router;