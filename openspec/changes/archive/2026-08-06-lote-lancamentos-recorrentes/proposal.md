## Why

A `pactum-api` vai ganhar (mudança `lote-lancamentos-recorrentes` no repo `pactum-api`) o endpoint `POST /api/v1/contas-recorrentes/{id}/gerar-todos`, que gera de uma vez todas as despesas de uma conta recorrente entre sua competência de início e de fim. Sem uma ação na tela de contas recorrentes, o usuário continua preso a gerar mês a mês pelo botão global existente.

## What Changes

- Cada linha da tabela em `/contas-recorrentes` ganha uma ação "Gerar tudo" (só visível/habilitada quando a conta está `ATIVA`), que chama o novo endpoint em lote para aquela conta específica.
- O rótulo/tooltip da ação mostra o intervalo que será gerado (ex: "Gerar tudo (jan/26 – abr/26)" ou "Gerar tudo (desde jan/26 até ago/26)" para contas indefinidas), para o usuário saber quantos meses serão lançados antes de clicar.
- Feedback via toast com a contagem de despesas geradas (mesmo padrão do `GerarLancamentosButton` já existente), e invalidação da query `['despesas']` para refletir os novos lançamentos.
- Novo método `gerarTodos(contaRecorrenteId)` em `lib/api/contas-recorrentes.ts` e hook `useGerarLoteLancamentosRecorrentes` em `hooks/useContasRecorrentes.ts`.

## Capabilities

### New Capabilities
- `gerar-lote-lancamentos-recorrentes-ui`: ação "Gerar tudo" por conta recorrente na tabela, cobrindo o intervalo completo de vigência da conta.

### Modified Capabilities
Nenhuma — a tela e os fluxos existentes (`gestao-contas-recorrentes-ui`, `gerar-lancamentos-recorrentes-ui`) não mudam de contrato; a nova ação é aditiva na mesma tabela.

## Impact

- **Componentes**: `components/features/contas-recorrentes/ContaRecorrenteTable.tsx` ganha a ação "Gerar tudo" por linha (reaproveitando `formatVigencia`/`formatCompetenciaCurta` já definidos no próprio arquivo).
- **Hooks**: `hooks/useContasRecorrentes.ts` ganha `useGerarLoteLancamentosRecorrentes`.
- **API client**: `lib/api/contas-recorrentes.ts` ganha `gerarTodos(id)`, tipado com `ListaDespesasResponse` (mesmo formato de `gerar`, aprendido do bug corrigido na mudança anterior).
- Depende da mudança `lote-lancamentos-recorrentes` já implantada em `pactum-api` (endpoint `POST /contas-recorrentes/{id}/gerar-todos`).
