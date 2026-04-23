import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CategoryMeta } from '../types';
import { CATEGORIES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function getCat(id: string): CategoryMeta {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[8];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}
