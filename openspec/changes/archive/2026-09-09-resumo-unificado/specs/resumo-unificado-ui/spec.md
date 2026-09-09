## ADDED Requirements

### Requirement: Página de resumo unificado
O sistema SHALL exibir a página `/resumo-unificado`, acessível a partir da Sidebar, combinando na mesma tela os totais mensais e as listas de despesas e receitas da competência selecionada no MonthPicker.

#### Scenario: Página exibe dados da competência ativa
- **WHEN** o usuário navega para `/resumo-unificado` com `?competencia=YYYY-MM` na URL
- **THEN** os cards de totais, o painel de receitas e o painel de despesas exibem dados da competência YYYY-MM

#### Scenario: Competência sem parâmetro usa mês corrente
- **WHEN** o usuário navega para `/resumo-unificado` sem parâmetro `competencia`
- **THEN** a página usa o mês corrente como competência padrão

#### Scenario: Página não substitui as telas existentes
- **WHEN** o usuário acessa `/despesas`, `/receitas` ou `/resumo`
- **THEN** essas páginas continuam funcionando exatamente como antes, sem redirecionamento para `/resumo-unificado`

### Requirement: Cards de totais do mês
O sistema SHALL exibir três cards no topo da página com Total Receitas, Total Despesas e Saldo da competência selecionada, consumindo os mesmos dados de `GET /api/v1/resumo?competencia=YYYY-MM` usados pela página `/resumo`.

#### Scenario: Cards carregando exibem skeletons
- **WHEN** a página é acessada e a requisição ao endpoint de resumo mensal está em andamento
- **THEN** os três cards exibem `Skeleton` no lugar dos valores reais

#### Scenario: Card de Saldo exibe percentual comprometido
- **WHEN** a API retorna `totalReceitas` maior que zero para a competência
- **THEN** o card de Saldo exibe uma barra de progresso representando o percentual de `totalDespesas` sobre `totalReceitas`

#### Scenario: Saldo positivo exibido em verde
- **WHEN** o saldo do mês é maior que zero
- **THEN** o valor do card Saldo é exibido em cor verde (token semântico de sucesso do tema ativo)

#### Scenario: Saldo negativo exibido em vermelho
- **WHEN** o saldo do mês é menor que zero
- **THEN** o valor do card Saldo é exibido em cor vermelha (token semântico de erro do tema ativo)

### Requirement: Painel de receitas do mês
O sistema SHALL exibir, em uma coluna (desktop) ou aba (mobile), a lista de receitas da competência selecionada, com botão "+ Nova receita" e ações de editar/remover por linha, reaproveitando `useReceitas`, `NovaReceitaDialog`, `EditarReceitaDialog` e `useRemoverReceita`.

#### Scenario: Lista de receitas carregando exibe skeletons
- **WHEN** a requisição de receitas da competência está em andamento
- **THEN** o painel de receitas exibe linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista de receitas preenchida
- **WHEN** a API retorna receitas para a competência
- **THEN** o painel exibe uma linha compacta por receita com descrição, categoria e valor formatado em BRL

#### Scenario: Lista de receitas vazia
- **WHEN** a API retorna lista vazia de receitas para a competência
- **THEN** o painel exibe uma mensagem de estado vazio contextualizada com a competência

#### Scenario: Abrir cadastro de nova receita
- **WHEN** o usuário clica em "+ Nova receita" no painel
- **THEN** o mesmo Dialog de cadastro usado em `/receitas` é aberto, pré-preenchido com a competência ativa

#### Scenario: Editar receita a partir do painel
- **WHEN** o usuário clica em "Editar" em uma linha do painel de receitas
- **THEN** o Dialog de edição de receita abre pré-preenchido com os dados daquela receita

#### Scenario: Remover receita a partir do painel
- **WHEN** o usuário confirma a remoção de uma receita no painel
- **THEN** a receita é removida via `useRemoverReceita`, a lista é atualizada e um toast de sucesso é exibido

### Requirement: Painel de despesas do mês com filtro de status
O sistema SHALL exibir, em uma coluna (desktop) ou aba (mobile), a lista de despesas da competência selecionada, com filtro local por status (Todos/Pendentes/Pagos), botão "+ Nova despesa" e ações de editar/remover/alternar status por linha, reaproveitando `useDespesas`, `useAtualizarStatusDespesa`, `NovaDespesaDialog`, `EditarDespesaDialog` e `useRemoverDespesa`.

#### Scenario: Lista de despesas carregando exibe skeletons
- **WHEN** a requisição de despesas da competência está em andamento
- **THEN** o painel de despesas exibe linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista de despesas preenchida
- **WHEN** a API retorna despesas para a competência
- **THEN** o painel exibe uma linha compacta por despesa com descrição, categoria, valor formatado em BRL e um selo de status (Pendente/Pago)

#### Scenario: Filtro padrão exibe todas as despesas
- **WHEN** o painel de despesas é carregado
- **THEN** o filtro local inicia em "Todos" e todas as despesas da competência são exibidas

#### Scenario: Filtrar despesas pendentes
- **WHEN** o usuário seleciona o filtro "Pendentes" no painel
- **THEN** apenas despesas com status diferente de PAGA são exibidas na lista, sem alterar a URL da página

#### Scenario: Filtrar despesas pagas
- **WHEN** o usuário seleciona o filtro "Pagos" no painel
- **THEN** apenas despesas com status PAGA são exibidas na lista, sem alterar a URL da página

#### Scenario: Lista de despesas vazia para o filtro ativo
- **WHEN** nenhuma despesa da competência atende ao filtro local selecionado
- **THEN** o painel exibe uma mensagem de estado vazio contextualizada com o filtro ativo

#### Scenario: Alternar status de uma despesa a partir do painel
- **WHEN** o usuário clica no selo de status de uma despesa no painel
- **THEN** o status da despesa é alternado via `useAtualizarStatusDespesa` e o selo é atualizado imediatamente após a resposta da API

#### Scenario: Abrir cadastro de nova despesa
- **WHEN** o usuário clica em "+ Nova despesa" no painel
- **THEN** o mesmo Dialog de cadastro usado em `/despesas` é aberto, pré-preenchido com a competência ativa

#### Scenario: Editar despesa a partir do painel
- **WHEN** o usuário clica em "Editar" em uma linha do painel de despesas
- **THEN** o Dialog de edição de despesa abre pré-preenchido com os dados daquela despesa

#### Scenario: Remover despesa a partir do painel
- **WHEN** o usuário confirma a remoção de uma despesa no painel
- **THEN** a despesa é removida via `useRemoverDespesa`, a lista é atualizada e um toast de sucesso é exibido

### Requirement: Layout responsivo com abas em mobile
O sistema SHALL adaptar a página `/resumo-unificado` para viewports menores que 768px, substituindo as duas colunas lado a lado por abas "Despesas" e "Receitas" que compartilham a mesma área de lista.

#### Scenario: Desktop exibe as duas listas lado a lado
- **WHEN** a página é visualizada em uma viewport igual ou maior que 768px
- **THEN** os painéis de Receitas e Despesas são exibidos lado a lado em duas colunas

#### Scenario: Mobile exibe abas
- **WHEN** a página é visualizada em uma viewport menor que 768px
- **THEN** apenas um painel é exibido por vez, controlado por abas "Despesas" e "Receitas", com a aba "Despesas" ativa por padrão

#### Scenario: Alternar entre abas em mobile
- **WHEN** o usuário toca na aba "Receitas" estando na aba "Despesas"
- **THEN** o painel de receitas é exibido no lugar do painel de despesas, mantendo os dados já carregados
