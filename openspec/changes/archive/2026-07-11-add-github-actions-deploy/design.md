## Context

A pactum-web já possui um `Dockerfile` multi-stage e `output: 'standalone'` (mudança `add-docker-standalone-build`). O que falta é automatizar: build → push da imagem → deploy remoto, disparado por push em `main`. A VPS de destino já roda (ou rodará) um `docker-compose.yml` próprio com um serviço `pactum-frontend`; este pipeline não gerencia esse arquivo, apenas o aciona via SSH.

Restrição chave, reafirmada da mudança anterior: `NEXT_PUBLIC_API_URL` é embutida no bundle client no momento do `docker build`, então o valor precisa estar disponível como build-arg dentro do job do GitHub Actions — não pode ser injetada só em runtime no `docker compose up` da VPS.

Outra restrição do pedido do usuário: `NEXT_PUBLIC_API_URL` deve vir de uma **repository variable** (`vars`), não de um **secret**, porque é uma URL pública (não é dado sensível) e variáveis são mais simples de auditar/editar que secrets.

## Goals / Non-Goals

**Goals:**
- Workflow único (`.github/workflows/deploy.yml`) cobrindo lint → build/push → deploy, disparado em push para `main`.
- Build da imagem Docker reutilizando o `Dockerfile` existente, com `NEXT_PUBLIC_API_URL` vindo de `vars.NEXT_PUBLIC_API_URL`.
- Publicação no GHCR (`ghcr.io/<owner>/<repo>`) com duas tags: `latest` e o SHA do commit (`${{ github.sha }}`), permitindo rollback determinístico para um SHA específico.
- Deploy remoto via SSH executando `docker compose pull pactum-frontend && docker compose up -d --wait pactum-frontend` na VPS.
- Pipeline falha cedo (lint) antes de gastar tempo com build/push/deploy.

**Non-Goals:**
- Criar ou versionar o `docker-compose.yml` da VPS — é infraestrutura externa a este repositório, assumida como pré-existente.
- Testes automatizados (unit/e2e) no pipeline — não foi pedido e não há suíte de testes configurada no projeto hoje.
- Múltiplos ambientes (staging/produção) ou deploy em outras branches — escopo é só `main` → produção.
- Rollback automático em caso de falha do `docker compose up --wait` — fica documentado como processo manual (usar a tag do SHA anterior).

## Decisions

### 1. Trigger: `on: push: branches: [main]`
Simples e direto ao pedido do usuário. Não usar `pull_request` (evitaria builds redundantes e não deve haver deploy antes do merge).

### 2. Job único vs. múltiplos jobs
Um único job sequencial (`build-and-deploy`) rodando em `ubuntu-latest`, com steps em ordem: checkout → setup-node → `npm ci` → `npm run lint` → build/push da imagem (Docker Buildx + `docker/build-push-action`) → deploy via SSH.
Alternativa considerada: separar em jobs `build` e `deploy` com `needs:`. Rejeitada por simplicidade — não há paralelismo real a ganhar (deploy depende 100% do build/push) e um único job evita overhead de upload/download de artefato entre jobs (a imagem já fica disponível via registry).

### 3. Lint como gate antes do build Docker
`npm ci` + `npm run lint` rodam **fora** do container, direto no runner, antes do `docker build`. Isso evita gastar tempo de build de imagem Docker (mais lento) quando o código já tem erro de lint. O `next build` dentro do Dockerfile já roda `type-check` (via `next build`), então o lint no runner complementa sem duplicar totalmente a validação.

### 4. `NEXT_PUBLIC_API_URL` via repository variable, passada como `build-args`
No step de build, `build-args: NEXT_PUBLIC_API_URL=${{ vars.NEXT_PUBLIC_API_URL }}`. Usar `vars.*` (não `secrets.*`) conforme pedido — é consistente com o fato de a URL acabar public e visível no bundle JS de qualquer forma; tratá-la como secret criaria falsa sensação de proteção.

### 5. Publicação no GHCR com `docker/login-action` + `docker/build-push-action`
- Login: `docker/login-action@v3` com `registry: ghcr.io`, `username: ${{ github.actor }}`, `password: ${{ secrets.GITHUB_TOKEN }}` — usa o token automático do GitHub Actions, sem exigir um PAT adicional.
- O job precisa de `permissions: packages: write` (e `contents: read`) declarado no workflow para que o `GITHUB_TOKEN` tenha permissão de push no GHCR.
- Build/push: `docker/build-push-action@v6` com `push: true`, `tags:` incluindo `ghcr.io/<owner>/<repo>:latest` e `ghcr.io/<owner>/<repo>:${{ github.sha }}`, e `build-args: NEXT_PUBLIC_API_URL=${{ vars.NEXT_PUBLIC_API_URL }}`.
- Alternativa considerada: usar `docker build`/`docker push` via `run:` shell puro. Rejeitada em favor das actions oficiais, que já lidam com Buildx, cache de camadas e metadata de forma mais robusta.

### 6. Deploy via SSH com `appleboy/ssh-action`
Usar a action `appleboy/ssh-action@v1`, configurada com `host: ${{ secrets.VPS_HOST }}`, `username: ${{ secrets.VPS_USER }}`, `key: ${{ secrets.SSH_PRIVATE_KEY }}`, `port: ${{ secrets.VPS_SSH_PORT }}`, executando o `script:`:
```bash
docker compose pull pactum-frontend
docker compose up -d --wait pactum-frontend
```
Alternativa considerada: configurar `ssh-agent` manualmente (`webfactory/ssh-agent`) e rodar `ssh` via shell puro. Rejeitada por exigir mais steps manuais (know_hosts, agent) para o mesmo resultado — `appleboy/ssh-action` já encapsula isso de forma testada e amplamente usada.
Assume-se que o comando `docker compose` (ou script wrapper equivalente) é executado no diretório onde o `docker-compose.yml` da VPS já está localizado (ex.: via `script_stop: true` e um `cd` inicial, se necessário — detalhe de configuração da VPS, fora do escopo deste repo).

### 7. Tags da imagem: `latest` + SHA do commit
`${{ github.sha }}` garante rastreabilidade determinística (permite fixar/rollback para um commit exato); `latest` é o que o `docker-compose.yml` da VPS referencia por padrão no `pull`.

## Risks / Trade-offs

- **[Risco]** Se a VPS não conseguir puxar a imagem recém-publicada (rede, permissão do GHCR privado) o `docker compose pull` falha e o deploy trava → **Mitigação**: garantir que o pacote GHCR esteja com visibilidade adequada (público, ou a VPS autenticada via `docker login ghcr.io` com um token de leitura configurado localmente na VPS — fora do escopo deste workflow, mas deve ser documentado como pré-requisito).
- **[Risco]** `docker compose up -d --wait` pode ficar preso indefinidamente se o healthcheck do serviço nunca fica saudável → **Mitigação**: documentar que o `docker-compose.yml` da VPS deve ter um `healthcheck` razoável com timeout; o step do Actions herda o timeout padrão do job (`ubuntu-latest`, 6h) — considerar adicionar um `timeout-minutes` explícito no job para falhar mais rápido.
- **[Risco]** Vazamento de `SSH_PRIVATE_KEY` em logs → **Mitigação**: usar sempre `secrets.*` (nunca `vars.*`) para credenciais, e confiar no mascaramento automático de secrets do GitHub Actions nos logs.
- **[Trade-off]** Sem ambiente de staging, todo push em `main` vai direto para produção → aceito conforme pedido do usuário; se necessário no futuro, uma branch/environment adicional pode ser introduzida sem mudar a estrutura central do workflow.

## Migration Plan

1. Configurar no repositório GitHub: secrets `SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_PORT`; repository variable `NEXT_PUBLIC_API_URL`.
2. Criar `.github/workflows/deploy.yml` conforme as decisões acima.
3. Validar em um push de teste para `main` (ou via `workflow_dispatch` manual, se adicionado) que: lint passa, imagem é publicada no GHCR com as duas tags, e o step de deploy conecta na VPS com sucesso.
4. Confirmar na VPS que `docker compose ps` mostra o serviço `pactum-frontend` atualizado e saudável após o deploy.
5. Rollback: se um deploy quebrar produção, rodar manualmente na VPS `docker compose pull` apontando a tag do SHA anterior (editar temporariamente a imagem referenciada no `docker-compose.yml` da VPS) e `docker compose up -d --wait pactum-frontend`.

## Open Questions

- Onde exatamente o `docker-compose.yml` da VPS está localizado (para o `cd`/`working-directory` do step SSH) — assumir que existe um caminho fixo conhecido pelo operador da VPS; não bloqueia a criação do workflow, mas deve ser confirmado antes do primeiro deploy real.
- Se o pacote GHCR será público ou privado — se privado, a VPS precisa de um mecanismo de autenticação próprio (`docker login ghcr.io`) já configurado, fora do escopo deste workflow.
