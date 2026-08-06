## 1. Configuração do Next.js

- [x] 1.1 Adicionar `output: 'standalone'` ao `next.config.ts`
- [x] 1.2 Rodar `npm run build` localmente e confirmar que `.next/standalone/server.js` é gerado

## 2. Dockerfile

- [x] 2.1 Criar `.dockerignore` na raiz excluindo `node_modules`, `.next`, `.git`, `.env*` e arquivos de IDE
- [x] 2.2 Criar `Dockerfile` com estágio `deps` (base `node:20-alpine`, `npm ci`)
- [x] 2.3 Adicionar estágio `build`: copiar `node_modules` de `deps`, copiar código-fonte, declarar `ARG NEXT_PUBLIC_API_URL` e `ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL`, rodar `npm run build`
- [x] 2.4 Adicionar estágio `runner`: base `node:20-alpine`, criar usuário/grupo não-root (`nextjs`), copiar `.next/standalone`, `.next/static` e `public` do estágio `build`, expor porta (`3000`) e definir `CMD ["node", "server.js"]`
- [x] 2.5 Garantir que o `CMD`/processo final rode sob o usuário não-root criado (`USER nextjs`)

## 3. Validação

- [x] 3.1 Build local: `docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 -t pactum-web .`
- [x] 3.2 Rodar `docker run -p 3000:3000 pactum-web` e verificar que a aplicação sobe em `http://localhost:3000`
- [x] 3.3 Inspecionar o bundle client (ou aba Network do navegador) e confirmar que as chamadas de API usam a URL passada em `--build-arg`, não uma env de runtime diferente
- [x] 3.4 Confirmar que o container roda como usuário não-root (`docker exec pactum-web whoami` ou equivalente)

## 4. Documentação

- [x] 4.1 Adicionar seção no README (ou CLAUDE.md, seção 6/7) explicando como buildar e rodar a imagem Docker, destacando que `NEXT_PUBLIC_API_URL` deve ser passada via `--build-arg`
