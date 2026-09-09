## MODIFIED Requirements

### Requirement: Layout shell com Sidebar e Header
O sistema SHALL ter `app/(dashboard)/layout.tsx` que envolve todas as páginas de feature com uma Sidebar lateral e um Header no topo, implementados em `components/features/layout/Sidebar.tsx` e `components/features/layout/Header.tsx`. O layout SHALL ser envolvido por `<ProtectedRoute>` para bloquear acesso não autenticado.

#### Scenario: Sidebar exibe links de navegação
- **WHEN** o usuário visualiza qualquer página de dashboard
- **THEN** a Sidebar exibe links para Resumo (`/resumo`), Resumo Unificado (`/resumo-unificado`), Despesas (`/despesas`), Receitas (`/receitas`) e Patrimônio (`/patrimônio`)

#### Scenario: Link ativo é destacado visualmente
- **WHEN** o usuário está na página `/despesas`
- **THEN** o link "Despesas" na Sidebar é destacado visualmente (ex: cor de fundo diferente) e os demais links não estão destacados

#### Scenario: Link do Resumo Unificado é destacado visualmente
- **WHEN** o usuário está na página `/resumo-unificado`
- **THEN** o link "Resumo Unificado" na Sidebar é destacado visualmente e os demais links não estão destacados

#### Scenario: Acesso não autenticado ao dashboard redireciona para /login
- **WHEN** um usuário não autenticado tenta acessar qualquer página do dashboard
- **THEN** o `ProtectedRoute` redireciona para `/login` antes de renderizar o conteúdo
