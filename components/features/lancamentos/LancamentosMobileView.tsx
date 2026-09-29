'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/features/layout/EmptyState';
import { ErrorState } from '@/components/features/layout/ErrorState';
import { useContextoLancamento } from '@/hooks/useContextoLancamento';
import { DadosSalvosLabel } from '@/components/features/layout/DadosSalvosLabel';
import { formatCompetencia } from '@/lib/utils';
import { STATUS_LABELS_PLURAL } from '@/lib/lancamentos/constants';
import { groupLancamentos } from '@/lib/lancamentos/group';
import type { LancamentoItem } from '@/lib/lancamentos/item';
import type { StatusDespesa } from '@/types/despesa';
import { AdicionarLancamentoAction } from './AdicionarLancamentoAction';
import { FilterChips } from './FilterChips';
import { TxDetailSheet } from './TxDetailSheet';
import { TxList } from './TxList';
import { ChipsSkeleton, TxRowsSkeleton } from './TxListSkeleton';

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

interface LancamentosMobileViewProps {
  tipo: 'despesa' | 'receita';
  competencia: string;
  items: LancamentoItem[];
  statusAtivo?: StatusDespesa;
  isLoading: boolean;
  /** Erro na última tentativa; se houver `items`, eles continuam visíveis. */
  isError: boolean;
  onRetry: () => void;
  isRetrying?: boolean;
  dataUpdatedAt?: number;
  onMarcarPaga?: (item: LancamentoItem) => void;
}

export function LancamentosMobileView({
  tipo,
  competencia,
  items,
  statusAtivo,
  isLoading,
  isError,
  onRetry,
  isRetrying,
  dataUpdatedAt = 0,
  onMarcarPaga,
}: LancamentosMobileViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getContexto = useContextoLancamento();

  const [busca, setBusca] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const contagem = useMemo(() => {
    const c: Record<StatusDespesa, number> = { PENDENTE: 0, AGENDADA: 0, PAGA: 0 };
    for (const item of items) if (item.status) c[item.status] += 1;
    return c;
  }, [items]);

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return items
      .filter((i) => !statusAtivo || i.status === statusAtivo)
      .filter((i) => !termo || normalizar(i.descricao).includes(termo));
  }, [items, statusAtivo, busca]);

  const groups = useMemo(() => groupLancamentos(visiveis, tipo), [visiveis, tipo]);
  const selecionado = items.find((i) => i.id === selectedId) ?? null;
  const rotulo = tipo === 'despesa' ? 'despesa' : 'receita';

  function limparStatus() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    router.replace(`${pathname}?${params.toString()}`);
  }

  function renderCorpo() {
    if (isLoading) return <TxRowsSkeleton />;

    if (isError && items.length === 0) {
      return <ErrorState onRetry={onRetry} isRetrying={isRetrying} />;
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title={`Nenhuma ${rotulo} em ${formatCompetencia(competencia)}`}
          message={`Registre ${tipo === 'despesa' ? 'a primeira despesa' : 'a primeira receita'} deste mês.`}
        >
          <AdicionarLancamentoAction tipo={tipo} competencia={competencia} />
        </EmptyState>
      );
    }

    if (visiveis.length === 0) {
      if (busca.trim()) {
        return (
          <EmptyState
            title="Nada encontrado"
            message={`Nenhum lançamento com “${busca.trim()}”${
              statusAtivo ? ` entre as ${STATUS_LABELS_PLURAL[statusAtivo].toLowerCase()}` : ''
            }.`}
          >
            <Button variant="outline" className="h-11" onClick={() => setBusca('')}>
              Limpar busca
            </Button>
          </EmptyState>
        );
      }
      return (
        <EmptyState
          title={`Nenhuma ${rotulo} ${statusAtivo ? STATUS_LABELS_PLURAL[statusAtivo].toLowerCase().replace(/s$/, '') : ''}`.trim()}
          message="Nenhum lançamento corresponde ao filtro ativo."
        >
          <Button variant="outline" className="h-11" onClick={limparStatus}>
            Ver todas
          </Button>
        </EmptyState>
      );
    }

    return (
      <>
        {isError && (
          <div
            role="alert"
            className="mx-4 mb-2 flex items-center justify-between gap-3 rounded-lg bg-warn-tint px-3 py-2 text-sm text-warn"
          >
            <span>Não foi possível atualizar.</span>
            <Button size="sm" variant="ghost" className="h-11 text-warn" onClick={onRetry}>
              Tentar novamente
            </Button>
          </div>
        )}
        <TxList
          groups={groups}
          onOpen={(item) => setSelectedId(item.id)}
          onMarcarPaga={onMarcarPaga}
          getContexto={getContexto}
        />
      </>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 px-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por descrição"
            aria-label="Buscar por descrição"
            className="h-11 pl-9 pr-10"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca('')}
              aria-label="Limpar busca"
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {tipo === 'despesa' &&
          (isLoading ? (
            <ChipsSkeleton />
          ) : (
            <FilterChips contagem={contagem} total={items.length} ativo={statusAtivo} />
          ))}
      </div>

      {items.length > 0 && <DadosSalvosLabel updatedAt={dataUpdatedAt} isError={isError} />}

      {renderCorpo()}

      <TxDetailSheet
        item={selecionado}
        open={selecionado !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        contexto={selecionado ? getContexto(selecionado) : null}
      />
    </div>
  );
}

