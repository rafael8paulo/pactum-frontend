'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoriaMeta } from '@/lib/lancamentos/constants';

/** Quantidade de categorias exibidas antes do controle de expansão. */
const VISIVEIS = 4;

interface CategoriaChipsProps {
  categorias: CategoriaMeta<string>[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoriaChips({ categorias, value, onChange }: CategoriaChipsProps) {
  const [expandido, setExpandido] = useState(false);

  const selecionadaOculta = categorias.findIndex((c) => c.value === value) >= VISIVEIS;
  const mostrarTodas = expandido || selecionadaOculta || categorias.length <= VISIVEIS;
  const lista = mostrarTodas ? categorias : categorias.slice(0, VISIVEIS);

  return (
    <div role="radiogroup" aria-label="Categoria" className="flex flex-wrap gap-2">
      {lista.map(({ value: v, label, icon: Icon }) => {
        const selected = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(v)}
            className={cn(
              'flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'border-brand bg-brand-tint text-brand'
                : 'bg-card text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        );
      })}
      {!mostrarTodas && (
        <button
          type="button"
          onClick={() => setExpandido(true)}
          aria-expanded={false}
          className="flex min-h-[44px] items-center gap-1 rounded-full border border-dashed px-3.5 text-sm font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Mais
          <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
