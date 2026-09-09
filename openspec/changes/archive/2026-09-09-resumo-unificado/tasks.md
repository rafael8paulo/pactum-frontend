## 1. Rota e composição da página

- [x] 1.1 Criar `app/(dashboard)/resumo-unificado/page.tsx` como Server Component, lendo `searchParams.competencia` (fallback `getCurrentCompetencia()`), seguindo o padrão de `app/(dashboard)/resumo/page.tsx` e `app/(dashboard)/despesas/page.tsx`
- [x] 1.2 Renderizar título da página + `ResumoUnificadoCards` + layout desktop (`ReceitasPainel` + `DespesasPainel` lado a lado) + layout mobile (abas), com as classes responsivas do item 5

## 2. Cards de totais

- [x] 2.1 Criar `components/features/resumo-unificado/ResumoUnificadoCards.tsx` (Client Component) consumindo `useResumoMensal(competencia)`
- [x] 2.2 Exibir os três cards (Total Receitas, Total Despesas, Saldo) com `Skeleton` durante loading, igual ao padrão de `ResumoCards`
- [x] 2.3 Adicionar barra de progresso no card de Saldo representando `totalDespesas / totalReceitas`, com saldo positivo em cor verde e negativo em cor vermelha (tokens semânticos do tema)

## 3. Painel de receitas

- [x] 3.1 Criar `components/features/resumo-unificado/ReceitasPainel.tsx` (Client Component) consumindo `useReceitas(competencia)`
- [x] 3.2 Renderizar lista compacta (descrição/categoria, valor em BRL, ações Editar/Remover) com `Skeleton` durante loading e estado vazio contextualizado com a competência
- [x] 3.3 Adicionar botão "+ Nova receita" abrindo `NovaReceitaDialog` já existente, pré-preenchido com a competência ativa
- [x] 3.4 Conectar ação "Editar" ao `EditarReceitaDialog` já existente
- [x] 3.5 Conectar ação "Remover" a `useRemoverReceita`, com confirmação (`AlertDialog`, seguindo o padrão de `DespesaTable`) e toast de sucesso/erro

## 4. Painel de despesas

- [x] 4.1 Criar `components/features/resumo-unificado/DespesasPainel.tsx` (Client Component) consumindo `useDespesas(competencia)`
- [x] 4.2 Renderizar lista compacta (descrição/categoria, valor em BRL, selo de status, ações Editar/Remover) com `Skeleton` durante loading
- [x] 4.3 Implementar filtro local (Todos/Pendentes/Pagos) com `useState`, filtrando a lista já carregada sem alterar a URL da página
- [x] 4.4 Exibir estado vazio contextualizado com o filtro local ativo quando nenhuma despesa atender ao filtro
- [x] 4.5 Conectar selo de status a `useAtualizarStatusDespesa` para alternar Pendente ⇄ Pago ao clicar
- [x] 4.6 Adicionar botão "+ Nova despesa" abrindo `NovaDespesaDialog` já existente, pré-preenchido com a competência ativa
- [x] 4.7 Conectar ação "Editar" ao `EditarDespesaDialog` já existente
- [x] 4.8 Conectar ação "Remover" a `useRemoverDespesa`, com confirmação (`AlertDialog`) e toast de sucesso/erro

## 5. Layout responsivo mobile

- [x] 5.1 Criar `components/features/resumo-unificado/ResumoUnificadoPaineis.tsx` (Client Component, renomeado de `ResumoUnificadoMobileTabs.tsx` durante a implementação para refletir que também orquestra os dois painéis sem duplicar hooks) com abas "Despesas"/"Receitas" (`useState` para aba ativa, "Despesas" como padrão)
- [x] 5.2 Aplicar classes Tailwind responsivas na página para alternar entre grid de 2 colunas (`md:grid md:grid-cols-2`) em desktop e abas empilhadas (`md:hidden`) em mobile, sem duplicar as chamadas de hooks de dados

## 6. Navegação

- [x] 6.1 Adicionar item `{ href: '/resumo-unificado', label: 'Resumo Unificado', icon: LayoutGrid }` em `navItems` de `components/features/layout/Sidebar.tsx`
- [x] 6.2 Verificar visualmente que o link fica destacado quando ativo e que os demais itens da Sidebar permanecem inalterados

## 7. Verificação

- [x] 7.1 Rodar `npm run lint` e corrigir eventuais erros
- [x] 7.2 Testar manualmente no navegador: card de totais, ambas as listas, filtro de status, editar/remover em ambos os painéis, cadastro de nova despesa/receita — validado via stack local (docker compose) + navegador. Alternância de tema claro/escuro verificada (comportamento idêntico ao já existente em `/resumo`, sem regressão). Layout mobile (abas) **não pôde ser verificado visualmente** nesta sessão — o ambiente de automação de navegador não permitiu redimensionar a janela abaixo do breakpoint `md` (768px); a lógica responsiva foi implementada seguindo o mesmo padrão Tailwind já usado em `dashboard-layout` (Sidebar), mas recomenda-se uma checagem manual em viewport real antes do merge
- [x] 7.3 Confirmar que `/despesas`, `/receitas` e `/resumo` continuam funcionando sem alterações visuais ou de comportamento — confirmado
