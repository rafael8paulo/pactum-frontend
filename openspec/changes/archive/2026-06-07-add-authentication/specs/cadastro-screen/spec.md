## ADDED Requirements

### Requirement: Tela de cadastro com formulário validado e confirmação de senha
O sistema SHALL ter uma tela pública em `app/(auth)/cadastro/page.tsx` com um formulário contendo campos de **Nome**, **Email**, **Senha** e **Confirmar Senha**, validados com `zod` + `react-hook-form`.

#### Scenario: Confirmação de senha divergente exibe erro inline
- **WHEN** o usuário submete o formulário com "Confirmar Senha" diferente de "Senha"
- **THEN** uma mensagem de erro é exibida abaixo do campo "Confirmar Senha" indicando que as senhas não conferem

#### Scenario: Campos inválidos exibem mensagens de erro inline
- **WHEN** o usuário submete o formulário com nome com menos de 2 caracteres, email inválido ou senha com menos de 6 caracteres
- **THEN** mensagens de validação são exibidas abaixo dos campos correspondentes (sem toast)

#### Scenario: Submit dispara estado de loading no botão
- **WHEN** o usuário submete o formulário com dados válidos
- **THEN** o botão exibe um `<Spinner size="sm" />` e fica desabilitado enquanto a requisição está em andamento

#### Scenario: Cadastro bem-sucedido redireciona para /resumo
- **WHEN** a API retorna sucesso com os dados do novo usuário
- **THEN** o usuário é redirecionado automaticamente para `/resumo`

### Requirement: Email já cadastrado exibe erro inline no campo email
O sistema SHALL exibir uma mensagem de erro inline no campo **Email** quando a API retornar `409 Conflict`, indicando que o email já está em uso.

#### Scenario: Conflito de email exibe erro no campo
- **WHEN** o usuário submete o formulário com um email já cadastrado e a API retorna `409`
- **THEN** uma mensagem de erro é exibida abaixo do campo Email (não como toast) e o botão volta ao estado normal

### Requirement: Redirecionamento para /resumo se já autenticado
O sistema SHALL redirecionar o usuário para `/resumo` se ele acessar `/cadastro` já estando autenticado.

#### Scenario: Usuário autenticado não vê a tela de cadastro
- **WHEN** um usuário com sessão ativa navega para `/cadastro`
- **THEN** o sistema redireciona automaticamente para `/resumo`

### Requirement: Link para a tela de login
O sistema SHALL exibir na tela de cadastro um link com texto `"Já tem conta? Entrar"` que navega para `/login`.

#### Scenario: Link de login está visível e funcional
- **WHEN** o usuário visualiza a tela de cadastro
- **THEN** um link "Já tem conta? Entrar" é exibido e ao clicar navega para `/login`
