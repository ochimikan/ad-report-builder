'use client';

import { useCallback, useMemo, useState } from 'react';
import { WizardAPI } from '@/hooks/useWizardState';
import { getDateRange, calculatePreviousPeriod, daysBetween } from '@/lib/utils/date-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, ArrowLeft, AlertCircle, Info } from 'lucide-react';

interface Props {
  wizard: WizardAPI;
}

export function Step3DateRange({ wizard }: Props) {
  const { state, setDateRange, setStep, setError } = wizard;
  const { rawData, mapping } = state;

  const dateColumn = mapping?.mapping.date;

  const dataDateRange = useMemo(() => {
    if (!dateColumn || rawData.length === 0) return null;
    const dates = rawData
      .map(r => r[dateColumn])
      .filter(Boolean)
      .map(d => {
        const cleaned = String(d).trim().replace(/年/g, '/').replace(/月/g, '/').replace(/日/g, '');
        const date = new Date(cleaned);
        if (isNaN(date.getTime())) return null;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
      })
      .filter((d): d is string => d !== null);

    if (dates.length === 0) return null;
    return getDateRange(dates);
  }, [rawData, dateColumn]);

  const [start, setStart] = useState(dataDateRange?.min ?? '');
  const [end, setEnd] = useState(dataDateRange?.max ?? '');

  const previousPeriod = useMemo(() => {
    if (!start || !end) return null;
    try {
      return calculatePreviousPeriod(start, end);
    } catch {
      return null;
    }
  }, [start, end]);

  const periodDays = useMemo(() => {
    if (!start || !end) return 0;
    try {
      return daysBetween(start, end);
    } catch {
      return 0;
    }
  }, [start, end]);

  const handleConfirm = useCallback(() => {
    if (!start || !end) {
      setError('開始日と終了日を入力してください。');
      return;
    }
    if (start > end) {
      setError('開始日は終了日より前にしてください。');
      return;
    }
    setError(null);
    setDateRange({ start, end });
    setStep(4);
  }, [start, end, setDateRange, setStep, setError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          期間選択
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {dataDateRange && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              データの日付範囲: {dataDateRange.min} 〜 {dataDateRange.max}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">開始日</label>
            <Input
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              min={dataDateRange?.min}
              max={dataDateRange?.max}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">終了日</label>
            <Input
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              min={dataDateRange?.min}
              max={dataDateRange?.max}
            />
          </div>
        </div>

        {start && end && start <= end && (
          <div className="rounded-lg bg-blue-50 p-4 space-y-2">
            <p className="text-sm font-medium text-blue-800">
              対象期間: {start} 〜 {end}（{periodDays}日間）
            </p>
            {previousPeriod && (
              <p className="text-sm text-blue-600">
                比較期間（自動計算）: {previousPeriod.start} 〜 {previousPeriod.end}（{periodDays}日間）
              </p>
            )}
          </div>
        )}

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(2)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <Button onClick={handleConfirm}>
            期間を確定して次へ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
