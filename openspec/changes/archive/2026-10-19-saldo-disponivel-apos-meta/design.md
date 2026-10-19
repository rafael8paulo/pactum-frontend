# Design

## Context

- O saldo do mês aparece em `SaldoHero` (mobile) e no card "Saldo" de `ResumoCards` (desktop), ambos alimentados por `useResumoMensal` (`['resumo','mensal',competencia]`).
- A meta aparece em `MetaEconomiaCard`, via `useProgressoMeta` (`['metas-economia','progresso',competencia]`), que retorna `null` em `404`.
- No backend, `ProgressoMeta.valorEconomizado` é literalmente `resumoMensal.saldo()` da mesma competência (`MetaEconomiaService.consultar`).
- Mutations de receitas, despesas e metas já invalidam `['metas-economia']`, então o progresso se mantém atualizado quando lançamentos mudam.

## Goals / Non-Goals

**Goals:**
- Exibir "Disponível após a meta" acoplado visualmente ao saldo, nas duas apresentações (mobile e desktop).
- Cálculo isolado em função pura testável.

**Non-Goals:**
- Novo endpoint ou campo na API.
- Exibir o indicador fora de `/inicio` (ex.: página de metas, histórico).
- Considerar despesas pendentes/agendadas de forma separada — o saldo usado é o mesmo do card "Saldo".

## Decisions

1. **Fonte do cálculo: `valorEconomizado − valorMeta` do progresso da meta**, em vez de `resumo.saldo − meta.valor`.
   - Os dois valores vêm da mesma resposta, então nunca ficam dessincronizados entre duas queries em momentos diferentes de refetch.
   - `useProgressoMeta` já é chamado pelo `MetaEconomiaCard` na mesma página; o TanStack Query deduplica pela query key, sem requisição extra.
   - Alternativa considerada: combinar `useResumoMensal` + `useProgressoMeta` e subtrair `saldo − valorMeta`. Descartada por duplicar a fonte do saldo sem ganho (os valores são idênticos no backend).

2. **Componente próprio `SaldoAposMeta`** em `components/features/metas-economia/`, renderizado dentro de `SaldoHero` e do card "Saldo" de `ResumoCards`.
   - Mantém a regra de meta no domínio `metas-economia` e reaproveita o mesmo componente nas duas apresentações.
   - Retorna `null` enquanto carrega, em erro ou sem meta — sem skeleton, para não fazer o bloco de saldo "pular" quando o usuário não tem meta (caso comum).
   - Alternativa: um 4º card/bloco separado. Descartado: o valor só faz sentido lido ao lado do saldo, e mais um card disputa espaço com o card da meta logo abaixo.

3. **Função pura `saldoDisponivelAposMeta(progresso)`** em `lib/metas-economia/disponivel.ts`, retornando `{ valor, situacao: 'positivo' | 'zero' | 'negativo' }`, testada com `node --test` como os demais módulos de `lib/metas-economia/`. O componente mapeia `situacao` para `text-pos` / `text-muted-foreground` / `text-neg` via `cn()` e, no negativo, exibe "Saldo abaixo da meta".
   - Arredondar para centavos (`Math.round(x * 100) / 100`) antes de classificar, evitando `-0,00` por imprecisão de ponto flutuante.

4. **Acessibilidade:** o indicador é um par `dt/dd` (ou `p` com rótulo visível) — o texto "Disponível após a meta" é o rótulo; a cor nunca é o único sinal (o negativo tem sinal "-" e o texto auxiliar).

## Risks / Trade-offs

- [O erro da meta fica silencioso no bloco de saldo] → aceitável: o `MetaEconomiaCard` logo abaixo já exibe o estado de erro com nova tentativa.
- [Leve reflow quando o progresso chega depois do resumo] → o indicador é uma linha curta abaixo do saldo; impacto pequeno. Se incomodar, reservar altura apenas quando houver cache prévio de meta.
- [Competências passadas] → o indicador também aparece (valor final do mês vs meta); é informativo e coerente com o "Resultado final" do card da meta.
