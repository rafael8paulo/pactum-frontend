import { formatCurrency } from '@/lib/utils';
import type { Patrimonio } from '@/types/patrimonio';

/** Opacidades distintas da cor de marca + legenda textual: não depende só de cor. */
const OPACIDADES = [1, 0.75, 0.55, 0.4, 0.28, 0.2];

export function percentual(valor: number, total: number): number {
  return total > 0 ? Math.round((valor / total) * 100) : 0;
}

interface PatrimonioComposicaoProps {
  itens: Patrimonio[];
  total: number;
}

export function PatrimonioComposicao({ itens, total }: PatrimonioComposicaoProps) {
  const ordenados = [...itens].sort((a, b) => b.valor - a.valor);

  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        {ordenados.map((item, i) => (
          <div
            key={item.id}
            className="h-full"
            style={{
              width: `${total > 0 ? (item.valor / total) * 100 : 0}%`,
              backgroundColor: 'hsl(var(--brand))',
              opacity: OPACIDADES[Math.min(i, OPACIDADES.length - 1)],
            }}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5" aria-label="Composição do patrimônio">
        {ordenados.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: 'hsl(var(--brand))',
                opacity: OPACIDADES[Math.min(i, OPACIDADES.length - 1)],
              }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{item.descricao}</span>
            <span className="font-numeric tabular-nums">{formatCurrency(item.valor)}</span>
            <span className="w-10 text-right font-numeric text-xs tabular-nums text-muted-foreground">
              {percentual(item.valor, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
