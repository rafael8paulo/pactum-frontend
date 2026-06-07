## 1. Fundação: Tipos e API Client

- [x] 1.1 Instalar dependências: `npm install js-cookie` e `npm install --save-dev @types/js-cookie`
- [x] 1.2 Criar `types/auth.ts` com interfaces `Usuario`, `LoginRequest` e `CadastroRequest`
- [x] 1.3 Criar `lib/api/auth.ts` com `authApi` (métodos: `login`, `cadastro`, `logout`, `me`)
- [x] 1.4 Atualizar `lib/api/client.ts`: adicionar `withCredentials: true` e interceptor de `401` que redireciona para `/login`

## 2. AuthProvider e Hook useAuth

- [x] 2.1 Criar `providers/auth-provider.tsx` com estado `usuario: Usuario | null` e `isLoading: boolean`
- [x] 2.2 Implementar inicialização: chamar `authApi.me()` no `useEffect` para restaurar sessão; tratar `401` mantendo `usuario: null` sem redirecionar
- [x] 2.3 Implementar `login()`: chamar `authApi.login()`, atualizar `usuario` e redirecionar para `/resumo`
- [x] 2.4 Implementar `cadastro()`: chamar `authApi.cadastro()`, atualizar `usuario` e redirecionar para `/resumo`
- [x] 2.5 Implementar `logout()`: chamar `authApi.logout()`, definir `usuario: null` e redirecionar para `/login`
- [x] 2.6 Exportar hook `useAuth()` que consome o `AuthContext`
- [x] 2.7 Adicionar `<AuthProvider>` no `app/layout.tsx` envolvendo o `QueryClientProvider`

## 3. Proteção de Rotas

- [x] 3.1 Criar `components/ui/protected-route.tsx`: se `isLoading` exibe `<PageLoader />`; se `usuario === null` chama `router.replace('/login')`; se autenticado renderiza `{children}`
- [x] 3.2 Aplicar `<ProtectedRoute>` no `app/(dashboard)/layout.tsx` envolvendo o conteúdo do dashboard

## 4. Layout das Telas de Autenticação

- [x] 4.1 Criar `app/(auth)/layout.tsx`: sem Sidebar, sem Header; fundo neutro com card centralizado vertical e horizontalmente
- [x] 4.2 Exibir nome "Pactum" e ícone/logo no topo do card no `(auth)/layout.tsx`
- [x] 4.3 Garantir que o layout funciona corretamente em viewports mobile (padding lateral, sem overflow)

## 5. Tela de Login

- [x] 5.1 Criar `components/features/auth/LoginForm.tsx` com campos Email e Senha usando `react-hook-form` + `zod`
- [x] 5.2 Implementar schema zod: email válido + senha mínimo 6 caracteres
- [x] 5.3 Exibir mensagens de validação inline abaixo dos campos
- [x] 5.4 Exibir `<Spinner size="sm" />` no botão durante o submit; desabilitar botão enquanto pendente
- [x] 5.5 Tratar erro de credenciais inválidas: exibir mensagem inline abaixo do formulário (não toast)
- [x] 5.6 Criar `app/(auth)/login/page.tsx`: redirecionar para `/resumo` se já autenticado; renderizar `<LoginForm />`
- [x] 5.7 Adicionar link "Não tem conta? Cadastre-se" que navega para `/cadastro`

## 6. Tela de Cadastro

- [x] 6.1 Criar `components/features/auth/CadastroForm.tsx` com campos Nome, Email, Senha e Confirmar Senha
- [x] 6.2 Implementar schema zod: nome mínimo 2 chars + email válido + senha mínimo 6 chars + `.refine()` para confirmação de senha
- [x] 6.3 Exibir mensagens de validação inline abaixo dos campos
- [x] 6.4 Exibir `<Spinner size="sm" />` no botão durante o submit; desabilitar botão enquanto pendente
- [x] 6.5 Tratar erro `409` (email duplicado): exibir mensagem inline no campo Email usando `setError` do react-hook-form
- [x] 6.6 Criar `app/(auth)/cadastro/page.tsx`: redirecionar para `/resumo` se já autenticado; renderizar `<CadastroForm />`
- [x] 6.7 Adicionar link "Já tem conta? Entrar" que navega para `/login`

## 7. Header: Usuário Autenticado e Logout

- [x] 7.1 Atualizar `components/features/layout/Header.tsx`: consumir `useAuth()` e exibir `usuario.nome` no canto direito
- [x] 7.2 Adicionar botão ou dropdown "Sair" que chama `logout()` do `useAuth()`
- [x] 7.3 Exibir `<Spinner size="sm" />` no lugar do botão "Sair" enquanto o logout está em andamento
