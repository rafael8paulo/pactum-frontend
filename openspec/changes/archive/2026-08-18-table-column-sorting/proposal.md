## Why

As tabelas de listagem (Despesas, Receitas) exibem os dados na ordem em que a API retorna, sem nenhuma forma de reordenação. Para uma tela financeira, comparar valores e localizar o maior/menor lançamento exige ordenação manual mental. O usuário quer poder ordenar por qualquer coluna clicando no cabeçalho, com a lista de Despesas já vindo por padrão ordenada pela coluna Valor em ordem decrescente.

## What Changes

- Adicionar ordenação clicável nos cabeçalhos de `DespesaTable` e `ReceitaTable`: clique alterna entre ascendente, descendente e (no 3º clique) volta ao estado padrão da tela.
- Indicador visual (ícone de seta) no cabeçalho da coluna atualmente ordenada, mostrando a direção.
- Ordenação é feita client-side sobre os dados já carregados (não introduz parâmetros de sort na API), consistente com a arquitetura atual onde a lista completa da competência já é buscada de uma vez.
- `DespesaTable` passa a carregar, por padrão, ordenada pela coluna **Valor** em ordem **decrescente**. `ReceitaTable` mantém a ordem de chegada da API como padrão (nenhum requisito do usuário pede mudança de padrão ali; só ganha a capacidade de ordenar).
- Extrair a lógica de ordenação (estado de coluna/direção + comparadores por tipo de coluna) para um hook reutilizável em `hooks/`, usado por ambas as tabelas, para não duplicar a lógica.
- Colunas de ação (editar/remover) e a coluna Status de `DespesaTable` (select inline) não são ordenáveis — não fazem sentido como critério de ordenação.

## Capabilities

### New Capabilities
- `table-sorting`: comportamento genérico e reutilizável de ordenação client-side por coluna em tabelas de listagem (clique no cabeçalho, ciclo de direções, indicador visual, comparadores por tipo de dado).

### Modified Capabilities
- `despesas-crud`: o requisito "Listagem de despesas por competência" passa a incluir ordenação por coluna e um estado padrão de ordenação (Valor decrescente).
- `receitas-crud`: o requisito "Listagem de receitas por competência" passa a incluir ordenação por coluna (sem alterar a ordem padrão atual).

## Impact

- `components/features/despesas/DespesaTable.tsx`: cabeçalhos viram clicáveis, dados ordenados antes de renderizar.
- `components/features/receitas/ReceitaTable.tsx`: mesma mudança.
- Novo hook `hooks/useSortableTable.ts` (ou nome equivalente): estado de ordenação + função de comparação.
- Nenhuma mudança de API/backend — ordenação é puramente client-side sobre os dados já retornados por `useDespesas`/`useReceitas`.
- `PatrimonioGrid` (grid de cards) não é afetado — não é uma tabela.
