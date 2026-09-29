import { formatCurrency } from '@/lib/utils';
import type { LancamentoGroup } from '@/lib/lancamentos/group';
import type { LancamentoItem } from '@/lib/lancamentos/item';
import { TxRow } from './TxRow';

interface TxListProps {
  groups: LancamentoGroup[];
  onOpen: (item: LancamentoItem) => void;
  onMarcarPaga?: (item: LancamentoItem) => void;
  /** Resolve o segmento de contexto de cada item (ex.: forma de pagamento). */
  getContexto?: (item: LancamentoItem) => string | null | undefined;
}

export function TxList({ groups, onOpen, onMarcarPaga, getContexto }: TxListProps) {
  return (
    <div className="divide-y-0">
      {groups.map((group) => (
        <section key={group.key} aria-label={group.label}>
          <header className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <h2 className="uppercase tracking-wide">{group.label}</h2>
            <span className="font-numeric tabular-nums">{formatCurrency(group.total)}</span>
          </header>
          <ul className="divide-y">
            {group.items.map((item) => (
              <li key={item.id}>
                <TxRow
                  item={item}
                  contexto={getContexto?.(item)}
                  onOpen={onOpen}
                  onMarcarPaga={onMarcarPaga}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
