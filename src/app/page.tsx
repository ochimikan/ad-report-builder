'use client';

import { useWizardState } from '@/hooks/useWizardState';
import { StepIndicator } from '@/components/steps/StepIndicator';
import { Step1FileUpload } from '@/components/steps/Step1FileUpload';
import { Step2ColumnMapping } from '@/components/steps/Step2ColumnMapping';
import { Step3DateRange } from '@/components/steps/Step3DateRange';
import { Step4Generate } from '@/components/steps/Step4Generate';
import { Step5Preview } from '@/components/steps/Step5Preview';
import { BarChart3 } from 'lucide-react';

export default function Home() {
  const wizard = useWizardState();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              AdReport Auto Builder
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            広告データをアップロードして、レポートを自動生成
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={wizard.state.step} />
        </div>

        {/* Step content */}
        <div className="mb-8">
          {wizard.state.step === 1 && <Step1FileUpload wizard={wizard} />}
          {wizard.state.step === 2 && <Step2ColumnMapping wizard={wizard} />}
          {wizard.state.step === 3 && <Step3DateRange wizard={wizard} />}
          {wizard.state.step === 4 && <Step4Generate wizard={wizard} />}
          {wizard.state.step === 5 && <Step5Preview wizard={wizard} />}
        </div>
      </div>
    </main>
  );
}
