import { RawRow } from './data';
import { MappingResult } from './mapping';
import { ReportData } from './report';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardState {
  step: WizardStep;
  file: File | null;
  rawHeaders: string[];
  rawPreview: RawRow[];
  rawData: RawRow[];
  mapping: MappingResult | null;
  dateRange: { start: string; end: string } | null;
  reportData: ReportData | null;
  error: string | null;
  warning: string | null;
  isProcessing: boolean;
}
