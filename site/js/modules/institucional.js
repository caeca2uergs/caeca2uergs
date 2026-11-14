/**
 * =====================================================================
 * Eca² – Módulo Institucional, Transparência, Ouvidoria e FAQ (institucional.js)
 * Carregado sob demanda (Code-Splitting ES6)
 * =====================================================================
 */
import { CONFIG } from "../config.js";
import { DOCUMENTOS_OFICIAIS, PRINCIPIOS, CATEGORIAS_SUGESTAO, FAQ } from "../content.js";
import { getAuth } from "../store.js";

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

// -------------------------------------------------------------
// VISTA: DOCUMENTOS OFICIAIS & ESTATUTOS (PDFs)
// -------------------------------------------------------------
export function renderDocumentosHtml() {
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

export function bindPdfPreviewButtons() {
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

export function setupDocumentosInteractions() {
  bindPdfPreviewButtons();
}

// -------------------------------------------------------------
// VISTA: QUEM SOMOS & GESTÃO (#ca)
// -------------------------------------------------------------
export function renderCaHtml() {
  const totalAlunos = CONFIG.STUDENTS_DATABASE ? CONFIG.STUDENTS_DATABASE.length : 203;
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow"><span class="led-dot cyan"></span> ENTIDADE REPRESENTATIVA DISCENTE · UERGS POA</span>
          <h2>Quem Somos & Gestão E(CA)²</h2>
          <p>
            O <strong>Centro Acadêmico de Engenharia de Controle e Automação — E(CA)²</strong> é o órgão oficial de representação dos ${totalAlunos} estudantes do curso na Unidade Porto Alegre da UERGS, constituído sob a égide da Lei Federal nº 7.395/1985.
          </p>
        </div>

        <!-- Chassi Institucional -->
        <div class="tech-frame" style="padding: 2rem; margin-bottom: 2.5rem; background: var(--surface); border: 1px solid var(--border-strong);">
          <div class="grid grid-3" style="gap: 1.25rem; margin-bottom: 1.5rem;">
            <div style="background: hsl(222 35% 8% / .7); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border);">
              <span class="badge cyan" style="margin-bottom: .5rem;">IDENTIDADE</span>
              <h3 style="margin: 0 0 .4rem; font-size: 1.15rem;">Por que E(CA)²?</h3>
              <p class="small muted" style="margin: 0; line-height: 1.6;">
                <strong>E</strong>ngenharia de <strong>C</strong>ontrole e <strong>A</strong>utomação ao quadrado: representa a sinergia entre Controle × Automação e a força coletiva de todos os semestres em malha fechada.
              </p>
            </div>
            <div style="background: hsl(222 35% 8% / .7); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border);">
              <span class="badge green" style="margin-bottom: .5rem;">MISSÃO</span>
              <h3 style="margin: 0 0 .4rem; font-size: 1.15rem;">Defesa & Instrumentação</h3>
              <p class="small muted" style="margin: 0; line-height: 1.6;">
                Defender os direitos acadêmicos perante o Colegiado e o CONSUN/CONEPE, promover visitas técnicas, oficinas práticas de bancada e aproximar os alunos da indústria gaúcha.
              </p>
            </div>
            <div style="background: hsl(222 35% 8% / .7); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border);">
              <span class="badge amber" style="margin-bottom: .5rem;">BASE LEGAL</span>
              <h3 style="margin: 0 0 .4rem; font-size: 1.15rem;">Gestão 2026/2027</h3>
              <p class="small muted" style="margin: 0; line-height: 1.6;">
                Fundado na Assembleia Geral de 26/10/2026 no Campus Central (Rua Washington Luiz, 675), com Estatuto Social próprio e gestão horizontal por comissões.
              </p>
            </div>
          </div>

          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px dashed var(--border); padding-top: 1.25rem;">
            <span class="small muted" style="font-family: var(--font-mono);">LEMA OFICIAL: <strong>"Sem feedback não há controle."</strong></span>
            <div class="row" style="gap: .6rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary btn-sm btn-preview-pdf" data-pdf-url="pdf/Estatuto_ECA2_2026.pdf" data-pdf-title="Estatuto Social do E(CA)² (2026)">
                📜 Ler Estatuto Social
              </button>
              <a href="#transparencia" class="btn btn-ghost btn-sm">📊 Ver Transparência & Contas</a>
              <a href="#ouvidoria" class="btn btn-ghost btn-sm">📬 Fale com o CA</a>
            </div>
          </div>
        </div>

        <!-- Os 4 Pilares Estatutários -->
        <div class="section-head" style="margin-bottom: 1.5rem;">
          <span class="eyebrow">Princípios Estatutários</span>
          <h3>Os 4 Pilares do E(CA)²</h3>
        </div>
        <div class="grid grid-4" style="margin-bottom: 3rem;">
          ${PRINCIPIOS.map((p, idx) => `
            <div class="mod-card">
              <div class="mod-head">
                <span class="channel-id">PILAR-0${idx + 1}</span>
                <span class="channel-tag">ART. 2º</span>
              </div>
              <div style="font-size: 1.8rem; margin-bottom: .6rem;">${p.icone}</div>
              <h3>${p.titulo}</h3>
              <p>${p.texto}</p>
            </div>
          `).join("")}
        </div>

        <!-- Comissões de Trabalho -->
        <div class="section-head" style="margin-bottom: 1.5rem;">
          <span class="eyebrow">Organização Horizontal</span>
          <h3>Diretorias & Comissões de Atuação</h3>
          <p>Qualquer estudante de Engenharia de Controle e Automação pode integrar as comissões temáticas do CA:</p>
        </div>
        <div class="grid grid-3" style="gap: 1.25rem; margin-bottom: 3rem;">
          <div class="card">
            <span class="badge cyan" style="margin-bottom: .5rem;">COMISSÃO 01</span>
            <h4>Ensino & Assuntos Acadêmicos</h4>
            <p class="small muted">Acompanhamento da oferta semestral de disciplinas, transição entre PPC 2019 e PPC 2024, quebra de pré-requisitos e diálogo direto com a Coordenação de Curso.</p>
          </div>
          <div class="card">
            <span class="badge amber" style="margin-bottom: .5rem;">COMISSÃO 02</span>
            <h4>Infraestrutura & Laboratórios</h4>
            <p class="small muted">Zelo pelas bancadas de CLP, Robótica, Eletrônica e Informática, levantamento de insumos e acompanhamento das metas de expansão do Apêndice C do PPC.</p>
          </div>
          <div class="card">
            <span class="badge green" style="margin-bottom: .5rem;">COMISSÃO 03</span>
            <h4>Eventos, Extensão & Indústria</h4>
            <p class="small muted">Organização da Semana Acadêmica de Automação, minicursos práticos (TIA Portal, Python, CAD), visitas técnicas industriais e recepção de calouros.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// -------------------------------------------------------------
// VISTA: TRANSPARÊNCIA & CONTAS (#transparencia)
// -------------------------------------------------------------
export function renderTransparenciaHtml() {
  const totalAlunos = CONFIG.STUDENTS_DATABASE ? CONFIG.STUDENTS_DATABASE.length : 203;
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow"><span class="led-dot green"></span> GOVERNANÇA ABERTA & PRESTAÇÃO DE CONTAS</span>
          <h2>Transparência & Contas do E(CA)²</h2>
          <p>
            Em conformidade com o Estatuto Social do E(CA)², todas as decisões, atas de assembleia, balancetes financeiros e destinações de recursos da Lojinha são públicos e auditáveis por qualquer discente do curso.
          </p>
        </div>

        <!-- Painel de Indicadores de Transparência -->
        <div class="grid grid-4" style="gap: 1rem; margin-bottom: 2.5rem;">
          <div class="card" style="border-left: 3px solid var(--green);">
            <span class="eyebrow" style="color: var(--green);">MENSALIDADE</span>
            <div style="font-size: 1.65rem; font-weight: 700; font-family: var(--font-mono); color: var(--green);">R$ 0,00</div>
            <p class="small muted" style="margin: .3rem 0 0;">Associação 100% gratuita para todos os alunos do curso.</p>
          </div>
          <div class="card" style="border-left: 3px solid var(--cyan);">
            <span class="eyebrow" style="color: var(--cyan);">FONTE DE RECURSOS</span>
            <div style="font-size: 1.45rem; font-weight: 700; font-family: var(--font-mono); color: var(--cyan);">Lojinha & Eventos</div>
            <p class="small muted" style="margin: .3rem 0 0;">100% da margem revertida para atividades estudantis e insumos.</p>
          </div>
          <div class="card" style="border-left: 3px solid var(--amber);">
            <span class="eyebrow" style="color: var(--amber);">CENSO HOMOLOGADO</span>
            <div style="font-size: 1.65rem; font-weight: 700; font-family: var(--font-mono); color: var(--amber);">${totalAlunos} Alunos</div>
            <p class="small muted" style="margin: .3rem 0 0;">Base eleitoral auditável de Engenharia de Controle e Automação.</p>
          </div>
          <div class="card" style="border-left: 3px solid var(--cyan);">
            <span class="eyebrow">CHAVE PIX OFICIAL</span>
            <div style="font-size: .95rem; font-weight: 700; font-family: var(--font-mono); color: var(--text); word-break: break-all;">ca.eca2.uergs@gmail.com</div>
            <p class="small muted" style="margin: .3rem 0 0;">Conta exclusiva para encomendas da lojinha e apoio voluntário.</p>
          </div>
        </div>

        <!-- Destinação dos Recursos e Prestação de Contas -->
        <div class="grid grid-2" style="gap: 1.5rem; margin-bottom: 2.5rem;">
          <div class="card" style="padding: 1.75rem;">
            <span class="badge cyan" style="margin-bottom: .6rem;">REGRAS FINANCEIRAS</span>
            <h3 style="margin-top: 0;">Como os recursos do CA são aplicados?</h3>
            <ul class="small muted" style="padding-left: 1.2rem; line-height: 1.8; margin-bottom: 0;">
              <li><strong>Eventos de Integração & Recepção:</strong> Custeio de insumos para recepção semestral de calouros e encontros gerais (como o 1º Encontro & Salchipão).</li>
              <li><strong>Apoio a Laboratórios & Bancadas:</strong> Aquisição de componentes eletrônicos de reposição rápida, cabos, conectores e materiais para oficinas práticas.</li>
              <li><strong>Visitas Técnicas & Semana Acadêmica:</strong> Apoio logístico, emissão de certificados e materiais de divulgação.</li>
              <li><strong>Infraestrutura Digital a Custo Zero:</strong> Este portal opera com arquitetura <em>serverless</em> gratuita (Vercel + Supabase Free Tier), mantendo custo fixo de hospedagem em <strong>R$ 0,00/mês</strong>.</li>
            </ul>
          </div>

          <div class="card" style="padding: 1.75rem;">
            <span class="badge green" style="margin-bottom: .6rem;">REGISTROS & ATAS</span>
            <h3 style="margin-top: 0;">Histórico de Deliberações & Documentos</h3>
            <div class="stack" style="gap: .85rem;">
              <div style="padding: .85rem; background: hsl(222 35% 8% / .6); border-radius: 6px; border: 1px solid var(--border);">
                <div class="row" style="justify-content: space-between; margin-bottom: .25rem;">
                  <strong class="small" style="color: var(--cyan);">Assembleia Geral de Fundação E(CA)²</strong>
                  <span class="badge green" style="font-size: .68rem;">HOMOLOGADA · 26/10/2026</span>
                </div>
                <p class="small muted" style="margin: 0 0 .5rem;">Aprovação do Estatuto Social e eleição da Gestão 2026/2027 no Campus Central POA.</p>
                <a href="#fundacao" class="small text-cyan" style="font-family: var(--font-mono); text-decoration: underline;">Ver Registro da Assembleia →</a>
              </div>

              <div style="padding: .85rem; background: hsl(222 35% 8% / .6); border-radius: 6px; border: 1px solid var(--border);">
                <div class="row" style="justify-content: space-between; margin-bottom: .25rem;">
                  <strong class="small" style="color: var(--amber);">Estatuto Social & Regimento Discente</strong>
                  <span class="badge amber" style="font-size: .68rem;">PDF PÚBLICO</span>
                </div>
                <p class="small muted" style="margin: 0 0 .5rem;">Normas financeiras, direitos dos estudantes e rito de prestação de contas semestral.</p>
                <div class="row" style="gap: .5rem; flex-wrap: wrap;">
                  <button type="button" class="btn btn-ghost btn-sm btn-preview-pdf" data-pdf-url="pdf/Estatuto_ECA2_2026.pdf" data-pdf-title="Estatuto Social do E(CA)² (2026)" style="font-size: .75rem; padding: .25rem .6rem;">
                    Visualizar Estatuto E(CA)²
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-preview-pdf" data-pdf-url="pdf/Estatuto_Representacao_Discente.pdf" data-pdf-title="Estatuto da Representação Discente" style="font-size: .75rem; padding: .25rem .6rem;">
                    Visualizar Regimento Discente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// -------------------------------------------------------------
// VISTA: FALE COM O CA / OUVIDORIA DISCENTE (#ouvidoria)
// -------------------------------------------------------------
export function renderOuvidoriaHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow"><span class="led-dot cyan"></span> CANAL DIRETO DE ATENDIMENTO & ESCUTA</span>
          <h2>Fale com o CA / Ouvidoria Discente</h2>
          <p>
            Precisa relatar um problema com disciplinas, infraestrutura de laboratório, horários de oferta ou enviar uma dúvida direta para a gestão do E(CA)²? Utilize nossos canais oficiais abaixo.
          </p>
        </div>

        <div class="grid grid-2" style="gap: 1.75rem; align-items: start;">
          <!-- Coluna 1: Canais Diretos -->
          <div class="stack" style="gap: 1rem;">
            <div class="card" style="padding: 1.5rem; border: 1px solid var(--border-strong);">
              <span class="badge cyan" style="margin-bottom: .5rem;">E-MAIL OFICIAL</span>
              <h3 style="margin: 0 0 .35rem; font-size: 1.2rem;">ca.eca2.uergs@gmail.com</h3>
              <p class="small muted" style="margin: 0 0 1rem;">
                Canal institucional para ofícios, solicitações formais à coordenação, parcerias industriais e atendimento ao estudante.
              </p>
              <div class="row" style="gap: .6rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-copy-ca-email">
                  📋 Copiar E-mail
                </button>
                <a href="mailto:ca.eca2.uergs@gmail.com?subject=Contato%20Ouvidoria%20E(CA)2%20-%20UERGS" class="btn btn-ghost btn-sm">
                  ✉️ Abrir no App de E-mail
                </a>
              </div>
            </div>

            <div class="card" style="padding: 1.5rem;">
              <span class="badge amber" style="margin-bottom: .5rem;">REDES & COMUNIDADE</span>
              <h3 style="margin: 0 0 .35rem; font-size: 1.2rem;">Instagram & Atendimento Presencial</h3>
              <p class="small muted" style="margin: 0 0 1rem;">
                Acompanhe os avisos rápidos pelo Instagram oficial <strong>@eca2uergs</strong> ou converse presencialmente com os representantes no Campus Central (Rua Washington Luiz, 675 – Centro Histórico, Porto Alegre).
              </p>
              <div class="row" style="gap: .6rem; flex-wrap: wrap;">
                <a href="https://instagram.com/eca2uergs" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
                  📸 Instagram @eca2uergs ↗
                </a>
                <a href="#mural" class="btn btn-ghost btn-sm">
                  📌 Ver Mural de Demandas
                </a>
                <a href="#forum" class="btn btn-ghost btn-sm">
                  💬 Ir para o Fórum
                </a>
              </div>
            </div>
          </div>

          <!-- Coluna 2: Formulário Rápido de Ouvidoria -->
          <div class="card" style="padding: 1.75rem; border: 1px solid var(--border-strong);">
            <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: .75rem;">
              <span class="badge green"><span class="led-dot green"></span> ENVIO RÁPIDO</span>
              <span class="small muted" style="font-family: var(--font-mono);">PROTOCOLO DIRETO</span>
            </div>
            <h3 style="margin: 0 0 .4rem;">Enviar Mensagem / Demanda à Ouvidoria</h3>
            <p class="small muted" style="margin: 0 0 1.25rem;">
              Preencha abaixo para registrar uma demanda diretamente no sistema do CA ou encaminhar para a diretoria:
            </p>

            <form id="form-ouvidoria" class="form">
              <div class="field">
                <label for="ouv-assunto">Assunto / Título da Demanda *</label>
                <input type="text" id="ouv-assunto" required placeholder="Ex: Solicitação de bancada aberta no Lab de CLP às sextas">
              </div>

              <div class="field">
                <label for="ouv-categoria">Área Relacionada</label>
                <select id="ouv-categoria">
                  ${CATEGORIAS_SUGESTAO.map(c => `<option value="${c}">${c}</option>`).join("")}
                </select>
              </div>

              <div class="field">
                <label for="ouv-mensagem">Descrição Detalhada *</label>
                <textarea id="ouv-mensagem" rows="4" required placeholder="Descreva a situação, disciplina ou sugestão para que o CA possa atuar..."></textarea>
              </div>

              <div class="row" style="gap: .65rem; flex-wrap: wrap; margin-top: .5rem;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  Registrar no Mural do CA
                </button>
                <button type="button" class="btn btn-ghost" id="btn-ouv-whatsapp">
                  Enviar via WhatsApp ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupOuvidoriaInteractions(store, navigate, showToast) {
  document.getElementById("btn-copy-ca-email")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("ca.eca2.uergs@gmail.com");
      showToast("E-mail ca.eca2.uergs@gmail.com copiado para a área de transferência!");
    } catch {
      showToast("E-mail oficial: ca.eca2.uergs@gmail.com");
    }
  });

  document.getElementById("btn-ouv-whatsapp")?.addEventListener("click", () => {
    const assunto = document.getElementById("ouv-assunto")?.value.trim() || "Atendimento Ouvidoria E(CA)²";
    const cat = document.getElementById("ouv-categoria")?.value || "Geral";
    const msg = document.getElementById("ouv-mensagem")?.value.trim() || "";
    const text = `*OUVIDORIA DISCENTE · E(CA)² UERGS*\n*Categoria:* ${cat}\n*Assunto:* ${assunto}\n\n${msg}`;
    window.open(`https://api.whatsapp.com/send?phone=5551989508930&text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  document.getElementById("form-ouvidoria")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("ouv-assunto")?.value.trim();
    const category = document.getElementById("ouv-categoria")?.value || "Outros";
    const body = document.getElementById("ouv-mensagem")?.value.trim();
    if (!title || !body) return;

    const auth = getAuth();
    if (!auth.user) {
      showToast("Faça login rápido com seu e-mail para registrar a demanda no sistema.");
      document.getElementById("dlg-auth")?.showModal();
      return;
    }

    try {
      await store.suggestions.create({ title, body, category });
      showToast("Sua demanda foi registrada com sucesso no Mural do CA!");
      navigate("mural");
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

// (Módulos da assembleia de fundação e salchipão foram concluídos e arquivados em _arquivo_historico_fundacao_26)


// -------------------------------------------------------------
// VISTA: FAQ (Dúvidas Frequentes)
// -------------------------------------------------------------
export function renderFaqHtml() {
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

export async function setupFaqView(store) {
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

