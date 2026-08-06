## 1. Tipos e cliente de API

- [x] 1.1 Criar `types/conta-recorrente.ts` com `StatusContaRecorrente`, `ContaRecorrente`, `CadastrarContaRecorrenteRequest`, `EditarContaRecorrenteRequest`, `ListaContasRecorrentesResponse`, `ContaRecorrenteFilters`
- [x] 1.2 Adicionar campo opcional `contaRecorrenteId: string | null` à interface `Despesa` em `types/despesa.ts`
- [x] 1.3 Criar `lib/api/contas-recorrentes.ts` (`contaRecorrenteApi`) com `listar`, `cadastrar`, `atualizar`, `atualizarStatus`, `remover`, `gerar(competencia)`, seguindo o padrão de `lib/api/despesas.ts`

## 2. Hooks (TanStack Query)

- [x] 2.1 Criar `hooks/useContasRecorrentes.ts` com `useContasRecorrentes(filters?)`, `useCadastrarContaRecorrente`, `useAtualizarContaRecorrente`, `useAtualizarStatusContaRecorrente`, `useRemoverContaRecorrente` — mesmo padrão de `hooks/useDespesas.ts` (toast de sucesso/erro via `sonner`, invalidação da query `['contas-recorrentes']`)
- [x] 2.2 Criar `useGerarLancamentosRecorrentes` (mutation) que invalida tanto `['contas-recorrentes']` quanto `['despesas']` no sucesso, e retorna a lista de despesas geradas para montar o toast com a contagem

## 3. Componentes — formulário e tabela

- [x] 3.1 Criar `components/features/contas-recorrentes/ContaRecorrenteForm.tsx` (react-hook-form + zod: `descricao`, `valorPadrao`, `categoria`, `diaVencimento` opcional, `competenciaInicio`, `competenciaFim` opcional, validação `competenciaFim >= competenciaInicio`)
- [x] 3.2 Criar `components/features/contas-recorrentes/NovaContaRecorrenteDialog.tsx`
- [x] 3.3 Criar `components/features/contas-recorrentes/EditarContaRecorrenteDialog.tsx`
- [x] 3.4 Criar `components/features/contas-recorrentes/ContaRecorrenteTable.tsx` com colunas Descrição/Categoria/Valor padrão/Dia de vencimento/Vigência/Status, skeletons de carregamento, estado vazio, ações de pausar/reativar/encerrar e remover (com confirmação)
- [x] 3.5 Criar `components/features/contas-recorrentes/ContaRecorrenteFilters.tsx` (filtro por status, sincronizado com a URL, mesmo padrão de `DespesaFilters`)

## 4. Componente — geração de lançamentos

- [x] 4.1 Criar `components/features/contas-recorrentes/GerarLancamentosButton.tsx`: lê a competência ativa via `useSearchParams` (mesmo padrão do `MonthPicker`), formata o rótulo do botão, chama `useGerarLancamentosRecorrentes`, exibe spinner/disabled durante a chamada e toast com o resultado (contagem de despesas geradas ou mensagem de "nada a gerar")

## 5. Página e navegação

- [x] 5.1 Criar `app/(dashboard)/contas-recorrentes/page.tsx` (server component lendo `searchParams`, montando `NovaContaRecorrenteDialog`, `ContaRecorrenteFilters`, `GerarLancamentosButton` e `ContaRecorrenteTable`, seguindo a estrutura de `app/(dashboard)/despesas/page.tsx`)
- [x] 5.2 Adicionar item "Contas Recorrentes" (ícone `Repeat` ou similar do `lucide-react`) em `components/features/layout/Sidebar.tsx`

## 6. Verificação final

- [x] 6.1 Rodar `npm run lint` e `npx tsc --noEmit` sem erros
- [x] 6.2 Rodar `npm run build` com sucesso
- [x] 6.3 Testar manualmente o fluxo completo no navegador contra a `pactum-api` local: cadastrar conta recorrente, editar, pausar/reativar, gerar lançamentos do mês (conferir em `/despesas`), gerar novamente confirmando idempotência (nenhum novo lançamento), remover conta recorrente
