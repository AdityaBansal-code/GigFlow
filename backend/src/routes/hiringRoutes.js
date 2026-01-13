import express from 'express';
import { hireFreelancer } from '../controllers/hiringController.js';
import { authenticate } from '../middleware/auth.js';
import { param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../utils/errors.js';

const router = express.Router();

const validateBidId = [
  param('bidId')
    .notEmpty()
    .withMessage('Bid ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Bid ID format');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new BadRequestError(errorMessages.join(', '));
    }
    next();
  },
];

router.use(authenticate);

router.patch('/:bidId/hire', validateBidId, hireFreelancer);

export default router;
