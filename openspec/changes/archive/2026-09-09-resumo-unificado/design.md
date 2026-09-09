## Context

O mockup `Pactum-Tela-Unificada.html` define duas variantes de uma tela que junta despesas e receitas do mês: uma versão desktop com cards de totais + duas listas lado a lado, e uma versão mobile com um card de saldo + abas Despesas/Receitas. A tela precisa consumir dados e ações (editar, remover, alternar status, cadastrar) que já existem em `despesas-crud`, `receitas-crud` e `dashboard-resumo` — nenhuma dessas capabilities muda de comportamento, apenas ganham um novo ponto de consumo.

O projeto segue convenções fixas de `pactum-frontend/CLAUDE.md`: Server Component para `page.tsx` lendo `searchParams`, Client Components para qualquer parte interativa, TanStack Query via hooks de `hooks/`, nunca `fetch` direto, dialogs shadcn para formulários.

## Goals / Non-Goals

**Goals:**
- Nova rota `/resumo-unificado` com layout desktop (cards + duas listas lado a lado) e layout mobile (card de saldo + abas), replicando a estrutura visual do mockup adaptada ao design system shadcn/Tailwind já usado no projeto.
- Reaproveitar 100% dos hooks e dialogs já existentes (`useResumoMensal`, `useDespesas`, `useReceitas`, `useAtualizarStatusDespesa`, `useRemoverDespesa`, `useRemoverReceita`, `NovaDespesaDialog`, `EditarDespesaDialog`, `NovaReceitaDialog`, `EditarReceitaDialog`) — zero duplicação de lógica de API.
- Novo item de navegação na Sidebar, sem remover ou reordenar os itens existentes.

**Non-Goals:**
- Não alterar `/despesas`, `/receitas`, `/resumo`, nem seus componentes (`DespesaTable`, `ReceitaTable`, `ResumoCards`, `EvolucaoAnualChart`).
- Não criar novos endpoints, DTOs ou hooks de API — apenas composição de UI sobre dados já buscados por hooks existentes.
- Não implementar o gráfico de evolução mensal do mockup mobile (`months`/`saldoPoints` do script de exemplo) — fora do escopo pedido pelo usuário, que citou apenas totais + as duas listas.
- Não replicar a paleta de cores hardcoded do mockup (`#080b14`, `#3fcf8e` etc.) — a tela usa as variáveis de tema shadcn (`bg-card`, `text-primary`, cores semânticas já configuradas em `dashboard-layout`), preservando suporte a dark/light mode via `next-themes`.

## Decisions

### 1. Componentes novos e compactos, não reuso direto de `DespesaTable`/`ReceitaTable`
`DespesaTable` e `ReceitaTable` são tabelas completas (ordenação por coluna, larguras pensadas para tela cheia). O layout lado a lado do mockup usa linhas compactas (descrição + categoria / valor / pill de status / ações). Criar `DespesasPainel.tsx` e `ReceitasPainel.tsx` em `components/features/resumo-unificado/`, reaproveitando os **hooks e dialogs** das tabelas existentes, mas com marcação própria (lista compacta, não `<Table>`), evitando forçar um layout de tabela larga em duas colunas de 50%.
- Alternativa considerada: usar `DespesaTable`/`ReceitaTable` diretamente lado a lado — rejeitada porque a largura fixa de colunas dessas tabelas não cabe bem em 50% da viewport e replicaria a página `/despesas` dentro da nova tela, contrariando o pedido de um layout "resumido".

### 2. Filtro de status (Todos/Pendentes/Pagos) como estado local do painel, não sincronizado na URL
A página `/despesas` já usa `?status=` na URL com os valores da API (`PAGA`, `PENDENTE`, `AGENDADA`) via `DespesaFilters`. O painel de despesas da tela unificada é um widget secundário dentro de uma página maior; sincronizar outro filtro de status na mesma URL colidiria semanticamente com o filtro da página `/despesas` (mesmo nome de param, escopos diferentes). O filtro do painel usa `useState` local no client component, resetado ao navegar para outra competência.
- Alternativa considerada: usar um param dedicado (ex.: `?painelStatus=`) — rejeitada por adicionar complexidade de URL sem benefício percebido (não há caso de uso para compartilhar/bookmarkar esse filtro específico).

### 3. Abas mobile (Despesas/Receitas) como estado local, com breakpoint via Tailwind
Uma única árvore de componentes é renderizada; o layout desktop (grid 2 colunas) e mobile (abas empilhadas) alternam via classes responsivas Tailwind (`hidden md:grid` / `md:hidden`), evitando duplicar chamadas aos hooks de dados em dois componentes separados. O estado da aba ativa (`mtab: 'despesas' | 'receitas'`) fica em `useState` no componente de layout mobile.
- Alternativa considerada: duas páginas/rotas distintas para mobile e desktop — rejeitada, foge do padrão Next.js responsivo já usado no restante do projeto (`dashboard-layout` já resolve responsividade via CSS, não via rotas).

### 4. Cards de totais reaproveitam `useResumoMensal`, não somam as listas no cliente
`GET /api/v1/resumo?competencia=YYYY-MM` já retorna `totalReceitas`, `totalDespesas` e `saldo` prontos (usado por `ResumoCards` em `/resumo`). Usar o mesmo hook evita recalcular somas no cliente a partir de `useDespesas`/`useReceitas` (que poderiam paginar ou ter total diferente de soma de valores) e mantém a fonte de verdade única para totais mensais.

### 5. Nome de capability e rota
Capability nova: `resumo-unificado-ui`. Rota: `/resumo-unificado`. Optou-se por não reaproveitar o nome `resumo` (já ocupado pelo dashboard existente) nem usar um nome que sugira substituição (ex.: `/resumo-v2`), reforçando que é uma tela adicional e não uma migração.

## Risks / Trade-offs

- [Risco] Manter dois pontos de UI (`/despesas`, `/receitas` e o painel da tela unificada) que fazem toggle de status / remoção pode gerar inconsistência visual se um dia as regras de negócio dessas ações mudarem em um lugar e não no outro → Mitigação: ambos os pontos chamam os **mesmos hooks** (`useAtualizarStatusDespesa`, `useRemoverDespesa`, `useRemoverReceita`), então qualquer mudança de regra (ex.: confirmação antes de remover) propaga automaticamente para os dois lugares.
- [Risco] Painel compacto de despesas exibe todos os lançamentos do mês sem paginação (igual ao mockup, que assume poucos lançamentos) — em competências com muitos lançamentos a lista pode ficar longa dentro de um card → Mitigação: aplicar `max-height` com scroll interno no painel (`overflow-y-auto`), sem alterar o comportamento de "carregar tudo" que a API já tem hoje em `/despesas`.
- [Trade-off] Novo item de navegação aumenta a Sidebar para 7 links — aceitável no momento porque o usuário pediu explicitamente uma nova opção coexistindo com as demais; reorganização da navegação fica fora do escopo desta mudança.

## Migration Plan

Mudança puramente aditiva (nova rota + novo item de navegação): não requer migração de dados, feature flag ou rollback especial — remover a rota e o item da Sidebar é suficiente caso seja necessário reverter.

## Open Questions

- Nenhuma pendente para implementação — layout, dados e componentes a reaproveitar já estão mapeados a partir do código existente.
