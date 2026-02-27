import type {
  Industry, AdPlatform, KeywordCategory, MatchType,
  VolumeLevel, CompetitionLevel, GeneratedKeyword, KeywordResults,
} from '../types';
import { genericModifiers, industryModifiers, negativeKeywordTemplates } from '../data/keywordModifiers';
import { industryBenchmarks } from '../data/platformBenchmarks';

function toVolumeLevel(weight: number): VolumeLevel {
  if (weight >= 0.7) return 'high';
  if (weight >= 0.4) return 'medium';
  return 'low';
}

function toCompetitionLevel(weight: number): CompetitionLevel {
  if (weight >= 0.7) return 'high';
  if (weight >= 0.4) return 'medium';
  return 'low';
}

function getEstimatedCpc(industry: Industry, platform: AdPlatform, competitionWeight: number): number {
  const data = industryBenchmarks.find(b => b.industry === industry);
  if (!data) return 100;
  const baseCpc = data.platforms[platform].cpc;
  return Math.round(baseCpc * (0.5 + competitionWeight));
}

const emptyByCategory: Record<KeywordCategory, number> = {
  purchase: 0, research: 0, comparison_kw: 0, brand: 0, location: 0,
};

export function generateKeywords(
  productName: string,
  industry: Industry,
  seedKeyword: string,
  matchType: MatchType,
  platform: AdPlatform,
): KeywordResults {
  if (!productName.trim()) {
    return { keywords: [], negativeKeywords: [], summary: { total: 0, byCategory: { ...emptyByCategory } } };
  }

  const baseKeyword = seedKeyword.trim() || productName.trim();
  const keywords: GeneratedKeyword[] = [];
  const allModifiers = [...genericModifiers, ...(industryModifiers[industry] || [])];

  for (const mod of allModifiers) {
    keywords.push({
      keyword: `${baseKeyword} ${mod.suffix}`,
      category: mod.category,
      matchType,
      volume: toVolumeLevel(mod.volumeWeight),
      competition: toCompetitionLevel(mod.competitionWeight),
      estimatedCpc: getEstimatedCpc(industry, platform, mod.competitionWeight),
    });
  }

  // Add brand keywords with productName if seedKeyword differs
  if (seedKeyword.trim() && seedKeyword.trim() !== productName.trim()) {
    const brandSuffixes = ['公式', '公式サイト', '口コミ', '評判'];
    for (const suffix of brandSuffixes) {
      const kw = `${productName.trim()} ${suffix}`;
      if (!keywords.some(k => k.keyword === kw)) {
        keywords.push({
          keyword: kw,
          category: 'brand',
          matchType,
          volume: toVolumeLevel(0.5),
          competition: toCompetitionLevel(0.3),
          estimatedCpc: getEstimatedCpc(industry, platform, 0.3),
        });
      }
    }
  }

  const byCategory = { ...emptyByCategory };
  for (const kw of keywords) {
    byCategory[kw.category]++;
  }

  return {
    keywords,
    negativeKeywords: negativeKeywordTemplates[industry] || [],
    summary: { total: keywords.length, byCategory },
  };
}
