import { Request, Response } from 'express';
import { Account } from '../models/Account';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { type, isActive } = req.query;
    
    const query: any = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const accounts = await Account.find(query)
      .sort({ name: 1 });

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accounts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, type, balance, currency, bankName, accountNumber } = req.body;

    const existingAccount = await Account.findOne({ name: name.trim() });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Account with this name already exists'
      });
    }

    const account = new Account({
      name: name.trim(),
      type,
      balance: balance || 0,
      currency: currency || 'USD',
      bankName,
      accountNumber
    });

    await account.save();

    res.status(201).json({
      success: true,
      data: account
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating account',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.name = updates.name.trim();
      
      const existingAccount = await Account.findOne({ 
        name: updates.name,
        _id: { $ne: id }
      });
      
      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: 'Account with this name already exists'
        });
      }
    }

    const account = await Account.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating account',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const account = await Account.findByIdAndDelete(id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
