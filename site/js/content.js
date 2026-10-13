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
        { codigo: "INTCON", nome: "Introdução ao Controle e Automação", ch: "60h", cr: 4, tipo: "Básica", pre: "Nenhum", ead: "Até 40% EaD" },
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
        { codigo: "MECSOL", nome: "Mecânica dos Sólidos", ch: "60h", cr: 4, tipo: "Profissional", pre: "ENGMAT", ead: "Até 40% EaD" },
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
        { codigo: "FETRANS-MF", nome: "Fenômenos de Transporte 1 - Mecânica dos Fluídos", ch: "60h", cr: 4, tipo: "Profissional", pre: "TERMOD", ead: "Até 40% EaD" },
        { codigo: "CNC", nome: "Controle Numérico Computadorizado", ch: "60h", cr: 4, tipo: "Específica", pre: "PROIND", ead: "Até 40% EaD" },
        { codigo: "RESMAT", nome: "Resistência dos Materiais", ch: "60h", cr: 4, tipo: "Profissional", pre: "MECSOL", ead: "Até 40% EaD" },
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
        { codigo: "FETRANS-CM", nome: "Fenômenos de Transporte 2 - Calor e Massa", ch: "60h", cr: 4, tipo: "Profissional", pre: "FETRANS-MF", ead: "Até 40% EaD" },
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
        { codigo: "ECONENG", nome: "Economia para Engenharia", ch: "30h", cr: 2, tipo: "Profissional", pre: "METNUM", ead: "Pode ser 100% EaD" },
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
        { codigo: "GESINOV", nome: "Gestão da Inovação", ch: "60h", cr: 4, tipo: "Profissional", pre: "144 créditos", ead: "Pode ser 100% EaD" },
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
    { codigo: "ESTDAD", nome: "Estrutura de Dados", ch: "60h", pre: "ALGPRO" },
    { codigo: "MAQTER", nome: "Máquinas Térmicas", ch: "60h", pre: "FETRANS-CM" },
    { codigo: "ENE-QE", nome: "Qualidade de Energia", ch: "45h", pre: "FIS-2" },
    { codigo: "GESPES", nome: "Gestão de Pessoas", ch: "60h", pre: "ADMEMP" },
    { codigo: "MATFIN", nome: "Matemática Financeira", ch: "60h", pre: "CALC-1" },
    { codigo: "PROTEX", nome: "Produção Textual", ch: "60h", pre: "Nenhum" },
    { codigo: "LIBRAS", nome: "Língua Brasileira de Sinais", ch: "60h", pre: "Nenhum" },
    { codigo: "INGINT", nome: "Inglês Intermediário", ch: "30h", pre: "INGBAS" },
  ],
  laboratorios: [
    {
      nome: "Laboratório de Eletrônica e Circuitos",
      icone: "⚡",
      equipamentos: "Osciloscópios digitais 100MHz, geradores de funções arbitrárias, fontes reguladas DC de bancada, pontas de prova diferenciais, multímetros digitais True RMS e estações de solda ESD.",
      disciplinas: "Circuitos Elétricos I e II, Eletrônica Digital, Eletrônica Analógica e Instrumentação."
    },
    {
      nome: "Laboratório de Acionamentos e Máquinas Elétricas",
      icone: "⚙️",
      equipamentos: "Bancadas didáticas com motores de indução trifásicos, servomotores industriais, inversores de frequência (WEG/Siemens), soft-starters, contatores e freios dinâmicos de carga.",
      disciplinas: "Máquinas Elétricas, Eletrônica de Potência e Acionamentos Industriais."
    },
    {
      nome: "Laboratório de Manufatura Integrada e Robótica (CIM)",
      icone: "🦾",
      equipamentos: "Braço robótico industrial de 6 eixos, célula CNC com fresadora e torno com controle numérico, esteiras didáticas automatizadas com separadores e sensores indutivos/ópticos.",
      disciplinas: "Robótica, Controle Numérico Computadorizado (CNC) e Automação da Manufatura."
    },
    {
      nome: "Laboratório de Redes Industriais e CLPs",
      icone: "🎛️",
      equipamentos: "Racks didáticos com Controladores Lógicos Programáveis (CLPs Rockwell/Siemens), IHMs touch industriais, módulos de E/S remotas e barramentos de campo Profinet, Modbus TCP e Ethernet/IP.",
      disciplinas: "CLP, Redes Industriais de Comunicação e Sistemas Supervisórios (SCADA)."
    },
    {
      nome: "Laboratório de Informática, Simulação e IA",
      icone: "💻",
      equipamentos: "Estações de trabalho equipadas com suíte de simulação e controle (MATLAB/Simulink), CAD 3D para engenharia mecânica, compiladores C/C++, Python para aprendizado de máquina e SCADA.",
      disciplinas: "Algoritmos, Modelagem de Sistemas Dinâmicos, Inteligência Artificial e Controle Digital."
    },
    {
      nome: "Laboratórios Básicos de Física e Química Geral",
      icone: "🧪",
      equipamentos: "Trilhos de ar para ensaios de cinemática/dinâmica, óptica geométrica e ondulatória, calorímetros, bancadas para determinação de propriedades mecânicas e capelas de exaustão química.",
      disciplinas: "Física 1 (Mecânica), Física 2 (Eletromagnetismo), Química Geral e Engenharia dos Materiais."
    }
  ],
  comparativoPPC: {
    resumo: "O curso de Engenharia de Controle e Automação da UERGS passou por importante modernização curricular aprovada pelo CONEPE, adequando-se às Diretrizes Curriculares Nacionais de Engenharia e à obrigatoriedade da curricularização de extensão.",
    pontos: [
      {
        aspecto: "Carga Horária Total",
        ppc2019: "3.765 horas (currículo aprovado pela Res. CONEPE 037/2019).",
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
  { data: "14/10", titulo: "Edital publicado", texto: "Convocação aberta a todos os estudantes de Controle e Automação." },
  { data: "26/10", titulo: "Salchipão & Assinaturas", texto: "Distribuição das 18:30 às 19:15 no refeitório, coleta de assinaturas da fundação e criação da gestão transitória. 🌭", destaque: true },
  { data: "Nov", titulo: "Estruturação & Estatuto", texto: "Elaboração do estatuto social amplo com CNPJ para editais e convênios." },
  { data: "Dez", titulo: "Visita Técnica & Minicurso", texto: "Programação de visitas industriais e oficinas de bancada com CLPs." },
  { data: "2027/1", titulo: "1ª Semana Acadêmica & Eleição", texto: "Eventos técnicos da automação, debate de propostas e eleição de diretoria." },
];

export const FAQ = [
  { p: "O que é um Centro Acadêmico?", r: "É a entidade que representa os estudantes de um curso perante a coordenação, o colegiado e a universidade. O direito de criar um CA é garantido pela Lei nº 7.395/1985." },
  { p: "Preciso pagar alguma coisa?", r: "Não. O E(CA)² não cobra mensalidade. Os salchipães no dia 26 são 100% gratuitos para os alunos de Controle e Automação." },
  { p: "Como funcionará a gestão transitória?", r: "A assembleia do dia 26 institui a Gestão Transitória / Comissão Pró-CA encarregada da redação do Estatuto Social definitivo com personalidade jurídica (CNPJ) para disputar editais e buscar recursos, organizando a fundação correta e transparente." },
  { p: "Posso colaborar na Comissão Pró-CA?", r: "Sim! Qualquer estudante do curso pode somar forças, seja no dia do evento ou pelo portal, para ajudar nos eventos, visitas técnicas e comunicação." },
  { p: "O CA tem partido político?", r: "Não. O E(CA)² é apartidário e isso estará no estatuto." },
  { p: "Não posso ir no dia 26. Ainda posso participar?", r: "Claro. Use o mural de sugestões, as enquetes e o fórum aqui do site, e entre na Comunidade do WhatsApp." },
  { p: "Por que o nome E(CA)²?", r: "ECA de Engenharia de Controle e Automação, ao quadrado: E(CA)² expressa controle × automação e a potência da união de todos os estudantes." },
  { p: "Como meus dados são usados?", r: "Apenas para a organização do CA (LGPD – Lei nº 13.709/2018). Nunca divulgamos listas de presença, matrículas ou contatos." },
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
    foto: null,
    icone: "👕",
    destaque: false,
    tag: "Conforto Diário",
    descricao: "Camiseta preta leve e respirável com diagrama esquemático de malha de controle PID nas costas e logo minimalista no peito.",
    especificacoes: [
      "Tecido: Malha fria PV ou 100% algodão penteado 30.1",
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
    foto: null,
    icone: "⚡",
    destaque: false,
    tag: "Ferramenta de Bancada",
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
    paginas: "Resolução CONEPE 016/2023 · 300 páginas",
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
    destaque: false,
    tag: "Grade Anterior",
    descricao: "Projeto Pedagógico do Curso anterior (Resolução CONEPE nº 037/2019, Revisão 002 de 06/12/2019) com carga horária de 3.765 horas. Documento indispensável para consulta de direitos adquiridos, transição curricular e tabela de equivalências entre cursos da UERGS.",
  },
  {
    id: "estatuto-eca2",
    categoria: "Estatuto & Regimento",
    titulo: "Estatuto Social do E(CA)² (2026)",
    arquivo: "pdf/Estatuto_ECA2_2026.pdf",
    tamanho: "415 KB",
    paginas: "Documento Estatutário Oficial",
    icone: "📜",
    destaque: true,
    descricao: "Minuta estatutária completa regulamentando a fundação e funcionamento do Centro Acadêmico de Engenharia de Controle e Automação (E(CA)²). Detalha objetivos, direitos dos associados, patrimônio, processo eleitoral e comissões.",
  },
  {
    id: "estatuto-representacao",
    categoria: "Regulamento Universitário",
    titulo: "Estatuto da Representação Discente UERGS",
    arquivo: "pdf/Estatuto_Representacao_Discente.pdf",
    tamanho: "371 KB",
    paginas: "Regimento UERGS",
    icone: "🏛️",
    destaque: true,
    descricao: "Regulamento institucional da representação estudantil na Universidade Estadual do Rio Grande do Sul. Define as regras de assento e voz dos alunos nos colegiados de curso e conselhos superiores.",
  },
  {
    id: "edital-convocacao",
    categoria: "Convocação Legal",
    titulo: "Edital de Convocação da Assembleia Geral",
    arquivo: "pdf/02_Edital_de_Convocacao.pdf",
    tamanho: "270 KB",
    paginas: "Publicação Formal",
    icone: "📢",
    destaque: false,
    descricao: "Edital público formal de convocação da assembleia geral extraordinária de fundação do E(CA)² em 26/10/2026, respaldado pelo art. 4º da Lei Federal nº 7.395/1985.",
  },
  {
    id: "roteiro-assembleia",
    categoria: "Operacional & Roteiro",
    titulo: "Roteiro da Assembleia Minuto a Minuto",
    arquivo: "pdf/03_Roteiro_da_Assembleia.pdf",
    tamanho: "363 KB",
    paginas: "Guia da Mesa",
    icone: "⏱️",
    destaque: false,
    descricao: "Guia minucioso da condução da assembleia: falas recomendadas, ordem das deliberações, tempo de fala e conduta para aclamação consensual sem criar atritos.",
  },
  {
    id: "ata-fundacao",
    categoria: "Documento Cartorial",
    titulo: "Minuta da Ata de Fundação e Posse Pró-CA",
    arquivo: "pdf/04_Ata_de_Fundacao.pdf",
    tamanho: "111 KB",
    paginas: "Minuta Legal",
    icone: "✍️",
    destaque: false,
    descricao: "Modelo de ata oficial pronto para anotação das deliberações, colheita de assinaturas e formalização da comissão provisória de transição.",
  },
  {
    id: "fluxograma-didatico",
    categoria: "Visual & Didático",
    titulo: "Fluxograma Completo do Processo de Fundação",
    arquivo: "pdf/09_Fluxograma.pdf",
    tamanho: "2.3 MB",
    paginas: "Diagramas Visuais",
    icone: "📊",
    destaque: false,
    descricao: "Diagramas didáticos em alta resolução mapeando todas as fases: mobilização prévia, assembleia do salchipão, comissão de transição e eleição da primeira diretoria.",
  },
  {
    id: "estrategia-completa",
    categoria: "Planejamento Estratégico",
    titulo: "Estratégia Geral de Fundação Sem Oposição",
    arquivo: "pdf/01_Estrategia_Fundacao_Eca2.pdf",
    tamanho: "267 KB",
    paginas: "Manual Estratégico",
    icone: "🎯",
    destaque: false,
    descricao: "Estratégia completa de engajamento dos estudantes, alinhamento com turmas, prevenção de oposição política e governança transparente.",
  },
  {
    id: "redes-sociais",
    categoria: "Comunicação & Mídia",
    titulo: "Estratégia de Atração e Redes Sociais",
    arquivo: "pdf/10_Estrategia_Atracao_Redes_Sociais.pdf",
    tamanho: "2.7 MB",
    paginas: "Plano de Mídia",
    icone: "📱",
    destaque: false,
    descricao: "Planejamento das postagens no Instagram, disparos em grupos de WhatsApp, funil de conversão e comunicação visual com os estudantes.",
  },
  {
    id: "lista-presenca",
    categoria: "Documento Presencial",
    titulo: "Lista de Presença A4 para Impressão",
    arquivo: "pdf/05_Lista_de_Presenca.pdf",
    tamanho: "253 KB",
    paginas: "Grade de Assinaturas",
    icone: "📋",
    destaque: false,
    descricao: "Folha de presença pronta para impressão com termos de transparência e conformidade integral com a LGPD.",
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
          { codigo: "DESUN", nome: "Desenho Universal", ch: "30h", cr: 2, area: "humanas", pre: [] },
          { codigo: "ELET-1", nome: "Eletiva 1", ch: "60h", cr: 4, area: "humanas", pre: [] }
        ]
      },
      {
        semestre: 9,
        titulo: "9º Módulo",
        ch: "330h",
        disciplinas: [
          { codigo: "ADMEMP", nome: "Administração e Empreendedorismo", ch: "30h", cr: 2, area: "humanas", pre: ["ECONENG"] },
          { codigo: "GESINOV", nome: "Gestão da Inovação", ch: "60h", cr: 4, area: "humanas", pre: [] },
          { codigo: "CONMUL", nome: "Controle Multivariável", ch: "60h", cr: 4, area: "controle", pre: ["CONSIS"] },
          { codigo: "IA", nome: "Inteligência Artificial", ch: "60h", cr: 4, area: "computacao", pre: ["PROGOO"] },
          { codigo: "AUTMAN", nome: "Automação da Manufatura", ch: "60h", cr: 4, area: "controle", pre: ["CNC"] },
          { codigo: "TCC1", nome: "Trabalho de Conclusão 1", ch: "60h", cr: 4, area: "humanas", pre: ["METCIEN"] }
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
          { codigo: "ESTSUP", nome: "Estágio Supervisionado", ch: "165h", cr: 11, area: "humanas", pre: ["METCIEN"] },
          { codigo: "ELET-2", nome: "Eletiva 2", ch: "60h", cr: 4, area: "humanas", pre: [] }
        ]
      }
    ]
  },
  "2019": {
    versao: "2019",
    rotulo: "PPC 2019 (Histórico)",
    resolucao: "Resolução CONEPE nº 037/2019 (Revisão 002 de 06/12/2019)",
    cargaHoraria: "3.765 horas · 226 créditos",
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
          { codigo: "GESINOV", nome: "Gestão da Inovação", ch: "60h", cr: 4, area: "humanas", pre: [] },
          { codigo: "CONMUL", nome: "Controle Multivariável", ch: "60h", cr: 4, area: "controle", pre: ["CONSIS"] },
          { codigo: "IA", nome: "Inteligência Artificial", ch: "60h", cr: 4, area: "computacao", pre: ["PROGOO"] },
          { codigo: "AUTMAN", nome: "Automação da Manufatura", ch: "60h", cr: 4, area: "controle", pre: ["CNC"] },
          { codigo: "TCC1", nome: "Trabalho de Conclusão 1", ch: "60h", cr: 4, area: "humanas", pre: ["METCIEN"] }
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
          { codigo: "ESTAGIO", nome: "Estágio Supervisionado", ch: "165h", cr: 11, area: "humanas", pre: ["METCIEN"] },
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
  resumo: "A UERGS oferece uma ampla rede de apoio à permanência estudantil, bolsas acadêmicas remuneradas e oportunidades de desenvolvimento científico e comunitário para estudantes de graduação.",
  categorias: [
    {
      id: "monitoria",
      titulo: "Bolsas de Monitoria Acadêmica",
      icone: "🧑‍🏫",
      badge: "Ensino & Apoio aos Colegas",
      cor: "cyan",
      descricao: "Auxílio direto aos docentes e atendimento a estudantes com dúvidas em disciplinas fundamentais do curso (Cálculos, Físicas, Circuitos Elétricos, Algoritmos e Microprocessadores).",
      modalidades: [
        {
          nome: "Monitoria Remunerada (PROEN)",
          detalhes: "Bolsa mensal concedida pela Pró-Reitoria de Ensino para dedicação de 12h a 20h semanais com orientação docente.",
          requisitos: "Ter cursado o componente com bom aproveitamento (nota mínima conforme edital) e disponibilidade de horário."
        },
        {
          nome: "Monitoria Voluntária",
          detalhes: "Certificação oficial com cômputo de Atividades Complementares (AC) e enriquecimento curricular em docência superior.",
          requisitos: "Aprovação prévia na disciplina e interesse em orientar os colegas nos laboratórios."
        }
      ],
      comoInscrever: "Processo seletivo semestral com edital público lançado pela PROEN no início de cada semestre. As vagas são divulgadas aqui no portal do E(CA)² e nos murais do campus."
    },
    {
      id: "iniciacao-cientifica",
      titulo: "Iniciação Científica & Tecnológica (IC)",
      icone: "🔬",
      badge: "Pesquisa & Inovação",
      cor: "violet",
      descricao: "Bolsas de pesquisa remuneradas para desenvolver projetos de bancada, sistemas supervisórios, robótica e inteligência artificial com professores doutores do curso.",
      modalidades: [
        {
          nome: "PROBITI & PIBIC UERGS",
          detalhes: "Bolsas de iniciação tecnológica e científica mantidas pela UERGS com vigência anual e plano de trabalho estruturado.",
          requisitos: "Matrícula ativa em Engenharia de Controle e Automação, dedicação ao plano de pesquisa e apresentação no Salão SIEP."
        },
        {
          nome: "Bolsas FAPERGS & CNPq",
          detalhes: "Cotas estaduais e federais de fomento à pesquisa em projetos avançados de automação e mecatrônica.",
          requisitos: "Seleção via edital institucional da PROPESP sob orientação de professor do colegiado."
        }
      ],
      comoInscrever: "Editais anuais da Pró-Reitoria de Pesquisa e Pós-Graduação (PROPESP) e contato direto com os docentes pesquisadores nos laboratórios de ECA."
    },
    {
      id: "permanencia",
      titulo: "Assistência Estudantil & Permanência (PRAE)",
      icone: "🤝",
      badge: "Permanência & Inclusão",
      cor: "emerald",
      descricao: "A Pró-Reitoria de Assuntos Estudantis (PRAE) gerencia a política de permanência da UERGS para viabilizar que estudantes em vulnerabilidade concluam o curso com dignidade.",
      modalidades: [
        {
          nome: "Auxílio Deslocamento / Transporte",
          detalhes: "Repasse mensal em conta bancária para suporte às despesas de deslocamento diário até a Washington Luiz.",
          requisitos: "Comprovação de renda per capita conforme critérios do Edital Unificado PRAE."
        },
        {
          nome: "Auxílio Alimentação",
          detalhes: "Subsídio financeiro mensal para alimentação dos estudantes durante os turnos de aula presencial e laboratório.",
          requisitos: "Inscrição anual no Cadastro Socioeconômico PRAE."
        },
        {
          nome: "Auxílio Participação em Eventos",
          detalhes: "Ajuda de custo para discentes apresentarem artigos e trabalhos em congressos e feiras nacionais de engenharia.",
          requisitos: "Artigo aceito com afiliação oficial da UERGS e representação do curso."
        }
      ],
      comoInscrever: "Edital anual de auxílios estudantis da PRAE divulgado no início de cada ano letivo, com submissão digital via Portal UERGS."
    },
    {
      id: "saude-mental",
      titulo: "Apoio Psicopedagógico & Saúde Mental (NAI)",
      icone: "🧠",
      badge: "Acolhimento & Cuidado",
      cor: "amber",
      descricao: "O Núcleo de Apoio à Inclusão e Acessibilidade (NAI) e o serviço psicopedagógico da UERGS oferecem escuta acolhedora, orientação de estudos e suporte à saúde mental sem custo.",
      modalidades: [
        {
          nome: "Plantão de Escuta Psicológica",
          detalhes: "Atendimento acolhedor e confidencial com psicólogos da universidade para alívio de estresse e suporte emocional.",
          requisitos: "Aberto a qualquer estudante matriculado, mediante agendamento sigiloso."
        },
        {
          nome: "Orientação Psicopedagógica",
          detalhes: "Apoio prático na organização de rotinas de estudo, técnicas de concentração e conciliação de trabalho com a faculdade.",
          requisitos: "Acesso livre e gratuito."
        }
      ],
      comoInscrever: "Agendamento reservado direto com o setor de assuntos estudantis da Unidade Porto Alegre."
    },
    {
      id: "estagios",
      titulo: "Estágios & Integração com a Indústria",
      icone: "🏭",
      badge: "Carreira & Mercado",
      cor: "blue",
      descricao: "Central de tramitação de estágios curriculares não-obrigatórios e obrigatórios, conveniada com CIEE-RS, IEL-RS e polos fabris de Porto Alegre e região metropolitana.",
      modalidades: [
        {
          nome: "Estágio Não-Obrigatório Remunerado",
          detalhes: "Atuação prática em empresas de automação, painéis elétricos, TI industrial e robótica a partir dos semestres intermediários.",
          requisitos: "Termo de Compromisso assinado pela UERGS, limite de 30h semanais e seguro contra acidentes."
        },
        {
          nome: "Estágio Supervisionado Obrigatório (165h)",
          detalhes: "Componente curricular obrigatório do 10º semestre para consolidar a formação profissional de engenheiro.",
          requisitos: "Aprovação prévia do plano de estágio pela coordenação de curso e entrega do relatório final."
        }
      ],
      comoInscrever: "Validação de Termo de Compromisso de Estágio (TCE) via processo eletrônico SEI/UERGS com apoio e orientação do CA."
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
    titulo: "1º Encontro & Salchipão Inaugural do E(CA)²",
    categoria: "ca",
    categoriaLabel: "E(CA)² · Evento do Curso",
    icone: "🌭",
    local: "Refeitório da UERGS – Campus Porto Alegre",
    descricao: "Distribuição gratuita de salchipão, coleta de assinaturas da lista de presença da fundação, demonstração do novo portal e confraternização aberta entre calouros ('bichos') e veteranos.",
    destaque: true,
    linkAcao: "#fundacao",
    textoAcao: "Confirmar Presença (RSVP) 🌭"
  },
  {
    id: 2,
    data: "2026-10-14",
    dataExibicao: "14 de Outubro de 2026",
    horario: "Edital Aberto",
    titulo: "Publicação do Edital de Convocação da Fundação",
    categoria: "institucional",
    categoriaLabel: "UERGS · Data Institucional",
    icone: "📜",
    local: "Mural Oficial UERGS & Portal E(CA)²",
    descricao: "Convocação formal de todos os estudantes matriculados em Engenharia de Controle e Automação para a fundação do centro acadêmico.",
    destaque: false,
    linkAcao: "#documentos",
    textoAcao: "Ver Documento Oficial (PDF)"
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
    local: "Portal do Aluno UERGS (SGA)",
    descricao: "Data limite para os estudantes solicitarem ajustes em disciplinas ou cancelamento de matrícula de componentes específicos.",
    destaque: false,
    linkAcao: "https://sga.uergs.edu.br",
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
    local: "Pró-Reitoria de Ensino (PROEN)",
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
        "Mínimo de 50% da carga horária do curso integralizada (recomendado ter cursado Circuitos, Eletrônica e Instrumentação);",
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
        titulo: "Homologação na UERGS (COE)",
        desc: "Submeta o documento à Comissão de Orientação de Estágio (COE) da Unidade Porto Alegre para assinatura do Professor Orientador antes de iniciar."
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
        foco: "Acordos diretos celebrados entre a Pró-Reitoria de Ensino (PROEN) e indústrias de ponta sem agentes intermediários.",
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
    resolucoes: "Resoluções CONFEA nº 218/1973 e nº 430/1999",
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
