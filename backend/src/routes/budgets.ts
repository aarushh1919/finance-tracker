import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  updateBudgetSpending
} from '../controllers/budgetController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', getBudgets);

router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Budget name is required')
    .isLength({ max: 100 })
    .withMessage('Budget name cannot exceed 100 characters'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Budget amount must be greater than 0'),
  body('period')
    .isIn(['weekly', 'monthly', 'yearly'])
    .withMessage('Period must be one of: weekly, monthly, yearly'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
], validateRequest, createBudget);

router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Budget name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Budget name cannot exceed 100 characters'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Budget amount must be greater than 0'),
  body('period')
    .optional()
    .isIn(['weekly', 'monthly', 'yearly'])
    .withMessage('Period must be one of: weekly, monthly, yearly'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
], validateRequest, updateBudget);

router.patch('/:id/spending', updateBudgetSpending);

router.delete('/:id', deleteBudget);

export default router;
