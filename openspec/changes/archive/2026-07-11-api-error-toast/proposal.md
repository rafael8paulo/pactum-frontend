## Why

Os hooks de mutation já exibem toasts de erro, mas com mensagens genéricas hardcoded (ex: "Erro ao cadastrar despesa. Tente novamente.") que ignoram qualquer contexto enviado pela API. Além disso, os formulários de autenticação exibem erros apenas inline, criando inconsistência com o restante da aplicação.

## What Changes

- Criar `lib/api/error.ts` com função `getErrorMessage` que extrai a mensagem do body da API (`{ message: "..." }`) ou retorna um fallback por código HTTP
- Substituir todas as mensagens hardcoded nos `onError` dos hooks de mutation para usar `getErrorMessage`
- `LoginForm` e `CadastroForm`: adicionar `toast.error()` além do erro inline já existente (belt-and-suspenders — inline para contexto visual, toast para visibilidade)
- `<Toaster />` já está no `app/layout.tsx` — apenas confirmar

## Capabilities

### New Capabilities

- `api-error-extraction`: Utilitário `getErrorMessage` — extrai mensagem legível de erros Axios com fallback por código HTTP; garante que nenhum stack trace ou mensagem técnica chega ao usuário

### Modified Capabilities

- `login-screen`: Erros de credenciais passam a exibir inline **e** toast (antes: apenas inline, "(não toast)")
- `cadastro-screen`: Erro 409 (email duplicado) passa a exibir inline **e** toast (antes: apenas inline)

## Impact

- **Arquivos novos**: `lib/api/error.ts`
- **Arquivos modificados**: `hooks/useDespesas.ts`, `hooks/useReceitas.ts`, `hooks/usePatrimonio.ts`, `components/features/auth/LoginForm.tsx`, `components/features/auth/CadastroForm.tsx`
- **Sem breaking changes**: os `onSuccess` existentes não são alterados; os erros inline continuam funcionando
- **Sem novas dependências**: usa apenas `axios` (já instalado) e `sonner` (já configurado)
