'use client';

import { SegmentBreakdown } from '@/types/report';
import { DailyAggregate } from '@/types/data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SEGMENT_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#f59e0b',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

interface ChartConfig {
  id: string;
  title: string;
  kpiKey: string;
  extractor: (d: DailyAggregate) => number;
  formatter: (v: number | undefined) => string;
}

const CHARTS: ChartConfig[] = [
  {
    id: 'spend',
    title: '広告費',
    kpiKey: 'spend',
    extractor: d => d.spend,
    formatter: v => v !== undefined ? `¥${v.toLocaleString()}` : '',
  },
  {
    id: 'cv',
    title: 'CV数',
    kpiKey: 'conversions',
    extractor: d => d.conversions,
    formatter: v => v !== undefined ? `${v}` : '',
  },
  {
    id: 'cpa',
    title: 'CPA',
    kpiKey: 'cpa',
    extractor: d => d.cpa ?? 0,
    formatter: v => v !== undefined ? `¥${v.toLocaleString()}` : '',
  },
  {
    id: 'cpc',
    title: 'CPC',
    kpiKey: 'cpc',
    extractor: d => d.cpc,
    formatter: v => v !== undefined ? `¥${v.toLocaleString()}` : '',
  },
  {
    id: 'ctr',
    title: 'CTR',
    kpiKey: 'ctr',
    extractor: d => d.ctr,
    formatter: v => v !== undefined ? `${(v * 100).toFixed(2)}%` : '',
  },
  {
    id: 'cvr',
    title: 'CVR',
    kpiKey: 'cvr',
    extractor: d => d.cvr,
    formatter: v => v !== undefined ? `${(v * 100).toFixed(2)}%` : '',
  },
];

interface Props {
  breakdown: SegmentBreakdown;
}

export function ReportSegmentCharts({ breakdown }: Props) {
  const { segmentColumn, values } = breakdown;

  return (
    <div className="space-y-6">
      {CHARTS.map(chart => {
        // Pivot data: collect all dates, then for each date create { date, segVal1: value, segVal2: value, ... }
        const dateMap = new Map<string, { sortKey: string; display: string; vals: Record<string, number> }>();
        for (const sv of values) {
          for (const d of sv.dailyData) {
            const display = d.date.slice(5); // MM-DD
            if (!dateMap.has(display)) {
              dateMap.set(display, { sortKey: d.date, display, vals: {} });
            }
            dateMap.get(display)!.vals[sv.segmentValue] = chart.extractor(d);
          }
        }
        const chartData = Array.from(dateMap.values())
          .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
          .map(({ display, vals }) => ({ date: display, ...vals }));

        return (
          <div
            key={chart.id}
            id={`segment-chart-${segmentColumn}-${chart.id}`}
            style={{ backgroundColor: '#ffffff' }}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              セグメント別 {chart.title}
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={chart.formatter} />
                <Legend />
                {values.map((sv, i) => (
                  <Line
                    key={sv.segmentValue}
                    type="monotone"
                    dataKey={sv.segmentValue}
                    stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={sv.segmentValue}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
