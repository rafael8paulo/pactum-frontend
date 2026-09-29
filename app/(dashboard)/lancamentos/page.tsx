import { Suspense } from 'react';
import { NovaDespesaDialog } from '@/components/features/despesas/NovaDespesaDialog';
import { NovaReceitaDialog } from '@/components/features/receitas/NovaReceitaDialog';
import { DespesaFilters } from '@/components/features/despesas/DespesaFilters';
import { DespesaTable } from '@/components/features/despesas/DespesaTable';
import { ReceitaTable } from '@/components/features/receitas/ReceitaTable';
import { SegmentedTipo } from '@/components/features/lancamentos/SegmentedTipo';
import { getCurrentCompetencia } from '@/lib/utils';
import type {
  DespesaFilters as FiltersType,
  StatusDespesa,
  CategoriaDespesa,
} from '@/types/despesa';

interface LancamentosPageProps {
  searchParams: Promise<{
    tipo?: string;
    competencia?: string;
    status?: string;
    categoria?: string;
  }>;
}

export default async function LancamentosPage({
  searchParams,
}: LancamentosPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();
  const tipo = params.tipo === 'receita' ? 'receita' : 'despesa';

  const filters: FiltersType = {};
  if (params.status) filters.status = params.status as StatusDespesa;
  if (params.categoria) filters.categoria = params.categoria as CategoriaDespesa;

  return (
    <div className="space-y-4 py-4 md:p-6">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h1 className="text-2xl font-semibold">Lançamentos</h1>
        <div className="hidden md:block">
          {tipo === 'despesa' ? (
            <NovaDespesaDialog competenciaAtual={competencia} />
          ) : (
            <NovaReceitaDialog competenciaAtual={competencia} />
          )}
        </div>
      </div>
      <div className="px-4 md:max-w-xs md:px-0">
        <Suspense>
          <SegmentedTipo tipo={tipo} />
        </Suspense>
      </div>
      {tipo === 'despesa' ? (
        <>
          <div className="hidden md:block">
            <Suspense>
              <DespesaFilters />
            </Suspense>
          </div>
          <DespesaTable
            competencia={competencia}
            filters={Object.keys(filters).length > 0 ? filters : undefined}
          />
        </>
      ) : (
        <ReceitaTable competencia={competencia} />
      )}
    </div>
  );
}
