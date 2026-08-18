## MODIFIED Requirements

### Requirement: Cadastrar conta recorrente
O sistema SHALL exibir um botão "Nova Conta Recorrente" que abre um dialog com formulário (`descricao`, `valorPadrao`, `categoria`, `diaVencimento` opcional, `competenciaInicio`, `competenciaFim` opcional), validado com zod, e SHALL chamar `POST /api/v1/contas-recorrentes` ao submeter. O campo `valorPadrao` SHALL usar um input com máscara de moeda BRL (`R$ 0,00`).

#### Scenario: Cadastro bem-sucedido fecha o dialog e atualiza a lista
- **WHEN** o usuário preenche o formulário com dados válidos e submete
- **THEN** o dialog fecha, um toast de sucesso é exibido e a listagem é atualizada com a nova conta

#### Scenario: Erro de validação impede submissão
- **WHEN** o usuário tenta submeter o formulário sem preencher `descricao` ou com `valorPadrao` menor ou igual a zero
- **THEN** o formulário exibe mensagens de erro inline e não chama a API

#### Scenario: competenciaFim anterior a competenciaInicio bloqueia submissão
- **WHEN** o usuário informa uma `competenciaFim` anterior à `competenciaInicio`
- **THEN** o formulário exibe erro de validação e não chama a API

#### Scenario: Erro da API exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** um toast de erro é exibido com a mensagem retornada pela API, e o dialog permanece aberto

#### Scenario: Campo Valor Padrão formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor Padrão do formulário de nova conta recorrente
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Editar conta recorrente
O sistema SHALL permitir editar uma conta recorrente existente através de um dialog pré-preenchido, chamando `PUT /api/v1/contas-recorrentes/{id}` ao submeter. O campo `valorPadrao` SHALL usar um input com máscara de moeda BRL, já exibindo o valor atual formatado ao abrir o dialog.

#### Scenario: Edição bem-sucedida atualiza a lista
- **WHEN** o usuário edita os campos e submete com dados válidos
- **THEN** o dialog fecha, um toast de sucesso é exibido e a linha correspondente na tabela reflete os novos valores

#### Scenario: Dialog de edição abre com o Valor Padrão já formatado
- **WHEN** o usuário abre o dialog de edição de uma conta recorrente existente
- **THEN** o campo Valor Padrão já exibe o valor atual formatado como moeda (ex.: `R$ 1.234,56`)
