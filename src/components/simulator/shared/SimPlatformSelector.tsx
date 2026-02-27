'use client';

import type { AdPlatform } from '@/lib/simulator/types';
import { platformBenchmarks } from '@/lib/simulator/data/platformBenchmarks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimPlatformSelectorProps {
  selected: AdPlatform;
  onChange: (platform: AdPlatform) => void;
}

export function SimPlatformSelector({ selected, onChange }: SimPlatformSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">プラットフォーム</label>
      <div className="flex flex-wrap gap-2">
        {platformBenchmarks.map((p) => (
          <Button
            key={p.platform}
            variant={selected === p.platform ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(p.platform)}
            className={cn(
              'rounded-full text-xs',
              selected === p.platform
                ? 'bg-sim-primary-600 hover:bg-sim-primary-700 text-white border-sim-primary-600'
                : ''
            )}
          >
            {p.platformName}
          </Button>
        ))}
      </div>
    </div>
  );
}
