import { redirect, RedirectType } from 'next/navigation';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ReceitasRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams({ tipo: 'receita' });
  for (const key of ['competencia']) {
    const value = params[key];
    if (typeof value === 'string') qs.set(key, value);
  }
  redirect(`/lancamentos?${qs.toString()}`, RedirectType.replace);
}
