'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Drawer,
  DrawerNested,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { addMonths, cn, getCurrentCompetencia } from '@/lib/utils';

const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

interface MonthSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Competência controlada. Quando `onSelect` é informado, a escolha NÃO
   * altera a URL — usado pelo quick-add para definir só o lançamento em criação.
   */
  value?: string;
  onSelect?: (competencia: string) => void;
  /** Renderiza empilhado sobre outro drawer aberto. */
  nested?: boolean;
}

export function MonthSheet({ open, onOpenChange, value, onSelect, nested = false }: MonthSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const atual = getCurrentCompetencia();
  const competencia = value ?? searchParams.get('competencia') ?? atual;
  const anoAtivo = Number(competencia.split('-')[0]);
  const [ano, setAno] = useState(anoAtivo);

  // Sempre reabre no ano da competência ativa.
  useEffect(() => {
    if (open) setAno(anoAtivo);
  }, [open, anoAtivo]);

  function selecionar(alvo: string) {
    if (onSelect) {
      onSelect(alvo);
      onOpenChange(false);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('competencia', alvo);
    router.push(`${pathname}?${params.toString()}`);
    onOpenChange(false);
  }

  const Root = nested ? DrawerNested : Drawer;

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader>
          <DrawerTitle>Escolher mês</DrawerTitle>
          <DrawerDescription className="sr-only">
            Selecione a competência exibida em todas as telas.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setAno((a) => a - 1)}
            aria-label="Ano anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-numeric text-lg font-semibold" aria-live="polite">
            {ano}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setAno((a) => a + 1)}
            aria-label="Próximo ano"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4">
          {MESES_ABREV.map((nome, i) => {
            const valor = `${ano}-${String(i + 1).padStart(2, '0')}`;
            const ativo = valor === competencia;
            const futuro = valor > atual;
            return (
              <button
                key={valor}
                type="button"
                onClick={() => selecionar(valor)}
                aria-pressed={ativo}
                aria-label={`${nome} de ${ano}${futuro ? ' (futuro)' : ''}`}
                className={cn(
                  'min-h-[48px] rounded-xl border text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  ativo
                    ? 'border-brand bg-brand text-brand-foreground'
                    : futuro
                      ? 'border-dashed text-muted-foreground'
                      : 'bg-card hover:bg-accent'
                )}
              >
                {nome}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <Button
            variant={competencia === atual ? 'default' : 'outline'}
            className={cn(
              'h-11 flex-1',
              competencia === atual && 'bg-brand text-brand-foreground hover:bg-brand/90'
            )}
            aria-pressed={competencia === atual}
            onClick={() => selecionar(atual)}
          >
            Este mês
          </Button>
          <Button
            variant={competencia === addMonths(atual, -1) ? 'default' : 'outline'}
            className={cn(
              'h-11 flex-1',
              competencia === addMonths(atual, -1) &&
                'bg-brand text-brand-foreground hover:bg-brand/90'
            )}
            aria-pressed={competencia === addMonths(atual, -1)}
            onClick={() => selecionar(addMonths(atual, -1))}
          >
            Mês passado
          </Button>
        </div>
      </DrawerContent>
    </Root>
  );
}
