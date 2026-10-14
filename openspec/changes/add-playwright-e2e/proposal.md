## Why

O projeto só tem testes unitários (`node --test` em `lib/**`) no frontend e ITs de persistência na API. Nada valida o fluxo real ponta a ponta (UI → API → Postgres): cadastro, login, CRUD e resumo. Regressões de integração entre os dois repositórios só aparecem em produção ou na validação manual. O `docker-compose.local.yml` já sobe a stack completa e efêmera, então o custo de adicionar e2e agora é baixo.

## What Changes

- Adicionar Playwright (somente Chromium) como devDependency do `pactum-frontend`, com `playwright.config.ts` na raiz e specs em `e2e/`.
- `baseURL` configurável via `E2E_BASE_URL` (padrão `http://localhost:3001`); `trace: 'retain-on-failure'`.
- Projeto `setup` (`auth.setup.ts`) que cadastra um usuário com e-mail único e salva o `storageState` em `e2e/.auth/` para reuso pelos demais specs.
- Smoke specs: `auth` (cadastro, login, logout, rota protegida → `/login`), `despesas` (criar/editar/excluir), `receitas` (criar e ver na lista), `lancamentos` (agrupamento), `resumo` (total reflete o criado).
- Page Objects leves em `e2e/pages/`; seletores `getByRole`/`getByLabel` antes de `data-testid`.
- Scripts `test:e2e` e `test:e2e:ui` no `package.json`; `npm test` (`node --test`) permanece inalterado.
- `.gitignore`: `playwright-report/`, `test-results/`, `e2e/.auth/`.
- Documentar em `CLAUDE.md` como subir a stack e rodar os testes.
- **Fora de escopo:** execução em CI (workflow `e2e.yml` em PRs fica como follow-up, pois exige checkout cruzado entre os repos `pactum-api` e `pactum-frontend`); spec de isolamento entre dois usuários (já coberto por `MultitenancyIsolationIT` na API).

## Capabilities

### New Capabilities
- `e2e-testing`: infraestrutura e cobertura de testes end-to-end com Playwright contra a stack local (config, autenticação reutilizável, fluxos smoke, scripts e convenções).

### Modified Capabilities
<!-- Nenhuma: nenhum comportamento existente do app muda. -->

## Impact

- **Código:** novos `playwright.config.ts`, `e2e/**`; edições em `package.json`, `package-lock.json`, `.gitignore`, `CLAUDE.md`.
- **Dependências:** `@playwright/test` (devDependency) e o browser Chromium baixado localmente.
- **Sistemas:** usa `../docker-compose.local.yml` (Postgres :5433, API :8081, frontend :3001) sem alterá-lo, salvo se a verificação de pré-requisitos exigir ajuste.
- **Verificações já feitas:** o formulário de cadastro (`nome`, `email`, `senha`, `confirmarSenha`) não tem etapa de confirmação por e-mail, e não há rate limit identificado no login da API.
- **Produção/deploy:** sem impacto; o `deploy.yml` não é tocado.
