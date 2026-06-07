## Context

O Pactum Web hoje não tem autenticação. A `pactum-api` implementa autenticação stateful via Spring Security com cookie `JSESSIONID` (httpOnly, SameSite=Strict). O frontend precisa adaptar-se para enviar esse cookie em todas as requisições e reagir a respostas `401` redirecionando o usuário para `/login`. O estado do usuário autenticado deve estar disponível globalmente via React Context para que o Header e outras peças de UI possam consumi-lo.

## Goals / Non-Goals

**Goals:**
- Configurar Axios para enviar cookies em todas as requisições (`withCredentials: true`)
- Interceptar `401` e redirecionar para `/login` automaticamente
- Manter o estado do usuário autenticado em um React Context (`AuthProvider`)
- Restaurar sessão existente na inicialização via `GET /auth/me`
- Bloquear acesso às rotas de dashboard para usuários não autenticados
- Telas públicas de login e cadastro com validação inline de erros

**Non-Goals:**
- Implementar refresh token ou expiração manual de sessão (gerenciado pela API)
- Persistir dados do usuário em `localStorage`/`sessionStorage`
- Manipular ou ler o cookie `JSESSIONID` via JavaScript
- Autorização (roles/permissões) — apenas autenticação

## Decisions

### 1. Sessão via cookie httpOnly, sem token no frontend

**Decisão**: O frontend não armazena nem manipula qualquer token de sessão. O `JSESSIONID` é gerenciado exclusivamente pelo browser como cookie httpOnly. Apenas `withCredentials: true` no Axios é necessário para que o browser o envie automaticamente.

**Alternativa considerada**: JWT em `localStorage` — descartado por exigir lógica de refresh, expiração e por expor o token a ataques XSS.

**Rationale**: A `pactum-api` já gerencia o ciclo de vida da sessão; o frontend apenas reflete o estado.

### 2. Estado global via React Context (não TanStack Query)

**Decisão**: O usuário autenticado (`usuario: Usuario | null`) é mantido em `AuthProvider` com `useState`, não em `useQuery`.

**Alternativa considerada**: `useQuery(['me'])` no TanStack Query para buscar o usuário — descartado porque mutações de login/logout precisam atualizar o estado imediatamente e de forma imperativa; o padrão de cache do TanStack Query não se encaixa bem no ciclo de autenticação.

**Rationale**: O contexto de auth é um estado de aplicação de longa vida, não um dado de servidor com cache e revalidação. React Context é a ferramenta certa.

### 3. Interceptor de 401 com `window.location.href`

**Decisão**: O interceptor de erro do Axios usa `window.location.href = '/login'` (hard redirect), não `router.push`.

**Alternativa considerada**: `useRouter()` do Next.js — não disponível fora de componentes React; tornaria o interceptor dependente de ser inicializado dentro de um componente.

**Rationale**: O interceptor vive no módulo `lib/api/client.ts`, fora da árvore React. A abordagem com `window.location.href` é mais simples e garante limpeza do estado React na navegação.

### 4. ProtectedRoute como componente client-side

**Decisão**: `ProtectedRoute` é um Client Component que verifica `isLoading` e `usuario` do `useAuth()` e usa `router.replace('/login')` para redirecionar.

**Alternativa considerada**: Middleware do Next.js para proteção server-side — descartado porque a sessão é via cookie httpOnly e checar autenticação no servidor exigiria validar o cookie contra a API a cada request, acoplando o frontend ao backend no SSR.

**Rationale**: Proteção client-side é suficiente para um SPA de finanças pessoais; o backend já protege os endpoints com `401`.

### 5. Erros de auth inline, não toast

**Decisão**: Erros de credenciais (login) e email duplicado (cadastro) são exibidos como mensagens inline no formulário via `setError` do react-hook-form.

**Rationale**: Toast é adequado para ações assíncronas em segundo plano (salvar, deletar). Erros de formulário precisam de contexto visual junto ao campo — o usuário deve corrigir ali mesmo.

### 6. `(auth)` como route group separado

**Decisão**: Telas de login e cadastro vivem em `app/(auth)/` com seu próprio `layout.tsx`, completamente separado do `app/(dashboard)/layout.tsx`.

**Rationale**: Evita que a Sidebar e o Header do dashboard apareçam nas telas públicas. Route groups do Next.js App Router são a solução idiomática para layouts alternativos.

## Risks / Trade-offs

- **[Risco] Race condition no `AuthProvider`**: Se o `GET /auth/me` falhar por timeout, o usuário pode ser redirecionado para `/login` mesmo com sessão válida. → Mitigação: tratar apenas erros `401` como "não autenticado"; outros erros de rede não limpam o estado do usuário.
- **[Trade-off] Hard redirect no interceptor de 401**: `window.location.href` causa um full page reload, perdendo estado React em memória. → Aceitável: a sessão expirou, faz sentido reinicializar a aplicação.
- **[Risco] `AuthProvider` renderizado antes do `QueryClientProvider`**: Se a ordem de providers estiver errada, o contexto pode não estar disponível. → Mitigação: `AuthProvider` envolve `QueryClientProvider` no `app/layout.tsx`; documentado nas tasks.

## Open Questions

- Nenhuma — o design está alinhado com os requisitos da `pactum-api` existente.
