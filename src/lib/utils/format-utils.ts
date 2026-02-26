export function formatNumber(value: number | null, decimals = 0): string {
  if (value === null) return '—';
  return value.toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number | null): string {
  if (value === null) return '—';
  return `¥${formatNumber(value)}`;
}

export function formatPercent(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDelta(value: number | null): string {
  if (value === null) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
}

export function formatCpa(value: number | null): string {
  if (value === null) return '—';
  return formatCurrency(Math.round(value));
}
