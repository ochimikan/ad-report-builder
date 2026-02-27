'use client';

import { useKeywordTargeting } from '@/lib/simulator/hooks/useKeywordTargeting';
import { KeywordInputForm } from './KeywordInputForm';
import { KeywordResults } from './KeywordResults';
import { KeywordNegatives } from './KeywordNegatives';

export function KeywordSimulator() {
  const kt = useKeywordTargeting();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">キーワードターゲティングツール</h2>
        <p className="text-sm text-gray-500 mt-1">商材名と業種からキーワード候補を自動生成します</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <KeywordInputForm
            productName={kt.productName} setProductName={kt.setProductName}
            industry={kt.industry} setIndustry={kt.setIndustry}
            seedKeyword={kt.seedKeyword} setSeedKeyword={kt.setSeedKeyword}
            matchType={kt.matchType} setMatchType={kt.setMatchType}
            platform={kt.platform} setPlatform={kt.setPlatform}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <KeywordResults
            keywords={kt.displayKeywords}
            summary={kt.results.summary}
            onToggleMatchType={kt.toggleKeywordMatchType}
            onCopy={kt.copyToClipboard}
          />
          <KeywordNegatives negativeKeywords={kt.results.negativeKeywords} />
        </div>
      </div>
    </div>
  );
}
