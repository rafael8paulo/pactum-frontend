## Purpose

Shell de navegação para viewports móveis: uma barra de abas fixa com ação de criação sempre ao alcance do polegar, um hub para funções de baixa frequência e o baseline de acessibilidade e ergonomia de toque que vale para toda a experiência mobile da Pactum.

## ADDED Requirements

### Requirement: Barra de abas fixa em viewports móveis
O sistema SHALL exibir, em viewports menores que 768px e em todas as páginas autenticadas, uma barra de abas fixa na base da janela com exatamente quatro destinos — Início (`/inicio`), Lançamentos (`/lancamentos`), Recorrentes (`/recorrentes`) e Mais (`/mais`) — cada um com ícone e rótulo textual visível. A barra SHALL permanecer visível durante a rolagem do conteúdo.

#### Scenario: Abas exibidas em mobile
- **WHEN** um usuário autenticado acessa qualquer página do dashboard em uma viewport menor que 768px
- **THEN** uma barra fixa na base exibe os quatro destinos, cada um com ícone e rótulo textual

#### Scenario: Aba correspondente à rota ativa é destacada
- **WHEN** o usuário está em `/lancamentos`
- **THEN** a aba "Lançamentos" é destacada por cor e peso de fonte, e as demais abas não estão destacadas

#### Scenario: Rota aninhada mantém a aba raiz destacada
- **WHEN** o usuário está em `/mais/patrimonio`
- **THEN** a aba "Mais" permanece destacada

#### Scenario: Barra de abas não é exibida em desktop
- **WHEN** o usuário acessa qualquer página do dashboard em uma viewport de 768px ou maior
- **THEN** a barra de abas não é renderizada e a navegação lateral existente é exibida em seu lugar

#### Scenario: Barra de abas permanece visível durante a rolagem
- **WHEN** o usuário rola o conteúdo de uma página longa em mobile
- **THEN** a barra de abas permanece fixa e visível na base da janela

### Requirement: Ação de criação acessível a partir de qualquer aba
O sistema SHALL exibir, integrada à barra de abas, uma ação primária de criação de lançamento disponível a partir de qualquer uma das quatro abas, que abre o fluxo de criação rápida sem sair da rota atual.

#### Scenario: Ação de criação disponível em todas as abas
- **WHEN** o usuário está em qualquer uma das quatro abas em mobile
- **THEN** a ação de criação é exibida na barra de abas e é acionável

#### Scenario: Criação não altera a rota ativa
- **WHEN** o usuário está em `/recorrentes` e aciona a ação de criação
- **THEN** o fluxo de criação rápida é aberto sobre a página e a rota permanece `/recorrentes`

#### Scenario: Ação de criação é anunciada por leitores de tela
- **WHEN** um leitor de tela percorre a barra de abas
- **THEN** a ação de criação é anunciada com um nome acessível descritivo, e não apenas como "botão"

### Requirement: Hub de funções secundárias
O sistema SHALL oferecer a rota `/mais` como hub das funções de baixa frequência, contendo acesso a Patrimônio, Formas de Pagamento e Resumo Anual, as preferências de aparência e a ação de encerrar sessão.

#### Scenario: Hub lista as funções secundárias
- **WHEN** o usuário acessa `/mais`
- **THEN** a página exibe itens de navegação para Patrimônio, Formas de Pagamento e Resumo Anual, além das preferências de aparência

#### Scenario: Encerrar sessão exige confirmação
- **WHEN** o usuário aciona "Sair da conta" em `/mais`
- **THEN** uma confirmação é exibida antes de qualquer requisição, e a sessão só é encerrada após o usuário confirmar

#### Scenario: Encerrar sessão é visualmente separado das demais ações
- **WHEN** o usuário visualiza `/mais`
- **THEN** a ação de encerrar sessão é exibida em um agrupamento próprio, separada dos itens de navegação e das preferências

### Requirement: Ergonomia de toque mínima
O sistema SHALL garantir, em viewports móveis, área de toque de no mínimo 44x44 CSS pixels para todo controle interativo, e espaçamento mínimo de 8px entre controles interativos adjacentes que disparem ações distintas.

#### Scenario: Controles atendem à área mínima de toque
- **WHEN** qualquer controle interativo é renderizado em uma viewport móvel
- **THEN** sua área de toque efetiva é de ao menos 44x44 CSS pixels, ainda que o elemento visível seja menor

#### Scenario: Ação destrutiva não é adjacente à ação primária
- **WHEN** uma ação destrutiva e uma ação primária são exibidas na mesma linha em mobile
- **THEN** há ao menos 8px de separação entre suas áreas de toque

### Requirement: Conteúdo respeita áreas seguras do dispositivo
O sistema SHALL respeitar as áreas seguras do dispositivo, de modo que nem a barra de abas nem o conteúdo rolável fiquem obstruídos por recortes de tela, barra de gestos ou teclado virtual.

#### Scenario: Barra de abas acima do indicador de gestos
- **WHEN** a aplicação é exibida em um dispositivo com barra de gestos na base
- **THEN** o conteúdo interativo da barra de abas é renderizado acima da área reservada ao sistema

#### Scenario: Teclado virtual não encobre o campo em foco
- **WHEN** o usuário foca um campo de texto e o teclado virtual é exibido
- **THEN** o campo em foco permanece visível na viewport

### Requirement: Contraste e indicação de foco
O sistema SHALL atender a WCAG 2.1 AA para contraste em toda a experiência mobile — no mínimo 4.5:1 para texto normal e 3:1 para texto grande, ícones informativos e bordas de controles — em ambos os temas, e SHALL exibir indicador de foco visível em todo elemento focável.

#### Scenario: Contraste mínimo em ambos os temas
- **WHEN** qualquer texto ou ícone informativo é renderizado no tema claro ou escuro
- **THEN** a razão de contraste com o plano de fundo imediato atende ao mínimo de WCAG 2.1 AA

#### Scenario: Estado é comunicado além da cor
- **WHEN** o status de um lançamento é exibido
- **THEN** o status é identificável por texto, e não apenas pela cor

#### Scenario: Navegação por teclado exibe foco
- **WHEN** o usuário percorre a interface por teclado ou teclado externo
- **THEN** o elemento em foco exibe um indicador visível

### Requirement: Respeito a preferências de movimento reduzido
O sistema SHALL suprimir transições e animações não essenciais quando o usuário declarar preferência por movimento reduzido, mantendo todas as funcionalidades acessíveis.

#### Scenario: Movimento reduzido suprime animações
- **WHEN** o sistema operacional do usuário indica preferência por movimento reduzido
- **THEN** transições de abertura de painéis e de troca de abas são exibidas sem animação, e todas as ações continuam disponíveis
