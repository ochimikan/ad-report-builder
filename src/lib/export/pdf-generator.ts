import { PDFDocument, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { loadJapaneseFont } from './font-loader';
import { ReportData, SegmentBreakdown } from '@/types/report';
import { ChartImages, SegmentChartImages } from './chart-renderer';
import { formatNumber, formatCurrency, formatPercent, formatDelta } from '@/lib/utils/format-utils';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN;

const COLORS = {
  title: rgb(0.1, 0.1, 0.1),
  subtitle: rgb(0.2, 0.2, 0.2),
  text: rgb(0.3, 0.3, 0.3),
  headerBg: rgb(0.15, 0.23, 0.38),
  headerText: rgb(1, 1, 1),
  rowEven: rgb(0.96, 0.97, 0.98),
  border: rgb(0.85, 0.85, 0.85),
  positive: rgb(0.13, 0.55, 0.13),
  negative: rgb(0.8, 0.15, 0.15),
};

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let currentLine = '';

  for (const char of text) {
    const testLine = currentLine + char;
    const width = font.widthOfTextAtSize(testLine, size);
    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawTableRow(
  page: PDFPage,
  font: PDFFont,
  y: number,
  cols: string[],
  colWidths: number[],
  fontSize: number,
  isHeader: boolean,
  rowHeight: number,
): void {
  let x = MARGIN;

  if (isHeader) {
    page.drawRectangle({
      x: MARGIN,
      y: y - rowHeight + 4,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: COLORS.headerBg,
    });
  }

  for (let i = 0; i < cols.length; i++) {
    const textColor = isHeader ? COLORS.headerText : COLORS.text;
    page.drawText(cols[i], {
      x: x + 6,
      y: y - rowHeight + 10,
      size: fontSize,
      font,
      color: textColor,
    });
    x += colWidths[i];
  }

  // Bottom border
  page.drawLine({
    start: { x: MARGIN, y: y - rowHeight + 4 },
    end: { x: MARGIN + CONTENT_WIDTH, y: y - rowHeight + 4 },
    thickness: 0.5,
    color: COLORS.border,
  });
}

export async function generatePdf(
  reportData: ReportData,
  chartImages: ChartImages,
  segmentChartImages?: SegmentChartImages,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await loadJapaneseFont(pdfDoc);

  await renderSummaryPage(pdfDoc, font, reportData);
  await renderChartsPage(pdfDoc, font, chartImages);
  await renderActionsPage(pdfDoc, font, reportData);

  // Segment pages
  for (const bd of reportData.segmentBreakdowns) {
    await renderSegmentSummaryPage(pdfDoc, font, bd);
    if (segmentChartImages?.[bd.segmentColumn]) {
      await renderSegmentChartsPage(pdfDoc, font, bd.segmentColumn, segmentChartImages[bd.segmentColumn]);
    }
  }

  return pdfDoc.save();
}

async function renderSummaryPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  data: ReportData,
): Promise<void> {
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;

  // Title
  page.drawText('広告レポート サマリー', {
    x: MARGIN,
    y,
    size: 20,
    font,
    color: COLORS.title,
  });
  y -= 35;

  // Period info
  page.drawText(`対象期間: ${data.dateRange.start} 〜 ${data.dateRange.end}`, {
    x: MARGIN,
    y,
    size: 10,
    font,
    color: COLORS.text,
  });
  y -= 16;
  page.drawText(`比較期間: ${data.previousRange.start} 〜 ${data.previousRange.end}`, {
    x: MARGIN,
    y,
    size: 10,
    font,
    color: COLORS.text,
  });
  y -= 30;

  // KPI Summary Table
  const colWidths = [100, 120, 120, 100];
  const rowHeight = 24;
  const fontSize = 9;

  // Header
  drawTableRow(page, font, y, ['指標', '当期', '前期', '変動率'], colWidths, fontSize, true, rowHeight);
  y -= rowHeight;

  const { current, previous, deltas } = data.comparison;
  const rows = [
    ['広告費', formatCurrency(current.totalSpend), formatCurrency(previous.totalSpend), formatDelta(deltas.spend)],
    ['表示回数', formatNumber(current.totalImpressions), formatNumber(previous.totalImpressions), formatDelta(deltas.impressions)],
    ['クリック数', formatNumber(current.totalClicks), formatNumber(previous.totalClicks), formatDelta(deltas.clicks)],
    ['CV数', formatNumber(current.totalConversions), formatNumber(previous.totalConversions), formatDelta(deltas.conversions)],
    ['CTR', formatPercent(current.avgCtr), formatPercent(previous.avgCtr), formatDelta(deltas.ctr)],
    ['CPC', formatCurrency(Math.round(current.avgCpc)), formatCurrency(Math.round(previous.avgCpc)), formatDelta(deltas.cpc)],
    ['CVR', formatPercent(current.avgCvr), formatPercent(previous.avgCvr), formatDelta(deltas.cvr)],
    ['CPA', current.avgCpa !== null ? formatCurrency(Math.round(current.avgCpa)) : '—', previous.avgCpa !== null ? formatCurrency(Math.round(previous.avgCpa)) : '—', formatDelta(deltas.cpa)],
    ['CPM', formatCurrency(Math.round(current.avgCpm)), formatCurrency(Math.round(previous.avgCpm)), formatDelta(deltas.cpm)],
  ];

  for (const row of rows) {
    drawTableRow(page, font, y, row, colWidths, fontSize, false, rowHeight);
    y -= rowHeight;
  }

  // Commentary
  y -= 30;
  page.drawText('総括コメント', {
    x: MARGIN,
    y,
    size: 14,
    font,
    color: COLORS.subtitle,
  });
  y -= 22;

  const lines = wrapText(data.commentary, font, 10, CONTENT_WIDTH);
  for (const line of lines) {
    page.drawText(line, { x: MARGIN, y, size: 10, font, color: COLORS.text });
    y -= 16;
  }
}

async function renderChartsPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  chartImages: ChartImages,
): Promise<void> {
  const chartWidth = CONTENT_WIDTH;
  const chartHeight = 200;
  const allCharts = [
    { label: '日別 広告費', data: chartImages.spend },
    { label: '日別 CV数', data: chartImages.cv },
    { label: '日別 CPA', data: chartImages.cpa },
    { label: '日別 CPC', data: chartImages.cpc },
    { label: '日別 CTR', data: chartImages.ctr },
    { label: '日別 CVR', data: chartImages.cvr },
  ];

  // Split into pages of 3 charts each
  const chartsPerPage = 3;
  for (let pageIdx = 0; pageIdx < allCharts.length; pageIdx += chartsPerPage) {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    let y = A4_HEIGHT - MARGIN;

    const pageTitle = pageIdx === 0 ? '推移グラフ (1/2)' : '推移グラフ (2/2)';
    page.drawText(pageTitle, {
      x: MARGIN,
      y,
      size: 20,
      font,
      color: COLORS.title,
    });
    y -= 35;

    const pageCharts = allCharts.slice(pageIdx, pageIdx + chartsPerPage);
    for (const chart of pageCharts) {
      page.drawText(chart.label, {
        x: MARGIN,
        y,
        size: 11,
        font,
        color: COLORS.subtitle,
      });
      y -= 10;

      try {
        const pngBytes = dataUrlToBytes(chart.data);
        const pngImage = await pdfDoc.embedPng(pngBytes);
        const dims = pngImage.scaleToFit(chartWidth, chartHeight);
        page.drawImage(pngImage, {
          x: MARGIN,
          y: y - dims.height,
          width: dims.width,
          height: dims.height,
        });
        y -= dims.height + 20;
      } catch {
        page.drawText('チャートの読み込みに失敗しました', {
          x: MARGIN,
          y: y - 20,
          size: 10,
          font,
          color: COLORS.negative,
        });
        y -= 40;
      }
    }
  }
}

async function renderActionsPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  data: ReportData,
): Promise<void> {
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;

  page.drawText('改善アクション提案', {
    x: MARGIN,
    y,
    size: 20,
    font,
    color: COLORS.title,
  });
  y -= 40;

  if (data.actions.length === 0) {
    page.drawText('現時点で特筆すべき改善アクションはありません。', {
      x: MARGIN,
      y,
      size: 11,
      font,
      color: COLORS.text,
    });
    return;
  }

  for (let i = 0; i < data.actions.length; i++) {
    // Action number badge
    const badgeText = `${i + 1}`;
    page.drawRectangle({
      x: MARGIN,
      y: y - 16,
      width: 24,
      height: 24,
      color: COLORS.headerBg,
      borderColor: COLORS.headerBg,
      borderWidth: 0,
    });
    page.drawText(badgeText, {
      x: MARGIN + 8,
      y: y - 11,
      size: 12,
      font,
      color: COLORS.headerText,
    });

    // Action text
    const actionLines = wrapText(data.actions[i], font, 11, CONTENT_WIDTH - 40);
    let lineY = y;
    for (const line of actionLines) {
      page.drawText(line, {
        x: MARGIN + 34,
        y: lineY - 11,
        size: 11,
        font,
        color: COLORS.text,
      });
      lineY -= 18;
    }

    y = lineY - 20;
  }
}

async function renderSegmentSummaryPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  bd: SegmentBreakdown,
): Promise<void> {
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;

  page.drawText(`セグメント分析: ${bd.segmentColumn}`, {
    x: MARGIN,
    y,
    size: 18,
    font,
    color: COLORS.title,
  });
  y -= 35;

  // Dynamic column widths based on number of segment values
  const metricColWidth = 70;
  const maxSegCols = Math.min(bd.values.length, 6);
  const segColWidth = Math.floor((CONTENT_WIDTH - metricColWidth) / maxSegCols);
  const colWidths = [metricColWidth, ...Array(maxSegCols).fill(segColWidth)];
  const rowHeight = 22;
  const fontSize = 8;

  // Header
  const headerCols = ['指標', ...bd.values.slice(0, maxSegCols).map(v => v.segmentValue)];
  drawTableRow(page, font, y, headerCols, colWidths, fontSize, true, rowHeight);
  y -= rowHeight;

  // KPI rows
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

  for (const kpi of kpiDefs) {
    const row = [kpi.label, ...bd.values.slice(0, maxSegCols).map(v => kpi.get(v))];
    drawTableRow(page, font, y, row, colWidths, fontSize, false, rowHeight);
    y -= rowHeight;
  }

  // Per-segment commentary
  y -= 20;
  page.drawText('セグメント別コメント', {
    x: MARGIN,
    y,
    size: 12,
    font,
    color: COLORS.subtitle,
  });
  y -= 18;

  for (const v of bd.values.slice(0, maxSegCols)) {
    if (y < MARGIN + 60) break;

    page.drawText(`【${v.segmentValue}】`, {
      x: MARGIN,
      y,
      size: 9,
      font,
      color: COLORS.subtitle,
    });
    y -= 14;

    const commentLines = wrapText(v.commentary, font, 8, CONTENT_WIDTH - 10);
    for (const line of commentLines) {
      if (y < MARGIN + 20) break;
      page.drawText(line, { x: MARGIN + 10, y, size: 8, font, color: COLORS.text });
      y -= 12;
    }
    y -= 6;
  }
}

async function renderSegmentChartsPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  segmentColumn: string,
  chartImageMap: { [kpi: string]: string },
): Promise<void> {
  const chartWidth = CONTENT_WIDTH;
  const chartHeight = 200;
  const kpiLabels: [string, string][] = [
    ['spend', '広告費'],
    ['cv', 'CV数'],
    ['cpa', 'CPA'],
    ['cpc', 'CPC'],
    ['ctr', 'CTR'],
    ['cvr', 'CVR'],
  ];

  const availableCharts = kpiLabels.filter(([kpi]) => chartImageMap[kpi]);
  const chartsPerPage = 3;

  for (let pageIdx = 0; pageIdx < availableCharts.length; pageIdx += chartsPerPage) {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    let y = A4_HEIGHT - MARGIN;

    page.drawText(`セグメント別グラフ: ${segmentColumn}`, {
      x: MARGIN,
      y,
      size: 18,
      font,
      color: COLORS.title,
    });
    y -= 35;

    const pageCharts = availableCharts.slice(pageIdx, pageIdx + chartsPerPage);
    for (const [kpi, label] of pageCharts) {
      page.drawText(`セグメント別 ${label}`, {
        x: MARGIN,
        y,
        size: 11,
        font,
        color: COLORS.subtitle,
      });
      y -= 10;

      try {
        const pngBytes = dataUrlToBytes(chartImageMap[kpi]);
        const pngImage = await pdfDoc.embedPng(pngBytes);
        const dims = pngImage.scaleToFit(chartWidth, chartHeight);
        page.drawImage(pngImage, {
          x: MARGIN,
          y: y - dims.height,
          width: dims.width,
          height: dims.height,
        });
        y -= dims.height + 20;
      } catch {
        page.drawText('チャートの読み込みに失敗しました', {
          x: MARGIN,
          y: y - 20,
          size: 10,
          font,
          color: COLORS.negative,
        });
        y -= 40;
      }
    }
  }
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function downloadPdf(data: Uint8Array, filename: string): void {
  const blob = new Blob([data as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
