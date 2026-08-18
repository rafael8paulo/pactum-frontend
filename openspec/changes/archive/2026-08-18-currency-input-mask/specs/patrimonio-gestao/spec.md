## MODIFIED Requirements

### Requirement: Cadastrar novo item de patrimônio
O sistema SHALL permitir cadastrar um novo item de patrimônio via dialog com formulário validado, chamando `POST /api/v1/patrimonio`. O campo Valor SHALL usar um input com máscara de moeda BRL (`R$ 0,00`).

#### Scenario: Dialog de novo item abre
- **WHEN** o usuário clica no botão "Novo Item"
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor e Competência

#### Scenario: Validação impede envio inválido
- **WHEN** o usuário tenta submeter o formulário com campos obrigatórios vazios ou valor não positivo
- **THEN** mensagens de erro inline são exibidas e o formulário não é enviado

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** o item é criado na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

#### Scenario: Campo Valor formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor do formulário de novo item de patrimônio
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita
