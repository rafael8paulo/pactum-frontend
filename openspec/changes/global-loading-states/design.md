## Context

O Pactum Web usa TanStack Query para todas as operações de dados e `useMutation` para mutações. Atualmente nenhum estado de loading (`isLoading`, `isPending`) é utilizado para exibir feedback visual. O projeto já tem Tailwind CSS, shadcn/ui e Sonner (toast) — a infraestrutura de UI está pronta; falta apenas os componentes de loading e sua aplicação sistemática.

## Goals / Non-Goals

**Goals:**
- Componente `Spinner` base, reutilizável em qualquer contexto
- Componente `PageLoader` para loading de página inteira
- Aplicação consistente do padrão em todas as páginas, formulários e ações inline
- Barra de progresso de navegação com `nextjs-toploader`

**Non-Goals:**
- Não substituir Skeleton existente em componentes de tabela (escopo futuro)
- Não implementar retry automático ou error boundaries
- Não alterar lógica de negócio, validações ou fluxos de dados

## Decisions

### 1. Spinner via SVG + `animate-spin` do Tailwind
Alternativas consideradas: biblioteca externa (react-spinners), CSS puro, Radix primitives.
Escolha: SVG inline com `animate-spin` — zero dependência extra, totalmente customizável via `className`, integra naturalmente com o sistema de tokens do shadcn (usa `currentColor`). Três tamanhos fixos (`sm`/`md`/`lg`) mapeados a classes Tailwind evitam prop drilling de números arbitrários.

### 2. `PageLoader` como wrapper simples de `Spinner`
Alternativas: `Suspense` boundary do React, overlay com backdrop.
Escolha: componente funcional simples com `flex` + `items-center` + `justify-center` e altura mínima `min-h-[200px]`. Sem Suspense — o TanStack Query já gerencia o estado async; adicionar Suspense exigiria refatorar todos os hooks com `suspense: true`. Sem overlay — o carregamento substitui o conteúdo, não o sobrepõe.

### 3. `loadingId` local para ações inline
Alternativas: flag global no hook, `isPending` da mutation com `variables`.
Escolha: `useState<string | null>(null)` local no componente. Mais simples, sem acoplamento entre linhas da tabela. O padrão com `variables` do TanStack Query é viável mas exige que a mutation exponha `variables`, o que nem sempre é desejável. `loadingId` é mais explícito e fácil de auditar.

### 4. `nextjs-toploader` para navegação
Alternativas: implementação manual com `useRouter` + `usePathname`, NProgress diretamente.
Escolha: `nextjs-toploader` encapsula NProgress com suporte nativo ao App Router do Next.js 15. Configurado com `showSpinner={false}` para não conflitar com o `Spinner` do projeto. Cor via CSS variable `--primary` do shadcn para consistência de tema.

## Risks / Trade-offs

- **`loadingId` não reseta em caso de erro de rede** → Mitigation: usar `try/finally` no handler para garantir `setLoadingId(null)` mesmo em erro. As mutations do TanStack Query já chamam `onError` com toast; o `finally` no handler local garante o reset visual.
- **`nextjs-toploader` pode conflitar com futuras atualizações do Next.js 15** → Mitigation: a lib tem suporte ativo ao App Router; riscos são baixos no curto prazo.
- **Páginas que não usam `useQuery` diretamente** (`resumo/page.tsx` pode agregar múltiplos hooks) → Mitigation: usar `isLoading` do hook principal da página; se múltiplos hooks, fazer `||` dos estados.
