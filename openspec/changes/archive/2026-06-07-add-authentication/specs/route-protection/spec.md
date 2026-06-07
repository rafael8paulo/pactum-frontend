## ADDED Requirements

### Requirement: ProtectedRoute bloqueia acesso não autenticado ao dashboard
O sistema SHALL ter um componente `ProtectedRoute` em `components/ui/protected-route.tsx` que verifica o estado de autenticação via `useAuth()` e redireciona para `/login` se o usuário não estiver autenticado.

#### Scenario: Usuário autenticado visualiza o conteúdo protegido
- **WHEN** um usuário autenticado acessa qualquer rota do dashboard (ex: `/despesas`)
- **THEN** o `ProtectedRoute` renderiza o conteúdo filho normalmente

#### Scenario: Usuário não autenticado é redirecionado para /login
- **WHEN** um usuário não autenticado (`usuario === null`) acessa qualquer rota do dashboard
- **THEN** o `ProtectedRoute` executa `router.replace('/login')` e nenhum conteúdo do dashboard é renderizado

#### Scenario: Estado de carregamento exibe PageLoader
- **WHEN** o `AuthProvider` ainda está verificando a sessão (`isLoading: true`)
- **THEN** o `ProtectedRoute` exibe o componente `<PageLoader />` enquanto aguarda o resultado

### Requirement: ProtectedRoute é aplicado no layout do dashboard
O sistema SHALL ter o `app/(dashboard)/layout.tsx` envolvendo todo o seu conteúdo com `<ProtectedRoute>`, garantindo que nenhuma página de dashboard seja acessível sem autenticação.

#### Scenario: Acesso direto a rota protegida sem sessão redireciona para login
- **WHEN** o usuário navega diretamente para `/resumo` sem estar autenticado
- **THEN** o browser é redirecionado para `/login`

#### Scenario: Acesso com sessão válida renderiza a página normalmente
- **WHEN** o usuário navega para `/resumo` com sessão válida
- **THEN** a página de Resumo é renderizada normalmente dentro do layout com Sidebar e Header
