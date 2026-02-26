import * as XLSX from 'xlsx';
import { RawRow } from '@/types/data';
import { ParseResult } from './csv-parser';

export function parseXlsx(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<RawRow>(sheet, {
    defval: '',
    raw: false,
  });
  const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
  return { headers, rows: jsonData, rowCount: jsonData.length };
}
