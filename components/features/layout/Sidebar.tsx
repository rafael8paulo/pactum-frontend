'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CreditCard,
  Landmark,
  LayoutGrid,
  Repeat,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/resumo', label: 'Resumo', icon: BarChart3 },
  { href: '/resumo-unificado', label: 'Resumo Unificado', icon: LayoutGrid },
  { href: '/despesas', label: 'Despesas', icon: CreditCard },
  { href: '/receitas', label: 'Receitas', icon: TrendingUp },
  { href: '/patrimonio', label: 'Patrimônio', icon: Wallet },
  { href: '/contas-recorrentes', label: 'Contas Recorrentes', icon: Repeat },
  { href: '/formas-pagamento', label: 'Formas de Pagamento', icon: Landmark },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold tracking-tight">Pactum</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
