## MODIFIED Requirements

### Requirement: Navegação para Contas Recorrentes
O sistema SHALL servir a gestão de contas recorrentes na rota `/recorrentes` e SHALL torná-la alcançável em um toque a partir da navegação principal: como aba dedicada na barra de abas em viewports menores que 768px, e como item da `Sidebar` em viewports de 768px ou mais. A rota anterior `/contas-recorrentes` SHALL redirecionar permanentemente para `/recorrentes`.

#### Scenario: Item de navegação ativo na rota correspondente
- **WHEN** o usuário está em `/recorrentes`
- **THEN** o destino "Recorrentes" é exibido com o estilo de item ativo na navegação da viewport em uso

#### Scenario: Rota anterior redireciona
- **WHEN** o usuário acessa `/contas-recorrentes`
- **THEN** é redirecionado permanentemente para `/recorrentes`

#### Scenario: Alcançável em um toque em mobile
- **WHEN** o usuário está em qualquer aba em uma viewport menor que 768px
- **THEN** `/recorrentes` é alcançável em um único toque na barra de abas

### Requirement: Listagem de contas recorrentes
O sistema SHALL exibir, em `/recorrentes`, todas as contas recorrentes do usuário autenticado, consumindo `GET /api/v1/contas-recorrentes`. Em viewports de 768px ou mais, a apresentação SHALL ser a tabela com colunas Descrição, Categoria, Valor padrão (em BRL), Dia de vencimento, Vigência (início/fim) e Status. Em viewports menores que 768px, a apresentação SHALL ser uma lista na qual cada conta exibe descrição, valor em BRL, status em texto e uma linha de contexto combinando frequência, dia de vencimento e forma de pagamento.

#### Scenario: Contas recorrentes carregando exibem skeletons
- **WHEN** a página é acessada e a requisição à API está em andamento
- **THEN** a apresentação ativa exibe skeletons com a mesma estrutura do conteúdo real

#### Scenario: Lista de contas recorrentes preenchida
- **WHEN** a API retorna contas recorrentes e a viewport tem 768px ou mais
- **THEN** a tabela exibe uma linha por conta, com o valor formatado em BRL e a vigência formatada (ex: "jan/2026 – dez/2029" ou "desde jan/2026" quando não houver `competenciaFim`)

#### Scenario: Lista de contas recorrentes preenchida em mobile
- **WHEN** a API retorna contas recorrentes e a viewport é menor que 768px
- **THEN** cada conta é exibida em um item de lista com descrição, valor em BRL, status em texto e uma linha de contexto com frequência, dia de vencimento e forma de pagamento, sem rolagem horizontal

#### Scenario: Lista vazia
- **WHEN** a API retorna lista vazia
- **THEN** a apresentação é substituída por um estado vazio convidando o usuário a cadastrar a primeira conta recorrente

## ADDED Requirements

### Requirement: Ação de geração de lançamentos nomeia mês e valor
O sistema SHALL exibir, em `/recorrentes`, a ação de gerar lançamentos como uma ação primária que declara explicitamente a competência de destino, a quantidade de contas ativas consideradas e o valor total a ser gerado, antes de o usuário acioná-la.

#### Scenario: Ação declara competência, quantidade e valor
- **WHEN** existem 7 contas ativas somando R$ 1.842,70 e a competência de destino é outubro de 2026
- **THEN** a ação de geração exibe a competência "outubro", a quantidade de contas ativas e o valor total formatado em BRL antes de ser acionada

#### Scenario: Ação indisponível sem contas ativas
- **WHEN** não existem contas recorrentes ativas elegíveis para geração
- **THEN** a ação de geração não é exibida como ação primária acionável

### Requirement: Compromisso mensal recorrente em destaque
O sistema SHALL exibir, no topo de `/recorrentes`, o total mensal recorrente comprometido e sua distribuição por forma de pagamento, consumindo `GET /api/v1/contas-recorrentes/resumo`, em uma única superfície — sem exigir rolagem para relacionar o total à sua distribuição em viewports menores que 768px.

#### Scenario: Total e distribuição na mesma superfície
- **WHEN** a API retorna o resumo de assinaturas e a viewport é menor que 768px
- **THEN** o total mensal recorrente e a distribuição por forma de pagamento são exibidos juntos, sem rolagem entre eles

#### Scenario: Distribuição legível por texto
- **WHEN** a distribuição por forma de pagamento é exibida
- **THEN** cada forma de pagamento é identificada por nome e valor em BRL, e não apenas por cor
