# Spec: gerar-lote-lancamentos-recorrentes-ui

## Purpose

Ação por conta recorrente em `/contas-recorrentes` para gerar de uma vez todos os lançamentos de despesa pendentes de todo o intervalo de vigência da conta (não apenas do mês corrente), com feedback via toast e invalidação do cache de despesas.

---

## Requirements

### Requirement: Ação "Gerar tudo" por conta recorrente
Cada linha da tabela em `/contas-recorrentes` com `status = ATIVA` SHALL exibir uma ação "Gerar tudo", que ao ser clicada chama `POST /api/v1/contas-recorrentes/{id}/gerar-todos` para aquela conta.

#### Scenario: Ação visível para conta ativa
- **WHEN** uma conta recorrente na tabela tem `status = "ATIVA"`
- **THEN** a ação "Gerar tudo" é exibida e habilitada na linha dessa conta

#### Scenario: Ação oculta para conta pausada ou encerrada
- **WHEN** uma conta recorrente na tabela tem `status = "PAUSADA"` ou `status = "ENCERRADA"`
- **THEN** a ação "Gerar tudo" não é exibida na linha dessa conta

### Requirement: Rótulo mostra o intervalo que será gerado
O rótulo da ação SHALL indicar o intervalo de competências que será gerado, usando a mesma formatação já usada na coluna "Vigência" da tabela. Para contas sem `competenciaFim`, o intervalo exibido SHALL usar o mês atual como limite.

#### Scenario: Rótulo para conta com competenciaFim definida
- **WHEN** uma conta tem `competenciaInicio = "2026-01"` e `competenciaFim = "2026-04"`
- **THEN** o rótulo da ação exibe o intervalo "jan/26 – abr/26"

#### Scenario: Rótulo para conta indefinida usa o mês atual como fim
- **WHEN** uma conta tem `competenciaInicio = "2026-01"` e `competenciaFim = null`, e o mês atual é agosto/2026
- **THEN** o rótulo da ação exibe o intervalo até "ago/26"

### Requirement: Feedback do resultado da geração em lote
Ao concluir a chamada, o sistema SHALL exibir um toast informando quantas despesas foram criadas, e SHALL invalidar o cache de despesas.

#### Scenario: Geração em lote cria lançamentos
- **WHEN** a API retorna uma lista com 4 despesas criadas
- **THEN** um toast de sucesso exibe a contagem de lançamentos gerados e a query `despesas` é invalidada

#### Scenario: Geração em lote não cria nenhum lançamento novo
- **WHEN** a API retorna uma lista vazia (todas as competências do intervalo já haviam sido geradas)
- **THEN** um toast informativo indica que não havia lançamentos pendentes para gerar

#### Scenario: Erro ao gerar em lote exibe toast de erro
- **WHEN** a chamada à API falha
- **THEN** um toast de erro é exibido com a mensagem retornada pela API

### Requirement: Estado de carregamento da ação
O sistema SHALL exibir um indicador de carregamento na linha durante a chamada, evitando cliques duplicados na mesma conta.

#### Scenario: Ação desabilitada durante a requisição
- **WHEN** o usuário clica em "Gerar tudo" e a requisição ainda não retornou
- **THEN** a ação fica desabilitada/mostra um spinner até a resposta chegar
