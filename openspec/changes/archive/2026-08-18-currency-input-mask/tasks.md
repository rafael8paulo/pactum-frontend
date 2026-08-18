## 1. Componente CurrencyInput

- [x] 1.1 Criar `components/ui/currency-input.tsx`: componente controlado (`value: number`, `onChange: (value: number) => void`, `onBlur?`, `disabled?`, `placeholder?`, `id?`, `name?`) que mantém o texto exibido formatado como `R$ 0,00`, usando o algoritmo de acumulação de dígitos (strip não-dígitos → centavos → `number` → reformatar com `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`)
- [x] 1.2 Inicializar o texto exibido a partir do `value` recebido no mount: vazio quando `value` é `0`/ausente, já formatado quando `value` é um número positivo (sem `useEffect` de re-sincronização)

## 2. Aplicar nos formulários

- [x] 2.1 `components/features/despesas/DespesaForm.tsx`: trocar o `<Input type="number">` do campo `valor` por `CurrencyInput`
- [x] 2.2 `components/features/receitas/ReceitaForm.tsx`: trocar o `<Input type="number">` do campo `valor` por `CurrencyInput`
- [x] 2.3 `components/features/patrimonio/PatrimonioForm.tsx`: trocar o `<Input type="number">` do campo `valor` por `CurrencyInput`
- [x] 2.4 `components/features/contas-recorrentes/ContaRecorrenteForm.tsx`: trocar o `<Input type="number">` do campo `valorPadrao` por `CurrencyInput`

## 3. Verificação

- [x] 3.1 Rodar `npm run lint` e `npm run build`
- [x] 3.2 No navegador, testar cadastro de nova despesa/receita/patrimônio/conta recorrente: digitar valores e confirmar que o campo formata em tempo real (`R$ 123,45`) e que o valor salvo/exibido na tabela depois bate com o digitado
- [x] 3.3 No navegador, testar edição de uma despesa/receita/conta recorrente existente: confirmar que o campo Valor já abre formatado com o valor atual, e que alterá-lo e salvar reflete corretamente na tabela
