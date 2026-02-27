import { cn } from '@/lib/utils';

interface SimResultCardProps {
  label: string;
  value: string;
  sublabel?: string;
  positive?: boolean;
  negative?: boolean;
  large?: boolean;
}

export function SimResultCard({ label, value, sublabel, positive, negative, large }: SimResultCardProps) {
  const valueColor = positive ? 'text-sim-accent-600' : negative ? 'text-red-600' : 'text-foreground';

  return (
    <div className="bg-muted/50 rounded-xl p-4 border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn('font-bold', large ? 'text-2xl' : 'text-lg', valueColor)}>
        {value}
      </p>
      {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
    </div>
  );
}
