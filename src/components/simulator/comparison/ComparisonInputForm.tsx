'use client';

import type { Industry, AdGoal } from '@/lib/simulator/types';
import { industryLabels, goalLabels } from '@/lib/simulator/data/platformBenchmarks';
import { SliderInput } from '@/components/simulator/shared/SliderInput';
import { SimSelectInput } from '@/components/simulator/shared/SimSelectInput';
import { SimNumberInput } from '@/components/simulator/shared/SimNumberInput';

interface ComparisonInputFormProps {
  monthlyBudget: number;
  setMonthlyBudget: (v: number) => void;
  industry: Industry;
  setIndustry: (v: Industry) => void;
  goal: AdGoal;
  setGoal: (v: AdGoal) => void;
  averageOrderValue: number;
  setAverageOrderValue: (v: number) => void;
}

export function ComparisonInputForm({
  monthlyBudget, setMonthlyBudget,
  industry, setIndustry,
  goal, setGoal,
  averageOrderValue, setAverageOrderValue,
}: ComparisonInputFormProps) {
  const industryOptions = Object.entries(industryLabels).map(([value, label]) => ({ value, label }));
  const goalOptions = Object.entries(goalLabels).map(([value, label]) => ({ value, label }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">比較条件</h3>
        <p className="text-sm text-gray-500 mt-0.5">予算と業種を設定して5つのプラットフォームを比較</p>
      </div>

      <SliderInput
        label="月額広告予算"
        value={monthlyBudget}
        onChange={setMonthlyBudget}
        min={50000}
        max={10000000}
        step={50000}
        prefix="¥"
      />

      <div className="grid grid-cols-2 gap-4">
        <SimSelectInput
          label="業種"
          value={industry}
          onChange={(v) => setIndustry(v as Industry)}
          options={industryOptions}
        />
        <SimSelectInput
          label="広告目的"
          value={goal}
          onChange={(v) => setGoal(v as AdGoal)}
          options={goalOptions}
        />
      </div>

      <SimNumberInput
        label="平均注文単価"
        value={averageOrderValue}
        onChange={setAverageOrderValue}
        min={0}
        suffix="円"
      />
    </div>
  );
}
