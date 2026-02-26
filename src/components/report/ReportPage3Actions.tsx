'use client';

import { Lightbulb } from 'lucide-react';

interface Props {
  actions: string[];
}

export function ReportPage3Actions({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="text-gray-500">現時点で特筆すべき改善アクションはありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        KPIの変動に基づいて、以下の改善アクションを提案します。
      </p>
      {actions.map((action, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {i + 1}
          </div>
          <div className="flex items-start gap-2 pt-1">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm text-gray-700">{action}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
