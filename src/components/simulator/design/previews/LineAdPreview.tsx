'use client';

interface LineAdPreviewProps {
  headline: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  brandColor: string;
}

export function LineAdPreview({ headline, description, ctaText, imageUrl, brandColor }: LineAdPreviewProps) {
  return (
    <div className="max-w-[400px] w-full">
      {/* LINE VOOM / Timeline ad style */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Account header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: brandColor }}>
              Ad
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-gray-900">Your Brand</span>
                {/* LINE official badge */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#06C755" />
                  <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-400">広告</span>
            </div>
          </div>
          {/* More options */}
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </div>

        {/* Post text */}
        <div className="px-3 pb-2">
          <p className="text-[14px] text-gray-800 leading-5">{description || '広告テキストがここに表示されます'}</p>
        </div>

        {/* Image */}
        <div className="w-full aspect-video bg-gray-100 relative">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gradient-to-br from-gray-100 to-gray-200">
              画像プレビュー
            </div>
          )}
        </div>

        {/* CTA section */}
        <div className="px-3 py-3">
          <p className="text-[14px] font-bold text-gray-900 mb-1 leading-tight">{headline || '見出しテキスト'}</p>
          <p className="text-xs text-gray-500 mb-3">yourbrand.com</p>
          <button
            className="w-full py-2.5 rounded-lg text-[14px] font-bold text-white"
            style={{ backgroundColor: brandColor }}
          >
            {ctaText || '詳しくはこちら'}
          </button>
        </div>

        {/* Engagement bar */}
        <div className="flex items-center justify-around px-3 py-2 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-gray-500">
            {/* Like */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span className="text-xs">いいね</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500">
            {/* Comment */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="text-xs">コメント</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500">
            {/* Share */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="text-xs">シェア</span>
          </button>
        </div>
      </div>
    </div>
  );
}
