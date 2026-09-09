## ADDED Requirements

### Requirement: Cards de resumo mensal recorrente
O sistema SHALL exibir, no topo de `/contas-recorrentes`, um card com o total mensal recorrente comprometido (`totalMensalRecorrente`), consumindo `GET /api/v1/contas-recorrentes/resumo`.

#### Scenario: Card carregando exibe skeleton
- **WHEN** a página é acessada e a requisição ao endpoint de resumo está em andamento
- **THEN** o card exibe um `Skeleton` no lugar do valor

#### Scenario: Card exibe o total formatado em BRL
- **WHEN** a API retorna `totalMensalRecorrente: 180.00`
- **THEN** o card exibe "R$ 180,00"

#### Scenario: Sem contas recorrentes ativas exibe zero
- **WHEN** a API retorna `totalMensalRecorrente: 0`
- **THEN** o card exibe "R$ 0,00" sem erro

---

### Requirement: Breakdown por forma de pagamento
O sistema SHALL exibir, junto ao card de total mensal, uma lista (ou gráfico de barras) com o total mensal recorrente agrupado por forma de pagamento, usando o campo `porFormaPagamento` da resposta de `GET /api/v1/contas-recorrentes/resumo`.

#### Scenario: Breakdown exibe um item por forma de pagamento
- **WHEN** a API retorna `porFormaPagamento` com itens para "Nubank" (`R$ 60,00`) e "Itaú Conta Corrente" (`R$ 20,00`)
- **THEN** a seção exibe as duas formas de pagamento com seus respectivos totais formatados em BRL

#### Scenario: Contas sem forma de pagamento aparecem como "Sem forma de pagamento"
- **WHEN** a API retorna um item de `porFormaPagamento` com `formaPagamentoId: null`
- **THEN** a seção exibe esse item com o rótulo "Sem forma de pagamento"

#### Scenario: Breakdown vazio não exibe a seção
- **WHEN** a API retorna `porFormaPagamento: []`
- **THEN** a seção de breakdown não é exibida (ou exibe um estado vazio simples), sem quebrar o layout da página

---

### Requirement: Lista de próximas cobranças
O sistema SHALL exibir, em `/contas-recorrentes`, uma seção "Próximas cobranças" listando as assinaturas com cobrança prevista nos próximos 7 dias, consumindo `GET /api/v1/contas-recorrentes/proximas-cobrancas?dias=7`, com descrição, valor e data da cobrança.

#### Scenario: Seção carregando exibe skeleton
- **WHEN** a página é acessada e a requisição de próximas cobranças está em andamento
- **THEN** a seção exibe um `Skeleton` no lugar da lista

#### Scenario: Lista exibe as cobranças da janela
- **WHEN** a API retorna 2 contas recorrentes com cobrança prevista dentro dos próximos 7 dias
- **THEN** a seção exibe as 2 assinaturas, cada uma com descrição, valor formatado em BRL e a data da próxima cobrança

#### Scenario: Nenhuma cobrança próxima exibe estado vazio
- **WHEN** a API retorna lista vazia
- **THEN** a seção exibe uma mensagem indicando que não há cobranças previstas para os próximos dias

#### Scenario: Cobrança prevista para hoje é destacada
- **WHEN** uma assinatura na lista tem `proximaCobranca` igual à data de hoje
- **THEN** essa linha é exibida com destaque visual (ex.: badge "Hoje")
