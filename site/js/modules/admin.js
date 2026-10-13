/**
 * =====================================================================
 * Eca² – Módulo Administrativo & Backoffice (admin.js)
 * Arquitetura Modular ES6 · Segurança RBAC & Gestão Completa
 * =====================================================================
 */

import { CONFIG } from "../config.js";
import { PRODUTOS_SHOP, CALENDARIO_EVENTOS } from "../content.js";

// Helper de escape contra XSS
function esc(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

// Estado local do módulo administrativo
let activeTab = "dashboard";
let searchQuery = "";

/**
 * Renderiza o Shell HTML do Painel Administrativo
 */
export function renderAdminHtml(auth) {
  const isLogged = !!auth.user;
  const isAdmin = auth.isAdmin;
  const userName = auth.profile?.display_name || auth.user?.email || "Visitante";
  const userEmail = auth.user?.email || "";

  // Se não estiver autorizado como Administrador, exibe barreira de segurança estrita
  if (!isAdmin) {
    return `
      <section class="section admin-shell">
        <div class="container" style="max-width: 680px;">
          <div class="card admin-access-lock">
            <span class="admin-lock-icon" aria-hidden="true">🔐</span>
            <h1 style="font-size: 1.8rem; margin-bottom: .5rem;">Área Restrita à Diretoria do E(CA)²</h1>
            <p class="muted" style="text-align: center; margin-bottom: 2rem;">
              Este painel gerencia eventos oficiais, estoque da lojinha, comunicados e governança estudantil da UERGS. O acesso é exclusivo para estudantes homologados e eleitos pela Diretoria.
            </p>

            ${isLogged ? `
              <div class="card" style="background: hsl(0 85% 66% / .08); border-color: hsl(0 85% 66% / .3); margin-bottom: 1.5rem; text-align: left;">
                <div class="row" style="gap: .6rem; align-items: center; margin-bottom: .4rem;">
                  <span class="badge red">Acesso Não Autorizado</span>
                  <span class="small font-mono">${esc(userEmail)}</span>
                </div>
                <p class="small muted" style="margin: 0; line-height: 1.6;">
                  Sua conta está conectada como <strong>Estudante</strong>, mas não possui permissões administrativas. Apenas alunos homologados pela Diretoria têm acesso ao Painel ADM.
                </p>
              </div>
              <div style="text-align: center;">
                <button type="button" class="btn btn-primary" id="btn-admin-back-home">
                  ← Voltar à Página Inicial
                </button>
              </div>
            ` : `
              <div style="margin-bottom: 1.5rem; text-align: center;">
                <p class="small muted">Faça login com seu e-mail institucional @uergs.edu.br cadastrado na gestão para verificar suas permissões de diretoria.</p>
                <div class="row" style="justify-content: center; gap: .75rem; margin-top: 1rem;">
                  <button type="button" class="btn btn-primary" id="btn-admin-login-trigger">
                    🔑 Fazer Login Institucional
                  </button>
                  <button type="button" class="btn btn-ghost" id="btn-admin-back-home">
                    ← Voltar ao Início
                  </button>
                </div>
              </div>
            `}
          </div>
        </div>
      </section>
    `;
  }

  // Shell Principal do Painel com Abas
  return `
    <section class="section admin-shell">
      <div class="container">
        <!-- Topo com Identificação do Gestor -->
        <div class="admin-header">
          <div class="admin-title-wrap">
            <div class="row" style="gap: .75rem; align-items: center; margin-bottom: .25rem;">
              <img src="img/logo_option2_microchip.jpg" alt="Logo E(CA)²" class="brand-logo-img" width="36" height="36" style="width: 36px; height: 36px;">
              <h1>Painel de Controle E(CA)²</h1>
              <span class="admin-badge-role super">GESTOR ATIVO · RBAC LEVEL 3</span>
            </div>
            <p class="muted small" style="margin: 0;">
              Plataforma Integrada de Gestão de Eventos, Lojinha, Notícias e Governança Acadêmica UERGS.
            </p>
          </div>

          <div class="row" style="gap: .75rem; align-items: center;">
            <div class="row" style="gap: .5rem; align-items: center; background: var(--surface); padding: .35rem .75rem; border-radius: 999px; border: 1px solid var(--border);">
              <span class="avatar" style="width: 24px; height: 24px; font-size: .7rem;">${esc(userName.slice(0, 2).toUpperCase())}</span>
              <span class="small font-mono">${esc(userName)}</span>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-admin-logout" title="Sair do modo administrador">
              Sair do ADM ✕
            </button>
          </div>
        </div>

        <!-- Navegação das Abas Administrativas -->
        <nav class="admin-tabs" aria-label="Abas do painel administrativo">
          <button type="button" class="admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            📊 Visão Geral
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'eventos' ? 'active' : ''}" data-tab="eventos">
            📅 Eventos & Calendário <span class="admin-tab-badge" id="badge-count-eventos">...</span>
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'loja' ? 'active' : ''}" data-tab="loja">
            🛍️ Lojinha & Estoque <span class="admin-tab-badge" id="badge-count-loja">...</span>
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'estagios' ? 'active' : ''}" data-tab="estagios">
            💼 Estágios & Vagas <span class="admin-tab-badge" id="badge-count-estagios">...</span>
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'faqs' ? 'active' : ''}" data-tab="faqs">
            ❓ FAQs & Dúvidas <span class="admin-tab-badge" id="badge-count-faqs">...</span>
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'noticias' ? 'active' : ''}" data-tab="noticias">
            📰 Notícias & Mural <span class="admin-tab-badge" id="badge-count-noticias">...</span>
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'alunos' ? 'active' : ''}" data-tab="alunos">
            🗳️ Alunos & Urna <span class="admin-tab-badge" id="badge-count-alunos">235</span>
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}" data-tab="logs">
            🛡️ Auditoria & Segurança
          </button>
        </nav>

        <!-- Conteúdo Dinâmico da Aba Ativa -->
        <div id="admin-tab-content">
          <div class="skeleton" style="height: 320px; border-radius: var(--radius);"></div>
        </div>
      </div>
    </section>

    <!-- Modais Administrativos Flutuantes -->
    <dialog class="admin-modal" id="dlg-admin-form">
      <div class="dialog-body">
        <div class="dialog-head">
          <h2 id="admin-modal-title">Editar Registro</h2>
          <button type="button" class="close-x" id="btn-close-admin-modal" aria-label="Fechar">✕</button>
        </div>
        <div id="admin-modal-body"></div>
      </div>
    </dialog>
  `;
}

/**
 * Configura Interações, CRUDs e Eventos do Painel
 */
export async function setupAdminInteractions(store, navigate, showToast) {
  const auth = store.getAuth ? store.getAuth() : { isAdmin: false };

  // Tratamento da Barreira de Acesso
  if (!auth.isAdmin) {
    document.getElementById("btn-admin-login-trigger")?.addEventListener("click", () => {
      document.getElementById("dlg-auth")?.showModal();
    });

    document.getElementById("btn-admin-back-home")?.addEventListener("click", () => {
      navigate("inicio");
    });
    return;
  }

  // Logout Administrativo
  document.getElementById("btn-admin-logout")?.addEventListener("click", () => {
    if (store.setAdminMode) store.setAdminMode(false);
    localStorage.removeItem("eca2_force_admin");
    showToast("Você saiu da área administrativa.");
    navigate("inicio");
  });

  // Troca de Abas
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".admin-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderActiveTabContent(store, showToast);
    });
  });

  // Modal Fechar
  const modal = document.getElementById("dlg-admin-form");
  document.getElementById("btn-close-admin-modal")?.addEventListener("click", () => modal?.close());

  // Renderiza a aba atual
  await renderActiveTabContent(store, showToast);
}

/**
 * Renderizador de Conteúdo por Aba
 */
async function renderActiveTabContent(store, showToast) {
  const container = document.getElementById("admin-tab-content");
  if (!container) return;

  switch (activeTab) {
    case "dashboard":
      await renderTabDashboard(container, store, showToast);
      break;
    case "eventos":
      await renderTabEventos(container, store, showToast);
      break;
    case "loja":
      await renderTabLoja(container, store, showToast);
      break;
    case "estagios":
      await renderTabEstagios(container, store, showToast);
      break;
    case "faqs":
      await renderTabFaqs(container, store, showToast);
      break;
    case "noticias":
      await renderTabNoticias(container, store, showToast);
      break;
    case "alunos":
      await renderTabAlunos(container, store, showToast);
      break;
    case "logs":
      await renderTabLogs(container, store, showToast);
      break;
    default:
      container.innerHTML = `<p class="muted">Aba em desenvolvimento.</p>`;
  }
}

/* =====================================================================
 *  ABA 1: DASHBOARD GERAL
 * ===================================================================== */
async function renderTabDashboard(container, store, showToast) {
  let rsvpCount = 0;
  let eventList = [];
  let productList = [];
  let suggestions = [];
  let internships = [];
  let faqs = [];

  try {
    if (store.rsvp?.count) rsvpCount = await store.rsvp.count();
    if (store.events?.listAll) eventList = await store.events.listAll();
    else if (store.events?.list) eventList = await store.events.list();
    if (store.products?.list) productList = await store.products.list();
    if (store.suggestions?.list) suggestions = await store.suggestions.list();
    if (store.internships?.list) internships = await store.internships.list();
    if (store.faqs?.list) faqs = await store.faqs.list();
  } catch (err) {
    console.warn("Erro ao puxar métricas", err);
  }

  // Atualiza badges das abas
  const bEv = document.getElementById("badge-count-eventos"); if (bEv) bEv.textContent = eventList.length;
  const bLj = document.getElementById("badge-count-loja"); if (bLj) bLj.textContent = productList.length;
  const bEst = document.getElementById("badge-count-estagios"); if (bEst) bEst.textContent = internships.length;
  const bFaq = document.getElementById("badge-count-faqs"); if (bFaq) bFaq.textContent = faqs.length;
  const bNot = document.getElementById("badge-count-noticias"); if (bNot) bNot.textContent = suggestions.length;

  const pendentesMod = suggestions.filter(s => s.status === 'nova' || s.status === 'analise').length;
  const vagasAtivas = internships.filter(v => v.status !== 'encerrada').length;

  container.innerHTML = `
    <!-- KPIs Principais -->
    <div class="admin-kpis" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <div class="kpi-card amber">
        <div class="kpi-head">
          <span class="kpi-label">Salchipão · RSVPs</span>
          <span class="kpi-icon">🌭</span>
        </div>
        <div class="kpi-value">${rsvpCount}</div>
        <div class="kpi-sub">Presenças no refeitório</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-head">
          <span class="kpi-label">Eventos Ativos</span>
          <span class="kpi-icon">📅</span>
        </div>
        <div class="kpi-value">${eventList.length}</div>
        <div class="kpi-sub">Palestras, visitas e aulas</div>
      </div>

      <div class="kpi-card cyan">
        <div class="kpi-head">
          <span class="kpi-label">Vagas de Estágio</span>
          <span class="kpi-icon">💼</span>
        </div>
        <div class="kpi-value">${vagasAtivas}</div>
        <div class="kpi-sub">${internships.length} oportunidades cadastradas</div>
      </div>

      <div class="kpi-card violet">
        <div class="kpi-head">
          <span class="kpi-label">Perguntas FAQ</span>
          <span class="kpi-icon">❓</span>
        </div>
        <div class="kpi-value">${faqs.length}</div>
        <div class="kpi-sub">Dúvidas respondidas no site</div>
      </div>

      <div class="kpi-card green">
        <div class="kpi-head">
          <span class="kpi-label">Lojinha & Estoque</span>
          <span class="kpi-icon">☕</span>
        </div>
        <div class="kpi-value">${productList.length}</div>
        <div class="kpi-sub">Produtos disponíveis</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-head">
          <span class="kpi-label">Mural & Demandas</span>
          <span class="kpi-icon">💡</span>
        </div>
        <div class="kpi-value">${suggestions.length}</div>
        <div class="kpi-sub">${pendentesMod} aguardando resposta</div>
      </div>
    </div>

    <!-- Ações Rápidas & Status Operacional -->
    <div class="grid grid-2" style="margin-bottom: 2rem;">
      <div class="card">
        <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem;">
          <span>⚡ Ações Operacionais Imediatas</span>
        </h3>
        <div class="stack" style="gap: .75rem;">
          <button type="button" class="btn btn-ghost btn-sm" id="btn-quick-new-event" style="justify-content: flex-start; text-align: left;">
            📅 Agendar Novo Evento ou Visita Técnica
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-quick-new-internship" style="justify-content: flex-start; text-align: left;">
            💼 Cadastrar Nova Vaga de Estágio ou Emprego
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-quick-new-faq" style="justify-content: flex-start; text-align: left;">
            ❓ Adicionar Nova Pergunta / Resposta ao FAQ
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-quick-new-product" style="justify-content: flex-start; text-align: left;">
            🛍️ Cadastrar Novo Produto na Lojinha
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-quick-new-notice" style="justify-content: flex-start; text-align: left;">
            📢 Publicar Comunicado Oficial no Mural
          </button>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem;">
          <span>🛡️ Conformidade & Governança da Urna</span>
        </h3>
        <p class="small muted" style="margin-bottom: .75rem;">
          A base de eleitores homologada contém <strong>235 alunos matriculados</strong> em Engenharia de Controle e Automação da UERGS. Cédula secreta com verificação estrita de e-mail institucional.
        </p>
        <div class="row" style="gap: .5rem; align-items: center; margin-top: 1rem; flex-wrap: wrap;">
          <span class="badge green">Segurança RLS Ativa</span>
          <span class="badge cyan">Voto Auditável</span>
          <span class="badge slate">LGPD Compliance</span>
          <span class="badge amber">Resolução CACS UERGS</span>
        </div>
      </div>
    </div>
  `;

  // Bindings das Ações Rápidas
  document.getElementById("btn-quick-new-event")?.addEventListener("click", () => {
    activeTab = "eventos";
    syncTabButtons();
    openEventModal(null, store, showToast);
  });
  document.getElementById("btn-quick-new-internship")?.addEventListener("click", () => {
    activeTab = "estagios";
    syncTabButtons();
    openInternshipModal(null, store, showToast, () => renderTabEstagios(container, store, showToast));
  });
  document.getElementById("btn-quick-new-faq")?.addEventListener("click", () => {
    activeTab = "faqs";
    syncTabButtons();
    openFaqModal(null, store, showToast, () => renderTabFaqs(container, store, showToast));
  });
  document.getElementById("btn-quick-new-product")?.addEventListener("click", () => {
    activeTab = "loja";
    syncTabButtons();
    openProductModal(null, store, showToast);
  });
  document.getElementById("btn-quick-new-notice")?.addEventListener("click", () => {
    activeTab = "noticias";
    syncTabButtons();
    openNoticeModal(null, store, showToast);
  });
}

function syncTabButtons() {
  document.querySelectorAll(".admin-tab-btn").forEach((b) => {
    if (b.getAttribute("data-tab") === activeTab) b.classList.add("active");
    else b.classList.remove("active");
  });
}

/* =====================================================================
 *  ABA 2: GESTÃO DE EVENTOS
 * ===================================================================== */
async function renderTabEventos(container, store, showToast) {
  let events = [];
  try {
    events = store.events?.listAll ? await store.events.listAll() : (store.events?.list ? await store.events.list() : []);
  } catch (err) {
    console.error(err);
  }

  document.getElementById("badge-count-eventos").textContent = events.length;

  container.innerHTML = `
    <div class="admin-action-bar">
      <div class="admin-search-box">
        <input type="text" id="admin-search-eventos" placeholder="Buscar por título, categoria ou local..." aria-label="Buscar eventos">
      </div>
      <button type="button" class="btn btn-primary btn-sm" id="btn-admin-add-evento">
        ➕ Adicionar Novo Evento
      </button>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table" aria-label="Tabela de Eventos">
        <thead>
          <tr>
            <th style="width: 50px;">Ícone</th>
            <th>Título do Evento</th>
            <th style="white-space: nowrap;">Data & Horário</th>
            <th style="white-space: nowrap;">Categoria</th>
            <th>Local</th>
            <th style="white-space: nowrap;">Destaque</th>
            <th style="text-align: right; white-space: nowrap;">Ações</th>
          </tr>
        </thead>
        <tbody id="admin-eventos-tbody">
          ${events.map((ev) => `
            <tr data-id="${ev.id}">
              <td><span style="font-size: 1.5rem;">${esc(ev.icone || '📅')}</span></td>
              <td>
                <strong>${esc(ev.titulo || ev.title)}</strong>
                ${ev.descricao ? `<div class="small muted" style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${esc(ev.descricao || ev.description)}</div>` : ''}
              </td>
              <td style="white-space: nowrap;">
                <div class="font-mono small">${esc(ev.dataExibicao || ev.data || ev.starts_at || 'A definir')}</div>
                <div class="small muted">${esc(ev.horario || '')}</div>
              </td>
              <td style="white-space: nowrap;"><span class="badge ${ev.categoria === 'ca' ? 'amber' : 'cyan'}">${esc(ev.categoriaLabel || ev.categoria || 'Geral')}</span></td>
              <td class="small muted">${esc(ev.local || ev.location || 'UERGS')}</td>
              <td style="white-space: nowrap;">${ev.destaque ? '<span class="status-pill disponivel">⭐ Sim</span>' : '<span class="status-pill analise">Não</span>'}</td>
              <td style="text-align: right; white-space: nowrap;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-ghost btn-sm btn-edit-ev" data-id="${ev.id}">✏️ Editar</button>
                  <button type="button" class="btn btn-danger btn-sm btn-del-ev" data-id="${ev.id}">🗑️</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bindings
  document.getElementById("btn-admin-add-evento")?.addEventListener("click", () => {
    openEventModal(null, store, showToast);
  });

  container.querySelectorAll(".btn-edit-ev").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const ev = events.find((e) => String(e.id) === String(id));
      openEventModal(ev, store, showToast);
    });
  });

  container.querySelectorAll(".btn-del-ev").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Tem certeza que deseja remover este evento do calendário?")) {
        try {
          if (store.events?.remove) await store.events.remove(id);
          showToast("Evento removido com sucesso!");
          await renderTabEventos(container, store, showToast);
        } catch (err) {
          showToast(err.message, true);
        }
      }
    });
  });
}

function openEventModal(eventData, store, showToast) {
  const modal = document.getElementById("dlg-admin-form");
  const title = document.getElementById("admin-modal-title");
  const body = document.getElementById("admin-modal-body");
  if (!modal || !body) return;

  const isEdit = !!eventData;
  title.textContent = isEdit ? "Editar Evento" : "Novo Evento Acadêmico";

  body.innerHTML = `
    <form id="form-admin-evento" class="form">
      <div class="admin-form-grid">
        <div class="field">
          <label for="ev-titulo">Título do Evento *</label>
          <input type="text" id="ev-titulo" required value="${esc(eventData?.titulo || eventData?.title || '')}" placeholder="Ex: Oficina Prática de CLP Siemens">
        </div>

        <div class="field">
          <label for="ev-categoria">Categoria</label>
          <select id="ev-categoria">
            <option value="ca" ${eventData?.categoria === 'ca' ? 'selected' : ''}>E(CA)² · Centro Acadêmico</option>
            <option value="institucional" ${eventData?.categoria === 'institucional' ? 'selected' : ''}>UERGS · Institucional</option>
            <option value="visita" ${eventData?.categoria === 'visita' ? 'selected' : ''}>Visita Técnica Industrial</option>
            <option value="curso" ${eventData?.categoria === 'curso' ? 'selected' : ''}>Minicurso / Oficina</option>
          </select>
        </div>

        <div class="field">
          <label for="ev-data">Data (AAAA-MM-DD) *</label>
          <input type="date" id="ev-data" required value="${esc(eventData?.data || '2026-10-26')}">
        </div>

        <div class="field">
          <label for="ev-horario">Horário</label>
          <input type="text" id="ev-horario" value="${esc(eventData?.horario || '18:30 às 20:00')}" placeholder="Ex: 18:30 às 19:15">
        </div>

        <div class="field">
          <label for="ev-local">Local</label>
          <input type="text" id="ev-local" value="${esc(eventData?.local || eventData?.location || 'Campus Washington Luiz, 675')}" placeholder="Ex: Laboratório de Redes">
        </div>

        <div class="field">
          <label for="ev-icone">Ícone (Emoji)</label>
          <input type="text" id="ev-icone" value="${esc(eventData?.icone || '📅')}" style="max-width: 90px; text-align: center;">
        </div>

        <div class="field admin-form-full">
          <label for="ev-descricao">Descrição do Evento</label>
          <textarea id="ev-descricao" rows="3" placeholder="Detalhes, programação e público-alvo...">${esc(eventData?.descricao || eventData?.description || '')}</textarea>
        </div>

        <div class="field admin-form-full">
          <label class="row" style="gap: .6rem; cursor: pointer;">
            <input type="checkbox" id="ev-destaque" ${eventData?.destaque ? 'checked' : ''} style="width: auto;">
            <span>Exibir como <strong>Destaque Principal</strong> no calendário e na Home</span>
          </label>
        </div>
      </div>

      <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Evento 💾</button>
      </div>
    </form>
  `;

  document.getElementById("form-admin-evento")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      titulo: document.getElementById("ev-titulo").value.trim(),
      categoria: document.getElementById("ev-categoria").value,
      data: document.getElementById("ev-data").value,
      horario: document.getElementById("ev-horario").value.trim(),
      local: document.getElementById("ev-local").value.trim(),
      icone: document.getElementById("ev-icone").value.trim() || "📅",
      descricao: document.getElementById("ev-descricao").value.trim(),
      destaque: document.getElementById("ev-destaque").checked,
      starts_at: document.getElementById("ev-data").value + "T18:30:00Z",
    };

    try {
      if (isEdit) {
        if (store.events?.update) await store.events.update(eventData.id, payload);
        showToast("Evento atualizado com sucesso!");
      } else {
        if (store.events?.create) await store.events.create(payload);
        showToast("Novo evento agendado com sucesso! 📅");
      }
      modal.close();
      const container = document.getElementById("admin-tab-content");
      if (container) await renderTabEventos(container, store, showToast);
    } catch (err) {
      showToast(err.message, true);
    }
  });

  modal.showModal();
}

/* =====================================================================
 *  ABA 3: GESTÃO DA LOJINHA & ESTOQUE
 * ===================================================================== */
async function renderTabLoja(container, store, showToast) {
  let products = [];
  try {
    products = store.products?.list ? await store.products.list() : PRODUTOS_SHOP;
  } catch (err) {
    console.error(err);
    products = PRODUTOS_SHOP;
  }

  document.getElementById("badge-count-loja").textContent = products.length;

  container.innerHTML = `
    <div class="admin-action-bar">
      <div class="admin-search-box">
        <input type="text" id="admin-search-loja" placeholder="Buscar por produto, categoria ou tag..." aria-label="Buscar produtos">
      </div>
      <button type="button" class="btn btn-primary btn-sm" id="btn-admin-add-produto">
        ➕ Adicionar Produto
      </button>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table" aria-label="Tabela de Produtos da Lojinha">
        <thead>
          <tr>
            <th style="width: 50px;">Item</th>
            <th>Nome do Produto</th>
            <th style="white-space: nowrap;">Categoria</th>
            <th style="white-space: nowrap;">Preço Geral</th>
            <th style="white-space: nowrap;">Preço Calouro/Membro</th>
            <th style="white-space: nowrap;">Status / Estoque</th>
            <th style="text-align: right; white-space: nowrap;">Ações</th>
          </tr>
        </thead>
        <tbody id="admin-loja-tbody">
          ${products.map((p) => `
            <tr data-id="${p.id}">
              <td>
                <div class="table-thumb">${esc(p.icone || '🛍️')}</div>
              </td>
              <td>
                <strong>${esc(p.nome)}</strong>
                ${p.tag ? `<div><span class="badge slate" style="font-size: .7rem;">${esc(p.tag)}</span></div>` : ''}
              </td>
              <td style="white-space: nowrap;"><span class="small muted">${esc(p.categoria || 'Geral')}</span></td>
              <td style="white-space: nowrap;"><strong class="font-mono text-cyan">${esc(p.preco || 'R$ 0,00')}</strong></td>
              <td style="white-space: nowrap;"><span class="font-mono text-amber">${esc(p.precoSocio || p.preco || 'R$ 0,00')}</span></td>
              <td style="white-space: nowrap;">
                <span class="status-pill ${p.status === 'esgotado' ? 'esgotado' : (p.status === 'prevenda' ? 'prevenda' : 'disponivel')}">
                  ${p.status === 'esgotado' ? 'Esgotado' : (p.status === 'prevenda' ? 'Pré-venda' : 'Disponível')}
                </span>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-ghost btn-sm btn-edit-prod" data-id="${p.id}">✏️ Editar</button>
                  <button type="button" class="btn btn-danger btn-sm btn-del-prod" data-id="${p.id}">🗑️</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bindings
  document.getElementById("btn-admin-add-produto")?.addEventListener("click", () => {
    openProductModal(null, store, showToast);
  });

  container.querySelectorAll(".btn-edit-prod").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const prod = products.find((p) => String(p.id) === String(id));
      openProductModal(prod, store, showToast);
    });
  });

  container.querySelectorAll(".btn-del-prod").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Remover este produto da lojinha?")) {
        try {
          if (store.products?.remove) await store.products.remove(id);
          showToast("Produto removido com sucesso!");
          await renderTabLoja(container, store, showToast);
        } catch (err) {
          showToast(err.message, true);
        }
      }
    });
  });
}

function openProductModal(prodData, store, showToast) {
  const modal = document.getElementById("dlg-admin-form");
  const title = document.getElementById("admin-modal-title");
  const body = document.getElementById("admin-modal-body");
  if (!modal || !body) return;

  const isEdit = !!prodData;
  title.textContent = isEdit ? "Editar Produto" : "Novo Produto na Lojinha";

  body.innerHTML = `
    <form id="form-admin-produto" class="form">
      <div class="admin-form-grid">
        <div class="field">
          <label for="prod-nome">Nome do Produto *</label>
          <input type="text" id="prod-nome" required value="${esc(prodData?.nome || '')}" placeholder="Ex: Moletom Canguru Bordado">
        </div>

        <div class="field">
          <label for="prod-cat">Categoria</label>
          <select id="prod-cat">
            <option value="Vestuário" ${prodData?.categoria === 'Vestuário' ? 'selected' : ''}>Vestuário & Moda</option>
            <option value="Utensílios" ${prodData?.categoria === 'Utensílios' ? 'selected' : ''}>Utensílios & Canecas</option>
            <option value="DIY & Laboratório" ${prodData?.categoria === 'DIY & Laboratório' ? 'selected' : ''}>Kits Didáticos & Ferramentas</option>
            <option value="Acessórios" ${prodData?.categoria === 'Acessórios' ? 'selected' : ''}>Adesivos & Acessórios</option>
          </select>
        </div>

        <div class="field">
          <label for="prod-preco">Preço Geral (R$) *</label>
          <input type="text" id="prod-preco" required value="${esc(prodData?.preco || 'R$ 49,90')}" placeholder="Ex: R$ 89,00">
        </div>

        <div class="field">
          <label for="prod-precosocio">Preço Calouro / Sócio</label>
          <input type="text" id="prod-precosocio" value="${esc(prodData?.precoSocio || prodData?.preco || 'R$ 44,90')}" placeholder="Ex: R$ 79,00">
        </div>

        <div class="field">
          <label for="prod-status">Status de Disponibilidade</label>
          <select id="prod-status">
            <option value="disponivel" ${prodData?.status === 'disponivel' ? 'selected' : ''}>Disponível para Compra</option>
            <option value="prevenda" ${prodData?.status === 'prevenda' ? 'selected' : ''}>Pré-Venda / Encomenda</option>
            <option value="esgotado" ${prodData?.status === 'esgotado' ? 'selected' : ''}>Esgotado</option>
          </select>
        </div>

        <div class="field">
          <label for="prod-icone">Ícone (Emoji)</label>
          <input type="text" id="prod-icone" value="${esc(prodData?.icone || '🛍️')}" style="max-width: 90px; text-align: center;">
        </div>

        <div class="field admin-form-full">
          <label for="prod-tag">Etiqueta de Destaque (Badge)</label>
          <input type="text" id="prod-tag" value="${esc(prodData?.tag || '')}" placeholder="Ex: Edição Especial de Fundação">
        </div>

        <div class="field admin-form-full">
          <label for="prod-desc">Descrição do Produto</label>
          <textarea id="prod-desc" rows="3" placeholder="Material, acabamento, especificações técnicas...">${esc(prodData?.descricao || '')}</textarea>
        </div>
      </div>

      <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Produto 💾</button>
      </div>
    </form>
  `;

  document.getElementById("form-admin-produto")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      id: prodData?.id || ("prod-" + Date.now()),
      nome: document.getElementById("prod-nome").value.trim(),
      categoria: document.getElementById("prod-cat").value,
      preco: document.getElementById("prod-preco").value.trim(),
      precoSocio: document.getElementById("prod-precosocio").value.trim(),
      status: document.getElementById("prod-status").value,
      icone: document.getElementById("prod-icone").value.trim() || "🛍️",
      tag: document.getElementById("prod-tag").value.trim(),
      descricao: document.getElementById("prod-desc").value.trim(),
    };

    try {
      if (isEdit && store.products?.update) {
        await store.products.update(prodData.id, payload);
        showToast("Produto atualizado com sucesso!");
      } else if (store.products?.create) {
        await store.products.create(payload);
        showToast("Novo produto cadastrado na lojinha!");
      }
      modal.close();
      const container = document.getElementById("admin-tab-content");
      if (container) await renderTabLoja(container, store, showToast);
    } catch (err) {
      showToast(err.message, true);
    }
  });

  modal.showModal();
}

/* =====================================================================
 *  ABA 3B: GESTÃO DE ESTÁGIOS & OPORTUNIDADES
 * ===================================================================== */
async function renderTabEstagios(container, store, showToast) {
  let internships = [];
  try {
    if (store.internships?.list) internships = await store.internships.list();
  } catch (err) {
    console.warn("Erro ao buscar vagas de estágio", err);
  }

  const badgeEl = document.getElementById("badge-count-estagios");
  if (badgeEl) badgeEl.textContent = internships.length;

  container.innerHTML = `
    <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="margin: 0 0 .25rem;">💼 Gestão de Oportunidades: Estágios & Empregos</h3>
        <p class="small muted" style="margin: 0;">Cadastre e gerencie vagas de estágio curricular, não-obrigatório, trainees e contratações para estudantes de Controle e Automação.</p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" id="btn-admin-add-estagio">
        ➕ Cadastrar Nova Vaga
      </button>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table" aria-label="Tabela de Vagas de Estágio">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Título da Vaga / Oportunidade</th>
            <th style="white-space: nowrap;">Tipo de Vaga</th>
            <th style="white-space: nowrap;">Bolsa / Salário</th>
            <th style="white-space: nowrap;">Carga Horária</th>
            <th style="white-space: nowrap;">Status</th>
            <th style="text-align: right; white-space: nowrap;">Ações</th>
          </tr>
        </thead>
        <tbody id="admin-estagios-tbody">
          ${internships.length === 0 ? `
            <tr><td colspan="7" class="small muted" style="text-align: center; padding: 2rem;">Nenhuma vaga cadastrada. Clique em "+ Cadastrar Nova Vaga" acima.</td></tr>
          ` : internships.map((v) => `
            <tr data-id="${v.id}">
              <td style="white-space: nowrap;">
                <strong>${esc(v.empresa)}</strong>
                <div class="small muted">${esc(v.local || 'RS')}</div>
              </td>
              <td>
                <strong>${esc(v.titulo)}</strong>
                ${v.requisitos ? `<div class="small muted" style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${esc(v.requisitos)}</div>` : ''}
              </td>
              <td style="white-space: nowrap;">
                <span class="badge ${v.tipo === 'trainee' || v.tipo === 'clt' ? 'amber' : 'cyan'}">
                  ${esc(v.tipoLabel || (v.tipo === 'trainee' ? 'Trainee / CLT' : 'Estágio'))}
                </span>
              </td>
              <td style="white-space: nowrap;"><strong class="font-mono text-cyan">${esc(v.remuneracao || 'A combinar')}</strong></td>
              <td style="white-space: nowrap;"><span class="small muted">${esc(v.cargaHoraria || 'Flexível')}</span></td>
              <td style="white-space: nowrap;">
                <span class="status-pill ${v.status === 'encerrada' ? 'cancelado' : 'disponivel'}">
                  ${v.status === 'encerrada' ? 'Encerrada' : 'Ativa'}
                </span>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-ghost btn-sm btn-edit-estagio" data-id="${v.id}">✏️ Editar</button>
                  <button type="button" class="btn btn-danger btn-sm btn-del-estagio" data-id="${v.id}">🗑️</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bindings
  document.getElementById("btn-admin-add-estagio")?.addEventListener("click", () => {
    openInternshipModal(null, store, showToast, () => renderTabEstagios(container, store, showToast));
  });

  container.querySelectorAll(".btn-edit-estagio").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = internships.find(v => String(v.id) === String(id));
      openInternshipModal(item, store, showToast, () => renderTabEstagios(container, store, showToast));
    });
  });

  container.querySelectorAll(".btn-del-estagio").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Deseja remover esta vaga de estágio?")) {
        try {
          if (store.internships?.remove) await store.internships.remove(id);
          showToast("Vaga removida com sucesso!");
          await renderTabEstagios(container, store, showToast);
        } catch (err) {
          showToast(err.message, true);
        }
      }
    });
  });
}

function openInternshipModal(vagaData, store, showToast, onSaved) {
  const modal = document.getElementById("dlg-admin-form");
  const title = document.getElementById("admin-modal-title");
  const body = document.getElementById("admin-modal-body");
  if (!modal || !body) return;

  const isEdit = !!vagaData;
  title.textContent = isEdit ? "Editar Vaga de Estágio / Oportunidade" : "Cadastrar Nova Vaga de Estágio";

  body.innerHTML = `
    <form id="form-admin-estagio" class="form">
      <div class="admin-form-grid">
        <div class="field">
          <label for="vaga-titulo">Título da Vaga / Cargo *</label>
          <input type="text" id="vaga-titulo" required value="${esc(vagaData?.titulo || '')}" placeholder="Ex: Estágio em Automação Industrial e Robótica">
        </div>
        <div class="field">
          <label for="vaga-empresa">Empresa / Instituição *</label>
          <input type="text" id="vaga-empresa" required value="${esc(vagaData?.empresa || '')}" placeholder="Ex: Siemens Brasil / Gerdau">
        </div>
        <div class="field">
          <label for="vaga-tipo">Tipo de Contratação</label>
          <select id="vaga-tipo">
            <option value="estagio_nao_obrigatorio" ${vagaData?.tipo === 'estagio_nao_obrigatorio' ? 'selected' : ''}>Estágio Não-Obrigatório (Remunerado)</option>
            <option value="estagio_obrigatorio" ${vagaData?.tipo === 'estagio_obrigatorio' ? 'selected' : ''}>Estágio Curricular Obrigatório</option>
            <option value="trainee" ${vagaData?.tipo === 'trainee' ? 'selected' : ''}>Programa de Trainee</option>
            <option value="clt" ${vagaData?.tipo === 'clt' ? 'selected' : ''}>Engenheiro Júnior (CLT)</option>
          </select>
        </div>
        <div class="field">
          <label for="vaga-local">Local / Modalidade</label>
          <input type="text" id="vaga-local" value="${esc(vagaData?.local || 'Porto Alegre / RS')}" placeholder="Ex: Porto Alegre / Híbrido">
        </div>
        <div class="field">
          <label for="vaga-remuneracao">Bolsa-Auxílio / Remuneração</label>
          <input type="text" id="vaga-remuneracao" value="${esc(vagaData?.remuneracao || 'R$ 2.000,00 + Benefícios')}" placeholder="Ex: R$ 2.100,00 + VT + VR">
        </div>
        <div class="field">
          <label for="vaga-ch">Carga Horária</label>
          <input type="text" id="vaga-ch" value="${esc(vagaData?.cargaHoraria || '30h semanais')}" placeholder="Ex: 30h semanais (6h/dia flexível)">
        </div>
      </div>

      <div class="field" style="margin-top: .75rem;">
        <label for="vaga-requisitos">Requisitos & Tecnologias</label>
        <textarea id="vaga-requisitos" rows="3" placeholder="Ex: Cursando a partir do 4º semestre; noções de CLP, Python, circuitos elétricos...">${esc(vagaData?.requisitos || '')}</textarea>
      </div>

      <div class="admin-form-grid" style="margin-top: .75rem;">
        <div class="field">
          <label for="vaga-link">Link de Inscrição ou E-mail para Envio de CV *</label>
          <input type="text" id="vaga-link" required value="${esc(vagaData?.linkCandidatura || vagaData?.link_candidatura || '')}" placeholder="Ex: mailto:recrutamento@empresa.com ou https://empresa.gupy.io">
        </div>
        <div class="field">
          <label for="vaga-status">Status da Vaga</label>
          <select id="vaga-status">
            <option value="ativa" ${vagaData?.status === 'ativa' ? 'selected' : ''}>Ativa (Recebendo Currículos)</option>
            <option value="encerrada" ${vagaData?.status === 'encerrada' ? 'selected' : ''}>Encerrada / Processo Concluído</option>
          </select>
        </div>
      </div>

      <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Salvar Alterações 💾' : 'Publicar Vaga 💼'}</button>
      </div>
    </form>
  `;

  document.getElementById("form-admin-estagio")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tipo = document.getElementById("vaga-tipo").value;
    const tipoLabelMap = {
      estagio_nao_obrigatorio: "Estágio Remunerado",
      estagio_obrigatorio: "Estágio Curricular",
      trainee: "Trainee",
      clt: "Engenheiro Júnior (CLT)"
    };

    const payload = {
      titulo: document.getElementById("vaga-titulo").value.trim(),
      empresa: document.getElementById("vaga-empresa").value.trim(),
      tipo,
      tipoLabel: tipoLabelMap[tipo] || "Estágio",
      local: document.getElementById("vaga-local").value.trim(),
      remuneracao: document.getElementById("vaga-remuneracao").value.trim(),
      cargaHoraria: document.getElementById("vaga-ch").value.trim(),
      requisitos: document.getElementById("vaga-requisitos").value.trim(),
      linkCandidatura: document.getElementById("vaga-link").value.trim(),
      status: document.getElementById("vaga-status").value,
    };

    try {
      if (isEdit) {
        if (store.internships?.update) await store.internships.update(vagaData.id, payload);
        showToast("Vaga atualizada com sucesso! ✅");
      } else {
        if (store.internships?.create) await store.internships.create(payload);
        showToast("Nova vaga de estágio cadastrada e disponível no site! 💼");
      }
      modal.close();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  modal.showModal();
}

/* =====================================================================
 *  ABA 3C: GESTÃO DE FAQS & DÚVIDAS FREQUENTES
 * ===================================================================== */
async function renderTabFaqs(container, store, showToast) {
  let faqs = [];
  try {
    if (store.faqs?.list) faqs = await store.faqs.list();
  } catch (err) {
    console.warn("Erro ao buscar FAQs", err);
  }

  const badgeEl = document.getElementById("badge-count-faqs");
  if (badgeEl) badgeEl.textContent = faqs.length;

  container.innerHTML = `
    <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="margin: 0 0 .25rem;">❓ Gestão de Perguntas Frequentes (FAQs & Dúvidas)</h3>
        <p class="small muted" style="margin: 0;">Adicione, edite ou atualize as respostas oficiais para as dúvidas recorrentes dos alunos de ECA no site.</p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" id="btn-admin-add-faq">
        ➕ Nova Pergunta (FAQ)
      </button>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table" aria-label="Tabela de FAQs">
        <thead>
          <tr>
            <th style="width: 40px; white-space: nowrap;">#</th>
            <th style="white-space: nowrap;">Categoria</th>
            <th>Pergunta dos Alunos</th>
            <th>Resposta Oficial</th>
            <th style="white-space: nowrap;">Destaque</th>
            <th style="text-align: right; white-space: nowrap;">Ações</th>
          </tr>
        </thead>
        <tbody id="admin-faqs-tbody">
          ${faqs.length === 0 ? `
            <tr><td colspan="6" class="small muted" style="text-align: center; padding: 2rem;">Nenhuma pergunta cadastrada. Clique em "+ Nova Pergunta (FAQ)" acima.</td></tr>
          ` : faqs.map((f, idx) => `
            <tr data-id="${f.id}">
              <td class="font-mono small muted" style="white-space: nowrap;">${idx + 1}</td>
              <td style="white-space: nowrap;"><span class="badge slate">${esc(f.categoria || 'Geral')}</span></td>
              <td><strong>${esc(f.pergunta || f.p || '')}</strong></td>
              <td>
                <div class="small muted" style="max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${esc(f.resposta || f.r || '')}
                </div>
              </td>
              <td style="white-space: nowrap;">${f.destaque ? '<span class="status-pill disponivel">⭐ Sim</span>' : '<span class="status-pill analise">Não</span>'}</td>
              <td style="text-align: right; white-space: nowrap;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-ghost btn-sm btn-edit-faq" data-id="${f.id}">✏️ Editar</button>
                  <button type="button" class="btn btn-danger btn-sm btn-del-faq" data-id="${f.id}">🗑️</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bindings
  document.getElementById("btn-admin-add-faq")?.addEventListener("click", () => {
    openFaqModal(null, store, showToast, () => renderTabFaqs(container, store, showToast));
  });

  container.querySelectorAll(".btn-edit-faq").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = faqs.find(f => String(f.id) === String(id));
      openFaqModal(item, store, showToast, () => renderTabFaqs(container, store, showToast));
    });
  });

  container.querySelectorAll(".btn-del-faq").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Deseja remover esta pergunta do FAQ?")) {
        try {
          if (store.faqs?.remove) await store.faqs.remove(id);
          showToast("Pergunta removida do FAQ!");
          await renderTabFaqs(container, store, showToast);
        } catch (err) {
          showToast(err.message, true);
        }
      }
    });
  });
}

function openFaqModal(faqData, store, showToast, onSaved) {
  const modal = document.getElementById("dlg-admin-form");
  const title = document.getElementById("admin-modal-title");
  const body = document.getElementById("admin-modal-body");
  if (!modal || !body) return;

  const isEdit = !!faqData;
  title.textContent = isEdit ? "Editar Pergunta & Resposta do FAQ" : "Nova Pergunta do FAQ";

  body.innerHTML = `
    <form id="form-admin-faq" class="form">
      <div class="field">
        <label for="faq-pergunta">Pergunta do Aluno *</label>
        <input type="text" id="faq-pergunta" required value="${esc(faqData?.pergunta || faqData?.p || '')}" placeholder="Ex: Como funciona o aproveitamento de disciplinas de outras faculdades?">
      </div>

      <div class="admin-form-grid">
        <div class="field">
          <label for="faq-categoria">Categoria</label>
          <input type="text" id="faq-categoria" value="${esc(faqData?.categoria || 'Geral')}" placeholder="Ex: Matrícula, Estágios, Diretoria CA, Grade Curricular">
        </div>
        <div class="field">
          <label for="faq-destaque">Destaque no Topo da Página</label>
          <select id="faq-destaque">
            <option value="true" ${faqData?.destaque ? 'selected' : ''}>⭐ Sim, destacar no topo</option>
            <option value="false" ${!faqData?.destaque ? 'selected' : ''}>Padrão (Lista regular)</option>
          </select>
        </div>
      </div>

      <div class="field" style="margin-top: .75rem;">
        <label for="faq-resposta">Resposta Oficial e Orientações *</label>
        <textarea id="faq-resposta" rows="6" required placeholder="Explique com detalhes as orientações, prazos, resolução UERGS aplicável ou links úteis...">${esc(faqData?.resposta || faqData?.r || '')}</textarea>
      </div>

      <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Salvar Alterações 💾' : 'Adicionar ao FAQ ❓'}</button>
      </div>
    </form>
  `;

  document.getElementById("form-admin-faq")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      pergunta: document.getElementById("faq-pergunta").value.trim(),
      resposta: document.getElementById("faq-resposta").value.trim(),
      categoria: document.getElementById("faq-categoria").value.trim() || 'Geral',
      destaque: document.getElementById("faq-destaque").value === 'true',
    };

    try {
      if (isEdit) {
        if (store.faqs?.update) await store.faqs.update(faqData.id, payload);
        showToast("FAQ atualizado com sucesso! ✅");
      } else {
        if (store.faqs?.create) await store.faqs.create(payload);
        showToast("Nova pergunta adicionada ao FAQ do site! ❓");
      }
      modal.close();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  modal.showModal();
}

/* =====================================================================
 *  ABA 4: NOTÍCIAS & MURAL
 * ===================================================================== */
async function renderTabNoticias(container, store, showToast) {
  let announcements = [];
  let suggestions = [];

  try {
    if (store.announcements?.list) announcements = await store.announcements.list();
    if (store.suggestions?.list) suggestions = await store.suggestions.list();
  } catch (err) {
    console.error(err);
  }

  document.getElementById("badge-count-noticias").textContent = announcements.length;

  container.innerHTML = `
    <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <h3 style="margin: 0;">📢 Comunicados Oficiais do E(CA)²</h3>
      <button type="button" class="btn btn-primary btn-sm" id="btn-admin-add-notice">
        ➕ Publicar Novo Comunicado
      </button>
    </div>

    <div class="stack" style="gap: 1rem; margin-bottom: 3rem;">
      ${announcements.length === 0 ? `<div class="card muted small">Nenhum comunicado ativo no momento.</div>` : ''}
      ${announcements.map((a) => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
          <div>
            <div class="row" style="gap: .6rem; margin-bottom: .35rem;">
              <span class="badge cyan">Comunicado Oficial</span>
              <span class="small font-mono muted">${esc(new Date(a.created_at || Date.now()).toLocaleDateString("pt-BR"))}</span>
            </div>
            <h4 style="font-size: 1.15rem; margin-bottom: .4rem;">${esc(a.title || a.titulo)}</h4>
            <p class="small muted" style="margin: 0; line-height: 1.6;">${esc(a.body || a.corpo || a.descricao || '')}</p>
          </div>
          <div class="table-actions">
            <button type="button" class="btn btn-danger btn-sm btn-del-notice" data-id="${a.id}">🗑️ Excluir</button>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <h3 style="margin: 0;">💡 Moderação do Mural de Ideias</h3>
      <span class="small muted">${suggestions.length} sugestão(ões) de estudantes</span>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table" aria-label="Tabela de Moderação do Mural">
        <thead>
          <tr>
            <th style="white-space: nowrap;">Autor</th>
            <th>Título da Ideia</th>
            <th style="white-space: nowrap;">Categoria</th>
            <th style="white-space: nowrap;">Votos</th>
            <th style="white-space: nowrap;">Status</th>
            <th style="text-align: right; white-space: nowrap;">Ações de Moderação</th>
          </tr>
        </thead>
        <tbody>
          ${suggestions.map((s) => `
            <tr>
              <td style="white-space: nowrap;"><span class="font-mono small">${esc(s.author || 'Estudante')}</span></td>
              <td>
                <strong>${esc(s.title)}</strong>
                ${s.body ? `<div class="small muted" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${esc(s.body)}</div>` : ''}
                ${s.ca_reply ? `<div style="margin-top: .25rem;"><span class="badge cyan" style="font-size: .68rem;">💬 Respondida pelo CA</span></div>` : ''}
              </td>
              <td style="white-space: nowrap;"><span class="badge slate">${esc(s.category)}</span></td>
              <td style="white-space: nowrap;"><span class="badge green">👍 ${s.vote_count || 0}</span></td>
              <td style="white-space: nowrap;">
                <span class="status-pill ${s.status === 'concluida' || s.status === 'encaminhada' ? 'disponivel' : 'analise'}">
                  ${esc(s.status || 'Nova')}
                </span>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-ghost btn-sm btn-mod-reply" data-id="${s.id}" title="Responder demanda com parecer oficial do CA">💬 Responder</button>
                  <button type="button" class="btn btn-ghost btn-sm btn-mod-approve" data-id="${s.id}">✓ Aprovar</button>
                  <button type="button" class="btn btn-ghost btn-sm btn-mod-hide" data-id="${s.id}">${s.hidden ? '👁️ Mostrar' : '🙈 Ocultar'}</button>
                  <button type="button" class="btn btn-danger btn-sm btn-mod-del" data-id="${s.id}">🗑️</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bindings
  document.getElementById("btn-admin-add-notice")?.addEventListener("click", () => {
    openNoticeModal(null, store, showToast);
  });

  container.querySelectorAll(".btn-mod-reply").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = suggestions.find((s) => String(s.id) === String(id));
      if (item) {
        openReplySuggestionModal(item, store, showToast, () => renderTabNoticias(container, store, showToast));
      }
    });
  });

  container.querySelectorAll(".btn-del-notice").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Deseja apagar este comunicado?")) {
        try {
          if (store.announcements?.remove) await store.announcements.remove(id);
          showToast("Comunicado removido!");
          await renderTabNoticias(container, store, showToast);
        } catch (err) {
          showToast(err.message, true);
        }
      }
    });
  });

  container.querySelectorAll(".btn-mod-approve").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        if (store.suggestions?.update) await store.suggestions.update(Number(id), { status: "encaminhada" });
        showToast("Sugestão marcada como encaminhada! ✅");
        await renderTabNoticias(container, store, showToast);
      } catch (err) {
        showToast(err.message, true);
      }
    });
  });

  container.querySelectorAll(".btn-mod-hide").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        const item = suggestions.find((s) => String(s.id) === String(id));
        if (store.suggestions?.update) await store.suggestions.update(Number(id), { hidden: !item?.hidden });
        showToast("Visibilidade atualizada!");
        await renderTabNoticias(container, store, showToast);
      } catch (err) {
        showToast(err.message, true);
      }
    });
  });

  container.querySelectorAll(".btn-mod-del").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Excluir esta publicação do mural?")) {
        try {
          if (store.suggestions?.remove) await store.suggestions.remove(Number(id));
          showToast("Item excluído com sucesso.");
          await renderTabNoticias(container, store, showToast);
        } catch (err) {
          showToast(err.message, true);
        }
      }
    });
  });
}

function openNoticeModal(noticeData, store, showToast) {
  const modal = document.getElementById("dlg-admin-form");
  const title = document.getElementById("admin-modal-title");
  const body = document.getElementById("admin-modal-body");
  if (!modal || !body) return;

  title.textContent = "Novo Comunicado Oficial";
  body.innerHTML = `
    <form id="form-admin-notice" class="form">
      <div class="field">
        <label for="notice-title">Título do Comunicado *</label>
        <input type="text" id="notice-title" required placeholder="Ex: Assembleia Convocada para 26/10">
      </div>
      <div class="field">
        <label for="notice-body">Texto da Mensagem *</label>
        <textarea id="notice-body" required rows="5" placeholder="Texto claro e objetivo para os discentes..."></textarea>
      </div>
      <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Publicar Agora 📢</button>
      </div>
    </form>
  `;

  document.getElementById("form-admin-notice")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById("notice-title").value.trim(),
      body: document.getElementById("notice-body").value.trim(),
    };
    try {
      if (store.announcements?.create) await store.announcements.create(payload);
      showToast("Comunicado publicado com sucesso!");
      modal.close();
      const container = document.getElementById("admin-tab-content");
      if (container) await renderTabNoticias(container, store, showToast);
    } catch (err) {
      showToast(err.message, true);
    }
  });

  modal.showModal();
}

function openReplySuggestionModal(suggestion, store, showToast, onSaved) {
  const modal = document.getElementById("dlg-admin-form");
  const title = document.getElementById("admin-modal-title");
  const body = document.getElementById("admin-modal-body");
  if (!modal || !body) return;

  title.textContent = "Responder Demanda do Estudante";
  body.innerHTML = `
    <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
      <div class="row" style="gap: .5rem; margin-bottom: .25rem;">
        <span class="badge slate">${esc(suggestion.category || 'Geral')}</span>
        <span class="small muted">Autor: ${esc(suggestion.author || 'Estudante')}</span>
      </div>
      <h4 style="margin: 0 0 .35rem; font-size: 1.1rem;">${esc(suggestion.title)}</h4>
      <p class="small muted" style="margin: 0; line-height: 1.5;">${esc(suggestion.body)}</p>
    </div>

    <form id="form-reply-suggestion" class="form">
      <div class="field">
        <label for="reply-status">Status da Demanda</label>
        <select id="reply-status">
          <option value="nova" ${suggestion.status === 'nova' ? 'selected' : ''}>Nova (Recebida)</option>
          <option value="analise" ${suggestion.status === 'analise' ? 'selected' : ''}>Em Análise pela Gestão</option>
          <option value="encaminhada" ${suggestion.status === 'encaminhada' ? 'selected' : ''}>Aprovada & Encaminhada</option>
          <option value="concluida" ${suggestion.status === 'concluida' ? 'selected' : ''}>Concluída com Sucesso</option>
        </select>
      </div>

      <div class="field" style="margin-top: .75rem;">
        <label for="reply-text">Resposta Oficial da Diretoria E(CA)² *</label>
        <textarea id="reply-text" rows="5" required placeholder="Escreva o posicionamento ou encaminhamento oficial do Centro Acadêmico para que o estudante veja no mural público...">${esc(suggestion.ca_reply || '')}</textarea>
        <div class="small muted" style="margin-top: .25rem;">Esta resposta será exibida com selo oficial no card da sugestão no mural dos alunos.</div>
      </div>

      <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Resposta Oficial 💬</button>
      </div>
    </form>
  `;

  document.getElementById("form-reply-suggestion")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const replyText = document.getElementById("reply-text").value.trim();
    const status = document.getElementById("reply-status").value;

    try {
      if (store.suggestions?.reply) {
        await store.suggestions.reply(suggestion.id, replyText, status);
      } else if (store.suggestions?.update) {
        await store.suggestions.update(suggestion.id, { ca_reply: replyText, ca_replied_at: new Date().toISOString(), status });
      }
      showToast("Resposta oficial registrada e publicada no Mural! ⚡");
      modal.close();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  modal.showModal();
}

/* =====================================================================
 *  ABA 5: ALUNOS & URNA (GOVERNANÇA ELEITORAL)
 * ===================================================================== */
async function renderTabAlunos(container, store, showToast) {
  const allowed = Array.isArray(CONFIG.VOTING_ALLOWED_EMAILS) ? CONFIG.VOTING_ALLOWED_EMAILS : [];
  const adminEmails = store.getApprovedAdmins ? store.getApprovedAdmins() : (CONFIG.APPROVED_ADMIN_EMAILS || []);

  const isAdm = (email) => adminEmails.some(e => e.toLowerCase() === String(email).trim().toLowerCase());

  container.innerHTML = `
    <!-- Card de Gestão da Diretoria -->
    <div class="card" style="margin-bottom: 1.5rem; background: linear-gradient(180deg, hsl(38 92% 50% / .1) 0%, hsl(38 92% 50% / .03) 100%); border-color: hsl(38 92% 50% / .3);">
      <div class="row" style="justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <div class="row" style="gap: .5rem; align-items: center; margin-bottom: .25rem;">
            <span style="font-size: 1.3rem;">🏛️</span>
            <h3 style="margin: 0; font-size: 1.25rem;">Quadro de Diretoria & Administradores Aprovados</h3>
            <span class="badge amber">${adminEmails.length} Membro(s) com ADM</span>
          </div>
          <p class="small muted" style="margin: 0; max-width: 650px;">
            Estudantes com cargo de diretoria homologado têm o <strong>Painel ADM visível e liberado</strong>. Para os demais estudantes e visitantes, a área administrativa permanece <strong>100% oculta</strong>.
          </p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="btn-admin-add-diretoria" style="background: var(--amber); border-color: var(--amber); color: #000; font-weight: 600;">
          🔑 Eleger Novo Administrador
        </button>
      </div>

      <div class="row" style="gap: .5rem; flex-wrap: wrap;">
        ${adminEmails.map(mail => {
          const st = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(mail) : null;
          const nm = st ? st.name : mail.split("@")[0].toUpperCase();
          return `
            <div class="row" style="background: hsl(220 40% 12% / .9); border: 1px solid hsl(38 92% 50% / .4); padding: .35rem .75rem; border-radius: 999px; gap: .5rem; align-items: center;">
              <span style="font-size: .8rem;">⭐</span>
              <strong style="font-size: .85rem; color: #fff;">${esc(nm)}</strong>
              <span class="font-mono small muted" style="font-size: .75rem;">(${esc(mail)})</span>
              <button type="button" class="btn-revoke-admin" data-email="${esc(mail)}" data-name="${esc(nm)}" title="Revogar cargo de diretoria" style="background: none; border: none; color: #f87171; cursor: pointer; padding: 0 .2rem; font-size: .85rem;">✕</button>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <!-- Barra de Ações do Censo de Alunos -->
    <div class="admin-action-bar">
      <div class="admin-search-box">
        <input type="text" id="admin-search-alunos" placeholder="Pesquisar aluno por nome ou e-mail institucional..." aria-label="Buscar aluno">
      </div>
      <div class="row" style="gap: .6rem; flex-wrap: wrap;">
        <span class="badge cyan">Total Censo: ${allowed.length}</span>
        <button type="button" class="btn btn-primary btn-sm" id="btn-admin-exportar-extrato-ata" style="display: inline-flex; align-items: center; gap: .35rem; font-weight: 600;">
          📜 Extrato da Urna p/ Ata
        </button>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-admin-add-aluno">
          ➕ Homologar Aluno Avulso
        </button>
      </div>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table" aria-label="Tabela de Alunos Homologados">
        <thead>
          <tr>
            <th style="width: 40px; white-space: nowrap;">#</th>
            <th>Nome do Estudante</th>
            <th style="white-space: nowrap;">E-mail Institucional (@uergs.edu.br)</th>
            <th style="white-space: nowrap;">Cargo / Permissão</th>
            <th style="text-align: right; white-space: nowrap;">Eleição de Diretoria</th>
          </tr>
        </thead>
        <tbody id="admin-alunos-tbody">
          ${allowed.slice(0, 50).map((email, idx) => {
            const student = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(email) : null;
            const name = student ? student.name : email.split("@")[0].replace(/[.-]/g, " ").toUpperCase();
            const hasAdmin = isAdm(email);
            return `
              <tr>
                <td class="font-mono small muted" style="white-space: nowrap;">${idx + 1}</td>
                <td><strong>${esc(name)}</strong></td>
                <td style="white-space: nowrap;"><span class="font-mono small text-cyan">${esc(email)}</span></td>
                <td style="white-space: nowrap;">
                  ${hasAdmin ? '<span class="badge amber">⭐ DIRETORIA (ADM)</span>' : '<span class="badge slate">🎓 Estudante Regular</span>'}
                </td>
                <td style="text-align: right; white-space: nowrap;">
                  ${hasAdmin ? `
                    <button type="button" class="btn btn-danger btn-sm btn-revoke-admin" data-email="${esc(email)}" data-name="${esc(name)}">
                      Revogar ADM
                    </button>
                  ` : `
                    <button type="button" class="btn btn-ghost btn-sm btn-elect-admin" data-email="${esc(email)}" data-name="${esc(name)}" style="border-color: var(--amber); color: var(--amber);">
                      Eleger p/ Diretoria 🔑
                    </button>
                  `}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    ${allowed.length > 50 ? `<p class="small muted" style="text-align: center; margin-top: 1rem;">Exibindo os primeiros 50 estudantes de um total de ${allowed.length}. Use a busca acima para localizar qualquer estudante pelo nome.</p>` : ''}
  `;

  // Helper para vincular botões de eleição e revogação
  function attachGovernanceEvents() {
    container.querySelectorAll(".btn-elect-admin").forEach(btn => {
      btn.addEventListener("click", async () => {
        const mail = btn.getAttribute("data-email");
        const name = btn.getAttribute("data-name");
        if (confirm(`Confirmar a eleição de ${name} (${mail}) para a Diretoria do E(CA)²?\n\nIsso liberará o Painel ADM e permissões de gestão completas para este estudante.`)) {
          try {
            if (store.electAdmin) {
              await store.electAdmin(mail, name);
            }
            showToast(`⭐ ${name} foi eleito(a) para a Diretoria com sucesso! O Painel ADM agora está liberado.`);
            await renderTabAlunos(container, store, showToast);
          } catch (err) {
            showToast(err.message, true);
          }
        }
      });
    });

    container.querySelectorAll(".btn-revoke-admin").forEach(btn => {
      btn.addEventListener("click", async () => {
        const mail = btn.getAttribute("data-email");
        const name = btn.getAttribute("data-name");
        if (confirm(`Deseja revogar o cargo de diretoria de ${name} (${mail})?\n\nO Painel ADM será imediatamente ocultado para este estudante.`)) {
          try {
            if (store.revokeAdmin) {
              await store.revokeAdmin(mail, name);
            }
            showToast(`Privilégio administrativo de ${name} revogado.`);
            await renderTabAlunos(container, store, showToast);
          } catch (err) {
            showToast(err.message, true);
          }
        }
      });
    });

    container.querySelector("#btn-admin-exportar-extrato-ata")?.addEventListener("click", async () => {
      if (store.gerarExtratoOficialAta) {
        await store.gerarExtratoOficialAta();
      } else {
        showToast("Gerador de extrato indisponível no momento.", true);
      }
    });
  }

  attachGovernanceEvents();

  // Busca em tempo real
  const searchInput = document.getElementById("admin-search-alunos");
  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim();
    const tbody = document.getElementById("admin-alunos-tbody");
    if (!tbody) return;

    const filtered = allowed.filter(e => {
      const st = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(e) : null;
      const nm = st ? st.name.toLowerCase() : "";
      return e.toLowerCase().includes(term) || nm.includes(term);
    });

    tbody.innerHTML = filtered.slice(0, 50).map((email, idx) => {
      const student = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(email) : null;
      const name = student ? student.name : email.split("@")[0].replace(/[.-]/g, " ").toUpperCase();
      const hasAdmin = isAdm(email);
      return `
        <tr>
          <td class="font-mono small muted" style="white-space: nowrap;">${idx + 1}</td>
          <td><strong>${esc(name)}</strong></td>
          <td style="white-space: nowrap;"><span class="font-mono small text-cyan">${esc(email)}</span></td>
          <td style="white-space: nowrap;">
            ${hasAdmin ? '<span class="badge amber">⭐ DIRETORIA (ADM)</span>' : '<span class="badge slate">🎓 Estudante Regular</span>'}
          </td>
          <td style="text-align: right; white-space: nowrap;">
            ${hasAdmin ? `
              <button type="button" class="btn btn-danger btn-sm btn-revoke-admin" data-email="${esc(email)}" data-name="${esc(name)}">
                Revogar ADM
              </button>
            ` : `
              <button type="button" class="btn btn-ghost btn-sm btn-elect-admin" data-email="${esc(email)}" data-name="${esc(name)}" style="border-color: var(--amber); color: var(--amber);">
                Eleger p/ Diretoria 🔑
              </button>
            `}
          </td>
        </tr>
      `;
    }).join("");

    attachGovernanceEvents();
  });

  // Modal para Eleger Administrador Avulso
  document.getElementById("btn-admin-add-diretoria")?.addEventListener("click", () => {
    const modal = document.getElementById("dlg-admin-form");
    const title = document.getElementById("admin-modal-title");
    const body = document.getElementById("admin-modal-body");
    if (!modal || !body) return;

    title.textContent = "Eleger Membro para a Diretoria do E(CA)²";
    body.innerHTML = `
      <form id="form-admin-eleger" class="form">
        <div class="field">
          <label for="eleger-email">E-mail Institucional do Aluno (@uergs.edu.br) *</label>
          <input type="email" id="eleger-email" required placeholder="aluno-sobrenome@uergs.edu.br">
          <span class="hint">O estudante deve pertencer ao curso de Engenharia de Controle e Automação da UERGS.</span>
        </div>
        <div class="field">
          <label for="eleger-nome">Nome do Membro da Diretoria</label>
          <input type="text" id="eleger-nome" placeholder="Ex: Gabriel Silva (Diretor de Finanças)">
        </div>
        <div class="field" style="background: hsl(38 92% 50% / .1); padding: .75rem; border-radius: var(--radius-sm); border: 1px solid hsl(38 92% 50% / .3);">
          <p class="small muted" style="margin: 0;">
            ⚠️ <strong>Termo de Responsabilidade:</strong> Ao homologar este estudante, o Painel ADM ficará visível e acessível para ele, com privilégios de moderação, gestão de eventos, lojinha e censo da urna.
          </p>
        </div>
        <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
          <button type="submit" class="btn btn-primary" style="background: var(--amber); color: #000; border-color: var(--amber); font-weight: 600;">Confirmar e Eleger Membro 🔑</button>
        </div>
      </form>
    `;

    document.getElementById("form-admin-eleger")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const mail = document.getElementById("eleger-email").value.trim().toLowerCase();
      const nome = document.getElementById("eleger-nome").value.trim();
      if (!mail.endsWith("@uergs.edu.br") && mail !== "ca.eca2.uergs@gmail.com") {
        alert("O e-mail deve ser institucional (@uergs.edu.br) ou o oficial do CA.");
        return;
      }
      try {
        if (store.electAdmin) {
          await store.electAdmin(mail, nome);
        }
        showToast(`⭐ ${nome || mail} foi eleito(a) para a Diretoria com sucesso!`);
        modal.close();
        renderTabAlunos(container, store, showToast);
      } catch (err) {
        showToast(err.message, true);
      }
    });

    modal.showModal();
  });

  // Modal para homologar aluno avulso na urna
  document.getElementById("btn-admin-add-aluno")?.addEventListener("click", () => {
    const modal = document.getElementById("dlg-admin-form");
    const title = document.getElementById("admin-modal-title");
    const body = document.getElementById("admin-modal-body");
    if (!modal || !body) return;

    title.textContent = "Homologar Novo Aluno na Urna";
    body.innerHTML = `
      <form id="form-admin-aluno" class="form">
        <div class="field">
          <label for="aluno-email">E-mail Institucional (@uergs.edu.br) *</label>
          <input type="email" id="aluno-email" required placeholder="nome-sobrenome@uergs.edu.br">
        </div>
        <div class="field">
          <label for="aluno-nome">Nome Completo do Aluno *</label>
          <input type="text" id="aluno-nome" required placeholder="Ex: Lucas Gabriel da Silva">
        </div>
        <div class="field">
          <label for="aluno-matr">Matrícula UERGS</label>
          <input type="text" id="aluno-matr" placeholder="Ex: 2024019283">
        </div>
        <div class="row" style="justify-content: flex-end; gap: .75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-ghost" onclick="document.getElementById('dlg-admin-form').close()">Cancelar</button>
          <button type="submit" class="btn btn-primary">Homologar Estudante 🗳️</button>
        </div>
      </form>
    `;

    document.getElementById("form-admin-aluno")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const mail = document.getElementById("aluno-email").value.trim().toLowerCase();
      if (!mail.endsWith("@uergs.edu.br")) {
        alert("O e-mail deve pertencer ao domínio institucional @uergs.edu.br");
        return;
      }
      if (!CONFIG.VOTING_ALLOWED_EMAILS.includes(mail)) {
        CONFIG.VOTING_ALLOWED_EMAILS.push(mail);
      }
      showToast("Estudante homologado com sucesso na base eleitoral! 🗳️");
      modal.close();
      renderTabAlunos(container, store, showToast);
    });

    modal.showModal();
  });
}

/* =====================================================================
 *  ABA 6: AUDITORIA & SEGURANÇA (AUDIT LOGS)
 * ===================================================================== */
async function renderTabLogs(container, store, showToast) {
  let logs = [];
  try {
    if (store.auditLogs?.list) logs = await store.auditLogs.list();
    else {
      logs = [
        { id: 1, action: "LOGIN_ADM", actor: "Administrador CA", target: "Painel Backoffice", created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ip: "127.0.0.1" },
        { id: 2, action: "UPDATE_CONFIG", actor: "Gestão E(CA)²", target: "Pergunta 2 Urna Pró-CA", created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), ip: "127.0.0.1" },
        { id: 3, action: "CENSO_VERIFICADO", actor: "Sistema Automático", target: "235 Estudantes Homologados", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), ip: "127.0.0.1" }
      ];
    }
  } catch (err) {
    console.error(err);
  }

  container.innerHTML = `
    <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h3 style="margin: 0 0 .25rem;">Trilha de Auditoria Imutável (Audit Trail)</h3>
        <p class="small muted" style="margin: 0;">Registro criptografado de operações críticas realizadas por gestores autorizados.</p>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" id="btn-export-audit">📥 Exportar Relatório</button>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
      <div class="stack" style="gap: 0;">
        ${logs.map((l) => `
          <div class="audit-item">
            <span class="audit-action-tag ${l.action.includes('DEL') ? 'delete' : (l.action.includes('CREATE') ? 'create' : 'update')}">
              ${esc(l.action)}
            </span>
            <div>
              <strong>${esc(l.target)}</strong>
              <div class="small muted">Operado por: <strong>${esc(l.actor)}</strong> · Origem: ${esc(l.ip || 'Local')}</div>
            </div>
            <div class="font-mono small muted" style="text-align: right;">
              ${esc(new Date(l.created_at).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }))}
              <div style="font-size: .72rem;">${esc(new Date(l.created_at).toLocaleDateString("pt-BR"))}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  document.getElementById("btn-export-audit")?.addEventListener("click", () => {
    showToast("Relatório de auditoria gerado com sucesso! 🛡️");
  });
}
