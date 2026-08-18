## 1. Desenhar o ícone fonte

- [x] 1.1 Criar `app/icon.svg`: badge quadrado de cantos arredondados, fundo verde-esmeralda sólido, monograma "P" branco com underline em formato de linha ascendente, desenhado com poucas formas geométricas simples (sem gradientes/sombras finas) para rasterizar bem em qualquer tamanho

## 2. Gerar os PNGs derivados

- [x] 2.1 Rasterizar `app/icon.svg` com ImageMagick (`convert`) para `app/apple-icon.png` em 180×180
- [x] 2.2 Rasterizar `app/icon.svg` para `public/icon-192.png` (192×192) e `public/icon-512.png` (512×512)

## 3. Web App Manifest

- [x] 3.1 Criar `app/manifest.ts` exportando `MetadataRoute.Manifest` com `name: "Pactum"`, `short_name: "Pactum"`, `icons` apontando para `public/icon-192.png` e `public/icon-512.png` (`purpose: "any"`), `theme_color` e `background_color` alinhados ao `--background` do tema dark (`hsl(222.2 84% 4.9%)`)

## 4. Verificação

- [x] 4.1 Rodar `npm run build` e confirmar que `/icon`, `/apple-icon` e `/manifest.webmanifest` (ou rota equivalente gerada pelo Next.js) aparecem entre as rotas geradas, sem erros de lint/type-check
- [x] 4.2 No navegador desktop, confirmar visualmente que a aba exibe o novo ícone do Pactum (não o ícone padrão do Next.js)
- [x] 4.3 Em um viewport mobile (DevTools ou dispositivo real), confirmar que o manifest é carregado corretamente e que o ícone referenciado é o do Pactum
