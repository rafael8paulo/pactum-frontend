/** Aceita só caminhos internos — evita open redirect via `?redirect=`. */
export function safeInternalPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/login')) {
    return null;
  }
  return path;
}

/** Destino pós-login: rota pretendida (`?redirect=`) ou `/inicio`. Só no browser. */
export function getPostLoginPath(): string {
  if (typeof window === 'undefined') return '/inicio';
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  return safeInternalPath(redirect) ?? '/inicio';
}
