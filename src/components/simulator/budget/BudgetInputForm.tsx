'use client';

import type { AdPlatform } from '@/lib/simulator/types';
import { SliderInput } from '@/components/simulator/shared/SliderInput';
import { SimNumberInput } from '@/components/simulator/shared/SimNumberInput';
import { SimPlatformSelector } from '@/components/simulator/shared/SimPlatformSelector';

interface BudgetInputFormProps {
  monthlyBudget: number;
  setMonthlyBudget: (v: number) => void;
  cpc: number;
  setCpc: (v: number) => void;
  cvr: number;
  setCvr: (v: number) => void;
  averageOrderValue: number;
  setAverageOrderValue: (v: number) => void;
  platform: AdPlatform;
  applyPlatformPreset: (p: AdPlatform) => void;
}

export function BudgetInputForm({
  monthlyBudget, setMonthlyBudget,
  cpc, setCpc,
  cvr, setCvr,
  averageOrderValue, setAverageOrderValue,
  platform, applyPlatformPreset,
}: BudgetInputFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">入力パラメータ</h3>
        <p className="text-sm text-gray-500 mt-0.5">各項目を調整して予測結果を確認できます</p>
      </div>

      <SimPlatformSelector selected={platform} onChange={applyPlatformPreset} />

      <SliderInput
        label="月額広告予算"
        value={monthlyBudget}
        onChange={setMonthlyBudget}
        min={10000}
        max={5000000}
        step={10000}
        prefix="¥"
      />

      <div className="grid grid-cols-2 gap-4">
        <SimNumberInput
          label="クリック単価 (CPC)"
          value={cpc}
          onChange={setCpc}
          min={1}
          suffix="円"
        />
        <SimNumberInput
          label="コンバージョン率 (CVR)"
          value={cvr}
          onChange={setCvr}
          min={0}
          max={100}
          step={0.1}
          suffix="%"
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
