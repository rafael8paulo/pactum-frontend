## MODIFIED Requirements

### Requirement: Cadastrar nova receita
O sistema SHALL permitir cadastrar uma nova receita via dialog com formulário validado, chamando `POST /api/v1/receitas`. O campo Valor SHALL usar um input com máscara de moeda BRL (`R$ 0,00`).

#### Scenario: Dialog de nova receita abre
- **WHEN** o usuário clica no botão "Nova Receita"
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor, Categoria e Competência

#### Scenario: Validação impede envio de formulário inválido
- **WHEN** o usuário tenta submeter o formulário com campos obrigatórios vazios ou valor não positivo
- **THEN** mensagens de erro inline são exibidas nos campos inválidos e o formulário não é enviado

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** a receita é criada na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

#### Scenario: Campo Valor formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor do formulário de nova receita
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Editar receita existente
O sistema SHALL permitir editar uma receita existente via dialog com formulário pré-preenchido, chamando `PUT /api/v1/receitas/:id`. O campo Valor SHALL usar um input com máscara de moeda BRL, já exibindo o valor atual formatado ao abrir o dialog.

#### Scenario: Dialog de edição abre com dados pré-preenchidos
- **WHEN** o usuário clica em "Editar" em uma linha da tabela
- **THEN** um Dialog se abre com o formulário preenchido com os dados atuais da receita, e o campo Valor já exibe o valor formatado como moeda (ex.: `R$ 1.234,56`)

#### Scenario: Edição bem-sucedida
- **WHEN** o usuário altera campos e confirma
- **THEN** a receita é atualizada na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro na edição exibe toast
- **WHEN** a API retorna erro ao atualizar
- **THEN** o dialog permanece aberto e um toast de erro é exibido
