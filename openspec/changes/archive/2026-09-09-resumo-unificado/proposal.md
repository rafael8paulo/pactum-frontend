## Why

Hoje despesas e receitas do mês vivem em duas telas separadas (`/despesas` e `/receitas`), obrigando o usuário a navegar entre elas para ter uma visão consolidada do mês. Um mockup de referência (`Pactum-Tela-Unificada.html`) já valida um layout que junta os totais e as duas listas numa única tela, com filtros de status e ações de editar/remover lado a lado. Esta mudança implementa essa tela como uma **nova opção de navegação**, sem alterar ou substituir `/despesas`, `/receitas` ou o dashboard `/resumo` existente.

## What Changes

- Nova página `/resumo-unificado` que combina:
  - Três cards de totais do mês (Total Receitas, Total Despesas, Saldo com barra de progresso indicando % comprometido), reaproveitando `useResumoMensal` (já usado em `/resumo`).
  - Duas listas lado a lado (desktop): **Receitas** à esquerda e **Despesas** à direita, reaproveitando `useReceitas`/`useDespesas`.
  - Lista de Despesas com filtro por status (Todos/Pendentes/Pagos) e toggle de status por linha (Pendente ⇄ Pago), reaproveitando `useAtualizarStatusDespesa`.
  - Ações de Editar/Remover em cada linha de ambas as listas, reaproveitando os dialogs e hooks de mutation já existentes (`EditarDespesaDialog`, `EditarReceitaDialog`, `useRemoverDespesa`, `useRemoverReceita`).
  - Botões "+ Nova receita" e "+ Nova despesa" que abrem os dialogs já existentes (`NovaReceitaDialog`, `NovaDespesaDialog`).
  - Em mobile: card único de saldo do mês + abas Despesas/Receitas com uma lista compacta e botões fixos "+ Despesa" / "+ Receita".
- Novo item **"Resumo Unificado"** na Sidebar (`components/features/layout/Sidebar.tsx`), apontando para `/resumo-unificado`, coexistindo com o item "Resumo" já existente.
- Nenhuma alteração em `/despesas`, `/receitas`, `/resumo`, nos endpoints da API ou nos hooks/dialogs reutilizados — a nova tela é puramente composicional sobre a infraestrutura já existente.

## Capabilities

### New Capabilities
- `resumo-unificado-ui`: página `/resumo-unificado` que compõe totais mensais e as listas de despesas/receitas lado a lado (desktop) ou em abas (mobile), reaproveitando dados e componentes de `despesas-crud`, `receitas-crud` e `dashboard-resumo` sem duplicar lógica de API.

### Modified Capabilities
- `dashboard-layout`: adiciona o item "Resumo Unificado" à lista de links de navegação da Sidebar (requisito "Sidebar exibe links de navegação").

## Impact

- Novo arquivo de rota: `app/(dashboard)/resumo-unificado/page.tsx`.
- Novos componentes em `components/features/resumo-unificado/` (ex.: `ResumoUnificadoCards.tsx`, `ReceitasPainel.tsx`, `DespesasPainel.tsx`, `ResumoUnificadoMobile.tsx`), consumindo hooks já existentes — nenhum novo hook ou client de API é necessário.
- `components/features/layout/Sidebar.tsx`: novo item em `navItems`.
- Sem impacto em backend, sem migrations, sem novos endpoints.
