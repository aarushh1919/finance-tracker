import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getCat, fmt, formatDate } from '../../lib/utils';
import { useFilters } from '../../hooks/useFilters';
import type { Transaction } from '../../types';
import { CATEGORIES } from '../../lib/constants';
import { X } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

export function TransactionList({ transactions, onDelete }: Props) {
  const {
    filtered, filterType, filterCat,
    search, setFilterType, setFilterCat, setSearch
  } = useFilters(transactions);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap items-center">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs h-8 text-sm"
        />
        {(['all','income','expense'] as const).map(f => (
          <Badge
            key={f}
            variant={filterType === f ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilterType(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge
          variant={filterCat === 'all' ? 'default' : 'outline'}
          className="cursor-pointer text-xs"
          onClick={() => setFilterCat('all')}
        >All categories</Badge>
        {CATEGORIES.map(c => (
          <Badge
            key={c.id}
            variant={filterCat === c.id ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setFilterCat(c.id)}
          >
            {c.icon} {c.label}
          </Badge>
        ))}
      </div>

      <div className="divide-y divide-border rounded-lg border bg-card">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No transactions found</p>
        )}
        {filtered.map(t => {
          const cat = getCat(t.category);
          return (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: cat.bg }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.label} · {formatDate(t.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-sm font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </p>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(t.id)}
                >
                  <X size={13} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
