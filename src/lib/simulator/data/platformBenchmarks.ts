import type { AdPlatform, PlatformBenchmark, IndustryBenchmark, Industry, AdGoal, TabConfig } from '../types';

export const platformLabels: Record<AdPlatform, string> = {
  google: 'Google Ads',
  meta: 'Meta (Facebook / Instagram)',
  twitter: 'X (Twitter)',
  line: 'LINE広告',
  tiktok: 'TikTok広告',
};

export const industryLabels: Record<Industry, string> = {
  ecommerce: 'ECサイト・通販',
  saas: 'SaaS・ITサービス',
  real_estate: '不動産',
  education: '教育・スクール',
  healthcare: '医療・ヘルスケア',
  finance: '金融・保険',
  food: '飲食・フード',
  travel: '旅行・観光',
  apparel: 'アパレル・ファッション',
  beauty: '美容・コスメ',
};

export const goalLabels: Record<AdGoal, string> = {
  awareness: '認知拡大',
  traffic: 'サイト流入',
  conversions: 'コンバージョン獲得',
  app_install: 'アプリインストール',
};

export const tabs: TabConfig[] = [
  { id: 'budget', label: '予算シミュレーション', description: '広告予算から成果を予測' },
  { id: 'design', label: 'デザインプレビュー', description: '広告クリエイティブをプレビュー' },
  { id: 'comparison', label: '効果比較', description: 'プラットフォーム間で成果を比較' },
  { id: 'keywords', label: 'キーワードツール', description: 'キーワード候補を自動生成' },
];

export const platformBenchmarks: PlatformBenchmark[] = [
  {
    platform: 'google',
    platformName: 'Google Ads',
    averageCpc: 100,
    averageCvr: 3.75,
    minCpc: 50,
    maxCpc: 500,
    minCvr: 1.0,
    maxCvr: 10.0,
    strengths: ['検索意図の高いユーザーへアプローチ', 'リマーケティングが強力', '幅広い配信面'],
    bestFor: ['conversions', 'traffic'],
    color: '#4285F4',
  },
  {
    platform: 'meta',
    platformName: 'Meta (Facebook / Instagram)',
    averageCpc: 120,
    averageCvr: 2.35,
    minCpc: 30,
    maxCpc: 400,
    minCvr: 0.5,
    maxCvr: 8.0,
    strengths: ['精密なターゲティング', 'ビジュアル訴求に強い', '若年層へのリーチ (Instagram)'],
    bestFor: ['awareness', 'conversions'],
    color: '#1877F2',
  },
  {
    platform: 'twitter',
    platformName: 'X (Twitter)',
    averageCpc: 80,
    averageCvr: 1.5,
    minCpc: 20,
    maxCpc: 300,
    minCvr: 0.3,
    maxCvr: 5.0,
    strengths: ['リアルタイム性が高い', '拡散力がある', 'トレンドに乗りやすい'],
    bestFor: ['awareness', 'traffic'],
    color: '#000000',
  },
  {
    platform: 'line',
    platformName: 'LINE広告',
    averageCpc: 70,
    averageCvr: 2.0,
    minCpc: 25,
    maxCpc: 250,
    minCvr: 0.5,
    maxCvr: 6.0,
    strengths: ['日本国内の圧倒的リーチ', '幅広い年齢層', 'LINEアプリ内の多彩な配信面'],
    bestFor: ['awareness', 'traffic', 'app_install'],
    color: '#06C755',
  },
  {
    platform: 'tiktok',
    platformName: 'TikTok広告',
    averageCpc: 60,
    averageCvr: 1.8,
    minCpc: 15,
    maxCpc: 200,
    minCvr: 0.5,
    maxCvr: 5.0,
    strengths: ['Z世代・ミレニアル世代への圧倒的リーチ', '動画で高いエンゲージメント', 'バイラル拡散力'],
    bestFor: ['awareness', 'app_install', 'traffic'],
    color: '#000000',
  },
];

export const industryBenchmarks: IndustryBenchmark[] = [
  {
    industry: 'ecommerce',
    industryName: 'ECサイト・通販',
    platforms: {
      google:  { cpc: 90,  cvr: 4.0 },
      meta:    { cpc: 100, cvr: 3.0 },
      twitter: { cpc: 70,  cvr: 1.5 },
      line:    { cpc: 60,  cvr: 2.5 },
      tiktok:  { cpc: 50,  cvr: 2.2 },
    },
  },
  {
    industry: 'saas',
    industryName: 'SaaS・ITサービス',
    platforms: {
      google:  { cpc: 200, cvr: 3.0 },
      meta:    { cpc: 180, cvr: 2.0 },
      twitter: { cpc: 120, cvr: 1.0 },
      line:    { cpc: 100, cvr: 1.5 },
      tiktok:  { cpc: 80,  cvr: 1.2 },
    },
  },
  {
    industry: 'real_estate',
    industryName: '不動産',
    platforms: {
      google:  { cpc: 250, cvr: 2.5 },
      meta:    { cpc: 150, cvr: 1.8 },
      twitter: { cpc: 100, cvr: 0.8 },
      line:    { cpc: 90,  cvr: 1.2 },
      tiktok:  { cpc: 70,  cvr: 0.9 },
    },
  },
  {
    industry: 'education',
    industryName: '教育・スクール',
    platforms: {
      google:  { cpc: 150, cvr: 4.5 },
      meta:    { cpc: 120, cvr: 3.5 },
      twitter: { cpc: 80,  cvr: 1.8 },
      line:    { cpc: 70,  cvr: 2.8 },
      tiktok:  { cpc: 55,  cvr: 2.0 },
    },
  },
  {
    industry: 'healthcare',
    industryName: '医療・ヘルスケア',
    platforms: {
      google:  { cpc: 180, cvr: 3.2 },
      meta:    { cpc: 140, cvr: 2.2 },
      twitter: { cpc: 90,  cvr: 1.2 },
      line:    { cpc: 80,  cvr: 1.8 },
      tiktok:  { cpc: 65,  cvr: 1.5 },
    },
  },
  {
    industry: 'finance',
    industryName: '金融・保険',
    platforms: {
      google:  { cpc: 300, cvr: 2.8 },
      meta:    { cpc: 200, cvr: 1.5 },
      twitter: { cpc: 150, cvr: 0.8 },
      line:    { cpc: 120, cvr: 1.0 },
      tiktok:  { cpc: 100, cvr: 0.7 },
    },
  },
  {
    industry: 'food',
    industryName: '飲食・フード',
    platforms: {
      google:  { cpc: 80,  cvr: 5.0 },
      meta:    { cpc: 70,  cvr: 3.8 },
      twitter: { cpc: 50,  cvr: 2.0 },
      line:    { cpc: 45,  cvr: 3.0 },
      tiktok:  { cpc: 35,  cvr: 2.8 },
    },
  },
  {
    industry: 'travel',
    industryName: '旅行・観光',
    platforms: {
      google:  { cpc: 120, cvr: 3.5 },
      meta:    { cpc: 100, cvr: 2.8 },
      twitter: { cpc: 70,  cvr: 1.5 },
      line:    { cpc: 65,  cvr: 2.0 },
      tiktok:  { cpc: 50,  cvr: 1.8 },
    },
  },
  {
    industry: 'apparel',
    industryName: 'アパレル・ファッション',
    platforms: {
      google:  { cpc: 110, cvr: 3.0 },
      meta:    { cpc: 90,  cvr: 3.5 },
      twitter: { cpc: 60,  cvr: 1.8 },
      line:    { cpc: 55,  cvr: 2.2 },
      tiktok:  { cpc: 40,  cvr: 2.5 },
    },
  },
  {
    industry: 'beauty',
    industryName: '美容・コスメ',
    platforms: {
      google:  { cpc: 130, cvr: 3.5 },
      meta:    { cpc: 100, cvr: 4.0 },
      twitter: { cpc: 75,  cvr: 2.0 },
      line:    { cpc: 65,  cvr: 2.8 },
      tiktok:  { cpc: 45,  cvr: 3.2 },
    },
  },
];

export const defaultBudgetInput = {
  monthlyBudget: 300000,
  cpc: 100,
  cvr: 3.0,
  averageOrderValue: 5000,
};

export const defaultComparisonInput = {
  monthlyBudget: 500000,
  averageOrderValue: 5000,
};
