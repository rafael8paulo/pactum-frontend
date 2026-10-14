## 1. Setup do Playwright

- [x] 1.1 Instalar `@playwright/test` como devDependency e baixar o Chromium; verificar com `npx playwright --version` e `npx playwright install chromium`
- [x] 1.2 Criar `playwright.config.ts` (testDir `e2e`, `baseURL` via `E2E_BASE_URL` com padrão `http://localhost:3001`, só Chromium, `trace: 'retain-on-failure'`, reporters `list` + `html` sem abrir, projetos `setup`/`auth`/`authenticated`); verificar com `npx playwright test --list`
- [x] 1.3 Adicionar scripts `test:e2e` e `test:e2e:ui` ao `package.json`; verificar que `npm test` continua rodando só `node --test "lib/**/*.test.ts"` e passa
- [x] 1.4 Atualizar `.gitignore` com `playwright-report/`, `test-results/` e `e2e/.auth/`; verificar com `git check-ignore` nos três caminhos
- [x] 1.5 Excluir `e2e/` e `playwright.config.ts` do `tsconfig`/ESLint do Next se conflitarem; verificar que `npm run build` e `npm run lint` passam

## 2. Pré-requisitos do ambiente

- [x] 2.1 Subir a stack com `docker compose -f ../docker-compose.local.yml up -d --build --wait` e verificar que `http://localhost:3001/login` e `http://localhost:8081` respondem
- [x] 2.2 Fazer cadastro e login manualmente em `http://localhost:3001` e confirmar que o cookie de sessão funciona em `http://localhost` (atributos `Secure`/`SameSite`); registrar o resultado e, se houver bloqueio, ajustar apenas a configuração do compose local
- [x] 2.3 Confirmar que o cadastro não exige confirmação de e-mail e que logins repetidos não sofrem rate limit; registrar o resultado no `design.md` (Riscos)

## 3. Autenticação reutilizável

- [x] 3.1 Criar helper de dados únicos (`e2e/support/unique.ts`) para e-mail e descrições; verificar que duas chamadas retornam valores distintos
- [x] 3.2 Criar Page Objects `e2e/pages/LoginPage.ts` e `e2e/pages/CadastroPage.ts` usando `getByLabel`/`getByRole`
- [x] 3.3 Criar `e2e/auth.setup.ts` que cadastra usuário único, faz login e grava `e2e/.auth/user.json`; verificar que o arquivo é gerado e que `npx playwright test --project=setup` passa

## 4. Specs de autenticação (sem sessão salva)

- [x] 4.1 Criar `e2e/auth.spec.ts` com cadastro pela UI e login com credenciais válidas; verificar que passa
- [x] 4.2 Adicionar cenário de logout (botão `aria-label="Sair"`) e de rota protegida sem sessão redirecionando para `/login`; verificar que passa

## 5. Specs de fluxos financeiros (com sessão salva)

- [x] 5.1 Criar Page Objects dos formulários de despesa e receita em `e2e/pages/`; verificar que são usados por pelo menos dois specs
- [x] 5.2 Criar `e2e/despesas.spec.ts` com criar, editar e excluir despesa; verificar que passa
- [x] 5.3 Criar `e2e/receitas.spec.ts` com criar receita e vê-la na lista; verificar que passa
- [x] 5.4 Criar `e2e/lancamentos.spec.ts` verificando o agrupamento de lançamentos conforme a regra de `lib/lancamentos/group`; verificar que passa
- [x] 5.5 Criar `e2e/resumo.spec.ts` verificando que os totais refletem receita e despesa criadas na competência atual; verificar que passa

## 6. Estabilidade e documentação

- [x] 6.1 Rodar a suíte completa 3 vezes seguidas no mesmo banco (`npx playwright test --repeat-each=3`) e verificar que não há falhas nem flakiness
- [x] 6.2 Provocar uma falha proposital e verificar que o trace é retido em `test-results/` e o relatório em `playwright-report/`; reverter a falha
- [x] 6.3 Documentar no `CLAUDE.md` como subir a stack, rodar `test:e2e`/`test:e2e:ui`, o uso de `E2E_BASE_URL` e a limitação de `NEXT_PUBLIC_API_URL` no build; verificar a seção revisando o texto
- [x] 6.4 Registrar no `CLAUDE.md` (ou no design) o follow-up de CI (`e2e.yml` em PRs, checkout cruzado dos repos e versionamento do compose)
