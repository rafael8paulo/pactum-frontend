# Spec: typescript-types

## Purpose

Definição dos tipos TypeScript para todos os domínios da Pactum API (despesas, receitas, resumo mensal e patrimônio), garantindo segurança de tipos em toda a aplicação.

---

## Requirements

### Requirement: Tipos de Despesa definidos
O sistema SHALL ter o arquivo `types/despesa.ts` com os tipos `StatusDespesa`, `CategoriaDespesa`, `Despesa`, `CadastrarDespesaRequest`, `ListaDespesasResponse` e `DespesaFilters` alinhados com o contrato da Pactum API.

#### Scenario: Todos os valores de StatusDespesa cobertos
- **WHEN** um componente atribui um status de despesa
- **THEN** o TypeScript aceita apenas `'PAGA'`, `'PENDENTE'` ou `'AGENDADA'`

#### Scenario: Todos os valores de CategoriaDespesa cobertos
- **WHEN** um componente atribui uma categoria de despesa
- **THEN** o TypeScript aceita apenas `'FINANCIAMENTO'`, `'CARTAO_CREDITO'`, `'EDUCACAO'`, `'SERVICOS'`, `'LAZER'`, `'IMPOSTO'` ou `'OUTROS'`

#### Scenario: Interface Despesa tem todos os campos obrigatórios
- **WHEN** a API retorna um objeto despesa
- **THEN** o objeto é tipado com `id: string`, `descricao: string`, `valor: number`, `status: StatusDespesa`, `competencia: string` e `categoria: CategoriaDespesa`

### Requirement: Tipos de Receita definidos
O sistema SHALL ter o arquivo `types/receita.ts` com os tipos `CategoriaReceita`, `Receita`, `CadastrarReceitaRequest` e `ListaReceitasResponse`.

#### Scenario: Todos os valores de CategoriaReceita cobertos
- **WHEN** um componente atribui uma categoria de receita
- **THEN** o TypeScript aceita apenas os valores válidos definidos pela API (`'SALARIO'`, `'FREELANCE'`, `'INVESTIMENTO'`, `'OUTROS'`)

#### Scenario: Interface Receita tem todos os campos obrigatórios
- **WHEN** a API retorna um objeto receita
- **THEN** o objeto é tipado com `id: string`, `descricao: string`, `valor: number`, `competencia: string` e `categoria: CategoriaReceita`

### Requirement: Tipos de Resumo Mensal definidos
O sistema SHALL ter o arquivo `types/resumo.ts` com os tipos `ResumoMensal` e `HistoricoAnualResponse`.

#### Scenario: ResumoMensal possui totais de receitas, despesas e saldo
- **WHEN** a API retorna o resumo do mês
- **THEN** o objeto é tipado com `totalReceitas: number`, `totalDespesas: number` e `saldo: number`

#### Scenario: HistoricoAnualResponse é um array de resumos mensais
- **WHEN** a API retorna o histórico anual
- **THEN** o objeto contém `meses: ResumoMensal[]` com o mês de referência em cada item

### Requirement: Tipos de Patrimônio definidos
O sistema SHALL ter o arquivo `types/patrimonio.ts` com os tipos `Patrimonio` e `CadastrarPatrimonioRequest`.

#### Scenario: Interface Patrimônio tem todos os campos obrigatórios
- **WHEN** a API retorna um item de patrimônio
- **THEN** o objeto é tipado com `id: string`, `descricao: string`, `valor: number` e `competencia: string`

### Requirement: Build TypeScript sem erros
O sistema SHALL compilar sem erros de tipo após a definição de todos os arquivos em `types/`.

#### Scenario: Projeto compila sem erros de tipo
- **WHEN** o desenvolvedor executa `npm run build`
- **THEN** nenhum erro de TypeScript é reportado nos arquivos de tipos
