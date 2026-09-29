import { redirect, RedirectType } from 'next/navigation';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContasRecorrentesRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const key of ['competencia', 'status']) {
    const value = params[key];
    if (typeof value === 'string') qs.set(key, value);
  }
  const query = qs.toString();
  redirect(`/recorrentes${query ? `?${query}` : ''}`, RedirectType.replace);
}
