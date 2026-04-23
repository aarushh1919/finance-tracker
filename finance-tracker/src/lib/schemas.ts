import { z } from 'zod';

export const transactionSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters'),
  amount: z
    .number()
    .min(0.01, 'Amount must be at least 0.01')
    .max(10_000_000, 'Amount is too large'),
  type: z.enum(['income', 'expense']),
  category: z.enum([
    'food','transport','shopping','health',
    'utilities','entertainment','salary','freelance','other'
  ]),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(d => !isNaN(new Date(d).getTime()), 'Invalid date')
    .refine(d => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      return new Date(d) <= future;
    }, 'Date cannot be more than 1 year in the future'),
  note: z.string().max(200).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
