'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Plus, Receipt, Repeat, Wallet } from 'lucide-react';
import { Ellipsis } from '@/lib/icons';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/inicio', label: 'Início', icon: Wallet },
  { href: '/lancamentos', label: 'Lançamentos', icon: Receipt },
  null, // ação de criação
  { href: '/recorrentes', label: 'Recorrentes', icon: Repeat },
  { href: '/mais', label: 'Mais', icon: Ellipsis },
] as const;

interface MobileTabBarProps {
  onCreate: () => void;
}

function MobileTabBarContent({ onCreate }: MobileTabBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const competencia = searchParams.get('competencia');

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid h-16 grid-cols-5 items-center">
        {TABS.map((tab) => {
          if (tab === null) {
            return (
              <li key="create" className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onCreate()}
                  aria-label="Novo lançamento"
                  className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Plus className="h-7 w-7" aria-hidden />
                </button>
              </li>
            );
          }
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const href = competencia ? `${tab.href}?competencia=${competencia}` : tab.href;
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'font-semibold text-brand' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileTabBar(props: MobileTabBarProps) {
  return (
    <Suspense fallback={null}>
      <MobileTabBarContent {...props} />
    </Suspense>
  );
}
