## MODIFIED Requirements

### Requirement: Listagem de itens de patrimônio por competência
O sistema SHALL exibir todos os itens de patrimônio da competência selecionada na rota `/mais/patrimonio`, consumindo `GET /api/v1/patrimonio?competencia=YYYY-MM`. Em viewports de 768px ou mais, os itens SHALL ser exibidos como grid de cards. Em viewports menores que 768px, os itens SHALL ser exibidos como lista de linha única, cada uma com descrição, valor em BRL e a participação percentual do item no total da competência.

#### Scenario: Itens carregando exibem skeletons
- **WHEN** a página de patrimônio é acessada e a requisição à API está em andamento
- **THEN** a apresentação ativa exibe skeletons com a mesma estrutura do conteúdo real

#### Scenario: Grid de cards exibe itens
- **WHEN** a API retorna itens para a competência e a viewport tem 768px ou mais
- **THEN** cada item é exibido como um card com descrição e valor formatado em BRL

#### Scenario: Lista exibe itens com percentual em mobile
- **WHEN** a API retorna itens para a competência e a viewport é menor que 768px
- **THEN** cada item é exibido em uma linha com descrição, valor em BRL e o percentual que representa do total da competência

#### Scenario: Estado vazio para competência sem itens
- **WHEN** a API retorna lista vazia para a competência selecionada
- **THEN** um estado vazio contextualizado com a competência é exibido, com ação para cadastrar o primeiro item

### Requirement: Card de total patrimonial
O sistema SHALL exibir a soma dos valores de todos os itens da competência selecionada em posição de destaque. Em viewports menores que 768px, o total SHALL ser acompanhado de uma representação visual da composição por item, e a composição SHALL ser legível por texto além da cor.

#### Scenario: Total exibido com dados
- **WHEN** a API retorna itens para a competência
- **THEN** o total exibe a soma de todos os valores formatada em BRL

#### Scenario: Composição exibida em mobile
- **WHEN** a API retorna dois ou mais itens e a viewport é menor que 768px
- **THEN** uma representação visual da composição é exibida junto ao total, acompanhada de legenda textual identificando cada parte

#### Scenario: Total exibido como zero com lista vazia
- **WHEN** a API retorna lista vazia
- **THEN** o total exibe R$ 0,00 e nenhuma representação de composição é exibida

#### Scenario: Total exibido como skeleton durante carregamento
- **WHEN** a requisição à API está em andamento
- **THEN** um skeleton é exibido no lugar do valor total
