'use client';

import { useState, useCallback } from 'react';

interface KeywordNegativesProps {
  negativeKeywords: string[];
}

export function KeywordNegatives({ negativeKeywords }: KeywordNegativesProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(negativeKeywords.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [negativeKeywords]);

  if (negativeKeywords.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">除外キーワード候補</h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium text-sim-primary-600 border border-sim-primary-200 rounded-lg hover:bg-sim-primary-50 transition"
        >
          {copied ? 'コピー済み' : 'コピー'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-3">この業種で無関係なクリックを防ぐための除外キーワード候補です</p>
      <div className="flex flex-wrap gap-2">
        {negativeKeywords.map((kw) => (
          <span
            key={kw}
            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 font-medium"
          >
            -{kw}
          </span>
        ))}
      </div>
    </div>
  );
}
