## Purpose

Fluxo de criação de despesa ou receita otimizado para uso em celular: valor como primeiro campo, competência herdada do contexto em vez de digitada, e caminho curto para registrar vários lançamentos em sequência.

## ADDED Requirements

### Requirement: Criação em painel único
O sistema SHALL oferecer, em viewports menores que 768px, um painel único de criação de lançamento que permite escolher entre despesa e receita sem sair do painel, e que é acessível a partir de qualquer aba sem alterar a rota atual.

#### Scenario: Painel abre com o tipo correspondente ao contexto
- **WHEN** o usuário está em `/lancamentos?tipo=receita` e aciona a criação
- **THEN** o painel abre com o tipo "Receita" já selecionado

#### Scenario: Tipo padrão fora do contexto de lançamentos
- **WHEN** o usuário aciona a criação a partir de `/inicio`
- **THEN** o painel abre com o tipo "Despesa" selecionado

#### Scenario: Troca de tipo preserva o que já foi preenchido
- **WHEN** o usuário preenche valor e descrição e então alterna de "Despesa" para "Receita"
- **THEN** valor e descrição permanecem preenchidos e apenas os campos exclusivos de despesa deixam de ser exibidos

#### Scenario: Fechar o painel descarta o rascunho
- **WHEN** o usuário fecha o painel com campos preenchidos e o abre novamente
- **THEN** o painel é exibido em estado inicial, sem os valores anteriores

### Requirement: Valor como primeiro campo, com teclado numérico
O sistema SHALL posicionar o campo de valor como o primeiro campo do painel de criação, com foco inicial, e SHALL fazer com que dispositivos móveis apresentem teclado numérico ao focá-lo. O valor SHALL ser formatado como moeda brasileira conforme o usuário digita.

#### Scenario: Foco inicial no campo de valor
- **WHEN** o painel de criação é aberto
- **THEN** o campo de valor está em foco e é o primeiro campo da ordem de leitura

#### Scenario: Teclado numérico ao focar o valor
- **WHEN** o usuário foca o campo de valor em um dispositivo móvel
- **THEN** o teclado apresentado é numérico

#### Scenario: Valor formatado durante a digitação
- **WHEN** o usuário digita dígitos no campo de valor
- **THEN** o campo exibe o valor formatado como moeda brasileira conforme a digitação

### Requirement: Competência derivada do contexto
O sistema SHALL preencher a competência do novo lançamento com a competência ativa na aplicação e exibi-la como valor legível — nunca como campo de texto livre no formato `AAAA-MM`. A competência SHALL permanecer alterável pelo mesmo seletor de competência usado no restante da aplicação.

#### Scenario: Competência herdada da competência ativa
- **WHEN** a competência ativa é `2026-09` e o usuário abre o painel de criação
- **THEN** o painel exibe a competência como "Set 2026" e o lançamento é criado com `competencia` igual a `2026-09`

#### Scenario: Competência não é campo de texto livre
- **WHEN** o painel de criação é exibido
- **THEN** não há campo de texto que exija digitação de competência no formato `AAAA-MM`

#### Scenario: Competência é alterável pelo seletor
- **WHEN** o usuário toca o valor de competência exibido no painel
- **THEN** o seletor de competência é aberto e a escolha passa a valer para o lançamento em criação

### Requirement: Categoria por chips de toque único
O sistema SHALL apresentar as categorias como chips selecionáveis com ícone e rótulo, exibindo as categorias mais usadas diretamente e oferecendo acesso às demais por um controle de expansão. A seleção de categoria SHALL ser concluída em um único toque quando a categoria estiver entre as exibidas.

#### Scenario: Categoria selecionada em um toque
- **WHEN** o usuário toca o chip "Serviços"
- **THEN** o chip passa a ser exibido como selecionado e nenhuma outra interação é necessária para definir a categoria

#### Scenario: Categorias restantes acessíveis
- **WHEN** o usuário aciona o controle de expansão de categorias
- **THEN** todas as categorias válidas para o tipo de lançamento ativo são exibidas e selecionáveis

#### Scenario: Chips refletem o tipo de lançamento
- **WHEN** o tipo ativo é "Receita"
- **THEN** apenas categorias de receita são oferecidas

### Requirement: Validação antes do envio com erro inline
O sistema SHALL impedir o envio de um lançamento inválido, exibindo a mensagem de erro junto ao campo correspondente e mantendo o painel aberto, sem depender de resposta da API para erros de preenchimento.

#### Scenario: Valor não positivo bloqueia o envio
- **WHEN** o usuário tenta salvar com valor igual a zero
- **THEN** uma mensagem de erro é exibida junto ao campo de valor, nenhuma requisição é feita e o painel permanece aberto

#### Scenario: Descrição vazia bloqueia o envio
- **WHEN** o usuário tenta salvar sem preencher a descrição
- **THEN** uma mensagem de erro é exibida junto ao campo de descrição e nenhuma requisição é feita

#### Scenario: Erro da API mantém o rascunho
- **WHEN** a API retorna erro ao criar o lançamento
- **THEN** o painel permanece aberto com os dados preenchidos e uma notificação de erro é exibida

### Requirement: Registro em sequência
O sistema SHALL oferecer, além da ação de salvar, uma ação que salva o lançamento e mantém o painel aberto pronto para um novo registro, preservando tipo, categoria e competência e limpando valor e descrição.

#### Scenario: Salvar e adicionar outro mantém o painel aberto
- **WHEN** o usuário aciona "Salvar e adicionar outro" com dados válidos
- **THEN** o lançamento é criado, o painel permanece aberto, valor e descrição são limpos e tipo, categoria e competência são preservados

#### Scenario: Foco retorna ao campo de valor
- **WHEN** um lançamento é salvo pela ação de registro em sequência
- **THEN** o foco retorna ao campo de valor

#### Scenario: Salvar simples fecha o painel
- **WHEN** o usuário aciona "Salvar" com dados válidos
- **THEN** o lançamento é criado, o painel é fechado, a lista da competência é atualizada e uma confirmação é exibida
