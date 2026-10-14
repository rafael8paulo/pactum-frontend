## Why

O backend (change irmão `metas-economia-mensal` em `pactum-api`) passa a oferecer metas mensais de economia com progresso, projeção, status e histórico. O frontend precisa expor isso de forma interativa e motivadora — definir a meta, ver o ritmo necessário, receber feedback e celebrar marcos — transformando o controle financeiro em uma experiência orientada a objetivos.

## What Changes

- Novo **card "Meta de economia"** na tela `/inicio` (competência selecionada): sem meta mostra CTA "Definir meta"; com meta mostra barra de progresso, valor economizado / meta, valor restante, dias restantes, valor diário necessário, projeção de fechamento e mensagem contextual conforme o `status`.
- Nova página **`/mais/metas-economia`** com: formulário para definir/ajustar a meta da competência (campo monetário com máscara existente), remoção da meta, detalhe do progresso e **histórico de desempenho** do ano (lista/gráfico de barras meta × economizado por mês, indicador de meta atingida e comparação com o mês anterior).
- **Mensagens contextualizadas** (adiantado / no planejado / em risco / concluída) geradas no cliente a partir do `status` e dos valores retornados.
- **Gamificação**: ao detectar novos `marcosAtingidos` (25/50/75/100%), exibe toast/celebração uma única vez por marco e competência (controle em `localStorage`, tolerante à indisponibilidade do storage).
- Entrada de navegação em `MaisHub` para a nova página.
- Competências passadas: card/página em modo somente leitura (sem editar nem remover), alinhado à regra do backend.

Fora de escopo: notificações push/e-mail, metas por categoria, repetição automática de meta para o mês seguinte, animações elaboradas (confete) além de toast e destaque visual.

## Capabilities

### New Capabilities
- `metas-economia-mensal-ui`: card de meta na tela inicial, página de gestão e histórico de metas, feedback contextual e celebração de marcos.

### Modified Capabilities
<!-- Nenhuma capability existente muda de requisito; `dashboard-resumo` apenas recebe um novo card sem alterar seus requisitos. -->

## Impact

- **Componentes novos**: `components/features/metas-economia/` (`MetaEconomiaCard`, `MetaEconomiaForm`, `MetaProgressoBar`, `MetaFeedbackMessage`, `HistoricoMetasChart`, `MarcoCelebracao`).
- **Hooks/API**: `hooks/useMetasEconomia.ts` (queries `progresso` e `historico`, mutations `definir` e `remover`, invalidando `['metas-economia']` e `['resumo']`), `lib/api/metas-economia.ts`, `types/meta-economia.ts`.
- **Rotas**: `app/(dashboard)/mais/metas-economia/page.tsx`; `app/(dashboard)/inicio/page.tsx` ganha o card; `MaisHub.tsx` ganha um item.
- **Dependência**: assume o change `metas-economia-mensal` de `pactum-api` implantado (endpoints `/api/v1/metas-economia/*`, `404` quando não há meta).
