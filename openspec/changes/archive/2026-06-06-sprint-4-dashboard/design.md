## Context

Os Sprints 2 e 3 estabeleceram o padrão de CRUD. O dashboard é diferente: é read-only, orientado à visualização, e precisa combinar duas fontes de dados distintas (`resumoApi.mensal` para o mês selecionado e `resumoApi.anual` para o ano do mês selecionado).

Os tipos e o API client (`types/resumo.ts`, `lib/api/resumo.ts`) já existem. A página `/resumo` é um placeholder. O Recharts já está instalado.

## Goals / Non-Goals

**Goals:**
- Implementar `ResumoCards` com três métricas do mês corrente: Total Receitas, Total Despesas, Saldo
- Implementar `EvolucaoAnualChart` com gráfico de barras agrupadas (receitas + despesas) e linha de saldo para os 12 meses do ano
- Compor a página `/resumo` como Server Component async lendo `competencia` de `searchParams`

**Non-Goals:**
- `DespesasPorCategoriaChart` — requer endpoint de API inexistente neste sprint
- Modo de edição inline no dashboard
- Exportação de dados

## Decisions

### 1. Dois hooks independentes com dois useQuery

`useResumoMensal(competencia)` → `resumoApi.mensal` com queryKey `['resumo', 'mensal', competencia]`
`useHistoricoAnual(ano)` → `resumoApi.anual` com queryKey `['resumo', 'anual', ano]`

Consultas separadas porque têm ciclos de vida diferentes: o mensal muda a cada troca de mês, o anual raramente muda durante uma sessão.

**Alternativa descartada**: um único hook combinado — acopla as invalidades desnecessariamente e complica o staleTime.

### 2. Ano derivado da competência na página

A página extrai `ano` diretamente de `competencia.split('-')[0]`, sem prop extra. O `EvolucaoAnualChart` recebe `ano: number`.

### 3. EvolucaoAnualChart: barras para receitas/despesas + linha para saldo

Recharts `ComposedChart` com `Bar` duplo (receitas em verde, despesas em vermelho) e `Line` para saldo (azul). Dados vêm de `useHistoricoAnual(ano).data?.meses`, mapeados para o formato `{ mes: 'Jan', receitas, despesas, saldo }`.

**Alternativa descartada**: apenas linhas — barras deixam mais claro o volume absoluto de entrada/saída.

### 4. ResumoCards: três Card components com Skeleton

Enquanto `useResumoMensal` carrega, exibe três `Skeleton` no lugar dos cards. Saldo exibe cor condicional: verde se positivo, vermelho se negativo, neutro se zero.

### 5. Página como Server Component async

`app/(dashboard)/resumo/page.tsx` lê `searchParams` (Promise no Next.js 15) para extrair `competencia` com fallback via `getCurrentCompetencia()`. Passa `competencia` e `ano` para os componentes client.

## Risks / Trade-offs

- **ResumoMensal pode retornar 404 para um mês sem dados** → `useQuery` com `isError` deve exibir estado vazio ao invés de quebrar
- **HistoricoAnual com menos de 12 meses** → gráfico exibe apenas os meses com dados; o eixo X adapta automaticamente com Recharts
- **Recharts + SSR** → componentes de gráfico devem ser `'use client'`; sem problema pois já é o padrão para componentes com hooks
