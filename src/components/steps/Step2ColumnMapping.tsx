'use client';

import { useCallback } from 'react';
import { WizardAPI } from '@/hooks/useWizardState';
import { CanonicalColumn, CANONICAL_COLUMNS } from '@/types/mapping';
import { updateMapping, toggleSegmentColumn } from '@/lib/mapping/auto-mapper';
import { validateMapping } from '@/lib/utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Columns, AlertCircle, ArrowLeft } from 'lucide-react';

const COLUMN_LABELS: Record<CanonicalColumn, string> = {
  date: '日付 (Date)',
  spend: '広告費 (Spend)',
  impressions: '表示回数 (Impressions)',
  clicks: 'クリック数 (Clicks)',
  conversions: 'CV数 (Conversions)',
};

interface Props {
  wizard: WizardAPI;
}

export function Step2ColumnMapping({ wizard }: Props) {
  const { state, setMapping, setStep, setError } = wizard;
  const { mapping, rawHeaders, rawPreview } = state;

  const handleChange = useCallback(
    (canonical: CanonicalColumn, header: string) => {
      if (!mapping) return;
      const updated = updateMapping(mapping, canonical, header === '__none__' ? null : header);
      setMapping(updated);
    },
    [mapping, setMapping],
  );

  const handleConfirm = useCallback(() => {
    if (!mapping) return;
    const result = validateMapping(mapping);
    if (!result.valid) {
      setError(result.errors.join('\n'));
      return;
    }
    setError(null);
    setStep(3);
  }, [mapping, setStep, setError]);

  if (!mapping) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Columns className="h-5 w-5" />
          カラムマッピング
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          各項目に対応する列を確認・変更してください。自動検出された項目は
          <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">自動</Badge>
          、未検出の項目は
          <Badge variant="secondary" className="ml-1 bg-red-100 text-red-700">未設定</Badge>
          と表示されます。
        </p>

        {/* Mapping selectors */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CANONICAL_COLUMNS.map(canonical => {
            const currentHeader = mapping.mapping[canonical];
            const conf = mapping.confidence[canonical];

            return (
              <div key={canonical} className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium">
                  {COLUMN_LABELS[canonical]}
                  {conf === 'auto' && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                      自動
                    </Badge>
                  )}
                  {conf === 'manual' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      手動
                    </Badge>
                  )}
                  {conf === 'unmapped' && (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                      未設定
                    </Badge>
                  )}
                </label>
                <Select
                  value={currentHeader ?? '__none__'}
                  onValueChange={(val) => handleChange(canonical, val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="列を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">-- 選択なし --</SelectItem>
                    {rawHeaders.map(h => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        {/* Segment column selection */}
        {(() => {
          const canonicalValues = Object.values(mapping.mapping).filter(Boolean);
          const availableForSegment = rawHeaders.filter(h => !canonicalValues.includes(h));
          if (availableForSegment.length === 0) return null;
          return (
            <div className="space-y-3 rounded-lg border border-dashed border-gray-300 p-4">
              <h3 className="text-sm font-medium text-gray-700">
                セグメント列（任意）
              </h3>
              <p className="text-xs text-gray-500">
                媒体・性別・年齢・クリエイティブなど、セグメント別の分析が必要な列を選択してください。未選択の場合は全体集計のみになります。
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {availableForSegment.map(header => (
                  <label key={header} className="flex items-center gap-2 text-sm cursor-pointer rounded-md border px-3 py-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={mapping.segmentColumns.includes(header)}
                      onChange={() => {
                        const updated = toggleSegmentColumn(mapping, header);
                        setMapping(updated);
                      }}
                      className="rounded border-gray-300"
                    />
                    {header}
                    {mapping.segmentColumns.includes(header) && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs ml-auto">
                        セグメント
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Data preview */}
        {rawPreview.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">データプレビュー（先頭5行）</h3>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {rawHeaders.map(h => (
                      <TableHead key={h} className="whitespace-nowrap text-xs">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawPreview.map((row, i) => (
                    <TableRow key={i}>
                      {rawHeaders.map(h => (
                        <TableCell key={h} className="whitespace-nowrap text-xs">
                          {row[h] ?? ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <Button onClick={handleConfirm}>
            マッピングを確定して次へ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
