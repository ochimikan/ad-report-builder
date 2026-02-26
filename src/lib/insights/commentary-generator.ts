import { PeriodComparison } from '@/types/report';

function pct(value: number | null): string {
  if (value === null) return '—';
  const abs = Math.abs(value * 100);
  return `${abs.toFixed(1)}%`;
}

function direction(value: number | null): '増加' | '減少' | '横ばい' | null {
  if (value === null) return null;
  if (value >= 0.01) return '増加';
  if (value <= -0.01) return '減少';
  return '横ばい';
}

function directionAdj(value: number | null): '上昇' | '低下' | '横ばい' | null {
  if (value === null) return null;
  if (value >= 0.01) return '上昇';
  if (value <= -0.01) return '低下';
  return '横ばい';
}

function fmtCurrency(value: number): string {
  return `¥${Math.round(value).toLocaleString()}`;
}

function fmtPctValue(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function generateCommentary(comparison: PeriodComparison): string {
  const { current: c, previous: p, deltas: d } = comparison;
  const hasPrevious = p.totalSpend > 0 || p.totalImpressions > 0;

  // 前期データがない場合は当期サマリーのみ
  if (!hasPrevious) {
    const lines: string[] = [];
    lines.push(`対象期間の広告費は${fmtCurrency(c.totalSpend)}、表示回数は${c.totalImpressions.toLocaleString()}回、クリック数は${c.totalClicks.toLocaleString()}回でした。`);
    lines.push(`CTRは${fmtPctValue(c.avgCtr)}、CPCは${fmtCurrency(c.avgCpc)}、CPMは${fmtCurrency(c.avgCpm)}となりました。`);
    if (c.totalConversions > 0) {
      lines.push(`CV数は${c.totalConversions.toLocaleString()}件、CVRは${fmtPctValue(c.avgCvr)}、CPAは${fmtCurrency(c.avgCpa ?? 0)}です。`);
    } else {
      lines.push(`対象期間のCV数は0件でした。`);
    }
    lines.push('（前期の比較データがないため、変化率の評価はできません。）');
    return lines.join('\n');
  }

  // 前期比較あり → 包括コメント生成
  const lines: string[] = [];

  // 広告費
  const spendDir = direction(d.spend);
  if (spendDir && spendDir !== '横ばい') {
    lines.push(`広告費は前期比${pct(d.spend)}${spendDir}の${fmtCurrency(c.totalSpend)}となりました。`);
  } else {
    lines.push(`広告費は${fmtCurrency(c.totalSpend)}で前期とほぼ同水準でした。`);
  }

  // CTR
  const ctrDir = directionAdj(d.ctr);
  if (ctrDir) {
    lines.push(`CTRは${fmtPctValue(c.avgCtr)}（前期比${pct(d.ctr)}${ctrDir}）。`);
  }

  // CPC
  const cpcDir = directionAdj(d.cpc);
  if (cpcDir) {
    lines.push(`CPCは${fmtCurrency(c.avgCpc)}（前期比${pct(d.cpc)}${cpcDir}）。`);
  }

  // CVR
  const cvrDir = directionAdj(d.cvr);
  if (cvrDir) {
    lines.push(`CVRは${fmtPctValue(c.avgCvr)}（前期比${pct(d.cvr)}${cvrDir}）。`);
  }

  // CPA
  if (d.cpa !== null) {
    const cpaDir = directionAdj(d.cpa);
    if (cpaDir) {
      lines.push(`CPAは${fmtCurrency(c.avgCpa ?? 0)}（前期比${pct(d.cpa)}${cpaDir}）。`);
    }
  } else if (c.avgCpa !== null) {
    lines.push(`CPAは${fmtCurrency(c.avgCpa)}（前期にCVがないため比較不可）。`);
  } else {
    lines.push('当期のCV数が0件のため、CPAの評価はできません。');
  }

  // CPM
  const cpmDir = directionAdj(d.cpm);
  if (cpmDir) {
    lines.push(`CPMは${fmtCurrency(c.avgCpm)}（前期比${pct(d.cpm)}${cpmDir}）。`);
  }

  // CV数
  const cvDir = direction(d.conversions);
  if (cvDir && cvDir !== '横ばい') {
    lines.push(`CV数は${c.totalConversions.toLocaleString()}件で前期比${pct(d.conversions)}${cvDir}しました。`);
  } else if (cvDir === '横ばい') {
    lines.push(`CV数は${c.totalConversions.toLocaleString()}件で前期並みでした。`);
  }

  return lines.join('\n');
}
