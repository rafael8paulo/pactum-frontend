## Why

O Pactum Web atualmente não possui controle de acesso — qualquer pessoa com acesso à URL pode visualizar e editar dados financeiros do usuário. A autenticação é necessária para proteger os dados pessoais e identificar o usuário logado, consumindo a sessão stateful já implementada na `pactum-api` via cookie `JSESSIONID`.

## What Changes

- Axios configurado com `withCredentials: true` e interceptor de `401` que redireciona para `/login`
- Novo contexto `AuthProvider` com estado do usuário autenticado e funções de login, cadastro e logout
- Telas públicas de login e cadastro (`/login`, `/cadastro`) com layout próprio sem sidebar
- Componente `ProtectedRoute` aplicado ao layout do dashboard para bloquear acesso não autenticado
- Header atualizado para exibir o nome do usuário e botão de logout

## Capabilities

### New Capabilities

- `user-session`: Gerenciamento de sessão via AuthProvider — inicialização com `/auth/me`, login, cadastro e logout; expõe `useAuth()` hook
- `route-protection`: Proteção de rotas autenticadas via `ProtectedRoute`; redireciona para `/login` se não autenticado
- `login-screen`: Tela pública de login com formulário validado (zod + react-hook-form) e feedback de erro inline
- `cadastro-screen`: Tela pública de cadastro com validação de confirmação de senha e tratamento inline de email duplicado (409)
- `auth-layout`: Layout compartilhado das telas públicas de auth — sem sidebar, card centralizado com nome/logo do app

### Modified Capabilities

- `dashboard-layout`: O layout do dashboard passa a ser envolvido por `ProtectedRoute`; o Header exibe nome do usuário e botão de logout

## Impact

- **Dependências**: `js-cookie` + `@types/js-cookie` (instalação via npm)
- **API**: Novos endpoints consumidos — `POST /api/v1/auth/login`, `POST /api/v1/auth/cadastro`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- **Arquivos modificados**: `lib/api/client.ts`, `app/layout.tsx`, `app/(dashboard)/layout.tsx`, `components/features/layout/Header.tsx`
- **Arquivos novos**: `types/auth.ts`, `lib/api/auth.ts`, `providers/auth-provider.tsx`, `components/ui/protected-route.tsx`, `components/features/auth/LoginForm.tsx`, `components/features/auth/CadastroForm.tsx`, `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/cadastro/page.tsx`
- **Restrição crítica**: Nenhum dado de sessão em `localStorage`/`sessionStorage`; o cookie `JSESSIONID` é gerenciado exclusivamente pelo browser
