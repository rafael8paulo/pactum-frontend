import { Suspense } from 'react';
import { NovaContaRecorrenteDialog } from '@/components/features/contas-recorrentes/NovaContaRecorrenteDialog';
import { ContaRecorrenteFilters } from '@/components/features/contas-recorrentes/ContaRecorrenteFilters';
import { GerarLancamentosButton } from '@/components/features/contas-recorrentes/GerarLancamentosButton';
import { ContaRecorrenteTable } from '@/components/features/contas-recorrentes/ContaRecorrenteTable';
import type {
  ContaRecorrenteFilters as FiltersType,
  StatusContaRecorrente,
} from '@/types/conta-recorrente';

interface ContasRecorrentesPageProps {
  searchParams: Promise<{
    competencia?: string;
    status?: string;
  }>;
}

export default async function ContasRecorrentesPage({
  searchParams,
}: ContasRecorrentesPageProps) {
  const params = await searchParams;

  const filters: FiltersType = {};
  if (params.status) filters.status = params.status as StatusContaRecorrente;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contas Recorrentes</h1>
        <NovaContaRecorrenteDialog />
      </div>
      <div className="flex items-center justify-between">
        <Suspense>
          <ContaRecorrenteFilters />
        </Suspense>
        <Suspense>
          <GerarLancamentosButton />
        </Suspense>
      </div>
      <ContaRecorrenteTable filters={Object.keys(filters).length > 0 ? filters : undefined} />
    </div>
  );
}
