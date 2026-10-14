## Context

Ver `proposal.md — Why` para a motivação. As restrições que moldam a abordagem:

- **Next.js 15 App Router, sem SSR de dados.** Todas as páginas são Server Components finos que só leem `searchParams` e delegam para Client Components que consomem a API via TanStack Query. Não há sessão no servidor — `ProtectedRoute` decide no cliente. Logo, **não é possível escolher o shell por breakpoint no servidor**: qualquer decisão de viewport acontece após a hidratação.
- **Sessão por cookie.** `lib/api/client.ts` usa `withCredentials: true` e o backend gerencia o cookie; o frontend nunca lê token. Nada disso muda.
- **Modelo de dados atual não tem dia.** `Despesa`, `Receita` e `Patrimonio` têm apenas `competencia: 'YYYY-MM'`. Só `ContaRecorrente` tem `diaVencimento`, `dataBaseCobranca` e `proximaCobranca`. Isso restringe o que os layouts podem prometer (ver Decisão 6).
- **`Despesa` não tem forma de pagamento.** `formaPagamentoId` existe apenas em `ContaRecorrente`. A ligação `Despesa.contaRecorrenteId` é o único caminho indireto.
- **Tema via CSS variables HSL** em `app/globals.css` + `tailwind.config.ts`, com `next-themes`. O design aprovado introduz uma paleta de marca (verde-petróleo) que hoje não existe: o `--primary` atual é o azul-ardósia padrão do shadcn.

## Goals / Non-Goals

**Goals:**

- Uma única fonte de dados e de estado de URL alimentando duas apresentações (mobile/desktop), sem duplicar hooks, validação ou tratamento de erro.
- Todo estado de navegação permanece na URL (`competencia`, `tipo`, `status`, `categoria`), para que links continuem compartilháveis e o botão voltar funcione.
- Nenhuma regressão funcional em desktop: as `<Table>` ordenáveis, os `Dialog` e a `Sidebar` continuam existindo e sendo testáveis.

**Non-Goals:**

- Service worker, instalação PWA e sincronização em background. Só o cache do TanStack Query é persistido.
- Reescrita dos formulários de conta recorrente e forma de pagamento — eles herdam o `Sheet` mobile, mas seus campos permanecem como estão.
- Qualquer alteração no `pactum-api`. As lacunas de contrato viram fallback (Decisão 6), não bloqueio.
- Testes automatizados de regressão visual — fora do orçamento desta iteração.

## Decisions

### 1. Seleção de shell por CSS, com um único `useMediaQuery` para comportamento

**Escolha:** o layout renderiza **ambos** os shells e usa `hidden md:flex` / `md:hidden` para a escolha visual. Apenas o comportamento que não dá para expressar em CSS (qual superfície abrir na criação, se o gesto de swipe é registrado) consulta um `useMediaQuery('(min-width: 768px)')` que retorna `undefined` no primeiro render.

**Por quê:** sem sessão no servidor, um shell escolhido por JS causaria flash de layout na hidratação em toda navegação. CSS resolve o visual sem custo de hidratação; o hook fica restrito aos poucos pontos de decisão comportamental e cada consumidor trata `undefined` renderizando o caminho desktop (mais conservador: nunca abre um sheet por engano).

**Alternativas descartadas:** (a) detecção por `User-Agent` no middleware — erra em tablets e quebra cache de CDN; (b) rotas paralelas `@mobile`/`@desktop` — duplicaria a árvore de rotas inteira para ganhar pouco.

### 2. `TxRow` é apresentação; `DespesaTable`/`ReceitaTable` continuam donos dos dados

`DespesaTable` e `ReceitaTable` mantêm hooks, mutações e estado de ordenação, e passam a renderizar `<TxList>` ou `<Table>` conforme o breakpoint. Nenhum hook novo de dados é criado para as listas.

**Por quê:** duplicar a camada de dados por breakpoint é como bugs de consistência aparecem — invalidação que roda em um caminho e não no outro. O ponto de bifurcação deve ser o mais tarde possível na árvore.

**Trade-off:** esses dois componentes ficam maiores. Aceito: são ~120 linhas cada e a alternativa custa mais.

### 3. Bottom sheets com `vaul`, não `Dialog` do Radix

**Escolha:** adicionar `vaul` (o mesmo pacote por trás do `drawer` do shadcn) e criar `components/ui/drawer.tsx` via CLI do shadcn. `QuickAddSheet`, `TxDetailSheet` e `MonthSheet` usam `Drawer` abaixo de `md` e reutilizam o `Dialog` existente acima.

**Por quê:** o design exige arrastar para dispensar, ancoragem na base e convivência com o teclado virtual. `@radix-ui/react-dialog` centraliza o painel e não tem gesto de arrasto; reimplementar isso à mão significaria refazer foco preso, scroll lock e acessibilidade que o `vaul` já entrega (ele é construído sobre o próprio Radix Dialog, então a semântica ARIA é a mesma).

**Alternativa descartada:** `Sheet` do shadcn com `side="bottom"` — já existe no projeto, mas não tem drag-to-dismiss nem snap points; o painel de criação precisa dos dois.

### 4. Swipe com `react-swipeable`, sempre com equivalente não gestual

**Escolha:** `react-swipeable` (~2 kB) para detectar o deslize; o alvo "Marcar paga" é revelado por `transform` na camada da frente. Limiar de confirmação em 96px. O gesto nunca é o único caminho: a mesma mutação está no `TxDetailSheet`.

**Por quê:** `framer-motion` resolveria, mas custa ~40 kB gz para um único gesto em um app cujo maior risco de performance já é o Recharts. Gesto exclusivo seria falha de acessibilidade (WCAG 2.5.1) e de descoberta.

**Mitigação de acidente:** só despesas com status ≠ PAGA registram o handler, e a mutação é otimista com undo de 5s (Decisão 5) — o pior caso de um swipe acidental é um toque em "Desfazer".

### 5. Undo por mutação otimista com snapshot, não por endpoint de reversão

`useAtualizarStatusDespesa` passa a fazer `onMutate` → cancela queries, guarda o snapshot do cache, aplica o novo status; `onError` → restaura o snapshot; `onSuccess` → `toast.success(..., { action: { label: 'Desfazer', onClick: () => mutate({ id, status: statusAnterior }) } })`.

**Por quê:** o backend não tem endpoint de reversão, e não precisa: a reversão é o mesmo `PATCH` com o valor anterior. Guardar o estado anterior no cliente mantém o change 100% frontend.

**Limitação assumida:** se outro dispositivo alterar a mesma despesa entre a ação e o undo, o undo sobrescreve. Aceito — é um app de finanças pessoais de usuário único, e o custo de resolver isso (versionamento otimista no backend) é desproporcional.

### 6. Agrupamento por dia é uma capability condicional, com fallback especificado

O layout mostra "Hoje · 28 set" e "3 despesas vencem esta semana". Isso exige um campo de data em `Despesa`/`Receita` que **hoje não existe** — o modelo só tem `competencia`.

**Escolha:** implementar `groupLancamentos()` com duas estratégias atrás da mesma assinatura. Enquanto `despesa.data` for `undefined`, o agrupamento é por status (despesas) ou grupo único (receitas), e o aviso de `/inicio` conta pendentes da competência em vez de vencimentos da semana. Quando o backend adicionar o campo, troca-se a estratégia sem tocar em `TxList` nem em `TxRow`.

**Por quê:** a alternativa era bloquear o change esperando o backend, ou inventar uma data no cliente (ex.: assumir dia 1). Inventar dado em app financeiro é inaceitável; bloquear desperdiça o resto do redesign, que é a maior parte do valor.

**O mesmo vale para forma de pagamento por lançamento:** a linha de contexto do `TxRow` resolve a forma de pagamento via `contaRecorrenteId` quando ela existe, e omite o segmento quando não existe — nunca exibe placeholder.

### 7. Recharts sai do caminho crítico mobile

A faixa de 6 meses de `/inicio` é construída com `div`s e `flex`, não com Recharts. `EvolucaoAnualChart` passa a ser importado por `next/dynamic` com `ssr: false`, e só é montado acima de `md`.

**Por quê:** Recharts é o maior item do bundle (~100 kB gz) e serve a um gráfico que o layout mobile nem usa. Barras proporcionais em CSS custam zero e ainda respeitam `prefers-reduced-motion` de graça.

### 8. Persistência de cache com allowlist e purga no logout

`@tanstack/react-query-persist-client` + `createSyncStoragePersister` sobre `localStorage`, com `maxAge: 24h`, `buster` derivado da versão do app e `dehydrateOptions.shouldDehydrateQuery` restringindo a persistência às queries `['despesas'|'receitas'|'resumo'|'contas-recorrentes', ...]`. `auth-provider.logout()` e o interceptor de 401 chamam `persister.removeClient()` **antes** de redirecionar.

**Por quê:** é o que viabiliza a capability `offline-resilience-ui` sem service worker. A allowlist e a purga são requisito de segurança, não otimização: sem elas, o extrato financeiro de um usuário fica legível em `localStorage` para o próximo usuário do mesmo dispositivo.

**Alternativa descartada:** `IndexedDB` via persister assíncrono — mais robusto para volumes grandes, mas o payload aqui é de dezenas de KB e o persister síncrono evita um estado intermediário de hidratação.

### 9. Redirects como Server Components, não `next.config.ts`

Cada rota antiga vira um `page.tsx` que lê `searchParams` e chama `redirect()` de `next/navigation` com 308. `/despesas` e `/receitas` reescrevem os params para `?tipo=…`.

**Por quê:** `redirects` estático em `next.config.ts` não sabe transformar `?competencia=2026-03` em `?tipo=despesa&competencia=2026-03`. Um Server Component de 5 linhas resolve e fica versionado junto da rota.

### 10. Tokens de marca antes das telas

A paleta (verde-petróleo `--brand`, tints de status `pos`/`neg`/`warn`) e as duas famílias tipográficas entram como CSS variables em `globals.css` + `tailwind.config.ts` **na primeira task**, com os pares claro/escuro validados em contraste antes de qualquer tela ser construída.

**Por quê:** as cores de status hoje são utilitários Tailwind cravados (`text-green-600`, `text-red-600`) que não têm variante de tema e falham contraste em dark mode. Se as telas forem construídas antes dos tokens, cada uma herda o problema e a correção vira um passe de refatoração em 12 arquivos.

## Risks / Trade-offs

- **Dois shells convivendo dobram a superfície de regressão.** → O ponto de bifurcação é único e tardio (Decisão 2); hooks, schemas Zod e mutações são compartilhados. Checklist de verificação manual em 390px e 1440px por rota na fase final das tasks.
- **`useMediaQuery` retorna `undefined` no primeiro render e pode piscar.** → Só afeta comportamento, não layout (Decisão 1). Consumidores tratam `undefined` como desktop, que é o caminho não destrutivo.
- **`redirect()` 308 é cacheado agressivamente pelo navegador.** → Se as rotas novas precisarem ser revertidas, o 308 fica preso no cliente. Mitigação: usar 307 (temporário) no primeiro deploy e promover para 308 depois de uma semana estável.
- **Swipe acidental durante rolagem vertical.** → `react-swipeable` com `delta: 30` e `preventScrollOnSwipe: false`, ativando apenas quando o deslocamento horizontal excede o vertical; mais o undo de 5s.
- **`localStorage` cheio (cota excedida) quebra a persistência silenciosamente.** → O persister falha de forma isolada; a aplicação continua funcionando online. Envolver a criação do persister em try/catch e degradar para cache só em memória.
- **Fallback de agrupamento entrega menos que o layout aprovado.** → Explícito na spec `lancamentos-unificados-ui` e visível ao usuário como agrupamento por status, não como dado inventado. O campo de data vira dependência rastreada com o backend.
- **`lucide-react@^1.17.0` pode não ter todos os ícones do design** (`clock-alert`, `cloud-alert`, `wand-sparkles`, `tv-minimal-play`). → Task 1.4 verifica a disponibilidade e fixa substitutos antes de qualquer tela usá-los.

## Migration Plan

1. **Tokens e dependências** (tasks 1.x) — sem impacto no usuário; desktop continua idêntico porque os utilitários antigos só são trocados quando cada tela é tocada.
2. **Rotas novas convivendo com as antigas** (tasks 2.x) — `/inicio`, `/lancamentos`, `/recorrentes`, `/mais` passam a existir; as antigas continuam funcionando normalmente. Deploy seguro a qualquer momento.
3. **Redirects ativados** (task 2.6) — ponto de não retorno percebido pelo usuário. Deployar com 307.
4. **Shell mobile e telas** (tasks 3.x–7.x) — incrementais, cada uma verificável isoladamente.
5. **Persistência de cache** (tasks 8.x) — por último, porque é a única que grava dados no dispositivo.

**Rollback:** reverter o deploy restaura as rotas antigas, que continuam existindo como arquivos até a task 2.6. Depois dela, o rollback exige reverter também os redirects — daí a escolha de 307 no primeiro deploy. O cache persistido é invalidado automaticamente pelo `buster` de versão em qualquer rollback.

## Open Questions

- **Qual o prazo do backend para `Despesa.data`/`Receita.data`?** Não bloqueia: o fallback está especificado e a troca de estratégia é local a `groupLancamentos()`. Precisa de alinhamento com o `pactum-api` para saber se vale abrir o change irmão agora ou depois desta entrega.
- **A faixa de 6 meses de `/inicio` deve ancorar no mês corrente ou na competência ativa?** A spec exige ancorar na competência ativa; se a preferência mudar, muda uma expressão de slice, sem efeito em specs ou tasks.
