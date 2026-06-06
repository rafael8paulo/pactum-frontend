## ADDED Requirements

### Requirement: Layout shell com Sidebar e Header
O sistema SHALL ter `app/(dashboard)/layout.tsx` que envolve todas as páginas de feature com uma Sidebar lateral e um Header no topo, implementados em `components/features/layout/Sidebar.tsx` e `components/features/layout/Header.tsx`.

#### Scenario: Sidebar exibe links de navegação
- **WHEN** o usuário visualiza qualquer página de dashboard
- **THEN** a Sidebar exibe links para Resumo (`/resumo`), Despesas (`/despesas`), Receitas (`/receitas`) e Patrimônio (`/patrimônio`)

#### Scenario: Link ativo é destacado visualmente
- **WHEN** o usuário está na página `/despesas`
- **THEN** o link "Despesas" na Sidebar é destacado visualmente (ex: cor de fundo diferente) e os demais links não estão destacados

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
