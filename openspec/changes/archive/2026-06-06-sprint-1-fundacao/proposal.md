## Why

O projeto Pactum Web ainda não existe — este é o sprint de fundação que cria toda a infraestrutura do frontend, o layout global e os mecanismos de feedback da UI, permitindo que as sprints de feature (despesas, receitas, dashboard) possam ser desenvolvidas em cima de uma base sólida e consistente.

## What Changes

- Criação do projeto Next.js 15 com TypeScript, Tailwind CSS e App Router (`US-01`)
- Configuração de shadcn/ui, TanStack Query (QueryClientProvider) e Axios com instância base (`US-01`)
- Definição de todos os tipos TypeScript alinhados com a Pactum API: `Despesa`, `Receita`, `ResumoMensal`, `Patrimonio` e respectivos enums/requests (`US-02`)
- Implementação do layout principal com Sidebar + Header compartilhados, MonthPicker, suporte a tema claro/escuro via `next-themes` e layout responsivo (`US-03`)
- Configuração do sistema de feedback global: Toaster (sonner), skeletons de loading e componente `EmptyState` padronizado (`US-04`)

## Capabilities

### New Capabilities

- `project-setup`: Scaffolding do projeto Next.js 15, configuração de ESLint/Prettier, variáveis de ambiente e providers globais (QueryClientProvider, ThemeProvider)
- `typescript-types`: Definição dos contratos TypeScript para todos os domínios da API (despesa, receita, resumo, patrimônio)
- `dashboard-layout`: Layout de shell com Sidebar, Header, MonthPicker e tema claro/escuro
- `global-feedback`: Sistema global de loading (Skeleton), notificações (Toaster/sonner) e estado vazio (EmptyState)

### Modified Capabilities

## Impact

- Cria toda a estrutura de pastas conforme `CLAUDE.md` (app/, components/, hooks/, lib/, types/, providers/)
- Adiciona dependências: `@tanstack/react-query`, `axios`, `next-themes`, `sonner`, `react-hook-form`, `zod`, `recharts`
- Adiciona componentes shadcn: `skeleton`, `badge`, `button`, `dialog`, `table`, `toast`, `alert-dialog`
- Sem breaking changes — projeto ainda não existe
