## Purpose

Define a suíte de testes end-to-end do frontend, executada contra a stack local completa (frontend, API e Postgres), para detectar regressões nos fluxos principais do usuário antes do deploy.

## ADDED Requirements

### Requirement: Execução local contra a stack completa
O sistema SHALL permitir executar os testes e2e a partir de `pactum-frontend` com um único comando (`npm run test:e2e`) contra a stack local descrita em `docker-compose.local.yml`, usando `E2E_BASE_URL` como URL base e `http://localhost:3001` quando a variável não estiver definida.

#### Scenario: Execução com URL padrão
- **WHEN** a stack local está no ar e o desenvolvedor executa `npm run test:e2e` sem definir `E2E_BASE_URL`
- **THEN** os testes acessam o frontend em `http://localhost:3001`

#### Scenario: Execução com URL customizada
- **WHEN** o desenvolvedor define `E2E_BASE_URL` e executa `npm run test:e2e`
- **THEN** os testes acessam o frontend na URL informada

#### Scenario: Modo interativo
- **WHEN** o desenvolvedor executa `npm run test:e2e:ui`
- **THEN** a interface interativa do runner é aberta para os mesmos testes

#### Scenario: Testes unitários permanecem independentes
- **WHEN** o desenvolvedor executa `npm test`
- **THEN** apenas os testes unitários de `lib/**` são executados, sem iniciar o navegador

### Requirement: Isolamento de dados entre execuções
O sistema SHALL criar, a cada execução, um usuário de teste com e-mail único, de modo que os testes não dependam de dados pré-existentes nem colidam com execuções anteriores no mesmo banco.

#### Scenario: Execuções consecutivas no mesmo banco
- **WHEN** a suíte é executada duas vezes seguidas sem reiniciar o Postgres
- **THEN** ambas as execuções passam, cada uma com seu próprio usuário

### Requirement: Sessão autenticada reutilizável
O sistema SHALL autenticar o usuário de teste uma única vez por execução e reutilizar a sessão nos specs que exigem login, e SHALL excluir o estado salvo do controle de versão.

#### Scenario: Specs autenticados não repetem o login
- **WHEN** um spec de despesas, receitas, lançamentos ou resumo é executado
- **THEN** ele inicia já autenticado, sem passar pela tela de login

#### Scenario: Estado de sessão fora do Git
- **WHEN** o setup de autenticação grava a sessão em disco
- **THEN** o arquivo fica em `e2e/.auth/`, ignorado pelo Git

### Requirement: Cobertura de autenticação pela UI
A suíte SHALL cobrir pela interface o cadastro, o login, o logout e o bloqueio de rotas protegidas, sem usar a sessão reutilizável.

#### Scenario: Cadastro de novo usuário
- **WHEN** um visitante preenche nome, e-mail, senha e confirmação de senha válidos em `/cadastro` e envia o formulário
- **THEN** a API confirma o cadastro e o usuário consegue autenticar-se com as mesmas credenciais

#### Scenario: Cadastro com e-mail já existente
- **WHEN** um visitante cadastra um e-mail que já existe
- **THEN** o campo e-mail exibe o erro de e-mail já cadastrado

#### Scenario: Login com credenciais válidas
- **WHEN** um usuário cadastrado informa e-mail e senha corretos em `/login`
- **THEN** ele é redirecionado para a área autenticada

#### Scenario: Logout
- **WHEN** um usuário autenticado encerra a sessão
- **THEN** ele volta ao estado não autenticado

#### Scenario: Rota protegida sem sessão
- **WHEN** um visitante não autenticado acessa uma rota do dashboard
- **THEN** ele é redirecionado para `/login`

### Requirement: Cobertura smoke dos fluxos financeiros
A suíte SHALL cobrir pela interface os fluxos principais de despesas, receitas, lançamentos e resumo, verificando o resultado visível ao usuário.

#### Scenario: CRUD de despesa
- **WHEN** o usuário autenticado cria, edita e exclui uma despesa
- **THEN** cada operação é refletida na lista de despesas, e após a exclusão a despesa não aparece mais

#### Scenario: Criação de receita
- **WHEN** o usuário autenticado cria uma receita
- **THEN** a receita aparece na lista de receitas

#### Scenario: Agrupamento de lançamentos
- **WHEN** o usuário autenticado, em viewport mobile, possui despesas com status diferentes e abre a tela de lançamentos
- **THEN** cada despesa aparece apenas no grupo do seu status

#### Scenario: Resumo reflete os dados criados
- **WHEN** o usuário autenticado cria uma receita e uma despesa e abre o resumo
- **THEN** os totais exibidos correspondem aos valores criados

### Requirement: Diagnóstico de falhas
A suíte SHALL reter o trace de execução dos testes que falham e SHALL gerar relatório local, ambos excluídos do controle de versão.

#### Scenario: Teste falha
- **WHEN** um teste e2e falha
- **THEN** o trace da execução fica disponível para análise em `test-results/` e o relatório em `playwright-report/`, ambos ignorados pelo Git
