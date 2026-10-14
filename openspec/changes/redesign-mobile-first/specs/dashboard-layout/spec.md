## MODIFIED Requirements

### Requirement: Layout shell com Sidebar e Header
O sistema SHALL ter `app/(dashboard)/layout.tsx` que envolve todas as páginas de feature com um shell de navegação, escolhido por breakpoint: em viewports de 768px ou mais, a Sidebar lateral e o Header no topo, implementados em `components/features/layout/Sidebar.tsx` e `components/features/layout/Header.tsx`; em viewports menores que 768px, o shell mobile com barra de abas e cabeçalho compacto. O layout SHALL ser envolvido por `<ProtectedRoute>` para bloquear acesso não autenticado, em ambos os breakpoints.

#### Scenario: Sidebar exibe links de navegação
- **WHEN** o usuário visualiza qualquer página de dashboard em uma viewport de 768px ou maior
- **THEN** a Sidebar exibe links para Início (`/inicio`), Lançamentos (`/lancamentos`), Recorrentes (`/recorrentes`), Patrimônio (`/mais/patrimonio`) e Formas de Pagamento (`/mais/formas-pagamento`)

#### Scenario: Link ativo é destacado visualmente
- **WHEN** o usuário está na página `/lancamentos` em desktop
- **THEN** o link "Lançamentos" na Sidebar é destacado visualmente e os demais links não estão destacados

#### Scenario: Link do Resumo Unificado é destacado visualmente
- **WHEN** o usuário acessa `/resumo-unificado` em desktop
- **THEN** é redirecionado para `/inicio` e o link "Início" na Sidebar é destacado visualmente, já que não existe mais um destino separado de Resumo Unificado

#### Scenario: Shell mobile substitui a Sidebar abaixo do breakpoint
- **WHEN** o usuário visualiza qualquer página de dashboard em uma viewport menor que 768px
- **THEN** a Sidebar não é renderizada e a navegação é feita pela barra de abas fixa

#### Scenario: Acesso não autenticado ao dashboard redireciona para /login
- **WHEN** um usuário não autenticado tenta acessar qualquer página do dashboard
- **THEN** o `ProtectedRoute` redireciona para `/login` antes de renderizar o conteúdo

### Requirement: Header exibe nome do usuário autenticado e botão de logout
O sistema SHALL exibir, em viewports de 768px ou mais, o nome do usuário autenticado (`usuario.nome`) no canto direito do Header e um botão ou dropdown com a opção **Sair** que aciona o logout. Em viewports menores que 768px, o Header compacto SHALL exibir apenas a identificação do usuário como elemento de navegação para `/mais`, e a ação **Sair** SHALL residir exclusivamente em `/mais`, precedida de confirmação.

#### Scenario: Nome do usuário é exibido no Header
- **WHEN** o usuário autenticado visualiza qualquer página do dashboard em uma viewport de 768px ou maior
- **THEN** o Header exibe o nome do usuário autenticado no canto direito

#### Scenario: Botão Sair aciona o logout
- **WHEN** o usuário clica em "Sair" no Header em desktop
- **THEN** `logout()` do `useAuth()` é chamado, a sessão é encerrada e o usuário é redirecionado para `/login`

#### Scenario: Loading state durante o logout
- **WHEN** o logout está em andamento (aguardando resposta da API)
- **THEN** o controle que disparou o logout exibe um `<Spinner size="sm" />` e fica desabilitado

#### Scenario: Header mobile não expõe o logout
- **WHEN** o usuário visualiza qualquer página do dashboard em uma viewport menor que 768px
- **THEN** nenhuma ação de encerrar sessão é exibida no cabeçalho, e a identificação do usuário navega para `/mais`

### Requirement: MonthPicker no Header com persistência em URL
O sistema SHALL ter um seletor de competência no cabeçalho que exibe o mês/ano ativo e permite alterá-lo, persistindo o valor selecionado como `?competencia=YYYY-MM` na URL. Em viewports de 768px ou mais, a alteração SHALL ser feita pelos controles de mês anterior e próximo mês; em viewports menores que 768px, pelo painel de grade de meses.

#### Scenario: Competência padrão é o mês corrente
- **WHEN** o usuário acessa uma página de dashboard sem o param `competencia` na URL
- **THEN** o seletor exibe o mês e ano atuais (ex: "Setembro 2026")

#### Scenario: Navegação para mês anterior atualiza a URL
- **WHEN** o usuário clica no botão "mês anterior" em uma viewport de 768px ou maior
- **THEN** a URL é atualizada para `?competencia=<mes-anterior>` e o seletor exibe o novo mês

#### Scenario: Competência da URL é refletida no MonthPicker
- **WHEN** o usuário acessa `/lancamentos?competencia=2026-03`
- **THEN** o seletor exibe "Março 2026"

#### Scenario: Seletor mobile abre o painel de grade
- **WHEN** o usuário toca o seletor de competência em uma viewport menor que 768px
- **THEN** o painel de seleção por grade de meses é aberto

## REMOVED Requirements

### Requirement: Layout responsivo com Sidebar colapsável em mobile
**Reason**: Colapsar a Sidebar em um drawer atrás de um botão de menu custa dois toques para qualquer destino e é a principal fonte de atrito da navegação em celular. A navegação mobile passa a ser a barra de abas fixa definida na capability `mobile-app-shell`, que alcança qualquer seção em no máximo dois toques e mantém os destinos permanentemente visíveis.
**Migration**: Nenhuma ação do usuário é necessária. Em viewports menores que 768px, a Sidebar e o botão de menu deixam de ser renderizados; os mesmos destinos passam a estar na barra de abas (Início, Lançamentos, Recorrentes) e no hub `/mais` (Patrimônio, Formas de Pagamento, Resumo Anual). Em viewports de 768px ou mais nada muda.

## ADDED Requirements

### Requirement: Rotas reorganizadas com redirecionamento das rotas anteriores
O sistema SHALL servir o dashboard nas rotas `/inicio`, `/lancamentos`, `/recorrentes`, `/mais`, `/mais/patrimonio` e `/mais/formas-pagamento`, e SHALL redirecionar permanentemente as rotas anteriores para seus destinos correspondentes, preservando os query params compatíveis.

#### Scenario: Rota raiz aponta para Início
- **WHEN** o usuário autenticado acessa `/`
- **THEN** é redirecionado para `/inicio`

#### Scenario: Rotas de resumo redirecionam para Início
- **WHEN** o usuário acessa `/resumo` ou `/resumo-unificado`
- **THEN** é redirecionado permanentemente para `/inicio`

#### Scenario: Rotas de despesas e receitas redirecionam preservando a competência
- **WHEN** o usuário acessa `/despesas?competencia=2026-03&status=PENDENTE`
- **THEN** é redirecionado permanentemente para `/lancamentos?tipo=despesa&competencia=2026-03&status=PENDENTE`

#### Scenario: Receitas redirecionam para o tipo correspondente
- **WHEN** o usuário acessa `/receitas?competencia=2026-03`
- **THEN** é redirecionado permanentemente para `/lancamentos?tipo=receita&competencia=2026-03`

#### Scenario: Rotas secundárias redirecionam para o hub
- **WHEN** o usuário acessa `/patrimonio`, `/formas-pagamento` ou `/contas-recorrentes`
- **THEN** é redirecionado permanentemente para `/mais/patrimonio`, `/mais/formas-pagamento` e `/recorrentes`, respectivamente
