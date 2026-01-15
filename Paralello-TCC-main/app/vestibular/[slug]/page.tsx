import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  DollarSign,
  Users,
  Info,
  Download,
  ExternalLink,
  TrendingUp,
} from "lucide-react"
import { notFound } from "next/navigation"

const vestibularData = {
  fuvest: {
    name: "FUVEST",
    fullName: "Fundação Universitária para o Vestibular",
    color: "bg-[#01B0FF]/90",
    textColor: "text-white",
    logo: "/images/fuvest_img.png",
    bgImage: "/images/usp-real.webp",
    description:
      "A Fuvest é a instituição responsável pelo vestibular da USP (Universidade de São Paulo), uma das mais prestigiadas universidades do Brasil e da América Latina.",
    about:
      "O vestibular da FUVEST é conhecido por sua alta concorrência e rigor acadêmico. Para o vestibular de 2025, há cerca de 8.147 vagas ofertadas, divididas em categorias: ampla concorrência (~50%), escolas públicas (~31,5%) e pessoas pretas, pardas, indígenas e egressas de escola pública (~18,5%). A prova é dividida em duas fases: a primeira com 90 questões de múltipla escolha abrangendo todas as disciplinas do ensino médio, e a segunda fase com questões dissertativas específicas para cada carreira escolhida, além de redação e provas de habilidades específicas para alguns cursos.",
    inscricao: {
      periodo: "19 de agosto a 8 de outubro (2025)",
      taxa: "R$ 211",
      requisitos:
        "Documento de identidade, CPF, escolha da carreira/curso e indicação se concorre por ampla concorrência ou via cotas. Possibilidade de solicitar recursos específicos para candidatos com necessidades especiais (intérprete de libras, prova ampliada, braile, etc.).",
    },
    cronograma: {
      inscricoes: "19/08 a 08/10",
      locais1fase: "Divulgação em 01/11",
      prova1fase: "17 de novembro",
      prova2fase: "15 e 16 de dezembro",
      resultado: "24 de janeiro de 2025",
    },
    phases: [
      {
        title: "1ª Fase",
        description:
          "90 questões de múltipla escolha (5 alternativas cada) abrangendo Biologia, Física, Química, Matemática, História, Geografia, Português e Inglês. É necessário acertar no mínimo 30% da prova (27 questões) para avançar para a segunda fase.",
        duration: "5 horas",
      },
      {
        title: "2ª Fase - Dia 1",
        description:
          "Prova de Português (10 questões discursivas) + Redação dissertativa-argumentativa. As questões podem envolver interpretação de textos, análise literária, gramática aplicada ao texto e leitura das obras obrigatórias.",
        duration: "4 horas",
      },
      {
        title: "2ª Fase - Dia 2",
        description:
          "Provas de 2 a 4 disciplinas obrigatórias conforme o curso (ex: Medicina: Biologia, Química, Física; Direito: História, Geografia, Matemática; Engenharias: Matemática, Física, Química). Todas discursivas com respostas abertas.",
        duration: "4 horas",
      },
      {
        title: "2ª Fase - Dia 3 (apenas alguns cursos)",
        description:
          "Prova de Habilidades Específicas para cursos como Artes Cênicas, Música, Artes Visuais, Audiovisual e Arquitetura e Urbanismo. Cada curso tem formato próprio de prova.",
        duration: "Variável",
      },
    ],
    avaliacao:
      "A nota da 1ª fase é usada para selecionar quem avança e para compor a nota final. A 2ª fase vale 200 pontos totais, sendo 100 pontos por dia. Zerar alguma prova da 2ª fase (como não responder a redação) pode eliminar o candidato. O cálculo da nota final considera as pontuações ponderadas das duas fases, variando conforme o curso.",
    leituras: {
      "2026": [
        "Opúsculo Humanitário (1853) – Nísia Floresta",
        "Nebulosas (1872) – Narcisa Amália",
        "Memórias de Martha (1899) – Julia Lopes de Almeida",
        "Caminho de pedras (1937) – Rachel de Queiroz",
        "O Cristo Cigano (1961) – Sophia de Mello Breyner Andresen",
        "As meninas (1973) – Lygia Fagundes Telles",
        "Balada de amor ao vento (1990) – Paulina Chiziane",
        "Canção para ninar menino grande (2018) – Conceição Evaristo",
        "A visão das plantas (2019) – Djaimilia Pereira de Almeida",
      ],
      "2027": [
        "Opúsculo Humanitário (1853) – Nísia Floresta",
        "Nebulosas (1872) – Narcisa Amália",
        "Memórias de Martha (1899) – Julia Lopes de Almeida",
        "Caminho de pedras (1937) – Rachel de Queiroz",
        "A paixão segundo G. H. (1964) – Clarice Lispector",
        "Geografia (1967) – Sophia de Mello Breyner Andresen",
        "Balada de amor ao vento (1990) – Paulina Chiziane",
        "Canção para ninar menino grande (2018) – Conceição Evaristo",
        "A visão das plantas (2019) – Djaimilia Pereira de Almeida",
      ],
      "2028": [
        "Conselhos à minha filha (1842) – Nísia Floresta",
        "Nebulosas (1872) – Narcisa Amália",
        "Memórias de Martha (1899) – Julia Lopes de Almeida",
        "João Miguel (1932) – Rachel de Queiroz",
        "A paixão segundo G. H. (1964) – Clarice Lispector",
        "Geografia (1967) – Sophia de Mello Breyner Andresen",
        "Balada de amor ao vento (1990) – Paulina Chiziane",
        "Canção para ninar menino grande (2018) – Conceição Evaristo",
        "A visão das plantas (2019) – Djaimilia Pereira de Almeida",
      ],
      "2029": [
        "Conselhos à minha filha (1842) – Nísia Floresta",
        "Nebulosas (1872) – Narcisa Amália",
        "D. Casmurro (1899) – Machado de Assis",
        "João Miguel (1932) – Rachel de Queiroz",
        "Nós matamos o cão tinhoso! (1964) – Luís Bernardo Honwana",
        "Geografia (1967) – Sophia de Mello Breyner Andresen",
        "Incidente em Antares (1970) – Érico Veríssimo",
        "Canção para ninar menino grande (2018) – Conceição Evaristo",
        "A visão das plantas (2019) – Djaimilia Pereira de Almeida",
      ],
    },
    acessibilidade:
      "A Fuvest possui Guia de Inclusão com recursos para candidatos com deficiência, lactantes, intérpretes, etc. Recursos específicos incluem: tempo extra, sala especial, prova em Braille, prova ampliada, entre outros. Para candidatas lactantes, há possibilidade de acompanhamento, sala específica para criança e tempo de amamentação compensado (até 1 hora) se comprovado.",
    isencao:
      "É possível pedir isenção ou redução da taxa de inscrição. Para 2025, os resultados preliminares do pedido de isenção/redução saíram em 5 de agosto, e recursos podiam ser feitos até 12 de agosto. É necessário comprovar renda ou situação para solicitar esse benefício.",
    documentos: {
      edital: "https://www.fuvest.br/vestibular-da-usp",
      concorrencia: "https://www.fuvest.br/wp-content/uploads/fuvest2026_relacao_candidato_vaga.pdf",
      notasCorte: "https://www.fuvest.br/wp-content/uploads/fuvest_2025_notas_de_corte.pdf",
    },
    provasAnteriores: [
      { ano: "2025", url: "https://www.fuvest.br/acervo-vestibular-2025" },
      { ano: "2024", url: "https://www.fuvest.br/acervo-vestibular-2024" },
      { ano: "2023", url: "https://www.fuvest.br/acervo-vestibular-2023" },
      { ano: "2022", url: "https://www.fuvest.br/acervo-vestibular-2022" },
    ],
    tips: [
      "Estudar o programa oficial da Fuvest (guia de provas) é fundamental, pois o vestibular cobra bastante conteúdo clássico do ensino médio",
      "Fazer simulados e provas antigas da Fuvest para se acostumar com o formato característico (perguntas objetivas, discursivas, tempo de prova, redação)",
      "Ler todas as obras literárias obrigatórias da lista mais recente é essencial",
      "Se for prestar para curso com prova de habilidades específicas (Música, Artes), treinar para essas provas com antecedência",
      "Na 1ª fase, gerencie bem o tempo - são 90 questões em 5 horas",
      "A redação vale muito na nota final - pratique regularmente",
      "Para a 2ª fase, foque nas disciplinas específicas da sua carreira escolhida",
    ],
  },
  unicamp: {
    name: "UNICAMP",
    fullName: "Universidade Estadual de Campinas",
    color: "bg-[#FC1F69]/90",
    textColor: "text-white",
    logo: "/images/unicamp_img.png",
    bgImage: "/images/unicamp-real.jpg",
    description:
      "O processo seletivo tradicional da Universidade Estadual de Campinas (Unicamp) para ingresso em cursos de graduação, organizado pela Comvest (Comissão Permanente para os Vestibulares da Unicamp).",
    about:
      "O vestibular da UNICAMP é um dos mais concorridos do país, conhecido por suas questões interdisciplinares e pela valorização da capacidade de argumentação dos candidatos. Para o vestibular tradicional (2025), há 2.537 vagas ofertadas, e no total de todos os processos de ingresso (incluindo Enem-Unicamp, vestibular indígena, olimpíadas) são 3.340 vagas. Há também reserva de vagas para escola pública, cotas étnico-raciais e inclusão social. É permitido fazer até duas opções de curso, desde que sejam da mesma área.",
    inscricao: {
      periodo: "1º a 30 de agosto (2025)",
      taxa: "R$ 221",
      requisitos:
        "Inscrições feitas pela internet no site da Comvest. É permitido fazer até duas opções de curso, desde que sejam da mesma área (ambas humanas, ou ambas exatas).",
    },
    cronograma: {
      inscricoes: "1º a 30 de agosto",
      prova1fase: "20 de outubro",
      prova2fase: "1º e 2 de dezembro",
      habilidades: "Datas próprias para cada curso",
      resultado: "Final de janeiro (1ª chamada)",
    },
    phases: [
      {
        title: "1ª Fase",
        description:
          "Prova de conhecimentos gerais com 72 questões objetivas abrangendo todas as áreas do conhecimento.",
        duration: "5 horas",
      },
      {
        title: "2ª Fase - Dia 1",
        description:
          "Redação + Língua Portuguesa + Língua Inglesa + Ciências da Natureza (Física, Química e Biologia). Cada disciplina tem questões abertas que podem ter itens internos valendo pontos. A redação oferece duas propostas e o candidato escolhe uma para desenvolver.",
        duration: "5 horas",
      },
      {
        title: "2ª Fase - Dia 2",
        description:
          "Matemática + Ciências Humanas (História, Geografia, Filosofia, Sociologia) + Conhecimentos Específicos do curso escolhido. Exemplos: Medicina (mais Biologia e Química), Engenharia (Matemática e Física adicionais), Humanas (História, Geografia, Filosofia aprofundadas).",
        duration: "5 horas",
      },
      {
        title: "Habilidades Específicas (alguns cursos)",
        description:
          "Provas práticas e/ou teóricas próprias para cursos como Música, Dança, Artes Cênicas e Artes Visuais, com calendário separado.",
        duration: "Variável",
      },
    ],
    avaliacao:
      "As questões da 2ª fase são discursivas. Cada questão discursiva geralmente vale até 4 pontos, e itens internos podem valer 2 pontos. A classificação final considera a soma ponderada da 1ª e 2ª fase, variando conforme o curso. A Comvest também organiza os candidatos conforme a opção de curso escolhida (1ª ou 2ª opção). A nota final considera também o bônus PAAIS (política de inclusão da Unicamp).",
    leituras: {
      "2026": [
        "Prosas seguidas de odes mínimas — José Paulo Paes",
        "Olhos d'água — Conceição Evaristo",
        "A vida não é útil — Ailton Krenak",
        "Casa Velha — Machado de Assis",
        "Vida e morte de M.J. Gonzaga de Sá — Lima Barreto",
        "No seu pescoço — Chimamanda Ngozi Adichie",
        "Morangos mofados (6 contos selecionados) — Caio Fernando Abreu",
        "Canções escolhidas — Cartola",
        "Alice no país das maravilhas — Lewis Carroll",
      ],
      "2027": [
        "A vida não é útil — Ailton Krenak",
        "Prosas seguidas de odes mínimas — José Paulo Paes",
        "Morangos mofados — Caio Fernando Abreu",
        "Vida e morte de M.J. Gonzaga de Sá — Lima Barreto",
        "No seu pescoço — Chimamanda Ngozi Adichie",
        "Olhos d'água — Conceição Evaristo",
        "Memórias Póstumas de Brás Cubas — Machado de Assis",
        "Canções escolhidas — Paulo César Pinheiro",
        "Os funerais da Mamãe Grande — Gabriel García Márquez",
      ],
      "2028": [
        "Prosas seguidas de odes mínimas — José Paulo Paes",
        "Vida e morte de M.J. Gonzaga de Sá — Lima Barreto",
        "No seu pescoço — Chimamanda Ngozi Adichie",
        "Os funerais da Mamãe Grande — Gabriel García Márquez",
        "O direito à literatura (capítulo de Vários Escritos) — Antonio Candido",
        "O Quinze — Raquel de Queiróz",
        "Quarenta Dias — Maria Valéria Rezende",
      ],
      "2029": [
        "Memórias Póstumas de Brás Cubas — Machado de Assis",
        "Canções escolhidas — Paulo César Pinheiro",
        "Os funerais da Mamãe Grande — Gabriel García Márquez",
        "O direito à literatura — Antonio Candido",
        "O Quinze — Raquel de Queiróz",
        "Quarenta Dias — Maria Valéria Rezende",
        "Broquéis — Cruz e Souza",
        "Lésbia — Maria Benedita Bormann",
        "Chá do príncipe — Olinda Beja",
      ],
    },
    acessibilidade:
      "A Comvest oferece adaptações como provas ampliadas, braile ou adaptadas, atendimento especializado, tempo adicional e salas acessíveis. A Unicamp também possui políticas de inclusão e vagas reservadas para determinados grupos sociais.",
    isencao:
      "A Unicamp concede isenção da taxa de inscrição para: estudantes de baixa renda e escola pública, funcionários da Unicamp, estudantes de cursos noturnos e estudantes bolsistas integrais em escolas privadas. É necessário enviar documentação comprobatória. Em caso de indeferimento, o candidato pode entrar com recurso.",
    documentos: {
      edital: "https://www.comvest.unicamp.br/wp-content/uploads/2025/07/Edital-Vestibular-Unicamp-2026.pdf",
      concorrencia: "https://www.comvest.unicamp.br/ingresso-2024/vestibular-2024-2/relacao-candidatos-vaga-1a-fase",
      notasCorte: "https://www.comvest.unicamp.br/ingresso-2025/vestibular-2025/numero-de-acertos-para-2a-fase",
    },
    provasAnteriores: [
      { ano: "2024", url: "https://www.comvest.unicamp.br/vestibulares-anteriores" },
      { ano: "2023", url: "https://www.comvest.unicamp.br/vestibulares-anteriores" },
      { ano: "2022", url: "https://www.comvest.unicamp.br/vestibulares-anteriores" },
      { ano: "2021", url: "https://www.comvest.unicamp.br/vestibulares-anteriores" },
    ],
    tips: [
      "Desenvolva habilidades de interpretação e argumentação - fundamentais para a Unicamp",
      "A redação tem peso dobrado - treine bastante com temas atuais",
      "Questões são interdisciplinares - pratique conectar diferentes disciplinas",
      "Leia atualidades e desenvolva senso crítico",
      "Estude todas as obras literárias obrigatórias com profundidade",
      "Resolva provas anteriores para entender o estilo das questões discursivas",
      "Na 2ª fase, desenvolva respostas completas e bem fundamentadas",
    ],
  },
  enem: {
    name: "ENEM",
    fullName: "Exame Nacional do Ensino Médio",
    color: "bg-[#FBBA2E]/90",
    textColor: "text-white",
    logo: "/images/enem_img.png",
    bgImage: "/images/enem-real.jpg",
    description:
      "O ENEM (Exame Nacional do Ensino Médio) é uma prova administrada pelo INEP/MEC. Originalmente criado para avaliar o desempenho dos estudantes ao final da educação básica, tornou-se uma das principais portas de entrada para a graduação via SISU, ProUni e FIES.",
    about:
      "O ENEM avalia competências e habilidades desenvolvidas ao longo do ensino médio. A prova é aplicada em dois dias, com 180 questões objetivas divididas em quatro áreas do conhecimento, além da redação dissertativo-argumentativa. A nota pode ser utilizada em diversos processos seletivos. O ENEM por si só não oferece vagas diretamente, mas suas notas são usadas para seleção em universidades públicas (via SISU), programas como Prouni (bolsas em universidades privadas - integral 100% ou parcial 50%) e FIES (financiamento estudantil com juros baixos ou zero). No ENEM 2025, também há a opção de usar a prova para certificar a conclusão do ensino médio.",
    inscricao: {
      periodo: "Até 6 de junho (2025)",
      taxa: "Varia anualmente",
      requisitos:
        "Inscrições realizadas pela Página do Participante (site oficial do INEP). Mesmo que o candidato tenha recebido isenção da taxa, ele precisa fazer a inscrição para participar do exame. No momento da inscrição, é possível solicitar atendimento especializado (recursos de acessibilidade) e tratamento por nome social.",
    },
    cronograma: {
      isencao: "14 a 25 de abril (pedido de isenção/justificativa)",
      resultadoIsencao: "12 de maio",
      recurso: "12 a 16 de maio",
      inscricoes: "Até 6 de junho",
      atendimento: "Até 6 de junho (prazo para solicitar atendimento especializado)",
      provas: "9 e 16 de novembro de 2025",
      alternativo: "30 de novembro e 7 de dezembro (Belém, Ananindeua e Marituba - PA)",
    },
    phases: [
      {
        title: "1º Dia",
        description:
          "Linguagens, Códigos e suas Tecnologias (45 questões) + Ciências Humanas e suas Tecnologias (45 questões) + Redação dissertativo-argumentativa. Cada questão tem 5 alternativas (A, B, C, D, E).",
        duration: "5h30min",
      },
      {
        title: "2º Dia",
        description:
          "Ciências da Natureza e suas Tecnologias - Biologia, Física, Química (45 questões) + Matemática e suas Tecnologias (45 questões). Cada questão tem 5 alternativas (A, B, C, D, E).",
        duration: "5 horas",
      },
    ],
    avaliacao:
      "A correção das questões objetivas usa a Teoria de Resposta ao Item (TRI). A nota não depende só do número de acertos, mas da coerência das respostas e dificuldade de cada questão. Na TRI, cada item tem parâmetros: discriminação, dificuldade e probabilidade de acerto por chute. Para a redação, o ENEM avalia conforme competências (geralmente cinco): compreensão da proposta, domínio da norma culta, argumentação, proposta de intervenção, organização das ideias. A pontuação máxima de cada uma das cinco áreas (4 objetivas + redação) é 1.000 pontos. Para nota geral: soma-se as notas das 5 áreas e divide por 5 (podendo haver pesos diferentes conforme curso/instituição).",
    leituras: {
      observacao:
        "Diferentemente de alguns vestibulares clássicos (como a Fuvest), o ENEM não tem uma lista fixa de obras literárias obrigatórias. O exame testa competências de compreensão, interpretação, argumentação e análise de textos variados.",
    },
    acessibilidade:
      "O INEP oferece atendimento especializado para quem tiver necessidades específicas, desde que justificado no ato da inscrição. Recursos possíveis: Prova em Braile, Tradutor-intérprete de Libras, Videoprova em Libras, Provas ampliadas ou superampliadas, Leitor de tela, Guia-intérprete, auxílio para leitura e transcrição, leitura labial, tempo adicional (+60 minutos por dia), sala de fácil acesso, mesa para cadeira de rodas, apoio para pernas/pés, entre outros. Também é permitido usar materiais próprios: máquina de escrever em Braile, reglete, lupa, tiposcópio, telelupa, etc.",
    isencao:
      "Pedido de isenção pode ser feito pela Página do Participante. Perfil de quem pode solicitar: estudantes matriculados no 3º ano do ensino médio em escola pública, quem fez todo o ensino médio em escola pública (ou bolsa integral em privada) e tem renda igual ou inferior a 1,5 salários mínimos, famílias em situação de vulnerabilidade (Cadastro Único/CadÚnico), participantes do programa Pé-de-Meia do MEC. Mesmo com isenção aceita, é preciso realizar a inscrição para fazer a prova.",
    documentos: {
      edital: "https://download.inep.gov.br/enem/edital_52_de_23_de_maio_de_2025.pdf",
      concorrencia: "",
      notasCorte: "",
    },
    provasAnteriores: [
      {
        ano: "2024",
        url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
      },
      {
        ano: "2023",
        url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
      },
      {
        ano: "2022",
        url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
      },
      {
        ano: "2021",
        url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
      },
    ],
    programas: {
      sisu: "Sistema de Seleção Unificada do governo federal que usa exclusivamente a nota do ENEM para selecionar estudantes para vagas em universidades públicas (federais e estaduais). A seleção ocorre duas vezes por ano (início e meio do ano), com chamadas regulares e lista de espera. Não envolve mensalidade.",
      prouni:
        "Programa Universidade para Todos oferece bolsas de estudo em universidades privadas. Bolsas: Integral (100%) ou Parcial (50%). Destinado principalmente para estudantes de baixa renda que estudaram em escola pública ou como bolsista integral em escola privada.",
      fies: "Fundo de Financiamento Estudantil é um programa de financiamento (não dá bolsa - empresta o valor). Características: juros baixos ou zero, pagamento após conclusão do curso, exige ter feito ENEM e atingir pontuação mínima. Ajuda quem não conseguiu bolsa no Prouni.",
    },
    tips: [
      "Gerencie bem o tempo - são muitas questões (180 no total)",
      "A redação segue modelo específico dissertativo-argumentativo - estude a estrutura e as 5 competências",
      "Questões são contextualizadas e interdisciplinares - pratique interpretação de textos",
      "Use a nota em múltiplas universidades através do SISU",
      "A relevância da redação é grande - uma boa redação pode fazer muita diferença",
      "Por causa da TRI, chutar sem coerência pode atrapalhar - responda com lógica",
      "Treine com provas anteriores para se familiarizar com o formato",
      "Fique atualizado sobre temas sociais, políticos e científicos para a redação",
    ],
  },
  vunesp: {
    name: "VUNESP",
    fullName: "Fundação para o Vestibular da Unesp",
    color: "bg-[#CADDFF]/90",
    textColor: "text-white",
    logo: "/images/vunesp_img.png",
    bgImage: "/images/unesp-real.jpeg",
    description:
      "O vestibular aplicado pela Vunesp é o processo seletivo utilizado pela Universidade Estadual Paulista (Unesp) para ingresso em seus cursos de graduação. É um dos maiores vestibulares do país e ocorre anualmente.",
    about:
      "A VUNESP é responsável pelo vestibular da UNESP e de outras instituições, sendo reconhecida pela qualidade técnica de suas provas. A Unesp costuma oferecer cerca de 7.400 vagas por ano, com parte das vagas destinada ao sistema de reserva de vagas para alunos de escola pública e cotas étnico-raciais. O vestibular é dividido em duas fases: a primeira possui 90 questões de múltipla escolha, enquanto a segunda fase inclui questões dissertativas específicas da área escolhida. O candidato escolhe apenas um curso no ato da inscrição. As provas são conhecidas por exigirem conhecimento aprofundado e raciocínio lógico.",
    inscricao: {
      periodo: "Agosto e setembro (geralmente)",
      taxa: "Aproximadamente R$ 192",
      requisitos:
        "Inscrição realizada online pelo site da Vunesp. O candidato escolhe apenas um curso no ato da inscrição (diferente da Unicamp e Fuvest). É possível solicitar isenção ou redução da taxa conforme critérios socioeconômicos.",
    },
    cronograma: {
      inscricoes: "Agosto e setembro",
      prova1fase: "Novembro",
      prova2fase: "Dezembro",
      resultado: "Janeiro",
    },
    phases: [
      {
        title: "1ª Fase - Prova Objetiva",
        description:
          "90 questões de múltipla escolha abrangendo todas as disciplinas do ensino médio. Questões são diretas, com nível médio a alto dependendo da matéria. Fase eliminatória.",
        duration: "5 horas",
      },
      {
        title: "2ª Fase - Prova 1",
        description:
          "Linguagens + Ciências Humanas: Redação + Questões discursivas de Língua Portuguesa + Questões de Humanidades (História, Geografia, Filosofia, Sociologia).",
        duration: "Conforme edital",
      },
      {
        title: "2ª Fase - Prova 2",
        description:
          "Ciências da Natureza + Matemática: Questões discursivas de Biologia + Química + Física + Matemática. A estrutura exata depende do curso, mas normalmente todas as áreas aparecem.",
        duration: "Conforme edital",
      },
    ],
    avaliacao:
      "A 1ª fase é eliminatória. A 2ª fase tem peso maior e define a classificação final. A redação costuma ter grande impacto na nota final. Cursos mais concorridos (como Medicina, Direito e Engenharias) priorizam desempenho geral + desempenho nas áreas específicas.",
    leituras: {
      observacao:
        "A Unesp não possui lista fixa anual de obras obrigatórias, ao contrário da Fuvest e Unicamp. As questões de Literatura cobram movimentos literários, autores clássicos, análise de textos e estilos literários.",
    },
    acessibilidade:
      "A Vunesp oferece: Provas ampliadas, atendimento especializado, leitores e intérpretes, salas acessíveis, possibilidade de tempo adicional. A Unesp também possui políticas de reserva de vagas (escola pública e cotas raciais).",
    isencao:
      "A Vunesp concede: Isenção completa para candidatos de baixa renda (com comprovação) e redução de 50% da taxa de inscrição para estudantes conforme critérios socioeconômicos definidos em edital. Processos possuem prazos específicos anteriores à inscrição regular.",
    documentos: {
      edital: "https://www.vunesp.com.br/",
      concorrencia: "https://www.vunesp.com.br/",
      notasCorte: "https://www.vunesp.com.br/",
    },
    provasAnteriores: [
      { ano: "2024", url: "https://www.vunesp.com.br/" },
      { ano: "2023", url: "https://www.vunesp.com.br/" },
      { ano: "2022", url: "https://www.vunesp.com.br/" },
      { ano: "2021", url: "https://www.vunesp.com.br/" },
    ],
    tips: [
      "Foque em conhecimento aprofundado das disciplinas - a Vunesp cobra teoria e aplicação",
      "Questões exigem raciocínio lógico e aplicação prática do conhecimento",
      "Estude as especificidades da sua área de interesse para a 2ª fase",
      "Pratique com provas anteriores da VUNESP para entender o estilo das questões",
      "A redação tem grande peso - treine regularmente",
      "Gerencie bem o tempo na 1ª fase - são 90 questões em 5 horas",
      "Para cursos concorridos, todo ponto conta - não deixe questões em branco sem pensar",
    ],
  },
}

export default function VestibularPage({ params }: { params: { slug: string } }) {
  const vestibular = vestibularData[params.slug as keyof typeof vestibularData]
  const slug = params.slug

  if (!vestibular) {
    notFound()
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar para página inicial</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero section with vestibular name - responsive padding and text */}
      <section className={`relative py-12 sm:py-16 md:py-24 overflow-hidden`}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={vestibular.bgImage || "/placeholder.svg"}
            alt={`Campus ${vestibular.name}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center text-white">
            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-md">
              {vestibular.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl drop-shadow-sm font-medium">{vestibular.fullName}</p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground/80">
              {vestibular.description}
            </p>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Visão Geral</h2>
            <p className="text-base leading-relaxed text-foreground/70 md:text-lg">{vestibular.about}</p>
          </div>
        </div>
      </section>

      {/* Inscription details section */}
      {vestibular.inscricao && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Inscrições</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Período</h3>
                  </div>
                  <p className="text-foreground/70">{vestibular.inscricao.periodo}</p>
                </div>
                <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Taxa</h3>
                  </div>
                  <p className="text-foreground/70">{vestibular.inscricao.taxa}</p>
                </div>
                <div className="rounded-lg border border-border bg-white p-6 shadow-sm md:col-span-2">
                  <div className="mb-3 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Requisitos</h3>
                  </div>
                  <p className="text-foreground/70">{vestibular.inscricao.requisitos}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Schedule section */}
      {vestibular.cronograma && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Cronograma</h2>
              <div className="space-y-3">
                {Object.entries(vestibular.cronograma).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-4 rounded-lg border border-border bg-white p-4 shadow-sm"
                  >
                    <Clock className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground capitalize">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace("1fase", "1ª Fase")
                          .replace("2fase", "2ª Fase")}
                      </h3>
                      <p className="text-foreground/70">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-primary md:text-3xl">Fases do Vestibular</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {vestibular.phases.map((phase, index) => (
                <div key={index} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                  </div>
                  <p className="mb-3 text-foreground/70">{phase.description}</p>
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Clock className="h-4 w-4" />
                    <span>{phase.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evaluation section */}
      {vestibular.avaliacao && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Avaliação</h2>
              <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <p className="text-base leading-relaxed text-foreground/70 md:text-lg">{vestibular.avaliacao}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Required readings section */}
      {vestibular.leituras && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Leituras Obrigatórias</h2>
          {"observacao" in vestibular.leituras && vestibular.leituras.observacao ? (
                <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                      <p className="text-foreground/70">{String(vestibular.leituras.observacao)}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(vestibular.leituras)
                    .filter(([key]) => key !== "observacao")
                    .map(([year, books]) => (
                      <div key={year} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Lista {year}
                        </h3>
                        <ul className="space-y-2">
                          {(books as string[]).map((book, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-foreground/70">{book}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ENEM programs section */}
  {"programas" in vestibular && vestibular.programas && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Programas que Usam o ENEM</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {Object.entries(vestibular.programas).map(([key, description]) => (
                  <div key={key} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                    <h3 className="mb-3 text-lg font-bold text-foreground uppercase">{key}</h3>
                    <p className="text-sm leading-relaxed text-foreground/70">{String(description)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Accessibility section */}
      {vestibular.acessibilidade && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Acessibilidade</h2>
              <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                  <p className="text-base leading-relaxed text-foreground/70 md:text-lg">{vestibular.acessibilidade}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Fee exemption section */}
      {vestibular.isencao && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Isenção de Taxa</h2>
              <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                  <p className="text-base leading-relaxed text-foreground/70 md:text-lg">{vestibular.isencao}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Official documents section */}
      {vestibular.documentos && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Documentos Oficiais</h2>
              <p className="mb-6 text-foreground/70">
                Acesse os documentos oficiais com informações completas sobre o processo seletivo
              </p>
              <div className={`grid gap-4 ${slug === "enem" ? "sm:grid-cols-1" : "sm:grid-cols-2 md:grid-cols-3"}`}>
                <a
                  href={vestibular.documentos.edital}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Edital Oficial</h3>
                  </div>
                  <p className="text-sm text-foreground/70 mb-3">
                    Acesse o edital completo com todas as informações e regras do processo seletivo
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                    <span>Acessar</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </a>

                {slug !== "enem" && (
                  <>
                    <a
                      href={vestibular.documentos.concorrencia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-foreground">Concorrência</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3">
                        Veja a relação candidato/vaga dos últimos anos por curso
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                        <span>Acessar</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>

                    <a
                      href={vestibular.documentos.notasCorte}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-foreground">Notas de Corte</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3">
                        Confira as notas de corte dos cursos nos últimos anos
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                        <span>Acessar</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Past exams section */}
      {vestibular.provasAnteriores && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Provas Anteriores</h2>
              <p className="mb-6 text-foreground/70">
                Baixe as provas dos últimos anos para treinar e se familiarizar com o formato das questões
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {vestibular.provasAnteriores.map((prova) => (
                  <a
                    key={prova.ano}
                    href={prova.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg border border-border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Prova {prova.ano}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-foreground/40 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tips section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-primary md:text-3xl">Dicas de Preparação</h2>
            <div className="space-y-4">
              {vestibular.tips.map((tip, index) => (
                <div key={index} className="flex gap-4 rounded-lg border border-border bg-white p-4 shadow-sm">
                  <FileText className="h-6 w-6 flex-shrink-0 text-primary" />
                  <p className="text-foreground/70">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Link href="/#hero">
              <Button size="lg" className="rounded-full bg-secondary px-8 hover:bg-secondary/90 gap-2">
                <ArrowLeft className="h-5 w-5" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
