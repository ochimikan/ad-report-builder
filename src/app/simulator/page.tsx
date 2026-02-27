'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BudgetSimulator } from '@/components/simulator/budget/BudgetSimulator';
import { DesignPreview } from '@/components/simulator/design/DesignPreview';
import { ComparisonSimulator } from '@/components/simulator/comparison/ComparisonSimulator';
import { KeywordSimulator } from '@/components/simulator/keywords/KeywordSimulator';
import { DollarSign, Palette, BarChart3, Search } from 'lucide-react';

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="budget" className="gap-2 data-[state=active]:bg-sim-primary-600 data-[state=active]:text-white rounded-full px-5 py-2.5 border data-[state=active]:border-sim-primary-600 border-gray-200 data-[state=active]:shadow-md">
              <DollarSign className="h-4 w-4" />
              予算シミュレーション
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-2 data-[state=active]:bg-sim-primary-600 data-[state=active]:text-white rounded-full px-5 py-2.5 border data-[state=active]:border-sim-primary-600 border-gray-200 data-[state=active]:shadow-md">
              <Palette className="h-4 w-4" />
              デザインプレビュー
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2 data-[state=active]:bg-sim-primary-600 data-[state=active]:text-white rounded-full px-5 py-2.5 border data-[state=active]:border-sim-primary-600 border-gray-200 data-[state=active]:shadow-md">
              <BarChart3 className="h-4 w-4" />
              効果比較
            </TabsTrigger>
            <TabsTrigger value="keywords" className="gap-2 data-[state=active]:bg-sim-primary-600 data-[state=active]:text-white rounded-full px-5 py-2.5 border data-[state=active]:border-sim-primary-600 border-gray-200 data-[state=active]:shadow-md">
              <Search className="h-4 w-4" />
              キーワードツール
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budget"><BudgetSimulator /></TabsContent>
          <TabsContent value="design"><DesignPreview /></TabsContent>
          <TabsContent value="comparison"><ComparisonSimulator /></TabsContent>
          <TabsContent value="keywords"><KeywordSimulator /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
