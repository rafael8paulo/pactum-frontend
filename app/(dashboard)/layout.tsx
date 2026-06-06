'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/features/layout/Sidebar';
import { Header } from '@/components/features/layout/Header';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar mobile via Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
