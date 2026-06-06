## 1. Preparação — shadcn components ausentes (US-05)

- [x] 1.1 Adicionar componentes shadcn ausentes: `npx shadcn@latest add select input label form`
- [x] 1.2 Verificar que `npm run lint` passa sem erros após adicionar componentes

## 2. Hooks TanStack Query (US-05 a US-08)

- [x] 2.1 Criar `hooks/useDespesas.ts` com `useDespesas(competencia, filters?)` — useQuery com queryKey `['despesas', competencia, filters]`
- [x] 2.2 Adicionar `useCadastrarDespesa()` — useMutation chamando `despesaApi.cadastrar`, invalidando `['despesas']` no onSuccess
- [x] 2.3 Adicionar `useAtualizarDespesa()` — useMutation chamando `despesaApi.atualizar`, invalidando `['despesas']` no onSuccess
- [x] 2.4 Adicionar `useAtualizarStatusDespesa()` — useMutation chamando `despesaApi.atualizarStatus`, invalidando `['despesas']` no onSuccess
- [x] 2.5 Adicionar `useRemoverDespesa()` — useMutation chamando `despesaApi.remover`, invalidando `['despesas']` no onSuccess
- [x] 2.6 Garantir toast.success/toast.error em onSuccess/onError de cada mutation

## 3. Componente DespesaForm (US-06 e US-07)

- [x] 3.1 Criar `components/features/despesas/DespesaForm.tsx` com schema zod cobrindo: `descricao` (string obrigatório), `valor` (number > 0), `categoria` (enum CategoriaDespesa), `status` (enum StatusDespesa), `competencia` (string YYYY-MM)
- [x] 3.2 Implementar campos do formulário usando `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` do shadcn
- [x] 3.3 Campos `categoria` e `status` usam `Select` com todas as opções dos enums
- [x] 3.4 Aceitar prop `defaultValues?: Partial<DespesaFormValues>` para reutilização no modo edição
- [x] 3.5 Aceitar props `onSubmit: (values) => void` e `isPending: boolean` para controle externo do envio

## 4. Dialog de Nova Despesa (US-06)

- [x] 4.1 Criar `components/features/despesas/NovaDespesaDialog.tsx` com botão trigger "Nova Despesa" e Dialog interno
- [x] 4.2 Instanciar `DespesaForm` sem defaultValues dentro do Dialog
- [x] 4.3 Conectar submit ao hook `useCadastrarDespesa().mutate()`; fechar Dialog no onSuccess da mutation
- [x] 4.4 Desabilitar botão de submit enquanto `isPending` é true

## 5. Dialog de Edição (US-07)

- [x] 5.1 Criar `components/features/despesas/EditarDespesaDialog.tsx` que recebe `despesa: Despesa` como prop
- [x] 5.2 Instanciar `DespesaForm` com `defaultValues` preenchidos pelos dados da despesa recebida
- [x] 5.3 Conectar submit ao hook `useAtualizarDespesa().mutate({ id, data })`; fechar Dialog no onSuccess
- [x] 5.4 Desabilitar botão de submit enquanto `isPending` é true

## 6. Tabela de Despesas (US-05, US-08)

- [x] 6.1 Criar `components/features/despesas/DespesaTable.tsx` que recebe `competencia: string` e `filters?: DespesaFilters`
- [x] 6.2 Consumir `useDespesas(competencia, filters)` — exibir skeletons (5 linhas) enquanto `isLoading`
- [x] 6.3 Exibir estado vazio com mensagem contextualizada quando `data.despesas` é array vazio
- [x] 6.4 Renderizar Table com colunas: Descrição, Categoria, Valor (formatado em BRL), Status, Ações
- [x] 6.5 Coluna Status: `Select` inline conectado a `useAtualizarStatusDespesa()` com todos os valores de StatusDespesa
- [x] 6.6 Coluna Ações: botão "Editar" que abre `EditarDespesaDialog` e botão "Remover" que abre AlertDialog de confirmação
- [x] 6.7 AlertDialog de remoção: descrição clara da ação; confirmação chama `useRemoverDespesa().mutate(id)`

## 7. Painel de Filtros (US-05)

- [x] 7.1 Criar `components/features/despesas/DespesaFilters.tsx` com dois `Select`: um para Status e um para Categoria
- [x] 7.2 Ler filtros ativos de `useSearchParams()` e escrever alterações com `useRouter().replace()`
- [x] 7.3 Opção "Todos" em cada Select remove o query param correspondente da URL
- [x] 7.4 Passar filtros lidos da URL como `filters` prop para `DespesaTable`

## 8. Composição da Página (US-05 a US-08)

- [x] 8.1 Substituir placeholder em `app/(dashboard)/despesas/page.tsx` com layout real
- [x] 8.2 Ler `competencia` de `searchParams` (fallback: mês corrente no formato YYYY-MM)
- [x] 8.3 Compor página com: header de seção + `NovaDespesaDialog` (alinhado à direita), `DespesaFilters` e `DespesaTable`
- [x] 8.4 Verificar que `npm run build` compila sem erros de tipo
- [x] 8.5 Verificar que `npm run lint` passa sem erros
