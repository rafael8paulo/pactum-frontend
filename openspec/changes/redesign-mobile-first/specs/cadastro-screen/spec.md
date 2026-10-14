## MODIFIED Requirements

### Requirement: Redirecionamento para /resumo se já autenticado
O sistema SHALL redirecionar o usuário para `/inicio` se ele acessar `/cadastro` já estando autenticado. Após um cadastro bem-sucedido, o sistema SHALL direcionar o usuário para `/inicio`, onde o roteiro de configuração inicial é exibido.

#### Scenario: Usuário autenticado não vê a tela de cadastro
- **WHEN** um usuário com sessão ativa navega para `/cadastro`
- **THEN** o sistema redireciona automaticamente para `/inicio`

#### Scenario: Cadastro bem-sucedido leva ao roteiro de configuração
- **WHEN** o usuário conclui o cadastro com dados válidos
- **THEN** o sistema o direciona para `/inicio` e o roteiro de configuração inicial é exibido com os três passos pendentes
