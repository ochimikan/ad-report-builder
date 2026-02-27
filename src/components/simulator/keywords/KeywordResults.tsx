'use client';

import { useState } from 'react';
import type { GeneratedKeyword, KeywordCategory, MatchType, KeywordResultSummary } from '@/lib/simulator/types';
import { categoryLabels, categoryColors, matchTypeLabels, volumeLabels, competitionLabels } from '@/lib/simulator/data/keywordModifiers';
import { formatCurrency } from '@/lib/simulator/utils/formatters';

interface KeywordResultsProps {
  keywords: GeneratedKeyword[];
  summary: KeywordResultSummary;
  onToggleMatchType: (keyword: string, matchType: MatchType) => void;
  onCopy: () => void;
}

const categories: KeywordCategory[] = ['purchase', 'research', 'comparison_kw', 'brand', 'location'];

function VolumeBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-600',
    low: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level]}`}>
      {volumeLabels[level]}
    </span>
  );
}

function CompetitionBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-amber-100 text-amber-600',
    low: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level]}`}>
      {competitionLabels[level]}
    </span>
  );
}

export function KeywordResults({ keywords, summary, onToggleMatchType, onCopy }: KeywordResultsProps) {
  const [copied, setCopied] = useState(false);

  if (keywords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-400">
        商材名を入力するとキーワード候補が生成されます
      </div>
    );
  }

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            生成結果 <span className="text-sim-primary-600">{summary.total}</span> キーワード
          </h3>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-sim-primary-600 text-white text-sm font-medium rounded-xl hover:bg-sim-primary-700 transition"
          >
            {copied ? 'コピーしました!' : 'すべてコピー'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <span
              key={cat}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: categoryColors[cat] + '18', color: categoryColors[cat] }}
            >
              {categoryLabels[cat]}: {summary.byCategory[cat]}件
            </span>
          ))}
        </div>
      </div>

      {/* Keyword tables by category */}
      {categories.map(cat => {
        const catKeywords = keywords.filter(kw => kw.category === cat);
        if (catKeywords.length === 0) return null;

        return (
          <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: categoryColors[cat] }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
              {categoryLabels[cat]}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500 font-medium">キーワード</th>
                    <th className="text-center py-2 px-2 text-gray-500 font-medium">マッチタイプ</th>
                    <th className="text-center py-2 px-2 text-gray-500 font-medium">ボリューム</th>
                    <th className="text-center py-2 px-2 text-gray-500 font-medium">競合度</th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">推定CPC</th>
                  </tr>
                </thead>
                <tbody>
                  {catKeywords.map(kw => (
                    <tr key={kw.keyword} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-2 font-medium text-gray-800">{kw.keyword}</td>
                      <td className="py-2.5 px-2 text-center">
                        <select
                          value={kw.matchType}
                          onChange={(e) => onToggleMatchType(kw.keyword, e.target.value as MatchType)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                        >
                          {Object.entries(matchTypeLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <VolumeBadge level={kw.volume} />
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <CompetitionBadge level={kw.competition} />
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-700">
                        {formatCurrency(kw.estimatedCpc)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
