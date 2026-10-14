## MODIFIED Requirements

### Requirement: Listagem de receitas por competência
O sistema SHALL exibir todas as receitas da competência selecionada no seletor de competência, consumindo `GET /api/v1/receitas?competencia=YYYY-MM`, na rota `/lancamentos?tipo=receita`. Em viewports de 768px ou mais, a apresentação SHALL ser a tabela ordenável por Descrição, Categoria ou Valor, mantendo a ordem de chegada da API como padrão inicial. Em viewports menores que 768px, a apresentação SHALL ser a lista definida na capability `lancamentos-unificados-ui`, sem cabeçalhos de ordenação e sem coluna de status.

#### Scenario: Receitas carregando exibem skeletons
- **WHEN** a página de lançamentos é acessada com tipo receita e a requisição à API está em andamento
- **THEN** a apresentação ativa exibe skeletons com a mesma estrutura e altura do conteúdo real, sem substituir a página inteira por um loader

#### Scenario: Lista de receitas preenchida
- **WHEN** a API retorna receitas para a competência e a viewport tem 768px ou mais
- **THEN** a tabela exibe uma linha por receita com colunas: Descrição, Categoria, Valor (em BRL) e Ações

#### Scenario: Lista de receitas preenchida em mobile
- **WHEN** a API retorna receitas para a competência e a viewport é menor que 768px
- **THEN** cada receita é exibida como item de lista com descrição, categoria e valor em BRL, sem qualquer indicação de status

#### Scenario: Lista vazia para a competência
- **WHEN** a API retorna lista vazia para a competência selecionada
- **THEN** a apresentação é substituída por um estado vazio contextualizado com a competência e com ação para adicionar uma receita

#### Scenario: Ordenar receitas por Valor
- **WHEN** o usuário clica no cabeçalho de Valor em uma viewport de 768px ou maior
- **THEN** a tabela é reordenada por Valor na direção indicada pelo cabeçalho (ascendente no primeiro clique, descendente no segundo)

#### Scenario: Coluna de ações não é ordenável
- **WHEN** o usuário clica no cabeçalho da coluna de ações
- **THEN** a ordenação da tabela não muda

### Requirement: Cadastrar nova receita
O sistema SHALL permitir cadastrar uma nova receita chamando `POST /api/v1/receitas`, com o campo Valor usando máscara de moeda BRL (`R$ 0,00`). Em viewports de 768px ou mais, o cadastro SHALL ocorrer no dialog com os campos Descrição, Valor, Categoria e Competência. Em viewports menores que 768px, o cadastro SHALL ocorrer pelo painel de criação rápida definido na capability `lancamento-quick-add`, com o tipo "Receita" selecionado e a competência derivada do contexto.

#### Scenario: Dialog de nova receita abre
- **WHEN** o usuário clica no botão "Nova Receita" em uma viewport de 768px ou maior
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor, Categoria e Competência

#### Scenario: Painel de criação rápida abre com tipo receita em mobile
- **WHEN** o usuário aciona a criação a partir de `/lancamentos?tipo=receita` em uma viewport menor que 768px
- **THEN** o painel de criação rápida é aberto com o tipo "Receita" selecionado e o campo Valor em foco

#### Scenario: Validação impede envio de formulário inválido
- **WHEN** o usuário tenta submeter com campos obrigatórios vazios ou valor não positivo
- **THEN** mensagens de erro inline são exibidas nos campos inválidos e nenhuma requisição é feita

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** a receita é criada na API, a superfície de criação é fechada, a listagem é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** a superfície de criação permanece aberta com os dados preenchidos e um toast de erro é exibido

#### Scenario: Campo Valor formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Remover receita com confirmação
O sistema SHALL permitir remover uma receita com confirmação prévia, chamando `DELETE /api/v1/receitas/:id`. Em viewports de 768px ou mais, a ação SHALL estar na coluna de ações da tabela. Em viewports menores que 768px, a ação SHALL estar disponível apenas no painel de detalhe do lançamento, visualmente separada da ação primária de edição.

#### Scenario: AlertDialog de confirmação abre antes da remoção
- **WHEN** o usuário aciona "Remover" na apresentação ativa
- **THEN** uma confirmação é exibida solicitando confirmação antes de prosseguir

#### Scenario: Remoção confirmada
- **WHEN** o usuário confirma a remoção
- **THEN** a receita é removida da API, a listagem é atualizada e um toast de confirmação é exibido

#### Scenario: Remoção cancelada não altera dados
- **WHEN** o usuário cancela a confirmação
- **THEN** nenhuma requisição é feita à API e a receita permanece na listagem

#### Scenario: Remoção não é alcançável a partir da listagem em mobile
- **WHEN** o usuário visualiza a listagem de receitas em uma viewport menor que 768px
- **THEN** nenhuma ação de remoção é exibida diretamente nos itens da lista
