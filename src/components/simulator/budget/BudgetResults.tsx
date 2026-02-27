'use client';

import type { BudgetResult } from '@/lib/simulator/types';
import { formatCurrency, formatNumber } from '@/lib/simulator/utils/formatters';
import { SimResultCard } from '@/components/simulator/shared/SimResultCard';

interface BudgetResultsProps {
  result: BudgetResult;
  monthlyBudget: number;
}

export function BudgetResults({ result, monthlyBudget }: BudgetResultsProps) {
  const isProfitable = result.profitOrLoss >= 0;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">シミュレーション結果</h3>
        <div className="grid grid-cols-2 gap-3">
          <SimResultCard
            label="推定クリック数"
            value={`${formatNumber(result.estimatedClicks)} クリック`}
            sublabel={`月額 ${formatCurrency(monthlyBudget)} の場合`}
          />
          <SimResultCard
            label="推定CV数"
            value={`${formatNumber(result.estimatedConversions, 1)} 件`}
            sublabel="コンバージョン数"
          />
          <SimResultCard
            label="推定売上"
            value={formatCurrency(result.estimatedRevenue)}
            positive={result.estimatedRevenue > 0}
          />
          <SimResultCard
            label="ROAS"
            value={`${result.roas}%`}
            sublabel="広告費用対効果"
            positive={result.roas >= 100}
            negative={result.roas < 100}
          />
          <SimResultCard
            label="CPA (獲得単価)"
            value={result.cpa > 0 ? formatCurrency(result.cpa) : '-'}
            sublabel="1件あたりの獲得コスト"
          />
          <SimResultCard
            label="損益"
            value={formatCurrency(result.profitOrLoss)}
            positive={isProfitable}
            negative={!isProfitable}
            large
          />
        </div>
      </div>
    </div>
  );
}
