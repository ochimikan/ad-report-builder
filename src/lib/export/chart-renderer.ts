export async function captureChartAsImage(
  chartContainerId: string,
): Promise<string> {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(chartContainerId);
  if (!element) {
    throw new Error(`チャートコンテナ #${chartContainerId} が見つかりません`);
  }

  // Temporarily remove all stylesheets to avoid oklch parsing errors,
  // then capture with inline styles only
  const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
  const removed: { el: Element; parent: Node }[] = [];

  styleSheets.forEach(el => {
    if (el.parentNode) {
      removed.push({ el, parent: el.parentNode });
      el.parentNode.removeChild(el);
    }
  });

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } finally {
    // Restore all stylesheets
    removed.forEach(({ el, parent }) => {
      parent.appendChild(el);
    });
  }
}

export interface ChartImages {
  spend: string;
  cv: string;
  cpa: string;
  cpc: string;
  ctr: string;
  cvr: string;
}

export async function captureAllCharts(): Promise<ChartImages> {
  // Capture sequentially to avoid race conditions with stylesheet removal
  const spend = await captureChartAsImage('chart-spend');
  const cv = await captureChartAsImage('chart-cv');
  const cpa = await captureChartAsImage('chart-cpa');
  const cpc = await captureChartAsImage('chart-cpc');
  const ctr = await captureChartAsImage('chart-ctr');
  const cvr = await captureChartAsImage('chart-cvr');
  return { spend, cv, cpa, cpc, ctr, cvr };
}

export interface SegmentChartImages {
  [segmentColumn: string]: {
    [kpi: string]: string;
  };
}

export async function captureSegmentCharts(
  segmentColumns: string[],
): Promise<SegmentChartImages> {
  const kpis = ['spend', 'cv', 'cpa', 'cpc', 'ctr', 'cvr'];
  const result: SegmentChartImages = {};

  for (const col of segmentColumns) {
    result[col] = {};
    for (const kpi of kpis) {
      const id = `segment-chart-${col}-${kpi}`;
      try {
        result[col][kpi] = await captureChartAsImage(id);
      } catch {
        // Skip if chart not rendered
      }
    }
  }

  return result;
}
