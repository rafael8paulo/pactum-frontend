## Context

O Sprint 2 estabeleceu o padrão end-to-end de CRUD com o domínio de despesas: hooks TanStack Query, formulário com zod + react-hook-form, dialogs de criação/edição, tabela com ações inline e AlertDialog de confirmação. Os tipos e o API client de receitas (`types/receita.ts` e `lib/api/receitas.ts`) já existem no projeto.

Receitas é deliberadamente mais simples que despesas:
- Sem campo `status` → sem mutation de status e sem Select inline na tabela
- A API (`GET /api/v1/receitas`) não suporta filtros → sem painel de filtros na página
- Quatro categorias simples: `SALARIO`, `FREELANCE`, `INVESTIMENTO`, `OUTROS`

## Goals / Non-Goals

**Goals:**
- Implementar listagem de receitas por competência com skeletons e estado vazio
- Implementar formulário de criação e edição com validação via zod
- Implementar remoção com AlertDialog de confirmação
- Compor a página `/receitas` com header + `NovaReceitaDialog` + `ReceitaTable`

**Non-Goals:**
- Filtros (a API não os suporta neste sprint)
- Campo status ou alteração de status inline
- Paginação server-side
- Bulk delete

## Decisions

### 1. Espelhar o padrão de despesas

O CRUD de receitas aplica exatamente o mesmo padrão do Sprint 2: `ReceitaForm` puro recebendo `defaultValues` e `onSubmit`; `NovaReceitaDialog` e `EditarReceitaDialog` o instanciam internamente. Isso garante consistência visual e reduz o tempo de implementação.

**Alternativa descartada**: componentes com estrutura diferente — custo de manutenção maior sem benefício.

### 2. Sem painel de filtros

A API `GET /api/v1/receitas` aceita apenas `competencia`. Não há parâmetros de filtro disponíveis, portanto nenhum componente `ReceitaFilters` será criado.

**Alternativa descartada**: filtros client-side sobre os dados retornados — complexidade desnecessária para o volume de receitas mensais (tipicamente < 20 itens).

### 3. `competencia` pré-preenchida no dialog de criação

`NovaReceitaDialog` recebe `competenciaAtual: string` da página e o passa como `defaultValues` para `ReceitaForm`, seguindo o padrão estabelecido no `NovaDespesaDialog`.

### 4. Página como Server Component async

`app/(dashboard)/receitas/page.tsx` lê `searchParams` (Promise no Next.js 15) para extrair `competencia` com fallback para o mês corrente via `getCurrentCompetencia()`.

## Risks / Trade-offs

- **Stale data após mutação** → mitigado por `invalidateQueries(['receitas'])` em todas as mutations
- **Padrão novo vs. padrão estabelecido** → risco mínimo; a implementação segue exatamente o blueprint do Sprint 2
