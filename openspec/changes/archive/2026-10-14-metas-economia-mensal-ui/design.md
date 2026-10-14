## Context

O frontend é Next.js 15 (App Router) com TanStack Query, axios (`lib/api/client.ts`), react-hook-form + zod, sonner e Recharts. A tela `/inicio` já compõe `SaldoHero`/`ResumoCards`/`EvolucaoResponsiva` recebendo `competencia` por search param; páginas secundárias vivem em `/mais/*` via `MaisHub`. Padrões existentes: um módulo `lib/api/*`, um hook `hooks/use*.ts` por domínio, tipos em `types/*`, máscara de moeda (`currency-input-mask`), extração de erro (`api-error-extraction`) e botões com loading (`form-submit-loading`). Motivação: ver `proposal.md`; contrato da API: change `metas-economia-mensal` em `pactum-api`.

## Goals / Non-Goals

**Goals:**
- Reutilizar padrões de hooks, formulário, loading e feedback já existentes.
- Isolar regras de apresentação (mensagens, marcos, formatação de ritmo) em funções puras testáveis.
- Card compacto reutilizável na home e na página dedicada.

**Non-Goals:**
- Recalcular progresso/projeção no cliente (a API é a fonte da verdade).
- Persistir celebrações no servidor.

## Decisions

1. **Duas superfícies**: card resumido em `/inicio` + página `/mais/metas-economia` para gestão e histórico. Alternativa descartada: tudo em `/inicio` — sobrecarregaria a home mobile-first. O card reaproveita `MetaProgressoBar` e `MetaFeedbackMessage` da página.

2. **`404` como estado "sem meta", não erro.** O hook `useProgressoMeta(competencia)` captura erro axios 404 e retorna `null` (com `retry: false` nesse caso) em vez de entrar em `isError`. Alternativa: pedir à API 200 com `null`; rejeitada para manter o contrato já especificado no backend.

3. **Query keys**: `['metas-economia', 'progresso', competencia]` e `['metas-economia', 'historico', ano]`. Mutations invalidam `['metas-economia']`. Como o progresso depende de receitas/despesas, mutations de receitas/despesas existentes também passam a invalidar `['metas-economia']` (ajuste mínimo nos hooks `useReceitas`/`useDespesas`) para o card não ficar desatualizado.

4. **Celebração de marcos no cliente**: chave `pactum:marcos:{competencia}` em `localStorage` com array de marcos celebrados; efeito dispara toast para `marcosAtingidos − celebrados`, em ordem crescente, e persiste. Todo acesso embrulhado em try/catch (storage pode estar indisponível). Alternativa descartada: persistir no backend — complexidade sem valor de negócio.

5. **Mensagens no cliente** em `lib/metas-economia/mensagens.ts` (função pura `mensagemPorStatus(progresso)`), cobrindo os quatro `status`; facilita testes unitários e ajuste de copy.

6. **Somente leitura para meses passados**: calculado comparando `competencia` com `getCurrentCompetencia()`; a UI oculta ações, mas o backend continua sendo a barreira real (400).

7. **Gráfico**: Recharts `BarChart` agrupado (meta × economizado) seguindo o padrão de `EvolucaoAnualChart`, com versão compacta em mobile (lista com mini-barras) como em `EvolucaoResponsiva`.

## Risks / Trade-offs

- [Card na home dispara requisição extra a cada troca de competência] → `staleTime` curto reutilizando o padrão de `useResumo`; sem custo relevante.
- [Toast de marco pode disparar ao abrir em outro dispositivo/navegador] → aceito; é só reforço positivo.
- [Dependência do backend em produção] → implantar API primeiro; sem o endpoint o card cai em estado de erro isolado, sem quebrar a home (error boundary local do card).
- [Mensagens de projeção podem soar alarmistas no começo do mês (limitação da projeção linear)] → copy neutra no `EM_RISCO` focada em "ritmo necessário", não em fracasso.
