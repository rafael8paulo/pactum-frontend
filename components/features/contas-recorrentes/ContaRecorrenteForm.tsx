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
import type { CategoriaDespesa } from '@/types/despesa';

const COMPETENCIA_REGEX = /^\d{4}-\d{2}$/;

const contaRecorrenteSchema = z
  .object({
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    valorPadrao: z.number().positive('Valor deve ser maior que zero'),
    categoria: z.enum([
      'FINANCIAMENTO',
      'CARTAO_CREDITO',
      'EDUCACAO',
      'SERVICOS',
      'LAZER',
      'IMPOSTO',
      'OUTROS',
    ] as [CategoriaDespesa, ...CategoriaDespesa[]]),
    diaVencimento: z
      .number()
      .int()
      .min(1, 'Dia deve ser entre 1 e 31')
      .max(31, 'Dia deve ser entre 1 e 31')
      .optional(),
    competenciaInicio: z.string().regex(COMPETENCIA_REGEX, 'Formato: AAAA-MM'),
    competenciaFim: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.competenciaFim) return;

    if (!COMPETENCIA_REGEX.test(data.competenciaFim)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Formato: AAAA-MM',
        path: ['competenciaFim'],
      });
      return;
    }

    if (data.competenciaFim < data.competenciaInicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Competência fim deve ser igual ou posterior à competência início',
        path: ['competenciaFim'],
      });
    }
  });

export type ContaRecorrenteFormValues = z.infer<typeof contaRecorrenteSchema>;

const CATEGORIAS: { value: CategoriaDespesa; label: string }[] = [
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'SERVICOS', label: 'Serviços' },
  { value: 'LAZER', label: 'Lazer' },
  { value: 'IMPOSTO', label: 'Imposto' },
  { value: 'OUTROS', label: 'Outros' },
];

interface ContaRecorrenteFormProps {
  defaultValues?: Partial<ContaRecorrenteFormValues>;
  onSubmit: (values: ContaRecorrenteFormValues) => void;
  isPending: boolean;
}

export function ContaRecorrenteForm({
  defaultValues,
  onSubmit,
  isPending,
}: ContaRecorrenteFormProps) {
  const form = useForm<ContaRecorrenteFormValues>({
    resolver: zodResolver(contaRecorrenteSchema),
    defaultValues: {
      descricao: '',
      valorPadrao: 0,
      categoria: 'OUTROS',
      diaVencimento: undefined,
      competenciaInicio: '',
      competenciaFim: undefined,
      ...defaultValues,
    },
  });

  function handleFormSubmit(values: ContaRecorrenteFormValues) {
    onSubmit({
      ...values,
      competenciaFim: values.competenciaFim || undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Financiamento do apartamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valorPadrao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor padrão (R$)</FormLabel>
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
          name="diaVencimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia de vencimento (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  max="31"
                  placeholder="Ex: 10"
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

        <FormField
          control={form.control}
          name="competenciaInicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competência início</FormLabel>
              <FormControl>
                <Input placeholder="AAAA-MM (ex: 2026-01)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="competenciaFim"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competência fim (opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="AAAA-MM (ex: 2029-12)"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
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
