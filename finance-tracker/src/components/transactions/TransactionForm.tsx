import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionFormData } from '../../lib/schemas';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../lib/constants';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  loading?: boolean;
}

const AUTO_CATEGORIES: Record<string, string> = {
  'uber': 'transport',
  'lyft': 'transport',
  'subway': 'transport',
  'metro': 'transport',
  'bus': 'transport',
  'mcdonalds': 'food',
  'kfc': 'food',
  'burger': 'food',
  'pizza': 'food',
  'grocery': 'food',
  'walmart': 'shopping',
  'amazon': 'shopping',
  'target': 'shopping',
  'netflix': 'entertainment',
  'hulu': 'entertainment',
  'spotify': 'entertainment',
  'movies': 'entertainment',
  'doctor': 'health',
  'pharmacy': 'health',
  'gym': 'health',
  'electric': 'utilities',
  'water': 'utilities',
  'internet': 'utilities',
  'salary': 'salary',
  'freelance': 'freelance',
  'upwork': 'freelance',
  'fiverr': 'freelance',
};

export function TransactionForm({ open, onClose, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const type = watch('type');
  const name = watch('name') || '';
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (!name) return;
    const lower = name.toLowerCase();
    for (const [key, cat] of Object.entries(AUTO_CATEGORIES)) {
      if (lower.includes(key)) {
        const isIncomeCat = INCOME_CATEGORIES.some(c => c.id === cat);
        const isExpenseCat = EXPENSE_CATEGORIES.some(c => c.id === cat);
        if (isIncomeCat) setValue('type', 'income');
        else if (isExpenseCat) setValue('type', 'expense');
        setValue('category', cat as any);
        break;
      }
    }
  }, [name, setValue]);

  const handleClose = () => { reset(); onClose(); };

  const onValid = (data: TransactionFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2" style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}>

          <div className="space-y-1">
            <Label htmlFor="name">Transaction Name</Label>
            <Input id="name" placeholder="e.g. Grocery Shopping" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount" type="number" placeholder="0"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={v => {
                  setValue('type', v as 'income' | 'expense');
                  setValue('category', v === 'income' ? 'salary' : 'food');
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={watch('category')}
              onValueChange={v => setValue('category', v as any)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" placeholder="Optional note" {...register('note')} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
