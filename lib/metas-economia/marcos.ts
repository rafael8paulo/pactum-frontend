type StorageLeitura = Pick<Storage, 'getItem' | 'setItem'>;

const PREFIXO = 'pactum:marcos:';

/** Marcos atingidos que ainda não foram celebrados, em ordem crescente. */
export function marcosNovos(atingidos: number[], celebrados: number[]): number[] {
  const jaCelebrados = new Set(celebrados);
  return [...atingidos].filter((m) => !jaCelebrados.has(m)).sort((a, b) => a - b);
}

function obterStorage(storage?: StorageLeitura | null): StorageLeitura | null {
  if (storage !== undefined) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Nunca lança: storage indisponível/corrompido equivale a "nada celebrado". */
export function lerCelebrados(competencia: string, storage?: StorageLeitura | null): number[] {
  try {
    const bruto = obterStorage(storage)?.getItem(PREFIXO + competencia);
    if (!bruto) return [];
    const valor: unknown = JSON.parse(bruto);
    return Array.isArray(valor) ? valor.filter((v): v is number => typeof v === 'number') : [];
  } catch {
    return [];
  }
}

/** Nunca lança: falha ao gravar só significa que o marco pode ser celebrado de novo. */
export function registrarCelebrados(
  competencia: string,
  marcos: number[],
  storage?: StorageLeitura | null
): void {
  try {
    const alvo = obterStorage(storage);
    if (!alvo) return;
    const todos = [...new Set([...lerCelebrados(competencia, alvo), ...marcos])].sort((a, b) => a - b);
    alvo.setItem(PREFIXO + competencia, JSON.stringify(todos));
  } catch {
    // ignorado de propósito
  }
}
