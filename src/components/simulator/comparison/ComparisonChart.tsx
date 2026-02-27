'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ComparisonResult } from '@/lib/simulator/types';
import { formatCurrency } from '@/lib/simulator/utils/formatters';

interface ComparisonChartProps {
  results: ComparisonResult[];
}

export function ComparisonChart({ results }: ComparisonChartProps) {
  if (results.length === 0) return null;

  const data = results.map((r) => ({
    name: r.platformName.split(' ')[0],
    売上: r.estimatedRevenue,
    color: r.color === '#000000' ? '#374151' : r.color,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">推定売上比較</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `¥${(v / 10000).toFixed(0)}万`} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Bar dataKey="売上" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
