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
import type { StatusDespesa, CategoriaDespesa } from '@/types/despesa';

const despesaSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser maior que zero'),
  categoria: z.enum([
    'FINANCIAMENTO',
    'CARTAO_CREDITO',
    'EDUCACAO',
    'SERVICOS',
    'LAZER',
    'IMPOSTO',
    'OUTROS',
  ] as [CategoriaDespesa, ...CategoriaDespesa[]]),
  status: z.enum(['PAGA', 'PENDENTE', 'AGENDADA'] as [StatusDespesa, ...StatusDespesa[]]),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Formato: AAAA-MM'),
});

export type DespesaFormValues = z.infer<typeof despesaSchema>;

const CATEGORIAS: { value: CategoriaDespesa; label: string }[] = [
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'SERVICOS', label: 'Serviços' },
  { value: 'LAZER', label: 'Lazer' },
  { value: 'IMPOSTO', label: 'Imposto' },
  { value: 'OUTROS', label: 'Outros' },
];

const STATUS: { value: StatusDespesa; label: string }[] = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGA', label: 'Paga' },
  { value: 'AGENDADA', label: 'Agendada' },
];

interface DespesaFormProps {
  defaultValues?: Partial<DespesaFormValues>;
  onSubmit: (values: DespesaFormValues) => void;
  isPending: boolean;
}

export function DespesaForm({ defaultValues, onSubmit, isPending }: DespesaFormProps) {
  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: '',
      valor: 0,
      categoria: 'OUTROS',
      status: 'PENDENTE',
      competencia: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Conta de luz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="competencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competência</FormLabel>
              <FormControl>
                <Input placeholder="AAAA-MM (ex: 2025-07)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner size="sm" /> : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
