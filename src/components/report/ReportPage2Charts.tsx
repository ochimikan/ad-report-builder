'use client';

import { DailyAggregate } from '@/types/data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  dailyData: DailyAggregate[];
}

/** 各チャートのトレンド所感を生成 */
function generateChartInsight(
  values: number[],
  dates: string[],
  kpi: string,
  formatter: (v: number) => string,
): string {
  if (values.length === 0) return '';
  const nonZero = values.filter(v => v > 0);
  if (nonZero.length === 0) return `対象期間に${kpi}のデータはありません。`;

  const min = Math.min(...nonZero);
  const max = Math.max(...nonZero);
  const avg = nonZero.reduce((s, v) => s + v, 0) / nonZero.length;
  const maxIdx = values.indexOf(max);
  const minIdx = values.indexOf(min);

  // トレンド判定（前半 vs 後半の平均比較）
  const mid = Math.floor(nonZero.length / 2);
  const firstHalf = nonZero.slice(0, mid);
  const secondHalf = nonZero.slice(mid);
  const avgFirst = firstHalf.reduce((s, v) => s + v, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((s, v) => s + v, 0) / secondHalf.length;
  const trendPct = avgFirst > 0 ? (avgSecond - avgFirst) / avgFirst : 0;

  let trend = '安定的に推移';
  if (trendPct > 0.05) trend = '期間後半にかけて上昇傾向';
  else if (trendPct < -0.05) trend = '期間後半にかけて低下傾向';

  const parts: string[] = [];
  parts.push(`${formatter(min)}〜${formatter(max)}の範囲で推移（平均${formatter(avg)}）。`);
  if (maxIdx !== minIdx) {
    parts.push(`最高値は${dates[maxIdx]}の${formatter(max)}、最低値は${dates[minIdx]}の${formatter(min)}。`);
  }
  parts.push(`${trend}しています。`);

  return parts.join('');
}

interface ChartConfig {
  id: string;
  title: string;
  dataKey: string;
  color: string;
  formatter: (v: number) => string;
}

const CHARTS: ChartConfig[] = [
  {
    id: 'chart-spend',
    title: '日別 広告費',
    dataKey: 'spend',
    color: '#2563eb',
    formatter: (v: number) => `¥${v.toLocaleString()}`,
  },
  {
    id: 'chart-cv',
    title: '日別 CV数',
    dataKey: 'conversions',
    color: '#16a34a',
    formatter: (v: number) => `${v}`,
  },
  {
    id: 'chart-cpa',
    title: '日別 CPA',
    dataKey: 'cpaDisplay',
    color: '#dc2626',
    formatter: (v: number) => `¥${v.toLocaleString()}`,
  },
  {
    id: 'chart-cpc',
    title: '日別 CPC',
    dataKey: 'cpc',
    color: '#9333ea',
    formatter: (v: number) => `¥${v.toLocaleString()}`,
  },
  {
    id: 'chart-ctr',
    title: '日別 CTR',
    dataKey: 'ctr',
    color: '#f59e0b',
    formatter: (v: number) => `${(v * 100).toFixed(2)}%`,
  },
  {
    id: 'chart-cvr',
    title: '日別 CVR',
    dataKey: 'cvr',
    color: '#06b6d4',
    formatter: (v: number) => `${(v * 100).toFixed(2)}%`,
  },
];

export function ReportPage2Charts({ dailyData }: Props) {
  const sorted = dailyData.slice().sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sorted.map(d => ({
    date: d.date.slice(5), // MM-DD
    spend: d.spend,
    conversions: d.conversions,
    cpaDisplay: d.cpa ?? 0,
    cpc: d.cpc,
    ctr: d.ctr,
    cvr: d.cvr,
  }));
  const dates = chartData.map(d => d.date);

  // 各チャートの所感を事前生成
  const insightMap: Record<string, string> = {
    spend: generateChartInsight(sorted.map(d => d.spend), dates, '広告費', v => `¥${Math.round(v).toLocaleString()}`),
    conversions: generateChartInsight(sorted.map(d => d.conversions), dates, 'CV数', v => `${Math.round(v)}件`),
    cpaDisplay: generateChartInsight(sorted.map(d => d.cpa ?? 0), dates, 'CPA', v => `¥${Math.round(v).toLocaleString()}`),
    cpc: generateChartInsight(sorted.map(d => d.cpc), dates, 'CPC', v => `¥${Math.round(v).toLocaleString()}`),
    ctr: generateChartInsight(sorted.map(d => d.ctr), dates, 'CTR', v => `${(v * 100).toFixed(2)}%`),
    cvr: generateChartInsight(sorted.map(d => d.cvr), dates, 'CVR', v => `${(v * 100).toFixed(2)}%`),
  };

  return (
    <div className="space-y-8">
      {CHARTS.map(chart => (
        <div key={chart.id}>
          <h3 className="mb-3 text-sm font-medium text-gray-700">{chart.title}</h3>
          <div
            id={chart.id}
            className="rounded-lg border p-4"
            style={{ width: '100%', height: 280, backgroundColor: '#ffffff' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  fontSize={10}
                  tick={{ fill: '#6b7280' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  fontSize={10}
                  tick={{ fill: '#6b7280' }}
                  tickFormatter={chart.formatter}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number | undefined) => value !== undefined ? [chart.formatter(value), chart.title] : ['', '']}
                  labelFormatter={(label) => `日付: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey={chart.dataKey}
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={chartData.length <= 31}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {insightMap[chart.dataKey] && (
            <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2">
              {insightMap[chart.dataKey]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
