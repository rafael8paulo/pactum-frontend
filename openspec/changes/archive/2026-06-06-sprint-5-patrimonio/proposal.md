## Why

Com receitas, despesas e o dashboard implementados, o único domínio ainda como placeholder é o patrimônio. Completar este sprint fecha o MVP do Pactum Web: todas as quatro seções do layout estarão funcionais.

## What Changes

- Criar `hooks/usePatrimonio.ts` com queries e mutations para o domínio de patrimônio
- Criar `components/features/patrimonio/PatrimonioCard.tsx` — card individual para cada item
- Criar `components/features/patrimonio/PatrimonioTotal.tsx` — card destacado com o valor total do patrimônio
- Criar `components/features/patrimonio/NovoPatrimonioDialog.tsx` — dialog de cadastro de novo item
- Substituir placeholder em `app/(dashboard)/patrimonio/page.tsx` com layout real

Diferenças importantes em relação aos outros domínios:
- A API **não tem** endpoint `atualizar` — sem dialog de edição
- Sem campo `categoria` ou `status` — formulário com apenas `descricao`, `valor` e `competencia`
- `listar` retorna `Patrimonio[]` diretamente (sem wrapper `{ items, total }`)
- UI orientada a cards, não a tabela (conforme CLAUDE.md: `PatrimonioCard`, `PatrimonioTotal`)

## Capabilities

### New Capabilities

- `patrimonio-gestao`: Gestão de itens de patrimônio — listar, cadastrar e remover, com card de total

### Modified Capabilities

## Impact

- Novos arquivos: `hooks/usePatrimonio.ts`, `components/features/patrimonio/*.tsx`
- Arquivo modificado: `app/(dashboard)/patrimonio/page.tsx`
- Lê de: `types/patrimonio.ts` (já existe), `lib/api/patrimonio.ts` (já existe)
- Sem novas dependências — shadcn components necessários (card, alert-dialog) já instalados
