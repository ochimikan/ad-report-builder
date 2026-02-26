export type CanonicalColumn = 'date' | 'spend' | 'impressions' | 'clicks' | 'conversions';

export const CANONICAL_COLUMNS: CanonicalColumn[] = [
  'date', 'spend', 'impressions', 'clicks', 'conversions',
];

export interface ColumnAlias {
  canonical: CanonicalColumn;
  aliases: string[];
}

export interface MappingResult {
  mapping: Record<CanonicalColumn, string | null>;
  unmapped: CanonicalColumn[];
  confidence: Record<CanonicalColumn, 'auto' | 'manual' | 'unmapped'>;
  segmentColumns: string[];
}
