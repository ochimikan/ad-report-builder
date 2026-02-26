import { parseCsv } from './csv-parser';
import { parseXlsx } from './xlsx-parser';
import { ParseResult } from './csv-parser';

export type { ParseResult };

export async function parseFile(file: File): Promise<ParseResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv') {
    return parseCsv(file);
  }

  if (ext === 'xlsx' || ext === 'xls') {
    const buffer = await file.arrayBuffer();
    return parseXlsx(buffer);
  }

  throw new Error(
    `対応していないファイル形式です: .${ext}\n.csv または .xlsx ファイルをアップロードしてください。`
  );
}
