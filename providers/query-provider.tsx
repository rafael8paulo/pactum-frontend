'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  CACHE_MAX_AGE,
  getPersister,
  getQueryClient,
  shouldPersistQuery,
} from '@/lib/query-client';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Buster por versão: qualquer deploy/rollback invalida o cache persistido.
const BUSTER = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev';

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();
  const persister = getPersister();

  // Sem armazenamento (quota/privado): degrada para cache só em memória.
  if (!persister) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CACHE_MAX_AGE,
        buster: BUSTER,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            shouldPersistQuery(query.queryKey, query.state.status),
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
