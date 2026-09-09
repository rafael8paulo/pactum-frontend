## ADDED Requirements

### Requirement: Navegação para Formas de Pagamento
O sistema SHALL exibir um item "Formas de Pagamento" na `Sidebar`, apontando para `/formas-pagamento`, seguindo o mesmo padrão visual dos itens existentes.

#### Scenario: Item de navegação ativo na rota correspondente
- **WHEN** o usuário está em `/formas-pagamento`
- **THEN** o item "Formas de Pagamento" na `Sidebar` é exibido com o estilo de item ativo

---

### Requirement: Listagem de formas de pagamento
O sistema SHALL exibir, em `/formas-pagamento`, todas as formas de pagamento do usuário autenticado, consumindo `GET /api/v1/formas-pagamento`, com colunas: Nome, Tipo e Dia de Fechamento da Fatura.

#### Scenario: Formas de pagamento carregando exibem skeletons
- **WHEN** a página é acessada e a requisição à API está em andamento
- **THEN** a tabela exibe linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista preenchida
- **WHEN** a API retorna formas de pagamento
- **THEN** a tabela exibe uma linha por forma de pagamento, com o tipo traduzido (ex.: "Cartão de Crédito")

#### Scenario: Lista vazia
- **WHEN** a API retorna lista vazia
- **THEN** a tabela é substituída por uma mensagem de estado vazio convidando o usuário a cadastrar a primeira forma de pagamento

#### Scenario: Forma sem dia de fechamento exibe traço
- **WHEN** uma forma de pagamento tem `diaFechamentoFatura: null`
- **THEN** a coluna Dia de Fechamento da Fatura exibe "—"

---

### Requirement: Cadastrar forma de pagamento
O sistema SHALL exibir um botão "Nova Forma de Pagamento" que abre um dialog com formulário (`nome`, `tipo`, `diaFechamentoFatura` opcional), validado com zod, e SHALL chamar `POST /api/v1/formas-pagamento` ao submeter. O campo `diaFechamentoFatura` SHALL ser exibido apenas quando `tipo` for `CARTAO_CREDITO`.

#### Scenario: Cadastro bem-sucedido fecha o dialog e atualiza a lista
- **WHEN** o usuário preenche o formulário com dados válidos e submete
- **THEN** o dialog fecha, um toast de sucesso é exibido e a listagem é atualizada com a nova forma de pagamento

#### Scenario: Erro de validação impede submissão
- **WHEN** o usuário tenta submeter o formulário sem preencher `nome`
- **THEN** o formulário exibe mensagem de erro inline e não chama a API

#### Scenario: Campo Dia de Fechamento aparece apenas para Cartão de Crédito
- **WHEN** o usuário seleciona o tipo "Cartão de Crédito" no formulário
- **THEN** o campo Dia de Fechamento da Fatura passa a ser exibido

#### Scenario: Erro da API exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** um toast de erro é exibido com a mensagem retornada pela API, e o dialog permanece aberto

---

### Requirement: Editar forma de pagamento
O sistema SHALL permitir editar uma forma de pagamento existente através de um dialog pré-preenchido, chamando `PUT /api/v1/formas-pagamento/{id}` ao submeter.

#### Scenario: Edição bem-sucedida atualiza a lista
- **WHEN** o usuário edita os campos e submete com dados válidos
- **THEN** o dialog fecha, um toast de sucesso é exibido e a linha correspondente na tabela reflete os novos valores

---

### Requirement: Remover forma de pagamento
O sistema SHALL permitir remover uma forma de pagamento, com confirmação antes da remoção — incluindo um aviso de que contas recorrentes vinculadas ficarão sem forma de pagamento definida — chamando `DELETE /api/v1/formas-pagamento/{id}`.

#### Scenario: Remoção bem-sucedida
- **WHEN** o usuário confirma a remoção de uma forma de pagamento
- **THEN** a API é chamada, um toast de sucesso é exibido, a linha desaparece da tabela e a query de contas recorrentes é invalidada

#### Scenario: Remoção cancelada não chama a API
- **WHEN** o usuário abre a confirmação de remoção e cancela
- **THEN** nenhuma chamada é feita à API e a forma de pagamento permanece na tabela
