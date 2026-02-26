'use client';

import { useCallback, useState } from 'react';
import { WizardAPI } from '@/hooks/useWizardState';
import { ReportPage1Summary } from '@/components/report/ReportPage1Summary';
import { ReportPage2Charts } from '@/components/report/ReportPage2Charts';
import { ReportPage3Actions } from '@/components/report/ReportPage3Actions';
import { ReportSegmentBreakdown } from '@/components/report/ReportSegmentBreakdown';
import { ReportSegmentCharts } from '@/components/report/ReportSegmentCharts';
import { captureAllCharts, captureSegmentCharts } from '@/lib/export/chart-renderer';
import { generatePdf, downloadPdf } from '@/lib/export/pdf-generator';
import { generateExcel, downloadExcel } from '@/lib/export/excel-exporter';
import { generatePptx, downloadPptx } from '@/lib/export/pptx-generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Download, FileText, FileSpreadsheet, Presentation, RotateCcw, AlertCircle } from 'lucide-react';

interface Props {
  wizard: WizardAPI;
}

export function Step5Preview({ wizard }: Props) {
  const { state, reset } = wizard;
  const { reportData } = state;
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handlePdfDownload = useCallback(async () => {
    if (!reportData) return;
    setIsExporting(true);
    setExportError(null);

    try {
      // Small delay to ensure charts are rendered
      await new Promise(r => setTimeout(r, 300));
      const chartImages = await captureAllCharts();

      let segmentChartImages;
      if (reportData.segmentBreakdowns.length > 0) {
        const segCols = reportData.segmentBreakdowns.map(b => b.segmentColumn);
        segmentChartImages = await captureSegmentCharts(segCols);
      }

      const pdfBytes = await generatePdf(reportData, chartImages, segmentChartImages);
      const filename = `広告レポート_${reportData.dateRange.start}_${reportData.dateRange.end}.pdf`;
      downloadPdf(pdfBytes, filename);
    } catch (e) {
      setExportError(`PDF生成に失敗しました: ${(e as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  }, [reportData]);

  const handleExcelDownload = useCallback(() => {
    if (!reportData) return;
    setExportError(null);

    try {
      const excelBytes = generateExcel(reportData);
      const filename = `広告レポート_${reportData.dateRange.start}_${reportData.dateRange.end}.xlsx`;
      downloadExcel(excelBytes, filename);
    } catch (e) {
      setExportError(`Excel生成に失敗しました: ${(e as Error).message}`);
    }
  }, [reportData]);

  const handlePptxDownload = useCallback(async () => {
    if (!reportData) return;
    setIsExporting(true);
    setExportError(null);

    try {
      await new Promise(r => setTimeout(r, 300));
      const chartImages = await captureAllCharts();

      let segmentChartImages;
      if (reportData.segmentBreakdowns.length > 0) {
        const segCols = reportData.segmentBreakdowns.map(b => b.segmentColumn);
        segmentChartImages = await captureSegmentCharts(segCols);
      }

      const pptxBytes = await generatePptx(reportData, chartImages, segmentChartImages);
      const filename = `広告レポート_${reportData.dateRange.start}_${reportData.dateRange.end}.pptx`;
      downloadPptx(pptxBytes, filename);
    } catch (e) {
      setExportError(`PPTX生成に失敗しました: ${(e as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  }, [reportData]);

  const hasSegments = reportData ? reportData.segmentBreakdowns.length > 0 : false;

  if (!reportData) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            レポートプレビュー
          </CardTitle>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            新しいレポート
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Download buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handlePdfDownload} disabled={isExporting}>
            <FileText className="mr-2 h-4 w-4" />
            {isExporting ? 'PDF生成中...' : 'PDFダウンロード'}
          </Button>
          <Button variant="outline" onClick={handleExcelDownload}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excelダウンロード
          </Button>
          <Button variant="outline" onClick={handlePptxDownload} disabled={isExporting}>
            <Presentation className="mr-2 h-4 w-4" />
            {isExporting ? 'PPTX生成中...' : 'PowerPointダウンロード'}
          </Button>
        </div>

        {exportError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{exportError}</AlertDescription>
          </Alert>
        )}

        {/* Tabbed preview */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className={`grid w-full ${hasSegments ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="summary">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              サマリー
            </TabsTrigger>
            <TabsTrigger value="charts">推移グラフ</TabsTrigger>
            {hasSegments && (
              <TabsTrigger value="segments">セグメント分析</TabsTrigger>
            )}
            <TabsTrigger value="actions">改善アクション</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <ReportPage1Summary reportData={reportData} />
          </TabsContent>

          <TabsContent value="charts" className="mt-4">
            <ReportPage2Charts dailyData={reportData.dailyData} />
          </TabsContent>

          {hasSegments && (
            <TabsContent value="segments" className="mt-4">
              <ReportSegmentBreakdown breakdowns={reportData.segmentBreakdowns} />
            </TabsContent>
          )}

          <TabsContent value="actions" className="mt-4">
            <ReportPage3Actions actions={reportData.actions} />
          </TabsContent>
        </Tabs>

        {/* Hidden chart rendering area for PDF capture — uses inline CSS vars to avoid oklch */}
        <div
          aria-hidden
          className="fixed left-[-9999px] top-0 pointer-events-none"
          style={{
            width: 700,
            color: '#1f2937',
            backgroundColor: '#ffffff',
            // Override CSS custom properties that use oklch
            // so html2canvas can parse them
            ['--background' as string]: '#ffffff',
            ['--foreground' as string]: '#1f2937',
            ['--border' as string]: '#e5e7eb',
            ['--card' as string]: '#ffffff',
            ['--card-foreground' as string]: '#1f2937',
          }}
        >
          <ReportPage2Charts dailyData={reportData.dailyData} />
          {hasSegments && reportData.segmentBreakdowns.map(bd => (
            <ReportSegmentCharts key={bd.segmentColumn} breakdown={bd} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
