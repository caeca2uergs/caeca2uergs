/**
 * ============================================================
 *  CONFIGURAÇÃO DO SITE Eca²
 *  Edite apenas este arquivo para personalizar o site.
 * ============================================================
 */
export const CONFIG = {
  /* ---------- Supabase (backend) ----------
   * Deixe vazio para rodar em MODO DEMONSTRAÇÃO (dados ficam só no navegador).
   * Para ativar o modo real, crie um projeto gratuito em https://supabase.com,
   * rode o arquivo supabase/schema.sql e cole aqui a URL e a "anon public key"
   * (Project Settings → API). A anon key é pública por design; a segurança
   * vem das políticas RLS do schema.sql.
   */
  SUPABASE_URL: "https://jfzisfwbfunrhurwrpbl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_3vFXKRZA0bQ1_mSW9RgKXQ_DY-ajNZG",

  /* Restringir login a um domínio de e-mail (ex.: "uergs.edu.br").
   * Deixe vazio para aceitar qualquer e-mail. Para segurança real,
   * ative também o trigger opcional no schema.sql. */
  ALLOWED_EMAIL_DOMAIN: "",

  /* ---------- Base Oficial de Alunos Homologados (Eng. de Controle e Automação) ----------
   * 235 estudantes cadastrados da lista oficial UERGS.
   * Estudantes fora desta lista podem se registrar comprovando vínculo com o curso.
   */
  STUDENTS_DATABASE: [
  {
    "name": "Adi Kauan Da Cunha Dos Santos",
    "email": "adi-santos@uergs.edu.br"
  },
  {
    "name": "Adriano Gobbi Dias",
    "email": "adriano-dias@uergs.edu.br"
  },
  {
    "name": "Alberto Cardoso Hanssen",
    "email": "alberto-hanssen@uergs.edu.br"
  },
  {
    "name": "Alisson Farias Kreuszburg",
    "email": "alisson-kreuszburg@uergs.edu.br"
  },
  {
    "name": "Amanda Albuquerque Dellanhesi",
    "email": "amanda-dellanhesi@uergs.edu.br"
  },
  {
    "name": "Ana Carla Barbosa De Oliveira",
    "email": "ana-oliveira07@uergs.edu.br"
  },
  {
    "name": "Ana Carolina Da Silva Mourão",
    "email": "ana-mourao@uergs.edu.br"
  },
  {
    "name": "Ana Carolina Schroeder Baptista",
    "email": "ana-baptista@uergs.edu.br"
  },
  {
    "name": "Ana Clara Barbosa de Oliveira",
    "email": "ana-oliveira09@uergs.edu.br"
  },
  {
    "name": "anacarol.sb20",
    "email": "anacarol.sb20@gmail.com"
  },
  {
    "name": "anamouraooqjf",
    "email": "anamouraooqjf@gmail.com"
  },
  {
    "name": "Ananda Flores",
    "email": "ananda_flores@hotmail.com"
  },
  {
    "name": "Ananda Santos Flores Da Silva",
    "email": "ananda-silva@uergs.edu.br"
  },
  {
    "name": "Anderson Roberto Machado De Vargas",
    "email": "anderson-vargas@uergs.edu.br"
  },
  {
    "name": "Andre Eduardo Weimer",
    "email": "andre-weimer@uergs.edu.br"
  },
  {
    "name": "Andre Hartwig",
    "email": "andre-hartwig@uergs.edu.br"
  },
  {
    "name": "Andre Rafael Barreto Moreira",
    "email": "andre-moreira@uergs.edu.br"
  },
  {
    "name": "Angelo Zander De Marco",
    "email": "angelo-marco@uergs.edu.br"
  },
  {
    "name": "Antonio Debom De Castro",
    "email": "antonio-castro@uergs.edu.br"
  },
  {
    "name": "Antonio Joao Machado Junior",
    "email": "antonio-junior02@uergs.edu.br"
  },
  {
    "name": "Aristides Martins Ferreira Neto",
    "email": "aristides-neto@uergs.edu.br"
  },
  {
    "name": "Augusto Stram Bierhals",
    "email": "augusto-bierhals@uergs.edu.br"
  },
  {
    "name": "Bernardo Lyra Jucá Duarte Silva",
    "email": "bernardo-silva@uergs.edu.br"
  },
  {
    "name": "Berto Alex Toussaint",
    "email": "berto-toussaint@uergs.edu.br"
  },
  {
    "name": "Bianca Rodrigues Brum",
    "email": "bianca-brum@uergs.edu.br"
  },
  {
    "name": "biancardwz",
    "email": "biancardwz@gmail.com"
  },
  {
    "name": "Brenda Mellory Mitto Scorsatto",
    "email": "brenda-scorsatto@uergs.edu.br"
  },
  {
    "name": "brenda-sousa",
    "email": "brenda-sousa@uergs.edu.br"
  },
  {
    "name": "Brian Smolen",
    "email": "brian-smolen@uergs.edu.br"
  },
  {
    "name": "Britney Rafaela Camargo Rodrigues",
    "email": "britney-rodrigues@uergs.edu.br"
  },
  {
    "name": "Bruno Alceu Camargo Lamb",
    "email": "bruno-lamb@uergs.edu.br"
  },
  {
    "name": "Bruno Dos Passos Camargo",
    "email": "bruno-camargo@uergs.edu.br"
  },
  {
    "name": "Bruno Erling De Souza",
    "email": "bruno-souza01@uergs.edu.br"
  },
  {
    "name": "Bruno Mengue De Vargas",
    "email": "bruno-vargas01@uergs.edu.br"
  },
  {
    "name": "Bruno Scotti Moretti",
    "email": "bruno-moretti@uergs.edu.br"
  },
  {
    "name": "Bruno Toller De Souza Franck",
    "email": "bruno-franck@uergs.edu.br"
  },
  {
    "name": "Camila Borges Silva Da Rosa",
    "email": "camila-rosa01@uergs.edu.br"
  },
  {
    "name": "Carlos Alberto Meyer Da Cruz",
    "email": "carlos-cruz@uergs.edu.br"
  },
  {
    "name": "Carlos Eduardo Agliozzo Silva",
    "email": "carlos-silva04@uergs.edu.br"
  },
  {
    "name": "carlosmeyer066",
    "email": "carlosmeyer066@gmail.com"
  },
  {
    "name": "CESAR LUIZ DE SOUZA CAVICHIOLI",
    "email": "cesar-cavichioli@uergs.edu.br"
  },
  {
    "name": "Cristiana Pereira Da Silva",
    "email": "cristiana-silva@uergs.edu.br"
  },
  {
    "name": "Cristiano Schmidt da Cruz",
    "email": "cristiano-cruz@uergs.edu.br"
  },
  {
    "name": "Daniel Hashizume Tanioka",
    "email": "daniel-tanioka@uergs.edu.br"
  },
  {
    "name": "Daniel Souza Da Costa",
    "email": "daniel-costa01@uergs.edu.br"
  },
  {
    "name": "Daniela Mombach Da Silva",
    "email": "daniela-silva05@uergs.edu.br"
  },
  {
    "name": "danimombach2611",
    "email": "danimombach2611@gmail.com"
  },
  {
    "name": "danschaidt",
    "email": "danschaidt@gmail.com"
  },
  {
    "name": "danterccampos",
    "email": "danterccampos@gmail.com"
  },
  {
    "name": "Davi Silva Brito Junior",
    "email": "davi-junior@uergs.edu.br"
  },
  {
    "name": "Davids L Da Rosa Martins",
    "email": "davids-martins@uergs.edu.br"
  },
  {
    "name": "Deise Da Silva Alves",
    "email": "deise-alves@uergs.edu.br"
  },
  {
    "name": "Denzel Palácio Da Silva",
    "email": "denzel-silva@uergs.edu.br"
  },
  {
    "name": "diass.rlls",
    "email": "diass.rlls@gmail.com"
  },
  {
    "name": "Diego Cardenal",
    "email": "diego-cardenal@uergs.edu.br"
  },
  {
    "name": "Diogo Fellipe Cardoso De Souza",
    "email": "diogo-souza@uergs.edu.br"
  },
  {
    "name": "dionatan.cardoso66",
    "email": "dionatan.cardoso66@gmail.com"
  },
  {
    "name": "DOUGLAS ALVES DA CRUZ",
    "email": "douglas-cruz@uergs.edu.br"
  },
  {
    "name": "Edimara Ramires Toldo",
    "email": "edimara-toldo@uergs.edu.br"
  },
  {
    "name": "Edson Garcia Cruz",
    "email": "edson-cruz@uergs.edu.br"
  },
  {
    "name": "Eduardo De Souza Flores",
    "email": "eduardo-flores@uergs.edu.br"
  },
  {
    "name": "Eduardo Ferreira Pino",
    "email": "eduardo-pino@uergs.edu.br"
  },
  {
    "name": "Eduardo Paixão De Oliveira",
    "email": "eduardo-oliveira03@uergs.edu.br"
  },
  {
    "name": "eduardopaixaodeolivera",
    "email": "eduardopaixaodeolivera@gmail.com"
  },
  {
    "name": "educarrp19",
    "email": "educarrp19@gmail.com"
  },
  {
    "name": "Elen Zingler Pinto",
    "email": "elen-pinto@uergs.edu.br"
  },
  {
    "name": "Emilson Luis De Souza Rodrigues",
    "email": "emilson-rodrigues@uergs.edu.br"
  },
  {
    "name": "emilsonr0296",
    "email": "emilsonr0296@gmail.com"
  },
  {
    "name": "Endrew Alexsander Da Rosa Fontoura",
    "email": "endrew-fontoura@uergs.edu.br"
  },
  {
    "name": "Erick Rosa Martins",
    "email": "erick-martins@uergs.edu.br"
  },
  {
    "name": "Ethan Terracciano Leão",
    "email": "ethan-leao@uergs.edu.br"
  },
  {
    "name": "eugabrielabica",
    "email": "eugabrielabica@hotmail.com"
  },
  {
    "name": "Everton Gomes de Oliveira",
    "email": "everton-gomes@uergs.edu.br"
  },
  {
    "name": "Ezí Gabriele De Abreu Macedo",
    "email": "ezi-macedo@uergs.edu.br"
  },
  {
    "name": "Fabio Rogerio Dos Santos",
    "email": "fabio-santos@uergs.edu.br"
  },
  {
    "name": "Fabricio Dagostini Machado",
    "email": "fabricio-machado02@uergs.edu.br"
  },
  {
    "name": "Felipe Da Silva Rieger",
    "email": "felipe-rieger@uergs.edu.br"
  },
  {
    "name": "Felipe De Oliveira Martinez",
    "email": "felipe-martinez@uergs.edu.br"
  },
  {
    "name": "Felipe De Oliveira Ramos",
    "email": "felipe-ramos@uergs.edu.br"
  },
  {
    "name": "Felipe Vieira Da Silva",
    "email": "felipe-silva03@uergs.edu.br"
  },
  {
    "name": "Fernanda Worm De Oliveira",
    "email": "fernanda-oliveira@uergs.edu.br"
  },
  {
    "name": "Fernando Augusto Caletti De Barros",
    "email": "fernando-barros@uergs.edu.br"
  },
  {
    "name": "Fernando Rodrigues De Moraes",
    "email": "fernando-moraes@uergs.edu.br"
  },
  {
    "name": "Filipe Facio dos Santos",
    "email": "filipe-santos@uergs.edu.br"
  },
  {
    "name": "Gabriel Brunhaus Da Rocha",
    "email": "gabriel-rocha@uergs.edu.br"
  },
  {
    "name": "Gabriel De Castro Teixeira",
    "email": "gabriel-teixeira@uergs.edu.br"
  },
  {
    "name": "GABRIEL FACHINELLO WANDSCHEER",
    "email": "gabriel-wandscheer@uergs.edu.br"
  },
  {
    "name": "Gabriel Nicolodi Donatto",
    "email": "gabriel-donatto@uergs.edu.br"
  },
  {
    "name": "Gabriel Rodrigues De Rodrigues",
    "email": "gabriel-rodrigues02@uergs.edu.br"
  },
  {
    "name": "GABRIEL SILVEIRA ESTRELA",
    "email": "gabriel-estrela@uergs.edu.br"
  },
  {
    "name": "Gabriel Solar Bandel",
    "email": "gabriel-bandel@uergs.edu.br"
  },
  {
    "name": "Gabrielle Barbosa Machado",
    "email": "gabrielle-machado@uergs.edu.br"
  },
  {
    "name": "gabrielteixeira2102",
    "email": "gabrielteixeira2102@gmail.com"
  },
  {
    "name": "Giacomo Souza Tavares",
    "email": "giacomo-tavares@uergs.edu.br"
  },
  {
    "name": "Giovanna Dias Duarte",
    "email": "giovanna-duarte@uergs.edu.br"
  },
  {
    "name": "gpaycorich1",
    "email": "gpaycorich1@gmail.com"
  },
  {
    "name": "GREGORIO VILAS BOAS SANTANA",
    "email": "gregorio-santana@uergs.edu.br"
  },
  {
    "name": "Guilherme Brambilla",
    "email": "guilherme-brambilla@uergs.edu.br"
  },
  {
    "name": "Guilherme Bueno De Quadros Fraga",
    "email": "guilherme-fraga@uergs.edu.br"
  },
  {
    "name": "Guilherme De Freitas Peres",
    "email": "guilherme-peres@uergs.edu.br"
  },
  {
    "name": "Guilherme Dias Brito De Sousa",
    "email": "guilherme-sousa@uergs.edu.br"
  },
  {
    "name": "Guilherme Oliveira Schmitt",
    "email": "guilherme-schmitt@uergs.edu.br"
  },
  {
    "name": "Guilherme Pereira Goncalves",
    "email": "guilherme-pereira@uergs.edu.br"
  },
  {
    "name": "Guilherme Rambor Cruz",
    "email": "guilherme-cruz@uergs.edu.br"
  },
  {
    "name": "Gustavo Alcaria Ramos",
    "email": "gustavo-ramos@uergs.edu.br"
  },
  {
    "name": "Gustavo Gregory",
    "email": "gustavo-gregory@uergs.edu.br"
  },
  {
    "name": "Gustavo Santos",
    "email": "gustavo-eugenio@uergs.edu.br"
  },
  {
    "name": "Gustavo Terra Correa",
    "email": "gustavo-correa@uergs.edu.br"
  },
  {
    "name": "Gustavo Tolotti Romero",
    "email": "gustavo-romero@uergs.edu.br"
  },
  {
    "name": "Hanry Henk Rossoni",
    "email": "hanry-rossoni@uergs.edu.br"
  },
  {
    "name": "Helbert Lampert Rodrigues",
    "email": "helbert-rodrigues@uergs.edu.br"
  },
  {
    "name": "Henrique Bebber Da Rosa",
    "email": "henrique-rosa@uergs.edu.br"
  },
  {
    "name": "icaroferrvie",
    "email": "icaroferrvie@gmail.com"
  },
  {
    "name": "Igor Schuch Rodrigues",
    "email": "igor-rodrigues02@uergs.edu.br"
  },
  {
    "name": "Isabela Vitoria Da Silva Lemos",
    "email": "isabela-lemos@uergs.edu.br"
  },
  {
    "name": "Isabelly Nunes Da Silva",
    "email": "isabelly-silva@uergs.edu.br"
  },
  {
    "name": "israelcunh4",
    "email": "israelcunh4@gmail.com"
  },
  {
    "name": "Jefferson Augusto D Neves",
    "email": "jefferson-neves@uergs.edu.br"
  },
  {
    "name": "Jesse Ferrari De Oliveira",
    "email": "jesse-oliveira@uergs.edu.br"
  },
  {
    "name": "Jesse Luís A De Oliveira",
    "email": "jesse-oliveira01@uergs.edu.br"
  },
  {
    "name": "Jéssica Linhares Hofsetz",
    "email": "jessica-hofsetz@uergs.edu.br"
  },
  {
    "name": "João Luís Segala",
    "email": "joao-segala@uergs.edu.br"
  },
  {
    "name": "Joao Nunes Da Silva Neto",
    "email": "joao-neto02@uergs.edu.br"
  },
  {
    "name": "João Pedro Paiva De Lima",
    "email": "joao-lima03@uergs.edu.br"
  },
  {
    "name": "João Pedro Vargas Da Silva",
    "email": "joao-vargas@uergs.edu.br"
  },
  {
    "name": "Joao Vitor Maass Da Cunha",
    "email": "joao-cunha01@uergs.edu.br"
  },
  {
    "name": "Joelson Machado Ferraz",
    "email": "joelson-ferraz@uergs.edu.br"
  },
  {
    "name": "joice",
    "email": "joice@solis.com.br"
  },
  {
    "name": "Jonathan J Carneiro Da Silva",
    "email": "jonathan-silva@uergs.edu.br"
  },
  {
    "name": "Jose Pedro Pereira Neto",
    "email": "jose-neto02@uergs.edu.br"
  },
  {
    "name": "Juan Serpa Botelho",
    "email": "juan-botelho@uergs.edu.br"
  },
  {
    "name": "Júlia De Oliveira Teixeira",
    "email": "julia-teixeira@uergs.edu.br"
  },
  {
    "name": "Juliana Carlos Da Silva",
    "email": "juliana-silva06@uergs.edu.br"
  },
  {
    "name": "Juliano Campos Marques",
    "email": "juliano-marques@uergs.edu.br"
  },
  {
    "name": "Karollyne Gurjao Da Costa",
    "email": "karollyne-costa@uergs.edu.br"
  },
  {
    "name": "Kauan Moreira Barcellos",
    "email": "kauan-barcellos@uergs.edu.br"
  },
  {
    "name": "Kethleen Dorneles Vencato De Souza",
    "email": "kethleen-souza@uergs.edu.br"
  },
  {
    "name": "Ketlin Juriatti Maria",
    "email": "ketlin-maria@uergs.edu.br"
  },
  {
    "name": "Larah Zarour Fernandes",
    "email": "larah-fernandes@uergs.edu.br"
  },
  {
    "name": "Laryssa Da Silva Siqueira",
    "email": "laryssa-siqueira@uergs.edu.br"
  },
  {
    "name": "laryssa.siqueira",
    "email": "laryssa.siqueira@hotmail.com"
  },
  {
    "name": "Leandro Castello Eltz",
    "email": "leandro-eltz@uergs.edu.br"
  },
  {
    "name": "leizieleana",
    "email": "leizieleana@gmail.com"
  },
  {
    "name": "leodfal",
    "email": "leodfal@gmail.com"
  },
  {
    "name": "Leonardo Bender De Oliveira",
    "email": "leonardo-oliveira@uergs.edu.br"
  },
  {
    "name": "Leonardo Piva Bortaliero",
    "email": "leonardo-bortaliero@uergs.edu.br"
  },
  {
    "name": "Luan Fernandes Oliveira",
    "email": "luan-oliveira01@uergs.edu.br"
  },
  {
    "name": "LUCAS DA ROSA ALVES",
    "email": "lucas-alves@uergs.edu.br"
  },
  {
    "name": "Lucas De Oliveira Bruno",
    "email": "lucas-bruno@uergs.edu.br"
  },
  {
    "name": "Lucas Do Carmo Vilas Boas Da Silva",
    "email": "lucas-silva@uergs.edu.br"
  },
  {
    "name": "Lucas Farias Ribeiro",
    "email": "lucas-ribeiro@uergs.edu.br"
  },
  {
    "name": "Lucas Souza Da Silva",
    "email": "lucas-silva05@uergs.edu.br"
  },
  {
    "name": "Luiz Felipe Loureiro",
    "email": "luiz-loureiro@uergs.edu.br"
  },
  {
    "name": "luizfelipepereira009",
    "email": "luizfelipepereira009@gmail.com"
  },
  {
    "name": "Luzikende Rodrigues Do Carmo",
    "email": "luzikende-carmo@uergs.edu.br"
  },
  {
    "name": "Marcelo Borges Tomaz",
    "email": "marcelo-tomaz@uergs.edu.br"
  },
  {
    "name": "Marco Aurélio Brambilla",
    "email": "marco-brambilla@uergs.edu.br"
  },
  {
    "name": "Marcos Caetano De Almeida Rocha",
    "email": "marcos-rocha01@uergs.edu.br"
  },
  {
    "name": "Mariana Marques De Medeiros Bueno",
    "email": "mariana-bueno@uergs.edu.br"
  },
  {
    "name": "Mateus Da Silva Borba",
    "email": "mateus-borba@uergs.edu.br"
  },
  {
    "name": "MATEUS DUARTE AZEVEDO MADRUGA",
    "email": "mateus-madruga@uergs.edu.br"
  },
  {
    "name": "Matheus Braunn Ricciardi",
    "email": "matheus-ricciardi@uergs.edu.br"
  },
  {
    "name": "Matheus Menezes Prado",
    "email": "matheus-prado@uergs.edu.br"
  },
  {
    "name": "Matheus Nogueira Martino",
    "email": "matheus-martino@uergs.edu.br"
  },
  {
    "name": "Matheus Storck Guerra",
    "email": "matheus-guerra@uergs.edu.br"
  },
  {
    "name": "matheusguerra182007",
    "email": "matheusguerra182007@gmail.com"
  },
  {
    "name": "MAURICIO MAURER",
    "email": "mauricio-maurer@uergs.edu.br"
  },
  {
    "name": "melimaoliveira",
    "email": "melimaoliveira@gmail.com"
  },
  {
    "name": "Melquisedeque André Reis",
    "email": "melquisedeque-reis@uergs.edu.br"
  },
  {
    "name": "Moacir Nunes Da Silva",
    "email": "moacir-silva@uergs.edu.br"
  },
  {
    "name": "Nathan Schein Lopes",
    "email": "nathan-lopes@uergs.edu.br"
  },
  {
    "name": "Nelson Kleber Da Silva",
    "email": "nelson-silva@uergs.edu.br"
  },
  {
    "name": "Nicholle Silva Gomes Da Silva",
    "email": "nicholle-silva@uergs.edu.br"
  },
  {
    "name": "Nicolas Betti Andrade",
    "email": "nicolas-andrade@uergs.edu.br"
  },
  {
    "name": "nicolasjacobini",
    "email": "nicolasjacobini@gmail.com"
  },
  {
    "name": "Nielson Dos Santos Rocha",
    "email": "nielson-rocha@uergs.edu.br"
  },
  {
    "name": "Oscar Mestre",
    "email": "oscar-mestre@uergs.edu.br"
  },
  {
    "name": "Pâmela Nicole Nunes Oliveira",
    "email": "pamela-oliveira@uergs.edu.br"
  },
  {
    "name": "Paulo Sergio Fries",
    "email": "paulo-fries@uergs.edu.br"
  },
  {
    "name": "Pedro Souto Bulhoes",
    "email": "pedro-bulhoes@uergs.edu.br"
  },
  {
    "name": "Pietro Salerno De Oliveira",
    "email": "pietro-oliveira@uergs.edu.br"
  },
  {
    "name": "Rafaela Azambuja Borges",
    "email": "rafaela-borges@uergs.edu.br"
  },
  {
    "name": "Rafaela Barcellos Dos Santos",
    "email": "rafaela-santos02@uergs.edu.br"
  },
  {
    "name": "Rafaela Guedes Tassinari",
    "email": "rafaela-tassinari@uergs.edu.br"
  },
  {
    "name": "Ramon Lourenco Maslak Fabisiak",
    "email": "ramon-fabisiak@uergs.edu.br"
  },
  {
    "name": "Ramon Simeone Fagundes",
    "email": "ramon-fagundes@uergs.edu.br"
  },
  {
    "name": "Raphael Paixão",
    "email": "raphael-paixao@uergs.edu.br"
  },
  {
    "name": "raphapaixao2001",
    "email": "raphapaixao2001@gmail.com"
  },
  {
    "name": "Raul Christoffer Claro Da Costa",
    "email": "raul-costa@uergs.edu.br"
  },
  {
    "name": "Renata Lima",
    "email": "re_lima@outlook.com"
  },
  {
    "name": "Rhuan Ravier De Souza Andrade",
    "email": "rhuan-andrade@uergs.edu.br"
  },
  {
    "name": "Robson Teixeira",
    "email": "robson-silva@uergs.edu.br"
  },
  {
    "name": "Rodrigo Alves Lima",
    "email": "rodrigo-lima@uergs.edu.br"
  },
  {
    "name": "Ronald Dos Santos Roggia",
    "email": "ronald-roggia@uergs.edu.br"
  },
  {
    "name": "Samuel Camargo Lorentz",
    "email": "samuel-lorentz@uergs.edu.br"
  },
  {
    "name": "Samuel Freitas Bitencourt",
    "email": "samuel-bitencourt@uergs.edu.br"
  },
  {
    "name": "Samuel Griza",
    "email": "samuel-griza@uergs.edu.br"
  },
  {
    "name": "Samuel Henrique Batista Gomes",
    "email": "samuel-gomes@uergs.edu.br"
  },
  {
    "name": "Sander Cardoso Da Rosa",
    "email": "sander-rosa@uergs.edu.br"
  },
  {
    "name": "Saul Peres Da Costa",
    "email": "saul-costa@uergs.edu.br"
  },
  {
    "name": "Selmo Antunes Correa Junior",
    "email": "selmo-junior@uergs.edu.br"
  },
  {
    "name": "Sergio Honorina Silva",
    "email": "sergio-silva@uergs.edu.br"
  },
  {
    "name": "Sidney Adriano",
    "email": "sidney-adriano@uergs.edu.br"
  },
  {
    "name": "silva.eduardo.1408",
    "email": "silva.eduardo.1408@gmail.com"
  },
  {
    "name": "Silvio Rauber Diel",
    "email": "silvio-diel@uergs.edu.br"
  },
  {
    "name": "Sven Carlos Kern Uhr",
    "email": "sven-uhr@uergs.edu.br"
  },
  {
    "name": "Tainá Nascente Da Rosa",
    "email": "taina-rosa@uergs.edu.br"
  },
  {
    "name": "Talit Moraes De Albuquerque",
    "email": "talit-albuquerque@uergs.edu.br"
  },
  {
    "name": "Talita Furtado Garcia",
    "email": "talita-garcia@uergs.edu.br"
  },
  {
    "name": "talitagarcia79631",
    "email": "talitagarcia79631@gmail.com"
  },
  {
    "name": "Thiago Silveira Soares",
    "email": "thiago-soares@uergs.edu.br"
  },
  {
    "name": "tollerbruno04",
    "email": "tollerbruno04@gmail.com"
  },
  {
    "name": "Valmir De Oliveira Filho",
    "email": "valmir-filho@uergs.edu.br"
  },
  {
    "name": "Vanderson Goulart De Vargas",
    "email": "vanderson-vargas@uergs.edu.br"
  },
  {
    "name": "Vanessa Teixeira",
    "email": "vanessa-teixeira@uergs.edu.br"
  },
  {
    "name": "Vera Lucia Moraes De Lima",
    "email": "vera-lima@uergs.edu.br"
  },
  {
    "name": "Victor Dos Santos Fritsch",
    "email": "victor-fritsch@uergs.edu.br"
  },
  {
    "name": "Victor Grandini Da Silva",
    "email": "victor-silva01@uergs.edu.br"
  },
  {
    "name": "Victor Hugo S De Lima Yoshinaga",
    "email": "victor-yoshinaga@uergs.edu.br"
  },
  {
    "name": "Victtoria Ferreira Da Silva",
    "email": "victtoria-silva@uergs.edu.br"
  },
  {
    "name": "Vinicius Guterres Menda",
    "email": "vinicius-menda@uergs.edu.br"
  },
  {
    "name": "Vinícius Quintana Pereira",
    "email": "vinicius-quintana@uergs.edu.br"
  },
  {
    "name": "Vitor Macedo Ochoa",
    "email": "vitor-ochoa@uergs.edu.br"
  },
  {
    "name": "Vitório Provensi Fernandes",
    "email": "vitorio-fernandes@uergs.edu.br"
  },
  {
    "name": "vitorio.pro",
    "email": "vitorio.pro@gmail.com"
  },
  {
    "name": "Vivian Oliveira Galante",
    "email": "vivian-galante@uergs.edu.br"
  },
  {
    "name": "Voldinei Quevedo Robalo",
    "email": "voldinei-robalo@uergs.edu.br"
  },
  {
    "name": "Wellyngton Vianna De Matos",
    "email": "wellyngton-matos@uergs.edu.br"
  },
  {
    "name": "Wender G Serrao Nascimento",
    "email": "wender-nascimento@uergs.edu.br"
  },
  {
    "name": "Weslei Rodrigues Veiga",
    "email": "weslei-veiga@uergs.edu.br"
  },
  {
    "name": "Wesley Krauss Bertissolo",
    "email": "wesley-bertissolo@uergs.edu.br"
  },
  {
    "name": "William Robertson Bica Naiff",
    "email": "william-naiff@uergs.edu.br"
  },
  {
    "name": "Willian Lopes Cruz",
    "email": "willian-cruz@uergs.edu.br"
  },
  {
    "name": "Yuri Ribeiro Fernandes",
    "email": "yuri-fernandes@uergs.edu.br"
  },
  {
    "name": "Yuri Seiya Dos Santos Fonseca",
    "email": "yuri-fonseca@uergs.edu.br"
  }
],

  /* Lista rápida de e-mails homologados para a urna */
  get VOTING_ALLOWED_EMAILS() {
    return this.STUDENTS_DATABASE.map(s => s.email);
  },

  /* ---------- Membros da Diretoria com Acesso Administrativo Autorizado ----------
   * Apenas os e-mails listados aqui (ou eleitos/aprovados pela gestão no painel)
   * têm o Painel ADM liberado e visível.
   */
  APPROVED_ADMIN_EMAILS: [
    "ca.eca2.uergs@gmail.com",
  ],

  /* Helper para verificar se um e-mail é da diretoria pré-configurada */
  isAdminEmail(email = "") {
    if (!email) return false;
    const clean = String(email).trim().toLowerCase();
    return this.APPROVED_ADMIN_EMAILS.some(e => e.toLowerCase() === clean);
  },

  /* Helper para buscar aluno homologado pelo e-mail */
  findStudentByEmail(email = "") {
    const clean = String(email).trim().toLowerCase();
    return this.STUDENTS_DATABASE.find(s => s.email.toLowerCase() === clean) || null;
  },

  /* ---------- Assembleia de fundação & Salchipão ---------- */
  EVENT: {
    title: "1º Encontro & Salchipão do E(CA)² · Coleta de Assinaturas & Fundação",
    datetime: "2026-10-26T18:30:00-03:00",
    horarioDistribuicao: "18:30 às 19:15",
    location: "Refeitório da UERGS – Unidade Porto Alegre · Rua Washington Luiz, 675",
  },

  /* ---------- Redes sociais (deixe "" se ainda não existir) ---------- */
  SOCIAL: {
    instagram: "",          // ex.: "https://instagram.com/eca2.uergs"
    whatsapp: "",           // link de convite da Comunidade
    youtube: "",            // ex.: "https://youtube.com/@eca2uergs"
    email: "",              // ex.: "eca2.uergs@gmail.com"
  },
};
