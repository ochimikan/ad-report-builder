'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BudgetResult } from '@/lib/simulator/types';
import { formatCurrency } from '@/lib/simulator/utils/formatters';

interface BudgetChartProps {
  result: BudgetResult;
  monthlyBudget: number;
}

export function BudgetChart({ result, monthlyBudget }: BudgetChartProps) {
  const data = [
    { name: '広告費', value: monthlyBudget, color: '#818cf8' },
    { name: '推定売上', value: result.estimatedRevenue, color: '#34d399' },
    { name: '損益', value: result.profitOrLoss, color: result.profitOrLoss >= 0 ? '#10b981' : '#ef4444' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">コスト vs 売上</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `¥${(v / 10000).toFixed(0)}万`} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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
