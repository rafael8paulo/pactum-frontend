## Context

A tela `/contas-recorrentes` já existe (`app/(dashboard)/contas-recorrentes/page.tsx`), com `ContaRecorrenteTable`, `ContaRecorrenteForm`, `ContaRecorrenteFilters`, `NovaContaRecorrenteDialog`, `EditarContaRecorrenteDialog` e `GerarLancamentosButton`, consumindo `lib/api/contas-recorrentes.ts` + `hooks/useContasRecorrentes.ts` + `types/conta-recorrente.ts`. O change irmão em `pactum-api` (`assinaturas-recorrentes`) adiciona `frequencia`, `formaPagamentoId`, `dataBaseCobranca` a `ContaRecorrente`, a entidade `FormaPagamento` (CRUD completo) e os endpoints `GET /contas-recorrentes/resumo`, `GET /contas-recorrentes/proximas-cobrancas` e `GET /contas-recorrentes/{id}/historico-valores`.

Este design segue exatamente o padrão já usado para Despesas/Receitas/Contas Recorrentes (`CLAUDE.md` seção 10): `types/` espelhando os records da API, `lib/api/<dominio>.ts` fino sobre Axios, `hooks/use<Dominio>.ts` com TanStack Query, componentes em `components/features/<dominio>/`.

## Goals / Non-Goals

**Goals:**
- Formulário e tabela de Contas Recorrentes refletindo os novos campos do backend.
- Página dedicada de CRUD de Formas de Pagamento, reaproveitando os mesmos padrões de tabela/dialog/form já usados em Contas Recorrentes.
- Cards de resumo mensal recorrente + breakdown por forma de pagamento, e lista de próximas cobranças, ambos em `/contas-recorrentes`.

**Non-Goals:**
- Notificação proativa (push/e-mail) de cobrança próxima — apenas exibição ao carregar a página.
- Gráfico de série histórica de assinaturas (ex.: evolução do gasto recorrente mês a mês) — fica para uma iteração futura, análogo ao `EvolucaoAnualChart` de Resumo.
- Alterar a tela `/resumo` (dashboard principal) — o resumo de assinaturas fica isolado em `/contas-recorrentes`.

## Decisions

### 1. Resumo e próximas cobranças vivem em `/contas-recorrentes`, não em `/resumo`
O dashboard principal (`/resumo`) já tem um formato fechado (cards de receitas/despesas/saldo + gráfico anual) coberto pela capability `dashboard-resumo`, que este change não deve tocar. Total recorrente e próximas cobranças são específicos do domínio de contas recorrentes, então entram como uma seção no topo de `/contas-recorrentes`, reaproveitando o padrão visual de `ResumoCards` (`components/features/resumo/ResumoCards.tsx`) como referência para os novos `ResumoAssinaturasCards`.
- **Alternativa considerada**: adicionar um card "Assinaturas" em `/resumo`. Rejeitada nesta iteração para não expandir o escopo do dashboard principal; pode ser revisitado depois que a tela de Contas Recorrentes estiver estável.

### 2. Forma de Pagamento é uma página própria (`/formas-pagamento`), não um modal dentro do formulário de Conta Recorrente
Segue o mesmo padrão de primeira classe usado para Despesas/Receitas/Patrimônio: listagem própria, CRUD completo, item na Sidebar. O select de `formaPagamentoId` no `ContaRecorrenteForm` consome a mesma query (`useFormasPagamento`) usada pela página de gestão, sem duplicar lógica de busca.
- **Alternativa considerada**: cadastro rápido de forma de pagamento embutido no dialog de Conta Recorrente ("+ Nova forma de pagamento" inline). Rejeitada para o MVP — mantém o formulário de Conta Recorrente simples; pode ser adicionada depois como atalho de conveniência.

### 3. `frequencia` como `Select` com as 4 opções; `dataBaseCobranca` como date picker nativo
Segue o padrão de campos `Select` já usado para `categoria`/`status` nos formulários existentes (shadcn `Select` + `zod` enum). `dataBaseCobranca` usa `<input type="date">` (mesmo padrão simples já usado, se houver, para `competenciaInicio`/`competenciaFim`; caso esses campos usem outro componente de mês, `dataBaseCobranca` usa o date picker padrão do shadcn por exigir dia exato, diferente de `competenciaInicio` que é apenas mês/ano).

### 4. `proximaCobranca` e totais chegam prontos da API — sem cálculo no frontend
A API já expõe `proximaCobranca` (calculada) em cada `ContaRecorrente` do backend e os totais em `/contas-recorrentes/resumo`. O frontend apenas formata (data relativa tipo "em 3 dias", moeda BRL) e não reimplementa a lógica de frequência — evita duplicar a regra de negócio já coberta pelo backend.

### 5. Ação "Gerar tudo" por linha fica oculta para contas `SEMANAL`
Como o backend nunca gera despesa para `frequencia = SEMANAL` (ver `gerar-lancamentos-recorrentes` do change de backend), a ação "Gerar tudo" por linha (`gerar-lote-lancamentos-recorrentes-ui`, hoje condicionada apenas a `status = ATIVA`) passa a também considerar a frequência, evitando uma chamada que sempre retorna lista vazia — mesmo tratamento hoje dado a `PAUSADA`/`ENCERRADA` (ação não exibida). O botão global "Gerar lançamentos de {competência}" (`gerar-lancamentos-recorrentes-ui`) não muda: ele já opera sobre todas as contas elegíveis da competência de uma vez, e simplesmente não produzirá despesa para as `SEMANAL`.

## Risks / Trade-offs

- [Página nova `/formas-pagamento` aumenta a Sidebar] → Aceitável — seguindo o padrão já estabelecido de uma entidade por item de navegação; se a Sidebar ficar longa, agrupamento fica para uma iteração de UX futura.
- [Resumo de assinaturas duplica visualmente o padrão de `ResumoCards` sem compartilhar componente] → Aceitável para o MVP; extrair um componente `KpiCard` genérico compartilhado é uma refatoração possível, mas fora do escopo deste change (evitar abstração prematura).
- [Dependência direta do change de backend `assinaturas-recorrentes`] → Este change não pode ser testado ponta-a-ponta antes do backend estar implantado; os hooks/tipos são escritos contra o contrato descrito no `design.md`/`specs/` do change de backend e devem ser validados contra a API real assim que disponível.
