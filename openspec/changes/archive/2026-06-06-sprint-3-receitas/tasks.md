## 1. Hooks TanStack Query (US-09 a US-11)

- [x] 1.1 Criar `hooks/useReceitas.ts` com `useReceitas(competencia)` — useQuery com queryKey `['receitas', competencia]`
- [x] 1.2 Adicionar `useCadastrarReceita()` — useMutation chamando `receitaApi.cadastrar`, invalidando `['receitas']` no onSuccess
- [x] 1.3 Adicionar `useAtualizarReceita()` — useMutation chamando `receitaApi.atualizar`, invalidando `['receitas']` no onSuccess
- [x] 1.4 Adicionar `useRemoverReceita()` — useMutation chamando `receitaApi.remover`, invalidando `['receitas']` no onSuccess
- [x] 1.5 Garantir toast.success/toast.error em onSuccess/onError de cada mutation

## 2. Componente ReceitaForm (US-10 e US-11)

- [x] 2.1 Criar `components/features/receitas/ReceitaForm.tsx` com schema zod cobrindo: `descricao` (string obrigatório), `valor` (number > 0 via `valueAsNumber`), `categoria` (enum CategoriaReceita), `competencia` (string YYYY-MM)
- [x] 2.2 Implementar campos do formulário usando `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` do shadcn
- [x] 2.3 Campo `categoria` usa `Select` com todas as opções de CategoriaReceita
- [x] 2.4 Aceitar prop `defaultValues?: Partial<ReceitaFormValues>` para reutilização no modo edição
- [x] 2.5 Aceitar props `onSubmit: (values) => void` e `isPending: boolean` para controle externo do envio

## 3. Dialog de Nova Receita (US-10)

- [x] 3.1 Criar `components/features/receitas/NovaReceitaDialog.tsx` com botão trigger "Nova Receita" e Dialog interno
- [x] 3.2 Instanciar `ReceitaForm` com `defaultValues={{ competencia: competenciaAtual }}` dentro do Dialog
- [x] 3.3 Conectar submit ao hook `useCadastrarReceita().mutate()`; fechar Dialog no onSuccess da mutation
- [x] 3.4 Desabilitar botão de submit enquanto `isPending` é true

## 4. Dialog de Edição (US-11)

- [x] 4.1 Criar `components/features/receitas/EditarReceitaDialog.tsx` que recebe `receita: Receita` como prop
- [x] 4.2 Instanciar `ReceitaForm` com `defaultValues` preenchidos pelos dados da receita recebida
- [x] 4.3 Conectar submit ao hook `useAtualizarReceita().mutate({ id, data })`; fechar Dialog no onSuccess
- [x] 4.4 Desabilitar botão de submit enquanto `isPending` é true

## 5. Tabela de Receitas (US-09, US-11)

- [x] 5.1 Criar `components/features/receitas/ReceitaTable.tsx` que recebe `competencia: string`
- [x] 5.2 Consumir `useReceitas(competencia)` — exibir skeletons (5 linhas) enquanto `isLoading`
- [x] 5.3 Exibir estado vazio com mensagem contextualizada quando `data.receitas` é array vazio
- [x] 5.4 Renderizar Table com colunas: Descrição, Categoria, Valor (formatado em BRL), Ações
- [x] 5.5 Coluna Ações: botão "Editar" que abre `EditarReceitaDialog` e botão "Remover" que abre AlertDialog de confirmação
- [x] 5.6 AlertDialog de remoção: descrição clara da ação; confirmação chama `useRemoverReceita().mutate(id)`

## 6. Composição da Página (US-09 a US-11)

- [x] 6.1 Substituir placeholder em `app/(dashboard)/receitas/page.tsx` com layout real
- [x] 6.2 Ler `competencia` de `searchParams` (fallback: mês corrente via `getCurrentCompetencia()`)
- [x] 6.3 Compor página com: header de seção + `NovaReceitaDialog` (alinhado à direita) e `ReceitaTable`
- [x] 6.4 Verificar que `npm run build` compila sem erros de tipo
- [x] 6.5 Verificar que `npm run lint` passa sem erros
