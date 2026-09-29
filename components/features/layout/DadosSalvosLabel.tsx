'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface DadosSalvosLabelProps {
  /** `dataUpdatedAt` da query (epoch ms). */
  updatedAt: number;
  /** A última tentativa de revalidação falhou. */
  isError?: boolean;
}

function formatarInstante(ms: number): string {
  return new Date(ms).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Rotula dados servidos do cache (offline ou revalidação falha) com o instante de obtenção. */
export function DadosSalvosLabel({ updatedAt, isError = false }: DadosSalvosLabelProps) {
  const online = useOnlineStatus();
  if ((online && !isError) || !updatedAt) return null;

  return (
    <p className="px-4 text-xs text-muted-foreground md:px-0">
      Dados salvos em {formatarInstante(updatedAt)}
    </p>
  );
}
