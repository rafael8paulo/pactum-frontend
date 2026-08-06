## Context

`pactum-frontend` (Next.js 15 App Router, React 19, TanStack Query v5, react-hook-form + zod, shadcn/ui) já tem um padrão consolidado para telas de CRUD por competência: página server component lê `searchParams`, delega para componentes client (`XTable`, `XFilters`, `NovaXDialog`, `EditarXDialog`), hooks em `hooks/useX.ts` encapsulam `useQuery`/`useMutation` com invalidação de cache e toast (`sonner`), e um `MonthPicker` global no `Header` controla a competência ativa via query param `?competencia=` compartilhado entre páginas (visto em `/despesas`, `/receitas`, `/patrimonio`). Este design segue exatamente esse padrão para `/contas-recorrentes`, sem introduzir mecanismos novos.

## Goals / Non-Goals

**Goals:**
- Tela de contas recorrentes com a mesma UX (tabela, dialogs, filtros) já validada em `/despesas`.
- Ação de "gerar lançamentos do mês" clara e com feedback direto (quantas despesas foram criadas).
- Reaproveitar o `MonthPicker` global existente em vez de criar um seletor de mês próprio da página.

**Non-Goals:**
- Qualquer lógica de geração automática/background — a UI só oferece o botão que chama o endpoint manual da API.
- Exibir despesas geradas dentro da própria página de contas recorrentes (o usuário navega para `/despesas` para ver o resultado, que já reflete a competência ativa via `MonthPicker` compartilhado).
- Edição em lote ou duplicação de contas recorrentes.

## Decisions

### 1. Reaproveitar `MonthPicker` global em vez de um seletor de mês local
A competência já é um estado global compartilhado via query param e exibido no `Header`. Adicionar um segundo seletor de mês dentro da página de contas recorrentes duplicaria estado e confundiria o usuário sobre qual competência está "ativa". O botão "Gerar lançamentos do mês" usa a competência lida do `MonthPicker` (mesmo `searchParams.get('competencia')` que as outras páginas já leem).

**Alternativa considerada:** input de mês dedicado dentro do formulário de geração, permitindo gerar para uma competência diferente da exibida no Header. Rejeitada por inconsistência de UX e porque não há caso de uso claro nesta entrega (gerar retroativo/futuro pode ser feito navegando o `MonthPicker` antes de clicar no botão).

### 2. Contas recorrentes não têm filtro por competência, só por status
Diferente de despesas/receitas (que existem *dentro* de uma competência), uma `ContaRecorrente` é um cadastro atemporal (com janela de vigência opcional) — faz sentido listar todas de uma vez, com filtro por `status` (`ATIVA`/`PAUSADA`/`ENCERRADA`), sem depender do `MonthPicker` para a listagem em si (só para a ação de gerar).

### 3. Botão "Gerar lançamentos" mostra resultado via toast, sem redirecionar
Ao clicar, a mutation chama `POST /contas-recorrentes/gerar?competencia=...`; no sucesso, exibe toast com a contagem (`"3 lançamentos gerados para agosto/2026"` ou `"Nenhum lançamento novo — já gerado para este mês"` quando a lista vier vazia) e invalida a query `['despesas']` (mesmo `queryKey` usado por `hooks/useDespesas.ts`) para que, se o usuário navegar para `/despesas`, os dados já estejam frescos sem precisar de refresh manual.

### 4. `contaRecorrenteId` em `Despesa` é apenas tipado, não exibido nesta entrega
O campo é adicionado ao tipo `Despesa` para manter paridade com o contrato da API e permitir uso futuro (ex: badge "gerado automaticamente" na tabela de despesas), mas esta entrega não altera `DespesaTable` — evita acoplar as duas mudanças além do necessário.

## Risks / Trade-offs

- **[Risco]** Usuário clica em "Gerar lançamentos" acreditando que isso vai gerar para todos os meses pendentes retroativos, mas o endpoint só cobre a competência informada → **Mitigação**: copy do botão e do toast deixa explícito o mês-alvo (usa o mesmo texto formatado do `MonthPicker`, ex: "Gerar lançamentos de agosto/2026").
- **[Trade-off]** Sem seletor de mês próprio na página, gerar para um mês diferente do exibido no Header exige navegar o `MonthPicker` primeiro — aceito pela decisão 1, mantém uma única fonte de verdade para "competência ativa".

## Migration Plan

Sem impacto em dados existentes (feature nova, sem alterar fluxo de despesas/receitas). Depende apenas de a `pactum-api` já ter os endpoints `/api/v1/contas-recorrentes*` no ar antes do deploy do front-end; caso contrário as chamadas retornam 404. Recomenda-se implantar a mudança da API primeiro.

## Open Questions

Nenhuma pendente.
