## 1. Tipos e API

- [x] 1.1 Criar `types/meta-economia.ts` (`ProgressoMeta`, `StatusMeta`, `HistoricoMetaItem`, `DefinirMetaRequest`) conforme contrato do backend e verificar com `npx tsc --noEmit`
- [x] 1.2 Criar `lib/api/metas-economia.ts` (`progresso`, `definir`, `remover`, `historico`) e verificar com testes/mocks do módulo ou `tsc`
- [x] 1.3 Criar `hooks/useMetasEconomia.ts` (`useProgressoMeta` tratando 404 como `null`, `useHistoricoMetas`, `useDefinirMeta`, `useRemoverMeta` com toasts e invalidação de `['metas-economia']`) e verificar com teste de hook cobrindo 200, 404 e erro
- [x] 1.4 Fazer mutations de receitas/despesas invalidarem `['metas-economia']` e verificar que o card atualiza após cadastrar uma despesa (teste ou verificação manual)

## 2. Lógica de apresentação

- [x] 2.1 Criar `lib/metas-economia/mensagens.ts` com `mensagemPorStatus` e verificar com testes unitários para os quatro status
- [x] 2.2 Criar `lib/metas-economia/marcos.ts` (leitura/escrita segura em `localStorage`, cálculo de marcos novos) e verificar com testes unitários incluindo storage lançando exceção

## 3. Componentes

- [x] 3.1 Criar `MetaProgressoBar` com `role="progressbar"`/`aria-valuenow`, limite visual de 100% e marcadores 25/50/75/100; verificar com teste de componente
- [x] 3.2 Criar `MetaFeedbackMessage` (ícone + texto por status) e verificar renderização dos quatro estados
- [x] 3.3 Criar `MetaEconomiaForm` (react-hook-form + zod, máscara de moeda, botão com loading, validação > 0) e verificar cenários de valor válido e inválido
- [x] 3.4 Criar `MarcoCelebracao` (efeito que dispara toast por marco novo, uma vez) e verificar que marcos já celebrados não repetem
- [x] 3.5 Criar `MetaEconomiaCard` (skeleton, erro, sem meta com CTA, com meta) e verificar os quatro estados com teste de componente
- [x] 3.6 Criar `HistoricoMetasChart` + lista responsiva (gráfico Recharts desktop, lista mobile, variação vs. mês anterior, seletor de ano, estado vazio) e verificar com dados mockados

## 4. Páginas e navegação

- [x] 4.1 Criar `app/(dashboard)/mais/metas-economia/page.tsx` compondo formulário, progresso, remoção com confirmação e histórico; bloquear edição para competências passadas; verificar manualmente no navegador (mobile e desktop)
- [x] 4.2 Inserir `MetaEconomiaCard` em `app/(dashboard)/inicio/page.tsx` com error boundary local e adicionar item "Metas de economia" em `MaisHub.tsx` (e `Sidebar.tsx` se a navegação desktop listar itens de `/mais`); verificar navegação

## 5. Testes e verificação final

- [x] 5.1 Adicionar teste E2E Playwright: definir meta de R$ 1.000, ver progresso e remover (usando padrão de `e2e/` existente)
- [x] 5.2 Executar `npm run lint`, `npx tsc --noEmit` e a suíte de testes, confirmando tudo verde
