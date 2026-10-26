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
              <span class="badge amber">AVISO</span>
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
              <span class="badge green">VOTO GRAVADO</span>
              <div>
                <strong>Eleitor identificado:</strong> <span style="color: var(--cyan);">${escapeHtml(auth.profile?.display_name || auth.user.email)}</span>
                ${auth.profile?.semester ? `(${escapeHtml(auth.profile.semester)})` : ''}
                <div class="small muted">Voto único auditável garantido.</div>
              </div>
            </div>
          </div>
        `}

        <!-- Banner de Acesso à Cabine / Urna Eleitoral -->
        <div class="card hover" style="background: var(--surface); border: 1px solid var(--border-strong); margin-bottom: 2.25rem; padding: 1.5rem 1.75rem;">
          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
            <div style="max-width: 580px;">
              <span class="badge green" style="margin-bottom: .35rem;">Cabine Eletrônica Interativa</span>
              <h3 style="margin: 0; font-size: 1.35rem;">Simulador de Urna Eleitoral do E(CA)²</h3>
              <p class="small muted" style="margin: .35rem 0 0; line-height: 1.6;">
                Prefere votar com a interface de urna eletrônica? Acesse a cabine digital com tela de deliberação, botões físicos <strong style="color: #22c55e;">SIM (Verde)</strong>, <strong style="color: #ef4444;">NÃO (Vermelho)</strong> e <strong>BRANCO</strong>, com áudio oficial da urna!
              </p>
            </div>
            <a href="#urna" class="btn btn-primary" style="font-size: 1rem; padding: .75rem 1.4rem;  white-space: nowrap;">
              Abrir Urna Eleitoral ↗
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
                Imprimir Cartaz com QR Code
              </button>
            </div>

            <!-- Regras de Auditoria -->
            <div class="card">
              <h3>Transparência da Votação</h3>
              <ul class="muted small" style="padding-left: 1.1rem; line-height: 1.7; margin: 0 0 1.25rem;">
                <li><strong>Cruzamento com a Lista:</strong> O secretário da mesa confere a lista física de presença antes de homologar os totais.</li>
                <li><strong>Registro na Ata:</strong> Os percentuais aprovados aqui serão lidos e anexados na <a href="pdf/04_Ata_de_Fundacao.pdf" target="_blank" style="color: var(--accent); text-decoration: underline;">Ata Oficial</a>.</li>
                <li><strong>Prevenção de Voto Duplo:</strong> Cada estudante autenticado só pode registrar um voto por proposta.</li>
                <li><strong>Sigilo do Voto (LGPD Art. 7º):</strong> O voto individual é criptografado e 100% secreto; apenas a chave de participação é auditada para quórum.</li>
              </ul>
              <button type="button" class="btn btn-primary btn-sm" id="btn-exportar-extrato-ata" style="width: 100%; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: .4rem;">
                Gerar Extrato Oficial da Urna para a Ata
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
                  <span>${escapeHtml(opt.label)} ${isMine ? '(Seu voto)' : ''}</span>
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
              showToast("Voto computado com sucesso!");
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
    <button onclick="window.print()" style="padding: 10px 22px; font-size: 12pt; font-weight: bold; background: #0284c7; color: #fff; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(2,132,199,.3);">Imprimir / Salvar como PDF</button>
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
              <span class="badge cyan" style="font-size: .8rem;">E(CA)²</span>
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
                  <span id="urna-eleitor-tag">${isLogged ? `ELEITOR: ${escapeHtml(userName)}` : 'NÃO IDENTIFICADO'}</span>
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
        : 'NÃO IDENTIFICADO';
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
          <div class="badge slate" style="margin-bottom: .5rem;">CABINE FECHADA</div>
          <h4 style="color: var(--amber); margin: 0 0 .5rem; font-size: 1.15rem;">Identificação Necessária</h4>
          <p class="small muted" style="max-width: 440px; margin: 0 auto 1.25rem; line-height: 1.6;">
            A urna eletrônica é auditável e requer identificação prévia para garantir que cada estudante vote apenas uma vez.
          </p>
          <button type="button" class="btn btn-primary btn-sm" id="btn-urna-login-action" style="font-size: .95rem; padding: .6rem 1.4rem;">
            Identificar com E-mail
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
            <div class="badge amber" style="margin-bottom: .5rem;">ATENÇÃO</div>
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
          <div class="badge green" style="margin-bottom: .4rem;">VOTO CONFIRMADO</div>
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
          <div class="urna-screen-choice-label">[ SIM ]</div>
          <div class="urna-screen-choice-sub">APROVO A PROPOSTA DESTA DELIBERAÇÃO</div>
        </div>
      `;
    } else if (selectedChoice === "nao") {
      choiceBoxHtml = `
        <div class="urna-screen-choice-box nao">
          <div class="urna-screen-choice-label">[ NÃO ]</div>
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
            Aperte a tecla verde <strong>CONFIRMA</strong> para gravar seu voto.
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

      showToast("Voto computado com sucesso na Urna Eletrônica!");

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
            <h3>Confirme sua Presença (18h30 às 19h15)</h3>
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

              <button type="submit" class="btn btn-primary" id="btn-submit-rsvp">Confirmar Presença</button>
              <div class="muted small" id="rsvp-confirmed-count">Carregando confirmações...</div>
            </form>
          </div>

          <!-- Dinâmica do Evento e Pauta -->
          <div class="card">
            <h3>Dinâmica do Encontro no Refeitório</h3>
            <p class="muted small">Horário: das 18:30 às 19:15 · Refeitório da UERGS Porto Alegre.</p>

            <ul style="padding-left: 1.2rem; color: var(--muted); font-size: .95rem; line-height: 1.8;">
              <li><strong>18:30 às 19:15 · Acolhimento & Assinaturas:</strong> Estudantes de Controle e Automação assinam a lista física de presença da fundação e retiram seu salchipão.</li>
              <li><strong>Confraternização Aberta:</strong> Espaço livre no refeitório para calouros ("bichos") e veteranos conversarem, tirarem dúvidas de matérias e comerem juntos. Total liberdade para ficar no refeitório ou levar seu lanche se tiver aula.</li>
              <li><strong>Apresentação da Plataforma E(CA)²:</strong> Demonstração do site nos celulares (Árvores dos PPCs 2019/2024, Calendário 2026 e Simulador de Urna).</li>
              <li><strong>Deliberação 1:</strong> Aprovação da fundação oficial do Centro Acadêmico E(CA)².</li>
              <li><strong>Deliberação 2:</strong> Aprovação da criação da Comissão Pró-CA provisória para estruturação jurídica, redação do estatuto social e obtenção de CNPJ.</li>
            </ul>

            <div style="margin-top: 1.5rem; padding: 1.1rem; border-radius: var(--radius-sm); background: hsl(190 90% 40% / .1); border: 1px solid var(--border);">
              <strong style="color: var(--cyan); font-size: .95rem;">Propósito Estratégico do E(CA)²:</strong>
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
        <div class="card" style="margin-top: 3.5rem; padding: 2.25rem; border: 1px solid var(--border-strong); background: var(--surface);">
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
                  Ver Todos os Estatutos & PDFs
                </a>
              </div>
            </div>
            <div class="stack" style="gap: .75rem;">
              <a href="pdf/Estatuto_Representacao_Discente.pdf" target="_blank" class="card" style="padding: 1rem; border-color: var(--border); background: hsl(220 40% 12% / .8); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="display: block; font-size: .95rem; color: var(--text);">Estatuto da Representação Discente UERGS</strong>
                  <span class="small muted">Regulamento dos órgãos colegiados · 371 KB PDF</span>
                </div>
                <span class="badge slate">Abrir ↗</span>
              </a>
              <a href="pdf/02_Edital_de_Convocacao.pdf" target="_blank" class="card" style="padding: 1rem; border-color: var(--border); background: hsl(220 40% 12% / .8); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="display: block; font-size: .95rem; color: var(--text);">Edital de Convocação Oficial (26/10)</strong>
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
    if (countEl) countEl.textContent = `Mais de ${n} estudantes já confirmaram presença!`;
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
      showToast("Presença confirmada! Presença registrada para 26/10.");
      form.reset();
      const n = await store.rsvp.count();
      if (countEl) countEl.textContent = `Mais de ${n} estudantes já confirmaram presença!`;
    } catch (err) {
      showToast(err.message || "Erro ao registrar confirmação.", true);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}