## MODIFIED Requirements

### Requirement: Email já cadastrado exibe erro inline no campo email e toast
O sistema SHALL exibir uma mensagem de erro inline no campo **Email** quando a API retornar `409 Conflict`, indicando que o email já está em uso, **e** SHALL exibir um toast de erro com a mesma mensagem.

#### Scenario: Conflito de email exibe erro no campo e toast
- **WHEN** o usuário submete o formulário com um email já cadastrado e a API retorna `409`
- **THEN** uma mensagem de erro é exibida abaixo do campo Email **e** um toast de erro é exibido; o botão volta ao estado normal
