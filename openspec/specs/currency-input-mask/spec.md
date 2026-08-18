# Spec: currency-input-mask

## Purpose

Componente de input reutilizável para valores monetários em BRL, usado pelos formulários de despesas, receitas, patrimônio e contas recorrentes.

---

## Requirements

### Requirement: Input com máscara de moeda BRL
O sistema SHALL fornecer um componente de input reutilizável que formata em tempo real, no padrão `R$ 1.234,56` (separador de milhar `.`, decimal `,`), qualquer valor monetário digitado pelo usuário, expondo o valor ao formulário como um `number` puro em reais.

#### Scenario: Dígitos digitados preenchem os centavos primeiro
- **WHEN** o usuário digita `12345` num campo de valor vazio
- **THEN** o campo exibe `R$ 123,45` e o formulário recebe o número `123.45`

#### Scenario: Backspace remove o último dígito digitado
- **WHEN** o usuário pressiona backspace num campo exibindo `R$ 123,45`
- **THEN** o campo passa a exibir `R$ 12,34` e o formulário recebe o número `12.34`

#### Scenario: Campo vazio não força "R$ 0,00" como texto
- **WHEN** um formulário de cadastro é aberto com o campo de valor ainda não preenchido
- **THEN** o campo é exibido vazio, com `R$ 0,00` aparecendo apenas como placeholder

#### Scenario: Valor existente é exibido já formatado ao editar
- **WHEN** um formulário de edição é aberto com um valor existente (ex.: `1234.56`)
- **THEN** o campo já exibe `R$ 1.234,56` assim que o formulário é renderizado, sem exigir interação do usuário

#### Scenario: Apenas dígitos são aceitos como entrada
- **WHEN** o usuário tenta digitar letras ou símbolos que não sejam dígitos num campo de valor
- **THEN** esses caracteres são ignorados e não alteram o valor numérico exibido
