import { NovaFormaPagamentoDialog } from '@/components/features/formas-pagamento/NovaFormaPagamentoDialog';
import { FormaPagamentoTable } from '@/components/features/formas-pagamento/FormaPagamentoTable';

export default function FormasPagamentoPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Formas de Pagamento</h1>
        <NovaFormaPagamentoDialog />
      </div>
      <FormaPagamentoTable />
    </div>
  );
}
