# Spec: receitas-crud

## Purpose

CRUD completo de receitas mensais: listar por competência, cadastrar, editar e remover. Segue o mesmo padrão estabelecido pelo CRUD de despesas, com escopo reduzido (sem status e sem filtros).

---

## Requirements

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

### Requirement: Cadastrar nova receita
O sistema SHALL permitir cadastrar uma nova receita via dialog com formulário validado, chamando `POST /api/v1/receitas`. O campo Valor SHALL usar um input com máscara de moeda BRL (`R$ 0,00`).

#### Scenario: Dialog de nova receita abre
- **WHEN** o usuário clica no botão "Nova Receita"
- **THEN** um Dialog se abre com um formulário contendo campos: Descrição, Valor, Categoria e Competência

#### Scenario: Validação impede envio de formulário inválido
- **WHEN** o usuário tenta submeter o formulário com campos obrigatórios vazios ou valor não positivo
- **THEN** mensagens de erro inline são exibidas nos campos inválidos e o formulário não é enviado

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário preenche todos os campos válidos e confirma
- **THEN** a receita é criada na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro no cadastro exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

#### Scenario: Campo Valor formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor do formulário de nova receita
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Editar receita existente
O sistema SHALL permitir editar uma receita existente via dialog com formulário pré-preenchido, chamando `PUT /api/v1/receitas/:id`. O campo Valor SHALL usar um input com máscara de moeda BRL, já exibindo o valor atual formatado ao abrir o dialog.

#### Scenario: Dialog de edição abre com dados pré-preenchidos
- **WHEN** o usuário clica em "Editar" em uma linha da tabela
- **THEN** um Dialog se abre com o formulário preenchido com os dados atuais da receita, e o campo Valor já exibe o valor formatado como moeda (ex.: `R$ 1.234,56`)

#### Scenario: Edição bem-sucedida
- **WHEN** o usuário altera campos e confirma
- **THEN** a receita é atualizada na API, o dialog fecha, a lista é atualizada e um toast de sucesso é exibido

#### Scenario: Erro na edição exibe toast
- **WHEN** a API retorna erro ao atualizar
- **THEN** o dialog permanece aberto e um toast de erro é exibido

### Requirement: Remover receita com confirmação
O sistema SHALL permitir remover uma receita com confirmação prévia via AlertDialog, chamando `DELETE /api/v1/receitas/:id`.

#### Scenario: AlertDialog de confirmação abre antes da remoção
- **WHEN** o usuário clica em "Remover" em uma linha da tabela
- **THEN** um AlertDialog é exibido solicitando confirmação antes de prosseguir

#### Scenario: Remoção confirmada
- **WHEN** o usuário confirma a remoção no AlertDialog
- **THEN** a receita é removida da API, a lista é atualizada e um toast de confirmação é exibido

#### Scenario: Remoção cancelada não altera dados
- **WHEN** o usuário cancela no AlertDialog
- **THEN** nenhuma requisição é feita à API e a receita permanece na lista
