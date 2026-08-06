## Why

O projeto não possui hoje um caminho de build para produção via container — não há `Dockerfile` nem `output: 'standalone'` configurado no Next.js. Para publicar a pactum-web em qualquer ambiente containerizado (VPS, Kubernetes, ECS, etc.) é preciso um artefato de imagem enxuto e reprodutível. Como o app usa variáveis `NEXT_PUBLIC_API_URL`, que o Next.js embute no bundle **no momento do build** (não em runtime), o Dockerfile precisa resolver isso corretamente via build-arg, ou builds gerados pela imagem apontarão para a URL errada da API em produção.

## What Changes

- Adicionar `output: 'standalone'` ao `next.config.ts`, fazendo o `next build` gerar `.next/standalone` com um servidor Node mínimo e apenas as dependências realmente usadas em runtime.
- Criar um `Dockerfile` multi-stage (`deps` → `build` → `runner`) baseado em `node:20-alpine`:
  - **deps**: instala dependências de produção/dev necessárias para o build (via `npm ci`).
  - **build**: recebe `NEXT_PUBLIC_API_URL` como `ARG` e exporta como `ENV` antes de rodar `next build`, garantindo que o valor seja embutido no bundle estático/client.
  - **runner**: imagem final enxuta, copiando apenas `.next/standalone`, `.next/static` e `public`, rodando como usuário não-root, expondo a porta do Next.js e iniciando via `node server.js`.
- Criar `.dockerignore` para excluir `node_modules`, `.next`, `.git` e afins do contexto de build, reduzindo tempo e tamanho de build.
- Documentar no README/CLAUDE.md (se aplicável) como buildar e rodar a imagem passando `--build-arg NEXT_PUBLIC_API_URL=...`.

## Capabilities

### New Capabilities
- `docker-build`: build e execução da aplicação em container Docker de produção, incluindo o Dockerfile multi-stage e o modo `standalone` do Next.js necessário para suportá-lo.

### Modified Capabilities
(nenhuma — não há specs existentes de build/deploy sendo alteradas)

## Impact

- **Código afetado**: `next.config.ts` (novo campo `output`), novo `Dockerfile`, novo `.dockerignore`.
- **Build/CI**: builds de produção passam a exigir que `NEXT_PUBLIC_API_URL` seja fornecida como `--build-arg` do Docker (não apenas como variável de ambiente do container em runtime).
- **Sem impacto** em rotas, componentes, hooks ou contratos de API existentes — mudança é puramente de infraestrutura de build/deploy.
