## ADDED Requirements

### Requirement: Botão de gerar lançamentos do mês
O sistema SHALL exibir, em `/contas-recorrentes`, um botão "Gerar lançamentos de {competência}" (usando a competência ativa lida do `MonthPicker` global via query param), que ao ser clicado chama `POST /api/v1/contas-recorrentes/gerar?competencia={competencia}`.

#### Scenario: Rótulo do botão reflete a competência ativa
- **WHEN** a competência ativa no `MonthPicker` é `2026-08`
- **THEN** o botão exibe o texto "Gerar lançamentos de agosto/2026"

#### Scenario: Trocar a competência no MonthPicker atualiza o botão
- **WHEN** o usuário navega para o mês seguinte usando o `MonthPicker`
- **THEN** o texto do botão é atualizado para refletir a nova competência, sem disparar a geração automaticamente

### Requirement: Feedback do resultado da geração
Ao concluir a chamada de geração, o sistema SHALL exibir um toast informando quantas despesas foram criadas, e SHALL invalidar o cache de despesas para que a tela `/despesas` reflita os novos lançamentos na próxima visita.

#### Scenario: Geração cria novos lançamentos
- **WHEN** a API retorna uma lista com 3 despesas criadas
- **THEN** um toast de sucesso exibe "3 lançamentos gerados para agosto/2026" e a query `despesas` é invalidada

#### Scenario: Geração não cria nenhum lançamento novo
- **WHEN** a API retorna uma lista vazia (todas as contas já haviam sido geradas para a competência)
- **THEN** um toast informativo exibe que não havia lançamentos pendentes para gerar naquele mês

#### Scenario: Erro ao gerar exibe toast de erro
- **WHEN** a chamada à API falha
- **THEN** um toast de erro é exibido com a mensagem retornada pela API

### Requirement: Estado de carregamento durante a geração
O sistema SHALL desabilitar o botão de gerar lançamentos e exibir um indicador de carregamento enquanto a requisição estiver em andamento, evitando cliques duplicados.

#### Scenario: Botão desabilitado durante a requisição
- **WHEN** o usuário clica em "Gerar lançamentos" e a requisição ainda não retornou
- **THEN** o botão fica desabilitado e exibe um spinner até a resposta chegar
