## Why

Os Sprints 2 e 3 entregaram o CRUD completo de despesas e receitas. O dashboard de resumo (`/resumo`) ainda é um placeholder, sem nenhuma informação útil para o usuário. Com as operações de entrada e saída funcionando, o momento natural é fechar o ciclo com o painel de visão geral mensal e a evolução anual.

## What Changes

- Criar `hooks/useResumo.ts` com `useResumoMensal` e `useHistoricoAnual`
- Criar `components/features/resumo/ResumoCards.tsx` — três cards: Total Receitas, Total Despesas, Saldo
- Criar `components/features/resumo/EvolucaoAnualChart.tsx` — gráfico de barras agrupadas com a evolução mensal de receitas, despesas e saldo ao longo do ano (Recharts)
- Substituir placeholder em `app/(dashboard)/resumo/page.tsx` com layout real integrando os três componentes

Fora do escopo deste sprint:
- `DespesasPorCategoriaChart` (mencionado no CLAUDE.md) — requer novo endpoint da API com breakdown por categoria; será implementado quando a API expuser esses dados

## Capabilities

### New Capabilities

- `dashboard-resumo`: Painel de resumo mensal com cards de totais e gráfico de evolução anual

### Modified Capabilities

## Impact

- Novos arquivos: `hooks/useResumo.ts`, `components/features/resumo/ResumoCards.tsx`, `components/features/resumo/EvolucaoAnualChart.tsx`
- Arquivo modificado: `app/(dashboard)/resumo/page.tsx`
- Lê de: `types/resumo.ts` (já existe), `lib/api/resumo.ts` (já existe)
- Dependência de runtime: `recharts` (já instalado no projeto)
- A competência ativa vem de `searchParams.competencia`, gerenciada pelo MonthPicker do layout
