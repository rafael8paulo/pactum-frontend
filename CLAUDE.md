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

### Testes

- **Toda nova funcionalidade ou alteração de comportamento deve vir acompanhada de testes E2E com Playwright** que cubram o fluxo do usuário afetado. Não basta o teste unitário de `lib/`.
- Os testes ficam em `e2e/` (`<fluxo>.spec.ts`; specs que só valem no mobile usam `<fluxo>.mobile.spec.ts`), com Page Objects em `e2e/pages/`. Config em `playwright.config.ts`; execução com `npm run test:e2e` — ver a seção 8.1 para subir a stack local antes.

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

## 7. Build e Deploy com Docker

A aplicação roda em produção via imagem Docker multi-stage (`deps` → `build` → `runner`, base `node:20-alpine`), usando `output: 'standalone'` do Next.js.

**Importante**: `NEXT_PUBLIC_API_URL` é embutida no bundle JavaScript **no momento do build**, não é lida em runtime. Por isso ela deve ser passada como `--build-arg` do Docker — definir apenas uma env var no `docker run` não tem efeito sobre o código client-side já compilado.

```bash
# Build da imagem, apontando para a API correta do ambiente de destino
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.pactum.exemplo.com -t pactum-web .

# Rodar o container
docker run -p 3000:3000 pactum-web
```

Acesse `http://localhost:3000`. Para apontar para outra API, é necessário **rebuildar a imagem** com um novo `--build-arg`, não apenas trocar a env var do container.

### Deploy automático via GitHub Actions

Todo push em `master` dispara `.github/workflows/deploy.yml`, em 2 jobs (`needs`):

1. **build-and-push** — `npm ci` + `npm run lint` (gate) → build/push da imagem no GHCR (`ghcr.io/rafael8paulo/pactum-frontend`, tags `latest` e `${{ github.sha }}`). `NEXT_PUBLIC_API_URL` entra como `build-arg` (repository *variable*), pois fica embutida no bundle client no momento do build.
2. **deploy** — dispara o deploy da aplicação no **Dokploy** (via API) e aguarda o deployment concluir; se o Dokploy reportar erro, o job falha.

O Dokploy é o plano de controle de deploy na VPS: puxa a imagem nova do GHCR, recria o container e mantém histórico e rollback pela UI. Não há mais SSH nem `docker compose` manual no pipeline.

---

## 8. Comandos Úteis

```bash
npm run dev           # Inicia em desenvolvimento
npm run build         # Build de produção
npm run lint          # ESLint
npm test              # Testes unitários (node --test em lib/**)
npm run test:e2e      # Testes e2e (Playwright) — exige a stack local no ar
npm run test:e2e:ui   # Idem, no modo interativo do Playwright

npx shadcn@latest add [componente]   # Adicionar componente shadcn
```

---

## 8.1 Testes e2e (Playwright)

Os testes e2e ficam em `e2e/` (config em `playwright.config.ts`) e rodam contra a stack completa — frontend, API e Postgres — do `docker-compose.local.yml` na **raiz do monorepo** (`../docker-compose.local.yml`). O Playwright **não** sobe a stack: suba-a antes.

### Como rodar (caminho padrão: executor em container)

Não depende de libs do Chromium nem do Playwright instalados no host. Rode a partir de `pactum-frontend/`:

```bash
export E2E_HOST=host.docker.internal        # no WSL, também: export WSLENV=E2E_HOST
C="docker compose -f ../docker-compose.local.yml --profile e2e"   # no WSL sem `docker` no PATH: docker.exe

$C up -d --build --wait postgres api frontend      # ~2 min no primeiro build
$C run --rm --build e2e                            # todos os testes
$C run --rm --build e2e npx playwright test e2e/metas-economia.spec.ts   # um arquivo
$C down -v                                         # sempre derrubar ao final (descarta o banco)
```

Regras que evitam erro:
- **`E2E_HOST` igual no `up` e no `run`.** `NEXT_PUBLIC_API_URL` e o CORS da API são definidos no build/start a partir dele; dentro do container `localhost` é o próprio container, e API e frontend precisam estar no **mesmo host** para o cookie de sessão valer. Trocou o valor → `up --build` de novo.
- **WSL:** `docker` costuma não estar no PATH; use `docker.exe` (Docker Desktop). Variáveis só chegam ao `docker.exe` via `WSLENV`. Sempre passe o compose com caminho Windows se necessário (`$(wslpath -w ../docker-compose.local.yml)`).
- **Não rode `npm run test:e2e` direto no host sem antes validar o Chromium:** `npx playwright install chromium` baixa o navegador mas as libs de sistema (`libnspr4` etc.) exigem `sudo npx playwright install-deps`. O executor em container evita isso.
- A imagem `Dockerfile.e2e` deve usar a mesma versão de `@playwright/test` do `package-lock.json` (hoje 1.64.1).
- Relatório e traces: `playwright-report/` e `test-results/` (montados do container).

### Alternativa: executor no host

Só se as libs do Chromium estiverem instaladas. Stack com `localhost` (sem `E2E_HOST`):

```bash
docker compose -f ../docker-compose.local.yml up -d --build --wait   # front :3001, API :8081, Postgres :5433
npx playwright install chromium                                       # uma vez por máquina
npm run test:e2e
npx playwright show-report
docker compose -f ../docker-compose.local.yml down -v
```

### Armadilhas ao escrever specs

- **Desktop e mobile coexistem no DOM:** em `/inicio` o `SaldoHero` (mobile) e o `ResumoCards` (desktop) são renderizados juntos e um é escondido por CSS. `getByText` pode achar 2 elementos (strict mode) — use `.locator('visible=true')` (ver `visivel()` em `e2e/metas-economia.spec.ts`).
- **O mobile não tem os botões "Nova Despesa/Nova Receita"** (lançamento por sheet de adição rápida). Em `*.mobile.spec.ts` crie dados de apoio pela API (`e2e/support/api.ts`: `criarDespesaViaApi`, `criarReceitaViaApi`, usando `page.request` quando o spec tem usuário próprio).
- Specs que dependem de totais exatos usam usuário próprio e vazio: `test.use({ storageState: { cookies: [], origins: [] } })` + `cadastrarELogar(page)`.
- Valores em BRL saem com espaço não separável (`R$ 400,00`): use regex com `\s` (`/-R\$\s*400,00/`).

- `E2E_BASE_URL` (padrão `http://localhost:3001`) e `E2E_API_URL` (padrão `http://localhost:8081`, usada só para criar dados de apoio direto na API) apontam para outro ambiente. A imagem do frontend embute `NEXT_PUBLIC_API_URL` no build; só use outra URL se esse ambiente foi buildado apontando para a API correspondente.
- Projetos: `setup` (cadastra um usuário único e salva `e2e/.auth/user.json`), `auth` (sem sessão), `authenticated` (desktop, com a sessão salva) e `mobile` (Pixel 7, para `*.mobile.spec.ts`).
- Cada execução cria o próprio usuário (e-mail único), então não há seed nem limpeza. Specs que precisam de totais exatos criam um usuário próprio (`support/session.ts`).
- O agrupamento de lançamentos (`lib/lancamentos/group`) só existe na visão mobile; no desktop `/lancamentos` é uma tabela.
- `/despesas`, `/receitas` e `/resumo` apenas redirecionam para `/lancamentos?tipo=…` e `/inicio`; os testes usam as rotas finais.
- O cadastro **não abre sessão** na API hoje (`POST /api/v1/auth/cadastro` não emite `SESSION`), então os helpers fazem login após cadastrar.
- Seletores: `getByRole`/`getByLabel` primeiro; `data-testid` só quando não houver alternativa. Sem `waitForTimeout`.
- Falhas retêm trace em `test-results/` (`npx playwright show-trace <trace.zip>`). `playwright-report/`, `test-results/` e `e2e/.auth/` ficam fora do Git.
- **CI:** ainda não roda e2e. Um `e2e.yml` em PRs é follow-up e depende de resolver o checkout cruzado dos repos `pactum-api` e `pactum-frontend` e de onde versionar o compose local.

---

## 9. Padrões que NÃO Devem Ser Usados

- `fetch` direto — usar Axios via `lib/api/client.ts`
- `useState` para dados que vêm da API — usar TanStack Query
- Editar arquivos em `components/ui/` — são gerados pelo shadcn e serão sobrescritos
- Default export em componentes de feature
- Inline styles (`style={{ ... }}`) — usar Tailwind
- CSS modules

---

## 10. Exemplo de Implementação Completa

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
