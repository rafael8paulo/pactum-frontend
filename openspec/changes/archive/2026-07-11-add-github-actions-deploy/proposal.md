## Why

Hoje o build/publicação da imagem Docker da pactum-web (ver `add-docker-standalone-build`) é manual — alguém precisa rodar `docker build`/`docker push`/SSH na VPS localmente. Isso é lento, sujeito a erro humano (esquecer o `--build-arg` correto, publicar de uma branch errada) e não deixa rastro de auditoria. Automatizar o pipeline via GitHub Actions garante que todo push em `main` gere uma imagem versionada, publicada no GHCR, e deployada de forma consistente na VPS.

## What Changes

- Criar `.github/workflows/deploy.yml`, disparado em `push` para `main`, com os jobs/steps:
  - Checkout do código.
  - `npm ci` para instalar dependências.
  - `npm run lint` como gate de qualidade — o workflow falha e não publica se o lint falhar.
  - Build da imagem Docker (usando o `Dockerfile` já existente de `add-docker-standalone-build`), passando `NEXT_PUBLIC_API_URL` como build-arg, lida de uma **repository variable** (`vars.NEXT_PUBLIC_API_URL`) — não de um secret, pois é uma URL pública que já fica embutida no bundle JS entregue ao navegador.
  - Login e push da imagem no GitHub Container Registry (GHCR), com duas tags: `latest` e `${{ github.sha }}`.
  - Deploy via SSH numa VPS: conectar com `SSH_PRIVATE_KEY`/`VPS_HOST`/`VPS_USER`/`VPS_SSH_PORT` e rodar `docker compose pull pactum-frontend && docker compose up -d --wait pactum-frontend`.
- **BREAKING** (para o processo, não para a aplicação): o processo de deploy passa a ser exclusivamente via push em `main` — deploys manuais ad-hoc deixam de ser o caminho padrão.

## Capabilities

### New Capabilities
- `ci-deploy`: pipeline de CI/CD via GitHub Actions que builda, publica no GHCR e deploya automaticamente a pactum-web em uma VPS a cada push em `main`.

### Modified Capabilities
- `docker-build`: nenhuma mudança nos *requirements* da capability (o Dockerfile e o `output: 'standalone'` continuam os mesmos); esta mudança apenas consome esses artefatos dentro do pipeline, sem alterar seu comportamento. Não é necessário um delta spec.

## Impact

- **Código afetado**: novo arquivo `.github/workflows/deploy.yml`. Nenhuma mudança em código de aplicação.
- **Segredos/config necessários no GitHub** (fora do escopo desta implementação, mas devem ser configurados pelo usuário no repositório):
  - Secrets: `SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_PORT`.
  - Repository variable (não secret): `NEXT_PUBLIC_API_URL`.
  - Permissão de escrita em `packages` (GHCR) para o `GITHUB_TOKEN` do workflow.
- **Infraestrutura assumida como pré-existente na VPS**: um `docker-compose.yml` já configurado lá com um serviço chamado `pactum-frontend` apontando para a imagem do GHCR — este pipeline não cria nem gerencia esse arquivo, apenas dispara `docker compose pull`/`up` remotamente via SSH.
- **Sem impacto** em rotas, componentes, hooks, contratos de API ou no `Dockerfile`/`next.config.ts` já existentes.
