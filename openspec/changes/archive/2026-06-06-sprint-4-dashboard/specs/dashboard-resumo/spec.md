# Spec: dashboard-resumo

## Purpose

Painel de visão geral financeira mensal: cards com os totais do mês selecionado e gráfico de barras com a evolução de receitas, despesas e saldo ao longo do ano.

---

## Requirements

## ADDED Requirements

### Requirement: Cards de resumo mensal
O sistema SHALL exibir três cards com os totais financeiros da competência selecionada: Total Receitas, Total Despesas e Saldo, consumindo `GET /api/v1/resumo?competencia=YYYY-MM`.

#### Scenario: Cards carregando exibem skeletons
- **WHEN** a página de resumo é acessada e a requisição ao endpoint mensal está em andamento
- **THEN** três cards com `Skeleton` são exibidos no lugar dos valores reais

#### Scenario: Cards exibem valores do mês
- **WHEN** a API retorna dados para a competência selecionada
- **THEN** três cards são exibidos com os valores formatados em BRL: Total Receitas, Total Despesas e Saldo

#### Scenario: Saldo positivo exibido em verde
- **WHEN** o saldo do mês é maior que zero
- **THEN** o valor do card Saldo é exibido em cor verde

#### Scenario: Saldo negativo exibido em vermelho
- **WHEN** o saldo do mês é menor que zero
- **THEN** o valor do card Saldo é exibido em cor vermelha

#### Scenario: Erro na requisição mensal exibe estado vazio
- **WHEN** a API retorna erro para o endpoint mensal
- **THEN** os cards exibem um estado de indisponibilidade sem quebrar a página

### Requirement: Gráfico de evolução anual
O sistema SHALL exibir um gráfico combinado com barras agrupadas (receitas e despesas) e linha (saldo) para cada mês do ano, consumindo `GET /api/v1/resumo/anual?ano=YYYY`.

#### Scenario: Gráfico carregando exibe skeleton
- **WHEN** a requisição ao endpoint anual está em andamento
- **THEN** um `Skeleton` com a altura do gráfico é exibido no lugar do chart

#### Scenario: Gráfico exibe dados do ano
- **WHEN** a API retorna dados do histórico anual
- **THEN** o gráfico exibe barras agrupadas para receitas (verde) e despesas (vermelho) e uma linha para saldo (azul) para cada mês retornado

#### Scenario: Eixo X mostra abreviações dos meses
- **WHEN** o gráfico é renderizado com dados
- **THEN** o eixo X exibe as abreviações dos meses (Jan, Fev, Mar…) com base na competência de cada entrada

#### Scenario: Tooltip exibe valores formatados
- **WHEN** o usuário passa o cursor sobre uma barra ou ponto do gráfico
- **THEN** um tooltip exibe os valores de receitas, despesas e saldo do respectivo mês formatados em BRL

### Requirement: Composição da página de resumo
O sistema SHALL exibir a página `/resumo` com os cards de resumo mensal e o gráfico de evolução anual, sincronizados com a competência selecionada no MonthPicker.

#### Scenario: Página exibe dados da competência ativa
- **WHEN** o usuário navega para `/resumo` com `?competencia=YYYY-MM` na URL
- **THEN** os cards exibem o resumo do mês YYYY-MM e o gráfico exibe o histórico do ano YYYY

#### Scenario: Competência sem parâmetro usa mês corrente
- **WHEN** o usuário navega para `/resumo` sem parâmetro `competencia`
- **THEN** a página usa o mês corrente como competência padrão
