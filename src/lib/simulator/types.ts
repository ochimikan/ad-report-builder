export type AdPlatform = 'google' | 'meta' | 'twitter' | 'line' | 'tiktok';

export type Industry =
  | 'ecommerce'
  | 'saas'
  | 'real_estate'
  | 'education'
  | 'healthcare'
  | 'finance'
  | 'food'
  | 'travel'
  | 'apparel'
  | 'beauty';

export type AdGoal = 'awareness' | 'traffic' | 'conversions' | 'app_install';

// Tab 1: Budget Simulation
export interface BudgetInput {
  monthlyBudget: number;
  cpc: number;
  cvr: number;
  averageOrderValue: number;
  platform: AdPlatform;
}

export interface BudgetResult {
  estimatedClicks: number;
  estimatedConversions: number;
  estimatedRevenue: number;
  roas: number;
  cpa: number;
  profitOrLoss: number;
}

// Tab 2: Design Preview
export type GoogleDisplaySize = '300x250' | '728x90' | '160x600';

export type AdFormatType = 'google_display' | 'meta_feed' | 'twitter_ad' | 'line_ad' | 'tiktok_ad';

export interface AdDesignInput {
  headline: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  brandColor: string;
  format: AdFormatType;
  googleDisplaySize: GoogleDisplaySize;
}

// Tab 3: Comparison
export interface PlatformBenchmark {
  platform: AdPlatform;
  platformName: string;
  averageCpc: number;
  averageCvr: number;
  minCpc: number;
  maxCpc: number;
  minCvr: number;
  maxCvr: number;
  strengths: string[];
  bestFor: AdGoal[];
  color: string;
}

export interface IndustryBenchmark {
  industry: Industry;
  industryName: string;
  platforms: Record<AdPlatform, {
    cpc: number;
    cvr: number;
  }>;
}

export interface ComparisonInput {
  monthlyBudget: number;
  industry: Industry;
  goal: AdGoal;
  averageOrderValue: number;
}

export interface ComparisonResult {
  platform: AdPlatform;
  platformName: string;
  color: string;
  cpc: number;
  cvr: number;
  estimatedClicks: number;
  estimatedConversions: number;
  estimatedRevenue: number;
  roas: number;
  cpa: number;
  score: number;
  recommended: boolean;
}

// Tab 4: Keyword Targeting
export type KeywordCategory = 'purchase' | 'research' | 'comparison_kw' | 'brand' | 'location';

export type MatchType = 'exact' | 'phrase' | 'broad';

export type VolumeLevel = 'high' | 'medium' | 'low';

export type CompetitionLevel = 'high' | 'medium' | 'low';

export interface GeneratedKeyword {
  keyword: string;
  category: KeywordCategory;
  matchType: MatchType;
  volume: VolumeLevel;
  competition: CompetitionLevel;
  estimatedCpc: number;
}

export interface KeywordResultSummary {
  total: number;
  byCategory: Record<KeywordCategory, number>;
}

export interface KeywordResults {
  keywords: GeneratedKeyword[];
  negativeKeywords: string[];
  summary: KeywordResultSummary;
}

export type TabId = 'budget' | 'design' | 'comparison' | 'keywords';

export interface TabConfig {
  id: TabId;
  label: string;
  description: string;
}
