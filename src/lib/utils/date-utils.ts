export function getDateRange(dates: string[]): { min: string; max: string } {
  const sorted = [...dates].sort();
  return { min: sorted[0], max: sorted[sorted.length - 1] };
}

export function calculatePreviousPeriod(
  start: string,
  end: string,
): { start: string; end: string } {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationMs = endDate.getTime() - startDate.getTime();
  const prevEnd = new Date(startDate.getTime() - 86400000);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  return {
    start: formatDate(prevStart),
    end: formatDate(prevEnd),
  };
}

export function daysBetween(start: string, end: string): number {
  return (
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86400000,
    ) + 1
  );
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
