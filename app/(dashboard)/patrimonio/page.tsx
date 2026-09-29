import { redirect, RedirectType } from 'next/navigation';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PatrimonioRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  const competencia = params.competencia;
  if (typeof competencia === 'string') qs.set('competencia', competencia);
  const query = qs.toString();
  redirect(`/mais/patrimonio${query ? `?${query}` : ''}`, RedirectType.replace);
}
