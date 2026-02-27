import type { Industry, KeywordCategory, MatchType, VolumeLevel, CompetitionLevel } from '../types';

export const categoryLabels: Record<KeywordCategory, string> = {
  purchase: '購買意図系',
  research: '情報収集系',
  comparison_kw: '比較検討系',
  brand: 'ブランド系',
  location: '地域系',
};

export const categoryColors: Record<KeywordCategory, string> = {
  purchase: '#ef4444',
  research: '#3b82f6',
  comparison_kw: '#f59e0b',
  brand: '#8b5cf6',
  location: '#10b981',
};

export const matchTypeLabels: Record<MatchType, string> = {
  exact: '完全一致',
  phrase: 'フレーズ一致',
  broad: '部分一致',
};

export const volumeLabels: Record<VolumeLevel, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export const competitionLabels: Record<CompetitionLevel, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export interface ModifierEntry {
  suffix: string;
  category: KeywordCategory;
  volumeWeight: number;
  competitionWeight: number;
}

export const genericModifiers: ModifierEntry[] = [
  // Purchase intent
  { suffix: '通販', category: 'purchase', volumeWeight: 0.8, competitionWeight: 0.9 },
  { suffix: '購入', category: 'purchase', volumeWeight: 0.7, competitionWeight: 0.8 },
  { suffix: '申し込み', category: 'purchase', volumeWeight: 0.5, competitionWeight: 0.7 },
  { suffix: '予約', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.7 },
  { suffix: '注文', category: 'purchase', volumeWeight: 0.4, competitionWeight: 0.6 },
  { suffix: '安い', category: 'purchase', volumeWeight: 0.9, competitionWeight: 0.8 },
  { suffix: '格安', category: 'purchase', volumeWeight: 0.7, competitionWeight: 0.7 },
  { suffix: '最安値', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.8 },
  { suffix: '値段', category: 'purchase', volumeWeight: 0.5, competitionWeight: 0.5 },
  { suffix: '料金', category: 'purchase', volumeWeight: 0.7, competitionWeight: 0.6 },

  // Research
  { suffix: 'おすすめ', category: 'research', volumeWeight: 1.0, competitionWeight: 0.9 },
  { suffix: 'ランキング', category: 'research', volumeWeight: 0.9, competitionWeight: 0.8 },
  { suffix: '人気', category: 'research', volumeWeight: 0.8, competitionWeight: 0.7 },
  { suffix: '選び方', category: 'research', volumeWeight: 0.5, competitionWeight: 0.4 },
  { suffix: '効果', category: 'research', volumeWeight: 0.6, competitionWeight: 0.5 },
  { suffix: '使い方', category: 'research', volumeWeight: 0.5, competitionWeight: 0.3 },
  { suffix: 'メリット', category: 'research', volumeWeight: 0.4, competitionWeight: 0.3 },
  { suffix: 'デメリット', category: 'research', volumeWeight: 0.3, competitionWeight: 0.2 },
  { suffix: 'とは', category: 'research', volumeWeight: 0.6, competitionWeight: 0.2 },
  { suffix: '方法', category: 'research', volumeWeight: 0.5, competitionWeight: 0.4 },

  // Comparison
  { suffix: '比較', category: 'comparison_kw', volumeWeight: 0.8, competitionWeight: 0.9 },
  { suffix: '口コミ', category: 'comparison_kw', volumeWeight: 0.9, competitionWeight: 0.7 },
  { suffix: '評判', category: 'comparison_kw', volumeWeight: 0.7, competitionWeight: 0.6 },
  { suffix: 'レビュー', category: 'comparison_kw', volumeWeight: 0.6, competitionWeight: 0.5 },
  { suffix: '違い', category: 'comparison_kw', volumeWeight: 0.4, competitionWeight: 0.4 },
  { suffix: 'vs', category: 'comparison_kw', volumeWeight: 0.3, competitionWeight: 0.5 },

  // Brand
  { suffix: '公式', category: 'brand', volumeWeight: 0.7, competitionWeight: 0.3 },
  { suffix: '公式サイト', category: 'brand', volumeWeight: 0.6, competitionWeight: 0.3 },
  { suffix: 'クーポン', category: 'brand', volumeWeight: 0.5, competitionWeight: 0.5 },
  { suffix: 'キャンペーン', category: 'brand', volumeWeight: 0.4, competitionWeight: 0.4 },

  // Location
  { suffix: '東京', category: 'location', volumeWeight: 0.9, competitionWeight: 0.7 },
  { suffix: '大阪', category: 'location', volumeWeight: 0.7, competitionWeight: 0.6 },
  { suffix: '名古屋', category: 'location', volumeWeight: 0.5, competitionWeight: 0.5 },
  { suffix: '福岡', category: 'location', volumeWeight: 0.4, competitionWeight: 0.4 },
  { suffix: '近く', category: 'location', volumeWeight: 0.6, competitionWeight: 0.3 },
  { suffix: '周辺', category: 'location', volumeWeight: 0.4, competitionWeight: 0.3 },
];

export const industryModifiers: Record<Industry, ModifierEntry[]> = {
  ecommerce: [
    { suffix: '送料無料', category: 'purchase', volumeWeight: 0.8, competitionWeight: 0.7 },
    { suffix: 'セール', category: 'purchase', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: 'ポイント', category: 'purchase', volumeWeight: 0.5, competitionWeight: 0.5 },
    { suffix: '返品', category: 'research', volumeWeight: 0.3, competitionWeight: 0.2 },
  ],
  saas: [
    { suffix: '無料トライアル', category: 'purchase', volumeWeight: 0.8, competitionWeight: 0.7 },
    { suffix: '料金プラン', category: 'research', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: '導入事例', category: 'comparison_kw', volumeWeight: 0.5, competitionWeight: 0.4 },
    { suffix: 'API', category: 'research', volumeWeight: 0.3, competitionWeight: 0.3 },
    { suffix: '連携', category: 'research', volumeWeight: 0.4, competitionWeight: 0.4 },
  ],
  real_estate: [
    { suffix: '賃貸', category: 'purchase', volumeWeight: 0.9, competitionWeight: 0.9 },
    { suffix: '売買', category: 'purchase', volumeWeight: 0.8, competitionWeight: 0.9 },
    { suffix: '相場', category: 'research', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: '間取り', category: 'research', volumeWeight: 0.6, competitionWeight: 0.5 },
    { suffix: '新築', category: 'research', volumeWeight: 0.7, competitionWeight: 0.7 },
  ],
  education: [
    { suffix: '資格', category: 'research', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: 'オンライン', category: 'research', volumeWeight: 0.8, competitionWeight: 0.7 },
    { suffix: '費用', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.5 },
    { suffix: '体験', category: 'purchase', volumeWeight: 0.5, competitionWeight: 0.4 },
  ],
  healthcare: [
    { suffix: '症状', category: 'research', volumeWeight: 0.8, competitionWeight: 0.4 },
    { suffix: '治療', category: 'research', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: '保険適用', category: 'research', volumeWeight: 0.5, competitionWeight: 0.3 },
    { suffix: 'クリニック', category: 'location', volumeWeight: 0.6, competitionWeight: 0.5 },
  ],
  finance: [
    { suffix: '金利', category: 'research', volumeWeight: 0.8, competitionWeight: 0.8 },
    { suffix: 'シミュレーション', category: 'research', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: '審査', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.7 },
    { suffix: '手数料', category: 'research', volumeWeight: 0.5, competitionWeight: 0.5 },
  ],
  food: [
    { suffix: 'メニュー', category: 'research', volumeWeight: 0.8, competitionWeight: 0.5 },
    { suffix: 'デリバリー', category: 'purchase', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: 'テイクアウト', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.5 },
    { suffix: '個室', category: 'research', volumeWeight: 0.4, competitionWeight: 0.3 },
  ],
  travel: [
    { suffix: 'ツアー', category: 'purchase', volumeWeight: 0.8, competitionWeight: 0.8 },
    { suffix: 'ホテル', category: 'purchase', volumeWeight: 0.9, competitionWeight: 0.9 },
    { suffix: '観光', category: 'research', volumeWeight: 0.7, competitionWeight: 0.5 },
    { suffix: '格安航空券', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.7 },
  ],
  apparel: [
    { suffix: 'コーデ', category: 'research', volumeWeight: 0.8, competitionWeight: 0.5 },
    { suffix: 'サイズ', category: 'research', volumeWeight: 0.5, competitionWeight: 0.3 },
    { suffix: '新作', category: 'research', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: 'アウトレット', category: 'purchase', volumeWeight: 0.6, competitionWeight: 0.5 },
  ],
  beauty: [
    { suffix: '成分', category: 'research', volumeWeight: 0.5, competitionWeight: 0.3 },
    { suffix: 'お試し', category: 'purchase', volumeWeight: 0.7, competitionWeight: 0.6 },
    { suffix: '敏感肌', category: 'research', volumeWeight: 0.6, competitionWeight: 0.4 },
    { suffix: 'プチプラ', category: 'purchase', volumeWeight: 0.8, competitionWeight: 0.5 },
  ],
};

export const negativeKeywordTemplates: Record<Industry, string[]> = {
  ecommerce: ['無料', '求人', 'バイト', '手作り', 'DIY', '自作', '中古', 'ジャンク'],
  saas: ['無料', '求人', 'バイト', 'オープンソース', '自作', 'GitHub'],
  real_estate: ['求人', 'バイト', '心霊', '事故物件', 'DIY'],
  education: ['求人', 'バイト', '無料', 'YouTube', '独学'],
  healthcare: ['求人', 'バイト', '自宅', '民間療法', 'Wikipedia'],
  finance: ['求人', 'バイト', '無料', '違法', '闇金'],
  food: ['求人', 'バイト', 'レシピ', '作り方', '自炊', 'まずい'],
  travel: ['求人', 'バイト', '危険', '治安'],
  apparel: ['求人', 'バイト', '手作り', 'DIY', 'リメイク', '古着'],
  beauty: ['求人', 'バイト', '副作用', '危険', '手作り', '100均'],
};
