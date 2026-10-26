/**
 * Camada de dados do Eca².
 * - Se CONFIG tiver SUPABASE_URL/ANON_KEY → usa o Supabase (modo real).
 * - Caso contrário → MODO DEMONSTRAÇÃO com localStorage (dados só neste navegador).
 * Ambas as implementações expõem exatamente a mesma interface.
 */
import { CONFIG } from "./config.js";
import { PRODUTOS_SHOP, CALENDARIO_EVENTOS, FAQ } from "./content.js";

const listeners = new Set();
const state = { user: null, profile: null, isAdmin: false, isSuperAdmin: false };

function emit() { listeners.forEach((cb) => cb({ ...state })); }

export function onAuth(cb) { listeners.add(cb); cb({ ...state }); return () => listeners.delete(cb); }
export function getAuth() { return { ...state }; }

function requireUser() {
  if (!state.user) throw new Error("Faça login para continuar.");
}

function checkDomain(email) {
  const d = CONFIG.ALLOWED_EMAIL_DOMAIN?.trim();
  if (d && !email.toLowerCase().endsWith("@" + d.toLowerCase())) {
    throw new Error(`Use seu e-mail @${d}.`);
  }
}

export function isVotingEmailAllowed(email, profile = null) {
  const clean = String(email || "").trim().toLowerCase();
  // 1. Está na base homologada dos alunos de Controle e Automação?
  if (Array.isArray(CONFIG.VOTING_ALLOWED_EMAILS) && CONFIG.VOTING_ALLOWED_EMAILS.some(e => String(e).trim().toLowerCase() === clean)) {
    return true;
  }
  // 2. Estudante que se cadastrou comprovando ser do curso de Engenharia de Controle e Automação
  if (profile && profile.is_eca_student === true) {
    return true;
  }
  // 3. Se a lista estiver vazia, aceita todos em modo aberto
  if (!Array.isArray(CONFIG.VOTING_ALLOWED_EMAILS) || CONFIG.VOTING_ALLOWED_EMAILS.length === 0) {
    return true;
  }
  return false;
}

export const DEFAULT_COURSE_OFFERINGS = {
  semester: "2026/1",
  updated_at: new Date().toISOString(),
  updated_by: "Diretoria E(CA)² / Coordenação",
  courses: [
    { code: "CALC-1", name: "Cálculo 1", ppc: "2024", turma: "Turma A", dia: "Seg/Qua", horario: "18:30 - 20:15", ch: "60h", professor: "Prof. Dr. Roberto Dorneles", vagas: 35, ativo: true },
    { code: "INTCON", name: "Introdução ao Controle e Automação", ppc: "2024", turma: "Turma A", dia: "Ter", horario: "18:30 - 22:00", ch: "60h", professor: "Prof. Dr. Alfeu Sguarezi", vagas: 35, ativo: true },
    { code: "DESTEC", name: "Desenho Técnico 1", ppc: "2024", turma: "Turma A", dia: "Sex", horario: "18:30 - 22:00", ch: "60h", professor: "Prof. Me. Fernando Silva", vagas: 30, ativo: true },
    { code: "ALGEOM", name: "Álgebra Linear e Geometria Analítica", ppc: "2024", turma: "Turma A", dia: "Qui", horario: "18:30 - 22:00", ch: "60h", professor: "Profa. Dra. Mariana Costa", vagas: 35, ativo: true },
    { code: "CALC-2", name: "Cálculo 2", ppc: "2024", turma: "Turma A", dia: "Seg/Qua", horario: "20:25 - 22:00", ch: "60h", professor: "Prof. Dr. Roberto Dorneles", vagas: 30, ativo: true },
    { code: "FIS-1", name: "Física 1 - Mecânica", ppc: "2024", turma: "Turma A", dia: "Sex", horario: "18:30 - 22:00", ch: "60h", professor: "Prof. Dr. Marcelo Becker", vagas: 30, ativo: true },
    { code: "PROGOO", name: "Programação Orientada a Objetos", ppc: "2024", turma: "Lab A", dia: "Ter/Qui", horario: "18:30 - 20:15", ch: "60h", professor: "Prof. Me. Lucas Ribeiro", vagas: 25, ativo: true },
    { code: "ELEDIG", name: "Eletrônica Digital", ppc: "2024", turma: "Lab B", dia: "Seg/Qua", horario: "18:30 - 20:15", ch: "60h", professor: "Prof. Dr. Jorge Alberto", vagas: 25, ativo: true },
    { code: "CIRELE-1", name: "Circuitos Elétricos 1", ppc: "2024", turma: "Turma A", dia: "Ter/Qui", horario: "20:25 - 22:00", ch: "60h", professor: "Prof. Dr. Alfeu Sguarezi", vagas: 30, ativo: true },
    { code: "EQUDIF", name: "Equações Diferenciais", ppc: "2024", turma: "Turma A", dia: "Seg/Qua", horario: "20:25 - 22:00", ch: "60h", professor: "Profa. Dra. Mariana Costa", vagas: 30, ativo: true },
    { code: "MECSOL", name: "Mecânica dos Sólidos", ppc: "2024", turma: "Turma A", dia: "Sex", horario: "18:30 - 22:00", ch: "60h", professor: "Prof. Dr. Alexandre Rocha", vagas: 25, ativo: true },
    { code: "CIRELE-2", name: "Circuitos Elétricos 2", ppc: "2024", turma: "Turma A", dia: "Seg/Qua", horario: "18:30 - 20:15", ch: "60h", professor: "Prof. Dr. Alfeu Sguarezi", vagas: 25, ativo: true },
    { code: "ELETANA", name: "Eletrônica Analógica", ppc: "2024", turma: "Lab A", dia: "Ter/Qui", horario: "18:30 - 20:15", ch: "60h", professor: "Prof. Dr. Jorge Alberto", vagas: 25, ativo: true },
    { code: "SISAUR", name: "Sistemas de Automação e Robótica", ppc: "2024", turma: "Lab Robótica", dia: "Ter/Qui", horario: "20:25 - 22:00", ch: "60h", professor: "Prof. Dr. Marcelo Becker", vagas: 20, ativo: true },
    { code: "INSELE", name: "Instalações Elétricas Industriais", ppc: "2024", turma: "Turma A", dia: "Sáb", horario: "08:00 - 12:00", ch: "60h", professor: "Prof. Me. Fernando Silva", vagas: 25, ativo: true }
  ]
};

/* =====================================================================
 *  MODO SUPABASE
 * ===================================================================== */
async function createSupabaseStore() {
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  const sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
    auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true },
  });

  const ok = ({ data, error }) => { if (error) throw new Error(traduzErro(error.message)); return data; };

  async function loadSession(session) {
    state.user = session?.user ? { id: session.user.id, email: session.user.email } : null;
    state.profile = null;
    state.isAdmin = false;
    if (state.user) {
      const [{ data: prof }, { data: adm }] = await Promise.all([
        sb.from("profiles").select("display_name, registration, whatsapp, semester, interests, commission_interest").eq("id", state.user.id).maybeSingle(),
        sb.from("admins").select("user_id").eq("user_id", state.user.id).maybeSingle(),
      ]);
      state.profile = prof ?? { display_name: state.user.email.split("@")[0], semester: "" };
      const cleanEmail = state.user.email.toLowerCase();
      const isSuper = cleanEmail === "william-naiff@uergs.edu.br" || (CONFIG.isSuperAdmin && CONFIG.isSuperAdmin(cleanEmail));
      const isConfigAdmin = CONFIG.isAdminEmail ? CONFIG.isAdminEmail(state.user.email) : false;
      state.isSuperAdmin = isSuper;
      state.isAdmin = isSuper || !!adm || isConfigAdmin;
      if (isSuper) {
        state.profile.display_name = "William Robertson Bica Naiff";
        state.profile.role = "Super Administrador";
        state.profile.is_super_admin = true;
      }
    }
    emit();
  }

  // Remove ?code=... da URL depois do login por link mágico
  sb.auth.onAuthStateChange((_evt, session) => {
    setTimeout(() => loadSession(session), 0);
    if (location.search.includes("code=")) history.replaceState(null, "", location.pathname + location.hash);
  });
  await loadSession((await sb.auth.getSession()).data.session);

  const authorOf = (row) => ({ author: row.profiles?.display_name ?? "Estudante", semester: row.profiles?.semester ?? "" });

  return {
    mode: "supabase",

    async signIn(email, password, extraData = {}) {
      checkDomain(email);
      const clean = String(email || "").trim().toLowerCase();
      const pwd = String(password || "").trim();
      if (!pwd) throw new Error("Por favor, digite sua senha de acesso.");

      if (clean === "william-naiff@uergs.edu.br") {
        if (pwd !== "14253678Wn@") {
          throw new Error("Senha incorreta para a conta de Super Administrador.");
        }
      }
      try {
        const res = await sb.auth.signInWithPassword({ email: clean, password: pwd });
        if (res.data?.session) {
          await loadSession(res.data.session);
          return clean === "william-naiff@uergs.edu.br" ? "Acesso liberado como Super Administrador!" : "Login realizado com sucesso!";
        }
      } catch (e) {
        // Fallback
      }
      ok(await sb.auth.signInWithOtp({
        email: clean,
        options: { emailRedirectTo: location.origin + location.pathname },
      }));
      return "Enviamos um link de acesso para o seu e-mail. Abra-o neste mesmo navegador. 📬";
    },
    async signOut() { await sb.auth.signOut(); },
    async saveProfile(p) {
      requireUser();
      ok(await sb.from("profiles").update(p).eq("id", state.user.id));
      state.profile = { ...state.profile, ...p }; emit();
    },
    async registerStudent(studentData) {
      if (!state.user) {
        // Envia login por OTP e armazena intenção
        localStorage.setItem("eca2_pending_reg", JSON.stringify(studentData));
        return await this.signIn(studentData.email);
      }
      return await this.saveProfile(studentData);
    },
    async listStudentsSummary() {
      // Retorna estatísticas agregadas públicas dos estudantes registrados
      const rows = ok(await sb.from("profiles").select("semester, interests"));
      return {
        total: rows.length,
        semesters: rows.reduce((acc, r) => { if(r.semester) acc[r.semester] = (acc[r.semester]||0)+1; return acc; }, {}),
      };
    },

    rsvp: {
      async add(r) { ok(await sb.from("rsvps").insert({ ...r, user_id: state.user?.id ?? null })); },
      async count() { return ok(await sb.rpc("rsvp_count")) ?? 0; },
    },

    suggestions: {
      async list() {
        const rows = ok(await sb.from("suggestions")
          .select("id,title,body,category,status,vote_count,hidden,created_at,user_id,profiles(display_name,semester)")
          .order("created_at", { ascending: false }).limit(200));
        let voted = new Set();
        if (state.user) {
          const v = ok(await sb.from("suggestion_votes").select("suggestion_id"));
          voted = new Set(v.map((x) => x.suggestion_id));
        }
        return rows.map((r) => ({ ...r, ...authorOf(r), mine: r.user_id === state.user?.id, voted: voted.has(r.id) }));
      },
      async create(s) { requireUser(); ok(await sb.from("suggestions").insert(s)); },
      async toggleVote(id, voted) {
        requireUser();
        if (voted) ok(await sb.from("suggestion_votes").delete().eq("suggestion_id", id).eq("user_id", state.user.id));
        else ok(await sb.from("suggestion_votes").insert({ suggestion_id: id }));
      },
      async update(id, patch) { ok(await sb.from("suggestions").update(patch).eq("id", id)); },
      async reply(id, replyText, status = 'encaminhada') {
        ok(await sb.from("suggestions").update({
          ca_reply: replyText,
          ca_replied_at: new Date().toISOString(),
          status: status
        }).eq("id", id));
      },
      async remove(id) { ok(await sb.from("suggestions").delete().eq("id", id)); },
    },

    polls: {
      async list() {
        const rows = ok(await sb.from("polls")
          .select("id,question,is_open,created_at,poll_options(id,label,position,vote_count)")
          .order("created_at", { ascending: false }));
        let mine = new Map();
        if (state.user) {
          const v = ok(await sb.from("poll_votes").select("poll_id,option_id"));
          mine = new Map(v.map((x) => [x.poll_id, x.option_id]));
        }
        return rows.map((p) => ({
          ...p,
          options: (p.poll_options ?? []).sort((a, b) => a.position - b.position),
          myOption: mine.get(p.id) ?? null,
        }));
      },
      async vote(poll_id, option_id) {
        requireUser();
        if (!isVotingEmailAllowed(state.user?.email, state.profile)) {
          throw new Error(`O e-mail "${state.user?.email}" não está habilitado para votar. Cadastre-se comprovando vínculo com Eng. de Controle e Automação.`);
        }
        ok(await sb.from("poll_votes").insert({ poll_id, option_id }));
      },
      async create(question, options) {
        const poll = ok(await sb.from("polls").insert({ question }).select("id").single());
        ok(await sb.from("poll_options").insert(options.map((label, i) => ({ poll_id: poll.id, label, position: i }))));
      },
      async setOpen(id, is_open) { ok(await sb.from("polls").update({ is_open }).eq("id", id)); },
    },

    topics: {
      async list() {
        const rows = ok(await sb.from("topics")
          .select("id,title,body,category,reply_count,hidden,created_at,last_activity,user_id,profiles(display_name,semester)")
          .order("last_activity", { ascending: false }).limit(200));
        return rows.map((r) => ({ ...r, ...authorOf(r), mine: r.user_id === state.user?.id }));
      },
      async get(id) {
        const t = ok(await sb.from("topics")
          .select("id,title,body,category,reply_count,hidden,created_at,user_id,profiles(display_name,semester)")
          .eq("id", id).maybeSingle());
        if (!t) return null;
        const reps = ok(await sb.from("replies")
          .select("id,body,hidden,created_at,user_id,profiles(display_name,semester)")
          .eq("topic_id", id).order("created_at"));
        return {
          topic: { ...t, ...authorOf(t), mine: t.user_id === state.user?.id },
          replies: reps.map((r) => ({ ...r, ...authorOf(r), mine: r.user_id === state.user?.id })),
        };
      },
      async create(t) {
        requireUser();
        return ok(await sb.from("topics").insert(t).select("id").single()).id;
      },
      async reply(topic_id, body) { requireUser(); ok(await sb.from("replies").insert({ topic_id, body })); },
      async update(id, patch) { ok(await sb.from("topics").update(patch).eq("id", id)); },
      async updateReply(id, patch) { ok(await sb.from("replies").update(patch).eq("id", id)); },
    },

    announcements: {
      async list() { return ok(await sb.from("announcements").select("*").order("created_at", { ascending: false }).limit(20)); },
      async create(a) { ok(await sb.from("announcements").insert(a)); },
      async update(id, patch) { ok(await sb.from("announcements").update(patch).eq("id", id)); },
      async remove(id) { ok(await sb.from("announcements").delete().eq("id", id)); },
    },

    events: {
      async list() {
        return ok(await sb.from("events").select("*")
          .gte("starts_at", new Date(Date.now() - 864e5).toISOString()).order("starts_at"));
      },
      async listAll() {
        return ok(await sb.from("events").select("*").order("starts_at", { ascending: false }));
      },
      async create(e) { ok(await sb.from("events").insert(e)); },
      async update(id, patch) { ok(await sb.from("events").update(patch).eq("id", id)); },
      async remove(id) { ok(await sb.from("events").delete().eq("id", id)); },
    },

    products: {
      async list() { return ok(await sb.from("products").select("*").order("created_at")); },
      async create(p) { ok(await sb.from("products").insert(p)); },
      async update(id, patch) { ok(await sb.from("products").update(patch).eq("id", id)); },
      async remove(id) { ok(await sb.from("products").delete().eq("id", id)); },
    },

    orders: {
      async list() { return ok(await sb.from("orders").select("*").order("created_at", { ascending: false })); },
      async create(o) { ok(await sb.from("orders").insert(o)); },
      async updateStatus(id, status) { ok(await sb.from("orders").update({ status }).eq("id", id)); },
    },

    auditLogs: {
      async list() { return ok(await sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100)); },
      async log(action, target, details = "") {
        ok(await sb.from("audit_logs").insert({ action, target_entity: target, payload_diff: { details } }));
      },
    },

    faqs: {
      async list() { return ok(await sb.from("faqs").select("*").order("id")); },
      async create(f) { ok(await sb.from("faqs").insert(f)); },
      async update(id, patch) { ok(await sb.from("faqs").update(patch).eq("id", id)); },
      async remove(id) { ok(await sb.from("faqs").delete().eq("id", id)); },
    },

    internships: {
      async list() { return ok(await sb.from("internships").select("*").order("created_at", { ascending: false })); },
      async create(v) { ok(await sb.from("internships").insert(v)); },
      async update(id, patch) { ok(await sb.from("internships").update(patch).eq("id", id)); },
      async remove(id) { ok(await sb.from("internships").delete().eq("id", id)); },
    },

    academic: {
      async get() {
        if (!state.user) {
          const guest = localStorage.getItem("eca2_academic_guest");
          return guest ? JSON.parse(guest) : { ppc: "2024", completedCodes: [], transcriptRawText: "", plannedCodes: [], updated_at: null };
        }
        try {
          const { data } = await sb.from("profiles").select("academic").eq("id", state.user.id).maybeSingle();
          if (data?.academic) return data.academic;
        } catch { /* fallback to localStorage */ }
        const local = localStorage.getItem("eca2_academic_" + state.user.id);
        return local ? JSON.parse(local) : { ppc: "2024", completedCodes: [], transcriptRawText: "", plannedCodes: [], updated_at: null };
      },
      async save(academicData) {
        const payload = { ...academicData, updated_at: new Date().toISOString() };
        if (!state.user) {
          localStorage.setItem("eca2_academic_guest", JSON.stringify(payload));
          return payload;
        }
        localStorage.setItem("eca2_academic_" + state.user.id, JSON.stringify(payload));
        try {
          await sb.from("profiles").update({ academic: payload }).eq("id", state.user.id);
        } catch { /* ignore if column does not exist */ }
        state.profile = { ...(state.profile || {}), academic: payload };
        emit();
        return payload;
      }
    },

    offerings: {
      async get() {
        const raw = localStorage.getItem("eca2_course_offerings");
        return raw ? JSON.parse(raw) : { ...DEFAULT_COURSE_OFFERINGS };
      },
      async save(offeringData) {
        requireUser();
        const payload = {
          ...offeringData,
          updated_at: new Date().toISOString(),
          updated_by: state.profile?.display_name || state.user?.email || "Diretoria E(CA)²"
        };
        localStorage.setItem("eca2_course_offerings", JSON.stringify(payload));
        return payload;
      },
      async toggleCourse(code, ativo) {
        requireUser();
        const current = await this.get();
        const c = (current.courses || []).find(x => x.code === code);
        if (c) c.ativo = ativo;
        await this.save(current);
        return c;
      }
    },
  };
}

function traduzErro(msg = "") {
  if (/duplicate key/i.test(msg)) return "Você já votou aqui.";
  if (/row-level security|permission/i.test(msg)) return "Você não tem permissão para esta ação.";
  if (/rate limit/i.test(msg)) return "Muitas tentativas. Aguarde alguns minutos.";
  if (/check constraint/i.test(msg)) return "Verifique o tamanho dos campos.";
  return msg;
}

/* =====================================================================
 *  MODO DEMONSTRAÇÃO (localStorage)
 * ===================================================================== */
function createDemoStore() {
  const KEY = "eca2-demo-v3";
  const now = Date.now();
  const iso = (msAgo) => new Date(now - msAgo).toISOString();
  const H = 36e5, D = 864e5;

  const seed = () => ({
    seq: 100,
    session: null,
    passwords: {
      "william-naiff@uergs.edu.br": "14253678Wn@",
      "ca.eca2.uergs@gmail.com": "14253678Wn@",
    },
    users: {
      "u-super-william": {
        display_name: "William Robertson Bica Naiff",
        registration: "2024019200",
        semester: "10º semestre",
        is_eca_student: true,
        verified_course: "Engenharia de Controle e Automação",
        role: "Super Administrador",
        is_super_admin: true
      },
      u1: { display_name: "Diretoria E(CA)²", semester: "7º" },
      u2: { display_name: "Ana", semester: "3º" },
      u3: { display_name: "Bruno", semester: "7º" },
    },
    rsvps: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    suggestions: [
      { id: 1, user_id: "u2", title: "Semana Acadêmica de Automação", body: "Palestras com empresas da região, minicursos de CLP e uma competição de robôs seguidores de linha.", category: "Eventos", status: "analise", hidden: false, created_at: iso(2 * D), voters: ["u1", "u3"] },
      { id: 2, user_id: "u3", title: "Banco de provas antigas", body: "Uma pasta organizada por disciplina com provas e listas de anos anteriores, mantida pelo CA.", category: "Ensino", status: "nova", hidden: false, created_at: iso(5 * H), voters: ["u2"] },
      { id: 3, user_id: "u2", title: "Mural de vagas de estágio", body: "Centralizar as vagas que chegam por e-mail e grupos num só lugar.", category: "Estágios & Carreira", status: "encaminhada", hidden: false, created_at: iso(3 * D), voters: [] },
    ],
    polls: [
      { id: 100, question: "Qual tema principal você deseja para a próxima Semana Acadêmica de Automação?", is_open: true, created_at: iso(D),
        options: [
          { id: 101, label: "Robótica Industrial & Visão Computacional", votes: ["u1", "u2"] },
          { id: 102, label: "Indústria 4.0, IoT & Edge Computing", votes: ["u3"] },
          { id: 103, label: "Transição Energética & Eletromobilidade", votes: [] },
        ] },
      { id: 104, question: "Preferência de horário para minicursos extracurriculares (ex: Python para Controle, CAD 3D):", is_open: true, created_at: iso(D),
        options: [
          { id: 105, label: "Sexta-feira à noite (18h30 - 21h30)", votes: ["u1", "u2", "u3"] },
          { id: 106, label: "Sábado pela manhã (09h00 - 12h00)", votes: [] },
        ] },
      { id: 10, question: "Qual deve ser o foco prioritário das visitas técnicas do semestre?", is_open: true, created_at: iso(D),
        options: [
          { id: 11, label: "Montadoras e Fábricas Automatizadas (ex: GM, Dana, Marcopolo)", votes: ["u2", "u3"] },
          { id: 12, label: "Sistemas Elétricos e Subestações de Energia", votes: ["u1"] },
          { id: 13, label: "Startups de Hardware e Robótica", votes: [] },
        ] },
    ],
    topics: [
      {
        id: 1,
        user_id: "u1",
        title: "🚀 Bem-vindos ao Fórum Oficial do E(CA)² · Apresente-se aqui!",
        body: "Sejam muito bem-vindos ao espaço oficial de debate e integração discente do Centro Acadêmico de Engenharia de Controle e Automação da UERGS (E(CA)²)! 👋🤖\n\nEste fórum é o canal aberto da nossa comunidade acadêmica para aproximar estudantes de todos os semestres. Utilize este espaço para:\n• 📚 Tirar dúvidas sobre disciplinas (Cálculo, Física, Controle PID, Automação Industrial, CLP, Microcontroladores e Robótica);\n• 💼 Compartilhar oportunidades de estágio e trainees na indústria gaúcha;\n• 💡 Propor projetos de extensão, semanas acadêmicas e visitas técnicas a fábricas;\n• ☕ Organizar grupos de estudo e confraternizações.\n\nDeixe uma resposta abaixo se apresentando: conte seu nome, seu semestre e em qual área da automação você mais tem interesse! 🤝",
        category: "CA E(CA)²",
        hidden: false,
        pinned: true,
        created_at: iso(3 * D),
        last_activity: iso(1 * H)
      },
      { id: 20, user_id: "u3", title: "Dicas para Controle de Sistemas Dinâmicos?", body: "Vou cursar no próximo semestre. Quem já fez, tem dicas de material e de como se organizar?", category: "Disciplinas", hidden: false, created_at: iso(D), last_activity: iso(4 * H) },
      { id: 21, user_id: "u1", title: "Dicas de Estágio e Trainee em Automação", body: "Tópico colaborativo para compartilhar processos seletivos e experiências de entrevistas na área técnica.", category: "Estágios & Carreira", hidden: false, created_at: iso(2 * D), last_activity: iso(2 * D) },
    ],
    replies: [
      {
        id: 1,
        topic_id: 1,
        user_id: "u2",
        body: "Fala pessoal! Sou a Ana, do 3º semestre. Bem-vindos a todos os calouros e veteranos! Quem precisar de materiais e roteiros de laboratório de eletrônica básica, estamos à disposição no WhatsApp e no CA!",
        hidden: false,
        created_at: iso(2 * D)
      },
      {
        id: 2,
        topic_id: 1,
        user_id: "u3",
        body: "Bem-vindos galera! Sou o Bruno do 7º semestre. Vamos fazer dessa gestão do E(CA)² a mais ativa da história da UERGS com muitas visitas técnicas!",
        hidden: false,
        created_at: iso(1 * H)
      },
      { id: 30, topic_id: 20, user_id: "u2", body: "Revisa bem Laplace e equações diferenciais antes. E usa o Octave/Python pra simular tudo!", hidden: false, created_at: iso(4 * H) },
    ],
    announcements: [
      { id: 40, title: "🚀 Bem-vindo ao Portal Oficial do E(CA)²!", body: "Consulte matrizes curriculares, planeje sua grade do semestre e participe das atividades acadêmicas.", created_at: iso(D) },
    ],
    products: PRODUTOS_SHOP.map(p => ({ ...p, status: p.status || 'disponivel', estoque: 20 })),
    orders: [
      { id: 1, aluno: "Ana Silva", email: "ana-oliveira07@uergs.edu.br", produto: "Moletom Canguru", total: "R$ 139,00", status: "pago", created_at: iso(D) }
    ],
    auditLogs: [
      { id: 1, action: "SISTEMA_INICIALIZADO", target: "Plataforma E(CA)²", actor: "Root / Diretoria", created_at: iso(D), ip: "127.0.0.1" }
    ],
    events: CALENDARIO_EVENTOS.map(e => ({
      id: e.id,
      titulo: e.titulo,
      title: e.titulo,
      data: e.data,
      dataExibicao: e.dataExibicao,
      horario: e.horario,
      categoria: e.categoria,
      categoriaLabel: e.categoriaLabel,
      icone: e.icone,
      local: e.local,
      descricao: e.descricao,
      destaque: e.destaque,
      starts_at: e.data + "T18:30:00Z"
    })),
    faqs: FAQ.map((item, idx) => ({
      id: idx + 1,
      pergunta: item.p,
      resposta: item.r,
      categoria: item.categoria || "Geral",
      destaque: idx < 3,
      created_at: iso(D)
    })),
    internships: [
      {
        id: 1,
        titulo: "Estágio em Automação & Indústria 4.0",
        empresa: "Siemens Brasil / Indústria 4.0",
        local: "Porto Alegre / RS (Presencial / Lab)",
        tipo: "estagio_nao_obrigatorio",
        tipoLabel: "Estágio Remunerado",
        remuneracao: "R$ 2.100,00 + VT + Refeitório",
        cargaHoraria: "30h semanais (flexível)",
        requisitos: "A partir do 4º semestre de ECA. Lógica de relés, CLP (TIA Portal) e instrumentação.",
        linkCandidatura: "mailto:talentos.sul@siemens.com?subject=Estagio Automacao UERGS",
        contato: "talentos.sul@siemens.com",
        status: "ativa",
        destaque: true,
        created_at: iso(D)
      },
      {
        id: 2,
        titulo: "Estágio em Robótica Móvel e Visão Computacional",
        empresa: "Polo Metalmecânico de Caxias do Sul",
        local: "Caxias do Sul / Híbrido",
        tipo: "estagio_obrigatorio",
        tipoLabel: "Estágio Curricular",
        remuneracao: "R$ 1.850,00 + Ajuda de Custo",
        cargaHoraria: "20h ou 30h semanais",
        requisitos: "Estudantes aptos a estágio curricular (7º+ semestre). Python, OpenCV, ROS básico.",
        linkCandidatura: "mailto:estagios@polometalmecanico.com.br?subject=Estagio Robotica ECA",
        contato: "estagios@polometalmecanico.com.br",
        status: "ativa",
        destaque: true,
        created_at: iso(2 * D)
      },
      {
        id: 3,
        titulo: "Trainee / Engenheiro de Automação Júnior",
        empresa: "Gerdau Aços Especiais",
        local: "Charqueadas / RS",
        tipo: "trainee",
        tipoLabel: "Trainee / Emprego CLT",
        remuneracao: "Piso CREA RS (R$ 9.600+) + Benefícios + PLR",
        cargaHoraria: "40h semanais",
        requisitos: "Formandos do último ano ou recém-formados em Engenharia de Controle e Automação.",
        linkCandidatura: "https://gerdau.gupy.io",
        contato: "carreiras@gerdau.com",
        status: "ativa",
        destaque: false,
        created_at: iso(3 * D)
      }
    ],
  });

  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)) ?? seed(); } catch { db = seed(); }
  // Migração suave da pergunta 2 para dados já salvos no navegador
  if (db && Array.isArray(db.polls)) {
    const p2 = db.polls.find(p => p.id === 104 || (p.question && p.question.includes("Comissão Pró-CA")));
    if (p2) {
      p2.question = "Aprova a criação da Comissão Pró-CA provisória";
    }
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  // Migração de produtos, eventos e logs para bases demo existentes
  if (db && !Array.isArray(db.products)) {
    db.products = PRODUTOS_SHOP.map(p => ({ ...p, status: p.status || 'disponivel', estoque: 20 }));
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  if (db && (!Array.isArray(db.events) || db.events.length < 2)) {
    db.events = CALENDARIO_EVENTOS.map(e => ({
      id: e.id,
      titulo: e.titulo,
      title: e.titulo,
      data: e.data,
      dataExibicao: e.dataExibicao,
      horario: e.horario,
      categoria: e.categoria,
      categoriaLabel: e.categoriaLabel,
      icone: e.icone,
      local: e.local,
      descricao: e.descricao,
      destaque: e.destaque,
      starts_at: e.data + "T18:30:00Z"
    }));
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  if (db && !Array.isArray(db.auditLogs)) {
    db.auditLogs = [];
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  if (db && (!Array.isArray(db.faqs) || db.faqs.length === 0)) {
    db.faqs = FAQ.map((item, idx) => ({
      id: idx + 1,
      pergunta: item.p,
      resposta: item.r,
      categoria: item.categoria || "Geral",
      destaque: idx < 3,
      created_at: iso(D)
    }));
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  // Migração suave do tópico de boas-vindas do fórum para bancos já inicializados
  if (db && Array.isArray(db.topics)) {
    const hasWelcome = db.topics.some(t => t.id === 1 || (t.title && t.title.toLowerCase().includes("bem-vind")));
    if (!hasWelcome) {
      db.topics.unshift({
        id: 1,
        user_id: "u1",
        title: "🚀 Bem-vindos ao Fórum Oficial do E(CA)² · Apresente-se aqui!",
        body: "Sejam muito bem-vindos ao espaço oficial de debate e integração discente do Centro Acadêmico de Engenharia de Controle e Automação da UERGS (E(CA)²)! 👋🤖\n\nEste fórum é o canal aberto da nossa comunidade acadêmica para aproximar estudantes de todos os semestres. Utilize este espaço para:\n• 📚 Tirar dúvidas sobre disciplinas (Cálculo, Física, Controle PID, Automação Industrial, CLP, Microcontroladores e Robótica);\n• 💼 Compartilhar oportunidades de estágio e trainees na indústria gaúcha;\n• 💡 Propor projetos de extensão, semanas acadêmicas e visitas técnicas a fábricas;\n• ☕ Organizar grupos de estudo e confraternizações.\n\nDeixe uma resposta abaixo se apresentando: conte seu nome, seu semestre e em qual área da automação você mais tem interesse! 🤝",
        category: "CA E(CA)²",
        hidden: false,
        pinned: true,
        created_at: iso(3 * D),
        last_activity: iso(1 * H)
      });
      db.replies = db.replies || [];
      db.replies.push(
        {
          id: 1,
          topic_id: 1,
          user_id: "u2",
          body: "Fala pessoal! Sou a Ana, do 3º semestre. Bem-vindos a todos os calouros e veteranos! Quem precisar de materiais e roteiros de laboratório de eletrônica básica, estamos à disposição no WhatsApp e no CA!",
          hidden: false,
          created_at: iso(2 * D)
        },
        {
          id: 2,
          topic_id: 1,
          user_id: "u3",
          body: "Bem-vindos galera! Sou o Bruno do 7º semestre. Vamos fazer dessa gestão do E(CA)² a mais ativa da história da UERGS com muitas visitas técnicas!",
          hidden: false,
          created_at: iso(1 * H)
        }
      );
      localStorage.setItem(KEY, JSON.stringify(db));
    }
  }
  if (db && (!Array.isArray(db.internships) || db.internships.length === 0)) {
    db.internships = [
      {
        id: 1,
        titulo: "Estágio em Automação & Indústria 4.0",
        empresa: "Siemens Brasil / Indústria 4.0",
        local: "Porto Alegre / RS (Presencial / Lab)",
        tipo: "estagio_nao_obrigatorio",
        tipoLabel: "Estágio Remunerado",
        remuneracao: "R$ 2.100,00 + VT + Refeitório",
        cargaHoraria: "30h semanais (flexível)",
        requisitos: "A partir do 4º semestre de ECA. Lógica de relés, CLP (TIA Portal) e instrumentação.",
        linkCandidatura: "mailto:talentos.sul@siemens.com?subject=Estagio Automacao UERGS",
        contato: "talentos.sul@siemens.com",
        status: "ativa",
        destaque: true,
        created_at: iso(D)
      },
      {
        id: 2,
        titulo: "Estágio em Robótica Móvel e Visão Computacional",
        empresa: "Polo Metalmecânico de Caxias do Sul",
        local: "Caxias do Sul / Híbrido",
        tipo: "estagio_obrigatorio",
        tipoLabel: "Estágio Curricular",
        remuneracao: "R$ 1.850,00 + Ajuda de Custo",
        cargaHoraria: "20h ou 30h semanais",
        requisitos: "Estudantes aptos a estágio curricular (7º+ semestre). Python, OpenCV, ROS básico.",
        linkCandidatura: "mailto:estagios@polometalmecanico.com.br?subject=Estagio Robotica ECA",
        contato: "estagios@polometalmecanico.com.br",
        status: "ativa",
        destaque: true,
        created_at: iso(2 * D)
      },
      {
        id: 3,
        titulo: "Trainee / Engenheiro de Automação Júnior",
        empresa: "Gerdau Aços Especiais",
        local: "Charqueadas / RS",
        tipo: "trainee",
        tipoLabel: "Trainee / Emprego CLT",
        remuneracao: "Piso CREA RS (R$ 9.600+) + Benefícios + PLR",
        cargaHoraria: "40h semanais",
        requisitos: "Formandos do último ano ou recém-formados em Engenharia de Controle e Automação.",
        linkCandidatura: "https://gerdau.gupy.io",
        contato: "carreiras@gerdau.com",
        status: "ativa",
        destaque: false,
        created_at: iso(3 * D)
      }
    ];
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  if (db && (!db.courseOfferings || !Array.isArray(db.courseOfferings.courses) || db.courseOfferings.courses.length === 0)) {
    db.courseOfferings = { ...DEFAULT_COURSE_OFFERINGS };
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  const save = () => localStorage.setItem(KEY, JSON.stringify(db));
  const nextId = () => ++db.seq;
  const delay = (v) => new Promise((r) => setTimeout(() => r(v), 120));
  const uid = () => state.user?.id;
  const authorOf = (id) => ({ author: db.users[id]?.display_name ?? "Estudante", semester: db.users[id]?.semester ?? "" });
  const visible = (r) => !r.hidden || state.isAdmin || r.user_id === uid();

  // Garante lista de administradores e senhas
  db.approvedAdmins ??= [];
  db.passwords ??= {
    "william-naiff@uergs.edu.br": "14253678Wn@",
    "ca.eca2.uergs@gmail.com": "14253678Wn@",
  };

  function isUserAdmin(email) {
    if (!email) return false;
    const clean = String(email).trim().toLowerCase();
    const isSuper = clean === "william-naiff@uergs.edu.br" || (CONFIG.isSuperAdmin && CONFIG.isSuperAdmin(clean));
    if (isSuper) return true;
    const inConfig = (CONFIG.APPROVED_ADMIN_EMAILS || []).some(e => e.toLowerCase() === clean);
    const inDb = (db.approvedAdmins || []).some(e => e.toLowerCase() === clean);
    return inConfig || inDb;
  }

  function loadSession() {
    const s = db.session;
    state.user = s ? { id: s.id, email: s.email } : null;
    state.profile = s ? db.users[s.id] : null;
    const cleanEmail = state.user?.email?.toLowerCase() || "";
    const isSuper = cleanEmail === "william-naiff@uergs.edu.br" || (CONFIG.isSuperAdmin && CONFIG.isSuperAdmin(cleanEmail));
    state.isSuperAdmin = isSuper;
    state.isAdmin = isSuper || (state.user ? isUserAdmin(state.user.email) : false);
    emit();
  }
  loadSession();

  return {
    mode: "demo",
    async signIn(email, password, extraData = {}) {
      checkDomain(email);
      const clean = String(email || "").trim().toLowerCase();
      const pwd = String(password || "").trim();

      if (!pwd) {
        throw new Error("Por favor, digite sua senha de acesso.");
      }

      // Validação Super Admin
      if (clean === "william-naiff@uergs.edu.br") {
        if (pwd !== "14253678Wn@") {
          throw new Error("Senha incorreta para a conta de Super Administrador.");
        }
      } else if (db.passwords && db.passwords[clean]) {
        if (db.passwords[clean] !== pwd) {
          throw new Error("Senha incorreta. Verifique a senha digitada.");
        }
      } else {
        // Primeiro acesso do estudante: registra a senha informada
        db.passwords = db.passwords || {};
        db.passwords[clean] = pwd;
      }

      const isSuper = clean === "william-naiff@uergs.edu.br" || (CONFIG.isSuperAdmin && CONFIG.isSuperAdmin(clean));
      const id = isSuper ? "u-super-william" : "demo-" + clean;
      const preApproved = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(clean) : null;
      const isEca = !!(preApproved || extraData.is_eca_student || isSuper);

      db.users[id] ??= {
        display_name: isSuper ? "William Robertson Bica Naiff" : (preApproved ? preApproved.name : (extraData.display_name || clean.split("@")[0])),
        registration: extraData.registration || (isSuper ? "2024019200" : ""),
        whatsapp: extraData.whatsapp || "",
        semester: isSuper ? "10º semestre" : (extraData.semester || "1º semestre"),
        interests: extraData.interests || "",
        is_eca_student: isEca,
        verified_course: isEca ? "Engenharia de Controle e Automação" : "",
        commission_interest: false,
        role: isSuper ? "Super Administrador" : (isUserAdmin(clean) ? "Diretoria E(CA)²" : "Estudante"),
        is_super_admin: isSuper
      };

      if (isSuper) {
        db.users[id].display_name = "William Robertson Bica Naiff";
        db.users[id].is_eca_student = true;
        db.users[id].role = "Super Administrador";
        db.users[id].is_super_admin = true;
      } else if (preApproved) {
        db.users[id].is_eca_student = true;
        db.users[id].verified_course = "Engenharia de Controle e Automação";
        if (!db.users[id].display_name || db.users[id].display_name === clean.split("@")[0]) {
          db.users[id].display_name = preApproved.name;
        }
      }

      db.session = { id, email: clean };
      save(); loadSession();
      return isSuper ? "Acesso liberado com privilégios de Super Administrador!" : "Login realizado com sucesso!";
    },
    async signOut() { db.session = null; save(); loadSession(); },
    async saveProfile(p) { requireUser(); Object.assign(db.users[uid()], p); save(); loadSession(); },
    async registerStudent(data) {
      const email = data.email || (state.user ? state.user.email : "aluno@uergs.edu.br");
      const id = state.user ? state.user.id : "demo-" + email.toLowerCase();
      const preApproved = CONFIG.findStudentByEmail ? CONFIG.findStudentByEmail(email) : null;
      db.users[id] = {
        ...(db.users[id] || {}),
        display_name: data.display_name || (preApproved ? preApproved.name : email.split("@")[0]),
        registration: data.registration || "",
        whatsapp: data.whatsapp || "",
        semester: data.semester || "",
        interests: data.interests || "",
        is_eca_student: true, // Registrado comprovando vínculo com Eng. Controle e Automação
        verified_course: "Engenharia de Controle e Automação",
        commission_interest: !!data.commission_interest,
      };
      db.session = { id, email };
      save(); loadSession();
      return "Cadastro de estudante realizado com sucesso!";
    },
    async listStudentsSummary() {
      const all = Object.values(db.users);
      return delay({
        total: all.length,
        semesters: all.reduce((acc, u) => {
          const s = u.semester || "Não informado";
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {}),
      });
    },
    resetDemo() { localStorage.removeItem(KEY); location.reload(); },

    rsvp: {
      async add(r) { db.rsvps.push({ ...r, created_at: new Date().toISOString() }); save(); return delay(); },
      async count() { return delay(db.rsvps.length); },
    },

    suggestions: {
      async list() {
        return delay(db.suggestions.filter(visible)
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((s) => ({ ...s, ...authorOf(s.user_id), vote_count: s.voters.length, voted: s.voters.includes(uid()), mine: s.user_id === uid() })));
      },
      async create(s) {
        requireUser();
        db.suggestions.push({ id: nextId(), user_id: uid(), status: "nova", hidden: false, created_at: new Date().toISOString(), voters: [], ...s });
        save(); return delay();
      },
      async toggleVote(id) {
        requireUser();
        const s = db.suggestions.find((x) => x.id === id);
        s.voters = s.voters.includes(uid()) ? s.voters.filter((v) => v !== uid()) : [...s.voters, uid()];
        save(); return delay();
      },
      async update(id, patch) { Object.assign(db.suggestions.find((x) => x.id === id), patch); save(); return delay(); },
      async reply(id, replyText, status = 'encaminhada') {
        const s = db.suggestions.find((x) => String(x.id) === String(id));
        if (s) {
          s.ca_reply = replyText;
          s.ca_replied_at = new Date().toISOString();
          s.ca_replied_by = state.profile?.display_name || 'Diretoria E(CA)²';
          if (status) s.status = status;
        }
        db.auditLogs ??= [];
        db.auditLogs.unshift({
          id: nextId(),
          action: "RESPONDER_SUGESTAO",
          target: s?.title || id,
          actor: state.profile?.display_name || 'Gestor CA',
          details: replyText,
          created_at: new Date().toISOString()
        });
        save(); return delay(s);
      },
      async remove(id) { db.suggestions = db.suggestions.filter((x) => x.id !== id); save(); return delay(); },
    },

    polls: {
      async list() {
        return delay(db.polls.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).map((p) => ({
          ...p,
          options: p.options.map((o) => ({ id: o.id, label: o.label, vote_count: o.votes.length })),
          myOption: p.options.find((o) => o.votes.includes(uid()))?.id ?? null,
        })));
      },
      async vote(pollId, optionId) {
        requireUser();
        if (!isVotingEmailAllowed(state.user?.email, state.profile)) {
          throw new Error(`O e-mail "${state.user?.email}" não está habilitado para votar. Cadastre-se comprovando vínculo com Eng. de Controle e Automação.`);
        }
        const p = db.polls.find((x) => x.id === pollId);
        if (!p.is_open) throw new Error("Enquete encerrada.");
        if (p.options.some((o) => o.votes.includes(uid()))) throw new Error("Você já votou aqui.");
        p.options.find((o) => o.id === optionId).votes.push(uid());
        save(); return delay();
      },
      async create(question, options) {
        db.polls.push({ id: nextId(), question, is_open: true, created_at: new Date().toISOString(),
          options: options.map((label) => ({ id: nextId(), label, votes: [] })) });
        save(); return delay();
      },
      async setOpen(id, is_open) { db.polls.find((x) => x.id === id).is_open = is_open; save(); return delay(); },
    },

    topics: {
      async list() {
        return delay(db.topics.filter(visible)
          .sort((a, b) => b.last_activity.localeCompare(a.last_activity))
          .map((t) => ({ ...t, ...authorOf(t.user_id), mine: t.user_id === uid(),
            reply_count: db.replies.filter((r) => r.topic_id === t.id).length })));
      },
      async get(id) {
        const t = db.topics.find((x) => x.id === id);
        if (!t || !visible(t)) return delay(null);
        return delay({
          topic: { ...t, ...authorOf(t.user_id), mine: t.user_id === uid() },
          replies: db.replies.filter((r) => r.topic_id === id && visible(r))
            .map((r) => ({ ...r, ...authorOf(r.user_id), mine: r.user_id === uid() })),
        });
      },
      async create(t) {
        requireUser();
        const id = nextId(), ts = new Date().toISOString();
        db.topics.push({ id, user_id: uid(), hidden: false, created_at: ts, last_activity: ts, ...t });
        save(); return delay(id);
      },
      async reply(topic_id, body) {
        requireUser();
        const ts = new Date().toISOString();
        db.replies.push({ id: nextId(), topic_id, user_id: uid(), body, hidden: false, created_at: ts });
        db.topics.find((x) => x.id === topic_id).last_activity = ts;
        save(); return delay();
      },
      async update(id, patch) { Object.assign(db.topics.find((x) => x.id === id), patch); save(); return delay(); },
      async updateReply(id, patch) { Object.assign(db.replies.find((x) => x.id === id), patch); save(); return delay(); },
    },

    announcements: {
      async list() { return delay(db.announcements.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))); },
      async create(a) { db.announcements.push({ id: nextId(), created_at: new Date().toISOString(), ...a }); save(); return delay(); },
      async update(id, patch) {
        const item = db.announcements.find(x => String(x.id) === String(id));
        if (item) Object.assign(item, patch);
        save(); return delay(item);
      },
      async remove(id) {
        db.announcements = db.announcements.filter(x => String(x.id) !== String(id));
        save(); return delay();
      }
    },

    events: {
      async list() {
        return delay(db.events.slice().sort((a, b) => (a.data || a.starts_at || '').localeCompare(b.data || b.starts_at || '')));
      },
      async listAll() {
        return delay(db.events.slice().sort((a, b) => (a.data || a.starts_at || '').localeCompare(b.data || b.starts_at || '')));
      },
      async create(e) {
        const item = { id: nextId(), created_at: new Date().toISOString(), ...e };
        db.events.push(item);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "CRIAR_EVENTO", target: e.titulo || e.title, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async update(id, patch) {
        const item = db.events.find(x => String(x.id) === String(id));
        if (item) Object.assign(item, patch);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EDITAR_EVENTO", target: item?.titulo || id, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async remove(id) {
        const item = db.events.find(x => String(x.id) === String(id));
        db.events = db.events.filter(x => String(x.id) !== String(id));
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EXCLUIR_EVENTO", target: item?.titulo || id, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay();
      }
    },

    products: {
      async list() {
        return delay(db.products.slice());
      },
      async get(id) {
        return delay(db.products.find(x => String(x.id) === String(id)) || null);
      },
      async create(p) {
        const item = { id: p.id || ("prod-" + nextId()), ...p };
        db.products.push(item);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "CRIAR_PRODUTO", target: p.nome, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async update(id, patch) {
        const item = db.products.find(x => String(x.id) === String(id));
        if (item) Object.assign(item, patch);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EDITAR_PRODUTO", target: item?.nome || id, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async remove(id) {
        const item = db.products.find(x => String(x.id) === String(id));
        db.products = db.products.filter(x => String(x.id) !== String(id));
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EXCLUIR_PRODUTO", target: item?.nome || id, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay();
      }
    },

    orders: {
      async list() {
        return delay((db.orders || []).slice());
      },
      async create(o) {
        db.orders ??= [];
        const item = { id: nextId(), created_at: new Date().toISOString(), status: 'pendente', ...o };
        db.orders.push(item);
        save(); return delay(item);
      },
      async updateStatus(id, status) {
        const ord = (db.orders || []).find(x => String(x.id) === String(id));
        if (ord) ord.status = status;
        save(); return delay();
      }
    },

    auditLogs: {
      async list() {
        return delay((db.auditLogs || []).slice(0, 100));
      },
      async log(action, target, details = "") {
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action, target, details, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString(), ip: "127.0.0.1" });
        save(); return delay();
      }
    },

    faqs: {
      async list() { return delay((db.faqs || []).slice()); },
      async create(f) {
        const item = { id: nextId(), created_at: new Date().toISOString(), ...f };
        db.faqs ??= [];
        db.faqs.push(item);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "CRIAR_FAQ", target: f.pergunta, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async update(id, patch) {
        const item = (db.faqs || []).find(x => String(x.id) === String(id));
        if (item) Object.assign(item, patch);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EDITAR_FAQ", target: item?.pergunta || id, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async remove(id) {
        const item = (db.faqs || []).find(x => String(x.id) === String(id));
        db.faqs = (db.faqs || []).filter(x => String(x.id) !== String(id));
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EXCLUIR_FAQ", target: item?.pergunta || id, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay();
      }
    },

    internships: {
      async list() {
        return delay((db.internships || []).slice().sort((a,b) => (b.created_at || '').localeCompare(a.created_at || '')));
      },
      async create(v) {
        const item = { id: nextId(), created_at: new Date().toISOString(), status: 'ativa', ...v };
        db.internships ??= [];
        db.internships.unshift(item);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "CRIAR_VAGA_ESTAGIO", target: `${v.titulo} (${v.empresa})`, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async update(id, patch) {
        const item = (db.internships || []).find(x => String(x.id) === String(id));
        if (item) Object.assign(item, patch);
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EDITAR_VAGA_ESTAGIO", target: `${item?.titulo || id}`, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay(item);
      },
      async remove(id) {
        const item = (db.internships || []).find(x => String(x.id) === String(id));
        db.internships = (db.internships || []).filter(x => String(x.id) !== String(id));
        db.auditLogs ??= [];
        db.auditLogs.unshift({ id: nextId(), action: "EXCLUIR_VAGA_ESTAGIO", target: `${item?.titulo || id}`, actor: state.profile?.display_name || 'Gestor CA', created_at: new Date().toISOString() });
        save(); return delay();
      }
    },

    getApprovedAdmins() {
      const configAdmins = CONFIG.APPROVED_ADMIN_EMAILS || [];
      const dbAdmins = db.approvedAdmins || [];
      return Array.from(new Set([...configAdmins, ...dbAdmins]));
    },
    isApprovedAdmin(email) {
      return isUserAdmin(email);
    },
    async electAdmin(email, studentName = "") {
      requireUser();
      if (!state.isAdmin) throw new Error("Apenas membros ativos da diretoria podem eleger ou aprovar administradores.");
      const clean = String(email).trim().toLowerCase();
      db.approvedAdmins ??= [];
      if (!db.approvedAdmins.includes(clean)) {
        db.approvedAdmins.push(clean);
      }
      db.auditLogs ??= [];
      db.auditLogs.unshift({
        id: nextId(),
        action: "ELEGER_GESTOR_DIRETORIA",
        target: studentName ? `${studentName} (${clean})` : clean,
        actor: state.profile?.display_name || state.user?.email || 'Diretoria E(CA)²',
        created_at: new Date().toISOString()
      });
      save();
      loadSession();
      return delay(true);
    },
    async revokeAdmin(email, studentName = "") {
      requireUser();
      if (!state.isAdmin) throw new Error("Apenas membros ativos da diretoria podem revogar privilégios administrativos.");
      const clean = String(email).trim().toLowerCase();
      db.approvedAdmins = (db.approvedAdmins || []).filter(e => e.toLowerCase() !== clean);
      db.auditLogs ??= [];
      db.auditLogs.unshift({
        id: nextId(),
        action: "REVOGAR_GESTOR_DIRETORIA",
        target: studentName ? `${studentName} (${clean})` : clean,
        actor: state.profile?.display_name || state.user?.email || 'Diretoria E(CA)²',
        created_at: new Date().toISOString()
      });
      save();
      loadSession();
      return delay(true);
    },

    academic: {
      async get() {
        if (!state.user) {
          const guest = localStorage.getItem("eca2_academic_guest");
          return delay(guest ? JSON.parse(guest) : {
            ppc: "2024",
            completedCodes: [],
            transcriptRawText: "",
            plannedCodes: [],
            updated_at: null
          });
        }
        const p = state.profile || {};
        return delay(p.academic || {
          ppc: "2024",
          completedCodes: [],
          transcriptRawText: "",
          plannedCodes: [],
          updated_at: null
        });
      },
      async save(academicData) {
        if (!state.user) {
          const guest = {
            ...academicData,
            updated_at: new Date().toISOString()
          };
          localStorage.setItem("eca2_academic_guest", JSON.stringify(guest));
          return delay(guest);
        }
        const currentProf = state.profile || {};
        const updatedAcademic = {
          ...(currentProf.academic || {}),
          ...academicData,
          updated_at: new Date().toISOString()
        };
        if (state.user && db.users[uid()]) {
          db.users[uid()].academic = updatedAcademic;
          save();
        }
        state.profile = { ...(state.profile || {}), academic: updatedAcademic };
        emit();
        return delay(updatedAcademic);
      }
    },

    offerings: {
      async get() {
        db.courseOfferings ??= { ...DEFAULT_COURSE_OFFERINGS };
        return delay(JSON.parse(JSON.stringify(db.courseOfferings)));
      },
      async save(offeringData) {
        requireUser();
        if (!state.isAdmin) throw new Error("Apenas administradores podem alterar a oferta semestral.");
        db.courseOfferings = {
          ...offeringData,
          updated_at: new Date().toISOString(),
          updated_by: state.profile?.display_name || state.user?.email || "Diretoria E(CA)²"
        };
        db.auditLogs ??= [];
        db.auditLogs.unshift({
          id: nextId(),
          action: "PUBLICAR_OFERTA_SEMESTRAL",
          target: offeringData.semester || "Oferta Semestral",
          actor: state.profile?.display_name || state.user?.email || "Diretoria E(CA)²",
          details: `${(offeringData.courses || []).filter(c => c.ativo).length} cadeiras ativas ofertadas.`,
          created_at: new Date().toISOString()
        });
        save();
        return delay(db.courseOfferings);
      },
      async toggleCourse(code, ativo) {
        requireUser();
        if (!state.isAdmin) throw new Error("Apenas administradores podem gerenciar disciplinas.");
        db.courseOfferings ??= { ...DEFAULT_COURSE_OFFERINGS };
        const c = (db.courseOfferings.courses || []).find(x => x.code === code);
        if (c) c.ativo = ativo;
        save();
        return delay(c);
      }
    },

    getAuth() {
      return { ...state };
    },
  };
}

/* ===================================================================== */
export async function createStore() {
  if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
    try {
      // Teste de conexão prévio com timeout rápido de 2s
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 2000);
      const ping = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/`, {
        headers: { apikey: CONFIG.SUPABASE_ANON_KEY },
        signal: ctrl.signal
      });
      clearTimeout(tid);
      if (ping.ok || ping.status === 401 || ping.status === 200) {
        return await createSupabaseStore();
      }
    } catch (e) {
      console.warn("Supabase indisponível (" + e.message + "). Ativando Modo Demonstração com persistência local.");
    }
  }
  return createDemoStore();
}
