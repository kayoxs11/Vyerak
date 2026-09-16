# Vyerak.dev

Site institucional da Vyerak — agência de desenvolvimento web em Recife/PE.

HTML + CSS + JS puro (sem build step), pronto pra deploy estático.

## Estrutura

```
index.html
css/style.css
js/script.js
assets/          → logo, marca e favicons gerados a partir da logo original
robots.txt
sitemap.xml
site.webmanifest
```

## O que ainda falta preencher

- [ ] Trocar os cards do Portfólio por projetos reais
- [ ] Trocar os Depoimentos por avaliações reais de clientes
- [ ] Atualizar WhatsApp (`https://wa.me/55...`) e e-mail de contato no `index.html` e no footer
- [ ] Conectar o formulário de contato a um serviço (veja abaixo)
- [ ] Revisar o domínio usado em `sitemap.xml` e `robots.txt` quando o domínio final estiver definido

## Formulário de contato

O formulário em `#contato` ainda não envia nada — só mostra um aviso. Duas formas simples de ativar sem back-end:

- **Formspree** (mais rápido): crie um formulário em formspree.io e troque o `id="contact-form"` para apontar `action="https://formspree.io/f/SEU_ID"` com `method="POST"`, removendo o `e.preventDefault()` do `js/script.js`.
- **EmailJS**: permite enviar direto pro seu e-mail via JS, sem back-end.

## Deploy — passo a passo

Veja as instruções completas na resposta do chat. Resumo:

1. `git init` neste diretório
2. Criar repositório no GitHub (ex: `vyerak-dev`)
3. `git remote add origin ...` e `git push`
4. Importar o repositório na Vercel → deploy automático