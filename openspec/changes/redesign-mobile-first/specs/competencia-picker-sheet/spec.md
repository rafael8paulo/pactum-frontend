## Purpose

Seleção direta de qualquer mês do ano em um único toque, substituindo em mobile a navegação mês a mês por setas que exige um toque por mês percorrido.

## ADDED Requirements

### Requirement: Seleção de competência por grade de meses
O sistema SHALL oferecer, em viewports menores que 768px, um painel de seleção de competência contendo os doze meses do ano exibido em grade, no qual qualquer mês é selecionável em um único toque. A competência selecionada SHALL continuar sendo persistida como `?competencia=YYYY-MM` na URL.

#### Scenario: Painel aberto pelo indicador de competência
- **WHEN** o usuário toca o indicador de competência no cabeçalho em mobile
- **THEN** um painel é aberto exibindo os doze meses do ano da competência ativa em grade

#### Scenario: Mês distante selecionado em um toque
- **WHEN** a competência ativa é `2026-09` e o usuário toca "Jan" no painel
- **THEN** a URL passa a conter `?competencia=2026-01`, o painel é fechado e a página exibe dados de janeiro de 2026

#### Scenario: Mês da competência ativa é destacado
- **WHEN** a competência ativa é `2026-09` e o painel é aberto
- **THEN** o mês "Set" é exibido como selecionado e os demais não

#### Scenario: Demais parâmetros da URL são preservados
- **WHEN** o usuário está em `/lancamentos?tipo=despesa&status=PENDENTE` e seleciona outro mês
- **THEN** os parâmetros `tipo` e `status` permanecem na URL

### Requirement: Navegação entre anos
O sistema SHALL permitir navegar para o ano anterior e para o ano seguinte dentro do painel, atualizando a grade sem fechá-lo e sem alterar a competência ativa até que um mês seja escolhido.

#### Scenario: Ano anterior atualiza a grade
- **WHEN** o usuário aciona a navegação para o ano anterior
- **THEN** a grade passa a exibir os meses do ano anterior e a competência ativa permanece inalterada

#### Scenario: Meses posteriores ao mês corrente são distinguíveis
- **WHEN** a grade exibe o ano corrente
- **THEN** os meses posteriores ao mês corrente são exibidos com tratamento visual distinto, permanecendo selecionáveis

### Requirement: Atalhos de competência
O sistema SHALL oferecer, no painel de seleção, atalhos para o mês corrente e para o mês anterior, cada um definindo a competência em um único toque.

#### Scenario: Atalho para o mês corrente
- **WHEN** a competência ativa é `2026-03` e o usuário aciona o atalho "Este mês" em setembro de 2026
- **THEN** a competência passa a ser `2026-09` e o painel é fechado

#### Scenario: Atalho do mês corrente é destacado quando já ativo
- **WHEN** a competência ativa já é o mês corrente
- **THEN** o atalho "Este mês" é exibido em estado ativo

### Requirement: Navegação por setas preservada em desktop
O sistema SHALL manter, em viewports de 768px ou mais, a navegação mês a mês por setas já existente, sem exigir o painel de grade.

#### Scenario: Setas permanecem em desktop
- **WHEN** o usuário acessa o dashboard em uma viewport de 768px ou maior
- **THEN** o seletor de competência exibe os controles de mês anterior e próximo mês e continua atualizando `?competencia=YYYY-MM`
