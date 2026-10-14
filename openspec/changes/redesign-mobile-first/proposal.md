## Why

A Pactum é hoje um dashboard desktop renderizado em tela pequena: a navegação inteira vive atrás de um hambúrguer (2 toques para qualquer seção), as listagens são `<Table>` de 5 colunas em 390px, a competência só avança de mês em mês por setas (8 toques de setembro a janeiro) e o campo `competencia` é um `<Input placeholder="AAAA-MM">` digitado à mão no teclado do celular. Como o acesso predominante é por smartphone, cada uma dessas decisões cobra pedágio em toda sessão. Os layouts mobile já foram gerados e aprovados; este change transforma esse design em contrato de implementação.

## What Changes

- **Shell responsivo**: abaixo de `md` (768px) o dashboard passa a usar tab bar fixa de 4 abas (Início, Lançamentos, Recorrentes, Mais) com FAB central de criação; a partir de `md` a `Sidebar` + `Header` atuais permanecem inalterados. Nenhuma regressão para quem usa desktop.
- **BREAKING — reorganização de rotas** com `redirect()` permanente das antigas:
  - `/resumo` e `/resumo-unificado` → `/inicio` (a duplicação de rótulo desaparece)
  - `/despesas` e `/receitas` → `/lancamentos?tipo=despesa|receita`
  - `/patrimonio` → `/mais/patrimonio`; `/formas-pagamento` → `/mais/formas-pagamento`
  - `/contas-recorrentes` → `/recorrentes`
- **Listagem sem tabela em mobile**: `DespesaTable`/`ReceitaTable` ganham apresentação de lista (`TxRow`, 62px) agrupada, com chips de filtro contadores no lugar dos dois `Select`, busca client-side e sheet de detalhe. A `<Table>` ordenável continua sendo a apresentação de desktop.
- **Swipe → "Marcar paga"**: a ação mais frequente cai de 3 toques (abrir dropdown, rolar, selecionar) para 1 gesto, com equivalente explícito no sheet de detalhe.
- **Criação em bottom sheet, valor primeiro**: teclado numérico imediato, categoria em chips, status em segmented e **`competencia` derivada do contexto — o campo digitado à mão é removido do fluxo mobile**. Inclui "Salvar e adicionar outro".
- **Seletor de competência em sheet**: grade de 12 meses + navegação de ano + atalhos. De 8 toques para 1.
- **Feedback**: `PageLoader` sai das listagens e dá lugar a skeletons que preservam o layout; toasts de mutação ganham ação **Desfazer**; novo estado offline com dados em cache marcados como tal.
- **Onboarding**: checklist de 3 passos derivado do estado real das queries, exibido em `/inicio` enquanto a conta está vazia.
- **Sair** deixa o `Header` (onde fica colado no toggle de tema) e passa a viver isolado em `/mais`, com `AlertDialog` de confirmação.

**Fora de escopo desta iteração:** notificações push/e-mail; PWA installable/service worker (só o cache de query é persistido); redesign das telas de desktop; qualquer alteração no `pactum-api` — as lacunas de contrato estão listadas em Impact como dependências externas com fallback definido.

## Capabilities

### New Capabilities
- `mobile-app-shell`: shell mobile abaixo de `md` — tab bar de 4 abas com indicação de aba ativa, FAB central, header compacto, safe areas, hub `/mais`, e o baseline de acessibilidade (alvos ≥44px, contraste AA, foco visível, `prefers-reduced-motion`) aplicável a toda a experiência mobile.
- `lancamentos-unificados-ui`: rota `/lancamentos` com segmented Despesas/Receitas sincronizado à URL, lista agrupada com subtotais, chips de filtro com contador, busca client-side, swipe para alterar status e sheet de detalhe com ações de editar/excluir separadas.
- `lancamento-quick-add`: bottom sheet único de criação de despesa ou receita, com valor como primeiro campo, competência derivada do contexto, categoria em chips e "Salvar e adicionar outro".
- `competencia-picker-sheet`: seleção de competência por grade de 12 meses, navegação de ano e atalhos, em bottom sheet, mantendo `?competencia=YYYY-MM` como fonte de verdade.
- `onboarding-primeiro-acesso`: checklist de configuração inicial de 3 passos com progresso, derivado do estado das queries existentes, e empty states acionáveis por rota.
- `offline-resilience-ui`: banner de conexão, persistência do cache do TanStack Query, rotulagem de dados servidos do cache e estado de erro com ação única de recuperação.

### Modified Capabilities
- `dashboard-layout`: o shell passa a ter duas apresentações por breakpoint; a Sidebar deixa de ser o único meio de navegação em mobile; o `MonthPicker` ganha a apresentação em sheet; o botão Sair sai do `Header` em mobile.
- `despesas-crud`: listagem, alteração de status, edição e remoção ganham apresentação e fluxo mobile; o formulário mobile deixa de expor o campo `competencia` como texto livre.
- `receitas-crud`: listagem e formulário passam a compartilhar a apresentação mobile de `/lancamentos` e o quick-add.
- `dashboard-resumo`: a página passa a ser `/inicio`, os três cards viram um bloco de saldo único e o gráfico anual passa a ter uma variante mobile sem Recharts.
- `resumo-unificado-ui`: **BREAKING** — `/resumo-unificado` deixa de existir como rota própria e é absorvida por `/inicio`.
- `patrimonio-gestao`: rota movida para `/mais/patrimonio` e total passa a ser exibido com composição percentual por item.
- `gestao-contas-recorrentes-ui`: rota movida para `/recorrentes`; a ação de gerar lançamentos deixa de ser um botão genérico e passa a nomear mês e valor.
- `global-feedback`: toasts de mutação reversível ganham ação Desfazer; skeletons passam a ser obrigatórios nas listagens em lugar do loader de página inteira.
- `page-loader`: `PageLoader` deixa de ser aceitável em listagens e fica restrito a bloqueios de rota inteira.
- `login-screen` e `cadastro-screen`: o destino pós-autenticação passa de `/resumo` para `/inicio`.

## Impact

- **Rotas** (`app/(dashboard)/`): novas `inicio/`, `lancamentos/`, `recorrentes/`, `mais/`, `mais/patrimonio/`, `mais/formas-pagamento/`; as seis rotas antigas viram arquivos de `redirect()`. `app/page.tsx` passa a apontar para `/inicio`.
- **Layout**: `app/(dashboard)/layout.tsx` passa a compor `<MobileShell>` ou `<DesktopShell>`; novos `components/features/layout/MobileTabBar.tsx`, `MobileHeader.tsx`, `CreateFab.tsx`, `MonthSheet.tsx`; `Sidebar.tsx` e `Header.tsx` preservados para desktop.
- **Componentes de feature**: `DespesaTable`/`ReceitaTable` passam a delegar para `TxList`/`TxRow` abaixo de `md`; novos `components/features/lancamentos/*` (`TxRow`, `TxList`, `TxDetailSheet`, `QuickAddSheet`, `FilterChips`, `SegmentedControl`); `NovaDespesaDialog`/`NovaReceitaDialog` permanecem para desktop.
- **Hooks**: novos `hooks/useMediaQuery.ts`, `hooks/useLancamentos.ts` (merge client-side de despesas + receitas), `hooks/useOnboardingStatus.ts`, `hooks/useOnlineStatus.ts`; `useAtualizarStatusDespesa` ganha rollback otimista para viabilizar o Desfazer.
- **Dependências novas**: `vaul` (bottom sheets com drag-to-dismiss — `Dialog` do Radix não cobre), `@radix-ui/react-tabs` (segmented control acessível), `react-swipeable` (gesto de swipe), `@tanstack/react-query-persist-client` + `@tanstack/query-sync-storage-persister` (cache offline). Fontes via `next/font/google` (Inter + Plus Jakarta Sans), sem dependência adicional.
- **Auth**: `providers/auth-provider.tsx` muda os destinos de `login()`/`cadastro()` para `/inicio`; o interceptor 401 de `lib/api/client.ts` passa a preservar a rota pretendida e a não redirecionar quando a falha for de rede. Modelo de sessão (cookie `withCredentials` + `GET /auth/me`) permanece igual.
- **Dependências externas (`pactum-api`) — bloqueiam funcionalidade, não a entrega**: o agrupamento por dia e os avisos de vencimento assumem um campo de data em `Despesa`/`Receita`, que hoje só têm `competencia` (`YYYY-MM`); e a exibição de forma de pagamento por lançamento assume `formaPagamentoId` em `Despesa`. Enquanto não existirem, a UI usa os fallbacks definidos nos specs (agrupar por status e resolver a forma de pagamento apenas via `contaRecorrenteId`).
