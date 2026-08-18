## ADDED Requirements

### Requirement: Ordenação client-side por coluna em tabelas de listagem
O sistema SHALL permitir ordenar tabelas de listagem clicando no cabeçalho de qualquer coluna marcada como ordenável, aplicando a ordenação sobre os dados já carregados no cliente, sem nova requisição à API.

#### Scenario: Primeiro clique ordena ascendente
- **WHEN** o usuário clica no cabeçalho de uma coluna ordenável que não é a coluna atualmente ordenada
- **THEN** a tabela é reordenada por essa coluna em ordem ascendente e o cabeçalho exibe um indicador visual de ordenação ascendente

#### Scenario: Segundo clique na mesma coluna inverte para descendente
- **WHEN** o usuário clica novamente no cabeçalho da coluna que já está ordenando a tabela em ordem ascendente
- **THEN** a tabela é reordenada por essa coluna em ordem descendente e o indicador visual passa a refletir ordem descendente

#### Scenario: Terceiro clique retorna à ordenação padrão da tela
- **WHEN** o usuário clica pela terceira vez consecutiva no cabeçalho da mesma coluna (após ascendente e descendente)
- **THEN** a tabela retorna à ordenação padrão definida para aquela tela e o indicador visual da coluna é removido

#### Scenario: Ordenação de coluna textual usa comparação alfabética
- **WHEN** o usuário ordena por uma coluna de texto (ex.: Descrição, Categoria)
- **THEN** as linhas são reordenadas em ordem alfabética (respeitando acentuação em pt-BR) na direção selecionada

#### Scenario: Ordenação de coluna numérica usa comparação por valor
- **WHEN** o usuário ordena por uma coluna numérica (ex.: Valor)
- **THEN** as linhas são reordenadas por valor numérico crescente ou decrescente conforme a direção selecionada, não por comparação textual

#### Scenario: Colunas não ordenáveis não respondem a clique
- **WHEN** o usuário clica no cabeçalho de uma coluna marcada como não ordenável (ex.: coluna de Status editável, coluna de ações)
- **THEN** nenhuma reordenação ocorre e nenhum indicador visual de ordenação é exibido nessa coluna
