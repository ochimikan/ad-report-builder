'use client';

import type { ComparisonResult } from '@/lib/simulator/types';
import { platformBenchmarks } from '@/lib/simulator/data/platformBenchmarks';
import { formatCurrency } from '@/lib/simulator/utils/formatters';

interface RecommendationCardProps {
  results: ComparisonResult[];
}

export function RecommendationCard({ results }: RecommendationCardProps) {
  const recommended = results.find(r => r.recommended);
  if (!recommended) return null;

  const benchmark = platformBenchmarks.find(b => b.platform === recommended.platform);

  return (
    <div className="bg-gradient-to-br from-sim-primary-50 to-sim-accent-50 rounded-2xl border border-sim-primary-100 p-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-sim-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            おすすめ: {recommended.platformName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            スコア <span className="font-bold text-sim-primary-700">{recommended.score}</span>/100
            ・推定ROAS <span className={`font-bold ${recommended.roas >= 100 ? 'text-sim-accent-600' : 'text-red-500'}`}>{recommended.roas}%</span>
            ・CPA {formatCurrency(recommended.cpa)}
          </p>

          {benchmark && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500 mb-1.5">このプラットフォームの強み:</p>
              <div className="flex flex-wrap gap-1.5">
                {benchmark.strengths.map((s, i) => (
                  <span key={i} className="text-xs bg-white/80 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
