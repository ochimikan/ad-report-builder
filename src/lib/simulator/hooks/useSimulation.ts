'use client';

import { useState, useMemo } from 'react';
import type { BudgetInput, AdPlatform } from '@/lib/simulator/types';
import { calculateBudget } from '@/lib/simulator/utils/calculations';
import { defaultBudgetInput, platformBenchmarks } from '@/lib/simulator/data/platformBenchmarks';

export function useBudgetSimulation() {
  const [monthlyBudget, setMonthlyBudget] = useState(defaultBudgetInput.monthlyBudget);
  const [cpc, setCpc] = useState(defaultBudgetInput.cpc);
  const [cvr, setCvr] = useState(defaultBudgetInput.cvr);
  const [averageOrderValue, setAverageOrderValue] = useState(defaultBudgetInput.averageOrderValue);
  const [platform, setPlatform] = useState<AdPlatform>('google');

  const applyPlatformPreset = (p: AdPlatform) => {
    setPlatform(p);
    const benchmark = platformBenchmarks.find(b => b.platform === p);
    if (benchmark) {
      setCpc(benchmark.averageCpc);
      setCvr(benchmark.averageCvr);
    }
  };

  const input: BudgetInput = { monthlyBudget, cpc, cvr, averageOrderValue, platform };
  const result = useMemo(() => calculateBudget(input), [monthlyBudget, cpc, cvr, averageOrderValue, platform]);

  return {
    monthlyBudget, setMonthlyBudget,
    cpc, setCpc,
    cvr, setCvr,
    averageOrderValue, setAverageOrderValue,
    platform, applyPlatformPreset,
    result,
  };
}
