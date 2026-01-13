import express from 'express';
import { getAllGigs, createGig, getGigById } from '../controllers/gigController.js';
import { validateCreateGig } from '../validators/gigValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGigs);
router.get('/:id', getGigById);

router.post('/', authenticate, validateCreateGig, createGig);

export default router;
