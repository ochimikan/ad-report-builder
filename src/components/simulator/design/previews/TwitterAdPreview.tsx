'use client';

interface TwitterAdPreviewProps {
  headline: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  brandColor: string;
}

export function TwitterAdPreview({ headline, description, imageUrl, brandColor }: TwitterAdPreviewProps) {
  return (
    <div className="max-w-[420px] w-full">
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="flex items-start gap-3 px-4 pt-3 pb-2">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: brandColor }}>
            Ad
          </div>

          <div className="flex-1 min-w-0">
            {/* Name row with 広告 label on the right */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                <span className="text-[15px] font-bold text-gray-900">Your Brand</span>
                {/* Verified badge (gold for business) */}
                <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" fill="#E8A600" />
                  <path d="M9.5 17.3l-4.3-4.3 1.4-1.4 2.9 2.9 6.9-6.9 1.4 1.4-8.3 8.3z" fill="white" />
                </svg>
                <span className="text-[15px] text-gray-500 truncate">@yourbrand</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <span className="text-[13px] text-gray-500">広告</span>
                <svg className="w-[18px] h-[18px] text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </div>
            </div>

            {/* Tweet text */}
            <p className="text-[15px] text-gray-900 mt-1 leading-5">{description || '広告テキストがここに表示されます'}</p>
            <span className="text-[15px] text-[#1d9bf0] cursor-pointer">さらに表示</span>

            {/* Image card with overlay headline */}
            <div className="mt-3 rounded-2xl border border-gray-200 overflow-hidden cursor-pointer">
              <div className="w-full aspect-[1.2/1] bg-gray-100 relative">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                    画像プレビュー
                  </div>
                )}
                {/* Headline overlay on bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                  <p className="text-white text-[15px] font-normal leading-tight truncate">{headline || '見出しテキスト'}</p>
                </div>
              </div>
              {/* Domain below card */}
              <div className="px-3 py-1.5 bg-white border-t border-gray-100">
                <p className="text-[13px] text-gray-500">yourbrand.comから</p>
              </div>
            </div>

            {/* Engagement bar */}
            <div className="flex items-center justify-between mt-3 pr-4">
              {/* Reply */}
              <div className="flex items-center gap-1 text-gray-500 group cursor-pointer">
                <div className="p-1.5 rounded-full group-hover:bg-blue-50">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.25-.893 4.306-2.394 5.813l-5.412 5.412a.749.749 0 01-1.06 0l-.22-.22a.749.749 0 010-1.06l5.122-5.122A6.126 6.126 0 0020.251 10.13 6.126 6.126 0 0014.122 4H9.756a6 6 0 00-6.005 6v2.104l2.22-2.22a.749.749 0 011.06 0l.22.22a.749.749 0 010 1.06l-3.97 3.97a.749.749 0 01-1.06 0L.25 13.164a.749.749 0 010-1.06l.22-.22a.749.749 0 011.06 0l.22.22V10z" />
                  </svg>
                </div>
              </div>
              {/* Repost */}
              <div className="flex items-center gap-1 text-gray-500 group cursor-pointer">
                <div className="p-1.5 rounded-full group-hover:bg-green-50">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
                  </svg>
                </div>
              </div>
              {/* Like */}
              <div className="flex items-center gap-0.5 text-gray-500 group cursor-pointer">
                <div className="p-1.5 rounded-full group-hover:bg-pink-50">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                  </svg>
                </div>
                <span className="text-[13px]">1</span>
              </div>
              {/* Views */}
              <div className="flex items-center gap-0.5 text-gray-500 group cursor-pointer">
                <div className="p-1.5 rounded-full group-hover:bg-blue-50">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.75 21V3h2v18h-2zM18.75 21V8.5h2V21h-2zM13.75 21v-9h2v9h-2zM3.75 21v-4h2v4h-2z" />
                  </svg>
                </div>
                <span className="text-[13px]">2.4万</span>
              </div>
              {/* Bookmark & Share */}
              <div className="flex items-center gap-0">
                <div className="p-1.5 rounded-full hover:bg-blue-50 text-gray-500 cursor-pointer">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
                  </svg>
                </div>
                <div className="p-1.5 rounded-full hover:bg-blue-50 text-gray-500 cursor-pointer">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
