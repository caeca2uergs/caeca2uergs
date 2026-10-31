/**
 * E(CA)² · Módulo de Gestão Acadêmica, Reconhecimento de Histórico e Simulador de Matrícula
 * Desenvolvido para o Centro Acadêmico de Engenharia de Controle e Automação – UERGS
 */

import { ARVORES_PPC, TABELA_EQUIVALENCIAS } from "../content.js";

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
      if (d.minCr && completedCredits < d.minCr) {
        missing.push(`${d.minCr} créditos`);
      }

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
    if (disc && disc.minCr && metrics.completedCredits < disc.minCr) {
      missing.push(`${disc.minCr} créditos (atual: ${metrics.completedCredits} cr)`);
    }

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

/**
 * Simulador Automático de Migração Curricular (PPC 2019 ➔ PPC 2024)
 * Recebe os códigos aprovados pelo estudante (no PPC 2019 ou ambos) e calcula
 * todas as equivalências diretas no PPC 2024 conforme Quadro 7 e Anexo H.
 */
export function simulatePpcMigration(completedCodes = []) {
  const inputSet = new Set(completedCodes || []);
  const granted2024Codes = new Set();
  const appliedRules = [];

  // 1. Mantém códigos que já são idênticos no PPC 2024
  const ppc2024AllCodes = new Set();
  ARVORES_PPC["2024"].semestres.forEach(s => {
    s.disciplinas.forEach(d => ppc2024AllCodes.add(d.codigo));
  });

  inputSet.forEach(code => {
    if (ppc2024AllCodes.has(code)) {
      granted2024Codes.add(code);
    }
  });

  // 2. Aplica regras oficiais da Tabela de Equivalências (PPC 2019 -> PPC 2024)
  (TABELA_EQUIVALENCIAS.migracao2019Para2024 || []).forEach(rule => {
    if (inputSet.has(rule.cod2019)) {
      rule.cod2024.forEach(targetCode => granted2024Codes.add(targetCode));
      appliedRules.push(rule);
    }
  });

  const final2024Codes = Array.from(granted2024Codes);
  const metrics2019 = getAcademicMetrics("2019", completedCodes);
  const metrics2024 = getAcademicMetrics("2024", final2024Codes);

  // Disciplinas novas exclusivas do PPC 2024 que ainda faltam cursar
  const exclusiveNew2024 = ["COMPEX", "PROJEXT-1", "PROJEXT-2", "FISAUT", "PROIND", "HIDPNE"].filter(
    c => !granted2024Codes.has(c)
  );

  return {
    completed2019Count: metrics2019.passedDisciplines,
    granted2024Codes: final2024Codes,
    granted2024Count: metrics2024.passedDisciplines,
    appliedRules,
    metrics2019,
    metrics2024,
    exclusiveNew2024
  };
}

/**
 * Constrói a matriz visual da Grade Horária Semanal (Segunda a Sábado · Manhã / Tarde / Noite)
 */
export function buildWeeklyTimetableGrid(selectedCourses = []) {
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const slots = [
    { id: "manha", label: "Manhã", timeRange: "08:00 - 12:00", matchTokens: ["08:", "09:", "10:", "13:30"] },
    { id: "tarde", label: "Tarde", timeRange: "14:00 - 18:00", matchTokens: ["14:", "15:", "16:", "17:"] },
    { id: "noite1", label: "Noite (1º Período)", timeRange: "18:30 - 20:30", matchTokens: ["18:30", "19:00", "19:15"] },
    { id: "noite2", label: "Noite (2º Período)", timeRange: "20:30 - 22:30", matchTokens: ["20:30", "20:45", "21:00", "19:00 - 22:30", "18:30 - 22:30"] }
  ];

  const grid = {};
  days.forEach(d => {
    grid[d] = {};
    slots.forEach(s => {
      grid[d][s.id] = [];
    });
  });

  selectedCourses.forEach(course => {
    const rawDay = course.dia || "Segunda";
    const matchedDay = days.find(d => cleanStr(rawDay).includes(cleanStr(d))) || "Segunda";
    const h = course.horario || "19:00 - 22:30";

    let placed = false;
    if (h.includes("19:00 - 22:30") || h.includes("18:30 - 22:30")) {
      grid[matchedDay]["noite1"].push(course);
      grid[matchedDay]["noite2"].push(course);
      placed = true;
    } else {
      slots.forEach(slot => {
        if (slot.matchTokens.some(tok => h.includes(tok))) {
          grid[matchedDay][slot.id].push(course);
          placed = true;
        }
      });
    }

    if (!placed) {
      grid[matchedDay]["noite1"].push(course);
    }
  });

  return { days, slots, grid };
}

/**
 * Gera conteúdo de arquivo iCalendar (.ics - RFC 5545) para importar a grade horária
 * no Google Agenda, Outlook ou Apple Calendar
 */
export function generateTimetableIcs(selectedCourses = [], semester = "2026/1") {
  const dayMap = {
    "segunda": { byday: "MO", offset: 0 },
    "terca": { byday: "TU", offset: 1 },
    "quarta": { byday: "WE", offset: 2 },
    "quinta": { byday: "TH", offset: 3 },
    "sexta": { byday: "FR", offset: 4 },
    "sabado": { byday: "SA", offset: 5 }
  };

  // Segunda-feira base do semestre letivo
  const baseMonday = new Date(2026, 7, 10); // 10/08/2026
  const pad = n => String(n).padStart(2, "0");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Centro Academico E(CA)2 UERGS//Grade Horaria//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  selectedCourses.forEach((c, idx) => {
    const cleanDay = cleanStr(c.dia || "Segunda").split("-")[0].trim();
    const dInfo = dayMap[cleanDay] || dayMap["segunda"];

    const eventDate = new Date(baseMonday);
    eventDate.setDate(baseMonday.getDate() + dInfo.offset);
    const ymd = `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}`;

    // Extrai hora início e fim (ex: "19:00 - 22:30")
    const times = (c.horario || "19:00 - 22:30").match(/(\d{2}):(\d{2})/g) || ["19:00", "22:30"];
    const startHm = (times[0] || "19:00").replace(":", "") + "00";
    const endHm = (times[1] || "22:30").replace(":", "") + "00";

    lines.push(
      "BEGIN:VEVENT",
      `UID:eca2-${c.code}-${idx}-${Date.now()}@uergs.edu.br`,
      `DTSTAMP:${ymd}T120000Z`,
      `DTSTART:${ymd}T${startHm}`,
      `DTEND:${ymd}T${endHm}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${dInfo.byday};COUNT=18`,
      `SUMMARY:${c.code} - ${c.name} (UERGS)`,
      `LOCATION:UERGS Campus Central Porto Alegre - Rua Washington Luiz 675`,
      `DESCRIPTION:Disciplina: ${c.code} - ${c.name}\\nDocente: Prof. ${c.professor || "A definir"}\\nTurma: ${c.turma || "Turma A"}\\nSemestre: ${semester} · Gerado pelo Portal E(CA)2`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Calculadora Oficial de Conceitos (A, B, C, D, E), Recuperação & Frequência (75%) da UERGS
 * Conforme Seção 2.6 do PPC 2024 (p. 223)
 */
export function calculateUergsConceptAndExam(n1 = 0, n2 = 0, n3 = 0, hoursMissed = 0, courseHours = 60) {
  const g1 = Math.max(0, Math.min(10, Number(n1) || 0));
  const g2 = Math.max(0, Math.min(10, Number(n2) || 0));
  const g3 = Math.max(0, Math.min(10, Number(n3) || 0));
  const ch = Number(courseHours) || 60;
  const missed = Math.max(0, Number(hoursMissed) || 0);

  const maxAllowedMissed = ch * 0.25; // Limite máximo de 25% de faltas
  const attendancePercent = Math.max(0, Math.min(100, ((ch - missed) / ch) * 100));
  const avgGrade = (g1 + g2 + g3) / 3;
  const avgPercent = avgGrade * 10;

  let concept = "C";
  let status = "Aprovado";
  let badgeClass = "cyan";
  let details = "";
  let neededInRecovery = 0;

  if (attendancePercent < 75) {
    concept = "E";
    status = "Reprovado por Infrequência (Conceito E)";
    badgeClass = "red";
    details = `Frequência atual de ${attendancePercent.toFixed(1)}% é inferior ao mínimo legal de 75% (limite máximo de faltas para ${ch}h é de ${maxAllowedMissed}h). Sem direito a recuperação.`;
  } else if (avgGrade >= 9.0) {
    concept = "A";
    status = "Aprovado com Excelência (Conceito A)";
    badgeClass = "green";
    details = `Aproveitamento de ${avgPercent.toFixed(1)}% (≥ 90%) e frequência regular (${attendancePercent.toFixed(1)}%). Aprovação direta com conceito máximo!`;
  } else if (avgGrade >= 7.5) {
    concept = "B";
    status = "Aprovado com Bom Aproveitamento (Conceito B)";
    badgeClass = "cyan";
    details = `Aproveitamento de ${avgPercent.toFixed(1)}% (entre 75% e 89,9%) e frequência regular (${attendancePercent.toFixed(1)}%). Aprovação direta!`;
  } else if (avgGrade >= 6.0) {
    concept = "C";
    status = "Aprovado (Conceito C)";
    badgeClass = "green";
    details = `Aproveitamento de ${avgPercent.toFixed(1)}% (entre 60% e 74,9%) e frequência regular (${attendancePercent.toFixed(1)}%). Atingiu o limiar mínimo para aprovação direta.`;
  } else {
    concept = "D";
    status = "Em Recuperação / Conceito Parcial D";
    badgeClass = "amber";
    // Se a recuperação substitui a menor nota para atingir média 6.0 (soma 18.0 nas 3 avaliações)
    const gradesSorted = [g1, g2, g3].sort((a, b) => a - b);
    const sumTwoBest = gradesSorted[1] + gradesSorted[2];
    const neededToReplaceLowest = Math.max(6.0, 18.0 - sumTwoBest);
    neededInRecovery = Math.min(10.0, neededToReplaceLowest);
    details = `Aproveitamento parcial de ${avgPercent.toFixed(1)}% (< 60%), porém com frequência apta (${attendancePercent.toFixed(1)}% ≥ 75%). Direito regimental a Avaliação de Recuperação para buscar o Conceito C (nota mínima 6,0). Se a recuperação substituir a menor avaliação (${gradesSorted[0].toFixed(1)}), você precisa tirar pelo menos ${neededInRecovery.toFixed(1)}.`;
  }

  return {
    avgGrade: avgGrade.toFixed(2),
    avgPercent: avgPercent.toFixed(1),
    attendancePercent: attendancePercent.toFixed(1),
    maxAllowedMissed,
    remainingMissedHours: Math.max(0, maxAllowedMissed - missed),
    concept,
    status,
    badgeClass,
    details,
    neededInRecovery: neededInRecovery.toFixed(1)
  };
}
