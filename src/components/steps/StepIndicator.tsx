'use client';

import { WizardStep } from '@/types/wizard';
import { Check } from 'lucide-react';

const STEPS: { step: WizardStep; label: string }[] = [
  { step: 1, label: 'ファイルアップロード' },
  { step: 2, label: 'カラムマッピング' },
  { step: 3, label: '期間選択' },
  { step: 4, label: 'レポート生成' },
  { step: 5, label: 'プレビュー・DL' },
];

interface Props {
  currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map(({ step, label }, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold
                  transition-colors duration-200
                  ${isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step}
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}
                `}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-12 sm:w-16 transition-colors duration-200
                  ${step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
