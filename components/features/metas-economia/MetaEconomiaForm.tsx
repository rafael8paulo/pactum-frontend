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
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useDefinirMeta } from '@/hooks/useMetasEconomia';

const metaSchema = z.object({
  valor: z.number().positive('Valor deve ser maior que zero'),
});

type MetaFormValues = z.infer<typeof metaSchema>;

interface MetaEconomiaFormProps {
  competencia: string;
  valorInicial?: number;
}

export function MetaEconomiaForm({ competencia, valorInicial }: MetaEconomiaFormProps) {
  const { mutate, isPending } = useDefinirMeta();
  const form = useForm<MetaFormValues>({
    resolver: zodResolver(metaSchema),
    defaultValues: { valor: valorInicial ?? 0 },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ valor }) => mutate({ competencia, valor }))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quanto você quer guardar no mês? (R$)</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={field.disabled || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="h-11 w-full">
          {isPending ? <Spinner size="sm" /> : valorInicial ? 'Ajustar meta' : 'Definir meta'}
        </Button>
      </form>
    </Form>
  );
}
