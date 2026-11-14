import { CONFIG } from "./config.js";
import { CURSO, PRINCIPIOS, LINHA_DO_TEMPO, FAQ, CATEGORIAS_SUGESTAO, CATEGORIAS_FORUM, STATUS_SUGESTAO, PRODUTOS_SHOP, DOCUMENTOS_OFICIAIS, ARVORES_PPC, BENEFICIOS_UERGS, CALENDARIO_EVENTOS, ESTAGIOS_MERCADO, CORPO_DOCENTE_NDE, REGRAS_AC_EXTENSAO, TABELA_EQUIVALENCIAS, EMENTARIO_PPC2024 } from "./content.js";
import { createStore, onAuth, getAuth } from "./store.js";
import { parseTranscript, getAcademicMetrics, getEnrollmentOptimizer, detectScheduleConflicts, simulatePpcMigration, buildWeeklyTimetableGrid, generateTimetableIcs, calculateUergsConceptAndExam } from "./modules/academic.js";
import { fetchUergsPoaEvents, formatUergsEventToCard } from "./services/uergs-events.js";

// Estado global do aplicativo
let store;
let currentRoute = "inicio";
let topicDetailId = null;
let currentCursoTab = "perfil";
let currentProfileTab = "historico"; // "historico" | "matricula" | "cadastro"
let uergsScrapedEvents = [];
let activePerfilTabSwitcher = null;
const cachedTreeMaps = {};

function getTodayIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAllEventsCombined() {
  const all = [...CALENDARIO_EVENTOS, ...uergsScrapedEvents];
  return all.sort((a, b) => (a.data || "").localeCompare(b.data || ""));
}

function getUpcomingEventsCombined() {
  const today = getTodayIso();
  return getAllEventsCombined().filter(e => (e.data || "") >= today);
}

function getPastEventsCombined() {
  const today = getTodayIso();
  return getAllEventsCombined().filter(e => (e.data || "") < today);
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
  const prevRoute = currentRoute;
  currentRoute = route;
  topicDetailId = id;
  if (route === "curso") {
    currentCursoTab = id || "perfil";
  } else if (route === "perfil") {
    currentProfileTab = "historico";
  } else if (route === "matricula") {
    currentProfileTab = "matricula";
  } else if (route === "registro") {
    currentProfileTab = "cadastro";
  }
  const targetHash = id ? `${route}/${id}` : route;
  if (window.location.hash !== `#${targetHash}`) {
    history.pushState(null, "", `#${targetHash}`);
  }
  
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

  const ddCa = document.getElementById("btn-ca-toggle");
  if (ddCa) {
    if (["ca", "sobre", "documentos", "transparencia", "ouvidoria", "fundacao", "eleicao", "estatutos"].includes(route)) {
      ddCa.setAttribute("aria-current", "page");
    } else {
      ddCa.removeAttribute("aria-current");
    }
  }

  const ddEstudante = document.getElementById("btn-estudante-toggle");
  if (ddEstudante) {
    if (["perfil", "matricula", "mural", "forum", "faq", "registro"].includes(route)) {
      ddEstudante.setAttribute("aria-current", "page");
    } else {
      ddEstudante.removeAttribute("aria-current");
    }
  }

  const ddUergs = document.getElementById("btn-uergs-toggle");
  if (ddUergs) {
    if (route === "beneficios" || (route === "curso" && currentCursoTab === "beneficios")) {
      ddUergs.setAttribute("aria-current", "page");
    } else {
      ddUergs.removeAttribute("aria-current");
    }
  }

  // Fecha menu mobile e qualquer dropdown aberto instantaneamente
  document.getElementById("nav-links")?.classList.remove("open");
  if (document.activeElement && document.activeElement.closest?.(".nav-dropdown")) {
    document.activeElement.blur();
  }
  document.querySelectorAll(".nav-dropdown").forEach((d) => {
    d.classList.remove("open");
    d.classList.add("closing");
    d.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });

  window.scrollTo({ top: 0, behavior: "instant" });
  renderCurrentView(prevRoute);
}

async function renderCurrentView(prevRoute = null) {
  const root = document.getElementById("app-root");
  if (!root) return;

  // Fast-path 1: Troca instantânea entre submenus do Curso (#curso/*)
  if (prevRoute === "curso" && currentRoute === "curso") {
    const cursoSlot = document.getElementById("curso-tab-content");
    if (cursoSlot) {
      const { renderCursoTabContentHtml, setupCursoInteractions } = await import("./modules/curso.js");
      cursoSlot.innerHTML = renderCursoTabContentHtml(currentCursoTab);
      setupCursoInteractions(currentCursoTab, store, showToast);
      return;
    }
  }

  // Fast-path 2: Troca instantânea entre submenus do Perfil (#perfil, #matricula, #registro)
  const profileRoutes = ["perfil", "matricula", "registro"];
  if (profileRoutes.includes(prevRoute) && profileRoutes.includes(currentRoute) && activePerfilTabSwitcher && document.getElementById("perfil-tab-content")) {
    activePerfilTabSwitcher(currentProfileTab);
    return;
  }

  activePerfilTabSwitcher = null;

  switch (currentRoute) {
    case "admin": {
      const { renderAdminHtml, setupAdminInteractions } = await import("./modules/admin.js");
      root.innerHTML = renderAdminHtml(getAuth());
      await setupAdminInteractions(store, navigate, showToast);
      break;
    }
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
    case "shop": {
      const { renderShopHtml, setupShopInteractions } = await import("./modules/shop.js");
      root.innerHTML = renderShopHtml();
      setupShopInteractions(store, showToast);
      break;
    }
    case "ca":
    case "sobre": {
      const { renderCaHtml, setupDocumentosInteractions } = await import("./modules/institucional.js");
      root.innerHTML = renderCaHtml();
      setupDocumentosInteractions();
      break;
    }
    case "documentos":
    case "estatutos": {
      const { renderDocumentosHtml, setupDocumentosInteractions } = await import("./modules/institucional.js");
      root.innerHTML = renderDocumentosHtml();
      setupDocumentosInteractions();
      break;
    }
    case "transparencia": {
      const { renderTransparenciaHtml, setupDocumentosInteractions } = await import("./modules/institucional.js");
      root.innerHTML = renderTransparenciaHtml();
      setupDocumentosInteractions();
      break;
    }
    case "ouvidoria": {
      const { renderOuvidoriaHtml, setupOuvidoriaInteractions } = await import("./modules/institucional.js");
      root.innerHTML = renderOuvidoriaHtml();
      setupOuvidoriaInteractions(store, navigate, showToast);
      break;
    }
    case "mural": {
      const { renderMuralHtml, setupMuralInteractions } = await import("./modules/comunidade.js");
      root.innerHTML = renderMuralHtml();
      await setupMuralInteractions(store, showToast, formatRelativeTime);
      break;
    }
    case "enquetes": {
      const { renderEnquetesHtml, setupEnquetesInteractions } = await import("./modules/comunidade.js");
      root.innerHTML = renderEnquetesHtml();
      await setupEnquetesInteractions(store, showToast);
      break;
    }
    case "forum": {
      const { renderForumHtml, setupForumInteractions, renderTopicDetail } = await import("./modules/comunidade.js");
      if (topicDetailId) {
        root.innerHTML = `<div class="container section"><div class="skeleton"></div></div>`;
        await renderTopicDetail(topicDetailId, store, navigate, showToast, formatRelativeTime);
      } else {
        root.innerHTML = renderForumHtml();
        await setupForumInteractions(store, navigate, showToast, formatRelativeTime);
      }
      break;
    }
    case "curso": {
      const { renderCursoHtml, setupCursoInteractions } = await import("./modules/curso.js");
      root.innerHTML = renderCursoHtml(currentCursoTab);
      setupCursoInteractions(currentCursoTab, store, showToast);
      break;
    }
    case "faq": {
      const { renderFaqHtml, setupFaqView } = await import("./modules/institucional.js");
      root.innerHTML = renderFaqHtml();
      await setupFaqView(store);
      break;
    }
    default:
      root.innerHTML = renderHomeHtml();
      setupHomeInteractions();
      break;
  }
}

// -------------------------------------------------------------

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
      if (dlBtn) { dlBtn.href = url; dlBtn.setAttribute("download", (title || "documento") + ".pdf"); }
      if (frame) frame.src = url;
      dlgPdf?.showModal();
    });
  });
  const closeBtn = document.getElementById("btn-close-pdf-viewer");
  if (closeBtn && !closeBtn.dataset.boundClose) {
    closeBtn.dataset.boundClose = "true";
    closeBtn.addEventListener("click", () => { if (frame) frame.src = "about:blank"; dlgPdf?.close(); });
  }
}

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
          <h1>Sem feedback não há controle.</h1>
          <p class="slogan">ENGENHARIA DE CONTROLE & AUTOMAÇÃO // UERGS PORTO ALEGRE</p>
          <p class="lead">
            Plataforma oficial de instrumentação acadêmica e representação discente: matrizes curriculares com comparador de PPCs, planejador de matrícula sem conflito de horário, visitas técnicas industriais, lojinha do curso e governança aberta.
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
              <div style="background: var(--bg-2); padding: .75rem; border-radius: 3px; border: 1px solid var(--border);">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--cyan); font-family: var(--font-mono);">4.015h</div>
                <div class="faint" style="font-size: .75rem; font-family: var(--font-mono);">PPC 2024 VIGENTE</div>
              </div>
              <div style="background: var(--bg-2); padding: .75rem; border-radius: 3px; border: 1px solid var(--border);">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--green); font-family: var(--font-mono);">410h</div>
                <div class="faint" style="font-size: .75rem; font-family: var(--font-mono);">EXTENSÃO OBRIGATÓRIA</div>
              </div>
              <div style="background: var(--bg-2); padding: .75rem; border-radius: 3px; border: 1px solid var(--border);">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--amber); font-family: var(--font-mono);">10 MÓDULOS</div>
                <div class="faint" style="font-size: .75rem; font-family: var(--font-mono);">GRADE INTEGRALIZADA</div>
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
              <span class="badge cyan" style="position: absolute; top: 14px; left: 14px; background: hsl(215 45% 8% / .92);">
                <span class="led-dot green"></span> LAB DE CONTROLE & AUTOMAÇÃO
              </span>
            </div>
            <div style="padding: 1.2rem 1.4rem 1.35rem;">
              <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .25rem;">
                <h2 style="font-size: 1.15rem; margin: 0;">Construído por e para estudantes</h2>
                <span style="font-family: var(--font-mono); font-size: .76rem; color: var(--cyan);">LAB 01</span>
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
              <span class="badge amber" style="font-size: .76rem;">SINAL ESTÁVEL</span>
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

    <!-- Módulos de Instrumentação de Bancada -->
    <section class="section" style="padding-top: 1rem;">
      <div class="container">
        <div class="section-head">
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
              <span class="channel-id"><span class="led-dot green"></span> MÓDULO 02 · CALENDÁRIO</span>
              <span class="channel-tag">AGENDA VIGENTE</span>
            </div>
            <h3>Calendário & Eventos</h3>
            <p>
              Programação acadêmica oficial da UERGS Porto Alegre, visitas técnicas no Polo Industrial e minicursos práticos de CLP com certificados.
            </p>
            <div class="mod-footer">
              <span>STATUS: EVENTOS VIGENTES</span>
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
          <h2>Um Centro Acadêmico Feito com Rigor Técnico</h2>
          <p>Transparência total, sem partidarismo político e com participação direta de cada semestre do curso.</p>
        </div>

        <div class="grid grid-4">
          ${PRINCIPIOS.map((p, idx) => `
            <div class="mod-card">
              <div class="mod-head">
                <span class="channel-id"><span class="led-dot cyan"></span> PILAR 0${idx + 1}</span>
                <span class="channel-tag">ESTATUTO</span>
              </div>
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

        <!-- Conteúdo Dinâmico via Submenu ESTUDANTE ▾ -->
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
    document.getElementById("dlg-auth")?.showModal();
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
    const [loadedAc, loadedOff] = await Promise.all([
      store.academic.get().catch(() => null),
      store.offerings.get().catch(() => null)
    ]);
    if (loadedAc && typeof loadedAc === "object") {
      academic = { ...academic, ...loadedAc };
    }
    if (loadedOff && typeof loadedOff === "object") {
      offerings = { ...offerings, ...loadedOff };
    }
  } catch { /* demo fallback */ }

  academic.ppc = academic.ppc || "2024";
  academic.completedCodes = Array.isArray(academic.completedCodes) ? academic.completedCodes : [];
  academic.plannedCodes = Array.isArray(academic.plannedCodes) ? academic.plannedCodes : [];
  academic.transcriptRawText = typeof academic.transcriptRawText === "string" ? academic.transcriptRawText : "";
  offerings.courses = Array.isArray(offerings.courses) ? offerings.courses : [];

  // Função interna para renderizar a aba ativa
  async function renderTab() {
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
              <a href="https://academico.uergs.edu.br/core/login" target="_blank" rel="noopener" class="small text-cyan" style="font-family: var(--font-mono); text-decoration: underline;">Acessar Portal do Aluno UERGS ↗</a>
            </div>
            <h3 style="font-size: 1.25rem; margin: 0; color: var(--text);">Importar Histórico Escolar</h3>
            <p class="small muted" style="margin: .35rem 0 0; line-height: 1.5;">
              Abra seu histórico escolar no <a href="https://academico.uergs.edu.br/core/login" target="_blank" rel="noopener" style="color: var(--cyan);">Portal do Aluno da UERGS</a>, selecione todo o texto (<kbd>Ctrl+A</kbd>), copie (<kbd>Ctrl+C</kbd>) e cole no campo abaixo. O algoritmo detectará seu PPC e marcará todas as cadeiras concluídas.
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
                    if (disc.minCr && metrics.completedCredits < disc.minCr) {
                      missing.push(`${disc.minCr} créditos`);
                    }
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

      <!-- =================================================================
           FERRAMENTA 1: RASTREADOR DE ATIVIDADES COMPLEMENTARES (AC 80h/60h) & EXTENSÃO (410h)
           ================================================================= -->
      ${(() => {
        academic.acSelectedIds ??= [];
        academic.extSelectedIds ??= [];
        const acMeta = academic.ppc === "2019" ? REGRAS_AC_EXTENSAO.ac.meta2019 : REGRAS_AC_EXTENSAO.ac.meta2024;
        const acTotal = REGRAS_AC_EXTENSAO.ac.categorias
          .filter(c => academic.acSelectedIds.includes(c.id))
          .reduce((acc, c) => acc + c.horasPorUnidade, 0);
        const acPct = Math.min(100, Math.round((acTotal / acMeta) * 100));

        let extTotal = 0;
        const extFormatsUsed = new Set();
        REGRAS_AC_EXTENSAO.extensao.modalidades.forEach((mod, mIdx) => {
          mod.itens.forEach(it => {
            if (academic.extSelectedIds.includes(it.id) || academic.completedCodes.includes(it.id.replace("ext-", "").toUpperCase())) {
              extTotal += it.horas;
              extFormatsUsed.add(mIdx + 1);
            }
          });
        });
        const extPct = Math.min(100, Math.round((extTotal / 410) * 100));

        return `
          <div class="grid grid-2" style="gap: 1.5rem; margin-bottom: 2rem; align-items: start;">
            <!-- Card Atividades Complementares (Tabela 3 do PPC) -->
            <div class="card" style="padding: 1.35rem; background: hsl(222 35% 8% / .8); border: 1px solid var(--border-strong);">
              <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .5rem;">
                <span class="badge cyan">TABELA 3 · PPC ${academic.ppc}</span>
                <span class="badge ${acTotal >= acMeta ? 'green' : 'amber'}" style="font-family: var(--font-mono);">${acTotal}h / ${acMeta}h (${acPct}%)</span>
              </div>
              <h3 style="margin: 0 0 .25rem; font-size: 1.18rem;">Rastreador de Atividades Complementares (AC)</h3>
              <p class="small muted" style="margin: 0 0 .85rem;">
                Meta oficial de <strong>${acMeta} horas</strong> para colação de grau (Ensino, Pesquisa e Extensão). Marque as atividades já realizadas:
              </p>
              <div class="academic-progress-track" style="margin-bottom: 1rem;">
                <div class="academic-progress-fill" style="width: ${acPct}%;"></div>
              </div>
              <div class="stack" style="gap: .45rem; max-height: 290px; overflow-y: auto; padding-right: .25rem;">
                ${REGRAS_AC_EXTENSAO.ac.categorias.map(cat => {
                  const checked = academic.acSelectedIds.includes(cat.id);
                  return `
                    <label style="display: flex; justify-content: space-between; align-items: center; gap: .6rem; padding: .5rem .65rem; border-radius: 6px; background: ${checked ? 'hsl(152 68% 52% / .1)' : 'hsl(222 35% 6%)'}; border: 1px solid ${checked ? 'hsl(152 68% 52% / .4)' : 'var(--border)'}; cursor: pointer; font-size: .82rem;">
                      <span style="display: flex; align-items: center; gap: .5rem;">
                        <input type="checkbox" class="chk-ac-item" data-ac-id="${cat.id}" ${checked ? 'checked' : ''}>
                        <span><strong>[${cat.eixo}]</strong> ${escapeHtml(cat.nome)}</span>
                      </span>
                      <span class="badge slate" style="font-family: var(--font-mono); font-size: .7rem; flex-shrink: 0;">+${cat.horasPorUnidade}h (máx ${cat.maxHoras}h)</span>
                    </label>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Card Curricularização da Extensão (Tabelas 4, 5 e 6 — 410h) -->
            <div class="card" style="padding: 1.35rem; background: hsl(222 35% 8% / .8); border: 1px solid var(--border-strong);">
              <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .5rem;">
                <span class="badge green">RES. CONEPE 019/2020 · TABELA 6</span>
                <span class="badge ${extTotal >= 410 && extFormatsUsed.size >= 3 ? 'green' : 'cyan'}" style="font-family: var(--font-mono);">${extTotal}h / 410h · ${extFormatsUsed.size}/3 Formatos</span>
              </div>
              <h3 style="margin: 0 0 .25rem; font-size: 1.18rem;">Rastreador da Extensão Universitária (410h)</h3>
              <p class="small muted" style="margin: 0 0 .85rem;">
                Exige <strong>410h</strong> no PPC 2024 distribuídas em <strong>no mínimo 3 dos 5 formatos</strong> da Tabela 6 (COMPEX + PROJEXT somam 180h):
              </p>
              <div class="academic-progress-track" style="margin-bottom: 1rem;">
                <div class="academic-progress-fill" style="width: ${extPct}%; background: var(--green);"></div>
              </div>
              <div class="stack" style="gap: .55rem; max-height: 290px; overflow-y: auto; padding-right: .25rem;">
                ${REGRAS_AC_EXTENSAO.extensao.modalidades.map(mod => `
                  <div style="padding: .5rem .65rem; border-radius: 6px; background: hsl(222 35% 6%); border: 1px solid var(--border);">
                    <div class="small" style="font-weight: 700; color: var(--cyan); margin-bottom: .35rem; font-size: .76rem;">${escapeHtml(mod.formato)}</div>
                    <div class="stack" style="gap: .35rem;">
                      ${mod.itens.map(it => {
                        const checked = academic.extSelectedIds.includes(it.id);
                        return `
                          <label style="display: flex; justify-content: space-between; align-items: center; gap: .5rem; cursor: pointer; font-size: .8rem;">
                            <span style="display: flex; align-items: center; gap: .45rem;">
                              <input type="checkbox" class="chk-ext-item" data-ext-id="${it.id}" ${checked ? 'checked' : ''}>
                              <span>${escapeHtml(it.nome)}</span>
                            </span>
                            <span class="badge green" style="font-family: var(--font-mono); font-size: .68rem; flex-shrink: 0;">+${it.horas}h</span>
                          </label>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `;
      })()}

      <!-- =================================================================
           FERRAMENTA 2: SIMULADOR DE MIGRAÇÃO DE CURRÍCULO (PPC 2019 ➔ PPC 2024)
           ================================================================= -->
      ${(() => {
        const mig = simulatePpcMigration(academic.completedCodes);
        return `
          <div class="card" style="padding: 1.5rem; margin-bottom: 2rem; background: hsl(222 35% 8% / .85); border: 1px solid hsl(35 100% 58% / .35);">
            <div class="row" style="justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .3rem;">
                  <span class="badge amber">QUADRO 7 & ANEXO H · PPC 2024</span>
                  <span class="badge cyan">SIMULADOR DE TRANSIÇÃO CURRICULAR</span>
                </div>
                <h3 style="margin: 0; font-size: 1.25rem;">Simulador Automático de Migração (PPC 2019 ➔ PPC 2024)</h3>
                <p class="small muted" style="margin: .25rem 0 0;">
                  Veja instantaneamente como suas disciplinas concluídas são convalidadas na matriz vigente de 2024 (ex: <code>MECSOL 90h</code> ➔ <code>MECSOL 60h + RESMAT 60h</code>; <code>FENOTR 90h</code> ➔ <code>FETRANS-MF + FETRANS-CM</code>; <code>INOVEMP</code> ➔ <code>GESINOV + ADMEMP</code>).
                </p>
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-apply-ppc-migration" style="font-family: var(--font-mono);">
                ⚡ Aplicar Equivalências no PPC 2024 (${mig.granted2024Count} matérias)
              </button>
            </div>

            <div class="grid grid-3" style="gap: 1rem; margin-bottom: 1rem;">
              <div style="padding: .85rem; background: hsl(222 35% 6%); border-radius: 6px; border: 1px solid var(--border);">
                <span class="small muted">Convalidadas no PPC 2024:</span>
                <div style="font-size: 1.35rem; font-weight: 700; color: var(--green); font-family: var(--font-mono);">${mig.granted2024Count} / ${mig.metrics2024.totalDisciplines} disciplinas</div>
                <span class="small faint">${mig.metrics2024.completedHours}h aproveitadas (${mig.metrics2024.progressPercent}%)</span>
              </div>
              <div style="padding: .85rem; background: hsl(222 35% 6%); border-radius: 6px; border: 1px solid var(--border);">
                <span class="small muted">Regras de Equivalência Aplicadas:</span>
                <div style="font-size: 1.35rem; font-weight: 700; color: var(--cyan); font-family: var(--font-mono);">${mig.appliedRules.length} regras diretas</div>
                <span class="small faint">Conforme Quadro 7 e Anexo H (p. 285)</span>
              </div>
              <div style="padding: .85rem; background: hsl(222 35% 6%); border-radius: 6px; border: 1px solid var(--border);">
                <span class="small muted">Novas Exclusivas do PPC 2024 Pendentes:</span>
                <div style="font-size: .85rem; font-weight: 700; color: var(--amber); font-family: var(--font-mono); margin-top: .25rem;">
                  ${mig.exclusiveNew2024.length > 0 ? mig.exclusiveNew2024.join(", ") : "Nenhuma pendente!"}
                </div>
                <span class="small faint">Extensão e novos componentes técnicos</span>
              </div>
            </div>
          </div>
        `;
      })()}

      <!-- =================================================================
           FERRAMENTA 3: CALCULADORA OFICIAL DE CONCEITOS (A–E), RECUPERAÇÃO & FREQUÊNCIA (75%)
           ================================================================= -->
      <div class="card" style="padding: 1.5rem; margin-bottom: 2rem; background: hsl(222 35% 8% / .85); border: 1px solid var(--border-strong);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem;">
          <div>
            <span class="badge cyan" style="margin-bottom: .25rem;">SEÇÃO 2.6 · PÁGINA 223 DO PPC 2024</span>
            <h3 style="margin: 0; font-size: 1.25rem;">Calculadora Oficial de Conceitos (A, B, C, D, E), Recuperação & Limite de Faltas (75%)</h3>
            <p class="small muted" style="margin: .2rem 0 0;">
              A UERGS avalia o rendimento por <strong>Conceitos (A ≥ 90%, B ≥ 75%, C ≥ 60%, D &lt; 60% e E por Infrequência &lt; 75%)</strong> com no mínimo 3 avaliações semestrais. Simule sua aprovação e controle suas faltas:
            </p>
          </div>
        </div>

        <div class="grid grid-2" style="gap: 1.25rem; align-items: center;">
          <div class="grid grid-2" style="gap: .75rem;">
            <div class="field">
              <label for="calc-n1" class="small">Avaliação 1 (0 a 10)</label>
              <input type="number" id="calc-n1" step="0.1" min="0" max="10" value="7.5">
            </div>
            <div class="field">
              <label for="calc-n2" class="small">Avaliação 2 (0 a 10)</label>
              <input type="number" id="calc-n2" step="0.1" min="0" max="10" value="6.5">
            </div>
            <div class="field">
              <label for="calc-n3" class="small">Avaliação 3 (0 a 10)</label>
              <input type="number" id="calc-n3" step="0.1" min="0" max="10" value="8.0">
            </div>
            <div class="field">
              <label for="calc-ch" class="small">Carga Horária da Cadeira</label>
              <select id="calc-ch">
                <option value="60" selected>60 horas (Máx. 15h de falta)</option>
                <option value="30">30 horas (Máx. 7,5h de falta)</option>
                <option value="90">90 horas (Máx. 22,5h de falta)</option>
              </select>
            </div>
            <div class="field" style="grid-column: 1 / -1;">
              <label for="calc-faltas" class="small">Horas de Falta Acumuladas</label>
              <input type="number" id="calc-faltas" step="1" min="0" max="90" value="4">
            </div>
          </div>

          <div id="calc-uergs-result-box" style="padding: 1.25rem; border-radius: 8px; background: hsl(222 40% 6%); border: 1px solid var(--cyan);">
            <!-- Preenchido via updateConceptCalculator() -->
          </div>
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

    // 6. Checkboxes do Rastreador de Atividades Complementares (AC)
    container.querySelectorAll(".chk-ac-item").forEach(chk => {
      chk.addEventListener("change", async () => {
        const id = chk.getAttribute("data-ac-id");
        academic.acSelectedIds ??= [];
        if (chk.checked) {
          if (!academic.acSelectedIds.includes(id)) academic.acSelectedIds.push(id);
        } else {
          academic.acSelectedIds = academic.acSelectedIds.filter(x => x !== id);
        }
        await store.academic.save(academic);
        renderTab();
      });
    });

    // 7. Checkboxes do Rastreador de Extensão Universitária (410h)
    container.querySelectorAll(".chk-ext-item").forEach(chk => {
      chk.addEventListener("change", async () => {
        const id = chk.getAttribute("data-ext-id");
        academic.extSelectedIds ??= [];
        if (chk.checked) {
          if (!academic.extSelectedIds.includes(id)) academic.extSelectedIds.push(id);
        } else {
          academic.extSelectedIds = academic.extSelectedIds.filter(x => x !== id);
        }
        await store.academic.save(academic);
        renderTab();
      });
    });

    // 8. Botão de Aplicar Migração PPC 2019 -> PPC 2024
    document.getElementById("btn-apply-ppc-migration")?.addEventListener("click", async () => {
      const mig = simulatePpcMigration(academic.completedCodes);
      academic.ppc = "2024";
      academic.completedCodes = mig.granted2024Codes;
      await store.academic.save(academic);
      showToast(`Migração aplicada! ${mig.granted2024Count} disciplinas convalidadas no PPC 2024.`);
      renderTab();
    });

    // 9. Calculadora Oficial de Conceitos (A, B, C, D, E) e Frequência (75%)
    function updateConceptCalculator() {
      const n1 = document.getElementById("calc-n1")?.value;
      const n2 = document.getElementById("calc-n2")?.value;
      const n3 = document.getElementById("calc-n3")?.value;
      const ch = document.getElementById("calc-ch")?.value;
      const faltas = document.getElementById("calc-faltas")?.value;
      const box = document.getElementById("calc-uergs-result-box");
      if (!box) return;

      const res = calculateUergsConceptAndExam(n1, n2, n3, faltas, ch);
      box.innerHTML = `
        <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .5rem;">
          <span class="badge ${res.badgeClass}" style="font-size: .85rem;">CONCEITO OFICIAL: ${res.concept}</span>
          <span class="small font-mono muted">Média: <strong>${res.avgGrade}</strong> (${res.avgPercent}%)</span>
        </div>
        <h4 style="margin: 0 0 .35rem; font-size: 1.05rem; color: var(--text);">${res.status}</h4>
        <p class="small muted" style="margin: 0 0 .75rem; line-height: 1.55;">${res.details}</p>
        <div class="row" style="justify-content: space-between; font-family: var(--font-mono); font-size: .78rem; padding-top: .55rem; border-top: 1px dashed var(--border);">
          <span>Frequência: <strong style="color: ${Number(res.attendancePercent) >= 75 ? 'var(--green)' : 'var(--red)'};">${res.attendancePercent}%</strong> (mín. 75%)</span>
          <span>Saldo de faltas: <strong>${res.remainingMissedHours}h</strong> restantes</span>
        </div>
      `;
    }

    ["calc-n1", "calc-n2", "calc-n3", "calc-ch", "calc-faltas"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", updateConceptCalculator);
      document.getElementById(id)?.addEventListener("change", updateConceptCalculator);
    });
    updateConceptCalculator();
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
    const timetable = buildWeeklyTimetableGrid(selectedCourseObjects);

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
      <div class="grid grid-2" style="gap: 1.5rem; align-items: start; margin-bottom: 2rem;">
        
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
                <button type="button" class="btn btn-ghost btn-sm" id="btn-export-ics-calendar" style="width: 100%; font-family: var(--font-mono); border-color: var(--cyan); color: var(--cyan);">
                  📅 Exportar p/ Google Agenda / Outlook (.ics)
                </button>
                <button type="button" class="btn btn-ghost btn-sm" id="btn-export-enrollment-plan" style="width: 100%; font-family: var(--font-mono);">
                  🖨️ Imprimir / Exportar Comprovante
                </button>
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- Grade Horária Visual Semanal (Segunda a Sábado) -->
      <div class="card" style="padding: 1.5rem; background: hsl(222 35% 8% / .85); border: 1px solid var(--border-strong);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem;">
          <div>
            <span class="badge cyan" style="margin-bottom: .25rem;">QUADRO SEMANAL VISUAL</span>
            <h3 style="margin: 0; font-size: 1.25rem;">Grade Horária Semanal (Segunda a Sábado)</h3>
            <p class="small muted" style="margin: .2rem 0 0;">
              Visualização automática por turno das disciplinas selecionadas acima. Choques de horário são destacados em vermelho.
            </p>
          </div>
        </div>

        <div class="timetable-wrap">
          <table class="timetable-table">
            <thead>
              <tr>
                <th>Turno / Horário</th>
                ${timetable.days.map(d => `<th>${d}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${timetable.slots.map(slot => `
                <tr>
                  <td class="timetable-slot-col">
                    <strong style="color: var(--text); display: block;">${slot.label}</strong>
                    <span style="font-size: .7rem;">${slot.timeRange}</span>
                  </td>
                  ${timetable.days.map(day => {
                    const cellCourses = timetable.grid[day][slot.id] || [];
                    const isConflict = cellCourses.length > 1;
                    return `
                      <td>
                        ${cellCourses.length === 0 ? `<span class="faint" style="font-size: .7rem;">—</span>` : cellCourses.map(c => `
                          <div class="timetable-pill ${isConflict ? 'is-conflict' : ''}">
                            <strong>${esc(c.code)}</strong>
                            <div style="font-size: .7rem; opacity: .9;">${esc(c.name)}</div>
                          </div>
                        `).join("")}
                      </td>
                    `;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
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

    document.getElementById("btn-export-ics-calendar")?.addEventListener("click", () => {
      const icsContent = generateTimetableIcs(selectedCourseObjects, offerings.semester || "2026/1");
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Grade_Horaria_ECA2_UERGS_${(offerings.semester || "2026_1").replace("/", "_")}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Arquivo .ics gerado! Importe no Google Agenda ou Outlook.");
    });

    document.getElementById("btn-export-enrollment-plan")?.addEventListener("click", () => {
      window.print();
    });
  }

  // -----------------------------------------------------------------
  // ABA 3: FICHA CADASTRAL DO ALUNO & CARTEIRINHA DIGITAL PCB E(CA)²
  // -----------------------------------------------------------------
  function renderTabCadastro() {
    const auth = getAuth();
    const prof = auth.profile || {};
    const isLogged = !!auth.user;
    const studentName = prof.display_name || "Estudante de Automação";
    const studentSem = prof.semester || "1º semestre";
    const studentReg = prof.registration || "UERGS-POA-2026";
    const studentEmail = auth.user?.email || "estudante@uergs.edu.br";

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
          <!-- Carteirinha Estudantil Digital / Crachá PCB do Membro E(CA)² -->
          <div class="student-id-card-pcb" id="student-pcb-card">
            <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .85rem; border-bottom: 1px dashed rgba(234, 179, 8, .4); padding-bottom: .6rem;">
              <div class="row" style="gap: .55rem; align-items: center;">
                <img src="img/logo_option2_microchip.jpg" alt="Logo E(CA)²" width="36" height="36" style="border-radius: 6px; border: 1px solid #eab308;">
                <div>
                  <div style="font-family: var(--font-mono); font-size: .72rem; color: #facc15; font-weight: 700;">CREDENCIAL DISCENTE · PCB REV 2.4</div>
                  <strong style="font-size: .95rem; color: #fff;">E(CA)² · UERGS PORTO ALEGRE</strong>
                </div>
              </div>
              <span class="badge green" style="font-family: var(--font-mono); font-size: .68rem;">MEMBRO ATIVO</span>
            </div>

            <div style="display: flex; justify-content: space-between; gap: 1rem; align-items: center;">
              <div style="flex: 1; min-width: 0;">
                <div class="small" style="color: #94a3b8; font-size: .7rem; font-family: var(--font-mono);">TITULAR // ENG. CONTROLE E AUTOMAÇÃO</div>
                <div style="font-size: 1.15rem; font-weight: 700; color: #f8fafc; margin-bottom: .45rem; word-break: break-word;">${escapeHtml(studentName)}</div>
                <div class="grid grid-2" style="gap: .5rem; font-family: var(--font-mono); font-size: .76rem;">
                  <div>
                    <span style="color: #94a3b8; display: block; font-size: .66rem;">MÓDULO / SEMESTRE</span>
                    <strong style="color: #38bdf8;">${escapeHtml(studentSem)}</strong>
                  </div>
                  <div>
                    <span style="color: #94a3b8; display: block; font-size: .66rem;">MATRÍCULA / ID</span>
                    <strong style="color: #facc15;">${escapeHtml(studentReg)}</strong>
                  </div>
                </div>
                <div style="margin-top: .45rem; font-family: var(--font-mono); font-size: .72rem; color: #cbd5e1;">
                  Currículo: <strong>PPC ${academic.ppc}</strong> · E-mail: ${escapeHtml(studentEmail)}
                </div>
              </div>

              <!-- QR Code Vetorial de Validação no Campus -->
              <div style="background: #fff; padding: 6px; border-radius: 6px; border: 2px solid #eab308; flex-shrink: 0;" title="QR Code de Validação E(CA)² UERGS">
                <svg width="74" height="74" viewBox="0 0 21 21" shape-rendering="crispEdges">
                  <rect width="21" height="21" fill="#ffffff"/>
                  <path d="M1,1 h7 v7 h-7 z M2,2 v5 h5 v-5 z M3,3 h3 v3 h-3 z M13,1 h7 v7 h-7 z M14,2 v5 h5 v-5 z M15,3 h3 v3 h-3 z M1,13 h7 v7 h-7 z M2,14 v5 h5 v-5 z M3,15 h3 v3 h-3 z M9,1 h2 v2 h-2 z M9,5 h2 v3 h-2 z M1,9 h3 v2 h-3 z M6,9 h5 v2 h-5 z M13,9 h3 v2 h-3 z M18,9 h2 v2 h-2 z M9,12 h3 v2 h-3 z M14,12 h2 v3 h-2 z M18,13 h2 v4 h-2 z M10,16 h4 v2 h-4 z M15,17 h3 v3 h-3 z M9,19 h4 v1 h-4 z" fill="#071a12"/>
                </svg>
              </div>
            </div>

            <div class="pcb-gold-pins" aria-hidden="true">
              <span class="pcb-gold-pin"></span><span class="pcb-gold-pin"></span><span class="pcb-gold-pin"></span><span class="pcb-gold-pin"></span>
              <span class="pcb-gold-pin"></span><span class="pcb-gold-pin"></span><span class="pcb-gold-pin"></span><span class="pcb-gold-pin"></span>
            </div>
          </div>

          <button type="button" class="btn btn-ghost btn-sm" id="btn-print-student-card" style="width: 100%; font-family: var(--font-mono);">
            🪪 Imprimir / Salvar Carteirinha Estudantil Digital (PDF)
          </button>

          <div class="card">
            <div class="badge cyan" style="margin-bottom: .5rem;">VANTAGENS</div>
            <h3>Benefícios do Cadastro Oficial</h3>
            <ul class="muted small" style="padding-left: 1.1rem; line-height: 1.7; margin-bottom: 0;">
              <li><strong>Credencial PCB E(CA)²:</strong> Identificação rápida em assembleias, visitas técnicas industriais, eventos e descontos em parceiros.</li>
              <li><strong>Representação Estudantil:</strong> Legitimidade perante os colegiados e departamentos da UERGS.</li>
              <li><strong>Oportunidades em 1ª mão:</strong> Vagas de estágio filtradas para automação industrial na Grande Porto Alegre.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-print-student-card")?.addEventListener("click", () => {
      window.print();
    });

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

  // Navegação rápida entre os itens do submenu ESTUDANTE ▾
  activePerfilTabSwitcher = (tab) => {
    currentProfileTab = tab;
    renderTab();
  };

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
const _initCalDate = new Date();
let calCurrentYear = _initCalDate.getFullYear();
let calCurrentMonth = _initCalDate.getMonth();
let calSelectedDate = null; // 'YYYY-MM-DD'
let calCategoryFilter = "todos"; // 'todos' | 'ca' | 'uergs-poa' | 'institucional'
let calTemporalFilter = "futuros"; // 'futuros' (vigentes/próximos) | 'realizados' | 'todos'

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
// VISTA: EVENTOS & AGENDA ACADÊMICA (DINÂMICA CONFORME DATA)
// -------------------------------------------------------------
function renderNextFeaturedEventHtml() {
  const today = getTodayIso();
  const upcoming = getUpcomingEventsCombined();
  const nextEvent = upcoming.find(e => e.destaque) || upcoming[0] || CALENDARIO_EVENTOS[0];

  let relativeTimeStr = "";
  let badgeColor = "cyan";
  if (nextEvent && nextEvent.data) {
    const diffTime = new Date(nextEvent.data + "T00:00:00") - new Date(today + "T00:00:00");
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      relativeTimeStr = "Acontece Hoje!";
      badgeColor = "green";
    } else if (diffDays === 1) {
      relativeTimeStr = "Acontece Amanhã!";
      badgeColor = "amber";
    } else if (diffDays > 1) {
      relativeTimeStr = `Faltam ${diffDays} dias`;
      badgeColor = "cyan";
    } else {
      relativeTimeStr = "Evento Concluído";
      badgeColor = "slate";
    }
  }

  const img = nextEvent.imagem || (nextEvent.categoria === "ca" ? "img/evento_salchipao.jpg" : "img/hero_estudantes.jpg");

  return `
    <!-- Destaque Principal Dinâmico (Próximo Evento a Realizar) -->
    <div class="card hover" style="padding: 0; overflow: hidden; margin-bottom: 3rem; border: 1px solid var(--border-strong);">
      <div class="grid grid-2" style="align-items: center; gap: 0;">
        <div style="position: relative; height: 100%; min-height: 280px;">
          <img src="${img}" alt="${escapeHtml(nextEvent.titulo)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='img/hero_estudantes.jpg'">
          <span class="badge ${badgeColor}" style="position: absolute; top: 14px; left: 14px; font-weight: 700;">
            ${relativeTimeStr ? `PRÓXIMO DESTAQUE · ${relativeTimeStr}` : "Destaque da Programação"}
          </span>
        </div>
        <div style="padding: 2.25rem;">
          <span class="eyebrow" style="margin-bottom: .4rem;">${escapeHtml(nextEvent.dataExibicao || nextEvent.data)} · ${escapeHtml(nextEvent.horario || "Programação Confirmada")}</span>
          <h3 style="font-size: 1.55rem; margin-bottom: .8rem; line-height: 1.3;">${nextEvent.icone || "📅"} ${escapeHtml(nextEvent.titulo)}</h3>
          <p class="muted" style="margin-bottom: 1.25rem; line-height: 1.6;">
            ${escapeHtml(nextEvent.descricao)}
          </p>
          <div class="row" style="gap: .75rem; flex-wrap: wrap; align-items: center;">
            ${nextEvent.linkAcao && nextEvent.linkAcao.startsWith("http") ? `
              <a href="${nextEvent.linkAcao}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                ${escapeHtml(nextEvent.textoAcao || "Ver no Portal UERGS")} ↗
              </a>
            ` : `
              <a href="${nextEvent.linkAcao || "#eventos"}" class="btn btn-primary btn-sm">
                ${escapeHtml(nextEvent.textoAcao || "Ver Mais Detalhes")}
              </a>
            `}
            <span class="small muted">📍 ${escapeHtml(nextEvent.local || "Campus UERGS Porto Alegre")}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderEventosHtml() {
  const upcomingList = getUpcomingEventsCombined();
  const pastList = getPastEventsCombined();
  const allList = getAllEventsCombined();
  const today = getTodayIso();

  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Integração & Calendário</span>
          <h2>Eventos do E(CA)² & Datas Institucionais UERGS</h2>
          <p>
            O calendário unificado da comunidade de Engenharia de Controle e Automação. Eventos já realizados saem automaticamente do destaque para você focar no que está por vir.
          </p>
        </div>

        ${renderNextFeaturedEventHtml()}

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
                Sincronizada diretamente da reitoria e campus central (Rua Washington Luiz, 675).
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

        <!-- Barra de Controle Temporal (Filtro Anti-Eventos Passados) -->
        <div style="margin-top: 2rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; background: hsl(220 40% 10% / .6); padding: .75rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
          <div style="display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;">
            <span class="small" style="font-weight: 700; color: var(--text-heading); margin-right: .25rem;">Exibição da Lista:</span>
            <button type="button" class="btn btn-sm ${calTemporalFilter === 'futuros' ? 'btn-primary' : 'btn-ghost'}" id="btn-temporal-futuros" style="font-size: .8rem; padding: .35rem .75rem;">
              🟢 Próximos Eventos (${upcomingList.length})
            </button>
            <button type="button" class="btn btn-sm ${calTemporalFilter === 'realizados' ? 'btn-primary' : 'btn-ghost'}" id="btn-temporal-realizados" style="font-size: .8rem; padding: .35rem .75rem;">
              📜 Já Realizados (${pastList.length})
            </button>
            <button type="button" class="btn btn-sm ${calTemporalFilter === 'todos' ? 'btn-primary' : 'btn-ghost'}" id="btn-temporal-todos" style="font-size: .8rem; padding: .35rem .75rem;">
              🌐 Todos (${allList.length})
            </button>
          </div>
          <span class="small muted" id="cal-temporal-hint">
            ${calTemporalFilter === 'futuros' ? '⚡ Mostrando apenas eventos a serem realizados' : (calTemporalFilter === 'realizados' ? '📜 Histórico de eventos anteriores' : 'Exibindo programação completa')}
          </span>
        </div>

        <!-- Barra de Filtros de Categoria -->
        <div class="calendar-filter-bar" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: .5rem;">
          <span class="small muted" style="font-weight: 600; margin-right: .5rem;">Filtrar Categoria:</span>
          <button type="button" class="chip ${calCategoryFilter === 'todos' ? 'active' : ''}" data-cal-filter="todos">
            Todos (<span id="count-chip-todos">${upcomingList.length}</span>)
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'ca' ? 'active' : ''}" data-cal-filter="ca">
            Eventos E(CA)² (<span id="count-chip-ca">${upcomingList.filter(e => e.categoria === 'ca').length}</span>)
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'uergs-poa' ? 'active' : ''}" data-cal-filter="uergs-poa" style="${calCategoryFilter === 'uergs-poa' ? 'border-color: #10b981; color: #34d399;' : ''}">
            🏛️ Agenda UERGS Porto Alegre (<span id="count-chip-poa">${upcomingList.filter(e => e.categoria === 'uergs-poa').length}</span>)
          </button>
          <button type="button" class="chip ${calCategoryFilter === 'institucional' ? 'active' : ''}" data-cal-filter="institucional">
            Datas Acadêmicas UERGS (<span id="count-chip-inst">${upcomingList.filter(e => e.categoria === 'institucional').length}</span>)
          </button>
        </div>

        <!-- Lista Cronológica de Eventos -->
        <div id="calendar-events-list" style="margin-bottom: 3.5rem;">
          ${allList.map(ev => {
            const isPast = (ev.data || "") < today;
            const isToday = ev.data === today;
            const dateParts = (ev.data || "2026-01-01").split("-");
            const dayNum = dateParts[2] || "01";
            const monthNames = ["", "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
            const monthStr = monthNames[parseInt(dateParts[1], 10)] || "MES";
            const badgeClass = ev.categoria === "ca" ? "cyan" : (ev.categoria === "uergs-poa" ? "green" : "amber");

            return `
              <div class="calendar-item ${ev.destaque && !isPast ? 'destaque' : ''} ${isPast ? 'is-past' : ''}" data-categoria="${ev.categoria}" data-date="${ev.data}" data-is-past="${isPast ? 'true' : 'false'}">
                <div class="calendar-date-box">
                  <span class="day">${dayNum}</span>
                  <span class="month">${monthStr}</span>
                </div>
                <div style="flex: 1; min-width: 220px;">
                  <div class="row" style="margin-bottom: .3rem; gap: .5rem; flex-wrap: wrap; align-items: center;">
                    <span class="badge ${badgeClass}">${escapeHtml(ev.categoriaLabel || 'Evento')}</span>
                    ${isPast ? `
                      <span class="badge slate" style="font-size: .68rem; padding: 2px 7px;">Concluído</span>
                    ` : (isToday ? `
                      <span class="badge green" style="font-size: .68rem; padding: 2px 7px;">Hoje</span>
                    ` : `
                      <span class="badge cyan" style="font-size: .68rem; padding: 2px 7px;">Em Breve</span>
                    `)}
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
                  ${ev.linkAcao && ev.linkAcao.startsWith("http") ? `
                    <a href="${ev.linkAcao}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="white-space: nowrap;">
                      ${escapeHtml(ev.textoAcao || 'Ver Mais')} ↗
                    </a>
                  ` : `
                    <a href="${ev.linkAcao || '#eventos'}" class="btn ${ev.destaque && !isPast ? 'btn-primary' : 'btn-ghost'} btn-sm" style="white-space: nowrap;">
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
            <p class="muted small">Tente selecionar outro mês ou alternar para 'Todos os Eventos'.</p>
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
  function updateTemporalButtonsAndCounts() {
    const btnFuturos = document.getElementById("btn-temporal-futuros");
    const btnRealizados = document.getElementById("btn-temporal-realizados");
    const btnTodos = document.getElementById("btn-temporal-todos");
    const hint = document.getElementById("cal-temporal-hint");

    [btnFuturos, btnRealizados, btnTodos].forEach(b => {
      b?.classList.remove("btn-primary");
      b?.classList.add("btn-ghost");
    });

    if (calTemporalFilter === "futuros") {
      btnFuturos?.classList.remove("btn-ghost");
      btnFuturos?.classList.add("btn-primary");
      if (hint) hint.textContent = "⚡ Mostrando apenas eventos a serem realizados";
    } else if (calTemporalFilter === "realizados") {
      btnRealizados?.classList.remove("btn-ghost");
      btnRealizados?.classList.add("btn-primary");
      if (hint) hint.textContent = "📜 Mostrando histórico de eventos anteriores";
    } else {
      btnTodos?.classList.remove("btn-ghost");
      btnTodos?.classList.add("btn-primary");
      if (hint) hint.textContent = "🌐 Exibindo programação completa (vigentes e anteriores)";
    }

    const baseList = calTemporalFilter === "futuros"
      ? getUpcomingEventsCombined()
      : (calTemporalFilter === "realizados" ? getPastEventsCombined() : getAllEventsCombined());

    const cTodos = document.getElementById("count-chip-todos");
    const cCa = document.getElementById("count-chip-ca");
    const cPoa = document.getElementById("count-chip-poa");
    const cInst = document.getElementById("count-chip-inst");

    if (cTodos) cTodos.textContent = baseList.length;
    if (cCa) cCa.textContent = baseList.filter(e => e.categoria === "ca").length;
    if (cPoa) cPoa.textContent = baseList.filter(e => e.categoria === "uergs-poa").length;
    if (cInst) cInst.textContent = baseList.filter(e => e.categoria === "institucional").length;
  }

  function applyEventsFilter() {
    const today = getTodayIso();
    const eventItems = document.querySelectorAll(".calendar-item");
    let visibleCount = 0;

    eventItems.forEach(item => {
      const cat = item.getAttribute("data-categoria");
      const date = item.getAttribute("data-date");
      const isPast = item.getAttribute("data-is-past") === "true";

      let matchTemporal = true;
      if (calTemporalFilter === "futuros") {
        matchTemporal = !isPast;
      } else if (calTemporalFilter === "realizados") {
        matchTemporal = isPast;
      }

      const matchCat = (calCategoryFilter === "todos" || cat === calCategoryFilter);
      const matchDate = (!calSelectedDate || date === calSelectedDate);

      if (matchTemporal && matchCat && matchDate) {
        item.style.display = "";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    const emptyBox = document.getElementById("calendar-empty-notice");
    if (emptyBox) {
      emptyBox.style.display = visibleCount === 0 ? "block" : "none";
      if (visibleCount === 0) {
        const titleEl = emptyBox.querySelector("h3");
        const descEl = emptyBox.querySelector("p");
        if (calTemporalFilter === "futuros") {
          if (titleEl) titleEl.textContent = "Nenhum evento futuro encontrado nesta categoria/data.";
          if (descEl) descEl.textContent = "Alterne para 'Já Realizados' caso deseje ver atividades que já foram concluídas.";
        } else if (calTemporalFilter === "realizados") {
          if (titleEl) titleEl.textContent = "Nenhum evento concluído encontrado nesta categoria/data.";
          if (descEl) descEl.textContent = "Alterne para 'Próximos Eventos' para ver a programação vigente.";
        } else {
          if (titleEl) titleEl.textContent = "Nenhum evento encontrado para a data/categoria selecionada.";
          if (descEl) descEl.textContent = "Tente selecionar outro mês ou limpar os filtros de data.";
        }
      }
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
      const now = new Date();
      calCurrentYear = now.getFullYear();
      calCurrentMonth = now.getMonth();
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
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.classList.add("destaque");
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

  // Controles de Exibição Temporal
  document.getElementById("btn-temporal-futuros")?.addEventListener("click", () => {
    calTemporalFilter = "futuros";
    updateTemporalButtonsAndCounts();
    applyEventsFilter();
  });
  document.getElementById("btn-temporal-realizados")?.addEventListener("click", () => {
    calTemporalFilter = "realizados";
    updateTemporalButtonsAndCounts();
    applyEventsFilter();
  });
  document.getElementById("btn-temporal-todos")?.addEventListener("click", () => {
    calTemporalFilter = "todos";
    updateTemporalButtonsAndCounts();
    applyEventsFilter();
  });

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
  updateTemporalButtonsAndCounts();
  applyEventsFilter();
}

// -------------------------------------------------------------
// INICIALIZAÇÃO GERAL DO APLICATIVO
// -------------------------------------------------------------
async function init() {
  store = await createStore();

  // Carregamento assíncrono não-bloqueante dos eventos oficiais da UERGS raspados para o Campus Porto Alegre
  fetchUergsPoaEvents().then((poaData) => {
    if (poaData && Array.isArray(poaData.events)) {
      uergsScrapedEvents = poaData.events.map(formatUergsEventToCard);
      if (currentRoute === "eventos") {
        renderCurrentView();
      }
    }
  }).catch((err) => {
    console.warn("Aviso ao carregar eventos da UERGS:", err);
  });

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
        registration: extraReg || "",
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

  // Fechar menu mobile e dropdowns ao clicar em links de navegação (roteamento síncrono imediato)
  navLinks?.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      link.blur();
      navLinks.classList.remove("open");
      toggleBtn?.setAttribute("aria-expanded", "false");
      if (toggleBtn) toggleBtn.innerHTML = "Menu";
      document.querySelectorAll(".nav-dropdown").forEach((d) => {
        d.classList.remove("open");
        d.classList.add("closing");
        d.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });

      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetHash = href.slice(1) || "inicio";
        const parts = targetHash.split("/");
        navigate(parts[0] || "inicio", parts[1] || null);
      }
    }
  });

  // Limpa estado .closing quando o mouse sai ou entra novamente no dropdown
  document.querySelectorAll(".nav-dropdown").forEach((dd) => {
    dd.addEventListener("mouseleave", () => dd.classList.remove("closing"));
    dd.addEventListener("mouseenter", () => dd.classList.remove("closing"));
  });

  // Toggle acessível de submenus dropdowns (mobile e desktop)
  document.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.closest(".nav-dropdown");
      parent?.classList.remove("closing");
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

  // Roteamento síncrono instantâneo para qualquer link interno (#...) dentro do conteúdo principal
  document.getElementById("app-root")?.addEventListener("click", (e) => {
    const link = e.target.closest("a[href^='#']");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetHash = href.slice(1) || "inicio";
      const parts = targetHash.split("/");
      navigate(parts[0] || "inicio", parts[1] || null);
    }
  });

  // -------------------------------------------------------------
  // BUSCA GLOBAL INSTANTÂNEA (COMMAND PALETTE · CTRL+K)
  // -------------------------------------------------------------
  const dlgCmd = document.getElementById("dlg-cmd-palette");
  const cmdInput = document.getElementById("cmd-palette-input");
  const cmdResults = document.getElementById("cmd-palette-results");
  if (dlgCmd) setupDialogBackdropClose(dlgCmd);

  // Constrói índice de busca em memória uma única vez
  const globalSearchIndex = [];
  ARVORES_PPC["2024"].semestres.forEach(sem => {
    sem.disciplinas.forEach(d => {
      const em = EMENTARIO_PPC2024[d.codigo];
      globalSearchIndex.push({
        type: "Disciplina PPC 2024",
        badge: "cyan",
        title: `${d.codigo} · ${d.nome} (${sem.titulo} · ${d.ch})`,
        desc: em ? em.ementa.slice(0, 130) + "..." : `Pré-requisitos: ${d.pre.join(", ") || "Nenhum"}`,
        searchText: `${d.codigo} ${d.nome} ${sem.titulo} ${em ? em.ementa + " " + em.bibliografia.join(" ") : ""}`.toLowerCase(),
        route: "curso",
        sub: "arvore"
      });
    });
  });

  DOCUMENTOS_OFICIAIS.forEach(doc => {
    globalSearchIndex.push({
      type: "Documento PDF",
      badge: "amber",
      title: `${doc.icone} ${doc.titulo}`,
      desc: doc.descricao,
      searchText: `${doc.titulo} ${doc.categoria} ${doc.descricao} pdf estatuto ppc`.toLowerCase(),
      route: "documentos",
      sub: null
    });
  });

  BENEFICIOS_UERGS.categorias.forEach(cat => {
    globalSearchIndex.push({
      type: "Bolsa / Benefício",
      badge: "green",
      title: `${cat.icone} ${cat.titulo}`,
      desc: cat.badge + " — " + cat.descricao.slice(0, 110) + "...",
      searchText: `${cat.titulo} ${cat.badge} ${cat.descricao}`.toLowerCase(),
      route: "curso",
      sub: "beneficios"
    });
  });

  FAQ.forEach(f => {
    globalSearchIndex.push({
      type: "Pergunta FAQ",
      badge: "slate",
      title: `❓ ${f.p}`,
      desc: f.r.slice(0, 120) + "...",
      searchText: `${f.p} ${f.r}`.toLowerCase(),
      route: "faq",
      sub: null
    });
  });

  [
    { title: "🎛️ Simulador de Matrícula & Grade Horária Semanal (.ics)", desc: "Planeje sua matrícula 2026/1, detecte choques de horário e exporte para o Google Agenda.", route: "matricula", sub: null, badge: "cyan" },
    { title: "📈 Meu Histórico, Rastreador de AC (80h), Extensão (410h) & Calculadora de Conceitos", desc: "Importe seu histórico do Portal do Aluno, simule migração PPC 2019➔2024 e calcule conceitos A–E.", route: "perfil", sub: null, badge: "green" },
    { title: "🪪 Carteirinha Estudantil Digital PCB E(CA)² & Ficha Cadastral", desc: "Emita sua credencial discente com QR Code e atualize seu cadastro oficial.", route: "registro", sub: null, badge: "amber" },
    { title: "🔬 Laboratórios, Bancadas & Grupo de Pesquisa PAI/CNPq", desc: "Conheça as bancadas de CLP, Robótica, Eletrônica e os projetos do NDE/PAI.", route: "curso", sub: "labs", badge: "cyan" },
    { title: "💼 Estágio Supervisionado (165h), TCC & Piso Salarial CREA-RS", desc: "Regras de estágio, convênios CIEE/IEL, atribuições CONFEA e polos industriais.", route: "curso", sub: "estagios", badge: "amber" }
  ].forEach(tool => {
    globalSearchIndex.push({
      type: "Ferramenta do Portal",
      badge: tool.badge,
      title: tool.title,
      desc: tool.desc,
      searchText: `${tool.title} ${tool.desc}`.toLowerCase(),
      route: tool.route,
      sub: tool.sub
    });
  });

  function renderCmdResults(query = "") {
    if (!cmdResults) return;
    const q = query.trim().toLowerCase();
    const matches = q
      ? globalSearchIndex.filter(it => it.searchText.includes(q)).slice(0, 14)
      : globalSearchIndex.slice(0, 10);

    if (matches.length === 0) {
      cmdResults.innerHTML = `<div class="small muted" style="padding: 1.5rem; text-align: center;">Nenhum resultado encontrado para "${escapeHtml(query)}".</div>`;
      return;
    }

    cmdResults.innerHTML = matches.map((m, idx) => `
      <button type="button" class="cmd-result-item" data-cmd-idx="${idx}" data-route="${m.route}" data-sub="${m.sub || ''}">
        <div style="min-width: 0; flex: 1;">
          <div style="font-weight: 600; font-size: .88rem; color: var(--text); margin-bottom: .15rem;">${escapeHtml(m.title)}</div>
          <div class="small muted" style="font-size: .76rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(m.desc)}</div>
        </div>
        <span class="badge ${m.badge}" style="font-size: .68rem; flex-shrink: 0;">${escapeHtml(m.type)}</span>
      </button>
    `).join("");

    cmdResults.querySelectorAll(".cmd-result-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const r = btn.getAttribute("data-route");
        const s = btn.getAttribute("data-sub") || null;
        dlgCmd?.close();
        navigate(r, s);
      });
    });
  }

  function openCmdPalette() {
    if (!dlgCmd) return;
    renderCmdResults(cmdInput?.value || "");
    dlgCmd.showModal();
    setTimeout(() => cmdInput?.focus(), 20);
  }

  document.getElementById("btn-open-cmd-palette")?.addEventListener("click", openCmdPalette);
  document.getElementById("btn-close-cmd-palette")?.addEventListener("click", () => dlgCmd?.close());
  cmdInput?.addEventListener("input", (e) => renderCmdResults(e.target.value));

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (dlgCmd?.open) {
        dlgCmd.close();
      } else {
        openCmdPalette();
      }
    }
  });

  // Navegação por Hash / Histórico
  function handleHash() {
    const raw = window.location.hash.slice(1) || "inicio";
    const parts = raw.split("/");
    navigate(parts[0], parts[1] || null);
  }

  window.addEventListener("hashchange", handleHash);
  window.addEventListener("popstate", handleHash);
  handleHash();
}

// Inicia assim que o DOM carregar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
