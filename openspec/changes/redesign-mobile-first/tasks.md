## 1. Fundação: tokens, dependências e primitivos

- [x] 1.1 Adicionar `vaul`, `react-swipeable`, `@radix-ui/react-tabs`, `@tanstack/react-query-persist-client` e `@tanstack/query-sync-storage-persister` ao `package.json`; verificar com `npm install && npm run build` concluindo sem erro
- [x] 1.2 Definir os tokens de marca em `app/globals.css` (`--brand`, `--brand-tint`, `--pos`, `--pos-tint`, `--neg`, `--neg-tint`, `--warn`, `--warn-tint`) nos blocos `:root` e `.dark`, e expô-los em `tailwind.config.ts`; verificar medindo o contraste de cada par texto/fundo e confirmando ≥4.5:1 em ambos os temas
- [x] 1.3 Carregar Inter e Plus Jakarta Sans via `next/font/google` em `app/layout.tsx` e mapear em `tailwind.config.ts` como `font-sans` e `font-numeric`; verificar que nenhuma fonte é baixada de origem externa em runtime na aba Network
- [x] 1.4 Verificar a disponibilidade em `lucide-react@^1.17.0` dos ícones usados nos layouts (`clock-alert`, `cloud-alert`, `wand-sparkles`, `tv-minimal-play`, `ellipsis`, `piggy-bank`, `handshake`) e registrar os substitutos em um mapa `lib/icons.ts`; verificar que `npm run build` compila com todos os ícones referenciados
- [x] 1.5 Gerar `components/ui/drawer.tsx` pelo CLI do shadcn (base `vaul`); verificar abrindo um drawer de exemplo e confirmando drag-to-dismiss, foco preso e fechamento por `Esc`
- [x] 1.6 Criar `components/ui/segmented-control.tsx` sobre `@radix-ui/react-tabs`, com 2 e 3 segmentos e alvo ≥44px; verificar navegação por setas do teclado e anúncio como `tablist` em leitor de tela
- [x] 1.7 Criar `hooks/useMediaQuery.ts` retornando `boolean | undefined` no primeiro render; verificar que consumidores recebem `undefined` no SSR e o valor correto após hidratação, sem warning de hidratação no console

## 2. Rotas: estrutura nova e redirects

- [x] 2.1 Criar `app/(dashboard)/inicio/page.tsx` lendo `searchParams.competencia` com fallback em `getCurrentCompetencia()`; verificar que `/inicio?competencia=2026-03` renderiza sem erro
- [x] 2.2 Criar `app/(dashboard)/lancamentos/page.tsx` lendo `tipo`, `competencia`, `status` e `categoria`, com `tipo` padrão `despesa`; verificar que `/lancamentos?tipo=receita` renderiza a listagem de receitas
- [x] 2.3 Criar `app/(dashboard)/recorrentes/page.tsx` movendo o conteúdo de `contas-recorrentes/page.tsx`; verificar paridade de conteúdo com a rota antiga em desktop
- [x] 2.4 Criar `app/(dashboard)/mais/page.tsx`, `mais/patrimonio/page.tsx` e `mais/formas-pagamento/page.tsx`; verificar que as duas últimas renderizam o conteúdo hoje servido por `/patrimonio` e `/formas-pagamento`
- [x] 2.5 Atualizar `providers/auth-provider.tsx` (`login`, `cadastro`) e `app/page.tsx` para apontar a `/inicio`; verificar fazendo login e confirmando o destino
- [x] 2.6 Substituir `resumo`, `resumo-unificado`, `despesas`, `receitas`, `patrimonio`, `formas-pagamento` e `contas-recorrentes` por `page.tsx` que chamam `redirect()` com status temporário, reescrevendo params (`/despesas?competencia=X&status=Y` → `/lancamentos?tipo=despesa&competencia=X&status=Y`); verificar cada uma das sete rotas antigas com os params preservados
- [x] 2.7 Atualizar `Sidebar.tsx` para os novos destinos e remover os itens "Resumo Unificado" e "Despesas"/"Receitas" separados; verificar que o item ativo é destacado corretamente em cada rota nova, inclusive em `/mais/patrimonio`

## 3. Shell mobile (layout 01, tab bar e cabeçalho)

- [x] 3.1 Criar `components/features/layout/MobileTabBar.tsx` com os quatro destinos e a ação de criação central, lendo `usePathname()` para o estado ativo e usando `env(safe-area-inset-bottom)`; verificar em 390x844 que a barra fica acima da área de gestos e que rotas aninhadas mantêm a aba raiz ativa
- [x] 3.2 Criar `components/features/layout/MobileHeader.tsx` com o indicador de competência à esquerda e busca/notificações/avatar à direita, sem ação de logout; verificar que todos os controles têm `aria-label` e ≥44px de alvo
- [x] 3.3 Alterar `app/(dashboard)/layout.tsx` para renderizar `Sidebar`+`Header` com `hidden md:flex` e `MobileHeader`+`MobileTabBar` com `md:hidden`, removendo o `Sheet` de navegação e o estado `mobileOpen`; verificar que em 1440px nada mudou e que em 390px não há botão de menu hamburguer
- [x] 3.4 Adicionar padding inferior ao `<main>` equivalente à altura da tab bar; verificar que o último item de uma lista longa fica totalmente visível ao final da rolagem
- [x] 3.5 Aplicar supressão de transições sob `prefers-reduced-motion` no shell e nos drawers; verificar ativando a preferência no sistema e confirmando ausência de animação na troca de abas

## 4. Competência (layout 06)

- [x] 4.1 Criar `components/features/layout/MonthSheet.tsx` com grade de 12 meses, navegação de ano e atalhos "Este mês"/"Mês passado", escrevendo `?competencia=YYYY-MM` e preservando os demais params; verificar que a partir de `/lancamentos?tipo=despesa&status=PENDENTE` a troca de mês mantém `tipo` e `status`
- [x] 4.2 Ligar `MonthSheet` ao indicador de competência do `MobileHeader` e manter `MonthPicker.tsx` intacto para desktop; verificar que em 1440px as setas continuam funcionando e em 390px o toque abre a grade
- [x] 4.3 Aplicar tratamento visual distinto a meses posteriores ao mês corrente mantendo-os selecionáveis; verificar selecionando um mês futuro e confirmando que a listagem carrega

## 5. Lançamentos (layouts 02, 07, 10, 11)

- [x] 5.1 Criar `components/features/lancamentos/TxRow.tsx` (badge de categoria, título, meta, valor, status) com altura ≥56px e toque em toda a linha; verificar em 320px que nada exige rolagem horizontal
- [x] 5.2 Criar `lib/lancamentos/group.ts` com `groupLancamentos()` implementando a estratégia por status/grupo único e o ponto de extensão para agrupamento por dia; verificar por teste unitário que os subtotais por grupo batem com a soma dos itens
- [x] 5.3 Criar `components/features/lancamentos/TxList.tsx` renderizando grupos com cabeçalho, subtotal e divisores; verificar que uma competência com 3 status distintos produz 3 grupos ordenados
- [x] 5.4 Alterar `DespesaTable.tsx` e `ReceitaTable.tsx` para delegar a `TxList` abaixo de `md` e manter a `<Table>` ordenável acima, sem duplicar hooks; verificar que a mesma mutação de status funciona nas duas apresentações
- [x] 5.5 Criar `components/features/lancamentos/SegmentedTipo.tsx` sincronizado com `?tipo=`, limpando `status` ao alternar para receita; verificar que ir de `?tipo=despesa&status=PAGA` para receita remove `status` da URL
- [x] 5.6 Criar `components/features/lancamentos/FilterChips.tsx` com contadores por status derivados da lista carregada e chip "Todas"; verificar que o contador de "Pendentes" bate com a quantidade real e que "Todas" remove `status` da URL
- [x] 5.7 Adicionar busca client-side por descrição na competência carregada, com estado vazio próprio para "nenhum resultado"; verificar que a busca combina com o filtro de status ativo
- [x] 5.8 Implementar o gesto de swipe em `TxRow` com `react-swipeable` (limiar 96px, apenas despesas não pagas, alvo rotulado revelado); verificar que rolagem vertical não dispara a ação e que soltar antes do limiar não faz requisição
- [x] 5.9 Criar `components/features/lancamentos/TxDetailSheet.tsx` com metadados, segmented de 3 status, ação primária de editar e ação destrutiva separada com confirmação; verificar que para receita nenhum controle de status é exibido
- [x] 5.10 Remover as ações de editar/remover dos itens da lista mobile, mantendo-as apenas no sheet de detalhe; verificar que em 390px nenhum item expõe ação destrutiva diretamente
- [x] 5.11 Substituir `PageLoader` por skeletons com a mesma altura do conteúdo em `DespesaTable`, `ReceitaTable` e listas derivadas; verificar que a posição vertical dos filtros não muda entre estado de skeleton e carregado
- [x] 5.12 Criar o estado de erro recuperável com ação única de nova tentativa para as listagens; verificar simulando falha de rede com dados já em cache e confirmando que os dados anteriores permanecem visíveis

## 6. Criação rápida (layout 03)

- [x] 6.1 Criar `components/features/lancamentos/QuickAddSheet.tsx` com segmented Despesa/Receita, campo de valor em foco inicial e `inputMode="decimal"`; verificar em dispositivo móvel que o teclado numérico abre ao focar
- [x] 6.2 Reaproveitar `CurrencyInput` no bloco de valor em destaque; verificar que a formatação BRL em tempo real continua idêntica à do dialog desktop
- [x] 6.3 Derivar `competencia` da competência ativa e exibi-la como valor legível abrindo `MonthSheet` ao ser tocada, sem campo de texto `AAAA-MM`; verificar que o lançamento criado tem a competência ativa e que não existe input de texto de competência no sheet
- [x] 6.4 Implementar as categorias como chips com ícone e controle de expansão para as demais; verificar que a categoria é definida em um toque e que os chips mudam conforme o tipo
- [x] 6.5 Reutilizar os schemas Zod de `DespesaForm`/`ReceitaForm` sem duplicá-los, exibindo erro inline por campo; verificar que valor zero e descrição vazia bloqueiam o envio sem requisição
- [x] 6.6 Implementar "Salvar e adicionar outro" preservando tipo, categoria e competência, limpando valor e descrição e devolvendo o foco ao valor; verificar criando dois lançamentos em sequência sem fechar o sheet
- [x] 6.7 Ligar a ação de criação da tab bar ao `QuickAddSheet` com o tipo herdado do contexto e sem alterar a rota; verificar acionando a partir de `/recorrentes` e confirmando que a URL não muda

## 7. Início, Recorrentes, Mais e Patrimônio (layouts 01, 04, 05, 12, 09)

- [x] 7.1 Criar `components/features/resumo/SaldoHero.tsx` (bloco único com saldo em destaque e totais subordinados) consumindo `useResumoMensal`; verificar em 390x844 que os três valores estão visíveis sem rolagem
- [x] 7.2 Criar `components/features/resumo/EvolucaoCompacta.tsx` com barras em CSS para os 6 meses até a competência ativa e valores do mês ativo em texto; verificar que nenhum valor depende de hover
- [x] 7.3 Converter `EvolucaoAnualChart` para import via `next/dynamic` com `ssr: false` e montagem apenas acima de `md`; verificar por análise do bundle que Recharts não entra no carregamento inicial de `/inicio` em mobile
- [x] 7.4 Criar o aviso acionável de despesas pendentes em `/inicio`, oculto quando não há pendências, levando a `/lancamentos?tipo=despesa&status=PENDENTE`; verificar com competência sem pendentes que o aviso não é renderizado
- [x] 7.5 Criar `hooks/useOnboardingStatus.ts` derivando os três passos das queries de formas de pagamento, receitas e contas recorrentes; verificar que o progresso é idêntico após limpar o `localStorage`
- [x] 7.6 Criar `components/features/onboarding/SetupChecklist.tsx` com progresso e passos acionáveis, exibido em `/inicio` apenas enquanto houver passo pendente; verificar que concluir os três passos remove o checklist
- [x] 7.7 Padronizar os estados vazios por rota com título contextualizado e ação primária, distinguindo lista vazia de busca sem resultado; verificar nas rotas de lançamentos, recorrentes e patrimônio
- [x] 7.8 Criar a apresentação mobile de `/recorrentes`: card único de compromisso mensal com distribuição por forma de pagamento, strip de próximas cobranças e lista de contas; verificar que total e distribuição ficam visíveis juntos sem rolagem em 390px
- [x] 7.9 Reescrever `GerarLancamentosButton` como ação primária declarando competência de destino, quantidade de contas ativas e valor total; verificar que sem contas ativas a ação não é exibida
- [x] 7.10 Construir `/mais` com cartão de perfil, resumo de patrimônio, grupos de navegação, preferência de aparência e bloco isolado de "Sair da conta" com `AlertDialog`; verificar que cancelar a confirmação não dispara `logout()`
- [x] 7.11 Criar a apresentação mobile de `/mais/patrimonio` com total, composição visual, legenda textual e lista com percentual por item; verificar que a composição é identificável sem depender de cor
- [x] 7.12 Migrar `NovaContaRecorrenteDialog`, `EditarContaRecorrenteDialog`, `NovaFormaPagamentoDialog` e `NovoPatrimonioDialog` para `Drawer` abaixo de `md`, mantendo campos e validação; verificar que cada formulário submete corretamente nas duas apresentações

## 8. Resiliência offline e sessão

- [x] 8.1 Criar `hooks/useOnlineStatus.ts` sobre os eventos `online`/`offline`; verificar alternando o modo offline do DevTools
- [x] 8.2 Criar o banner persistente de ausência de conexão e removê-lo ao reconectar, disparando revalidação da competência ativa; verificar o ciclo offline → online
- [x] 8.3 Configurar o persister em `providers/query-provider.tsx` com `maxAge: 24h`, `buster` por versão e allowlist de queries financeiras; verificar inspecionando `localStorage` que nenhuma chave de autenticação é persistida
- [x] 8.4 Rotular os dados servidos do cache com a data/hora de obtenção nas listagens e no resumo; verificar recarregando offline e confirmando o rótulo
- [x] 8.5 Chamar `persister.removeClient()` em `logout()` e no interceptor de 401 antes do redirecionamento; verificar que após o logout o `localStorage` não contém dados financeiros
- [x] 8.6 Ajustar o interceptor de `lib/api/client.ts` para não redirecionar em falha de rede e para preservar a rota pretendida ao redirecionar por 401; verificar que offline a aplicação permanece na rota atual
- [x] 8.7 Tratar falha de escrita sem conexão revertendo o efeito visual e notificando; verificar marcando uma despesa como paga em modo offline

## 9. Feedback reversível

- [x] 9.1 Converter `useAtualizarStatusDespesa` para mutação otimista com snapshot do cache em `onMutate` e restauração em `onError`; verificar que uma falha da API reverte o status exibido
- [x] 9.2 Adicionar ação "Desfazer" (≥5s) ao toast de alteração de status e de criação de lançamento, revertendo via a mutação inversa; verificar que desfazer restaura o valor anterior e confirma ao usuário
- [x] 9.3 Posicionar o `Toaster` acima da tab bar em mobile e garantir que não rouba foco; verificar exibindo um toast durante o preenchimento de um campo e confirmando que o cursor permanece no campo
- [x] 9.4 Restringir `PageLoader` a `ProtectedRoute`/resolução de sessão e remover seus usos das listagens; verificar por busca no repositório que nenhuma listagem o importa

## 10. Verificação final

- [ ] 10.1 Percorrer as 12 telas do design em 390x844 e 1440x900 comparando com os layouts aprovados; verificar que nenhuma tela exige rolagem horizontal e que a paridade desktop foi mantida
- [ ] 10.2 Auditar alvos de toque e contraste em mobile nas rotas `/inicio`, `/lancamentos`, `/recorrentes`, `/mais`; verificar que todo controle tem ≥44x44 CSS px e que o Lighthouse Accessibility fica ≥95
- [ ] 10.3 Navegar a aplicação inteira por teclado e por leitor de tela em mobile; verificar que a tab bar é anunciada como navegação, os drawers prendem o foco e a ação de criação tem nome acessível
- [ ] 10.4 Medir as métricas de campo simuladas em 4G com CPU 4x throttled em `/inicio` e `/lancamentos`; verificar LCP < 2.5s, INP < 200ms e CLS < 0.1
- [x] 10.5 Conferir o bundle de `/inicio` e `/lancamentos` em mobile; verificar que Recharts não está no carregamento inicial e registrar o delta de tamanho em relação ao baseline
- [x] 10.6 Executar `npm run lint` e `npm run build`; verificar ausência de erros e de warnings de hidratação
- [x] 10.7 Testar as sete rotas antigas com query params; verificar que cada uma redireciona para o destino correto preservando `competencia`, `status` e `categoria`
