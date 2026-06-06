'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addMonths, formatCompetencia, getCurrentCompetencia } from '@/lib/utils';

export function MonthPicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const competencia =
    searchParams.get('competencia') ?? getCurrentCompetencia();

  function navigate(delta: number) {
    const next = addMonths(competencia, delta);
    const params = new URLSearchParams(searchParams.toString());
    params.set('competencia', next);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[140px] text-center text-sm font-medium capitalize">
        {formatCompetencia(competencia)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(1)}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
