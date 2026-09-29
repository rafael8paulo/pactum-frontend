'use client';

import Link from 'next/link';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { useOnboardingStatus, type OnboardingStep } from '@/hooks/useOnboardingStatus';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useQuickAdd } from '@/components/features/lancamentos/QuickAddProvider';
import { cn } from '@/lib/utils';

interface SetupChecklistProps {
  competencia: string;
}

const ROW =
  'flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function SetupChecklist({ competencia }: SetupChecklistProps) {
  const { isLoading, steps, completed, total, isComplete } = useOnboardingStatus(competencia);
  const { openQuickAdd } = useQuickAdd();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Sem flicker: nada enquanto carrega; some de vez quando tudo está concluído.
  if (isLoading || isComplete) return null;

  function renderStep(step: OnboardingStep) {
    const content = (
      <>
        {step.done ? (
          <Check className="h-5 w-5 shrink-0 text-pos" aria-hidden />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        )}
        <span className={cn('flex-1', step.done && 'text-muted-foreground line-through')}>
          {step.label}
        </span>
        {step.done ? (
          <span className="text-xs text-pos">Concluído</span>
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        )}
      </>
    );

    if (step.done) return <div className={ROW}>{content}</div>;

    if (step.id === 'renda' && isDesktop === false) {
      return (
        <button type="button" className={cn(ROW, 'hover:bg-accent')} onClick={() => openQuickAdd('receita')}>
          {content}
        </button>
      );
    }

    const href =
      step.id === 'forma-pagamento'
        ? '/mais/formas-pagamento'
        : step.id === 'renda'
          ? `/lancamentos?tipo=receita&competencia=${competencia}`
          : '/recorrentes';
    return (
      <Link href={href} className={cn(ROW, 'hover:bg-accent')}>
        {content}
      </Link>
    );
  }

  return (
    <section aria-label="Configuração inicial" className="rounded-2xl border bg-brand-tint p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-brand">Configure sua conta</h2>
        <span className="text-xs font-medium text-brand">
          {completed} de {total}
        </span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-background"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-label="Progresso da configuração inicial"
      >
        <div className="h-full bg-brand" style={{ width: `${(completed / total) * 100}%` }} />
      </div>
      <ul className="mt-2 space-y-1">
        {steps.map((step) => (
          <li key={step.id}>{renderStep(step)}</li>
        ))}
      </ul>
    </section>
  );
}
