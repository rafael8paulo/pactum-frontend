## MODIFIED Requirements

### Requirement: Listagem de despesas por competência
O sistema SHALL exibir todas as despesas da competência selecionada no seletor de competência, consumindo `GET /api/v1/despesas?competencia=YYYY-MM`, na rota `/lancamentos?tipo=despesa`. Em viewports de 768px ou mais, a apresentação SHALL ser a tabela ordenável, carregada por padrão ordenada pela coluna Valor em ordem decrescente e reordenável por Descrição, Categoria ou Valor. Em viewports menores que 768px, a apresentação SHALL ser a lista agrupada definida na capability `lancamentos-unificados-ui`, sem cabeçalhos de ordenação.

#### Scenario: Despesas carregando exibem skeletons
- **WHEN** a página de lançamentos é acessada com tipo despesa e a requisição à API está em andamento
- **THEN** a apresentação ativa exibe skeletons com a mesma estrutura e altura do conteúdo real, sem substituir a página inteira por um loader

#### Scenario: Lista de despesas preenchida
- **WHEN** a API retorna despesas para a competência e a viewport tem 768px ou mais
- **THEN** a tabela exibe uma linha por despesa com colunas: Descrição, Categoria, Valor (em BRL), Status e ações

#### Scenario: Lista de despesas preenchida em mobile
- **WHEN** a API retorna despesas para a competência e a viewport é menor que 768px
- **THEN** cada despesa é exibida como item de lista com descrição, categoria, valor em BRL e status em texto, sem rolagem horizontal

#### Scenario: Lista vazia para a competência
- **WHEN** a API retorna lista vazia para a competência selecionada
- **THEN** a apresentação é substituída por um estado vazio contextualizado com a competência e com ação para adicionar uma despesa

#### Scenario: Ordenação padrão por Valor decrescente
- **WHEN** a página é carregada em uma viewport de 768px ou mais e a API retorna despesas para a competência
- **THEN** a tabela é exibida ordenada pela coluna Valor em ordem decrescente, com o cabeçalho de Valor exibindo o indicador de ordenação descendente, sem exigir nenhuma ação do usuário

#### Scenario: Reordenar despesas por outra coluna
- **WHEN** o usuário clica no cabeçalho de Descrição ou Categoria em desktop
- **THEN** a tabela é reordenada por essa coluna, substituindo a ordenação por Valor então ativa

#### Scenario: Colunas Status e ações não são ordenáveis
- **WHEN** o usuário clica no cabeçalho da coluna Status ou da coluna de ações
- **THEN** a ordenação da tabela não muda

### Requirement: Filtros por status e categoria sincronizados com a URL
O sistema SHALL permitir filtrar a lista de despesas por `status` e/ou `categoria`, persistindo os filtros ativos como query params na URL. Em viewports de 768px ou mais, os filtros SHALL ser aplicados pelos seletores existentes; em viewports menores que 768px, pelos chips de toque único definidos na capability `lancamentos-unificados-ui`.

#### Scenario: Filtro por status aplicado
- **WHEN** o usuário seleciona o status "PAGA" no controle de filtro da apresentação ativa
- **THEN** a URL é atualizada com `?status=PAGA` e a listagem exibe apenas despesas com status PAGA

#### Scenario: Filtro por categoria aplicado
- **WHEN** o usuário seleciona a categoria "CARTAO_CREDITO" no controle de filtro da apresentação ativa
- **THEN** a URL é atualizada com `?categoria=CARTAO_CREDITO` e a listagem exibe apenas despesas dessa categoria

#### Scenario: Filtros combinados
- **WHEN** o usuário seleciona status "PENDENTE" e categoria "LAZER"
- **THEN** a URL contém ambos os params e a listagem exibe apenas despesas que atendem aos dois critérios

#### Scenario: Filtro removido restaura lista completa
- **WHEN** o usuário limpa um filtro ativo
- **THEN** o query param correspondente é removido da URL e a listagem exibe todas as despesas da competência

### Requirement: Cadastrar nova despesa
O sistema SHALL permitir cadastrar uma nova despesa chamando `POST /api/v1/despesas`, com o campo Valor usando máscara de moeda BRL (`R$ 0,00`). Em viewports de 768px ou mais, o cadastro SHALL ocorrer no dialog com os campos Descrição, Valor, Categoria, Status e Competência. Em viewports menores que 768px, o cadastro SHALL ocorrer pelo painel de criação rápida definido na capability `lancamento-quick-add`, no qual a competência é derivada do contexto e não é exposta como campo de texto livre.

#### Scenario: Dialog de nova despesa abre
- **WHEN** o usuário clica no botão "Nova Despesa" em uma viewport de 768px ou maior
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor, Categoria, Status e Competência

#### Scenario: Painel de criação rápida abre em mobile
- **WHEN** o usuário aciona a criação em uma viewport menor que 768px
- **THEN** o painel de criação rápida é aberto com o campo Valor em foco e a competência ativa já aplicada

#### Scenario: Competência não é digitada em mobile
- **WHEN** o painel de criação rápida é exibido
- **THEN** não há campo de texto que exija digitação de competência no formato `AAAA-MM`

#### Scenario: Validação impede envio de formulário inválido
- **WHEN** o usuário tenta submeter com campos obrigatórios vazios ou valor não positivo
- **THEN** mensagens de erro inline são exibidas nos campos inválidos e nenhuma requisição é feita

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** a despesa é criada na API, a superfície de criação é fechada, a listagem é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** a superfície de criação permanece aberta com os dados preenchidos e um toast de erro é exibido

#### Scenario: Campo Valor formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Alterar status de despesa inline
O sistema SHALL permitir alterar o status de uma despesa sem sair da listagem, chamando `PATCH /api/v1/despesas/:id/status`. Em viewports de 768px ou mais, a alteração SHALL ocorrer pelo dropdown da coluna Status. Em viewports menores que 768px, a alteração SHALL ocorrer pelo gesto de deslize sobre o item ou pelo controle de status do painel de detalhe, ambos em um único toque ou gesto. A alteração SHALL ser aplicada de forma otimista e reversível.

#### Scenario: Status alterado com sucesso
- **WHEN** o usuário seleciona um novo status no dropdown da coluna Status de uma despesa
- **THEN** o status é atualizado na API, a linha reflete o novo status e um toast de sucesso é exibido

#### Scenario: Status alterado em um gesto em mobile
- **WHEN** o usuário completa o gesto de deslize sobre uma despesa pendente em mobile
- **THEN** o item reflete imediatamente o status PAGA, a alteração é enviada à API e uma confirmação com ação de desfazer é exibida

#### Scenario: Desfazer reverte a alteração
- **WHEN** o usuário aciona "Desfazer" na confirmação de alteração de status
- **THEN** o status anterior é restaurado na API e a listagem volta a exibi-lo

#### Scenario: Erro na alteração de status exibe toast
- **WHEN** a API retorna erro ao alterar o status
- **THEN** o status exibido reverte ao valor anterior e um toast de erro é exibido

### Requirement: Remover despesa com confirmação
O sistema SHALL permitir remover uma despesa com confirmação prévia, chamando `DELETE /api/v1/despesas/:id`. Em viewports de 768px ou mais, a ação SHALL estar na coluna de ações da tabela. Em viewports menores que 768px, a ação SHALL estar disponível apenas no painel de detalhe do lançamento, visualmente separada da ação primária de edição, e nunca adjacente a ela na listagem.

#### Scenario: AlertDialog de confirmação abre antes da remoção
- **WHEN** o usuário aciona "Remover" na apresentação ativa
- **THEN** uma confirmação é exibida solicitando confirmação antes de prosseguir

#### Scenario: Remoção confirmada
- **WHEN** o usuário confirma a remoção
- **THEN** a despesa é removida da API, a listagem é atualizada e um toast de confirmação é exibido

#### Scenario: Remoção cancelada não altera dados
- **WHEN** o usuário cancela a confirmação
- **THEN** nenhuma requisição é feita à API e a despesa permanece na listagem

#### Scenario: Remoção não é alcançável a partir da listagem em mobile
- **WHEN** o usuário visualiza a listagem de despesas em uma viewport menor que 768px
- **THEN** nenhuma ação de remoção é exibida diretamente nos itens da lista
