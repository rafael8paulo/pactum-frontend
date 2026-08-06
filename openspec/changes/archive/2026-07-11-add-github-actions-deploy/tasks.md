## 1. Estrutura do workflow

- [x] 1.1 Criar `.github/workflows/deploy.yml` com `name`, `on: push: branches: [main]` e `permissions: contents: read, packages: write`
- [x] 1.2 Definir job único `build-and-deploy` rodando em `ubuntu-latest`, com `timeout-minutes` explícito

## 2. Lint gate

- [x] 2.1 Adicionar step de checkout (`actions/checkout@v4`)
- [x] 2.2 Adicionar step de setup do Node (`actions/setup-node@v4`, versão alinhada ao `engines`/CI local)
- [x] 2.3 Adicionar step `npm ci`
- [x] 2.4 Adicionar step `npm run lint`

## 3. Build e push da imagem no GHCR

- [x] 3.1 Adicionar step `docker/setup-buildx-action@v3`
- [x] 3.2 Adicionar step `docker/login-action@v3` com `registry: ghcr.io`, `username: ${{ github.actor }}`, `password: ${{ secrets.GITHUB_TOKEN }}`
- [x] 3.3 Adicionar step `docker/build-push-action@v6` com `push: true`, `build-args: NEXT_PUBLIC_API_URL=${{ vars.NEXT_PUBLIC_API_URL }}` e `tags:` incluindo `ghcr.io/${{ github.repository }}:latest` e `ghcr.io/${{ github.repository }}:${{ github.sha }}`

## 4. Deploy via SSH na VPS

- [x] 4.1 Adicionar step `appleboy/ssh-action@v1` com `host: ${{ secrets.VPS_HOST }}`, `username: ${{ secrets.VPS_USER }}`, `key: ${{ secrets.SSH_PRIVATE_KEY }}`, `port: ${{ secrets.VPS_SSH_PORT }}`
- [x] 4.2 Configurar o `script:` do step de deploy para rodar `docker compose pull pactum-frontend && docker compose up -d --wait pactum-frontend`
- [x] 4.3 Garantir que o step de deploy só executa se os steps de build/push tiverem sido bem-sucedidos (ordem sequencial padrão do job, sem `continue-on-error`)

## 5. Validação

- [x] 5.1 Validar sintaticamente o YAML (`actionlint` ou equivalente, se disponível) antes de commitar
- [x] 5.2 Documentar no CLAUDE.md (seção de Docker/Deploy) os secrets (`SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_PORT`) e a repository variable (`NEXT_PUBLIC_API_URL`) que precisam ser configurados no GitHub para o workflow funcionar
- [ ] 5.3 Fazer um push de teste em `main` (ou disparo manual, se `workflow_dispatch` for adicionado) e confirmar visualmente na aba Actions que lint, build/push e deploy completam com sucesso
