import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/features/layout/TableSkeleton';

/** Barra de chips com a mesma altura da real (44px) — evita salto de layout. */
export function ChipsSkeleton() {
  return (
    <div className="flex gap-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-24 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

/** Linhas com a altura mínima real de `TxRow` (62px). */
export function TxRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-px" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex h-[62px] items-center gap-3 px-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton neutro: CSS escolhe a variante, sem depender de hidratação. */
export function ListagemSkeleton() {
  return (
    <>
      <div className="space-y-3 md:hidden">
        <ChipsSkeleton />
        <TxRowsSkeleton />
      </div>
      <div className="hidden md:block">
        <TableSkeleton />
      </div>
    </>
  );
}
