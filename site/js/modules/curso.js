/**
 * =====================================================================
 * Eca² – Módulo Sobre o Curso, PPCs (2019 vs 2024), Labs e Estágios (curso.js)
 * Carregado sob demanda (Code-Splitting ES6)
 * =====================================================================
 */
import { CURSO, ARVORES_PPC, BENEFICIOS_UERGS, ESTAGIOS_MERCADO, CORPO_DOCENTE_NDE, REGRAS_AC_EXTENSAO, TABELA_EQUIVALENCIAS, EMENTARIO_PPC2024 } from "../content.js";
import { bindPdfPreviewButtons } from "./institucional.js";

const cachedTreeMaps = {};

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

// -------------------------------------------------------------
// VISTA: SOBRE O CURSO (PPC 2024 VIGENTE & PPC 2019 HISTÓRICO)
// -------------------------------------------------------------
export function renderCursoTabContentHtml(tab = "perfil") {
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
                    <tr class="discipline-row" data-search="${(d.codigo + ' ' + d.nome + ' ' + d.pre + ' ' + d.tipo + ' ' + d.ead).toLowerCase()}">
                      <td><span class="discipline-code">${d.codigo}</span></td>
                      <td><strong>${d.nome}</strong></td>
                      <td><span style="font-family: var(--font-mono); font-size: .85rem;">${d.ch}</span></td>
                      <td><span style="font-family: var(--font-mono); font-size: .85rem;">${d.cr} cr</span></td>
                      <td><span class="badge">${d.tipo}</span></td>
                      <td><span class="small ${d.pre === 'Nenhum' || d.pre === 'Sem pré-requisito' ? 'faint' : 'text-cyan'}">${d.pre}</span></td>
                      <td><span class="small faint">${d.ead}</span></td>
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

      <!-- Tabela Oficial de Mobilidade Interna entre Engenharias da UERGS (Quadro 6 do PPC 2024) -->
      <div class="section-head">
        <span class="eyebrow">Quadro 6 & Anexo H do PPC 2024 (p. 58–63, 285–291)</span>
        <h2>Mobilidade Interna & Equivalências entre Cursos da UERGS</h2>
        <p>Aproveitamento direto de disciplinas compartilhadas com outras Engenharias do Campus Porto Alegre, Guaíba e Novo Hamburgo.</p>
      </div>

      <div class="grid grid-2" style="gap: 1.25rem; margin-bottom: 3.5rem;">
        ${TABELA_EQUIVALENCIAS.mobilidadeInternaQuadro6.map(mob => `
          <div class="card" style="background: hsl(222 35% 10% / .8); border: 1px solid var(--border);">
            <div class="row" style="justify-content: space-between; align-items: flex-start; gap: .5rem; margin-bottom: .5rem;">
              <strong style="color: var(--cyan); font-size: 1.05rem;">${escapeHtml(mob.cursoDestino)}</strong>
              <span class="badge green" style="font-size: .72rem;">${escapeHtml(mob.percentualComum)}</span>
            </div>
            <p class="small muted" style="margin: 0; line-height: 1.6;">
              <strong>Componentes Comuns Aproveitáveis:</strong> ${escapeHtml(mob.componentesComuns)}
            </p>
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
            <h3 style="margin: 0 0 .35rem; font-size: 1.25rem;">Políticas Oficiais de Apoio ao Discente — PPC 2024 UERGS</h3>
            <p class="small muted" style="margin: 0; max-width: 820px; line-height: 1.6;">
              Estudantes de Engenharia de Controle e Automação contam com bolsas institucionais de ensino (PROENS), pesquisa (PROPPG) e extensão (PROEX), além dos programas de permanência PRODISCÊNCIA (Resolução CONSUN nº 008/2012) e PNAEST/MEC, Atendimento Educacional Especializado (AEE) e representação no Fórum Permanente de Assistência Estudantil (FoPeDi).
            </p>
          </div>
          <span class="badge" style="background: hsl(152 68% 52% / .15); color: var(--green); border: 1px solid hsl(152 68% 52% / .3);">Capítulo 6 · PPC 2024</span>
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
              <strong>Como se inscrever / Editais & Pontuação AC:</strong>
              <p style="margin: .35rem 0 0; font-size: .85rem; line-height: 1.5; color: var(--text);">${cat.comoInscrever}</p>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Caixa de Apoio do Centro Acadêmico -->
      <div class="card" style="border: 1px solid var(--border-strong); background: var(--surface); margin-bottom: 3.5rem;">
        <div class="row" style="align-items: flex-start; gap: 1rem;">
          <span class="badge amber">REPRESENTAÇÃO DISCENTE</span>
          <div style="flex: 1; min-width: 0;">
            <h3 style="margin: 0 0 .35rem; color: var(--amber);">Como o Centro Acadêmico E(CA)² atua nos Benefícios e no FoPeDi?</h3>
            <p class="small muted" style="margin: 0 0 1rem; line-height: 1.6;">
              O Centro Acadêmico participa ativamente das instâncias deliberativas da UERGS e do Fórum Permanente de Assistência Estudantil (FoPeDi). Defendemos a ampliação de cotas de monitoria (Resolução CONSUN nº 003/2018) em disciplinas de alta exigência, acompanhamos os editais do PRODISCÊNCIA e PNAEST junto à PROENS e orientamos os estudantes na submissão de cadastros socioeconômicos e aproveitamento de Atividades Complementares.
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

      <!-- Catálogo do Corpo Docente, NDE (Portaria 053/2021) & Grupo de Pesquisa PAI/CNPq -->
      <div class="section-head">
        <span class="eyebrow">Portaria Interna nº 053/2021 · Diretório CNPq / PROPPG</span>
        <h2>Corpo Docente, NDE & Grupo de Pesquisa em Automação Industrial (PAI)</h2>
        <p>${CORPO_DOCENTE_NDE.resumo}</p>
      </div>

      <div class="grid grid-2" style="gap: 1.25rem; margin-bottom: 2.5rem;">
        ${CORPO_DOCENTE_NDE.nde.map(doc => `
          <div class="card" style="background: hsl(222 35% 10% / .85); border: 1px solid var(--border-strong);">
            <div class="row" style="justify-content: space-between; align-items: flex-start; gap: .5rem; margin-bottom: .4rem;">
              <span class="badge cyan" style="font-size: .72rem;">${escapeHtml(doc.papel)}</span>
              <span class="badge green" style="font-size: .7rem;">${escapeHtml(doc.grupoPesquisa)}</span>
            </div>
            <h3 style="margin: .2rem 0 .25rem; font-size: 1.18rem;">${escapeHtml(doc.nome)}</h3>
            <div class="small muted" style="margin-bottom: .75rem;">${escapeHtml(doc.formacao)}</div>
            <div class="small" style="font-weight: 700; color: var(--amber); margin-bottom: .3rem;">Linhas de Orientação (TCC & Iniciação Científica):</div>
            <ul class="small muted" style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
              ${doc.areasOrientacao.map(ar => `<li>${escapeHtml(ar)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>

      <!-- Projetos Reais do Grupo de Pesquisa PAI / CNPq (Tabela 7 do PPC 2024) -->
      <div class="card" style="margin-bottom: 3.5rem; background: hsl(222 35% 8% / .9); border: 1px solid hsl(189 94% 55% / .35);">
        <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem;">
          <div>
            <span class="badge amber" style="margin-bottom: .3rem;">TABELA 7 DO PPC 2024 · UNIDADE PORTO ALEGRE</span>
            <h3 style="margin: 0; font-size: 1.25rem;">${escapeHtml(CORPO_DOCENTE_NDE.grupoPAI.nome)}</h3>
            <p class="small muted" style="margin: .25rem 0 0;">${escapeHtml(CORPO_DOCENTE_NDE.grupoPAI.objetivo)}</p>
          </div>
          <span class="badge cyan" style="font-family: var(--font-mono);">Líderes: ${escapeHtml(CORPO_DOCENTE_NDE.grupoPAI.lideres)}</span>
        </div>

        <div class="grid grid-2" style="gap: 1rem;">
          ${CORPO_DOCENTE_NDE.grupoPAI.projetosReais.map(proj => `
            <div style="padding: 1rem; border-radius: 6px; background: hsl(222 40% 6%); border: 1px solid var(--border);">
              <span class="badge slate" style="font-family: var(--font-mono); font-size: .7rem; margin-bottom: .35rem;">${escapeHtml(proj.codigo)}</span>
              <h4 style="margin: 0 0 .3rem; font-size: 1rem; color: var(--cyan);">${escapeHtml(proj.titulo)}</h4>
              <p class="small muted" style="margin: 0; line-height: 1.5;">${escapeHtml(proj.foco)}</p>
            </div>
          `).join("")}
        </div>
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

  return tabContentHtml;
}

export function renderCursoHtml(tab = "perfil") {
  const activeTab = ["arvore", "beneficios", "labs", "perfil", "estagios"].includes(tab) ? tab : "perfil";

  return `
    <section class="section">
      <div class="container">
        <!-- Cabeçalho Principal -->
        <div class="section-head" style="margin-bottom: 1.5rem;">
          <div class="row" style="gap: .6rem; margin-bottom: .75rem; flex-wrap: wrap; justify-content: center;">
            <span class="course-hero-badge">${CURSO.resolucaoVigente}</span>
            <span class="badge" style="background: hsl(222 25% 15%); color: var(--muted); border: 1px solid var(--border); font-size: .8rem; white-space: normal; text-align: center; max-width: 100%;">Anterior: ${CURSO.resolucaoAnterior}</span>
          </div>
          <h2>Engenharia de Controle e Automação</h2>
          <p class="lead" style="max-width: 900px; margin-inline: auto;">
            ${CURSO.objetivo}
          </p>
        </div>

        <div id="curso-tab-content">
          ${renderCursoTabContentHtml(activeTab)}
        </div>
      </div>
    </section>
  `;
}

// -------------------------------------------------------------
// CONTROLADOR: SOBRE O CURSO & ÁRVORE DE DEPENDÊNCIAS
// -------------------------------------------------------------
export async function setupCursoEstagiosVagas(store) {
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

export function setupCursoInteractions(tab = "perfil", store, showToast) {
  const activeTab = ["arvore", "beneficios", "labs", "perfil", "estagios"].includes(tab) ? tab : "perfil";

  // 1. Vincula pré-visualização de PDFs oficiais
  bindPdfPreviewButtons();

  // 1b. Carrega vagas de estágio apenas se a aba ativa for "estagios"
  if (activeTab === "estagios") {
    setupCursoEstagiosVagas(store);
  }

  // Se não estiver na aba "arvore", evita processar matriz e grafo
  if (activeTab !== "arvore") return;

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
    if (cachedTreeMaps[currentTreePpc]) return cachedTreeMaps[currentTreePpc];
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

    cachedTreeMaps[currentTreePpc] = { discMap, unlocksMap };
    return cachedTreeMaps[currentTreePpc];
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
            <span class="badge green" style="font-size: .7rem;">${directPrereqs.length + (disc.minCr ? 1 : 0)}</span>
          </div>
          ${directPrereqs.length === 0 && !disc.minCr ? `
            <span class="small muted" style="font-family: var(--font-mono);">Sem bloqueios de entrada (pode cursar imediatamente).</span>
          ` : `
            <div style="display: flex; flex-wrap: wrap; gap: .4rem;">
              ${disc.minCr ? `<span class="badge amber" style="font-size: .78rem; padding: .25rem .55rem; font-family: var(--font-mono);">Mínimo de ${disc.minCr} créditos concluídos</span>` : ''}
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

      ${(() => {
        const ementaInfo = EMENTARIO_PPC2024[disc.codigo];
        if (!ementaInfo) return "";
        return `
          <div style="margin-top: 1rem; padding: 1rem; border-radius: 6px; background: hsl(222 40% 6% / .9); border: 1px solid hsl(189 94% 55% / .3);">
            <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .5rem; margin-bottom: .5rem;">
              <span class="badge cyan" style="font-family: var(--font-mono); font-size: .72rem;">📘 EMENTÁRIO OFICIAL & BIBLIOGRAFIA · PPC 2024</span>
              <span class="badge amber" style="font-family: var(--font-mono); font-size: .72rem;">🔬 Prática/Lab: ${escapeHtml(ementaInfo.chPraticaLab)}</span>
            </div>
            <p class="small" style="margin: 0 0 .5rem; line-height: 1.55; color: var(--text);">
              <strong>Ementa:</strong> ${escapeHtml(ementaInfo.ementa)}
            </p>
            <p class="small muted" style="margin: 0 0 .65rem; line-height: 1.5;">
              <strong>Objetivo:</strong> ${escapeHtml(ementaInfo.objetivo)}
            </p>
            <div class="small" style="font-weight: 700; color: var(--cyan); margin-bottom: .25rem; font-size: .78rem;">Bibliografia Básica Recomendada (Biblioteca UERGS):</div>
            <ul class="small muted" style="margin: 0; padding-left: 1.15rem; font-size: .78rem; line-height: 1.5;">
              ${ementaInfo.bibliografia.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        `;
      })()}
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
              const preCount = d.pre.length + (d.minCr ? 1 : 0);
              const unlocksCount = (unlocksMap.get(d.codigo) || []).length;
              return `
                <div class="dep-card area-${d.area}" data-code="${d.codigo}" data-area="${d.area}">
                  <div class="row" style="justify-content: space-between; align-items: baseline;">
                    <span class="card-code">${d.codigo}</span>
                    <span class="faint" style="font-size: .7rem; font-family: var(--font-mono);">${d.ch}</span>
                  </div>
                  <div class="card-name">${escapeHtml(d.nome)}</div>
                  <div class="card-tags">
                    <span class="pill-req ${preCount > 0 ? 'has-pre' : ''}">${preCount === 0 ? 'Sem pré-req' : (d.minCr && d.pre.length === 0 ? `${d.minCr} cr` : `${preCount} pré-req`)}</span>
                    ${unlocksCount > 0 ? `<span class="pill-unlocks">Destrava ${unlocksCount}</span>` : ''}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `).join("");

      // Delegação única de cliques nos cards da árvore
      if (!gridContainer.dataset.boundTreeClick) {
        gridContainer.dataset.boundTreeClick = "true";
        gridContainer.addEventListener("click", (e) => {
          const card = e.target.closest(".dep-card");
          if (!card) return;
          const code = card.getAttribute("data-code");
          if (selectedTreeCode === code) {
            resetSelection();
          } else {
            selectDiscipline(code);
          }
        });
      }
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

