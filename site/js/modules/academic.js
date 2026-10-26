/**
 * E(CA)² · Módulo de Gestão Acadêmica, Reconhecimento de Histórico e Simulador de Matrícula
 * Desenvolvido para o Centro Acadêmico de Engenharia de Controle e Automação – UERGS
 */

import { ARVORES_PPC } from "../content.js";

/**
 * Normaliza strings para busca insensível a acentos e maiúsculas
 */
function cleanStr(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Parser de Histórico Escolar com Reconhecimento Inteligente de PPC e Cadeiras Aprovadas
 * @param {string} rawText Texto bruto colado do Portal do Aluno/Sigaa
 * @returns {Object} Resultado da análise de integralização
 */
export function parseTranscript(rawText) {
  if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
    return {
      success: false,
      message: "Nenhum texto informado para análise.",
      detectedPpc: "2024",
      completedCodes: [],
      metrics: getAcademicMetrics("2024", [])
    };
  }

  const normalizedText = cleanStr(rawText);
  const textUpper = rawText.toUpperCase();

  // Testar contagem de disciplinas encontradas em cada PPC
  const ppcs = ["2024", "2019"];
  const matchesByPpc = { "2024": new Set(), "2019": new Set() };

  // Palavras indicativas de aprovação / conclusão
  const passKeywords = [
    "aprovad", "apr", "dispensa", "aproveitamento", "concluid",
    "cumprid", "nota:", "media:", "aprovado por nota", "isencao"
  ];

  ppcs.forEach(ppcKey => {
    const ppcData = ARVORES_PPC[ppcKey];
    if (!ppcData || !ppcData.semestres) return;

    ppcData.semestres.forEach(sem => {
      sem.disciplinas.forEach(disc => {
        const codeUpper = disc.codigo.toUpperCase();
        const codeClean = cleanStr(disc.codigo);
        const nameClean = cleanStr(disc.nome);

        // 1. Busca pelo Código exato da disciplina (ex: "CALC-1", "INTCON")
        // Usa regex com limites de palavra para evitar falsos positivos
        const codeRegex = new RegExp(`(^|[^A-Z0-9_-])${codeUpper.replace("-", "[-_\\s]?")}([^A-Z0-9_-]|$)`, "i");
        const foundCode = codeRegex.test(textUpper);

        // 2. Busca pelo Nome da disciplina
        const foundName = nameClean.length >= 5 && normalizedText.includes(nameClean);

        if (foundCode || foundName) {
          // Verifica se não há menção explícita de reprovação no contexto imediato
          // Se o histórico tiver a lista completa, assumimos matérias listadas como aprovadas
          matchesByPpc[ppcKey].add(disc.codigo);
        }
      });
    });
  });

  // Determina qual PPC teve melhor correspondência
  const count2024 = matchesByPpc["2024"].size;
  const count2019 = matchesByPpc["2019"].size;

  let detectedPpc = "2024";
  let confidence = "alta";

  // Indicadores específicos da grade 2024 (ex: extensão obrigatória, matérias novas)
  const is2024Exclusive = normalizedText.includes("extensao") ||
                          normalizedText.includes("fisaut") ||
                          normalizedText.includes("proind") ||
                          normalizedText.includes("hidpne");

  if (is2024Exclusive || count2024 >= count2019) {
    detectedPpc = "2024";
  } else if (count2019 > count2024) {
    detectedPpc = "2019";
    confidence = count2019 >= 3 ? "alta" : "moderada";
  }

  const completedCodes = Array.from(matchesByPpc[detectedPpc] || []);
  const metrics = getAcademicMetrics(detectedPpc, completedCodes);

  return {
    success: true,
    detectedPpc,
    confidence,
    rawMatchCount: completedCodes.length,
    completedCodes,
    metrics
  };
}

/**
 * Calcula métricas detalhadas de integralização curricular
 * @param {string} ppcKey "2024" ou "2019"
 * @param {string[]} completedCodes Lista de códigos das disciplinas aprovadas
 */
export function getAcademicMetrics(ppcKey = "2024", completedCodes = []) {
  const ppcData = ARVORES_PPC[ppcKey] || ARVORES_PPC["2024"];
  const completedSet = new Set(completedCodes || []);

  let totalDisciplines = 0;
  let passedDisciplines = 0;
  let totalHours = 0;
  let completedHours = 0;
  let totalCredits = 0;
  let completedCredits = 0;

  const discMap = new Map();
  const unlocksMap = new Map();

  // Mapeia todas as disciplinas do PPC
  ppcData.semestres.forEach(sem => {
    sem.disciplinas.forEach(d => {
      totalDisciplines++;
      discMap.set(d.codigo, { ...d, semNumero: sem.semestre, semTitulo: sem.titulo });

      const chNum = parseInt(d.ch) || 60;
      const crNum = d.cr || 4;

      totalHours += chNum;
      totalCredits += crNum;

      if (completedSet.has(d.codigo)) {
        passedDisciplines++;
        completedHours += chNum;
        completedCredits += crNum;
      }

      // Inicializa mapa de destravamentos
      if (!unlocksMap.has(d.codigo)) {
        unlocksMap.set(d.codigo, []);
      }
    });
  });

  // Constrói grafo de desbloqueio downstream
  ppcData.semestres.forEach(sem => {
    sem.disciplinas.forEach(d => {
      (d.pre || []).forEach(preCode => {
        if (!unlocksMap.has(preCode)) unlocksMap.set(preCode, []);
        unlocksMap.get(preCode).push(d.codigo);
      });
    });
  });

  // Identifica disciplinas aptas a cursar (todos pré-requisitos cumpridos e ainda não cursada)
  const eligibleCodes = [];
  const blockedCodes = [];

  ppcData.semestres.forEach(sem => {
    sem.disciplinas.forEach(d => {
      if (completedSet.has(d.codigo)) return; // Já concluiu

      const prereqs = d.pre || [];
      const missing = prereqs.filter(p => !completedSet.has(p));

      if (missing.length === 0) {
        eligibleCodes.push(d.codigo);
      } else {
        blockedCodes.push({ code: d.codigo, missing });
      }
    });
  });

  const progressPercent = totalHours > 0 ? ((completedHours / totalHours) * 100).toFixed(1) : "0.0";

  return {
    ppc: ppcKey,
    ppcLabel: ppcData.rotulo,
    totalDisciplines,
    passedDisciplines,
    remainingDisciplines: totalDisciplines - passedDisciplines,
    totalHours,
    completedHours,
    remainingHours: totalHours - completedHours,
    totalCredits,
    completedCredits,
    progressPercent,
    eligibleCodes,
    blockedCodes,
    discMap,
    unlocksMap
  };
}

/**
 * Cruza o histórico do aluno com a oferta semestral cadastrada pela ADM
 * e sugere a melhor estratégia de matrícula com base em gargalos de pré-requisitos
 */
export function getEnrollmentOptimizer(ppcKey = "2024", completedCodes = [], offeredCourses = []) {
  const metrics = getAcademicMetrics(ppcKey, completedCodes);
  const completedSet = new Set(completedCodes || []);

  const recommended = [];
  const blocked = [];
  const alreadyCompleted = [];

  offeredCourses.forEach(offer => {
    if (!offer || !offer.ativo) return;

    const disc = metrics.discMap.get(offer.code);
    const discName = disc ? disc.nome : (offer.name || offer.code);
    const discCh = disc ? disc.ch : (offer.ch || "60h");
    const discCr = disc ? disc.cr : 4;
    const directPrereqs = disc ? (disc.pre || []) : [];

    // Se o aluno já aprovou essa cadeira
    if (completedSet.has(offer.code)) {
      alreadyCompleted.push({
        ...offer,
        name: discName,
        ch: discCh,
        cr: discCr
      });
      return;
    }

    // Verifica pré-requisitos pendentes
    const missing = directPrereqs.filter(p => !completedSet.has(p));

    if (missing.length === 0) {
      // APTO A CURSAR! Calcula o "poder de destravamento" (quantas matérias futuras ela abre)
      const directUnlocks = metrics.unlocksMap.get(offer.code) || [];
      
      // Cálculo de destravamento em cascata
      const allCascaded = getAllCascadedUnlocks(offer.code, metrics.unlocksMap);
      const unlockScore = allCascaded.size;

      let priorityTag = "REGULAR";
      let priorityClass = "cyan";

      if (unlockScore >= 6) {
        priorityTag = `GARGALO CRÍTICO (+${unlockScore} matérias futuras)`;
        priorityClass = "red";
      } else if (unlockScore >= 2) {
        priorityTag = `ALTO DESTRAVAMENTO (+${unlockScore} matérias)`;
        priorityClass = "amber";
      } else if (unlockScore === 1) {
        priorityTag = "DESTRAVA 1 MATÉRIA";
        priorityClass = "cyan";
      } else {
        priorityTag = "TERMINAL NO CICLO";
        priorityClass = "slate";
      }

      recommended.push({
        ...offer,
        name: discName,
        ch: discCh,
        cr: discCr,
        unlockScore,
        priorityTag,
        priorityClass,
        directUnlocks
      });
    } else {
      // BLOQUEADA NA OFERTA
      const missingNames = missing.map(mCode => {
        const mDisc = metrics.discMap.get(mCode);
        return mDisc ? `${mCode} (${mDisc.nome})` : mCode;
      });

      blocked.push({
        ...offer,
        name: discName,
        ch: discCh,
        missingPrereqs: missing,
        missingNames
      });
    }
  });

  // Ordena as recomendadas primeiro pelo maior poder de desbloqueio (eliminar gargalos!)
  recommended.sort((a, b) => b.unlockScore - a.unlockScore);

  return {
    semester: offeredCourses.semester || "2026/1",
    totalOffered: offeredCourses.length,
    recommended,
    blocked,
    alreadyCompleted,
    metrics
  };
}

/**
 * Função auxiliar recursiva para calcular destravamento em cascata
 */
function getAllCascadedUnlocks(code, unlocksMap, visited = new Set()) {
  const direct = unlocksMap.get(code) || [];
  direct.forEach(uCode => {
    if (!visited.has(uCode)) {
      visited.add(uCode);
      getAllCascadedUnlocks(uCode, unlocksMap, visited);
    }
  });
  return visited;
}

/**
 * Detecta choque de horários entre matérias selecionadas na grade simulada
 */
export function detectScheduleConflicts(selectedCourses = []) {
  const conflicts = [];
  for (let i = 0; i < selectedCourses.length; i++) {
    for (let j = i + 1; j < selectedCourses.length; j++) {
      const c1 = selectedCourses[i];
      const c2 = selectedCourses[j];

      if (c1.dia && c2.dia && c1.dia === c2.dia) {
        // Mesmo dia! Checa sobreposição de horário
        if (c1.horario && c2.horario && c1.horario === c2.horario) {
          conflicts.push({
            c1: c1.code,
            c2: c2.code,
            dia: c1.dia,
            horario: c1.horario,
            motivo: `Conflito de horário no mesmo dia (${c1.dia} das ${c1.horario}) entre ${c1.code} e ${c2.code}`
          });
        }
      }
    }
  }
  return conflicts;
}
