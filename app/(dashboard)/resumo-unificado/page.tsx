import { ResumoUnificadoCards } from '@/components/features/resumo-unificado/ResumoUnificadoCards';
import { ResumoUnificadoPaineis } from '@/components/features/resumo-unificado/ResumoUnificadoPaineis';
import { getCurrentCompetencia } from '@/lib/utils';

interface ResumoUnificadoPageProps {
  searchParams: Promise<{
    competencia?: string;
  }>;
}

export default async function ResumoUnificadoPage({ searchParams }: ResumoUnificadoPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Resumo Unificado</h1>
      <ResumoUnificadoCards competencia={competencia} />
      <ResumoUnificadoPaineis competencia={competencia} />
    </div>
  );
}
