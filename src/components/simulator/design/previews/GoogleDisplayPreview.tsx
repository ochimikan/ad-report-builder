'use client';

import type { GoogleDisplaySize } from '@/lib/simulator/types';

interface GoogleDisplayPreviewProps {
  headline: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  brandColor: string;
  size: GoogleDisplaySize;
}

const sizeMap: Record<GoogleDisplaySize, { width: number; height: number }> = {
  '300x250': { width: 300, height: 250 },
  '728x90': { width: 728, height: 90 },
  '160x600': { width: 160, height: 600 },
};

export function GoogleDisplayPreview({ headline, description, ctaText, imageUrl, brandColor, size }: GoogleDisplayPreviewProps) {
  const { width, height } = sizeMap[size];

  if (size === '728x90') {
    return (
      <div className="inline-block">
        <div
          className="border border-gray-300 bg-white overflow-hidden flex"
          style={{ width, height }}
        >
          {imageUrl && (
            <div className="h-full w-[90px] flex-shrink-0">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          )}
          <div className="flex-1 flex items-center justify-between px-3 gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{headline || '見出しテキスト'}</p>
              <p className="text-[10px] text-gray-500 truncate">{description || '説明文'}</p>
            </div>
            <button
              className="px-3 py-1 rounded text-[10px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              {ctaText || 'CTA'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (size === '160x600') {
    return (
      <div className="inline-block">
        <div
          className="border border-gray-300 bg-white overflow-hidden flex flex-col"
          style={{ width, height }}
        >
          {imageUrl && (
            <div className="w-full h-[200px] flex-shrink-0">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-between p-3">
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">{headline || '見出しテキスト'}</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">{description || '説明文'}</p>
            </div>
            <button
              className="w-full py-2 rounded text-xs font-bold text-white mt-2"
              style={{ backgroundColor: brandColor }}
            >
              {ctaText || 'CTA'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 300x250 (default)
  return (
    <div className="inline-block">
      <div
        className="border border-gray-300 bg-white overflow-hidden flex flex-col"
        style={{ width, height }}
      >
        {imageUrl && (
          <div className="w-full h-[140px] flex-shrink-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between p-3">
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{headline || '見出しテキスト'}</p>
            <p className="text-xs text-gray-500 mt-1">{description || '説明文'}</p>
          </div>
          <button
            className="w-full py-2 rounded text-xs font-bold text-white"
            style={{ backgroundColor: brandColor }}
          >
            {ctaText || 'CTA'}
          </button>
        </div>
      </div>
    </div>
  );
}
