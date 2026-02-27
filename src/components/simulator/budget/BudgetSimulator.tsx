'use client';

import { useBudgetSimulation } from '@/lib/simulator/hooks/useSimulation';
import { BudgetInputForm } from './BudgetInputForm';
import { BudgetResults } from './BudgetResults';
import { BudgetChart } from './BudgetChart';

export function BudgetSimulator() {
  const sim = useBudgetSimulation();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">広告予算シミュレーション</h2>
        <p className="text-sm text-gray-500 mt-1">月額予算とパラメータから広告の成果を予測します</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetInputForm
          monthlyBudget={sim.monthlyBudget}
          setMonthlyBudget={sim.setMonthlyBudget}
          cpc={sim.cpc}
          setCpc={sim.setCpc}
          cvr={sim.cvr}
          setCvr={sim.setCvr}
          averageOrderValue={sim.averageOrderValue}
          setAverageOrderValue={sim.setAverageOrderValue}
          platform={sim.platform}
          applyPlatformPreset={sim.applyPlatformPreset}
        />
        <div className="space-y-6">
          <BudgetResults result={sim.result} monthlyBudget={sim.monthlyBudget} />
          <BudgetChart result={sim.result} monthlyBudget={sim.monthlyBudget} />
        </div>
      </div>
    </div>
  );
}
