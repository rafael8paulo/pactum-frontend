## Context

`ContaRecorrenteTable.tsx` já tem uma célula de ações por linha (pausar/reativar/encerrar, editar, remover) e já define `formatCompetenciaCurta`/`formatVigencia` para exibir o intervalo de vigência de cada conta. O `GerarLancamentosButton.tsx` já existente mostra o padrão de mutation + toast de contagem para geração de despesas, mas opera de forma global (uma competência, todas as contas ativas) usando a competência do `MonthPicker`. A nova ação é por linha, escopada a uma conta específica, sem depender do `MonthPicker`.

## Goals / Non-Goals

**Goals:**
- Ação clara por linha para gerar todo o histórico de uma conta recorrente de uma vez.
- Deixar visível, antes do clique, quantos meses serão gerados (mitigação de risco já identificada no design do backend).
- Reaproveitar o padrão de toast/invalidação já estabelecido pelo `GerarLancamentosButton`.

**Non-Goals:**
- Seletor de período livre (decisão já tomada no backend: usa as datas cadastradas na própria conta).
- Confirmação modal antes de gerar — o rótulo já comunica o intervalo, e a ação é reversível (despesas geradas continuam editáveis/removíveis individualmente), consistente com o `GerarLancamentosButton` existente, que também não tem confirmação.

## Decisions

### 1. Ação inline na tabela, não um dialog separado
Segue o padrão já usado para pausar/reativar/encerrar: um botão de texto na célula de ações, sem abrir modal. Mantém a tabela como o único lugar de gestão da conta recorrente, sem introduzir uma segunda superfície de UI para uma ação simples.

### 2. Rótulo mostra o intervalo, reaproveitando formatters existentes
"Gerar tudo (jan/26 – abr/26)" usa a mesma função `formatVigencia` já usada na coluna "Vigência" da tabela — não precisa de lógica de formatação nova. Para contas indefinidas, o rótulo usa o mês atual como fim aparente (mesma regra do backend), calculado via `getCurrentCompetencia()` já existente em `lib/utils.ts`.

### 3. Botão só aparece/habilita quando `status === 'ATIVA'`
Espelha a regra de negócio do backend (só conta ativa gera lançamentos em lote) — evita um clique que sabidamente não faz nada. Mesmo critério de visibilidade já usado nas ações de pausar/reativar/encerrar da mesma linha.

## Risks / Trade-offs

- **[Risco]** Usuário clica sem perceber que o intervalo é longo (ex: conta com `competenciaInicio` de anos atrás) → **Mitigação**: rótulo do botão sempre mostra o intervalo completo antes do clique (decisão 2).

## Migration Plan

Sem impacto em dados. Depende do endpoint `POST /contas-recorrentes/{id}/gerar-todos` já estar disponível na `pactum-api` antes do deploy do front-end.

## Open Questions

Nenhuma pendente.
