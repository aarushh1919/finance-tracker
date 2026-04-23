import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Category } from '../models/Category';
import { Account } from '../models/Account';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, category, account, type, startDate, endDate } = req.query;
    
    const query: any = {};
    
    if (category) query.category = category;
    if (account) query.account = account;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name color icon')
      .populate('account', 'name type')
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { description, amount, type, category, account, date, notes, tags } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const accountExists = await Account.findById(account);
    if (!accountExists) {
      return res.status(400).json({
        success: false,
        message: 'Account not found'
      });
    }

    const transaction = new Transaction({
      description,
      amount,
      type,
      category,
      account,
      date: date || new Date(),
      notes,
      tags
    });

    await transaction.save();

    await transaction.populate('category', 'name color icon');
    await transaction.populate('account', 'name type');

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    if (updates.account) {
      const accountExists = await Account.findById(updates.account);
      if (!accountExists) {
        return res.status(400).json({
          success: false,
          message: 'Account not found'
        });
      }
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('category', 'name color icon')
      .populate('account', 'name type');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;

    const matchStage: any = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate as string);
      if (endDate) matchStage.date.$lte = new Date(endDate as string);
    }

    const stats = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            type: '$type',
            year: { $year: '$date' },
            month: period === 'monthly' ? { $month: '$date' } : null,
            day: period === 'daily' ? { $dayOfMonth: '$date' } : null
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
