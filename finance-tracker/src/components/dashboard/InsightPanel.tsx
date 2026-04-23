import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Insight } from '../../types';

const styles: Record<Insight['type'], string> = {
  warn: 'bg-amber-50 border-l-4 border-amber-400 text-amber-800',
  good: 'bg-emerald-50 border-l-4 border-emerald-400 text-emerald-800',
  info: 'bg-blue-50 border-l-4 border-blue-400 text-blue-800',
};

export function InsightPanel({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((ins, i) => (
          <div key={i} className={`rounded-md p-3 text-xs leading-relaxed ${styles[ins.type]}`}>
            {ins.text}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
