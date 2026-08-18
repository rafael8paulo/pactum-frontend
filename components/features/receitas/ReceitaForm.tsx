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
import { CurrencyInput } from '@/components/ui/currency-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { CategoriaReceita } from '@/types/receita';

const receitaSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser maior que zero'),
  categoria: z.enum([
    'SALARIO',
    'FREELANCE',
    'INVESTIMENTO',
    'OUTROS',
  ] as [CategoriaReceita, ...CategoriaReceita[]]),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Formato: AAAA-MM'),
});

export type ReceitaFormValues = z.infer<typeof receitaSchema>;

const CATEGORIAS: { value: CategoriaReceita; label: string }[] = [
  { value: 'SALARIO', label: 'Salário' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
  { value: 'OUTROS', label: 'Outros' },
];

interface ReceitaFormProps {
  defaultValues?: Partial<ReceitaFormValues>;
  onSubmit: (values: ReceitaFormValues) => void;
  isPending: boolean;
}

export function ReceitaForm({ defaultValues, onSubmit, isPending }: ReceitaFormProps) {
  const form = useForm<ReceitaFormValues>({
    resolver: zodResolver(receitaSchema),
    defaultValues: {
      descricao: '',
      valor: 0,
      categoria: 'OUTROS',
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
                <Input placeholder="Ex: Salário mensal" {...field} />
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
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={field.disabled}
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
