## MODIFIED Requirements

### Requirement: Cards de resumo mensal
O sistema SHALL exibir os totais financeiros da competência selecionada — Total Receitas, Total Despesas e Saldo — consumindo `GET /api/v1/resumo?competencia=YYYY-MM`. Em viewports de 768px ou mais, a apresentação SHALL ser de três cards. Em viewports menores que 768px, a apresentação SHALL ser um bloco único no qual o Saldo é o valor de maior destaque e Receitas e Despesas aparecem subordinados a ele, de modo que os três valores fiquem visíveis sem rolagem.

#### Scenario: Cards carregando exibem skeletons
- **WHEN** a página é acessada e a requisição ao endpoint mensal está em andamento
- **THEN** a apresentação ativa exibe skeletons com a mesma altura do conteúdo real, sem deslocamento de layout quando os dados chegam

#### Scenario: Cards exibem valores do mês
- **WHEN** a API retorna dados para a competência e a viewport tem 768px ou mais
- **THEN** três cards são exibidos com os valores formatados em BRL: Total Receitas, Total Despesas e Saldo

#### Scenario: Bloco único de saldo exibido em mobile
- **WHEN** a API retorna dados para a competência e a viewport é menor que 768px
- **THEN** um bloco único exibe o Saldo em destaque e os totais de Receitas e Despesas subordinados, todos formatados em BRL e visíveis sem rolagem

#### Scenario: Saldo positivo exibido em verde
- **WHEN** o saldo do mês é maior que zero
- **THEN** o valor do Saldo é exibido com o tratamento visual de resultado positivo, mantendo o contraste mínimo de WCAG 2.1 AA em ambos os temas

#### Scenario: Saldo negativo exibido em vermelho
- **WHEN** o saldo do mês é menor que zero
- **THEN** o valor do Saldo é exibido com o tratamento visual de resultado negativo, mantendo o contraste mínimo de WCAG 2.1 AA em ambos os temas

#### Scenario: Erro na requisição mensal exibe estado vazio
- **WHEN** a API retorna erro para o endpoint mensal
- **THEN** a apresentação exibe um estado de indisponibilidade sem quebrar a página

### Requirement: Gráfico de evolução anual
O sistema SHALL exibir a evolução de receitas e despesas ao longo do ano, consumindo `GET /api/v1/resumo/anual?ano=YYYY`. Em viewports de 768px ou mais, a apresentação SHALL ser o gráfico combinado com barras agrupadas (receitas e despesas) e linha (saldo), com tooltip por mês. Em viewports menores que 768px, a apresentação SHALL ser uma faixa compacta dos últimos seis meses com barras agrupadas de receitas e despesas, legenda textual e destaque do mês da competência ativa, sem depender de interação por tooltip.

#### Scenario: Gráfico carregando exibe skeleton
- **WHEN** a requisição ao endpoint anual está em andamento
- **THEN** um skeleton com a altura da apresentação ativa é exibido em seu lugar

#### Scenario: Gráfico exibe dados do ano
- **WHEN** a API retorna dados do histórico anual e a viewport tem 768px ou mais
- **THEN** o gráfico exibe barras agrupadas para receitas e despesas e uma linha para saldo para cada mês retornado

#### Scenario: Faixa de seis meses exibida em mobile
- **WHEN** a API retorna dados do histórico anual e a viewport é menor que 768px
- **THEN** são exibidos os seis meses mais recentes até a competência ativa, com barras de receita e despesa por mês, legenda textual e o mês da competência ativa destacado

#### Scenario: Eixo X mostra abreviações dos meses
- **WHEN** a apresentação é renderizada com dados
- **THEN** cada mês é rotulado com sua abreviação (Jan, Fev, Mar…) com base na competência de cada entrada

#### Scenario: Tooltip exibe valores formatados
- **WHEN** o usuário passa o cursor sobre uma barra ou ponto do gráfico em uma viewport de 768px ou maior
- **THEN** um tooltip exibe os valores de receitas, despesas e saldo do respectivo mês formatados em BRL

#### Scenario: Valores acessíveis sem hover em mobile
- **WHEN** o usuário visualiza a faixa de seis meses em mobile
- **THEN** os valores de receita e despesa do mês da competência ativa são legíveis em texto, sem exigir hover ou toque prolongado

### Requirement: Composição da página de resumo
O sistema SHALL exibir a página `/inicio` com os totais do mês e a evolução histórica sincronizados com a competência selecionada, substituindo as antigas `/resumo` e `/resumo-unificado`. Em viewports menores que 768px, a página SHALL exibir ainda um aviso acionável de despesas pendentes da competência e os lançamentos mais recentes, de modo que a informação de maior frequência de consulta fique acima da dobra.

#### Scenario: Página exibe dados da competência ativa
- **WHEN** o usuário navega para `/inicio` com `?competencia=YYYY-MM` na URL
- **THEN** os totais exibem o resumo do mês YYYY-MM e a evolução histórica considera o ano YYYY

#### Scenario: Competência sem parâmetro usa mês corrente
- **WHEN** o usuário navega para `/inicio` sem parâmetro `competencia`
- **THEN** a página usa o mês corrente como competência padrão

#### Scenario: Aviso de pendências é acionável
- **WHEN** a competência ativa possui despesas com status PENDENTE e a viewport é menor que 768px
- **THEN** um aviso exibe a quantidade e o valor total pendente e, ao ser acionado, leva à listagem de lançamentos filtrada por pendentes

#### Scenario: Aviso de pendências ausente quando não há pendências
- **WHEN** a competência ativa não possui despesas com status PENDENTE
- **THEN** nenhum aviso de pendências é exibido

#### Scenario: Saldo visível sem rolagem em mobile
- **WHEN** o usuário acessa `/inicio` em uma viewport de 390x844
- **THEN** o saldo do mês e os totais de receitas e despesas estão visíveis sem qualquer rolagem
