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
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const patrimonioSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser maior que zero'),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Formato: AAAA-MM'),
});

export type PatrimonioFormValues = z.infer<typeof patrimonioSchema>;

interface PatrimonioFormProps {
  defaultValues?: Partial<PatrimonioFormValues>;
  onSubmit: (values: PatrimonioFormValues) => void;
  isPending: boolean;
}

export function PatrimonioForm({ defaultValues, onSubmit, isPending }: PatrimonioFormProps) {
  const form = useForm<PatrimonioFormValues>({
    resolver: zodResolver(patrimonioSchema),
    defaultValues: {
      descricao: '',
      valor: 0,
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
                <Input placeholder="Ex: Apartamento, Carro, Tesouro Direto…" {...field} />
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
