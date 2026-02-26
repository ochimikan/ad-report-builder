'use client';

import { useState, useCallback } from 'react';
import { WizardState, WizardStep } from '@/types/wizard';
import { RawRow } from '@/types/data';
import { MappingResult } from '@/types/mapping';
import { ReportData } from '@/types/report';

const initialState: WizardState = {
  step: 1,
  file: null,
  rawHeaders: [],
  rawPreview: [],
  rawData: [],
  mapping: null,
  dateRange: null,
  reportData: null,
  error: null,
  warning: null,
  isProcessing: false,
};

export function useWizardState() {
  const [state, setState] = useState<WizardState>(initialState);

  const setStep = useCallback((step: WizardStep) =>
    setState(prev => ({ ...prev, step, error: null })), []);

  const setFile = useCallback(
    (file: File, headers: string[], preview: RawRow[], data: RawRow[]) =>
      setState(prev => ({
        ...prev,
        file,
        rawHeaders: headers,
        rawPreview: preview,
        rawData: data,
        error: null,
      })),
    [],
  );

  const setMapping = useCallback((mapping: MappingResult) =>
    setState(prev => ({ ...prev, mapping })), []);

  const setDateRange = useCallback((range: { start: string; end: string }) =>
    setState(prev => ({ ...prev, dateRange: range })), []);

  const setReport = useCallback((reportData: ReportData) =>
    setState(prev => ({ ...prev, reportData })), []);

  const setError = useCallback((error: string | null) =>
    setState(prev => ({ ...prev, error })), []);

  const setWarning = useCallback((warning: string | null) =>
    setState(prev => ({ ...prev, warning })), []);

  const setProcessing = useCallback((isProcessing: boolean) =>
    setState(prev => ({ ...prev, isProcessing })), []);

  const reset = useCallback(() => setState(initialState), []);

  return {
    state,
    setStep,
    setFile,
    setMapping,
    setDateRange,
    setReport,
    setError,
    setWarning,
    setProcessing,
    reset,
  };
}

export type WizardAPI = ReturnType<typeof useWizardState>;
