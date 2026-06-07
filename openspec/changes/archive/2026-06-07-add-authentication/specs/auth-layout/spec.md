## ADDED Requirements

### Requirement: Layout das telas de autenticação sem sidebar
O sistema SHALL ter `app/(auth)/layout.tsx` compartilhado entre `/login` e `/cadastro` que não exibe Sidebar nem Header do dashboard, com fundo neutro e um card centralizado vertical e horizontalmente.

#### Scenario: Tela de login não exibe Sidebar nem Header
- **WHEN** o usuário acessa `/login`
- **THEN** a tela exibe apenas o card de autenticação, sem Sidebar de navegação e sem o Header do dashboard

#### Scenario: Tela de cadastro não exibe Sidebar nem Header
- **WHEN** o usuário acessa `/cadastro`
- **THEN** a tela exibe apenas o card de autenticação, sem Sidebar de navegação e sem o Header do dashboard

### Requirement: Nome e logo do app exibidos no topo do card de autenticação
O sistema SHALL exibir o nome "Pactum" e um ícone/logo representativo no topo do card de autenticação, acima do formulário.

#### Scenario: Identidade visual presente nas telas de auth
- **WHEN** o usuário visualiza qualquer tela de autenticação (`/login` ou `/cadastro`)
- **THEN** o nome "Pactum" e um ícone/logo são exibidos no topo do card, antes do formulário

### Requirement: Card centralizado adapta-se a diferentes viewports
O sistema SHALL centralizar o card de autenticação tanto verticalmente quanto horizontalmente, funcionando corretamente em desktop e mobile.

#### Scenario: Card centralizado em desktop
- **WHEN** o usuário acessa `/login` em uma viewport de 1280px de largura
- **THEN** o card está visualmente centralizado na tela

#### Scenario: Card ocupa largura adequada em mobile
- **WHEN** o usuário acessa `/login` em uma viewport menor que 640px
- **THEN** o card ocupa a largura disponível com padding lateral adequado, sem overflow horizontal
