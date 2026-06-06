import { NovaReceitaDialog } from '@/components/features/receitas/NovaReceitaDialog';
import { ReceitaTable } from '@/components/features/receitas/ReceitaTable';
import { getCurrentCompetencia } from '@/lib/utils';

interface ReceitasPageProps {
  searchParams: Promise<{
    competencia?: string;
  }>;
}

export default async function ReceitasPage({ searchParams }: ReceitasPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Receitas</h1>
        <NovaReceitaDialog competenciaAtual={competencia} />
      </div>
      <ReceitaTable competencia={competencia} />
    </div>
  );
}
