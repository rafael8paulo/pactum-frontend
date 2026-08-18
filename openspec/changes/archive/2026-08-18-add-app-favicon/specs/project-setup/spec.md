## ADDED Requirements

### Requirement: Ícone da aplicação disponível para desktop e mobile
O sistema SHALL expor um ícone de aplicação com identidade visual própria (relacionada ao Pactum), disponível como favicon de aba em navegadores desktop, como ícone de tela de início no iOS e como ícone de tela de início/PWA no Android, usando as convenções nativas de metadata do Next.js 15 App Router (`app/icon.svg`, `app/apple-icon.png`, `app/manifest.ts`).

#### Scenario: Favicon exibido na aba do navegador desktop
- **WHEN** o site é acessado em um navegador desktop
- **THEN** a aba exibe o ícone do Pactum, e não o ícone padrão do Next.js ou nenhum ícone

#### Scenario: Ícone exibido ao adicionar à tela de início no iOS
- **WHEN** o usuário usa "Adicionar à Tela de Início" no Safari iOS
- **THEN** o atalho criado exibe o ícone do Pactum

#### Scenario: Ícone exibido ao adicionar à tela de início no Android
- **WHEN** o usuário usa "Adicionar à Tela de Início" no Chrome Android
- **THEN** o atalho criado exibe o ícone do Pactum, lido a partir do Web App Manifest
