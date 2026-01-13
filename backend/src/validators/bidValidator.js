import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../utils/errors.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new BadRequestError(errorMessages.join(', '));
  }
  next();
};

export const validateCreateBid = [
  body('gigId')
    .notEmpty()
    .withMessage('Gig ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Gig ID format');
      }
      return true;
    }),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  validate,
];

export const validateGigIdParam = [
  param('gigId')
    .notEmpty()
    .withMessage('Gig ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Gig ID format');
      }
      return true;
    }),
  validate,
];
