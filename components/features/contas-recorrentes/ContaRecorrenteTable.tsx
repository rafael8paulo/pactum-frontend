'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  useContasRecorrentes,
  useAtualizarStatusContaRecorrente,
  useRemoverContaRecorrente,
  useGerarLoteLancamentosRecorrentes,
} from '@/hooks/useContasRecorrentes';
import type {
  ContaRecorrente,
  ContaRecorrenteFilters,
  StatusContaRecorrente,
} from '@/types/conta-recorrente';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EditarContaRecorrenteDialog } from './EditarContaRecorrenteDialog';
import { TableSkeleton } from '@/components/features/layout/TableSkeleton';
import { EmptyState } from '@/components/features/layout/EmptyState';
import { formatCurrency, cn, getCurrentCompetencia } from '@/lib/utils';

const STATUS_COLORS: Record<StatusContaRecorrente, string> = {
  ATIVA: 'text-green-700 dark:text-green-400',
  PAUSADA: 'text-yellow-700 dark:text-yellow-400',
  ENCERRADA: 'text-muted-foreground',
};

const STATUS_LABELS: Record<StatusContaRecorrente, string> = {
  ATIVA: 'Ativa',
  PAUSADA: 'Pausada',
  ENCERRADA: 'Encerrada',
};

const MESES_ABREVIADOS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

function formatCompetenciaCurta(competencia: string): string {
  const [year, month] = competencia.split('-');
  return `${MESES_ABREVIADOS[Number(month) - 1]}/${year}`;
}

function formatVigencia(competenciaInicio: string, competenciaFim: string | null): string {
  const inicio = formatCompetenciaCurta(competenciaInicio);
  if (!competenciaFim) return `desde ${inicio}`;
  return `${inicio} – ${formatCompetenciaCurta(competenciaFim)}`;
}

function formatVigenciaComMesAtual(
  competenciaInicio: string,
  competenciaFim: string | null,
): string {
  const inicio = formatCompetenciaCurta(competenciaInicio);
  if (!competenciaFim) {
    return `desde ${inicio} até ${formatCompetenciaCurta(getCurrentCompetencia())}`;
  }
  return `${inicio} – ${formatCompetenciaCurta(competenciaFim)}`;
}

interface ContaRecorrenteTableProps {
  filters?: ContaRecorrenteFilters;
}

export function ContaRecorrenteTable({ filters }: ContaRecorrenteTableProps) {
  const { data, isLoading } = useContasRecorrentes(filters);
  const atualizarStatus = useAtualizarStatusContaRecorrente();
  const remover = useRemoverContaRecorrente();
  const gerarLote = useGerarLoteLancamentosRecorrentes();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [loteLoadingId, setLoteLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (id: string, status: StatusContaRecorrente) => {
    setStatusLoadingId(id);
    try {
      await atualizarStatus.mutateAsync({ id, status });
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleGerarTudo = async (conta: ContaRecorrente) => {
    setLoteLoadingId(conta.id);
    try {
      const resultado = await gerarLote.mutateAsync(conta.id);
      if (resultado.despesas.length > 0) {
        const contagem =
          resultado.despesas.length === 1
            ? '1 lançamento gerado'
            : `${resultado.despesas.length} lançamentos gerados`;
        toast.success(`${contagem} para "${conta.descricao}".`);
      } else {
        toast.info(`Nenhum lançamento novo para "${conta.descricao}".`);
      }
    } finally {
      setLoteLoadingId(null);
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (!data?.contasRecorrentes.length) {
    return <EmptyState message="Nenhuma conta recorrente cadastrada. Cadastre a primeira para começar a gerar lançamentos automaticamente." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Valor padrão</TableHead>
          <TableHead>Dia de vencimento</TableHead>
          <TableHead>Vigência</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.contasRecorrentes.map((conta) => (
          <TableRow key={conta.id}>
            <TableCell className="font-medium">{conta.descricao}</TableCell>
            <TableCell className="capitalize text-muted-foreground">
              {conta.categoria.replace('_', ' ').toLowerCase()}
            </TableCell>
            <TableCell className="text-right">{formatCurrency(conta.valorPadrao)}</TableCell>
            <TableCell>{conta.diaVencimento ?? '—'}</TableCell>
            <TableCell>{formatVigencia(conta.competenciaInicio, conta.competenciaFim)}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn(STATUS_COLORS[conta.status])}>
                {STATUS_LABELS[conta.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {statusLoadingId === conta.id ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    {conta.status === 'ATIVA' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(conta.id, 'PAUSADA')}
                      >
                        Pausar
                      </Button>
                    )}
                    {conta.status === 'PAUSADA' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(conta.id, 'ATIVA')}
                      >
                        Reativar
                      </Button>
                    )}
                    {conta.status !== 'ENCERRADA' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(conta.id, 'ENCERRADA')}
                      >
                        Encerrar
                      </Button>
                    )}
                  </>
                )}
                {conta.status === 'ATIVA' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGerarTudo(conta)}
                    disabled={loteLoadingId === conta.id}
                  >
                    {loteLoadingId === conta.id ? (
                      <Spinner size="sm" />
                    ) : (
                      `Gerar tudo (${formatVigenciaComMesAtual(conta.competenciaInicio, conta.competenciaFim)})`
                    )}
                  </Button>
                )}
                <EditarContaRecorrenteDialog contaRecorrente={conta} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={loadingId === conta.id}
                    >
                      {loadingId === conta.id ? <Spinner size="sm" /> : 'Remover'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover conta recorrente</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover a conta recorrente{' '}
                        <strong>&ldquo;{conta.descricao}&rdquo;</strong>? Esta ação não pode ser
                        desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(conta.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
