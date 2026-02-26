import { DailyAggregate } from './data';

export interface PeriodSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCtr: number;
  avgCpc: number;
  avgCvr: number;
  avgCpa: number | null;
  avgCpm: number;
}

export interface PeriodComparison {
  current: PeriodSummary;
  previous: PeriodSummary;
  deltas: Record<string, number | null>;
}

export interface SegmentValueSummary {
  segmentValue: string;
  comparison: PeriodComparison;
  dailyData: DailyAggregate[];
  commentary: string;
  actions: string[];
}

export interface SegmentBreakdown {
  segmentColumn: string;
  values: SegmentValueSummary[];
}

export interface ReportData {
  comparison: PeriodComparison;
  dailyData: DailyAggregate[];
  previousDailyData: DailyAggregate[];
  commentary: string;
  actions: string[];
  dateRange: { start: string; end: string };
  previousRange: { start: string; end: string };
  segmentBreakdowns: SegmentBreakdown[];
}
