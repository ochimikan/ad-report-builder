import { PeriodComparison, SegmentBreakdown } from '@/types/report';

interface ActionRule {
  condition: (comparison: PeriodComparison) => boolean;
  actions: string[];
}

function fmtCurrency(v: number): string {
  return `¥${Math.round(v).toLocaleString()}`;
}

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(2)}%`;
}

// ネガティブ（悪化時）ルール
const NEGATIVE_RULES: ActionRule[] = [
  {
    condition: (c) => (c.deltas.cpa ?? 0) >= 0.1,
    actions: [
      'CPA悪化対策：クリエイティブのCTR・CVRを確認し、訴求軸やターゲティングの見直しを検討してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.conversions ?? 0) <= -0.1,
    actions: [
      'CV数減少対策：配信ボリュームの低下やコンバージョンタグの計測漏れがないか確認してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.cpc ?? 0) >= 0.1,
    actions: [
      'CPC上昇対策：入札戦略を見直し、自動入札の学習状況やオークション競合の変化を確認してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.ctr ?? 0) <= -0.05,
    actions: [
      'CTR低下対策：広告文・クリエイティブの疲弊が考えられます。新しい訴求パターンのA/Bテストを検討してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.cvr ?? 0) <= -0.05,
    actions: [
      'CVR低下対策：LPのファーストビューやフォーム導線を見直し、ユーザー体験の改善を検討してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.cpm ?? 0) >= 0.1,
    actions: [
      'CPM上昇対策：配信面の競合環境が変化している可能性があります。配信先やプレースメントの調整を検討してください。',
    ],
  },
  {
    condition: (c) =>
      (c.deltas.spend ?? 0) >= 0.1 &&
      Math.abs(c.deltas.conversions ?? 0) < 0.05,
    actions: [
      '費用対効果確認：広告費が増加していますがCV数が伸びていません。予算配分の最適化を検討してください。',
    ],
  },
];

// ポジティブ（改善時）ルール
const POSITIVE_RULES: ActionRule[] = [
  {
    condition: (c) => (c.deltas.conversions ?? 0) >= 0.1,
    actions: [
      'スケール検討：CV数が増加傾向です。CPAを維持しつつ予算拡大の余地がないか検討してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.cpa ?? 0) <= -0.1,
    actions: [
      '好調要因の分析：CPAが改善しています。寄与しているクリエイティブ・ターゲティングを特定し、横展開を検討してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.ctr ?? 0) >= 0.05,
    actions: [
      'CTR好調の活用：CTRが上昇傾向です。効果の高い広告文を他キャンペーンにも展開してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.cvr ?? 0) >= 0.05,
    actions: [
      'CVR改善の継続：CVRが向上しています。LP改善施策の効果を記録し、他ページへの適用も検討してください。',
    ],
  },
  {
    condition: (c) => (c.deltas.cpc ?? 0) <= -0.1,
    actions: [
      'CPC低下の活用：CPCが改善しています。獲得効率が良いうちにクリック数の拡大を検討してください。',
    ],
  },
  {
    condition: (c) =>
      (c.deltas.spend ?? 0) >= 0.05 &&
      (c.deltas.conversions ?? 0) >= 0.05 &&
      (c.deltas.cpa ?? 0) <= 0.05,
    actions: [
      '効率的な拡大：広告費増に対しCV数も比例して伸びています。さらなる予算配分の最適化を進めてください。',
    ],
  },
];

/** セグメント間の比較からデータドリブンな具体的アクションを生成 */
function generateSegmentActions(
  overallComparison: PeriodComparison,
  segmentBreakdowns: SegmentBreakdown[],
): string[] {
  const actions: string[] = [];

  for (const bd of segmentBreakdowns) {
    const segments = bd.values;
    if (segments.length < 2) continue;

    const colName = bd.segmentColumn;

    // 各セグメントのKPIを収集
    const segData = segments.map(s => ({
      name: s.segmentValue,
      spend: s.comparison.current.totalSpend,
      cv: s.comparison.current.totalConversions,
      cpa: s.comparison.current.avgCpa,
      ctr: s.comparison.current.avgCtr,
      cvr: s.comparison.current.avgCvr,
      cpc: s.comparison.current.avgCpc,
    }));

    // --- CPA比較: 最良 vs 最悪 ---
    const withCpa = segData.filter(s => s.cpa !== null && s.cv > 0);
    if (withCpa.length >= 2) {
      withCpa.sort((a, b) => (a.cpa ?? 0) - (b.cpa ?? 0));
      const best = withCpa[0];
      const worst = withCpa[withCpa.length - 1];
      const diff = ((worst.cpa ?? 0) - (best.cpa ?? 0)) / (best.cpa ?? 1);

      if (diff > 0.15) {
        actions.push(
          `${colName}別CPA最適化：${best.name}のCPA（${fmtCurrency(best.cpa ?? 0)}）は${worst.name}（${fmtCurrency(worst.cpa ?? 0)}）より${Math.round(diff * 100)}%低く効率的です。${worst.name}の予算を${best.name}にシフトし、全体CPAの改善を検討してください。`
        );
      }

      // CPAが最良のセグメントのスケール提案
      if (best.cv > 0) {
        actions.push(
          `${best.name}スケール検討：${best.name}はCPA ${fmtCurrency(best.cpa ?? 0)}で最も効率的です。予算を増やしてCV数の拡大が可能か検証してください。`
        );
      }
    }

    // --- CTR比較: 最良 vs 最悪 ---
    const sortedByCtr = [...segData].sort((a, b) => b.ctr - a.ctr);
    const bestCtr = sortedByCtr[0];
    const worstCtr = sortedByCtr[sortedByCtr.length - 1];
    if (bestCtr.ctr > 0 && worstCtr.ctr > 0) {
      const ctrDiff = (bestCtr.ctr - worstCtr.ctr) / worstCtr.ctr;
      if (ctrDiff > 0.1) {
        actions.push(
          `${colName}別CTR改善：${bestCtr.name}のCTR（${fmtPct(bestCtr.ctr)}）は${worstCtr.name}（${fmtPct(worstCtr.ctr)}）より高いです。${bestCtr.name}のクリエイティブ戦略を${worstCtr.name}にも適用することを検討してください。`
        );
      }
    }

    // --- CVR比較: 最良 vs 最悪 ---
    const sortedByCvr = [...segData].sort((a, b) => b.cvr - a.cvr);
    const bestCvr = sortedByCvr[0];
    const worstCvr = sortedByCvr[sortedByCvr.length - 1];
    if (bestCvr.cvr > 0 && worstCvr.cvr > 0) {
      const cvrDiff = (bestCvr.cvr - worstCvr.cvr) / worstCvr.cvr;
      if (cvrDiff > 0.15) {
        actions.push(
          `${colName}別CVR改善：${bestCvr.name}のCVR（${fmtPct(bestCvr.cvr)}）が最も高く、${worstCvr.name}（${fmtPct(worstCvr.cvr)}）は低めです。${worstCvr.name}のLP・導線の見直しを優先してください。`
        );
      }
    }

    // --- CPC比較: コスト効率 ---
    const sortedByCpc = [...segData].sort((a, b) => a.cpc - b.cpc);
    const cheapCpc = sortedByCpc[0];
    const expCpc = sortedByCpc[sortedByCpc.length - 1];
    if (cheapCpc.cpc > 0 && expCpc.cpc > 0) {
      const cpcDiff = (expCpc.cpc - cheapCpc.cpc) / cheapCpc.cpc;
      if (cpcDiff > 0.2) {
        actions.push(
          `${colName}別CPC最適化：${expCpc.name}のCPC（${fmtCurrency(expCpc.cpc)}）は${cheapCpc.name}（${fmtCurrency(cheapCpc.cpc)}）より${Math.round(cpcDiff * 100)}%高いです。${expCpc.name}の入札戦略やキーワードの見直しを検討してください。`
        );
      }
    }

    // --- 費用配分の偏り ---
    const totalSpend = segData.reduce((s, d) => s + d.spend, 0);
    const totalCv = segData.reduce((s, d) => s + d.cv, 0);
    if (totalSpend > 0 && totalCv > 0) {
      for (const seg of segData) {
        const spendShare = seg.spend / totalSpend;
        const cvShare = seg.cv / totalCv;
        // 広告費のシェアがCVシェアより大幅に高い → 非効率
        if (spendShare > cvShare + 0.1 && spendShare > 0.2) {
          actions.push(
            `${seg.name}の費用対効果：${seg.name}は広告費の${Math.round(spendShare * 100)}%を占めますがCV比率は${Math.round(cvShare * 100)}%です。予算配分の見直しを検討してください。`
          );
        }
      }
    }
  }

  return actions;
}

// 前期データなし・全delta null時のフォールバック
function generateFallbackActions(
  comparison: PeriodComparison,
  segmentBreakdowns: SegmentBreakdown[],
): string[] {
  const c = comparison.current;
  const actions: string[] = [];

  // セグメントベースの具体アクション（最優先）
  const segActions = generateSegmentActions(comparison, segmentBreakdowns);
  actions.push(...segActions);

  // 絶対値ベースの一般提案（セグメントアクションが少ない場合に補完）
  if (actions.length < 3) {
    if (c.avgCtr < 0.02) {
      actions.push('CTR改善：CTRが低い傾向です。広告文やクリエイティブの訴求力を高め、ターゲティングの精度を見直してください。');
    }
    if (c.avgCvr < 0.01) {
      actions.push('CVR改善：CVRが低い傾向です。LPの導線やフォーム設計の見直しを検討してください。');
    }
    if (c.avgCpa !== null && c.avgCpa > 10000) {
      actions.push('CPA管理：CPAが高めです。ターゲティングの絞り込みやLP改善でコスト効率の改善を目指してください。');
    }
    if (c.totalConversions === 0) {
      actions.push('CV獲得：コンバージョンが発生していません。計測設定の確認とLP導線の見直しを優先してください。');
    }
  }

  if (actions.length === 0) {
    actions.push('定期レビュー：主要KPI（CTR・CPC・CVR・CPA）の推移を継続的にモニタリングし、変化があれば早期に対策を検討してください。');
  }

  return actions.slice(0, 7);
}

export function generateActions(
  comparison: PeriodComparison,
  segmentBreakdowns: SegmentBreakdown[] = [],
): string[] {
  const hasPrevious = comparison.previous.totalSpend > 0 || comparison.previous.totalImpressions > 0;

  // 前期データがない場合
  if (!hasPrevious) {
    return generateFallbackActions(comparison, segmentBreakdowns);
  }

  // 前期比較ベースのルール
  const negativeActions: string[] = [];
  const positiveActions: string[] = [];

  for (const rule of NEGATIVE_RULES) {
    if (rule.condition(comparison)) {
      negativeActions.push(...rule.actions);
    }
  }

  for (const rule of POSITIVE_RULES) {
    if (rule.condition(comparison)) {
      positiveActions.push(...rule.actions);
    }
  }

  const ruleActions = [...new Set([...negativeActions, ...positiveActions])];

  // セグメントベースの具体アクションを追加
  const segActions = generateSegmentActions(comparison, segmentBreakdowns);

  // ルールアクション + セグメントアクションを結合
  const combined = [...ruleActions, ...segActions];

  if (combined.length === 0) {
    return ['安定運用中：大きな変動は見られません。現在のKPI水準を維持しつつ、クリエイティブの定期刷新や新規ターゲティングのテストを検討してください。'];
  }

  return combined.slice(0, 7);
}
