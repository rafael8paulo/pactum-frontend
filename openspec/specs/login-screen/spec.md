# Spec: login-screen

## Purpose

Tela pública de login, com formulário validado, tratamento de erros inline e redirecionamento automático para usuários já autenticados.

---

## Requirements

### Requirement: Tela de login com formulário validado
O sistema SHALL ter uma tela pública em `app/(auth)/login/page.tsx` com um formulário de login contendo campos de **Email** e **Senha**, validados com `zod` + `react-hook-form`.

#### Scenario: Campos inválidos exibem mensagens de erro inline
- **WHEN** o usuário submete o formulário com email inválido ou senha com menos de 6 caracteres
- **THEN** mensagens de validação são exibidas abaixo dos campos correspondentes (sem toast)

#### Scenario: Submit dispara estado de loading no botão
- **WHEN** o usuário submete o formulário com dados válidos
- **THEN** o botão exibe um `<Spinner size="sm" />` e fica desabilitado enquanto a requisição está em andamento

#### Scenario: Credenciais inválidas exibem erro inline e toast
- **WHEN** a API retorna erro de credenciais inválidas
- **THEN** uma mensagem de erro é exibida inline abaixo do formulário **e** um toast de erro é exibido; o botão volta ao estado normal

#### Scenario: Login bem-sucedido redireciona para /resumo
- **WHEN** a API retorna sucesso com os dados do usuário
- **THEN** o usuário é redirecionado automaticamente para `/resumo`

### Requirement: Redirecionamento para /resumo se já autenticado
O sistema SHALL redirecionar o usuário para `/resumo` se ele acessar `/login` já estando autenticado.

#### Scenario: Usuário autenticado não vê a tela de login
- **WHEN** um usuário com sessão ativa navega para `/login`
- **THEN** o sistema redireciona automaticamente para `/resumo`

### Requirement: Link para a tela de cadastro
O sistema SHALL exibir na tela de login um link com texto `"Não tem conta? Cadastre-se"` que navega para `/cadastro`.

#### Scenario: Link de cadastro está visível e funcional
- **WHEN** o usuário visualiza a tela de login
- **THEN** um link "Não tem conta? Cadastre-se" é exibido e ao clicar navega para `/cadastro`
