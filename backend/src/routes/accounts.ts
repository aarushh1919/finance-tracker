import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', getAccounts);

router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Account name is required')
    .isLength({ max: 100 })
    .withMessage('Account name cannot exceed 100 characters'),
  body('type')
    .isIn(['checking', 'savings', 'credit', 'investment', 'cash', 'other'])
    .withMessage('Type must be one of: checking, savings, credit, investment, cash, other'),
  body('balance')
    .optional()
    .isFloat()
    .withMessage('Balance must be a number'),
  body('currency')
    .optional()
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency must be a valid 3-letter currency code'),
  body('bankName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Bank name cannot exceed 100 characters'),
  body('accountNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Account number cannot exceed 50 characters')
], validateRequest, createAccount);

router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Account name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Account name cannot exceed 100 characters'),
  body('type')
    .optional()
    .isIn(['checking', 'savings', 'credit', 'investment', 'cash', 'other'])
    .withMessage('Type must be one of: checking, savings, credit, investment, cash, other'),
  body('balance')
    .optional()
    .isFloat()
    .withMessage('Balance must be a number'),
  body('currency')
    .optional()
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency must be a valid 3-letter currency code'),
  body('bankName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Bank name cannot exceed 100 characters'),
  body('accountNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Account number cannot exceed 50 characters')
], validateRequest, updateAccount);

router.delete('/:id', deleteAccount);

export default router;
