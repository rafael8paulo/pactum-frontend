# Spec: dashboard-layout

## Purpose

Shell de layout compartilhado entre todas as páginas do dashboard, incluindo Sidebar de navegação, Header com seletor de competência e suporte a temas claro/escuro e responsividade mobile.

---

## Requirements

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

### Requirement: MonthPicker no Header com persistência em URL
O sistema SHALL ter um componente `MonthPicker` no Header que exibe o mês/ano atual e permite navegar entre meses, persistindo o valor selecionado como `?competencia=YYYY-MM` na URL.

#### Scenario: Competência padrão é o mês corrente
- **WHEN** o usuário acessa uma página de dashboard sem o param `competencia` na URL
- **THEN** o MonthPicker exibe o mês e ano atuais (ex: "Junho 2025")

#### Scenario: Navegação para mês anterior atualiza a URL
- **WHEN** o usuário clica no botão "mês anterior" no MonthPicker
- **THEN** a URL é atualizada para `?competencia=<mes-anterior>` e o MonthPicker exibe o novo mês

#### Scenario: Competência da URL é refletida no MonthPicker
- **WHEN** o usuário acessa `/despesas?competencia=2025-03`
- **THEN** o MonthPicker exibe "Março 2025"

### Requirement: Suporte a tema claro e escuro
O sistema SHALL ter `ThemeProvider` de `next-themes` no layout raiz e um toggle de tema acessível pelo Header, permitindo ao usuário alternar entre modo claro e escuro.

#### Scenario: Tema é persistido entre sessões
- **WHEN** o usuário seleciona o tema escuro e recarrega a página
- **THEN** o tema escuro permanece ativo

#### Scenario: Sistema de design respeita o tema ativo
- **WHEN** o tema escuro está ativo
- **THEN** cores de fundo, texto e componentes shadcn aplicam variáveis de dark mode

### Requirement: Layout responsivo com Sidebar colapsável em mobile
O sistema SHALL adaptar o layout para telas menores, ocultando ou colapsando a Sidebar em dispositivos móveis e exibindo um mecanismo de abertura (ex: ícone de menu hamburguer no Header).

#### Scenario: Sidebar oculta em mobile por padrão
- **WHEN** o usuário acessa o dashboard em uma viewport menor que 768px
- **THEN** a Sidebar não é exibida por padrão na tela

#### Scenario: Sidebar abre via botão de menu
- **WHEN** o usuário toca o botão de menu no Header em mobile
- **THEN** a Sidebar se torna visível (ex: como overlay ou drawer lateral)
