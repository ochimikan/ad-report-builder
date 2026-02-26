import { DailyAggregate } from '@/types/data';
import { PeriodComparison } from '@/types/report';
import { aggregatePeriod } from './aggregator';
import { calculatePreviousPeriod } from '@/lib/utils/date-utils';

export function splitByPeriod(
  data: DailyAggregate[],
  start: string,
  end: string,
): { current: DailyAggregate[]; previous: DailyAggregate[]; previousRange: { start: string; end: string } } {
  const prevRange = calculatePreviousPeriod(start, end);

  const current = data.filter(r => r.date >= start && r.date <= end);
  const previous = data.filter(
    r => r.date >= prevRange.start && r.date <= prevRange.end,
  );

  return { current, previous, previousRange: prevRange };
}

function computeDelta(
  curr: number | null,
  prev: number | null,
): number | null {
  if (prev === null || prev === 0) return null;
  if (curr === null) return null;
  return (curr - prev) / prev;
}

export function comparePeriods(
  data: DailyAggregate[],
  start: string,
  end: string,
): { comparison: PeriodComparison; currentData: DailyAggregate[]; previousData: DailyAggregate[]; previousRange: { start: string; end: string } } {
  const { current, previous, previousRange } = splitByPeriod(data, start, end);
  const currentSummary = aggregatePeriod(current);
  const previousSummary = aggregatePeriod(previous);

  const deltas: Record<string, number | null> = {
    spend: computeDelta(currentSummary.totalSpend, previousSummary.totalSpend),
    impressions: computeDelta(
      currentSummary.totalImpressions,
      previousSummary.totalImpressions,
    ),
    clicks: computeDelta(currentSummary.totalClicks, previousSummary.totalClicks),
    conversions: computeDelta(
      currentSummary.totalConversions,
      previousSummary.totalConversions,
    ),
    ctr: computeDelta(currentSummary.avgCtr, previousSummary.avgCtr),
    cpc: computeDelta(currentSummary.avgCpc, previousSummary.avgCpc),
    cvr: computeDelta(currentSummary.avgCvr, previousSummary.avgCvr),
    cpa: computeDelta(currentSummary.avgCpa, previousSummary.avgCpa),
    cpm: computeDelta(currentSummary.avgCpm, previousSummary.avgCpm),
  };

  return {
    comparison: { current: currentSummary, previous: previousSummary, deltas },
    currentData: current,
    previousData: previous,
    previousRange,
  };
}
