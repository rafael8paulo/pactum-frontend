## MODIFIED Requirements

### Requirement: Layout shell com Sidebar e Header
O sistema SHALL ter `app/(dashboard)/layout.tsx` que envolve todas as páginas de feature com uma Sidebar lateral e um Header no topo, implementados em `components/features/layout/Sidebar.tsx` e `components/features/layout/Header.tsx`. O layout SHALL ser envolvido por `<ProtectedRoute>` para bloquear acesso não autenticado.

#### Scenario: Sidebar exibe links de navegação
- **WHEN** o usuário visualiza qualquer página de dashboard
- **THEN** a Sidebar exibe links para Resumo (`/resumo`), Despesas (`/despesas`), Receitas (`/receitas`) e Patrimônio (`/patrimônio`)

#### Scenario: Link ativo é destacado visualmente
- **WHEN** o usuário está na página `/despesas`
- **THEN** o link "Despesas" na Sidebar é destacado visualmente (ex: cor de fundo diferente) e os demais links não estão destacados

#### Scenario: Acesso não autenticado ao dashboard redireciona para /login
- **WHEN** um usuário não autenticado tenta acessar qualquer página do dashboard
- **THEN** o `ProtectedRoute` redireciona para `/login` antes de renderizar o conteúdo

## ADDED Requirements

### Requirement: Header exibe nome do usuário autenticado e botão de logout
O sistema SHALL exibir no canto direito do Header o nome do usuário autenticado (`usuario.nome`) e um botão ou dropdown com a opção **Sair** que aciona o logout.

#### Scenario: Nome do usuário é exibido no Header
- **WHEN** o usuário autenticado visualiza qualquer página do dashboard
- **THEN** o Header exibe o nome do usuário autenticado no canto direito

#### Scenario: Botão Sair aciona o logout
- **WHEN** o usuário clica em "Sair" no Header
- **THEN** `logout()` do `useAuth()` é chamado, a sessão é encerrada e o usuário é redirecionado para `/login`

#### Scenario: Loading state durante o logout
- **WHEN** o logout está em andamento (aguardando resposta da API)
- **THEN** o botão "Sair" exibe um `<Spinner size="sm" />` e fica desabilitado
