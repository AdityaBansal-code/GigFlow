import express from 'express';
import { createBid, getBidsByGig } from '../controllers/bidController.js';
import { validateCreateBid, validateGigIdParam } from '../validators/bidValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validateCreateBid, createBid);

router.get('/:gigId', validateGigIdParam, getBidsByGig);

export default router;
