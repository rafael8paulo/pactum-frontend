## Context

Ver `proposal.md` para a motivação. Estado atual relevante:

- Stack local efêmera em `../docker-compose.local.yml`: Postgres (:5433), API (:8081) e frontend (:3001). O frontend é buildado com `NEXT_PUBLIC_API_URL=http://localhost:8081` e a API aceita CORS de `http://localhost:3001`.
- A sessão é baseada em cookie: o cliente Axios usa `withCredentials: true` e não há `localStorage`/`sessionStorage` de token no código. Cookies não isolam por porta no mesmo host, então o cookie emitido por `localhost:8081` também vale para `localhost:3001`.
- Rotas protegidas redirecionam para `/login?redirect=...`; pós-login o destino padrão é `/inicio`, que mostra um `SetupChecklist` de onboarding enquanto o usuário não concluiu os passos iniciais.
- Formulários usam `<Label htmlFor>` (`nome`, `email`, `senha`, `confirmarSenha`), bons para `getByLabel`. O botão de logout no `Header` tem `aria-label="Sair"`.
- `npm test` roda `node --test "lib/**/*.test.ts"` e deve continuar assim.
- Os dois repositórios (`pactum-api`, `pactum-frontend`) têm `.git` próprio; o compose na raiz do monorepo não é versionado em nenhum deles.

## Goals / Non-Goals

**Goals:**
- Suíte smoke rápida e determinística que roda localmente com um comando.
- Nenhuma dependência de dados pré-existentes ou de seed.
- Base simples de estender (novos specs reutilizam sessão e Page Objects).

**Non-Goals:**
- Execução em CI (follow-up, ver Riscos).
- Multi-browser e testes visuais/screenshot. Viewport mobile só onde o comportamento existe apenas nele (agrupamento de lançamentos).
- Subir/derrubar a stack de dentro do Playwright (`webServer`): o ambiente é responsabilidade do desenvolvedor.
- Alterações no código da aplicação ou da API, salvo `data-testid` pontual onde `getByRole`/`getByLabel` não bastar.

## Decisions

**1. Playwright (`@playwright/test`) em vez de Cypress.**
Runner próprio, `storageState`, traces e UI mode nativos, execução paralela por padrão e instalação mais leve em CI futuro. Cypress foi descartado por não oferecer vantagem aqui e por ter modelo de cross-origin mais restritivo (UI em :3001 chamando API em :8081).

**2. Config e specs dentro do `pactum-frontend` (`playwright.config.ts`, `e2e/`).**
Os testes exercitam a UI e Playwright é dependência Node. Alternativa: um terceiro repo/pasta na raiz do monorepo — descartada porque a raiz não é versionada e o frontend já tem pipeline e OpenSpec próprios.

**3. Stack externa ao Playwright (sem `webServer`).**
O desenvolvedor sobe com `docker compose -f ../docker-compose.local.yml up -d --build --wait`. O `webServer` do Playwright só gerencia um processo, e aqui são três serviços com build de imagem; reimplementar isso duplicaria o compose. `baseURL` vem de `E2E_BASE_URL` (padrão `http://localhost:3001`), o que também permite apontar para outro ambiente descartável.

**4. Autenticação via projeto `setup` + `storageState`.**
`auth.setup.ts` cadastra um usuário com e-mail único (`e2e+<timestamp>-<random>@pactum.test`), faz login pela UI e grava `e2e/.auth/user.json`. Projetos de teste autenticados declaram `dependencies: ['setup']` e `use.storageState`. O spec `auth.spec.ts` roda em projeto separado, com `storageState` vazio, para exercitar cadastro/login/logout/proteção de rota de verdade. Alternativa: autenticar via chamada direta à API (mais rápido) — descartada porque o setup também serve de teste de cadastro/login e a diferença de tempo é irrelevante num smoke.

**5. Isolamento por dados únicos, não por limpeza.**
O Postgres do compose é efêmero e cada execução cria seu próprio usuário (tenant), então não há `afterAll` de limpeza nem seed. Cada spec cria os dados de que precisa dentro do próprio teste, com descrições únicas, para não depender de ordem. Os specs do usuário compartilhado rodam com `fullyParallel: false` dentro de um mesmo arquivo e `workers` limitados, evitando que o resumo de um teste seja alterado por dados de outro: `resumo.spec.ts` usa valores distintivos e verifica o delta/total do mês em que cria os dados.

**6. Seletores e Page Objects.**
`getByRole`/`getByLabel`/`getByText` primeiro; `data-testid` somente se necessário. Page Objects leves em `e2e/pages/` (login, cadastro, formulário de despesa/receita) apenas para o que se repete em mais de um spec. Sem camada de abstração além disso.

**7. Onboarding não pode mascarar a asserção.**
Na primeira visita o `/inicio` exibe o `SetupChecklist`. Os specs navegam direto para as rotas que testam (`/despesas`, `/receitas`, `/lancamentos`, `/resumo`) em vez de depender da home, e o setup não assume o estado do checklist.

**8. Diagnóstico.**
`trace: 'retain-on-failure'`, reporter `html` (sem abrir automaticamente) + `list`; `retries: 0` localmente. Artefatos (`playwright-report/`, `test-results/`, `e2e/.auth/`) entram no `.gitignore`.

**9. Somente Chromium.**
Um projeto de browser reduz tempo e flakiness num primeiro momento; adicionar Firefox/WebKit depois é só incluir projetos na config.

## Risks / Trade-offs

- [Imagem do frontend embute `NEXT_PUBLIC_API_URL` no build] → `E2E_BASE_URL` só serve para outro ambiente que tenha sido buildado com a API correta; documentar isso no `CLAUDE.md`.
- [Cookie de sessão com atributos (`Secure`/`SameSite`) que impeçam o fluxo em `http://localhost`] → verificado: `SESSION; Path=/; HttpOnly; SameSite=Lax`, sem `Secure`, funciona em `http://localhost` e é capturado pelo `storageState`.
- [Rate limit ou confirmação de e-mail no cadastro/login] → verificado na implementação: sem confirmação de e-mail e 12 logins inválidos seguidos retornaram 401 sem bloqueio; reavaliar se isso mudar.
- [Flakiness por TanStack Query/cache e navegação com redirects] → usar asserções com auto-wait (`expect(...).toBeVisible()`), nunca `waitForTimeout`; esperar por respostas de rede só quando necessário.
- [Valores e totais dependem do mês corrente e do `MonthPicker`] → criar dados na competência atual e assertar na mesma competência; não fixar datas.
- [Execução em CI exige checkout cruzado dos repos `pactum-api` e `pactum-frontend` e o compose não está versionado] → fora de escopo; follow-up decidirá entre mover o compose para um repo, publicar imagens no GHCR e usá-las no workflow, ou um repo orquestrador.
- [Custo de manutenção dos specs conforme a UI evolui] → manter o escopo em smoke, preferir seletores semânticos e Page Objects mínimos.

## Ajustes feitos durante a implementação

- **Rotas:** `/despesas`, `/receitas` e `/resumo` só redirecionam para `/lancamentos?tipo=…` e `/inicio`. Os specs usam as rotas finais e um único Page Object, `LancamentosPage`.
- **Cadastro não abre sessão:** `POST /api/v1/auth/cadastro` retorna 201 sem `Set-Cookie`, e a UI volta para `/login?redirect=/inicio`, o que diverge do spec `cadastro-screen` (que prevê entrar na aplicação). Os testes não assertam o destino pós-cadastro e autenticam via login (`support/session.ts`). Não foi corrigido aqui por estar fora do escopo.
- **Agrupamento só no mobile:** `groupLancamentos` alimenta apenas a visão mobile; o desktop usa tabela. Foi adicionado o projeto `mobile` (Pixel 7) para `*.mobile.spec.ts`.
- **Dados de apoio via API:** o spec de agrupamento cria despesas por `POST /api/v1/despesas` (`E2E_API_URL`) com a sessão salva, pois ele testa o agrupamento e não a criação, que o spec de despesas já cobre.
- **Resumo com usuário próprio:** o usuário do `storageState` é compartilhado entre specs e acumula dados no mês; o spec de resumo cria um usuário novo para ter totais exatos.
- **Botão duplicado:** com a lista vazia, "Nova Despesa"/"Nova Receita" aparece no cabeçalho e no estado vazio; o Page Object usa o primeiro (cabeçalho).

## Open Questions

- Onde versionar o `docker-compose.local.yml` quando o CI for adicionado (hoje está só na raiz do monorepo).
- Se vale cobrir viewport mobile (há `MobileTabBar`/`MobileHeader`) numa segunda etapa.
