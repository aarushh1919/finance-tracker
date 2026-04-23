import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { MonthlyData, CategoryBreakdown } from '../../types';
import { getCat, fmt } from '../../lib/utils';

interface Props {
  monthly: MonthlyData[];
  breakdown: CategoryBreakdown[];
}

export function SpendingChart({ monthly, breakdown }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthly} barGap={4}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => '₹' + (v/1000) + 'k'} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="income"  fill="#9FE1CB" radius={[3,3,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#F5C4B3" radius={[3,3,0,0]} name="Expense" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={breakdown.slice(0, 5)}
                dataKey="amt"
                nameKey="cat"
                cx="50%" cy="50%"
                outerRadius={65}
                label={({ cat, pct }) => `${getCat(cat).icon} ${pct}%`}
                labelLine={false}
              >
                {breakdown.slice(0, 5).map((entry, i) => (
                  <Cell key={i} fill={getCat(entry.cat).color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
