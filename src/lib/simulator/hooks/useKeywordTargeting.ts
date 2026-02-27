'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Industry, AdPlatform, MatchType, GeneratedKeyword } from '@/lib/simulator/types';
import { generateKeywords } from '@/lib/simulator/utils/keywordGenerator';

export function useKeywordTargeting() {
  const [productName, setProductName] = useState('');
  const [industry, setIndustry] = useState<Industry>('ecommerce');
  const [seedKeyword, setSeedKeyword] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('phrase');
  const [platform, setPlatform] = useState<AdPlatform>('google');
  const [matchTypeOverrides, setMatchTypeOverrides] = useState<Map<string, MatchType>>(new Map());

  const results = useMemo(
    () => generateKeywords(productName, industry, seedKeyword, matchType, platform),
    [productName, industry, seedKeyword, matchType, platform],
  );

  const toggleKeywordMatchType = useCallback((keyword: string, newMatchType: MatchType) => {
    setMatchTypeOverrides(prev => {
      const next = new Map(prev);
      next.set(keyword, newMatchType);
      return next;
    });
  }, []);

  const displayKeywords: GeneratedKeyword[] = useMemo(() => {
    return results.keywords.map(kw => ({
      ...kw,
      matchType: matchTypeOverrides.get(kw.keyword) ?? kw.matchType,
    }));
  }, [results.keywords, matchTypeOverrides]);

  const copyToClipboard = useCallback(async () => {
    const lines = displayKeywords.map(kw => kw.keyword);
    await navigator.clipboard.writeText(lines.join('\n'));
  }, [displayKeywords]);

  const setMatchTypeAndReset = useCallback((mt: MatchType) => {
    setMatchType(mt);
    setMatchTypeOverrides(new Map());
  }, []);

  return {
    productName, setProductName,
    industry, setIndustry,
    seedKeyword, setSeedKeyword,
    matchType, setMatchType: setMatchTypeAndReset,
    platform, setPlatform,
    results,
    displayKeywords,
    toggleKeywordMatchType,
    copyToClipboard,
  };
}
