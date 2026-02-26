import { SegmentedDailyAggregate } from '@/types/data';
import { SegmentBreakdown, SegmentValueSummary } from '@/types/report';
import { comparePeriods } from './period-comparator';
import { generateCommentary } from '@/lib/insights/commentary-generator';
import { generateActions } from '@/lib/insights/action-recommender';

export function buildSegmentBreakdowns(
  allData: SegmentedDailyAggregate[],
  segmentColumns: string[],
  start: string,
  end: string,
): SegmentBreakdown[] {
  return segmentColumns.map(segmentColumn => {
    const valuesSet = new Set<string>();
    for (const row of allData) {
      const val = row.segments[segmentColumn];
      if (val) valuesSet.add(val);
    }
    const uniqueValues = Array.from(valuesSet).sort();

    const values: SegmentValueSummary[] = uniqueValues.map(segmentValue => {
      const filtered = allData.filter(r => r.segments[segmentColumn] === segmentValue);
      // Strip segments to get plain DailyAggregate[] for reuse with existing functions
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const asDaily = filtered.map(({ segments, ...rest }) => rest);

      const { comparison, currentData } = comparePeriods(asDaily, start, end);
      const commentary = generateCommentary(comparison);
      const actions = generateActions(comparison);

      return {
        segmentValue,
        comparison,
        dailyData: currentData,
        commentary,
        actions,
      };
    });

    return { segmentColumn, values };
  });
}
