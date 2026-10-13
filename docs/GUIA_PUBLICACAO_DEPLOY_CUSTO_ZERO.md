# 🚀 Guia de Publicação & Hospedagem a Custo Zero (R$ 0,00)
## Portal Oficial do Centro Acadêmico E(CA)² – UERGS

Este documento detalha o passo a passo completo para colocar o portal do **E(CA)²** na internet sem gastar nada (plano gratuito vitalício), com certificado de segurança HTTPS/SSL automático e alta velocidade.

---

## 🏗️ 1. Entendendo a Arquitetura do Projeto

O projeto foi construído no modelo moderno **Jamstack**:
1. **Frontend (Site do Usuário):** Fica inteiramente dentro da pasta [`site/`](file:///x:/Programas/Eca²/site) (HTML5, CSS3, Vanilla JS modular e PDFs compilados). Não necessita de servidores pagos como VPS, Node.js rodando 24h ou PHP.
2. **Backend & Banco de Dados (Opcional para Votação Online):** [Supabase](https://supabase.com) (PostgreSQL gerenciado gratuito com autenticação e políticas de segurança RLS prontas).

**Custo Total Estimado: R$ 0,00**

---

## ⚡ 2. Opção Recomendada: Vercel (Deploy em 2 Minutos)

A **Vercel** é uma das maiores plataformas de hospedagem web do mundo e oferece uma CDN global ultrarrápida no Brasil com SSL (cadeado verde) automático.

### Método A: Publicação Imediata pelo Terminal (CLI)

Se você já possui Node.js instalado, pode publicar diretamente pelo terminal:

1. Abra o terminal na pasta raiz do projeto (`x:\Programas\Eca²`).
2. Execute o comando apontando para a pasta `site`:
   ```powershell
   npx -y vercel ./site
   ```
3. O assistente da Vercel fará perguntas simples na primeira execução:
   * **Log in to Vercel:** Pressione Enter e autentique no navegador com GitHub, Google ou e-mail.
   * **Set up and deploy?** Digite `y` e pressione Enter.
   * **Which scope?** Selecione sua conta pessoal.
   * **Link to existing project?** Digite `n` (novo projeto).
   * **What’s your project’s name?** Digite `eca2-uergs` (ou o nome que desejar).
   * **In which directory is your code located?** Pressione Enter (já definimos `./site`).
   * **Want to modify settings?** Digite `n`.
4. Em menos de 1 minuto, o terminal exibirá:
   * **Production:** `https://eca2-uergs.vercel.app` (URL pública pronta para acesso!).

---

### Método B: Publicação via GitHub + Vercel (Recomendado para Manutenção)

Este método garante que qualquer alteração futura no código seja publicada na internet automaticamente:

#### Passo 1: Subir o projeto para o GitHub
1. Crie uma conta ou acesse [github.com](https://github.com).
2. Crie um novo repositório chamado `eca2` (pode ser público ou privado).
3. No terminal da pasta do projeto, inicialize o Git:
   ```powershell
   git init
   git add .
   git commit -m "feat: Estrutura oficial do portal E(CA)2 UERGS"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/eca2.git
   git push -u origin main
   ```

#### Passo 2: Conectar na Vercel
1. Acesse [vercel.com](https://vercel.com) e entre com sua conta GitHub.
2. Clique em **Add New...** → **Project**.
3. Importe o repositório `eca2`.
4. Na tela de configuração:
   * Em **Root Directory**, clique em **Edit** e selecione a pasta `site`.
   * Deixe as outras configurações no padrão.
5. Clique em **Deploy**.
6. Pronto! O site estará no ar e receberá atualizações a cada `git push`.

---

## 🛡️ 3. Opção Alternativa: Cloudflare Pages (Tráfego Ilimitado)

A **Cloudflare** oferece proteção DDoS em nível militar e largura de banda 100% gratuita sem limites:

1. Crie uma conta em [dash.cloudflare.com](https://dash.cloudflare.com).
2. No menu lateral, acesse **Compute (Workers) & Pages** → **Create application** → aba **Pages**.
3. Clique em **Connect to Git** e selecione o repositório do projeto.
4. Em **Build settings**:
   * **Framework preset:** `None`
   * **Build output directory:** `site`
5. Clique em **Save and Deploy**.
6. O site receberá um endereço oficial como `eca2.pages.dev`.

---

## 🗄️ 4. Ativando o Banco de Dados e Votação Online (Supabase Gratuito)

Por padrão, o site roda em **Modo Demonstração** (os votos e cadastros ficam salvos apenas na memória local do navegador). Para habilitar a votação oficial em tempo real de qualquer dispositivo:

### Passo 1: Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New Project**.
3. Dê um nome ao projeto (ex.: `Eca2-Oficial`) e defina uma senha forte de banco de dados.
4. Escolha a região `South America (São Paulo)` para menor latência.

### Passo 2: Executar o Script do Banco
1. No menu lateral esquerdo do Supabase, clique no ícone **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo local [`site/supabase/schema.sql`](file:///x:/Programas/Eca²/site/supabase/schema.sql), copie todo o seu conteúdo e cole no SQL Editor do Supabase.
4. Clique em **Run** (botão verde). Todas as tabelas, índices de auditoria e políticas de segurança RLS serão criadas instantaneamente.

### Passo 3: Conectar o Site ao Supabase
1. No painel do Supabase, acesse **Project Settings** (ícone de engrenagem) → **API**.
2. Copie os seguintes valores:
   * **Project URL**
   * **Project API keys** → chave `anon` (`public`).
3. Abra o arquivo [`site/js/config.js`](file:///x:/Programas/Eca²/site/js/config.js) no VS Code e preencha:
   ```javascript
   export const CONFIG = {
     SUPABASE_URL: "https://seu-projeto.supabase.co",
     SUPABASE_ANON_KEY: "sua-chave-anon-publica-aqui",
     ALLOWED_EMAIL_DOMAIN: "uergs.edu.br", // Opcional: restringe votação a e-mails institucionais
     ...
   };
   ```
4. Salve o arquivo e faça novo deploy. O portal agora está 100% sincronizado com a nuvem!

---

## 🖨️ 5. Atualizando o Cartaz de QR Code com o Link Oficial

Após publicar o site e obter o link oficial (ex.: `https://eca2-uergs.vercel.app`):

1. Abra o arquivo [`site/cartaz_qr_code.html`](file:///x:/Programas/Eca²/site/cartaz_qr_code.html).
2. Localize a tag da URL ou código do QR Code e atualize com o link gerado da plataforma.
3. Abra [`site/cartaz_qr_code.html`](file:///x:/Programas/Eca²/site/cartaz_qr_code.html) no navegador e pressione `Ctrl + P` para imprimir os cartazes de mural para o campus da UERGS.

---

## 📋 6. Checklist de Validação Pré-Lançamento

Antes de divulgar aos estudantes:
- [ ] Acessar o site pelo smartphone e verificar a responsividade.
- [ ] Testar o download dos 8 documentos em PDF na aba de Documentos.
- [ ] Realizar um voto de teste na urna e conferir o registro no gráfico de auditoria.
- [ ] Conferir os dados de contato e canais oficiais do Centro Acadêmico.
