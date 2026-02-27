'use client';

import type { ComparisonResult } from '@/lib/simulator/types';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/simulator/utils/formatters';

interface ComparisonTableProps {
  results: ComparisonResult[];
}

export function ComparisonTable({ results }: ComparisonTableProps) {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">プラットフォーム比較</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-gray-500 font-medium">指標</th>
              {results.map((r) => (
                <th key={r.platform} className="text-right py-3 px-2 font-medium" style={{ color: r.color === '#000000' ? '#374151' : r.color }}>
                  <div className="flex items-center justify-end gap-1.5">
                    {r.recommended && (
                      <span className="text-[10px] bg-sim-accent-100 text-sim-accent-700 px-1.5 py-0.5 rounded-full font-bold">推奨</span>
                    )}
                    {r.platformName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-50">
              <td className="py-2.5 px-2 text-gray-500">CPC</td>
              {results.map((r) => <td key={r.platform} className="text-right py-2.5 px-2">{formatCurrency(r.cpc)}</td>)}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 px-2 text-gray-500">CVR</td>
              {results.map((r) => <td key={r.platform} className="text-right py-2.5 px-2">{formatPercent(r.cvr)}</td>)}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 px-2 text-gray-500">クリック数</td>
              {results.map((r) => <td key={r.platform} className="text-right py-2.5 px-2">{formatNumber(r.estimatedClicks)}</td>)}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 px-2 text-gray-500">CV数</td>
              {results.map((r) => <td key={r.platform} className="text-right py-2.5 px-2">{formatNumber(r.estimatedConversions, 1)}</td>)}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 px-2 text-gray-500">推定売上</td>
              {results.map((r) => <td key={r.platform} className="text-right py-2.5 px-2 font-medium">{formatCurrency(r.estimatedRevenue)}</td>)}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 px-2 text-gray-500">ROAS</td>
              {results.map((r) => (
                <td key={r.platform} className={`text-right py-2.5 px-2 font-bold ${r.roas >= 100 ? 'text-sim-accent-600' : 'text-red-500'}`}>
                  {r.roas}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 px-2 text-gray-500">CPA</td>
              {results.map((r) => <td key={r.platform} className="text-right py-2.5 px-2">{r.cpa > 0 ? formatCurrency(r.cpa) : '-'}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
