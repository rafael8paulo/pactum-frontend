## MODIFIED Requirements

### Requirement: Redirecionamento para /resumo se já autenticado
O sistema SHALL redirecionar o usuário para `/inicio` se ele acessar `/login` já estando autenticado. O mesmo destino SHALL ser usado após uma autenticação bem-sucedida.

#### Scenario: Usuário autenticado não vê a tela de login
- **WHEN** um usuário com sessão ativa navega para `/login`
- **THEN** o sistema redireciona automaticamente para `/inicio`

#### Scenario: Autenticação bem-sucedida leva a Início
- **WHEN** o usuário conclui o login com credenciais válidas
- **THEN** o sistema o direciona para `/inicio`
