## Why

O site não tem nenhum favicon configurado: a aba do navegador mostra o ícone genérico do Next.js/nenhum ícone, e adicionar a aplicação à tela inicial do celular (iOS/Android) também não exibe nenhum ícone reconhecível. Isso passa uma impressão de site incompleto e dificulta identificar a aba/atalho do Pactum entre várias abertas.

## What Changes

- Criar um ícone de app original, com relação visual ao Pactum (finanças pessoais), em vez de usar o ícone padrão do Next.js.
- Disponibilizar o ícone nos formatos e tamanhos exigidos pelas convenções de cada plataforma:
  - Favicon para abas de navegador desktop (via `app/icon.svg`, servido automaticamente pelo Next.js App Router).
  - Ícone de tela de início para iOS (`app/apple-icon.png`, PNG conforme exigido pela Apple).
  - Ícones para Android/PWA ("Adicionar à tela inicial") via `app/manifest.ts`, com múltiplos tamanhos.
- Testar a exibição do ícone tanto em um navegador desktop quanto em um viewport mobile.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `project-setup`: adiciona um novo requisito de configuração base — ícone/favicon da aplicação disponível para desktop e mobile.

## Impact

- Novo arquivo `app/icon.svg` (fonte vetorial do ícone, favicon de aba).
- Novo arquivo `app/apple-icon.png` (ícone de tela de início iOS).
- Novo arquivo `app/manifest.ts` (Web App Manifest com ícones para Android/PWA).
- Nenhuma mudança de API/backend, nenhuma dependência nova — usa apenas as convenções nativas de metadata do Next.js 15 App Router.
