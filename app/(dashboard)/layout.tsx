'use client';

import { Suspense } from 'react';
import { Sidebar } from '@/components/features/layout/Sidebar';
import { Header } from '@/components/features/layout/Header';
import { MobileHeader } from '@/components/features/layout/MobileHeader';
import { OfflineBanner } from '@/components/features/layout/OfflineBanner';
import { MobileTabBar } from '@/components/features/layout/MobileTabBar';
import {
  QuickAddProvider,
  useQuickAdd,
} from '@/components/features/lancamentos/QuickAddProvider';
import { QuickAddSheet } from '@/components/features/lancamentos/QuickAddSheet';
import { ProtectedRoute } from '@/components/ui/protected-route';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { openQuickAdd } = useQuickAdd();

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop: Sidebar + Header */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <OfflineBanner />
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <main className="flex-1 overflow-y-auto bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile: tab bar fixa */}
      <div className="md:hidden">
        <MobileTabBar onCreate={openQuickAdd} />
      </div>
      <QuickAddSheet />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Suspense>
        <QuickAddProvider>
          <DashboardShell>{children}</DashboardShell>
        </QuickAddProvider>
      </Suspense>
    </ProtectedRoute>
  );
}
