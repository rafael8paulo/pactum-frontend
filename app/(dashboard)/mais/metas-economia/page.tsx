import { MetasEconomiaView } from '@/components/features/metas-economia/MetasEconomiaView';
import { getCurrentCompetencia } from '@/lib/utils';

interface MetasEconomiaPageProps {
  searchParams: Promise<{
    competencia?: string;
  }>;
}

export default async function MetasEconomiaPage({ searchParams }: MetasEconomiaPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <h1 className="text-2xl font-semibold">Metas de economia</h1>
      <MetasEconomiaView competencia={competencia} />
    </div>
  );
}
