# 🎨 Pactum Web — Backlog Frontend

> **Stack:** Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query · Axios
> **Repositório:** `pactum-web`
> **API:** `pactum-api` (Spring Boot — `http://localhost:8080`)

---

## 🗂️ Épicos

| ID | Épico |
|----|-------|
| E1 | Infraestrutura & Setup |
| E2 | Layout & Navegação |
| E3 | Despesas |
| E4 | Receitas |
| E5 | Dashboard & Resumo Mensal |
| E6 | Patrimônio |

---

## 📐 Estrutura de pastas

```
pactum-web/
├── app/
│   ├── layout.tsx               # Layout raiz (fonte, tema)
│   ├── page.tsx                 # Redirect → /resumo
│   └── (dashboard)/
│       ├── layout.tsx           # Sidebar + Header
│       ├── resumo/
│       │   └── page.tsx
│       ├── despesas/
│       │   └── page.tsx
│       ├── receitas/
│       │   └── page.tsx
│       └── patrimonio/
│           └── page.tsx
├── components/
│   ├── ui/                      # shadcn/ui (gerado via CLI)
│   └── features/
│       ├── despesas/
│       ├── receitas/
│       ├── resumo/
│       └── patrimonio/
├── lib/
│   ├── api/                     # Clients Axios por domínio
│   └── utils.ts
├── hooks/                       # TanStack Query hooks por feature
├── types/                       # Tipos TypeScript (gerados ou manuais)
└── providers/
    └── query-provider.tsx       # QueryClientProvider
```

---

## 📋 User Stories

---

### E1 — Infraestrutura & Setup

#### US-01 · Setup do projeto

**Critérios de aceite:**
- [ ] Projeto criado com `create-next-app` (Next.js 15, TypeScript, Tailwind, App Router)
- [ ] shadcn/ui inicializado (`npx shadcn@latest init`)
- [ ] TanStack Query instalado e `QueryClientProvider` configurado em `providers/query-provider.tsx`
- [ ] Axios instalado com instância base em `lib/api/client.ts` apontando para `NEXT_PUBLIC_API_URL`
- [ ] `.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [ ] ESLint + Prettier configurados

**`lib/api/client.ts` esperado:**
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

---

#### US-02 · Tipos TypeScript da API

**Critérios de aceite:**
- [ ] Tipos gerados via OpenAPI Generator ou escritos manualmente em `types/`
- [ ] Arquivo `types/despesa.ts` com `Despesa`, `CadastrarDespesaRequest`, `ListaDespesasResponse`
- [ ] Arquivo `types/receita.ts` com `Receita`, `CadastrarReceitaRequest`, `ListaReceitasResponse`
- [ ] Arquivo `types/resumo.ts` com `ResumoMensal`, `HistoricoAnualResponse`
- [ ] Arquivo `types/patrimonio.ts` com `Patrimonio`, `CadastrarPatrimonioRequest`
- [ ] Enums `StatusDespesa`, `CategoriaDespesa`, `CategoriaReceita` tipados

**Exemplo (`types/despesa.ts`):**
```typescript
export type StatusDespesa = 'PAGA' | 'PENDENTE' | 'AGENDADA';
export type CategoriaDespesa =
  | 'FINANCIAMENTO' | 'CARTAO_CREDITO' | 'EDUCACAO'
  | 'SERVICOS' | 'LAZER' | 'IMPOSTO' | 'OUTROS';

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  status: StatusDespesa;
  competencia: string; // "2025-07"
  categoria: CategoriaDespesa;
}

export interface CadastrarDespesaRequest {
  descricao: string;
  valor: number;
  status: StatusDespesa;
  competencia: string;
  categoria: CategoriaDespesa;
}
```

---

### E2 — Layout & Navegação

#### US-03 · Layout principal (Sidebar + Header)

**Critérios de aceite:**
- [ ] `app/(dashboard)/layout.tsx` com sidebar lateral e área de conteúdo
- [ ] Sidebar com links: Resumo, Despesas, Receitas, Patrimônio
- [ ] Link ativo destacado visualmente (`usePathname`)
- [ ] Header com seletor de mês/ano (componente `MonthPicker`) persistido em estado global ou URL param (`?competencia=2025-07`)
- [ ] Layout responsivo (sidebar colapsável em mobile)
- [ ] Tema claro/escuro com `next-themes`

**Componentes a criar:**
- [ ] `components/features/layout/Sidebar.tsx`
- [ ] `components/features/layout/Header.tsx`
- [ ] `components/features/layout/MonthPicker.tsx`

---

#### US-04 · Feedback global (loading, erro, toast)

**Critérios de aceite:**
- [ ] `Toaster` do shadcn configurado no layout raiz
- [ ] Erros de API exibidos via toast com mensagem legível
- [ ] Skeletons de loading nos cards e tabelas
- [ ] Estado vazio (`EmptyState`) padronizado para listas sem dados

---

### E3 — Despesas

#### US-05 · Listagem de despesas

**Critérios de aceite:**
- [ ] Página em `app/(dashboard)/despesas/page.tsx`
- [ ] Tabela com colunas: Descrição, Categoria, Valor, Status, Ações
- [ ] Filtros: status (`PAGA`, `PENDENTE`, `AGENDADA`) e categoria
- [ ] Mês controlado pelo `MonthPicker` do header
- [ ] Total das despesas exibido no rodapé da tabela
- [ ] Skeleton de loading durante fetch
- [ ] Mensagem de lista vazia quando não há despesas no mês

**Hook a criar:** `hooks/useDespesas.ts`
```typescript
export function useDespesas(competencia: string, filters?: DespesaFilters) {
  return useQuery({
    queryKey: ['despesas', competencia, filters],
    queryFn: () => despesaApi.listar(competencia, filters),
  });
}
```

**Componentes a criar:**
- [ ] `components/features/despesas/DespesaTable.tsx`
- [ ] `components/features/despesas/DespesaFiltros.tsx`
- [ ] `components/features/despesas/DespesaStatusBadge.tsx`

---

#### US-06 · Cadastrar despesa

**Critérios de aceite:**
- [ ] Botão "Nova Despesa" abre `Dialog` (shadcn)
- [ ] Formulário com campos: Descrição, Valor, Status, Mês, Categoria
- [ ] Validação client-side com `zod` + `react-hook-form`
- [ ] Submit chama `POST /api/v1/despesas`
- [ ] Após sucesso: fecha dialog, invalida query `['despesas']`, exibe toast de sucesso
- [ ] Campos com erro exibem mensagem inline

**Componentes a criar:**
- [ ] `components/features/despesas/NovaDespesaDialog.tsx`
- [ ] `components/features/despesas/DespesaForm.tsx`

**Schema Zod:**
```typescript
const despesaSchema = z.object({
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  status: z.enum(['PAGA', 'PENDENTE', 'AGENDADA']),
  competencia: z.string().regex(/^\d{4}-\d{2}$/),
  categoria: z.enum(['FINANCIAMENTO', 'CARTAO_CREDITO', ...]),
});
```

---

#### US-07 · Atualizar status de despesa

**Critérios de aceite:**
- [ ] Coluna "Status" da tabela é clicável (toggle ou dropdown)
- [ ] Clique chama `PATCH /api/v1/despesas/{id}/status`
- [ ] Atualização otimista na UI (TanStack Query `onMutate`)
- [ ] Toast de confirmação após sucesso
- [ ] Rollback visual em caso de erro

---

#### US-08 · Editar e remover despesa

**Critérios de aceite:**
- [ ] Coluna "Ações" com botões Editar e Remover
- [ ] Editar abre o mesmo `DespesaForm` pré-preenchido via `PUT /api/v1/despesas/{id}`
- [ ] Remover exibe `AlertDialog` de confirmação antes de chamar `DELETE`
- [ ] Após remoção: invalida query, exibe toast

---

### E4 — Receitas

#### US-09 · Listagem de receitas

**Critérios de aceite:**
- [ ] Página em `app/(dashboard)/receitas/page.tsx`
- [ ] Tabela com colunas: Descrição, Categoria, Valor, Ações
- [ ] Filtro por categoria
- [ ] Total das receitas exibido no rodapé
- [ ] Skeleton e estado vazio padronizados

**Hook a criar:** `hooks/useReceitas.ts`

**Componentes a criar:**
- [ ] `components/features/receitas/ReceitaTable.tsx`
- [ ] `components/features/receitas/ReceitaFiltros.tsx`

---

#### US-10 · Cadastrar receita

**Critérios de aceite:**
- [ ] Botão "Nova Receita" abre `Dialog`
- [ ] Formulário com campos: Descrição, Valor, Mês, Categoria
- [ ] Validação com `zod` + `react-hook-form`
- [ ] Submit chama `POST /api/v1/receitas`
- [ ] Após sucesso: fecha dialog, invalida query `['receitas']`, toast

**Componentes a criar:**
- [ ] `components/features/receitas/NovaReceitaDialog.tsx`
- [ ] `components/features/receitas/ReceitaForm.tsx`

---

#### US-11 · Editar e remover receita

**Critérios de aceite:**
- [ ] Editar via `PUT /api/v1/receitas/{id}` com form pré-preenchido
- [ ] Remover via `DELETE` com `AlertDialog` de confirmação

---

### E5 — Dashboard & Resumo Mensal

#### US-12 · Cards de resumo do mês

**Critérios de aceite:**
- [ ] Página em `app/(dashboard)/resumo/page.tsx`
- [ ] 3 cards: **Total Receitas**, **Total Despesas**, **Saldo**
- [ ] Saldo positivo em verde, negativo em vermelho
- [ ] Dados de `GET /api/v1/resumo?competencia=2025-07`
- [ ] Skeleton durante loading

**Componentes a criar:**
- [ ] `components/features/resumo/ResumoCards.tsx`
- [ ] `components/features/resumo/SaldoCard.tsx`

---

#### US-13 · Gráfico de evolução anual

**Critérios de aceite:**
- [ ] Gráfico de barras com Receitas vs Despesas por mês
- [ ] Linha de saldo acumulado sobreposta
- [ ] Dados de `GET /api/v1/resumo/anual?ano=2025`
- [ ] Biblioteca: **Recharts**
- [ ] Tooltip com valores formatados em BRL
- [ ] Responsivo (adapta ao container)

**Componentes a criar:**
- [ ] `components/features/resumo/EvolucaoAnualChart.tsx`

---

#### US-14 · Breakdown de despesas por categoria

**Critérios de aceite:**
- [ ] Gráfico de rosca (donut) com distribuição por categoria no mês
- [ ] Legenda com nome da categoria e percentual
- [ ] Cálculo client-side a partir dos dados já carregados de despesas

**Componentes a criar:**
- [ ] `components/features/resumo/DespesasPorCategoriaChart.tsx`

---

### E6 — Patrimônio

#### US-15 · Listagem de patrimônio

**Critérios de aceite:**
- [ ] Página em `app/(dashboard)/patrimonio/page.tsx`
- [ ] Cards (não tabela) para cada item com nome e valor
- [ ] Total do patrimônio exibido em destaque
- [ ] Dados de `GET /api/v1/patrimonio?competencia=2025-07`

**Componentes a criar:**
- [ ] `components/features/patrimonio/PatrimonioCard.tsx`
- [ ] `components/features/patrimonio/PatrimonioTotal.tsx`

---

#### US-16 · Cadastrar item de patrimônio

**Critérios de aceite:**
- [ ] Botão "Novo Item" abre `Dialog`
- [ ] Formulário com campos: Descrição, Valor, Mês
- [ ] Submit chama `POST /api/v1/patrimonio`
- [ ] Após sucesso: invalida query, toast

---

## 🔢 Priorização (MoSCoW)

| Story | Prioridade |
|-------|------------|
| US-01 Setup | Must Have |
| US-02 Tipos TypeScript | Must Have |
| US-03 Layout + Sidebar | Must Have |
| US-04 Feedback global | Must Have |
| US-05 Listagem de despesas | Must Have |
| US-06 Cadastrar despesa | Must Have |
| US-07 Atualizar status | Must Have |
| US-09 Listagem de receitas | Must Have |
| US-10 Cadastrar receita | Must Have |
| US-12 Cards resumo mensal | Must Have |
| US-08 Editar/remover despesa | Should Have |
| US-11 Editar/remover receita | Should Have |
| US-13 Gráfico evolução anual | Should Have |
| US-14 Breakdown por categoria | Could Have |
| US-15 Listagem patrimônio | Could Have |
| US-16 Cadastrar patrimônio | Could Have |

---

## 🚀 Sprints sugeridas

### Sprint 1 — Fundação
`US-01` `US-02` `US-03` `US-04`

### Sprint 2 — Despesas
`US-05` `US-06` `US-07` `US-08`

### Sprint 3 — Receitas
`US-09` `US-10` `US-11`

### Sprint 4 — Dashboard
`US-12` `US-13` `US-14`

### Sprint 5 — Patrimônio
`US-15` `US-16`
