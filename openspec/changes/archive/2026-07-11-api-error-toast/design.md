## Context

Todos os hooks de mutation já possuem `onError` com `toast.error()`, mas usam mensagens hardcoded que nunca refletem o contexto real do erro. A API pode retornar `{ "message": "Email já cadastrado" }` no body, mas o usuário vê apenas "Erro ao cadastrar despesa. Tente novamente." — informação inútil para diagnóstico.

Os formulários de autenticação (login e cadastro) também não emitem toast em caso de erro, criando inconsistência: ações do dashboard mostram toast, mas o fluxo de auth é silencioso para o sistema global de notificações.

## Goals / Non-Goals

**Goals:**
- Centralizar a lógica de extração de mensagem de erro em um único utilitário `getErrorMessage`
- Fazer com que todos os `onError` exibam mensagens da API quando disponíveis, com fallbacks inteligentes por código HTTP
- Auth forms: emitir `toast.error()` além do erro inline já existente
- Nunca expor stack trace, nome de classe Java ou mensagem técnica ao usuário

**Non-Goals:**
- Remover erros inline dos formulários de autenticação — ambos (inline + toast) coexistem
- Adicionar retry automático em requisições que falharam
- Error boundaries globais para erros de renderização
- Tratamento de erros de `useQuery` (queries já exibem estado de erro via UI)

## Decisions

### 1. Utilitário centralizado em `lib/api/error.ts`

**Decisão**: `getErrorMessage` fica em `lib/api/error.ts`, não duplicado em cada hook.

**Alternativa considerada**: Inline em cada hook — descartado por criar inconsistência e dificultar futuras mudanças na estratégia de mensagens.

**Rationale**: Uma mudança de behavior (ex: logar erros, mudar fallback) atinge todos os hooks sem tocar em cada arquivo.

### 2. Fallback por status HTTP, não mensagem genérica única

**Decisão**: `getErrorMessage` retorna mensagens específicas por status HTTP (400, 401, 403, 404, 409, 500) quando a API não envia `message` no body.

**Alternativa considerada**: Retornar sempre "Ocorreu um erro. Tente novamente." — descartado por ser menos informativo sem expor detalhes técnicos.

**Rationale**: "Registro não encontrado." é mais acionável para o usuário do que uma mensagem genérica, sem expor implementação.

### 3. Prioridade: `error.response.data.message` > status HTTP > fallback genérico

**Decisão**: A hierarquia de extração é: (1) body da API com `message` string não-vazia, (2) mapeamento por status HTTP, (3) fallback genérico passado como parâmetro.

**Rationale**: Permite que a API comunique contexto específico (ex: "Você já tem uma despesa com este nome") quando útil, sem depender disso para todos os erros.

### 4. Auth forms: inline + toast (não exclusivo)

**Decisão**: `LoginForm` e `CadastroForm` continuam exibindo erro inline (para contexto visual no campo) E passam a exibir `toast.error()` (para consistência com o restante da aplicação).

**Alternativa considerada**: Apenas inline nos formulários de auth — descartado porque o toast garante visibilidade se o usuário estiver com scroll na tela, e é o padrão de feedback da aplicação.

**Rationale**: Belt-and-suspenders: inline para quem está focado no formulário, toast para quem pode estar olhando para outro lado da tela.

## Risks / Trade-offs

- **[Trade-off] Toast + inline duplica feedback**: O usuário vê a mensagem duas vezes em auth forms. Aceitável — o inline desaparece quando o usuário digita, o toast desaparece por timeout. Sem ruído excessivo.
- **[Risco] API retornar mensagem técnica no `message`**: Se a API enviar `"NullPointerException: field 'email' is null"`, isso apareceria no toast. → Mitigação: a API deve enviar mensagens legíveis; se isso acontecer, é bug na API para corrigir na origem.
- **[Risco] Hooks existentes quebram tipagem**: `onError: () => {}` sem parâmetro de erro — ao adicionar `getErrorMessage(error)`, o tipo `error` precisa ser `unknown`. TanStack Query v5 já tipifica `error` como `Error` por padrão. → Mitigação: verificar no TypeScript check que a tipagem está correta.
