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

## Deploy em https://indique.barbearia.vip

O site é publicado num servidor próprio com nginx, via [`scripts/deploy.sh`](scripts/deploy.sh)
(build local + `rsync` por SSH). Cada deploy vira uma pasta nova em `releases/`, e o link
`current` é trocado de forma atômica. Assim não há site "pela metade" e o rollback é instantâneo.

```
/var/www/indique.barbearia.vip/
├── current -> releases/20260924-231500-3fa7845   # versão no ar
└── releases/                                     # últimas 5 versões
```

### Pré-requisitos

- **DNS**: registro `A` (e `AAAA`, se houver IPv6) de `indique.barbearia.vip` apontando para o servidor.
- **Servidor** (Ubuntu/Debian): `sudo apt install nginx certbot rsync`, portas 80 e 443 liberadas
  e um usuário com acesso SSH por chave e `sudo` (ex.: `deploy`).
- **Sua máquina**: Node 22, `ssh`, `rsync` e `curl`.

### Configuração

```bash
cp .env.deploy.example .env.deploy   # não vai para o git
# preencha DEPLOY_HOST, DEPLOY_USER e CERTBOT_EMAIL
```

### Primeira vez: preparar o servidor

```bash
scripts/deploy.sh setup
```

Esse comando cria as pastas, instala [`deploy/nginx/indique.barbearia.vip.conf`](deploy/nginx/indique.barbearia.vip.conf),
emite o certificado HTTPS no Let's Encrypt (renovação automática do certbot, com reload do nginx)
e valida tudo com `nginx -t` antes de recarregar. Se a validação falhar, a configuração anterior
é restaurada. Pode ser rodado de novo sempre que a configuração do nginx mudar.

### Publicar, voltar versão, listar

```bash
scripts/deploy.sh            # npm ci + lint + build, envia, ativa e confere o site no ar
scripts/deploy.sh rollback   # volta para a versão anterior
scripts/deploy.sh releases   # lista as versões (a marcada com * está no ar)
```

Opções (variáveis de ambiente ou `.env.deploy`):

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `DEPLOY_HOST` | — | IP ou hostname do servidor (obrigatório) |
| `DEPLOY_USER` / `DEPLOY_PORT` | `deploy` / `22` | acesso SSH |
| `DEPLOY_SSH_KEY` | — | chave SSH específica |
| `DEPLOY_PATH` | `/var/www/indique.barbearia.vip` | pasta do site no servidor |
| `DEPLOY_KEEP_RELEASES` | `5` | versões guardadas para rollback |
| `CERTBOT_EMAIL` | — | e-mail do Let's Encrypt (só no primeiro `setup`) |
| `SKIP_BUILD=1` | — | publica o `dist/` existente sem rebuild |
| `SKIP_HEALTHCHECK=1` | — | não confere o site depois de publicar |
| `DEPLOY_CURL_OPTS` | — | ex.: `--resolve indique.barbearia.vip:443:IP` para conferir antes do DNS propagar |

### O que o nginx faz

- HTTP → HTTPS (301), HTTP/2 e HSTS; validação do Let's Encrypt em `/.well-known/acme-challenge/`.
- `index.html` sempre revalidado (`no-cache`), então o público vê a versão nova assim que ela é publicada.
  Arquivos de `/assets/` (com hash no nome) ficam em cache por 1 ano, e as imagens por 7 dias.
- Cabeçalhos de segurança, incluindo uma Content-Security-Policy restrita ao próprio domínio.
- Gzip para HTML, CSS, JS e SVG.
- Endereço inexistente (ex.: link de campanha digitado errado) redireciona para a página.
  Arquivos ocultos (`.env`, `.git`) são bloqueados.

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
