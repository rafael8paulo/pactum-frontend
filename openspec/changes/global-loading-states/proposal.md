## Why

O Pactum Web não fornece nenhum feedback visual durante operações assíncronas — buscas de dados, submissões de formulário e ações inline retornam sem indicar ao usuário que algo está acontecendo. Isso cria uma experiência confusa, especialmente em conexões lentas, onde o usuário não sabe se deve aguardar ou tentar novamente.

## What Changes

- Novo componente `Spinner` reutilizável (`components/ui/spinner.tsx`) com props `size` e `className`
- Novo componente `PageLoader` (`components/ui/page-loader.tsx`) que exibe o Spinner centralizado para loading de página inteira
- Todas as páginas (`despesas`, `receitas`, `resumo`, `patrimonio`) passam a exibir `PageLoader` enquanto `isLoading === true`
- Todos os formulários de cadastro/edição substituem o label do botão de submit por `Spinner` enquanto `isPending === true` e desabilitam o botão
- Ações inline em tabelas e cards (deletar, atualizar status) exibem `Spinner` apenas no botão do item em processamento via `loadingId`
- `nextjs-toploader` instalado e configurado no `app/layout.tsx` para barra de progresso na navegação entre páginas

## Capabilities

### New Capabilities

- `spinner`: Componente SVG animado reutilizável com variantes de tamanho (`sm`, `md`, `lg`)
- `page-loader`: Wrapper de loading de página inteira baseado no Spinner, aplicado via `isLoading` do TanStack Query
- `form-submit-loading`: Padrão de botão de submit desabilitado com Spinner durante `isPending` de mutations
- `inline-action-loading`: Padrão de `loadingId` para feedback granular em ações de tabela/card
- `navigation-progress-bar`: Barra de progresso no topo via `nextjs-toploader` para transições de rota

### Modified Capabilities

## Impact

- **Componentes novos**: `components/ui/spinner.tsx`, `components/ui/page-loader.tsx`
- **Páginas modificadas**: `app/(dashboard)/despesas/page.tsx`, `app/(dashboard)/receitas/page.tsx`, `app/(dashboard)/resumo/page.tsx`, `app/(dashboard)/patrimonio/page.tsx`
- **Componentes de feature modificados**: todos os Dialog de cadastro/edição (`NovaDespesaDialog`, `NovaReceitaDialog`, `NovoPatrimonioDialog` e equivalentes de edição), `DespesaTable`, `ReceitaTable`, `PatrimonioCard`/`PatrimonioGrid`
- **Layout raiz modificado**: `app/layout.tsx` recebe `<NextTopLoader />`
- **Nova dependência**: `nextjs-toploader`
- **Sem breaking changes** — mudanças são aditivas; comportamento de dados e lógica de negócio permanecem inalterados
