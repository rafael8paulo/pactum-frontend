'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { useProgressoMeta, useRemoverMeta } from '@/hooks/useMetasEconomia';
import { ehCompetenciaPassada } from '@/lib/metas-economia/historico';
import { formatCompetencia, getCurrentCompetencia } from '@/lib/utils';
import { HistoricoMetas } from './HistoricoMetas';
import { MetaEconomiaCard } from './MetaEconomiaCard';
import { MetaEconomiaForm } from './MetaEconomiaForm';

interface MetasEconomiaViewProps {
  competencia: string;
}

export function MetasEconomiaView({ competencia }: MetasEconomiaViewProps) {
  const { data: progresso } = useProgressoMeta(competencia);
  const remover = useRemoverMeta();
  const [confirmando, setConfirmando] = useState(false);
  const atual = getCurrentCompetencia();
  const somenteLeitura = ehCompetenciaPassada(competencia, atual);
  const mes = formatCompetencia(competencia);

  return (
    <div className="space-y-6">
      <MetaEconomiaCard competencia={competencia} linkGerenciar={false} />

      {somenteLeitura ? (
        <p className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
          {mes} já foi encerrado: a meta deste mês só pode ser consultada.
        </p>
      ) : (
        <section aria-label="Definir meta" className="space-y-3 rounded-2xl border bg-card p-5">
          <h2 className="text-base font-semibold">
            {progresso ? 'Ajustar' : 'Definir'} meta de {mes}
          </h2>
          {/* key: remonta o formulário quando o valor salvo muda (CurrencyInput guarda estado próprio) */}
          <MetaEconomiaForm
            key={`${competencia}:${progresso?.valorMeta ?? 'nova'}`}
            competencia={competencia}
            valorInicial={progresso?.valorMeta}
          />
          {progresso && (
            <Button
              variant="outline"
              className="h-11 w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmando(true)}
            >
              Remover meta
            </Button>
          )}
        </section>
      )}

      <HistoricoMetas anoInicial={Number(competencia.split('-')[0])} competenciaAtual={atual} />

      <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover meta?</AlertDialogTitle>
            <AlertDialogDescription>
              A meta de {mes} será removida. Você pode definir outra a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remover.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={remover.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                remover.mutate(competencia, { onSuccess: () => setConfirmando(false) });
              }}
            >
              {remover.isPending ? <Spinner size="sm" /> : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
