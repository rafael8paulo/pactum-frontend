## Why

A `pactum-api` vai ganhar (mudança `contas-recorrentes` no repo `pactum-api`) o modelo `ContaRecorrente` e um endpoint de geração manual de lançamentos, mas isso é inútil sem uma tela para cadastrar as contas recorrentes (financiamento, internet, cartão, streaming) e disparar a geração. O front-end precisa expor esse fluxo para o usuário final.

## What Changes

- Nova página `/contas-recorrentes` com listagem, cadastro, edição, atualização de status (`ATIVA`/`PAUSADA`/`ENCERRADA`) e remoção de contas recorrentes — seguindo o mesmo padrão de tela já usado em `/despesas`.
- Novo item "Contas Recorrentes" na navegação lateral (`Sidebar`).
- Botão "Gerar lançamentos do mês" na página de contas recorrentes, que chama o endpoint de geração para a competência selecionada no `MonthPicker` global (o mesmo seletor de mês já usado em `/despesas`, `/receitas` e `/patrimonio`) e exibe feedback (quantidade de despesas geradas, ou aviso de que já haviam sido geradas).
- Novos tipos TypeScript (`types/conta-recorrente.ts`) e cliente de API (`lib/api/contas-recorrentes.ts`) espelhando o contrato definido na `pactum-api`.
- `types/despesa.ts`: interface `Despesa` ganha campo opcional `contaRecorrenteId` (para exibir/filtrar despesas de origem recorrente, se necessário no futuro; não altera o comportamento atual da tela de despesas).

## Capabilities

### New Capabilities
- `gestao-contas-recorrentes-ui`: página, formulário e tabela de contas recorrentes (CRUD completo) em `/contas-recorrentes`.
- `gerar-lancamentos-recorrentes-ui`: ação de gerar lançamentos do mês a partir da competência selecionada, com feedback de sucesso/estado vazio.

### Modified Capabilities
- `typescript-types`: adiciona os tipos de `ContaRecorrente` e estende `Despesa` com `contaRecorrenteId` opcional.

## Impact

- **Rotas/páginas**: nova `app/(dashboard)/contas-recorrentes/page.tsx`.
- **Componentes**: `components/features/contas-recorrentes/{ContaRecorrenteForm,ContaRecorrenteTable,NovaContaRecorrenteDialog,EditarContaRecorrenteDialog,GerarLancamentosButton}.tsx`.
- **Hooks**: `hooks/useContasRecorrentes.ts` (queries e mutations via TanStack Query, mesmo padrão de `hooks/useDespesas.ts`).
- **API client**: novo `lib/api/contas-recorrentes.ts`; `lib/api/despesas.ts` não muda de contrato.
- **Tipos**: novo `types/conta-recorrente.ts`; `types/despesa.ts` ganha campo opcional.
- **Navegação**: `components/features/layout/Sidebar.tsx` ganha novo item.
- Depende da mudança `contas-recorrentes` já implantada em `pactum-api` (endpoints `/api/v1/contas-recorrentes*`); sem essa API no ar, a tela não funciona.
