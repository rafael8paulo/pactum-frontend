# Spec: docker-build

## Purpose

Build e empacotamento em produção da aplicação Next.js via imagem Docker multi-stage, com output standalone, build-arg para `NEXT_PUBLIC_API_URL` embutido em build-time e contexto de build otimizado.

---

## Requirements

### Requirement: Next.js standalone output
O `next.config.ts` SHALL declarar `output: 'standalone'`, fazendo com que `next build` gere um servidor Node autocontido em `.next/standalone`, incluindo apenas as dependências de runtime necessárias.

#### Scenario: Build gera saída standalone
- **WHEN** `npm run build` é executado
- **THEN** o diretório `.next/standalone` é criado contendo `server.js` e as dependências mínimas necessárias para rodar a aplicação sem `node_modules` completo

### Requirement: Dockerfile multi-stage de produção
O repositório SHALL conter um `Dockerfile` na raiz com três estágios nomeados — `deps`, `build` e `runner` — usando `node:20-alpine` como imagem base em todos os estágios, produzindo uma imagem final mínima capaz de rodar a aplicação Next.js em produção.

#### Scenario: Build da imagem completa com sucesso
- **WHEN** `docker build -t pactum-web .` é executado a partir da raiz do projeto
- **THEN** a imagem é construída com sucesso, passando pelos estágios `deps`, `build` e `runner`, sem copiar `node_modules` completo para a imagem final

#### Scenario: Container final roda como usuário não-root
- **WHEN** o container é iniciado a partir da imagem final (`docker run pactum-web`)
- **THEN** o processo Node roda sob um usuário não-root dedicado, não como `root`

### Requirement: NEXT_PUBLIC_API_URL embutida em build-time via build-arg
O estágio `build` do Dockerfile SHALL aceitar `NEXT_PUBLIC_API_URL` como `ARG` e reexportá-la como `ENV` antes de executar `next build`, garantindo que o valor seja embutido no bundle client gerado. Definir `NEXT_PUBLIC_API_URL` apenas como variável de ambiente do container em runtime NÃO SHALL ser suficiente para alterar o valor usado pelo código client-side já buildado.

#### Scenario: Build-arg é embutido corretamente no bundle
- **WHEN** a imagem é construída com `docker build --build-arg NEXT_PUBLIC_API_URL=https://api.exemplo.com -t pactum-web .`
- **THEN** o bundle JavaScript client gerado dentro da imagem contém `https://api.exemplo.com` como URL base das chamadas de API

#### Scenario: Variável de ambiente em runtime não altera a URL já buildada
- **WHEN** o container é iniciado com `docker run -e NEXT_PUBLIC_API_URL=https://outra-api.exemplo.com pactum-web`
- **THEN** o código client-side continua usando a URL definida em build-time (`--build-arg`), ignorando a variável de ambiente de runtime

### Requirement: Contexto de build otimizado via .dockerignore
O repositório SHALL conter um arquivo `.dockerignore` na raiz excluindo `node_modules`, `.next`, `.git` e arquivos `.env*` do contexto enviado ao Docker daemon.

#### Scenario: Build não envia arquivos sensíveis ou desnecessários
- **WHEN** `docker build` é executado
- **THEN** `node_modules`, `.next`, `.git` e arquivos `.env*` locais não fazem parte do contexto de build enviado ao daemon
