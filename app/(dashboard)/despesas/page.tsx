import { redirect, RedirectType } from 'next/navigation';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DespesasRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams({ tipo: 'despesa' });
  for (const key of ['competencia', 'status', 'categoria']) {
    const value = params[key];
    if (typeof value === 'string') qs.set(key, value);
  }
  redirect(`/lancamentos?${qs.toString()}`, RedirectType.replace);
}
