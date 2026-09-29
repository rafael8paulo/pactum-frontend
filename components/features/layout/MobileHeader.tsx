'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { MonthSheet } from './MonthSheet';
import { useAuth } from '@/providers/auth-provider';
import { formatCompetencia, getCurrentCompetencia } from '@/lib/utils';

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function MobileHeaderContent() {
  const searchParams = useSearchParams();
  const { usuario } = useAuth();
  const [monthOpen, setMonthOpen] = useState(false);

  const competencia = searchParams.get('competencia') ?? getCurrentCompetencia();
  const competenciaQs = searchParams.get('competencia')
    ? `&competencia=${searchParams.get('competencia')}`
    : '';

  const iconLink =
    'flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-2 pt-[env(safe-area-inset-top)]">
      <button
        type="button"
        onClick={() => setMonthOpen(true)}
        aria-label={`Competência ${formatCompetencia(competencia)}. Alterar mês`}
        className="flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {formatCompetencia(competencia)}
        <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
      </button>

      <div className="flex items-center">
        <Link
          href={`/lancamentos?tipo=despesa${competenciaQs}`}
          aria-label="Buscar lançamentos"
          className={iconLink}
        >
          <Search className="h-5 w-5" aria-hidden />
        </Link>
        <Link
          href={`/lancamentos?tipo=despesa&status=PENDENTE${competenciaQs}`}
          aria-label="Despesas pendentes"
          className={iconLink}
        >
          <Bell className="h-5 w-5" aria-hidden />
        </Link>
        <Link
          href="/mais"
          aria-label={usuario ? `Perfil de ${usuario.nome}` : 'Perfil'}
          className={iconLink}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint text-xs font-semibold text-brand">
            {usuario ? iniciais(usuario.nome) : ''}
          </span>
        </Link>
      </div>

      <MonthSheet open={monthOpen} onOpenChange={setMonthOpen} />
    </header>
  );
}

export function MobileHeader() {
  return (
    <Suspense fallback={<div className="h-14 shrink-0 border-b bg-card" />}>
      <MobileHeaderContent />
    </Suspense>
  );
}
