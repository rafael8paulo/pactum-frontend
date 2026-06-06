# Pactum Web — CLAUDE.md

## 1. Visão Geral

Frontend de controle de finanças pessoais. Consome a Pactum API (Spring Boot) para gerenciar despesas, receitas, patrimônio e exibir um dashboard de resumo mensal com gráficos.

---

## 2. Stack e Ferramentas

| Ferramenta | Versão | Função |
|---|---|---|
| Next.js | 15 (App Router) | Framework principal |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 3.x | Estilização |
| shadcn/ui | latest | Biblioteca de componentes |
| TanStack Query | v5 | Server state / cache |
| Axios | 1.x | HTTP client |
| react-hook-form | 7.x | Gerenciamento de formulários |
| zod | 3.x | Validação de schemas |
| Recharts | 2.x | Gráficos |
| next-themes | latest | Dark/light mode |
| sonner | latest | Toast notifications (via shadcn) |

---

## 3. Estrutura de Pastas

```
pactum-web/
├── app/
│   ├── layout.tsx               # Layout raiz — fonte, ThemeProvider, Toaster
│   ├── page.tsx                 # Redirect → /resumo
│   └── (dashboard)/
│       ├── layout.tsx           # Sidebar + Header compartilhados
│       ├── resumo/page.tsx      # Dashboard mensal
│       ├── despesas/page.tsx    # CRUD de despesas
│       ├── receitas/page.tsx    # CRUD de receitas
│       └── patrimonio/page.tsx  # Gestão de patrimônio
│
├── components/
│   ├── ui/                      # Gerado pelo shadcn CLI — NUNCA editar manualmente
│   └── features/                # Componentes de negócio por domínio
│       ├── layout/              # Sidebar, Header, MonthPicker
│       ├── despesas/            # DespesaTable, DespesaForm, NovaDespesaDialog…
│       ├── receitas/            # ReceitaTable, ReceitaForm, NovaReceitaDialog…
│       ├── resumo/              # ResumoCards, EvolucaoAnualChart, DespesasPorCategoriaChart…
│       └── patrimonio/          # PatrimonioCard, PatrimonioTotal…
│
├── hooks/                       # TanStack Query hooks — um arquivo por domínio
│   ├── useDespesas.ts
│   ├── useReceitas.ts
│   ├── useResumo.ts
│   └── usePatrimonio.ts
│
├── lib/
│   ├── api/                     # Axios clients — um arquivo por domínio
│   │   ├── client.ts            # Instância base do Axios
│   │   ├── despesas.ts
│   │   ├── receitas.ts
│   │   ├── resumo.ts
│   │   └── patrimonio.ts
│   └── utils.ts                 # cn(), formatadores de moeda/data
│
├── types/                       # Tipos TypeScript alinhados com a API
│   ├── despesa.ts
│   ├── receita.ts
│   ├── resumo.ts
│   └── patrimonio.ts
│
└── providers/
    ├── query-provider.tsx       # QueryClientProvider
    └── theme-provider.tsx       # ThemeProvider (next-themes)
```

---

## 4. Convenções de Código

### Componentes

- Sempre functional components com TypeScript.
- Props tipadas com `interface`, nunca `type` para props de componente.
- Exportação **nomeada** (`export function Foo`), nunca default export — exceto `page.tsx` e `layout.tsx`, que exigem default pelo Next.js.
- Um componente por arquivo.
- Nomenclatura: `PascalCase` para componentes, `kebab-case` para nomes de arquivo.

```tsx
// ✅ correto
interface DespesaTableProps {
  competencia: string;
}

export function DespesaTable({ competencia }: DespesaTableProps) {
  // ...
}

// ❌ errado
export default function DespesaTable(...) { ... }
```

### Hooks

- Prefixo `use` obrigatório.
- Um arquivo por domínio (`hooks/useDespesas.ts`).
- Sempre tipar o retorno do `useQuery` e `useMutation`.
- `queryKey` como array: `['despesas', competencia, filters]`.
- Sempre invalidar queries relacionadas após mutations bem-sucedidas.

### Formulários

- Sempre usar `react-hook-form` + `zod`.
- Schema `zod` definido no mesmo arquivo do formulário.
- Nunca usar `<form>` sem `handleSubmit` do react-hook-form.

### API Client

- Nunca usar `fetch` diretamente — sempre via instância Axios em `lib/api/client.ts`.
- Um arquivo de client por domínio.
- Sempre tipar request e response com os tipos de `types/`.

### Estilização

- Tailwind CSS para tudo — nunca CSS modules ou styled-components.
- Variáveis de tema via CSS custom properties do shadcn.
- Classes condicionais sempre com `cn()` (de `lib/utils.ts`).

### Tratamento de Erros

- Erros de API sempre exibidos via `toast` (sonner).
- Loading states com componentes `Skeleton` do shadcn.
- Estado vazio com componente `EmptyState` padronizado.

---

## 5. Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 6. Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar .env.local na raiz (ver seção 5)
cp .env.example .env.local

# 3. Garantir que a pactum-api está rodando em http://localhost:8080

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

---

## 7. Comandos Úteis

```bash
npm run dev           # Inicia em desenvolvimento
npm run build         # Build de produção
npm run lint          # ESLint

npx shadcn@latest add [componente]   # Adicionar componente shadcn
```

---

## 8. Padrões que NÃO Devem Ser Usados

- `fetch` direto — usar Axios via `lib/api/client.ts`
- `useState` para dados que vêm da API — usar TanStack Query
- Editar arquivos em `components/ui/` — são gerados pelo shadcn e serão sobrescritos
- Default export em componentes de feature
- Inline styles (`style={{ ... }}`) — usar Tailwind
- CSS modules

---

## 9. Exemplo de Implementação Completa

Padrão end-to-end para a feature de **Despesas**.

### `types/despesa.ts`

```typescript
export type StatusDespesa = 'PAGA' | 'PENDENTE' | 'AGENDADA';

export type CategoriaDespesa =
  | 'FINANCIAMENTO'
  | 'CARTAO_CREDITO'
  | 'EDUCACAO'
  | 'SERVICOS'
  | 'LAZER'
  | 'IMPOSTO'
  | 'OUTROS';

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

export interface ListaDespesasResponse {
  despesas: Despesa[];
  total: number;
}

export interface DespesaFilters {
  status?: StatusDespesa;
  categoria?: CategoriaDespesa;
}
```

---

### `lib/api/despesas.ts`

```typescript
import { api } from './client';
import type {
  Despesa,
  CadastrarDespesaRequest,
  ListaDespesasResponse,
  DespesaFilters,
} from '@/types/despesa';

export const despesaApi = {
  listar: (competencia: string, filters?: DespesaFilters) =>
    api
      .get<ListaDespesasResponse>('/api/v1/despesas', {
        params: { competencia, ...filters },
      })
      .then((r) => r.data),

  cadastrar: (data: CadastrarDespesaRequest) =>
    api.post<Despesa>('/api/v1/despesas', data).then((r) => r.data),

  atualizar: (id: string, data: CadastrarDespesaRequest) =>
    api.put<Despesa>(`/api/v1/despesas/${id}`, data).then((r) => r.data),

  atualizarStatus: (id: string, status: Despesa['status']) =>
    api
      .patch<Despesa>(`/api/v1/despesas/${id}/status`, { status })
      .then((r) => r.data),

  remover: (id: string) => api.delete(`/api/v1/despesas/${id}`),
};
```

---

### `hooks/useDespesas.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { despesaApi } from '@/lib/api/despesas';
import type {
  CadastrarDespesaRequest,
  DespesaFilters,
  ListaDespesasResponse,
} from '@/types/despesa';

export function useDespesas(competencia: string, filters?: DespesaFilters) {
  return useQuery<ListaDespesasResponse>({
    queryKey: ['despesas', competencia, filters],
    queryFn: () => despesaApi.listar(competencia, filters),
  });
}

export function useCadastrarDespesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CadastrarDespesaRequest) => despesaApi.cadastrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast.success('Despesa cadastrada com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao cadastrar despesa. Tente novamente.');
    },
  });
}

export function useRemoverDespesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => despesaApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast.success('Despesa removida.');
    },
    onError: () => {
      toast.error('Erro ao remover despesa.');
    },
  });
}
```

---

### `components/features/despesas/DespesaTable.tsx`

```tsx
import { useDespesas } from '@/hooks/useDespesas';
import { useRemoverDespesa } from '@/hooks/useDespesas';
import type { DespesaFilters } from '@/types/despesa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  PAGA: 'bg-green-100 text-green-800',
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  AGENDADA: 'bg-blue-100 text-blue-800',
};

interface DespesaTableProps {
  competencia: string;
  filters?: DespesaFilters;
}

export function DespesaTable({ competencia, filters }: DespesaTableProps) {
  const { data, isLoading } = useDespesas(competencia, filters);
  const remover = useRemoverDespesa();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.despesas.length) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Nenhuma despesa encontrada para {competencia}.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.despesas.map((despesa) => (
          <TableRow key={despesa.id}>
            <TableCell>{despesa.descricao}</TableCell>
            <TableCell>{despesa.categoria}</TableCell>
            <TableCell className="text-right">
              {despesa.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(STATUS_COLORS[despesa.status])}
                variant="outline"
              >
                {despesa.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remover.mutate(despesa.id)}
                disabled={remover.isPending}
              >
                Remover
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```
