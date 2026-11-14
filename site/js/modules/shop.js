/**
 * =====================================================================
 * Eca² – Módulo da Lojinha & Estúdio de Personalização (shop.js)
 * Carregado sob demanda (Code-Splitting ES6)
 * =====================================================================
 */
import { PRODUTOS_SHOP } from "../content.js";
import { getAuth } from "../store.js";

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

// -------------------------------------------------------------
// VISTA: LOJINHA (SHOP ECA²) - UTENSÍLIOS, VESTUÁRIO & MATERIAIS
// -------------------------------------------------------------
export function renderShopHtml() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Lojinha & Utensílios do E(CA)²</h2>
          <p>
            Copos térmicos em inox gravados a laser, canecas em cerâmica sublimada, vestuário técnico em moletom 3 cabos / dry-fit e régua de bancada em PCB FR-4.
            Toda a receita é 100% reinvestida nos projetos acadêmicos e atividades dos estudantes da UERGS.
          </p>
        </div>

        <!-- Categorias e Filtros da Loja -->
        <div class="toolbar" style="margin-bottom: 2rem;">
          <div class="chips" id="shop-filter-chips">
            <button type="button" class="chip" data-shop-filter="todos" aria-pressed="true">Todos os Itens (${PRODUTOS_SHOP.length})</button>
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
                  <span class="badge cyan" style="position: absolute; top: 12px; right: 12px; backdrop-filter: blur(8px);">
                    ${prod.tituloBotaoPersonalizado || 'Personalizável'}
                  </span>
                ` : `
                  <span class="badge" style="position: absolute; top: 12px; right: 12px; backdrop-filter: blur(8px); background: hsl(222 45% 8% / .85);">
                    Lote Padrão
                  </span>
                `}
                <span class="badge" style="position: absolute; bottom: 12px; right: 12px; background: hsl(224 50% 6% / .88); color: var(--cyan); border-color: var(--cyan); font-weight: 700; font-size: .88rem;">
                  ${prod.preco}
                </span>
              </div>

              <div class="product-card-content">
                <div class="row" style="margin-bottom: .4rem; justify-content: space-between;">
                  <span class="small muted">${prod.categoria}</span>
                  <span class="small" style="color: var(--amber); font-weight: 600;">${prod.tamanhos ? `Tamanhos: ${prod.tamanhos[0]} ao ${prod.tamanhos[prod.tamanhos.length - 1]}` : 'Disponível'}</span>
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
                  ${prod.permitePersonalizacao ? `Configurar & Encomendar` : 'Reservar este Item'}
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Banner de Transparência Financeira do Shop -->
        <div class="card" style="padding: 1.75rem;">
          <div class="grid grid-2" style="align-items: center; gap: 1.5rem;">
            <div class="row" style="gap: 1.25rem;">
              <span class="badge amber">TRANSPARÊNCIA</span>
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

export function setupShopInteractions(store, showToast) {
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

  const studioSpecsTitle = document.getElementById("studio-specs-title");
  const studioSpecsText = document.getElementById("studio-specs-text");
  const studioTagBadge = document.getElementById("studio-tag-badge");
  const studioModeBadge = document.getElementById("studio-mode-badge");
  const studioExtraBadge = document.getElementById("studio-extra-badge");
  const dlgShopTitle = document.getElementById("dlg-shop-title");
  const dlgShopSubtitle = document.getElementById("dlg-shop-subtitle");
  const studioStdTitle = document.getElementById("studio-std-title");
  const studioStdSubtitle = document.getElementById("studio-std-subtitle");
  const studioCustomTitle = document.getElementById("studio-custom-title");
  const orderCustomTextLabel = document.getElementById("order-custom-text-label");
  const orderFontLabel = document.getElementById("order-font-label");

  const btnSubmitWhatsapp = document.getElementById("btn-submit-order-whatsapp");
  const btnSubmitSystem = document.getElementById("btn-submit-order-system");

  // Estado dinâmico do estúdio de personalização
  let currentProd = null;
  let isCustom = false;
  let selectedFont = { id: "mono", label: "Técnica (Share Tech Mono)", family: "'Share Tech Mono', monospace" };
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
        laserText.textContent = currentProd.tipoPersonalizacao || "Personalização Ativa";
        laserIndicator.style.borderColor = "var(--cyan)";
      } else {
        laserText.textContent = currentProd.tituloBotaoPadrao ? `${currentProd.tituloBotaoPadrao} E(CA)²` : "Padrão Oficial E(CA)²";
        laserIndicator.style.borderColor = "var(--border)";
      }
    }

    if (studioModeBadge) {
      studioModeBadge.textContent = currentProd.tituloBotaoPersonalizado || "Personalização Ativa";
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
      selectedFont = prod.fontesDisponiveis?.[0] || { id: "mono", label: "Técnica (Share Tech Mono)", family: "'Share Tech Mono', monospace" };
      selectedPos = prod.posicoesPersonalizacao?.[0] || { id: "frente", label: "Frente (Abaixo do Brasão)" };
      fontChoiceInput.value = selectedFont.id;
      posChoiceInput.value = selectedPos.id;
      const maxChars = prod.maxCaracteresPersonalizacao || 24;
      customTextInput.value = "";
      customTextInput.maxLength = maxChars;
      customTextInput.placeholder = prod.placeholderPersonalizacao || "Ex: SEU NOME · TURMA 2026";
      charCounter.textContent = `0 / ${maxChars}`;

      if (studioTagBadge) studioTagBadge.textContent = `${prod.categoria} · ${prod.tag || "Oficial"}`;
      if (dlgShopTitle) dlgShopTitle.textContent = prod.nome;
      if (dlgShopSubtitle) {
        dlgShopSubtitle.textContent = prod.subtituloEstudio || "Verifique as especificações técnicas do item e configure sua encomenda oficial";
      }
      if (studioSpecsTitle) {
        studioSpecsTitle.textContent = `Ficha Técnica · ${prod.categoria}`;
      }
      if (studioSpecsText) {
        const specsListHtml = prod.especificacoes && prod.especificacoes.length
          ? `<ul style="margin: .55rem 0 0; padding-left: 1.1rem; line-height: 1.55;">${prod.especificacoes.map(esp => `<li>${escapeHtml(esp)}</li>`).join("")}</ul>`
          : "";
        studioSpecsText.innerHTML = `<p style="margin: 0;">${escapeHtml(prod.descricao || "")}</p>${specsListHtml}`;
      }

      // Atualiza rótulos específicos do método de personalização (Laser no Inox vs Sublimação na Cerâmica vs Bordado/DTF em Vestuário)
      if (studioStdTitle) studioStdTitle.textContent = prod.tituloBotaoPadrao || "Padrão Oficial";
      if (studioStdSubtitle) studioStdSubtitle.textContent = prod.subtituloBotaoPadrao || "Sem personalização extra";
      if (studioCustomTitle) studioCustomTitle.textContent = prod.tituloBotaoPersonalizado || "Personalizado";
      if (orderCustomTextLabel) orderCustomTextLabel.textContent = prod.labelCampoPersonalizacao || "Nome ou Identificação no Item *";
      if (orderFontLabel) orderFontLabel.textContent = prod.labelEstiloPersonalizacao || "Tipografia da Personalização";

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
        const prof = auth.profile;
        if (prof?.display_name && formOrder.name) formOrder.name.value = prof.display_name;
        if (prof?.semester && formOrder.semester) formOrder.semester.value = prof.semester;
        if (prof?.whatsapp && formOrder.whatsapp) formOrder.whatsapp.value = prof.whatsapp;
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
      showToast("Informe o nome ou texto para personalização do item.", true);
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
        isCustom ? `*Personalização:* SIM (${currentProd.tipoPersonalizacao || 'Personalizado'})` : `*Personalização:* Não (Padrão Oficial)`,
        isCustom ? `*Texto Personalizado:* ${customText}` : null,
        isCustom ? `*Posição:* ${selectedPos.label}` : null,
        isCustom ? `*Tipografia:* ${selectedFont.label}` : null,
        selectedSize ? `*Tamanho:* ${selectedSize}` : null,
        `----------------------------------------`,
        `*Estudante:* ${name}`,
        `*Semestre:* ${semester}`,
        `*WhatsApp:* ${whatsapp}`,
        obs ? `*Obs:* ${obs}` : null,
        `----------------------------------------`,
        `*Chave PIX:* ca.eca2.uergs@gmail.com`,
        `_Estou enviando este pedido oficial configurado no portal E(CA)²._`
      ].filter(Boolean).join("\n");

      const waUrl = `https://api.whatsapp.com/send?phone=5551989508930&text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    dlgOrder?.close();
    formOrder.reset();
    showToast(`Encomenda de ${currentProd.nome} ${isCustom ? 'personalizada ' : ''}registrada com sucesso!`);
  });
}

