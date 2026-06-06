## ADDED Requirements

### Requirement: Toaster de notificações configurado globalmente
O sistema SHALL ter o componente `Toaster` de sonner (via shadcn) configurado no layout raiz, de modo que qualquer componente possa chamar `toast.success()`, `toast.error()` ou `toast.info()` e exibir notificações ao usuário.

#### Scenario: Toast de sucesso exibido após ação bem-sucedida
- **WHEN** uma mutation bem-sucedida chama `toast.success('Mensagem')`
- **THEN** uma notificação de sucesso aparece na tela por alguns segundos e desaparece automaticamente

#### Scenario: Toast de erro exibido ao falhar requisição de API
- **WHEN** uma requisição à Pactum API falha e o handler chama `toast.error('Mensagem')`
- **THEN** uma notificação de erro aparece na tela e o usuário entende que a ação não foi concluída

### Requirement: Skeletons de loading padronizados
O sistema SHALL usar o componente `Skeleton` do shadcn para indicar estados de carregamento em listas e cards enquanto os dados da API ainda não chegaram. O padrão SHALL ser exibir múltiplos skeletons empilhados para simular a estrutura do conteúdo real.

#### Scenario: Skeleton exibido enquanto dados carregam
- **WHEN** um componente está com `isLoading: true` no hook TanStack Query
- **THEN** o componente exibe skeletons no lugar do conteúdo real

#### Scenario: Skeleton substituído pelo conteúdo ao carregar
- **WHEN** os dados da API chegam e `isLoading` muda para `false`
- **THEN** os skeletons são substituídos pelo conteúdo real sem flickering perceptível

### Requirement: EmptyState padronizado para listas sem dados
O sistema SHALL ter um componente `EmptyState` (ou padrão de implementação inline) que exibe uma mensagem clara e amigável quando uma lista não possui itens para o período selecionado.

#### Scenario: EmptyState exibido quando lista está vazia
- **WHEN** a API retorna uma lista vazia para a competência selecionada
- **THEN** o componente exibe uma mensagem descritiva indicando que não há dados (ex: "Nenhuma despesa encontrada para 2025-07") em vez de uma tabela vazia ou tela em branco

#### Scenario: EmptyState não exibido durante loading
- **WHEN** os dados ainda estão sendo carregados
- **THEN** o EmptyState não é exibido; apenas os skeletons de loading são mostrados
