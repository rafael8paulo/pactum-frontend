'use client';

import { useState } from 'react';
import { ReceitasPainel } from './ReceitasPainel';
import { DespesasPainel } from './DespesasPainel';
import { cn } from '@/lib/utils';

type Aba = 'despesas' | 'receitas';

interface ResumoUnificadoPaineisProps {
  competencia: string;
}

export function ResumoUnificadoPaineis({ competencia }: ResumoUnificadoPaineisProps) {
  const [aba, setAba] = useState<Aba>('despesas');

  return (
    <div>
      <div className="mb-3 flex gap-1 rounded-lg bg-muted p-1 md:hidden">
        <button
          type="button"
          onClick={() => setAba('despesas')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-semibold transition-colors',
            aba === 'despesas' ? 'bg-background shadow-sm' : 'text-muted-foreground'
          )}
        >
          Despesas
        </button>
        <button
          type="button"
          onClick={() => setAba('receitas')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-semibold transition-colors',
            aba === 'receitas' ? 'bg-background shadow-sm' : 'text-muted-foreground'
          )}
        >
          Receitas
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={cn(aba === 'receitas' ? 'block' : 'hidden', 'md:block')}>
          <ReceitasPainel competencia={competencia} />
        </div>
        <div className={cn(aba === 'despesas' ? 'block' : 'hidden', 'md:block')}>
          <DespesasPainel competencia={competencia} />
        </div>
      </div>
    </div>
  );
}
