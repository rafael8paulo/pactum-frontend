import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/** Prazo máximo do cache financeiro persistido no dispositivo. */
export const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

/** Só dados financeiros entram no armazenamento; nada de autenticação. */
const PERSISTED_ROOT_KEYS = ['despesas', 'receitas', 'resumo', 'contas-recorrentes'];

export function shouldPersistQuery(queryKey: readonly unknown[], status: string): boolean {
  return status === 'success' && PERSISTED_ROOT_KEYS.includes(queryKey[0] as string);
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        // precisa sobreviver ao menos tanto quanto o cache persistido
        gcTime: CACHE_MAX_AGE,
      },
      // Sem isso o TanStack pausa a escrita offline em vez de falhar — e a UI
      // não conseguiria reverter o efeito visual nem avisar o usuário.
      mutations: { networkMode: 'always' },
    },
  });
}

let browserClient: QueryClient | undefined;

/** No servidor, um client novo por chamada; no browser, um singleton. */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') return createQueryClient();
  browserClient ??= createQueryClient();
  return browserClient;
}

let persister: ReturnType<typeof createSyncStoragePersister> | null | undefined;

/** Persister em localStorage; `null` se o armazenamento estiver indisponível/cheio. */
export function getPersister() {
  if (persister !== undefined) return persister;
  if (typeof window === 'undefined') return null;
  try {
    persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'pactum-query-cache',
      throttleTime: 1000,
    });
  } catch {
    persister = null;
  }
  return persister;
}

/** Descarta todo dado financeiro em memória e no armazenamento do dispositivo. */
export function clearFinancialCache(): void {
  try {
    getQueryClient().clear();
    getPersister()?.removeClient();
  } catch {
    // limpeza é best-effort: nunca deve impedir logout/redirecionamento
  }
}
