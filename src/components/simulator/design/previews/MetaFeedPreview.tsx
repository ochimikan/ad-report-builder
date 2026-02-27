'use client';

interface MetaFeedPreviewProps {
  headline: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  brandColor: string;
}

export function MetaFeedPreview({ headline, description, ctaText, imageUrl, brandColor }: MetaFeedPreviewProps) {
  return (
    <div className="max-w-[400px] w-full">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: brandColor }}>
              Ad
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-gray-900">Your Brand</span>
                {/* Verified badge */}
                <svg className="w-3.5 h-3.5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5L6 12l1.5-1.5 3 3 6-6L18 9l-7.5 7.5z" />
                </svg>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>スポンサー</span>
                <span>・</span>
                {/* Globe icon */}
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm5.6 5.6h-2.1c-.2-1.2-.6-2.2-1.1-3a6 6 0 013.2 3zM8 1.4c.7.8 1.3 2 1.5 3.2H6.5C6.7 3.4 7.3 2.2 8 1.4zM1.6 9.6c-.1-.5-.2-1-.2-1.6s.1-1.1.2-1.6h2.5c-.1.5-.1 1-.1 1.6s0 1.1.1 1.6H1.6zm.8 1.6h2.1c.2 1.2.6 2.2 1.1 3a6 6 0 01-3.2-3zM4.5 5.6H2.4a6 6 0 013.2-3c-.5.8-.9 1.8-1.1 3zm3.5 9.2c-.7-.8-1.3-2-1.5-3.2h3C9.3 12.8 8.7 14 8 14.8zM9.7 9.6H6.3c-.1-.5-.1-1.1-.1-1.6s0-1.1.1-1.6h3.4c.1.5.1 1.1.1 1.6s0 1.1-.1 1.6zm.7 4.6c.5-.8.9-1.8 1.1-3h2.1a6 6 0 01-3.2 3zm1.3-4.6c.1-.5.1-1 .1-1.6s0-1.1-.1-1.6h2.5c.1.5.2 1 .2 1.6s-.1 1.1-.2 1.6h-2.5z" />
                </svg>
              </div>
            </div>
          </div>
          {/* More options */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* Post text */}
        <div className="px-3 pb-2">
          <p className="text-[14px] text-gray-900 leading-5">{description || '広告テキストがここに表示されます'}</p>
        </div>

        {/* Image */}
        <div className="w-full aspect-square bg-gray-100 relative">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gradient-to-br from-gray-100 to-gray-200">
              画像プレビュー
            </div>
          )}
        </div>

        {/* CTA section */}
        <div className="px-3 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-xs text-gray-500 truncate">yourbrand.com</p>
            <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{headline || '見出しテキスト'}</p>
          </div>
          <button
            className="px-4 py-2 rounded-md text-[13px] font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            {ctaText || '詳しくはこちら'}
          </button>
        </div>

        {/* Reaction summary */}
        <div className="px-3 py-1.5 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <span className="w-[18px] h-[18px] rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[9px]">👍</span>
              <span className="w-[18px] h-[18px] rounded-full bg-red-500 flex items-center justify-center text-white text-[9px]">❤️</span>
            </div>
            <span className="ml-1">128</span>
          </div>
          <div className="flex gap-3">
            <span>コメント24件</span>
            <span>シェア8件</span>
          </div>
        </div>

        {/* Engagement bar */}
        <div className="flex items-center justify-around px-2 py-1.5 border-t border-gray-100">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 9V5a3 3 0 00-6 0v.5M4 12h2l1-1h4l2 2h3a2 2 0 012 2v0a2 2 0 01-2 2H9l-2 2H4v-7z" />
            </svg>
            <span className="text-[13px] font-medium">いいね！</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="text-[13px] font-medium">コメント</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12l1.5-1.5L9 14l6.5-6.5L17 9M22 2l-7 20-4-9-9-4z" />
            </svg>
            <span className="text-[13px] font-medium">シェア</span>
          </button>
        </div>
      </div>
    </div>
  );
}
