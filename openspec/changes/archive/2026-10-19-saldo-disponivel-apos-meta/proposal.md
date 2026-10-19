# Proposal

## Why

Hoje a tela inicial mostra o saldo do mês e, em um card separado, a meta de economia. O usuário precisa fazer a conta de cabeça para saber quanto do saldo ainda pode gastar sem comprometer a meta. Exibir explicitamente "saldo do mês − meta de economia" responde à pergunta mais prática do dia a dia: "quanto ainda posso gastar este mês?".

## What Changes

- Novo indicador **"Disponível após a meta"** = `saldo do mês − valor da meta`, exibido junto ao saldo na tela inicial:
  - mobile: dentro do bloco `SaldoHero`, abaixo do valor do saldo;
  - desktop: no card "Saldo" de `ResumoCards`.
- Valor positivo em verde ("livre para gastar"); zero em cor neutra; negativo em vermelho, com texto indicando que o saldo está abaixo da meta.
- Quando a competência não tem meta (API `404`), quando a meta está carregando ou em erro, o indicador **não é exibido** — o saldo continua aparecendo como hoje.
- Função pura de cálculo em `lib/metas-economia/` com testes unitários.
- Sem mudança na API: o cálculo usa `valorMeta` e `valorEconomizado` de `GET /api/v1/metas-economia/{competencia}` (o `valorEconomizado` já é o saldo do mês).

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `metas-economia-mensal-ui`: adiciona requisito de exibir o saldo disponível após a meta junto ao saldo do mês na tela inicial.

## Impact

- `components/features/resumo/SaldoHero.tsx` e `components/features/resumo/ResumoCards.tsx` (passam a renderizar o indicador).
- Novo componente em `components/features/metas-economia/` e nova função em `lib/metas-economia/` (+ teste).
- Reuso de `useProgressoMeta` (mesma query key do `MetaEconomiaCard`, sem requisição extra).
- E2E `e2e/metas-economia.spec.ts` ganha verificação do indicador.
- Sem impacto no backend (`pactum-api`).
