## Why

O Sprint 1 entregou a fundação do projeto (tipos, API clients, layout, feedback global), mas a página de despesas é um placeholder vazio. O Sprint 2 implementa o CRUD completo de despesas — a feature central da aplicação — tornando o produto utilizável pela primeira vez.

## What Changes

- Implementar `hooks/useDespesas.ts` com queries e mutations para o domínio de despesas
- Criar `DespesaTable` com listagem paginada, skeleton de loading e estado vazio
- Criar `NovaDespesaDialog` com formulário validado (react-hook-form + zod) para cadastrar despesas
- Criar `EditarDespesaDialog` com formulário pré-preenchido para editar despesas existentes
- Adicionar ação de remoção com confirmação via `AlertDialog`
- Adicionar ação de alteração de status diretamente na tabela (PENDENTE → PAGA etc.)
- Implementar painel de filtros por `status` e `categoria` integrado à URL
- Compor a página `app/(dashboard)/despesas/page.tsx` com todos os componentes acima

## Capabilities

### New Capabilities

- `despesas-crud`: CRUD completo de despesas — listar com filtros, cadastrar, editar, alterar status e remover

### Modified Capabilities

- `typescript-types`: Nenhuma alteração de requisito — tipos já estão definidos no Sprint 1

## Impact

- **Arquivos novos**: `hooks/useDespesas.ts`, `components/features/despesas/DespesaTable.tsx`, `components/features/despesas/DespesaForm.tsx`, `components/features/despesas/NovaDespesaDialog.tsx`, `components/features/despesas/EditarDespesaDialog.tsx`
- **Arquivos alterados**: `app/(dashboard)/despesas/page.tsx` (substituir placeholder pelo layout real)
- **Dependências**: `lib/api/despesas.ts` e `types/despesa.ts` já existem do Sprint 1; nenhuma nova dependência de pacote necessária
- **shadcn components**: `select`, `input`, `label`, `form` podem precisar ser adicionados via CLI se não presentes
