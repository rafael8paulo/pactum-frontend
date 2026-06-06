'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StatusDespesa, CategoriaDespesa } from '@/types/despesa';

const STATUS_OPTIONS: { value: StatusDespesa; label: string }[] = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGA', label: 'Paga' },
  { value: 'AGENDADA', label: 'Agendada' },
];

const CATEGORIA_OPTIONS: { value: CategoriaDespesa; label: string }[] = [
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'SERVICOS', label: 'Serviços' },
  { value: 'LAZER', label: 'Lazer' },
  { value: 'IMPOSTO', label: 'Imposto' },
  { value: 'OUTROS', label: 'Outros' },
];

const ALL_VALUE = '__all__';

export function DespesaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get('status') ?? ALL_VALUE;
  const currentCategoria = searchParams.get('categoria') ?? ALL_VALUE;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <Select value={currentStatus} onValueChange={(v) => updateParam('status', v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todos os status</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentCategoria} onValueChange={(v) => updateParam('categoria', v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todas as categorias</SelectItem>
          {CATEGORIA_OPTIONS.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
