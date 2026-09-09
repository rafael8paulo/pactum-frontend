## MODIFIED Requirements

### Requirement: Listagem de contas recorrentes
O sistema SHALL exibir, em `/contas-recorrentes`, todas as contas recorrentes do usuário autenticado, consumindo `GET /api/v1/contas-recorrentes`, com colunas: Descrição, Categoria, Valor padrão (em BRL), Frequência, Forma de Pagamento, Próxima Cobrança, Dia de vencimento, Vigência (início/fim) e Status.

#### Scenario: Contas recorrentes carregando exibem skeletons
- **WHEN** a página é acessada e a requisição à API está em andamento
- **THEN** a tabela exibe linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista de contas recorrentes preenchida
- **WHEN** a API retorna contas recorrentes
- **THEN** a tabela exibe uma linha por conta, com o valor formatado em BRL, a frequência traduzida (ex.: "Mensal", "Trimestral"), a vigência formatada (ex: "jan/2026 – dez/2029" ou "desde jan/2026" quando não houver `competenciaFim`) e a próxima cobrança formatada como data (ex.: "10/09/2026")

#### Scenario: Lista vazia
- **WHEN** a API retorna lista vazia
- **THEN** a tabela é substituída por uma mensagem de estado vazio convidando o usuário a cadastrar a primeira conta recorrente

#### Scenario: Conta sem forma de pagamento exibe traço na coluna
- **WHEN** uma conta recorrente tem `formaPagamentoId: null`
- **THEN** a coluna Forma de Pagamento exibe "—" em vez de um nome

#### Scenario: Conta pausada ou encerrada não exibe próxima cobrança
- **WHEN** uma conta recorrente tem `status` diferente de `ATIVA`
- **THEN** a coluna Próxima Cobrança exibe "—"

---

### Requirement: Cadastrar conta recorrente
O sistema SHALL exibir um botão "Nova Conta Recorrente" que abre um dialog com formulário (`descricao`, `valorPadrao`, `categoria`, `diaVencimento` opcional, `competenciaInicio`, `competenciaFim` opcional, `frequencia`, `dataBaseCobranca`, `formaPagamentoId` opcional), validado com zod, e SHALL chamar `POST /api/v1/contas-recorrentes` ao submeter. O campo `valorPadrao` SHALL usar um input com máscara de moeda BRL (`R$ 0,00`). O campo `frequencia` SHALL ser um `Select` com as opções Semanal, Mensal, Trimestral, Anual, com "Mensal" pré-selecionado. O campo `formaPagamentoId` SHALL ser um `Select` populado a partir de `GET /api/v1/formas-pagamento`, com uma opção "Nenhuma".

#### Scenario: Cadastro bem-sucedido fecha o dialog e atualiza a lista
- **WHEN** o usuário preenche o formulário com dados válidos e submete
- **THEN** o dialog fecha, um toast de sucesso é exibido e a listagem é atualizada com a nova conta

#### Scenario: Erro de validação impede submissão
- **WHEN** o usuário tenta submeter o formulário sem preencher `descricao` ou com `valorPadrao` menor ou igual a zero
- **THEN** o formulário exibe mensagens de erro inline e não chama a API

#### Scenario: competenciaFim anterior a competenciaInicio bloqueia submissão
- **WHEN** o usuário informa uma `competenciaFim` anterior à `competenciaInicio`
- **THEN** o formulário exibe erro de validação e não chama a API

#### Scenario: dataBaseCobranca fora do mês de competenciaInicio bloqueia submissão
- **WHEN** o usuário informa uma `dataBaseCobranca` fora do mês selecionado em `competenciaInicio`
- **THEN** o formulário exibe erro de validação e não chama a API

#### Scenario: Erro da API exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** um toast de erro é exibido com a mensagem retornada pela API, e o dialog permanece aberto

#### Scenario: Campo Valor Padrão formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor Padrão do formulário de nova conta recorrente
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

#### Scenario: Frequência não selecionada assume Mensal
- **WHEN** o usuário submete o formulário sem alterar o campo Frequência
- **THEN** a API é chamada com `"frequencia": "MENSAL"`

---

### Requirement: Editar conta recorrente
O sistema SHALL permitir editar uma conta recorrente existente através de um dialog pré-preenchido (incluindo `frequencia`, `dataBaseCobranca` e `formaPagamentoId`), chamando `PUT /api/v1/contas-recorrentes/{id}` ao submeter. O campo `valorPadrao` SHALL usar um input com máscara de moeda BRL, já exibindo o valor atual formatado ao abrir o dialog.

#### Scenario: Edição bem-sucedida atualiza a lista
- **WHEN** o usuário edita os campos e submete com dados válidos
- **THEN** o dialog fecha, um toast de sucesso é exibido e a linha correspondente na tabela reflete os novos valores

#### Scenario: Dialog de edição abre com o Valor Padrão já formatado
- **WHEN** o usuário abre o dialog de edição de uma conta recorrente existente
- **THEN** o campo Valor Padrão já exibe o valor atual formatado como moeda (ex.: `R$ 1.234,56`)

#### Scenario: Dialog de edição abre com Frequência e Forma de Pagamento pré-selecionadas
- **WHEN** o usuário abre o dialog de edição de uma conta recorrente com `frequencia: "TRIMESTRAL"` e `formaPagamentoId` preenchido
- **THEN** o campo Frequência já exibe "Trimestral" selecionado e o campo Forma de Pagamento já exibe a forma correspondente selecionada

#### Scenario: Alterar o valor exibe aviso de que o valor anterior será preservado no histórico
- **WHEN** o usuário altera o campo Valor Padrão para um valor diferente do atual e submete
- **THEN** após o sucesso, um toast confirma a atualização e menciona que o valor anterior fica disponível no histórico da conta

## ADDED Requirements

### Requirement: Consultar histórico de valores de uma conta recorrente
Cada linha da tabela em `/contas-recorrentes` SHALL exibir uma ação "Ver histórico de valores" que abre um dialog listando, para aquela conta, os valores cobrados ao longo do tempo (`valor`, `vigenteDesde`, `vigenteAte`), consumindo `GET /api/v1/contas-recorrentes/{id}/historico-valores`.

#### Scenario: Histórico exibe valor vigente e valores anteriores
- **WHEN** o usuário abre o histórico de uma conta que já teve 2 reajustes
- **THEN** o dialog exibe 3 registros ordenados do mais recente para o mais antigo, cada um com o valor formatado em BRL e o período de vigência (ex.: "desde 15/08/2026" para o vigente, "10/01/2026 – 14/08/2026" para um anterior)

#### Scenario: Histórico carregando exibe skeleton
- **WHEN** o dialog de histórico é aberto e a requisição está em andamento
- **THEN** o dialog exibe um `Skeleton` no lugar da lista

#### Scenario: Conta sem reajustes exibe apenas o valor de cadastro
- **WHEN** o usuário abre o histórico de uma conta que nunca teve o valor alterado
- **THEN** o dialog exibe um único registro com o valor vigente desde a data de cadastro e `vigenteAte` "—"
