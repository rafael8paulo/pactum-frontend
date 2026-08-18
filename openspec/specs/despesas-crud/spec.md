# Spec: despesas-crud

## Purpose

CRUD completo de despesas mensais: listar com filtros, cadastrar, editar, alterar status e remover. Esta é a feature central do MVP e serve de padrão para os demais domínios.

---

## Requirements

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

### Requirement: Filtros por status e categoria sincronizados com a URL
O sistema SHALL permitir filtrar a lista de despesas por `status` e/ou `categoria`, persistindo os filtros ativos como query params na URL.

#### Scenario: Filtro por status aplicado
- **WHEN** o usuário seleciona o status "PAGA" no painel de filtros
- **THEN** a URL é atualizada com `?status=PAGA` e a tabela exibe apenas despesas com status PAGA

#### Scenario: Filtro por categoria aplicado
- **WHEN** o usuário seleciona a categoria "CARTAO_CREDITO" no painel de filtros
- **THEN** a URL é atualizada com `?categoria=CARTAO_CREDITO` e a tabela exibe apenas despesas dessa categoria

#### Scenario: Filtros combinados
- **WHEN** o usuário seleciona status "PENDENTE" e categoria "LAZER"
- **THEN** a URL contém ambos os params e a tabela exibe apenas despesas que atendem aos dois critérios

#### Scenario: Filtro removido restaura lista completa
- **WHEN** o usuário limpa um filtro ativo
- **THEN** o query param correspondente é removido da URL e a tabela exibe todas as despesas da competência

### Requirement: Cadastrar nova despesa
O sistema SHALL permitir cadastrar uma nova despesa via dialog com formulário validado, chamando `POST /api/v1/despesas`. O campo Valor SHALL usar um input com máscara de moeda BRL (`R$ 0,00`).

#### Scenario: Dialog de nova despesa abre
- **WHEN** o usuário clica no botão "Nova Despesa"
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor, Categoria, Status e Competência

#### Scenario: Validação impede envio de formulário inválido
- **WHEN** o usuário tenta submeter o formulário com campos obrigatórios vazios ou valor não numérico
- **THEN** mensagens de erro inline são exibidas nos campos inválidos e o formulário não é enviado

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** a despesa é criada na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

#### Scenario: Campo Valor formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor do formulário de nova despesa
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Editar despesa existente
O sistema SHALL permitir editar uma despesa existente via dialog com formulário pré-preenchido, chamando `PUT /api/v1/despesas/:id`. O campo Valor SHALL usar um input com máscara de moeda BRL, já exibindo o valor atual formatado ao abrir o dialog.

#### Scenario: Dialog de edição abre com dados pré-preenchidos
- **WHEN** o usuário clica em "Editar" em uma linha da tabela
- **THEN** um Dialog se abre com o formulário preenchido com os dados atuais da despesa, e o campo Valor já exibe o valor formatado como moeda (ex.: `R$ 1.234,56`)

#### Scenario: Edição bem-sucedida
- **WHEN** o usuário altera campos e confirma
- **THEN** a despesa é atualizada na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro na edição exibe toast
- **WHEN** a API retorna erro ao atualizar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

### Requirement: Alterar status de despesa inline
O sistema SHALL permitir alterar o status de uma despesa diretamente na tabela, chamando `PATCH /api/v1/despesas/:id/status`.

#### Scenario: Status alterado com sucesso
- **WHEN** o usuário seleciona um novo status no dropdown da coluna Status de uma despesa
- **THEN** o status é atualizado na API, a linha reflete o novo status e um toast de sucesso é exibido

#### Scenario: Erro na alteração de status exibe toast
- **WHEN** a API retorna erro ao alterar o status
- **THEN** o status na tabela reverte ao valor anterior e um toast de erro é exibido

### Requirement: Remover despesa com confirmação
O sistema SHALL permitir remover uma despesa com confirmação prévia via AlertDialog, chamando `DELETE /api/v1/despesas/:id`.

#### Scenario: AlertDialog de confirmação abre antes da remoção
- **WHEN** o usuário clica em "Remover" em uma linha da tabela
- **THEN** um AlertDialog é exibido solicitando confirmação antes de prosseguir

#### Scenario: Remoção confirmada
- **WHEN** o usuário confirma a remoção no AlertDialog
- **THEN** a despesa é removida da API, a lista é atualizada e um toast de confirmação é exibido

#### Scenario: Remoção cancelada não altera dados
- **WHEN** o usuário cancela no AlertDialog
- **THEN** nenhuma requisição é feita à API e a despesa permanece na lista
