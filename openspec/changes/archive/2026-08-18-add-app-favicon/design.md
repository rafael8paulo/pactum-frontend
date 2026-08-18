## Context

`app/layout.tsx` hoje só define `metadata.title` e `metadata.description` — não há nenhum arquivo `icon`, `apple-icon` ou `manifest` em `app/`, nem nada em `public/`. Sem esses arquivos, o Next.js 15 App Router não injeta nenhuma tag `<link rel="icon">`/`<link rel="apple-touch-icon">`/`<link rel="manifest">` no `<head>`, então o navegador cai no favicon padrão (ou nenhum) e "Adicionar à tela inicial" no celular não tem ícone para usar.

O app não tem uma cor de marca definida — o tema shadcn em `app/globals.css` é neutro (escala de cinza/zinc, `--primary` inverte entre quase-preto e quase-branco conforme o tema). Não há logo ou identidade visual existente para reaproveitar.

## Goals / Non-Goals

**Goals:**
- Ícone com identidade própria e relação clara com o Pactum (app de finanças pessoais), não o ícone padrão do Next.js/Vercel.
- Ícone visível na aba do navegador desktop (favicon).
- Ícone visível ao adicionar o site à tela inicial no iOS e no Android.
- Usar exclusivamente as convenções nativas de metadata do Next.js 15 App Router — sem dependências novas.

**Non-Goals:**
- Ícones "maskable" com safe-zone dedicada para Android adaptive icons — fica como possível follow-up; os ícones fornecidos usam `purpose: "any"`.
- Splash screens customizadas de iOS (`apple-touch-startup-image`) — fora de escopo.
- Um manifest completo de PWA instalável (service worker, offline, `display: standalone` funcional) — o `manifest.ts` criado aqui só existe para carregar os ícones de tela de início; não é um objetivo transformar o Pactum num PWA instalável nesta mudança.
- Rebranding do app (paleta de cores, logo em outros lugares da UI) — o ícone introduz uma cor de destaque própria só para si mesmo, sem propagar para o resto do tema.

## Decisions

### 1. Conceito visual: monograma "P" num badge quadrado arredondado
Um selo (badge) quadrado com cantos arredondados, fundo em cor sólida, com a letra "P" (de Pactum) em branco, e uma pequena linha ascendente (motivo de "crescimento financeiro") integrada como underline do glifo. Esse é o desenho mais confiável para permanecer legível em 16×16px (tamanho de favicon de aba), onde qualquer detalhe fino desaparece — a essência do ícone continua sendo um "P" reconhecível mesmo se a linha de tendência sumir em tamanhos minúsculos.

Alternativas consideradas:
- Ícone literal de "carteira"/"cifrão" — mais genérico (qualquer app financeiro usa), menos ligado ao nome "Pactum" especificamente, e ilustrações com múltiplos elementos tendem a virar uma mancha ilegível em 16px.
- Logo com o nome completo "Pactum" por extenso — não cabe em formato de ícone quadrado pequeno.

Cor: fundo `#020817` (o mesmo `--background` do tema dark do próprio app, em `globals.css`) com o "P" em branco e a linha de tendência em cinza-azulado neutro (`#94A3B8`, próximo do `--muted-foreground`). O app não tem uma cor de destaque própria — o tema shadcn usado é neutro (escala de cinza/zinc) — então o ícone reaproveita a paleta real do dashboard (navy escuro + branco) em vez de inventar uma cor (uma primeira versão usou verde-esmeralda; descartada por não ter nenhuma relação com as cores do produto).

### 2. Fonte do ícone: SVG desenhado à mão, rasterizado para PNG onde exigido
`app/icon.svg` é o arquivo fonte (vetorial, escala perfeita em qualquer tamanho de favicon). Para `apple-icon.png` (Safari/iOS não renderiza SVG como apple-touch-icon de forma confiável) e para os ícones do `manifest.ts` (PNG é o formato universalmente suportado por Android/Chrome), o mesmo SVG é rasterizado com ImageMagick (`convert`, já disponível no ambiente — nenhuma dependência nova de projeto) para os tamanhos exigidos:
- `apple-icon.png`: 180×180 (tamanho recomendado pela Apple para apple-touch-icon)
- `public/icon-192.png` e `public/icon-512.png`: tamanhos padrão de ícone PWA/Android referenciados pelo `manifest.ts`

Alternativa considerada: gerar tudo só como SVG. Rejeitada — `apple-icon` e ícones de manifest Android precisam de PNG para compatibilidade garantida; é convenção documentada do próprio Next.js.

### 3. `app/manifest.ts` mínimo, só para os ícones de tela de início
Usar a convenção `app/manifest.ts` (função que retorna `MetadataRoute.Manifest`) com `name`, `short_name`, `icons` (192 e 512, `purpose: "any"`), `theme_color` e `background_color` alinhados ao fundo escuro do dashboard (`hsl(222.2 84% 4.9%)`, o mesmo `--background` do tema dark em `globals.css`). O Next.js detecta o arquivo automaticamente e injeta `<link rel="manifest">` — nenhum código em `layout.tsx` precisa mudar para isso.

## Risks / Trade-offs

- [Risco] Rasterizar via ImageMagick pode gerar bordas serrilhadas em tamanhos pequenos se o SVG fonte não for suficientemente simples → Mitigação: manter o desenho do ícone com poucas formas geométricas (retângulo arredondado + glifo simples), sem gradientes finos nem sombras, o que rasteriza bem em qualquer resolução.
- [Trade-off] Sem ícone "maskable", em launchers Android que aplicam máscaras de forma (círculo, squircle) o ícone pode ser cortado nas bordas → aceito conscientemente como Non-Goal; o badge já tem bastante margem interna ao redor do "P", então o corte tende a ser suave mesmo sem safe-zone dedicada.
