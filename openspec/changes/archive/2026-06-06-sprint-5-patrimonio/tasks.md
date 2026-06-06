## 1. Hook TanStack Query (US-15 e US-16)

- [x] 1.1 Criar `hooks/usePatrimonio.ts` com `usePatrimonio(competencia)` — useQuery tipado como `Patrimonio[]` com queryKey `['patrimonio', competencia]`
- [x] 1.2 Adicionar `useCadastrarPatrimonio()` — useMutation chamando `patrimonioApi.cadastrar`, invalidando `['patrimonio']` no onSuccess com toast.success
- [x] 1.3 Adicionar `useRemoverPatrimonio()` — useMutation chamando `patrimonioApi.remover`, invalidando `['patrimonio']` no onSuccess com toast.success
- [x] 1.4 Garantir toast.error em onError de cada mutation

## 2. Formulário de Patrimônio (US-15)

- [x] 2.1 Criar `components/features/patrimonio/PatrimonioForm.tsx` com schema zod: `descricao` (string obrigatório), `valor` (number > 0 via `valueAsNumber`), `competencia` (string YYYY-MM)
- [x] 2.2 Implementar campos usando `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` do shadcn
- [x] 2.3 Aceitar props `defaultValues?: Partial<PatrimonioFormValues>`, `onSubmit: (values) => void` e `isPending: boolean`

## 3. Dialog de Novo Item (US-15)

- [x] 3.1 Criar `components/features/patrimonio/NovoPatrimonioDialog.tsx` com botão trigger "Novo Item" e Dialog interno
- [x] 3.2 Instanciar `PatrimonioForm` com `defaultValues={{ competencia: competenciaAtual }}` dentro do Dialog
- [x] 3.3 Conectar submit ao hook `useCadastrarPatrimonio().mutate()`; fechar Dialog no onSuccess da mutation
- [x] 3.4 Desabilitar botão de submit enquanto `isPending` é true

## 4. Cards de Patrimônio (US-15 e US-16)

- [x] 4.1 Criar `components/features/patrimonio/PatrimonioCard.tsx` que recebe `patrimonio: Patrimonio`
- [x] 4.2 Renderizar `Card` com descrição como título e valor formatado em BRL como conteúdo principal
- [x] 4.3 Adicionar botão "Remover" que abre `AlertDialog` de confirmação; confirmação chama `useRemoverPatrimonio().mutate(id)`

## 5. Card de Total (US-15)

- [x] 5.1 Criar `components/features/patrimonio/PatrimonioTotal.tsx` que recebe `competencia: string`
- [x] 5.2 Consumir `usePatrimonio(competencia)` — exibir `Skeleton` enquanto `isLoading`
- [x] 5.3 Calcular e exibir a soma de `item.valor` de todos os itens retornados, formatado em BRL

## 6. Composição da Página (US-15 e US-16)

- [x] 6.1 Substituir placeholder em `app/(dashboard)/patrimonio/page.tsx` com layout real
- [x] 6.2 Ler `competencia` de `searchParams` (fallback: mês corrente via `getCurrentCompetencia()`)
- [x] 6.3 Compor página com: header + `NovoPatrimonioDialog` (alinhado à direita), `PatrimonioTotal` e grid de `PatrimonioCard`
- [x] 6.4 Grid de cards: exibir skeletons durante carregamento; mensagem de estado vazio quando lista vazia
- [x] 6.5 Verificar que `npm run build` compila sem erros de tipo
- [x] 6.6 Verificar que `npm run lint` passa sem erros
