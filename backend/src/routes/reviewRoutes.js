import express from 'express';
import {
  submitReview,
  getReviewsForUser,
  getReviewsForGig,
} from '../controllers/reviewController.js';
import {
  validateCreateReview,
  validateUserIdParam,
  validateGigIdParam,
} from '../validators/reviewValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Submit review (auth required)
router.post('/', authenticate, validateCreateReview, submitReview);

// Get reviews for a specific user (public)
router.get('/user/:userId', validateUserIdParam, getReviewsForUser);

// Get reviews for a specific gig (public)
router.get('/gig/:gigId', validateGigIdParam, getReviewsForGig);

export default router;
