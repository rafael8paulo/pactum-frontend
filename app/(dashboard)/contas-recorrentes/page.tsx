import { Suspense } from 'react';
import { NovaContaRecorrenteDialog } from '@/components/features/contas-recorrentes/NovaContaRecorrenteDialog';
import { ContaRecorrenteFilters } from '@/components/features/contas-recorrentes/ContaRecorrenteFilters';
import { GerarLancamentosButton } from '@/components/features/contas-recorrentes/GerarLancamentosButton';
import { ContaRecorrenteTable } from '@/components/features/contas-recorrentes/ContaRecorrenteTable';
import { ResumoAssinaturasCards } from '@/components/features/contas-recorrentes/ResumoAssinaturasCards';
import { AssinaturasPorFormaPagamentoList } from '@/components/features/contas-recorrentes/AssinaturasPorFormaPagamentoList';
import { ProximasCobrancasBanner } from '@/components/features/contas-recorrentes/ProximasCobrancasBanner';
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ResumoAssinaturasCards />
        <AssinaturasPorFormaPagamentoList />
        <ProximasCobrancasBanner />
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
