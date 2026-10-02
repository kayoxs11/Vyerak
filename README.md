# Vyerak.dev

Site institucional da **Vyerak** — agência de desenvolvimento web em Recife/PE.

HTML + CSS + JS puro (sem build step). Deploy estático na [Vercel](https://vyerak.vercel.app/).

## Estrutura
index.html          → home
servicos.html       → página de serviços
sobre.html          → sobre / trajetória
404.html            → página de erro (Vercel)
css/style.css
js/script.js
assets/             → logo, favicons, og-image
robots.txt
sitemap.xml
site.webmanifest
llms.txt
vercel.json         → headers de segurança e cache


## O que já está configurado

- [x] Meta tags (title, description, robots, theme-color)
- [x] Open Graph + Twitter Card
- [x] Schema.org (ProfessionalService, WebSite, FAQPage, AboutPage, CollectionPage)
- [x] Canonical URLs
- [x] `robots.txt` + `sitemap.xml`
- [x] `site.webmanifest` (PWA básico)
- [x] `llms.txt`
- [x] Headers de segurança e cache (`vercel.json`)
- [x] Página 404 customizada
- [x] Formulário de contato → abre WhatsApp com mensagem montada
- [x] WhatsApp e e-mail de contato definidos
- [x] Animação de fundo + efeito de código no hero
- [x] Responsivo (mobile / tablet / desktop)

## O que ainda falta

- [ ] Trocar os cards do Portfólio por projetos reais (screenshots + links)
- [ ] Adicionar depoimentos reais de clientes (se houver)
- [ ] Subir `assets/og-image.png` (1200×630) se ainda não existir
- [ ] Confirmar favicons em `assets/` (`favicon-16.png`, `favicon-32.png`, `favicon-180.png`)
- [ ] Revisar domínio em `sitemap.xml`, `robots.txt`, canonicals e OG quando o domínio final estiver definido
- [ ] Cadastrar no [Google Search Console](https://search.google.com/search-console) e enviar o sitemap

## Contato

- WhatsApp: [(81) 9667-8368](https://wa.me/558196678368)
- Email: vyerak.dev@gmail.com
- Local: Recife, PE — Brasil

## Deploy

1. Push neste repositório (`main`)
2. A Vercel faz o deploy automático (já conectada ao repo)
3. Site: https://vyerak.vercel.app/

Para domínio próprio: configure o domínio no painel da Vercel e atualize URLs em `sitemap.xml`, `robots.txt`, meta tags e Schema.

## Página 404

O arquivo `404.html` na raiz é servido automaticamente pela Vercel em qualquer rota inexistente.  
Caminhos de CSS, imagens e links usam paths absolutos (`/css/...`, `/assets/...`) para funcionar em qualquer URL.