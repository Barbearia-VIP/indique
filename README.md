# Indique um amigo — Barbearia VIP

Landing page do **Programa de Indicação da Barbearia VIP** (campanha BV035-26).
Construída a partir do template [nexus-studio](https://github.com/legendxdevil/nexus-studio)
(React + Vite + Tailwind + Framer Motion), com a identidade visual, as cores e as peças do KV da campanha.

> Indique amigos. Tenha seu corte grátis.
> A cada amigo indicado que virar cliente VIP, você recebe 30% do valor do atendimento dele em créditos no app.

## Rodando

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
npm run lint
```

O build usa caminhos relativos (`base: './'`), então a pasta `dist/` pode ser publicada em qualquer
hospedagem estática ou subpasta (GitHub Pages, Netlify, Vercel, S3…).

## Antes de publicar

Os botões "Indicar agora", "Baixe o app" etc. apontam para `links.app` em
[`src/data/content.js`](src/data/content.js). Hoje o valor é `https://barbeariavip.com.br`;
troque pelo link da App Store / Google Play (ou por uma página de download do app).

Todos os textos da página (passos, perguntas frequentes, capítulos) também ficam nesse arquivo.

## Seções

| Seção | Componente | Origem no template |
| --- | --- | --- |
| Menu fixo | `layout/Navbar.jsx` | Navbar |
| "Indique amigos. Tenha seu corte grátis." | `sections/Hero.jsx` | Hero |
| Faixa "Indicou. Ele veio. Você ganhou." | `sections/MarqueeBand.jsx` | MarqueeText |
| Vantagens (2 capítulos com fotos) | `sections/StorySection.jsx` | StorySection |
| Como funciona (5 passos + telas do app) | `sections/ProcessTimeline.jsx` | ProcessTimeline |
| Simulador de créditos (30%) | `sections/CreditSimulator.jsx` | StatsSection |
| Regras e dúvidas | `sections/FAQSection.jsx` | FAQSection |
| "Seu próximo corte pode sair grátis!" | `sections/CTASection.jsx` | CTASection |
| Rodapé | `layout/Footer.jsx` | Footer |

## Identidade visual

Tokens definidos em [`tailwind.config.js`](tailwind.config.js), amostrados das peças do KV:

| Token | Cor | Uso |
| --- | --- | --- |
| `gold` | `#EBB903` | Amarelo da marca (logo, faixas "Indique amigos.", destaques) |
| `noir-900` / `noir-950` | `#0C0B0A` / `#070706` | Fundos pretos das peças |
| `app` | `#00A859` | Verde do app Barbearia VIP |
| `smoke-*` | cinzas quentes | Textos de apoio |

Tipografia: **Poppins** (300–800), empacotada no build via `@fontsource/poppins`.

## Imagens

Tudo em `public/img/` foi extraído do PDF do KV (`BV035-26 PROGRAMA DE INDICAÇÃO_V1`):

- `logo-barbearia-vip.svg` e `emblema-vip.svg` — logo vetorizado a partir da peça do LinkedIn.
- `foto-*.jpg` — recortes das fotos da campanha, sem os textos aplicados.
- `app-passo-1..5.jpg` — telas do app usadas no carrossel "Como funciona".

Se a agência enviar os arquivos originais (logo vetorial e fotos em alta), basta substituir os
arquivos mantendo os mesmos nomes.
