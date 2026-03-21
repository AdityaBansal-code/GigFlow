import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../utils/errors.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new BadRequestError(errorMessages.join(', '));
  }
  next();
};

export const validateCreateGig = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('category')
    .optional()
    .isIn(['Web Dev', 'Design', 'Writing', 'Marketing', 'Data', 'Other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['Basic', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty'),
  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  validate,
];

export const validateUpdateGig = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('category')
    .optional()
    .isIn(['Web Dev', 'Design', 'Writing', 'Marketing', 'Data', 'Other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['Basic', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty'),
  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  validate,
];
