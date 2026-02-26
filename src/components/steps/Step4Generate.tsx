'use client';

import { useCallback, useState } from 'react';
import { WizardAPI } from '@/hooks/useWizardState';
import { CanonicalColumn } from '@/types/mapping';
import { SegmentBreakdown } from '@/types/report';
import { normalizeDataset, normalizeDatasetWithSegments } from '@/lib/processing/normalizer';
import { calculateAllKpis, calculateAllKpisWithSegments, aggregateByDate } from '@/lib/processing/kpi-calculator';
import { comparePeriods } from '@/lib/processing/period-comparator';
import { buildSegmentBreakdowns } from '@/lib/processing/segment-aggregator';
import { generateCommentary } from '@/lib/insights/commentary-generator';
import { generateActions } from '@/lib/insights/action-recommender';
import { validateData } from '@/lib/utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cog, ArrowLeft, AlertCircle, AlertTriangle } from 'lucide-react';

interface Props {
  wizard: WizardAPI;
}

const PIPELINE_STEPS_BASE = [
  'データの正規化中...',
  'KPI計算中...',
  '前期比較中...',
  '所見生成中...',
];

const PIPELINE_STEP_SEGMENT = 'セグメント分析中...';
const PIPELINE_STEP_DONE = '完了';

export function Step4Generate({ wizard }: Props) {
  const { state, setReport, setStep, setError, setWarning, setProcessing } = wizard;
  const [pipelineStep, setPipelineStep] = useState(-1);

  const handleGenerate = useCallback(async () => {
    const { rawData, mapping, dateRange } = state;
    if (!mapping || !dateRange) return;

    // Verify all columns are mapped
    const fullMapping = mapping.mapping as Record<CanonicalColumn, string>;
    for (const key of Object.keys(fullMapping) as CanonicalColumn[]) {
      if (!fullMapping[key]) {
        setError(`列「${key}」がマッピングされていません。`);
        return;
      }
    }

    const segmentColumns = mapping.segmentColumns ?? [];
    const hasSegments = segmentColumns.length > 0;

    setProcessing(true);
    setError(null);
    setWarning(null);

    try {
      // Step 1: Normalize
      setPipelineStep(0);
      await new Promise(r => setTimeout(r, 50));
      const normalized = normalizeDataset(rawData, fullMapping);

      // Validate data
      const validation = validateData(normalized);
      if (!validation.valid) {
        setError(validation.errors.join('\n'));
        setProcessing(false);
        return;
      }
      if (validation.warnings.length > 0) {
        setWarning(validation.warnings.join('\n'));
      }

      // Step 2: Calculate KPIs
      setPipelineStep(1);
      await new Promise(r => setTimeout(r, 50));
      const dailyDataRaw = calculateAllKpis(normalized);
      // 同一日付の行を合算（セグメント列がある場合に複数行/日になるため）
      const dailyData = aggregateByDate(dailyDataRaw);

      // Step 3: Period comparison (overall)
      setPipelineStep(2);
      await new Promise(r => setTimeout(r, 50));
      const { comparison, currentData, previousRange } = comparePeriods(
        dailyData,
        dateRange.start,
        dateRange.end,
      );

      // Step 4: Segment breakdowns (if applicable) — insights参照のため先に実行
      let segmentBreakdowns: SegmentBreakdown[] = [];
      if (hasSegments) {
        setPipelineStep(3);
        await new Promise(r => setTimeout(r, 50));
        const segmentedNormalized = normalizeDatasetWithSegments(rawData, fullMapping, segmentColumns);
        const segmentedDaily = calculateAllKpisWithSegments(segmentedNormalized);
        segmentBreakdowns = buildSegmentBreakdowns(
          segmentedDaily,
          segmentColumns,
          dateRange.start,
          dateRange.end,
        );
      }

      // Step 5: Generate insights (overall) — セグメントデータも参照して具体的アクション生成
      setPipelineStep(hasSegments ? 4 : 3);
      await new Promise(r => setTimeout(r, 50));
      const commentary = generateCommentary(comparison);
      const actions = generateActions(comparison, segmentBreakdowns);

      // Done
      setPipelineStep(hasSegments ? 5 : 4);

      setReport({
        comparison,
        dailyData: currentData,
        previousDailyData: [],
        commentary,
        actions,
        dateRange,
        previousRange,
        segmentBreakdowns,
      });

      setStep(5);
    } catch (e) {
      setError(`レポート生成に失敗しました: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  }, [state, setReport, setStep, setError, setWarning, setProcessing]);

  const segmentColumns = state.mapping?.segmentColumns ?? [];
  const hasSegments = segmentColumns.length > 0;
  const pipelineSteps = [
    ...PIPELINE_STEPS_BASE,
    ...(hasSegments ? [PIPELINE_STEP_SEGMENT] : []),
    PIPELINE_STEP_DONE,
  ];
  const progressPercent = pipelineStep >= 0
    ? Math.round(((pipelineStep + 1) / pipelineSteps.length) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="h-5 w-5" />
          レポート生成
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-6 space-y-3">
          <h3 className="font-medium">生成内容の確認</h3>
          <div className="grid gap-2 text-sm text-gray-600">
            <p>ファイル: {state.file?.name}</p>
            <p>データ行数: {state.rawData.length.toLocaleString()} 行</p>
            <p>対象期間: {state.dateRange?.start} 〜 {state.dateRange?.end}</p>
            {segmentColumns.length > 0 && (
              <p>セグメント列: {segmentColumns.join(', ')}</p>
            )}
          </div>
        </div>

        {state.isProcessing && (
          <div className="space-y-3">
            <Progress value={progressPercent} className="h-3" />
            <p className="text-sm text-center text-gray-600">
              {pipelineStep >= 0 && pipelineStep < pipelineSteps.length
                ? pipelineSteps[pipelineStep]
                : '準備中...'}
            </p>
          </div>
        )}

        {state.warning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{state.warning}</AlertDescription>
          </Alert>
        )}

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(3)} disabled={state.isProcessing}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={state.isProcessing}
            className="px-8"
          >
            {state.isProcessing ? '生成中...' : 'レポートを生成する'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
