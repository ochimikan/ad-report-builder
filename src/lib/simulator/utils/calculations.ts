import type {
  BudgetInput,
  BudgetResult,
  ComparisonInput,
  ComparisonResult,
  AdPlatform,
  AdGoal,
} from '../types';
import { industryBenchmarks, platformBenchmarks, platformLabels } from '../data/platformBenchmarks';

export function calculateBudget(input: BudgetInput): BudgetResult {
  const { monthlyBudget, cpc, cvr, averageOrderValue } = input;

  if (cpc <= 0) {
    return { estimatedClicks: 0, estimatedConversions: 0, estimatedRevenue: 0, roas: 0, cpa: 0, profitOrLoss: 0 };
  }

  const estimatedClicks = Math.floor(monthlyBudget / cpc);
  const estimatedConversions = Math.round(estimatedClicks * (cvr / 100) * 100) / 100;
  const estimatedRevenue = Math.round(estimatedConversions * averageOrderValue);
  const roas = monthlyBudget > 0 ? Math.round((estimatedRevenue / monthlyBudget) * 100) : 0;
  const cpa = estimatedConversions > 0 ? Math.round(monthlyBudget / estimatedConversions) : 0;
  const profitOrLoss = estimatedRevenue - monthlyBudget;

  return { estimatedClicks, estimatedConversions, estimatedRevenue, roas, cpa, profitOrLoss };
}

export function calculateComparison(input: ComparisonInput): ComparisonResult[] {
  const { monthlyBudget, industry, goal, averageOrderValue } = input;

  const industryData = industryBenchmarks.find(b => b.industry === industry);
  if (!industryData) return [];

  const platforms: AdPlatform[] = ['google', 'meta', 'twitter', 'line', 'tiktok'];
  const results: ComparisonResult[] = [];

  for (const platform of platforms) {
    const benchmark = industryData.platforms[platform];
    const platformData = platformBenchmarks.find(b => b.platform === platform);
    const cpc = benchmark.cpc;
    const cvr = benchmark.cvr;

    const estimatedClicks = cpc > 0 ? Math.floor(monthlyBudget / cpc) : 0;
    const estimatedConversions = Math.round(estimatedClicks * (cvr / 100) * 100) / 100;
    const estimatedRevenue = Math.round(estimatedConversions * averageOrderValue);
    const roas = monthlyBudget > 0 ? Math.round((estimatedRevenue / monthlyBudget) * 100) : 0;
    const cpa = estimatedConversions > 0 ? Math.round(monthlyBudget / estimatedConversions) : 0;

    const score = calculateRecommendationScore(platform, roas, cpa, goal);

    results.push({
      platform,
      platformName: platformLabels[platform],
      color: platformData?.color ?? '#6366f1',
      cpc,
      cvr,
      estimatedClicks,
      estimatedConversions,
      estimatedRevenue,
      roas,
      cpa,
      score,
      recommended: false,
    });
  }

  results.sort((a, b) => b.score - a.score);
  if (results.length > 0) {
    results[0].recommended = true;
  }

  return results;
}

function calculateRecommendationScore(
  platform: AdPlatform,
  roas: number,
  cpa: number,
  goal: AdGoal
): number {
  let score = 0;

  // ROAS component (0-40 points)
  score += Math.min(40, Math.round(roas / 10));

  // CPA component (0-30 points)
  if (cpa > 0) {
    score += Math.max(0, Math.min(30, Math.round(30 - (cpa / 500))));
  }

  // Goal alignment (0-30 points)
  const platformData = platformBenchmarks.find(b => b.platform === platform);
  if (platformData && platformData.bestFor.includes(goal)) {
    score += 30;
  } else {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}
