## Purpose

Orientação para a conta recém-criada, que hoje cai num dashboard zerado sem indicação do que fazer: um roteiro curto de configuração inicial derivado do estado real dos dados e estados vazios que oferecem a próxima ação.

## ADDED Requirements

### Requirement: Roteiro de configuração inicial
O sistema SHALL exibir, no topo de `/inicio`, um roteiro de configuração com três passos — cadastrar forma de pagamento, informar renda mensal e cadastrar contas fixas — indicando quantos passos estão concluídos e o progresso correspondente. Cada passo pendente SHALL ser acionável e levar diretamente ao fluxo que o conclui.

#### Scenario: Roteiro exibido em conta sem dados
- **WHEN** um usuário autenticado sem formas de pagamento, sem receitas e sem contas recorrentes acessa `/inicio`
- **THEN** o roteiro é exibido com os três passos pendentes e progresso de 0 de 3

#### Scenario: Passo concluído é marcado
- **WHEN** o usuário possui ao menos uma forma de pagamento cadastrada
- **THEN** o passo "Cadastrar forma de pagamento" é exibido como concluído e o progresso indica 1 de 3

#### Scenario: Passo pendente leva ao fluxo correspondente
- **WHEN** o usuário aciona o passo "Informar sua renda mensal"
- **THEN** o fluxo de criação de receita é aberto

#### Scenario: Roteiro desaparece quando tudo está concluído
- **WHEN** os três passos estão concluídos
- **THEN** o roteiro deixa de ser exibido em `/inicio` e não reaparece em acessos seguintes

#### Scenario: Estado do roteiro deriva dos dados, não de preferência local
- **WHEN** o usuário acessa a aplicação em outro dispositivo com os mesmos dados
- **THEN** o roteiro apresenta o mesmo progresso, sem depender de estado armazenado no dispositivo anterior

### Requirement: Estado vazio acionável por rota
O sistema SHALL exibir, em cada listagem sem itens, um estado vazio contendo título contextualizado com a competência ou o escopo em questão, uma frase explicativa e uma ação primária que inicia o fluxo de criação correspondente.

#### Scenario: Lançamentos vazios na competência
- **WHEN** a competência ativa não possui lançamentos do tipo selecionado
- **THEN** um estado vazio é exibido nomeando a competência e oferecendo a ação de adicionar lançamento

#### Scenario: Ação do estado vazio abre o fluxo correto
- **WHEN** o usuário aciona a ação primária do estado vazio de receitas
- **THEN** o painel de criação é aberto com o tipo "Receita" selecionado

#### Scenario: Estado vazio distingue lista vazia de busca sem resultado
- **WHEN** a competência possui lançamentos mas nenhum corresponde ao termo buscado
- **THEN** o estado vazio informa que nada foi encontrado para o termo e oferece limpar a busca, em vez de oferecer a criação de um lançamento
