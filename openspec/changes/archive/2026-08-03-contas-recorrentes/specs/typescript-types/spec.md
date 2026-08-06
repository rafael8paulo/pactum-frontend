## ADDED Requirements

### Requirement: Tipos de ContaRecorrente definidos
O sistema SHALL ter o arquivo `types/conta-recorrente.ts` com os tipos `StatusContaRecorrente`, `ContaRecorrente`, `CadastrarContaRecorrenteRequest`, `EditarContaRecorrenteRequest` e `ListaContasRecorrentesResponse`, alinhados com o contrato da `pactum-api`.

#### Scenario: Todos os valores de StatusContaRecorrente cobertos
- **WHEN** um componente atribui um status de conta recorrente
- **THEN** o TypeScript aceita apenas `'ATIVA'`, `'PAUSADA'` ou `'ENCERRADA'`

#### Scenario: Interface ContaRecorrente tem todos os campos
- **WHEN** a API retorna um objeto de conta recorrente
- **THEN** o objeto é tipado com `id: string`, `descricao: string`, `valorPadrao: number`, `categoria: CategoriaDespesa`, `diaVencimento: number | null`, `competenciaInicio: string`, `competenciaFim: string | null` e `status: StatusContaRecorrente`

## MODIFIED Requirements

### Requirement: Tipos de Despesa definidos
O sistema SHALL ter o arquivo `types/despesa.ts` com os tipos `StatusDespesa`, `CategoriaDespesa`, `Despesa`, `CadastrarDespesaRequest`, `ListaDespesasResponse` e `DespesaFilters` alinhados com o contrato da Pactum API. A interface `Despesa` SHALL incluir o campo opcional `contaRecorrenteId: string | null`, indicando a conta recorrente de origem quando o lançamento tiver sido gerado automaticamente.

#### Scenario: Todos os valores de StatusDespesa cobertos
- **WHEN** um componente atribui um status de despesa
- **THEN** o TypeScript aceita apenas `'PAGA'`, `'PENDENTE'` ou `'AGENDADA'`

#### Scenario: Todos os valores de CategoriaDespesa cobertos
- **WHEN** um componente atribui uma categoria de despesa
- **THEN** o TypeScript aceita apenas `'FINANCIAMENTO'`, `'CARTAO_CREDITO'`, `'EDUCACAO'`, `'SERVICOS'`, `'LAZER'`, `'IMPOSTO'` ou `'OUTROS'`

#### Scenario: Interface Despesa tem todos os campos obrigatórios
- **WHEN** a API retorna um objeto despesa
- **THEN** o objeto é tipado com `id: string`, `descricao: string`, `valor: number`, `status: StatusDespesa`, `competencia: string` e `categoria: CategoriaDespesa`

#### Scenario: Despesa gerada por conta recorrente traz contaRecorrenteId
- **WHEN** a API retorna uma despesa criada a partir de uma conta recorrente
- **THEN** o campo `contaRecorrenteId` é tipado como `string` (não `null`)
