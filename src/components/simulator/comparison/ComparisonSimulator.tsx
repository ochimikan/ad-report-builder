'use client';

import { useState, useMemo } from 'react';
import type { Industry, AdGoal } from '@/lib/simulator/types';
import { defaultComparisonInput } from '@/lib/simulator/data/platformBenchmarks';
import { calculateComparison } from '@/lib/simulator/utils/calculations';
import { ComparisonInputForm } from './ComparisonInputForm';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonChart } from './ComparisonChart';
import { RecommendationCard } from './RecommendationCard';

export function ComparisonSimulator() {
  const [monthlyBudget, setMonthlyBudget] = useState(defaultComparisonInput.monthlyBudget);
  const [industry, setIndustry] = useState<Industry>('ecommerce');
  const [goal, setGoal] = useState<AdGoal>('conversions');
  const [averageOrderValue, setAverageOrderValue] = useState(defaultComparisonInput.averageOrderValue);

  const results = useMemo(
    () => calculateComparison({ monthlyBudget, industry, goal, averageOrderValue }),
    [monthlyBudget, industry, goal, averageOrderValue]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">広告効果比較シミュレーション</h2>
        <p className="text-sm text-gray-500 mt-1">同じ予算で5つのプラットフォームの成果を比較します</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ComparisonInputForm
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            industry={industry}
            setIndustry={setIndustry}
            goal={goal}
            setGoal={setGoal}
            averageOrderValue={averageOrderValue}
            setAverageOrderValue={setAverageOrderValue}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <RecommendationCard results={results} />
          <ComparisonTable results={results} />
          <ComparisonChart results={results} />
        </div>
      </div>
    </div>
  );
}
