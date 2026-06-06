## 1. Componentes base de loading

- [x] 1.1 Criar `components/ui/spinner.tsx` com SVG animado, props `size` (`sm|md|lg`, default `md`) e `className`, exportação nomeada `Spinner`
- [x] 1.2 Criar `components/ui/page-loader.tsx` que renderiza `<Spinner />` centralizado com `flex items-center justify-center min-h-[200px]`, exportação nomeada `PageLoader`

## 2. Instalar e configurar nextjs-toploader

- [x] 2.1 Instalar dependência: `npm install nextjs-toploader`
- [x] 2.2 Adicionar `<NextTopLoader color="hsl(var(--primary))" showSpinner={false} />` no `app/layout.tsx` antes de `{children}`

## 3. PageLoader nas páginas (isLoading)

- [x] 3.1 Em `app/(dashboard)/despesas/page.tsx`, adicionar `if (isLoading) return <PageLoader />` usando o `isLoading` do hook principal
- [x] 3.2 Em `app/(dashboard)/receitas/page.tsx`, adicionar `if (isLoading) return <PageLoader />`
- [x] 3.3 Em `app/(dashboard)/resumo/page.tsx`, adicionar `if (isLoading) return <PageLoader />` (usar `||` caso haja múltiplos hooks)
- [x] 3.4 Em `app/(dashboard)/patrimonio/page.tsx`, adicionar `if (isLoading) return <PageLoader />`

## 4. Spinner no submit dos formulários (isPending)

- [x] 4.1 Em `NovaDespesaDialog`: usar `isPending` da mutation para desabilitar o botão de submit e exibir `<Spinner size="sm" />` no lugar do label
- [x] 4.2 Em `NovaReceitaDialog`: aplicar o mesmo padrão de submit com Spinner
- [x] 4.3 Em `NovoPatrimonioDialog`: aplicar o mesmo padrão de submit com Spinner
- [x] 4.4 Em dialogs de edição de despesa (se existir): aplicar o mesmo padrão
- [x] 4.5 Em dialogs de edição de receita (se existir): aplicar o mesmo padrão

## 5. loadingId para ações inline em tabelas e cards

- [x] 5.1 Em `DespesaTable`: adicionar `useState<string | null>(null)` para `loadingId`; envolver a ação de remover com `setLoadingId`/`try-finally`; exibir `<Spinner size="sm" />` no botão do item em processamento
- [x] 5.2 Em `DespesaTable`: aplicar o mesmo padrão `loadingId` para o botão de atualizar status (se existir)
- [x] 5.3 Em `ReceitaTable` (se existir): adicionar `loadingId` para botão de remover e status
- [x] 5.4 Em `PatrimonioCard` ou `PatrimonioGrid`: adicionar `loadingId` para botão de remover
