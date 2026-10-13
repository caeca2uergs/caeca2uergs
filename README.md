# ⚡ E(CA)² · Centro Acadêmico de Engenharia de Controle e Automação
### Universidade Estadual do Rio Grande do Sul – UERGS · Unidade Porto Alegre

[![Status](https://img.shields.io/badge/Status-Produção_Pronta-0284c7.svg?style=flat-square)](#)
[![Hospedagem](https://img.shields.io/badge/Deploy-Vercel_Free-000000.svg?style=flat-square&logo=vercel)](#)
[![Banco de Dados](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E.svg?style=flat-square&logo=supabase)](#)
[![LGPD](https://img.shields.io/badge/Conformidade-LGPD_Lei_13.709-10b981.svg?style=flat-square)](#)
[![PWA](https://img.shields.io/badge/PWA-Instalável-f59e0b.svg?style=flat-square)](#)
[![Custo](https://img.shields.io/badge/Custo_Mensal-R$_0%2C00-22c55e.svg?style=flat-square)](#)

---

## 🏛️ Sobre o Projeto

O **E(CA)²** (Centro Acadêmico de Engenharia de Controle e Automação) é a entidade representativa máxima dos estudantes do curso de Engenharia de Controle e Automação da **UERGS (Campus Porto Alegre)**. 

Este repositório contém a **Plataforma Digital Oficial** do Centro Acadêmico e todo o **Dossiê Jurídico-Estatutário** da Assembleia Geral de Fundação convocada para **26 de outubro de 2026**.

A plataforma foi arquitetada como uma aplicação web moderna (JAMstack pura), de altíssima performance, com **custo operacional rigorosamente zero (R$ 0,00/mês)** e total conformidade com a LGPD.

---

## ✨ Funcionalidades da Plataforma

* 🗳️ **Urna Eletrônica Universitária:** Cédula digital para votação nas deliberações de fundação e comissão pró-CA. Permite voto individual secreto (LGPD Art. 7º) com cruzamento de censo e quórum em tempo real.
* 📜 **Extrato Oficial de Apuração para a Ata:** Emissão com um clique de documento oficial formatado para impressão A4 e PDF, pronto para assinatura da mesa e anexo à Ata Notarial.
* 🎓 **Comparador Interativo de PPCs (2019 vs 2024):** Visualizador de matrizes curriculares com trilhas formativas (Controle, Robótica, IA, Eletrônica e Mecânica).
* 💼 **Mural de Estágios & Oportunidades:** Integração de vagas locais e no Polo Petroquímico/Região Metropolitana para discentes de Engenharia.
* 🛍️ **Lojinha Acadêmica:** Mostruário de produtos oficiais (moletons, copos térmicos, canecas comemorativas) para financiamento estudantil.
* 🔐 **Painel Administrativo Discreto (RBAC Nível 3):** Área de gestão oculta do header público, acessível exclusivamente por membros de diretoria homologados, com controle de eleição e revogação de acessos.
* 📱 **PWA (Progressive Web App):** Instalável no celular de alunos e professores como aplicativo nativo ("Adicionar à Tela Inicial").
* 🌐 **Social Cards & Open Graph:** Pré-visualizações ricas e automáticas ao compartilhar o link em grupos de WhatsApp e redes sociais.

---

## 📁 Estrutura do Repositório

```text
├── docs/                                  # Acervo Documental e Governança
│   ├── fundacao/                          # Dossiê Oficial da Assembleia de Fundação
│   │   ├── 01_Estrategia_Fundacao_Eca2.md # Cronograma e Quórum do Salchipão
│   │   ├── 02_Edital_de_Convocacao.md     # Edital de Convocação com antecedência legal
│   │   ├── 03_Roteiro_da_Assembleia.md    # Roteiro minuto a minuto da mesa diretora
│   │   ├── 04_Ata_de_Fundacao.md          # Minuta para Cartório e Registro Civil
│   │   ├── 05_Lista_de_Presenca.html      # Prancha física para assinaturas
│   │   ├── 06_Controle_Turmas.csv         # Mapeamento dos 10 semestres
│   │   ├── 07_Mensagens_Divulgacao.md     # Campanhas de comunicação para WhatsApp
│   │   ├── 08_Lista_Participantes.csv     # Censo estudantil preliminar
│   │   ├── 09_Fluxograma.md               # Fluxograma do rito da assembleia
│   │   └── 10_Estrategia_Redes_Sociais.md # Diretrizes de engajamento
│   ├── identidade_visual/                 # Estudos de branding, logotipos e favicons
│   ├── GUIA_PUBLICACAO_DEPLOY_CUSTO_ZERO.md # Passo a passo para publicação na web
│   ├── PLANO_ARQUITETURA_E_SEGURANCA_ADM.md # Especificação do RBAC e rotas restritas
│   ├── POLITICA_DE_PRIVACIDADE_LGPD.md    # Política de Privacidade (Lei 13.709/18)
│   └── README.md                          # Índice completo da documentação
│
├── site/                                  # Código-Fonte da Aplicação Web
│   ├── css/                               # Folhas de estilo (Design System, Admin)
│   ├── img/                               # Ativos visuais, fotos e logotipos oficiais
│   ├── js/                                # Módulos ES6 (App, Store, Backoffice ADM)
│   ├── pdf/                               # Acervo de PDFs gerados e PPCs do curso
│   ├── supabase/                          # Script SQL para o banco na nuvem
│   ├── index.html                         # Ponto de entrada da aplicação
│   ├── manifest.json                      # Configuração PWA
│   └── vercel.json                        # Cabeçalhos de segurança e cache Edge
│
├── gerar_pdfs.js                          # Compilador de Markdown para PDFs elegantes (A4)
├── package.json                           # Scripts utilitários de desenvolvimento
└── GEMINI.md                              # Diretrizes operacionais de governança IA
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 18 ou superior).

### 1. Clonar o Repositório
```bash
git clone https://github.com/caeca2uergs/caeca2uergs.git
cd caeca2uergs
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm start
```
Abra no navegador em: **`http://localhost:3000`**

### 3. Recompilar os PDFs da Fundação (Opcional)
Se editar qualquer documento Markdown na pasta `docs/fundacao/`, basta rodar:
```bash
npm run generate:pdfs
```

---

## 🌐 Deploy na Nuvem (Custo Zero / R$ 0,00)

O projeto está configurado para publicação instantânea na **Vercel** e **Supabase**:

1. **Front-end:** Conecte o repositório na **Vercel**, selecionando a pasta raiz como `site`.
2. **Banco de Dados:** Crie um projeto gratuito no **Supabase**, execute o script [`site/supabase/schema.sql`](site/supabase/schema.sql) e configure as credenciais em [`site/js/config.js`](site/js/config.js).
3. **Instruções Detalhadas:** Consulte o [`docs/GUIA_PUBLICACAO_DEPLOY_CUSTO_ZERO.md`](docs/GUIA_PUBLICACAO_DEPLOY_CUSTO_ZERO.md).

---

## 🛡️ Privacidade & LGPD

O E(CA)² preza pelo respeito absoluto aos dados dos discentes da UERGS. Esta plataforma observa todas as diretrizes da **Lei Geral de Proteção de Dados (Lei 13.709/2018)**:
* Os votos na urna são criptograficamente dissociados da identidade do aluno;
* Nenhum dado de navegação é vendido ou compartilhado com terceiros;
* O acesso administrativo é restrito por controle de acesso baseado em funções (RBAC).

---

## 📬 Contato & Comunidade

* 📧 **E-mail Institucional:** [ca.eca2.uergs@gmail.com](mailto:ca.eca2.uergs@gmail.com)
* 📍 **Endereço:** Rua Washington Luiz, 675, Centro Histórico, Porto Alegre - RS (Campus Central UERGS)
* 📷 **Instagram:** [@eca2uergs](https://instagram.com/eca2uergs)
* 🐙 **GitHub:** [github.com/caeca2uergs](https://github.com/caeca2uergs)

---

*Desenvolvido com dedicação pela comunidade de Engenharia de Controle e Automação da UERGS.*
