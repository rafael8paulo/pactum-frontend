'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SegmentedControl } from '@/components/ui/segmented-control';
import type { TipoLancamento } from '@/lib/lancamentos/constants';

interface SegmentedTipoProps {
  tipo: TipoLancamento;
}

export function SegmentedTipo({ tipo }: SegmentedTipoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(next: TipoLancamento) {
    if (next === tipo) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('tipo', next);
    // receitas não têm status: o filtro não pode sobreviver à troca
    if (next === 'receita') params.delete('status');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <SegmentedControl<TipoLancamento>
      aria-label="Tipo de lançamento"
      value={tipo}
      onValueChange={handleChange}
      options={[
        { value: 'despesa', label: 'Despesas' },
        { value: 'receita', label: 'Receitas' },
      ]}
    />
  );
}
