import { useEffect, useState } from 'react';

/**
 * Retorna `undefined` no primeiro render (SSR e hidratação) e o valor real
 * depois. Consumidores devem tratar `undefined` como o caminho desktop.
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
