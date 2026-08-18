## Why

Todo campo "Valor (R$)" do app hoje é um `<input type="number">` puro: o usuário digita números soltos (ex.: `123.45` com ponto, teclado numérico sem separador de milhar) e não há nenhuma ajuda visual de que está digitando um valor em reais enquanto digita. Isso diverge do padrão de qualquer app financeiro brasileiro, onde o campo formata o valor como moeda (`R$ 1.234,56`) em tempo real conforme o usuário digita.

## What Changes

- Criar um componente de input com máscara de moeda (`R$ 0,00`, formato brasileiro: ponto como separador de milhar, vírgula como decimal) que formata o valor em tempo real enquanto o usuário digita, sem exigir que ele digite vírgula/ponto manualmente — o padrão usual é "digitar os centavos primeiro" (ex.: digitar `12345` vira `R$ 123,45`).
- Aplicar esse componente em todos os campos "Valor" do app:
  - Nova/Editar Despesa (`DespesaForm`)
  - Nova/Editar Receita (`ReceitaForm`)
  - Novo item de Patrimônio (`PatrimonioForm`)
  - Nova/Editar Conta Recorrente (`ContaRecorrenteForm`, campo `valorPadrao`)
- O valor manipulado pelo react-hook-form/zod continua sendo um `number` puro (em reais, com centavos) — a máscara é só de exibição/digitação, sem alterar os schemas de validação existentes (`z.number().positive(...)`) nem os payloads enviados à API.
- Nenhuma dependência nova: a máscara é implementada com lógica própria (acumulação de dígitos), sem lib de terceiros.

## Capabilities

### New Capabilities
- `currency-input-mask`: componente reutilizável de input com máscara de moeda BRL, usado por qualquer formulário que precise capturar um valor monetário.

### Modified Capabilities
- `despesas-crud`: os requisitos "Cadastrar nova despesa" e "Editar despesa existente" passam a especificar que o campo Valor usa a máscara de moeda.
- `receitas-crud`: os requisitos "Cadastrar nova receita" e "Editar receita existente" passam a especificar o mesmo.
- `patrimonio-gestao`: o requisito "Cadastrar novo item de patrimônio" passa a especificar o mesmo.
- `gestao-contas-recorrentes-ui`: os requisitos "Cadastrar conta recorrente" e "Editar conta recorrente" passam a especificar o mesmo para o campo Valor Padrão.

## Impact

- Novo componente `components/ui/currency-input.tsx` (ou local equivalente em `components/features/shared/`).
- `components/features/despesas/DespesaForm.tsx`, `components/features/receitas/ReceitaForm.tsx`, `components/features/patrimonio/PatrimonioForm.tsx`, `components/features/contas-recorrentes/ContaRecorrenteForm.tsx`: campo Valor passa a usar o novo componente no lugar do `<Input type="number">` inline.
- Nenhuma mudança de schema zod, nenhuma mudança de API/backend, nenhuma dependência nova de `package.json`.
