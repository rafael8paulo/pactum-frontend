'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ChevronRight, Landmark, LogOut, BarChart3 } from 'lucide-react';
import { PiggyBank } from '@/lib/icons';
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
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { usePatrimonio } from '@/hooks/usePatrimonio';
import { useAuth } from '@/providers/auth-provider';
import { formatCurrency, getCurrentCompetencia } from '@/lib/utils';

type Aparencia = 'light' | 'dark' | 'system';

const ROW =
  'flex min-h-[56px] items-center gap-3 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring';

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function MaisHub() {
  const searchParams = useSearchParams();
  const competencia = searchParams.get('competencia') ?? getCurrentCompetencia();
  const qs = searchParams.get('competencia') ? `?competencia=${competencia}` : '';

  const { usuario, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: patrimonio, isLoading } = usePatrimonio(competencia);
  const [confirmando, setConfirmando] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const totalPatrimonio = (patrimonio?.patrimonios ?? []).reduce((acc, p) => acc + p.valor, 0);

  async function handleLogout() {
    setSaindo(true);
    try {
      await logout();
    } finally {
      setSaindo(false);
      setConfirmando(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="hidden text-2xl font-semibold md:block">Mais</h1>

      {/* Perfil */}
      <section className="flex items-center gap-3 rounded-2xl border bg-card p-4" aria-label="Perfil">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint text-base font-semibold text-brand">
          {usuario ? iniciais(usuario.nome) : ''}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{usuario?.nome}</p>
          <p className="truncate text-sm text-muted-foreground">{usuario?.email}</p>
        </div>
      </section>

      {/* Resumo de patrimônio */}
      <Link
        href={`/mais/patrimonio${qs}`}
        className="flex items-center gap-3 rounded-2xl bg-brand p-4 text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <PiggyBank className="h-6 w-6 shrink-0" aria-hidden />
        <span className="flex-1">
          <span className="block text-xs opacity-90">Patrimônio</span>
          {isLoading ? (
            <Skeleton className="mt-1 h-6 w-32 bg-brand-foreground/30" />
          ) : (
            <span className="block font-numeric text-xl font-bold tabular-nums">
              {formatCurrency(totalPatrimonio)}
            </span>
          )}
        </span>
        <ChevronRight className="h-5 w-5" aria-hidden />
      </Link>

      {/* Navegação */}
      <nav aria-label="Mais opções" className="divide-y overflow-hidden rounded-2xl border bg-card">
        <Link href={`/mais/patrimonio${qs}`} className={ROW}>
          <PiggyBank className="h-5 w-5 text-muted-foreground" aria-hidden />
          <span className="flex-1">Patrimônio</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        </Link>
        <Link href="/mais/formas-pagamento" className={ROW}>
          <Landmark className="h-5 w-5 text-muted-foreground" aria-hidden />
          <span className="flex-1">Formas de pagamento</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        </Link>
        <Link href={`/inicio${qs}#evolucao`} className={ROW}>
          <BarChart3 className="h-5 w-5 text-muted-foreground" aria-hidden />
          <span className="flex-1">Resumo anual</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        </Link>
      </nav>

      {/* Aparência */}
      <section className="space-y-2" aria-label="Aparência">
        <h2 className="px-1 text-sm font-medium text-muted-foreground">Aparência</h2>
        <SegmentedControl<Aparencia>
          aria-label="Tema da aplicação"
          value={(theme as Aparencia | undefined) ?? 'system'}
          onValueChange={setTheme}
          options={[
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Escuro' },
            { value: 'system', label: 'Sistema' },
          ]}
        />
      </section>

      {/* Sair — bloco isolado, fora da navegação */}
      <section className="border-t pt-6" aria-label="Sessão">
        <Button
          variant="outline"
          className="h-12 w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setConfirmando(true)}
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden />
          Sair da conta
        </Button>
      </section>

      <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisará entrar novamente para acessar seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saindo}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleLogout();
              }}
              disabled={saindo}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saindo ? <Spinner size="sm" /> : 'Sair'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
