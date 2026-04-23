import { Request, Response } from 'express';
import { Budget } from '../models/Budget';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction';

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const { category, isActive, period } = req.query;
    
    const query: any = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (period) query.period = period;

    const budgets = await Budget.find(query)
      .populate('category', 'name color icon type')
      .sort({ startDate: -1 });

    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching budgets',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createBudget = async (req: Request, res: Response) => {
  try {
    const { name, category, amount, period, startDate, endDate } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (categoryExists.type !== 'expense') {
      return res.status(400).json({
        success: false,
        message: 'Budgets can only be created for expense categories'
      });
    }

    const budget = new Budget({
      name,
      category,
      amount,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    await budget.save();
    await budget.populate('category', 'name color icon type');

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating budget',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
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

      if (categoryExists.type !== 'expense') {
        return res.status(400).json({
          success: false,
          message: 'Budgets can only be created for expense categories'
        });
      }
    }

    if (updates.startDate || updates.endDate) {
      const budget = await Budget.findById(id);
      if (!budget) {
        return res.status(404).json({
          success: false,
          message: 'Budget not found'
        });
      }

      const newStartDate = updates.startDate ? new Date(updates.startDate) : budget.startDate;
      const newEndDate = updates.endDate ? new Date(updates.endDate) : budget.endDate;

      if (newEndDate <= newStartDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('category', 'name color icon type');

    if (!updatedBudget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      data: updatedBudget
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating budget',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByIdAndDelete(id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting budget',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateBudgetSpending = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id).populate('category');
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    const spent = await Transaction.aggregate([
      {
        $match: {
          category: budget.category,
          type: 'expense',
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalSpent = spent.length > 0 ? spent[0].total : 0;

    budget.spent = totalSpent;
    await budget.save();

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating budget spending',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
