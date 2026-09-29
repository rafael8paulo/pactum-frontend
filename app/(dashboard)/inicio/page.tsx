import { ResumoCards } from '@/components/features/resumo/ResumoCards';
import { SaldoHero } from '@/components/features/resumo/SaldoHero';
import { EvolucaoResponsiva } from '@/components/features/resumo/EvolucaoResponsiva';
import { PendentesAviso } from '@/components/features/resumo/PendentesAviso';
import { SetupChecklist } from '@/components/features/onboarding/SetupChecklist';
import { getCurrentCompetencia } from '@/lib/utils';

interface InicioPageProps {
  searchParams: Promise<{
    competencia?: string;
  }>;
}

export default async function InicioPage({ searchParams }: InicioPageProps) {
  const params = await searchParams;
  const competencia = params.competencia ?? getCurrentCompetencia();

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <h1 className="hidden text-2xl font-semibold md:block">Início</h1>

      <SetupChecklist competencia={competencia} />

      {/* Mobile: bloco único de saldo; desktop: três cards */}
      <div className="md:hidden">
        <SaldoHero competencia={competencia} />
      </div>
      <div className="hidden md:block">
        <ResumoCards competencia={competencia} />
      </div>

      <div className="md:hidden">
        <PendentesAviso competencia={competencia} />
      </div>

      <EvolucaoResponsiva competencia={competencia} />
    </div>
  );
}
