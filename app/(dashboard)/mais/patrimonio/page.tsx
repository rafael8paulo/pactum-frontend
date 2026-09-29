import { NovoPatrimonioDialog } from '@/components/features/patrimonio/NovoPatrimonioDialog';
import { PatrimonioTotal } from '@/components/features/patrimonio/PatrimonioTotal';
import { PatrimonioGrid } from '@/components/features/patrimonio/PatrimonioGrid';
import { getCurrentCompetencia } from '@/lib/utils';

interface PatrimonioPageProps {
  searchParams: Promise<{
    competencia?: string;
  }>;
}

export default async function PatrimonioPage({ searchParams }: PatrimonioPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();

  return (
    <div className="space-y-4 py-4 md:space-y-6 md:p-6">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h1 className="text-2xl font-semibold">Patrimônio</h1>
        <NovoPatrimonioDialog competenciaAtual={competencia} />
      </div>
      <div className="px-4 md:px-0">
        <PatrimonioTotal competencia={competencia} />
      </div>
      <PatrimonioGrid competencia={competencia} />
    </div>
  );
}
