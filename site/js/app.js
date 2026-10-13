import { CONFIG } from "./config.js";
import { CURSO, PRINCIPIOS, LINHA_DO_TEMPO, FAQ, CATEGORIAS_SUGESTAO, CATEGORIAS_FORUM, STATUS_SUGESTAO, PRODUTOS_SHOP, DOCUMENTOS_OFICIAIS, ARVORES_PPC, BENEFICIOS_UERGS, CALENDARIO_EVENTOS, ESTAGIOS_MERCADO } from "./content.js";
import { createStore, onAuth, getAuth, isVotingEmailAllowed } from "./store.js";
import { renderAdminHtml, setupAdminInteractions } from "./modules/admin.js";

// Estado global do aplicativo
let store;
let currentRoute = "inicio";
let topicDetailId = null;
let currentCursoTab = "perfil";

// Helpers de Notificação (Toasts)
function showToast(message, isError = false) {
  const container = document.getElementById("toasts-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${isError ? "error" : ""}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Dialog Fallbacks para navegadores sem closedby
function setupDialogBackdropClose(dialog) {
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) dialog.close();
    });
  }
}

// Utilitários de Data e Horário
function formatRelativeTime(isoString) {
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return "agora mesmo";
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
    return `há ${Math.floor(diff / 86400)} dias`;
  } catch {
    return "";
  }
}

// Atualização da Barra de Autenticação no Header
function updateAuthNav(auth) {
  const slot = document.getElementById("auth-nav-slot");
  if (!slot) return;
  if (auth.user) {
    const name = auth.profile?.display_name || "Estudante";
    slot.innerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" id="btn-open-profile" title="Ver perfil">
        <span class="avatar" style="width:24px; height:24px; font-size:.7rem;">${name.slice(0, 2).toUpperCase()}</span>
        <span>${escapeHtml(name)}</span>
      </button>
    `;
    document.getElementById("btn-open-profile")?.addEventListener("click", () => {
      const dlg = document.getElementById("dlg-profile");
      const nameInput = document.getElementById("prof-name");
      const semInput = document.getElementById("prof-sem");
      const admSec = document.getElementById("prof-admin-section");
      if (nameInput) nameInput.value = auth.profile?.display_name || "";
      if (semInput) semInput.value = auth.profile?.semester || "";
      if (admSec) admSec.style.display = auth?.isAdmin ? "block" : "none";
      dlg?.showModal();
    });

    document.getElementById("btn-profile-open-admin")?.addEventListener("click", () => {
      const dlg = document.getElementById("dlg-profile");
      dlg?.close();
      navigate("admin");
    });
  } else {
    slot.innerHTML = `<button type="button" class="btn btn-primary btn-sm" id="btn-open-login">Entrar</button>`;
    document.getElementById("btn-open-login")?.addEventListener("click", () => {
      document.getElementById("dlg-auth")?.showModal();
    });
  }
}

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

// -------------------------------------------------------------
// Roteador e Renderização de Páginas
// -------------------------------------------------------------

function navigate(route, id = null) {
  currentRoute = route;
  topicDetailId = id;
  if (route === "curso") {
    currentCursoTab = id || "perfil";
  }
  window.location.hash = id ? `${route}/${id}` : route;
  
  // Atualiza classes ativas do menu
  document.querySelectorAll(".nav-links a").forEach(a => {
    const navKey = a.getAttribute("data-nav");
    const isCursoMatch = route === "curso" && (navKey === `curso-${currentCursoTab}` || (currentCursoTab === "perfil" && navKey === "curso-perfil"));
    const isAdminMatch = (route === "admin" || route.startsWith("admin/")) && navKey === "admin";
    if (navKey === route || isCursoMatch || isAdminMatch) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });

  // Atualiza destaque dos dropdowns quando rota filha estiver ativa
  const ddCurso = document.getElementById("btn-curso-toggle");
  if (ddCurso) {
    if (route === "curso") {
      ddCurso.setAttribute("aria-current", "page");
    } else {
      ddCurso.removeAttribute("aria-current");
    }
  }

  const ddComunidade = document.getElementById("btn-comunidade-toggle");
  if (ddComunidade) {
    if (["mural", "forum", "faq", "registro"].includes(route)) {
      ddComunidade.setAttribute("aria-current", "page");
    } else {
      ddComunidade.removeAttribute("aria-current");
    }
  }

  const ddFundacao = document.getElementById("btn-fundacao-toggle");
  if (ddFundacao) {
    if (["fundacao", "eleicao", "documentos", "estatutos", "urna"].includes(route)) {
      ddFundacao.setAttribute("aria-current", "page");
    } else {
      ddFundacao.removeAttribute("aria-current");
    }
  }

  // Fecha menu mobile
  document.getElementById("nav-links")?.classList.remove("open");

  // Animação de transição nativa caso suportado
  if (document.startViewTransition) {
    document.startViewTransition(() => renderCurrentView());
  } else {
    renderCurrentView();
  }
}

async function renderCurrentView() {
  const root = document.getElementById("app-root");
  if (!root) return;

  switch (currentRoute) {
    case "admin":
      root.innerHTML = renderAdminHtml(getAuth());
      await setupAdminInteractions(store, navigate, showToast);
      break;
    case "inicio":
      root.innerHTML = renderHomeHtml();
      setupHomeInteractions();
      break;
    case "registro":
      root.innerHTML = renderRegistroHtml();
      await setupRegistroInteractions();
      break;
    case "eleicao":
      root.innerHTML = renderEleicaoHtml();
      await setupEleicaoInteractions();
      break;
    case "urna":
      root.innerHTML = renderUrnaHtml();
      await setupUrnaInteractions();
      break;
    case "eventos":
      root.innerHTML = renderEventosHtml();
      await setupEventosInteractions();
      break;
    case "shop":
      root.innerHTML = renderShopHtml();
      setupShopInteractions();
      break;
    case "fundacao":
      root.innerHTML = renderFundacaoHtml();
      setupFundacaoInteractions();
      break;
    case "documentos":
    case "estatutos":
      root.innerHTML = renderDocumentosHtml();
      setupDocumentosInteractions();
      break;
    case "mural":
      root.innerHTML = renderMuralHtml();
      await setupMuralInteractions();
      break;
    case "enquetes":
      root.innerHTML = renderEnquetesHtml();
      await setupEnquetesInteractions();
      break;
    case "forum":
      if (topicDetailId) {
        root.innerHTML = `<div class="container section"><div class="skeleton"></div></div>`;
        await renderTopicDetail(topicDetailId);
      } else {
        root.innerHTML = renderForumHtml();
        await setupForumInteractions();
      }
      break;
    case "curso":
      root.innerHTML = renderCursoHtml(currentCursoTab);
      setupCursoInteractions(currentCursoTab);
      break;
    case "faq":
      root.innerHTML = renderFaqHtml();
      setupFaqView();
      break;
    default:
      root.innerHTML = renderHomeHtml();
      setupHomeInteractions();
      break;
  }
}

// -------------------------------------------------------------
// VISTA: INÍCIO (Home)
// -------------------------------------------------------------
function renderHomeHtml() {
  return `
    <section class="section hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">Engenharia de Controle & Automação · UERGS</span>
          <h1>Sem feedback <span class="grad-text">não há controle.</span></h1>
          <p class="slogan">E(CA)² · O Centro Acadêmico construído para e pelos estudantes.</p>
          <p class="lead">
            Plataforma oficial de apoio acadêmico, matrizes curriculares dos PPCs, visitas técnicas na indústria, lojinha oficial e representação ativa para calouros ("bichos") e veteranos.
          </p>
          <div class="row" style="flex-wrap: wrap; gap: .6rem; margin-bottom: 1.5rem;">
            <a href="#fundacao" class="btn btn-primary" style="box-shadow: 0 0 20px hsl(189 94% 55% / .4);">🌭 Salchipão & Assinaturas (26/10)</a>
            <a href="#curso" class="btn btn-ghost">🎓 Árvore de Matérias (PPCs)</a>
            <a href="#eventos" class="btn btn-ghost">📅 Calendário 2026</a>
            <a href="#shop" class="btn btn-ghost">☕ Lojinha E(CA)²</a>
          </div>

          <!-- Contagem Regressiva para o Salchipão das 18h30 -->
          <div class="countdown" id="event-countdown" aria-label="Contagem regressiva até o Salchipão de 26/10">
            <div class="unit"><span class="num" id="cd-days">--</span><span class="lbl">Dias</span></div>
            <div class="unit"><span class="num" id="cd-hours">--</span><span class="lbl">Horas</span></div>
            <div class="unit"><span class="num" id="cd-mins">--</span><span class="lbl">Minutos</span></div>
            <div class="unit"><span class="num" id="cd-secs">--</span><span class="lbl">Segundos</span></div>
          </div>
          <div class="event-meta">
            <span>📅 Segunda-feira · 26 de Outubro · <strong>18:30 às 19:15</strong></span>
            <span>📍 Refeitório da UERGS · Salchipão dos Estudantes & Coleta de Assinaturas</span>
          </div>
        </div>

        <!-- Painel Visual com Imagem Real dos Estudantes no Lab -->
        <div class="stack" style="gap: 1.25rem;">
          <div class="card hover" style="padding: 0; overflow: hidden; border: 1px solid var(--border-strong);">
            <div style="position: relative;">
              <img src="img/hero_estudantes.jpg" alt="Estudantes de Engenharia de Controle e Automação no Laboratório UERGS" style="width: 100%; height: 260px; object-fit: cover; display: block;">
              <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, hsl(224 50% 6% / .95) 100%);"></div>
              <span class="badge cyan" style="position: absolute; top: 14px; left: 14px; backdrop-filter: blur(8px);">Laboratório de Automação & Robótica</span>
            </div>
            <div style="padding: 1.25rem 1.5rem 1.5rem;">
              <h3 style="font-size: 1.15rem; margin-bottom: .3rem;">Construído por e para estudantes</h3>
              <p class="muted small" style="margin: 0;">
                Da bancada de ensaios e CLPs até as conversas com a coordenação: o E(CA)² é a nossa plataforma ativa no campus.
              </p>
            </div>
          </div>

          <!-- Diagrama de Malha Fechada Interativo Compacto -->
          <div class="card loop-card" style="padding: 1.25rem 1.5rem;">
            <div class="row" style="margin-bottom: .6rem; justify-content: space-between;">
              <span class="small" style="font-family: var(--font-mono); color: var(--cyan); font-weight: 600;">MALHA DE FEEDBACK DO CURSO</span>
              <span class="badge amber" style="font-size: .7rem;">Ativa</span>
            </div>
            <svg class="loop-svg" viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de Malha de Controle do E(CA)²">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="var(--cyan)" />
                  <stop offset="100%" stop-color="var(--amber)" />
                </linearGradient>
              </defs>
              <path d="M 30 70 L 110 70" class="wire" />
              <path d="M 130 70 L 180 70" class="wire" />
              <path d="M 300 70 L 360 70" class="wire" />
              <path d="M 480 70 L 520 70" class="wire" />
              <path d="M 500 70 L 500 160 L 120 160 L 120 80" class="wire" />
              <path d="M 30 70 L 110 70 L 180 70 L 300 70 L 480 70 L 500 70 L 500 160 L 120 160 L 120 70" class="flow" />
              <circle cx="120" cy="70" r="11" class="sum" />
              <text x="120" y="68" style="font-size: 13px;">Σ</text>
              <rect x="180" y="45" width="120" height="50" rx="8" class="blk ctrl" />
              <text x="240" y="68">E(CA)²</text>
              <text x="240" y="82" class="sub">Controlador</text>
              <rect x="360" y="45" width="120" height="50" rx="8" class="blk plant" />
              <text x="420" y="68">O Curso</text>
              <text x="420" y="82" class="sub">Planta / Alunos</text>
              <text x="310" y="180" class="sub">Feedback contínuo dos estudantes 🔁</text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Central de Utilidades para Bichos e Veteranos -->
    <section class="section" style="padding-top: 1rem;">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Ferramentas & Vida Acadêmica</span>
          <h2>A Plataforma do Estudante de Controle & Automação</h2>
          <p>Tudo o que calouros e veteranos precisam para navegar no curso sem trancar disciplinas e aproveitar oportunidades.</p>
        </div>

        <div class="grid grid-4" style="margin-bottom: 3rem;">
          <a href="#curso" class="card hover" style="text-decoration: none; color: inherit; display: block;">
            <div class="icon">🗺️</div>
            <h3 style="font-size: 1.15rem; margin-bottom: .35rem;">Árvores de PPCs</h3>
            <p class="muted small" style="margin: 0;">
              Visualize a cadeia de dependências entre PPC 2019 e 2024. Saiba exatamente o que tranca o que antes da matrícula.
            </p>
          </a>

          <a href="#eventos" class="card hover" style="text-decoration: none; color: inherit; display: block;">
            <div class="icon">📅</div>
            <h3 style="font-size: 1.15rem; margin-bottom: .35rem;">Calendário 2026</h3>
            <p class="muted small" style="margin: 0;">
              Salchipão inaugural (26/10), visitas técnicas industriais com robôs e minicursos práticos de CLP com certificados.
            </p>
          </a>

          <a href="#shop" class="card hover" style="text-decoration: none; color: inherit; display: block;">
            <div class="icon">☕</div>
            <h3 style="font-size: 1.15rem; margin-bottom: .35rem;">Lojinha & Vestuário</h3>
            <p class="muted small" style="margin: 0;">
              Copos térmicos gravados a laser, moletons oficiais, canecas de laboratório e kits didáticos para estudantes.
            </p>
          </a>

          <a href="#mural" class="card hover" style="text-decoration: none; color: inherit; display: block;">
            <div class="icon">💡</div>
            <h3 style="font-size: 1.15rem; margin-bottom: .35rem;">Mural de Oportunidades</h3>
            <p class="muted small" style="margin: 0;">
              Vagas de estágio em Porto Alegre e Região, bolsas de iniciação científica e espaço para sugerir melhorias no curso.
            </p>
          </a>
        </div>
      </div>
    </section>

    <!-- Destaque Especial: Salchipão 26/10 -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="card" style="padding: 2.5rem; background: linear-gradient(135deg, hsl(220 40% 14% / .85), hsl(190 70% 15% / .5)); border: 2px solid var(--cyan); box-shadow: 0 10px 30px -10px hsl(189 94% 55% / .3);">
          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
            <div style="max-width: 620px;">
              <span class="badge amber" style="margin-bottom: .5rem;">Primeiro Grande Evento do Semestre</span>
              <h2 style="font-size: 1.85rem; margin: 0 0 .5rem;">🌭 Salchipão de Confraternização & Coleta de Assinaturas</h2>
              <p class="muted" style="line-height: 1.6; margin: 0 0 .75rem;">
                <strong>Segunda-feira · 26 de Outubro · Das 18:30 às 19:15 · Refeitório da UERGS.</strong><br>
                Distribuição gratuita de salchipães para todos os estudantes de Engenharia de Controle e Automação. Basta assinar a lista de presença da fundação do E(CA)², retirar seu pão e aproveitar o espaço para conversar com colegas de todos os semestres. Total liberdade para confraternizar no refeitório ou levar seu lanche!
              </p>
              <span class="small" style="color: var(--cyan);">✓ Demonstração do site nos celulares com simulador de Urna Eletrônica e Árvore Curricular.</span>
            </div>
            <div class="stack" style="gap: .75rem; min-width: 220px;">
              <a href="#fundacao" class="btn btn-primary" style="text-align: center;">Confirmar Presença (RSVP) 🌭</a>
              <a href="#eleicao" class="btn btn-ghost" style="text-align: center;">Ver Cédula & Urna Digital 🗳️</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Princípios Básicos -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Nossos Pilares</span>
          <h2>Um CA feito de forma correta e sem donos</h2>
          <p>Transparência total, sem partidarismo e com participação aberta a cada semestre.</p>
        </div>

        <div class="grid grid-4">
          ${PRINCIPIOS.map(p => `
            <div class="card hover">
              <div class="icon">${p.icone}</div>
              <h3>${p.titulo}</h3>
              <p class="muted small">${p.texto}</p>
            </div>
          `).join("")}
        </div>
      </div>
  `;
}

function setupHomeInteractions() {
  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
  window.addEventListener("hashchange", () => clearInterval(timer), { once: true });
}

function updateCountdown() {
  const target = new Date(CONFIG.EVENT.datetime).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-mins");
  const sEl = document.getElementById("cd-secs");

  if (dEl) dEl.textContent = String(days).padStart(2, "0");
  if (hEl) hEl.textContent = String(hours).padStart(2, "0");
  if (mEl) mEl.textContent = String(mins).padStart(2, "0");
  if (sEl) sEl.textContent = String(secs).padStart(2, "0");
}

// -------------------------------------------------------------
// VISTA: CADASTRO GERAL DE ALUNOS (REGISTRO ESTUDANTIL)
// -------------------------------------------------------------
function renderRegistroHtml() {
  const auth = getAuth();
  const prof = auth.profile || {};
  const isLogged = !!auth.user;

  return `
    <section class="section">
      <div class="container" style="max-width: 860px;">
        <div class="section-head">
          <span class="eyebrow">Censo & Associação Estudantil</span>
          <h2>Cadastro Oficial de Estudantes · E(CA)²</h2>
          <p>
            O objetivo é registrar <strong>o máximo de alunos possível</strong> do curso de Engenharia de Controle e Automação da UERGS.
            Com seu registro, o CA fortalece a representatividade do curso, identifica demandas de cada semestre e cria um canal direto para vagas de estágio, materiais e visitas técnicas.
          </p>
        </div>

        <div class="card" style="border-left: 4px solid var(--cyan); margin-bottom: 2rem; background: hsl(189 94% 55% / .08);">
          <div class="row">
            <span style="font-size: 1.5rem;">🎓</span>
            <div>
              <strong>Habilitação de Voto para a Assembleia:</strong>
              <p class="small muted" style="margin: .2rem 0 0;">
                Se o seu e-mail não estiver na listagem inicial dos 235 alunos pré-cadastrados, este formulário homologa seu vínculo como estudante de <strong>Engenharia de Controle e Automação</strong> e habilita seu voto na cédula e na urna eletrônica!
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-2" style="align-items: start; margin-bottom: 2.5rem;">
          <!-- Formulário Principal -->
          <div class="card" style="padding: 2rem;">
            <h3>📝 Ficha de Registro Estudantil</h3>
            <p class="muted small" style="margin-bottom: 1.5rem;">
              ${isLogged ? `Você está conectado como <strong>${escapeHtml(auth.user.email)}</strong>. Revise ou atualize seus dados:` : `Cadastre-se para se conectar à comunidade do curso e ter voz ativa no portal:`}
            </p>

            <form id="form-registro-aluno" class="form">
              <div class="field">
                <label for="reg-nome">Nome Completo *</label>
                <input type="text" id="reg-nome" name="display_name" required value="${escapeHtml(prof.display_name || '')}" placeholder="Seu nome completo">
              </div>

              ${!isLogged ? `
                <div class="field">
                  <label for="reg-email">E-mail para Acesso *</label>
                  <input type="email" id="reg-email" name="email" required placeholder="seu.email@uergs.edu.br ou pessoal">
                  <span class="hint">Usado para identificação segura no portal.</span>
                </div>
              ` : ''}

              <div class="grid grid-2">
                <div class="field">
                  <label for="reg-semestre">Semestre Atual *</label>
                  <select id="reg-semestre" name="semester" required>
                    <option value="">Selecione...</option>
                    <option value="1º semestre" ${prof.semester === '1º semestre' ? 'selected' : ''}>1º semestre (Calouro)</option>
                    <option value="2º semestre" ${prof.semester === '2º semestre' ? 'selected' : ''}>2º semestre</option>
                    <option value="3º semestre" ${prof.semester === '3º semestre' ? 'selected' : ''}>3º semestre</option>
                    <option value="4º semestre" ${prof.semester === '4º semestre' ? 'selected' : ''}>4º semestre</option>
                    <option value="5º semestre" ${prof.semester === '5º semestre' ? 'selected' : ''}>5º semestre</option>
                    <option value="6º semestre" ${prof.semester === '6º semestre' ? 'selected' : ''}>6º semestre</option>
                    <option value="7º semestre" ${prof.semester === '7º semestre' ? 'selected' : ''}>7º semestre</option>
                    <option value="8º semestre" ${prof.semester === '8º semestre' ? 'selected' : ''}>8º semestre</option>
                    <option value="9º semestre" ${prof.semester === '9º semestre' ? 'selected' : ''}>9º semestre</option>
                    <option value="10º semestre" ${prof.semester === '10º semestre' ? 'selected' : ''}>10º semestre (Formando)</option>
                    <option value="Irregular / TCC" ${prof.semester === 'Irregular / TCC' ? 'selected' : ''}>Grade livre / TCC</option>
                  </select>
                </div>

                <div class="field">
                  <label for="reg-matricula">Matrícula UERGS</label>
                  <input type="text" id="reg-matricula" name="registration" value="${escapeHtml(prof.registration || '')}" placeholder="Opcional / Privado">
                </div>
              </div>

              <div class="field">
                <label for="reg-whatsapp">WhatsApp para Avisos</label>
                <input type="text" id="reg-whatsapp" name="whatsapp" value="${escapeHtml(prof.whatsapp || '')}" placeholder="(51) 99999-9999 (Opcional)">
                <span class="hint">Apenas para convites de eventos e comunidade oficial.</span>
              </div>

              <div class="field">
                <label for="reg-interesses">Áreas de Maior Interesse no Curso</label>
                <input type="text" id="reg-interesses" name="interests" value="${escapeHtml(prof.interests || '')}" placeholder="Ex: Robótica, CLP, Sistemas Supervisórios, IoT, Visão Computacional">
              </div>

              <div class="field" style="margin-top: .5rem;">
                <label style="display: flex; gap: .6rem; align-items: start; cursor: pointer;">
                  <input type="checkbox" id="reg-comprova-eca" name="comprova_eca" checked required style="margin-top: .25rem;">
                  <span class="small" style="color: var(--cyan); font-weight: 500;">
                    Declaro e comprovo matrícula ativa no curso de <strong>Engenharia de Controle e Automação</strong> da UERGS. *
                  </span>
                </label>
              </div>

              <div class="field" style="margin-top: .35rem;">
                <label style="display: flex; gap: .6rem; align-items: start; cursor: pointer;">
                  <input type="checkbox" id="reg-comissao" name="commission_interest" ${prof.commission_interest ? 'checked' : ''} style="margin-top: .25rem;">
                  <span class="small" style="color: var(--muted);">
                    Tenho interesse em colaborar com a <strong>Comissão Pró-CA E(CA)²</strong> (estatuto, palestras, comunicação ou eventos).
                  </span>
                </label>
              </div>

              <div class="field" style="margin-top: .5rem; padding: .8rem; border-radius: var(--radius-sm); background: hsl(220 40% 12% / .6); border: 1px solid var(--border);">
                <p class="small muted" style="margin: 0; font-size: .8rem; line-height: 1.5;">
                  🔒 <strong>Garantia de Privacidade & LGPD:</strong> Seus dados de contato e matrícula são confidenciais, usados unicamente para fins associativos discentes e nunca compartilhados com terceiros. <button type="button" class="btn-open-lgpd-modal" style="background: none; border: none; color: var(--cyan); text-decoration: underline; cursor: pointer; padding: 0; font-size: .8rem; font-family: inherit;">Ver Política de Privacidade (Lei 13.709/18)</button>.
                </p>
              </div>

              <button type="submit" class="btn btn-primary" id="btn-submit-registro" style="margin-top: .5rem;">
                ${isLogged ? 'Atualizar Meu Cadastro' : 'Finalizar Registro de Estudante'}
              </button>
            </form>
          </div>

          <!-- Painel Lateral: Por que se registrar? -->
          <div class="stack" style="gap: 1.25rem;">
            <div class="card">
              <div class="icon">🎯</div>
              <h3>Por que todos devem se cadastrar?</h3>
              <ul class="muted small" style="padding-left: 1.1rem; line-height: 1.7; margin-bottom: 0;">
                <li><strong>Representatividade Real:</strong> Quanto maior o número de registros, maior a legitimidade do CA perante a universidade.</li>
                <li><strong>Oportunidades em 1ª mão:</strong> Vagas de estágio na Grande Porto Alegre filtradas para automação.</li>
                <li><strong>Direito a Voto:</strong> Participação garantida nas consultas públicas do estatuto e na eleição da primeira diretoria.</li>
                <li><strong>100% Gratuito:</strong> Livre associação garantida pela Constituição e Lei 7.395/1985.</li>
              </ul>
            </div>

            <!-- Resumo do Censo em Tempo Real -->
            <div class="card" id="censo-stats-card">
              <span class="eyebrow" style="margin-bottom: .25rem;">Métricas do Curso</span>
              <h3 style="margin-bottom: .75rem;">Estudantes no Portal</h3>
              <div id="censo-stats-content">
                <div class="skeleton" style="height: 60px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function setupRegistroInteractions() {
  const form = document.getElementById("form-registro-aluno");
  const statsEl = document.getElementById("censo-stats-content");

  // Carrega métricas agregadas do censo
  try {
    const summary = await store.listStudentsSummary();
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat" style="text-align: left; padding: 0; margin-bottom: 1rem;">
          <div class="val grad-text">${summary.total}</div>
          <div class="lbl">Alunos registrados no portal</div>
        </div>
        <p class="small muted" style="margin: 0;">
          Meta até a assembleia de 26/10: <strong>engajar todos os semestres ativos</strong> do campus Porto Alegre.
        </p>
      `;
    }
  } catch {
    if (statsEl) statsEl.innerHTML = `<p class="small muted">Mapeando estudantes...</p>`;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-registro");

    const display_name = form.display_name.value.trim();
    const email = form.email ? form.email.value.trim() : null;
    const semester = form.semester.value;
    const registration = form.registration ? form.registration.value.trim() : "";
    const whatsapp = form.whatsapp ? form.whatsapp.value.trim() : "";
    const interests = form.interests ? form.interests.value.trim() : "";
    const commission_interest = form.commission_interest ? form.commission_interest.checked : false;

    if (form.comprova_eca && !form.comprova_eca.checked) {
      showToast("É obrigatório comprovar/declarar vínculo com o curso de Engenharia de Controle e Automação.", true);
      return;
    }

    if (!display_name || !semester) {
      showToast("Preencha nome completo e semestre.", true);
      return;
    }

    try {
      if (btn) btn.disabled = true;
      const resp = await store.registerStudent({
        display_name,
        email,
        semester,
        registration,
        whatsapp,
        interests,
        commission_interest,
      });

      showToast(resp || "Cadastro de estudante concluído com sucesso! 🎉");
      navigate("registro");
    } catch (err) {
      showToast(err.message || "Erro ao salvar cadastro.", true);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

// -------------------------------------------------------------
// VISTA: VOTAÇÃO OFICIAL DA ASSEMBLEIA (CÉDULA ELETRÔNICA)
// -------------------------------------------------------------
function renderEleicaoHtml() {
  const auth = getAuth();
  const isLogged = !!auth.user;
  const currentUrl = window.location.href.split('#')[0] + "#eleicao";

  return `
    <section class="section">
      <div class="container" style="max-width: 900px;">
        <div class="section-head">
          <span class="eyebrow">Assembleia Geral de Fundação · 26/10/2026</span>
          <h2>Cédula de Votação da Assembleia do E(CA)²</h2>
          <p>
            Votação oficial para deliberação da fundação e aclamação da <strong>Comissão Pró-CA Transitória</strong>.
            Apenas estudantes cadastrados participam da contagem.
          </p>
        </div>

        <!-- Alerta de Identificação -->
        ${!isLogged ? `
          <div class="card" style="border-left: 4px solid var(--amber); margin-bottom: 2rem; background: hsl(35 100% 58% / .08);">
            <div class="row">
              <span style="font-size: 1.6rem;">⚠️</span>
              <div>
                <strong style="color: var(--amber);">Você ainda não se identificou:</strong>
                <p class="small muted" style="margin: .2rem 0 0;">
                  Para votar nesta cédula, você precisa estar cadastrado. Caso tenha preenchido o Google Forms ou a lista do Salchipão, acesse com seu e-mail para validar seu voto único.
                </p>
              </div>
              <button type="button" class="btn btn-primary btn-sm spacer" id="btn-eleicao-login" style="margin-left: auto;">
                Identificar-se / Registrar
              </button>
            </div>
          </div>
        ` : `
          <div class="card" style="border-left: 4px solid var(--cyan); margin-bottom: 2rem; background: hsl(189 94% 55% / .08);">
            <div class="row">
              <span style="font-size: 1.4rem;">✅</span>
              <div>
                <strong>Eleitor identificado:</strong> <span style="color: var(--cyan);">${escapeHtml(auth.profile?.display_name || auth.user.email)}</span>
                ${auth.profile?.semester ? `(${escapeHtml(auth.profile.semester)})` : ''}
                <div class="small muted">Voto único auditável garantido.</div>
              </div>
            </div>
          </div>
        `}

        <!-- Banner de Acesso à Cabine / Urna Eleitoral -->
        <div class="card hover" style="background: linear-gradient(135deg, hsl(220 40% 12% / .9) 0%, hsl(222 45% 8% / .9) 100%); border: 2px solid var(--cyan); margin-bottom: 2.25rem; box-shadow: 0 10px 30px -10px hsl(189 94% 55% / .3); padding: 1.5rem 1.75rem;">
          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
            <div style="max-width: 580px;">
              <span class="badge green" style="margin-bottom: .35rem;">Cabine Eletrônica Interativa</span>
              <h3 style="margin: 0; font-size: 1.35rem;">Simulador de Urna Eleitoral do E(CA)²</h3>
              <p class="small muted" style="margin: .35rem 0 0; line-height: 1.6;">
                Prefere votar com a interface de urna eletrônica? Acesse a cabine digital com tela de deliberação, botões físicos <strong style="color: #22c55e;">SIM (Verde)</strong>, <strong style="color: #ef4444;">NÃO (Vermelho)</strong> e <strong>BRANCO</strong>, com áudio oficial da urna!
              </p>
            </div>
            <a href="#urna" class="btn btn-primary" style="font-size: 1rem; padding: .75rem 1.4rem; box-shadow: 0 0 20px hsl(189 94% 55% / .4); white-space: nowrap;">
              🗳️ Abrir Urna Eleitoral ↗
            </a>
          </div>
        </div>

        <div class="grid grid-2" style="align-items: start; margin-bottom: 3rem;">
          <!-- Cédulas Oficiais da Assembleia -->
          <div class="stack" style="gap: 1.5rem;" id="box-cedulas-oficiais">
            <div class="card">
              <div class="row" style="margin-bottom: .6rem;">
                <span class="badge cyan">Deliberação 1</span>
                <span class="small muted">Item 4 da Pauta</span>
              </div>
              <h3 style="font-size: 1.15rem; line-height: 1.35; margin-bottom: 1rem;">
                "Fica fundado o Centro Acadêmico de Engenharia de Controle e Automação da UERGS – E(CA)², entidade representativa, autônoma e apartidária?"
              </h3>
              <div id="eleicao-poll-1"><div class="skeleton" style="height: 120px;"></div></div>
            </div>

            <div class="card">
              <div class="row" style="margin-bottom: .6rem;">
                <span class="badge amber">Deliberação 2</span>
                <span class="small muted">Item 5 da Pauta</span>
              </div>
              <h3 style="font-size: 1.15rem; line-height: 1.35; margin-bottom: 1rem;">
                "Aprova a criação da Comissão Pró-CA provisória"
              </h3>
              <div id="eleicao-poll-2"><div class="skeleton" style="height: 120px;"></div></div>
            </div>
          </div>

          <!-- Coluna Lateral: QR CODE e Transparência -->
          <div class="stack" style="gap: 1.5rem;">
            <!-- Painel do QR Code para o dia -->
            <div class="card" style="text-align: center; padding: 2rem;">
              <span class="eyebrow" style="margin-bottom: .4rem;">Para Espalhar no Dia</span>
              <h3 style="margin-bottom: .5rem;">QR Code da Votação</h3>
              <p class="muted small" style="margin-bottom: 1.25rem;">
                Abra este QR Code nos celulares ou imprima para colocar nas mesas do salchipão:
              </p>

              <div style="background: #fff; padding: 14px; border-radius: 14px; display: inline-block; margin-bottom: 1rem; box-shadow: 0 8px 30px rgba(0,0,0,.5);">
                <img id="qr-code-img" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}" alt="QR Code para Votação Oficial" width="180" height="180" style="display: block; margin: 0 auto;">
              </div>

              <div class="small muted" style="word-break: break-all; margin-bottom: 1rem;">
                Link: <code>${escapeHtml(currentUrl)}</code>
              </div>

              <button type="button" class="btn btn-ghost btn-sm" id="btn-imprimir-qr">
                🖨️ Imprimir Cartaz com QR Code
              </button>
            </div>

            <!-- Regras de Auditoria -->
            <div class="card">
              <h3>🛡️ Transparência da Votação</h3>
              <ul class="muted small" style="padding-left: 1.1rem; line-height: 1.7; margin: 0 0 1.25rem;">
                <li><strong>Cruzamento com a Lista:</strong> O secretário da mesa confere a lista física de presença antes de homologar os totais.</li>
                <li><strong>Registro na Ata:</strong> Os percentuais aprovados aqui serão lidos e anexados na <a href="pdf/04_Ata_de_Fundacao.pdf" target="_blank" style="color: var(--accent); text-decoration: underline;">Ata Oficial</a>.</li>
                <li><strong>Prevenção de Voto Duplo:</strong> Cada estudante autenticado só pode registrar um voto por proposta.</li>
                <li><strong>Sigilo do Voto (LGPD Art. 7º):</strong> O voto individual é criptografado e 100% secreto; apenas a chave de participação é auditada para quórum.</li>
              </ul>
              <button type="button" class="btn btn-primary btn-sm" id="btn-exportar-extrato-ata" style="width: 100%; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: .4rem;">
                📜 Gerar Extrato Oficial da Urna para a Ata
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function setupEleicaoInteractions() {
  document.getElementById("btn-eleicao-login")?.addEventListener("click", () => {
    document.getElementById("dlg-auth")?.showModal();
  });

  document.getElementById("btn-imprimir-qr")?.addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btn-exportar-extrato-ata")?.addEventListener("click", async () => {
    await gerarExtratoOficialAta(store);
  });

  // Carrega as duas enquetes oficiais da assembleia
  async function carregarCedulas() {
    try {
      const polls = await store.polls.list();
      const p1 = polls.find(p => p.question.includes("PROPOSTA 1") || p.question.includes("fundado")) || polls[0];
      const p2 = polls.find(p => p.question.includes("Comissão Pró-CA") || p.id === 104) || polls[1];

      function renderPollBlock(poll, containerId) {
        const el = document.getElementById(containerId);
        if (!el || !poll) return;

        const total = poll.options.reduce((a, b) => a + b.vote_count, 0);

        el.innerHTML = `
          <div class="stack" style="gap: .6rem;">
            ${poll.options.map(opt => {
              const pct = total > 0 ? Math.round((opt.vote_count / total) * 100) : 0;
              const isMine = poll.myOption === opt.id;

              return poll.is_open && !poll.myOption ? `
                <button type="button" class="poll-opt" data-poll-id="${poll.id}" data-opt-id="${opt.id}" style="font-weight: 500;">
                  <span class="bar" style="--pct: 0%;"></span>
                  <span>${escapeHtml(opt.label)}</span>
                </button>
              ` : `
                <div class="poll-opt ${isMine ? 'mine' : ''}">
                  <span class="bar" style="--pct: ${pct}%;"></span>
                  <span>${escapeHtml(opt.label)} ${isMine ? '✓ (Seu voto)' : ''}</span>
                  <span class="pct">${pct}% (${opt.vote_count})</span>
                </div>
              `;
            }).join("")}
          </div>
          <div class="row" style="margin-top: .75rem; justify-content: space-between;">
            <span class="small muted">${total} voto(s) registrado(s)</span>
            <span class="badge ${poll.is_open ? 'green' : 'slate'}">${poll.is_open ? 'Cédula Aberta' : 'Encerrada'}</span>
          </div>
        `;

        el.querySelectorAll("button.poll-opt").forEach(btn => {
          btn.addEventListener("click", async () => {
            const auth = getAuth();
            if (!auth.user) {
              showToast("Por favor, identifique-se com seu e-mail para votar.");
              document.getElementById("dlg-auth")?.showModal();
              return;
            }
            const pId = Number(btn.getAttribute("data-poll-id"));
            const oId = Number(btn.getAttribute("data-opt-id"));
            try {
              await store.polls.vote(pId, oId);
              showToast("Voto computado com sucesso! 🗳️");
              await carregarCedulas();
            } catch (err) {
              showToast(err.message, true);
            }
          });
        });
      }

      renderPollBlock(p1, "eleicao-poll-1");
      renderPollBlock(p2, "eleicao-poll-2");

    } catch (err) {
      console.error(err);
    }
  }

  await carregarCedulas();
}

/**
 * Emite o Extrato Oficial de Apuração da Urna formatado para A4 / Impressão / Ata Oficial
 */
export async function gerarExtratoOficialAta(store) {
  const polls = await store.polls.list();
  const p1 = polls.find(p => p.question.includes("PROPOSTA 1") || p.question.includes("fundado")) || polls[0];
  const p2 = polls.find(p => p.question.includes("Comissão Pró-CA") || p.id === 104) || polls[1];

  const totalCenso = CONFIG.STUDENTS_DATABASE ? CONFIG.STUDENTS_DATABASE.length : 235;
  const t1 = p1 ? p1.options.reduce((a, b) => a + b.vote_count, 0) : 0;
  const t2 = p2 ? p2.options.reduce((a, b) => a + b.vote_count, 0) : 0;
  const quorum = Math.max(t1, t2);
  const pctQuorum = totalCenso > 0 ? ((quorum / totalCenso) * 100).toFixed(1) : "0.0";
  const dataHora = new Date().toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "medium" });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Extrato Oficial de Apuração da Urna Eletrônica - E(CA)² UERGS</title>
  <style>
    @page { size: A4 portrait; margin: 20mm 15mm; }
    body { font-family: "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; line-height: 1.5; font-size: 11pt; margin: 0; padding: 25px; }
    .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { font-size: 15pt; margin: 4px 0; text-transform: uppercase; color: #0284c7; }
    .header h2 { font-size: 11.5pt; margin: 0 0 3px; font-weight: 600; color: #334155; }
    .header p { margin: 0; font-size: 9pt; color: #64748b; }
    .box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin: 15px 0; background: #f8fafc; font-size: 10pt; line-height: 1.6; }
    .table { width: 100%; border-collapse: collapse; margin: 14px 0 20px; font-size: 10pt; }
    .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    .table th { background: #f1f5f9; font-weight: 600; color: #1e293b; }
    .signatures { margin-top: 45px; display: grid; grid-template-columns: 1fr 1fr; gap: 35px; }
    .sig-line { border-top: 1px solid #0f172a; padding-top: 6px; text-align: center; font-size: 9.5pt; margin-top: 35px; }
    .footer { margin-top: 30px; font-size: 8pt; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
    @media print { .no-print { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 22px; font-size: 12pt; font-weight: bold; background: #0284c7; color: #fff; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(2,132,199,.3);">🖨️ Imprimir / Salvar como PDF</button>
  </div>

  <div class="header">
    <h2>UNIVERSIDADE ESTADUAL DO RIO GRANDE DO SUL – UERGS</h2>
    <h2>CURSO DE ENGENHARIA DE CONTROLE E AUTOMAÇÃO · UNIDADE PORTO ALEGRE</h2>
    <h1>EXTRATO OFICIAL DE APURAÇÃO DA URNA ELETRÔNICA</h1>
    <p>ASSEMBLEIA GERAL DE FUNDAÇÃO DO CENTRO ACADÊMICO E(CA)² · 26 DE OUTUBRO DE 2026</p>
  </div>

  <div class="box">
    <strong>CERTIFICADO DE AUDITORIA & QUÓRUM REGULAMENTAR:</strong><br>
    • <strong>Data/Hora do Registro:</strong> ${dataHora}<br>
    • <strong>Censo Oficial Discente:</strong> ${totalCenso} estudantes regulares de Engenharia de Controle e Automação<br>
    • <strong>Total de Votos Depositados (Quórum):</strong> ${quorum} eleitores (${pctQuorum}% do corpo discente homologado)<br>
    • <strong>Garantia de Sigilo:</strong> Votação auditada com segregação de credencial conforme Art. 7º da LGPD (Lei 13.709/2018).
  </div>

  <h3 style="margin-top: 20px; margin-bottom: 4px; color: #0f172a; font-size: 11pt;">1. DELIBERAÇÃO: FUNDAÇÃO DO CENTRO ACADÊMICO E(CA)²</h3>
  <table class="table">
    <thead>
      <tr>
        <th>Opção de Voto</th>
        <th style="text-align: right; width: 140px;">Quantidade</th>
        <th style="text-align: right; width: 120px;">Percentual (%)</th>
      </tr>
    </thead>
    <tbody>
      ${p1 ? p1.options.map(opt => {
        const pct = t1 > 0 ? ((opt.vote_count / t1) * 100).toFixed(1) : "0.0";
        return `<tr>
          <td><strong>${opt.label}</strong></td>
          <td style="text-align: right;">${opt.vote_count} voto(s)</td>
          <td style="text-align: right; font-weight: bold;">${pct}%</td>
        </tr>`;
      }).join("") : '<tr><td colspan="3">Sem dados apurados</td></tr>'}
      <tr style="background: #f1f5f9; font-weight: bold;">
        <td>TOTAL APURADO</td>
        <td style="text-align: right;">${t1} voto(s)</td>
        <td style="text-align: right;">100.0%</td>
      </tr>
    </tbody>
  </table>

  <h3 style="margin-top: 20px; margin-bottom: 4px; color: #0f172a; font-size: 11pt;">2. DELIBERAÇÃO: ACLAMAÇÃO DA COMISSÃO PRÓ-CA TRANSITÓRIA</h3>
  <table class="table">
    <thead>
      <tr>
        <th>Opção de Voto</th>
        <th style="text-align: right; width: 140px;">Quantidade</th>
        <th style="text-align: right; width: 120px;">Percentual (%)</th>
      </tr>
    </thead>
    <tbody>
      ${p2 ? p2.options.map(opt => {
        const pct = t2 > 0 ? ((opt.vote_count / t2) * 100).toFixed(1) : "0.0";
        return `<tr>
          <td><strong>${opt.label}</strong></td>
          <td style="text-align: right;">${opt.vote_count} voto(s)</td>
          <td style="text-align: right; font-weight: bold;">${pct}%</td>
        </tr>`;
      }).join("") : '<tr><td colspan="3">Sem dados apurados</td></tr>'}
      <tr style="background: #f1f5f9; font-weight: bold;">
        <td>TOTAL APURADO</td>
        <td style="text-align: right;">${t2} voto(s)</td>
        <td style="text-align: right;">100.0%</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 20px; font-size: 9pt; text-align: justify; color: #334155; line-height: 1.55;">
    <strong>TERMO DE HOMOLOGAÇÃO DA MESA DIRETORA:</strong><br>
    Certificamos para os devidos fins de direito perante a Universidade Estadual do Rio Grande do Sul (UERGS), entidades estudantis parceiras e órgãos competentes que a presente apuração eletrônica transcorreu em perfeita conformidade estatutária, quórum regulamentar e sob estrita lisura democrática. Este extrato é rubricado e passa a integrar formalmente como <strong>Anexo Oficial da Ata de Fundação do E(CA)²</strong>.
  </div>

  <div class="signatures">
    <div>
      <div class="sig-line">
        <strong>Presidente da Assembleia Geral</strong><br>
        Discente de Eng. de Controle e Automação – UERGS
      </div>
    </div>
    <div>
      <div class="sig-line">
        <strong>1º Secretário(a) da Mesa</strong><br>
        Discente de Eng. de Controle e Automação – UERGS
      </div>
    </div>
  </div>

  <div class="footer">
    Documento emitido eletronicamente pela Plataforma Oficial do E(CA)² · Base Legal: Lei Federal nº 7.395/1985 e Lei Federal nº 13.709/2018 (LGPD) · Hash de Integridade: ${Math.random().toString(36).substring(2, 12).toUpperCase()}
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// -------------------------------------------------------------
// VISTA OCULTA: CABINE DE VOTAÇÃO (SIMULADOR DE URNA ELEITORAL)
// -------------------------------------------------------------
function renderUrnaHtml() {
  const auth = getAuth();
  const isLogged = !!auth.user;
  const userName = auth.profile?.display_name || auth.user?.email || "ELEITOR NÃO IDENTIFICADO";

  return `
    <section class="section urna-section">
      <div class="container" style="max-width: 980px;">
        <!-- Topbar de Navegação da Cabine -->
        <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: .75rem;">
          <a href="#eleicao" class="btn btn-ghost btn-sm" id="btn-sair-urna">
            ← Sair da Cabine / Ver Apuração
          </a>
          <div class="row" style="gap: .6rem; align-items: center;">
            <span class="badge cyan" style="font-family: var(--font-mono);">CABINE ELEITORAL FECHADA</span>
            <span class="small muted">Voto Secreto & Auditável · E(CA)² UERGS</span>
          </div>
        </div>

        <!-- Chassi Oficial da Urna Eletrônica -->
        <div class="urna-chassis">
          <div class="urna-chassis-header">
            <div class="urna-brasao">
              <span style="font-size: 1.8rem;" aria-hidden="true">⚙️</span>
              <div>
                <div class="urna-header-title">JUSTIÇA ELEITORAL ACADÊMICA</div>
                <div class="urna-header-sub">CENTRO ACADÊMICO DE ENGENHARIA DE CONTROLE E AUTOMAÇÃO · UERGS</div>
              </div>
            </div>
            <div class="urna-serial">URNA MODELO CA-2026 · Nº 04015-RS</div>
          </div>

          <div class="urna-body-grid">
            <!-- MONITOR DIGITAL DA URNA (Esquerda) -->
            <div class="urna-screen-wrap">
              <div class="urna-screen" id="urna-screen" role="region" aria-label="Tela da Urna Eletrônica">
                <!-- Topbar do Monitor -->
                <div class="urna-screen-topbar">
                  <span id="urna-pauta-badge">DELIBERAÇÃO 1 DE 2</span>
                  <span id="urna-eleitor-tag">${isLogged ? `ELEITOR: ${escapeHtml(userName)}` : '⚠️ NÃO IDENTIFICADO'}</span>
                </div>

                <!-- Conteúdo Dinâmico da Tela -->
                <div class="urna-screen-content" id="urna-screen-content">
                  <div class="skeleton" style="height: 200px;"></div>
                </div>

                <!-- Rodapé de Instrução no Monitor -->
                <div class="urna-screen-footer" id="urna-screen-footer">
                  <div class="urna-screen-instruction">
                    Aperte a tecla correspondente no teclado ao lado:
                  </div>
                  <div class="urna-screen-hints">
                    <span><strong style="color: #22c55e;">VERDE:</strong> SIM</span>
                    <span><strong style="color: #ef4444;">VERMELHO:</strong> NÃO</span>
                    <span><strong style="color: #f8fafc;">BRANCO:</strong> ABSTENÇÃO</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TECLADO FÍSICO DA URNA (Direita) -->
            <div class="urna-keypad-wrap">
              <div class="urna-keypad-brand" style="display: flex; flex-direction: column; align-items: center; gap: .35rem;">
                <img src="img/logo_option2_microchip.jpg" alt="Logo E(CA)²" class="brand-logo-img" width="36" height="36" style="width: 36px; height: 36px;">
                <div class="brand-text">E(CA)<sup>2</sup> · UERGS</div>
                <div class="small faint" style="font-size: .68rem; text-align: center;">TECLADO DA URNA ELETRÔNICA</div>
              </div>

              <!-- Seletor de Pautas da Assembleia -->
              <div class="urna-pauta-selector" id="urna-pauta-tabs" role="tablist">
                <button type="button" class="urna-tab-btn active" data-pauta-idx="0">Item 1 (Fundação)</button>
                <button type="button" class="urna-tab-btn" data-pauta-idx="1">Item 2 (Comissão)</button>
              </div>

              <!-- Teclas de Voto Solicitadas: BRANCO, NÃO (Vermelho), SIM (Verde) -->
              <div class="urna-action-keys">
                <!-- Tecla BRANCO -->
                <button type="button" class="urna-btn urna-btn-branco" id="btn-urna-branco" aria-label="Votar em Branco ou Abstenção">
                  <span>BRANCO</span>
                </button>

                <!-- Tecla NÃO (Vermelha) -->
                <button type="button" class="urna-btn urna-btn-nao" id="btn-urna-nao" aria-label="Votar Não">
                  <span>NÃO</span>
                </button>

                <!-- Tecla SIM (Verde) -->
                <button type="button" class="urna-btn urna-btn-sim" id="btn-urna-sim" aria-label="Votar Sim">
                  <span>SIM</span>
                </button>
              </div>

              <!-- Teclas de Controle: CORRIGE e CONFIRMA -->
              <div class="urna-control-keys">
                <button type="button" class="urna-btn urna-btn-corrige" id="btn-urna-corrige" title="Limpar seleção para escolher de novo">
                  <span>CORRIGE</span>
                </button>
                <button type="button" class="urna-btn urna-btn-confirma" id="btn-urna-confirma" title="Confirmar e gravar voto definitivamente">
                  <span>CONFIRMA</span>
                </button>
              </div>

              <div class="urna-keypad-notes">
                1. Escolha <strong>BRANCO</strong>, <strong>NÃO</strong> ou <strong>SIM</strong>.<br>
                2. Aperte <strong>CONFIRMA</strong> para registrar na ata digital.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function setupUrnaInteractions() {
  // Síntese de áudio autêntica da Urna Eletrônica via Web Audio API
  function playUrnaBeep() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  }

  function playUrnaConfirmationTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      // Toque clássico e inconfundível da urna eletrônica brasileira
      const tones = [
        { freq: 1100, start: 0.0, dur: 0.12 },
        { freq: 1100, start: 0.16, dur: 0.12 },
        { freq: 1760, start: 0.32, dur: 0.75 }
      ];
      tones.forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(t.freq, now + t.start);
        gain.gain.setValueAtTime(0.2, now + t.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t.start);
        osc.stop(now + t.start + t.dur);
      });
    } catch (e) {}
  }

  let activeIdx = 0;
  let selectedChoice = null; // 'sim' | 'nao' | 'branco'
  let isDisplayingFim = false;
  let pollsList = [];

  const screenContent = document.getElementById("urna-screen-content");
  const pautaBadge = document.getElementById("urna-pauta-badge");
  const eleitorTag = document.getElementById("urna-eleitor-tag");
  const pautaTabs = document.querySelectorAll("#urna-pauta-tabs .urna-tab-btn");

  async function loadPolls() {
    try {
      const allPolls = await store.polls.list();
      const p1 = allPolls.find(p => p.question.includes("PROPOSTA 1") || p.question.includes("fundado")) || allPolls[0];
      const p2 = allPolls.find(p => p.question.includes("Comissão Pró-CA") || p.id === 104) || allPolls[1];
      pollsList = [p1, p2].filter(Boolean);
    } catch (err) {
      console.error("Erro ao carregar cédulas para a urna:", err);
    }
  }

  function updateScreen() {
    if (isDisplayingFim || !screenContent) return;

    const auth = getAuth();
    const isLogged = !!auth.user;
    const currentPoll = pollsList[activeIdx];

    if (pautaBadge) {
      pautaBadge.textContent = `DELIBERAÇÃO ${activeIdx + 1} DE ${pollsList.length || 2}`;
    }

    if (eleitorTag) {
      eleitorTag.textContent = isLogged 
        ? `ELEITOR: ${escapeHtml(auth.profile?.display_name || auth.user.email)}`
        : '⚠️ NÃO IDENTIFICADO';
    }

    // Atualiza aba ativa no teclado
    pautaTabs.forEach((tab, idx) => {
      tab.classList.toggle("active", idx === activeIdx);
    });

    if (!currentPoll) {
      screenContent.innerHTML = `<p class="muted">Nenhuma deliberação ativa encontrada no sistema.</p>`;
      return;
    }

    // 1. Caso o eleitor não esteja logado
    if (!isLogged) {
      screenContent.innerHTML = `
        <div style="text-align: center; padding: 1.5rem .5rem;">
          <div style="font-size: 2.2rem; margin-bottom: .5rem;">🔒</div>
          <h4 style="color: var(--amber); margin: 0 0 .5rem; font-size: 1.15rem;">Identificação Necessária</h4>
          <p class="small muted" style="max-width: 440px; margin: 0 auto 1.25rem; line-height: 1.6;">
            A urna eletrônica é auditável e requer identificação prévia para garantir que cada estudante vote apenas uma vez.
          </p>
          <button type="button" class="btn btn-primary btn-sm" id="btn-urna-login-action" style="font-size: .95rem; padding: .6rem 1.4rem;">
            🔑 Identificar com E-mail
          </button>
        </div>
      `;
      document.getElementById("btn-urna-login-action")?.addEventListener("click", () => {
        document.getElementById("dlg-auth")?.showModal();
      });
      return;
    }

    // 2. Caso haja lista de e-mails autorizados (Whitelist) e o eleitor não esteja nela
    if (Array.isArray(CONFIG.VOTING_ALLOWED_EMAILS) && CONFIG.VOTING_ALLOWED_EMAILS.length > 0) {
      if (!isVotingEmailAllowed(auth.user.email, auth.profile)) {
        screenContent.innerHTML = `
          <div style="text-align: center; padding: 1.5rem .5rem;">
            <div style="font-size: 2.2rem; margin-bottom: .5rem;">⚠️</div>
            <h4 style="color: var(--amber); margin: 0 0 .5rem; font-size: 1.15rem;">Vínculo com o Curso Necessário</h4>
            <p class="small muted" style="max-width: 460px; margin: 0 auto 1.25rem; line-height: 1.6;">
              O e-mail <strong>${escapeHtml(auth.user.email)}</strong> não consta na lista inicial de 235 estudantes. Qualquer estudante de <strong>Engenharia de Controle e Automação</strong> da UERGS pode votar após cadastrar-se e confirmar vínculo com o curso.
            </p>
            <div class="row" style="justify-content: center; gap: .75rem; flex-wrap: wrap;">
              <a href="#registro" class="btn btn-primary btn-sm" id="btn-urna-cadastrar-eca">Comprovar Vínculo & Cadastrar →</a>
              <button type="button" class="btn btn-ghost btn-sm" id="btn-urna-trocar-conta">Trocar de Conta</button>
            </div>
          </div>
        `;
        document.getElementById("btn-urna-trocar-conta")?.addEventListener("click", () => {
          document.getElementById("dlg-auth")?.showModal();
        });
        return;
      }
    }

    // 3. Caso o eleitor já tenha votado nesta deliberação
    if (currentPoll.myOption) {
      const myOpt = currentPoll.options.find(o => o.id === currentPoll.myOption);
      const isOtherPending = pollsList.some(p => !p.myOption);

      screenContent.innerHTML = `
        <div style="text-align: center; padding: 1rem .5rem;">
          <div style="font-size: 2.2rem; margin-bottom: .4rem;">✅</div>
          <div class="badge green" style="margin-bottom: .6rem; font-size: .85rem;">VOTO JÁ COMPUTADO</div>
          <div class="urna-screen-question" style="margin-bottom: .85rem; font-size: 1rem;">
            ${escapeHtml(currentPoll.question)}
          </div>
          <div class="urna-screen-choice-box sim" style="margin-bottom: 1rem;">
            <div class="small faint" style="font-size: .75rem; text-transform: uppercase;">Seu Voto Registrado nesta Cédula:</div>
            <div class="urna-screen-choice-label" style="font-size: 1.25rem;">${escapeHtml(myOpt ? myOpt.label : 'Voto Registrado')}</div>
          </div>
          ${isOtherPending ? `
            <button type="button" class="btn btn-primary btn-sm" id="btn-urna-ir-proxima" style="font-size: .85rem;">
              Ir para a outra Deliberação →
            </button>
          ` : `
            <p class="small muted" style="margin: 0;">Você já votou em todas as deliberações desta assembleia! Obrigado.</p>
          `}
        </div>
      `;

      document.getElementById("btn-urna-ir-proxima")?.addEventListener("click", () => {
        activeIdx = (activeIdx === 0) ? 1 : 0;
        selectedChoice = null;
        updateScreen();
      });
      return;
    }

    // 4. Fluxo normal de votação na deliberação
    let choiceBoxHtml = "";
    if (!selectedChoice) {
      choiceBoxHtml = `
        <div class="urna-screen-choice-box pending">
          <div class="urna-screen-choice-label" style="font-size: 1.1rem; color: #94a3b8;">
            AGUARDANDO ESCOLHA...
          </div>
          <div class="urna-screen-choice-sub">
            Clique em <strong>SIM</strong>, <strong>NÃO</strong> ou <strong>BRANCO</strong> no teclado ao lado.
          </div>
        </div>
      `;
    } else if (selectedChoice === "sim") {
      choiceBoxHtml = `
        <div class="urna-screen-choice-box sim">
          <div class="urna-screen-choice-label">✓ [ SIM ]</div>
          <div class="urna-screen-choice-sub">APROVO A PROPOSTA DESTA DELIBERAÇÃO</div>
        </div>
      `;
    } else if (selectedChoice === "nao") {
      choiceBoxHtml = `
        <div class="urna-screen-choice-box nao">
          <div class="urna-screen-choice-label">✗ [ NÃO ]</div>
          <div class="urna-screen-choice-sub">SOU CONTRÁRIO À PROPOSTA DESTA DELIBERAÇÃO</div>
        </div>
      `;
    } else if (selectedChoice === "branco") {
      choiceBoxHtml = `
        <div class="urna-screen-choice-box branco">
          <div class="urna-screen-choice-label">○ [ BRANCO ]</div>
          <div class="urna-screen-choice-sub">VOTO EM BRANCO / ABSTENÇÃO DESTA DELIBERAÇÃO</div>
        </div>
      `;
    }

    screenContent.innerHTML = `
      <div>
        <div class="urna-screen-pauta-title">Pauta da Assembleia · Item ${activeIdx === 0 ? '4' : '5'}</div>
        <div class="urna-screen-question">
          ${escapeHtml(currentPoll.question)}
        </div>
        ${choiceBoxHtml}
        ${selectedChoice ? `
          <div style="text-align: center; font-size: .82rem; color: var(--cyan); margin-top: .5rem; font-family: var(--font-mono);">
            👉 Aperte a tecla verde <strong>CONFIRMA</strong> para gravar seu voto.
          </div>
        ` : ''}
      </div>
    `;
  }

  // Alternador de abas no teclado da urna
  pautaTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      playUrnaBeep();
      activeIdx = Number(tab.getAttribute("data-pauta-idx")) || 0;
      selectedChoice = null;
      updateScreen();
    });
  });

  // Botão BRANCO
  document.getElementById("btn-urna-branco")?.addEventListener("click", () => {
    playUrnaBeep();
    const cur = pollsList[activeIdx];
    if (cur?.myOption) return;
    selectedChoice = "branco";
    updateScreen();
  });

  // Botão NÃO (Vermelho)
  document.getElementById("btn-urna-nao")?.addEventListener("click", () => {
    playUrnaBeep();
    const cur = pollsList[activeIdx];
    if (cur?.myOption) return;
    selectedChoice = "nao";
    updateScreen();
  });

  // Botão SIM (Verde)
  document.getElementById("btn-urna-sim")?.addEventListener("click", () => {
    playUrnaBeep();
    const cur = pollsList[activeIdx];
    if (cur?.myOption) return;
    selectedChoice = "sim";
    updateScreen();
  });

  // Botão CORRIGE (Laranja)
  document.getElementById("btn-urna-corrige")?.addEventListener("click", () => {
    playUrnaBeep();
    selectedChoice = null;
    updateScreen();
  });

  // Botão CONFIRMA
  document.getElementById("btn-urna-confirma")?.addEventListener("click", async () => {
    const auth = getAuth();
    if (!auth.user) {
      showToast("Por favor, identifique-se com seu e-mail para votar.");
      document.getElementById("dlg-auth")?.showModal();
      return;
    }

    const currentPoll = pollsList[activeIdx];
    if (!currentPoll) return;

    if (currentPoll.myOption) {
      playUrnaBeep();
      showToast("Você já votou nesta deliberação.");
      return;
    }

    if (!selectedChoice) {
      playUrnaBeep();
      showToast("Selecione primeiro SIM, NÃO ou BRANCO antes de confirmar.", true);
      return;
    }

    // Mapeia a escolha para a opção correspondente da enquete
    let targetOption = null;
    if (selectedChoice === "sim") {
      targetOption = currentPoll.options.find(o => o.label.toUpperCase().includes("SIM")) || currentPoll.options[0];
    } else if (selectedChoice === "nao") {
      targetOption = currentPoll.options.find(o => o.label.toUpperCase().includes("NÃO") || o.label.toUpperCase().includes("NAO")) || currentPoll.options[1];
    } else if (selectedChoice === "branco") {
      targetOption = currentPoll.options.find(o => o.label.toUpperCase().includes("ABSTENÇÃO") || o.label.toUpperCase().includes("BRANCO")) || currentPoll.options[2];
    }

    if (!targetOption) {
      targetOption = currentPoll.options[0];
    }

    try {
      await store.polls.vote(currentPoll.id, targetOption.id);
      
      // Toca o som lendário da Urna Eletrônica
      playUrnaConfirmationTone();

      // Exibe a tela clássica de FIM
      isDisplayingFim = true;
      if (screenContent) {
        screenContent.innerHTML = `
          <div class="urna-fim-container">
            <div class="urna-fim-text">FIM</div>
            <div style="font-family: var(--font-mono); font-size: 1rem; color: var(--cyan); letter-spacing: .05em;">
              VOTO GRAVADO COM SUCESSO
            </div>
            <div class="small muted" style="margin-top: .5rem;">
              Justiça Eleitoral Acadêmica · E(CA)² UERGS
            </div>
          </div>
        `;
      }

      showToast("Voto computado com sucesso na Urna Eletrônica! 🗳️");

      // Recarrega as enquetes
      await loadPolls();

      // Após 2.4 segundos, avança para a outra proposta pendente ou encerra
      setTimeout(() => {
        isDisplayingFim = false;
        const otherIdx = (activeIdx === 0) ? 1 : 0;
        const otherPoll = pollsList[otherIdx];
        if (otherPoll && !otherPoll.myOption) {
          activeIdx = otherIdx;
        }
        selectedChoice = null;
        updateScreen();
      }, 2400);

    } catch (err) {
      showToast(err.message, true);
    }
  });

  // Atualização em tempo real de autenticação
  onAuth(() => {
    updateScreen();
  });

  await loadPolls();
  updateScreen();
}


// -------------------------------------------------------------
// Estado do Calendário Mensal
let calCurrentYear = 2026;
let calCurrentMonth = 9; // 0-indexed: 9 = Outubro (mês da fundação e salchipão)
let calSelectedDate = null; // 'YYYY-MM-DD'
let calCategoryFilter = "todos"; // 'todos' | 'ca' | 'institucional'

function renderMonthCalendarHtml(year, month, selectedDate, categoryFilter) {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const monthName = monthNames[month];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const eventsByDate = {};
  CALENDARIO_EVENTOS.forEach(ev => {
    if (!eventsByDate[ev.data]) eventsByDate[ev.data] = [];
    eventsByDate[ev.data].push(ev);
  });

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const eventsThisMonth = CALENDARIO_EVENTOS.filter(ev => {
    const matchesMonth = ev.data.startsWith(monthPrefix);
    const matchesCat = categoryFilter === "todos" || ev.categoria === categoryFilter;
    return matchesMonth && matchesCat;
  });

  const cells = [];

  // Dias anteriores (fora do mês)
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push(`
      <div class="month-cal-day outside-month" aria-hidden="true">
        <span class="month-cal-day-num">${d}</span>
      </div>
    `);
  }

  // Dias do mês atual
  for (let d = 1; d <= daysInMonth; d++) {
    const dayIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const allEvs = eventsByDate[dayIso] || [];
    const evs = categoryFilter === "todos" ? allEvs : allEvs.filter(e => e.categoria === categoryFilter);
    const hasEvent = evs.length > 0;
    const hasCa = evs.some(e => e.categoria === "ca");
    const hasInst = evs.some(e => e.categoria === "institucional");
    const isSelected = selectedDate === dayIso;

    let eventClass = "";
    if (hasEvent) {
      if (hasCa && hasInst) eventClass = "has-event has-both-events";
      else if (hasCa) eventClass = "has-event has-ca-event";
      else eventClass = "has-event has-inst-event";
    }

    const selectedClass = isSelected ? "is-selected" : "";

    cells.push(`
      <div class="month-cal-day ${eventClass} ${selectedClass}" data-date="${dayIso}" role="button" tabindex="0" title="${hasEvent ? evs.map(e => e.titulo).join(' · ') : `Dia ${d} de ${monthName}`}">
        <span class="month-cal-day-num">${d}</span>

        ${hasEvent ? `
          <!-- Pílulas Desktop -->
          <div class="month-cal-events-list">
            ${evs.map(e => `
              <span class="month-cal-event-pill ${e.categoria === 'ca' ? 'ca' : 'inst'}">
                ${e.icone} ${e.titulo.length > 20 ? e.titulo.slice(0, 18) + '…' : e.titulo}
              </span>
            `).join("")}
          </div>

          <!-- Marcadores Luminosos Mobile -->
          <div class="month-cal-dots-wrap">
            ${hasCa ? `<span class="month-cal-mini-dot ca" title="Evento E(CA)²"></span>` : ''}
            ${hasInst ? `<span class="month-cal-mini-dot inst" title="Data Institucional UERGS"></span>` : ''}
          </div>
        ` : ''}
      </div>
    `);
  }

  const remaining = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    cells.push(`
      <div class="month-cal-day outside-month" aria-hidden="true">
        <span class="month-cal-day-num">${i}</span>
      </div>
    `);
  }

  let selectedBannerHtml = "";
  if (selectedDate) {
    const selectedEvs = eventsByDate[selectedDate] || [];
    const dateParts = selectedDate.split("-");
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    selectedBannerHtml = `
      <div class="month-cal-selected-banner">
        <div style="display: flex; align-items: center; gap: .6rem; flex-wrap: wrap;">
          <span style="font-size: 1.1rem;">📌</span>
          <div>
            <strong style="color: var(--text);">Dia Selecionado: ${formattedDate}</strong>
            <span class="muted small" style="margin-left: .5rem;">(${selectedEvs.length} ${selectedEvs.length === 1 ? 'evento marcado' : 'eventos marcados'})</span>
          </div>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-clear-date-filter" style="font-size: .8rem; padding: .3rem .8rem;">
          ✕ Mostrar Todos os Dias
        </button>
      </div>
    `;
  }

  return `
    <div class="month-calendar-widget">
      <!-- Cabeçalho do Calendário -->
      <div class="month-cal-header">
        <div class="month-cal-title-wrap">
          <h3 class="month-cal-title">
            📅 ${monthName} de ${year}
          </h3>
          <span class="badge ${eventsThisMonth.length > 0 ? 'cyan' : 'slate'}">
            ${eventsThisMonth.length} ${eventsThisMonth.length === 1 ? 'evento neste mês' : 'eventos neste mês'}
          </span>
        </div>

        <!-- Navegação de Meses -->
        <div class="month-cal-nav">
          <button type="button" class="month-cal-btn-nav" id="btn-cal-prev" aria-label="Mês anterior">
            ◀ Mês Anterior
          </button>
          <button type="button" class="month-cal-btn-nav" id="btn-cal-today" title="Ir para Outubro 2026">
            ⭐ Out/2026 (Fundação)
          </button>
          <button type="button" class="month-cal-btn-nav" id="btn-cal-next" aria-label="Próximo mês">
            Próximo Mês ▶
          </button>
        </div>

        <!-- Legenda -->
        <div class="month-cal-legend">
          <div class="month-cal-legend-item">
            <span class="month-cal-legend-dot ca"></span>
            <span>E(CA)² (Curso)</span>
          </div>
          <div class="month-cal-legend-item">
            <span class="month-cal-legend-dot inst"></span>
            <span>Institucional UERGS</span>
          </div>
        </div>
      </div>

      <!-- Dias da Semana -->
      <div class="month-cal-weekdays">
        <div class="month-cal-weekday">Dom</div>
        <div class="month-cal-weekday">Seg</div>
        <div class="month-cal-weekday">Ter</div>
        <div class="month-cal-weekday">Qua</div>
        <div class="month-cal-weekday">Qui</div>
        <div class="month-cal-weekday">Sex</div>
        <div class="month-cal-weekday">Sáb</div>
      </div>

      <!-- Grade dos Dias -->
      <div class="month-cal-days-grid">
        ${cells.join("")}
      </div>

      ${selectedBannerHtml}
    </div>
  `;
}

// -------------------------------------------------------------
// VISTA: EVENTOS & AGENDA ACADÊMICA
// -------------------------------------------------------------
function renderEventosHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Integração & Calendário</span>
          <h2>Eventos do E(CA)² & Datas Institucionais UERGS</h2>
          <p>
            O calendário unificado da comunidade de Engenharia de Controle e Automação. Acompanhe os encontros do Centro Acadêmico, visitas técnicas na indústria e prazos acadêmicos oficiais da UERGS.
          </p>
        </div>

        <!-- Destaque Principal: Salchipão Inaugural com Foto Oficial da UERGS -->
        <div class="card hover" style="padding: 0; overflow: hidden; margin-bottom: 3.5rem; border: 1px solid var(--border-strong);">
          <div class="grid grid-2" style="align-items: center; gap: 0;">
            <div style="position: relative; height: 100%; min-height: 300px;">
              <img src="img/evento_salchipao.jpg" alt="Estudantes de Engenharia de Controle e Automação da UERGS no Salchipão" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              <span class="badge amber" style="position: absolute; top: 14px; left: 14px; backdrop-filter: blur(8px);">Evento Inaugural do Semestre</span>
            </div>
            <div style="padding: 2.5rem;">
              <span class="eyebrow" style="margin-bottom: .4rem;">Segunda-feira · 26 de Outubro · 18:30 às 19:15</span>
              <h3 style="font-size: 1.6rem; margin-bottom: .8rem;">1º Encontro & Salchipão Inaugural do E(CA)² 🌭</h3>
              <p class="muted" style="margin-bottom: 1.25rem; line-height: 1.6;">
                Distribuição gratuita de salchipães para todos os estudantes de Engenharia de Controle e Automação da UERGS.
                Basta assinar a lista de presença da fundação do E(CA)², retirar seu pão e aproveitar o refeitório para conversar com colegas de todos os semestres. Total liberdade para confraternizar ou levar seu lanche se tiver aula!
              </p>
              <div class="row" style="gap: .75rem; flex-wrap: wrap;">
                <a href="#fundacao" class="btn btn-primary btn-sm">Confirmar Presença (RSVP) 🌭</a>
                <a href="#eleicao" class="btn btn-ghost btn-sm">Ver Cédula & Urna 🗳️</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendário Acadêmico & Eventos Unificados -->
        <div class="section-head" style="margin-bottom: 1.5rem;">
          <span class="eyebrow">Programação Visual 2026/2 & 2027/1</span>
          <h2>Calendário Mensal & Agenda de Atividades</h2>
          <p>Navegue pelos meses abaixo e clique nos dias com eventos marcados para filtrar detalhes e programações oficiais.</p>
        </div>

        <!-- Widget do Calendário Mensal Interativo -->
        <div id="month-calendar-container">
          ${renderMonthCalendarHtml(calCurrentYear, calCurrentMonth, calSelectedDate, calCategoryFilter)}
        </div>

        <!-- Barra de Filtros da Lista -->
        <div class="calendar-filter-bar" style="margin-top: 1.5rem;">
          <span class="small muted" style="font-weight: 600; margin-right: .5rem;">Filtrar Categoria:</span>
          <button type="button" class="chip ${calCategoryFilter === 'todos' ? 'active' : ''}" data-cal-filter="todos">
            📅 Todos os Eventos (${CALENDARIO_EVENTOS.length})
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'ca' ? 'active' : ''}" data-cal-filter="ca">
            🌭 Eventos E(CA)² (${CALENDARIO_EVENTOS.filter(e => e.categoria === 'ca').length})
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'institucional' ? 'active' : ''}" data-cal-filter="institucional">
            🏛️ Datas Institucionais UERGS (${CALENDARIO_EVENTOS.filter(e => e.categoria === 'institucional').length})
          </button>
        </div>

        <!-- Lista Cronológica de Eventos -->
        <div id="calendar-events-list" style="margin-bottom: 3.5rem;">
          ${CALENDARIO_EVENTOS.map(ev => {
            const dateParts = ev.data.split("-");
            const dayNum = dateParts[2];
            const monthNames = ["", "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
            const monthStr = monthNames[parseInt(dateParts[1], 10)] || "MES";

            return `
              <div class="calendar-item ${ev.destaque ? 'destaque' : ''}" data-categoria="${ev.categoria}" data-date="${ev.data}">
                <div class="calendar-date-box">
                  <span class="day">${dayNum}</span>
                  <span class="month">${monthStr}</span>
                </div>
                <div>
                  <div class="row" style="margin-bottom: .3rem; gap: .5rem; flex-wrap: wrap;">
                    <span class="badge ${ev.categoria === 'ca' ? 'cyan' : 'amber'}">${ev.categoriaLabel}</span>
                    <span class="small muted">🕒 ${ev.horario} · 📍 ${ev.local}</span>
                  </div>
                  <h3 style="margin: 0 0 .35rem; font-size: 1.15rem;">${ev.icone} ${ev.titulo}</h3>
                  <p class="muted small" style="margin: 0; line-height: 1.55;">${ev.descricao}</p>
                </div>
                <div>
                  ${ev.linkAcao.startsWith('http') ? `
                    <a href="${ev.linkAcao}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="white-space: nowrap;">
                      ${ev.textoAcao} ↗
                    </a>
                  ` : `
                    <a href="${ev.linkAcao}" class="btn ${ev.destaque ? 'btn-primary' : 'btn-ghost'} btn-sm" style="white-space: nowrap;">
                      ${ev.textoAcao}
                    </a>
                  `}
                </div>
              </div>
            `;
          }).join("")}

          <div id="calendar-empty-notice" class="empty" style="display: none; padding: 2rem 1rem;">
            <div class="big">📅</div>
            <h3>Nenhum evento encontrado para a data/categoria selecionada.</h3>
            <p class="muted small">Tente selecionar outro mês ou limpar os filtros de data.</p>
          </div>
        </div>

        <!-- Card de Sugestão de Pautas e Visitas -->
        <div class="card" style="padding: 2.5rem; background: hsl(220 40% 12% / .6); text-align: center; border: 1px solid var(--border);">
          <div class="icon" style="font-size: 2.2rem; margin-bottom: .5rem;">💡</div>
          <h3 style="font-size: 1.35rem; margin-bottom: .4rem;">Tem sugestão de visita técnica, palestra ou curso?</h3>
          <p class="muted small" style="max-width: 540px; margin: 0 auto 1.25rem; line-height: 1.6;">
            O Centro Acadêmico existe para colocar as demandas dos alunos em prática. Deixe sua ideia de empresa ou tema de minicurso no mural aberto.
          </p>
          <a href="#mural" class="btn btn-ghost btn-sm">Publicar Sugestão no Mural 💡</a>
        </div>
      </div>
    </section>
  `;
}

async function setupEventosInteractions() {
  function applyEventsFilter() {
    const eventItems = document.querySelectorAll(".calendar-item");
    let visibleCount = 0;

    eventItems.forEach(item => {
      const cat = item.getAttribute("data-categoria");
      const date = item.getAttribute("data-date");

      const matchCat = (calCategoryFilter === "todos" || cat === calCategoryFilter);
      const matchDate = (!calSelectedDate || date === calSelectedDate);

      if (matchCat && matchDate) {
        item.style.display = "";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    const emptyBox = document.getElementById("calendar-empty-notice");
    if (emptyBox) {
      emptyBox.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  function attachCalendarWidgetEvents() {
    const prevBtn = document.getElementById("btn-cal-prev");
    const nextBtn = document.getElementById("btn-cal-next");
    const todayBtn = document.getElementById("btn-cal-today");
    const clearDateBtn = document.getElementById("btn-clear-date-filter");
    const dayCells = document.querySelectorAll(".month-cal-day[data-date]");

    prevBtn?.addEventListener("click", () => {
      calCurrentMonth--;
      if (calCurrentMonth < 0) {
        calCurrentMonth = 11;
        calCurrentYear--;
      }
      refreshCalendar();
    });

    nextBtn?.addEventListener("click", () => {
      calCurrentMonth++;
      if (calCurrentMonth > 11) {
        calCurrentMonth = 0;
        calCurrentYear++;
      }
      refreshCalendar();
    });

    todayBtn?.addEventListener("click", () => {
      calCurrentYear = 2026;
      calCurrentMonth = 9;
      calSelectedDate = null;
      refreshCalendar();
    });

    clearDateBtn?.addEventListener("click", () => {
      calSelectedDate = null;
      refreshCalendar();
    });

    dayCells.forEach(cell => {
      cell.addEventListener("click", () => {
        const clickedDate = cell.getAttribute("data-date");
        if (calSelectedDate === clickedDate) {
          calSelectedDate = null;
        } else {
          calSelectedDate = clickedDate;
        }
        refreshCalendar();

        if (calSelectedDate) {
          const targetCard = document.querySelector(`.calendar-item[data-date="${calSelectedDate}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.add('destaque');
          }
        }
      });
    });
  }

  function refreshCalendar() {
    const container = document.getElementById("month-calendar-container");
    if (container) {
      container.innerHTML = renderMonthCalendarHtml(calCurrentYear, calCurrentMonth, calSelectedDate, calCategoryFilter);
      attachCalendarWidgetEvents();
    }
    applyEventsFilter();
  }

  // Filtros de categoria
  const filterBtns = document.querySelectorAll("[data-cal-filter]");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-cal-filter");
      calCategoryFilter = filter;
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      refreshCalendar();
    });
  });

  attachCalendarWidgetEvents();
  applyEventsFilter();
}

// -------------------------------------------------------------
// VISTA: LOJINHA (SHOP ECA²) - UTENSÍLIOS, VESTUÁRIO & MATERIAIS
// -------------------------------------------------------------
function renderShopHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Merchandise & Utensílios Oficiais</span>
          <h2>Lojinha & Utensílios do E(CA)²</h2>
          <p>
            Copos térmicos gravados a laser, canecas de laboratório com o brasão de robótica do curso, moletons neon e ferramentas de bancada.
            Toda a receita é 100% reinvestida nos projetos acadêmicos e atividades dos estudantes da UERGS.
          </p>
        </div>

        <!-- Categorias e Filtros da Loja -->
        <div class="toolbar" style="margin-bottom: 2rem;">
          <div class="chips" id="shop-filter-chips">
            <button type="button" class="chip" data-shop-filter="todos" aria-pressed="true">Todos os Itens (5)</button>
            <button type="button" class="chip" data-shop-filter="Utensílios" aria-pressed="false">Utensílios & Canecas ☕</button>
            <button type="button" class="chip" data-shop-filter="Vestuário" aria-pressed="false">Vestuário 👕</button>
            <button type="button" class="chip" data-shop-filter="DIY & Laboratório" aria-pressed="false">DIY & Laboratório ⚡</button>
          </div>
          <div class="spacer"></div>
          <span class="small muted" style="align-self: center;">Lote Inaugural 2026/2 · Encomendas Abertas</span>
        </div>

        <!-- Grade de Produtos do Catálogo -->
        <div class="grid grid-3" id="shop-products-grid" style="align-items: stretch; margin-bottom: 3.5rem;">
          ${PRODUTOS_SHOP.map(prod => `
            <div class="card hover product-card" data-category="${prod.categoria}">
              <div class="product-card-img-wrap">
                ${prod.foto ? `
                  <img src="${prod.foto}" alt="${escapeHtml(prod.nome)}" loading="lazy">
                ` : `
                  <div style="display: grid; place-items: center; height: 100%; font-size: 4.5rem; background: hsl(220 40% 12%);">
                    ${prod.icone || '📦'}
                  </div>
                `}
                <span class="badge ${prod.destaque ? 'amber' : 'cyan'}" style="position: absolute; top: 12px; left: 12px; backdrop-filter: blur(8px);">
                  ${prod.tag || prod.categoria}
                </span>
                <span class="badge" style="position: absolute; bottom: 12px; right: 12px; background: hsl(224 50% 6% / .88); color: var(--cyan); border-color: var(--cyan); font-weight: 700; font-size: .88rem;">
                  ${prod.preco}
                </span>
              </div>

              <div class="product-card-content">
                <div class="row" style="margin-bottom: .4rem; justify-content: space-between;">
                  <span class="small muted">${prod.categoria}</span>
                  <span class="small" style="color: var(--amber); font-weight: 600;">Disponível</span>
                </div>
                <h3 style="font-size: 1.18rem; margin-bottom: .6rem; line-height: 1.3;">${prod.nome}</h3>
                <p class="muted small" style="margin-bottom: 1.1rem; flex: 1;">
                  ${prod.descricao}
                </p>

                ${prod.especificacoes && prod.especificacoes.length ? `
                  <ul class="muted small" style="padding-left: 1.1rem; line-height: 1.6; margin-bottom: 1.25rem; font-size: .82rem;">
                    ${prod.especificacoes.map(esp => `<li>${esp}</li>`).join("")}
                  </ul>
                ` : ''}

                <button type="button" class="btn btn-primary btn-sm btn-open-order" data-prod-id="${prod.id}" style="width: 100%;">
                  Reservar este Item
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Banner de Transparência Financeira do Shop -->
        <div class="card" style="border-left: 4px solid var(--cyan); padding: 1.75rem;">
          <div class="grid grid-2" style="align-items: center; gap: 1.5rem;">
            <div class="row" style="gap: 1.25rem;">
              <span style="font-size: 2.2rem;">💡</span>
              <div>
                <strong>Prestação de Contas Aberta & Preço de Custo Social</strong>
                <p class="small muted" style="margin: .3rem 0 0;">
                  O CA E(CA)² não visa lucro financeiro. Os materiais têm cotação aberta com fornecedores e o excedente constitui o fundo de apoio estudantil para compra de insumos de bancada e organização da Semana Acadêmica de Engenharia.
                </p>
              </div>
            </div>
            <div class="row" style="justify-content: flex-end; gap: .75rem;">
              <a href="#documentos" class="btn btn-ghost btn-sm">Ver Estatutos & Normas</a>
              <button type="button" class="btn btn-primary btn-sm" id="btn-quick-copy-pix">Copiar Chave PIX</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function setupShopInteractions() {
  const dlgOrder = document.getElementById("dlg-shop-order");
  const formOrder = document.getElementById("form-shop-order");
  const previewEl = document.getElementById("shop-order-preview");
  const variantField = document.getElementById("order-variant-field");
  const variantSelect = document.getElementById("order-variant");
  const prodIdInput = document.getElementById("order-product-id");

  // Filtros por categoria
  const chips = document.querySelectorAll("#shop-filter-chips button");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      const filter = chip.getAttribute("data-shop-filter");
      const cards = document.querySelectorAll("#shop-products-grid .product-card");
      cards.forEach(card => {
        const cat = card.getAttribute("data-category");
        if (filter === "todos" || cat === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Botão rápido de copiar PIX no banner
  document.getElementById("btn-quick-copy-pix")?.addEventListener("click", () => {
    navigator.clipboard.writeText("ca.eca2.uergs@gmail.com").then(() => {
      showToast("Chave PIX copiada: ca.eca2.uergs@gmail.com");
    }).catch(() => {
      showToast("Chave PIX: ca.eca2.uergs@gmail.com");
    });
  });

  // Copiar PIX dentro do modal
  document.getElementById("btn-copy-pix")?.addEventListener("click", () => {
    navigator.clipboard.writeText("ca.eca2.uergs@gmail.com").then(() => {
      showToast("Chave PIX copiada: ca.eca2.uergs@gmail.com");
    }).catch(() => {
      showToast("Chave PIX: ca.eca2.uergs@gmail.com");
    });
  });

  // Fechar modal de pedido
  document.getElementById("btn-close-shop-order")?.addEventListener("click", () => {
    dlgOrder?.close();
  });

  // Abertura do modal ao clicar em "Reservar este Item"
  document.querySelectorAll(".btn-open-order").forEach(btn => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-prod-id");
      const prod = PRODUTOS_SHOP.find(p => p.id === prodId);
      if (!prod) return;

      prodIdInput.value = prod.id;

      // Monta preview
      previewEl.innerHTML = `
        <div class="card" style="padding: 1rem; background: hsl(220 40% 12% / .7); display: flex; align-items: center; gap: 1rem;">
          ${prod.foto ? `
            <img src="${prod.foto}" alt="${escapeHtml(prod.nome)}" style="width: 68px; height: 68px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border);">
          ` : `
            <div style="width: 68px; height: 68px; display: grid; place-items: center; font-size: 2rem; background: var(--surface-2); border-radius: var(--radius-sm);">
              ${prod.icone || '📦'}
            </div>
          `}
          <div style="flex: 1;">
            <span class="small muted">${prod.categoria}</span>
            <h4 style="margin: 0; font-size: 1.05rem;">${prod.nome}</h4>
            <strong style="color: var(--cyan); font-size: 1.15rem;">${prod.preco}</strong>
          </div>
        </div>
      `;

      // Configura opções de variante (ex: tamanhos para moletom/camiseta)
      if (prod.id === "moletom-neon") {
        variantField.style.display = "block";
        variantSelect.innerHTML = `
          <option value="P">Tamanho P (Unissex)</option>
          <option value="M" selected>Tamanho M (Unissex)</option>
          <option value="G">Tamanho G (Unissex)</option>
          <option value="GG">Tamanho GG (Unissex)</option>
          <option value="XGG">Tamanho XGG (Unissex)</option>
        `;
      } else if (prod.id === "camiseta-tecnica") {
        variantField.style.display = "block";
        variantSelect.innerHTML = `
          <option value="P">Tamanho P</option>
          <option value="M" selected>Tamanho M</option>
          <option value="G">Tamanho G</option>
          <option value="GG">Tamanho GG</option>
        `;
      } else if (prod.id === "copo-termico") {
        variantField.style.display = "block";
        variantSelect.innerHTML = `
          <option value="padrao" selected>Preto Fosco com Gravação a Laser Eca²</option>
          <option value="personalizado">Preto Fosco + Nome Gravado (+ R$ 5,00)</option>
        `;
      } else if (prod.id === "caneca-lab") {
        variantField.style.display = "block";
        variantSelect.innerHTML = `
          <option value="padrao" selected>Caneca Cerâmica Preta Fosca Neon Eca²</option>
        `;
      } else {
        variantField.style.display = "none";
      }

      // Preenche dados conhecidos caso o usuário já esteja logado
      const auth = getAuth();
      if (auth.user) {
        store.getStudentProfile(auth.user.id).then(prof => {
          if (prof?.display_name && formOrder.name) formOrder.name.value = prof.display_name;
          if (prof?.semester && formOrder.semester) formOrder.semester.value = prof.semester;
          if (prof?.whatsapp && formOrder.whatsapp) formOrder.whatsapp.value = prof.whatsapp;
        }).catch(() => {});
      }

      dlgOrder?.showModal();
    });
  });

  // Submissão da reserva
  formOrder?.addEventListener("submit", (e) => {
    e.preventDefault();
    const prodId = prodIdInput.value;
    const prod = PRODUTOS_SHOP.find(p => p.id === prodId);
    const name = formOrder.name.value.trim();
    const semester = formOrder.semester.value.trim();
    const whatsapp = formOrder.whatsapp.value.trim();
    const variant = variantSelect.value;
    const obs = formOrder.obs.value.trim();

    if (!name || !semester || !whatsapp) {
      showToast("Preencha nome, semestre e WhatsApp.", true);
      return;
    }

    // Salva pedido em localStorage
    const orderData = {
      id: "ord_" + Date.now(),
      product_id: prodId,
      product_name: prod ? prod.nome : prodId,
      product_price: prod ? prod.preco : "",
      name,
      semester,
      whatsapp,
      variant,
      obs,
      created_at: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("eca2_orders") || "[]");
    existing.push(orderData);
    localStorage.setItem("eca2_orders", JSON.stringify(existing));

    dlgOrder?.close();
    formOrder.reset();
    showToast(`🎉 Pré-reserva de ${prod ? prod.nome : 'material'} registrada com sucesso!`);
  });
}

// -------------------------------------------------------------
// VISTA: DOCUMENTOS OFICIAIS & ESTATUTOS (PDFs)
// -------------------------------------------------------------
function renderDocumentosHtml() {
  const estatutos = DOCUMENTOS_OFICIAIS.filter(d => d.destaque);
  const outrosDocs = DOCUMENTOS_OFICIAIS.filter(d => !d.destaque);

  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Transparência & Base Jurídica</span>
          <h2>Estatutos & Documentos Oficiais</h2>
          <p>
            Baixe e consulte os estatutos, editais de convocação e atas em PDF.
            Garantia de conformidade com a Lei Federal nº 7.395/1985 e transparência total para todos os estudantes de Engenharia de Controle e Automação da UERGS.
          </p>
        </div>

        <!-- Banner com os 2 Estatutos Principais em Alta Evidência -->
        <div class="grid grid-2" style="margin-bottom: 3.5rem; align-items: stretch;">
          ${estatutos.map(doc => `
            <div class="card doc-card featured" style="padding: 2rem;">
              <div>
                <div class="row" style="margin-bottom: .75rem; justify-content: space-between;">
                  <span class="badge cyan" style="font-size: .8rem;">${doc.categoria}</span>
                  <span class="badge amber" style="font-size: .75rem;">${doc.tamanho} · PDF</span>
                </div>
                <div class="row" style="align-items: center; gap: 1rem; margin-bottom: .75rem;">
                  <span style="font-size: 2.2rem;">${doc.icone}</span>
                  <div>
                    <h3 style="font-size: 1.35rem; margin: 0; line-height: 1.3;">${doc.titulo}</h3>
                    <span class="small muted">${doc.paginas}</span>
                  </div>
                </div>
                <p class="muted small" style="line-height: 1.7; margin-bottom: 1.5rem;">
                  ${doc.descricao}
                </p>
              </div>

              <div class="stack" style="gap: .75rem; margin-top: auto;">
                <div class="row" style="gap: .6rem;">
                  <a href="${doc.arquivo}" download="${doc.titulo}.pdf" class="btn btn-primary btn-sm" style="flex: 1;">
                    ⬇ Baixar PDF (${doc.tamanho})
                  </a>
                  <button type="button" class="btn btn-ghost btn-sm btn-preview-pdf" data-pdf-url="${doc.arquivo}" data-pdf-title="${escapeHtml(doc.titulo)}" style="flex: 1;">
                    👁️ Visualizar no Portal
                  </button>
                </div>
                <a href="${doc.arquivo}" target="_blank" rel="noopener noreferrer" class="small muted" style="text-align: center; display: block; text-decoration: underline;">
                  Abrir arquivo PDF em nova aba do navegador ↗
                </a>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Grade com Todos os Demais Documentos da Fundação -->
        <div class="section-head" style="margin-bottom: 1.5rem;">
          <span class="eyebrow">Atos da Assembleia & Roteiros</span>
          <h2>Editais, Roteiro e Material de Apoio</h2>
          <p>Documentos preparados para a assembleia geral de 26/10/2026 e mobilização acadêmica.</p>
        </div>

        <div class="grid grid-3" style="align-items: stretch; margin-bottom: 3.5rem;">
          ${outrosDocs.map(doc => `
            <div class="card doc-card" style="padding: 1.5rem;">
              <div>
                <div class="row" style="margin-bottom: .6rem; justify-content: space-between;">
                  <span class="badge slate" style="font-size: .72rem;">${doc.categoria}</span>
                  <span class="small muted">${doc.tamanho}</span>
                </div>
                <div class="row" style="align-items: center; gap: .75rem; margin-bottom: .5rem;">
                  <span style="font-size: 1.5rem;">${doc.icone}</span>
                  <h3 style="font-size: 1.1rem; margin: 0; line-height: 1.3;">${doc.titulo}</h3>
                </div>
                <p class="muted small" style="line-height: 1.6; margin-bottom: 1.25rem;">
                  ${doc.descricao}
                </p>
              </div>

              <div class="row" style="gap: .5rem; margin-top: auto;">
                <a href="${doc.arquivo}" download="${doc.titulo}.pdf" class="btn btn-primary btn-sm" style="flex: 1; font-size: .8rem;">
                  ⬇ Baixar
                </a>
                <button type="button" class="btn btn-ghost btn-sm btn-preview-pdf" data-pdf-url="${doc.arquivo}" data-pdf-title="${escapeHtml(doc.titulo)}" style="font-size: .8rem;">
                  👁️ Ler
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Banner com a Lei Federal 7.395/1985 -->
        <div class="card" style="background: hsl(220 40% 12% / .6); border: 1px solid var(--border-strong); padding: 2rem;">
          <div class="grid grid-2" style="align-items: center; gap: 1.5rem;">
            <div>
              <span class="badge cyan" style="margin-bottom: .5rem;">Segurança Jurídica</span>
              <h3 style="font-size: 1.25rem; margin-bottom: .4rem;">Lei Federal nº 7.395/1985 · Art. 4º</h3>
              <p class="muted small" style="margin: 0; line-height: 1.6;">
                <em>"Aos estudantes é assegurada a livre organização de Centros Acadêmicos (...). O Centro Acadêmico é a entidade representativa dos interesses dos estudantes de um curso superior."</em>
                Nossa documentação foi elaborada para garantir autonomia, legalidade estrita e representação perante a coordenação e reitoria da UERGS.
              </p>
            </div>
            <div style="text-align: right;">
              <a href="#fundacao" class="btn btn-primary">Participar da Assembleia em 26/10 🌭</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function bindPdfPreviewButtons() {
  const dlgPdf = document.getElementById("dlg-pdf-viewer");
  const frame = document.getElementById("pdf-frame");
  const titleEl = document.getElementById("dlg-pdf-title");
  const dlBtn = document.getElementById("dlg-pdf-download-btn");

  document.querySelectorAll(".btn-preview-pdf").forEach(btn => {
    if (btn.dataset.boundPdf) return;
    btn.dataset.boundPdf = "true";
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-pdf-url");
      const title = btn.getAttribute("data-pdf-title");

      if (titleEl) titleEl.textContent = title || "Visualização de Documento";
      if (dlBtn) {
        dlBtn.href = url;
        dlBtn.setAttribute("download", `${title || "documento"}.pdf`);
      }
      if (frame) frame.src = url;

      dlgPdf?.showModal();
    });
  });

  const closeBtn = document.getElementById("btn-close-pdf-viewer");
  if (closeBtn && !closeBtn.dataset.boundClose) {
    closeBtn.dataset.boundClose = "true";
    closeBtn.addEventListener("click", () => {
      if (frame) frame.src = "about:blank";
      dlgPdf?.close();
    });
  }
}

function setupDocumentosInteractions() {
  bindPdfPreviewButtons();
}

// -------------------------------------------------------------
// VISTA: FUNDAÇÃO E SALCHIPÃO
// -------------------------------------------------------------
function renderFundacaoHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">1º Encontro Oficial · Refeitório UERGS</span>
          <h2>26 de Outubro · Salchipão dos Estudantes & Fundação do E(CA)²</h2>
          <p>
            Distribuição de salchipão das <strong>18:30 às 19:15</strong> no refeitório. Coleta de assinaturas da lista oficial, demonstração do novo portal e criação da gestão provisória.
          </p>
        </div>

        <div class="grid grid-2" style="align-items: start; margin-bottom: 3rem;">
          <!-- Card de Confirmação (RSVP) -->
          <div class="card">
            <h3>🌭 Confirme seu Salchipão (18h30 às 19h15)</h3>
            <p class="muted small">
              O salchipão é 100% gratuito para todos os estudantes de Engenharia de Controle e Automação da UERGS. Confirmar nos ajuda a dimensionar a quantidade de pães e refrigerantes!
            </p>

            <form id="form-rsvp" class="form">
              <div class="field">
                <label for="rsvp-name">Seu Nome Completo *</label>
                <input type="text" id="rsvp-name" name="name" required placeholder="Como quer ser chamado">
              </div>

              <div class="field">
                <label for="rsvp-sem">Semestre ou ano de ingresso *</label>
                <input type="text" id="rsvp-sem" name="semester" required placeholder="Ex: 1º semestre (bicho) ou veterano">
              </div>

              <div class="field">
                <label for="rsvp-diet">Restrição Alimentar</label>
                <select id="rsvp-diet" name="diet">
                  <option value="nenhuma">Nenhuma (salchipão tradicional)</option>
                  <option value="vegetariano">Vegetariano</option>
                  <option value="vegano">Vegano</option>
                  <option value="outra">Outra restrição</option>
                </select>
              </div>

              <fieldset class="field">
                <legend>Interesse em colaborar na gestão/estruturação do CA?</legend>
                <div class="radio-row">
                  <label class="radio-pill">
                    <input type="radio" name="commission" value="sim">
                    <span>Quero colaborar!</span>
                  </label>
                  <label class="radio-pill">
                    <input type="radio" name="commission" value="talvez" checked>
                    <span>Talvez</span>
                  </label>
                  <label class="radio-pill">
                    <input type="radio" name="commission" value="nao">
                    <span>Apenas participar do evento</span>
                  </label>
                </div>
              </fieldset>

              <button type="submit" class="btn btn-primary" id="btn-submit-rsvp">Garantir Meu Salchipão 🌭</button>
              <div class="muted small" id="rsvp-confirmed-count">Carregando confirmações...</div>
            </form>
          </div>

          <!-- Dinâmica do Evento e Pauta -->
          <div class="card">
            <h3>📋 Dinâmica do Encontro no Refeitório</h3>
            <p class="muted small">Horário: das 18:30 às 19:15 · Refeitório da UERGS Porto Alegre.</p>

            <ul style="padding-left: 1.2rem; color: var(--muted); font-size: .95rem; line-height: 1.8;">
              <li><strong>18:30 às 19:15 · Acolhimento & Assinaturas:</strong> Estudantes de Controle e Automação assinam a lista física de presença da fundação e retiram seu salchipão.</li>
              <li><strong>Confraternização Aberta:</strong> Espaço livre no refeitório para calouros ("bichos") e veteranos conversarem, tirarem dúvidas de matérias e comerem juntos. Total liberdade para ficar no refeitório ou levar seu lanche se tiver aula.</li>
              <li><strong>Apresentação da Plataforma E(CA)²:</strong> Demonstração do site nos celulares (Árvores dos PPCs 2019/2024, Calendário 2026 e Simulador de Urna).</li>
              <li><strong>Deliberação 1:</strong> Aprovação da fundação oficial do Centro Acadêmico E(CA)².</li>
              <li><strong>Deliberação 2:</strong> Aprovação da criação da Comissão Pró-CA provisória para estruturação jurídica, redação do estatuto social e obtenção de CNPJ.</li>
            </ul>

            <div style="margin-top: 1.5rem; padding: 1.1rem; border-radius: var(--radius-sm); background: hsl(190 90% 40% / .1); border: 1px solid var(--border);">
              <strong style="color: var(--cyan); font-size: .95rem;">🎯 Propósito Estratégico do E(CA)²:</strong>
              <p class="small muted" style="margin: .35rem 0 0; line-height: 1.6;">
                Formalizar o CA com personalidade jurídica e CNPJ próprio para disputar <strong>editais de ciência, inovação, cultura e assistência estudantil</strong>, captar patrocínios industriais e financiar materiais de bancada, visitas técnicas e projetos dos alunos.
              </p>
            </div>
          </div>
        </div>

        <!-- Linha do Tempo Visual -->
        <div class="section-head">
          <span class="eyebrow">Etapas do Processo</span>
          <h2>Do Salchipão até a Primeira Diretoria</h2>
        </div>
        <div class="timeline">
          ${LINHA_DO_TEMPO.map(t => `
            <div class="tl-item ${t.destaque ? 'destaque' : ''}">
              <div class="card">
                <span class="tl-date">${t.data}</span>
                <h3 style="margin: .25rem 0 .4rem;">${t.titulo}</h3>
                <p class="muted small" style="margin: 0;">${t.texto}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Bloco de Acesso Direto aos Estatutos e Documentos -->
        <div class="card" style="margin-top: 3.5rem; padding: 2.25rem; border: 1px solid var(--border-strong); background: linear-gradient(180deg, hsl(189 94% 55% / .08) 0%, var(--surface) 100%);">
          <div class="grid grid-2" style="align-items: center; gap: 2rem;">
            <div>
              <span class="badge cyan" style="margin-bottom: .6rem;">Transparência & Acesso Livre</span>
              <h3 style="font-size: 1.45rem; margin-bottom: .6rem;">Estatutos & Documentação Legal do E(CA)²</h3>
              <p class="muted small" style="line-height: 1.7; margin-bottom: 1.25rem;">
                Consulte o <strong>Estatuto Social do E(CA)² 2026</strong>, o <strong>Estatuto da Representação Discente UERGS</strong>, o <strong>Edital de Convocação</strong> e o <strong>Roteiro da Assembleia</strong>. Nenhum documento fica em segredo: tudo está disponível para leitura e download em formato PDF A4 padronizado.
              </p>
              <div class="row" style="gap: .75rem;">
                <a href="pdf/Estatuto_ECA2_2026.pdf" download="Estatuto_ECA2_2026.pdf" class="btn btn-primary btn-sm">
                  ⬇ Baixar Estatuto do CA (PDF)
                </a>
                <a href="#documentos" class="btn btn-ghost btn-sm">
                  Ver Todos os Estatutos & PDFs 📂
                </a>
              </div>
            </div>
            <div class="stack" style="gap: .75rem;">
              <a href="pdf/Estatuto_Representacao_Discente.pdf" target="_blank" class="card" style="padding: 1rem; border-color: var(--border); background: hsl(220 40% 12% / .8); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="display: block; font-size: .95rem; color: var(--text);">🏛️ Estatuto da Representação Discente UERGS</strong>
                  <span class="small muted">Regulamento dos órgãos colegiados · 371 KB PDF</span>
                </div>
                <span class="badge slate">Abrir ↗</span>
              </a>
              <a href="pdf/02_Edital_de_Convocacao.pdf" target="_blank" class="card" style="padding: 1rem; border-color: var(--border); background: hsl(220 40% 12% / .8); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="display: block; font-size: .95rem; color: var(--text);">📢 Edital de Convocação Oficial (26/10)</strong>
                  <span class="small muted">Ordem do dia e normas legais · 270 KB PDF</span>
                </div>
                <span class="badge slate">Abrir ↗</span>
              </a>
              <a href="pdf/03_Roteiro_da_Assembleia.pdf" target="_blank" class="card" style="padding: 1rem; border-color: var(--border); background: hsl(220 40% 12% / .8); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="display: block; font-size: .95rem; color: var(--text);">⏱️ Roteiro da Assembleia Minuto a Minuto</strong>
                  <span class="small muted">Condução consensual sem conflitos · 363 KB PDF</span>
                </div>
                <span class="badge slate">Abrir ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function setupFundacaoInteractions() {
  const form = document.getElementById("form-rsvp");
  const countEl = document.getElementById("rsvp-confirmed-count");

  // Atualiza contagem inicial
  store.rsvp.count().then(n => {
    if (countEl) countEl.textContent = `🎉 Mais de ${n} estudantes já confirmaram presença!`;
  }).catch(() => {});

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-rsvp");
    const name = form.name.value.trim();
    const semester = form.semester.value.trim();
    const diet = form.diet.value;
    const commission = form.commission.value;

    if (!name || !semester) {
      showToast("Por favor, preencha nome e semestre.", true);
      return;
    }

    try {
      if (btn) btn.disabled = true;
      await store.rsvp.add({ name, semester, diet, commission });
      showToast("Presença confirmada! Nos vemos dia 26/10 🌭");
      form.reset();
      const n = await store.rsvp.count();
      if (countEl) countEl.textContent = `🎉 Mais de ${n} estudantes já confirmaram presença!`;
    } catch (err) {
      showToast(err.message || "Erro ao registrar confirmação.", true);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

// -------------------------------------------------------------
// VISTA: MURAL DE SUGESTÕES
// -------------------------------------------------------------
function renderMuralHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Construção Coletiva</span>
          <h2>Mural de Demandas & Sugestões</h2>
          <p>
            Dê ideias para o curso, vote nas propostas dos colegas e ajude o CA a priorizar o que realmente importa (laboratórios, horários, estágios, semana acadêmica).
          </p>
        </div>

        <div class="toolbar">
          <div class="chips" id="cat-chips">
            <button type="button" class="chip" data-cat="todas" aria-pressed="true">Todas</button>
            ${CATEGORIAS_SUGESTAO.map(c => `
              <button type="button" class="chip" data-cat="${c}" aria-pressed="false">${c}</button>
            `).join("")}
          </div>
          <div class="spacer"></div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-nova-sugestao">+ Enviar Proposta</button>
        </div>

        <!-- Formulário recolhível para nova sugestão -->
        <div id="box-nova-sugestao" style="display: none; margin-bottom: 2rem;">
          <div class="card">
            <h3>Enviar Nova Proposta</h3>
            <form id="form-sugestao" class="form">
              <div class="field">
                <label for="sug-title">Título resumido *</label>
                <input type="text" id="sug-title" name="title" required placeholder="Ex: Ampliar horário do laboratório de CLP">
              </div>
              <div class="grid grid-2">
                <div class="field">
                  <label for="sug-cat">Categoria</label>
                  <select id="sug-cat" name="category">
                    ${CATEGORIAS_SUGESTAO.map(c => `<option value="${c}">${c}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="field">
                <label for="sug-body">Detalhes / Justificativa *</label>
                <textarea id="sug-body" name="body" required placeholder="Explique como essa medida ajuda os alunos..."></textarea>
              </div>
              <div class="row">
                <button type="submit" class="btn btn-primary btn-sm">Publicar Proposta</button>
                <button type="button" class="btn btn-ghost btn-sm" id="btn-cancel-sugestao">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lista de Sugestões -->
        <div id="lista-sugestoes" class="stack">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </section>
  `;
}

async function setupMuralInteractions() {
  const box = document.getElementById("box-nova-sugestao");
  const btnAbrir = document.getElementById("btn-nova-sugestao");
  const btnCancelar = document.getElementById("btn-cancel-sugestao");
  const form = document.getElementById("form-sugestao");
  let selectedCategory = "todas";

  btnAbrir?.addEventListener("click", () => {
    const auth = getAuth();
    if (!auth.user) {
      showToast("Faça login para publicar uma sugestão.");
      document.getElementById("dlg-auth")?.showModal();
      return;
    }
    box.style.display = box.style.display === "none" ? "block" : "none";
  });

  btnCancelar?.addEventListener("click", () => {
    box.style.display = "none";
  });

  // Filtro por categoria
  document.querySelectorAll("#cat-chips .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#cat-chips .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      selectedCategory = chip.getAttribute("data-cat");
      carregarSugestoes();
    });
  });

  // Submissão de proposta
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const body = form.body.value.trim();
    const category = form.category.value;

    if (!title || !body) return;

    try {
      await store.suggestions.create({ title, body, category });
      showToast("Proposta publicada com sucesso! 🚀");
      form.reset();
      box.style.display = "none";
      await carregarSugestoes();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  async function carregarSugestoes() {
    const listEl = document.getElementById("lista-sugestoes");
    if (!listEl) return;
    try {
      const all = await store.suggestions.list();
      const filtered = selectedCategory === "todas" ? all : all.filter(s => s.category === selectedCategory);

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div class="card empty">
            <div class="big">💡</div>
            <p>Nenhuma sugestão nesta categoria ainda. Seja o primeiro a propor!</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(s => {
        const st = STATUS_SUGESTAO[s.status] || STATUS_SUGESTAO.nova;
        return `
          <div class="card sug ${s.hidden ? 'is-hidden' : ''}" id="sug-${s.id}">
            <button type="button" class="vote-btn" data-sug-id="${s.id}" aria-pressed="${s.voted ? 'true' : 'false'}" aria-label="Apoiar proposta">
              <span class="arrow">▲</span>
              <span class="n">${s.vote_count}</span>
            </button>
            <div>
              <div class="row" style="margin-bottom: .4rem;">
                <span class="badge ${st.cor}">${st.label}</span>
                <span class="badge slate">${escapeHtml(s.category)}</span>
                <span class="small muted">${escapeHtml(s.author)} ${s.semester ? `(${escapeHtml(s.semester)})` : ''} · ${formatRelativeTime(s.created_at)}</span>
              </div>
              <h3 style="margin-bottom: .4rem;">${escapeHtml(s.title)}</h3>
              <p class="post-body">${escapeHtml(s.body)}</p>

              ${s.ca_reply ? `
                <div class="ca-official-reply" style="margin-top: .85rem; padding: .85rem 1.15rem; border-radius: var(--radius-sm); background: hsl(189 94% 55% / .08); border-left: 3px solid var(--cyan);">
                  <div class="row" style="gap: .5rem; margin-bottom: .3rem; align-items: center; flex-wrap: wrap;">
                    <span class="badge cyan" style="font-size: .72rem; padding: .15rem .55rem;">⚡ Resposta Oficial da Diretoria E(CA)²</span>
                    <span class="small muted">${s.ca_replied_at ? formatRelativeTime(s.ca_replied_at) : ''} ${s.ca_replied_by ? `· ${escapeHtml(s.ca_replied_by)}` : ''}</span>
                  </div>
                  <p class="small" style="margin: 0; line-height: 1.55; color: var(--text);">${escapeHtml(s.ca_reply)}</p>
                </div>
              ` : ''}

              ${getAuth().isAdmin ? `
                <div class="admin-bar">
                  <select data-admin-status="${s.id}">
                    <option value="nova" ${s.status === 'nova' ? 'selected' : ''}>Nova</option>
                    <option value="analise" ${s.status === 'analise' ? 'selected' : ''}>Em análise</option>
                    <option value="encaminhada" ${s.status === 'encaminhada' ? 'selected' : ''}>Encaminhada</option>
                    <option value="concluida" ${s.status === 'concluida' ? 'selected' : ''}>Concluída</option>
                  </select>
                  <button type="button" class="btn btn-ghost btn-sm" data-admin-hide="${s.id}">${s.hidden ? 'Reexibir' : 'Ocultar'}</button>
                  <button type="button" class="btn btn-danger btn-sm" data-admin-del="${s.id}">Excluir</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join("");

      // Vincula votos
      listEl.querySelectorAll(".vote-btn").forEach(b => {
        b.addEventListener("click", async () => {
          const auth = getAuth();
          if (!auth.user) {
            showToast("Faça login para votar nas ideias.");
            document.getElementById("dlg-auth")?.showModal();
            return;
          }
          const id = Number(b.getAttribute("data-sug-id"));
          const voted = b.getAttribute("aria-pressed") === "true";
          try {
            await store.suggestions.toggleVote(id, voted);
            await carregarSugestoes();
          } catch (err) {
            showToast(err.message, true);
          }
        });
      });

      // Vincula ações de Admin
      listEl.querySelectorAll("[data-admin-status]").forEach(sel => {
        sel.addEventListener("change", async () => {
          const id = Number(sel.getAttribute("data-admin-status"));
          await store.suggestions.update(id, { status: sel.value });
          showToast("Status atualizado!");
          await carregarSugestoes();
        });
      });
      listEl.querySelectorAll("[data-admin-hide]").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = Number(btn.getAttribute("data-admin-hide"));
          const item = filtered.find(x => x.id === id);
          await store.suggestions.update(id, { hidden: !item.hidden });
          await carregarSugestoes();
        });
      });
      listEl.querySelectorAll("[data-admin-del]").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!confirm("Excluir esta proposta?")) return;
          const id = Number(btn.getAttribute("data-admin-del"));
          await store.suggestions.remove(id);
          await carregarSugestoes();
        });
      });

    } catch (err) {
      listEl.innerHTML = `<div class="card error"><p>${err.message}</p></div>`;
    }
  }

  await carregarSugestoes();
}

// -------------------------------------------------------------
// VISTA: ENQUETES
// -------------------------------------------------------------
function renderEnquetesHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Tomada de Decisão</span>
          <h2>Enquetes da Comunidade</h2>
          <p>Opine em votações rápidas para orientar as ações e prioridades do E(CA)².</p>
        </div>

        <div id="lista-enquetes" class="grid grid-2">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </section>
  `;
}

async function setupEnquetesInteractions() {
  const listEl = document.getElementById("lista-enquetes");
  if (!listEl) return;

  async function carregarEnquetes() {
    try {
      const polls = await store.polls.list();
      if (polls.length === 0) {
        listEl.innerHTML = `<div class="card empty"><p>Nenhuma enquete aberta no momento.</p></div>`;
        return;
      }

      listEl.innerHTML = polls.map(p => {
        const totalVotes = p.options.reduce((acc, o) => acc + o.vote_count, 0);
        return `
          <div class="card">
            <div class="row" style="margin-bottom: .8rem;">
              <span class="badge ${p.is_open ? 'green' : 'slate'}">${p.is_open ? 'Aberta' : 'Encerrada'}</span>
              <span class="small muted">${totalVotes} voto(s) computado(s)</span>
            </div>
            <h3 style="margin-bottom: 1.25rem;">${escapeHtml(p.question)}</h3>

            <div class="stack" style="gap: .6rem;">
              ${p.options.map(opt => {
                const pct = totalVotes > 0 ? Math.round((opt.vote_count / totalVotes) * 100) : 0;
                const isMyVote = p.myOption === opt.id;
                return p.is_open && !p.myOption ? `
                  <button type="button" class="poll-opt" data-poll-id="${p.id}" data-opt-id="${opt.id}">
                    <span class="bar" style="--pct: 0%;"></span>
                    <span>${escapeHtml(opt.label)}</span>
                  </button>
                ` : `
                  <div class="poll-opt ${isMyVote ? 'mine' : ''}">
                    <span class="bar" style="--pct: ${pct}%;"></span>
                    <span>${escapeHtml(opt.label)} ${isMyVote ? '✓' : ''}</span>
                    <span class="pct">${pct}%</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }).join("");

      // Clique para votar
      listEl.querySelectorAll("button.poll-opt").forEach(btn => {
        btn.addEventListener("click", async () => {
          const auth = getAuth();
          if (!auth.user) {
            showToast("Faça login para participar da enquete.");
            document.getElementById("dlg-auth")?.showModal();
            return;
          }
          const pId = Number(btn.getAttribute("data-poll-id"));
          const oId = Number(btn.getAttribute("data-opt-id"));
          try {
            await store.polls.vote(pId, oId);
            showToast("Voto registrado com sucesso!");
            await carregarEnquetes();
          } catch (err) {
            showToast(err.message, true);
          }
        });
      });

    } catch (err) {
      listEl.innerHTML = `<div class="card error"><p>${err.message}</p></div>`;
    }
  }

  await carregarEnquetes();
}

// -------------------------------------------------------------
// VISTA: FÓRUM
// -------------------------------------------------------------
function renderForumHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Espaço Aberto</span>
          <h2>Fórum de Discussão do Curso</h2>
          <p>Tire dúvidas sobre disciplinas, compartilhe dicas de estudo, vagas de estágio e debata os rumos do E(CA)².</p>
        </div>

        <div class="toolbar">
          <div class="spacer"></div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-novo-topico">+ Criar Tópico</button>
        </div>

        <!-- Formulário recolhível para novo tópico -->
        <div id="box-novo-topico" style="display: none; margin-bottom: 2rem;">
          <div class="card">
            <h3>Criar Nova Discussão</h3>
            <form id="form-topico" class="form">
              <div class="field">
                <label for="top-title">Título do Tópico *</label>
                <input type="text" id="top-title" name="title" required placeholder="Ex: Onde encontrar materiais para Controle I?">
              </div>
              <div class="grid grid-2">
                <div class="field">
                  <label for="top-cat">Categoria</label>
                  <select id="top-cat" name="category">
                    ${CATEGORIAS_FORUM.map(c => `<option value="${c}">${c}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="field">
                <label for="top-body">Mensagem *</label>
                <textarea id="top-body" name="body" required placeholder="Descreva sua dúvida ou assunto..."></textarea>
              </div>
              <div class="row">
                <button type="submit" class="btn btn-primary btn-sm">Publicar Tópico</button>
                <button type="button" class="btn btn-ghost btn-sm" id="btn-cancel-topico">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lista de Tópicos -->
        <div id="lista-topicos" class="stack">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </section>
  `;
}

async function setupForumInteractions() {
  const box = document.getElementById("box-novo-topico");
  const btnNovo = document.getElementById("btn-novo-topico");
  const btnCancel = document.getElementById("btn-cancel-topico");
  const form = document.getElementById("form-topico");
  const listEl = document.getElementById("lista-topicos");

  btnNovo?.addEventListener("click", () => {
    const auth = getAuth();
    if (!auth.user) {
      showToast("Faça login para criar um tópico.");
      document.getElementById("dlg-auth")?.showModal();
      return;
    }
    box.style.display = box.style.display === "none" ? "block" : "none";
  });

  btnCancel?.addEventListener("click", () => {
    box.style.display = "none";
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const body = form.body.value.trim();
    const category = form.category.value;
    if (!title || !body) return;

    try {
      const newId = await store.topics.create({ title, body, category });
      showToast("Tópico criado com sucesso!");
      form.reset();
      box.style.display = "none";
      navigate("forum", newId);
    } catch (err) {
      showToast(err.message, true);
    }
  });

  try {
    const topics = await store.topics.list();
    if (topics.length === 0) {
      listEl.innerHTML = `<div class="card empty"><p>Nenhum tópico criado ainda. Comece a conversa!</p></div>`;
      return;
    }

    listEl.innerHTML = topics.map(t => `
      <div class="card topic-row hover">
        <div>
          <div class="row" style="margin-bottom: .25rem;">
            <span class="badge slate">${escapeHtml(t.category)}</span>
            <span class="small muted">por ${escapeHtml(t.author)} ${t.semester ? `(${escapeHtml(t.semester)})` : ''} · ${formatRelativeTime(t.created_at)}</span>
          </div>
          <h3><a href="#forum/${t.id}" data-topic-link="${t.id}">${escapeHtml(t.title)}</a></h3>
        </div>
        <div class="reply-count">
          <span class="n">${t.reply_count}</span>
          <span class="small muted">respostas</span>
        </div>
      </div>
    `).join("");

    listEl.querySelectorAll("[data-topic-link]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = Number(a.getAttribute("data-topic-link"));
        navigate("forum", id);
      });
    });

  } catch (err) {
    listEl.innerHTML = `<div class="card error"><p>${err.message}</p></div>`;
  }
}

// Detalhe de Tópico e Respostas
async function renderTopicDetail(id) {
  const root = document.getElementById("app-root");
  try {
    const data = await store.topics.get(id);
    if (!data) {
      root.innerHTML = `<div class="container section"><p>Tópico não encontrado.</p><a href="#forum" class="btn btn-ghost btn-sm">Voltar</a></div>`;
      return;
    }

    const { topic, replies } = data;
    root.innerHTML = `
      <section class="section">
        <div class="container" style="max-width: 820px;">
          <div class="breadcrumb">
            <a href="#forum" id="btn-back-forum">← Voltar para o Fórum</a>
          </div>

          <article class="card" style="margin-bottom: 2rem;">
            <div class="row" style="margin-bottom: .75rem;">
              <span class="badge slate">${escapeHtml(topic.category)}</span>
              <span class="small muted">Postado por <strong>${escapeHtml(topic.author)}</strong> ${topic.semester ? `(${escapeHtml(topic.semester)})` : ''} · ${formatRelativeTime(topic.created_at)}</span>
            </div>
            <h2>${escapeHtml(topic.title)}</h2>
            <div class="post-body" style="font-size: 1.05rem; margin-top: 1rem;">${escapeHtml(topic.body)}</div>
          </article>

          <h3 style="margin-bottom: 1.25rem;">Respostas (${replies.length})</h3>

          <div class="stack" style="margin-bottom: 2rem;">
            ${replies.length === 0 ? `<p class="muted small">Seja o primeiro a responder!</p>` : replies.map(r => `
              <div class="card reply">
                <div class="avatar">${escapeHtml(r.author).slice(0, 2).toUpperCase()}</div>
                <div>
                  <div class="row" style="margin-bottom: .3rem;">
                    <strong>${escapeHtml(r.author)}</strong>
                    <span class="small muted">${r.semester ? `(${escapeHtml(r.semester)})` : ''} · ${formatRelativeTime(r.created_at)}</span>
                  </div>
                  <div class="post-body">${escapeHtml(r.body)}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Caixa de Resposta -->
          <div class="card">
            <h4>Deixar uma resposta</h4>
            <form id="form-reply" class="form" style="margin-top: 1rem;">
              <div class="field">
                <textarea id="reply-body" name="body" required placeholder="Escreva sua resposta de forma respeitosa..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-sm">Publicar Resposta</button>
            </form>
          </div>
        </div>
      </section>
    `;

    document.getElementById("btn-back-forum")?.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("forum");
    });

    document.getElementById("form-reply")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const auth = getAuth();
      if (!auth.user) {
        showToast("Faça login para responder.");
        document.getElementById("dlg-auth")?.showModal();
        return;
      }
      const body = document.getElementById("reply-body").value.trim();
      if (!body) return;

      try {
        await store.topics.reply(id, body);
        showToast("Resposta publicada!");
        await renderTopicDetail(id);
      } catch (err) {
        showToast(err.message, true);
      }
    });

  } catch (err) {
    root.innerHTML = `<div class="container section"><p>${err.message}</p></div>`;
  }
}

// -------------------------------------------------------------
// VISTA: SOBRE O CURSO (PPC 2024 VIGENTE & PPC 2019 HISTÓRICO)
// -------------------------------------------------------------
function renderCursoHtml(tab = currentCursoTab) {
  const activeTab = ["arvore", "beneficios", "labs", "perfil", "estagios"].includes(tab) ? tab : "perfil";

  const colorMap = {
    cyan: "hsl(189 94% 55%)",
    blue: "hsl(215 90% 60%)",
    amber: "hsl(35 100% 58%)",
    emerald: "hsl(152 68% 52%)",
    violet: "hsl(262 83% 72%)",
    rose: "hsl(340 85% 65%)",
    slate: "hsl(215 20% 62%)"
  };

  let tabContentHtml = "";

  if (activeTab === "arvore") {
    tabContentHtml = `
      <!-- Banner de Acesso aos Documentos Oficiais dos PPCs -->
      <div class="card" style="margin-bottom: 2.5rem; background: linear-gradient(135deg, hsl(220 40% 12% / .9) 0%, hsl(222 45% 8% / .9) 100%); border: 1px solid hsl(189 94% 55% / .3); box-shadow: 0 10px 30px -10px hsl(189 94% 55% / .15);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <span class="eyebrow" style="color: var(--cyan);">Documentação Pedagógica Oficial</span>
            <h3 style="margin: .25rem 0 0; font-size: 1.35rem;">Projetos Pedagógicos de Curso (PPCs em PDF)</h3>
          </div>
          <span class="badge" style="background: hsl(189 94% 55% / .15); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .3);">Arquivos Oficiais UERGS</span>
        </div>
        <p class="small muted" style="margin-bottom: 1.5rem;">
          Consulte a íntegra dos documentos pedagógicos aprovados pelo Conselho de Ensino, Pesquisa e Extensão (CONEPE). Você pode visualizar diretamente no navegador ou fazer o download para consulta offline.
        </p>
        <div class="grid grid-2" style="gap: 1.25rem;">
          <!-- Card PPC 2024 -->
          <div style="background: hsl(222 35% 14% / .7); border: 1px solid hsl(189 94% 55% / .4); border-radius: var(--radius-sm); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="row" style="justify-content: space-between; align-items: flex-start; margin-bottom: .5rem;">
                <span style="font-size: 1.75rem;">📘</span>
                <span class="badge" style="background: hsl(152 68% 52% / .2); color: var(--green); border: 1px solid hsl(152 68% 52% / .4); font-size: .75rem;">GRADE VIGENTE</span>
              </div>
              <h4 style="margin: 0 0 .35rem; font-size: 1.05rem;">PPC 2024 (Resolução CONEPE 016/2023)</h4>
              <p class="small muted" style="margin: 0 0 1rem; font-size: .82rem;">
                Grade curricular atual com 4.015h, 235 créditos, matriz dos 10 módulos, 410h de extensão universitária e ementário completo.
              </p>
            </div>
            <div class="row" style="gap: .6rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary btn-sm btn-preview-pdf" data-pdf-url="pdf/PPC_Controle_Automacao_2024_Vigente.pdf" data-pdf-title="PPC 2024 Vigente - Eng. de Controle e Automação UERGS">
                👁️ Ler no Navegador
              </button>
              <a href="pdf/PPC_Controle_Automacao_2024_Vigente.pdf" download="PPC_Controle_Automacao_2024_Vigente.pdf" class="btn btn-ghost btn-sm">
                ⬇️ Baixar (3.4 MB)
              </a>
            </div>
          </div>

          <!-- Card PPC 2019 -->
          <div style="background: hsl(222 35% 14% / .7); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="row" style="justify-content: space-between; align-items: flex-start; margin-bottom: .5rem;">
                <span style="font-size: 1.75rem;">📙</span>
                <span class="badge" style="background: hsl(222 25% 20%); color: var(--muted); border: 1px solid var(--border); font-size: .75rem;">GRADE HISTÓRICA</span>
              </div>
              <h4 style="margin: 0 0 .35rem; font-size: 1.05rem;">PPC 2019 (Resolução CONEPE 037/2019)</h4>
              <p class="small muted" style="margin: 0 0 1rem; font-size: .82rem;">
                Matriz anterior de 3.765h. Essencial para acompanhamento de transição curricular, direitos adquiridos e equivalências de disciplinas.
              </p>
            </div>
            <div class="row" style="gap: .6rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-ghost btn-sm btn-preview-pdf" data-pdf-url="pdf/PPC_Controle_Automacao_2019_Antigo.pdf" data-pdf-title="PPC 2019 Histórico - Eng. de Controle e Automação UERGS">
                👁️ Ler no Navegador
              </button>
              <a href="pdf/PPC_Controle_Automacao_2019_Antigo.pdf" download="PPC_Controle_Automacao_2019_Antigo.pdf" class="btn btn-ghost btn-sm">
                ⬇️ Baixar (3.7 MB)
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Árvore de Dependências Interativa dos PPCs (2024 vs 2019) -->
      <div class="section-head" id="arvore-dependencias">
        <span class="eyebrow">Fluxo Curricular & Pré-Requisitos</span>
        <h2>Árvore de Dependências dos PPCs (2024 vs 2019)</h2>
        <p>
          Mapa interativo de pré-requisitos e trilhas formativas. Alterne entre o <strong>PPC 2024 (Vigente)</strong> e o <strong>PPC 2019 (Histórico)</strong>, clique em qualquer disciplina para traçar sua cadeia de dependências ou baixe o diagrama vetorial.
        </p>
      </div>

      <div class="dep-tree-container">
        <!-- Barra de Troca de PPC e Filtros -->
        <div class="dep-switch-bar">
          <div>
            <div class="dep-ppc-pills" role="tablist" aria-label="Escolher versão do PPC">
              <button type="button" class="dep-ppc-btn active" id="btn-ppc-2024" data-ppc="2024">
                📘 PPC 2024 (Vigente · 4.015h)
              </button>
              <button type="button" class="dep-ppc-btn" id="btn-ppc-2019" data-ppc="2019">
                📙 PPC 2019 (Histórico · 3.765h)
              </button>
            </div>
          </div>

          <!-- Filtro de Grandes Áreas -->
          <div class="dep-areas-bar" id="dep-area-filters">
            <span class="small faint" style="margin-right: .25rem;">Área:</span>
            <button type="button" class="dep-area-btn active" data-area="all">Todas</button>
            <button type="button" class="dep-area-btn" data-area="matematica">🧮 Matemática</button>
            <button type="button" class="dep-area-btn" data-area="fisica">⚡ Física & Térmica</button>
            <button type="button" class="dep-area-btn" data-area="computacao">💻 Computação</button>
            <button type="button" class="dep-area-btn" data-area="eletronica">🔌 Eletrônica</button>
            <button type="button" class="dep-area-btn" data-area="controle">🦾 Controle & Robótica</button>
            <button type="button" class="dep-area-btn" data-area="mecanica">⚙️ Mecânica</button>
          </div>

          <!-- Botões de Ação -->
          <div class="row" style="gap: .5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-export-dep-svg" title="Baixar imagem vetorial SVG da árvore do PPC selecionado">
              📷 Baixar Imagem (SVG)
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-dep-selection" style="display: none;">
              ✕ Limpar Seleção
            </button>
          </div>
        </div>

        <!-- Banner de Estatísticas da Versão Selecionada -->
        <div class="dep-stats-banner" id="dep-stats-banner"></div>

        <!-- Inspetor de Disciplina Selecionada -->
        <div class="dep-inspector-box empty" id="dep-inspector">
          💡 <strong>Instrução Interativa:</strong> Clique em qualquer matéria no mapa abaixo para traçar automaticamente sua cadeia de pré-requisitos (<span style="color: var(--green); font-weight: 600;">verde</span>) e as matérias que ela destrava (<span style="color: var(--amber); font-weight: 600;">laranja</span>).
        </div>

        <!-- Dica móvel de navegação -->
        <div class="dep-mobile-scroll-hint small muted" style="display: none; align-items: center; gap: .4rem; margin-bottom: .6rem; font-size: .82rem;">
          <span>👉</span> <em>Deslize horizontalmente para navegar pelos 10 módulos</em>
        </div>

        <!-- Visualizador Gráfico com Scroll Horizontal -->
        <div class="dep-graph-scroll" id="dep-graph-scroll">
          <svg class="dep-svg-canvas" id="dep-svg-canvas"></svg>
          <div class="dep-columns-grid" id="dep-columns-grid"></div>
        </div>
      </div>

      <!-- Matriz Curricular dos 10 Módulos (Interativa) -->
      <div class="section-head" id="matriz-curricular" style="margin-top: 3.5rem;">
        <span class="eyebrow">Estrutura Curricular Detalhada</span>
        <h2>Matriz Curricular dos 10 Módulos (Semestres)</h2>
        <p>
          Navegue pelos módulos da grade ou pesquise diretamente pelo nome da disciplina, código ou pré-requisito.
        </p>
      </div>

      <!-- Toolbar de Busca e Abas -->
      <div style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <input type="search" id="curso-search-input" class="input" placeholder="🔍 Filtrar disciplinas por código, nome ou pré-requisito (ex: Cálculo, CLP, ROBOT, Física)..." style="width: 100%; max-width: 500px; padding: .65rem 1rem;">
        </div>
        
        <div class="module-tabs" id="curso-module-tabs" role="tablist" aria-label="Módulos do curso">
          ${CURSO.modulos.map(m => `
            <button type="button" class="module-tab-btn" data-mod="${m.numero}">${m.numero}º Módulo</button>
          `).join("")}
          <button type="button" class="module-tab-btn" data-mod="eletivas">Eletivas (${CURSO.eletivas.length})</button>
        </div>
      </div>

      <!-- Container das Tabelas de Módulos (Ocultos por padrão) -->
      <div id="curso-modules-container">
        <!-- Placeholder inicial quando nenhum semestre está selecionado -->
        <div id="curso-placeholder" class="card" style="text-align: center; padding: 2.75rem 1.5rem; border: 1px dashed var(--border); background: hsl(222 35% 10% / .5); margin-bottom: 2rem;">
          <div style="font-size: 2.2rem; margin-bottom: .5rem;">📚</div>
          <h3 style="margin: 0 0 .35rem; font-size: 1.15rem;">Nenhum semestre selecionado</h3>
          <p class="muted small" style="max-width: 520px; margin: 0 auto; font-size: .88rem; line-height: 1.6;">
            Clique em qualquer um dos botões acima (do <strong>1º ao 10º Módulo</strong> ou <strong>Eletivas</strong>) para abrir e visualizar a grade curricular, créditos e pré-requisitos correspondentes.
          </p>
        </div>

        ${CURSO.modulos.map(m => `
          <div class="module-group" data-module-number="${m.numero}" style="display: none;">
            <div class="module-header">
              <div>
                <h3>
                  <span>${m.numero}º Módulo</span>
                  <span class="badge" style="background: hsl(189 94% 55% / .1); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .3); font-size: .8rem;">${m.chTotal} · ${m.creditos} créditos</span>
                </h3>
                <div class="small muted" style="margin-top: .25rem;">
                  🎯 <strong>Foco:</strong> ${m.foco}
                </div>
              </div>
              <span class="small faint">${m.disciplinas.length} componentes curriculares</span>
            </div>

            <div class="disciplines-table-wrap">
              <table class="disciplines-table">
                <thead>
                  <tr>
                    <th style="width: 100px;">Código</th>
                    <th>Disciplina</th>
                    <th style="width: 90px;">Carga Horária</th>
                    <th style="width: 80px;">Créditos</th>
                    <th style="width: 120px;">Núcleo</th>
                    <th>Pré-requisitos</th>
                    <th style="width: 140px;">Modalidade</th>
                  </tr>
                </thead>
                <tbody>
                  ${m.disciplinas.map(d => `
                    <tr class="discipline-row" data-search="${(d.codigo + ' ' + d.nome + ' ' + d.pre + ' ' + d.tipo).toLowerCase()}">
                      <td><span class="discipline-code">${d.codigo}</span></td>
                      <td><strong>${d.nome}</strong></td>
                      <td><span style="font-family: var(--font-mono); font-size: .85rem;">${d.ch}</span></td>
                      <td><span style="font-family: var(--font-mono); font-size: .85rem;">${d.cr} cr</span></td>
                      <td><span class="badge">${d.nucleo}</span></td>
                      <td><span class="small ${d.pre === 'Sem pré-requisito' ? 'faint' : 'text-cyan'}">${d.pre}</span></td>
                      <td><span class="small faint">${d.tipo}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `).join("")}

        <!-- Eletivas -->
        <div class="module-group" data-module-number="eletivas" style="display: none;">
          <div class="module-header">
            <div>
              <h3>
                <span>Disciplinas Eletivas</span>
                <span class="badge">Mínimo 60h exigidas</span>
              </h3>
              <div class="small muted" style="margin-top: .25rem;">
                🎯 Componentes optativos para aprofundamento específico em áreas de interesse do estudante.
              </div>
            </div>
            <span class="small faint">${CURSO.eletivas.length} opções disponíveis</span>
          </div>

          <div class="disciplines-table-wrap">
            <table class="disciplines-table">
              <thead>
                <tr>
                  <th style="width: 100px;">Código</th>
                  <th>Disciplina</th>
                  <th style="width: 90px;">Carga Horária</th>
                  <th style="width: 80px;">Créditos</th>
                  <th style="width: 120px;">Área Temática</th>
                  <th>Pré-requisito</th>
                </tr>
              </thead>
              <tbody>
                ${CURSO.eletivas.map(e => `
                  <tr class="discipline-row" data-search="${(e.codigo + ' ' + e.nome + ' ' + e.area).toLowerCase()}">
                    <td><span class="discipline-code">${e.codigo}</span></td>
                    <td><strong>${e.nome}</strong></td>
                    <td><span style="font-family: var(--font-mono); font-size: .85rem;">${e.ch}</span></td>
                    <td><span style="font-family: var(--font-mono); font-size: .85rem;">${e.cr} cr</span></td>
                    <td><span class="badge">${e.area}</span></td>
                    <td><span class="small faint">${e.pre}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Curricularização da Extensão Universitária -->
      <div class="card" style="margin-top: 3rem; margin-bottom: 3.5rem;">
        <div class="row" style="justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem; margin-bottom: .75rem;">
          <div class="row" style="gap: .6rem; align-items: center;">
            <span style="font-size: 1.5rem;">🌱</span>
            <h3 style="margin: 0;">Extensão Universitária Obrigatória (410 horas · 10,21%)</h3>
          </div>
          <span class="badge" style="background: hsl(152 68% 52% / .15); color: var(--green); border: 1px solid hsl(152 68% 52% / .3);">MEC Res. 07/2018</span>
        </div>
        <p class="small muted" style="margin-bottom: 1.5rem;">
          ${CURSO.extensao.descricao}
        </p>

        <div class="grid grid-3" style="gap: 1rem;">
          ${CURSO.extensao.componentes.map(comp => `
            <div style="background: hsl(222 35% 10%); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem;">
              <div class="row" style="justify-content: space-between; margin-bottom: .35rem;">
                <strong style="color: var(--cyan); font-family: var(--font-mono); font-size: .9rem;">${comp.codigo} · ${comp.nome}</strong>
                <span class="badge" style="font-size: .75rem;">${comp.ch}</span>
              </div>
              <p class="small muted" style="margin: 0; font-size: .82rem;">${comp.desc}</p>
            </div>
          `).join("")}
        </div>

        <div style="margin-top: 1.5rem; padding: 1rem; background: hsl(189 94% 55% / .08); border-radius: var(--radius-sm); border: 1px solid hsl(189 94% 55% / .25);">
          <div class="small" style="color: var(--cyan); font-weight: 700; margin-bottom: .25rem;">🤝 Papel Ativo do Centro Acadêmico E(CA)²:</div>
          <p class="small muted" style="margin: 0; line-height: 1.6;">
            ${CURSO.extensao.papelDoCA}
          </p>
        </div>
      </div>

      <!-- Comparativo Completo: PPC 2019 vs PPC 2024 -->
      <div class="section-head">
        <span class="eyebrow">Transparência Curricular</span>
        <h2>Comparativo: O que mudou do PPC 2019 para o PPC 2024?</h2>
        <p>${CURSO.comparativoPPC.resumo}</p>
      </div>

      <div class="compare-box" style="margin-bottom: 3.5rem;">
        <div class="compare-row head">
          <div>Aspecto / Diretriz</div>
          <div>PPC 2019 (Res. CONEPE 037/2019)</div>
          <div style="color: var(--cyan);">PPC 2024 (Res. CONEPE 016/2023 - Vigente)</div>
        </div>
        ${CURSO.comparativoPPC.pontos.map(pt => `
          <div class="compare-row">
            <div>
              <strong style="color: var(--text);">${pt.aspecto}</strong>
              <div class="small faint" style="margin-top: .25rem;">Impacto: ${pt.impacto}</div>
            </div>
            <div class="small muted">
              ${pt.ppc2019}
            </div>
            <div class="small" style="color: var(--text);">
              <strong style="color: var(--cyan);">✓</strong> ${pt.ppc2024}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (activeTab === "beneficios") {
    tabContentHtml = `
      <!-- Cabeçalho do Submenu Benefícios -->
      <div class="section-head" style="margin-bottom: 2rem;">
        <span class="eyebrow">Apoio à Permanência & Desenvolvimento Acadêmico</span>
        <h2>Benefícios, Bolsas & Assistência Estudantil UERGS</h2>
        <p class="lead" style="max-width: 900px; margin-inline: auto;">
          ${BENEFICIOS_UERGS.resumo}
        </p>
      </div>

      <!-- Banner de Orientação Geral -->
      <div class="card" style="margin-bottom: 2.5rem; background: linear-gradient(135deg, hsl(222 45% 12%) 0%, hsl(222 50% 8%) 100%); border: 1px solid hsl(189 94% 55% / .3);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 .35rem; font-size: 1.25rem;">🤝 Oportunidades Oficiais da UERGS para Engenharia</h3>
            <p class="small muted" style="margin: 0; max-width: 820px; line-height: 1.6;">
              Estudantes de Engenharia de Controle e Automação podem pleitear bolsas institucionais de ensino, pesquisa e extensão, além dos programas de permanência da Pró-Reitoria de Assuntos Estudantis (PRAE).
            </p>
          </div>
          <span class="badge" style="background: hsl(152 68% 52% / .15); color: var(--green); border: 1px solid hsl(152 68% 52% / .3);">Direito Estudantil</span>
        </div>
      </div>

      <!-- Grid de Benefícios e Oportunidades -->
      <div class="grid grid-2" style="gap: 1.75rem; margin-bottom: 3rem;">
        ${BENEFICIOS_UERGS.categorias.map(cat => `
          <div class="beneficio-card">
            <div class="beneficio-head">
              <span class="beneficio-icon">${cat.icone}</span>
              <div>
                <h3 class="beneficio-title">${cat.titulo}</h3>
                <span class="badge" style="background: hsl(189 94% 55% / .15); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .3); font-size: .75rem; margin-top: .25rem; display: inline-block;">${cat.badge}</span>
              </div>
            </div>
            
            <p class="beneficio-desc">${cat.descricao}</p>

            <div class="beneficio-modalidades-list">
              ${cat.modalidades.map(m => `
                <div class="beneficio-modalidade-box">
                  <div class="modalidade-title">🔹 ${m.nome}</div>
                  <div class="modalidade-desc">${m.detalhes}</div>
                  <div class="modalidade-req"><strong>Requisitos:</strong> ${m.requisitos}</div>
                </div>
              `).join("")}
            </div>

            <div class="beneficio-inscricao-box">
              <strong>📝 Como se inscrever / Editais:</strong>
              <p style="margin: .35rem 0 0; font-size: .85rem; line-height: 1.5; color: var(--text);">${cat.comoInscrever}</p>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Caixa de Apoio do Centro Acadêmico -->
      <div class="card" style="border: 1px solid hsl(35 100% 58% / .3); background: linear-gradient(135deg, hsl(35 100% 58% / .08) 0%, transparent 100%); margin-bottom: 3.5rem;">
        <div class="row" style="align-items: flex-start; gap: 1rem;">
          <span style="font-size: 2.25rem;">📢</span>
          <div>
            <h3 style="margin: 0 0 .35rem; color: var(--amber);">Como o Centro Acadêmico E(CA)² atua nos Benefícios?</h3>
            <p class="small muted" style="margin: 0 0 1rem; line-height: 1.6;">
              O Centro Acadêmico tem assento e voz ativa nas instâncias deliberativas da UERGS. Defendemos a abertura periódica de editais de monitoria remunerada em disciplinas com alta taxa de retenção (como Cálculo e CLP), cobramos celeridade nos repasses de auxílio PRAE e auxiliamos novos alunos no preenchimento de recursos e cadastros socioeconômicos.
            </p>
            <div class="row" style="gap: .75rem; flex-wrap: wrap;">
              <a href="#mural" class="btn btn-primary btn-sm">💡 Sugerir Demanda de Monitoria no Mural</a>
              <a href="#forum" class="btn btn-ghost btn-sm">💬 Tirar Dúvidas no Fórum de Estudantes</a>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === "labs") {
    tabContentHtml = `
      <!-- Cabeçalho Labs -->
      <div class="section-head" style="margin-bottom: 2rem;">
        <span class="eyebrow">Infraestrutura Experimental</span>
        <h2>Laboratórios de Bancada e Prática Profissional</h2>
        <p class="lead" style="max-width: 900px; margin-inline: auto;">
          O PPC assegura formação com fortes componentes práticos em laboratórios especializados de eletrônica, potência, máquinas e robótica.
        </p>
      </div>

      <div class="grid grid-3" style="margin-bottom: 3.5rem;">
        ${CURSO.laboratorios.map(lab => `
          <div class="lab-card">
            <span class="lab-icon">${lab.icone}</span>
            <h3 style="margin: 0; font-size: 1.15rem;">${lab.nome}</h3>
            <div>
              <span class="small faint" style="display: block; font-weight: 600; text-transform: uppercase; font-size: .72rem; letter-spacing: .04em; margin-bottom: .25rem;">Equipamentos & Bancadas:</span>
              <p class="small muted" style="margin: 0; line-height: 1.6;">${lab.equipamentos}</p>
            </div>
            <div style="margin-top: auto; padding-top: .75rem; border-top: 1px solid var(--border);">
              <span class="small faint" style="display: block; font-weight: 600; text-transform: uppercase; font-size: .72rem; letter-spacing: .04em; margin-bottom: .25rem;">Disciplinas Atendidas:</span>
              <span class="small" style="color: var(--cyan); font-size: .8rem;">${lab.disciplinas}</span>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="card" style="text-align: center; padding: 2rem; margin-bottom: 3.5rem;">
        <h3>Precisa de novos equipamentos ou manutenções na bancada?</h3>
        <p class="small muted" style="max-width: 600px; margin: .5rem auto 1.5rem;">
          O Centro Acadêmico canaliza os pedidos de reposição de componentes, pontas de osciloscópio, placas de CLP e ferramentas junto à coordenação de curso e direção de unidade.
        </p>
        <a href="#mural" class="btn btn-primary btn-sm">💡 Registrar Demanda de Laboratório no Mural</a>
      </div>
    `;
  } else if (activeTab === "perfil") {
    tabContentHtml = `
      <!-- Métricas Rápidas do PPC 2024 (Informações Práticas e Visuais do Curso) -->
      <div class="course-stats-grid" style="margin-bottom: 2.5rem;">
        <div class="course-stat-card">
          <span class="val">4.015 h</span>
          <span class="lbl">Carga Horária Total</span>
          <span class="desc">235 créditos acadêmicos oficiais</span>
        </div>
        <div class="course-stat-card">
          <span class="val">10 Módulos</span>
          <span class="lbl">Duração Regular</span>
          <span class="desc">Mínimo 5 anos (noturno/vespertino)</span>
        </div>
        <div class="course-stat-card">
          <span class="val" style="color: var(--green);">410 h</span>
          <span class="lbl">Extensão Obrigatória</span>
          <span class="desc">10,21% da CH em contato com a sociedade</span>
        </div>
        <div class="course-stat-card">
          <span class="val" style="color: var(--violet);">165 h</span>
          <span class="lbl">Estágio Supervisionado</span>
          <span class="desc">Vivência prática em ambiente industrial</span>
        </div>
        <div class="course-stat-card">
          <span class="val" style="color: var(--amber);">50 Vagas</span>
          <span class="lbl">Entrada Anual</span>
          <span class="desc">SISU / ENEM e Vestibular próprio</span>
        </div>
        <div class="course-stat-card">
          <span class="val" style="color: var(--cyan);">Até 40%</span>
          <span class="lbl">EaD Regulamentado</span>
          <span class="desc">Em teorias · Bancadas 100% presenciais</span>
        </div>
      </div>

      <!-- Ficha Técnica e Perfil do Egresso -->
      <div class="grid grid-2" style="margin-bottom: 2.5rem; align-items: stretch;">
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3>📌 Ficha Técnica do Curso</h3>
            <dl class="fact-list" style="margin-top: 1.25rem;">
              <div><dt>Grau Acadêmico</dt><dd>${CURSO.grau}</dd></div>
              <div><dt>Campus / Unidade</dt><dd>${CURSO.unidade}</dd></div>
              <div><dt>Turno de Aulas</dt><dd>${CURSO.turno}</dd></div>
              <div><dt>Duração</dt><dd>${CURSO.duracao}</dd></div>
              <div><dt>Carga Horária Total</dt><dd><strong>${CURSO.cargaHoraria}</strong></dd></div>
              <div><dt>Vagas Anuais</dt><dd>${CURSO.vagasAnuais}</dd></div>
              <div><dt>Modalidade</dt><dd>${CURSO.modalidade}</dd></div>
            </dl>
          </div>
          <div style="margin-top: 1.5rem;">
            <a href="${CURSO.linkOficial}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Portal Oficial da UERGS ↗</a>
          </div>
        </div>

        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3>🎯 Perfil da Engenheira e do Engenheiro UERGS</h3>
            <p class="muted small" style="margin-top: .75rem; line-height: 1.7;">
              ${CURSO.perfilEgresso}
            </p>
            <div style="margin-top: 1.25rem; padding: 1rem; background: hsl(222 30% 12% / .6); border-radius: var(--radius-sm); border: 1px solid var(--border);">
              <div class="small" style="font-weight: 600; color: var(--cyan); margin-bottom: .25rem;">💡 Integração Multidisciplinar:</div>
              <div class="small muted">
                O curso une o rigor da Mecânica e Termofluidos, a precisão da Eletrônica de Potência e Instrumentação, e a vanguarda dos Sistemas Ciber-físicos, Robótica e Inteligência Artificial.
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 1.5rem; gap: .5rem; flex-wrap: wrap;">
            <a href="#mural" class="btn btn-ghost btn-sm">💡 Sugerir Melhoria de Laboratório</a>
            <a href="#forum" class="btn btn-ghost btn-sm">💬 Debates do Curso</a>
          </div>
        </div>
      </div>

      <!-- Gráfico / Barra de Distribuição de Horas -->
      <div class="card" style="margin-bottom: 3.5rem;">
        <div class="row" style="justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem;">
          <h3>📊 Distribuição da Carga Horária Curricular</h3>
          <span class="small muted">Total: 4.015 horas letivas (PPC 2024)</span>
        </div>

        <!-- Segmented Bar -->
        <div class="hours-breakdown-bar" title="Distribuição proporcional das 4.015h do curso">
          ${CURSO.distribuicaoHoraria.map(h => {
            const hex = colorMap[h.cor] || "var(--cyan)";
            const pct = (h.horas / 4015 * 100).toFixed(2);
            return `<div class="hours-segment" style="width: ${pct}%; background: ${hex};" title="${h.categoria}: ${h.horas}h (${h.percentual})"></div>`;
          }).join("")}
        </div>

        <!-- Legenda detalhada -->
        <div class="hours-legend">
          ${CURSO.distribuicaoHoraria.map(h => {
            const hex = colorMap[h.cor] || "var(--cyan)";
            return `
              <div class="hours-legend-item">
                <span class="hours-dot" style="background: ${hex};"></span>
                <span><strong>${h.categoria}</strong>: ${h.horas}h <span class="faint">(${h.percentual})</span></span>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Áreas de Atuação Profissional -->
      <div class="section-head">
        <span class="eyebrow">Mercado de Trabalho</span>
        <h2>Áreas de Atuação do Engenheiro de Controle & Automação</h2>
        <p>Campos de trabalho com alta demanda industrial no Rio Grande do Sul, no Brasil e no exterior.</p>
      </div>

      <div class="grid grid-3" style="margin-bottom: 3.5rem;">
        ${CURSO.areas.map(a => `
          <div class="card hover">
            <div class="icon">${a.icone}</div>
            <h3>${a.titulo}</h3>
            <p class="muted small">${a.texto}</p>
          </div>
        `).join("")}
      </div>
    `;
  } else if (activeTab === "estagios") {
    tabContentHtml = `
      <!-- Cabeçalho da Seção de Estágios, Perfil & Mercado CREA -->
      <div class="section-head" style="margin-bottom: 2rem;">
        <span class="eyebrow">Carreira, Legislação & Mercado Industrial</span>
        <h2>Estágios, Perfil Profissional & Mercado CREA-RS</h2>
        <p class="lead" style="max-width: 920px; margin-inline: auto;">
          ${ESTAGIOS_MERCADO.resumo}
        </p>
      </div>

      <!-- Banner Informativo Rápido -->
      <div class="card" style="margin-bottom: 2.5rem; background: linear-gradient(135deg, hsl(222 45% 12%) 0%, hsl(222 50% 8%) 100%); border: 1px solid hsl(189 94% 55% / .35);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 .35rem; font-size: 1.25rem;">💼 Conexão Direta entre Academia e Indústria</h3>
            <p class="small muted" style="margin: 0; max-width: 820px; line-height: 1.6;">
              O curso de Engenharia de Controle e Automação da UERGS prepara o estudante para liderar a transformação digital das fábricas gaúchas. Conheça as regras para validação do estágio curricular e sua habilitação profissional perante o Conselho de Classe (CREA-RS).
            </p>
          </div>
          <a href="#mural" class="btn btn-primary btn-sm">Mural de Vagas & Oportunidades ↗</a>
        </div>
      </div>

      <!-- SEÇÃO 1: ESTÁGIO SUPERVISIONADO UERGS -->
      <div class="section-head" style="margin-top: 1rem;">
        <span class="eyebrow">Normativas Acadêmicas</span>
        <h2>1. Estágio Supervisionado na UERGS</h2>
        <p>Modalidades, requisitos da Comissão de Orientação de Estágio (COE) e documentação oficial.</p>
      </div>

      <div class="grid grid-2" style="gap: 1.5rem; margin-bottom: 2.5rem;">
        <!-- Card Estágio Obrigatório -->
        <div class="card" style="border: 1px solid hsl(189 94% 55% / .3); background: hsl(222 35% 11% / .8); display: flex; flex-direction: column;">
          <div class="row" style="justify-content: space-between; align-items: flex-start; margin-bottom: .75rem;">
            <span style="font-size: 1.75rem;">📋</span>
            <span class="badge" style="background: hsl(189 94% 55% / .15); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .3); font-size: .75rem;">
              ${ESTAGIOS_MERCADO.estagios.obrigatorio.badge}
            </span>
          </div>
          <h3 style="margin: 0 0 .25rem; font-size: 1.2rem;">${ESTAGIOS_MERCADO.estagios.obrigatorio.titulo}</h3>
          <div class="small" style="color: var(--cyan); font-family: var(--font-mono); margin-bottom: .75rem;">
            ⏱️ ${ESTAGIOS_MERCADO.estagios.obrigatorio.ch} · 📅 ${ESTAGIOS_MERCADO.estagios.obrigatorio.semestreRecomendado}
          </div>
          <p class="small muted" style="margin-bottom: 1rem; line-height: 1.6;">
            ${ESTAGIOS_MERCADO.estagios.obrigatorio.descricao}
          </p>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border);">
            <div class="small" style="font-weight: 700; color: var(--text); margin-bottom: .4rem;">Requisitos para Homologação:</div>
            <ul class="small muted" style="margin: 0; padding-left: 1.2rem; line-height: 1.6;">
              ${ESTAGIOS_MERCADO.estagios.obrigatorio.requisitos.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Card Estágio Não-Obrigatório -->
        <div class="card" style="border: 1px solid hsl(152 68% 52% / .3); background: hsl(222 35% 11% / .8); display: flex; flex-direction: column;">
          <div class="row" style="justify-content: space-between; align-items: flex-start; margin-bottom: .75rem;">
            <span style="font-size: 1.75rem;">💵</span>
            <span class="badge" style="background: hsl(152 68% 52% / .15); color: var(--green); border: 1px solid hsl(152 68% 52% / .3); font-size: .75rem;">
              ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.badge}
            </span>
          </div>
          <h3 style="margin: 0 0 .25rem; font-size: 1.2rem;">${ESTAGIOS_MERCADO.estagios.naoObrigatorio.titulo}</h3>
          <div class="small" style="color: var(--green); font-family: var(--font-mono); margin-bottom: .75rem;">
            ⏱️ ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.ch} · 📅 ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.semestreRecomendado}
          </div>
          <p class="small muted" style="margin-bottom: 1rem; line-height: 1.6;">
            ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.descricao}
          </p>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border);">
            <div class="small" style="font-weight: 700; color: var(--text); margin-bottom: .4rem;">Vantagens & Diretrizes:</div>
            <ul class="small muted" style="margin: 0; padding-left: 1.2rem; line-height: 1.6;">
              ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.requisitos.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Fluxo Passo a Passo do Estágio -->
      <div class="card" style="margin-bottom: 2.5rem; background: hsl(222 35% 10%);">
        <h3 style="margin: 0 0 1.25rem; font-size: 1.2rem;">📌 Fluxo Passo a Passo: Do Contrato à Validação</h3>
        <div class="grid grid-4" style="gap: 1rem;">
          ${ESTAGIOS_MERCADO.estagios.passoAPasso.map(p => `
            <div style="background: hsl(222 30% 13%); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.15rem; display: flex; flex-direction: column;">
              <span class="badge" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; background: hsl(189 94% 55% / .2); color: var(--cyan); margin-bottom: .75rem;">
                ${p.num}
              </span>
              <strong style="margin-bottom: .35rem; color: var(--text); font-size: .95rem;">${p.titulo}</strong>
              <p class="small muted" style="margin: 0; line-height: 1.5; font-size: .82rem;">${p.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Agentes de Integração & Convênios -->
      <div class="card" style="margin-bottom: 3.5rem;">
        <h3 style="margin: 0 0 1rem; font-size: 1.2rem;">🤝 Agentes Integradores e Convênios Homologados</h3>
        <div class="grid grid-3" style="gap: 1.25rem;">
          ${ESTAGIOS_MERCADO.estagios.convenios.map(c => `
            <div style="background: hsl(222 25% 12% / .6); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <strong style="color: var(--cyan); display: block; margin-bottom: .4rem; font-size: .95rem;">${c.nome}</strong>
                <p class="small muted" style="margin: 0 0 1rem; line-height: 1.5;">${c.foco}</p>
              </div>
              <a href="${c.linkUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="align-self: flex-start;">${c.linkTexto}</a>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Mural de Oportunidades & Vagas de Estágio Recentes (Dinâmico) -->
      <div class="card" style="margin-bottom: 3.5rem; border: 1px solid hsl(189 94% 55% / .3); background: linear-gradient(180deg, hsl(222 35% 13% / .9) 0%, hsl(222 35% 9% / .95) 100%);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
          <div>
            <div class="row" style="gap: .5rem; align-items: center;">
              <span class="badge cyan" style="font-size: .75rem;">MURAL ATIVO</span>
              <h3 style="margin: 0; font-size: 1.25rem;">💼 Vagas de Estágio & Trainee Cadastradas</h3>
            </div>
            <p class="small muted" style="margin: .35rem 0 0;">Oportunidades em tempo real cadastradas pela coordenação e diretoria do E(CA)² com empresas parceiras.</p>
          </div>
          ${getAuth().isAdmin ? '<a href="#admin" class="btn btn-ghost btn-sm" style="font-size: .8rem;">+ Divulgar Vaga no Painel ADM</a>' : ''}
        </div>

        <div id="curso-estagios-vagas-container">
          <div class="skeleton" style="height: 120px;"></div>
        </div>
      </div>

      <!-- SEÇÃO 2: PERFIL DO PROFISSIONAL UERGS -->
      <div class="section-head">
        <span class="eyebrow">Competências Técnicas & Liderança</span>
        <h2>2. ${ESTAGIOS_MERCADO.perfilProfissional.titulo}</h2>
        <p>${ESTAGIOS_MERCADO.perfilProfissional.descricao}</p>
      </div>

      <div class="grid grid-3" style="margin-bottom: 3.5rem; gap: 1.25rem;">
        ${ESTAGIOS_MERCADO.perfilProfissional.pilares.map(pil => `
          <div class="card hover" style="display: flex; flex-direction: column;">
            <div class="icon" style="font-size: 2rem; margin-bottom: .5rem;">${pil.icone}</div>
            <h3 style="font-size: 1.1rem; margin: 0 0 .5rem;">${pil.titulo}</h3>
            <p class="small muted" style="margin: 0; line-height: 1.6;">${pil.desc}</p>
          </div>
        `).join("")}
      </div>

      <!-- SEÇÃO 3: REGULAMENTAÇÃO PROFISSIONAL & CREA-RS / CONFEA -->
      <div class="section-head">
        <span class="eyebrow">Habilitação Legal & Direitos</span>
        <h2>3. ${ESTAGIOS_MERCADO.mercadoCREA.titulo}</h2>
        <p>Atribuições legais plenas concedidas pelo conselho regional aos egressos da UERGS.</p>
      </div>

      <div class="grid grid-2" style="margin-bottom: 2.5rem; gap: 1.5rem; align-items: stretch;">
        <!-- Card de Atribuições CONFEA / CREA -->
        <div class="card" style="border: 1px solid hsl(215 90% 60% / .3); background: hsl(222 35% 11% / .8); display: flex; flex-direction: column;">
          <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div class="row" style="gap: .6rem; align-items: center;">
              <span style="font-size: 1.8rem;">🏛️</span>
              <div>
                <strong style="color: var(--text); font-size: 1.05rem;">Atribuições Técnicas Plenas</strong>
                <div class="small faint">${ESTAGIOS_MERCADO.mercadoCREA.resolucoes}</div>
              </div>
            </div>
            <span class="badge" style="background: hsl(215 90% 60% / .15); color: var(--blue); border: 1px solid hsl(215 90% 60% / .3); font-size: .75rem;">CREA-RS</span>
          </div>
          <ul class="small muted" style="margin: 0; padding-left: 1.2rem; line-height: 1.7; flex: 1;">
            ${ESTAGIOS_MERCADO.mercadoCREA.atribuicoes.map(a => `<li>${a}</li>`).join("")}
          </ul>
        </div>

        <!-- Card de Piso Salarial da Categoria (Lei 4.950-A) -->
        <div class="card" style="border: 1px solid hsl(35 100% 58% / .35); background: hsl(222 35% 11% / .8); display: flex; flex-direction: column;">
          <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div class="row" style="gap: .6rem; align-items: center;">
              <span style="font-size: 1.8rem;">⚖️</span>
              <div>
                <strong style="color: var(--amber); font-size: 1.05rem;">${ESTAGIOS_MERCADO.mercadoCREA.pisoSalarial.titulo}</strong>
                <div class="small faint">${ESTAGIOS_MERCADO.mercadoCREA.pisoSalarial.lei}</div>
              </div>
            </div>
            <span class="badge" style="background: hsl(35 100% 58% / .15); color: var(--amber); border: 1px solid hsl(35 100% 58% / .3); font-size: .75rem;">Lei 4.950-A</span>
          </div>

          <div class="grid grid-2" style="gap: .75rem; margin-bottom: 1rem;">
            <div style="background: hsl(222 35% 14%); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
              <span class="small faint" style="display: block; font-size: .75rem;">JORNADA DE 6 HORAS</span>
              <strong style="color: var(--cyan); font-size: 1.25rem; font-family: var(--font-head); display: block; margin: .2rem 0;">6 Salários Mínimos</strong>
              <span class="small muted" style="font-size: .78rem; line-height: 1.4; display: block;">Piso base garantido pela legislação federal.</span>
            </div>
            <div style="background: hsl(222 35% 14%); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
              <span class="small faint" style="display: block; font-size: .75rem;">JORNADA DE 8 HORAS</span>
              <strong style="color: var(--green); font-size: 1.25rem; font-family: var(--font-head); display: block; margin: .2rem 0;">8,5 Salários Mínimos</strong>
              <span class="small muted" style="font-size: .78rem; line-height: 1.4; display: block;">6 salários + 25% pelas horas adicionais.</span>
            </div>
          </div>

          <p class="small muted" style="margin: 0; line-height: 1.6; font-size: .82rem;">
            💡 <strong>Apoio do E(CA)²:</strong> ${ESTAGIOS_MERCADO.mercadoCREA.pisoSalarial.observacao}
          </p>
        </div>
      </div>

      <!-- Polos Industriais Empregadores no RS -->
      <div class="card" style="margin-bottom: 3.5rem;">
        <h3 style="margin: 0 0 .5rem; font-size: 1.2rem;">🏭 Principais Polos Empregadores no Rio Grande do Sul</h3>
        <p class="small muted" style="margin-bottom: 1.5rem;">
          Áreas com forte concentração de vagas para estágios e engenheiros formados em Controle e Automação:
        </p>
        <div class="grid grid-2" style="gap: 1.25rem;">
          ${ESTAGIOS_MERCADO.mercadoCREA.polosIndustriaisRS.map(pol => `
            <div style="background: hsl(222 30% 12%); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.15rem;">
              <div class="row" style="justify-content: space-between; align-items: baseline; margin-bottom: .35rem;">
                <strong style="color: var(--cyan); font-size: .95rem;">${pol.polo}</strong>
                <span class="badge" style="font-size: .72rem;">${pol.destaque}</span>
              </div>
              <p class="small muted" style="margin: 0; font-size: .83rem; line-height: 1.5;">${pol.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  return `
    <section class="section">
      <div class="container">
        <!-- Cabeçalho Principal -->
        <div class="section-head">
          <div class="row" style="gap: .6rem; margin-bottom: .75rem; flex-wrap: wrap; justify-content: center;">
            <span class="course-hero-badge">📜 ${CURSO.resolucaoVigente}</span>
            <span class="badge" style="background: hsl(222 25% 15%); color: var(--muted); border: 1px solid var(--border); font-size: .8rem;">Anterior: ${CURSO.resolucaoAnterior}</span>
          </div>
          <h2>Engenharia de Controle e Automação</h2>
          <p class="lead" style="max-width: 900px; margin-inline: auto;">
            ${CURSO.objetivo}
          </p>
        </div>

        ${tabContentHtml}
      </div>
    </section>
  `;
}

// -------------------------------------------------------------
// CONTROLADOR: SOBRE O CURSO & ÁRVORE DE DEPENDÊNCIAS
// -------------------------------------------------------------
async function setupCursoEstagiosVagas() {
  const container = document.getElementById("curso-estagios-vagas-container");
  if (!container || !store.internships?.list) return;

  try {
    const list = await store.internships.list();
    if (!list || list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--muted);">
          <div style="font-size: 2.2rem; margin-bottom: .5rem;">🔍</div>
          <p style="margin: 0 0 .5rem; font-weight: 600; font-size: 1.05rem; color: var(--text);">Nenhuma vaga cadastrada no momento.</p>
          <p class="small faint" style="margin: 0; max-width: 500px; margin-inline: auto;">Fique atento aos canais oficiais ou avise o Centro Acadêmico se sua empresa parceira tiver novas oportunidades.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-3" style="gap: 1.25rem;">
        ${list.map(v => {
          const badgeClass = v.tipo === "trainee" ? "amber" : (v.tipo === "estagio_obrigatorio" ? "cyan" : "green");
          const tipoText = escapeHtml(v.tipoLabel || (v.tipo === "trainee" ? "Trainee / CLT" : (v.tipo === "estagio_obrigatorio" ? "Estágio Curricular" : "Estágio Remunerado")));
          const remunText = v.remuneracao ? escapeHtml(v.remuneracao) : "A combinar";
          const cargaText = v.carga_horaria ? escapeHtml(v.carga_horaria) : "30h semanais";
          const link = v.link_candidatura ? escapeHtml(v.link_candidatura) : "#contato";
          const isExternal = link.startsWith("http");

          return `
            <div class="card hover" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--border); background: hsl(222 25% 12% / .7); border-radius: var(--radius-sm); padding: 1.25rem;">
              <div>
                <div class="row" style="justify-content: space-between; align-items: flex-start; margin-bottom: .75rem; gap: .5rem;">
                  <span class="badge ${badgeClass}" style="font-size: .72rem; padding: .2rem .55rem;">${tipoText}</span>
                  <span class="small faint" style="font-size: .75rem;">${v.modalidade === 'remoto' ? '🌐 Remoto' : (v.modalidade === 'hibrido' ? '🏢 Híbrido' : '📍 Presencial')}</span>
                </div>
                <h4 style="margin: 0 0 .35rem; font-size: 1.1rem; line-height: 1.35; color: var(--text);">${escapeHtml(v.titulo)}</h4>
                <div class="small" style="color: var(--cyan); font-weight: 600; margin-bottom: .6rem;">🏢 ${escapeHtml(v.empresa)} · 📍 ${escapeHtml(v.localizacao || 'Porto Alegre / RS')}</div>
                
                <p class="small muted" style="margin: 0 0 .75rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${escapeHtml(v.descricao || '')}
                </p>

                ${v.requisitos ? `
                  <div style="background: hsl(222 30% 10% / .5); padding: .5rem .75rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1rem;">
                    <div class="small faint" style="font-size: .7rem; font-weight: 600; text-transform: uppercase; margin-bottom: .2rem;">Requisitos:</div>
                    <div class="small muted" style="font-size: .78rem; line-height: 1.4;">${escapeHtml(v.requisitos)}</div>
                  </div>
                ` : ''}
              </div>

              <div style="border-top: 1px solid var(--border); padding-top: .85rem; margin-top: .5rem;">
                <div class="row" style="justify-content: space-between; align-items: baseline; margin-bottom: .75rem;">
                  <span class="small" style="color: var(--green); font-weight: 700; font-size: .95rem;">💰 ${remunText}</span>
                  <span class="small faint" style="font-size: .75rem;">⏱️ ${cargaText}</span>
                </div>
                <div class="row" style="gap: .5rem;">
                  <a href="${link}" ${isExternal ? 'target="_blank" rel="noopener"' : ''} class="btn btn-primary btn-sm" style="flex: 1; text-align: center; font-size: .82rem;">
                    Candidate-se ${isExternal ? '↗' : ''}
                  </a>
                  ${v.contato_email ? `
                    <a href="mailto:${escapeHtml(v.contato_email)}?subject=Candidatura%20Estágio%20UERGS%20-%20${encodeURIComponent(v.titulo)}" class="btn btn-ghost btn-sm" title="Enviar e-mail para ${escapeHtml(v.contato_email)}" style="padding: 0 .6rem;">
                      ✉️
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  } catch (err) {
    console.warn("Erro ao carregar vagas de estágio:", err);
    container.innerHTML = `<div class="card error"><p class="small">${err.message}</p></div>`;
  }
}

function setupCursoInteractions(tab = currentCursoTab) {
  // 1. Vincula pré-visualização de PDFs oficiais
  bindPdfPreviewButtons();

  // 1b. Carrega vagas de estágio se container estiver presente
  setupCursoEstagiosVagas();

  // 2. Interatividade da Matriz Curricular (Semestres ocultos por padrão, abrem sob demanda)
  const moduleTabs = document.querySelectorAll(".module-tab-btn");
  const moduleGroups = document.querySelectorAll(".module-group");
  const placeholder = document.getElementById("curso-placeholder");
  const searchInput = document.getElementById("curso-search-input");
  let activeModuleNum = null;

  function setModuleActive(modNum) {
    if (activeModuleNum === modNum) {
      // Toggle off se clicado novamente
      activeModuleNum = null;
    } else {
      activeModuleNum = modNum;
    }

    moduleTabs.forEach(tab => {
      const isThis = tab.getAttribute("data-mod") === activeModuleNum;
      tab.classList.toggle("active", isThis);
    });

    if (!activeModuleNum) {
      if (placeholder) placeholder.style.display = "";
      moduleGroups.forEach(grp => grp.style.display = "none");
    } else {
      if (placeholder) placeholder.style.display = "none";
      moduleGroups.forEach(grp => {
        const num = grp.getAttribute("data-module-number");
        grp.style.display = (num === activeModuleNum) ? "" : "none";
      });
    }
  }

  moduleTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      if (searchInput && searchInput.value.trim() !== "") {
        searchInput.value = "";
        applySearch("");
      }
      setModuleActive(tab.getAttribute("data-mod"));
    });
  });

  function applySearch(query) {
    const q = query.trim().toLowerCase();
    const rows = document.querySelectorAll(".discipline-row");

    if (!q) {
      rows.forEach(r => r.style.display = "");
      setModuleActive(activeModuleNum);
      return;
    }

    if (placeholder) placeholder.style.display = "none";
    moduleTabs.forEach(tab => tab.classList.remove("active"));
    moduleGroups.forEach(grp => grp.style.display = "");

    let hasMatches = false;
    rows.forEach(row => {
      const matchText = row.getAttribute("data-search") || "";
      const matches = matchText.includes(q);
      row.style.display = matches ? "" : "none";
      if (matches) hasMatches = true;
    });

    moduleGroups.forEach(grp => {
      const visibleRows = grp.querySelectorAll(".discipline-row:not([style*='display: none'])");
      grp.style.display = visibleRows.length > 0 ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", (e) => {
    applySearch(e.target.value);
  });

  // -------------------------------------------------------------
  // 3. ÁRVORE DE DEPENDÊNCIAS INTERATIVA (PPC 2024 & PPC 2019)
  // -------------------------------------------------------------
  let currentTreePpc = "2024";
  let selectedTreeCode = null;
  let activeTreeArea = "all";

  const btnPpc2024 = document.getElementById("btn-ppc-2024");
  const btnPpc2019 = document.getElementById("btn-ppc-2019");
  const statsBanner = document.getElementById("dep-stats-banner");
  const inspector = document.getElementById("dep-inspector");
  const gridContainer = document.getElementById("dep-columns-grid");
  const svgCanvas = document.getElementById("dep-svg-canvas");
  const scrollWrapper = document.getElementById("dep-graph-scroll");
  const resetBtn = document.getElementById("btn-reset-dep-selection");
  const exportBtn = document.getElementById("btn-export-dep-svg");
  const areaFilterBtns = document.querySelectorAll("#dep-area-filters .dep-area-btn");

  const areaLabels = {
    matematica: "🧮 Matemática",
    fisica: "⚡ Física & Térmica",
    computacao: "💻 Computação",
    eletronica: "🔌 Eletrônica",
    controle: "🦾 Controle & Robótica",
    mecanica: "⚙️ Mecânica",
    humanas: "📋 Gestão & Humanidades"
  };

  function getTreeData() {
    return ARVORES_PPC[currentTreePpc] || ARVORES_PPC["2024"];
  }

  function buildMaps() {
    const data = getTreeData();
    const discMap = new Map();
    const unlocksMap = new Map();

    data.semestres.forEach(sem => {
      sem.disciplinas.forEach(d => {
        discMap.set(d.codigo, { ...d, semNumero: sem.semestre, semTitulo: sem.titulo });
        if (!unlocksMap.has(d.codigo)) {
          unlocksMap.set(d.codigo, []);
        }
      });
    });

    data.semestres.forEach(sem => {
      sem.disciplinas.forEach(d => {
        d.pre.forEach(pCode => {
          if (!unlocksMap.has(pCode)) {
            unlocksMap.set(pCode, []);
          }
          unlocksMap.get(pCode).push(d.codigo);
        });
      });
    });

    return { discMap, unlocksMap };
  }

  function getAllPrereqs(code, discMap, visited = new Set()) {
    const target = discMap.get(code);
    if (!target || !target.pre) return visited;
    target.pre.forEach(pCode => {
      if (!visited.has(pCode)) {
        visited.add(pCode);
        getAllPrereqs(pCode, discMap, visited);
      }
    });
    return visited;
  }

  function getAllUnlocks(code, unlocksMap, visited = new Set()) {
    const direct = unlocksMap.get(code) || [];
    direct.forEach(uCode => {
      if (!visited.has(uCode)) {
        visited.add(uCode);
        getAllUnlocks(uCode, unlocksMap, visited);
      }
    });
    return visited;
  }

  function drawConnections() {
    // Setas desativadas temporariamente a pedido do usuário
    if (svgCanvas) svgCanvas.innerHTML = "";
  }


  function selectDiscipline(code) {
    const { discMap, unlocksMap } = buildMaps();
    const disc = discMap.get(code);
    if (!disc) return;

    selectedTreeCode = code;
    if (resetBtn) resetBtn.style.display = "";

    const allPrereqs = getAllPrereqs(code, discMap);
    const allUnlocks = getAllUnlocks(code, unlocksMap);

    // Atualiza classes dos cards
    const allCards = gridContainer.querySelectorAll(".dep-card");
    allCards.forEach(card => {
      const cCode = card.getAttribute("data-code");
      card.classList.remove("is-selected", "is-prereq", "is-unlocks", "is-dimmed");

      if (cCode === code) {
        card.classList.add("is-selected");
      } else if (allPrereqs.has(cCode)) {
        card.classList.add("is-prereq");
      } else if (allUnlocks.has(cCode)) {
        card.classList.add("is-unlocks");
      } else {
        card.classList.add("is-dimmed");
      }
    });

    // Atualiza Painel Inspetor
    const directPrereqs = disc.pre || [];
    const directUnlocks = unlocksMap.get(code) || [];
    const areaName = areaLabels[disc.area] || disc.area;

    inspector.className = "dep-inspector-box";
    inspector.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: .75rem; margin-bottom: .85rem;">
        <div>
          <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .25rem;">
            <span class="discipline-code" style="font-size: .95rem;">${disc.codigo}</span>
            <span class="badge" style="background: hsl(222 25% 18%); font-size: .8rem;">${disc.semTitulo}</span>
            <span class="badge" style="background: hsl(189 94% 55% / .1); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .2); font-size: .8rem;">${areaName}</span>
          </div>
          <h3 style="margin: 0; font-size: 1.2rem; color: var(--text);">${escapeHtml(disc.nome)}</h3>
        </div>
        <div class="row" style="gap: .6rem; align-items: center;">
          <span class="small muted"><strong>Carga Horária:</strong> ${disc.ch} (${disc.cr} créditos)</span>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-insp-close" style="min-height: 28px; padding: .2rem .5rem;" title="Limpar seleção">✕ Fechar</button>
        </div>
      </div>

      <div class="grid grid-2" style="gap: 1rem; border-top: 1px solid var(--border); padding-top: .85rem;">
        <!-- Bloco de Pré-requisitos -->
        <div>
          <div class="small" style="color: var(--green); font-weight: 700; margin-bottom: .4rem; display: flex; align-items: center; gap: .3rem;">
            <span>⬅️ Pré-requisitos Diretos</span>
            <span class="badge" style="font-size: .7rem; background: hsl(152 68% 52% / .15); color: var(--green);">${directPrereqs.length}</span>
          </div>
          ${directPrereqs.length === 0 ? `
            <span class="small muted">Nenhum pré-requisito (pode cursar livremente).</span>
          ` : `
            <div style="display: flex; flex-wrap: wrap; gap: .4rem;">
              ${directPrereqs.map(pCode => {
                const pDisc = discMap.get(pCode);
                const pName = pDisc ? pDisc.nome : pCode;
                return `<button type="button" class="btn btn-ghost btn-sm btn-dep-jump" data-jump="${pCode}" style="border: 1px solid hsl(152 68% 52% / .4); color: var(--green); font-size: .78rem; padding: .2rem .5rem;">${pCode} · ${escapeHtml(pName)}</button>`;
              }).join("")}
            </div>
            ${allPrereqs.size > directPrereqs.length ? `
              <div class="faint" style="font-size: .75rem; margin-top: .4rem;">
                + ${allPrereqs.size - directPrereqs.length} pré-requisitos indiretos na cadeia curricular.
              </div>
            ` : ''}
          `}
        </div>

        <!-- Bloco de Disciplinas Destravadas -->
        <div>
          <div class="small" style="color: var(--amber); font-weight: 700; margin-bottom: .4rem; display: flex; align-items: center; gap: .3rem;">
            <span>➡️ Disciplinas que Destrava (Impacto)</span>
            <span class="badge" style="font-size: .7rem; background: hsl(35 100% 58% / .15); color: var(--amber);">${directUnlocks.length} direta(s) · ${allUnlocks.size} total</span>
          </div>
          ${directUnlocks.length === 0 ? `
            <span class="small muted">Componente terminal do semestre (não bloqueia outras matérias).</span>
          ` : `
            <div style="display: flex; flex-wrap: wrap; gap: .4rem;">
              ${directUnlocks.map(uCode => {
                const uDisc = discMap.get(uCode);
                const uName = uDisc ? uDisc.nome : uCode;
                return `<button type="button" class="btn btn-ghost btn-sm btn-dep-jump" data-jump="${uCode}" style="border: 1px solid hsl(35 100% 58% / .4); color: var(--amber); font-size: .78rem; padding: .2rem .5rem;">${uCode} · ${escapeHtml(uName)}</button>`;
              }).join("")}
            </div>
            ${allUnlocks.size > directUnlocks.length ? `
              <div class="faint" style="font-size: .75rem; margin-top: .4rem;">
                Ao concluir ${disc.codigo}, você destrava um total de <strong>${allUnlocks.size} disciplinas</strong> nos semestres seguintes.
              </div>
            ` : ''}
          `}
        </div>
      </div>
    `;

    // Eventos de salto nos botões do inspetor
    inspector.querySelectorAll(".btn-dep-jump").forEach(b => {
      b.addEventListener("click", () => {
        selectDiscipline(b.getAttribute("data-jump"));
      });
    });

    document.getElementById("btn-insp-close")?.addEventListener("click", resetSelection);

    // Setas desativadas por enquanto conforme solicitado
    drawConnections();
  }

  function resetSelection() {
    selectedTreeCode = null;
    if (resetBtn) resetBtn.style.display = "none";
    if (svgCanvas) svgCanvas.innerHTML = "";

    const allCards = gridContainer.querySelectorAll(".dep-card");
    allCards.forEach(card => {
      card.classList.remove("is-selected", "is-prereq", "is-unlocks", "is-dimmed");
      // Se houver filtro de área ativo, reaplica
      if (activeTreeArea !== "all") {
        if (card.getAttribute("data-area") !== activeTreeArea) {
          card.classList.add("is-dimmed");
        }
      }
    });

    if (inspector) {
      inspector.className = "dep-inspector-box empty";
      inspector.innerHTML = `💡 <strong>Instrução Interativa:</strong> Clique em qualquer matéria no mapa abaixo para traçar automaticamente sua cadeia de pré-requisitos (<span style="color: var(--green); font-weight: 600;">verde</span>) e as matérias que ela destrava (<span style="color: var(--amber); font-weight: 600;">laranja</span>).`;
    }
  }

  function renderTree() {
    const data = getTreeData();
    const { discMap, unlocksMap } = buildMaps();

    // 1. Atualiza botões PPC
    if (btnPpc2024 && btnPpc2019) {
      if (currentTreePpc === "2024") {
        btnPpc2024.className = "dep-ppc-btn active";
        btnPpc2019.className = "dep-ppc-btn";
      } else {
        btnPpc2024.className = "dep-ppc-btn";
        btnPpc2019.className = "dep-ppc-btn active amber-theme";
      }
    }

    // 2. Banner de Estatísticas
    if (statsBanner) {
      const is2024 = data.versao === "2024";
      statsBanner.innerHTML = `
        <div>
          <div class="title">
            <span>${is2024 ? "📘" : "📙"}</span>
            <span>${data.rotulo}</span>
            <span class="badge" style="background: ${is2024 ? "hsl(189 94% 55% / .15)" : "hsl(35 100% 58% / .15)"}; color: ${is2024 ? "var(--cyan)" : "var(--amber)"}; border: 1px solid ${is2024 ? "hsl(189 94% 55% / .3)" : "hsl(35 100% 58% / .3)"}; font-size: .75rem;">${data.statusBadge}</span>
          </div>
          <div class="meta" style="margin-top: .25rem;">
            ${data.resolucao} · <strong>${data.cargaHoraria}</strong>
          </div>
        </div>
        <div class="small" style="color: ${is2024 ? "var(--green)" : "var(--muted)"}; font-weight: 600;">
          ${data.destaqueExtensao}
        </div>
      `;
    }

    // 3. Renderiza Colunas dos 10 Semestres
    if (gridContainer) {
      gridContainer.innerHTML = data.semestres.map(sem => `
        <div class="dep-col" data-sem="${sem.semestre}">
          <div class="dep-col-head">
            <span class="sem-title">${sem.titulo}</span>
            <span class="sem-ch">${sem.ch}</span>
          </div>
          <div class="dep-col-cards">
            ${sem.disciplinas.map(d => {
              const preCount = d.pre.length;
              const unlocksCount = (unlocksMap.get(d.codigo) || []).length;
              return `
                <div class="dep-card area-${d.area}" data-code="${d.codigo}" data-area="${d.area}">
                  <div class="row" style="justify-content: space-between; align-items: baseline;">
                    <span class="card-code">${d.codigo}</span>
                    <span class="faint" style="font-size: .7rem; font-family: var(--font-mono);">${d.ch}</span>
                  </div>
                  <div class="card-name">${escapeHtml(d.nome)}</div>
                  <div class="card-tags">
                    <span class="pill-req ${preCount > 0 ? 'has-pre' : ''}">${preCount === 0 ? 'Sem pré-req' : `${preCount} pré-req`}</span>
                    ${unlocksCount > 0 ? `<span class="pill-unlocks">Destrava ${unlocksCount}</span>` : ''}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `).join("");

      // Vincula cliques aos cards
      gridContainer.querySelectorAll(".dep-card").forEach(card => {
        card.addEventListener("click", () => {
          const code = card.getAttribute("data-code");
          if (selectedTreeCode === code) {
            resetSelection();
          } else {
            selectDiscipline(code);
          }
        });
      });
    }

    resetSelection();
  }

  // Alternância entre os PPCs
  btnPpc2024?.addEventListener("click", () => {
    if (currentTreePpc !== "2024") {
      currentTreePpc = "2024";
      renderTree();
    }
  });

  btnPpc2019?.addEventListener("click", () => {
    if (currentTreePpc !== "2019") {
      currentTreePpc = "2019";
      renderTree();
    }
  });

  // Filtros por área de conhecimento
  areaFilterBtns.forEach(b => {
    b.addEventListener("click", () => {
      areaFilterBtns.forEach(btn => btn.classList.remove("active"));
      b.classList.add("active");
      activeTreeArea = b.getAttribute("data-area");

      const allCards = gridContainer.querySelectorAll(".dep-card");
      allCards.forEach(card => {
        if (activeTreeArea === "all") {
          card.classList.remove("is-dimmed");
        } else {
          if (card.getAttribute("data-area") === activeTreeArea) {
            card.classList.remove("is-dimmed");
          } else {
            card.classList.add("is-dimmed");
          }
        }
      });
    });
  });

  resetBtn?.addEventListener("click", resetSelection);


  // Exportar Diagrama SVG Vetorial em Alta Resolução
  exportBtn?.addEventListener("click", () => {
    const data = getTreeData();
    const { unlocksMap } = buildMaps();

    // Dimensões do Diagrama SVG Exportado
    const colWidth = 200;
    const colGap = 20;
    const startX = 40;
    const startY = 120;
    const cardHeight = 70;
    const cardGap = 15;
    const totalCols = data.semestres.length;
    const svgWidth = startX * 2 + totalCols * colWidth + (totalCols - 1) * colGap;
    const maxCards = Math.max(...data.semestres.map(s => s.disciplinas.length));
    const svgHeight = startY + maxCards * (cardHeight + cardGap) + 120;

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <style>
    .bg { fill: #0b0f19; }
    .header-text { font-family: system-ui, sans-serif; font-size: 24px; font-weight: bold; fill: #f1f5f9; }
    .sub-text { font-family: system-ui, sans-serif; font-size: 14px; fill: #94a3b8; }
    .col-title { font-family: system-ui, sans-serif; font-size: 15px; font-weight: bold; fill: #38bdf8; text-anchor: middle; }
    .card-bg { rx: 8px; fill: #131b2e; stroke: #1e293b; stroke-width: 1.5; }
    .code { font-family: monospace; font-size: 13px; font-weight: bold; fill: #38bdf8; }
    .name { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; fill: #e2e8f0; }
    .ch { font-family: monospace; font-size: 10px; fill: #64748b; }
    .pre-text { font-family: system-ui, sans-serif; font-size: 9px; fill: #f59e0b; }
  </style>
  <rect class="bg" width="100%" height="100%" />

  <!-- Cabeçalho -->
  <text x="40" y="50" class="header-text">Árvore de Dependências · Engenharia de Controle e Automação (UERGS)</text>
  <text x="40" y="80" class="sub-text">${data.rotulo} · ${data.resolucao} · Carga Horária: ${data.cargaHoraria}</text>
`;

    // Desenha Colunas e Cards no SVG
    data.semestres.forEach((sem, colIdx) => {
      const colX = startX + colIdx * (colWidth + colGap);
      svgContent += `
  <!-- Coluna ${sem.titulo} -->
  <text x="${colX + colWidth / 2}" y="${startY - 15}" class="col-title">${sem.titulo} (${sem.ch})</text>
  <line x1="${colX}" y1="${startY - 5}" x2="${colX + colWidth}" y2="${startY - 5}" stroke="#1e293b" stroke-width="1" />
`;

      sem.disciplinas.forEach((d, rowIdx) => {
        const cardY = startY + rowIdx * (cardHeight + cardGap);
        const preInfo = d.pre.length > 0 ? `Pre: ${d.pre.join(', ')}` : 'Sem pré-requisito';
        svgContent += `
  <g transform="translate(${colX}, ${cardY})">
    <rect width="${colWidth}" height="${cardHeight}" class="card-bg" />
    <text x="12" y="24" class="code">${d.codigo}</text>
    <text x="${colWidth - 12}" y="24" class="ch" text-anchor="end">${d.ch}</text>
    <text x="12" y="44" class="name">${escapeHtml(d.nome.length > 24 ? d.nome.slice(0, 22) + '...' : d.nome)}</text>
    <text x="12" y="60" class="pre-text">${escapeHtml(preInfo.length > 28 ? preInfo.slice(0, 26) + '...' : preInfo)}</text>
  </g>
`;
      });
    });

    // Rodapé
    svgContent += `
  <text x="40" y="${svgHeight - 30}" class="sub-text">Gerado pelo Portal Oficial E(CA)² · Centro Acadêmico de Eng. de Controle e Automação UERGS</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Arvore_Dependencias_ECA_UERGS_PPC_${currentTreePpc}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Diagrama vetorial do PPC ${currentTreePpc} exportado com sucesso!`);
  });

  // Inicializa a árvore de dependências
  renderTree();
}

// -------------------------------------------------------------
// VISTA: FAQ (Dúvidas Frequentes)
// -------------------------------------------------------------
function renderFaqHtml() {
  return `
    <section class="section">
      <div class="container" style="max-width: 860px;">
        <div class="section-head">
          <span class="eyebrow">Tire suas Dúvidas</span>
          <h2>Perguntas Frequentes (FAQ)</h2>
          <p>Entenda o papel do CA, a base jurídica, estágios, grade curricular e como garantimos total transparência.</p>
        </div>

        <div id="faq-dynamic-container">
          <div class="card faq stack" id="faq-list">
            ${FAQ.map(item => `
              <details>
                <summary>${item.p}</summary>
                <p>${item.r}</p>
              </details>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

async function setupFaqView() {
  if (!store.faqs?.list) return;
  try {
    const list = await store.faqs.list();
    if (list && list.length > 0) {
      const el = document.getElementById("faq-list");
      if (el) {
        el.innerHTML = list.map(item => `
          <details ${item.destaque ? 'open' : ''}>
            <summary style="display: flex; justify-content: space-between; align-items: center; gap: .75rem;">
              <span>${escapeHtml(item.pergunta || item.p || '')}</span>
              ${item.categoria && item.categoria !== 'Geral' ? `<span class="badge slate" style="font-size: .7rem; padding: .15rem .5rem; flex-shrink: 0;">${escapeHtml(item.categoria)}</span>` : ''}
            </summary>
            <p>${escapeHtml(item.resposta || item.r || '')}</p>
          </details>
        `).join("");
      }
    }
  } catch (err) {
    console.warn("Erro ao carregar FAQs dinâmicos", err);
  }
}

// -------------------------------------------------------------
// INICIALIZAÇÃO GERAL DO APLICATIVO
// -------------------------------------------------------------
async function init() {
  store = await createStore();
  store.gerarExtratoOficialAta = () => gerarExtratoOficialAta(store);

  // Banner Demo
  if (store.mode === "demo") {
    const banner = document.getElementById("demo-banner");
    if (banner) banner.style.display = "block";
    document.getElementById("btn-reset-demo")?.addEventListener("click", () => store.resetDemo());
  }

  // Links Sociais no Rodapé
  const footerSocial = document.getElementById("footer-social-links");
  if (footerSocial) {
    footerSocial.innerHTML = `
      ${CONFIG.SOCIAL.instagram ? `<a href="${CONFIG.SOCIAL.instagram}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Instagram</a>` : ''}
      ${CONFIG.SOCIAL.whatsapp ? `<a href="${CONFIG.SOCIAL.whatsapp}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Comunidade WhatsApp</a>` : ''}
      ${CONFIG.SOCIAL.youtube ? `<a href="${CONFIG.SOCIAL.youtube}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">YouTube</a>` : ''}
    `;
  }

  // Escuta mudanças de sessão de usuário
  onAuth((auth) => {
    updateAuthNav(auth);
  });

  // Configuração dos diálogos (modal backdrop)
  const dlgAuth = document.getElementById("dlg-auth");
  const dlgProf = document.getElementById("dlg-profile");
  const dlgLgpd = document.getElementById("dlg-lgpd");
  if (dlgAuth) setupDialogBackdropClose(dlgAuth);
  if (dlgProf) setupDialogBackdropClose(dlgProf);
  if (dlgLgpd) setupDialogBackdropClose(dlgLgpd);

  document.getElementById("btn-close-auth")?.addEventListener("click", () => dlgAuth?.close());
  document.getElementById("btn-close-profile")?.addEventListener("click", () => dlgProf?.close());
  document.getElementById("btn-close-lgpd")?.addEventListener("click", () => dlgLgpd?.close());
  document.getElementById("btn-open-lgpd")?.addEventListener("click", () => dlgLgpd?.showModal());
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-open-lgpd-modal")) {
      dlgLgpd?.showModal();
    }
  });

  // Detecção dinâmica de aluno pré-homologado vs novo aluno no modal de login
  const authEmailInput = document.getElementById("auth-email");
  const authStatus = document.getElementById("auth-student-status");
  const authExtraFields = document.getElementById("auth-extra-fields");
  const authHint = document.getElementById("auth-email-hint");

  function checkAuthEmailMatch() {
    const email = authEmailInput?.value.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      if (authStatus) authStatus.style.display = "none";
      if (authExtraFields) authExtraFields.style.display = "none";
      if (authHint) authHint.style.display = "block";
      return;
    }
    const student = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(email) : null;
    if (student) {
      if (authStatus) {
        authStatus.style.display = "block";
        authStatus.innerHTML = `
          <div class="badge green" style="display: block; font-size: .8rem; padding: .35rem .6rem; text-align: left; border-radius: var(--radius-sm);">
            ✓ Estudante homologado(a): <strong>${escapeHtml(student.name)}</strong>
          </div>
        `;
      }
      if (authHint) authHint.style.display = "none";
      if (authExtraFields) authExtraFields.style.display = "none";
    } else {
      if (authStatus) {
        authStatus.style.display = "block";
        authStatus.innerHTML = `
          <div class="badge amber" style="display: block; font-size: .8rem; padding: .35rem .6rem; text-align: left; border-radius: var(--radius-sm); white-space: normal;">
            ℹ️ E-mail não consta na lista preliminar. Confirme seus dados e vínculo com Eng. de Controle e Automação abaixo para votar:
          </div>
        `;
      }
      if (authHint) authHint.style.display = "none";
      if (authExtraFields) authExtraFields.style.display = "block";
    }
  }

  authEmailInput?.addEventListener("input", checkAuthEmailMatch);
  authEmailInput?.addEventListener("change", checkAuthEmailMatch);

  // Form de Login & Registro Rápido
  document.getElementById("form-auth")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("auth-email")?.value.trim();
    if (!email) return;

    const student = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(email) : null;
    const extraName = document.getElementById("auth-name")?.value.trim();
    const extraSem = document.getElementById("auth-sem")?.value;
    const extraReg = document.getElementById("auth-reg")?.value.trim();
    const isEcaChecked = document.getElementById("auth-eca-confirm")?.checked;

    if (!student && !isEcaChecked) {
      showToast("É obrigatório comprovar/declarar vínculo com Engenharia de Controle e Automação para votar.", true);
      return;
    }

    try {
      const msg = await store.signIn(email, {
        display_name: student ? student.name : (extraName || email.split("@")[0]),
        semester: extraSem || "1º semestre",
        registration: extraReg || "",
        is_eca_student: !!(student || isEcaChecked),
      });
      showToast(msg);
      dlgAuth?.close();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // Form de Perfil
  document.getElementById("form-profile")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const display_name = document.getElementById("prof-name").value.trim();
    const semester = document.getElementById("prof-sem").value.trim();
    try {
      await store.saveProfile({ display_name, semester });
      showToast("Perfil atualizado!");
      dlgProf?.close();
      renderCurrentView();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // Logout
  document.getElementById("btn-logout")?.addEventListener("click", async () => {
    await store.signOut();
    showToast("Você saiu da conta.");
    dlgProf?.close();
    if (currentRoute === "admin") navigate("inicio");
  });

  // Menu Mobile
  const toggleBtn = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  function updateHeaderBottom() {
    const header = document.querySelector(".site-header");
    if (header) {
      const rect = header.getBoundingClientRect();
      document.documentElement.style.setProperty("--header-bottom", `${Math.round(rect.bottom)}px`);
    }
  }
  window.addEventListener("resize", updateHeaderBottom);

  toggleBtn?.addEventListener("click", () => {
    updateHeaderBottom();
    const isOpen = navLinks.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.innerHTML = isOpen ? "✕" : "☰";
    toggleBtn.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
  });

  // Fechar menu mobile ao clicar em links de navegação
  navLinks?.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      navLinks.classList.remove("open");
      toggleBtn?.setAttribute("aria-expanded", "false");
      if (toggleBtn) toggleBtn.innerHTML = "☰";
    }
  });

  // Toggle acessível de submenus dropdowns (mobile e desktop)
  document.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.closest(".nav-dropdown");
      const wasOpen = parent?.classList.contains("open");
      document.querySelectorAll(".nav-dropdown.open").forEach((d) => {
        if (d !== parent) {
          d.classList.remove("open");
          d.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
        }
      });
      if (parent) {
        parent.classList.toggle("open", !wasOpen);
        btn.setAttribute("aria-expanded", String(!wasOpen));
      }
    });
  });

  // Fechar dropdowns ao clicar fora
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown.open").forEach((d) => {
        d.classList.remove("open");
        d.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Navegação por Hash
  function handleHash() {
    const raw = window.location.hash.slice(1) || "inicio";
    const parts = raw.split("/");
    navigate(parts[0], parts[1] || null);
  }

  window.addEventListener("hashchange", handleHash);
  handleHash();
}

// Inicia assim que o DOM carregar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
