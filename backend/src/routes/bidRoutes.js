import express from 'express';
import { createBid, getBidsByGig, withdrawBid } from '../controllers/bidController.js';
import { validateCreateBid, validateGigIdParam, validateBidIdParam } from '../validators/bidValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validateCreateBid, createBid);

router.get('/:gigId', validateGigIdParam, getBidsByGig);

router.patch('/:bidId/withdraw', validateBidIdParam, withdrawBid);

export default router;
