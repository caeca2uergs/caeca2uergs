/**
 * Conteúdo estático do site (curso, CA, FAQ).
 * Informações do curso baseadas na página oficial da UERGS – confirme
 * sempre no PPC vigente antes de publicar.
 */
export const CURSO = {
  nome: "Engenharia de Controle e Automação",
  grau: "Bacharelado",
  modalidade: "Presencial (com até 40% EaD em componentes autorizados - Res. CONEPE 020/2021)",
  unidade: "Campus Central Porto Alegre – Prédio Washington Luiz, 675, Centro Histórico",
  turno: "Vespertino/Noturno (17h00 às 22h30, sábados pela manhã e 1 tarde por módulo)",
  duracao: "10 semestres letivos (mínimo 5 anos · máximo 10 anos / 20 módulos)",
  cargaHoraria: "4.015 horas · 235 créditos",
  vagasAnuais: "50 vagas (Ingresso via SISU/ENEM e Processo Seletivo Próprio UERGS)",
  resolucaoVigente: "Resolução CONEPE nº 016/2023 (Revisão 003 de 14/12/2023)",
  resolucaoAnterior: "Resolução CONEPE nº 037/2019 (Revisão 002 de 06/12/2019)",
  objetivo:
    "Formar engenheiras e engenheiros de Controle e Automação com sólida capacitação científica, tecnológica e humanística, habilitados a projetar, modelar, integrar e otimizar processos produtivos industriais, robótica, redes inteligentes e sistemas automatizados, aliando inovação tecnológica à sustentabilidade social e ambiental.",
  perfilEgresso:
    "Profissional com capacidade sistêmica de integrar mecânica de precisão, eletrônica de potência, controle dinâmico e computação aplicada. Atua na formulação e execução de projetos de automação industrial, robótica, sistemas ciber-físicos, internet das coisas industrial (IIoT) e gestão da inovação tecnológica com ética e compromisso socioeconômico com o Rio Grande do Sul.",
  distribuicaoHoraria: [
    { categoria: "Formação Específica", horas: 1260, percentual: "31,38%", cor: "cyan" },
    { categoria: "Formação Básica", horas: 990, percentual: "24,66%", cor: "blue" },
    { categoria: "Formação Profissional", horas: 990, percentual: "24,66%", cor: "amber" },
    { categoria: "Curricularização da Extensão", horas: 410, percentual: "10,21%", cor: "emerald" },
    { categoria: "Estágio Supervisionado", horas: 165, percentual: "4,11%", cor: "violet" },
    { categoria: "Disciplinas Eletivas", horas: 120, percentual: "2,99%", cor: "rose" },
    { categoria: "Atividades Complementares (AC)", horas: 80, percentual: "1,99%", cor: "slate" },
  ],
  modulos: [
    {
      numero: 1,
      titulo: "1º Módulo",
      chTotal: "300h",
      creditos: 20,
      foco: "Fundamentos das Ciências Exatas e Introdução à Engenharia",
      disciplinas: [
        { codigo: "DESTEC", nome: "Desenho Técnico 1", ch: "60h", cr: 4, tipo: "Básica", pre: "Nenhum", ead: "Até 40% EaD" },
        { codigo: "INTCON", nome: "Introdução ao Controle e Automação", ch: "60h", cr: 4, tipo: "Específica", pre: "Nenhum", ead: "Até 40% EaD" },
        { codigo: "CALC-1", nome: "Cálculo 1", ch: "60h", cr: 4, tipo: "Básica", pre: "Nenhum", ead: "Até 40% EaD" },
        { codigo: "ALGPRO", nome: "Algoritmos e Programação", ch: "60h", cr: 4, tipo: "Básica", pre: "Nenhum", ead: "Até 40% EaD" },
        { codigo: "ALGEOM", nome: "Álgebra Linear e Geometria Analítica", ch: "60h", cr: 4, tipo: "Básica", pre: "Nenhum", ead: "Até 40% EaD" },
      ],
    },
    {
      numero: 2,
      titulo: "2º Módulo",
      chTotal: "360h",
      creditos: 24,
      foco: "Mecânica Inicial, Eletrônica Digital e Ferramentas CAD",
      disciplinas: [
        { codigo: "DESCAD", nome: "Desenho Técnico 2 - Ferramentas CAD", ch: "60h", cr: 4, tipo: "Básica", pre: "DESTEC", ead: "Até 40% EaD" },
        { codigo: "ELEDIG", nome: "Eletrônica Digital", ch: "60h", cr: 4, tipo: "Profissional", pre: "INTCON", ead: "Até 40% EaD" },
        { codigo: "CALC-2", nome: "Cálculo 2", ch: "60h", cr: 4, tipo: "Básica", pre: "CALC-1 e ALGEOM", ead: "Até 40% EaD" },
        { codigo: "PROFUN", nome: "Programação em Funções", ch: "60h", cr: 4, tipo: "Profissional", pre: "ALGPRO", ead: "Até 40% EaD" },
        { codigo: "QUIGER", nome: "Química Geral", ch: "60h", cr: 4, tipo: "Básica", pre: "Nenhum", ead: "Até 40% EaD" },
        { codigo: "FIS-1", nome: "Física 1 - Mecânica", ch: "60h", cr: 4, tipo: "Básica", pre: "CALC-1 e ALGEOM", ead: "Até 40% EaD" },
      ],
    },
    {
      numero: 3,
      titulo: "3º Módulo",
      chTotal: "330h",
      creditos: 22,
      foco: "Eletromagnetismo, Microprocessadores e Modelagem Matemática",
      disciplinas: [
        { codigo: "MICPRO", nome: "Microprocessadores", ch: "60h", cr: 4, tipo: "Específica", pre: "PROFUN e ELEDIG", ead: "Até 40% EaD" },
        { codigo: "EQUDIF", nome: "Equações Diferenciais", ch: "60h", cr: 4, tipo: "Básica", pre: "CALC-2", ead: "Até 40% EaD" },
        { codigo: "PROGOO", nome: "Programação Orientada a Objeto", ch: "60h", cr: 4, tipo: "Profissional", pre: "PROFUN", ead: "Até 40% EaD" },
        { codigo: "FIS-2", nome: "Física 2 - Eletromagnetismo", ch: "60h", cr: 4, tipo: "Básica", pre: "FIS-1 e CALC-2", ead: "Até 40% EaD" },
        { codigo: "ESTAT", nome: "Probabilidade e Estatística", ch: "60h", cr: 4, tipo: "Básica", pre: "CALC-1", ead: "Até 40% EaD" },
        { codigo: "METCIEN", nome: "Metodologia Científica", ch: "30h", cr: 2, tipo: "Básica", pre: "Nenhum", ead: "Pode ser 100% EaD" },
      ],
    },
    {
      numero: 4,
      titulo: "4º Módulo",
      chTotal: "360h",
      creditos: 24,
      foco: "Circuitos Elétricos, Metrologia e Ciência dos Materiais",
      disciplinas: [
        { codigo: "METR", nome: "Metrologia", ch: "60h", cr: 4, tipo: "Profissional", pre: "FIS-1 e DESCAD", ead: "Até 40% EaD" },
        { codigo: "CIRELE-1", nome: "Circuitos Elétricos 1", ch: "60h", cr: 4, tipo: "Profissional", pre: "FIS-2", ead: "Até 40% EaD" },
        { codigo: "METNUM", nome: "Métodos Numéricos", ch: "60h", cr: 4, tipo: "Básica", pre: "EQUDIF", ead: "Até 40% EaD" },
        { codigo: "CONF", nome: "Confiabilidade", ch: "60h", cr: 4, tipo: "Específica", pre: "ESTAT", ead: "Até 40% EaD" },
        { codigo: "ENGMAT", nome: "Engenharia dos Materiais", ch: "60h", cr: 4, tipo: "Profissional", pre: "QUIGER e FIS-2", ead: "Até 40% EaD" },
        { codigo: "FISAUT", nome: "Física para Automação", ch: "60h", cr: 4, tipo: "Específica", pre: "FIS-2", ead: "Até 40% EaD" },
      ],
    },
    {
      numero: 5,
      titulo: "5º Módulo",
      chTotal: "360h",
      creditos: 24,
      foco: "Eletrônica Analógica, Hidráulica/Pneumática e Mecânica dos Sólidos",
      disciplinas: [
        { codigo: "CIRELE-2", nome: "Circuitos Elétricos 2", ch: "60h", cr: 4, tipo: "Profissional", pre: "CIRELE-1", ead: "Até 40% EaD" },
        { codigo: "ELETANA", nome: "Eletrônica Analógica", ch: "60h", cr: 4, tipo: "Profissional", pre: "CIRELE-1", ead: "Até 40% EaD" },
        { codigo: "HIDPNE", nome: "Hidráulica e Pneumática", ch: "60h", cr: 4, tipo: "Específica", pre: "CIRELE-1", ead: "Até 40% EaD" },
        { codigo: "MECSOL", nome: "Mecânica dos Sólidos", ch: "60h", cr: 4, tipo: "Básica", pre: "ENGMAT", ead: "Até 40% EaD" },
        { codigo: "PROIND", nome: "Processos Industriais e de Fabricação", ch: "60h", cr: 4, tipo: "Profissional", pre: "ENGMAT", ead: "Até 40% EaD" },
        { codigo: "TERMOD", nome: "Termodinâmica", ch: "60h", cr: 4, tipo: "Profissional", pre: "EQUDIF e FISAUT", ead: "Até 40% EaD" },
      ],
    },
    {
      numero: 6,
      titulo: "6º Módulo",
      chTotal: "360h",
      creditos: 24,
      foco: "Eletrônica de Potência, Instrumentação, Instalações e CNC",
      disciplinas: [
        { codigo: "ELETPOT", nome: "Eletrônica de Potência", ch: "60h", cr: 4, tipo: "Profissional", pre: "CIRELE-2 e ELETANA", ead: "Até 40% EaD" },
        { codigo: "INSTR", nome: "Instrumentação", ch: "60h", cr: 4, tipo: "Profissional", pre: "METR e ELETANA", ead: "Até 40% EaD" },
        { codigo: "INSTELE", nome: "Instalações Elétricas", ch: "60h", cr: 4, tipo: "Profissional", pre: "CIRELE-2", ead: "Até 40% EaD" },
        { codigo: "FETRANS-MF", nome: "Fenômenos de Transporte 1 - Mecânica dos Fluídos", ch: "60h", cr: 4, tipo: "Básica", pre: "TERMOD", ead: "Até 40% EaD" },
        { codigo: "CNC", nome: "Controle Numérico Computadorizado", ch: "60h", cr: 4, tipo: "Específica", pre: "PROIND", ead: "Até 40% EaD" },
        { codigo: "RESMAT", nome: "Resistência dos Materiais", ch: "60h", cr: 4, tipo: "Específica", pre: "MECSOL", ead: "Até 40% EaD" },
      ],
    },
    {
      numero: 7,
      titulo: "7º Módulo",
      chTotal: "360h",
      creditos: 24,
      foco: "CLP, Robótica, Redes Industriais e Modelagem Dinâmica",
      disciplinas: [
        { codigo: "CLP", nome: "Controladores Lógicos Programáveis", ch: "60h", cr: 4, tipo: "Específica", pre: "INSTR, MICPRO e HIDPNE", ead: "Até 40% EaD" },
        { codigo: "MAQELE", nome: "Máquinas Elétricas", ch: "60h", cr: 4, tipo: "Profissional", pre: "CIRELE-1 e FIS-2", ead: "Até 40% EaD" },
        { codigo: "ROBOT", nome: "Robótica", ch: "60h", cr: 4, tipo: "Específica", pre: "INSTR", ead: "Até 40% EaD" },
        { codigo: "FETRANS-CM", nome: "Fenômenos de Transporte 2 - Calor e Massa", ch: "60h", cr: 4, tipo: "Básica", pre: "FETRANS-MF", ead: "Até 40% EaD" },
        { codigo: "REDES", nome: "Redes Industriais de Comunicação", ch: "60h", cr: 4, tipo: "Específica", pre: "INSTR", ead: "Até 40% EaD" },
        { codigo: "MODSIS", nome: "Modelagem de Sistemas Dinâmicos", ch: "60h", cr: 4, tipo: "Específica", pre: "EQUDIF e PROIND", ead: "Até 40% EaD" },
      ],
    },
    {
      numero: 8,
      titulo: "8º Módulo",
      chTotal: "360h",
      creditos: 24,
      foco: "Controle Automático, Acionamentos, SCADA e Sinais Digitais",
      disciplinas: [
        { codigo: "ECONENG", nome: "Economia para Engenharia", ch: "30h", cr: 2, tipo: "Básica", pre: "METNUM", ead: "Pode ser 100% EaD" },
        { codigo: "ACIONA", nome: "Acionamentos", ch: "60h", cr: 4, tipo: "Específica", pre: "ELETPOT e MAQELE", ead: "Até 40% EaD" },
        { codigo: "SISSUP", nome: "Sistemas de Supervisão e Gerenciamento (SCADA)", ch: "60h", cr: 4, tipo: "Específica", pre: "REDES e CLP", ead: "Até 40% EaD" },
        { codigo: "CONSIS", nome: "Controle de Sistemas Dinâmicos", ch: "60h", cr: 4, tipo: "Específica", pre: "MODSIS e MICPRO", ead: "Até 40% EaD" },
        { codigo: "SISCOND", nome: "Sinais e Controle Digitais", ch: "60h", cr: 4, tipo: "Específica", pre: "MODSIS e MICPRO", ead: "Até 40% EaD" },
        { codigo: "DESUN", nome: "Desenho Universal", ch: "30h", cr: 2, tipo: "Profissional", pre: "110 créditos", ead: "Pode ser 100% EaD" },
        { codigo: "ELET-1", nome: "Eletiva 1", ch: "60h", cr: 4, tipo: "Eletiva", pre: "A definir", ead: "Conforme oferta" },
      ],
    },
    {
      numero: 9,
      titulo: "9º Módulo",
      chTotal: "330h",
      creditos: 22,
      foco: "Inteligência Artificial, Automação da Manufatura e TCC 1",
      disciplinas: [
        { codigo: "ADMEMP", nome: "Administração e Empreendedorismo", ch: "30h", cr: 2, tipo: "Básica", pre: "ECONENG", ead: "Pode ser 100% EaD" },
        { codigo: "GESINOV", nome: "Gestão da Inovação", ch: "60h", cr: 4, tipo: "Básica", pre: "144 créditos", ead: "Pode ser 100% EaD" },
        { codigo: "CONMUL", nome: "Controle Multivariável", ch: "60h", cr: 4, tipo: "Específica", pre: "CONSIS", ead: "Até 40% EaD" },
        { codigo: "IA", nome: "Inteligência Artificial", ch: "60h", cr: 4, tipo: "Específica", pre: "PROGOO", ead: "Até 40% EaD" },
        { codigo: "AUTMAN", nome: "Automação da Manufatura", ch: "60h", cr: 4, tipo: "Específica", pre: "CNC", ead: "Até 40% EaD" },
        { codigo: "TCC1", nome: "Trabalho de Conclusão 1", ch: "60h", cr: 4, tipo: "Específica", pre: "168 créditos e METCIEN", ead: "Pode ser 100% EaD" },
      ],
    },
    {
      numero: 10,
      titulo: "10º Módulo",
      chTotal: "405h",
      creditos: 27,
      foco: "Integração de Sistemas, Gestão de Projetos, TCC 2 e Estágio",
      disciplinas: [
        { codigo: "INTSIS", nome: "Integração de Sistemas de Automação", ch: "60h", cr: 4, tipo: "Específica", pre: "ROBOT, CLP, ACIONA e SISSUP", ead: "Até 40% EaD" },
        { codigo: "GESPRO", nome: "Gestão de Projetos", ch: "60h", cr: 4, tipo: "Profissional", pre: "GESINOV", ead: "Pode ser 100% EaD" },
        { codigo: "TCC2", nome: "Trabalho de Conclusão 2", ch: "60h", cr: 4, tipo: "Específica", pre: "TCC1", ead: "Presencial" },
        { codigo: "ESTSUP", nome: "Estágio Supervisionado", ch: "165h", cr: 11, tipo: "Estágio", pre: "168 créditos e METCIEN", ead: "Campo / Indústria" },
        { codigo: "ELET-2", nome: "Eletiva 2", ch: "60h", cr: 4, tipo: "Eletiva", pre: "A definir", ead: "Conforme oferta" },
      ],
    },
  ],
  extensao: {
    totalHoras: "410 horas (10,21% da Carga Horária Total)",
    baseLegal: "Resolução CNE/CES Nº 7/2018 (Meta 12 do PNE) e Resolução CONEPE UERGS Nº 019/2020",
    descricao:
      "A curricularização da extensão é uma das grandes inovações trazidas pelo PPC 2024. Pelo menos 10% da formação deve ser realizada em interação direta com a sociedade civil, aplicando o conhecimento de engenharia em escolas públicas, cooperativas, indústrias locais e iniciativas socioambientais.",
    componentes: [
      { codigo: "COMPEX", nome: "Componente Curricular de Extensão", ch: "60h", desc: "Ações de formação técnica comunitária orientadas por docentes." },
      { codigo: "PROJEXT-1", nome: "Projetos Integrados de Extensão 1", ch: "60h", desc: "Desenvolvimento de protótipos e soluções para demandas da comunidade." },
      { codigo: "PROJEXT-2", nome: "Projetos Integrados de Extensão 2", ch: "60h", desc: "Aplicação e implantação dos sistemas desenvolvidos em ambiente real." },
      { codigo: "ACE", nome: "Atividades Curriculares de Extensão", ch: "Até 120h", desc: "Projetos, cursos de extensão, oficinas e semanas acadêmicas registradas na PROEX." },
    ],
    papelDoCA:
      "O E(CA)² atua como ponte para a extensão: organizando minicursos abertos de robótica e Arduino para escolas públicas, hackathons comunitários e visitas técnicas solidárias onde os estudantes computam suas horas de ACE."
  },
  eletivas: [
    { codigo: "ESTDAD", nome: "Estrutura de Dados", ch: "60h", cr: 4, area: "Computação", pre: "ALGPRO" },
    { codigo: "MAQTER", nome: "Máquinas Térmicas", ch: "60h", cr: 4, area: "Física & Térmica", pre: "FETRANS-CM" },
    { codigo: "ENE-QE", nome: "Qualidade de Energia", ch: "45h", cr: 3, area: "Eletrônica & Energia", pre: "FIS-2" },
    { codigo: "GESPES", nome: "Gestão de Pessoas", ch: "60h", cr: 4, area: "Gestão & Humanas", pre: "ADMEMP" },
    { codigo: "MATFIN", nome: "Matemática Financeira", ch: "60h", cr: 4, area: "Matemática & Finanças", pre: "CALC-1" },
    { codigo: "PROTEX", nome: "Produção Textual", ch: "60h", cr: 4, area: "Comunicação & Humanas", pre: "Nenhum" },
    { codigo: "LIBRAS", nome: "Língua Brasileira de Sinais", ch: "60h", cr: 4, area: "Inclusão & Humanas", pre: "Nenhum" },
    { codigo: "INGBAS", nome: "Inglês Básico", ch: "30h", cr: 2, area: "Idiomas & Humanas", pre: "Nenhum" },
    { codigo: "INGINT", nome: "Inglês Intermediário", ch: "30h", cr: 2, area: "Idiomas & Humanas", pre: "INGBAS" },
  ],
  laboratorios: [
    {
      nome: "Laboratório de Eletrônica e Circuitos",
      icone: "⚡",
      equipamentos: "Osciloscópios digitais, geradores de funções, fontes reguladas DC de bancada, multímetros digitais, módulos didáticos analógicos/digitais (kits CEDEPE) e estações de solda.",
      disciplinas: "Circuitos Elétricos 1 e 2, Eletrônica Digital, Eletrônica Analógica e Instrumentação."
    },
    {
      nome: "Laboratório de Acionamentos, Controle e Automação",
      icone: "⚙️",
      equipamentos: "Bancadas didáticas Automatus (controle de nível, vazão e temperatura), planta didática SMAR ED302, kits MLAB, motores elétricos, inversores de frequência e acionamentos.",
      disciplinas: "Máquinas Elétricas, Eletrônica de Potência, Acionamentos e Controle de Sistemas Dinâmicos."
    },
    {
      nome: "Laboratório de Manufatura Integrada e Robótica",
      icone: "🦾",
      equipamentos: "Bancada Smart 4.0 Exxer, kits de pneumática e eletropneumática, manipulador robótico didático (Eshed Robotec) e projetos de expansão para célula CNC e robô de 6 eixos (Apêndice C do PPC).",
      disciplinas: "Hidráulica e Pneumática, Robótica, Controle Numérico Computadorizado (CNC) e Automação da Manufatura."
    },
    {
      nome: "Laboratório de Redes Industriais e CLPs",
      icone: "🎛️",
      equipamentos: "Bancadas com Controladores Lógicos Programáveis (CLPs Siemens S7-1200 e Altus DUO), IHMs industriais, módulos de E/S e protocolos de comunicação industrial (Profinet, Modbus).",
      disciplinas: "Controladores Lógicos Programáveis (CLP), Redes Industriais de Comunicação e Sistemas Supervisórios (SCADA)."
    },
    {
      nome: "Laboratório de Informática, Simulação e IA",
      icone: "💻",
      equipamentos: "Estações de trabalho equipadas com softwares de simulação matemática e controle (Scilab/Octave/MATLAB), CAD 2D/3D para engenharia, compiladores C/C++, Python e ambientes SCADA.",
      disciplinas: "Algoritmos, Desenho Técnico CAD, Modelagem de Sistemas Dinâmicos, Inteligência Artificial e Sinais Digitais."
    },
    {
      nome: "Laboratórios Básicos de Física e Química Geral",
      icone: "🧪",
      equipamentos: "Conjuntos para ensaios de mecânica, termodinâmica, eletromagnetismo e óptica (kits CEDEPE), vidrarias, balanças analíticas, capelas de exaustão química e ensaios de materiais.",
      disciplinas: "Física 1 (Mecânica), Física 2 (Eletromagnetismo), Física para Automação, Química Geral e Engenharia dos Materiais."
    }
  ],
  comparativoPPC: {
    resumo: "O curso de Engenharia de Controle e Automação da UERGS passou por importante modernização curricular aprovada pelo CONEPE, adequando-se às Diretrizes Curriculares Nacionais de Engenharia e à obrigatoriedade da curricularização de extensão.",
    pontos: [
      {
        aspecto: "Carga Horária Total",
        ppc2019: "3.765 horas e 243 créditos (currículo aprovado pela Res. CONEPE 037/2019).",
        ppc2024: "4.015 horas e 235 créditos (Res. CONEPE 016/2023 - vigente).",
        impacto: "Acréscimo de 250 horas para acomodar as metas federais de extensão universitária sem perda do núcleo de engenharia pesada."
      },
      {
        aspecto: "Curricularização da Extensão",
        ppc2019: "Atividades de extensão contavam esparsamente em horas complementares opcionais.",
        ppc2024: "410 horas obrigatórias (10,21% da CH total) em projetos e componentes integrados (COMPEX, PROJEXT, ACE).",
        impacto: "Garante contato direto dos futuros engenheiros com demandas reais da comunidade gaúcha desde os primeiros anos."
      },
      {
        aspecto: "Ensino a Distância (EaD)",
        ppc2019: "Previsão genérica de disciplinas a distância.",
        ppc2024: "Regulamentação expressa (Res. CONEPE 020/2021): até 40% em componentes teóricos presenciais e disciplinas 100% EaD específicas.",
        impacto: "Maior flexibilidade para alunos que trabalham no turno inverso, com preservação total das aulas de bancada presencial."
      },
      {
        aspecto: "Avanço Tecnológico & IA",
        ppc2019: "Foco predominante em mecatrônica fabril tradicional.",
        ppc2024: "Inclusão explícita de Inteligência Artificial, Gestão da Inovação, Confiabilidade e Integração de Sistemas Ciber-físicos.",
        impacto: "Alinhamento com a Indústria 4.0, IoT Industrial e modernização de dados."
      },
      {
        aspecto: "Tabela de Equivalências",
        ppc2019: "Equivalências com CST em Automação Industrial e Engenharias de 2014.",
        ppc2024: "Matriz detalhada de equivalência direta entre PPC 2019 e PPC 2024, além de intercâmbio de matérias com Eng. de Bioprocessos, Eng. de Energia e Eng. da Computação (Guaíba).",
        impacto: "Segurança jurídica e facilidade para quem migra de grade ou busca aproveitamento de disciplinas comuns."
      }
    ]
  },
  areas: [
    { icone: "🏭", titulo: "Automação Industrial & Manufatura", texto: "Projetos com CLPs de última geração, instrumentação analítica e redes industriais de alta velocidade em fábricas petroquímicas, metalmecânicas e alimentícias." },
    { icone: "🦾", titulo: "Robótica Industrial & Manipuladores", texto: "Programação e integração de robôs articulados, células de solda/paletização automatizadas, robôs móveis autônomos (AMRs) e visão computacional." },
    { icone: "🎛️", titulo: "Sistemas de Controle & Dinâmica", texto: "Modelagem matemática avançada, controle multivariável, sintonia de controladores PID adaptativos e controle ótimo de processos contínuos." },
    { icone: "📡", titulo: "Indústria 4.0, IIoT & SCADA", texto: "Arquiteturas SCADA, telemetria em nuvem, integração de sensores IoT industriais e análise de dados operacionais em tempo real." },
    { icone: "⚡", titulo: "Acionamentos & Eficiência Energética", texto: "Dimensionamento e controle vetorial de motores de alta eficiência, inversores de frequência em média/baixa tensão e transição energética." },
    { icone: "🚀", titulo: "Inteligência Artificial & Inovação", texto: "Aplicação de machine learning para manutenção preditiva, otimização de parâmetros de linha e desenvolvimento de produtos tecnológicos." },
  ],
  linkOficial: "https://www.uergs.edu.br",
};

export const PRINCIPIOS = [
  { icone: "🔓", titulo: "Aberto", texto: "Qualquer estudante do curso pode participar, propor e se candidatar." },
  { icone: "⚖️", titulo: "Apartidário", texto: "O E(CA)² representa o curso, não partidos ou grupos políticos." },
  { icone: "🔍", titulo: "Transparente", texto: "Atas, decisões e contas sempre públicas aqui no site." },
  { icone: "🆓", titulo: "Sem mensalidade", texto: "Ninguém é obrigado a contribuir. Toda arrecadação é voluntária." },
];

export const LINHA_DO_TEMPO = [
  { data: "Out", titulo: "Encontro & Integração", texto: "Recepção discente no refeitório, integração entre turmas e lançamento do portal acadêmico.", destaque: true },
  { data: "Nov", titulo: "Estruturação & Parcerias", texto: "Organização institucional e captação de oportunidades em editais e convênios industriais." },
  { data: "Dez", titulo: "Visita Técnica & Workshops", texto: "Programação de visitas industriais e oficinas de bancada com CLPs e sistemas supervisórios." },
  { data: "2027/1", titulo: "Semana Acadêmica de Automação", texto: "Ciclo de palestras técnicas, feira de projetos discentes e workshops práticos." },
];

export const FAQ = [
  { p: "O que é um Centro Acadêmico?", r: "É a entidade que representa os estudantes de um curso perante a coordenação, o colegiado e a universidade. O direito de organizar o CA é garantido pela Lei nº 7.395/1985." },
  { p: "Preciso pagar alguma coisa?", r: "Não. O E(CA)² é mantido de forma voluntária e não cobra qualquer mensalidade dos estudantes." },
  { p: "Como funciona a Diretoria do E(CA)²?", r: "A Diretoria do Centro Acadêmico atua na representação discente junto à coordenação e conselhos da UERGS, organização de eventos, visitas técnicas e suporte integral aos estudantes." },
  { p: "Posso colaborar nas atividades do CA?", r: "Sim! Qualquer estudante do curso pode somar forças pelo portal para ajudar nos eventos, visitas técnicas, minicursos e comunicação." },
  { p: "O CA tem partido político?", r: "Não. O E(CA)² é estritamente apartidário e representa todos os discentes de Engenharia de Controle e Automação." },
  { p: "Como posso enviar sugestões ou demandas?", r: "Use o mural de demandas e sugestões, o fórum aberto aqui no site ou entre em contato pelo canal de atendimento do Centro Acadêmico." },
  { p: "Por que o nome E(CA)²?", r: "ECA de Engenharia de Controle e Automação, ao quadrado: E(CA)² expressa controle × automação e a potência da união de todos os estudantes." },
  { p: "Como meus dados são usados?", r: "Apenas para organização acadêmica e suporte ao estudante conforme a LGPD (Lei nº 13.709/2018). Dados cadastrais são tratados com total privacidade." },
];

export const CATEGORIAS_SUGESTAO = ["Ensino", "Infraestrutura", "Eventos", "Estágios & Carreira", "Comunicação", "Outros"];
export const CATEGORIAS_FORUM = ["Dúvidas do curso", "Disciplinas", "Estágios & Vagas", "Projetos", "CA E(CA)²", "Off-topic"];
export const STATUS_SUGESTAO = {
  nova: { label: "Nova", cor: "slate" },
  analise: { label: "Em análise", cor: "amber" },
  encaminhada: { label: "Encaminhada", cor: "cyan" },
  concluida: { label: "Concluída", cor: "green" },
};

/**
 * Catálogo Oficial de Utensílios e Produtos da Lojinha E(CA)²
 */
export const PRODUTOS_SHOP = [
  {
    id: "copo-termico",
    categoria: "Utensílios",
    nome: "Copo Térmico Inox a Vácuo E(CA)² 500ml",
    preco: "R$ 68,00",
    precoNum: 68.0,
    foto: "img/shop_copo_termico.jpg",
    destaque: true,
    tag: "Gravação a Laser",
    permitePersonalizacao: true,
    tipoPersonalizacao: "Gravação a Laser de Fibra Indelével",
    taxaPersonalizacao: 5.0,
    taxaPersonalizacaoTexto: "+ R$ 5,00",
    placeholderPersonalizacao: "Ex: WILLIAN SANTOS - 2026/1",
    maxCaracteresPersonalizacao: 26,
    posicoesPersonalizacao: [
      { id: "frente", label: "Frente (Abaixo do Brasão)" },
      { id: "verso", label: "Verso (Centralizado)" },
      { id: "vertical", label: "Lateral Vertical" }
    ],
    fontesDisponiveis: [
      { id: "mono", label: "Técnica (JetBrains Mono)", family: "'JetBrains Mono', monospace" },
      { id: "sans", label: "Moderna (Inter)", family: "'Inter', sans-serif" },
      { id: "tech", label: "Futurista (Space Grotesk)", family: "'Space Grotesk', sans-serif" }
    ],
    sugestoesRapidas: ["SEU NOME", "NOME · TURMA 2026", "ENG. AUTOMAÇÃO", "E(CA)² UERGS"],
    descricao: "Aço inoxidável 304 com parede dupla isolada a vácuo, acabamento preto fosco acetinado e gravação a laser permanente do logotipo E(CA)² Engenharia de Controle e Automação - UERGS e trilhas de circuito. Mantém bebidas geladas por até 12h ou café quente por 6h.",
    especificacoes: [
      "Capacidade: 500 ml",
      "Material: Aço Inoxidável 304 (Livre de BPA)",
      "Gravação: Laser de fibra indelével de altíssima precisão",
      "Tampa hermética com vedação de silicone e abridor embutido",
      "Seguro para uso em laboratório com proteção antiqueda"
    ]
  },
  {
    id: "caneca-lab",
    categoria: "Utensílios",
    nome: "Caneca de Cerâmica Lab & Café E(CA)² 350ml",
    preco: "R$ 38,00",
    precoNum: 38.0,
    foto: "img/shop_caneca_lab.jpg",
    destaque: true,
    tag: "Café do Engenheiro",
    permitePersonalizacao: true,
    tipoPersonalizacao: "Sublimação Térmica com Nome no Verso",
    taxaPersonalizacao: 4.0,
    taxaPersonalizacaoTexto: "+ R$ 4,00",
    placeholderPersonalizacao: "Ex: SEU NOME / APELIDO",
    maxCaracteresPersonalizacao: 22,
    posicoesPersonalizacao: [
      { id: "verso", label: "Verso da Caneca" },
      { id: "frente", label: "Abaixo da Engrenagem" }
    ],
    fontesDisponiveis: [
      { id: "mono", label: "Técnica (JetBrains Mono)", family: "'JetBrains Mono', monospace" },
      { id: "sans", label: "Moderna (Inter)", family: "'Inter', sans-serif" },
      { id: "tech", label: "Futurista (Space Grotesk)", family: "'Space Grotesk', sans-serif" }
    ],
    sugestoesRapidas: ["SEU NOME", "NOME · CAFEÍNA++", "ENG. DE CONTROLE"],
    descricao: "Cerâmica nobre preta fosca com estampa em alta definição neon ciano e âmbar, apresentando o brasão E(CA)², engrenagens e robótica da Engenharia de Controle e Automação UERGS. Perfeita para as maratonas de programação e bancada de ensaios.",
    especificacoes: [
      "Capacidade: 350 ml",
      "Material: Cerâmica premium fosca com interior vitrificado",
      "Estampa: Sublimação térmica ultra resistente a micro-ondas e lava-louças",
      "Pegada anatômica para conforto na bancada de ensaios"
    ]
  },
  {
    id: "moletom-neon",
    categoria: "Vestuário",
    nome: "Moletom Canguru E(CA)² Neon",
    preco: "R$ 139,90",
    precoNum: 139.9,
    foto: "img/shop_moletom.jpg",
    destaque: true,
    tag: "Lote Inaugural",
    tamanhos: ["P", "M", "G", "GG", "XGG"],
    permitePersonalizacao: true,
    tipoPersonalizacao: "Estampa de Nome/Apelido na Manga ou Costas",
    taxaPersonalizacao: 10.0,
    taxaPersonalizacaoTexto: "+ R$ 10,00",
    placeholderPersonalizacao: "Ex: SOBRENOME OU APELIDO",
    maxCaracteresPersonalizacao: 18,
    posicoesPersonalizacao: [
      { id: "manga", label: "Manga Direita" },
      { id: "costas", label: "Costas (Abaixo da Gola)" },
      { id: "peito", label: "Peito Direito" }
    ],
    fontesDisponiveis: [
      { id: "tech", label: "Futurista (Space Grotesk)", family: "'Space Grotesk', sans-serif" },
      { id: "mono", label: "Técnica (JetBrains Mono)", family: "'JetBrains Mono', monospace" }
    ],
    sugestoesRapidas: ["SEU SOBRENOME", "APELIDO", "TURMA 2026"],
    descricao: "Moletom flanelado 100% algodão de alta gramatura, com capuz forrado, bolso frontal canguru e estampa em silk-screen neon com brasão futurista e tipografia do E(CA)² Controle e Automação UERGS.",
    especificacoes: [
      "Tecido: 100% algodão flanelado 3 cabos (não encolhe)",
      "Estampa: Serigrafia de alta resistência ciano/laranja",
      "Tamanhos: P, M, G, GG, XGG (Modelagem unissex)"
    ]
  },
  {
    id: "camiseta-tecnica",
    categoria: "Vestuário",
    nome: "Camiseta Técnica do Curso (Dry-Fit)",
    preco: "R$ 49,90",
    precoNum: 49.9,
    foto: "img/shop_camiseta.jpg",
    destaque: true,
    tag: "Conforto Diário",
    tamanhos: ["P", "M", "G", "GG", "XGG"],
    permitePersonalizacao: true,
    tipoPersonalizacao: "Nome ou Apelido Estampado",
    taxaPersonalizacao: 5.0,
    taxaPersonalizacaoTexto: "+ R$ 5,00",
    placeholderPersonalizacao: "Ex: SEU NOME",
    maxCaracteresPersonalizacao: 20,
    posicoesPersonalizacao: [
      { id: "peito", label: "Peito Direito" },
      { id: "manga", label: "Manga Esquerda" }
    ],
    fontesDisponiveis: [
      { id: "sans", label: "Moderna (Inter)", family: "'Inter', sans-serif" },
      { id: "mono", label: "Técnica (JetBrains Mono)", family: "'JetBrains Mono', monospace" }
    ],
    sugestoesRapidas: ["SEU NOME", "TURMA 2026"],
    descricao: "Camiseta preta leve e respirável com diagrama esquemático de malha de controle PID nas costas e logo minimalista no peito.",
    especificacoes: [
      "Tecido: Poliamida tecnológica Dry-Fit respirável (opção em algodão penteado 30.1)",
      "Gola reforçada com costura dupla",
      "Ideal para uso diário e visitas técnicas em indústrias"
    ]
  },
  {
    id: "kit-adesivos-regua",
    categoria: "DIY & Laboratório",
    nome: "Kit de Adesivos + Régua PCB de Engenheiro",
    preco: "R$ 24,00",
    precoNum: 24.0,
    foto: "img/shop_regua_pcb.jpg",
    destaque: true,
    tag: "Ferramenta de Bancada",
    permitePersonalizacao: false,
    descricao: "Régua técnica fabricada em fibra de vidro FR-4 (placa de circuito impresso real) de 15cm com gabarito de componentes SMD, tamanhos de trilhas (AWG/mils) e pinouts, mais pack com 6 adesivos em vinil laminado à prova d'água.",
    especificacoes: [
      "Régua em PCB FR-4 com acabamento de ouro químico ENIG",
      "Pack com 6 adesivos vinílicos automotivos cortados a laser",
      "Compatível com notebooks, estojos e caixas organizadoras"
    ]
  }
];

/**
 * Acervo de Documentos Oficiais, Estatutos e Editais (PDFs para Download e Leitura)
 */
export const DOCUMENTOS_OFICIAIS = [
  {
    id: "ppc-2024-vigente",
    categoria: "Projeto Pedagógico de Curso",
    titulo: "PPC Engenharia de Controle e Automação 2024 (Vigente)",
    arquivo: "pdf/PPC_Controle_Automacao_2024_Vigente.pdf",
    tamanho: "3.4 MB",
    paginas: "Resolução CONEPE 016/2023 · 305 páginas",
    icone: "📘",
    destaque: true,
    tag: "Grade Vigente",
    descricao: "Projeto Pedagógico do Curso oficial aprovado pela Resolução CONEPE nº 016/2023 (Revisão 003 de 14/12/2023). Contém matriz curricular de 4.015h (235 créditos), 410h de curricularização da extensão (10,21%), ementas dos 10 módulos, infraestrutura dos laboratórios e normas de equivalência.",
  },
  {
    id: "ppc-2019-antigo",
    categoria: "Projeto Pedagógico de Curso",
    titulo: "PPC Engenharia de Controle e Automação 2019 (Histórico)",
    arquivo: "pdf/PPC_Controle_Automacao_2019_Antigo.pdf",
    tamanho: "3.7 MB",
    paginas: "Resolução CONEPE 037/2019 · 233 páginas",
    icone: "📙",
    destaque: true,
    tag: "Grade Anterior",
    descricao: "Projeto Pedagógico do Curso anterior (Resolução CONEPE nº 037/2019, Revisão 002 de 06/12/2019) com carga horária de 3.765 horas (243 créditos). Documento indispensável para consulta de direitos adquiridos, transição curricular e tabela de equivalências entre cursos da UERGS.",
  },
  {
    id: "estatuto-eca2",
    categoria: "Estatuto & Regimento",
    titulo: "Estatuto Social do E(CA)² (2026)",
    arquivo: "pdf/Estatuto_ECA2_2026.pdf",
    tamanho: "415 KB",
    paginas: "Documento Estatutário Oficial · 7 páginas",
    icone: "📜",
    destaque: true,
    tag: "Estatuto Vigente",
    descricao: "Estatuto Social vigente regulamentando os objetivos, prerrogativas, representação discente, comissões técnicas e funcionamento do Centro Acadêmico de Engenharia de Controle e Automação da UERGS.",
  },
  {
    id: "estatuto-representacao",
    categoria: "Regulamento Estudantil",
    titulo: "Estatuto da Representação Discente de Controle e Automação",
    arquivo: "pdf/Estatuto_Representacao_Discente.pdf",
    tamanho: "371 KB",
    paginas: "Regimento da Representação Discente · 2 páginas",
    icone: "🏛️",
    destaque: true,
    tag: "Norma de Representação",
    descricao: "Regimento específico da Representação Discente de Engenharia de Controle e Automação da UERGS (18/04/2026). Define atribuições, deveres, eleições de representantes e atuação junto à coordenação e colegiados.",
  }
];

export const ARVORES_PPC = {
  "2024": {
    versao: "2024",
    rotulo: "PPC 2024 (Vigente)",
    resolucao: "Resolução CONEPE nº 016/2023 (Revisão 003 de 14/12/2023)",
    cargaHoraria: "4.015 horas · 235 créditos",
    destaqueExtensao: "410 horas obrigatórias de extensão universitária (10,21%)",
    statusBadge: "Grade Vigente",
    badgeCor: "cyan",
    semestres: [
      {
        semestre: 1,
        titulo: "1º Módulo",
        ch: "300h",
        disciplinas: [
          { codigo: "DESTEC", nome: "Desenho Técnico 1", ch: "60h", cr: 4, area: "mecanica", pre: [] },
          { codigo: "INTCON", nome: "Introdução ao Controle e Automação", ch: "60h", cr: 4, area: "controle", pre: [] },
          { codigo: "CALC-1", nome: "Cálculo 1", ch: "60h", cr: 4, area: "matematica", pre: [] },
          { codigo: "ALGPRO", nome: "Algoritmos e Programação", ch: "60h", cr: 4, area: "computacao", pre: [] },
          { codigo: "ALGEOM", nome: "Álgebra Linear e Geometria Analítica", ch: "60h", cr: 4, area: "matematica", pre: [] }
        ]
      },
      {
        semestre: 2,
        titulo: "2º Módulo",
        ch: "360h",
        disciplinas: [
          { codigo: "DESCAD", nome: "Desenho Técnico 2 - CAD", ch: "60h", cr: 4, area: "mecanica", pre: ["DESTEC"] },
          { codigo: "ELEDIG", nome: "Eletrônica Digital", ch: "60h", cr: 4, area: "eletronica", pre: ["INTCON"] },
          { codigo: "CALC-2", nome: "Cálculo 2", ch: "60h", cr: 4, area: "matematica", pre: ["CALC-1", "ALGEOM"] },
          { codigo: "PROFUN", nome: "Programação em Funções", ch: "60h", cr: 4, area: "computacao", pre: ["ALGPRO"] },
          { codigo: "QUIGER", nome: "Química Geral", ch: "60h", cr: 4, area: "fisica", pre: [] },
          { codigo: "FIS-1", nome: "Física 1 - Mecânica", ch: "60h", cr: 4, area: "fisica", pre: ["CALC-1", "ALGEOM"] }
        ]
      },
      {
        semestre: 3,
        titulo: "3º Módulo",
        ch: "330h",
        disciplinas: [
          { codigo: "MICPRO", nome: "Microprocessadores", ch: "60h", cr: 4, area: "eletronica", pre: ["PROFUN", "ELEDIG"] },
          { codigo: "EQUDIF", nome: "Equações Diferenciais", ch: "60h", cr: 4, area: "matematica", pre: ["CALC-2"] },
          { codigo: "PROGOO", nome: "Programação Orientada a Objetos", ch: "60h", cr: 4, area: "computacao", pre: ["PROFUN"] },
          { codigo: "FIS-2", nome: "Física 2 - Eletromagnetismo", ch: "60h", cr: 4, area: "fisica", pre: ["FIS-1", "CALC-2"] },
          { codigo: "ESTAT", nome: "Probabilidade e Estatística", ch: "60h", cr: 4, area: "matematica", pre: ["CALC-1"] },
          { codigo: "METCIEN", nome: "Metodologia Científica", ch: "30h", cr: 2, area: "humanas", pre: [] }
        ]
      },
      {
        semestre: 4,
        titulo: "4º Módulo",
        ch: "360h",
        disciplinas: [
          { codigo: "METR", nome: "Metrologia", ch: "60h", cr: 4, area: "controle", pre: ["FIS-1", "DESCAD"] },
          { codigo: "CIRELE-1", nome: "Circuitos Elétricos 1", ch: "60h", cr: 4, area: "eletronica", pre: ["FIS-2"] },
          { codigo: "METNUM", nome: "Métodos Numéricos", ch: "60h", cr: 4, area: "matematica", pre: ["EQUDIF"] },
          { codigo: "CONF", nome: "Confiabilidade", ch: "60h", cr: 4, area: "controle", pre: ["ESTAT"] },
          { codigo: "ENGMAT", nome: "Engenharia dos Materiais", ch: "60h", cr: 4, area: "mecanica", pre: ["QUIGER", "FIS-2"] },
          { codigo: "FISAUT", nome: "Física para Automação", ch: "60h", cr: 4, area: "fisica", pre: ["FIS-2"] }
        ]
      },
      {
        semestre: 5,
        titulo: "5º Módulo",
        ch: "360h",
        disciplinas: [
          { codigo: "CIRELE-2", nome: "Circuitos Elétricos 2", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-1"] },
          { codigo: "ELETANA", nome: "Eletrônica Analógica", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-1"] },
          { codigo: "HIDPNE", nome: "Hidráulica e Pneumática", ch: "60h", cr: 4, area: "controle", pre: ["CIRELE-1"] },
          { codigo: "MECSOL", nome: "Mecânica dos Sólidos", ch: "60h", cr: 4, area: "mecanica", pre: ["ENGMAT"] },
          { codigo: "PROIND", nome: "Processos Industriais e Fabricação", ch: "60h", cr: 4, area: "mecanica", pre: ["ENGMAT"] },
          { codigo: "TERMOD", nome: "Termodinâmica", ch: "60h", cr: 4, area: "fisica", pre: ["EQUDIF", "FISAUT"] }
        ]
      },
      {
        semestre: 6,
        titulo: "6º Módulo",
        ch: "360h",
        disciplinas: [
          { codigo: "ELETPOT", nome: "Eletrônica de Potência", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-2", "ELETANA"] },
          { codigo: "INSTR", nome: "Instrumentação", ch: "60h", cr: 4, area: "controle", pre: ["METR", "ELETANA"] },
          { codigo: "INSTELE", nome: "Instalações Elétricas", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-2"] },
          { codigo: "FETRANS-MF", nome: "Fenômenos de Transporte 1 - Fluídos", ch: "60h", cr: 4, area: "fisica", pre: ["TERMOD"] },
          { codigo: "CNC", nome: "CNC", ch: "60h", cr: 4, area: "mecanica", pre: ["PROIND"] },
          { codigo: "RESMAT", nome: "Resistência dos Materiais", ch: "60h", cr: 4, area: "mecanica", pre: ["MECSOL"] }
        ]
      },
      {
        semestre: 7,
        titulo: "7º Módulo",
        ch: "360h",
        disciplinas: [
          { codigo: "CLP", nome: "Controladores Lógicos Programáveis", ch: "60h", cr: 4, area: "controle", pre: ["INSTR", "MICPRO", "HIDPNE"] },
          { codigo: "MAQELE", nome: "Máquinas Elétricas", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-1", "FIS-2"] },
          { codigo: "ROBOT", nome: "Robótica", ch: "60h", cr: 4, area: "controle", pre: ["INSTR"] },
          { codigo: "FETRANS-CM", nome: "Fenômenos de Transporte 2 - Calor/Massa", ch: "60h", cr: 4, area: "fisica", pre: ["FETRANS-MF"] },
          { codigo: "REDES", nome: "Redes Industriais", ch: "60h", cr: 4, area: "controle", pre: ["INSTR"] },
          { codigo: "MODSIS", nome: "Modelagem de Sistemas Dinâmicos", ch: "60h", cr: 4, area: "controle", pre: ["EQUDIF", "PROIND"] }
        ]
      },
      {
        semestre: 8,
        titulo: "8º Módulo",
        ch: "360h",
        disciplinas: [
          { codigo: "ECONENG", nome: "Economia para Engenharia", ch: "30h", cr: 2, area: "humanas", pre: ["METNUM"] },
          { codigo: "ACIONA", nome: "Acionamentos", ch: "60h", cr: 4, area: "eletronica", pre: ["ELETPOT", "MAQELE"] },
          { codigo: "SISSUP", nome: "Supervisão e SCADA", ch: "60h", cr: 4, area: "controle", pre: ["REDES", "CLP"] },
          { codigo: "CONSIS", nome: "Controle de Sistemas Dinâmicos", ch: "60h", cr: 4, area: "controle", pre: ["MODSIS", "MICPRO"] },
          { codigo: "SISCOND", nome: "Sinais e Controle Digitais", ch: "60h", cr: 4, area: "controle", pre: ["MODSIS", "MICPRO"] },
          { codigo: "DESUN", nome: "Desenho Universal", ch: "30h", cr: 2, area: "humanas", pre: [], minCr: 110 },
          { codigo: "ELET-1", nome: "Eletiva 1", ch: "60h", cr: 4, area: "humanas", pre: [] }
        ]
      },
      {
        semestre: 9,
        titulo: "9º Módulo",
        ch: "330h",
        disciplinas: [
          { codigo: "ADMEMP", nome: "Administração e Empreendedorismo", ch: "30h", cr: 2, area: "humanas", pre: ["ECONENG"] },
          { codigo: "GESINOV", nome: "Gestão da Inovação", ch: "60h", cr: 4, area: "humanas", pre: [], minCr: 144 },
          { codigo: "CONMUL", nome: "Controle Multivariável", ch: "60h", cr: 4, area: "controle", pre: ["CONSIS"] },
          { codigo: "IA", nome: "Inteligência Artificial", ch: "60h", cr: 4, area: "computacao", pre: ["PROGOO"] },
          { codigo: "AUTMAN", nome: "Automação da Manufatura", ch: "60h", cr: 4, area: "controle", pre: ["CNC"] },
          { codigo: "TCC1", nome: "Trabalho de Conclusão 1", ch: "60h", cr: 4, area: "humanas", pre: ["METCIEN"], minCr: 168 }
        ]
      },
      {
        semestre: 10,
        titulo: "10º Módulo",
        ch: "405h",
        disciplinas: [
          { codigo: "INTSIS", nome: "Integração de Sistemas", ch: "60h", cr: 4, area: "controle", pre: ["ROBOT", "CLP", "ACIONA", "SISSUP"] },
          { codigo: "GESPRO", nome: "Gestão de Projetos", ch: "60h", cr: 4, area: "humanas", pre: ["GESINOV"] },
          { codigo: "TCC2", nome: "Trabalho de Conclusão 2", ch: "60h", cr: 4, area: "humanas", pre: ["TCC1"] },
          { codigo: "ESTSUP", nome: "Estágio Supervisionado", ch: "165h", cr: 11, area: "humanas", pre: ["METCIEN"], minCr: 168 },
          { codigo: "ELET-2", nome: "Eletiva 2", ch: "60h", cr: 4, area: "humanas", pre: [] }
        ]
      }
    ]
  },
  "2019": {
    versao: "2019",
    rotulo: "PPC 2019 (Histórico)",
    resolucao: "Resolução CONEPE nº 037/2019 (Revisão 002 de 06/12/2019)",
    cargaHoraria: "3.765 horas · 243 créditos",
    destaqueExtensao: "Horas complementares gerais (sem curricularização de 10% obrigatória)",
    statusBadge: "Grade Anterior",
    badgeCor: "amber",
    semestres: [
      {
        semestre: 1,
        titulo: "1º Semestre",
        ch: "360h",
        disciplinas: [
          { codigo: "DESTEC", nome: "Desenho Técnico 1", ch: "60h", cr: 4, area: "mecanica", pre: [] },
          { codigo: "PROTEX", nome: "Produção Textual", ch: "60h", cr: 4, area: "humanas", pre: [] },
          { codigo: "INTCON", nome: "Introdução ao Controle e Automação", ch: "60h", cr: 4, area: "controle", pre: [] },
          { codigo: "CALC-1", nome: "Cálculo 1", ch: "60h", cr: 4, area: "matematica", pre: [] },
          { codigo: "ALGPRO", nome: "Algoritmos e Programação", ch: "60h", cr: 4, area: "computacao", pre: [] },
          { codigo: "ALGEOM", nome: "Álgebra Linear e Geometria Analítica", ch: "60h", cr: 4, area: "matematica", pre: [] }
        ]
      },
      {
        semestre: 2,
        titulo: "2º Semestre",
        ch: "390h",
        disciplinas: [
          { codigo: "DESCAD", nome: "Desenho Técnico 2 - CAD", ch: "60h", cr: 4, area: "mecanica", pre: ["DESTEC"] },
          { codigo: "ELEDIG", nome: "Eletrônica Digital", ch: "60h", cr: 4, area: "eletronica", pre: ["INTCON"] },
          { codigo: "CALC-2", nome: "Cálculo 2", ch: "60h", cr: 4, area: "matematica", pre: ["CALC-1", "ALGEOM"] },
          { codigo: "PROFUN", nome: "Programação em Funções", ch: "60h", cr: 4, area: "computacao", pre: ["ALGPRO"] },
          { codigo: "QUIGER", nome: "Química Geral", ch: "60h", cr: 4, area: "fisica", pre: [] },
          { codigo: "FIS-1", nome: "Física 1 - Mecânica", ch: "90h", cr: 6, area: "fisica", pre: ["CALC-1", "ALGEOM"] }
        ]
      },
      {
        semestre: 3,
        titulo: "3º Semestre",
        ch: "390h",
        disciplinas: [
          { codigo: "MICPRO", nome: "Microprocessadores", ch: "60h", cr: 4, area: "eletronica", pre: ["PROFUN", "ELEDIG"] },
          { codigo: "EQUDIF", nome: "Equações Diferenciais", ch: "90h", cr: 6, area: "matematica", pre: ["CALC-2"] },
          { codigo: "PROGOO", nome: "Programação Orientada a Objetos", ch: "60h", cr: 4, area: "computacao", pre: ["PROFUN"] },
          { codigo: "FIS-2", nome: "Física 2 - Eletromagnetismo", ch: "90h", cr: 6, area: "fisica", pre: ["FIS-1", "CALC-2"] },
          { codigo: "ESTAT", nome: "Estatística Aplicada", ch: "60h", cr: 4, area: "matematica", pre: ["CALC-1"] },
          { codigo: "METCIEN", nome: "Metodologia Científica", ch: "30h", cr: 2, area: "humanas", pre: [] }
        ]
      },
      {
        semestre: 4,
        titulo: "4º Semestre",
        ch: "360h",
        disciplinas: [
          { codigo: "METR", nome: "Metrologia", ch: "60h", cr: 4, area: "controle", pre: ["FIS-1", "DESCAD"] },
          { codigo: "CIRELE-1", nome: "Circuitos Elétricos 1", ch: "60h", cr: 4, area: "eletronica", pre: ["FIS-2"] },
          { codigo: "METNUM", nome: "Métodos Numéricos", ch: "60h", cr: 4, area: "matematica", pre: ["EQUDIF"] },
          { codigo: "CONF", nome: "Confiabilidade", ch: "60h", cr: 4, area: "controle", pre: ["ESTAT"] },
          { codigo: "ENGMAT", nome: "Engenharia dos Materiais", ch: "60h", cr: 4, area: "mecanica", pre: ["QUIGER", "FIS-2"] },
          { codigo: "FISAUT", nome: "Física para Automação", ch: "60h", cr: 4, area: "fisica", pre: ["FIS-2"] }
        ]
      },
      {
        semestre: 5,
        titulo: "5º Semestre",
        ch: "360h",
        disciplinas: [
          { codigo: "CIRELE-2", nome: "Circuitos Elétricos 2", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-1"] },
          { codigo: "ELETANA", nome: "Eletrônica Analógica", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-1"] },
          { codigo: "HIDPNE", nome: "Hidráulica e Pneumática", ch: "60h", cr: 4, area: "controle", pre: ["CIRELE-1"] },
          { codigo: "MECSOL", nome: "Mecânica dos Sólidos", ch: "60h", cr: 4, area: "mecanica", pre: ["ENGMAT"] },
          { codigo: "PROIND", nome: "Processos Industriais e Fabricação", ch: "60h", cr: 4, area: "mecanica", pre: ["ENGMAT"] },
          { codigo: "TERMOD", nome: "Termodinâmica", ch: "60h", cr: 4, area: "fisica", pre: ["EQUDIF", "FISAUT"] }
        ]
      },
      {
        semestre: 6,
        titulo: "6º Semestre",
        ch: "360h",
        disciplinas: [
          { codigo: "ELETPOT", nome: "Eletrônica de Potência", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-2", "ELETANA"] },
          { codigo: "INSTR", nome: "Instrumentação", ch: "60h", cr: 4, area: "controle", pre: ["METR", "ELETANA"] },
          { codigo: "INSTELE", nome: "Instalações Elétricas", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-2"] },
          { codigo: "FETRANS-MF", nome: "Fenômenos de Transporte 1 - Fluídos", ch: "60h", cr: 4, area: "fisica", pre: ["TERMOD"] },
          { codigo: "CNC", nome: "CNC", ch: "60h", cr: 4, area: "mecanica", pre: ["PROIND"] },
          { codigo: "RESMAT", nome: "Resistência dos Materiais", ch: "60h", cr: 4, area: "mecanica", pre: ["MECSOL"] }
        ]
      },
      {
        semestre: 7,
        titulo: "7º Semestre",
        ch: "360h",
        disciplinas: [
          { codigo: "CLP", nome: "Controladores Lógicos Programáveis", ch: "60h", cr: 4, area: "controle", pre: ["INSTR", "MICPRO", "HIDPNE"] },
          { codigo: "MAQELE", nome: "Máquinas Elétricas", ch: "60h", cr: 4, area: "eletronica", pre: ["CIRELE-1", "FIS-2"] },
          { codigo: "ROBOT", nome: "Robótica", ch: "60h", cr: 4, area: "controle", pre: ["INSTR"] },
          { codigo: "FETRANS-CM", nome: "Fenômenos de Transporte 2 - Calor/Massa", ch: "60h", cr: 4, area: "fisica", pre: ["FETRANS-MF"] },
          { codigo: "REDES", nome: "Redes Industriais", ch: "60h", cr: 4, area: "controle", pre: ["INSTR"] },
          { codigo: "MODSIS", nome: "Modelagem de Sistemas Dinâmicos", ch: "60h", cr: 4, area: "controle", pre: ["EQUDIF", "PROIND"] }
        ]
      },
      {
        semestre: 8,
        titulo: "8º Semestre",
        ch: "330h",
        disciplinas: [
          { codigo: "ECONENG", nome: "Economia para Engenharia", ch: "30h", cr: 2, area: "humanas", pre: ["METNUM"] },
          { codigo: "ACIONA", nome: "Acionamentos", ch: "60h", cr: 4, area: "eletronica", pre: ["ELETPOT", "MAQELE"] },
          { codigo: "SISSUP", nome: "Supervisão e SCADA", ch: "60h", cr: 4, area: "controle", pre: ["REDES", "CLP"] },
          { codigo: "CONSIS", nome: "Controle de Sistemas Dinâmicos", ch: "60h", cr: 4, area: "controle", pre: ["MODSIS", "MICPRO"] },
          { codigo: "SISCOND", nome: "Sinais e Controle Digitais", ch: "60h", cr: 4, area: "controle", pre: ["MODSIS", "MICPRO"] },
          { codigo: "ELET-1", nome: "Eletiva 1", ch: "60h", cr: 4, area: "humanas", pre: [] }
        ]
      },
      {
        semestre: 9,
        titulo: "9º Semestre",
        ch: "330h",
        disciplinas: [
          { codigo: "ADMEMP", nome: "Administração e Empreendedorismo", ch: "30h", cr: 2, area: "humanas", pre: ["ECONENG"] },
          { codigo: "GESINOV", nome: "Gestão da Inovação", ch: "60h", cr: 4, area: "humanas", pre: [], minCr: 144 },
          { codigo: "CONMUL", nome: "Controle Multivariável", ch: "60h", cr: 4, area: "controle", pre: ["CONSIS"] },
          { codigo: "IA", nome: "Inteligência Artificial", ch: "60h", cr: 4, area: "computacao", pre: ["PROGOO"] },
          { codigo: "AUTMAN", nome: "Automação da Manufatura", ch: "60h", cr: 4, area: "controle", pre: ["CNC"] },
          { codigo: "TCC1", nome: "Trabalho de Conclusão 1", ch: "60h", cr: 4, area: "humanas", pre: ["METCIEN"], minCr: 168 }
        ]
      },
      {
        semestre: 10,
        titulo: "10º Semestre",
        ch: "405h",
        disciplinas: [
          { codigo: "INTSIS", nome: "Integração de Sistemas", ch: "60h", cr: 4, area: "controle", pre: ["ROBOT", "CLP", "ACIONA", "SISSUP"] },
          { codigo: "GESPRO", nome: "Gestão de Projetos", ch: "60h", cr: 4, area: "humanas", pre: ["GESINOV"] },
          { codigo: "TCC2", nome: "Trabalho de Conclusão 2", ch: "60h", cr: 4, area: "humanas", pre: ["TCC1"] },
          { codigo: "ESTAGIO", nome: "Estágio Supervisionado", ch: "165h", cr: 11, area: "humanas", pre: ["METCIEN"], minCr: 168 },
          { codigo: "ELET-2", nome: "Eletiva 2", ch: "60h", cr: 4, area: "humanas", pre: [] }
        ]
      }
    ]
  }
};

/* =====================================================================
 *  BENEFÍCIOS, BOLSAS & ASSISTÊNCIA ESTUDANTIL UERGS
 * ===================================================================== */
export const BENEFICIOS_UERGS = {
  resumo: "A UERGS mantém uma política institucional estruturada de apoio à permanência discente (PRODISCÊNCIA e PNAEST), bolsas acadêmicas de ensino, pesquisa e extensão (PROENS, PROPPG e PROEX), atendimento educacional especializado (AEE) e programas de mobilidade estudantil.",
  categorias: [
    {
      id: "monitoria",
      titulo: "Programa de Monitoria Acadêmica (PROENS)",
      icone: "🧑‍🏫",
      badge: "Resolução CONSUN nº 003/2018",
      cor: "cyan",
      descricao: "Regulamentado pela Resolução CONSUN nº 003/2018, o programa estimula a iniciação à docência superior, auxiliando professores e atendendo estudantes em componentes fundamentais (Cálculos, Físicas, Circuitos Elétricos, Algoritmos e Microprocessadores). O Campus Central conta com sala exclusiva de 18 m² para atendimento dos monitores.",
      modalidades: [
        {
          nome: "Categoria I — Monitoria Remunerada por Bolsa",
          detalhes: "Bolsa mensal concedida pela Pró-Reitoria de Ensino (PROENS) para carga horária de 20 horas semanais sob orientação docente. Desde 2014, 10% das bolsas do programa são reservadas para atendimento aos Acadêmicos com Deficiência (AcD).",
          requisitos: "Ter sido aprovado no componente curricular (ou equivalente), disponibilidade de 20h semanais e aprovação em seleção por edital da PROENS."
        },
        {
          nome: "Categoria II — Monitoria Não Remunerada (Voluntária)",
          detalhes: "Atuação com os mesmos direitos de certificação oficial como monitor acadêmico e cômputo de 20h a 40h por semestre em Atividades Complementares (AC) de Ensino (Tabela 3 do PPC 2024).",
          requisitos: "Aprovação prévia na disciplina e elaboração do plano de atividades com o professor orientador."
        }
      ],
      comoInscrever: "Editais semestrais publicados pela PROENS no início de cada período letivo. Cada semestre concluído na monitoria (Categoria I ou II) valida de 20h a 40h de Atividades Complementares de Ensino."
    },
    {
      id: "iniciacao-cientifica",
      titulo: "Iniciação Científica & Tecnológica (PROPPG)",
      icone: "🔬",
      badge: "Pesquisa, Grupo PAI & NITUERGS",
      cor: "violet",
      descricao: "Bolsas de pesquisa vinculadas à Pró-Reitoria de Pesquisa e Pós-Graduação (PROPPG) e ao Grupo de Pesquisa em Automação Industrial (PAI/CNPq) da Unidade Porto Alegre, com projetos em robótica móvel (AGVs), manufatura por sistemas multiagentes, CLPs, IIoT e proteção da propriedade intelectual via NITUERGS.",
      modalidades: [
        {
          nome: "Bolsas Institucionais UERGS (INI-IC / PROBIC / PROBITI)",
          detalhes: "Bolsas de Iniciação Científica (IC) e de Iniciação Tecnológica e Inovação (ITI) custeadas pela própria UERGS com vigência anual e apresentação anual no Salão Integrado de Ensino, Pesquisa e Extensão (SIEPEX).",
          requisitos: "Matrícula regular no curso, currículo Lattes atualizado, plano de trabalho aprovado com docente pesquisador e exposição obrigatória no SIEPEX."
        },
        {
          nome: "Cotas de Agências Externas (CNPq PIBIC/PIBITI & FAPERGS)",
          detalhes: "Bolsas estaduais (FAPERGS PROBIC/PROBITI) e federais (CNPq PIBIC/PIBITI) alocadas a projetos de pesquisa credenciados por docentes doutores do curso.",
          requisitos: "Seleção em edital unificado da PROPPG, ausência de vínculo empregatício e dedicação de 20h semanais ao laboratório."
        }
      ],
      comoInscrever: "Editais anuais da PROPPG e contato direto com os docentes do Grupo de Pesquisa em Automação Industrial (PAI). A participação em pesquisa garante de 20h a 40h por semestre em AC, mais 12h por artigo publicado ou relatório final."
    },
    {
      id: "permanencia",
      titulo: "Assistência Estudantil & Permanência (PRODISCÊNCIA & PNAEST)",
      icone: "🤝",
      badge: "PROENS · Res. CONSUN nº 008/2012",
      cor: "emerald",
      descricao: "Gerida pela Coordenadoria de Qualificação Acadêmica e Assistência Estudantil (vinculada à PROENS), a política de permanência da UERGS articula recursos estaduais (PRODISCÊNCIA) e federais (PNAEST/MEC) para assegurar a diplomação de estudantes em vulnerabilidade socioeconômica.",
      modalidades: [
        {
          nome: "PRODISCÊNCIA — Auxílio Alimentação, Transporte e Moradia",
          detalhes: "Instituído pela Resolução CONSUN nº 008/2012, concede bolsas de auxílio financeiro mensal para custeio de alimentação, transporte e moradia a estudantes hipossuficientes economicamente.",
          requisitos: "Comprovação de vulnerabilidade socioeconômica familiar em edital da Assistência Estudantil/PROENS e frequência acadêmica regular."
        },
        {
          nome: "PNAEST / MEC — Inclusão Digital, Eventos (SIEPEX) e Apoio Integral",
          detalhes: "Convênio federal que financia ações em 10 eixos (moradia, alimentação, transporte, saúde, inclusão digital, cultura, esporte, creche e apoio pedagógico), além de custear transporte e alimentação para estudantes apresentarem trabalhos no SIEPEX.",
          requisitos: "Matrícula ativa na graduação presencial da UERGS (ingresso via SiSU) e inscrição nos editais específicos da PROENS."
        }
      ],
      comoInscrever: "Editais periódicos publicados pela Coordenadoria de Qualificação Acadêmica e Assistência Estudantil (PROENS) no portal oficial da UERGS, com acompanhamento participativo pelo Fórum Permanente de Assistência Estudantil (FoPeDi)."
    },
    {
      id: "saude-mental",
      titulo: "Atendimento Educacional Especializado (AEE) & Acolhimento",
      icone: "🧠",
      badge: "Acessibilidade, FADERS & Cotas",
      cor: "amber",
      descricao: "Operado pelo Núcleo de Atendimento Educacional Especializado (AEE) e pelo Serviço de Orientação Pedagógica e Educacional da PROENS, em cooperação técnica com a FADERS, assegurando acessibilidade plena, apoio psicopedagógico e políticas de ações afirmativas.",
      modalidades: [
        {
          nome: "Atendimento Educacional Especializado (AEE) & Monitores AcD",
          detalhes: "Mapeamento e acompanhamento presencial individualizado aos estudantes com deficiência, altas habilidades ou transtornos funcionais, com designação de monitores bolsistas exclusivos para auxílio nas rotinas acadêmicas.",
          requisitos: "Solicitação direta ao Núcleo de AEE / PROENS ou indicação pela Coordenação de Curso em qualquer momento do semestre."
        },
        {
          nome: "Orientação Pedagógica, Inclusão Digital & Ações Afirmativas",
          detalhes: "Acolhimento pedagógico e emocional, empréstimo de equipamentos/computadores para alunos sem recursos (Seção 2.3.5 do PPC) e garantia estatutária de 50% de vagas para ações afirmativas (hipossuficientes, negros e indígenas — Art. 56) e 10% para PcD (Art. 57).",
          requisitos: "Aberto a todos os estudantes regularmente matriculados na Unidade Porto Alegre."
        }
      ],
      comoInscrever: "Atendimento presencial ou remoto mediante contato com o Serviço de Orientação Pedagógica / Núcleo de AEE da PROENS e Coordenação do Curso."
    },
    {
      id: "extensao-mobilidade",
      titulo: "Bolsas de Extensão (PROEX), Mobilidade & Direitos Acadêmicos",
      icone: "🌐",
      badge: "PROEX, Intercâmbio & Art. 261 RGU",
      cor: "blue",
      descricao: "Oportunidades de atuação comunitária remunerada pela Pró-Reitoria de Extensão (PROEX), programas de intercâmbio e mecanismos regimentais para aceleração de estudos e valorização da representação discente.",
      modalidades: [
        {
          nome: "Bolsas de Extensão Universitária (PROEX) & Representação Estudantil",
          detalhes: "Bolsas para atuação em programas e projetos de extensão da UERGS (que também integralizam de 20h a 120h na Curricularização da Extensão). Além disso, atuar no Centro Acadêmico E(CA)², DCE ou Conselhos (CONSUN/CONEG) garante de 20h a 40h por semestre em Atividades Complementares de Ensino.",
          requisitos: "Inscrição nos editais anuais da PROEX ou posse documentada em gestão do Centro Acadêmico / colegiados."
        },
        {
          nome: "Intercâmbio, Mobilidade & Extraordinário Aproveitamento (Art. 261 RGU)",
          detalhes: "Convênios de mobilidade nacional/internacional (Seção 6.7 do PPC), mobilidade interna entre engenharias da UERGS (Quadro 6) e direito ao Exame de Extraordinário Aproveitamento nos Estudos (Art. 261 do Regimento Geral e Art. 47 §2º da LDB) para abreviar disciplinas comprovando domínio prévio perante banca.",
          requisitos: "Requerimento formal via Secretaria Acadêmica / SEI conforme prazos do Calendário Acadêmico da UERGS."
        }
      ],
      comoInscrever: "Editais de extensão no portal da PROEX e solicitações de mobilidade ou extraordinário aproveitamento via protocolo na Secretaria Acadêmica da Unidade Porto Alegre."
    }
  ]
};

/* =====================================================================
 *  CALENDÁRIO INTEGRADO: EVENTOS E(CA)² + DATAS INSTITUCIONAIS UERGS
 * ===================================================================== */
export const CALENDARIO_EVENTOS = [
  {
    id: 1,
    data: "2026-10-26",
    dataExibicao: "26 de Outubro de 2026 (Segunda-feira)",
    horario: "18:30 às 19:15",
    titulo: "Encontro de Integração & Salchipão do E(CA)²",
    categoria: "ca",
    categoriaLabel: "E(CA)² · Evento do Curso",
    icone: "🌭",
    local: "Refeitório da UERGS – Campus Porto Alegre",
    descricao: "Distribuição gratuita de salchipão, apresentação do novo portal do curso e confraternização aberta entre calouros ('bichos') e veteranos no refeitório.",
    destaque: true,
    linkAcao: "#eventos",
    textoAcao: "Ver Detalhes do Encontro"
  },
  {
    id: 2,
    data: "2026-10-14",
    dataExibicao: "14 de Outubro de 2026",
    horario: "Horário Comercial",
    titulo: "Apresentação dos Laboratórios de Automação & Robótica",
    categoria: "institucional",
    categoriaLabel: "UERGS · Integração & Prática",
    icone: "🔬",
    local: "Bancadas de CLP e Robótica · UERGS",
    descricao: "Tour técnico para reconhecimento dos kits didáticos de automação, bancadas de eletropneumática e laboratórios de informática.",
    destaque: false,
    linkAcao: "#curso/labs",
    textoAcao: "Conhecer Laboratórios"
  },
  {
    id: 3,
    data: "2026-10-20",
    dataExibicao: "20 de Outubro de 2026",
    horario: "Até às 23:59",
    titulo: "Prazo Final: Ajuste de Matrícula & Trancamento Parcial",
    categoria: "institucional",
    categoriaLabel: "UERGS · Calendário Acadêmico",
    icone: "⏱️",
    local: "Portal do Aluno UERGS",
    descricao: "Data limite para os estudantes solicitarem ajustes em disciplinas ou cancelamento de matrícula de componentes específicos.",
    destaque: false,
    linkAcao: "https://academico.uergs.edu.br/core/login",
    textoAcao: "Acessar Portal do Aluno"
  },
  {
    id: 4,
    data: "2026-11-04",
    dataExibicao: "04 de Novembro de 2026",
    horario: "Abertura de Inscrições",
    titulo: "Inscrições Abertas: Bolsas de Monitoria UERGS",
    categoria: "institucional",
    categoriaLabel: "UERGS · Assistência & Ensino",
    icone: "🧑‍🏫",
    local: "Pró-Reitoria de Ensino (PROENS)",
    descricao: "Seleção semestral de monitores remunerados e voluntários para Cálculo, Física, Algoritmos, Circuitos Elétricos e Microprocessadores.",
    destaque: false,
    linkAcao: "#curso/beneficios",
    textoAcao: "Ver Detalhes das Bolsas"
  },
  {
    id: 5,
    data: "2026-11-18",
    dataExibicao: "18 de Novembro de 2026 (Quarta-feira)",
    horario: "14:00 às 18:00",
    titulo: "Visita Técnica: Polo Industrial & Robótica Flexível",
    categoria: "ca",
    categoriaLabel: "E(CA)² · Integração Profissional",
    icone: "🏭",
    local: "Parque Industrial Metalmecânico · Grande Porto Alegre",
    descricao: "Visita guiada para estudantes do curso a plantas industriais automatizadas com células robóticas de precisão e esteiras inteligentes.",
    destaque: true,
    linkAcao: "#mural",
    textoAcao: "Manifestar Interesse no Mural"
  },
  {
    id: 6,
    data: "2026-11-23",
    dataExibicao: "23 de Novembro de 2026",
    horario: "Abertura do Período",
    titulo: "Período de Solicitação de Aproveitamento de Estudos",
    categoria: "institucional",
    categoriaLabel: "UERGS · Calendário Acadêmico",
    icone: "🔄",
    local: "Secretaria Acadêmica / Processo Eletrônico SEI",
    descricao: "Início do período para solicitação de equivalências entre as matrizes curriculares PPC 2019 e PPC 2024 e aproveitamento de disciplinas.",
    destaque: false,
    linkAcao: "#curso/arvore",
    textoAcao: "Ver Matriz de Equivalências"
  },
  {
    id: 7,
    data: "2026-12-09",
    dataExibicao: "09 de Dezembro de 2026 (Quarta-feira)",
    horario: "17:30 às 20:30",
    titulo: "Minicurso Prático: Programação de CLPs & TIA Portal",
    categoria: "ca",
    categoriaLabel: "E(CA)² · Capacitação Técnica",
    icone: "🎛️",
    local: "Laboratório de Redes Industriais e CLPs (UERGS)",
    descricao: "Oficina prática com emissão de certificado ministrada nas bancadas didáticas do curso com foco em Ladder, blocos funcionais e IHMs.",
    destaque: true,
    linkAcao: "#forum",
    textoAcao: "Ver Tópico no Fórum"
  },
  {
    id: 8,
    data: "2026-12-16",
    dataExibicao: "16 de Dezembro de 2026",
    horario: "Término das Aulas",
    titulo: "Encerramento do Período Letivo Regular 2026/2",
    categoria: "institucional",
    categoriaLabel: "UERGS · Calendário Acadêmico",
    icone: "🏁",
    local: "Campus Central Porto Alegre",
    descricao: "Último dia de aulas regulares do semestre antes da aplicação das semanas de exames finais presenciais.",
    destaque: false,
    linkAcao: "#curso",
    textoAcao: "Consultar Matriz Curricular"
  },
  {
    id: 9,
    data: "2026-12-17",
    dataExibicao: "17 a 22 de Dezembro de 2026",
    horario: "Conforme horários de prova",
    titulo: "Semana de Exames Finais (Recuperação)",
    categoria: "institucional",
    categoriaLabel: "UERGS · Avaliações Finais",
    icone: "📝",
    local: "Salas de Aula e Laboratórios UERGS",
    descricao: "Período oficial de exames finais presenciais para disciplinas com média pendente.",
    destaque: false,
    linkAcao: "#faq",
    textoAcao: "Tirar Dúvidas sobre Exames"
  },
  {
    id: 10,
    data: "2027-03-15",
    dataExibicao: "Março / 2027 (Planejamento)",
    horario: "Semana Acadêmica",
    titulo: "1ª Semana de Automação & Batalha de Robôs E(CA)²",
    categoria: "ca",
    categoriaLabel: "E(CA)² · Grande Evento Anual",
    icone: "🚀",
    local: "UERGS Campus Porto Alegre",
    descricao: "Ciclo de palestras com empresas de engenharia, feira de projetos integradores e batalha de robôs seguidores de linha e sumô.",
    destaque: true,
    linkAcao: "#mural",
    textoAcao: "Propor Ideias no Mural"
  }
];

/* =====================================================================
 *  ESTÁGIOS, PERFIL PROFISSIONAL & MERCADO CREA-RS
 * ===================================================================== */
export const ESTAGIOS_MERCADO = {
  resumo: "Guia completo de Estágio Supervisionado da UERGS, perfil do profissional de Engenharia de Controle e Automação, atribuições técnicas oficiais perante o CREA-RS/CONFEA, piso salarial e os principais polos industriais empregadores.",
  estagios: {
    obrigatorio: {
      titulo: "Estágio Supervisionado Obrigatório",
      ch: "165 horas curriculares",
      semestreRecomendado: "A partir do 7º Módulo",
      badge: "Requisito de Formatura",
      cor: "cyan",
      descricao: "Atividade prática supervisionada e curricular obrigatória para colação de grau, integrando o estudante a projetos reais em indústrias, integradores de automação ou laboratórios de P&D.",
      requisitos: [
        "Estar regularmente matriculado na UERGS;",
        "Conclusão mínima de 168 créditos (~71,5% dos créditos do curso) e aprovação em Metodologia Científica (METCIEN), conforme o PPC 2024;",
        "Empresa concedente com convênio ativo na UERGS (ou via agentes integradores CIEE/IEL);",
        "Supervisor na empresa com formação na área tecnológica e registro profissional ativo (CREA/CFT)."
      ]
    },
    naoObrigatorio: {
      titulo: "Estágio Extracurricular (Não-Obrigatório)",
      ch: "Carga horária semanal até 30h",
      semestreRecomendado: "Qualquer semestre após adaptação inicial",
      badge: "Remunerado + Bolsa Auxílio",
      cor: "emerald",
      descricao: "Atividade profissional remunerada com concessão obrigatória de bolsa-auxílio e auxílio-transporte pela empresa concedente, com cobertura de seguro de acidentes pessoais.",
      requisitos: [
        "Compatibilidade comprovada de horários com o turno das aulas;",
        "Possibilidade de aproveitamento parcial como Atividades Complementares (AC);",
        "Excelente porta de entrada para programas de Trainee e contratação efetiva como Engenheiro(a) Júnior."
      ]
    },
    passoAPasso: [
      {
        num: "1",
        titulo: "Conquista da Vaga",
        desc: "Busque oportunidades via agentes de integração (CIEE-RS, IEL-RS), no Mural de Vagas do E(CA)² ou contato direto com indústrias do setor."
      },
      {
        num: "2",
        titulo: "Termo de Compromisso (TCE)",
        desc: "Preencha o TCE e o Plano de Atividades detalhando tarefas correlatas ao escopo de controle, instrumentação, CLP, robótica ou sistemas industriais."
      },
      {
        num: "3",
        titulo: "Homologação na UERGS (Coordenação & PROENS)",
        desc: "Submeta o TCE e o Plano de Atividades ao Professor Orientador de Estágio, à Coordenação do Curso e ao Setor de Estágios da PROENS antes de iniciar."
      },
      {
        num: "4",
        titulo: "Acompanhamento & Relatórios",
        desc: "Envio de relatórios parciais e relatório final de estágio assinado pelo supervisor com avaliação de desempenho para cômputo no histórico."
      }
    ],
    convenios: [
      {
        nome: "CIEE-RS (Centro de Integração Empresa-Escola)",
        foco: "Maior banco de vagas de estágio na Grande Porto Alegre, Vale dos Sinos e Região Metropolitana.",
        linkTexto: "Portal CIEE-RS ↗",
        linkUrl: "https://www.cieers.org.br"
      },
      {
        nome: "IEL-RS / Sistema FIERGS",
        foco: "Especializado no setor industrial (metalmecânico, químico, automotivo, energia e agroindústria).",
        linkTexto: "Portal IEL-RS ↗",
        linkUrl: "https://www.ielrs.org.br"
      },
      {
        nome: "Convênios Diretos da UERGS",
        foco: "Acordos diretos celebrados entre a Pró-Reitoria de Ensino (PROENS) e indústrias de ponta sem agentes intermediários.",
        linkTexto: "Consultar Convênios UERGS ↗",
        linkUrl: "https://www.uergs.edu.br"
      }
    ]
  },
  perfilProfissional: {
    titulo: "Perfil do Engenheiro de Controle e Automação UERGS",
    subtitulo: "Formação Mecatrônica & Visão Sistêmica de Indústria 4.0",
    descricao: "O egresso da UERGS é preparado para atuar na convergência entre a mecânica industrial, a eletroeletrônica de precisão e a tecnologia da informação, capaz de conceber soluções completas para aumento de produtividade, segurança operacional e sustentabilidade.",
    pilares: [
      {
        icone: "🦾",
        titulo: "Mecatrônica & Robótica Industrial",
        desc: "Capacidade de projetar e integrar manipuladores robóticos, células de solda/usinagem automatizadas, garras pneumáticas e esteiras flexíveis com visão computacional."
      },
      {
        icone: "🎛️",
        titulo: "Automação de Processos & CLPs",
        desc: "Domínio avançado de Controladores Lógicos Programáveis (Rockwell, Siemens, WEG), sistemas SCADA/Supervisórios, barramentos Fieldbus/Profinet e controle multivariável."
      },
      {
        icone: "💻",
        titulo: "Sistemas Embarcados & IoT Industrial (IIoT)",
        desc: "Desenvolvimento de hardware e firmware para microcontroladores (ARM, ESP32, STM32), gateways industriais de telemetria em nuvem e instrumentação inteligente."
      },
      {
        icone: "⚡",
        titulo: "Acionamentos & Eletrônica de Potência",
        desc: "Dimensionamento e controle vetorial de motores CA/CC, inversores de frequência, servodrives, soft-starters e eficiência energética industrial."
      },
      {
        icone: "🧠",
        titulo: "Inteligência Artificial & Gêmeos Digitais",
        desc: "Aplicação de machine learning para manutenção preditiva em tempo real, modelagem matemática computacional e otimização de linhas de manufatura."
      },
      {
        icone: "🌱",
        titulo: "Ética, Meio Ambiente & Gestão",
        desc: "Postura responsável com foco na sustentabilidade ambiental (ESG), segurança de máquinas (NR-12) e liderança de equipes multidisciplinares de engenharia."
      }
    ]
  },
  mercadoCREA: {
    titulo: "Regulamentação Profissional & CREA-RS / CONFEA",
    subtitulo: "Exercício Legal da Profissão e Habilitação Técnica",
    registroConselho: "CREA-RS (Conselho Regional de Engenharia e Agronomia do Estado do Rio Grande do Sul)",
    resolucoes: "Resoluções CONFEA nº 218/1973, nº 427/1999 e nº 1.073/2016",
    atribuicoes: [
      "Atribuições profissionais plenas para planejar, projetar, instalar, operar e manter sistemas mecatrônicos, de controle, automação e instrumentação;",
      "Emissão de Anotação de Responsabilidade Técnica (ART) para máquinas automatizadas, linhas de produção, laudos de conformidade técnica e adequação à NR-12;",
      "Direção de obras e serviços técnicos, perícias judiciais, arbitramentos, ensaios de conformidade e consultoria especializada de engenharia;",
      "Atuação em cargos de chefia técnica, gestão de manutenção industrial, engenharia de confiabilidade e desenvolvimento de produtos."
    ],
    pisoSalarial: {
      titulo: "Piso Salarial Profissional da Categoria",
      lei: "Lei Federal nº 4.950-A/1966 e entendimentos consolidados da jurisprudência nacional",
      jornada6h: {
        horas: "Jornada diária de 6 horas",
        piso: "6 Salários Mínimos Nacionais vigentes",
        detalhe: "Base obrigatória para contratos de Engenheiro(a) registrado sob regime CLT."
      },
      jornada8h: {
        horas: "Jornada diária de 8 horas",
        piso: "8,5 Salários Mínimos Nacionais vigentes",
        detalhe: "Composto por 6 salários mínimos das 6 primeiras horas + 25% de adicional por hora excedente."
      },
      observacao: "O Centro Acadêmico E(CA)² atua em estreita proximidade com o CREA Jr RS para orientar os alunos sobre valorização salarial, direitos contratuais e código de ética profissional."
    },
    polosIndustriaisRS: [
      {
        polo: "Polo Petroquímico de Triunfo",
        destaque: "Automação Contínua & Instrumentação",
        desc: "Grandes refinarias e indústrias químicas com demanda intensa por instrumentação analítica, controle avançado de processos e segurança intrínseca."
      },
      {
        polo: "Serra Gaúcha (Caxias do Sul / Bento Gonçalves)",
        destaque: "Maior Polo Metalmecânico do Sul",
        desc: "Fabricantes de máquinas agrícolas, implementos rodoviários, linhas robotizadas de corte/solda a laser e células CNC de usinagem."
      },
      {
        polo: "Região Metropolitana & Vale dos Sinos",
        destaque: "Tecnologia, Semicondutores & Automotivo",
        desc: "Parques tecnológicos, montadoras de veículos, empresas de semicondutores, integradores de sistemas de automação e energia limpa."
      },
      {
        polo: "Polo Agroindustrial (Passo Fundo / Panambi / Ibirubá)",
        destaque: "Automação no Agronegócio (AgTech)",
        desc: "Silos inteligentes automatizados, telemetria em colheitadeiras e pulverizadores autônomos e logística de grãos conectada."
      }
    ]
  }
};

/* =====================================================================
 *  CORPO DOCENTE, NDE, GRUPO DE PESQUISA PAI/CNPq & ORIENTAÇÃO DE TCC/IC
 *  (Extraído das páginas 3–4 e 238–244 / Tabela 7 / Quadro 78 do PPC 2024)
 * ===================================================================== */
export const CORPO_DOCENTE_NDE = {
  resumo: "O curso de Engenharia de Controle e Automação conta com Núcleo Docente Estruturante (NDE) formalmente instituído pela Portaria Interna nº 053/2021 e com o Grupo de Pesquisa em Automação Industrial (PAI), certificado pela UERGS junto ao Diretório dos Grupos de Pesquisa do CNPq.",
  nde: [
    {
      nome: "Prof. Me. Vinícius Leônidas Curcio",
      papel: "Presidente do NDE · Docente de Controle e Automação",
      formacao: "Mestre em Engenharia · Especialista em Automação Industrial e Robótica",
      areasOrientacao: ["Controladores Lógicos Programáveis (CLP) e Redes Industriais", "Robótica Industrial e Móvel (AGVs)", "Sistemas Flexíveis de Manufatura e Indústria 4.0", "Instrumentação e Eletropneumática"],
      grupoPesquisa: "Pesquisador do Grupo PAI/CNPq"
    },
    {
      nome: "Prof. Dr. André Borin Soares",
      papel: "Membro do NDE · Líder do Grupo de Pesquisa PAI/CNPq",
      formacao: "Doutor em Engenharia · Especialista em Controle e Sistemas Dinâmicos",
      areasOrientacao: ["Modelagem, Simulação e Controle de Sistemas Dinâmicos", "Controle Multivariável e Controle Preditivo", "Instrumentação Eletrônica e Processamento de Sinais", "Automação de Processos Contínuos e Fotobiorreatores"],
      grupoPesquisa: "Líder do Grupo PAI/CNPq"
    },
    {
      nome: "Prof. Dr. João Alvarez Peixoto",
      papel: "Membro do NDE · Líder do Grupo de Pesquisa PAI/CNPq",
      formacao: "Doutor em Engenharia · Especialista em Sistemas Embarcados e Multiagentes",
      areasOrientacao: ["Microprocessadores, Microcontroladores e Sistemas Embarcados", "Internet Industrial das Coisas (IIoT) e Sensores Sem Fio (ESP8266/ESP32)", "Sistemas Multiagentes aplicados à Manufatura Industrial (MIM)", "Supervisão Inteligente e Controle Integrado (SICI)"],
      grupoPesquisa: "Líder do Grupo PAI/CNPq"
    },
    {
      nome: "Prof. Me. Emerson Fernandes da Cunha",
      papel: "Membro do NDE · Coordenador da Área das Ciências Exatas e Engenharias",
      formacao: "Mestre em Engenharia · Gestão Acadêmica e Engenharias UERGS",
      areasOrientacao: ["Gestão da Inovação Tecnológica e Projetos de Engenharia", "Processos Industriais, Qualidade e Engenharia Econômica", "Integração Curricular entre Engenharias da UERGS"],
      grupoPesquisa: "Coordenação de Área — UERGS"
    }
  ],
  grupoPAI: {
    nome: "Grupo de Pesquisa em Automação Industrial (PAI / CNPq)",
    certificacao: "Diretório dos Grupos de Pesquisa no Brasil — CNPq / PROPPG UERGS",
    lideres: "Prof. Dr. André Borin Soares e Prof. Dr. João Alvarez Peixoto",
    objetivo: "Desenvolver pesquisa aplicada e inovação tecnológica em robótica autônoma, manufatura inteligente controlada por agentes, IIoT, instrumentação e controle avançado na Unidade Porto Alegre, integrando bolsistas PROBIC/PROBITI/CNPq/FAPERGS e estudantes de TCC.",
    projetosReais: [
      {
        codigo: "Proj. #705",
        titulo: "SICI — Supervisão Inteligente e Controle Integrado",
        foco: "Arquiteturas de supervisão SCADA/IHM integradas a controladores industriais e tomada de decisão automatizada."
      },
      {
        codigo: "Proj. #1090 / #1688 / #85",
        titulo: "MIM — Manufatura Industrial controlada por Sistemas Multiagentes",
        foco: "Coordenação descentralizada de células de manufatura flexível utilizando agentes inteligentes e redes industriais."
      },
      {
        codigo: "Proj. #1687",
        titulo: "Desenvolvimento de um AGV Interativo & Navegação Autônoma",
        foco: "Projeto mecatrônico de Veículos Guiados Automaticamente (AGVs), fusão sensorial e desvio de obstáculos para logística industrial."
      },
      {
        codigo: "Inovação / NITUERGS",
        titulo: "IIoT para Manufatura, Kit Didático Modular Arduino & Fotobiorreator CLP",
        foco: "Sensoriamento sem fio industrial com ESP8266, bancadas didáticas abertas para ensino de engenharia e controle automatizado de bioprocessos."
      }
    ]
  },
  areasCorpoDocente: [
    { nucleo: "Controle, Automação, Robótica & Sistemas Embarcados", vagasQuadro78: "6 Docentes Dedicados", disciplinasChave: "INTCON, ELEDIG, MICPRO, CAM, SENSAT, MODSIS, CONSIS, CLP, ROBOT, SISSUP, CONMUL, INTSIS" },
    { nucleo: "Engenharia Elétrica, Eletrônica & Potência", vagasQuadro78: "4 Docentes", disciplinasChave: "CIREL-1, CIREL-2, DISPEL, LABEL, SISCOND, CONENE, ACIONA, INSTEL" },
    { nucleo: "Engenharia Mecânica, Materiais & Termofluidos", vagasQuadro78: "3 Docentes", disciplinasChave: "DESTEC, DESCAD, CIEMAT, MECSOL, RESMAT, PROCFAB, HIDPNE, FETRANS-MF, FETRANS-CM, TERMO" },
    { nucleo: "Computação, Algoritmos & Redes", vagasQuadro78: "3 Docentes", disciplinasChave: "ALGPRO, PROFUN, PROGOO, ARQCOM, REDES, IA (Eletiva)" },
    { nucleo: "Matemática, Física & Química Básica", vagasQuadro78: "6 Docentes", disciplinasChave: "CALC-1 a CALC-4, ALGEOM, ESTAT, CALNUM, FIS-1 a FIS-3, FISAUT, QUIGER" },
    { nucleo: "Gestão, Extensão, Humanidades & Meio Ambiente", vagasQuadro78: "4 Docentes", disciplinasChave: "METCIEN, PROIND, COMPEX, PROJEXT-1, PROJEXT-2, GESAMB, ECOENG, GESINOV, ADMEMP, GESPRO" }
  ]
};

/* =====================================================================
 *  REGRAS OFICIAIS: ATIVIDADES COMPLEMENTARES (TABELA 3), EXTENSÃO (TABELAS 4–6)
 *  E SISTEMA DE AVALIAÇÃO POR CONCEITOS (SEÇÃO 2.6 DO PPC 2024)
 * ===================================================================== */
export const REGRAS_AC_EXTENSAO = {
  ac: {
    meta2024: 80,
    meta2019: 60,
    baseLegal: "Tabela 3 do PPC 2024 (p. 211–213) · Seção 2.5.3",
    observacao: "As Atividades Complementares (AC) são obrigatórias para a integralização curricular (80h no PPC 2024; 60h no PPC 2019) e dividem-se nos eixos de Ensino, Pesquisa e Extensão (não computadas na curricularização).",
    categorias: [
      { id: "ac-mon", eixo: "Ensino", nome: "Monitoria Acadêmica (Categoria I ou II)", horasPorUnidade: 20, maxHoras: 40, unidade: "semestre" },
      { id: "ac-est", eixo: "Ensino", nome: "Estágio Não-Obrigatório na área de Engenharia", horasPorUnidade: 20, maxHoras: 40, unidade: "semestre" },
      { id: "ac-ca", eixo: "Ensino", nome: "Diretoria do Centro Acadêmico E(CA)², DCE ou Colegiado", horasPorUnidade: 20, maxHoras: 40, unidade: "semestre" },
      { id: "ac-cons", eixo: "Ensino", nome: "Representação Discente em Conselhos (CONSUN / CONEPE / CONSAD)", horasPorUnidade: 20, maxHoras: 40, unidade: "semestre" },
      { id: "ac-disc", eixo: "Ensino", nome: "Disciplina cursada com aprovação em outro curso universitário", horasPorUnidade: 20, maxHoras: 40, unidade: "disciplina" },
      { id: "ac-id", eixo: "Ensino", nome: "Curso de Língua Estrangeira / Idiomas", horasPorUnidade: 20, maxHoras: 40, unidade: "módulo/nível" },
      { id: "ac-ic", eixo: "Pesquisa", nome: "Bolsista ou Voluntário de Iniciação Científica / Tecnológica (PROPPG/PAI)", horasPorUnidade: 20, maxHoras: 40, unidade: "semestre" },
      { id: "ac-gp", eixo: "Pesquisa", nome: "Participação em Grupo de Pesquisa certificado pela UERGS", horasPorUnidade: 20, maxHoras: 40, unidade: "semestre" },
      { id: "ac-art", eixo: "Pesquisa", nome: "Publicação de artigo em periódico/livro ou trabalho completo em Anais (SIEPEX/Congressos)", horasPorUnidade: 12, maxHoras: 48, unidade: "publicação" },
      { id: "ac-rel", eixo: "Pesquisa", nome: "Relatório Final de Iniciação Científica aprovado", horasPorUnidade: 12, maxHoras: 24, unidade: "relatório" },
      { id: "ac-ev", eixo: "Extensão", nome: "Participação como ouvinte em Semanas Acadêmicas, SIEPEX ou Congressos", horasPorUnidade: 10, maxHoras: 60, unidade: "evento" },
      { id: "ac-min", eixo: "Extensão", nome: "Participação como ouvinte em minicursos, oficinas ou palestras técnicas", horasPorUnidade: 4, maxHoras: 20, unidade: "atividade" },
      { id: "ac-vis", eixo: "Extensão", nome: "Participação em Visitas Técnicas ou Mostras Tecnológicas", horasPorUnidade: 8, maxHoras: 24, unidade: "visita/feira" },
      { id: "ac-org", eixo: "Extensão", nome: "Comissão Organizadora de Semana Acadêmica ou Evento da UERGS", horasPorUnidade: 15, maxHoras: 60, unidade: "evento" }
    ]
  },
  extensao: {
    meta2024: 410,
    minModalidades: 3,
    baseLegal: "Resolução CONEPE nº 019/2020 e Resolução CNE/CES nº 07/2018 · Tabelas 4, 5 e 6 do PPC 2024 (p. 232–236)",
    observacao: "No PPC 2024, o estudante deve integralizar 410 horas de Extensão Universitária (10,21% da CH total), distribuídas obrigatoriamente em no mínimo 3 das 5 modalidades previstas na Tabela 6 do PPC.",
    modalidades: [
      {
        formato: "Formato 1 — Componentes Curriculares Extensionistas (Disciplinas)",
        limite: "Até 300h (180h em COMPEX + PROJEXT-1 + PROJEXT-2 e até 120h em ACE)",
        itens: [
          { id: "ext-compex", nome: "COMPEX — Compartilhando Experiências (2º Semestre)", horas: 60 },
          { id: "ext-proj1", nome: "PROJEXT-1 — Projeto em Extensão 1 (4º Semestre)", horas: 60 },
          { id: "ext-proj2", nome: "PROJEXT-2 — Projeto em Extensão 2 (5º Semestre)", horas: 60 },
          { id: "ext-ace", nome: "ACE — Ações Curriculares de Extensão em outras disciplinas", horas: 30 }
        ]
      },
      {
        formato: "Formato 2 — Atividades Extensionistas Curricularizáveis (Programas, Projetos, Cursos e Eventos)",
        limite: "Conforme certificação PROEX (Tabela 6)",
        itens: [
          { id: "ext-bolsa", nome: "Atuação como bolsista ou voluntário em Programa/Projeto de Extensão (PROEX)", horas: 60 },
          { id: "ext-oficina", nome: "Ministrante de oficina, minicurso ou treinamento para a comunidade", horas: 16 },
          { id: "ext-org", nome: "Organização de evento extensionista ou exposição em feira tecnológica aberta", horas: 12 },
          { id: "ext-apres", nome: "Apresentação de trabalho extensionista em evento (ex: SIEPEX)", horas: 8 }
        ]
      },
      {
        formato: "Formato 3 — Prestação de Serviços, Consultoria e Assessoria Técnica Comunitária",
        limite: "Projetos registrados na PROEX",
        itens: [
          { id: "ext-serv", nome: "Desenvolvimento de solução técnica/automação ou laudo para escola/comunidade/ONG", horas: 40 }
        ]
      },
      {
        formato: "Formato 4 — Empresas Juniores, Incubadoras e Empreendedorismo Social",
        limite: "Participação ativa certificada",
        itens: [
          { id: "ext-ej", nome: "Atuação em Empresa Júnior, Incubadora Tecnológica ou projeto social comunitário", horas: 40 }
        ]
      },
      {
        formato: "Formato 5 — Publicações e Produtos Acadêmicos Extensionistas",
        limite: "40h a 200h por produto (Tabela 6)",
        itens: [
          { id: "ext-soft", nome: "Desenvolvimento de Software/Aplicativo aberto ou Hardware comunitário documentado", horas: 60 },
          { id: "ext-art", nome: "Artigo, manual técnico, cartilha ou produto audiovisual de extensão publicado", horas: 30 }
        ]
      }
    ]
  },
  avaliacaoConceitos: {
    baseLegal: "Seção 2.6 do PPC 2024 (p. 223) · Regimento Geral da UERGS",
    frequenciaMinima: 75,
    minAvaliacoesPorSemestre: 3,
    faixas: [
      { conceito: "A", faixa: "90% a 100% (Nota 9,0 a 10,0)", status: "Aprovado com Excelência", cor: "green", desc: "Atingiu plenamente os objetivos de aprendizagem do componente curricular." },
      { conceito: "B", faixa: "75% a 89,9% (Nota 7,5 a 8,9)", status: "Aprovado com Bom Aproveitamento", cor: "cyan", desc: "Atingiu de forma muito satisfatória os objetivos propostos." },
      { conceito: "C", faixa: "60% a 74,9% (Nota 6,0 a 7,4)", status: "Aprovado (Mínimo Exigido)", cor: "amber", desc: "Atingiu o patamar mínimo de 60% dos objetivos para aprovação direta." },
      { conceito: "D", faixa: "Abaixo de 60% (Nota < 6,0) com Frequência ≥ 75%", status: "Em Recuperação / Reprovado por Nota", cor: "red", desc: "Direito regimental a instrumento de recuperação final para atingir o limiar de 60% (Conceito C)." },
      { conceito: "E", faixa: "Frequência inferior a 75% (Faltas > 25% da CH)", status: "Reprovado por Infrequência", cor: "slate", desc: "Reprovação direta por falta de assiduidade, sem direito a exame de recuperação." }
    ]
  }
};

/* =====================================================================
 *  TABELA DE EQUIVALÊNCIAS: MIGRAÇÃO PPC 2019 ➔ PPC 2024 & MOBILIDADE INTERNA
 *  (Extraído dos Quadros 6 e 7, p. 58–63, e Anexo H, p. 285–291 do PPC 2024)
 * ===================================================================== */
export const TABELA_EQUIVALENCIAS = {
  migracao2019Para2024: [
    // 1º Semestre 2019
    { cod2019: "DESTEC", nome2019: "Desenho Técnico 1 (60h)", cod2024: ["DESTEC"], nome2024: "Desenho Técnico 1 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "INTAUT", nome2019: "Introdução à Eng. de Controle e Automação (60h)", cod2024: ["INTCON"], nome2024: "Introdução ao Controle e Automação (60h)", regra: "Equivalência direta por atualização de código" },
    { cod2019: "CALC-1", nome2019: "Cálculo 1 (60h)", cod2024: ["CALC-1"], nome2024: "Cálculo 1 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "ALGPRO", nome2019: "Algoritmos e Programação (60h)", cod2024: ["ALGPRO"], nome2024: "Algoritmos e Programação (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "ALGEOM", nome2019: "Álgebra Linear e Geometria Analítica (60h)", cod2024: ["ALGEOM"], nome2024: "Álgebra Linear e Geometria Analítica (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "QUIGER", nome2019: "Química Geral e Inorgânica (60h)", cod2024: ["QUIGER"], nome2024: "Química Geral (60h)", regra: "Equivalência direta (1 para 1)" },
    // 2º Semestre 2019
    { cod2019: "DESCAD", nome2019: "Desenho Auxiliado por Computador (60h)", cod2024: ["DESCAD"], nome2024: "Desenho Técnico 2 - CAD (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "ELEDIG", nome2019: "Eletrônica Digital (60h)", cod2024: ["ELEDIG"], nome2024: "Eletrônica Digital (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CALC-2", nome2019: "Cálculo 2 (60h)", cod2024: ["CALC-2"], nome2024: "Cálculo 2 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "PROGFUN", nome2019: "Programação Estruturada (60h)", cod2024: ["PROFUN"], nome2024: "Programação em Funções (60h)", regra: "Equivalência direta por atualização de código" },
    { cod2019: "FIS-1", nome2019: "Física 1 - Mecânica (60h)", cod2024: ["FIS-1"], nome2024: "Física 1 - Mecânica (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "METPESQ", nome2019: "Metodologia da Pesquisa (60h)", cod2024: ["METCIEN"], nome2024: "Metodologia Científica (30h)", regra: "Dispensa METCIEN (30h) + 30h aproveitadas" },
    // 3º Semestre 2019
    { cod2019: "CIEMAT", nome2019: "Ciência dos Materiais (60h)", cod2024: ["CIEMAT"], nome2024: "Ciência dos Materiais (30h)", regra: "Dispensa CIEMAT (30h)" },
    { cod2019: "MICROP", nome2019: "Microprocessadores (60h)", cod2024: ["MICPRO"], nome2024: "Microprocessadores (60h)", regra: "Equivalência direta por atualização de código" },
    { cod2019: "CALC-3", nome2019: "Cálculo 3 (60h)", cod2024: ["CALC-3"], nome2024: "Cálculo 3 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "PROGOO", nome2019: "Programação Orientada a Objetos (60h)", cod2024: ["PROGOO"], nome2024: "Programação Orientada a Objetos (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "FIS-2", nome2019: "Física 2 - Termodinâmica e Ondas (60h)", cod2024: ["FIS-2"], nome2024: "Física 2 - Oscilações, Ondas e Termodinâmica (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "ESTATAP", nome2019: "Estatística Aplicada (60h)", cod2024: ["ESTAT"], nome2024: "Probabilidade e Estatística (60h)", regra: "Equivalência direta por atualização de código" },
    // 4º Semestre 2019
    { cod2019: "MECSOL", nome2019: "Mecânica dos Sólidos (90h)", cod2024: ["MECSOL", "RESMAT"], nome2024: "Mecânica dos Sólidos (60h) + Resistência dos Materiais (60h)", regra: "Convalida MECSOL e RESMAT no novo currículo" },
    { cod2019: "ARQCOM", nome2019: "Arquitetura de Computadores (60h)", cod2024: ["ARQCOM"], nome2024: "Arquitetura de Computadores (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CALC-4", nome2019: "Cálculo 4 - EDO e Transformadas (60h)", cod2024: ["CALC-4"], nome2024: "Cálculo 4 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CIREL-1", nome2019: "Circuitos Elétricos 1 (60h)", cod2024: ["CIREL-1"], nome2024: "Circuitos Elétricos 1 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "FIS-3", nome2019: "Física 3 - Eletromagnetismo (60h)", cod2024: ["FIS-3"], nome2024: "Física 3 - Eletromagnetismo (60h)", regra: "Equivalência direta (1 para 1)" },
    // 5º Semestre 2019
    { cod2019: "PROCFAB", nome2019: "Processos de Fabricação (60h)", cod2024: ["PROCFAB"], nome2024: "Processos de Fabricação (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CAM", nome2019: "Manufatura Auxiliada por Computador (60h)", cod2024: ["CAM"], nome2024: "Manufatura Auxiliada por Computador - CAM (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CALNUM", nome2019: "Cálculo Numérico (60h)", cod2024: ["CALNUM"], nome2024: "Cálculo Numérico (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CIREL-2", nome2019: "Circuitos Elétricos 2 (60h)", cod2024: ["CIREL-2"], nome2024: "Circuitos Elétricos 2 (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "DISPEL", nome2019: "Dispositivos Eletrônicos (60h)", cod2024: ["DISPEL"], nome2024: "Dispositivos Eletrônicos (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "FENOTR", nome2019: "Fenômenos de Transporte (90h)", cod2024: ["FETRANS-MF", "FETRANS-CM"], nome2024: "Fenômenos de Transporte: Mec. Fluidos (60h) + Calor e Massa (30h)", regra: "Desmembrada em FETRANS-MF (60h) + FETRANS-CM (30h)" },
    // 6º Semestre 2019
    { cod2019: "SENSAT", nome2019: "Sensores e Atuadores (60h)", cod2024: ["SENSAT"], nome2024: "Sensores e Atuadores (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CONTROLA", nome2019: "Sistemas de Controle 1 (60h)", cod2024: ["MODSIS"], nome2024: "Modelagem e Simulação de Sistemas (60h)", regra: "Equivalência direta com MODSIS" },
    { cod2019: "SINAIS", nome2019: "Sinais e Sistemas Lineares (60h)", cod2024: ["SISCOND"], nome2024: "Sistemas de Condicionamento e Aquisição de Sinais (60h)", regra: "Equivalência com SISCOND" },
    { cod2019: "CONENE", nome2019: "Conversão Eletromecânica de Energia (60h)", cod2024: ["CONENE"], nome2024: "Conversão de Energia (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "LABEL", nome2019: "Laboratório de Eletrônica (60h)", cod2024: ["LABEL"], nome2024: "Laboratório de Circuitos Eletrônicos (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "TERMO", nome2019: "Termodinâmica Aplicada (60h)", cod2024: ["TERMO"], nome2024: "Termodinâmica (60h)", regra: "Equivalência direta (1 para 1)" },
    // 7º Semestre 2019
    { cod2019: "CLP", nome2019: "Controladores Lógicos Programáveis (60h)", cod2024: ["CLP"], nome2024: "Controladores Lógicos Programáveis (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CONTROLB", nome2019: "Sistemas de Controle 2 (60h)", cod2024: ["CONSIS"], nome2024: "Controle de Sistemas (60h)", regra: "Equivalência direta com CONSIS" },
    { cod2019: "REDES", nome2019: "Redes de Computadores e Industriais (60h)", cod2024: ["REDES"], nome2024: "Redes de Computadores (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "ACIONA", nome2019: "Acionamentos Elétricos e Eletrônica de Potência (90h)", cod2024: ["ACIONA"], nome2024: "Acionamentos Elétricos (60h)", regra: "Dispensa ACIONA (60h)" },
    { cod2019: "INSTEL", nome2019: "Instalações Elétricas Industriais (60h)", cod2024: ["INSTEL"], nome2024: "Instalações Elétricas (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "GESAMB", nome2019: "Gestão Ambiental (60h)", cod2024: ["GESAMB"], nome2024: "Gestão Ambiental 1 (60h)", regra: "Equivalência direta (1 para 1)" },
    // 8º Semestre 2019
    { cod2019: "ROBOT", nome2019: "Robótica Industrial (60h)", cod2024: ["ROBOT"], nome2024: "Robótica (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "SISSUP", nome2019: "Sistemas Supervisórios (60h)", cod2024: ["SISSUP"], nome2024: "Sistemas Supervisórios (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "CONTROLC", nome2019: "Controle Multivariável e Digital (60h)", cod2024: ["CONMUL"], nome2024: "Controle de Sistemas Multivariáveis (60h)", regra: "Equivalência direta com CONMUL" },
    { cod2019: "ECOENG", nome2019: "Economia da Engenharia (60h)", cod2024: ["ECOENG"], nome2024: "Economia da Engenharia (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "INOVEMP", nome2019: "Inovação e Empreendedorismo (60h)", cod2024: ["GESINOV", "ADMEMP"], nome2024: "Gestão da Inovação (30h) + Administração e Empreendedorismo (60h)", regra: "Convalida GESINOV e ADMEMP" },
    // 9º e 10º Semestres 2019
    { cod2019: "INTSIS", nome2019: "Integração de Sistemas Industriais (60h)", cod2024: ["INTSIS"], nome2024: "Integração de Sistemas (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "GESPRO", nome2019: "Gestão de Projetos (60h)", cod2024: ["GESPRO"], nome2024: "Gestão de Projetos (60h)", regra: "Equivalência direta (1 para 1)" },
    { cod2019: "PROJTCC", nome2019: "Projeto de Trabalho de Conclusão (60h)", cod2024: ["TCC1"], nome2024: "Trabalho de Conclusão 1 (30h)", regra: "Dispensa TCC1" },
    { cod2019: "TCC", nome2019: "Trabalho de Conclusão de Curso (60h)", cod2024: ["TCC2"], nome2024: "Trabalho de Conclusão 2 (60h)", regra: "Dispensa TCC2" },
    { cod2019: "ESTAGIO", nome2019: "Estágio Curricular Obrigatório (165h)", cod2024: ["ESTAGIO"], nome2024: "Estágio Supervisionado (165h)", regra: "Equivalência integral (165h)" },
    { cod2019: "ELET-1", nome2019: "Eletiva 1 (60h)", cod2024: ["ELET-1"], nome2024: "Eletiva 1 (60h)", regra: "Aproveitamento integral de créditos eletivos" }
  ],
  mobilidadeInternaQuadro6: [
    { cursoDestino: "Engenharia de Energia (Unidade Porto Alegre)", componentesComuns: "Cálculo I, II, III e IV, Álgebra Linear e Geometria Analítica, Física I, II e III, Química Geral, Desenho Técnico I e CAD, Ciência dos Materiais, Mecânica dos Sólidos, Resistência dos Materiais, Fenômenos de Transporte, Termodinâmica, Circuitos Elétricos I e II, Conversão de Energia, Instalações Elétricas, Gestão Ambiental, Economia da Engenharia e Administração.", percentualComum: "~52% do núcleo básico/profissionalizante compartilhado no mesmo Campus" },
    { cursoDestino: "Engenharia de Bioprocessos e Biotecnologia (Unidade Porto Alegre)", componentesComuns: "Cálculo I, II e III, Álgebra Linear, Física I, II e III, Química Geral, Probabilidade e Estatística, Metodologia Científica, Fenômenos de Transporte (Mecânica dos Fluidos e Calor/Massa), Termodinâmica, Eletrônica/Instrumentação Básica e Gestão Ambiental.", percentualComum: "~38% de equivalência direta no Campus Central Porto Alegre" },
    { cursoDestino: "Engenharia de Computação (Unidade Guaíba)", componentesComuns: "Algoritmos e Programação, Programação em Funções, Programação Orientada a Objetos, Arquitetura de Computadores, Eletrônica Digital, Microprocessadores, Redes de Computadores, Inteligência Artificial, Processamento Digital de Imagens, Cálculos I–IV e Físicas I–III.", percentualComum: "~48% de equivalência direta (núcleo de computação, sistemas embarcados e exatas)" },
    { cursoDestino: "Curso Superior de Tecnologia em Automação Industrial (Novo Hamburgo)", componentesComuns: "Eletrônica Digital, Microprocessadores, Circuitos Elétricos, Dispositivos Eletrônicos, Sensores e Atuadores, CLPs, Sistemas Supervisórios, Robótica, Acionamentos Elétricos, Hidráulica e Pneumática e Desenho CAD.", percentualComum: "Aproveitamento direto nas disciplinas profissionalizantes de automação (Anexo H)" }
  ]
};

/* =====================================================================
 *  EMENTÁRIO OFICIAL, OBJETIVOS, LABORATÓRIOS (TABELA 14) & BIBLIOGRAFIA BÁSICA
 *  (Extraído integralmente dos Quadros 8 a 77 do PPC 2024 Vigente)
 * ===================================================================== */
export const EMENTARIO_PPC2024 = {
  "DESTEC": {
    ementa: "Introdução ao Desenho Técnico. Normas ABNT. Caligrafia técnica. Escalas. Construções geométricas fundamentais. Teoria das projeções: vistas ortográficas principais, auxiliares e seccionais (cortes e seções). Perspectivas isométrica e cavaleira. Cotagem e dimensionamento básico.",
    objetivo: "Capacitar o estudante a ler, interpretar e executar desenhos técnicos mecânicos e industriais rigorosamente dentro das normas da ABNT.",
    bibliografia: [
      "FRENCH, T. E.; VIERCK, C. J. Desenho Técnico e Tecnologia Gráfica. Porto Alegre: Bookman.",
      "SILVA, A. et al. Desenho Técnico Moderno. Rio de Janeiro: LTC.",
      "ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS (ABNT). Coletânea de Normas de Desenho Técnico (NBR 8403, NBR 10067, NBR 10126)."
    ],
    chPraticaLab: "30h em pranchetas e instrumentação gráfica"
  },
  "INTCON": {
    ementa: "Histórico, evolução e atribuições legais do Engenheiro de Controle e Automação (CONFEA/CREA). Estrutura curricular do PPC 2024. Conceitos de malha aberta e malha fechada (realimentação). Visão sistêmica de sensores, controladores, atuadores, robótica e Indústria 4.0. Ética profissional.",
    objetivo: "Apresentar os fundamentos da Engenharia de Controle e Automação, o perfil profissional, os laboratórios da UERGS e a concepção de sistemas realimentados.",
    bibliografia: [
      "BOLTON, W. Engenharia de Controle. São Paulo: Makron Books.",
      "GROOVER, M. P. Automação Industrial e Sistemas de Manufatura. São Paulo: Pearson.",
      "BAZZO, W. A.; PEREIRA, L. T. V. Introdução à Engenharia: Conceitos, Ferramentas e Comportamentos. Florianópolis: Ed. UFSC."
    ],
    chPraticaLab: "Visitas guiadas às bancadas de CLP, Robótica e Eletrônica"
  },
  "CALC-1": {
    ementa: "Números reais, funções reais de uma variável real. Limites e continuidade. Derivada e regras de derivação. Aplicações da derivada: taxas relacionadas, otimização e traçado de gráficos. Integral definida e indefinida. Teorema Fundamental do Cálculo. Técnicas de integração e cálculo de áreas/volumes.",
    objetivo: "Fornecer a base do cálculo diferencial e integral de uma variável indispensável para a modelagem física e matemática na engenharia.",
    bibliografia: [
      "STEWART, J. Cálculo — Volume 1. São Paulo: Cengage Learning.",
      "ANTON, H.; BIVENS, I.; DAVIS, S. Cálculo — Volume 1. Porto Alegre: Bookman.",
      "THOMAS, G. B. et al. Cálculo — Volume 1. São Paulo: Pearson Addison Wesley."
    ],
    chPraticaLab: "Teórica com resolução de problemas aplicados"
  },
  "ALGPRO": {
    ementa: "Lógica de programação e construção de algoritmos. Variáveis, tipos de dados, operadores aritméticos, relacionais e lógicos. Estruturas de controle condicional (if/else, switch) e de repetição (for, while). Vetores, matrizes e strings. Entrada e saída de dados em linguagem C/Python.",
    objetivo: "Desenvolver o raciocínio lógico-algorítmico e a capacidade de implementar programas estruturados para solução de problemas de engenharia.",
    bibliografia: [
      "FORBELLONE, A. L. V.; EBERSPÄCHER, H. F. Lógica de Programação: A Construção de Algoritmos e Estruturas de Dados. São Paulo: Pearson.",
      "SCHILDT, H. C Completo e Total. São Paulo: Makron Books.",
      "MANZANO, J. A. N. G.; OLIVEIRA, J. F. Algoritmos: Lógica para Desenvolvimento de Programação de Computadores. São Paulo: Érica."
    ],
    chPraticaLab: "60h em Laboratório de Informática (100% prática)"
  },
  "ALGEOM": {
    ementa: "Vetores no plano e no espaço: produtos escalar, vetorial e misto. Retas e planos em R³. Matrizes, determinantes e sistemas de equações lineares (escalonamento de Gauss). Espaços vetoriais, subespaços, base e dimensão. Transformações lineares, autovalores e autovetores.",
    objetivo: "Dominar a álgebra matricial, espaços vetoriais e geometria analítica 3D essenciais para cinemática robótica, espaço de estados e computação gráfica.",
    bibliografia: [
      "ANTON, H.; RORRES, C. Álgebra Linear com Aplicações. Porto Alegre: Bookman.",
      "STEINBRUCH, A.; WINTERLE, P. Álgebra Linear. São Paulo: Pearson Makron Books.",
      "WINTERLE, P. Vetores e Geometria Analítica. São Paulo: Pearson."
    ],
    chPraticaLab: "Teórica com apoio computacional"
  },
  "DESCAD": {
    ementa: "Sistemas CAD (Computer-Aided Design) bidimensionais e tridimensionais. Modelagem paramétrica de peças mecânicas sólidas. Montagens de conjuntos mecânicos, restrições cinemáticas e detecção de interferência. Geração automática de vistas, cortes, detalhamento, tolerâncias e listas de materiais (BOM).",
    objetivo: "Habilitar o estudante no projeto assistido por computador (CAD 2D/3D) de componentes e sistemas eletromecânicos e robóticos.",
    bibliografia: [
      "FIALHO, A. B. SolidWorks Office Premium: Teoria e Prática no Desenvolvimento de Produtos Industriais. São Paulo: Érica.",
      "SILVA, A. et al. Desenho Técnico Moderno. Rio de Janeiro: LTC.",
      "RIBEIRO, A. C.; PERES, M. P.; IZIDORO, N. Curso de Desenho Técnico e AutoCAD. São Paulo: Pearson."
    ],
    chPraticaLab: "60h em Laboratório de Informática / Estações CAD"
  },
  "ELEDIG": {
    ementa: "Sistemas de numeração (binário, octal, hexadecimal) e códigos digitais (BCD, Gray, ASCII). Álgebra de Boole, portas lógicas e famílias lógicas (TTL/CMOS). Simplificação por Mapas de Karnaugh. Circuitos combinacionais (codificadores, multiplexadores, ULA). Latches, Flip-Flops, registradores e contadores síncronos/assíncronos. Máquinas de estados finitos.",
    objetivo: "Projetar, simular e montar circuitos digitais combinacionais e sequenciais aplicados a sistemas de controle e microprocessadores.",
    bibliografia: [
      "TOCCI, R. J.; WIDMER, N. S.; MOSS, G. L. Sistemas Digitais: Princípios e Aplicações. São Paulo: Pearson.",
      "FLOYD, T. L. Sistemas Digitais: Fundamentos e Aplicações. Porto Alegre: Bookman.",
      "IDOETA, I. V.; CAPUANO, F. G. Elementos de Eletrônica Digital. São Paulo: Érica."
    ],
    chPraticaLab: "30h no Laboratório de Eletrônica e Sinais (Tabela 14)"
  },
  "CALC-2": {
    ementa: "Sequências e séries numéricas; séries de potências, Taylor e Maclaurin. Funções de várias variáveis: limite, continuidade, derivadas parciais, vetor gradiente, derivada direcional e otimização com multiplicadores de Lagrange. Integrais duplas e triplas em coordenadas cartesianas, polares, cilíndricas e esféricas.",
    objetivo: "Estender as ferramentas do cálculo diferencial e integral para funções multivariáveis e séries infinitas aplicadas à física e ao controle.",
    bibliografia: [
      "STEWART, J. Cálculo — Volume 2. São Paulo: Cengage Learning.",
      "ANTON, H.; BIVENS, I.; DAVIS, S. Cálculo — Volume 2. Porto Alegre: Bookman.",
      "THOMAS, G. B. et al. Cálculo — Volume 2. São Paulo: Pearson."
    ],
    chPraticaLab: "Teórica"
  },
  "PROFUN": {
    ementa: "Modularização de programas: funções, passagem de parâmetros por valor e por referência, escopo de variáveis e recursividade. Ponteiros e alocação dinâmica de memória em C. Estruturas de dados heterogêneas (structs, unions, enums). Manipulação de arquivos binários e texto. Bibliotecas modulares.",
    objetivo: "Aprofundar a programação em linguagem C com domínio de ponteiros, estruturas e modularização voltada a firmware e sistemas de engenharia.",
    bibliografia: [
      "DEITEL, P.; DEITEL, H. C: Como Programar. São Paulo: Pearson.",
      "CELES, W.; CERQUEIRA, R.; RANGEL, J. L. Introdução a Estruturas de Dados com Técnicas de Programação em C. Rio de Janeiro: Elsevier.",
      "KERNIGHAN, B. W.; RITCHIE, D. M. C: A Linguagem de Programação Padrão ANSI. Rio de Janeiro: Campus."
    ],
    chPraticaLab: "60h em Laboratório de Informática"
  },
  "QUIGER": {
    ementa: "Estrutura atômica, tabela periódica e ligações químicas (iônica, covalente e metálica). Estequiometria e soluções. Termoquímica e cinética química. Equilíbrio químico, ácidos e bases. Eletroquímica: células galvânicas, eletrólise, potenciais de eletrodo, baterias e mecanismos de corrosão em materiais industriais.",
    objetivo: "Compreender os princípios químicos e eletroquímicos fundamentais para seleção de materiais, sensores químicos, baterias e prevenção de corrosão.",
    bibliografia: [
      "BROWN, T. L. et al. Química: A Ciência Central. São Paulo: Pearson.",
      "ATKINS, P.; JONES, L. Princípios de Química: Questionando a Vida Moderna e o Meio Ambiente. Porto Alegre: Bookman.",
      "RUSSELL, J. B. Química Geral — Volumes 1 e 2. São Paulo: Makron Books."
    ],
    chPraticaLab: "15h no Laboratório de Química (Tabela 14)"
  },
  "FIS-1": {
    ementa: "Grandezas físicas, vetores e cinemática escalar e vetorial em 1D, 2D e 3D. Leis de Newton e aplicações dinâmicas. Trabalho, energia cinética, energia potencial e conservação da energia mecânica. Centro de massa, momento linear e colisões. Cinemática e dinâmica de rotação de corpos rígidos, torque e momento de inércia.",
    objetivo: "Analisar e equacionar o movimento translacional e rotacional de sistemas mecânicos sob ação de forças e torques.",
    bibliografia: [
      "HALLIDAY, D.; RESNICK, R.; WALKER, J. Fundamentos de Física — Vol. 1: Mecânica. Rio de Janeiro: LTC.",
      "TIPLER, P. A.; MOSCA, G. Física para Cientistas e Engenheiros — Vol. 1. Rio de Janeiro: LTC.",
      "NUSSENZVEIG, H. M. Curso de Física Básica — Vol. 1: Mecânica. São Paulo: Blucher."
    ],
    chPraticaLab: "15h no Laboratório de Física (Tabela 14)"
  },
  "COMPEX": {
    ementa: "Conceitos, diretrizes e história da Extensão Universitária (indissociabilidade ensino-pesquisa-extensão). Diagnóstico de demandas socioambientais e tecnológicas na comunidade de Porto Alegre/RS. Diálogo de saberes e elaboração participativa de ações de divulgação científica e tecnológica.",
    objetivo: "Inserir o estudante na vivência extensionista universitária, mapeando desafios reais da sociedade onde a engenharia pode gerar transformação social.",
    bibliografia: [
      "FORPROEX. Política Nacional de Extensão Universitária. Manaus: Fórum de Pró-Reitores de Extensão das Instituições Públicas de Educação Superior Brasileiras, 2012.",
      "FREIRE, P. Extensão ou Comunicação? Rio de Janeiro: Paz e Terra.",
      "THIOLLENT, M. Metodologia da Pesquisa-Ação. São Paulo: Cortez."
    ],
    chPraticaLab: "60h de Curricularização da Extensão em campo/comunidade"
  },
  "CIEMAT": {
    ementa: "Classificação dos materiais de engenharia: metais, polímeros, cerâmicos, compósitos e semicondutores. Estrutura cristalina e defeitos. Difusão e diagramas de fases (sistema Ferro-Carbono). Propriedades mecânicas, elétricas, térmicas e magnéticas aplicadas a sensores e atuadores.",
    objetivo: "Relacionar a microestrutura dos materiais às suas propriedades macroscópicas mecânicas e eletroeletrônicas para especificação em projetos.",
    bibliografia: [
      "CALLISTER JR., W. D.; RETHWISCH, D. G. Ciência e Engenharia de Materiais: Uma Introdução. Rio de Janeiro: LTC.",
      "ASKELAND, D. R.; WRIGHT, W. J. Ciência e Engenharia dos Materiais. São Paulo: Cengage Learning.",
      "SHACKELFORD, J. F. Ciência dos Materiais. São Paulo: Pearson."
    ],
    chPraticaLab: "Ensaios demonstrativos de materiais"
  },
  "MICPRO": {
    ementa: "Arquitetura interna de microprocessadores e microcontroladores (CPU, barramentos, memória Flash/RAM/EEPROM, registradores especiais). Portas de E/S digital (GPIO), interrupções externas e por temporizadores (Timers/Counters), modulação PWM, conversores A/D (ADC) e interfaces seriais (UART, SPI, I2C). Programação em C/Assembly para sistemas embarcados.",
    objetivo: "Projetar hardware e firmware embarcado utilizando microcontroladores para leitura de sensores, atuação PWM e comunicação serial.",
    bibliografia: [
      "MAZIDI, M. A.; NAIMI, S.; NAIMI, S. The AVR Microcontroller and Embedded Systems: Using Assembly and C. Pearson.",
      "OLIVEIRA, A. S.; ANDRADE, F. S. Sistemas Embarcados: Hardware e Firmware na Prática. São Paulo: Érica.",
      "ZANCO, W. S. Microcontroladores PIC / ARM: Conceitos, Projeto e Programação em C. São Paulo: Érica."
    ],
    chPraticaLab: "45h em Laboratório de Microprocessadores e Sistemas Embarcados (Tabela 14)"
  },
  "CALC-3": {
    ementa: "Funções vetoriais e curvas no espaço. Campos vetoriais: divergente e rotacional. Integrais de linha e campos conservativos. Integrais de superfície. Teoremas clássicos da análise vetorial: Teorema de Green, Teorema de Stokes e Teorema da Divergência de Gauss com aplicações ao eletromagnetismo e mecânica dos fluidos.",
    objetivo: "Dominar o cálculo vetorial diferencial e integral indispensável para o eletromagnetismo (equações de Maxwell) e fenômenos de transporte.",
    bibliografia: [
      "STEWART, J. Cálculo — Volume 2. São Paulo: Cengage Learning.",
      "THOMAS, G. B. et al. Cálculo — Volume 2. São Paulo: Pearson.",
      "ANTON, H.; BIVENS, I.; DAVIS, S. Cálculo — Volume 2. Porto Alegre: Bookman."
    ],
    chPraticaLab: "Teórica"
  },
  "PROGOO": {
    ementa: "Paradigma da Programação Orientada a Objetos (POO): classes, objetos, atributos e métodos. Encapsulamento, construtores e destrutores. Herança simples e múltipla, polimorfismo e interfaces/classes abstratas. Tratamento de exceções, coleções genéricas (STL/Collections) e padrões de projeto aplicados a sistemas de automação.",
    objetivo: "Desenvolver softwares modulares, reutilizáveis e robustos utilizando Programação Orientada a Objetos (C++ / Python / Java).",
    bibliografia: [
      "DEITEL, P.; DEITEL, H. C++: Como Programar. São Paulo: Pearson.",
      "BOOCH, G.; RUMBAUGH, J.; JACOBSON, I. UML: Guia do Usuário. Rio de Janeiro: Elsevier.",
      "GAMMA, E. et al. Padrões de Projetos: Soluções Reutilizáveis de Software Orientado a Objetos. Porto Alegre: Bookman."
    ],
    chPraticaLab: "60h em Laboratório de Informática"
  },
  "FIS-2": {
    ementa: "Estática dos fluidos e hidrodinâmica básica. Oscilações: Movimento Harmônico Simples (MHS), pêndulos, oscilações amortecidas e forçadas (ressonância). Ondas mecânicas e acústica. Temperatura, calor, dilatação térmica, teoria cinética dos gases e Leis da Termodinâmica (1ª e 2ª Leis, máquinas térmicas e entropia).",
    objetivo: "Compreender sistemas oscilatórios amortecidos/forçados, propagação de ondas e os princípios fundamentais da termodinâmica.",
    bibliografia: [
      "HALLIDAY, D.; RESNICK, R.; WALKER, J. Fundamentos de Física — Vol. 2: Gravitação, Ondas e Termodinâmica. Rio de Janeiro: LTC.",
      "TIPLER, P. A.; MOSCA, G. Física para Cientistas e Engenheiros — Vol. 1 e 2. Rio de Janeiro: LTC.",
      "NUSSENZVEIG, H. M. Curso de Física Básica — Vol. 2: Fluidos, Oscilações e Ondas, Calor. São Paulo: Blucher."
    ],
    chPraticaLab: "15h no Laboratório de Física (Tabela 14)"
  },
  "ESTAT": {
    ementa: "Estatística descritiva: medidas de posição, dispersão e representações gráficas. Teoria das probabilidades, probabilidade condicional e Teorema de Bayes. Variáveis aleatórias discretas e contínuas (Binomial, Poisson, Normal, Student, Weibull). Amostragem, intervalos de confiança, testes de hipóteses, correlação e regressão linear.",
    objetivo: "Aplicar métodos probabilísticos e estatísticos na análise de incertezas de medição, controle estatístico de processos (CEP) e confiabilidade.",
    bibliografia: [
      "MONTGOMERY, D. C.; RUNGER, G. C. Estatística Aplicada e Probabilidade para Engenheiros. Rio de Janeiro: LTC.",
      "DEVORE, J. L. Probabilidade e Estatística para Engenharia e Ciências. São Paulo: Cengage Learning.",
      "MORETTIN, P. A.; BUSSAB, W. O. Estatística Básica. São Paulo: Saraiva."
    ],
    chPraticaLab: "Práticas de análise de dados em computador"
  },
  "METCIEN": {
    ementa: "A natureza do conhecimento científico e tecnológico. Métodos de pesquisa na engenharia (experimental, simulação, estudo de caso). Estruturação de projetos de pesquisa, artigos científicos, relatórios técnicos e Trabalho de Conclusão de Curso (TCC). Normas da ABNT para citações e referências. Ética na pesquisa e propriedade intelectual.",
    objetivo: "Capacitar o estudante na redação científica, revisão bibliográfica em bases indexadas e elaboração de projetos de pesquisa/TCC.",
    bibliografia: [
      "GIL, A. C. Como Elaborar Projetos de Pesquisa. São Paulo: Atlas.",
      "MARCONI, M. A.; LAKATOS, E. M. Fundamentos de Metodologia Científica. São Paulo: Atlas.",
      "WAZLAWICK, R. S. Metodologia de Pesquisa para Ciência da Computação e Engenharia. Rio de Janeiro: Elsevier."
    ],
    chPraticaLab: "Elaboração de pré-projeto científico"
  },
  "MECSOL": {
    ementa: "Estática das partículas e dos corpos rígidos em 2D e 3D. Diagramas de corpo livre, equações de equilíbrio e vínculos estruturais. Análise de estruturas: treliças, pórticos e máquinas. Forças distribuídas, centroides, baricentros e momentos de inércia de área. Esforços internos solicitantes (normal, cortante, fletor e torsor). Atrito seco.",
    objetivo: "Determinar reações de apoio e esforços solicitantes em estruturas, mecanismos e braços robóticos em equilíbrio estático.",
    bibliografia: [
      "HIBBELER, R. C. Estática: Mecânica para Engenharia. São Paulo: Pearson.",
      "BEER, F. P.; JOHNSTON JR., E. R.; MAZUREK, D. F. Mecânica Vetorial para Engenheiros: Estática. Porto Alegre: AMGH.",
      "MERIAM, J. L.; KRAIGE, L. G. Mecânica para Engenharia: Estática. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "Teórica com estudos de caso mecânicos"
  },
  "ARQCOM": {
    ementa: "Organização de computadores: CPU, caminho de dados, unidade de controle (RISC vs CISC), pipeline de instruções. Hierarquia de memória: cache, memória principal e virtual. Barramentos, sistemas de Entrada/Saída (polling, interrupção, DMA). Arquiteturas paralelas (SIMD, MIMD, multicore) e sistemas operacionais de tempo real (RTOS).",
    objetivo: "Compreender a arquitetura de hardware de processadores modernos, hierarquia de memória e mecanismos determinísticos de E/S para automação.",
    bibliografia: [
      "STALLINGS, W. Arquitetura e Organização de Computadores. São Paulo: Pearson.",
      "TANENBAUM, A. S.; AUSTIN, T. Organização Estruturada de Computadores. São Paulo: Pearson.",
      "PATTERSON, D. A.; HENNESSY, J. L. Organização e Projeto de Computadores: A Interface Hardware/Software. Rio de Janeiro: Elsevier."
    ],
    chPraticaLab: "Simulação de arquiteturas e RTOS"
  },
  "CALC-4": {
    ementa: "Equações Diferenciais Ordinárias (EDOs) de 1ª ordem e de ordem superior lineares com coeficientes constantes. Sistemas de EDOs lineares. Resolução de EDOs por séries de potências. Transformada de Laplace e Transformada Inversa: propriedades, teorema da convolução e resolução de problemas de valor inicial (PVI). Séries e Transformada de Fourier.",
    objetivo: "Dominar as Equações Diferenciais e as Transformadas de Laplace e Fourier, alicerces matemáticos diretos da engenharia de controle e processamento de sinais.",
    bibliografia: [
      "ZILL, D. G.; CULLEN, M. R. Equações Diferenciais — Volumes 1 e 2. São Paulo: Pearson Makron Books.",
      "BOYCE, W. E.; DIPRIMA, R. C. Equações Diferenciais Elementares e Problemas de Valores de Contorno. Rio de Janeiro: LTC.",
      "KREYSZIG, E. Matemática Superior para Engenharia — Volumes 1 e 2. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "Teórica com simulação simbólica/numérica"
  },
  "CIREL-1": {
    ementa: "Grandezas elétricas, bipolos lineares (resistores, fontes independentes e dependentes) e Leis de Kirchhoff (LKT e LKC). Métodos sistemáticos de análise nodal e análise de malhas. Teoremas da Superposição, Thévenin, Norton e Máxima Transferência de Potência. Capacitores e indutores. Circuitos de 1ª ordem (RC e RL) e de 2ª ordem (RLC) em regime transitório e permanente CC.",
    objetivo: "Analisar circuitos elétricos lineares em corrente contínua e regime transitório de 1ª e 2ª ordem.",
    bibliografia: [
      "ALEXANDER, C. K.; SADIKU, M. N. O. Fundamentos de Circuitos Elétricos. Porto Alegre: AMGH.",
      "NILSSON, J. W.; RIEDEL, S. A. Circuitos Elétricos. São Paulo: Pearson.",
      "IRWIN, J. D.; NELMS, R. M. Análise Básica de Circuitos para Engenharia. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "15h no Laboratório de Eletrônica e Circuitos (Tabela 14)"
  },
  "FIS-3": {
    ementa: "Carga elétrica, Lei de Coulomb e Campo Elétrico. Lei de Gauss. Potencial elétrico, capacitância e dielétricos. Corrente elétrica, resistência e circuitos CC. Campo magnético, força de Lorentz, Lei de Biot-Savart e Lei de Ampère. Lei da Indução de Faraday-Lenz, indutância e propriedades magnéticas da matéria. Equações de Maxwell na forma integral e diferencial.",
    objetivo: "Compreender os fenômenos eletrostáticos, magnetostáticos e eletrodinâmicos regidos pelas Equações de Maxwell.",
    bibliografia: [
      "HALLIDAY, D.; RESNICK, R.; WALKER, J. Fundamentos de Física — Vol. 3: Eletromagnetismo. Rio de Janeiro: LTC.",
      "TIPLER, P. A.; MOSCA, G. Física para Cientistas e Engenheiros — Vol. 2: Eletricidade e Magnetismo. Rio de Janeiro: LTC.",
      "NUSSENZVEIG, H. M. Curso de Física Básica — Vol. 3: Eletromagnetismo. São Paulo: Blucher."
    ],
    chPraticaLab: "15h no Laboratório de Física (Tabela 14)"
  },
  "PROJEXT-1": {
    ementa: "Planejamento, concepção e início da execução de projetos de extensão tecnológica junto à comunidade externa (escolas públicas, cooperativas, hospitais, microempresas ou organizações sociais), aplicando conhecimentos de programação, robótica educacional, eletrônica e automação.",
    objetivo: "Conceber e prototipar soluções de engenharia voltadas a demandas reais da comunidade externa em equipes multidisciplinares.",
    bibliografia: [
      "THIOLLENT, M. Metodologia da Pesquisa-Ação. São Paulo: Cortez.",
      "RESOLUÇÃO CONEPE/UERGS Nº 019/2020. Regulamenta a Curricularização da Extensão na UERGS.",
      "PINHEIRO, T.; ALT, L. Design Thinking Brasil: Empatia, Colaboração e Experimentação. Rio de Janeiro: Alta Books."
    ],
    chPraticaLab: "60h de Curricularização da Extensão (Formato 1)"
  },
  "RESMAT": {
    ementa: "Conceito de tensão normal e de cisalhamento; deformação elástica e Lei de Hooke. Ensaios de tração/compressão, coeficiente de segurança e tensões admissíveis. Torção em eixos circulares e transmissão de potência mecânica. Flexão pura e simples em vigas. Cisalhamento transversal. Estado plano de tensões (Círculo de Mohr), critérios de falha (Von Mises/Tresca) e flambagem de colunas.",
    objetivo: "Dimensionar eixos, transmissões, suportes e estruturas mecânicas contra escoamento, fadiga e flambagem.",
    bibliografia: [
      "HIBBELER, R. C. Resistência dos Materiais. São Paulo: Pearson.",
      "BEER, F. P. et al. Mecânica dos Materiais. Porto Alegre: AMGH.",
      "NORTON, R. L. Projeto de Máquinas: Uma Abordagem Integrada. Porto Alegre: Bookman."
    ],
    chPraticaLab: "Análise estrutural e dimensionamento mecânico"
  },
  "CALNUM": {
    ementa: "Aritmética de ponto flutuante e análise de erros de arredondamento e truncamento. Zeros de funções reais (Bisseção, Newton-Raphson, Secante). Resolução numérica de sistemas lineares (Eliminação de Gauss, Decomposição LU, Gauss-Jacobi e Gauss-Seidel). Interpolação polinomial (Lagrange, Newton) e ajuste de curvas por mínimos quadrados. Integração numérica (Trapézio, Simpson) e solução numérica de EDOs (Euler, Runge-Kutta).",
    objetivo: "Implementar algoritmos numéricos computacionais para resolver equações diferenciais, sistemas matriciais e ajustes de dados experimentais.",
    bibliografia: [
      "RUGGIERO, M. A. G.; LOPES, V. L. R. Cálculo Numérico: Aspectos Teóricos e Computacionais. São Paulo: Makron Books.",
      "CHAPRA, S. C.; CANALE, R. P. Métodos Numéricos para Engenharia. Porto Alegre: AMGH.",
      "BURDEN, R. L.; FAIRES, J. D. Análise Numérica. São Paulo: Cengage Learning."
    ],
    chPraticaLab: "30h em Laboratório de Informática (Python / MATLAB / Scilab)"
  },
  "CIREL-2": {
    ementa: "Análise de circuitos em regime permanente senoidal (CA): fasores, impedância e admitância complexa. Potência em circuitos CA: instantânea, ativa (W), reativa (VAr), aparente (VA), fator de potência e correção do fator de potência. Circuitos polifásicos: sistemas trifásicos equilibrados e desequilibrados (ligações Estrela Y e Triângulo Δ). Resposta em frequência, Diagramas de Bode, filtros passivos e circuitos magneticamente acoplados (transformadores).",
    objetivo: "Dominar a análise fasorial CA, circuitos trifásicos industriais, correção de fator de potência e resposta em frequência (Bode).",
    bibliografia: [
      "ALEXANDER, C. K.; SADIKU, M. N. O. Fundamentos de Circuitos Elétricos. Porto Alegre: AMGH.",
      "NILSSON, J. W.; RIEDEL, S. A. Circuitos Elétricos. São Paulo: Pearson.",
      "BOYLESTAD, R. L. Introdução à Análise de Circuitos. São Paulo: Pearson."
    ],
    chPraticaLab: "15h no Laboratório de Eletrônica e Circuitos (Tabela 14)"
  },
  "DISPEL": {
    ementa: "Física dos semicondutores (junção PN). Diodos semicondutores: retificadores, circuitos ceifadores, grampeadores, diodo Zener e LEDs/fotodiodos. Transistores Bipolares de Junção (TBJ/BJT): polarização CC, modelagem para pequenos sinais e amplificadores. Transistores de Efeito de Campo (JFET e MOSFET) como amplificadores e chaves eletrônicas. Amplificadores Operacionais (AmpOp) ideais e reais: configurações lineares e não-lineares.",
    objetivo: "Analisar e projetar circuitos eletrônicos analógicos com diodos, transistores BJT/MOSFET e amplificadores operacionais.",
    bibliografia: [
      "SEDRA, A. S.; SMITH, K. C. Microeletrônica. São Paulo: Pearson.",
      "BOYLESTAD, R. L.; NASHELSKY, L. Dispositivos Eletrônicos e Teoria de Circuitos. São Paulo: Pearson.",
      "MALVINO, A.; BATES, D. J. Eletrônica — Volumes 1 e 2. Porto Alegre: AMGH."
    ],
    chPraticaLab: "15h no Laboratório de Eletrônica (Tabela 14)"
  },
  "FISAUT": {
    ementa: "Princípios físicos aplicados diretamente à instrumentação e automação: piezoeletricidade, efeito Hall, efeito termoelétrico (Seebeck/Peltier), fotorresistividade e efeito fotoelétrico, extensometria (strain gauges), óptica e lasers para sensoriamento industrial, propagação de ultrassom e física de atuadores eletromagnéticos e pneumáticos.",
    objetivo: "Conectar os fenômenos da física clássica e moderna aos princípios transdutores utilizados nos sensores e atuadores industriais.",
    bibliografia: [
      "FRADEN, J. Handbook of Modern Sensors: Physics, Designs, and Applications. Springer.",
      "THOMAZINI, D.; ALBUQUERQUE, P. U. B. Sensores Industriais: Fundamentos e Aplicações. São Paulo: Érica.",
      "HALLIDAY, D.; RESNICK, R.; WALKER, J. Fundamentos de Física — Vol. 3 e 4. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "15h de experimentos com transdutores físicos"
  },
  "PROJEXT-2": {
    ementa: "Execução em campo, implantação, validação junto ao público-alvo e documentação técnica/social dos projetos de extensão desenvolvidos com a comunidade externa. Avaliação de impacto social e apresentação pública dos resultados.",
    objetivo: "Consolidar a entrega de soluções tecnológicas e educacionais à comunidade, cumprindo o ciclo completo da extensão universitária.",
    bibliografia: [
      "RESOLUÇÃO CONEPE/UERGS Nº 019/2020. Regulamenta a Curricularização da Extensão na UERGS.",
      "FORPROEX. Avaliação Nacional da Extensão Universitária. Brasília: MEC.",
      "THIOLLENT, M. Metodologia da Pesquisa-Ação. São Paulo: Cortez."
    ],
    chPraticaLab: "60h de Curricularização da Extensão em campo (Formato 1)"
  },
  "PROCFAB": {
    ementa: "Metrologia dimensional, tolerâncias ISO e acabamento superficial. Processos de conformação mecânica (laminação, forjamento, estampagem), fundição e metalurgia do pó. Processos de usinagem convencional (torneamento, fresamento, furação, retificação) e não-convencional. Processos de soldagem industrial (MIG/MAG, TIG, arco submerso, solda a ponto robótica) e manufatura aditiva (impressão 3D).",
    objetivo: "Compreender as rotas de manufatura mecânica, metrologia e soldagem que compõem o chão de fábrica automatizado.",
    bibliografia: [
      "GROOVER, M. P. Introdução aos Processos de Fabricação. Rio de Janeiro: LTC.",
      "CHIAVERINI, V. Tecnologia Mecânica — Volumes I, II e III. São Paulo: McGraw-Hill.",
      "MACHADO, A. R. et al. Teoria da Usinagem dos Materiais. São Paulo: Blucher."
    ],
    chPraticaLab: "15h de práticas de metrologia e manufatura"
  },
  "MODSIS": {
    ementa: "Metodologias de modelagem de sistemas dinâmicos: modelos caixa-branca (leis físicas), caixa-cinza e caixa-preta (identificação experimental). Modelagem de sistemas elétricos, mecânicos translacionais/rotacionais, eletromecânicos (motores CC), hidráulicos, pneumáticos e térmicos. Linearização em torno de pontos de operação. Representação por Funções de Transferência (Laplace), Diagramas de Blocos, Fluxo de Sinal e Espaço de Estados. Resposta temporal de 1ª e 2ª ordem e simulação computacional.",
    objetivo: "Equacionar matematicamente sistemas físicos de múltiplas naturezas e simular sua resposta dinâmica no domínio do tempo e da frequência.",
    bibliografia: [
      "OGATA, K. Engenharia de Controle Moderno. São Paulo: Pearson.",
      "NISE, N. S. Engenharia de Sistemas de Controle. Rio de Janeiro: LTC.",
      "GARCIA, C. Modelagem e Simulação de Processos Industriais e de Sistemas Eletromecânicos. São Paulo: EdUSP."
    ],
    chPraticaLab: "30h de simulação dinâmica computacional (MATLAB/Simulink/Python)"
  },
  "SISCOND": {
    ementa: "Análise de sinais no tempo e na frequência (Fourier). Condicionamento analógico de sinais de sensores: pontes de medição (Wheatstone), amplificadores de instrumentação (INA), isolamento galvânico, filtragem ativa analógica (Butterworth, Chebyshev, Sallen-Key) para rejeição de ruído e anti-aliasing. Amostragem (Teorema de Nyquist-Shannon), quantização, circuitos Sample-and-Hold e conversores A/D e D/A.",
    objetivo: "Projetar a cadeia completa de condicionamento, filtragem ativa e conversão A/D entre o sensor físico e o controlador digital.",
    bibliografia: [
      "FRANCO, S. Design with Operational Amplifiers and Analog Integrated Circuits. McGraw-Hill.",
      "PERTENCE JR., A. Amplificadores Operacionais e Filtros Ativos: Eletrônica Analógica. Porto Alegre: Bookman.",
      "BALBINOT, A.; BRUSAMARELLO, V. J. Instrumentação e Fundamentos de Medidas — Vol. 1 e 2. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "30h no Laboratório de Eletrônica e Aquisição de Sinais"
  },
  "LABEL": {
    ementa: "Práticas intensivas de bancada utilizando multímetros, geradores de função, fontes simétricas e osciloscópios digitais. Montagem, teste e caracterização experimental de fontes lineares/chaveadas, circuitos com diodos, estágios amplificadores e chaveadores com BJT/MOSFET, circuitos com Amplificadores Operacionais, temporizadores 555 e reguladores de tensão. Projeto de Placas de Circuito Impresso (PCB).",
    objetivo: "Desenvolver destreza experimental de bancada no projeto, montagem, depuração com osciloscópio e confecção de circuitos eletrônicos.",
    bibliografia: [
      "SEDRA, A. S.; SMITH, K. C. Microeletrônica. São Paulo: Pearson.",
      "MALVINO, A.; BATES, D. J. Eletrônica — Volumes 1 e 2. Porto Alegre: AMGH.",
      "BOYLESTAD, R. L.; NASHELSKY, L. Dispositivos Eletrônicos e Teoria de Circuitos. São Paulo: Pearson."
    ],
    chPraticaLab: "60h em Laboratório de Eletrônica (100% prática de bancada — Tabela 14)"
  },
  "FETRANS-MF": {
    ementa: "Propriedades dos fluidos (viscosidade, massa específica). Estática dos fluidos: manometria e forças sobre superfícies submersas. Equações fundamentais na forma integral (conservação da massa, quantidade de movimento e Equação de Bernoulli) e diferencial (Navier-Stokes). Análise dimensional e semelhança. Escoamento viscoso interno em tubulações: número de Reynolds, perda de carga distribuída e localizada (Diagrama de Moody) e seleção de bombas.",
    objetivo: "Dimensionar redes de tubulações, perdas de carga e sistemas de bombeamento de fluidos em processos industriais.",
    bibliografia: [
      "FOX, R. W.; MCDONALD, A. T.; PRITCHARD, P. J. Introdução à Mecânica dos Fluidos. Rio de Janeiro: LTC.",
      "ÇENGEL, Y. A.; CIMBALA, J. M. Mecânica dos Fluidos: Fundamentos e Aplicações. Porto Alegre: AMGH.",
      "WHITE, F. M. Mecânica dos Fluidos. Porto Alegre: AMGH."
    ],
    chPraticaLab: "15h em bancada de Mecânica dos Fluidos (Tabela 14)"
  },
  "PROIND": {
    ementa: "Visão integrada dos processos industriais químicos, petroquímicos, siderúrgicos, alimentícios, de celulose e manufatura discreta. Fluxogramas de processo (PFD) e Fluxogramas de Engenharia e Instrumentação (P&ID — norma ISA S5.1). Balanços de massa e energia em processos. Operações unitárias principais (reatores, colunas de destilação, trocadores de calor, caldeiras) e suas malhas típicas de controle.",
    objetivo: "Ler e elaborar diagramas P&ID (ISA S5.1) e compreender a dinâmica das plantas industriais que serão automatizadas.",
    bibliografia: [
      "FELDER, R. M.; ROUSSEAU, R. W. Princípios Elementares dos Processos Químicos. Rio de Janeiro: LTC.",
      "BEGA, E. A. (Org.). Instrumentação Industrial. Rio de Janeiro: Interciência / IBP.",
      "SEBORG, D. E. et al. Process Dynamics and Control. Wiley."
    ],
    chPraticaLab: "Estudos de plantas P&ID e processos"
  },
  "CAM": {
    ementa: "Integração CAD/CAM/CAE na manufatura moderna. Tecnologia do Comando Numérico Computadorizado (CNC): arquitetura de máquinas-ferramenta CNC (tornos, centros de usinagem, corte a laser/plasma). Sistemas de coordenadas, programação manual ISO (Código G e funções M) e geração automática de trajetórias de ferramenta via software CAM. Manufatura Flexível (FMS) e Indústria 4.0.",
    objetivo: "Programar máquinas CNC em Código G e gerar estratégias de usinagem e manufatura computadorizada integradas ao CAD.",
    bibliografia: [
      "GROOVER, M. P. Automação Industrial e Sistemas de Manufatura. São Paulo: Pearson.",
      "SILVA, S. D. CNC: Programação de Comandos Numéricos Computadorizados — Torneamento. São Paulo: Érica.",
      "FITZPATRICK, M. Introdução à Usinagem com CNC. Porto Alegre: AMGH."
    ],
    chPraticaLab: "30h em Laboratório de Informática / Simulação CNC"
  },
  "SENSAT": {
    ementa: "Características estáticas e dinâmicas de instrumentos de medição (exatidão, repetibilidade, histerese, linearidade, constante de tempo). Sensores industriais de presença/proximidade (indutivos, capacitivos, ópticos, ultrassônicos, reed-switch), posição/velocidade (encoders incrementais e absolutos, resolvers, LVDT), força/pressão, nível, vazão e temperatura (termopares, RTD Pt100, termistores). Transmissores padrão 4–20 mA, HART e atuadores industriais (válvulas de controle, solenoides).",
    objetivo: "Especificar, instalar e calibrar sensores, transmissores 4–20 mA e atuadores para instrumentação e automação industrial.",
    bibliografia: [
      "BALBINOT, A.; BRUSAMARELLO, V. J. Instrumentação e Fundamentos de Medidas — Volumes 1 e 2. Rio de Janeiro: LTC.",
      "THOMAZINI, D.; ALBUQUERQUE, P. U. B. Sensores Industriais: Fundamentos e Aplicações. São Paulo: Érica.",
      "BEGA, E. A. (Org.). Instrumentação Industrial. Rio de Janeiro: Interciência."
    ],
    chPraticaLab: "30h em Laboratório de Instrumentação e Sensores (Tabela 14)"
  },
  "CONSIS": {
    ementa: "Princípios de realimentação, sensibilidade e rejeição de distúrbios. Estabilidade de sistemas lineares invariantes no tempo (critério de Routh-Hurwitz). Erro em regime permanente e tipos de sistemas. Análise e projeto pelo Lugar das Raízes (Root Locus). Análise e projeto no domínio da frequência (Diagramas de Bode e Critério de Nyquist, margens de ganho e de fase). Projeto de compensadores (Avanço, Atraso e Avanço-Atraso) e sintonia de controladores PID (Ziegler-Nichols, Cohen-Coon, alocação de polos).",
    objetivo: "Projetar e sintonizar controladores PID e compensadores clássicos garantindo estabilidade, desempenho transitório e erro nulo em regime.",
    bibliografia: [
      "OGATA, K. Engenharia de Controle Moderno. São Paulo: Pearson.",
      "DORF, R. C.; BISHOP, R. H. Sistemas de Controle Modernos. Rio de Janeiro: LTC.",
      "NISE, N. S. Engenharia de Sistemas de Controle. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "30h de projeto e controle em bancada/simulação"
  },
  "REDES": {
    ementa: "Arquitetura de redes: modelos OSI/ISO e TCP/IP. Camada física e meios de transmissão industriales (RS-232, RS-485, fibra óptica, Industrial Ethernet). Camada de enlace, controle de acesso ao meio, endereçamento IPv4/IPv6, roteamento e protocolos TCP/UDP. Redes de Automação Industrial e Fieldbuses: Modbus RTU/TCP, Profibus, Profinet, EtherCAT, CANopen, AS-i, OPC UA e MQTT para IIoT. Cibersegurança em redes OT.",
    objetivo: "Configurar e integrar redes de computadores e barramentos industriais (Modbus, Profinet, OPC UA, MQTT) para comunicação chão de fábrica–nuvem.",
    bibliografia: [
      "TANENBAUM, A. S.; WETHERALL, D. Redes de Computadores. São Paulo: Pearson.",
      "LUGLI, A. B.; SANTOS, M. M. D. Redes Industriais para Automação Industrial: AS-I, PROFIBUS e PROFINET. São Paulo: Érica.",
      "MORAES, C. C.; CASTRUCCI, P. L. Engenharia de Automação Industrial. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "30h em Laboratório de Redes e CLPs"
  },
  "CONENE": {
    ementa: "Circuitos magnéticos, materiais ferromagnéticos, perdas por histerese e correntes parasitas (Foucault). Transformadores monofásicos e trifásicos: circuito equivalente, ensaios a vazio e de curto-circuito, regulação e rendimento. Princípios da conversão eletromecânica de energia. Máquinas de Corrente Contínua (CC), Máquinas Síncronas e Motores de Indução Trifásicos (MIT): princípio de funcionamento, circuito equivalente, curvas conjugado × velocidade e métodos de partida.",
    objetivo: "Analisar o desempenho eletromecânico de transformadores, geradores e motores elétricos (CC, síncronos e de indução trifásicos).",
    bibliografia: [
      "FITZGERALD, A. E.; KINGSLEY JR., C.; UMANS, S. D. Máquinas Elétricas com Introdução à Eletrônica de Potência. Porto Alegre: Bookman.",
      "CHAPMAN, S. J. Fundamentos de Máquinas Elétricas. Porto Alegre: AMGH.",
      "BIM, E. Máquinas Elétricas e Acionamento. Rio de Janeiro: Elsevier."
    ],
    chPraticaLab: "15h no Laboratório de Máquinas e Conversão de Energia (Tabela 14)"
  },
  "TERMO": {
    ementa: "Substâncias puras, fases e tabelas termodinâmicas (vapor d'água e fluidos refrigerantes). Equações de estado. Primeira Lei da Termodinâmica para volumes de controle em regime permanente (turbinas, compressores, bocais, válvulas de estrangulamento, trocadores de calor). Segunda Lei da Termodinâmica, entropia e eficiência isoentrópica. Ciclos de potência a vapor (Rankine), a gás (Otto, Diesel, Brayton), cogeração e ciclos de refrigeração.",
    objetivo: "Realizar balanços energéticos e exergéticos em plantas térmicas, sistemas de geração de vapor, compressores e sistemas de refrigeração industrial.",
    bibliografia: [
      "ÇENGEL, Y. A.; BOLES, M. A. Termodinâmica. Porto Alegre: AMGH.",
      "MORAN, M. J.; SHAPIRO, H. N. Princípios de Termodinâmica para Engenharia. Rio de Janeiro: LTC.",
      "BORGNAKKE, C.; SONNTAG, R. E. Fundamentos da Termodinâmica. São Paulo: Blucher."
    ],
    chPraticaLab: "Estudos práticos de ciclos térmicos"
  },
  "FETRANS-CM": {
    ementa: "Mecanismos fundamentais de transferência de calor: condução unidimensional em regime permanente (Lei de Fourier, resistência térmica em paredes planas e cilindros, aletas), convecção natural e forçada (Lei de Newton do resfriamento, correlações adimensionais Nusselt/Prandtl) e radiação térmica (Lei de Stefan-Boltzmann). Trocadores de calor (MLDT e método NUT). Fundamentos de difusão e transferência de massa (Lei de Fick).",
    objetivo: "Modelar a dissipação térmica em componentes eletrônicos/motores e dimensionar isolamento térmico e trocadores de calor industriais.",
    bibliografia: [
      "INCROPERA, F. P. et al. Fundamentos de Transferência de Calor e de Massa. Rio de Janeiro: LTC.",
      "ÇENGEL, Y. A.; GHAJAR, A. J. Transferência de Calor e Massa: Uma Abordagem Prática. Porto Alegre: AMGH.",
      "HOLMAN, J. P. Transferência de Calor. São Paulo: McGraw-Hill."
    ],
    chPraticaLab: "Ensaios térmicos demonstrativos"
  },
  "HIDPNE": {
    ementa: "Produção, preparação e distribuição de ar comprimido (compressores, secadores, unidade FRL). Atuadores pneumáticos e hidráulicos (cilindros lineares, motores rotativos, garras). Válvulas direcionais, de bloqueio, reguladoras de pressão e de vazão. Simbologia normalizada ISO 1219. Projeto de circuitos pneumáticos, eletropneumáticos, hidráulicos e eletro-hidráulicos sequenciais (métodos intuitivo, cascata e passo-a-passo). Hidráulica proporcional e servoválvulas.",
    objetivo: "Projetar e montar circuitos eletropneumáticos e eletro-hidráulicos industriais integrados a sensores e CLPs.",
    bibliografia: [
      "FIALHO, A. B. Automação Pneumática: Projetos, Dimensionamento e Análise de Circuitos. São Paulo: Érica.",
      "PARKER HANNIFIN. Tecnologia Eletropneumática Industrial e Hidráulica Industrial (Manuais Técnicos). Jacareí: Parker Training.",
      "VON LINSINGEN, I. Fundamentos de Sistemas Hidráulicos. Florianópolis: Ed. UFSC."
    ],
    chPraticaLab: "30h nas Bancadas de Eletropneumática e Hidráulica (Tabela 14)"
  },
  "CLP": {
    ementa: "Arquitetura interna do Controlador Lógico Programáveis (CLP): CPU, ciclo de varredura (Scan), cartões de entradas/saídas digitais e analógicas (0–10V / 4–20mA) e módulos especiais. Norma internacional IEC 61131-3: programação em Diagrama Ladder (LD), Diagrama de Blocos de Função (FBD), Texto Estruturado (ST) e Sequenciamento Gráfico de Funções (SFC / Grafcet). Temporizadores, contadores, manipulação de dados, controle PID em CLP e segurança de máquinas (NR-12).",
    objetivo: "Especificar o hardware e desenvolver programas industriais estruturados em IEC 61131-3 (Ladder, SFC/Grafcet, FBD e ST) para CLPs.",
    bibliografia: [
      "FRANCHI, C. M.; CAMARGO, V. L. A. Controladores Lógicos Programáveis: Sistemas Discretos. São Paulo: Érica.",
      "GEORGINI, M. Automação Aplicada: Descrição e Implementação de Sistemas Sequenciais com PLCs. São Paulo: Érica.",
      "SILVEIRA, P. R.; SANTOS, W. E. Automação e Controle Discreto. São Paulo: Érica."
    ],
    chPraticaLab: "45h nas Bancadas de CLP e Redes Industriais (Tabela 14)"
  },
  "CONMUL": {
    ementa: "Controle no Espaço de Estados: solução da equação de estado, matriz de transição, controlabilidade e observabilidade (critérios de Kalman). Projeto de controladores por realimentação de estados (alocação de polos / Fórmula de Ackermann) com ação integral (servossistemas). Projeto de observadores de estados (Luenberger). Sistemas Multivariáveis (MIMO): matriz de funções de transferência, acoplamento entre malhas, arranjo de ganhos relativos (RGA de Bristol) e desacopladores. Introdução ao Controle Ótimo (LQR).",
    objetivo: "Projetar controladores modernos em Espaço de Estados, observadores de estados e estratégias de desacoplamento para plantas multivariáveis (MIMO).",
    bibliografia: [
      "OGATA, K. Engenharia de Controle Moderno. São Paulo: Pearson.",
      "CHEN, C.-T. Linear System Theory and Design. Oxford University Press.",
      "SKOGESTAD, S.; POSTLETHWAITE, I. Multivariable Feedback Control: Analysis and Design. Wiley."
    ],
    chPraticaLab: "30h de simulação e projeto de controle multivariável"
  },
  "ACIONA": {
    ementa: "Dispositivos semicondutores de potência (Diodos de potência, Tiristores SCR/TRIAC, IGBT, MOSFET de potência). Conversores estáticos de Eletrônica de Potência: retificadores controlados, conversores CC-CC (Choppers Buck/Boost), inversores de tensão (PWM senoidal e vetorial) e cicloconversores. Comandos elétricos industriais: contatores, relés térmicos, disjuntores-motor, chaves de partida direta, estrela-triângulo, compensadora, Soft-Starters e Inversores de Frequência (controle escalar V/f e vetorial). Servomotores CA/CC e motores de passo.",
    objetivo: "Dimensionar comandos elétricos, inversores de frequência, soft-starters, servodrives e conversores de eletrônica de potência para acionamento de máquinas.",
    bibliografia: [
      "FRANCHI, C. M. Acionamentos Elétricos. São Paulo: Érica.",
      "ASHFAQ, A. Eletrônica de Potência. São Paulo: Pearson.",
      "MAMEDE FILHO, J. Instalações Elétricas Industriais. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "30h em Bancadas de Acionamentos Elétricos e Eletrônica de Potência (Tabela 14)"
  },
  "INSTEL": {
    ementa: "Normas técnicas ABNT NBR 5410 (baixa tensão) e NR-10 (segurança em instalações elétricas). Concepção de projetos elétricos prediais e industriais: previsão de cargas, divisão de circuitos, dimensionamento de condutores (capacidade de corrente, queda de tensão e curto-circuito) e eletrodutos. Dispositivos de proteção e manobra (disjuntores termomagnéticos, DR, DPS). Sistemas de aterramento (TN-S, TN-C-S, TT) e SPDA (para-raios — NBR 5419). Luminotécnica e subestações consumidoras.",
    objetivo: "Elaborar projetos de instalações elétricas industriais e prediais em estrita conformidade com as normas NBR 5410, NBR 5419 e NR-10.",
    bibliografia: [
      "MAMEDE FILHO, J. Instalações Elétricas Industriais. Rio de Janeiro: LTC.",
      "COTRIM, A. A. M. B. Instalações Elétricas. São Paulo: Pearson.",
      "CREDER, H. Instalações Elétricas. Rio de Janeiro: LTC."
    ],
    chPraticaLab: "Projeto completo em CAD elétrico"
  },
  "GESINOV": {
    ementa: "Conceitos de invenção, inovação incremental e disruptiva. Ecossistemas de inovação, parques tecnológicos, incubadoras e startups de base tecnológica (Deep Techs). Propriedade Intelectual: patentes de invenção, modelos de utilidade, registro de software e marcas junto ao INPI e NITUERGS. Prospecção tecnológica, transferência de tecnologia e editais de fomento (FINEP, CNPq, FAPERGS, SEBRAE).",
    objetivo: "Capacitar o engenheiro a proteger criações tecnológicas (patentes/software) e gerir projetos de P&D&I em empresas e startups.",
    bibliografia: [
      "TIDD, J.; BESSANT, J. Gestão da Inovação. Porto Alegre: Bookman.",
      "TROTT, P. Gestão da Inovação e Desenvolvimento de Novos Produtos. Porto Alegre: Bookman.",
      "MANUAL DE OSLO. Diretrizes para Coleta e Interpretação de Dados sobre Inovação. OCDE / FINEP."
    ],
    chPraticaLab: "Redação de busca de anterioridade / patente"
  },
  "ROBOT": {
    ementa: "Classificação e morfologia de manipuladores robóticos industriais e robôs móveis (AGVs/AMRs). Transformações homogêneas no espaço 3D (translação e rotação). Cinemática direta (convenção de Denavit-Hartenberg — D-H) e cinemática inversa geométrica/algébrica. Cinemática diferencial: matriz Jacobiana, velocidades e singularidades. Dinâmica de manipuladores (Euler-Lagrange), geração de trajetórias no espaço de juntas e cartesiano, controle de posição/força e programação de robôs industriais.",
    objetivo: "Modelar a cinemática direta/inversa e a dinâmica de manipuladores robóticos e programar células robotizadas e robôs móveis.",
    bibliografia: [
      "CRAIG, J. J. Robótica. São Paulo: Pearson.",
      "SPONG, M. W.; HUTCHINSON, S.; VIDYASAGAR, M. Robot Modeling and Control. Wiley.",
      "SICILIANO, B. et al. Robotics: Modelling, Planning and Control. Springer."
    ],
    chPraticaLab: "30h no Laboratório de Robótica e Manipuladores (Tabela 14)"
  },
  "SISSUP": {
    ementa: "Pirâmide da Automação Industrial (níveis de campo, controle, supervisão SCADA, MES e ERP). Arquitetura de Sistemas Supervisórios (SCADA) e Interfaces Homem-Máquina (IHM). Base de dados de tempo real (Tags), alarmes, eventos, receitas, tendências históricas (Historian) e relatórios. Protocolos de comunicação OPC Classic / OPC UA e Modbus. Ergonomia visual de telas de supervisão de alto desempenho (norma ISA-101).",
    objetivo: "Projetar e integrar sistemas SCADA e telas IHM conectadas a CLPs via OPC/Modbus para supervisão e operação de plantas industriais.",
    bibliografia: [
      "MORAES, C. C.; CASTRUCCI, P. L. Engenharia de Automação Industrial. Rio de Janeiro: LTC.",
      "BOYER, S. A. SCADA: Supervisory Control and Data Acquisition. ISA.",
      "ALBUQUERQUE, P. U. B.; ALEXANDRIA, A. R. Redes Industriais: Aplicações em Sistemas Digitais de Controle. São Paulo: Ensino Profissional."
    ],
    chPraticaLab: "45h em Laboratório de Redes, CLPs e SCADA (Tabela 14)"
  },
  "GESAMB": {
    ementa: "Ecologia aplicada à engenharia, ciclos biogeoquímicos e desenvolvimento sustentável. Legislação ambiental brasileira, licenciamento ambiental (FEPAM/IBAMA) e responsabilidade técnica. Controle de poluição atmosférica, tratamento de efluentes industriais e gerenciamento de resíduos sólidos e eletrônicos (Logística Reversa — Lei 12.305/2010). Sistemas de Gestão Ambiental (SGA — ISO 14001), Avaliação do Ciclo de Vida (ACV), eficiência energética e descarbonização industrial.",
    objetivo: "Integrar a responsabilidade socioambiental, o licenciamento e a norma ISO 14001 aos projetos de automação e engenharia industrial.",
    bibliografia: [
      "BARBIERI, J. C. Gestão Ambiental Empresarial: Conceitos, Modelos e Instrumentos. São Paulo: Saraiva.",
      "BRAGA, B. et al. Introdução à Engenharia Ambiental: O Desafio do Desenvolvimento Sustentável. São Paulo: Pearson.",
      "SEIFFERT, M. E. B. ISO 14001 Sistemas de Gestão Ambiental. São Paulo: Atlas."
    ],
    chPraticaLab: "Estudos de caso de licenciamento e ecoeficiência"
  },
  "ECOENG": {
    ementa: "Matemática financeira aplicada: juros simples e compostos, séries uniformes, gradientes e equivalência de fluxos de caixa. Métodos de análise de viabilidade econômica de projetos de engenharia: Valor Presente Líquido (VPL), Taxa Interna de Retorno (TIR), Payback descontado e Custo Anual Uniforme Equivalente (CAUE). Depreciação, impostos, análise de substituição de equipamentos industriais e análise de sensibilidade/risco.",
    objetivo: "Avaliar a viabilidade econômico-financeira (VPL, TIR, Payback) de projetos de automação, retrofit de máquinas e investimentos industriais.",
    bibliografia: [
      "BLANK, L.; TARQUIN, A. Engenharia Econômica. Porto Alegre: AMGH.",
      "CASAROTTO FILHO, N.; KOPITTKE, B. H. Análise de Investimentos: Matemática Financeira, Engenharia Econômica, Tomada de Decisão. São Paulo: Atlas.",
      "SAMANEZ, C. P. Engenharia Econômica. São Paulo: Pearson."
    ],
    chPraticaLab: "Simulação de viabilidade em planilhas financeiras"
  },
  "ADMEMP": {
    ementa: "Teorias da administração e funções administrativas (planejamento, organização, direção e controle). Gestão estratégica, análise SWOT e indicadores de desempenho (KPIs). Gestão da produção e operações (Lean Manufacturing, Just-in-Time, Manutenção Produtiva Total — TPM). Empreendedorismo tecnológico: modelagem de negócios (Business Model Canvas), validação de mercado, plano de negócios e abertura de empresas de engenharia.",
    objetivo: "Desenvolver competências gerenciais, visão de Lean Manufacturing e capacidade empreendedora para liderar equipes e negócios de engenharia.",
    bibliografia: [
      "CHIAVENATO, I. Introdução à Teoria Geral da Administração. Rio de Janeiro: Elsevier.",
      "DORNELAS, J. C. A. Empreendedorismo: Transformando Ideias em Negócios. Rio de Janeiro: Empreende.",
      "SLACK, N.; CHAMBERS, S.; JOHNSTON, R. Administração da Produção. São Paulo: Atlas."
    ],
    chPraticaLab: "Modelagem de negócios tecnológicos"
  },
  "TCC1": {
    ementa: "Definição do tema e problema de pesquisa/engenharia sob orientação de docente da UERGS. Fundamentação teórica e estado da arte revisado em bases científicas. Definição da metodologia, arquitetura do sistema proposto, cronograma físico e análise de custos/recursos. Redação e defesa da proposta de Trabalho de Conclusão de Curso.",
    objetivo: "Elaborar o projeto completo e a revisão bibliográfica/metodológica do Trabalho de Conclusão de Curso sob orientação docente.",
    bibliografia: [
      "GIL, A. C. Como Elaborar Projetos de Pesquisa. São Paulo: Atlas.",
      "WAZLAWICK, R. S. Metodologia de Pesquisa para Ciência da Computação e Engenharia. Rio de Janeiro: Elsevier.",
      "NORMAS ABNT NBR 14724 (Trabalhos Acadêmicos), NBR 6023 (Referências) e NBR 10520 (Citações)."
    ],
    chPraticaLab: "30h de orientação individualizada (Requisito: 168 créditos)"
  },
  "INTSIS": {
    ementa: "Concepção e integração horizontal e vertical de células de manufatura automatizadas (CIM / Indústria 4.0). Integração prática entre manipuladores robóticos, esteiras transportadoras, bancadas eletropneumáticas, visão computacional, CLPs em rede, sistemas SCADA, bancos de dados industriais e sistemas MES/ERP. Comissionamento virtual (Gêmeos Digitais), segurança funcional de plantas e projeto integrador de final de curso.",
    objetivo: "Integrar em uma planta funcional todos os subsistemas estudados no curso (Robótica, CLP, Acionamentos, Sensores, Redes e Supervisório).",
    bibliografia: [
      "GROOVER, M. P. Automação Industrial e Sistemas de Manufatura. São Paulo: Pearson.",
      "MORAES, C. C.; CASTRUCCI, P. L. Engenharia de Automação Industrial. Rio de Janeiro: LTC.",
      "ROSÁRIO, J. M. Princípios de Mecatrônica. São Paulo: Pearson."
    ],
    chPraticaLab: "45h de integração prática em célula de manufatura e robótica"
  },
  "GESPRO": {
    ementa: "Fundamentos do gerenciamento de projetos segundo o guia PMBOK (PMI) e metodologias ágeis (Scrum / Kanban). Ciclo de vida do projeto: iniciação, planejamento, execução, monitoramento/controle e encerramento. Gestão de escopo (EAP/WBS), cronograma (PERT/CPM, Gráfico de Gantt), custos, qualidade, recursos humanos, comunicações, riscos e aquisições em obras e projetos de automação industrial.",
    objetivo: "Planejar, orçar, controlar cronogramas e gerenciar riscos em projetos complexos de engenharia utilizando PMBOK e métodos ágeis.",
    bibliografia: [
      "PROJECT MANAGEMENT INSTITUTE (PMI). Um Guia do Conhecimento em Gerenciamento de Projetos (Guia PMBOK). PMI.",
      "VARGAS, R. V. Gerenciamento de Projetos: Estabelecendo Diferenciais Competitivos. Rio de Janeiro: Brasport.",
      "SUTHERLAND, J. Scrum: A Arte de Fazer o Dobro do Trabalho na Metade do Tempo. Rio de Janeiro: Sextante."
    ],
    chPraticaLab: "Uso de softwares de gestão de projetos (MS Project / Trello / Jira)"
  },
  "TCC2": {
    ementa: "Implementação experimental, prototipagem em bancada ou simulação avançada do sistema proposto no TCC 1. Coleta de dados, validação de resultados, análise crítica e redação da monografia ou artigo final de engenharia. Defesa pública perante Banca Examinadora de docentes/engenheiros.",
    objetivo: "Concluir o desenvolvimento prático/teórico do Trabalho de Conclusão de Curso e defendê-lo publicamente perante banca examinadora.",
    bibliografia: [
      "REGULAMENTO DE TCC DO CURSO DE ENGENHARIA DE CONTROLE E AUTOMAÇÃO — UERGS (Seção 2.5.1 do PPC 2024).",
      "ABNT NBR 14724. Informação e documentação — Trabalhos acadêmicos — Apresentação."
    ],
    chPraticaLab: "60h de desenvolvimento em laboratório e defesa pública"
  },
  "ESTAGIO": {
    ementa: "Vivência profissional supervisionada de no mínimo 165 horas em empresas industriais, integradoras de automação, concessionárias de energia/saneamento ou centros de P&D conveniados à UERGS, sob supervisão de engenheiro/profissional da área e orientação de professor da UERGS. Elaboração e apresentação do Relatório Final de Estágio.",
    objetivo: "Consolidar a formação prática do futuro engenheiro em ambiente real de trabalho industrial ou tecnológico.",
    bibliografia: [
      "LEI FEDERAL Nº 11.788/2008 (Lei do Estágio) e Regulamento de Estágio Supervisionado da UERGS (Seção 2.5.2 do PPC 2024)."
    ],
    chPraticaLab: "165h de prática profissional supervisionada (Requisito: 168 créditos + METCIEN)"
  },
  "ELET-1": {
    ementa: "Componente curricular eletivo de livre escolha dentre o rol ofertado pelo curso (ex: Controle Digital, Inteligência Artificial, Instrumentação Biomédica, Processamento Digital de Imagens, Tópicos Especiais em Controle e Automação, Libras, Direitos Humanos, etc.).",
    objetivo: "Permitir ao estudante aprofundar conhecimentos específicos alinhados à sua vocação profissional e tecnológica.",
    bibliografia: ["Conforme plano de ensino da disciplina eletiva escolhida nos Quadros 51 a 77 do PPC 2024."],
    chPraticaLab: "30h a 60h conforme eletiva escolhida"
  },
  "ELET-2": {
    ementa: "Segundo componente curricular eletivo para integralização das 60h obrigatórias de disciplinas optativas (ou enriquecimento curricular adicional).",
    objetivo: "Complementar a formação flexível do estudante em tópicos avançados de controle, computação, energia ou gestão.",
    bibliografia: ["Conforme plano de ensino da disciplina eletiva escolhida nos Quadros 51 a 77 do PPC 2024."],
    chPraticaLab: "Conforme eletiva escolhida"
  }
};

