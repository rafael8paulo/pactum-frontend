# Spec: gestao-contas-recorrentes-ui

## Purpose

Tela `/contas-recorrentes` para gestão (CRUD) das contas recorrentes do usuário: navegação, listagem com filtro por status, cadastro, edição, atualização de status e remoção.

---

## Requirements

### Requirement: Navegação para Contas Recorrentes
O sistema SHALL exibir um item "Contas Recorrentes" na `Sidebar`, apontando para `/contas-recorrentes`, seguindo o mesmo padrão visual dos itens existentes (Resumo, Despesas, Receitas, Patrimônio).

#### Scenario: Item de navegação ativo na rota correspondente
- **WHEN** o usuário está em `/contas-recorrentes`
- **THEN** o item "Contas Recorrentes" na `Sidebar` é exibido com o estilo de item ativo

### Requirement: Listagem de contas recorrentes
O sistema SHALL exibir, em `/contas-recorrentes`, todas as contas recorrentes do usuário autenticado, consumindo `GET /api/v1/contas-recorrentes`, com colunas: Descrição, Categoria, Valor padrão (em BRL), Dia de vencimento, Vigência (início/fim) e Status.

#### Scenario: Contas recorrentes carregando exibem skeletons
- **WHEN** a página é acessada e a requisição à API está em andamento
- **THEN** a tabela exibe linhas de `Skeleton` no lugar dos dados reais

#### Scenario: Lista de contas recorrentes preenchida
- **WHEN** a API retorna contas recorrentes
- **THEN** a tabela exibe uma linha por conta, com o valor formatado em BRL e a vigência formatada (ex: "jan/2026 – dez/2029" ou "desde jan/2026" quando não houver `competenciaFim`)

#### Scenario: Lista vazia
- **WHEN** a API retorna lista vazia
- **THEN** a tabela é substituída por uma mensagem de estado vazio convidando o usuário a cadastrar a primeira conta recorrente

### Requirement: Filtro por status
O sistema SHALL permitir filtrar a listagem por `status` (`ATIVA`, `PAUSADA`, `ENCERRADA`), persistindo o filtro ativo como query param na URL.

#### Scenario: Filtro por status aplicado
- **WHEN** o usuário seleciona o status "PAUSADA" no filtro
- **THEN** a URL é atualizada com `?status=PAUSADA` e a tabela exibe apenas contas com esse status

### Requirement: Cadastrar conta recorrente
O sistema SHALL exibir um botão "Nova Conta Recorrente" que abre um dialog com formulário (`descricao`, `valorPadrao`, `categoria`, `diaVencimento` opcional, `competenciaInicio`, `competenciaFim` opcional), validado com zod, e SHALL chamar `POST /api/v1/contas-recorrentes` ao submeter. O campo `valorPadrao` SHALL usar um input com máscara de moeda BRL (`R$ 0,00`).

#### Scenario: Cadastro bem-sucedido fecha o dialog e atualiza a lista
- **WHEN** o usuário preenche o formulário com dados válidos e submete
- **THEN** o dialog fecha, um toast de sucesso é exibido e a listagem é atualizada com a nova conta

#### Scenario: Erro de validação impede submissão
- **WHEN** o usuário tenta submeter o formulário sem preencher `descricao` ou com `valorPadrao` menor ou igual a zero
- **THEN** o formulário exibe mensagens de erro inline e não chama a API

#### Scenario: competenciaFim anterior a competenciaInicio bloqueia submissão
- **WHEN** o usuário informa uma `competenciaFim` anterior à `competenciaInicio`
- **THEN** o formulário exibe erro de validação e não chama a API

#### Scenario: Erro da API exibe toast
- **WHEN** a API retorna erro ao cadastrar
- **THEN** um toast de erro é exibido com a mensagem retornada pela API, e o dialog permanece aberto

#### Scenario: Campo Valor Padrão formata em tempo real durante a digitação
- **WHEN** o usuário digita dígitos no campo Valor Padrão do formulário de nova conta recorrente
- **THEN** o campo exibe o valor formatado como moeda brasileira (ex.: `R$ 123,45`) conforme o usuário digita

### Requirement: Editar conta recorrente
O sistema SHALL permitir editar uma conta recorrente existente através de um dialog pré-preenchido, chamando `PUT /api/v1/contas-recorrentes/{id}` ao submeter. O campo `valorPadrao` SHALL usar um input com máscara de moeda BRL, já exibindo o valor atual formatado ao abrir o dialog.

#### Scenario: Edição bem-sucedida atualiza a lista
- **WHEN** o usuário edita os campos e submete com dados válidos
- **THEN** o dialog fecha, um toast de sucesso é exibido e a linha correspondente na tabela reflete os novos valores

#### Scenario: Dialog de edição abre com o Valor Padrão já formatado
- **WHEN** o usuário abre o dialog de edição de uma conta recorrente existente
- **THEN** o campo Valor Padrão já exibe o valor atual formatado como moeda (ex.: `R$ 1.234,56`)

### Requirement: Atualizar status da conta recorrente
O sistema SHALL permitir alternar o status de uma conta recorrente (pausar, reativar, encerrar) diretamente na tabela, chamando `PATCH /api/v1/contas-recorrentes/{id}/status`.

#### Scenario: Pausar conta recorrente pela tabela
- **WHEN** o usuário aciona a ação "Pausar" em uma conta com status `ATIVA`
- **THEN** a API é chamada com `{"status":"PAUSADA"}`, um toast de sucesso é exibido e a linha atualiza o status exibido sem recarregar a página

### Requirement: Remover conta recorrente
O sistema SHALL permitir remover uma conta recorrente, com confirmação antes da remoção, chamando `DELETE /api/v1/contas-recorrentes/{id}`.

#### Scenario: Remoção bem-sucedida
- **WHEN** o usuário confirma a remoção de uma conta recorrente
- **THEN** a API é chamada, um toast de sucesso é exibido e a linha desaparece da tabela

#### Scenario: Remoção cancelada não chama a API
- **WHEN** o usuário abre a confirmação de remoção e cancela
- **THEN** nenhuma chamada é feita à API e a conta permanece na tabela
