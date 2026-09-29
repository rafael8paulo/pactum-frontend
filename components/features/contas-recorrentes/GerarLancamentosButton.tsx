'use client';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useContasRecorrentes, useGerarLancamentosRecorrentes } from '@/hooks/useContasRecorrentes';
import { WandSparkles } from '@/lib/icons';
import { formatCurrency, getCurrentCompetencia } from '@/lib/utils';

const MESES_EXTENSO = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function formatCompetenciaExtenso(competencia: string): string {
  const [year, month] = competencia.split('-');
  return `${MESES_EXTENSO[Number(month) - 1]}/${year}`;
}

/**
 * Ação primária: declara competência de destino, quantidade de contas ativas
 * e valor total antes de ser acionada. Sem contas ativas, não é exibida.
 */
export function GerarLancamentosButton() {
  const searchParams = useSearchParams();
  const competencia = searchParams.get('competencia') ?? getCurrentCompetencia();
  const gerar = useGerarLancamentosRecorrentes();
  const { data, isLoading } = useContasRecorrentes({ status: 'ATIVA' });

  const competenciaLabel = formatCompetenciaExtenso(competencia);

  if (isLoading) return <Skeleton className="h-14 w-full md:w-72" />;

  const ativas = data?.contasRecorrentes ?? [];
  if (ativas.length === 0) return null;

  const total = ativas.reduce((acc, c) => acc + c.valorPadrao, 0);
  const contagem = ativas.length === 1 ? '1 conta ativa' : `${ativas.length} contas ativas`;

  function handleClick() {
    gerar.mutate(competencia, {
      onSuccess: (resultado) => {
        if (resultado.despesas.length > 0) {
          const n =
            resultado.despesas.length === 1
              ? '1 lançamento gerado'
              : `${resultado.despesas.length} lançamentos gerados`;
          toast.success(`${n} para ${competenciaLabel}.`);
        } else {
          toast.info(`Nenhum lançamento novo — já gerado para ${competenciaLabel}.`);
        }
      },
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={gerar.isPending}
      className="h-auto min-h-14 w-full justify-start gap-3 py-2 text-left md:w-auto"
    >
      {gerar.isPending ? (
        <Spinner size="sm" />
      ) : (
        <WandSparkles className="h-5 w-5 shrink-0" aria-hidden />
      )}
      <span className="flex flex-col items-start">
        <span className="font-semibold">Gerar lançamentos de {competenciaLabel}</span>
        <span className="text-xs font-normal opacity-90">
          {contagem} · {formatCurrency(total)}
        </span>
      </span>
    </Button>
  );
}
