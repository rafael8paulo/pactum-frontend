import { ResumoCards } from '@/components/features/resumo/ResumoCards';
import { EvolucaoAnualChart } from '@/components/features/resumo/EvolucaoAnualChart';
import { getCurrentCompetencia } from '@/lib/utils';

interface ResumoPageProps {
  searchParams: Promise<{
    competencia?: string;
  }>;
}

export default async function ResumoPage({ searchParams }: ResumoPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();
  const ano = Number(competencia.split('-')[0]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Resumo</h1>
      <ResumoCards competencia={competencia} />
      <EvolucaoAnualChart ano={ano} />
    </div>
  );
}
