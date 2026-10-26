/**
 * =====================================================================
 * Eca² – Módulo de Consumo de Eventos Raspados da UERGS
 * Filtro Estrito: Unidade Porto Alegre / Campus Central
 * =====================================================================
 */

let cachedPoaEvents = null;
let lastFetchTime = 0;

export async function fetchUergsPoaEvents(forceReload = false) {
  const now = Date.now();
  // Cache em memória de 5 minutos
  if (!forceReload && cachedPoaEvents && (now - lastFetchTime < 300000)) {
    return cachedPoaEvents;
  }

  try {
    const res = await fetch(`data/uergs_eventos_poa.json?v=${now}`);
    if (!res.ok) {
      throw new Error(`Status HTTP ${res.status}`);
    }
    const data = await res.json();
    cachedPoaEvents = data;
    lastFetchTime = now;
    return data;
  } catch (err) {
    console.warn("[UERGS Scraper Service] Aviso ao carregar dados locais de Porto Alegre:", err.message);
    if (cachedPoaEvents) return cachedPoaEvents;
    return {
      updated_at: new Date().toISOString(),
      campus_filter: "Porto Alegre / Campus Central (Washington Luiz)",
      total_filtered_poa: 0,
      events: []
    };
  }
}

/**
 * Converte eventos raspados da UERGS no formato canônico da UI do E(CA)²
 */
export function formatUergsEventToCard(ev) {
  // Extrai data limpa
  let dataIso = "";
  if (ev.isoDateTime) {
    dataIso = ev.isoDateTime.substring(0, 10);
  } else {
    dataIso = new Date().toISOString().substring(0, 10);
  }

  const parts = dataIso.split("-");
  const ano = parts[0] || "2026";
  const mesNum = parts[1] || "10";
  const diaNum = parts[2] || "01";

  const monthNames = ["", "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const mesStr = monthNames[parseInt(mesNum, 10)] || "MES";

  // Ícone contextual por categoria
  let icone = "🏛️";
  const cat = (ev.categoria || "").toLowerCase();
  if (cat.includes("competiç")) icone = "🏆";
  else if (cat.includes("seminár") || cat.includes("simpósio") || cat.includes("congresso")) icone = "📚";
  else if (cat.includes("semana acadêmica")) icone = "🎓";
  else if (cat.includes("fórum")) icone = "💬";
  else if (cat.includes("oficina") || cat.includes("workshop") || cat.includes("curso")) icone = "🛠️";
  else if (cat.includes("mostra") || cat.includes("feira") || cat.includes("exposiç")) icone = "🎨";
  else if (cat.includes("palestra") || cat.includes("conferência")) icone = "🎤";

  return {
    id: ev.id,
    data: dataIso,
    diaNum,
    mesStr,
    ano,
    dataExibicao: ev.dataExibicao || `${diaNum}/${mesNum}/${ano}`,
    horario: ev.inscrições ? `Inscrições: ${ev.inscrições}` : "Programação Oficial UERGS",
    titulo: ev.titulo,
    categoria: "uergs-poa",
    categoriaLabel: `UERGS · ${ev.categoria || 'Porto Alegre'}`,
    icone,
    local: ev.local || "Campus Central UERGS (Porto Alegre)",
    descricao: `Evento oficial da Universidade Estadual do Rio Grande do Sul realizado na unidade de Porto Alegre / Campus Central.`,
    destaque: cat.includes("competiç") || cat.includes("fórum") || cat.includes("semana"),
    linkAcao: ev.link,
    textoAcao: "Ver no Portal UERGS",
    imagem: ev.imagem,
    origem: "UERGS Oficial · Campus Porto Alegre"
  };
}
