'use client';

import { useCallback, useRef, useState } from 'react';
import { WizardAPI } from '@/hooks/useWizardState';
import { parseFile } from '@/lib/parser/unified-parser';
import { autoMapColumns } from '@/lib/mapping/auto-mapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface Props {
  wizard: WizardAPI;
}

export function Step1FileUpload({ wizard }: Props) {
  const { state, setFile, setMapping, setStep, setError, setProcessing } = wizard;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'csv' && ext !== 'xlsx' && ext !== 'xls') {
        setError('対応していないファイル形式です。.csv または .xlsx ファイルをアップロードしてください。');
        return;
      }

      setProcessing(true);
      setError(null);

      try {
        const result = await parseFile(file);

        if (result.rowCount === 0) {
          setError('ファイルにデータ行がありません。');
          setProcessing(false);
          return;
        }

        if (result.rowCount > 500000) {
          setError(`データ行数が ${result.rowCount.toLocaleString()} 行あります。50万行以下のファイルをアップロードしてください。`);
          setProcessing(false);
          return;
        }

        const preview = result.rows.slice(0, 5);
        setFile(file, result.headers, preview, result.rows);

        const mapping = autoMapColumns(result.headers);
        setMapping(mapping);
        setStep(2);
      } catch (e) {
        setError(`ファイルの解析に失敗しました: ${(e as Error).message}`);
      } finally {
        setProcessing(false);
      }
    },
    [setFile, setMapping, setStep, setError, setProcessing],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          ファイルアップロード
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed
            p-12 cursor-pointer transition-colors duration-200
            ${isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
            ${state.isProcessing ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <Upload className={`h-12 w-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              {state.isProcessing ? '解析中...' : 'ファイルをドラッグ＆ドロップ'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              または クリックしてファイルを選択
            </p>
            <p className="mt-2 text-xs text-gray-400">
              対応形式: .csv, .xlsx（最大50万行）
            </p>
          </div>

          {state.isProcessing && (
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
        />

        {state.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
