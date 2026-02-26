import { COLUMN_DICTIONARY } from './column-dictionary';
import { CanonicalColumn, CANONICAL_COLUMNS, MappingResult } from '@/types/mapping';

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\u3000]/g, '');
}

export function autoMapColumns(headers: string[]): MappingResult {
  const mapping: Record<CanonicalColumn, string | null> = {
    date: null,
    spend: null,
    impressions: null,
    clicks: null,
    conversions: null,
  };
  const confidence: Record<CanonicalColumn, 'auto' | 'manual' | 'unmapped'> = {
    date: 'unmapped',
    spend: 'unmapped',
    impressions: 'unmapped',
    clicks: 'unmapped',
    conversions: 'unmapped',
  };

  for (const header of headers) {
    const normalizedHeader = normalize(header);
    for (const { canonical, aliases } of COLUMN_DICTIONARY) {
      if (mapping[canonical] !== null) continue;
      if (aliases.some(alias => normalize(alias) === normalizedHeader)) {
        mapping[canonical] = header;
        confidence[canonical] = 'auto';
        break;
      }
    }
  }

  const unmapped = CANONICAL_COLUMNS.filter(k => mapping[k] === null);

  return { mapping, unmapped, confidence, segmentColumns: [] };
}

export function updateMapping(
  current: MappingResult,
  canonical: CanonicalColumn,
  header: string | null,
): MappingResult {
  const newMapping = { ...current.mapping, [canonical]: header };
  const newConfidence = {
    ...current.confidence,
    [canonical]: header ? 'manual' : 'unmapped',
  } as Record<CanonicalColumn, 'auto' | 'manual' | 'unmapped'>;
  const unmapped = CANONICAL_COLUMNS.filter(k => newMapping[k] === null);
  return { mapping: newMapping, unmapped, confidence: newConfidence, segmentColumns: current.segmentColumns };
}

export function toggleSegmentColumn(
  current: MappingResult,
  header: string,
): MappingResult {
  const isAlreadySegment = current.segmentColumns.includes(header);
  const segmentColumns = isAlreadySegment
    ? current.segmentColumns.filter(h => h !== header)
    : [...current.segmentColumns, header];
  return { ...current, segmentColumns };
}
