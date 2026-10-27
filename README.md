# ⚡ E(CA)² · Centro Acadêmico de Engenharia de Controle e Automação
### Universidade Estadual do Rio Grande do Sul – UERGS · Unidade Porto Alegre

[![Status](https://img.shields.io/badge/Status-Produção_Ativa-0284c7.svg?style=flat-square)](#)
[![Hospedagem](https://img.shields.io/badge/Deploy-Vercel_Online-000000.svg?style=flat-square&logo=vercel)](https://eca2uergs.vercel.app)
[![Banco de Dados](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E.svg?style=flat-square&logo=supabase)](#)
[![LGPD](https://img.shields.io/badge/Conformidade-LGPD_Lei_13.709-10b981.svg?style=flat-square)](#)
[![PWA](https://img.shields.io/badge/PWA-Instalável-f59e0b.svg?style=flat-square)](#)
[![Custo](https://img.shields.io/badge/Custo_Mensal-R$_0%2C00-22c55e.svg?style=flat-square)](#)

> 🌐 **Acesse o Portal Oficial em Produção:**  
> **[https://eca2uergs.vercel.app](https://eca2uergs.vercel.app)**

---

## 🏛️ Sobre o Projeto

O **E(CA)²** (Centro Acadêmico de Engenharia de Controle e Automação) é a entidade representativa máxima dos estudantes do curso de Engenharia de Controle e Automação da **UERGS (Campus Porto Alegre / Central)**. 

Este repositório contém a **Plataforma Digital Oficial** do Centro Acadêmico, desenhada para centralizar serviços acadêmicos, comunicação discente, matrizes curriculares e a agenda integrada de eventos do curso.

A plataforma foi arquitetada como uma aplicação web moderna (JAMstack pura em Vanilla ES6 Modules e CSS moderno), de altíssima performance, com **custo operacional rigorosamente zero (R$ 0,00/mês)** e total conformidade com a LGPD.

---

## ✨ Funcionalidades da Plataforma

* 🎓 **Comparador Interativo de PPCs (2019 vs 2024):** Visualizador de matrizes curriculares e matriz reativa de dependências (identificação visual imediata de pré-requisitos e disciplinas desbloqueadas).
* 🏛️ **Agenda Integrada UERGS Porto Alegre (Scraping Oficial):** Sincronização automatizada da agenda oficial da UERGS filtrando a unidade de Porto Alegre / Campus Central (Washington Luiz), com filtro temporal dinâmico que destaca os próximos eventos e oculta eventos já realizados.
* 👥 **Censo Discente Homologado:** Base restrita a 203 estudantes com e-mail institucional `@uergs.edu.br`.
* 💼 **Mural de Oportunidades & Avisos:** Integração de vagas de estágio, monitorias e avisos acadêmicos para discentes de Engenharia.
* 🛍️ **Lojinha Acadêmica:** Mostruário de produtos oficiais (moletons, copos térmicos, canecas comemorativas) para financiamento estudantil.
* 👑 **Painel Administrativo & Super Admin (RBAC Nível 3):** Área de gestão protegida por autenticação com credenciais e controle total de turmas, avisos e eventos.
* 📱 **PWA (Progressive Web App):** Instalável no celular de alunos e professores como aplicativo nativo ("Adicionar à Tela Inicial").
* 🛡️ **Rotina Keep-Alive Anti-Pausa:** Automação em nuvem via GitHub Actions a cada 3 dias para garantir que o banco de dados gratuito do Supabase permaneça 100% ativo 24/7.

---

## 📁 Estrutura do Repositório

```text
├── .github/workflows/                     # Automações GitHub Actions
│   ├── scrape_weekly.yml                  # Raspagem semanal da agenda UERGS Porto Alegre
│   └── supabase_keepalive.yml             # Heartbeat anti-inatividade do banco Supabase
│
├── _arquivo_historico_fundacao_26/        # Arquivo histórico reservado da fundação
│   └── pdf/                               # PDFs estatutários e atas de fundação
│
├── scripts/                               # Automações e utilitários de backoffice
│   ├── scrape_uergs_events.js             # Scraper da agenda oficial UERGS (Filtro POA)
│   ├── auto_scrape_weekly.js              # Verificador semanal com trava de 7 dias
│   └── supabase_keepalive.js              # Ping de atividade para o Supabase
│
├── site/                                  # Código-Fonte da Aplicação Web
│   ├── css/                               # Folhas de estilo (Design System, Admin)
│   ├── data/                              # Dados compilados (uergs_eventos_poa.json)
│   ├── img/                               # Ativos visuais, fotos e logotipos oficiais
│   ├── js/                                # Módulos ES6 (App, Store, Backoffice ADM)
│   ├── pdf/                               # Acervo de PPCs e manuais acadêmicos
│   ├── supabase/                          # Schema SQL completo do banco de dados
│   ├── index.html                         # Ponto de entrada da aplicação
│   └── manifest.json                      # Configuração PWA
│
├── vercel.json                            # Configuração de deploy da Vercel (outputDirectory: site)
├── package.json                           # Scripts utilitários de desenvolvimento
└── README.md                              # Documentação principal
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

### 2. Iniciar o Servidor Local
```bash
npm start
```
Abra no navegador em: **`http://localhost:3000`**

### 3. Comandos Úteis
```bash
# Validar sintaxe de todos os arquivos JS
npm run check

# Executar raspagem da agenda da UERGS (Porto Alegre)
npm run scrape:events

# Testar rotina de Keep-Alive do banco Supabase
npm run supabase:ping
```

---

## 🌐 Deploy Contínuo (Vercel & Supabase)

O repositório está integrado para deploy contínuo em produção:
* **Produção ativa na Vercel:** [https://eca2uergs.vercel.app](https://eca2uergs.vercel.app)
* Todo push na branch `main` dispara o deploy automático no servidor da Vercel em segundos.
* O banco de dados PostgreSQL roda no **Supabase** sob o projeto `eca2-uergs-db` com conexões autenticadas e políticas RLS ativas.

---

## 🛡️ Privacidade & LGPD

O E(CA)² preza pelo respeito absoluto aos dados dos discentes da UERGS. Esta plataforma observa todas as diretrizes da **Lei Geral de Proteção de Dados (Lei 13.709/2018)**:
* Nenhum dado de navegação é vendido ou compartilhado com terceiros;
* O acesso administrativo é restrito por controle de acesso baseado em funções (RBAC).

---

## 📬 Contato & Comunidade

* 📧 **E-mail Institucional:** [ca.eca2.uergs@gmail.com](mailto:ca.eca2.uergs@gmail.com)
* 📍 **Endereço:** Rua Washington Luiz, 675, Centro Histórico, Porto Alegre - RS (Campus Central UERGS)
* 📷 **Instagram:** [@eca2uergs](https://instagram.com/eca2uergs)
* 🐙 **GitHub:** [github.com/caeca2uergs](https://github.com/caeca2uergs)

---

*Centro Acadêmico de Engenharia de Controle e Automação – UERGS Porto Alegre.*
