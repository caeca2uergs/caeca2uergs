/**
 * =====================================================================
 * Eca² – Módulo de Comunidade: Mural, Enquetes & Fórum (comunidade.js)
 * Carregado sob demanda (Code-Splitting ES6)
 * =====================================================================
 */
import { CATEGORIAS_SUGESTAO, CATEGORIAS_FORUM, STATUS_SUGESTAO } from "../content.js";
import { getAuth } from "../store.js";

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

// -------------------------------------------------------------
// VISTA: MURAL DE SUGESTÕES
// -------------------------------------------------------------
export function renderMuralHtml() {
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

export async function setupMuralInteractions(store, showToast, formatRelativeTime) {
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
                <div class="ca-official-reply" style="margin-top: .85rem; padding: .85rem 1.15rem; border-radius: var(--radius-sm); background: hsl(199 92% 60% / .08); border: 1px solid hsl(199 92% 60% / .4);">
                  <div class="row" style="gap: .5rem; margin-bottom: .3rem; align-items: center; flex-wrap: wrap;">
                    <span class="badge cyan" style="font-size: .75rem; padding: .15rem .55rem;">Resposta Oficial da Diretoria E(CA)²</span>
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
export function renderEnquetesHtml() {
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

export async function setupEnquetesInteractions(store, showToast) {
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
export function renderForumHtml() {
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

export async function setupForumInteractions(store, navigate, showToast, formatRelativeTime) {
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
        <div class="card topic-row hover ${isPinned ? 'topic-pinned' : ''}" style="${isPinned ? 'border: 1px solid hsl(43 96% 56% / .45); background: hsl(43 96% 56% / .04);' : ''}">
          <div>
            <div class="row" style="margin-bottom: .25rem; align-items: center; gap: .4rem;">
              <span class="badge slate">${escapeHtml(t.category)}</span>
              ${isPinned ? '<span class="badge amber" style="font-size: .75rem;">Destaque · Oficial</span>' : ''}
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
export async function renderTopicDetail(id, store, navigate, showToast, formatRelativeTime) {
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
        await renderTopicDetail(id, store, navigate, showToast, formatRelativeTime);
      } catch (err) {
        showToast(err.message, true);
      }
    });

  } catch (err) {
    root.innerHTML = `<div class="container section"><p>${err.message}</p></div>`;
  }
}

