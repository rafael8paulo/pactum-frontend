## MODIFIED Requirements

### Requirement: Toaster de notificações configurado globalmente
O sistema SHALL ter o componente `Toaster` de sonner (via shadcn) configurado no layout raiz, de modo que qualquer componente possa exibir notificações de sucesso, erro ou informação ao usuário. Em viewports menores que 768px, as notificações SHALL ser posicionadas acima da barra de abas, sem encobri-la, e SHALL ser anunciadas por tecnologias assistivas sem roubar o foco do teclado.

#### Scenario: Toast de sucesso exibido após ação bem-sucedida
- **WHEN** uma mutation bem-sucedida solicita uma notificação de sucesso
- **THEN** uma notificação de sucesso aparece na tela por alguns segundos e desaparece automaticamente

#### Scenario: Toast de erro exibido ao falhar requisição de API
- **WHEN** uma requisição à Pactum API falha e o handler solicita uma notificação de erro
- **THEN** uma notificação de erro aparece na tela e o usuário entende que a ação não foi concluída

#### Scenario: Notificação não encobre a navegação em mobile
- **WHEN** uma notificação é exibida em uma viewport menor que 768px
- **THEN** ela é posicionada acima da barra de abas, mantendo os quatro destinos e a ação de criação visíveis e acionáveis

#### Scenario: Notificação é anunciada sem roubar o foco
- **WHEN** uma notificação é exibida enquanto o usuário preenche um formulário
- **THEN** a notificação é anunciada por tecnologias assistivas e o foco permanece no campo em edição

### Requirement: Skeletons de loading padronizados
O sistema SHALL usar skeletons para indicar estados de carregamento em listas e cards enquanto os dados da API ainda não chegaram, exibindo múltiplos skeletons empilhados que reproduzem a estrutura e a altura do conteúdo real. Nenhuma listagem SHALL substituir a página inteira por um indicador de carregamento: os controles de navegação, filtro e competência da página SHALL permanecer renderizados e utilizáveis durante o carregamento.

#### Scenario: Skeleton exibido enquanto dados carregam
- **WHEN** um componente de listagem está carregando dados
- **THEN** o componente exibe skeletons no lugar do conteúdo real

#### Scenario: Skeleton substituído pelo conteúdo ao carregar
- **WHEN** os dados da API chegam e o carregamento termina
- **THEN** os skeletons são substituídos pelo conteúdo real sem flickering perceptível

#### Scenario: Controles permanecem utilizáveis durante o carregamento
- **WHEN** a listagem de uma competência está carregando
- **THEN** o seletor de competência, os filtros e a navegação permanecem renderizados e acionáveis

#### Scenario: Troca de competência não desloca o layout
- **WHEN** o usuário altera a competência e a nova listagem começa a carregar
- **THEN** a posição vertical dos controles da página permanece inalterada entre o estado carregado e o estado de skeleton

## ADDED Requirements

### Requirement: Confirmação reversível para mutações de baixo risco
O sistema SHALL oferecer uma ação de desfazer na notificação de sucesso de mutações reversíveis de baixo risco — alteração de status de despesa e criação de lançamento — disponível por no mínimo 5 segundos. Acionar desfazer SHALL restaurar o estado anterior via API e confirmar a reversão ao usuário.

#### Scenario: Notificação de alteração de status oferece desfazer
- **WHEN** o status de uma despesa é alterado com sucesso
- **THEN** a notificação exibida inclui uma ação de desfazer acionável por ao menos 5 segundos

#### Scenario: Desfazer restaura o estado anterior
- **WHEN** o usuário aciona a ação de desfazer em uma alteração de status
- **THEN** o status anterior é restaurado via API, a listagem reflete a reversão e o usuário recebe confirmação

#### Scenario: Ação destrutiva não usa desfazer no lugar de confirmação
- **WHEN** o usuário aciona a remoção de um lançamento
- **THEN** uma confirmação prévia é exigida, e a remoção não é oferecida apenas com desfazer posterior

#### Scenario: Falha ao desfazer é comunicada
- **WHEN** a requisição de reversão falha
- **THEN** o estado exibido reflete o valor efetivamente persistido e uma notificação de erro é exibida
