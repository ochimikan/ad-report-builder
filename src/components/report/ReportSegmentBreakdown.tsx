'use client';

import { SegmentBreakdown } from '@/types/report';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReportSegmentCharts } from './ReportSegmentCharts';

interface Props {
  breakdowns: SegmentBreakdown[];
}

const KPI_ROWS = [
  { label: '広告費', getValue: (s: { totalSpend: number }) => formatCurrency(s.totalSpend) },
  { label: '表示回数', getValue: (s: { totalImpressions: number }) => formatNumber(s.totalImpressions) },
  { label: 'クリック数', getValue: (s: { totalClicks: number }) => formatNumber(s.totalClicks) },
  { label: 'CV数', getValue: (s: { totalConversions: number }) => formatNumber(s.totalConversions) },
  { label: 'CTR', getValue: (s: { avgCtr: number }) => formatPercent(s.avgCtr) },
  { label: 'CPC', getValue: (s: { avgCpc: number }) => formatCurrency(Math.round(s.avgCpc)) },
  { label: 'CVR', getValue: (s: { avgCvr: number }) => formatPercent(s.avgCvr) },
  { label: 'CPA', getValue: (s: { avgCpa: number | null }) => s.avgCpa !== null ? formatCurrency(Math.round(s.avgCpa)) : '—' },
  { label: 'CPM', getValue: (s: { avgCpm: number }) => formatCurrency(Math.round(s.avgCpm)) },
] as const;

export function ReportSegmentBreakdown({ breakdowns }: Props) {
  return (
    <div className="space-y-10">
      {breakdowns.map(bd => (
        <div key={bd.segmentColumn} className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800">
            セグメント分析: {bd.segmentColumn}
          </h2>

          {/* Side-by-side KPI summary table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800">
                  <TableHead className="text-white font-bold">指標</TableHead>
                  {bd.values.map(v => (
                    <TableHead key={v.segmentValue} className="text-white font-bold text-right">
                      {v.segmentValue}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {KPI_ROWS.map((row, i) => (
                  <TableRow key={row.label} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    {bd.values.map(v => (
                      <TableCell key={v.segmentValue} className="text-right">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {row.getValue(v.comparison.current as any)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Multi-series charts */}
          <ReportSegmentCharts breakdown={bd} />

          {/* Per-segment commentary and actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">セグメント別インサイト</h3>
            {bd.values.map(v => (
              <div key={v.segmentValue} className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-gray-800">{v.segmentValue}</h4>
                <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">
                  {v.commentary}
                </p>
                {v.actions.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {v.actions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
