## Context

A pactum-web é uma aplicação Next.js 15 (App Router) sem nenhum artefato de containerização hoje. O único ponto de configuração de ambiente é `NEXT_PUBLIC_API_URL` (ver `lib/api/client.ts` e `.env.local`), consumida em código client-side. O Next.js injeta variáveis prefixadas com `NEXT_PUBLIC_` diretamente no bundle JS durante `next build` — elas não podem ser trocadas depois, alterá-las exige um novo build. Isso é a principal restrição de design: **a URL da API do backend (pactum-api) precisa ser conhecida no momento da construção da imagem Docker**, não apenas no momento em que o container roda.

## Goals / Non-Goals

**Goals:**
- Produzir uma imagem Docker de produção pequena e reprodutível para a pactum-web.
- Garantir que `NEXT_PUBLIC_API_URL` seja corretamente embutida no bundle client via build-arg do Docker.
- Usar o modo `output: 'standalone'` do Next.js para eliminar a necessidade de `node_modules` completo na imagem final.
- Rodar a imagem final como usuário não-root, minimizando superfície de ataque.

**Non-Goals:**
- Orquestração multi-container (docker-compose com a pactum-api, banco de dados, etc.) — fica para uma mudança futura, se necessário.
- CI/CD (pipeline de build/push automático da imagem) — fora de escopo aqui.
- Suporte a variáveis `NEXT_PUBLIC_*` adicionais além de `NEXT_PUBLIC_API_URL` (hoje só existe essa; se surgirem outras, seguem o mesmo padrão).

## Decisions

### 1. `output: 'standalone'` no `next.config.ts`
Alternativa considerada: manter build padrão e copiar `node_modules` inteiro para a imagem final. Rejeitada por gerar imagens bem maiores e builds mais lentos. `standalone` faz o Next.js fazer tree-shaking das dependências de runtime e gerar um `server.js` autocontido em `.next/standalone`, que é o padrão recomendado pela documentação oficial do Next.js para Docker.

### 2. Dockerfile multi-stage: `deps` → `build` → `runner`
- **deps**: só instala dependências (`npm ci`) — estágio cacheável independentemente do código-fonte mudar, acelerando rebuilds.
- **build**: copia `node_modules` de `deps`, copia o código-fonte, recebe `ARG NEXT_PUBLIC_API_URL` e re-exporta como `ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL` antes de `npm run build`. Isso é o ponto crítico: sem o `ENV`, o valor do `ARG` não fica visível para o processo `next build`, que roda em runtime de build já sem acesso a `ARG`s não exportadas como `ENV` no mesmo estágio.
- **runner**: imagem final baseada em `node:20-alpine`, copia apenas `.next/standalone`, `.next/static` (para `.next/standalone/.next/static`) e `public`. Não reinstala dependências — tudo que é necessário já está em `standalone`.

Alternativa considerada: um único estágio com `next start`. Rejeitada porque exige `node_modules` completo na imagem final e não resolve o problema do build-arg de forma limpa (o build ainda aconteceria em runtime do container final).

### 3. Base image `node:20-alpine` em todos os estágios
Alinhado ao LTS ativo do Node (20.x) e ao padrão de menor tamanho de imagem (Alpine). Mesma versão em todos os estágios evita divergência de comportamento entre build e runtime (ex.: diferenças de libc entre glibc/musl).

### 4. `NEXT_PUBLIC_API_URL` como `ARG` + `ENV` só no estágio `build`
Não é definida no estágio `runner` porque não tem efeito ali — o valor já está embutido no JS gerado. Documentar isso explicitamente no Dockerfile (comentário) e no proposal, para evitar que alguém tente "corrigir" a URL apenas passando `-e NEXT_PUBLIC_API_URL=...` no `docker run` (não funciona para código client-side).

### 5. Usuário não-root no estágio `runner`
Cria um usuário `nextjs` (uid/gid fixos, seguindo o exemplo oficial do Next.js) e roda o `CMD` como esse usuário, reduzindo impacto de uma eventual RCE dentro do container.

### 6. `.dockerignore`
Exclui `node_modules`, `.next`, `.git`, `.env*`, arquivos de IDE — reduz o contexto enviado ao daemon Docker e evita vazar segredos locais (`.env.local`) para dentro da imagem.

## Risks / Trade-offs

- **[Risco]** Se `NEXT_PUBLIC_API_URL` não for passada como `--build-arg`, o build usa `ARG` sem default (ou default vazio) e a aplicação final aponta para uma API vazia/incorreta → **Mitigação**: documentar claramente no README/CLAUDE.md e, opcionalmente, definir um valor default no `ARG` que aponte para um placeholder óbvio (ex.: `http://localhost:8080`) para falhar de forma visível em vez de silenciosa.
- **[Risco]** Trocar a URL da API exige rebuild completo da imagem (não só um novo `docker run` com env diferente) → **Mitigação**: é uma limitação inerente ao Next.js com `NEXT_PUBLIC_*`, não deste design; documentar explicitamente para não gerar confusão futura.
- **[Trade-off]** `output: 'standalone'` pode exigir ajustes se o projeto passar a depender de arquivos estáticos fora de `public/` ou de outputs de arquivos (`outputFileTracing`) — não é o caso hoje, mas deve ser revisitado se novas dependências nativas forem adicionadas.

## Migration Plan

1. Adicionar `output: 'standalone'` ao `next.config.ts` e validar localmente com `npm run build` que `.next/standalone/server.js` é gerado.
2. Criar `Dockerfile` e `.dockerignore`.
3. Build local de teste: `docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 -t pactum-web .`
4. Rodar `docker run -p 3000:3000 pactum-web` e validar que a aplicação carrega e faz chamadas para a URL correta (inspecionar bundle/Network tab).
5. Nenhum rollback especial necessário — mudança aditiva (não remove nenhum caminho de execução existente via `npm run dev`/`npm start`).

## Open Questions

- Nenhuma pendente — escopo e comportamento de `NEXT_PUBLIC_API_URL` em build-time já são bem definidos pela documentação do Next.js.
