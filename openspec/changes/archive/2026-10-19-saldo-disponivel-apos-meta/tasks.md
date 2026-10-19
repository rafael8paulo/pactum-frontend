# Tasks

## 1. Cálculo

- [x] 1.1 Criar `lib/metas-economia/disponivel.ts` com `saldoDisponivelAposMeta(progresso)` retornando `{ valor, situacao }` (`valorEconomizado − valorMeta`, arredondado a centavos; `positivo`/`zero`/`negativo`) e verificar com `npm test`
- [x] 1.2 Criar `lib/metas-economia/disponivel.test.ts` cobrindo saldo acima (3000/1000 → 2000), igual (1000/1000 → 0, sem `-0`), abaixo (600/1000 → -400) e saldo negativo (-200/1000 → -1200); verificar que `npm test` passa

## 2. Componente e integração na tela inicial

- [x] 2.1 Criar `components/features/metas-economia/SaldoAposMeta.tsx` usando `useProgressoMeta(competencia)`: retorna `null` ao carregar, em erro ou sem meta; exibe rótulo "Disponível após a meta", valor em BRL com cor por situação via `cn()` e o texto "Saldo abaixo da meta" no negativo; verificar com `npm run lint`
- [x] 2.2 Renderizar `SaldoAposMeta` em `SaldoHero` abaixo do valor do saldo e verificar visualmente em `/inicio` no viewport mobile com e sem meta
- [x] 2.3 Renderizar `SaldoAposMeta` no card "Saldo" de `ResumoCards` e verificar visualmente em `/inicio` no desktop com e sem meta
- [x] 2.4 Estender `e2e/metas-economia.spec.ts`: sem meta o texto "Disponível após a meta" não aparece; com meta R$ 1.000 e receita R$ 600 mostra "-R$ 400,00" e "Saldo abaixo da meta"; após ajustar a meta para R$ 500 mostra "R$ 100,00"; após remover a meta o indicador some. Verificar com `npm run test:e2e` contra a stack local
- [x] 2.5 Adicionar cenário mobile em `e2e/` (`*.mobile.spec.ts`) verificando o indicador dentro do bloco "Resumo do mês" e rodar `npm run test:e2e`

## 3. Verificação final

- [x] 3.1 Rodar `npm run lint`, `npm test` e `npm run build` sem erros
- [x] 3.2 Rodar `openspec validate saldo-disponivel-apos-meta --strict` sem erros

## Workflow follow-up

- Arquivar a change (`/opsx:archive`) após revisão e merge.
