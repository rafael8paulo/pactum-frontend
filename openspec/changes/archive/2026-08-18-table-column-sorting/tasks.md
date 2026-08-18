## 1. Hook de ordenação reutilizável

- [x] 1.1 Criar `hooks/useSortableData.ts`: hook genérico `useSortableData<T>(data: T[], initialSort?: SortConfig<T>)` com estado `sortConfig`, `sortedData` memoizado e `requestSort(key)` implementando o ciclo asc → desc → padrão da tela
- [x] 1.2 Implementar comparador interno que trata `string` (localeCompare pt-BR) e `number` (diferença numérica) de forma genérica por tipo de valor

## 2. Cabeçalho de tabela ordenável

- [x] 2.1 Criar componente `SortableTableHead` (ex.: `components/features/shared/SortableTableHead.tsx`) que envolve `TableHead`, recebe `label`, `sortKey`, `sortConfig`, `onSort`, renderiza ícone de seta (lucide `ArrowUp`/`ArrowDown`/`ArrowUpDown`) conforme o estado de ordenação da coluna e chama `onSort` no clique
- [x] 2.2 Garantir que o componente é acessível por teclado (cabeçalho focável, ativa ordenação com Enter/Space) e mantém o alinhamento `text-right` já usado na coluna Valor

## 3. Aplicar em DespesaTable

- [x] 3.1 Em `components/features/despesas/DespesaTable.tsx`, usar `useSortableData` com `initialSort: { key: 'valor', direction: 'desc' }` sobre `data.despesas` e renderizar `sortedData` no lugar do array bruto
- [x] 3.2 Trocar os `TableHead` de Descrição, Categoria e Valor por `SortableTableHead`; manter Status e a coluna de ações como `TableHead` simples (não ordenáveis)

## 4. Aplicar em ReceitaTable

- [x] 4.1 Em `components/features/receitas/ReceitaTable.tsx`, usar `useSortableData` sem `initialSort` sobre `data.receitas` e renderizar `sortedData` no lugar do array bruto
- [x] 4.2 Trocar os `TableHead` de Descrição, Categoria e Valor por `SortableTableHead`; manter a coluna de ações como `TableHead` simples

## 5. Verificação manual

- [x] 5.1 Rodar `npm run lint` e `npm run build` em `pactum-frontend`
- [x] 5.2 No navegador, validar em Despesas: ordenação padrão por Valor decrescente ao carregar a página, ciclo asc/desc/padrão em cada coluna ordenável, e que Status/ações não respondem a clique
- [x] 5.3 No navegador, validar em Receitas: ordem de chegada da API como padrão, ordenação funcional em Descrição/Categoria/Valor, e que a coluna de ações não responde a clique
