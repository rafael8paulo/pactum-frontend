# Spec: project-setup

## Purpose

Configuração inicial do projeto Next.js 15, incluindo dependências, tooling e estrutura base necessária para que o desenvolvimento das features possa começar.

---

## Requirements

### Requirement: Projeto Next.js 15 inicializado
O sistema SHALL ter um projeto Next.js 15 criado com `create-next-app`, usando TypeScript, Tailwind CSS e App Router como configuração padrão.

#### Scenario: Projeto criado com configuração correta
- **WHEN** o desenvolvedor executa `npm run dev`
- **THEN** o servidor de desenvolvimento inicia em `http://localhost:3000` sem erros

#### Scenario: Acesso à raiz redireciona para /resumo
- **WHEN** o usuário acessa `http://localhost:3000`
- **THEN** é redirecionado automaticamente para `/resumo`

### Requirement: TanStack Query configurado globalmente
O sistema SHALL ter `QueryClientProvider` configurado em `providers/query-provider.tsx` e aplicado no layout raiz para que todos os hooks `useQuery`/`useMutation` funcionem em qualquer página.

#### Scenario: QueryClientProvider disponível na árvore de componentes
- **WHEN** qualquer componente utiliza `useQuery` ou `useMutation`
- **THEN** o hook funciona sem erro de "No QueryClient set"

### Requirement: Axios com instância base configurada
O sistema SHALL ter uma instância Axios exportada de `lib/api/client.ts` com `baseURL` apontando para `process.env.NEXT_PUBLIC_API_URL` e header `Content-Type: application/json`.

#### Scenario: Variável de ambiente configurada
- **WHEN** o arquivo `.env.local` contém `NEXT_PUBLIC_API_URL=http://localhost:8080`
- **THEN** todas as requisições Axios usam `http://localhost:8080` como base

#### Scenario: Código usa apenas o client Axios centralizado
- **WHEN** qualquer módulo precisa consumir a API
- **THEN** importa `api` de `lib/api/client.ts` e não usa `fetch` diretamente

### Requirement: shadcn/ui inicializado
O sistema SHALL ter shadcn/ui inicializado via `npx shadcn@latest init` com os componentes base necessários (`skeleton`, `badge`, `button`, `dialog`, `table`, `alert-dialog`).

#### Scenario: Componentes shadcn disponíveis
- **WHEN** qualquer componente de feature importa de `@/components/ui/<componente>`
- **THEN** o import resolve sem erro de módulo não encontrado

### Requirement: ESLint e Prettier configurados
O sistema SHALL ter ESLint e Prettier configurados e sem erros ao executar `npm run lint` no projeto vazio.

#### Scenario: Lint passa sem erros
- **WHEN** o desenvolvedor executa `npm run lint`
- **THEN** nenhum erro ou warning crítico é reportado
