import { DailyAggregate } from '@/types/data';
import { PeriodSummary } from '@/types/report';

export function aggregatePeriod(rows: DailyAggregate[]): PeriodSummary {
  const totalSpend = rows.reduce((s, r) => s + r.spend, 0);
  const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const totalConversions = rows.reduce((s, r) => s + r.conversions, 0);

  return {
    totalSpend,
    totalImpressions,
    totalClicks,
    totalConversions,
    avgCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    avgCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
    avgCvr: totalClicks > 0 ? totalConversions / totalClicks : 0,
    avgCpa: totalConversions > 0 ? totalSpend / totalConversions : null,
    avgCpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
  };
}
