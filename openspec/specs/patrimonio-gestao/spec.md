# Spec: patrimonio-gestao

## Purpose

Gestão de itens de patrimônio por competência: listar como cards com total destacado, cadastrar novos itens e remover existentes. Sem edição (API não suporta).

---

## Requirements

### Requirement: Listagem de itens de patrimônio por competência
O sistema SHALL exibir todos os itens de patrimônio da competência selecionada como cards, consumindo `GET /api/v1/patrimonio?competencia=YYYY-MM`.

#### Scenario: Itens carregando exibem skeletons
- **WHEN** a página de patrimônio é acessada e a requisição à API está em andamento
- **THEN** um grid de cards com `Skeleton` é exibido no lugar dos dados reais

#### Scenario: Grid de cards exibe itens
- **WHEN** a API retorna itens para a competência
- **THEN** cada item é exibido como um `PatrimonioCard` com descrição e valor formatado em BRL

#### Scenario: Estado vazio para competência sem itens
- **WHEN** a API retorna lista vazia para a competência selecionada
- **THEN** uma mensagem de estado vazio contextualizada com a competência é exibida

### Requirement: Card de total patrimonial
O sistema SHALL exibir um card destacado com a soma dos valores de todos os itens da competência selecionada.

#### Scenario: Total exibido com dados
- **WHEN** a API retorna itens para a competência
- **THEN** o card `PatrimonioTotal` exibe a soma de todos os valores formatada em BRL

#### Scenario: Total exibido como zero com lista vazia
- **WHEN** a API retorna lista vazia
- **THEN** o card `PatrimonioTotal` exibe R$ 0,00

#### Scenario: Total exibido como skeleton durante carregamento
- **WHEN** a requisição à API está em andamento
- **THEN** o card `PatrimonioTotal` exibe um `Skeleton` no lugar do valor

### Requirement: Cadastrar novo item de patrimônio
O sistema SHALL permitir cadastrar um novo item de patrimônio via dialog com formulário validado, chamando `POST /api/v1/patrimonio`.

#### Scenario: Dialog de novo item abre
- **WHEN** o usuário clica no botão "Novo Item"
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor e Competência

#### Scenario: Validação impede envio inválido
- **WHEN** o usuário tenta submeter o formulário com campos obrigatórios vazios ou valor não positivo
- **THEN** mensagens de erro inline são exibidas e o formulário não é enviado

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** o item é criado na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

### Requirement: Remover item de patrimônio com confirmação
O sistema SHALL permitir remover um item de patrimônio com confirmação prévia via AlertDialog, chamando `DELETE /api/v1/patrimonio/:id`.

#### Scenario: AlertDialog de confirmação abre antes da remoção
- **WHEN** o usuário clica em "Remover" em um PatrimonioCard
- **THEN** um AlertDialog é exibido solicitando confirmação antes de prosseguir

#### Scenario: Remoção confirmada
- **WHEN** o usuário confirma a remoção no AlertDialog
- **THEN** o item é removido da API, a lista é atualizada e um toast de confirmação é exibido

#### Scenario: Remoção cancelada não altera dados
- **WHEN** o usuário cancela no AlertDialog
- **THEN** nenhuma requisição é feita à API e o item permanece na lista
