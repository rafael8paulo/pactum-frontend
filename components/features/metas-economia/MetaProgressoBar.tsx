import { cn } from '@/lib/utils';

const MARCOS = [25, 50, 75, 100];

interface MetaProgressoBarProps {
  percentual: number;
  className?: string;
}

/** Barra limitada visualmente a 100%, com marcadores em 25/50/75/100%. */
export function MetaProgressoBar({ percentual, className }: MetaProgressoBarProps) {
  const visivel = Math.min(100, Math.max(0, percentual));

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-label="Progresso da meta de economia"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(visivel)}
        className="relative h-3 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full transition-[width]', visivel >= 100 ? 'bg-pos' : 'bg-brand')}
          style={{ width: `${visivel}%` }}
        />
        {MARCOS.slice(0, -1).map((m) => (
          <span
            key={m}
            aria-hidden
            className="absolute inset-y-0 w-px bg-background/80"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-muted-foreground" aria-hidden>
        {MARCOS.map((m) => (
          <span
            key={m}
            className={cn(
              'absolute -translate-x-1/2 tabular-nums',
              m === 100 && '-translate-x-full',
              visivel >= m && 'font-semibold text-foreground'
            )}
            style={{ left: `${m}%` }}
          >
            {m}%
          </span>
        ))}
      </div>
    </div>
  );
}
