'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { PageLoader } from '@/components/ui/page-loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && usuario === null) {
      router.replace('/login');
    }
  }, [isLoading, usuario, router]);

  if (isLoading) return <PageLoader />;
  if (usuario === null) return null;
  return <>{children}</>;
}
