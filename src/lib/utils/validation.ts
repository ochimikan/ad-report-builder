import { MappingResult, CANONICAL_COLUMNS } from '@/types/mapping';
import { NormalizedRow } from '@/types/data';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMapping(mapping: MappingResult): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const col of mapping.unmapped) {
    errors.push(`必須列「${col}」がマッピングされていません。手動で選択してください。`);
  }

  // Check for duplicate mappings
  const usedHeaders = CANONICAL_COLUMNS
    .map(c => mapping.mapping[c])
    .filter((h): h is string => h !== null);
  const duplicates = usedHeaders.filter((h, i) => usedHeaders.indexOf(h) !== i);
  if (duplicates.length > 0) {
    errors.push(`同じ列が複数の項目にマッピングされています: ${duplicates.join(', ')}`);
  }

  // Check segment columns don't overlap with canonical mappings
  for (const seg of mapping.segmentColumns) {
    if (usedHeaders.includes(seg)) {
      errors.push(`セグメント列「${seg}」は必須列として使用されています。`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateData(rows: NormalizedRow[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length === 0) {
    errors.push('データ行が見つかりませんでした。');
    return { valid: false, errors, warnings };
  }

  const allCvZero = rows.every(r => r.conversions === 0);
  if (allCvZero) {
    warnings.push('全てのコンバージョン値が0です。CPAは計算されません。');
  }

  const hasNegativeSpend = rows.some(r => r.spend < 0);
  if (hasNegativeSpend) {
    warnings.push('広告費にマイナスの値が含まれています。');
  }

  return { valid: errors.length === 0, errors, warnings };
}
