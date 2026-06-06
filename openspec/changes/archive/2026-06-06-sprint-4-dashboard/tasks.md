## 1. Hooks TanStack Query (US-12 e US-13)

- [x] 1.1 Criar `hooks/useResumo.ts` com `useResumoMensal(competencia)` — useQuery com queryKey `['resumo', 'mensal', competencia]` chamando `resumoApi.mensal`
- [x] 1.2 Adicionar `useHistoricoAnual(ano)` — useQuery com queryKey `['resumo', 'anual', ano]` chamando `resumoApi.anual`

## 2. Cards de Resumo Mensal (US-12)

- [x] 2.1 Criar `components/features/resumo/ResumoCards.tsx` que recebe `competencia: string`
- [x] 2.2 Consumir `useResumoMensal(competencia)` — exibir três `Skeleton` (altura de card) enquanto `isLoading`
- [x] 2.3 Renderizar três `Card` com labels e valores formatados em BRL: Total Receitas, Total Despesas, Saldo
- [x] 2.4 Saldo: cor verde se positivo (`text-green-600`), vermelha se negativo (`text-red-600`), neutra se zero
- [x] 2.5 Exibir estado de indisponibilidade (texto muted) quando `isError` for true

## 3. Gráfico de Evolução Anual (US-13)

- [x] 3.1 Criar `components/features/resumo/EvolucaoAnualChart.tsx` que recebe `ano: number`
- [x] 3.2 Consumir `useHistoricoAnual(ano)` — exibir `Skeleton` com altura de 300px enquanto `isLoading`
- [x] 3.3 Mapear `data.meses` para `{ mes: string, receitas: number, despesas: number, saldo: number }[]` com abreviação do mês em pt-BR
- [x] 3.4 Renderizar `ResponsiveContainer` + `ComposedChart` do Recharts com `Bar` para receitas (verde) e despesas (vermelho), e `Line` para saldo (azul)
- [x] 3.5 Adicionar `XAxis`, `YAxis` (valores em BRL abreviados), `Tooltip` com formatação em BRL e `Legend`
- [x] 3.6 Tooltip customizado mostrando os três valores formatados em BRL

## 4. Composição da Página (US-14)

- [x] 4.1 Substituir placeholder em `app/(dashboard)/resumo/page.tsx` com layout real
- [x] 4.2 Ler `competencia` de `searchParams` (fallback: mês corrente via `getCurrentCompetencia()`)
- [x] 4.3 Derivar `ano` de `competencia` como `Number(competencia.split('-')[0])`
- [x] 4.4 Compor página com: título "Resumo", `ResumoCards` e `EvolucaoAnualChart` empilhados verticalmente
- [x] 4.5 Verificar que `npm run build` compila sem erros de tipo
- [x] 4.6 Verificar que `npm run lint` passa sem erros
