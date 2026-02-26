import { NormalizedRow, DailyAggregate, SegmentedNormalizedRow, SegmentedDailyAggregate } from '@/types/data';

export function calculateKpis(row: NormalizedRow): DailyAggregate {
  const { spend, impressions, clicks, conversions } = row;
  return {
    ...row,
    ctr: impressions > 0 ? clicks / impressions : 0,
    cpc: clicks > 0 ? spend / clicks : 0,
    cvr: clicks > 0 ? conversions / clicks : 0,
    cpa: conversions > 0 ? spend / conversions : null,
    cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
  };
}

export function calculateAllKpis(rows: NormalizedRow[]): DailyAggregate[] {
  return rows.map(calculateKpis);
}

/** 同一日付の行を合算して日次KPIを再計算する */
export function aggregateByDate(rows: DailyAggregate[]): DailyAggregate[] {
  const map = new Map<string, { spend: number; impressions: number; clicks: number; conversions: number }>();
  for (const r of rows) {
    const existing = map.get(r.date);
    if (existing) {
      existing.spend += r.spend;
      existing.impressions += r.impressions;
      existing.clicks += r.clicks;
      existing.conversions += r.conversions;
    } else {
      map.set(r.date, { spend: r.spend, impressions: r.impressions, clicks: r.clicks, conversions: r.conversions });
    }
  }
  const result: DailyAggregate[] = [];
  for (const [date, agg] of map.entries()) {
    result.push(calculateKpis({ date, ...agg }));
  }
  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

export function calculateAllKpisWithSegments(
  rows: SegmentedNormalizedRow[],
): SegmentedDailyAggregate[] {
  return rows.map(row => {
    const base = calculateKpis(row);
    return { ...base, segments: row.segments };
  });
}
