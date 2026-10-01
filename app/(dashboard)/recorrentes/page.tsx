import { Suspense } from 'react';
import { NovaContaRecorrenteDialog } from '@/components/features/contas-recorrentes/NovaContaRecorrenteDialog';
import { ContaRecorrenteFilters } from '@/components/features/contas-recorrentes/ContaRecorrenteFilters';
import { GerarLancamentosButton } from '@/components/features/contas-recorrentes/GerarLancamentosButton';
import { ContaRecorrenteTable } from '@/components/features/contas-recorrentes/ContaRecorrenteTable';
import { ResumoAssinaturasCards } from '@/components/features/contas-recorrentes/ResumoAssinaturasCards';
import { AssinaturasPorFormaPagamentoList } from '@/components/features/contas-recorrentes/AssinaturasPorFormaPagamentoList';
import { ProximasCobrancasBanner } from '@/components/features/contas-recorrentes/ProximasCobrancasBanner';
import { RecorrentesResumoMobile } from '@/components/features/contas-recorrentes/RecorrentesResumoMobile';
import { ProximasCobrancasStrip } from '@/components/features/contas-recorrentes/ProximasCobrancasStrip';
import type {
  ContaRecorrenteFilters as FiltersType,
  StatusContaRecorrente,
} from '@/types/conta-recorrente';

interface RecorrentesPageProps {
  searchParams: Promise<{
    competencia?: string;
    status?: string;
  }>;
}

export default async function RecorrentesPage({ searchParams }: RecorrentesPageProps) {
  const params = await searchParams;

  const filters: FiltersType = {};
  if (params.status) filters.status = params.status as StatusContaRecorrente;

  return (
    <div className="space-y-4 py-4 md:p-6">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h1 className="text-2xl font-semibold">Recorrentes</h1>
        <div className="hidden md:block">
          <NovaContaRecorrenteDialog />
        </div>
      </div>

      {/* Mobile: card único + faixa de próximas cobranças */}
      <div className="space-y-4 px-4 md:hidden">
        <RecorrentesResumoMobile />
        <ProximasCobrancasStrip />
      </div>

      {/* Desktop: três cards */}
      <div className="hidden grid-cols-1 gap-4 sm:grid-cols-3 md:grid">
        <ResumoAssinaturasCards />
        <AssinaturasPorFormaPagamentoList />
        <ProximasCobrancasBanner />
      </div>

      <div className="flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between md:px-0">
        <div className="hidden md:block">
          <Suspense>
            <ContaRecorrenteFilters />
          </Suspense>
        </div>
        <Suspense>
          <GerarLancamentosButton />
        </Suspense>
      </div>

      <ContaRecorrenteTable filters={Object.keys(filters).length > 0 ? filters : undefined} />
    </div>
  );
}
