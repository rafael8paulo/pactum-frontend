## Context

`DespesaTable.tsx` e `ReceitaTable.tsx` são componentes `'use client'` que recebem os dados já carregados via TanStack Query (`useDespesas`/`useReceitas`) e fazem `.map()` direto sobre o array para renderizar linhas de uma tabela shadcn/ui (`Table`/`TableHeader`/`TableRow`/`TableCell`). Não existe TanStack Table no projeto — apenas `@tanstack/react-query`. Não há nenhum precedente de ordenação, paginação ou estado de UI derivado nessas tabelas hoje; o único estado local existente é `loadingId`/`statusLoadingId` para ações inline.

A API sempre retorna a lista completa da competência de uma vez (`ListaDespesasResponse { despesas, total }`, `total` não é usado para paginação), então não há necessidade de mandar parâmetros de ordenação para o backend — ordenar client-side é suficiente e barato (listas mensais, não milhares de linhas).

## Goals / Non-Goals

**Goals:**
- Permitir ordenar `DespesaTable` e `ReceitaTable` clicando no cabeçalho de qualquer coluna ordenável.
- `DespesaTable` deve carregar, por padrão, ordenada por Valor decrescente.
- Indicar visualmente qual coluna está ordenada e em qual direção.
- Extrair a lógica de ordenação para um hook reutilizável, evitando duplicar comparadores entre as duas tabelas.
- Manter a ordenação totalmente client-side, sem tocar a API ou os hooks de fetch (`useDespesas`, `useReceitas`).

**Non-Goals:**
- Ordenação persistida entre sessões (localStorage) ou sincronizada com a URL — fora do pedido original; pode ser um follow-up.
- Ordenação/paginação server-side.
- Ordenar `PatrimonioGrid` — é um grid de cards, não uma tabela, fora do escopo desta mudança.
- Ordenação multi-coluna (shift+click) — não pedido; um único critério de ordenação por vez é suficiente.

## Decisions

### 1. Hook reutilizável `useSortableData<T>`, não TanStack Table
Criar `hooks/useSortableData.ts`, um hook genérico que recebe o array de dados e uma config de colunas ordenáveis, e devolve os dados ordenados + estado atual + handler de clique no cabeçalho.

Alternativa considerada: adicionar `@tanstack/react-table`. Rejeitada — introduziria uma dependência nova e um padrão de tabela totalmente diferente do resto do projeto (headless table model) só para resolver ordenação de 2 tabelas pequenas e simples. O ganho não compensa a complexidade nem o desvio da convenção existente (`components/ui/table` + `.map()` direto), que o `CLAUDE.md` do projeto documenta como o padrão a seguir.

```ts
// hooks/useSortableData.ts
type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

function useSortableData<T>(data: T[], initialSort?: SortConfig<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSort ?? null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => compare(a[sortConfig.key], b[sortConfig.key], sortConfig.direction));
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current?.key !== key) return { key, direction: 'asc' };
      if (current.direction === 'asc') return { key, direction: 'desc' };
      return initialSort ?? null; // 3º clique volta ao padrão da tela
    });
  };

  return { sortedData, sortConfig, requestSort };
}
```

`compare()` trata `string` (localeCompare pt-BR) e `number` (subtração) — os dois únicos tipos de valor ordenável nas colunas atuais (Descrição/Categoria/Status são string, Valor é number).

### 2. Ciclo de 3 estados por coluna: asc → desc → padrão da tela
Ao clicar numa coluna diferente da atual, entra em `asc`. Clicar de novo alterna para `desc`. Um terceiro clique retorna ao `initialSort` da tela (Valor desc em Despesas; nenhuma ordenação — ordem da API — em Receitas), em vez de deixar a tabela "sem ordenação" num estado que o usuário não escolheu.

Alternativa considerada: ciclo de apenas 2 estados (asc/desc), sempre preso à última coluna clicada. Rejeitada — não dá ao usuário uma forma de "desfazer" e voltar ao padrão sem recarregar a página.

### 3. Cabeçalho ordenável como componente pequeno compartilhado, não lógica duplicada inline
Criar `components/ui/sortable-table-head.tsx` (ou equivalente em `components/features/shared/`) que envolve `TableHead` com `onClick` + ícone de seta (lucide `ArrowUp`/`ArrowDown`/`ArrowUpDown` neutro quando não é a coluna ativa), recebendo `column`, `label`, `sortConfig`, `onSort` como props. Usado nos cabeçalhos ordenáveis de ambas as tabelas.

Colunas de Status (Despesas) e a coluna de ações (ambas) continuam `TableHead` simples — não plugam no `onSort`.

### 4. Onde mora o `initialSort` de cada tabela
Cada componente de tabela declara seu próprio `initialSort` ao chamar o hook — não é uma config global. `DespesaTable`: `{ key: 'valor', direction: 'desc' }`. `ReceitaTable`: `undefined` (mantém ordem de chegada da API por padrão, só ganha a capacidade de ordenar).

## Risks / Trade-offs

- [Risco] Ordenar client-side sobre listas muito grandes (ex.: competência com centenas de lançamentos) degradaria performance → Mitigação: não é um cenário real hoje (listas mensais, tipicamente dezenas de itens); se crescer, a ordenação pode migrar para server-side reaproveitando os mesmos `params` já usados pelos filtros, sem mudar a UI.
- [Trade-off] Ordenação não sobrevive a um refresh de página (não é persistida) → aceito conscientemente como Non-Goal; comportamento simples e previsível é preferível a introduzir estado na URL para uma primeira versão.
