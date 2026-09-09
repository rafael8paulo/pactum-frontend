'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { TipoFormaPagamento } from '@/types/forma-pagamento';

const formaPagamentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.enum([
    'CARTAO_CREDITO',
    'CARTAO_DEBITO',
    'CONTA_CORRENTE',
    'PIX',
    'OUTRO',
  ] as [TipoFormaPagamento, ...TipoFormaPagamento[]]),
  diaFechamentoFatura: z
    .number()
    .int()
    .min(1, 'Dia deve ser entre 1 e 31')
    .max(31, 'Dia deve ser entre 1 e 31')
    .optional(),
});

export type FormaPagamentoFormValues = z.infer<typeof formaPagamentoSchema>;

const TIPOS: { value: TipoFormaPagamento; label: string }[] = [
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
  { value: 'CONTA_CORRENTE', label: 'Conta Corrente' },
  { value: 'PIX', label: 'Pix' },
  { value: 'OUTRO', label: 'Outro' },
];

interface FormaPagamentoFormProps {
  defaultValues?: Partial<FormaPagamentoFormValues>;
  onSubmit: (values: FormaPagamentoFormValues) => void;
  isPending: boolean;
}

export function FormaPagamentoForm({
  defaultValues,
  onSubmit,
  isPending,
}: FormaPagamentoFormProps) {
  const form = useForm<FormaPagamentoFormValues>({
    resolver: zodResolver(formaPagamentoSchema),
    defaultValues: {
      nome: '',
      tipo: 'CARTAO_CREDITO',
      diaFechamentoFatura: undefined,
      ...defaultValues,
    },
  });

  const tipo = form.watch('tipo');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nubank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {tipo === 'CARTAO_CREDITO' && (
          <FormField
            control={form.control}
            name="diaFechamentoFatura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de fechamento da fatura (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    max="31"
                    placeholder="Ex: 25"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner size="sm" /> : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
