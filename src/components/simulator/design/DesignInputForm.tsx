'use client';

import type { AdFormatType, GoogleDisplaySize } from '@/lib/simulator/types';

interface CharLimit {
  headline: number;
  description: number;
  headlineLabel: string;
  descriptionLabel: string;
}

const charLimits: Record<AdFormatType, CharLimit> = {
  google_display: {
    headline: 30,
    description: 90,
    headlineLabel: '見出し（半角30文字 / 全角約15文字）',
    descriptionLabel: '説明文（半角90文字 / 全角約45文字）',
  },
  meta_feed: {
    headline: 40,
    description: 125,
    headlineLabel: '見出し（最大40文字・推奨27文字以内）',
    descriptionLabel: '説明文（表示上限125文字）',
  },
  twitter_ad: {
    headline: 70,
    description: 280,
    headlineLabel: 'カード見出し（最大70文字）',
    descriptionLabel: 'ポストテキスト（最大280文字）',
  },
  line_ad: {
    headline: 20,
    description: 75,
    headlineLabel: 'タイトル（最大20文字）',
    descriptionLabel: '説明文（最大75文字）',
  },
  tiktok_ad: {
    headline: 0,
    description: 50,
    headlineLabel: '見出し（TikTokでは未使用）',
    descriptionLabel: '説明文（日本語最大約50文字）',
  },
};

interface DesignInputFormProps {
  headline: string;
  setHeadline: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  ctaText: string;
  setCtaText: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  brandColor: string;
  setBrandColor: (v: string) => void;
  format: AdFormatType;
  setFormat: (v: AdFormatType) => void;
  googleDisplaySize: GoogleDisplaySize;
  setGoogleDisplaySize: (v: GoogleDisplaySize) => void;
}

const formatOptions: { value: AdFormatType; label: string }[] = [
  { value: 'google_display', label: 'Google Display' },
  { value: 'meta_feed', label: 'Meta (Facebook / Instagram)' },
  { value: 'twitter_ad', label: 'X (Twitter)' },
  { value: 'line_ad', label: 'LINE広告' },
  { value: 'tiktok_ad', label: 'TikTok広告' },
];

const sizeOptions: { value: GoogleDisplaySize; label: string }[] = [
  { value: '300x250', label: '300 x 250 (レクタングル)' },
  { value: '728x90', label: '728 x 90 (リーダーボード)' },
  { value: '160x600', label: '160 x 600 (スカイスクレイパー)' },
];

export function DesignInputForm({
  headline, setHeadline,
  description, setDescription,
  ctaText, setCtaText,
  imageUrl, setImageUrl,
  brandColor, setBrandColor,
  format, setFormat,
  googleDisplaySize, setGoogleDisplaySize,
}: DesignInputFormProps) {
  const limits = charLimits[format];
  const headlineLen = headline.length;
  const descLen = description.length;
  const headlineOver = limits.headline > 0 && headlineLen > limits.headline;
  const descOver = descLen > limits.description;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">広告コンテンツ</h3>
        <p className="text-sm text-gray-500 mt-0.5">テキストと画像を入力してプレビューを確認</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">広告フォーマット</label>
        <div className="flex flex-wrap gap-2">
          {formatOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                format === opt.value
                  ? 'bg-sim-primary-600 text-white border-sim-primary-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sim-primary-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {format === 'google_display' && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">バナーサイズ</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGoogleDisplaySize(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                  googleDisplaySize === opt.value
                    ? 'bg-sim-primary-100 text-sim-primary-700 border-sim-primary-300'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-sim-primary-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{limits.headlineLabel}</label>
          {limits.headline > 0 && (
            <span className={`text-xs font-medium ${headlineOver ? 'text-red-500' : 'text-gray-400'}`}>
              {headlineLen} / {limits.headline}
            </span>
          )}
        </div>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="例: 今だけ50%OFF！春のキャンペーン"
          disabled={limits.headline === 0}
          className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm ${
            limits.headline === 0
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              : headlineOver
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
          }`}
        />
        {headlineOver && (
          <p className="text-xs text-red-500">文字数が上限を超えています</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{limits.descriptionLabel}</label>
          <span className={`text-xs font-medium ${descOver ? 'text-red-500' : 'text-gray-400'}`}>
            {descLen} / {limits.description}
          </span>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: 人気商品が期間限定でお買い得。この機会をお見逃しなく！"
          rows={2}
          className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm resize-none ${
            descOver ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        {descOver && (
          <p className="text-xs text-red-500">文字数が上限を超えています</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">CTAボタン</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="例: 詳しくはこちら"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">ブランドカラー</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">画像URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sim-primary-500 focus:border-sim-primary-500 outline-none transition text-sm"
        />
      </div>
    </div>
  );
}
