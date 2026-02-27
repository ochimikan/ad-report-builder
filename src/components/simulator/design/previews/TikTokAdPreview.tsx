'use client';

interface TikTokAdPreviewProps {
  headline: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  brandColor: string;
}

export function TikTokAdPreview({ headline, description, ctaText, imageUrl, brandColor }: TikTokAdPreviewProps) {
  return (
    <div className="max-w-[300px] w-full">
      <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative" style={{ aspectRatio: '9/16', maxHeight: 520 }}>
        {/* Background image/video */}
        <div className="absolute inset-0 bg-gray-900">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
              動画プレビュー
            </div>
          )}
        </div>

        {/* Top bar - "Following | For You" */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center gap-4 pt-3 pb-2">
          <span className="text-white/60 text-[13px] font-medium">フォロー中</span>
          <span className="text-white text-[13px] font-bold border-b-2 border-white pb-0.5">おすすめ</span>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Right side action buttons */}
        <div className="absolute right-2.5 bottom-36 flex flex-col items-center gap-5 z-10">
          {/* Profile */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold overflow-hidden" style={{ backgroundColor: brandColor }}>
              Ad
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
          {/* Heart */}
          <div className="text-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
            </svg>
            <span className="text-white text-[11px] font-medium">1.2K</span>
          </div>
          {/* Comment */}
          <div className="text-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            <span className="text-white text-[11px] font-medium">89</span>
          </div>
          {/* Bookmark */}
          <div className="text-center">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="text-white text-[11px] font-medium">24</span>
          </div>
          {/* Share */}
          <div className="text-center">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
            <span className="text-white text-[11px] font-medium">Share</span>
          </div>
          {/* Music disc */}
          <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandColor }} />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-14 z-10 p-3.5">
          {/* Username */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-white text-[14px] font-bold">@yourbrand</span>
            <span className="text-[10px] text-white/80 border border-white/40 px-1.5 py-0.5 rounded-sm font-medium">広告</span>
          </div>
          {/* Description */}
          <p className="text-white text-[13px] leading-[18px] mb-2.5">{description || '説明文がここに表示されます'}</p>

          {/* Music ticker */}
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-3.5 h-3.5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="text-white text-[12px] truncate">Original Sound - yourbrand</span>
          </div>

          {/* CTA button */}
          <button
            className="w-full py-2.5 rounded-lg text-[14px] font-bold text-white flex items-center justify-center gap-1.5"
            style={{ backgroundColor: brandColor }}
          >
            {ctaText || '詳しくはこちら'}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
