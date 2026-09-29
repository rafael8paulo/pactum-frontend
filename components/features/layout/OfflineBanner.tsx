'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CloudOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/** Aviso persistente sem conexão. Ao reconectar, revalida os dados ativos. */
export function OfflineBanner() {
  const online = useOnlineStatus();
  const queryClient = useQueryClient();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      // revalida as queries montadas (competência ativa incluída)
      queryClient.invalidateQueries({ refetchType: 'active' });
    }
  }, [online, queryClient]);

  if (online) return null;

  return (
    <div
      role="status"
      className="flex shrink-0 items-center justify-center gap-2 bg-warn-tint px-4 py-2 text-center text-xs font-medium text-warn"
    >
      <CloudOff className="h-4 w-4 shrink-0" aria-hidden />
      Sem conexão — exibindo os últimos dados salvos.
    </div>
  );
}
