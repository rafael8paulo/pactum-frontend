## Context

Patrimônio é o domínio mais simples do MVP: três campos (`descricao`, `valor`, `competencia`), sem `categoria` nem `status`, e a API expõe apenas `listar`, `cadastrar` e `remover` — sem `atualizar`. O CLAUDE.md indica `PatrimonioCard` e `PatrimonioTotal` como os componentes esperados, sugerindo UI orientada a cards em vez de tabela.

Os tipos e o API client já existem. A página é um placeholder.

## Goals / Non-Goals

**Goals:**
- Implementar listagem de itens de patrimônio como grid de cards por competência
- Exibir card de total com a soma dos valores de todos os itens
- Implementar cadastro via dialog com formulário validado
- Implementar remoção com AlertDialog de confirmação
- Compor a página `/patrimonio` como Server Component async

**Non-Goals:**
- Dialog de edição — a API não expõe `PUT /api/v1/patrimonio/:id`
- Filtros — a API só aceita `competencia`
- Histórico/evolução patrimonial (requereria endpoint anual)

## Decisions

### 1. UI orientada a cards, não tabela

`PatrimonioCard` renderiza cada item como um `Card` com descrição e valor. Faz mais sentido para patrimônio (ativos individuais) do que uma tabela densa. O botão "Remover" fica dentro de cada card.

**Alternativa descartada**: tabela — inconsistente com o que o CLAUDE.md descreve e inadequada para ativos discretos com pouco atributos.

### 2. PatrimonioTotal como card separado acima do grid

`PatrimonioTotal` recebe `competencia` e exibe a soma de `valores` dos itens retornados. Usa o mesmo `usePatrimonio` hook para evitar segunda chamada à API.

**Alternativa descartada**: totalizar dentro do `PatrimonioCard` grid — não haveria como destacar visualmente o total sem prop drilling complexo.

### 3. Hook único usePatrimonio — sem mutations separadas por arquivo

Como patrimônio tem apenas `cadastrar` e `remover`, um único arquivo `usePatrimonio.ts` com os três exports é suficiente. Sem `useAtualizarPatrimonio`.

### 4. Formulário sem campo status/categoria

`PatrimonioForm` tem apenas três campos: `descricao`, `valor` (number via `valueAsNumber`), `competencia`. Schema zod alinhado com `CadastrarPatrimonioRequest`.

### 5. Página como Server Component async

`app/(dashboard)/patrimonio/page.tsx` lê `searchParams` para `competencia` com fallback `getCurrentCompetencia()`, e passa ambos para `PatrimonioTotal` e o grid de `PatrimonioCard`.

## Risks / Trade-offs

- **Lista de patrimônio pode ser grande** → sem paginação neste sprint; o volume por mês é gerenciável
- **API retorna `Patrimonio[]` diretamente** (sem wrapper) → hook tipa `useQuery<Patrimonio[]>` em vez de interface com `total`
