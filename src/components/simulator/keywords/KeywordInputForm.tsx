'use client';

import type { Industry, AdPlatform, MatchType } from '@/lib/simulator/types';
import { industryLabels } from '@/lib/simulator/data/platformBenchmarks';
import { matchTypeLabels } from '@/lib/simulator/data/keywordModifiers';
import { SimSelectInput } from '@/components/simulator/shared/SimSelectInput';
import { SimPlatformSelector } from '@/components/simulator/shared/SimPlatformSelector';

interface KeywordInputFormProps {
  productName: string;
  setProductName: (v: string) => void;
  industry: Industry;
  setIndustry: (v: Industry) => void;
  seedKeyword: string;
  setSeedKeyword: (v: string) => void;
  matchType: MatchType;
  setMatchType: (v: MatchType) => void;
  platform: AdPlatform;
  setPlatform: (v: AdPlatform) => void;
}

export function KeywordInputForm({
  productName, setProductName,
  industry, setIndustry,
  seedKeyword, setSeedKeyword,
  matchType, setMatchType,
  platform, setPlatform,
}: KeywordInputFormProps) {
  const industryOptions = Object.entries(industryLabels).map(([value, label]) => ({ value, label }));
  const matchTypeOptions = Object.entries(matchTypeLabels).map(([value, label]) => ({ value, label }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">キーワード設定</h3>
        <p className="text-sm text-gray-500 mt-0.5">商材名を入力してキーワードを生成</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          商材名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="例: 化粧品、会計ソフト、英会話スクール"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm"
        />
      </div>

      <SimSelectInput
        label="業種"
        value={industry}
        onChange={(v) => setIndustry(v as Industry)}
        options={industryOptions}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">シードキーワード（任意）</label>
        <input
          type="text"
          value={seedKeyword}
          onChange={(e) => setSeedKeyword(e.target.value)}
          placeholder="例: スキンケア"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm"
        />
        <p className="text-xs text-gray-400">空欄の場合、商材名をベースに生成します</p>
      </div>

      <SimSelectInput
        label="デフォルトマッチタイプ"
        value={matchType}
        onChange={(v) => setMatchType(v as MatchType)}
        options={matchTypeOptions}
      />

      <div>
        <SimPlatformSelector selected={platform} onChange={setPlatform} />
        <p className="text-xs text-gray-400 mt-1">CPC推定の基準プラットフォームを選択</p>
      </div>
    </div>
  );
}
