## 1. Setup do Projeto (US-01)

- [x] 1.1 Criar projeto com `create-next-app` — Next.js 15, TypeScript, Tailwind CSS, App Router
- [x] 1.2 Instalar dependências: `@tanstack/react-query`, `axios`, `next-themes`, `sonner`, `react-hook-form`, `zod`, `recharts`
- [x] 1.3 Inicializar shadcn/ui com `npx shadcn@latest init` e adicionar componentes: `skeleton`, `badge`, `button`, `dialog`, `table`, `alert-dialog`, `sheet`
- [x] 1.4 Criar `.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [x] 1.5 Criar `lib/api/client.ts` com instância Axios apontando para `NEXT_PUBLIC_API_URL`
- [x] 1.6 Criar `providers/query-provider.tsx` com `QueryClientProvider`
- [x] 1.7 Criar `providers/theme-provider.tsx` com `ThemeProvider` (next-themes)
- [x] 1.8 Atualizar `app/layout.tsx` para incluir `QueryClientProvider`, `ThemeProvider` e `Toaster`
- [x] 1.9 Criar `app/page.tsx` com redirect para `/resumo`
- [x] 1.10 Verificar que `npm run lint` passa sem erros

## 2. Tipos TypeScript (US-02)

- [x] 2.1 Criar `types/despesa.ts` com `StatusDespesa`, `CategoriaDespesa`, `Despesa`, `CadastrarDespesaRequest`, `ListaDespesasResponse`, `DespesaFilters`
- [x] 2.2 Criar `types/receita.ts` com `CategoriaReceita`, `Receita`, `CadastrarReceitaRequest`, `ListaReceitasResponse`
- [x] 2.3 Criar `types/resumo.ts` com `ResumoMensal`, `HistoricoAnualResponse`
- [x] 2.4 Criar `types/patrimonio.ts` com `Patrimonio`, `CadastrarPatrimonioRequest`
- [x] 2.5 Verificar que `npm run build` compila sem erros de tipo

## 3. API Clients (base para features)

- [x] 3.1 Criar `lib/api/despesas.ts` com `despesaApi` (listar, cadastrar, atualizar, atualizarStatus, remover)
- [x] 3.2 Criar `lib/api/receitas.ts` com `receitaApi` (listar, cadastrar, atualizar, remover)
- [x] 3.3 Criar `lib/api/resumo.ts` com `resumoApi` (mensal, anual)
- [x] 3.4 Criar `lib/api/patrimonio.ts` com `patrimonioApi` (listar, cadastrar, remover)
- [x] 3.5 Garantir `cn()` e formatadores de moeda/data em `lib/utils.ts`

## 4. Layout Principal — Sidebar e Header (US-03)

- [x] 4.1 Criar estrutura `app/(dashboard)/` com `layout.tsx` vazio
- [x] 4.2 Criar páginas placeholder: `resumo/page.tsx`, `despesas/page.tsx`, `receitas/page.tsx`, `patrimonio/page.tsx`
- [x] 4.3 Criar `components/features/layout/Sidebar.tsx` com links de navegação (Resumo, Despesas, Receitas, Patrimônio)
- [x] 4.4 Implementar destaque do link ativo na Sidebar usando `usePathname`
- [x] 4.5 Criar `components/features/layout/MonthPicker.tsx` com navegação mês anterior/próximo e persistência em `?competencia=YYYY-MM`
- [x] 4.6 Criar `components/features/layout/Header.tsx` com MonthPicker e toggle de tema claro/escuro
- [x] 4.7 Implementar `app/(dashboard)/layout.tsx` compondo Sidebar + Header + área de conteúdo
- [x] 4.8 Tornar Sidebar responsiva: oculta em mobile com abertura via Sheet (drawer) pelo Header

## 5. Feedback Global (US-04)

- [x] 5.1 Confirmar que `Toaster` do sonner está no `app/layout.tsx` e funcionando
- [x] 5.2 Validar que `toast.success()` e `toast.error()` são visíveis em qualquer página
- [x] 5.3 Criar padrão de skeleton de loading para tabelas (array de `<Skeleton>` empilhados)
- [x] 5.4 Criar padrão de EmptyState inline para listas vazias (mensagem com `competencia` contextualizada)
- [x] 5.5 Documentar padrões de uso de Skeleton e EmptyState em comentário no `components/features/layout/` ou no CLAUDE.md
