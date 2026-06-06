## Context

O Sprint 1 entregou toda a infraestrutura: tipos TypeScript, API clients, layout com Sidebar/Header/MonthPicker e sistema de feedback global (toast + skeleton). A página `app/(dashboard)/despesas/page.tsx` é um placeholder. Os arquivos `types/despesa.ts` e `lib/api/despesas.ts` já existem e contêm todos os endpoints necessários.

O CRUD de despesas é a feature mais complexa do MVP — serve de template para o padrão que será replicado em Receitas e Patrimônio.

## Goals / Non-Goals

**Goals:**
- Implementar listagem de despesas com filtros por `status` e `categoria` sincronizados com a URL
- Implementar formulário de criação e edição com validação via zod
- Implementar remoção com AlertDialog de confirmação
- Implementar alteração de status inline na tabela
- Manter a competência selecionada via `?competencia=YYYY-MM` (já gerenciada pelo MonthPicker)

**Non-Goals:**
- Paginação server-side (a API retorna todas as despesas do mês, volume é gerenciável)
- Ordenação server-side (ordenação local não é escopo deste sprint)
- Bulk delete ou bulk status update
- Upload de comprovantes

## Decisions

### 1. Formulário compartilhado entre criação e edição

`DespesaForm` é um componente de formulário puro (sem Dialog) que recebe `defaultValues?: Partial<DespesaFormValues>`. Tanto `NovaDespesaDialog` quanto `EditarDespesaDialog` o instanciam internamente. Isso evita duplicação de schema zod e lógica de validação.

**Alternativa descartada**: dois formulários separados — duplicação de código sem benefício.

### 2. Estado de filtros na URL (searchParams)

Filtros `status` e `categoria` são persistidos como query params (`?status=PAGA&categoria=LAZER`) usando `useSearchParams` e `useRouter`. Isso garante que o estado seja compartilhável via URL e sobreviva a reloads.

**Alternativa descartada**: `useState` local — não compartilhável e reiniciado no reload.

### 3. Query key inclui filtros ativos

`queryKey: ['despesas', competencia, { status, categoria }]` — garante cache separado por combinação de filtros, invalidação granular correta e zero conflito entre listas filtradas diferentes abertas em abas distintas.

### 4. Alteração de status inline na tabela

Um `Select` (ou dropdown simples) na coluna Status da tabela chama `despesaApi.atualizarStatus` diretamente via mutation. Feedback via toast de sucesso/erro. A query é invalidada após o sucesso.

**Alternativa descartada**: exigir abertura do modal de edição apenas para alterar status — UX ruim para a operação mais frequente.

### 5. Remoção com AlertDialog

O botão "Remover" abre um `AlertDialog` de confirmação antes de chamar `despesaApi.remover`. Evita remoções acidentais.

## Risks / Trade-offs

- **Stale data após mutação concorrente** → mitigado por `invalidateQueries(['despesas'])` após cada mutation bem-sucedida
- **shadcn components ausentes** (`select`, `input`, `label`, `form`, `alert-dialog`) → verificar com `npx shadcn@latest add` antes de implementar; já incluídos como tarefa inicial do sprint
- **Competência não definida na URL** → `MonthPicker` já garante fallback para o mês corrente; o hook usará o valor do searchParam diretamente
