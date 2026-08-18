## MODIFIED Requirements

### Requirement: Listagem de despesas por competência
O sistema SHALL exibir todas as despesas da competência selecionada no MonthPicker, consumindo `GET /api/v1/despesas?competencia=YYYY-MM`. A tabela SHALL carregar, por padrão, ordenada pela coluna Valor em ordem decrescente, e SHALL permitir reordenar por qualquer coluna ordenável (Descrição, Categoria, Valor) clicando no respectivo cabeçalho.

#### Scenario: Despesas carregando exibem skeletons
- **WHEN** a página de despesas é acessada e a requisição à API está em andamento
- **THEN** a tabela exibe 5 linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista de despesas preenchida
- **WHEN** a API retorna despesas para a competência
- **THEN** a tabela exibe uma linha por despesa com colunas: Descrição, Categoria, Valor (em BRL), Status e ações

#### Scenario: Lista vazia para a competência
- **WHEN** a API retorna lista vazia para a competência selecionada
- **THEN** a tabela é substituída por mensagem de estado vazio contextualizada com a competência

#### Scenario: Ordenação padrão por Valor decrescente
- **WHEN** a página de despesas é carregada e a API retorna despesas para a competência
- **THEN** a tabela é exibida ordenada pela coluna Valor em ordem decrescente, com o cabeçalho de Valor exibindo o indicador de ordenação descendente, sem exigir nenhuma ação do usuário

#### Scenario: Reordenar despesas por outra coluna
- **WHEN** o usuário clica no cabeçalho de Descrição ou Categoria
- **THEN** a tabela é reordenada por essa coluna, substituindo a ordenação por Valor então ativa

#### Scenario: Colunas Status e ações não são ordenáveis
- **WHEN** o usuário clica no cabeçalho da coluna Status ou da coluna de ações
- **THEN** a ordenação da tabela não muda
