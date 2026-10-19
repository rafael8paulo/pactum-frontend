# Spec Delta

## ADDED Requirements

### Requirement: Saldo disponível após a meta
A tela `/inicio` SHALL exibir, junto ao saldo do mês (bloco de saldo no mobile e card "Saldo" no desktop), o indicador "Disponível após a meta", calculado como `valorEconomizado − valorMeta` da competência selecionada e formatado em BRL. Valor positivo SHALL ser exibido em verde, zero em cor neutra e negativo em vermelho com texto informando que o saldo está abaixo da meta.

#### Scenario: Saldo acima da meta
- **WHEN** a competência tem meta com `valorMeta: 1000` e `valorEconomizado: 3000`
- **THEN** o indicador "Disponível após a meta" mostra R$ 2.000,00 em verde

#### Scenario: Saldo igual à meta
- **WHEN** a competência tem meta com `valorMeta: 1000` e `valorEconomizado: 1000`
- **THEN** o indicador mostra R$ 0,00 em cor neutra

#### Scenario: Saldo abaixo da meta
- **WHEN** a competência tem meta com `valorMeta: 1000` e `valorEconomizado: 600`
- **THEN** o indicador mostra -R$ 400,00 em vermelho e um texto indicando que o saldo está abaixo da meta

#### Scenario: Saldo negativo
- **WHEN** a competência tem meta com `valorMeta: 1000` e `valorEconomizado: -200`
- **THEN** o indicador mostra -R$ 1.200,00 em vermelho

### Requirement: Indicador oculto sem meta disponível
O indicador "Disponível após a meta" SHALL ser omitido quando a competência não tem meta (API responde `404`), enquanto o progresso da meta carrega ou quando a consulta da meta falha. Nesses casos o saldo do mês SHALL continuar sendo exibido normalmente, sem mensagem de erro adicional.

#### Scenario: Competência sem meta
- **WHEN** `GET /api/v1/metas-economia/{competencia}` retorna `404`
- **THEN** o saldo do mês é exibido e o indicador "Disponível após a meta" não aparece

#### Scenario: Erro ao consultar a meta
- **WHEN** a consulta da meta retorna erro diferente de `404`
- **THEN** o saldo do mês é exibido e o indicador não aparece

### Requirement: Indicador acompanha a meta atualizada
O indicador SHALL refletir o valor atual da meta: após definir, ajustar ou remover a meta da competência, a tela inicial SHALL exibir o indicador recalculado (ou ocultá-lo, se a meta foi removida) sem recarregar a página.

#### Scenario: Ajuste da meta
- **WHEN** o usuário ajusta a meta do mês de R$ 1.000,00 para R$ 1.500,00 com saldo de R$ 3.000,00 e volta à tela inicial
- **THEN** o indicador mostra R$ 1.500,00

#### Scenario: Remoção da meta
- **WHEN** o usuário remove a meta do mês e volta à tela inicial
- **THEN** o indicador não aparece
