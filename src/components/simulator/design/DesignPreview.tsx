'use client';

import { useState } from 'react';
import type { AdFormatType, GoogleDisplaySize } from '@/lib/simulator/types';
import { DesignInputForm } from './DesignInputForm';
import { GoogleDisplayPreview } from './previews/GoogleDisplayPreview';
import { MetaFeedPreview } from './previews/MetaFeedPreview';
import { TwitterAdPreview } from './previews/TwitterAdPreview';
import { LineAdPreview } from './previews/LineAdPreview';
import { TikTokAdPreview } from './previews/TikTokAdPreview';

export function DesignPreview() {
  const [headline, setHeadline] = useState('今だけ50%OFF！春のキャンペーン');
  const [description, setDescription] = useState('人気商品が期間限定でお買い得。この機会をお見逃しなく！');
  const [ctaText, setCtaText] = useState('詳しくはこちら');
  const [imageUrl, setImageUrl] = useState('');
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [format, setFormat] = useState<AdFormatType>('meta_feed');
  const [googleDisplaySize, setGoogleDisplaySize] = useState<GoogleDisplaySize>('300x250');

  const previewProps = { headline, description, ctaText, imageUrl, brandColor };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">広告デザインプレビュー</h2>
        <p className="text-sm text-gray-500 mt-1">各プラットフォームでの広告表示をプレビューできます</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DesignInputForm
          headline={headline} setHeadline={setHeadline}
          description={description} setDescription={setDescription}
          ctaText={ctaText} setCtaText={setCtaText}
          imageUrl={imageUrl} setImageUrl={setImageUrl}
          brandColor={brandColor} setBrandColor={setBrandColor}
          format={format} setFormat={setFormat}
          googleDisplaySize={googleDisplaySize} setGoogleDisplaySize={setGoogleDisplaySize}
        />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">プレビュー</h3>
          <p className="text-xs text-gray-500 mb-4">
            {format === 'google_display' && 'Google Display Network'}
            {format === 'meta_feed' && 'Facebook / Instagram フィード広告'}
            {format === 'twitter_ad' && 'X (Twitter) プロモツイート'}
            {format === 'line_ad' && 'LINE広告'}
            {format === 'tiktok_ad' && 'TikTok インフィード広告'}
          </p>

          <div className="flex justify-center overflow-auto py-4 bg-gray-50 rounded-xl border border-gray-100">
            {format === 'google_display' && (
              <GoogleDisplayPreview {...previewProps} size={googleDisplaySize} />
            )}
            {format === 'meta_feed' && (
              <MetaFeedPreview {...previewProps} />
            )}
            {format === 'twitter_ad' && (
              <TwitterAdPreview {...previewProps} />
            )}
            {format === 'line_ad' && (
              <LineAdPreview {...previewProps} />
            )}
            {format === 'tiktok_ad' && (
              <TikTokAdPreview {...previewProps} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
