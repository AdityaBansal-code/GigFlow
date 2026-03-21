import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../utils/errors.js';

export const validateUpdateProfile = [
  body('bio')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(skill => typeof skill === 'string' && skill.trim().length > 0);
    })
    .withMessage('Each skill must be a non-empty string'),
  body('portfolio')
    .optional()
    .isURL()
    .withMessage('Portfolio must be a valid URL'),
  body('profilePhoto')
    .optional()
    .isURL()
    .withMessage('Profile photo must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new BadRequestError(errorMessages.join(', '));
    }
    next();
  },
];

export const validateUserIdParam = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid User ID format');
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
