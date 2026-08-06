## ADDED Requirements

### Requirement: Workflow disparado em push para main
O repositório SHALL conter um workflow do GitHub Actions em `.github/workflows/deploy.yml`, disparado automaticamente em todo `push` para a branch `main`.

#### Scenario: Push em main dispara o workflow
- **WHEN** um commit é enviado (push) para a branch `main`
- **THEN** o workflow `deploy.yml` é executado automaticamente

#### Scenario: Push em outra branch não dispara o workflow
- **WHEN** um commit é enviado para uma branch diferente de `main`
- **THEN** o workflow `deploy.yml` NÃO é executado

### Requirement: Gate de lint antes do build
O workflow SHALL instalar as dependências com `npm ci` e executar `npm run lint` antes de iniciar o build da imagem Docker. Se o lint falhar, o workflow SHALL interromper a execução sem prosseguir para build, push ou deploy.

#### Scenario: Lint falha
- **WHEN** `npm run lint` retorna um código de saída diferente de zero
- **THEN** o workflow falha e nenhuma imagem é construída, publicada ou deployada

#### Scenario: Lint passa
- **WHEN** `npm run lint` é executado com sucesso
- **THEN** o workflow prossegue para a etapa de build da imagem Docker

### Requirement: Build da imagem com NEXT_PUBLIC_API_URL via repository variable
O workflow SHALL construir a imagem Docker usando o `Dockerfile` do repositório, passando `NEXT_PUBLIC_API_URL` como build-arg cujo valor vem de uma repository variable (`vars.NEXT_PUBLIC_API_URL`), não de um secret.

#### Scenario: Build recebe a URL pública via variable
- **WHEN** o step de build da imagem é executado
- **THEN** o valor de `vars.NEXT_PUBLIC_API_URL` é passado como `--build-arg NEXT_PUBLIC_API_URL=<valor>` para o `docker build`

### Requirement: Publicação da imagem no GHCR com tags latest e SHA
Após o build bem-sucedido, o workflow SHALL publicar a imagem no GitHub Container Registry (GHCR), com duas tags: `latest` e o SHA do commit que disparou o workflow (`${{ github.sha }}`).

#### Scenario: Imagem publicada com as duas tags
- **WHEN** o build da imagem é concluído com sucesso
- **THEN** a imagem é enviada ao GHCR marcada tanto como `latest` quanto como o SHA do commit atual

### Requirement: Deploy remoto via SSH na VPS
Após a publicação da imagem, o workflow SHALL conectar via SSH à VPS de destino usando os secrets `SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER` e `VPS_SSH_PORT`, e executar `docker compose pull pactum-frontend && docker compose up -d --wait pactum-frontend` para atualizar o serviço em execução.

#### Scenario: Deploy executado após push bem-sucedido da imagem
- **WHEN** a imagem foi publicada com sucesso no GHCR
- **THEN** o workflow conecta via SSH na VPS usando os secrets configurados e executa `docker compose pull pactum-frontend && docker compose up -d --wait pactum-frontend`

#### Scenario: Deploy não ocorre se o push da imagem falhar
- **WHEN** a etapa de build ou push da imagem falha
- **THEN** o workflow SHALL NOT tentar conectar via SSH ou executar comandos de deploy na VPS
