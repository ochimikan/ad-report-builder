export interface RawRow {
  [key: string]: string;
}

export interface NormalizedRow {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface DailyAggregate extends NormalizedRow {
  ctr: number;
  cpc: number;
  cvr: number;
  cpa: number | null;
  cpm: number;
}

export interface SegmentedNormalizedRow extends NormalizedRow {
  segments: Record<string, string>;
}

export interface SegmentedDailyAggregate extends DailyAggregate {
  segments: Record<string, string>;
}
