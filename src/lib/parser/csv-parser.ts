import Papa from 'papaparse';
import { RawRow } from '@/types/data';

export interface ParseResult {
  headers: string[];
  rows: RawRow[];
  rowCount: number;
}

export function parseCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const rows: RawRow[] = [];
    let headers: string[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      chunk(results) {
        if (headers.length === 0) {
          headers = results.meta.fields ?? [];
        }
        rows.push(...(results.data as RawRow[]));
      },
      complete() {
        resolve({ headers, rows, rowCount: rows.length });
      },
      error(err: Error) {
        reject(new Error(`CSVの解析に失敗しました: ${err.message}`));
      },
    });
  });
}
