import mongoose from 'mongoose';
import { Category } from './models/Category';
import { Account } from './models/Account';

const defaultCategories = [
  { name: 'Food', type: 'expense', color: '#EF4444', icon: '🍔' },
  { name: 'Transport', type: 'expense', color: '#3B82F6', icon: '🚌' },
  { name: 'Shopping', type: 'expense', color: '#8B5CF6', icon: '🛍️' },
  { name: 'Health', type: 'expense', color: '#10B981', icon: '🏥' },
  { name: 'Utilities', type: 'expense', color: '#F59E0B', icon: '💡' },
  { name: 'Entertainment', type: 'expense', color: '#EC4899', icon: '🎬' },
  { name: 'Other', type: 'expense', color: '#6B7280', icon: '📦' },
  { name: 'Salary', type: 'income', color: '#22C55E', icon: '💰' },
  { name: 'Freelance', type: 'income', color: '#14B8A6', icon: '💵' },
];

const defaultAccounts = [
  { name: 'Cash', type: 'cash', balance: 0, currency: 'INR' },
  { name: 'Bank Account', type: 'checking', balance: 0, currency: 'INR' },
  { name: 'Savings', type: 'savings', balance: 0, currency: 'INR' },
];

export async function seedDatabase() {
  try {
    // Seed categories
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      }
    }

    // Seed accounts
    for (const acc of defaultAccounts) {
      const exists = await Account.findOne({ name: acc.name });
      if (!exists) {
        await Account.create(acc);
        console.log(`Created account: ${acc.name}`);
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
