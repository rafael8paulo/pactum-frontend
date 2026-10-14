## Purpose

Comportamento da aplicação quando a rede do celular falha ou oscila: manter os dados já carregados visíveis e rotulados como salvos, comunicar a perda de conexão e oferecer um caminho único de recuperação em vez de uma tela indisponível.

## ADDED Requirements

### Requirement: Indicação de ausência de conexão
O sistema SHALL exibir um aviso persistente enquanto o dispositivo estiver sem conexão e SHALL removê-lo automaticamente quando a conexão for restabelecida.

#### Scenario: Aviso exibido ao perder conexão
- **WHEN** o dispositivo perde conexão com a rede enquanto o usuário navega na aplicação
- **THEN** um aviso persistente informa a ausência de conexão e que os dados exibidos são os últimos salvos

#### Scenario: Aviso removido ao reconectar
- **WHEN** a conexão é restabelecida
- **THEN** o aviso deixa de ser exibido e os dados da competência ativa são revalidados

### Requirement: Dados em cache permanecem utilizáveis
O sistema SHALL exibir os dados previamente carregados quando uma requisição falhar por indisponibilidade de rede, em vez de substituir a tela por um estado de erro, e SHALL rotular esses dados com o instante em que foram obtidos.

#### Scenario: Falha de rede preserva os dados exibidos
- **WHEN** a revalidação de uma listagem falha por ausência de conexão e há dados previamente carregados para aquela competência
- **THEN** os dados anteriores permanecem visíveis e são rotulados com a data e hora em que foram obtidos

#### Scenario: Falha de rede sem dados anteriores exibe erro recuperável
- **WHEN** a requisição falha por ausência de conexão e não há dados previamente carregados
- **THEN** um estado de erro é exibido com uma única ação primária de nova tentativa

#### Scenario: Cache sobrevive ao recarregamento da aplicação
- **WHEN** o usuário recarrega a aplicação sem conexão após já ter carregado uma competência
- **THEN** os dados daquela competência são exibidos a partir do cache persistido, rotulados como salvos

#### Scenario: Cache expirado não é exibido
- **WHEN** o cache persistido é mais antigo que o prazo máximo definido para dados financeiros
- **THEN** o cache é descartado e a aplicação trata a competência como não carregada

### Requirement: Mutações offline não são silenciosamente perdidas
O sistema SHALL informar ao usuário, de forma explícita, quando uma ação de escrita não puder ser enviada por ausência de conexão, e SHALL reverter o efeito visual da ação.

#### Scenario: Alteração de status sem conexão é revertida e comunicada
- **WHEN** o usuário marca uma despesa como paga estando sem conexão
- **THEN** o status exibido retorna ao valor anterior e uma notificação informa que a alteração não foi enviada

#### Scenario: Criação sem conexão mantém o rascunho
- **WHEN** o usuário tenta salvar um lançamento estando sem conexão
- **THEN** o painel de criação permanece aberto com os dados preenchidos e uma notificação informa a falha

### Requirement: Cache persistido é descartado ao encerrar a sessão
O sistema MUST remover do armazenamento do dispositivo todo dado financeiro em cache quando a sessão for encerrada, de modo que dados de um usuário não fiquem acessíveis após o logout ou para um usuário seguinte no mesmo dispositivo.

#### Scenario: Logout limpa o cache persistido
- **WHEN** o usuário encerra a sessão
- **THEN** nenhum dado financeiro do usuário permanece no armazenamento do dispositivo

#### Scenario: Sessão expirada limpa o cache persistido
- **WHEN** a API responde que a sessão não é mais válida e o usuário é direcionado ao login
- **THEN** o cache persistido é descartado antes da exibição da tela de login

#### Scenario: Credenciais e dados de sessão não são persistidos
- **WHEN** o cache é gravado no armazenamento do dispositivo
- **THEN** ele não contém credenciais, tokens ou qualquer dado de autenticação
