import { ReportData, SegmentBreakdown } from '@/types/report';
import { ChartImages, SegmentChartImages } from './chart-renderer';
import { formatNumber, formatCurrency, formatPercent, formatDelta } from '@/lib/utils/format-utils';

const COLORS = {
  title: '1A1A1A',
  subtitle: '333333',
  text: '4D4D4D',
  headerBg: '263B61',
  headerText: 'FFFFFF',
  positive: '218B21',
  negative: 'CC2626',
  lightBg: 'F5F6F8',
  border: 'D9D9D9',
  white: 'FFFFFF',
};

const FONT = 'Meiryo';
const MARGIN = 0.5;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Pptx = any;
type Slide = any;
type TableCell = { text: string; options?: Record<string, any> };
type TableRow = TableCell[];

function addTitleSlide(pptx: Pptx, data: ReportData): void {
  const slide: Slide = pptx.addSlide();

  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: 0.6,
    fill: { color: COLORS.headerBg },
  });

  slide.addText('広告パフォーマンスレポート', {
    x: MARGIN, y: 1.8, w: 9, h: 1,
    fontSize: 32, fontFace: FONT,
    color: COLORS.title, bold: true,
  });

  const periodText = [
    { text: `対象期間: ${data.dateRange.start} 〜 ${data.dateRange.end}\n`, options: { fontSize: 14, fontFace: FONT, color: COLORS.subtitle } },
    { text: `比較期間: ${data.previousRange.start} 〜 ${data.previousRange.end}`, options: { fontSize: 14, fontFace: FONT, color: COLORS.subtitle } },
  ];
  slide.addText(periodText, {
    x: MARGIN, y: 3.0, w: 9, h: 0.8,
    lineSpacingMultiple: 1.5,
  });

  slide.addText(`生成日: ${new Date().toLocaleDateString('ja-JP')}`, {
    x: MARGIN, y: 4.6, w: 4, h: 0.4,
    fontSize: 10, fontFace: FONT, color: COLORS.text,
  });
}

function addKpiSummarySlide(pptx: Pptx, data: ReportData): void {
  const slide: Slide = pptx.addSlide();

  slide.addText('KPIサマリー', {
    x: MARGIN, y: 0.2, w: 9, h: 0.6,
    fontSize: 24, fontFace: FONT, color: COLORS.title, bold: true,
  });

  const { current, previous, deltas } = data.comparison;

  const headerStyle = {
    fill: { color: COLORS.headerBg },
    color: COLORS.headerText,
    bold: true,
    fontSize: 11,
    fontFace: FONT,
  };

  const headerRow: TableRow = [
    { text: '指標', options: { ...headerStyle } },
    { text: '当期', options: { ...headerStyle, align: 'right' } },
    { text: '前期', options: { ...headerStyle, align: 'right' } },
    { text: '変動率', options: { ...headerStyle, align: 'right' } },
  ];

  const kpiRows: [string, string, string, number | null][] = [
    ['広告費', formatCurrency(current.totalSpend), formatCurrency(previous.totalSpend), deltas.spend],
    ['表示回数', formatNumber(current.totalImpressions), formatNumber(previous.totalImpressions), deltas.impressions],
    ['クリック数', formatNumber(current.totalClicks), formatNumber(previous.totalClicks), deltas.clicks],
    ['CV数', formatNumber(current.totalConversions), formatNumber(previous.totalConversions), deltas.conversions],
    ['CTR', formatPercent(current.avgCtr), formatPercent(previous.avgCtr), deltas.ctr],
    ['CPC', formatCurrency(Math.round(current.avgCpc)), formatCurrency(Math.round(previous.avgCpc)), deltas.cpc],
    ['CVR', formatPercent(current.avgCvr), formatPercent(previous.avgCvr), deltas.cvr],
    ['CPA', current.avgCpa !== null ? formatCurrency(Math.round(current.avgCpa)) : '—', previous.avgCpa !== null ? formatCurrency(Math.round(previous.avgCpa)) : '—', deltas.cpa],
    ['CPM', formatCurrency(Math.round(current.avgCpm)), formatCurrency(Math.round(previous.avgCpm)), deltas.cpm],
  ];

  const tableRows: TableRow[] = [headerRow];

  for (let idx = 0; idx < kpiRows.length; idx++) {
    const [label, cur, prev, delta] = kpiRows[idx];
    const bgColor = idx % 2 === 0 ? COLORS.lightBg : COLORS.white;
    const deltaNum = delta as number | null;
    const deltaColor = deltaNum !== null
      ? (deltaNum >= 0 ? COLORS.positive : COLORS.negative)
      : COLORS.text;

    tableRows.push([
      { text: label, options: { fill: { color: bgColor }, fontSize: 10, fontFace: FONT, bold: true } },
      { text: cur, options: { fill: { color: bgColor }, fontSize: 10, fontFace: FONT, align: 'right' } },
      { text: prev, options: { fill: { color: bgColor }, fontSize: 10, fontFace: FONT, align: 'right' } },
      { text: formatDelta(deltaNum), options: { fill: { color: bgColor }, fontSize: 10, fontFace: FONT, align: 'right', color: deltaColor } },
    ]);
  }

  slide.addTable(tableRows, {
    x: MARGIN, y: 1.0, w: 9,
    colW: [2.5, 2.2, 2.2, 2.1],
    border: { type: 'solid', pt: 0.5, color: COLORS.border },
    rowH: 0.4,
  });
}

function addCommentarySlide(pptx: Pptx, data: ReportData): void {
  const slide: Slide = pptx.addSlide();

  slide.addText('総括コメント', {
    x: MARGIN, y: 0.2, w: 9, h: 0.6,
    fontSize: 24, fontFace: FONT, color: COLORS.title, bold: true,
  });

  slide.addText(data.commentary, {
    x: MARGIN, y: 1.0, w: 9, h: 4.0,
    fontSize: 13, fontFace: FONT, color: COLORS.text,
    valign: 'top', lineSpacingMultiple: 1.6,
    wrap: true,
  });
}

function addChartSlides(pptx: Pptx, chartImages: ChartImages): void {
  const allCharts = [
    { label: '日別 広告費', data: chartImages.spend },
    { label: '日別 CV数', data: chartImages.cv },
    { label: '日別 CPA', data: chartImages.cpa },
    { label: '日別 CPC', data: chartImages.cpc },
    { label: '日別 CTR', data: chartImages.ctr },
    { label: '日別 CVR', data: chartImages.cvr },
  ];

  const chartsPerSlide = 3;
  for (let i = 0; i < allCharts.length; i += chartsPerSlide) {
    const slide: Slide = pptx.addSlide();
    const pageNum = i === 0 ? '1/2' : '2/2';

    slide.addText(`推移グラフ (${pageNum})`, {
      x: MARGIN, y: 0.1, w: 9, h: 0.5,
      fontSize: 20, fontFace: FONT, color: COLORS.title, bold: true,
    });

    const pageCharts = allCharts.slice(i, i + chartsPerSlide);
    pageCharts.forEach((chart, idx) => {
      const yPos = 0.7 + idx * 1.65;

      slide.addText(chart.label, {
        x: MARGIN, y: yPos, w: 9, h: 0.3,
        fontSize: 11, fontFace: FONT, color: COLORS.subtitle, bold: true,
      });

      slide.addImage({
        data: chart.data,
        x: MARGIN, y: yPos + 0.3,
        w: 9, h: 1.3,
        sizing: { type: 'contain', w: 9, h: 1.3 },
      });
    });
  }
}

function addActionsSlide(pptx: Pptx, data: ReportData): void {
  const slide: Slide = pptx.addSlide();

  slide.addText('改善アクション提案', {
    x: MARGIN, y: 0.2, w: 9, h: 0.6,
    fontSize: 24, fontFace: FONT, color: COLORS.title, bold: true,
  });

  if (data.actions.length === 0) {
    slide.addText('現時点で特筆すべき改善アクションはありません。', {
      x: MARGIN, y: 1.2, w: 9, h: 0.5,
      fontSize: 14, fontFace: FONT, color: COLORS.text,
    });
    return;
  }

  data.actions.forEach((action, idx) => {
    const yPos = 1.0 + idx * 0.6;

    slide.addShape('ellipse', {
      x: MARGIN, y: yPos, w: 0.35, h: 0.35,
      fill: { color: COLORS.headerBg },
    });
    slide.addText(`${idx + 1}`, {
      x: MARGIN, y: yPos, w: 0.35, h: 0.35,
      fontSize: 12, fontFace: FONT, color: COLORS.headerText,
      align: 'center', valign: 'middle', bold: true,
    });

    slide.addText(action, {
      x: MARGIN + 0.5, y: yPos, w: 8.5, h: 0.55,
      fontSize: 11, fontFace: FONT, color: COLORS.text,
      valign: 'top', wrap: true,
    });
  });
}

function addSegmentSummarySlide(pptx: Pptx, bd: SegmentBreakdown): void {
  const slide: Slide = pptx.addSlide();

  slide.addText(`セグメント分析: ${bd.segmentColumn}`, {
    x: MARGIN, y: 0.2, w: 9, h: 0.5,
    fontSize: 20, fontFace: FONT, color: COLORS.title, bold: true,
  });

  const maxSegCols = Math.min(bd.values.length, 6);
  const metricColWidth = 1.5;
  const segColWidth = (9 - metricColWidth) / maxSegCols;

  const headerStyle = {
    fill: { color: COLORS.headerBg },
    color: COLORS.headerText,
    bold: true,
    fontSize: 9,
    fontFace: FONT,
  };

  const headerRow: TableRow = [
    { text: '指標', options: { ...headerStyle } },
    ...bd.values.slice(0, maxSegCols).map(v => ({
      text: v.segmentValue,
      options: { ...headerStyle, align: 'right' as const },
    })),
  ];

  const kpiDefs = [
    { label: '広告費', get: (s: typeof bd.values[0]) => formatCurrency(s.comparison.current.totalSpend) },
    { label: '表示回数', get: (s: typeof bd.values[0]) => formatNumber(s.comparison.current.totalImpressions) },
    { label: 'クリック数', get: (s: typeof bd.values[0]) => formatNumber(s.comparison.current.totalClicks) },
    { label: 'CV数', get: (s: typeof bd.values[0]) => formatNumber(s.comparison.current.totalConversions) },
    { label: 'CTR', get: (s: typeof bd.values[0]) => formatPercent(s.comparison.current.avgCtr) },
    { label: 'CPC', get: (s: typeof bd.values[0]) => formatCurrency(Math.round(s.comparison.current.avgCpc)) },
    { label: 'CVR', get: (s: typeof bd.values[0]) => formatPercent(s.comparison.current.avgCvr) },
    { label: 'CPA', get: (s: typeof bd.values[0]) => s.comparison.current.avgCpa !== null ? formatCurrency(Math.round(s.comparison.current.avgCpa)) : '—' },
  ];

  const tableRows: TableRow[] = [headerRow];
  for (let idx = 0; idx < kpiDefs.length; idx++) {
    const kpi = kpiDefs[idx];
    const bgColor = idx % 2 === 0 ? COLORS.lightBg : COLORS.white;
    tableRows.push([
      { text: kpi.label, options: { fill: { color: bgColor }, fontSize: 9, fontFace: FONT, bold: true } },
      ...bd.values.slice(0, maxSegCols).map(v => ({
        text: kpi.get(v),
        options: { fill: { color: bgColor }, fontSize: 9, fontFace: FONT, align: 'right' as const },
      })),
    ]);
  }

  slide.addTable(tableRows, {
    x: MARGIN, y: 0.8, w: 9,
    colW: [metricColWidth, ...Array(maxSegCols).fill(segColWidth)],
    border: { type: 'solid', pt: 0.5, color: COLORS.border },
    rowH: 0.35,
  });

  // Per-segment commentary
  const commentaryY = 0.8 + (kpiDefs.length + 1) * 0.35 + 0.3;
  slide.addText('セグメント別コメント', {
    x: MARGIN, y: commentaryY, w: 9, h: 0.4,
    fontSize: 14, fontFace: FONT, color: COLORS.subtitle, bold: true,
  });

  let currentY = commentaryY + 0.4;
  for (const v of bd.values.slice(0, maxSegCols)) {
    if (currentY > 4.8) break;
    slide.addText(`【${v.segmentValue}】${v.commentary}`, {
      x: MARGIN, y: currentY, w: 9, h: 0.4,
      fontSize: 9, fontFace: FONT, color: COLORS.text, wrap: true,
    });
    currentY += 0.45;
  }
}

function addSegmentChartSlides(
  pptx: Pptx,
  segmentColumn: string,
  chartImageMap: { [kpi: string]: string },
): void {
  const kpiLabels: [string, string][] = [
    ['spend', '広告費'], ['cv', 'CV数'], ['cpa', 'CPA'],
    ['cpc', 'CPC'], ['ctr', 'CTR'], ['cvr', 'CVR'],
  ];

  const availableCharts = kpiLabels.filter(([kpi]) => chartImageMap[kpi]);
  const chartsPerSlide = 3;

  for (let i = 0; i < availableCharts.length; i += chartsPerSlide) {
    const slide: Slide = pptx.addSlide();

    slide.addText(`セグメント別グラフ: ${segmentColumn}`, {
      x: MARGIN, y: 0.1, w: 9, h: 0.5,
      fontSize: 20, fontFace: FONT, color: COLORS.title, bold: true,
    });

    const pageCharts = availableCharts.slice(i, i + chartsPerSlide);
    pageCharts.forEach(([kpi, label], idx) => {
      const yPos = 0.7 + idx * 1.65;

      slide.addText(`セグメント別 ${label}`, {
        x: MARGIN, y: yPos, w: 9, h: 0.3,
        fontSize: 11, fontFace: FONT, color: COLORS.subtitle, bold: true,
      });

      slide.addImage({
        data: chartImageMap[kpi],
        x: MARGIN, y: yPos + 0.3,
        w: 9, h: 1.3,
        sizing: { type: 'contain', w: 9, h: 1.3 },
      });
    });
  }
}

export async function generatePptx(
  reportData: ReportData,
  chartImages: ChartImages,
  segmentChartImages?: SegmentChartImages,
): Promise<Uint8Array> {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = '広告レポートビルダー';
  pptx.title = `広告レポート ${reportData.dateRange.start}〜${reportData.dateRange.end}`;

  addTitleSlide(pptx, reportData);
  addKpiSummarySlide(pptx, reportData);
  addCommentarySlide(pptx, reportData);
  addChartSlides(pptx, chartImages);
  addActionsSlide(pptx, reportData);

  for (const bd of reportData.segmentBreakdowns) {
    addSegmentSummarySlide(pptx, bd);
    if (segmentChartImages?.[bd.segmentColumn]) {
      addSegmentChartSlides(pptx, bd.segmentColumn, segmentChartImages[bd.segmentColumn]);
    }
  }

  const output = await pptx.write({ outputType: 'arraybuffer' });
  return new Uint8Array(output as ArrayBuffer);
}

export function downloadPptx(data: Uint8Array, filename: string): void {
  const blob = new Blob([data as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
