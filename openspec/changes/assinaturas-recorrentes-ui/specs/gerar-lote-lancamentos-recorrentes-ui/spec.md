## MODIFIED Requirements

### Requirement: Ação "Gerar tudo" por conta recorrente
Cada linha da tabela em `/contas-recorrentes` com `status = ATIVA` e `frequencia` diferente de `SEMANAL` SHALL exibir uma ação "Gerar tudo", que ao ser clicada chama `POST /api/v1/contas-recorrentes/{id}/gerar-todos` para aquela conta.

#### Scenario: Ação visível para conta ativa mensal
- **WHEN** uma conta recorrente na tabela tem `status = "ATIVA"` e `frequencia = "MENSAL"`
- **THEN** a ação "Gerar tudo" é exibida e habilitada na linha dessa conta

#### Scenario: Ação oculta para conta pausada ou encerrada
- **WHEN** uma conta recorrente na tabela tem `status = "PAUSADA"` ou `status = "ENCERRADA"`
- **THEN** a ação "Gerar tudo" não é exibida na linha dessa conta

#### Scenario: Ação oculta para conta semanal
- **WHEN** uma conta recorrente na tabela tem `status = "ATIVA"` e `frequencia = "SEMANAL"`
- **THEN** a ação "Gerar tudo" não é exibida na linha dessa conta, pois o backend nunca gera despesa para essa frequência
