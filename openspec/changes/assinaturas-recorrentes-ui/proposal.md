## Why

O usuário não tem, hoje, visibilidade de quanto suas assinaturas/gastos recorrentes comprometem por mês nem de qual cartão/conta cada cobrança vai cair. O backend (change irmão `assinaturas-recorrentes` em `pactum-api`) está adicionando frequência, forma de pagamento, próxima cobrança, histórico de valores e endpoints de resumo à feature já existente de Contas Recorrentes — este change adapta a tela `/contas-recorrentes` e adiciona a gestão de formas de pagamento no frontend.

## What Changes

- Formulário de cadastro/edição de conta recorrente (`ContaRecorrenteForm`) ganha os campos `frequencia` (semanal/mensal/trimestral/anual), `formaPagamentoId` (select, opcional) e `dataBaseCobranca` (date picker).
- Tabela de contas recorrentes ganha colunas de Frequência, Forma de Pagamento e Próxima Cobrança, e uma ação para ver o histórico de valores de uma conta.
- Nova página `/formas-pagamento` com CRUD (listar, cadastrar, editar, remover) de formas de pagamento (cartão/conta), com item correspondente na `Sidebar`.
- Nova seção de resumo no topo de `/contas-recorrentes`: cards com o total mensal recorrente comprometido e um breakdown por forma de pagamento, consumindo `GET /api/v1/contas-recorrentes/resumo`.
- Novo aviso de "próximas cobranças" em `/contas-recorrentes`, listando assinaturas com cobrança prevista nos próximos dias, consumindo `GET /api/v1/contas-recorrentes/proximas-cobrancas`.

**Fora de escopo desta iteração:**
- Notificação push/e-mail — o aviso de próximas cobranças é exibido apenas ao visitar a página (sem notificação proativa).
- Exibir frequência `SEMANAL` no fluxo de "gerar despesas" — essa frequência não participa da geração de despesas (ver design do change de backend); a UI apenas oculta/desabilita as ações de geração para contas semanais.

## Capabilities

### New Capabilities
- `gestao-formas-pagamento-ui`: página `/formas-pagamento` com listagem, cadastro, edição e remoção de formas de pagamento (cartão/conta), e item de navegação na Sidebar.
- `resumo-assinaturas-ui`: cards de total mensal recorrente e breakdown por forma de pagamento, e lista de próximas cobranças, exibidos em `/contas-recorrentes`.

### Modified Capabilities
- `gestao-contas-recorrentes-ui`: formulário e tabela passam a incluir `frequencia`, `formaPagamentoId` e `proximaCobranca`; nova ação para consultar o histórico de valores de uma conta.
- `gerar-lote-lancamentos-recorrentes-ui`: a ação "Gerar tudo" passa a ficar oculta também para contas com `frequencia = SEMANAL`, já que o backend nunca gera despesa para essa frequência.

## Impact

- **Componentes**: `components/features/contas-recorrentes/ContaRecorrenteForm.tsx` e `ContaRecorrenteTable.tsx` (edição); novos `components/features/formas-pagamento/*` (Table, Form, dialogs); novos `components/features/contas-recorrentes/ResumoAssinaturasCards.tsx`, `AssinaturasPorFormaPagamentoChart.tsx`, `ProximasCobrancasBanner.tsx`, `HistoricoValorDialog.tsx`.
- **Hooks/API**: novo `hooks/useFormasPagamento.ts` + `lib/api/formas-pagamento.ts` + `types/forma-pagamento.ts`; `hooks/useContasRecorrentes.ts` e `types/conta-recorrente.ts` ganham os campos novos e novas queries (`resumo`, `proximas-cobrancas`, `historico-valores`).
- **Rotas**: nova rota `app/(dashboard)/formas-pagamento/page.tsx`; `Sidebar` ganha novo item.
- **Dependência**: assume que o change `assinaturas-recorrentes` do `pactum-api` está implantado com os endpoints e payloads descritos em seu `design.md`/`specs/`.
