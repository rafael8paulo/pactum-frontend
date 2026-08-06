## 1. API client e hook

- [x] 1.1 Adicionar `gerarTodos: (id: string) => Promise<ListaDespesasResponse>` em `lib/api/contas-recorrentes.ts`, chamando `POST /api/v1/contas-recorrentes/{id}/gerar-todos`, tipado com `ListaDespesasResponse` (não array puro — mesmo cuidado do bug corrigido em `gerar`)
- [x] 1.2 Criar `useGerarLoteLancamentosRecorrentes` em `hooks/useContasRecorrentes.ts` (mutation por `contaRecorrenteId`), invalidando `['despesas']` no sucesso

## 2. Componente — ação na tabela

- [x] 2.1 Em `ContaRecorrenteTable.tsx`, adicionar função `formatVigenciaComMesAtual` (ou reaproveitar `formatVigencia` passando o mês atual quando `competenciaFim` for `null`) para montar o rótulo do intervalo
- [x] 2.2 Adicionar botão "Gerar tudo (intervalo)" na célula de ações, visível apenas quando `conta.status === 'ATIVA'`, chamando `useGerarLoteLancamentosRecorrentes`
- [x] 2.3 Estado de carregamento por linha (reaproveitar o padrão de `loadingId`/`statusLoadingId` já usado na tabela) desabilitando a ação durante a requisição
- [x] 2.4 Toast de sucesso com contagem de despesas geradas (`resultado.despesas.length`) ou mensagem de "nada a gerar" quando vazio, e toast de erro via `getErrorMessage`

## 3. Verificação final

- [x] 3.1 Rodar `npm run lint` e `npx tsc --noEmit` sem erros
- [x] 3.2 Rodar `npm run build` com sucesso
- [ ] 3.3 Testar manualmente contra a `pactum-api` local: gerar tudo para uma conta com `competenciaFim` definida, para uma conta indefinida (conferir corte no mês atual), clicar duas vezes seguidas confirmando idempotência, e confirmar que a ação não aparece para conta pausada/encerrada
