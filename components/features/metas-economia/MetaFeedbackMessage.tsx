import { Target, TrendingUp, Trophy, TriangleAlert } from 'lucide-react';
import { mensagemPorStatus } from '@/lib/metas-economia/mensagens';
import { cn } from '@/lib/utils';
import type { ProgressoMeta, StatusMeta } from '@/types/meta-economia';

const ESTILO: Record<StatusMeta, { icon: typeof Target; classe: string }> = {
  CONCLUIDA: { icon: Trophy, classe: 'bg-pos-tint text-pos' },
  ADIANTADA: { icon: TrendingUp, classe: 'bg-pos-tint text-pos' },
  NO_PLANEJADO: { icon: Target, classe: 'bg-brand-tint text-brand' },
  EM_RISCO: { icon: TriangleAlert, classe: 'bg-neg-tint text-neg' },
};

interface MetaFeedbackMessageProps {
  progresso: Pick<ProgressoMeta, 'status' | 'valorDiarioNecessario' | 'diasRestantes'>;
}

/** Ícone + título + texto: o estado nunca depende só da cor. */
export function MetaFeedbackMessage({ progresso }: MetaFeedbackMessageProps) {
  const { titulo, texto } = mensagemPorStatus(progresso);
  const { icon: Icon, classe } = ESTILO[progresso.status];

  return (
    <div role="status" className={cn('flex items-start gap-3 rounded-xl p-3', classe)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="text-sm">
        <p className="font-semibold">{titulo}</p>
        <p className="text-foreground/80">{texto}</p>
      </div>
    </div>
  );
}
