import { CONFIG } from "./config.js";
import { CURSO, PRINCIPIOS, LINHA_DO_TEMPO, FAQ, CATEGORIAS_SUGESTAO, CATEGORIAS_FORUM, STATUS_SUGESTAO, PRODUTOS_SHOP, DOCUMENTOS_OFICIAIS, ARVORES_PPC, BENEFICIOS_UERGS, CALENDARIO_EVENTOS, ESTAGIOS_MERCADO } from "./content.js";
import { createStore, onAuth, getAuth } from "./store.js";
import { renderAdminHtml, setupAdminInteractions } from "./modules/admin.js";
import { parseTranscript, getAcademicMetrics, getEnrollmentOptimizer, detectScheduleConflicts } from "./modules/academic.js";
import { fetchUergsPoaEvents, formatUergsEventToCard } from "./services/uergs-events.js";

// Estado global do aplicativo
let store;
let currentRoute = "inicio";
let topicDetailId = null;
let currentCursoTab = "perfil";
let currentProfileTab = "historico"; // "historico" | "matricula" | "cadastro"
let uergsScrapedEvents = [];

function getAllEventsCombined() {
  return [...CALENDARIO_EVENTOS, ...uergsScrapedEvents];
}

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
    const isSuper = !!auth.isSuperAdmin;
    const isAdmin = !!auth.isAdmin;

    let roleBadge = "";
    let avatarStyle = "width:24px; height:24px; font-size:.7rem;";
    if (isSuper) {
      roleBadge = `<span class="badge" style="background: linear-gradient(135deg, #d97706, #b45309); color:#fff; font-size:.65rem; font-weight:700; padding:2px 6px; border-radius:4px; margin-left:4px;">👑 SUPER ADM</span>`;
      avatarStyle += " background: linear-gradient(135deg, #d97706, #b45309); color:#fff;";
    } else if (isAdmin) {
      roleBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b; font-size: .65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">ADM</span>`;
    }

    slot.innerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" id="btn-open-profile" title="Ver perfil" style="display:inline-flex; align-items:center; gap:.4rem;">
        <span class="avatar" style="${avatarStyle}">${isSuper ? '👑' : name.slice(0, 2).toUpperCase()}</span>
        <span>${escapeHtml(name)}</span>
        ${roleBadge}
      </button>
    `;
    document.getElementById("btn-open-profile")?.addEventListener("click", () => {
      const dlg = document.getElementById("dlg-profile");
      const nameInput = document.getElementById("prof-name");
      const semInput = document.getElementById("prof-sem");
      const admSec = document.getElementById("prof-admin-section");
      if (nameInput) nameInput.value = auth.profile?.display_name || "";
      if (semInput) semInput.value = auth.profile?.semester || "";
      if (admSec) {
        admSec.style.display = auth?.isAdmin ? "block" : "none";
        const badgeSpan = admSec.querySelector(".badge");
        const descP = admSec.querySelector("p");
        if (badgeSpan && descP) {
          if (auth?.isSuperAdmin) {
            badgeSpan.className = "badge";
            badgeSpan.style = "background: linear-gradient(135deg, #d97706, #b45309); color:#fff; font-size: .75rem; font-weight:700; padding: 3px 8px; border-radius: 4px; box-shadow: 0 0 8px rgba(245, 158, 11, 0.3);";
            badgeSpan.textContent = "👑 SUPER ADMINISTRADOR (ACESSO TOTAL)";
            descP.textContent = "Acesso irrestrito a todos os módulos, configurações e governança geral do sistema.";
          } else {
            badgeSpan.className = "badge amber";
            badgeSpan.style = "font-size: .75rem;";
            badgeSpan.textContent = "⭐ DIRETORIA HOMOLOGADA";
            descP.textContent = "Acesso de gestão do Centro Acadêmico.";
          }
        }
      }
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
const esc = escapeHtml;

// -------------------------------------------------------------
// Roteador e Renderização de Páginas
// -------------------------------------------------------------

function navigate(route, id = null) {
  currentRoute = route;
  topicDetailId = id;
  if (route === "curso") {
    currentCursoTab = id || "perfil";
  } else if (route === "matricula") {
    currentProfileTab = "matricula";
  } else if (route === "registro") {
    currentProfileTab = "cadastro";
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
    case "perfil":
    case "matricula":
    case "registro":
      root.innerHTML = renderPerfilHtml();
      await setupPerfilInteractions();
      break;
    case "eleicao":
    case "urna":
    case "fundacao":
      root.innerHTML = renderArquivoHistoricoHtml();
      break;
    case "eventos":
      root.innerHTML = renderEventosHtml();
      await setupEventosInteractions();
      break;
    case "shop":
      root.innerHTML = renderShopHtml();
      setupShopInteractions();
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
    <!-- Barra de Telemetria Industrial ao Vivo (Taste-Skill) -->
    <div class="container" style="padding-top: 1.5rem;">
      <div class="telemetry-ticker">
        <div class="group">
          <span class="led-dot green" title="Sistema Operacional"></span>
          <span>SYS.ID: <strong>E(CA)² · UERGS POA</strong></span>
          <span class="sep">//</span>
          <span>CAMPUS: <strong>CENTRAL (WASHINGTON LUIZ)</strong></span>
        </div>
        <div class="group">
          <span class="led-dot cyan" title="Malha Sincronizada"></span>
          <span>MALHA: <strong>FECHADA [FEEDBACK ATIVO]</strong></span>
          <span class="sep">//</span>
          <span>CENSO: <strong>${CONFIG.STUDENTS_DATABASE ? CONFIG.STUDENTS_DATABASE.length : 203} DISCENTES</strong></span>
          <span class="sep">//</span>
          <span class="led-dot green" title="Gestão Eleita & Ativa"></span>
          <span>GESTÃO: <strong>ATIVA 2026/2027</strong></span>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="section hero" style="padding-top: .75rem;">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><span class="led-dot cyan"></span> ENGENHARIA DE CONTROLE & AUTOMAÇÃO // UERGS POÁ</span>
          <h1>Sem feedback não há controle.</h1>
          <p class="slogan">A plataforma de representação e instrumentação acadêmica.</p>
          <p class="lead">
            Plataforma oficial de apoio discente, matrizes curriculares com comparador de PPCs, planejamento e otimizador de matrícula, visitas técnicas industriais, lojinha do curso e representação discente legítima.
          </p>
          
          <div class="row" style="flex-wrap: wrap; gap: .65rem; margin-bottom: 1.75rem;">
            <a href="#perfil" class="btn btn-primary">Meu Perfil & Matrícula</a>
            <a href="#curso" class="btn btn-ghost">Matrizes PPCs (2019 vs 2024)</a>
            <a href="#eventos" class="btn btn-ghost">Calendário 2026</a>
            <a href="#documentos" class="btn btn-ghost">Documentos Oficiais</a>
          </div>

          <!-- Chassi de Status e Integralização Curricular -->
          <div class="countdown-chassis tech-frame" id="event-countdown-container">
            <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .85rem; flex-wrap: wrap; gap: .5rem;">
              <span class="badge cyan" style="font-family: var(--font-mono);"><span class="led-dot green"></span> SIMULADOR DE MATRÍCULA ATIVO</span>
              <span class="small muted" style="font-family: var(--font-mono);">UERGS // CAMPUS POA</span>
            </div>
            <div class="grid grid-3" style="gap: .75rem; text-align: center;">
              <div style="background: hsl(222 35% 8% / .6); padding: .75rem; border-radius: 6px; border: 1px solid var(--border);">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--cyan); font-family: var(--font-mono);">4.015h</div>
                <div class="faint" style="font-size: .7rem; font-family: var(--font-mono);">PPC 2024 VIGENTE</div>
              </div>
              <div style="background: hsl(222 35% 8% / .6); padding: .75rem; border-radius: 6px; border: 1px solid var(--border);">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--green); font-family: var(--font-mono);">410h</div>
                <div class="faint" style="font-size: .7rem; font-family: var(--font-mono);">EXTENSÃO OBRIGATÓRIA</div>
              </div>
              <div style="background: hsl(222 35% 8% / .6); padding: .75rem; border-radius: 6px; border: 1px solid var(--border);">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--amber); font-family: var(--font-mono);">10 MÓDULOS</div>
                <div class="faint" style="font-size: .7rem; font-family: var(--font-mono);">GRADE INTEGRALIZADA</div>
              </div>
            </div>
            <div class="event-meta" style="margin-top: .85rem; border-top: 1px dashed var(--border); padding-top: .65rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .5rem;">
              <span class="small muted">Importe seu histórico e planeje sua próxima matrícula sem trancar matérias.</span>
              <a href="#perfil" class="btn btn-ghost btn-sm" style="font-family: var(--font-mono);">Acessar Meu Perfil ↗</a>
            </div>
          </div>
        </div>

        <!-- Painel Lateral: Imagem de Bancada & Diagrama de Feedback -->
        <div class="stack" style="gap: 1.25rem;">
          <div class="tech-frame" style="overflow: hidden; border: 1px solid var(--border-strong);">
            <div style="position: relative;">
              <img src="img/hero_estudantes.jpg" alt="Estudantes de Engenharia de Controle e Automação no Laboratório UERGS" style="width: 100%; height: 260px; object-fit: cover; display: block;">
              <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, hsl(224 50% 6% / .95) 100%) /* taste-skill-ignore */;"></div>
              <span class="badge cyan" style="position: absolute; top: 14px; left: 14px; backdrop-filter: blur(10px);">
                <span class="led-dot green"></span> LAB DE CONTROLE & AUTOMAÇÃO
              </span>
            </div>
            <div style="padding: 1.2rem 1.4rem 1.35rem;">
              <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .25rem;">
                <h3 style="font-size: 1.15rem; margin: 0;">Construído por e para estudantes</h3>
                <span style="font-family: var(--font-mono); font-size: .72rem; color: var(--cyan);">LAB 01</span>
              </div>
              <p class="muted small" style="margin: 0;">
                Da bancada de ensaios com CLPs até a assembleia geral: o E(CA)² é a nossa plataforma ativa no campus central.
              </p>
            </div>
          </div>

          <!-- Diagrama de Malha Fechada com Graticule -->
          <div class="card loop-card tech-frame">
            <div class="row" style="margin-bottom: .75rem; justify-content: space-between; align-items: center;">
              <span class="small" style="font-family: var(--font-mono); color: var(--cyan); font-weight: 700; display: inline-flex; align-items: center; gap: .4rem;">
                <span class="led-dot cyan"></span> MALHA DE REALIMENTAÇÃO DO CURSO
              </span>
              <span class="badge amber" style="font-size: .68rem;">SINAL ESTÁVEL</span>
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
              <text x="420" y="82" class="sub">Planta / Discentes</text>
              <text x="310" y="180" class="sub">Realimentação contínua da comunidade acadêmica</text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Módulos de Instrumentação de Bancada (Taste-Skill Mod Cards) -->
    <section class="section" style="padding-top: 1rem;">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow"><span class="led-dot cyan"></span> MÓDULOS DE SUPORTE ACADÊMICO</span>
          <h2>Instrumentação para Calouros & Veteranos</h2>
          <p>Tudo o que você precisa para navegar no curso, acompanhar dependências de matrícula e participar das decisões.</p>
        </div>

        <div class="grid grid-4" style="margin-bottom: 3.5rem;">
          <a href="#curso" class="mod-card">
            <div class="mod-head">
              <span class="channel-id"><span class="led-dot cyan"></span> MÓDULO 01 · CURRÍCULO</span>
              <span class="channel-tag">REV 003</span>
            </div>
            <h3>Árvores de PPCs</h3>
            <p>
              Cadeia de dependências entre o PPC 2019 e 2024. Saiba exatamente o que tranca o que antes de enviar a rematrícula.
            </p>
            <div class="mod-footer">
              <span>STATUS: 4.015h</span>
              <span class="action-hint">EXPLORAR &rarr;</span>
            </div>
          </a>

          <a href="#eventos" class="mod-card">
            <div class="mod-head">
              <span class="channel-id"><span class="led-dot amber"></span> MÓDULO 02 · CALENDÁRIO</span>
              <span class="channel-tag">EVENTO 26/10</span>
            </div>
            <h3>Calendário 2026</h3>
            <p>
              Salchipão inaugural (26/10), visitas técnicas no Polo Petroquímico e minicursos práticos de CLP com emissão de certificados.
            </p>
            <div class="mod-footer">
              <span>CALENDÁRIO: ATIVO</span>
              <span class="action-hint">VER AGENDA &rarr;</span>
            </div>
          </a>

          <a href="#shop" class="mod-card">
            <div class="mod-head">
              <span class="channel-id"><span class="led-dot green"></span> MÓDULO 03 · LOJINHA</span>
              <span class="channel-tag">OFICIAL</span>
            </div>
            <h3>Lojinha & Vestuário</h3>
            <p>
              Copos térmicos gravados a laser, moletons oficiais do curso, canecas para o lab e kits didáticos para estudantes.
            </p>
            <div class="mod-footer">
              <span>ESTOQUE: PRONTO</span>
              <span class="action-hint">VER ITENS &rarr;</span>
            </div>
          </a>

          <a href="#mural" class="mod-card">
            <div class="mod-head">
              <span class="channel-id"><span class="led-dot cyan"></span> MÓDULO 04 · OPORTUNIDADES</span>
              <span class="channel-tag">CREA-RS</span>
            </div>
            <h3>Mural de Oportunidades</h3>
            <p>
              Vagas de estágio na Grande Porto Alegre, bolsas de IC, editais de monitoria e canal aberto de sugestões para a coordenação.
            </p>
            <div class="mod-footer">
              <span>CANAL: ABERTO</span>
              <span class="action-hint">ACESSAR &rarr;</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Destaque: Simulador Curricular & Otimizador de Matrícula -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="tech-frame" style="padding: 2.25rem 2.5rem; background: var(--surface); border: 1px solid var(--border-strong);">
          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.75rem;">
            <div style="max-width: 640px;">
              <div class="row" style="gap: .6rem; margin-bottom: .6rem;">
                <span class="badge cyan"><span class="led-dot green"></span> FERRAMENTA ACADÊMICA DISCENTE</span>
                <span class="badge amber">INTEGRALIZAÇÃO & PPC</span>
              </div>
              <h2 style="font-size: 1.85rem; margin: 0 0 .6rem;">Simulador Curricular & Otimizador de Matrícula</h2>
              <p class="muted" style="line-height: 1.6; margin: 0 0 .85rem;">
                Entre no seu perfil, cole seu histórico do Portal da UERGS e nosso sistema reconhecerá automaticamente seu <strong>PPC (2019 ou 2024)</strong> e todas as <strong>cadeiras aprovadas</strong>. Cruze seu progresso com as disciplinas ofertadas pela ADM no próximo semestre para escolher a melhor grade sem trancar pré-requisitos!
              </p>
              <div style="font-family: var(--font-mono); font-size: .8rem; color: var(--cyan); display: flex; align-items: center; gap: .5rem;">
                <span class="led-dot cyan"></span>
                <span>Análise de gargalos em tempo real · Cálculo de % de formatura · Oferta do semestre sincronizada</span>
              </div>
            </div>
            <div class="stack" style="gap: .75rem; min-width: 230px;">
              <a href="#perfil" class="btn btn-primary" style="text-align: center; width: 100%;">Acessar Meu Perfil</a>
              <a href="#curso/arvore" class="btn btn-ghost" style="text-align: center; width: 100%;">Mapa de Dependências (CAD)</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Princípios Básicos em Módulos -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow"><span class="led-dot cyan"></span> DIRETRIZES DE GOVERNANÇA</span>
          <h2>Um Centro Acadêmico Feito com Rigor Técnico</h2>
          <p>Transparência total, sem partidarismo político e com participação direta de cada semestre do curso.</p>
        </div>

        <div class="grid grid-4">
          ${PRINCIPIOS.map((p, idx) => `
            <div class="mod-card">
              <div class="mod-head">
                <span class="channel-id">PILAR-0${idx + 1}</span>
                <span class="channel-tag">ESTATUTO</span>
              </div>
              <div style="font-size: 1.8rem; margin-bottom: .6rem;">${p.icone}</div>
              <h3>${p.titulo}</h3>
              <p>${p.texto}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
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
// VISTA: PERFIL DO ESTUDANTE & SIMULADOR DE MATRÍCULA
// -------------------------------------------------------------
function renderPerfilHtml() {
  const auth = getAuth();
  const prof = auth.profile || {};
  const isLogged = !!auth.user;
  const displayName = prof.display_name || (auth.user ? auth.user.email.split("@")[0] : "Estudante");

  return `
    <section class="section" style="padding-top: 1.5rem;">
      <div class="container" style="max-width: 1060px;">
        <!-- Header do Terminal Estudantil (Taste-Skill Tech Frame) -->
        <div class="tech-frame" style="padding: 1.75rem 2rem; margin-bottom: 2rem; background: var(--surface); border: 1px solid var(--border-strong);">
          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="width: 58px; height: 58px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border-strong); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--cyan); font-family: var(--font-mono); font-size: 1.1rem;">ECA</div>
              <div>
                <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .25rem;">
                  <span class="badge cyan" style="font-family: var(--font-mono);">${isLogged ? 'DISCENTE IDENTIFICADO' : 'MODO SIMULAÇÃO ABERTO'}</span>
                  ${prof.registration ? `<span class="badge" style="background: hsl(222 25% 18%); font-family: var(--font-mono);">MATRÍCULA: ${escapeHtml(prof.registration)}</span>` : ''}
                  <span class="badge green" id="badge-ppc-header">PPC 2024 VIGENTE</span>
                </div>
                <h1 style="font-size: 1.6rem; margin: 0; color: var(--text); font-family: var(--font-head);">${escapeHtml(displayName)}</h1>
                <div class="small muted" style="margin-top: .2rem; font-family: var(--font-mono);">
                  ${auth.user ? escapeHtml(auth.user.email) : "Acesse com seu e-mail institucional para sincronizar seus dados permanentemente."} · <strong>${escapeHtml(prof.semester || "Semestre não informado")}</strong>
                </div>
              </div>
            </div>

            <div class="row" style="gap: .6rem; flex-wrap: wrap;">
              ${!isLogged ? `
                <button type="button" class="btn btn-primary btn-sm" id="btn-perfil-login">
                  Entrar com E-mail
                </button>
              ` : `
                <button type="button" class="btn btn-ghost btn-sm" id="btn-perfil-logout" style="color: var(--muted); font-family: var(--font-mono);">
                  Desconectar
                </button>
              `}
            </div>
          </div>
        </div>

        <!-- Abas do Perfil Acadêmico -->
        <nav class="academic-tabs" aria-label="Abas do perfil estudantil">
          <button type="button" class="academic-tab-btn ${currentProfileTab === 'historico' ? 'active' : ''}" data-ptab="historico">
            Meu Histórico & Integralização
          </button>
          <button type="button" class="academic-tab-btn ${currentProfileTab === 'matricula' ? 'active' : ''}" data-ptab="matricula">
            Simulador de Matrícula (Oferta 2026/1)
          </button>
          <button type="button" class="academic-tab-btn ${currentProfileTab === 'cadastro' ? 'active' : ''}" data-ptab="cadastro">
            Ficha Cadastral
          </button>
        </nav>

        <!-- Conteúdo Dinâmico das Abas -->
        <div id="perfil-tab-content">
          <div class="skeleton" style="height: 350px;"></div>
        </div>
      </div>
    </section>
  `;
}

const renderRegistroHtml = renderPerfilHtml;
const setupRegistroInteractions = setupPerfilInteractions;

async function setupPerfilInteractions() {
  const container = document.getElementById("perfil-tab-content");
  if (!container) return;

  // Botões de autenticação do perfil
  document.getElementById("btn-perfil-login")?.addEventListener("click", () => {
    document.getElementById("dlg-login")?.showModal();
  });
  document.getElementById("btn-perfil-logout")?.addEventListener("click", async () => {
    await store.signOut();
    showToast("Você foi desconectado.");
    navigate("inicio");
  });

  // Carrega dados acadêmicos do aluno e matriz de ofertas
  let academic = { ppc: "2024", completedCodes: [], transcriptRawText: "", plannedCodes: [] };
  let offerings = { semester: "2026/1", courses: [] };

  try {
    const loadedAc = await store.academic.get();
    if (loadedAc && typeof loadedAc === "object") {
      academic = { ...academic, ...loadedAc };
    }
  } catch { /* demo fallback */ }

  academic.ppc = academic.ppc || "2024";
  academic.completedCodes = Array.isArray(academic.completedCodes) ? academic.completedCodes : [];
  academic.plannedCodes = Array.isArray(academic.plannedCodes) ? academic.plannedCodes : [];
  academic.transcriptRawText = typeof academic.transcriptRawText === "string" ? academic.transcriptRawText : "";

  try {
    const loadedOff = await store.offerings.get();
    if (loadedOff && typeof loadedOff === "object") {
      offerings = { ...offerings, ...loadedOff };
    }
  } catch { /* demo fallback */ }
  offerings.courses = Array.isArray(offerings.courses) ? offerings.courses : [];

  // Função interna para renderizar a aba ativa
  async function renderTab() {
    document.querySelectorAll(".academic-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-ptab") === currentProfileTab) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    // Atualiza badge de PPC no header
    const ppcBadge = document.getElementById("badge-ppc-header");
    if (ppcBadge) {
      ppcBadge.textContent = academic.ppc === "2019" ? "PPC 2019 HISTÓRICO" : "PPC 2024 VIGENTE";
      ppcBadge.className = academic.ppc === "2019" ? "badge amber" : "badge green";
    }

    if (currentProfileTab === "historico") {
      renderTabHistorico();
    } else if (currentProfileTab === "matricula") {
      renderTabMatricula();
    } else {
      renderTabCadastro();
    }
  }

  // -----------------------------------------------------------------
  // ABA 1: MEU HISTÓRICO & INTEGRALIZAÇÃO
  // -----------------------------------------------------------------
  function renderTabHistorico() {
    const metrics = getAcademicMetrics(academic.ppc, academic.completedCodes);
    const ppcData = ARVORES_PPC[academic.ppc] || ARVORES_PPC["2024"];

    container.innerHTML = `
      <!-- Métricas Principais (4 Cards) -->
      <div class="grid grid-4" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="card" style="padding: 1.15rem; background: hsl(222 35% 8% / .8); border: 1px solid var(--border);">
          <span class="eyebrow" style="margin-bottom: .25rem;">Currículo Identificado</span>
          <div style="font-size: 1.45rem; font-weight: 700; color: var(--cyan); font-family: var(--font-head); margin-bottom: .25rem;">
            PPC ${academic.ppc}
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-toggle-ppc-user" style="padding: .15rem .45rem; font-size: .75rem; font-family: var(--font-mono);">
            Mudar para PPC ${academic.ppc === "2024" ? "2019" : "2024"}
          </button>
        </div>

        <div class="card" style="padding: 1.15rem; background: hsl(222 35% 8% / .8); border: 1px solid hsl(152 68% 52% / .3);">
          <span class="eyebrow" style="margin-bottom: .25rem; color: var(--green);">Cadeiras Aprovadas</span>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--green); font-family: var(--font-mono);">
            ${metrics.passedDisciplines} <span class="muted" style="font-size: .95rem;">/ ${metrics.totalDisciplines}</span>
          </div>
          <span class="small muted">${metrics.remainingDisciplines} disciplinas restantes</span>
        </div>

        <div class="card" style="padding: 1.15rem; background: hsl(222 35% 8% / .8); border: 1px solid var(--border);">
          <span class="eyebrow" style="margin-bottom: .25rem;">Carga Horária Total</span>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--text); font-family: var(--font-mono);">
            ${metrics.completedHours}h <span class="muted" style="font-size: .95rem;">/ ${metrics.totalHours}h</span>
          </div>
          <div class="academic-progress-track">
            <div class="academic-progress-fill" style="width: ${metrics.progressPercent}%;"></div>
          </div>
        </div>

        <div class="card" style="padding: 1.15rem; background: hsl(222 35% 8% / .8); border: 1px solid hsl(189 94% 55% / .3);">
          <span class="eyebrow" style="margin-bottom: .25rem; color: var(--cyan);">Integralização</span>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--cyan); font-family: var(--font-mono);">
            ${metrics.progressPercent}%
          </div>
          <span class="small muted">${metrics.completedCredits} créditos obtidos</span>
        </div>
      </div>

      <!-- Importador Inteligente de Histórico (Box com Textarea) -->
      <div class="tech-frame" style="padding: 1.5rem; margin-bottom: 2rem; background: hsl(222 35% 7% / .8); border: 1px dashed var(--border-strong);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <div>
            <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .25rem;">
              <span class="badge cyan"><span class="led-dot green"></span> PARSER INTELIGENTE DE HISTÓRICO</span>
              <span class="small muted">Suporta texto do Portal da UERGS / Sigaa</span>
            </div>
            <h3 style="font-size: 1.25rem; margin: 0; color: var(--text);">Importar Histórico Escolar</h3>
            <p class="small muted" style="margin: .35rem 0 0; line-height: 1.5;">
              Abra seu histórico escolar no portal da UERGS, selecione todo o texto (<kbd>Ctrl+A</kbd>), copie (<kbd>Ctrl+C</kbd>) e cole no campo abaixo. O algoritmo detectará seu PPC e marcará todas as cadeiras concluídas.
            </p>
          </div>
          <div class="row" style="gap: .5rem;">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-load-sample-transcript" style="font-family: var(--font-mono); font-size: .78rem;" title="Carrega um exemplo de histórico de 3 semestres para teste">
              Carregar Exemplo de Teste
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-clear-transcript" style="font-family: var(--font-mono); font-size: .78rem; color: var(--red);">
              Limpar
            </button>
          </div>
        </div>

        <textarea id="transcript-raw-input" rows="4" placeholder="Cole aqui o texto copiado do seu histórico escolar (ex: CALC-1 Cálculo 1 Aprovado, INTCON Introdução ao Controle Aprovado...)" style="width: 100%; padding: .85rem; font-family: var(--font-mono); font-size: .84rem; background: hsl(222 40% 5%); border: 1px solid var(--border); border-radius: 6px; color: var(--text); resize: vertical; margin-bottom: .85rem;">${escapeHtml(academic.transcriptRawText || "")}</textarea>

        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .75rem;">
          <button type="button" class="btn btn-primary" id="btn-process-transcript" style="font-family: var(--font-mono);">
            Processar Histórico
          </button>
          <div id="transcript-feedback" class="small" style="font-family: var(--font-mono);"></div>
        </div>
      </div>

      <!-- Checklist Curricular Interativo dos 10 Semestres -->
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem;">
          <div>
            <h3 style="margin: 0; font-size: 1.3rem;">Matriz Curricular & Checklist de Cadeiras</h3>
            <p class="small muted" style="margin: .2rem 0 0;">
              Você também pode clicar em qualquer disciplina abaixo para marcar ou desmarcar como concluída manualmente:
            </p>
          </div>
          <div class="row" style="gap: .65rem; font-family: var(--font-mono); font-size: .75rem;">
            <span style="display: inline-flex; align-items: center; gap: .3rem;"><span class="badge green" style="padding: 2px 6px;">OK</span> Aprovada</span>
            <span style="display: inline-flex; align-items: center; gap: .3rem;"><span class="badge cyan" style="padding: 2px 6px;">APTO</span> Pronta p/ Cursar</span>
            <span style="display: inline-flex; align-items: center; gap: .3rem;"><span class="badge slate" style="padding: 2px 6px;">PEND</span> Trancada</span>
          </div>
        </div>

        <div class="stack" style="gap: 1.5rem;">
          ${ppcData.semestres.map(sem => {
            return `
              <div class="card" style="padding: 1.15rem; background: hsl(222 35% 8% / .6); border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: .85rem; border-bottom: 1px dashed var(--border); padding-bottom: .5rem;">
                  <span style="font-weight: 700; color: var(--cyan); font-family: var(--font-mono); font-size: .95rem;">
                    ${sem.titulo} · <span class="muted">${sem.ch}</span>
                  </span>
                  <span class="faint" style="font-size: .75rem; font-family: var(--font-mono);">
                    ${sem.disciplinas.filter(d => academic.completedCodes.includes(d.codigo)).length} de ${sem.disciplinas.length} concluídas
                  </span>
                </div>

                <div class="grid grid-2" style="gap: .65rem;">
                  ${sem.disciplinas.map(disc => {
                    const isDone = academic.completedCodes.includes(disc.codigo);
                    const prereqs = disc.pre || [];
                    const missing = prereqs.filter(p => !academic.completedCodes.includes(p));
                    const isEligible = !isDone && missing.length === 0;

                    let statusClass = "is-blocked";
                    let badgeHtml = `<span class="badge slate" style="font-size: .7rem;">TRANCADA</span>`;

                    if (isDone) {
                      statusClass = "is-passed";
                      badgeHtml = `<span class="badge green" style="font-size: .7rem;">APROVADA</span>`;
                    } else if (isEligible) {
                      statusClass = "is-eligible";
                      badgeHtml = `<span class="badge cyan" style="font-size: .7rem;">APTO</span>`;
                    }

                    return `
                      <div class="academic-disc-item ${statusClass}" data-code="${disc.codigo}" style="cursor: pointer;" title="Clique para alternar aprovação">
                        <div style="min-width: 0;">
                          <div class="row" style="gap: .4rem; align-items: baseline;">
                            <strong style="font-family: var(--font-mono); font-size: .85rem; color: var(--cyan);">${disc.codigo}</strong>
                            <span class="faint" style="font-size: .7rem; font-family: var(--font-mono);">${disc.ch}</span>
                          </div>
                          <div style="font-size: .88rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${escapeHtml(disc.nome)}
                          </div>
                          ${!isDone && missing.length > 0 ? `
                            <div class="faint" style="font-size: .7rem; font-family: var(--font-mono); margin-top: .15rem;">
                              Falta: ${missing.join(", ")}
                            </div>
                          ` : ''}
                        </div>
                        <div style="flex-shrink: 0;">
                          ${badgeHtml}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // Eventos da Aba Histórico
    // 1. Processar Texto do Histórico
    document.getElementById("btn-process-transcript")?.addEventListener("click", async () => {
      const raw = document.getElementById("transcript-raw-input")?.value || "";
      const result = parseTranscript(raw);
      const fb = document.getElementById("transcript-feedback");

      if (!result.success) {
        if (fb) fb.innerHTML = `<span style="color: var(--amber);">${result.message}</span>`;
        return;
      }

      academic.ppc = result.detectedPpc;
      academic.completedCodes = result.completedCodes;
      academic.transcriptRawText = raw;

      await store.academic.save(academic);
      showToast(`Histórico analisado com sucesso! ${result.completedCodes.length} matérias reconhecidas no PPC ${result.detectedPpc}.`);
      renderTab();
    });

    // 2. Carregar Exemplo de Teste
    document.getElementById("btn-load-sample-transcript")?.addEventListener("click", async () => {
      const sample = `
UNIVERSIDADE ESTADUAL DO RIO GRANDE DO SUL - UERGS
HISTÓRICO ESCOLAR DE GRADUAÇÃO
CURSO: ENGENHARIA DE CONTROLE E AUTOMAÇÃO
PPC 2024 VIGENTE - RES. CONEPE 016/2023

1º SEMESTRE
DESTEC Desenho Técnico 1 - 60h - Aprovado com Nota 8.5
INTCON Introdução ao Controle e Automação - 60h - Aprovado com Nota 9.0
CALC-1 Cálculo 1 - 60h - Aprovado com Nota 7.5
ALGPRO Algoritmos e Programação - 60h - Aprovado com Nota 8.0
ALGEOM Álgebra Linear e Geometria Analítica - 60h - Aprovado com Nota 8.0

2º SEMESTRE
DESCAD Desenho Técnico 2 - CAD - 60h - Aprovado com Nota 9.0
ELEDIG Eletrônica Digital - 60h - Aprovado com Nota 8.5
CALC-2 Cálculo 2 - 60h - Aprovado com Nota 7.0
PROFUN Programação em Funções - 60h - Aprovado com Nota 8.5
QUIGER Química Geral - 60h - Aprovado com Nota 8.0
FIS-1 Física 1 - Mecânica - 60h - Aprovado com Nota 7.5

3º SEMESTRE
PROGOO Programação Orientada a Objetos - 60h - Aprovado com Nota 9.0
ESTAT Probabilidade e Estatística - 60h - Aprovado com Nota 8.0
METCIEN Metodologia Científica - 30h - Aprovado com Nota 9.5
      `.trim();

      const input = document.getElementById("transcript-raw-input");
      if (input) input.value = sample;
      showToast("Exemplo de histórico de 3 semestres carregado! Clique em 'Processar'.");
    });

    // 3. Limpar Histórico
    document.getElementById("btn-clear-transcript")?.addEventListener("click", async () => {
      if (confirm("Deseja limpar as matérias salvas no seu histórico?")) {
        academic.completedCodes = [];
        academic.transcriptRawText = "";
        academic.plannedCodes = [];
        await store.academic.save(academic);
        showToast("Histórico redefinido.");
        renderTab();
      }
    });

    // 4. Alternar PPC Manualmente
    document.getElementById("btn-toggle-ppc-user")?.addEventListener("click", async () => {
      academic.ppc = academic.ppc === "2024" ? "2019" : "2024";
      await store.academic.save(academic);
      showToast(`PPC alternado para ${academic.ppc}!`);
      renderTab();
    });

    // 5. Clique nos Cards do Checklist para alternar aprovação individual
    container.querySelectorAll(".academic-disc-item").forEach(item => {
      item.addEventListener("click", async () => {
        const code = item.getAttribute("data-code");
        if (academic.completedCodes.includes(code)) {
          academic.completedCodes = academic.completedCodes.filter(c => c !== code);
          showToast(`${code} desmarcada.`);
        } else {
          academic.completedCodes.push(code);
          showToast(`${code} marcada como APROVADA!`);
        }
        await store.academic.save(academic);
        renderTab();
      });
    });
  }

  // -----------------------------------------------------------------
  // ABA 2: SIMULADOR DE MATRÍCULA (OFERTA SEMESTRAL)
  // -----------------------------------------------------------------
  function renderTabMatricula() {
    const optimizer = getEnrollmentOptimizer(academic.ppc, academic.completedCodes, offerings.courses || []);
    academic.plannedCodes ??= [];

    // Localiza os objetos das disciplinas selecionadas para validar conflito
    const selectedCourseObjects = (offerings.courses || []).filter(c => academic.plannedCodes.includes(c.code));
    const conflicts = detectScheduleConflicts(selectedCourseObjects);
    const totalWeeklyHours = selectedCourseObjects.length * 4; // média 4h por cadeira

    container.innerHTML = `
      <div class="tech-frame" style="padding: 1.5rem; margin-bottom: 1.5rem; background: hsl(222 35% 8% / .8); border: 1px solid var(--border);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .25rem;">
              <span class="badge cyan"><span class="led-dot green"></span> OFERTA OFICIAL DISPONIBILIZADA</span>
              <span class="badge amber">SEMESTRE ${esc(offerings.semester || "2026/1")}</span>
            </div>
            <h2 style="font-size: 1.4rem; margin: 0; color: var(--text); font-family: var(--font-head);">Simulador de Matrícula & Seleção de Grade</h2>
            <p class="small muted" style="margin: .25rem 0 0;">
              O sistema cruzou seu histórico com as disciplinas ofertadas pelo corpo docente para indicar a grade ideal.
            </p>
          </div>
          <div class="row" style="gap: .65rem;">
            <a href="#curso/arvore" class="btn btn-ghost btn-sm" style="font-family: var(--font-mono);">
              Ver Mapa de Pré-Requisitos (CAD)
            </a>
          </div>
        </div>
      </div>

      <!-- Alertas de Choque de Horário -->
      ${conflicts.length > 0 ? `
        <div class="conflict-alert">
          <span class="badge amber" style="font-size: .8rem;">CONFLITO</span>
          <div>
            <strong>Atenção: Choque de Horários Detectado na sua Seleção!</strong>
            <ul style="margin: .25rem 0 0; padding-left: 1.1rem; font-size: .82rem; font-family: var(--font-mono);">
              ${conflicts.map(c => `<li>${c.motivo}</li>`).join("")}
            </ul>
          </div>
        </div>
      ` : ''}

      <!-- Layout em Grid: Disciplinas Ofertadas (Esquerda) + Meu Plano de Matrícula (Direita) -->
      <div class="grid grid-2" style="gap: 1.5rem; align-items: start;">
        
        <!-- Coluna Esquerda: Disciplinas Ofertadas pela ADM -->
        <div>
          <!-- Grupo 1: Recomendadas & Aptas -->
          <div style="margin-bottom: 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: .85rem;">
              <h3 style="font-size: 1.15rem; margin: 0; color: var(--green); display: flex; align-items: center; gap: .4rem;">
                <span class="led-dot green"></span> Recomendadas & Aptas para Você
              </h3>
              <span class="badge green">${optimizer.recommended.length} disciplinas</span>
            </div>

            ${optimizer.recommended.length === 0 ? `
              <div class="card" style="padding: 1.25rem; text-align: center;">
                <p class="small muted" style="margin: 0;">Você já concluiu todas as disciplinas abertas nesta oferta ou não há matérias com pré-requisitos cumpridos.</p>
              </div>
            ` : `
              <div class="stack" style="gap: .75rem;">
                ${optimizer.recommended.map(offer => {
                  const isSelected = academic.plannedCodes.includes(offer.code);
                  return `
                    <div class="card hover" style="padding: 1rem; border: 1px solid ${isSelected ? 'var(--cyan)' : 'var(--border)'}; background: ${isSelected ? 'hsl(189 94% 55% / .08)' : 'hsl(222 35% 8% / .6)'};">
                      <div class="row" style="justify-content: space-between; align-items: flex-start; gap: .5rem; margin-bottom: .4rem;">
                        <div>
                          <div class="row" style="gap: .4rem; align-items: center;">
                            <strong style="color: var(--cyan); font-family: var(--font-mono);">${esc(offer.code)}</strong>
                            <span class="badge" style="background: hsl(222 25% 18%); font-size: .72rem;">${esc(offer.turma || 'Turma A')}</span>
                            <span class="badge ${offer.priorityClass}" style="font-size: .7rem; font-family: var(--font-mono);">${offer.priorityTag}</span>
                          </div>
                          <h4 style="margin: .25rem 0 0; font-size: 1.05rem; color: var(--text);">${esc(offer.name)}</h4>
                        </div>
                        <button type="button" class="btn ${isSelected ? 'btn-primary' : 'btn-ghost'} btn-sm btn-toggle-plan" data-code="${esc(offer.code)}" style="font-family: var(--font-mono); font-size: .78rem; padding: .3rem .65rem;">
                          ${isSelected ? 'Na Grade' : 'Adicionar'}
                        </button>
                      </div>

                      <div class="row" style="justify-content: space-between; align-items: center; font-size: .8rem; font-family: var(--font-mono); border-top: 1px dashed var(--border); padding-top: .5rem; margin-top: .5rem;">
                        <span style="color: var(--amber);">${esc(offer.dia)} · ${esc(offer.horario)}</span>
                        <span class="muted">Prof. ${esc(offer.professor)}</span>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            `}
          </div>

          <!-- Grupo 2: Ofertadas com Pré-requisitos Pendentes -->
          ${optimizer.blocked.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: .75rem;">
                <h3 style="font-size: 1.05rem; margin: 0; color: var(--muted); display: flex; align-items: center; gap: .4rem;">
                  Ofertadas com Pré-requisito Pendente
                </h3>
                <span class="badge slate">${optimizer.blocked.length}</span>
              </div>
              <div class="stack" style="gap: .65rem; opacity: .75;">
                ${optimizer.blocked.map(b => `
                  <div class="card" style="padding: .85rem; background: hsl(222 35% 6% / .4); border: 1px solid var(--border);">
                    <div class="row" style="justify-content: space-between; align-items: baseline;">
                      <div>
                        <strong style="color: var(--muted); font-family: var(--font-mono); font-size: .88rem;">${esc(b.code)} · ${esc(b.name)}</strong>
                        <div class="small" style="color: var(--amber); font-family: var(--font-mono); margin-top: .2rem;">
                          Falta cursar: ${b.missingNames.join(", ")}
                        </div>
                      </div>
                      <span class="faint" style="font-size: .75rem; font-family: var(--font-mono);">${esc(b.dia)}</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Coluna Direita: Meu Plano de Matrícula (Chassi de Resumo) -->
        <div>
          <div class="tech-frame" style="padding: 1.35rem; background: hsl(222 35% 8% / .9); border: 2px solid hsl(189 94% 55% / .4); position: sticky; top: 80px;">
            <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px dashed var(--border); padding-bottom: .65rem;">
              <div>
                <span class="eyebrow" style="margin-bottom: .2rem; color: var(--cyan);">Meu Plano de Matrícula</span>
                <h3 style="margin: 0; font-size: 1.25rem;">Semestre ${esc(offerings.semester || "2026/1")}</h3>
              </div>
              <span class="badge cyan" style="font-size: .85rem; font-family: var(--font-mono);">${academic.plannedCodes.length} Cadeiras</span>
            </div>

            ${academic.plannedCodes.length === 0 ? `
              <div style="text-align: center; padding: 2rem 1rem; color: var(--muted);">
                <div style="font-size: 1rem; font-weight: 600; color: var(--muted); margin-bottom: .5rem;">[ GRADE VAZIA ]</div>
                <p class="small" style="margin: 0;">Nenhuma cadeira adicionada ao seu plano ainda. Clique em <strong>+ Adicionar</strong> nas disciplinas recomendadas ao lado.</p>
              </div>
            ` : `
              <div class="stack" style="gap: .6rem; margin-bottom: 1.25rem;">
                ${selectedCourseObjects.map(course => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: .65rem .75rem; background: hsl(222 35% 6%); border-radius: 6px; border: 1px solid var(--border);">
                    <div>
                      <strong style="color: var(--cyan); font-family: var(--font-mono); font-size: .85rem;">${esc(course.code)}</strong>
                      <div style="font-size: .84rem; color: var(--text);">${esc(course.name)}</div>
                      <div class="faint" style="font-size: .72rem; font-family: var(--font-mono); color: var(--amber);">${esc(course.dia)} · ${esc(course.horario)}</div>
                    </div>
                    <button type="button" class="btn btn-ghost btn-sm btn-remove-planned" data-code="${esc(course.code)}" title="Remover da grade" style="color: var(--red); padding: .2rem .4rem; font-size: .8rem;">
                      &times;
                    </button>
                  </div>
                `).join("")}
              </div>

              <!-- Resumo da Carga Semanal -->
              <div style="background: hsl(222 35% 10% / .6); padding: .85rem; border-radius: 6px; margin-bottom: 1.25rem; font-family: var(--font-mono); font-size: .82rem;">
                <div class="row" style="justify-content: space-between; margin-bottom: .3rem;">
                  <span class="muted">Carga Horária Semanal:</span>
                  <strong style="color: var(--cyan);">${totalWeeklyHours}h / semana</strong>
                </div>
                <div class="row" style="justify-content: space-between; margin-bottom: .3rem;">
                  <span class="muted">Total de Disciplinas:</span>
                  <strong>${selectedCourseObjects.length} matérias</strong>
                </div>
                <div class="row" style="justify-content: space-between;">
                  <span class="muted">Conflito de Turno:</span>
                  <strong style="color: ${conflicts.length > 0 ? 'var(--amber)' : 'var(--green)'};">${conflicts.length > 0 ? 'Com Choque de Horário' : 'Compatível'}</strong>
                </div>
              </div>

              <div class="stack" style="gap: .6rem;">
                <button type="button" class="btn btn-primary" id="btn-save-enrollment-plan" style="width: 100%; font-family: var(--font-mono);">
                  Salvar Meu Plano de Matrícula
                </button>
                <button type="button" class="btn btn-ghost btn-sm" id="btn-export-enrollment-plan" style="width: 100%; font-family: var(--font-mono);">
                  Imprimir / Exportar Comprovante
                </button>
              </div>
            `}
          </div>
        </div>

      </div>
    `;

    // Eventos da Aba Simulador de Matrícula
    container.querySelectorAll(".btn-toggle-plan").forEach(btn => {
      btn.addEventListener("click", async () => {
        const code = btn.getAttribute("data-code");
        if (academic.plannedCodes.includes(code)) {
          academic.plannedCodes = academic.plannedCodes.filter(c => c !== code);
        } else {
          academic.plannedCodes.push(code);
        }
        await store.academic.save(academic);
        renderTabMatricula();
      });
    });

    container.querySelectorAll(".btn-remove-planned").forEach(btn => {
      btn.addEventListener("click", async () => {
        const code = btn.getAttribute("data-code");
        academic.plannedCodes = academic.plannedCodes.filter(c => c !== code);
        await store.academic.save(academic);
        renderTabMatricula();
      });
    });

    document.getElementById("btn-save-enrollment-plan")?.addEventListener("click", async () => {
      await store.academic.save(academic);
      showToast("Plano de Matrícula 2026/1 salvo com sucesso no seu perfil!");
    });

    document.getElementById("btn-export-enrollment-plan")?.addEventListener("click", () => {
      window.print();
    });
  }

  // -----------------------------------------------------------------
  // ABA 3: FICHA CADASTRAL DO ALUNO
  // -----------------------------------------------------------------
  function renderTabCadastro() {
    const auth = getAuth();
    const prof = auth.profile || {};
    const isLogged = !!auth.user;

    container.innerHTML = `
      <div class="grid grid-2" style="align-items: start; gap: 1.5rem;">
        <div class="card" style="padding: 2rem;">
          <h3 style="margin-top: 0;">Dados Cadastrais do Estudante</h3>
          <p class="muted small" style="margin-bottom: 1.5rem;">
            ${isLogged ? `Conectado como <strong>${escapeHtml(auth.user.email)}</strong>. Atualize suas preferências:` : `Cadastre-se para sincronizar seus dados permanentemente no portal:`}
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

            <button type="submit" class="btn btn-primary" id="btn-submit-registro" style="margin-top: .5rem;">
              ${isLogged ? 'Atualizar Meu Cadastro' : 'Finalizar Registro de Estudante'}
            </button>
          </form>
        </div>

        <div class="stack" style="gap: 1.25rem;">
          <div class="card">
            <div class="badge cyan" style="margin-bottom: .5rem;">VANTAGENS</div>
            <h3>Benefícios do Cadastro Oficial</h3>
            <ul class="muted small" style="padding-left: 1.1rem; line-height: 1.7; margin-bottom: 0;">
              <li><strong>Sincronização na Nuvem:</strong> Seu histórico e planos de matrícula salvos em qualquer dispositivo.</li>
              <li><strong>Representação Estudantil:</strong> Legitimidade perante os colegiados e departamentos da UERGS.</li>
              <li><strong>Oportunidades em 1ª mão:</strong> Vagas de estágio filtradas para automação industrial na Grande Porto Alegre.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Evento de envio do formulário de cadastro
    const form = document.getElementById("form-registro-aluno");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("btn-submit-registro");

      const display_name = form.display_name.value.trim();
      const email = form.email ? form.email.value.trim() : null;
      const semester = form.semester.value;
      const registration = form.registration ? form.registration.value.trim() : "";
      const whatsapp = form.whatsapp ? form.whatsapp.value.trim() : "";
      const interests = form.interests ? form.interests.value.trim() : "";

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
        });

        showToast(resp || "Cadastro de estudante atualizado com sucesso!");
        navigate("perfil");
      } catch (err) {
        showToast(err.message || "Erro ao salvar cadastro.", true);
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  // Navegação entre as abas do perfil
  document.querySelectorAll(".academic-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentProfileTab = btn.getAttribute("data-ptab");
      renderTab();
    });
  });

  // Render inicial da aba
  await renderTab();
}

// -------------------------------------------------------------
// VISTA: ARQUIVO HISTÓRICO DA FUNDAÇÃO (26/10/2026)
// -------------------------------------------------------------
function renderArquivoHistoricoHtml() {
  return `
    <section class="section">
      <div class="container" style="max-width: 860px;">
        <div class="tech-frame" style="padding: 2.75rem 2rem; text-align: center; background: hsl(222 45% 8% / .85); border: 1px solid var(--border-strong);">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 50%; background: hsl(152 68% 52% / .1); color: var(--green); font-size: 1.1rem; font-family: var(--font-mono); font-weight: 700; margin-bottom: 1.25rem; border: 1px solid hsl(152 68% 52% / .3);">
            UERGS
          </div>
          <br>
          <span class="badge green" style="margin-bottom: .6rem;"><span class="led-dot green"></span> DELIBERAÇÃO CONCLUÍDA & REGISTRADA</span>
          <h2 style="font-size: 1.85rem; margin-bottom: .85rem; font-family: var(--font-head);">Assembleia Geral de Fundação Realizada</h2>
          <p class="muted" style="line-height: 1.6; max-width: 620px; margin: 0 auto 1.75rem;">
            A Assembleia Geral de Fundação realizada em <strong>26 de Outubro de 2026</strong> foi concluída com sucesso. Os votos e deliberações foram formalmente homologados e os documentos oficiais encontram-se devidamente arquivados nos anais do Centro Acadêmico.
          </p>

          <div class="grid grid-2" style="gap: 1rem; text-align: left; max-width: 650px; margin: 0 auto 2rem;">
            <div style="background: hsl(222 35% 10% / .6); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
              <div class="small" style="color: var(--cyan); font-weight: 700; margin-bottom: .3rem; font-family: var(--font-mono);">01 // PPC 2024 VIGENTE</div>
              <p class="small muted" style="margin: 0 0 .6rem;">Projeto Pedagógico e matriz curricular oficial do curso.</p>
              <a href="pdf/PPC_Controle_Automacao_2024_Vigente.pdf" target="_blank" class="btn btn-ghost btn-sm" style="font-family: var(--font-mono);">Baixar PPC (PDF) ↗</a>
            </div>
            <div style="background: hsl(222 35% 10% / .6); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
              <div class="small" style="color: var(--amber); font-weight: 700; margin-bottom: .3rem; font-family: var(--font-mono);">02 // ESTATUTO VIGENTE</div>
              <p class="small muted" style="margin: 0 0 .6rem;">Estatuto social aprovado pela comunidade estudantil.</p>
              <a href="pdf/Estatuto_ECA2_2026.pdf" target="_blank" class="btn btn-ghost btn-sm" style="font-family: var(--font-mono);">Baixar Estatuto (PDF) ↗</a>
            </div>
          </div>

          <div class="row" style="justify-content: center; gap: .75rem; flex-wrap: wrap;">
            <a href="#documentos" class="btn btn-primary">Acervo Documental Completo</a>
            <a href="#perfil" class="btn btn-ghost">Meu Perfil & Matrícula</a>
            <a href="#inicio" class="btn btn-ghost">← Voltar ao Início</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

// (Módulos de apuração da fundação e urna de 26/10 foram concluídos e arquivados em _arquivo_historico_fundacao_26)


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

  const allEvents = getAllEventsCombined();
  const eventsByDate = {};
  allEvents.forEach(ev => {
    if (!eventsByDate[ev.data]) eventsByDate[ev.data] = [];
    eventsByDate[ev.data].push(ev);
  });

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const eventsThisMonth = allEvents.filter(ev => {
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
    const hasPoa = evs.some(e => e.categoria === "uergs-poa");
    const isSelected = selectedDate === dayIso;

    let eventClass = "";
    if (hasEvent) {
      if (hasCa && (hasInst || hasPoa)) eventClass = "has-event has-both-events";
      else if (hasCa) eventClass = "has-event has-ca-event";
      else if (hasPoa) eventClass = "has-event has-poa-event";
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
              <span class="month-cal-event-pill ${e.categoria === 'ca' ? 'ca' : (e.categoria === 'uergs-poa' ? 'uergs-poa' : 'inst')}">
                ${e.icone} ${e.titulo.length > 20 ? e.titulo.slice(0, 18) + '…' : e.titulo}
              </span>
            `).join("")}
          </div>

          <!-- Marcadores Luminosos Mobile -->
          <div class="month-cal-dots-wrap">
            ${hasCa ? `<span class="month-cal-mini-dot ca" title="Evento E(CA)²"></span>` : ''}
            ${hasPoa ? `<span class="month-cal-mini-dot uergs-poa" title="UERGS Porto Alegre"></span>` : ''}
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
          <span class="badge amber" style="font-size: .75rem;">AGENDA</span>
          <div>
            <strong style="color: var(--text);">Dia Selecionado: ${formattedDate}</strong>
            <span class="muted small" style="margin-left: .5rem;">(${selectedEvs.length} ${selectedEvs.length === 1 ? 'evento marcado' : 'eventos marcados'})</span>
          </div>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-clear-date-filter" style="font-size: .8rem; padding: .3rem .8rem;">
          Mostrar Todos os Dias
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
            ${monthName} de ${year}
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
            <span class="month-cal-legend-dot uergs-poa"></span>
            <span>UERGS Porto Alegre</span>
          </div>
          <div class="month-cal-legend-item">
            <span class="month-cal-legend-dot inst"></span>
            <span>Institucional Geral</span>
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
              <span class="badge amber" style="position: absolute; top: 14px; left: 14px;">Integração Estudantil</span>
            </div>
            <div style="padding: 2.5rem;">
              <span class="eyebrow" style="margin-bottom: .4rem;">Segunda-feira · 26 de Outubro · 18:30 às 19:15</span>
              <h3 style="font-size: 1.6rem; margin-bottom: .8rem;">Encontro & Salchipão de Recepção do E(CA)²</h3>
              <p class="muted" style="margin-bottom: 1.25rem; line-height: 1.6;">
                Confraternização aberta com distribuição gratuita de salchipão para todos os estudantes de Engenharia de Controle e Automação da UERGS.
                Aproveite o refeitório para conversar com colegas de todos os semestres, conhecer veteranos e conferir os novos recursos do portal acadêmico!
              </p>
              <div class="row" style="gap: .75rem; flex-wrap: wrap;">
                <a href="#curso/labs" class="btn btn-primary btn-sm">Conhecer os Laboratórios</a>
                <a href="#mural" class="btn btn-ghost btn-sm">Mural de Oportunidades</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner de Integração: Agenda UERGS Campus Porto Alegre -->
        <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, hsl(220 40% 12% / .9), hsl(220 40% 8% / .95)); border: 1px solid var(--border); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2.2rem;">🏛️</span>
            <div>
              <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .25rem; flex-wrap: wrap;">
                <span class="badge amber" style="font-size: .72rem; font-weight: 700;">CAMPUS PORTO ALEGRE</span>
                <span class="badge green" style="font-size: .72rem; font-weight: 700;">📡 RASPAGEM OFICIAL ATIVA</span>
              </div>
              <h3 style="margin: 0; font-size: 1.15rem;">Agenda Oficial UERGS · Unidade Porto Alegre / Campus Central</h3>
              <p class="small muted" style="margin: .25rem 0 0; line-height: 1.5;">
                Eventos raspados e sincronizados em tempo real diretamente da reitoria e campus central (Rua Washington Luiz, 675).
              </p>
            </div>
          </div>
          <div class="row" style="gap: .5rem; align-items: center;">
            <a href="https://www.uergs.edu.br/agenda" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="font-size: .8rem; white-space: nowrap;">
              Portal UERGS Oficial ↗
            </a>
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
        <div class="calendar-filter-bar" style="margin-top: 1.5rem; flex-wrap: wrap; gap: .5rem;">
          <span class="small muted" style="font-weight: 600; margin-right: .5rem;">Filtrar Categoria:</span>
          <button type="button" class="chip ${calCategoryFilter === 'todos' ? 'active' : ''}" data-cal-filter="todos">
            Todos os Eventos (${getAllEventsCombined().length})
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'ca' ? 'active' : ''}" data-cal-filter="ca">
            Eventos E(CA)² (${CALENDARIO_EVENTOS.filter(e => e.categoria === 'ca').length})
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'uergs-poa' ? 'active' : ''}" data-cal-filter="uergs-poa" style="${calCategoryFilter === 'uergs-poa' ? 'border-color: #10b981; color: #34d399;' : ''}">
            🏛️ Agenda UERGS Porto Alegre (${uergsScrapedEvents.length})
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'institucional' ? 'active' : ''}" data-cal-filter="institucional">
            Datas Acadêmicas UERGS (${CALENDARIO_EVENTOS.filter(e => e.categoria === 'institucional').length})
          </button>
        </div>

        <!-- Lista Cronológica de Eventos -->
        <div id="calendar-events-list" style="margin-bottom: 3.5rem;">
          ${getAllEventsCombined().map(ev => {
            const dateParts = ev.data.split("-");
            const dayNum = dateParts[2] || "01";
            const monthNames = ["", "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
            const monthStr = monthNames[parseInt(dateParts[1], 10)] || "MES";
            const badgeClass = ev.categoria === 'ca' ? 'cyan' : (ev.categoria === 'uergs-poa' ? 'green' : 'amber');

            return `
              <div class="calendar-item ${ev.destaque ? 'destaque' : ''}" data-categoria="${ev.categoria}" data-date="${ev.data}">
                <div class="calendar-date-box">
                  <span class="day">${dayNum}</span>
                  <span class="month">${monthStr}</span>
                </div>
                <div style="flex: 1; min-width: 220px;">
                  <div class="row" style="margin-bottom: .3rem; gap: .5rem; flex-wrap: wrap; align-items: center;">
                    <span class="badge ${badgeClass}">${escapeHtml(ev.categoriaLabel || 'Evento')}</span>
                    <span class="small muted">${escapeHtml(ev.horario || '')} · 📍 ${escapeHtml(ev.local || 'Porto Alegre')}</span>
                  </div>
                  <div style="display: flex; gap: 1rem; align-items: flex-start; margin-top: .4rem;">
                    ${ev.imagem ? `
                      <img src="${ev.imagem}" alt="${escapeHtml(ev.titulo)}" style="width: 76px; height: 56px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border); flex-shrink: 0;" loading="lazy" onerror="this.style.display='none'">
                    ` : ''}
                    <div>
                      <h3 style="margin: 0 0 .35rem; font-size: 1.15rem;">${ev.icone || '📅'} ${escapeHtml(ev.titulo)}</h3>
                      <p class="muted small" style="margin: 0; line-height: 1.55;">${escapeHtml(ev.descricao)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  ${ev.linkAcao.startsWith('http') ? `
                    <a href="${ev.linkAcao}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="white-space: nowrap;">
                      ${escapeHtml(ev.textoAcao || 'Ver Mais')} ↗
                    </a>
                  ` : `
                    <a href="${ev.linkAcao}" class="btn ${ev.destaque ? 'btn-primary' : 'btn-ghost'} btn-sm" style="white-space: nowrap;">
                      ${escapeHtml(ev.textoAcao || 'Ver Mais')}
                    </a>
                  `}
                </div>
              </div>
            `;
          }).join("")}

          <div id="calendar-empty-notice" class="empty" style="display: none; padding: 2rem 1rem;">
            <div class="badge cyan">CALENDÁRIO</div>
            <h3>Nenhum evento encontrado para a data/categoria selecionada.</h3>
            <p class="muted small">Tente selecionar outro mês ou limpar os filtros de data.</p>
          </div>
        </div>

        <!-- Card de Sugestão de Pautas e Visitas -->
        <div class="card" style="padding: 2.5rem; background: hsl(220 40% 12% / .6); text-align: center; border: 1px solid var(--border);">
          <div class="badge amber" style="margin-bottom: .5rem;">SUGESTÃO</div>
          <h3 style="font-size: 1.35rem; margin-bottom: .4rem;">Tem sugestão de visita técnica, palestra ou curso?</h3>
          <p class="muted small" style="max-width: 540px; margin: 0 auto 1.25rem; line-height: 1.6;">
            O Centro Acadêmico existe para colocar as demandas dos alunos em prática. Deixe sua ideia de empresa ou tema de minicurso no mural aberto.
          </p>
          <a href="#mural" class="btn btn-ghost btn-sm">Publicar Sugestão no Mural</a>
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
            <button type="button" class="chip" data-shop-filter="Utensílios" aria-pressed="false">Utensílios & Canecas</button>
            <button type="button" class="chip" data-shop-filter="Vestuário" aria-pressed="false">Vestuário</button>
            <button type="button" class="chip" data-shop-filter="DIY & Laboratório" aria-pressed="false">DIY & Laboratório</button>
          </div>
          <div class="spacer"></div>
          <span class="small muted" style="align-self: center;">Lote Inaugural 2026/2 · Encomendas Abertas</span>
        </div>

        <!-- Grade de Produtos do Catálogo -->
        <div class="grid grid-3" id="shop-products-grid" style="align-items: stretch; margin-bottom: 3.5rem;">
          ${PRODUTOS_SHOP.map(prod => `
            <div class="card hover product-card" data-category="${prod.categoria}">
              <div class="product-card-img-wrap" style="position: relative;">
                ${prod.foto ? `
                  <img src="${prod.foto}" alt="${escapeHtml(prod.nome)}" loading="lazy">
                ` : `
                  <div style="display: grid; place-items: center; height: 100%; font-size: 4.5rem; background: hsl(220 40% 12%);">
                    ${prod.categoria || 'ITEM'}
                  </div>
                `}
                <span class="badge ${prod.destaque ? 'amber' : 'cyan'}" style="position: absolute; top: 12px; left: 12px; backdrop-filter: blur(8px);">
                  ${prod.tag || prod.categoria}
                </span>
                ${prod.permitePersonalizacao ? `
                  <span class="badge amber" style="position: absolute; top: 12px; right: 12px; backdrop-filter: blur(8px); box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);">
                    Personalizável
                  </span>
                ` : ''}
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
                  ${prod.permitePersonalizacao ? 'Personalizar & Encomendar' : 'Reservar este Item'}
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Banner de Transparência Financeira do Shop -->
        <div class="card" style="border-left: 4px solid var(--cyan); padding: 1.75rem;">
          <div class="grid grid-2" style="align-items: center; gap: 1.5rem;">
            <div class="row" style="gap: 1.25rem;">
              <span class="badge amber">IDEIA</span>
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
  const prodIdInput = document.getElementById("order-product-id");
  const customEnabledInput = document.getElementById("order-custom-enabled");
  const fontChoiceInput = document.getElementById("order-font-choice");
  const posChoiceInput = document.getElementById("order-position-choice");

  const customToggleSection = document.getElementById("order-custom-toggle-section");
  const btnModeStandard = document.getElementById("btn-mode-standard");
  const btnModeCustom = document.getElementById("btn-mode-custom");
  const customPanel = document.getElementById("order-custom-panel");
  const customTextInput = document.getElementById("order-custom-text");
  const charCounter = document.getElementById("order-char-counter");
  const suggestionChips = document.getElementById("order-suggestion-chips");
  const fontPills = document.getElementById("order-font-pills");
  const posPills = document.getElementById("order-position-pills");

  const variantField = document.getElementById("order-variant-field");
  const sizePills = document.getElementById("order-size-pills");
  const variantSelect = document.getElementById("order-variant");

  const studioSpecsText = document.getElementById("studio-specs-text");
  const studioTagBadge = document.getElementById("studio-tag-badge");
  const studioModeBadge = document.getElementById("studio-mode-badge");
  const studioExtraBadge = document.getElementById("studio-extra-badge");

  const btnSubmitWhatsapp = document.getElementById("btn-submit-order-whatsapp");
  const btnSubmitSystem = document.getElementById("btn-submit-order-system");

  // Estado dinâmico do estúdio de personalização
  let currentProd = null;
  let isCustom = false;
  let selectedFont = { id: "mono", label: "Técnica", family: "'JetBrains Mono', monospace" };
  let selectedPos = { id: "frente", label: "Frente (Abaixo do Brasão)" };
  let selectedSize = null;
  let submitTarget = "whatsapp";

  // Filtros por categoria na lojinha
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

  // Fechar modal de estúdio
  document.getElementById("btn-close-shop-order")?.addEventListener("click", () => {
    dlgOrder?.close();
  });

  // Atualizador do Mockup e Preço ao Vivo
  function updateStudioLivePreview() {
    if (!currentProd) return;
    const overlay = document.getElementById("studio-overlay-text");
    const laserIndicator = document.getElementById("studio-laser-indicator");
    const laserText = document.getElementById("studio-laser-text");
    const priceBaseEl = document.getElementById("studio-price-base");
    const feeRow = document.getElementById("studio-fee-row");
    const priceTotalEl = document.getElementById("studio-price-total");

    const basePrice = currentProd.precoNum;
    const extraFee = isCustom ? (currentProd.taxaPersonalizacao || 0) : 0;
    const finalPrice = basePrice + extraFee;
    const finalPriceFormatted = "R$ " + finalPrice.toFixed(2).replace('.', ',');

    if (priceBaseEl) priceBaseEl.textContent = "R$ " + basePrice.toFixed(2).replace('.', ',');
    if (priceTotalEl) priceTotalEl.textContent = finalPriceFormatted;

    if (feeRow) {
      if (isCustom && extraFee > 0) {
        feeRow.style.display = "flex";
        document.getElementById("studio-price-fee").textContent = "+ R$ " + extraFee.toFixed(2).replace('.', ',');
      } else {
        feeRow.style.display = "none";
      }
    }

    if (overlay) {
      if (isCustom) {
        overlay.style.display = "block";
        const rawText = customTextInput.value.trim();
        overlay.textContent = rawText ? rawText.toUpperCase() : "SEU NOME AQUI";
        overlay.style.fontFamily = selectedFont.family;
        overlay.className = `studio-live-overlay pos-${selectedPos.id}`;
      } else {
        overlay.style.display = "none";
      }
    }

    if (laserIndicator && laserText) {
      if (isCustom) {
        laserText.textContent = currentProd.tipoPersonalizacao || "Gravação Personalizada";
        laserIndicator.style.borderColor = "var(--cyan)";
      } else {
        laserText.textContent = "Padrão Oficial E(CA)²";
        laserIndicator.style.borderColor = "var(--border)";
      }
    }

    if (studioModeBadge) {
      studioModeBadge.style.display = isCustom ? "inline-block" : "none";
    }
  }

  // Abertura do Estúdio de Personalização ao Clicar em Produto
  document.querySelectorAll(".btn-open-order").forEach(btn => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-prod-id");
      const prod = PRODUTOS_SHOP.find(p => p.id === prodId);
      if (!prod) return;

      currentProd = prod;
      prodIdInput.value = prod.id;

      // Reset de estado
      isCustom = false;
      customEnabledInput.value = "false";
      selectedFont = prod.fontesDisponiveis?.[0] || { id: "mono", label: "Técnica", family: "'JetBrains Mono', monospace" };
      selectedPos = prod.posicoesPersonalizacao?.[0] || { id: "frente", label: "Frente (Abaixo do Brasão)" };
      fontChoiceInput.value = selectedFont.id;
      posChoiceInput.value = selectedPos.id;
      customTextInput.value = "";
      charCounter.textContent = `0 / ${prod.maxCaracteresPersonalizacao || 24}`;

      if (studioTagBadge) studioTagBadge.textContent = prod.categoria;
      if (studioSpecsText) {
        studioSpecsText.textContent = prod.descricao || "Material nobre com garantia oficial de durabilidade em laboratórios da UERGS.";
      }

      // Monta Card do Mockup ao Vivo
      previewEl.innerHTML = `
        <div class="studio-mockup-card">
          <div class="studio-canvas-container">
            ${prod.foto ? `
              <img src="${prod.foto}" alt="${escapeHtml(prod.nome)}" class="studio-mockup-img" id="studio-mockup-img">
            ` : `
              <div style="font-size: 5.5rem; user-select: none;">
                ${prod.categoria || 'ITEM'}
              </div>
            `}
            <div class="studio-live-overlay pos-frente" id="studio-overlay-text" style="display: none; font-family: ${selectedFont.family};">
              SEU NOME AQUI
            </div>
            <div class="studio-laser-indicator" id="studio-laser-indicator">
              <span class="studio-laser-dot"></span>
              <span id="studio-laser-text">Padrão Oficial E(CA)²</span>
            </div>
          </div>

          <div class="row" style="justify-content: space-between; align-items: baseline; margin-bottom: .25rem;">
            <span class="small muted">${prod.categoria}</span>
            <span class="small" style="color: var(--amber); font-weight: 600;">Lote Oficial 2026</span>
          </div>
          <h3 style="font-size: 1.15rem; margin: 0 0 .5rem;">${prod.nome}</h3>
          
          <div class="studio-breakdown-box">
            <div class="studio-breakdown-row">
              <span>Preço Base do Item:</span>
              <strong class="font-mono text-cyan" id="studio-price-base">${prod.preco}</strong>
            </div>
            <div class="studio-breakdown-row" id="studio-fee-row" style="display: none;">
              <span>Adicional de Personalização:</span>
              <strong class="font-mono text-amber" id="studio-price-fee">+ R$ 0,00</strong>
            </div>
            <div class="studio-breakdown-row total">
              <span>Total Estimado:</span>
              <strong class="font-mono text-cyan" id="studio-price-total">${prod.preco}</strong>
            </div>
          </div>
        </div>
      `;

      // Configuração de Personalização (se o produto permitir)
      if (prod.permitePersonalizacao) {
        customToggleSection.style.display = "block";
        btnModeStandard.classList.add("active");
        btnModeCustom.classList.remove("active");
        customPanel.style.display = "none";
        if (studioExtraBadge) studioExtraBadge.textContent = prod.taxaPersonalizacaoTexto || "+ R$ 5,00";

        // Sugestões Rápidas
        if (suggestionChips) {
          const sugestoes = prod.sugestoesRapidas || ["SEU NOME", "NOME · TURMA 2026", "ENG. CONTROLE"];
          suggestionChips.innerHTML = sugestoes.map(s => `
            <button type="button" class="studio-chip-btn">${escapeHtml(s)}</button>
          `).join("");
          suggestionChips.querySelectorAll(".studio-chip-btn").forEach(chipBtn => {
            chipBtn.addEventListener("click", () => {
              customTextInput.value = chipBtn.textContent.trim();
              charCounter.textContent = `${customTextInput.value.length} / ${prod.maxCaracteresPersonalizacao || 24}`;
              updateStudioLivePreview();
            });
          });
        }

        // Seletor de Fontes
        if (fontPills) {
          const fontes = prod.fontesDisponiveis || [selectedFont];
          fontPills.innerHTML = fontes.map((f, idx) => `
            <button type="button" class="pill-btn ${idx === 0 ? 'active' : ''}" data-font-id="${f.id}">
              ${escapeHtml(f.label)}
            </button>
          `).join("");
          fontPills.querySelectorAll(".pill-btn").forEach(pBtn => {
            pBtn.addEventListener("click", () => {
              fontPills.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
              pBtn.classList.add("active");
              const fid = pBtn.getAttribute("data-font-id");
              const found = prod.fontesDisponiveis?.find(x => x.id === fid);
              if (found) {
                selectedFont = found;
                fontChoiceInput.value = found.id;
                updateStudioLivePreview();
              }
            });
          });
        }

        // Seletor de Posições
        if (posPills) {
          const posicoes = prod.posicoesPersonalizacao || [selectedPos];
          posPills.innerHTML = posicoes.map((p, idx) => `
            <button type="button" class="pill-btn ${idx === 0 ? 'active' : ''}" data-pos-id="${p.id}">
              ${escapeHtml(p.label)}
            </button>
          `).join("");
          posPills.querySelectorAll(".pill-btn").forEach(pBtn => {
            pBtn.addEventListener("click", () => {
              posPills.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
              pBtn.classList.add("active");
              const pid = pBtn.getAttribute("data-pos-id");
              const found = prod.posicoesPersonalizacao?.find(x => x.id === pid);
              if (found) {
                selectedPos = found;
                posChoiceInput.value = found.id;
                updateStudioLivePreview();
              }
            });
          });
        }
      } else {
        customToggleSection.style.display = "none";
        customPanel.style.display = "none";
      }

      // Configuração de Tamanhos (Vestuário)
      if (prod.tamanhos && prod.tamanhos.length) {
        variantField.style.display = "block";
        selectedSize = prod.tamanhos[1] || prod.tamanhos[0];
        sizePills.innerHTML = prod.tamanhos.map(s => `
          <button type="button" class="pill-btn ${s === selectedSize ? 'active' : ''}" data-size="${s}">
            ${s}
          </button>
        `).join("");
        variantSelect.innerHTML = prod.tamanhos.map(s => `<option value="${s}" ${s === selectedSize ? 'selected' : ''}>${s}</option>`).join("");
        
        sizePills.querySelectorAll(".pill-btn").forEach(sBtn => {
          sBtn.addEventListener("click", () => {
            sizePills.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
            sBtn.classList.add("active");
            selectedSize = sBtn.getAttribute("data-size");
            variantSelect.value = selectedSize;
          });
        });
      } else {
        variantField.style.display = "none";
        selectedSize = null;
      }

      // Preenchimento de dados de perfil do aluno se logado
      const auth = getAuth();
      if (auth.user) {
        store.getStudentProfile(auth.user.id).then(prof => {
          if (prof?.display_name && formOrder.name) formOrder.name.value = prof.display_name;
          if (prof?.semester && formOrder.semester) formOrder.semester.value = prof.semester;
          if (prof?.whatsapp && formOrder.whatsapp) formOrder.whatsapp.value = prof.whatsapp;
        }).catch(() => {});
      }

      updateStudioLivePreview();
      dlgOrder?.showModal();
    });
  });

  // Toggle Modo Padrão Oficial
  btnModeStandard?.addEventListener("click", () => {
    isCustom = false;
    customEnabledInput.value = "false";
    btnModeStandard.classList.add("active");
    btnModeCustom.classList.remove("active");
    customPanel.style.display = "none";
    updateStudioLivePreview();
  });

  // Toggle Modo Personalizado a Laser
  btnModeCustom?.addEventListener("click", () => {
    isCustom = true;
    customEnabledInput.value = "true";
    btnModeCustom.classList.add("active");
    btnModeStandard.classList.remove("active");
    customPanel.style.display = "grid";
    customTextInput.focus();
    updateStudioLivePreview();
  });

  // Digitação do Texto de Gravação em Tempo Real
  customTextInput?.addEventListener("input", () => {
    const max = currentProd?.maxCaracteresPersonalizacao || 24;
    charCounter.textContent = `${customTextInput.value.length} / ${max}`;
    updateStudioLivePreview();
  });

  // Botões de ação rápida de submissão
  btnSubmitWhatsapp?.addEventListener("click", () => {
    submitTarget = "whatsapp";
  });

  btnSubmitSystem?.addEventListener("click", () => {
    submitTarget = "system";
    formOrder.requestSubmit();
  });

  // Processamento e Conclusão da Reserva / Pedido
  formOrder?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentProd) return;

    const name = formOrder.name.value.trim();
    const semester = formOrder.semester.value.trim();
    const whatsapp = formOrder.whatsapp.value.trim();
    const obs = formOrder.obs.value.trim();

    if (!name || !semester || !whatsapp) {
      showToast("Preencha seu Nome, Semestre e WhatsApp.", true);
      return;
    }

    if (isCustom && !customTextInput.value.trim()) {
      showToast("Informe o nome ou texto que deseja gravar no item.", true);
      customTextInput.focus();
      return;
    }

    const basePrice = currentProd.precoNum;
    const extraFee = isCustom ? (currentProd.taxaPersonalizacao || 0) : 0;
    const finalPriceNum = basePrice + extraFee;
    const finalPriceStr = "R$ " + finalPriceNum.toFixed(2).replace('.', ',');
    const customText = isCustom ? customTextInput.value.trim().toUpperCase() : null;

    // Estrutura de dados completa do pedido
    const orderData = {
      id: "ord_" + Date.now(),
      product_id: currentProd.id,
      product_name: currentProd.nome,
      product_base_price: currentProd.preco,
      is_customized: isCustom,
      custom_text: customText,
      font_style: isCustom ? selectedFont.label : null,
      custom_position: isCustom ? selectedPos.label : null,
      size: selectedSize || null,
      final_price: finalPriceStr,
      final_price_num: finalPriceNum,
      name,
      semester,
      whatsapp,
      obs,
      status: "pendente",
      created_at: new Date().toISOString()
    };

    // Salva no LocalStorage
    const existing = JSON.parse(localStorage.getItem("eca2_orders") || "[]");
    existing.unshift(orderData);
    localStorage.setItem("eca2_orders", JSON.stringify(existing));

    // Salva no Store/Backend
    if (store.orders?.create) {
      store.orders.create(orderData).catch(err => console.warn("Erro ao salvar pedido no store:", err));
    }

    // Se selecionou envio no WhatsApp do CA
    if (submitTarget === "whatsapp") {
      const msg = [
        `*NOVA ENCOMENDA · LOJINHA E(CA)² UERGS*`,
        `----------------------------------------`,
        `*Produto:* ${currentProd.nome}`,
        `*Valor Total:* ${finalPriceStr}`,
        isCustom ? `*Personalização:* SIM (${currentProd.tipoPersonalizacao || 'Gravação'})` : `*Personalização:* Não (Padrão Oficial)`,
        isCustom ? `*Texto Gravado:* ${customText}` : null,
        isCustom ? `*Posição:* ${selectedPos.label}` : null,
        isCustom ? `*Fonte:* ${selectedFont.label}` : null,
        selectedSize ? `*Tamanho:* ${selectedSize}` : null,
        `----------------------------------------`,
        `*Estudante:* ${name}`,
        `*Semestre:* ${semester}`,
        `*WhatsApp:* ${whatsapp}`,
        obs ? `*Obs:* ${obs}` : null,
        `----------------------------------------`,
        `*Chave PIX:* ca.eca2.uergs@gmail.com`,
        `_Estou enviando este pedido oficial com personalização configurada no site._`
      ].filter(Boolean).join("\n");

      const waUrl = `https://api.whatsapp.com/send?phone=5551989508930&text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    dlgOrder?.close();
    formOrder.reset();
    showToast(`Encomenda de ${currentProd.nome} ${isCustom ? 'personalizada ' : ''}registrada com sucesso!`);
  });
}

// -------------------------------------------------------------
// VISTA: DOCUMENTOS OFICIAIS & ESTATUTOS (PDFs)
// -------------------------------------------------------------
function renderDocumentosHtml() {
  const docs = DOCUMENTOS_OFICIAIS;

  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Transparência & Base Jurídica</span>
          <h2>Estatutos & Documentos Oficiais</h2>
          <p>
            Consulte os Projetos Pedagógicos de Curso (PPCs 2024 e 2019), o Estatuto Social do E(CA)² e as resoluções institucionais em formato PDF padronizado.
            Garantia de conformidade com a Lei Federal nº 7.395/1985 e transparência total para todos os estudantes de Engenharia de Controle e Automação da UERGS.
          </p>
        </div>

        <!-- Grade com os Documentos Oficiais do Curso e do Centro Acadêmico -->
        <div class="grid grid-2" style="margin-bottom: 3.5rem; align-items: stretch; gap: 1.5rem;">
          ${docs.map(doc => `
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
                    Visualizar no Portal
                  </button>
                </div>
                <a href="${doc.arquivo}" target="_blank" rel="noopener noreferrer" class="small muted" style="text-align: center; display: block; text-decoration: underline;">
                  Abrir arquivo PDF em nova aba do navegador ↗
                </a>
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
              <a href="#perfil" class="btn btn-primary">Meu Perfil & Matrícula</a>
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

// (Módulos da assembleia de fundação e salchipão foram concluídos e arquivados em _arquivo_historico_fundacao_26)

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
      showToast("Proposta publicada com sucesso!");
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
            <div class="badge amber">IDEIA</div>
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
                    <span class="badge cyan" style="font-size: .72rem; padding: .15rem .55rem;">Resposta Oficial da Diretoria E(CA)²</span>
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
                    <span>${escapeHtml(opt.label)} ${isMyVote ? '(Seu voto)' : ''}</span>
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
    let topics = [];
    try {
      topics = await store.topics.list();
    } catch (fetchErr) {
      console.warn("Fórum: falha ao buscar da nuvem, carregando tópicos locais:", fetchErr);
      const demo = typeof createDemoStore === "function" ? createDemoStore() : null;
      topics = demo ? await demo.topics.list() : [];
    }

    if (!topics || topics.length === 0) {
      listEl.innerHTML = `<div class="card empty"><p>Nenhum tópico criado ainda. Comece a conversa!</p></div>`;
      return;
    }

    listEl.innerHTML = topics.map(t => {
      const isPinned = t.pinned || t.id === 1;
      return `
        <div class="card topic-row hover ${isPinned ? 'topic-pinned' : ''}" style="${isPinned ? 'border-left: 3px solid var(--amber); background: hsl(35 100% 50% / .03);' : ''}">
          <div>
            <div class="row" style="margin-bottom: .25rem; align-items: center; gap: .4rem;">
              <span class="badge slate">${escapeHtml(t.category)}</span>
              ${isPinned ? '<span class="badge amber" style="font-size: .68rem;">Destaque · Oficial</span>' : ''}
              <span class="small muted">por ${escapeHtml(t.author || 'Membro E(CA)²')} ${t.semester ? `(${escapeHtml(t.semester)})` : ''} · ${formatRelativeTime(t.created_at)}</span>
            </div>
            <h3 style="font-size: 1.15rem; margin-top: .15rem;"><a href="#forum/${t.id}" data-topic-link="${t.id}">${escapeHtml(t.title)}</a></h3>
          </div>
          <div class="reply-count">
            <span class="n">${t.reply_count || 0}</span>
            <span class="small muted">respostas</span>
          </div>
        </div>
      `;
    }).join("");

    listEl.querySelectorAll("[data-topic-link]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = Number(a.getAttribute("data-topic-link"));
        navigate("forum", id);
      });
    });

  } catch (err) {
    listEl.innerHTML = `<div class="card error"><p>${escapeHtml(err.message)}</p></div>`;
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
      <div class="card" style="margin-bottom: 2.5rem; background: var(--surface); border: 1px solid var(--border-strong);">
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
                <span class="badge cyan">PPC 2024</span>
                <span class="badge" style="background: hsl(152 68% 52% / .2); color: var(--green); border: 1px solid hsl(152 68% 52% / .4); font-size: .75rem;">GRADE VIGENTE</span>
              </div>
              <h4 style="margin: 0 0 .35rem; font-size: 1.05rem;">PPC 2024 (Resolução CONEPE 016/2023)</h4>
              <p class="small muted" style="margin: 0 0 1rem; font-size: .82rem;">
                Grade curricular atual com 4.015h, 235 créditos, matriz dos 10 módulos, 410h de extensão universitária e ementário completo.
              </p>
            </div>
            <div class="row" style="gap: .6rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary btn-sm btn-preview-pdf" data-pdf-url="pdf/PPC_Controle_Automacao_2024_Vigente.pdf" data-pdf-title="PPC 2024 Vigente - Eng. de Controle e Automação UERGS">
                Ler no Navegador
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
                <span class="badge amber">PPC 2019</span>
                <span class="badge" style="background: hsl(222 25% 20%); color: var(--muted); border: 1px solid var(--border); font-size: .75rem;">GRADE HISTÓRICA</span>
              </div>
              <h4 style="margin: 0 0 .35rem; font-size: 1.05rem;">PPC 2019 (Resolução CONEPE 037/2019)</h4>
              <p class="small muted" style="margin: 0 0 1rem; font-size: .82rem;">
                Matriz anterior de 3.765h. Essencial para acompanhamento de transição curricular, direitos adquiridos e equivalências de disciplinas.
              </p>
            </div>
            <div class="row" style="gap: .6rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-ghost btn-sm btn-preview-pdf" data-pdf-url="pdf/PPC_Controle_Automacao_2019_Antigo.pdf" data-pdf-title="PPC 2019 Histórico - Eng. de Controle e Automação UERGS">
                Ler no Navegador
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
                PPC 2024 (Vigente · 4.015h)
              </button>
              <button type="button" class="dep-ppc-btn" id="btn-ppc-2019" data-ppc="2019">
                PPC 2019 (Histórico · 3.765h)
              </button>
            </div>
          </div>

          <!-- Filtro de Grandes Áreas -->
          <div class="dep-areas-bar" id="dep-area-filters">
            <span class="small faint" style="margin-right: .25rem;">Área:</span>
            <button type="button" class="dep-area-btn active" data-area="all">Todas</button>
            <button type="button" class="dep-area-btn" data-area="matematica">Matemática</button>
            <button type="button" class="dep-area-btn" data-area="fisica">Física & Térmica</button>
            <button type="button" class="dep-area-btn" data-area="computacao">Computação</button>
            <button type="button" class="dep-area-btn" data-area="eletronica">Eletrônica</button>
            <button type="button" class="dep-area-btn" data-area="controle">Controle & Robótica</button>
            <button type="button" class="dep-area-btn" data-area="mecanica">Mecânica</button>
          </div>

          <!-- Botões de Ação -->
          <div class="row" style="gap: .5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-export-dep-svg" title="Baixar imagem vetorial SVG da árvore do PPC selecionado">
              Baixar Imagem (SVG)
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-dep-selection" style="display: none;">
              Limpar Seleção
            </button>
          </div>
        </div>

        <!-- Banner de Estatísticas da Versão Selecionada -->
        <div class="dep-stats-banner" id="dep-stats-banner"></div>

        <!-- Inspetor de Disciplina Selecionada -->
        <div class="dep-inspector-box empty" id="dep-inspector">
          <strong>Instrução:</strong> Clique em qualquer matéria no mapa abaixo para traçar automaticamente sua cadeia de pré-requisitos (<span style="color: var(--green); font-weight: 600;">verde</span>) e as matérias que ela destrava (<span style="color: var(--amber); font-weight: 600;">laranja</span>).
        </div>

        <!-- Dica móvel de navegação -->
        <div class="dep-mobile-scroll-hint small muted" style="display: none; align-items: center; gap: .4rem; margin-bottom: .6rem; font-size: .82rem;">
          <em>Deslize horizontalmente para navegar pelos 10 módulos</em>
        </div>

        <!-- Visualizador Gráfico com Scroll Horizontal -->
        <div class="dep-graph-scroll" id="dep-graph-scroll">
          <svg class="dep-svg-canvas" id="dep-svg-canvas" style="display: none !important;"></svg>
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
          <input type="search" id="curso-search-input" class="input" placeholder="Filtrar disciplinas por código, nome ou pré-requisito (ex: Cálculo, CLP, ROBOT, Física)..." style="width: 100%; max-width: 500px; padding: .65rem 1rem;">
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
          <div class="badge cyan" style="margin-bottom: .5rem;">CURRÍCULO</div>
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
                  <strong>Foco:</strong> ${m.foco}
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
                Componentes optativos para aprofundamento específico em áreas de interesse do estudante.
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
            <span class="badge green">EXTENSÃO</span>
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
          <div class="small" style="color: var(--cyan); font-weight: 700; margin-bottom: .25rem;">Papel Ativo do Centro Acadêmico E(CA)²:</div>
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
              ${pt.ppc2024}
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
      <div class="card" style="margin-bottom: 2.5rem; background: var(--surface); border: 1px solid var(--border-strong);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 .35rem; font-size: 1.25rem;">Oportunidades Oficiais da UERGS para Engenharia</h3>
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
                  <div class="modalidade-title">${m.nome}</div>
                  <div class="modalidade-desc">${m.detalhes}</div>
                  <div class="modalidade-req"><strong>Requisitos:</strong> ${m.requisitos}</div>
                </div>
              `).join("")}
            </div>

            <div class="beneficio-inscricao-box">
              <strong>Como se inscrever / Editais:</strong>
              <p style="margin: .35rem 0 0; font-size: .85rem; line-height: 1.5; color: var(--text);">${cat.comoInscrever}</p>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Caixa de Apoio do Centro Acadêmico -->
      <div class="card" style="border: 1px solid var(--border-strong); background: var(--surface); margin-bottom: 3.5rem;">
        <div class="row" style="align-items: flex-start; gap: 1rem;">
          <span class="badge amber">COMUNICADO</span>
          <div style="flex: 1; min-width: 0;">
            <h3 style="margin: 0 0 .35rem; color: var(--amber);">Como o Centro Acadêmico E(CA)² atua nos Benefícios?</h3>
            <p class="small muted" style="margin: 0 0 1rem; line-height: 1.6;">
              O Centro Acadêmico tem assento e voz ativa nas instâncias deliberativas da UERGS. Defendemos a abertura periódica de editais de monitoria remunerada em disciplinas com alta taxa de retenção (como Cálculo e CLP), cobramos celeridade nos repasses de auxílio PRAE e auxiliamos novos alunos no preenchimento de recursos e cadastros socioeconômicos.
            </p>
            <div class="row" style="gap: .75rem; flex-wrap: wrap;">
              <a href="#mural" class="btn btn-primary btn-sm">Sugerir Demanda de Monitoria no Mural</a>
              <a href="#forum" class="btn btn-ghost btn-sm">Tirar Dúvidas no Fórum</a>
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
        <a href="#mural" class="btn btn-primary btn-sm">Registrar Demanda de Laboratório no Mural</a>
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
            <h3>Ficha Técnica do Curso</h3>
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
            <h3>Perfil da Engenheira e do Engenheiro UERGS</h3>
            <p class="muted small" style="margin-top: .75rem; line-height: 1.7;">
              ${CURSO.perfilEgresso}
            </p>
            <div style="margin-top: 1.25rem; padding: 1rem; background: hsl(222 30% 12% / .6); border-radius: var(--radius-sm); border: 1px solid var(--border);">
              <div class="small" style="font-weight: 600; color: var(--cyan); margin-bottom: .25rem;">Integração Multidisciplinar:</div>
              <div class="small muted">
                O curso une o rigor da Mecânica e Termofluidos, a precisão da Eletrônica de Potência e Instrumentação, e a vanguarda dos Sistemas Ciber-físicos, Robótica e Inteligência Artificial.
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 1.5rem; gap: .5rem; flex-wrap: wrap;">
            <a href="#mural" class="btn btn-ghost btn-sm">Sugerir Melhoria de Laboratório</a>
            <a href="#forum" class="btn btn-ghost btn-sm">Debates do Curso</a>
          </div>
        </div>
      </div>

      <!-- Gráfico / Barra de Distribuição de Horas -->
      <div class="card" style="margin-bottom: 3.5rem;">
        <div class="row" style="justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem;">
          <h3>Distribuição da Carga Horária Curricular</h3>
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
      <div class="card" style="margin-bottom: 2.5rem; background: var(--surface); border: 1px solid var(--border-strong);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 .35rem; font-size: 1.25rem;">Conexão Direta entre Academia e Indústria</h3>
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
            <span class="badge cyan">OBRIGATÓRIO</span>
            <span class="badge" style="background: hsl(189 94% 55% / .15); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .3); font-size: .75rem;">
              ${ESTAGIOS_MERCADO.estagios.obrigatorio.badge}
            </span>
          </div>
          <h3 style="margin: 0 0 .25rem; font-size: 1.2rem;">${ESTAGIOS_MERCADO.estagios.obrigatorio.titulo}</h3>
          <div class="small" style="color: var(--cyan); font-family: var(--font-mono); margin-bottom: .75rem;">
            ${ESTAGIOS_MERCADO.estagios.obrigatorio.ch} · ${ESTAGIOS_MERCADO.estagios.obrigatorio.semestreRecomendado}
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
            <span class="badge amber">EXTRACURRICULAR</span>
            <span class="badge" style="background: hsl(152 68% 52% / .15); color: var(--green); border: 1px solid hsl(152 68% 52% / .3); font-size: .75rem;">
              ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.badge}
            </span>
          </div>
          <h3 style="margin: 0 0 .25rem; font-size: 1.2rem;">${ESTAGIOS_MERCADO.estagios.naoObrigatorio.titulo}</h3>
          <div class="small" style="color: var(--green); font-family: var(--font-mono); margin-bottom: .75rem;">
            ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.ch} · ${ESTAGIOS_MERCADO.estagios.naoObrigatorio.semestreRecomendado}
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
        <h3 style="margin: 0 0 1.25rem; font-size: 1.2rem;">Fluxo Passo a Passo: Do Contrato à Validação</h3>
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
        <h3 style="margin: 0 0 1rem; font-size: 1.2rem;">Agentes Integradores e Convênios Homologados</h3>
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
      <div class="card" style="margin-bottom: 3.5rem; border: 1px solid var(--border-strong); background: var(--surface);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
          <div>
            <div class="row" style="gap: .5rem; align-items: center;">
              <span class="badge cyan" style="font-size: .75rem;">MURAL ATIVO</span>
              <h3 style="margin: 0; font-size: 1.25rem;">Vagas de Estágio & Trainee Cadastradas</h3>
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
              <span class="badge cyan">UERGS</span>
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
              <span class="badge amber">CREA-RS</span>
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
            <strong>Apoio do E(CA)²:</strong> ${ESTAGIOS_MERCADO.mercadoCREA.pisoSalarial.observacao}
          </p>
        </div>
      </div>

      <!-- Polos Industriais Empregadores no RS -->
      <div class="card" style="margin-bottom: 3.5rem;">
        <h3 style="margin: 0 0 .5rem; font-size: 1.2rem;">Principais Polos Empregadores no Rio Grande do Sul</h3>
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
            <span class="course-hero-badge">${CURSO.resolucaoVigente}</span>
            <span class="badge" style="background: hsl(222 25% 15%); color: var(--muted); border: 1px solid var(--border); font-size: .8rem; white-space: normal; text-align: center; max-width: 100%;">Anterior: ${CURSO.resolucaoAnterior}</span>
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
          <div class="badge slate">SEM VAGAS</div>
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
                  <span class="small faint" style="font-size: .75rem;">${v.modalidade === 'remoto' ? 'Remoto' : (v.modalidade === 'hibrido' ? 'Híbrido' : 'Presencial')}</span>
                </div>
                <h4 style="margin: 0 0 .35rem; font-size: 1.1rem; line-height: 1.35; color: var(--text);">${escapeHtml(v.titulo)}</h4>
                <div class="small" style="color: var(--cyan); font-weight: 600; margin-bottom: .6rem;">${escapeHtml(v.empresa)} · ${escapeHtml(v.localizacao || 'Porto Alegre / RS')}</div>
                
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
                  <span class="small" style="color: var(--green); font-weight: 700; font-size: .95rem;">${remunText}</span>
                  <span class="small faint" style="font-size: .75rem;">⏱️ ${cargaText}</span>
                </div>
                <div class="row" style="gap: .5rem;">
                  <a href="${link}" ${isExternal ? 'target="_blank" rel="noopener"' : ''} class="btn btn-primary btn-sm" style="flex: 1; text-align: center; font-size: .82rem;">
                    Candidate-se ${isExternal ? '↗' : ''}
                  </a>
                  ${v.contato_email ? `
                    <a href="mailto:${escapeHtml(v.contato_email)}?subject=Candidatura%20Estágio%20UERGS%20-%20${encodeURIComponent(v.titulo)}" class="btn btn-ghost btn-sm" title="Enviar e-mail para ${escapeHtml(v.contato_email)}" style="padding: 0 .6rem;">
                      Candidatar-se
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
    matematica: "Matemática",
    fisica: "Física & Térmica",
    computacao: "Computação",
    eletronica: "Eletrônica",
    controle: "Controle & Robótica",
    mecanica: "Mecânica",
    humanas: "Gestão & Humanidades"
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

    // Atualiza Painel Inspetor com Telemetria e Nível de Impacto
    const directPrereqs = disc.pre || [];
    const directUnlocks = unlocksMap.get(code) || [];
    const areaName = areaLabels[disc.area] || disc.area;

    let impactoTag = '<span class="badge slate">[ IMPACTO: LIVRE ]</span>';
    if (allUnlocks.size >= 6) {
      impactoTag = `<span class="badge red"><span class="led-dot red"></span> [ TRAVA CRÍTICA · ${allUnlocks.size} MATÉRIAS ]</span>`;
    } else if (allUnlocks.size >= 2) {
      impactoTag = `<span class="badge amber"><span class="led-dot amber"></span> [ TRAVA MODERADA · ${allUnlocks.size} MATÉRIAS ]</span>`;
    } else if (allUnlocks.size === 1) {
      impactoTag = `<span class="badge cyan"><span class="led-dot cyan"></span> [ TRAVA 1 DISCIPLINA ]</span>`;
    }

    inspector.className = "dep-inspector-box";
    inspector.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: .75rem; margin-bottom: .85rem;">
        <div>
          <div class="row" style="gap: .4rem; align-items: center; margin-bottom: .35rem;">
            <span class="discipline-code" style="font-size: 1rem; color: var(--cyan);">${disc.codigo}</span>
            <span class="badge" style="background: hsl(222 25% 18%); font-size: .75rem;">${disc.semTitulo}</span>
            <span class="badge" style="background: hsl(189 94% 55% / .1); color: var(--cyan); border: 1px solid hsl(189 94% 55% / .2); font-size: .75rem;">${areaName}</span>
            ${impactoTag}
          </div>
          <h3 style="margin: 0; font-size: 1.25rem; color: var(--text); font-family: var(--font-head);">${escapeHtml(disc.nome)}</h3>
        </div>
        <div class="row" style="gap: .6rem; align-items: center;">
          <span class="small muted" style="font-family: var(--font-mono);"><strong>CARGA:</strong> ${disc.ch} (${disc.cr} cr)</span>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-insp-close" style="min-height: 28px; padding: .2rem .6rem; font-family: var(--font-mono);" title="Limpar seleção">&times; DESCONECTAR</button>
        </div>
      </div>

      <div class="grid grid-2" style="gap: 1rem; border-top: 1px dashed var(--border-strong); padding-top: .85rem;">
        <!-- Bloco de Pré-requisitos -->
        <div style="background: hsl(222 35% 8% / .6); padding: .85rem; border-radius: 6px; border: 1px solid hsl(152 68% 52% / .25);">
          <div class="small" style="color: var(--green); font-weight: 700; margin-bottom: .5rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: var(--font-mono); display: inline-flex; align-items: center; gap: .35rem;">
              <span class="led-dot green"></span> ENTRADAS // PRÉ-REQUISITOS DIRETOS
            </span>
            <span class="badge green" style="font-size: .7rem;">${directPrereqs.length}</span>
          </div>
          ${directPrereqs.length === 0 ? `
            <span class="small muted" style="font-family: var(--font-mono);">Sem bloqueios de entrada (pode cursar imediatamente).</span>
          ` : `
            <div style="display: flex; flex-wrap: wrap; gap: .4rem;">
              ${directPrereqs.map(pCode => {
                const pDisc = discMap.get(pCode);
                const pName = pDisc ? pDisc.nome : pCode;
                return `<button type="button" class="btn btn-ghost btn-sm btn-dep-jump" data-jump="${pCode}" style="border: 1px solid hsl(152 68% 52% / .4); color: var(--green); font-size: .78rem; padding: .25rem .55rem; font-family: var(--font-mono);">${pCode} · ${escapeHtml(pName)}</button>`;
              }).join("")}
            </div>
            ${allPrereqs.size > directPrereqs.length ? `
              <div class="faint" style="font-size: .75rem; margin-top: .5rem; font-family: var(--font-mono);">
                ↳ +${allPrereqs.size - directPrereqs.length} requisitos na árvore upstream (dependência indireta).
              </div>
            ` : ''}
          `}
        </div>

        <!-- Bloco de Disciplinas Destravadas -->
        <div style="background: hsl(222 35% 8% / .6); padding: .85rem; border-radius: 6px; border: 1px solid hsl(35 100% 58% / .25);">
          <div class="small" style="color: var(--amber); font-weight: 700; margin-bottom: .5rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: var(--font-mono); display: inline-flex; align-items: center; gap: .35rem;">
              <span class="led-dot amber"></span> SAÍDAS // DISCIPLINAS QUE DESTRAVA
            </span>
            <span class="badge amber" style="font-size: .7rem;">${directUnlocks.length} direta(s) · ${allUnlocks.size} total</span>
          </div>
          ${directUnlocks.length === 0 ? `
            <span class="small muted" style="font-family: var(--font-mono);">Módulo terminal do semestre (não tranca disciplinas posteriores).</span>
          ` : `
            <div style="display: flex; flex-wrap: wrap; gap: .4rem;">
              ${directUnlocks.map(uCode => {
                const uDisc = discMap.get(uCode);
                const uName = uDisc ? uDisc.nome : uCode;
                return `<button type="button" class="btn btn-ghost btn-sm btn-dep-jump" data-jump="${uCode}" style="border: 1px solid hsl(35 100% 58% / .4); color: var(--amber); font-size: .78rem; padding: .25rem .55rem; font-family: var(--font-mono);">${uCode} · ${escapeHtml(uName)}</button>`;
              }).join("")}
            </div>
            ${allUnlocks.size > directUnlocks.length ? `
              <div class="faint" style="font-size: .75rem; margin-top: .5rem; font-family: var(--font-mono);">
                ↳ Destrava em cascata <strong>${allUnlocks.size} componentes curriculares</strong> nos semestres seguintes.
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

    // Desenha as trilhas de circuito energizadas
    drawConnections(code);
  }

  function resetSelection() {
    selectedTreeCode = null;
    if (resetBtn) resetBtn.style.display = "none";
    if (svgCanvas) svgCanvas.innerHTML = "";

    const allCards = gridContainer ? gridContainer.querySelectorAll(".dep-card") : [];
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
      inspector.innerHTML = `<strong>Instrução:</strong> Clique em qualquer matéria no mapa abaixo para traçar automaticamente sua cadeia de pré-requisitos (<span style="color: var(--green); font-weight: 600;">verde</span>) e as matérias que ela destrava (<span style="color: var(--amber); font-weight: 600;">laranja</span>).`;
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
            <span class="badge ${is2024 ? 'cyan' : 'amber'}">${is2024 ? 'PPC 2024' : 'PPC 2019'}</span>
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

  const onTreeResize = () => {
    if (selectedTreeCode) drawConnections(selectedTreeCode);
  };
  window.addEventListener("resize", onTreeResize);
  window.addEventListener("hashchange", () => window.removeEventListener("resize", onTreeResize), { once: true });



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

  // Pré-carregamento dos eventos oficiais da UERGS raspados para o Campus Porto Alegre
  try {
    const poaData = await fetchUergsPoaEvents();
    if (poaData && Array.isArray(poaData.events)) {
      uergsScrapedEvents = poaData.events.map(formatUergsEventToCard);
    }
  } catch (err) {
    console.warn("Aviso ao carregar eventos da UERGS:", err);
  }

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

    const isSuper = email === "william-naiff@uergs.edu.br" || (CONFIG.isSuperAdmin && CONFIG.isSuperAdmin(email));
    if (isSuper) {
      if (authStatus) {
        authStatus.style.display = "block";
        authStatus.innerHTML = `
          <div class="badge" style="display: block; font-size: .8rem; padding: .4rem .65rem; text-align: left; border-radius: var(--radius-sm); background: linear-gradient(135deg, hsl(38 92% 50% / .2), hsl(25 95% 45% / .2)); border: 1px solid var(--amber); color: #f59e0b;">
            👑 <strong>Super Administrador Identificado:</strong> William Robertson Bica Naiff
          </div>
        `;
      }
      if (authHint) authHint.style.display = "none";
      if (authExtraFields) authExtraFields.style.display = "none";
      return;
    }

    const student = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(email) : null;
    if (student) {
      if (authStatus) {
        authStatus.style.display = "block";
        authStatus.innerHTML = `
          <div class="badge green" style="display: block; font-size: .8rem; padding: .35rem .6rem; text-align: left; border-radius: var(--radius-sm);">
            Estudante homologado(a): <strong>${escapeHtml(student.name)}</strong>
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

  // Alternar visualização da senha
  const btnToggleAuthPwd = document.getElementById("btn-toggle-auth-pwd");
  const authPwdInput = document.getElementById("auth-password");
  btnToggleAuthPwd?.addEventListener("click", () => {
    if (!authPwdInput) return;
    const isPwd = authPwdInput.type === "password";
    authPwdInput.type = isPwd ? "text" : "password";
    btnToggleAuthPwd.textContent = isPwd ? "Ocultar Senha" : "Mostrar Senha";
  });

  // Form de Login & Registro Rápido
  document.getElementById("form-auth")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("auth-email")?.value.trim();
    const password = document.getElementById("auth-password")?.value.trim();
    const emailErr = document.getElementById("auth-email-err");
    const pwdErr = document.getElementById("auth-password-err");

    if (emailErr) emailErr.style.display = "none";
    if (pwdErr) pwdErr.style.display = "none";

    if (!email || !email.includes("@")) {
      if (emailErr) {
        emailErr.textContent = "Por favor, insira um e-mail válido.";
        emailErr.style.display = "block";
      }
      showToast("Por favor, informe seu e-mail institucional.", true);
      return;
    }

    if (!password) {
      if (pwdErr) {
        pwdErr.textContent = "Por favor, digite sua senha de acesso.";
        pwdErr.style.display = "block";
      }
      showToast("Digite sua senha de acesso.", true);
      return;
    }

    const cleanEmail = email.toLowerCase();
    const isSuper = cleanEmail === "william-naiff@uergs.edu.br" || (CONFIG.isSuperAdmin && CONFIG.isSuperAdmin(cleanEmail));
    const student = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(cleanEmail) : null;
    const extraName = document.getElementById("auth-name")?.value.trim();
    const extraSem = document.getElementById("auth-sem")?.value;
    const extraReg = document.getElementById("auth-reg")?.value.trim();
    const isEcaChecked = document.getElementById("auth-eca-confirm")?.checked;

    if (!isSuper && !student && !isEcaChecked) {
      showToast("É obrigatório comprovar/declarar vínculo com Engenharia de Controle e Automação.", true);
      return;
    }

    try {
      const msg = await store.signIn(email, password, {
        display_name: isSuper ? "William Robertson Bica Naiff" : (student ? student.name : (extraName || email.split("@")[0])),
        semester: isSuper ? "10º semestre" : (extraSem || "1º semestre"),
        registration: extraReg || (isSuper ? "2024019200" : ""),
        is_eca_student: !!(isSuper || student || isEcaChecked),
      });
      showToast(msg);
      dlgAuth?.close();
      renderCurrentView();
    } catch (err) {
      if (pwdErr && (err.message.includes("senha") || err.message.includes("Senha"))) {
        pwdErr.textContent = err.message;
        pwdErr.style.display = "block";
      }
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
    toggleBtn.innerHTML = isOpen ? "&times;" : "Menu";
    toggleBtn.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
  });

  // Fechar menu mobile ao clicar em links de navegação
  navLinks?.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      navLinks.classList.remove("open");
      toggleBtn?.setAttribute("aria-expanded", "false");
      if (toggleBtn) toggleBtn.innerHTML = "Menu";
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
