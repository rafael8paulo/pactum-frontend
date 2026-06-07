'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { CadastroForm } from '@/components/features/auth/CadastroForm';

export default function CadastroPage() {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && usuario !== null) {
      router.replace('/resumo');
    }
  }, [isLoading, usuario, router]);

  if (isLoading || usuario !== null) return null;

  return <CadastroForm />;
}
