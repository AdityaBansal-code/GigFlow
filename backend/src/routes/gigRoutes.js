import express from 'express';
import { getAllGigs, createGig, getGigById, updateGig, deleteGig } from '../controllers/gigController.js';
import { validateCreateGig, validateUpdateGig } from '../validators/gigValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGigs);
router.get('/:id', getGigById);

router.post('/', authenticate, validateCreateGig, createGig);

router.patch('/:id', authenticate, validateUpdateGig, updateGig);

router.delete('/:id', authenticate, deleteGig);

export default router;
