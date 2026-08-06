# Spec: api-error-extraction

## Purpose

Extração padronizada de mensagens de erro legíveis a partir de erros de API (Axios), usadas pelos hooks de mutation para exibir toasts consistentes e sem detalhes técnicos.

---

## Requirements

### Requirement: getErrorMessage extrai mensagem legível de erros de API
O sistema SHALL ter uma função `getErrorMessage(error: unknown, fallback?: string): string` em `lib/api/error.ts` que extrai uma mensagem de erro legível pelo usuário, nunca expondo stack trace ou detalhes técnicos.

#### Scenario: Mensagem do body da API é usada quando disponível
- **WHEN** o erro é um `AxiosError` com `error.response.data.message` sendo uma string não-vazia
- **THEN** `getErrorMessage` retorna essa string diretamente

#### Scenario: Fallback por status HTTP quando API não envia mensagem
- **WHEN** o erro é um `AxiosError` sem `message` no body, mas com status HTTP conhecido (400, 401, 403, 404, 409, 500)
- **THEN** `getErrorMessage` retorna uma mensagem amigável correspondente ao status (ex: 404 → "Registro não encontrado.")

#### Scenario: Fallback genérico para erros sem status HTTP mapeado
- **WHEN** o erro é um `AxiosError` com status não mapeado ou não é um `AxiosError`
- **THEN** `getErrorMessage` retorna o parâmetro `fallback` (default: "Ocorreu um erro. Tente novamente.")

### Requirement: Todos os hooks de mutation usam getErrorMessage no onError
O sistema SHALL ter todos os `useMutation` em `hooks/` usando `getErrorMessage(error)` no callback `onError`, substituindo qualquer mensagem hardcoded.

#### Scenario: Erro de API com mensagem exibe mensagem da API no toast
- **WHEN** uma mutation falha e a API retorna `{ "message": "Descrição específica do erro" }` no body
- **THEN** o toast de erro exibe "Descrição específica do erro"

#### Scenario: Erro de rede exibe mensagem genérica no toast
- **WHEN** uma mutation falha por timeout ou erro de rede sem resposta HTTP
- **THEN** o toast de erro exibe a mensagem genérica ("Ocorreu um erro. Tente novamente.")
