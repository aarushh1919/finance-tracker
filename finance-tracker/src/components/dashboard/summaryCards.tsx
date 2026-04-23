import { Card, CardContent } from '../ui/card';
import { fmt } from '../../lib/utils';

interface Props {
  income: number;
  expense: number;
  balance: number;
}

export function SummaryCards({ income, expense, balance }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card>
        <CardContent className="pt-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Income</p>
          <p className="text-2xl font-light text-emerald-600">{fmt(income)}</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Expenses</p>
          <p className="text-2xl font-light text-orange-600">{fmt(expense)}</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Net Balance</p>
          <p className={`text-2xl font-light ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {fmt(balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{balance >= 0 ? 'Saving well' : 'Overspent'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
