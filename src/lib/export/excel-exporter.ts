import * as XLSX from 'xlsx';
import { ReportData } from '@/types/report';
import { formatDelta } from '@/lib/utils/format-utils';

export function generateExcel(
  reportData: ReportData,
): Uint8Array {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Daily data
  const dailyRows = reportData.dailyData.map(row => ({
    '日付': row.date,
    '広告費': row.spend,
    '表示回数': row.impressions,
    'クリック数': row.clicks,
    'CV数': row.conversions,
    'CTR': `${(row.ctr * 100).toFixed(2)}%`,
    'CPC': Math.round(row.cpc),
    'CVR': `${(row.cvr * 100).toFixed(2)}%`,
    'CPA': row.cpa !== null ? Math.round(row.cpa) : '—',
    'CPM': Math.round(row.cpm),
  }));
  const dailySheet = XLSX.utils.json_to_sheet(dailyRows);
  XLSX.utils.book_append_sheet(workbook, dailySheet, '日別データ');

  // Sheet 2: Period summary comparison
  const { current, previous, deltas } = reportData.comparison;
  const summaryData = [
    ['指標', '当期', '前期', '変動率'],
    ['広告費', current.totalSpend, previous.totalSpend, formatDelta(deltas.spend)],
    ['表示回数', current.totalImpressions, previous.totalImpressions, formatDelta(deltas.impressions)],
    ['クリック数', current.totalClicks, previous.totalClicks, formatDelta(deltas.clicks)],
    ['CV数', current.totalConversions, previous.totalConversions, formatDelta(deltas.conversions)],
    ['CTR', `${(current.avgCtr * 100).toFixed(2)}%`, `${(previous.avgCtr * 100).toFixed(2)}%`, formatDelta(deltas.ctr)],
    ['CPC', Math.round(current.avgCpc), Math.round(previous.avgCpc), formatDelta(deltas.cpc)],
    ['CVR', `${(current.avgCvr * 100).toFixed(2)}%`, `${(previous.avgCvr * 100).toFixed(2)}%`, formatDelta(deltas.cvr)],
    ['CPA', current.avgCpa !== null ? Math.round(current.avgCpa) : '—', previous.avgCpa !== null ? Math.round(previous.avgCpa) : '—', formatDelta(deltas.cpa)],
    ['CPM', Math.round(current.avgCpm), Math.round(previous.avgCpm), formatDelta(deltas.cpm)],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー');

  // Sheet 3: Commentary + Actions
  const insightData = [
    ['総括コメント'],
    [reportData.commentary],
    [''],
    ['改善アクション'],
    ...reportData.actions.map((a, i) => [`${i + 1}. ${a}`]),
  ];
  const insightSheet = XLSX.utils.aoa_to_sheet(insightData);
  XLSX.utils.book_append_sheet(workbook, insightSheet, 'インサイト');

  // Segment sheets
  for (const bd of reportData.segmentBreakdowns) {
    const headerRow = ['指標', ...bd.values.map(v => v.segmentValue)];
    const kpiLabels = ['広告費', '表示回数', 'クリック数', 'CV数', 'CTR', 'CPC', 'CVR', 'CPA', 'CPM'];
    const kpiGetters = [
      (s: typeof bd.values[0]) => s.comparison.current.totalSpend,
      (s: typeof bd.values[0]) => s.comparison.current.totalImpressions,
      (s: typeof bd.values[0]) => s.comparison.current.totalClicks,
      (s: typeof bd.values[0]) => s.comparison.current.totalConversions,
      (s: typeof bd.values[0]) => `${(s.comparison.current.avgCtr * 100).toFixed(2)}%`,
      (s: typeof bd.values[0]) => Math.round(s.comparison.current.avgCpc),
      (s: typeof bd.values[0]) => `${(s.comparison.current.avgCvr * 100).toFixed(2)}%`,
      (s: typeof bd.values[0]) => s.comparison.current.avgCpa !== null ? Math.round(s.comparison.current.avgCpa) : '—',
      (s: typeof bd.values[0]) => Math.round(s.comparison.current.avgCpm),
    ];

    const segmentData: (string | number)[][] = [headerRow];
    for (let k = 0; k < kpiLabels.length; k++) {
      const row: (string | number)[] = [kpiLabels[k]];
      for (const v of bd.values) {
        row.push(kpiGetters[k](v));
      }
      segmentData.push(row);
    }

    // Add commentary
    segmentData.push([]);
    segmentData.push(['セグメント', 'コメント']);
    for (const v of bd.values) {
      segmentData.push([v.segmentValue, v.commentary]);
    }

    const segSheet = XLSX.utils.aoa_to_sheet(segmentData);
    const sheetName = `セグメント_${bd.segmentColumn}`.slice(0, 31);
    XLSX.utils.book_append_sheet(workbook, segSheet, sheetName);
  }

  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  return new Uint8Array(buffer);
}

export function downloadExcel(data: Uint8Array, filename: string): void {
  const blob = new Blob([data as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
