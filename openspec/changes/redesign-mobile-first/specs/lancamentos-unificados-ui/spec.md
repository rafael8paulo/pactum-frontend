## Purpose

Rota única de consulta e manipulação de despesas e receitas em mobile, substituindo as tabelas de cinco colunas por uma lista tocável com filtros, busca, gesto de conclusão e detalhe em painel.

## ADDED Requirements

### Requirement: Rota unificada de lançamentos
O sistema SHALL exibir despesas e receitas da competência ativa na rota `/lancamentos`, com um seletor de dois segmentos que alterna entre os tipos e persiste a escolha como `?tipo=despesa|receita` na URL. Na ausência do parâmetro, o tipo padrão SHALL ser `despesa`.

#### Scenario: Tipo padrão sem parâmetro na URL
- **WHEN** o usuário acessa `/lancamentos` sem o parâmetro `tipo`
- **THEN** o segmento "Despesas" está ativo e a lista exibe despesas da competência ativa

#### Scenario: Alternância entre tipos atualiza a URL
- **WHEN** o usuário toca o segmento "Receitas"
- **THEN** a URL passa a conter `?tipo=receita`, a lista exibe receitas da competência ativa e a competência selecionada é preservada

#### Scenario: Tipo da URL é refletido no seletor
- **WHEN** o usuário acessa `/lancamentos?tipo=receita&competencia=2026-03`
- **THEN** o segmento "Receitas" está ativo e a lista exibe receitas de março de 2026

#### Scenario: Filtros são reavaliados ao trocar de tipo
- **WHEN** há um filtro de status ativo e o usuário alterna para "Receitas", que não possui status
- **THEN** o filtro de status é removido da URL e a lista de receitas é exibida sem filtro de status

### Requirement: Apresentação em lista tocável em mobile
O sistema SHALL apresentar, em viewports menores que 768px, cada lançamento como um item de lista de altura mínima 56px exibindo descrição, categoria, valor formatado em BRL e — para despesas — o status por rótulo textual. A apresentação em tabela ordenável por cabeçalho SHALL permanecer como a apresentação de viewports de 768px ou mais.

#### Scenario: Lançamento exibido como item de lista em mobile
- **WHEN** a API retorna lançamentos para a competência e a viewport é menor que 768px
- **THEN** cada lançamento é exibido como um item de lista com descrição, categoria, valor em BRL e, para despesas, o status em texto

#### Scenario: Apresentação em tabela preservada em desktop
- **WHEN** o usuário acessa `/lancamentos` em uma viewport de 768px ou maior
- **THEN** os lançamentos são exibidos em tabela com cabeçalhos ordenáveis, mantendo o comportamento de ordenação já existente

#### Scenario: Item inteiro é a área de toque
- **WHEN** o usuário toca qualquer ponto de um item de lista fora de um controle interno
- **THEN** o detalhe daquele lançamento é aberto

#### Scenario: Lista não exige rolagem horizontal
- **WHEN** a lista é exibida em uma viewport de 320px de largura
- **THEN** nenhum conteúdo da lista exige rolagem horizontal para ser lido

### Requirement: Agrupamento com subtotais
O sistema SHALL agrupar a lista de lançamentos e exibir, no cabeçalho de cada grupo, o rótulo do grupo e a soma dos valores daquele grupo formatada em BRL. Quando os lançamentos expuserem data, o agrupamento SHALL ser por dia, em ordem decrescente, com rótulos relativos para o dia corrente e o anterior; enquanto os lançamentos expuserem apenas competência, o agrupamento SHALL ser por status para despesas e grupo único para receitas.

#### Scenario: Agrupamento por dia quando há data
- **WHEN** os lançamentos retornados expõem data e a lista é renderizada
- **THEN** os lançamentos são agrupados por dia em ordem decrescente, e o grupo do dia corrente é rotulado como "Hoje"

#### Scenario: Agrupamento por status na ausência de data
- **WHEN** os lançamentos retornados não expõem data e o tipo ativo é despesa
- **THEN** os lançamentos são agrupados por status e cada cabeçalho de grupo exibe o subtotal do grupo em BRL

#### Scenario: Cabeçalho de grupo exibe subtotal
- **WHEN** um grupo contém três lançamentos
- **THEN** o cabeçalho do grupo exibe a soma dos três valores formatada em BRL

### Requirement: Filtros por chips com contador
O sistema SHALL substituir, em mobile, os seletores de filtro por chips de toque único para os filtros de status, mantendo a sincronização com a URL já existente. Cada chip de status SHALL exibir a quantidade de lançamentos que correspondem àquele filtro na competência ativa, e SHALL haver um chip que restaura a lista sem filtro de status.

#### Scenario: Chip exibe contagem de lançamentos
- **WHEN** a competência ativa contém 3 despesas pendentes
- **THEN** o chip "Pendentes" exibe a contagem 3

#### Scenario: Toque em chip aplica filtro e atualiza a URL
- **WHEN** o usuário toca o chip "Pendentes"
- **THEN** a URL passa a conter `?status=PENDENTE`, o chip é exibido como ativo e a lista exibe apenas despesas pendentes

#### Scenario: Chip "Todas" limpa o filtro de status
- **WHEN** há um filtro de status ativo e o usuário toca o chip "Todas"
- **THEN** o parâmetro `status` é removido da URL e a lista exibe todas as despesas da competência

#### Scenario: Chips não exigem rolagem horizontal oculta
- **WHEN** a linha de chips é exibida em uma viewport de 320px
- **THEN** ou todos os chips cabem na largura disponível, ou a rolagem horizontal é visualmente indicada por um chip parcialmente visível

### Requirement: Busca textual na competência
O sistema SHALL oferecer busca por descrição sobre os lançamentos já carregados da competência ativa, filtrando a lista conforme o usuário digita, sem requisição adicional à API.

#### Scenario: Busca filtra a lista
- **WHEN** o usuário digita "luz" no campo de busca
- **THEN** a lista exibe apenas lançamentos cuja descrição contém "luz", sem diferenciar maiúsculas de minúsculas

#### Scenario: Busca sem resultados exibe estado vazio
- **WHEN** nenhum lançamento da competência corresponde ao termo buscado
- **THEN** um estado vazio é exibido informando que nada foi encontrado para aquele termo, com ação para limpar a busca

#### Scenario: Busca é combinada com os filtros ativos
- **WHEN** o filtro "Pendentes" está ativo e o usuário busca por "luz"
- **THEN** a lista exibe apenas despesas pendentes cuja descrição contém "luz"

### Requirement: Gesto de conclusão em despesas
O sistema SHALL permitir, em mobile, alterar o status de uma despesa para PAGA por gesto de deslize horizontal sobre o item, revelando um alvo rotulado antes da confirmação do gesto. A mesma alteração SHALL permanecer disponível por caminho não gestual no detalhe do lançamento.

#### Scenario: Deslize revela alvo rotulado
- **WHEN** o usuário desliza horizontalmente sobre uma despesa pendente sem completar o gesto
- **THEN** um alvo com ícone e o rótulo textual "Marcar paga" é revelado e a despesa permanece com o status atual

#### Scenario: Gesto completo altera o status
- **WHEN** o usuário completa o gesto de deslize sobre uma despesa pendente
- **THEN** o status é alterado para PAGA na API, o item reflete o novo status e uma confirmação reversível é exibida

#### Scenario: Gesto interrompido não altera dados
- **WHEN** o usuário inicia o deslize e solta antes do limiar de confirmação
- **THEN** o item retorna à posição original e nenhuma requisição é feita à API

#### Scenario: Gesto não é o único caminho para a ação
- **WHEN** o usuário abre o detalhe de uma despesa pendente
- **THEN** a alteração de status está disponível por controle tocável, sem depender de gesto

#### Scenario: Gesto indisponível em receitas
- **WHEN** o usuário desliza horizontalmente sobre uma receita
- **THEN** nenhum alvo de alteração de status é revelado

### Requirement: Detalhe do lançamento em painel
O sistema SHALL exibir o detalhe de um lançamento em painel sobreposto contendo descrição, valor, categoria, competência, origem e — para despesas — um controle de troca direta entre os três status. O painel SHALL oferecer edição e exclusão, com a ação destrutiva visualmente separada da ação primária e precedida de confirmação.

#### Scenario: Painel exibe os dados do lançamento
- **WHEN** o usuário toca um lançamento na lista
- **THEN** um painel sobreposto exibe descrição, valor em BRL, categoria, competência e origem do lançamento

#### Scenario: Status alterado em um toque
- **WHEN** o usuário toca o segmento "Paga" no controle de status do painel de uma despesa pendente
- **THEN** o status é atualizado na API sem abrir nenhum menu intermediário e uma confirmação reversível é exibida

#### Scenario: Exclusão exige confirmação
- **WHEN** o usuário aciona a exclusão no painel
- **THEN** uma confirmação é exibida antes de qualquer requisição, e o lançamento só é removido após o usuário confirmar

#### Scenario: Painel reflete o tipo do lançamento
- **WHEN** o painel é aberto para uma receita
- **THEN** nenhum controle de status é exibido, e as ações de editar e excluir permanecem disponíveis

#### Scenario: Painel é dispensável por gesto e por controle
- **WHEN** o painel está aberto
- **THEN** o usuário pode fechá-lo tanto por gesto de arrasto para baixo quanto por um controle de fechar explícito
