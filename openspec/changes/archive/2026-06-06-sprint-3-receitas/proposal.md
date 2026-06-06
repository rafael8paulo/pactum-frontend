## Why

O Sprint 2 entregou o CRUD completo de despesas, estabelecendo o padrão end-to-end da aplicação. O Sprint 3 aplica esse padrão ao domínio de receitas, completando o ciclo de gestão do fluxo de caixa mensal (entradas + saídas) que o dashboard de resumo precisa para exibir dados significativos.

## What Changes

- Criar `hooks/useReceitas.ts` com queries e mutations para o domínio de receitas
- Criar `components/features/receitas/ReceitaForm.tsx` — formulário compartilhado (criação e edição)
- Criar `components/features/receitas/NovaReceitaDialog.tsx` — dialog de cadastro
- Criar `components/features/receitas/EditarReceitaDialog.tsx` — dialog de edição
- Criar `components/features/receitas/ReceitaTable.tsx` — tabela com ações inline
- Substituir placeholder em `app/(dashboard)/receitas/page.tsx` com layout real

Diferenças em relação ao CRUD de despesas:
- Receitas **não têm** campo `status` → sem alteração de status inline e sem filtros por status
- A API de receitas não expõe filtros → sem painel de filtros na página
- Categorias simplificadas: `SALARIO`, `FREELANCE`, `INVESTIMENTO`, `OUTROS`

## Capabilities

### New Capabilities

- `receitas-crud`: CRUD completo de receitas mensais — listar, cadastrar, editar e remover

### Modified Capabilities

## Impact

- Novos arquivos: `hooks/useReceitas.ts`, `components/features/receitas/*.tsx`
- Arquivo modificado: `app/(dashboard)/receitas/page.tsx`
- Lê de: `types/receita.ts` (tipos já existentes), `lib/api/receitas.ts` (client já existente)
- Sem novas dependências de pacotes — reutiliza shadcn components já instalados (form, input, select, table, dialog, alert-dialog)
