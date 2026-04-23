import type { CategoryMeta } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'food',          label: 'Food',          icon: '🍔', color: '#F5C4B3', bg: '#FAECE7' },
  { id: 'transport',     label: 'Transport',     icon: '🚗', color: '#B5D4F4', bg: '#E6F1FB' },
  { id: 'shopping',      label: 'Shopping',      icon: '🛍️', color: '#F4C0D1', bg: '#FBEAF0' },
  { id: 'health',        label: 'Health',        icon: '💊', color: '#C0DD97', bg: '#EAF3DE' },
  { id: 'utilities',     label: 'Utilities',     icon: '⚡', color: '#FAC775', bg: '#FAEEDA' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#CECBF6', bg: '#EEEDFE' },
  { id: 'salary',        label: 'Salary',        icon: '💰', color: '#9FE1CB', bg: '#E1F5EE' },
  { id: 'freelance',     label: 'Freelance',     icon: '💻', color: '#9FE1CB', bg: '#E1F5EE' },
  { id: 'other',         label: 'Other',         icon: '📦', color: '#D3D1C7', bg: '#F1EFE8' },
];

export const INCOME_CATEGORIES: CategoryMeta[] = CATEGORIES.filter(
  c => ['salary', 'freelance', 'other'].includes(c.id)
);

export const EXPENSE_CATEGORIES: CategoryMeta[] = CATEGORIES.filter(
  c => !['salary', 'freelance'].includes(c.id)
);

export const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];
