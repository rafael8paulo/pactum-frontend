## Context

O Pactum Web é um frontend de controle de finanças pessoais. Este sprint cria o projeto do zero: não há código-fonte existente a migrar. A Pactum API (Spring Boot) já está disponível em `http://localhost:8080` e serve como única fonte de dados. O CLAUDE.md define as convenções que devem ser respeitadas em todo o projeto.

## Goals / Non-Goals

**Goals:**
- Criar o projeto Next.js 15 com App Router, TypeScript, Tailwind CSS e todas as dependências necessárias
- Estabelecer os tipos TypeScript que espelham os contratos da Pactum API
- Implementar o shell de navegação (Sidebar + Header + MonthPicker) reutilizável por todas as páginas de feature
- Configurar o sistema de feedback global (toasts, skeletons, empty states) para uso consistente pelas features

**Non-Goals:**
- Implementar qualquer lógica de negócio de feature (despesas, receitas, etc.) — isso é Sprint 2+
- Autenticação ou autorização — fora do escopo atual
- Testes automatizados — sprint focado em fundação de produto
- Deploy ou CI/CD — ambiente local apenas

## Decisions

### D1 — App Router (Next.js 15) com route group `(dashboard)`

Usar `app/(dashboard)/layout.tsx` como shell compartilhado. O route group evita que `(dashboard)` apareça na URL, mantendo `/resumo`, `/despesas`, etc. limpos. Alternativa (pages router) descartada por ser legada e não suportar Server Components nativamente.

### D2 — `competencia` no URL search param

O MonthPicker persiste o mês/ano selecionado como `?competencia=2025-07` na URL. Isso garante linkabilidade das páginas e compartilhamento de estado entre Sidebar e páginas sem precisar de store global. Alternativa (React Context global) descartada por tornar URLs não compartilháveis.

### D3 — Sonner como toast via shadcn

shadcn usa `sonner` como provider de toast por padrão desde 2024. Usar `toast()` de `sonner` diretamente (sem abstrações adicionais) para máxima simplicidade. Alternativa (`react-hot-toast`) descartada por ser redundante com o que shadcn já instala.

### D4 — Axios com instância centralizada em `lib/api/client.ts`

Toda comunicação HTTP passa pela instância Axios exportada de `lib/api/client.ts`. Isso permite configurar `baseURL`, `Content-Type` e futuros interceptors (ex: token de auth) em um único lugar. Uso direto de `fetch` é explicitamente proibido pelo CLAUDE.md.

### D5 — Tipos TypeScript escritos manualmente (não gerados por OpenAPI)

Os tipos serão escritos manualmente em `types/` seguindo os exemplos do CLAUDE.md. OpenAPI Generator foi descartado por adicionar complexidade de toolchain desnecessária neste momento; os contratos são estáveis e poucos.

### D6 — `next-themes` para tema claro/escuro

`ThemeProvider` de `next-themes` envolve o layout raiz. O seletor de tema pode ser adicionado no Header. Alternativa (CSS custom properties manuais) descartada por falta de integração com shadcn.

## Risks / Trade-offs

- [Risk] `MonthPicker` via URL param pode conflitar com navegação se o usuário usar o botão "voltar" do browser → Mitigação: aceitar comportamento padrão de browser; é o comportamento esperado.
- [Risk] Tipos manuais podem divergir da API se o contrato mudar → Mitigação: manter tipos alinhados com a documentação da Pactum API e revisá-los a cada sprint.
- [Risk] shadcn instala versões fixas de componentes; atualizações futuras exigem re-run do CLI → Mitigação: nunca editar `components/ui/` manualmente (regra do CLAUDE.md).
