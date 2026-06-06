import { Suspense } from 'react';
import { NovaDespesaDialog } from '@/components/features/despesas/NovaDespesaDialog';
import { DespesaFilters } from '@/components/features/despesas/DespesaFilters';
import { DespesaTable } from '@/components/features/despesas/DespesaTable';
import { getCurrentCompetencia } from '@/lib/utils';
import type {
  DespesaFilters as FiltersType,
  StatusDespesa,
  CategoriaDespesa,
} from '@/types/despesa';

interface DespesasPageProps {
  searchParams: Promise<{
    competencia?: string;
    status?: string;
    categoria?: string;
  }>;
}

export default async function DespesasPage({ searchParams }: DespesasPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();

  const filters: FiltersType = {};
  if (params.status) filters.status = params.status as StatusDespesa;
  if (params.categoria) filters.categoria = params.categoria as CategoriaDespesa;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Despesas</h1>
        <NovaDespesaDialog competenciaAtual={competencia} />
      </div>
      <Suspense>
        <DespesaFilters />
      </Suspense>
      <DespesaTable
        competencia={competencia}
        filters={Object.keys(filters).length > 0 ? filters : undefined}
      />
    </div>
  );
}
