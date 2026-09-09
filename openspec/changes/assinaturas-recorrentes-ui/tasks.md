## 1. Tipos e API client — Formas de Pagamento

- [x] 1.1 `types/forma-pagamento.ts`: `FormaPagamento`, `TipoFormaPagamento`, `CadastrarFormaPagamentoRequest`, `EditarFormaPagamentoRequest`, `ListaFormasPagamentoResponse`
- [x] 1.2 `lib/api/formas-pagamento.ts`: `listar`, `cadastrar`, `atualizar`, `remover`, seguindo o padrão de `lib/api/contas-recorrentes.ts`
- [x] 1.3 `hooks/useFormasPagamento.ts`: `useFormasPagamento`, `useCadastrarFormaPagamento`, `useEditarFormaPagamento`, `useRemoverFormaPagamento`, com invalidação de `['formas-pagamento']` e (na remoção) `['contas-recorrentes']`

## 2. Página e componentes — Formas de Pagamento

- [x] 2.1 `components/features/formas-pagamento/FormaPagamentoTable.tsx` (skeleton, estado vazio, colunas Nome/Tipo/Dia de Fechamento)
- [x] 2.2 `components/features/formas-pagamento/FormaPagamentoForm.tsx` (zod schema; campo `diaFechamentoFatura` condicional a `tipo === 'CARTAO_CREDITO'`)
- [x] 2.3 `components/features/formas-pagamento/NovaFormaPagamentoDialog.tsx` e `EditarFormaPagamentoDialog.tsx`
- [x] 2.4 `components/features/formas-pagamento/RemoverFormaPagamentoDialog.tsx` (confirmação com aviso sobre contas recorrentes vinculadas)
- [x] 2.5 `app/(dashboard)/formas-pagamento/page.tsx` compondo tabela + dialogs
- [x] 2.6 Adicionar item "Formas de Pagamento" em `components/features/layout/Sidebar.tsx`

## 3. Tipos e API client — Contas Recorrentes (extensão)

- [x] 3.1 Atualizar `types/conta-recorrente.ts`: adicionar `frequencia: FrequenciaCobranca`, `formaPagamentoId: string | null`, `dataBaseCobranca: string`, `proximaCobranca: string | null` a `ContaRecorrente`; adicionar os mesmos campos de request a `CadastrarContaRecorrenteRequest`/`EditarContaRecorrenteRequest`; novo tipo `FrequenciaCobranca`
- [x] 3.2 Novo `types/resumo-assinaturas.ts`: `ResumoAssinaturas` (`totalMensalRecorrente`, `porFormaPagamento: TotalPorFormaPagamento[]`), `TotalPorFormaPagamento`, `ProximaCobranca`, `HistoricoValor`
- [x] 3.3 Atualizar `lib/api/contas-recorrentes.ts` com `consultarResumo()`, `consultarProximasCobrancas(dias?: number)`, `consultarHistoricoValores(id: string)`
- [x] 3.4 Atualizar `hooks/useContasRecorrentes.ts` com `useResumoAssinaturas()`, `useProximasCobrancas(dias?)`, `useHistoricoValores(id)`; garantir que `useCadastrarContaRecorrente`/`useEditarContaRecorrente` invalidam também `['contas-recorrentes', 'resumo']` e `['contas-recorrentes', 'proximas-cobrancas']`

## 4. Formulário e tabela — Contas Recorrentes (extensão)

- [x] 4.1 Atualizar o zod schema e os campos de `ContaRecorrenteForm.tsx`: `Select` de `frequencia` (default "MENSAL"), `Select` de `formaPagamentoId` (opções de `useFormasPagamento`, com opção "Nenhuma"), input de `dataBaseCobranca`, validação de `dataBaseCobranca` dentro do mês de `competenciaInicio`
- [x] 4.2 Atualizar `ContaRecorrenteTable.tsx`: colunas Frequência, Forma de Pagamento (ou "—"), Próxima Cobrança (ou "—" quando não `ATIVA`)
- [x] 4.3 Novo `components/features/contas-recorrentes/HistoricoValorDialog.tsx` (lista de valores/vigência) + ação "Ver histórico" por linha da tabela
- [x] 4.4 Atualizar toast de sucesso de edição para mencionar preservação do histórico quando `valorPadrao` muda

## 5. Ação "Gerar tudo" sensível à frequência

- [x] 5.1 Atualizar a condição de exibição da ação "Gerar tudo" na tabela para ocultá-la também quando `frequencia === 'SEMANAL'`, além do filtro por status existente

## 6. Resumo de assinaturas e próximas cobranças

- [x] 6.1 `components/features/contas-recorrentes/ResumoAssinaturasCards.tsx` (card de total mensal recorrente, skeleton, zero-state)
- [x] 6.2 `components/features/contas-recorrentes/AssinaturasPorFormaPagamentoList.tsx` (breakdown por forma de pagamento, com rótulo "Sem forma de pagamento" para `formaPagamentoId: null`)
- [x] 6.3 `components/features/contas-recorrentes/ProximasCobrancasBanner.tsx` (lista das próximas cobranças, destaque para cobranças de hoje, estado vazio)
- [x] 6.4 Compor os 3 componentes no topo de `app/(dashboard)/contas-recorrentes/page.tsx`, acima dos filtros/tabela existentes

## 7. Validação final

- [x] 7.1 `npm run lint` sem erros
- [x] 7.2 `npm run build` sem erros de tipo
- [x] 7.3 Rodar `npm run dev` com a `pactum-api` (change de backend `assinaturas-recorrentes` aplicado) e validar manualmente: cadastrar forma de pagamento, cadastrar/editar conta recorrente com frequência e forma de pagamento, conferir histórico de valores após reajuste, conferir cards de resumo e lista de próximas cobranças, conferir que "Gerar tudo" some para conta semanal
