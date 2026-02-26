import { RawRow, NormalizedRow, SegmentedNormalizedRow } from '@/types/data';
import { CanonicalColumn } from '@/types/mapping';

export function normalizeDate(value: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`日付が空です`);
  }

  const cleaned = value
    .trim()
    .replace(/年/g, '/')
    .replace(/月/g, '/')
    .replace(/日/g, '');

  // Try parsing with Date
  const date = new Date(cleaned);
  if (!isNaN(date.getTime())) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Try YYYY/MM/DD or YYYY-MM-DD patterns manually
  const match = cleaned.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (match) {
    const [, y, m, d] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  throw new Error(`日付の形式が不正です: ${value}`);
}

export function normalizeNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = String(value).replace(/[,¥$€￥\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function normalizeRow(
  raw: RawRow,
  mapping: Record<CanonicalColumn, string>,
): NormalizedRow {
  return {
    date: normalizeDate(raw[mapping.date]),
    spend: normalizeNumber(raw[mapping.spend]),
    impressions: normalizeNumber(raw[mapping.impressions]),
    clicks: normalizeNumber(raw[mapping.clicks]),
    conversions: normalizeNumber(raw[mapping.conversions]),
  };
}

export function normalizeDataset(
  rows: RawRow[],
  mapping: Record<CanonicalColumn, string>,
): NormalizedRow[] {
  return rows.map((row, index) => {
    try {
      return normalizeRow(row, mapping);
    } catch (e) {
      throw new Error(`行 ${index + 1}: ${(e as Error).message}`);
    }
  });
}

export function normalizeDatasetWithSegments(
  rows: RawRow[],
  mapping: Record<CanonicalColumn, string>,
  segmentColumns: string[],
): SegmentedNormalizedRow[] {
  return rows.map((row, index) => {
    try {
      const base = normalizeRow(row, mapping);
      const segments: Record<string, string> = {};
      for (const col of segmentColumns) {
        segments[col] = (row[col] ?? '').trim();
      }
      return { ...base, segments };
    } catch (e) {
      throw new Error(`行 ${index + 1}: ${(e as Error).message}`);
    }
  });
}
