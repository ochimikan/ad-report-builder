'use client';

import { ReportData } from '@/types/report';
import { formatNumber, formatCurrency, formatPercent, formatDelta } from '@/lib/utils/format-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  reportData: ReportData;
}

export function ReportPage1Summary({ reportData }: Props) {
  const { comparison, commentary, dateRange, previousRange } = reportData;
  const { current, previous, deltas } = comparison;

  const rows = [
    { label: '広告費', curr: formatCurrency(current.totalSpend), prev: formatCurrency(previous.totalSpend), delta: deltas.spend },
    { label: '表示回数', curr: formatNumber(current.totalImpressions), prev: formatNumber(previous.totalImpressions), delta: deltas.impressions },
    { label: 'クリック数', curr: formatNumber(current.totalClicks), prev: formatNumber(previous.totalClicks), delta: deltas.clicks },
    { label: 'CV数', curr: formatNumber(current.totalConversions), prev: formatNumber(previous.totalConversions), delta: deltas.conversions },
    { label: 'CTR', curr: formatPercent(current.avgCtr), prev: formatPercent(previous.avgCtr), delta: deltas.ctr },
    { label: 'CPC', curr: formatCurrency(Math.round(current.avgCpc)), prev: formatCurrency(Math.round(previous.avgCpc)), delta: deltas.cpc },
    { label: 'CVR', curr: formatPercent(current.avgCvr), prev: formatPercent(previous.avgCvr), delta: deltas.cvr },
    { label: 'CPA', curr: current.avgCpa !== null ? formatCurrency(Math.round(current.avgCpa)) : '—', prev: previous.avgCpa !== null ? formatCurrency(Math.round(previous.avgCpa)) : '—', delta: deltas.cpa },
    { label: 'CPM', curr: formatCurrency(Math.round(current.avgCpm)), prev: formatCurrency(Math.round(previous.avgCpm)), delta: deltas.cpm },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-sm text-gray-600">
        <p>対象期間: {dateRange.start} 〜 {dateRange.end}</p>
        <p>比較期間: {previousRange.start} 〜 {previousRange.end}</p>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-800">
              <TableHead className="text-white font-bold">指標</TableHead>
              <TableHead className="text-white font-bold text-right">当期</TableHead>
              <TableHead className="text-white font-bold text-right">前期</TableHead>
              <TableHead className="text-white font-bold text-right">変動率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={row.label} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell className="text-right">{row.curr}</TableCell>
                <TableCell className="text-right">{row.prev}</TableCell>
                <TableCell className="text-right">
                  <DeltaBadge value={row.delta} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-800">総括コメント</h3>
        <p className="text-sm text-blue-700">{commentary}</p>
      </div>
    </div>
  );
}

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-400">—</span>;

  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      className={`font-medium ${
        isPositive ? 'text-red-600' : isNegative ? 'text-emerald-600' : 'text-gray-600'
      }`}
    >
      {formatDelta(value)}
    </span>
  );
}
