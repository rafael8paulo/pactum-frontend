import type { ReactNode } from 'react';
import { Wallet } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Pactum</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
