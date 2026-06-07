# Spec: user-session

## Purpose

Gerenciamento global do estado de autenticação via `AuthProvider` e hook `useAuth()`, incluindo login, cadastro, logout e configuração do cliente HTTP.

---

## Requirements

### Requirement: AuthProvider gerencia estado global do usuário autenticado
O sistema SHALL ter um `AuthProvider` em `providers/auth-provider.tsx` que mantém `usuario: Usuario | null` e `isLoading: boolean` em estado React, expondo um hook `useAuth()` para consumo em toda a aplicação.

#### Scenario: Sessão existente é restaurada na inicialização
- **WHEN** a aplicação é carregada com um cookie de sessão válido no browser
- **THEN** o `AuthProvider` chama `GET /api/v1/auth/me`, popula `usuario` com os dados retornados e define `isLoading: false`

#### Scenario: Ausência de sessão não gera erro visível
- **WHEN** a aplicação é carregada sem cookie de sessão (usuário não autenticado)
- **THEN** o `AuthProvider` recebe `401` do `GET /api/v1/auth/me`, mantém `usuario: null` e define `isLoading: false` sem exibir toast ou erro

#### Scenario: Erro de rede não derruba a sessão
- **WHEN** a aplicação é carregada e o `GET /api/v1/auth/me` falha por timeout ou erro de rede (não 401)
- **THEN** o `AuthProvider` mantém `usuario: null` e define `isLoading: false` sem redirecionar para `/login`

### Requirement: Login atualiza o estado do usuário autenticado
O sistema SHALL expor uma função `login(data: LoginRequest): Promise<void>` via `useAuth()` que chama `POST /api/v1/auth/login`, atualiza `usuario` com o dado retornado e redireciona para `/resumo`.

#### Scenario: Login bem-sucedido redireciona para /resumo
- **WHEN** o usuário submete credenciais válidas via `login()`
- **THEN** a API retorna o objeto `Usuario`, `usuario` é atualizado no contexto e o usuário é redirecionado para `/resumo`

#### Scenario: Login com credenciais inválidas lança erro
- **WHEN** o usuário submete credenciais inválidas via `login()`
- **THEN** a função lança o erro recebido da API sem alterar `usuario` (o formulário trata o erro inline)

### Requirement: Cadastro cria conta e autentica automaticamente
O sistema SHALL expor uma função `cadastro(data: CadastroRequest): Promise<void>` via `useAuth()` que chama `POST /api/v1/auth/cadastro`, atualiza `usuario` com o dado retornado e redireciona para `/resumo`.

#### Scenario: Cadastro bem-sucedido redireciona para /resumo
- **WHEN** o usuário submete dados válidos de cadastro via `cadastro()`
- **THEN** a API retorna o objeto `Usuario`, `usuario` é atualizado no contexto e o usuário é redirecionado para `/resumo`

#### Scenario: Cadastro com email já existente lança erro 409
- **WHEN** o usuário submete um email já cadastrado via `cadastro()`
- **THEN** a função lança o erro `409` recebido da API sem alterar `usuario`

### Requirement: Logout limpa sessão e redireciona para /login
O sistema SHALL expor uma função `logout(): Promise<void>` via `useAuth()` que chama `POST /api/v1/auth/logout`, define `usuario: null` e redireciona para `/login`.

#### Scenario: Logout bem-sucedido limpa o estado e redireciona
- **WHEN** o usuário aciona `logout()`
- **THEN** a API invalida a sessão, `usuario` é definido como `null` e o usuário é redirecionado para `/login`

### Requirement: Axios configurado com withCredentials e interceptor de 401
O sistema SHALL ter `withCredentials: true` na instância Axios base em `lib/api/client.ts` e um interceptor de resposta que redireciona para `/login` via `window.location.href` em qualquer resposta `401`.

#### Scenario: Cookie de sessão enviado em todas as requisições
- **WHEN** qualquer chamada à API é feita (ex: listar despesas)
- **THEN** o browser inclui o cookie `JSESSIONID` automaticamente na requisição

#### Scenario: Resposta 401 dispara redirecionamento para /login
- **WHEN** a API retorna `401` em qualquer requisição (ex: sessão expirada)
- **THEN** o browser é redirecionado para `/login` via `window.location.href`
