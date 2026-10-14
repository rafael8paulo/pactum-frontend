## REMOVED Requirements

### Requirement: Página de resumo unificado
**Reason**: A coexistência de `/resumo` e `/resumo-unificado` produzia dois destinos com o mesmo propósito e rótulos indistinguíveis na navegação — um dos atritos que este redesign elimina. A visão consolidada passa a ser a única página de visão geral, em `/inicio`.
**Migration**: `/resumo-unificado` passa a redirecionar permanentemente para `/inicio`, preservando o parâmetro `competencia`. Nenhuma funcionalidade é perdida: os totais do mês continuam em `/inicio` (capability `dashboard-resumo`) e as listas de despesas e receitas passam a viver em `/lancamentos` (capability `lancamentos-unificados-ui`).

### Requirement: Cards de totais do mês
**Reason**: Substituídos pelo bloco único de saldo de `/inicio`, definido na capability `dashboard-resumo`, que consome exatamente o mesmo `GET /api/v1/resumo?competencia=YYYY-MM`.
**Migration**: Nenhuma ação do usuário é necessária. A barra de percentual comprometido do card de Saldo passa a ser exibida no bloco de saldo de `/inicio`.

### Requirement: Painel de receitas do mês
**Reason**: A listagem de receitas passa a ter um único lugar na aplicação, `/lancamentos?tipo=receita`, eliminando a duplicação de comportamento entre `/receitas` e o painel do resumo unificado.
**Migration**: As ações de criar, editar e remover receita continuam disponíveis em `/lancamentos?tipo=receita`, com os mesmos endpoints.

### Requirement: Painel de despesas do mês com filtro de status
**Reason**: A listagem de despesas passa a ter um único lugar na aplicação, `/lancamentos?tipo=despesa`, com o filtro de status preservado e sincronizado com a URL.
**Migration**: O filtro de status continua disponível em `/lancamentos?tipo=despesa&status=<STATUS>`, agora por chips em mobile e pelo seletor existente em desktop.

### Requirement: Layout responsivo com abas em mobile
**Reason**: As abas locais desta página são substituídas pelo seletor de dois segmentos de `/lancamentos`, que é sincronizado com a URL e vale para toda a aplicação.
**Migration**: A alternância entre receitas e despesas passa a ser feita pelo parâmetro `?tipo=despesa|receita` em `/lancamentos`.
