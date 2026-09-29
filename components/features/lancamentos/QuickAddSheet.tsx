'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spinner } from '@/components/ui/spinner';
import { MonthSheet } from '@/components/features/layout/MonthSheet';
import { despesaSchema } from '@/components/features/despesas/DespesaForm';
import { receitaSchema } from '@/components/features/receitas/ReceitaForm';
import { useCadastrarDespesa } from '@/hooks/useDespesas';
import { useCadastrarReceita } from '@/hooks/useReceitas';
import {
  CATEGORIAS_DESPESA,
  CATEGORIAS_RECEITA,
  STATUS_LABELS,
  STATUS_ORDER,
  type TipoLancamento,
} from '@/lib/lancamentos/constants';
import { formatCompetencia, getCurrentCompetencia } from '@/lib/utils';
import type { CategoriaDespesa, StatusDespesa } from '@/types/despesa';
import type { CategoriaReceita } from '@/types/receita';
import { CategoriaChips } from './CategoriaChips';
import { useQuickAdd } from './QuickAddProvider';

interface QuickAddValues {
  descricao: string;
  valor: number;
  categoria: string;
  status: StatusDespesa;
  competencia: string;
}

const CATEGORIA_PADRAO = 'OUTROS';

export function QuickAddSheet() {
  const { isOpen, setOpen, tipoInicial } = useQuickAdd();
  const searchParams = useSearchParams();
  const competenciaAtiva = searchParams.get('competencia') ?? getCurrentCompetencia();

  const [tipo, setTipo] = useState<TipoLancamento>(tipoInicial);
  const [monthOpen, setMonthOpen] = useState(false);
  // Incrementado a cada limpeza para remontar o CurrencyInput (estado interno de exibição).
  const [valorKey, setValorKey] = useState(0);
  const valorRef = useRef<HTMLInputElement>(null);
  const tipoRef = useRef(tipo);
  tipoRef.current = tipo;

  const cadastrarDespesa = useCadastrarDespesa();
  const cadastrarReceita = useCadastrarReceita();
  const isPending = cadastrarDespesa.isPending || cadastrarReceita.isPending;

  // Os schemas Zod são os mesmos dos formulários de desktop — validação única.
  const resolver: Resolver<QuickAddValues> = (values, context, options) => {
    const schema = tipoRef.current === 'despesa' ? despesaSchema : receitaSchema;
    const validar = zodResolver(schema) as unknown as Resolver<QuickAddValues>;
    return validar(values, context, options);
  };

  const form = useForm<QuickAddValues>({
    resolver,
    defaultValues: {
      descricao: '',
      valor: 0,
      categoria: CATEGORIA_PADRAO,
      status: 'PENDENTE',
      competencia: competenciaAtiva,
    },
  });

  // Abrir = estado inicial: o rascunho anterior é sempre descartado.
  useEffect(() => {
    if (!isOpen) return;
    setTipo(tipoInicial);
    setValorKey((k) => k + 1);
    form.reset({
      descricao: '',
      valor: 0,
      categoria: CATEGORIA_PADRAO,
      status: 'PENDENTE',
      competencia: competenciaAtiva,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // O CurrencyInput é remontado a cada limpeza; o foco volta ao valor depois disso.
  useEffect(() => {
    if (isOpen && valorKey > 0) valorRef.current?.focus();
  }, [valorKey, isOpen]);

  function handleTipoChange(next: TipoLancamento) {
    setTipo(next);
    tipoRef.current = next;
    // valor e descrição são preservados; a categoria só é trocada se deixar de existir no tipo
    const validas = (next === 'despesa' ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA).map(
      (c) => c.value as string
    );
    if (!validas.includes(form.getValues('categoria'))) {
      form.setValue('categoria', CATEGORIA_PADRAO);
    }
    form.clearErrors();
  }

  function submit(values: QuickAddValues, continuar: boolean) {
    const onSuccess = () => {
      if (!continuar) {
        setOpen(false);
        return;
      }
      // registro em sequência: mantém tipo, categoria e competência
      form.reset({ ...form.getValues(), descricao: '', valor: 0 });
      setValorKey((k) => k + 1);
    };

    if (tipo === 'despesa') {
      cadastrarDespesa.mutate(
        {
          descricao: values.descricao,
          valor: values.valor,
          categoria: values.categoria as CategoriaDespesa,
          status: values.status,
          competencia: values.competencia,
        },
        { onSuccess }
      );
    } else {
      cadastrarReceita.mutate(
        {
          descricao: values.descricao,
          valor: values.valor,
          categoria: values.categoria as CategoriaReceita,
          competencia: values.competencia,
        },
        { onSuccess }
      );
    }
  }

  const competencia = form.watch('competencia');
  const categorias = tipo === 'despesa' ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA;

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent
        className="pb-[env(safe-area-inset-bottom)]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          valorRef.current?.focus();
        }}
      >
        <DrawerHeader className="relative text-left">
          <DrawerTitle>Novo lançamento</DrawerTitle>
          <DrawerDescription className="sr-only">
            Registre uma despesa ou receita na competência selecionada.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-11 w-11"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => submit(v, false))}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="space-y-5 overflow-y-auto px-4 pb-4">
              <SegmentedControl<TipoLancamento>
                aria-label="Tipo de lançamento"
                value={tipo}
                onValueChange={handleTipoChange}
                options={[
                  { value: 'despesa', label: 'Despesa' },
                  { value: 'receita', label: 'Receita' },
                ]}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="sr-only">Valor (R$)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        key={valorKey}
                        ref={(el) => {
                          valorRef.current = el;
                          field.ref(el);
                        }}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        inputMode="decimal"
                        className="h-16 border-0 bg-transparent text-center font-numeric text-4xl font-semibold shadow-none focus-visible:ring-0 md:text-4xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tipo === 'despesa' ? 'Ex: Conta de luz' : 'Ex: Salário mensal'}
                        className="h-11"
                        {...field}
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
                    <CategoriaChips
                      key={tipo}
                      categorias={categorias}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipo === 'despesa' && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <SegmentedControl<StatusDespesa>
                        aria-label="Status da despesa"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={STATUS_ORDER.map((s) => ({
                          value: s,
                          label: STATUS_LABELS[s],
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <button
                type="button"
                onClick={() => setMonthOpen(true)}
                className="flex min-h-[44px] w-full items-center justify-between rounded-lg border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  Competência
                </span>
                <span className="font-medium capitalize">{formatCompetencia(competencia)}</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 border-t bg-background p-4">
              <Button type="submit" className="h-12 w-full" disabled={isPending}>
                {isPending ? <Spinner size="sm" /> : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full"
                disabled={isPending}
                onClick={form.handleSubmit((v) => submit(v, true))}
              >
                Salvar e adicionar outro
              </Button>
            </div>
          </form>
        </Form>

        <MonthSheet
          nested
          open={monthOpen}
          onOpenChange={setMonthOpen}
          value={competencia}
          onSelect={(c) => form.setValue('competencia', c, { shouldValidate: true })}
        />
      </DrawerContent>
    </Drawer>
  );
}
