## Purpose

Interface para o usuário definir sua meta mensal de economia, acompanhar progresso e projeção, receber feedback e celebrar marcos, além de consultar o histórico de desempenho.

## Requirements

### Requirement: Card de meta na tela inicial
A tela `/inicio` SHALL exibir um card "Meta de economia" para a competência selecionada. Quando a API responde `404` (sem meta), o card SHALL exibir um chamado para ação "Definir meta" levando ao formulário. Quando há meta, o card SHALL exibir barra de progresso, `valorEconomizado` e `valorMeta` em moeda BRL, percentual, `valorRestante`, `diasRestantes`, `valorDiarioNecessario` e `projecaoFechamento`. A barra SHALL ser limitada visualmente a 100% mesmo que o `percentual` seja maior. Durante o carregamento SHALL exibir skeleton e em erro (≠404) SHALL exibir estado de erro com nova tentativa.

#### Scenario: Competência sem meta
- **WHEN** o usuário abre `/inicio` e `GET /api/v1/metas-economia/{competencia}` retorna `404`
- **THEN** o card mostra o texto de incentivo e o botão "Definir meta"

#### Scenario: Meta em andamento
- **WHEN** a API retorna `valorMeta: 1000`, `valorEconomizado: 600`, `percentual: 60`, `valorRestante: 400`, `diasRestantes: 10` e `valorDiarioNecessario: 40`
- **THEN** o card mostra "60%", a barra preenchida em 60% e o texto indicando R$ 40,00 por dia por 10 dias

#### Scenario: Meta superada
- **WHEN** a API retorna `percentual: 120`
- **THEN** o rótulo mostra "120%" e a barra permanece em 100%

### Requirement: Definir, ajustar e remover meta
A página `/mais/metas-economia` SHALL oferecer formulário com campo de valor monetário (máscara de moeda existente) validado como maior que zero, que chama `PUT /api/v1/metas-economia/{competencia}` para criar ou ajustar a meta, exibindo toast de sucesso e atualizando o card e a página. SHALL oferecer ação de remover (com confirmação) que chama `DELETE`. O botão de envio SHALL ficar em estado de carregamento durante a requisição. Erros da API SHALL ser exibidos via toast usando a extração de erro existente. Para competências anteriores ao mês corrente, formulário e remoção SHALL ficar indisponíveis (somente leitura).

#### Scenario: Criar meta
- **WHEN** o usuário informa R$ 1.000,00 e envia o formulário para o mês corrente
- **THEN** a requisição `PUT` é enviada com `valor: 1000`, um toast de sucesso é exibido e o progresso da meta passa a ser mostrado

#### Scenario: Valor inválido
- **WHEN** o usuário envia o formulário com valor vazio ou zero
- **THEN** a mensagem de validação é exibida e nenhuma requisição é feita

#### Scenario: Remover meta
- **WHEN** o usuário confirma a remoção da meta do mês corrente
- **THEN** `DELETE` é enviado e a tela volta ao estado "sem meta"

#### Scenario: Mês passado é somente leitura
- **WHEN** a competência selecionada é anterior ao mês corrente
- **THEN** o formulário de edição e a ação de remover não são exibidos

### Requirement: Feedback contextual por status
A UI SHALL exibir uma mensagem contextual conforme `status`: `ADIANTADA` (ex.: "Você está à frente do planejado"), `NO_PLANEJADO` ("Você está no ritmo certo"), `EM_RISCO` (alerta indicando o `valorDiarioNecessario` para recuperar) e `CONCLUIDA` (parabenização). O estilo visual SHALL diferenciar os estados sem depender apenas de cor (ícone e texto).

#### Scenario: Em risco
- **WHEN** `status` é `EM_RISCO` e `valorDiarioNecessario` é 85
- **THEN** a mensagem alerta que é preciso economizar cerca de R$ 85,00 por dia, com ícone de alerta

#### Scenario: Concluída
- **WHEN** `status` é `CONCLUIDA`
- **THEN** a mensagem parabeniza o usuário por atingir a meta

### Requirement: Celebração de marcos
Ao carregar o progresso, a UI SHALL comparar `marcosAtingidos` com os marcos já celebrados para a competência, armazenados no `localStorage`, e SHALL exibir uma celebração (toast com mensagem do marco) uma única vez por marco novo, registrando-o em seguida. Falhas de acesso ao `localStorage` SHALL ser ignoradas sem quebrar a tela. A UI SHALL também destacar visualmente na barra os marcos 25/50/75/100%.

#### Scenario: Novo marco atingido
- **WHEN** a API retorna `marcosAtingidos: [25, 50]` e apenas o marco 25 foi celebrado antes
- **THEN** uma celebração para 50% é exibida e o marco 50 é registrado como celebrado

#### Scenario: Marco já celebrado
- **WHEN** todos os marcos retornados já estão registrados como celebrados
- **THEN** nenhuma celebração é exibida

#### Scenario: Storage indisponível
- **WHEN** o acesso ao `localStorage` lança exceção
- **THEN** a tela renderiza normalmente e nenhuma exceção é propagada

### Requirement: Histórico de desempenho
A página `/mais/metas-economia` SHALL exibir o histórico do ano consumindo `GET /api/v1/metas-economia/historico?ano=`, com um item por mês contendo meta, valor economizado, percentual e indicador de atingida/não atingida, e um gráfico de barras meta × economizado. O usuário SHALL poder alternar o ano. SHALL exibir a variação do percentual em relação ao mês anterior quando ambos existirem. Sem dados, SHALL exibir estado vazio incentivando a definir a primeira meta.

#### Scenario: Histórico com meses
- **WHEN** a API retorna dois meses, um atingido e outro não
- **THEN** a lista mostra os dois com os indicadores corretos e o gráfico com duas categorias

#### Scenario: Histórico vazio
- **WHEN** a API retorna lista vazia
- **THEN** o estado vazio é exibido com ação para definir a meta do mês

### Requirement: Layout responsivo e acessível
Card e página SHALL funcionar em layout mobile-first, com barra de progresso exposta com `role="progressbar"` e `aria-valuenow`, e alvos de toque adequados.

#### Scenario: Acessibilidade da barra
- **WHEN** a barra de progresso é renderizada com percentual 60
- **THEN** o elemento possui `role="progressbar"` com `aria-valuenow="60"`
