## 1. Utilitário getErrorMessage

- [x] 1.1 Criar `lib/api/error.ts` com função `getErrorMessage(error: unknown, fallback?: string): string`
- [x] 1.2 Implementar extração de `error.response.data.message` quando disponível (AxiosError com string não-vazia)
- [x] 1.3 Implementar fallbacks por status HTTP: 400, 401, 403, 404, 409, 500
- [x] 1.4 Implementar fallback genérico: "Ocorreu um erro. Tente novamente."

## 2. Atualizar hooks de mutation

- [x] 2.1 Atualizar `hooks/useDespesas.ts`: substituir mensagens hardcoded por `getErrorMessage(error)` em todos os `onError` (`useCadastrarDespesa`, `useAtualizarDespesa`, `useAtualizarStatusDespesa`, `useRemoverDespesa`)
- [x] 2.2 Atualizar `hooks/useReceitas.ts`: substituir mensagens hardcoded por `getErrorMessage(error)` em todos os `onError` (`useCadastrarReceita`, `useAtualizarReceita`, `useRemoverReceita`)
- [x] 2.3 Atualizar `hooks/usePatrimonio.ts`: substituir mensagens hardcoded por `getErrorMessage(error)` em todos os `onError` (`useCadastrarPatrimonio`, `useRemoverPatrimonio`)

## 3. Auth forms: adicionar toast de erro

- [x] 3.1 Atualizar `components/features/auth/LoginForm.tsx`: no catch do submit, chamar `toast.error(getErrorMessage(err))` além de definir o erro inline
- [x] 3.2 Atualizar `components/features/auth/CadastroForm.tsx`: no catch do submit, chamar `toast.error(getErrorMessage(err))` além de `setError('email', ...)` para 409; para outros erros, exibir toast genérico

## 4. Verificação final

- [x] 4.1 Confirmar que `<Toaster richColors position="top-right" />` está presente em `app/layout.tsx`
- [x] 4.2 Rodar `npx tsc --noEmit` e confirmar zero erros de tipagem
