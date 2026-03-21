import express from 'express';
import { getProfile, updateProfile, getProfileStats } from '../controllers/profileController.js';
import { validateUpdateProfile, validateUserIdParam } from '../validators/profileValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get authenticated user's profile stats
router.get('/me/stats', authenticate, getProfileStats);

// Update authenticated user's profile
router.patch('/me', authenticate, validateUpdateProfile, updateProfile);

// Get any user's profile (public)
router.get('/:userId', validateUserIdParam, getProfile);

export default router;
