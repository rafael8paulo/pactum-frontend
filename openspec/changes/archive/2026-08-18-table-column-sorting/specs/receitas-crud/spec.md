## MODIFIED Requirements

### Requirement: Listagem de receitas por competência
O sistema SHALL exibir todas as receitas da competência selecionada no MonthPicker, consumindo `GET /api/v1/receitas?competencia=YYYY-MM`. A tabela SHALL permitir ordenar por qualquer coluna ordenável (Descrição, Categoria, Valor) clicando no respectivo cabeçalho, mantendo a ordem de chegada da API como padrão inicial.

#### Scenario: Receitas carregando exibem skeletons
- **WHEN** a página de receitas é acessada e a requisição à API está em andamento
- **THEN** a tabela exibe 5 linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista de receitas preenchida
- **WHEN** a API retorna receitas para a competência
- **THEN** a tabela exibe uma linha por receita com colunas: Descrição, Categoria, Valor (em BRL) e Ações

#### Scenario: Lista vazia para a competência
- **WHEN** a API retorna lista vazia para a competência selecionada
- **THEN** a tabela é substituída por mensagem de estado vazio contextualizada com a competência

#### Scenario: Ordenar receitas por Valor
- **WHEN** o usuário clica no cabeçalho de Valor
- **THEN** a tabela é reordenada por Valor na direção indicada pelo cabeçalho (ascendente no primeiro clique, descendente no segundo)

#### Scenario: Coluna de ações não é ordenável
- **WHEN** o usuário clica no cabeçalho da coluna de ações
- **THEN** a ordenação da tabela não muda
