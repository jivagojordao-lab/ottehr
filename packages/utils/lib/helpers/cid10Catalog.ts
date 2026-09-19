/**
 * Catálogo Nacional de CID-10 em Português (Ottehr Brasil)
 * Mapeamento otimizado dos diagnósticos mais comuns na atenção primária, pronto atendimento e consultórios.
 */

export interface CID10Item {
  code: string;
  display: string;
  synonyms?: string[];
}

export const CID10_DATA: CID10Item[] = [
  // Doenças Infecciosas e Parasitárias
  { code: 'A90', display: 'Dengue [dengue clássica]', synonyms: ['febre dengue'] },
  { code: 'A91', display: 'Febre hemorrágica devida ao vírus do dengue', synonyms: ['dengue hemorrágica'] },
  { code: 'A09', display: 'Diarreia e gastroenterite de origem infecciosa presumível', synonyms: ['gastroenterite', 'GECA', 'infecção intestinal', 'virose'] },
  { code: 'U07.1', display: 'COVID-19, vírus identificado', synonyms: ['coronavirus', 'sars-cov-2'] },
  { code: 'B34.2', display: 'Infecção por coronavírus de localização não especificada', synonyms: ['covid'] },
  { code: 'B00.9', display: 'Infecção pelo vírus do herpes não especificada', synonyms: ['herpes simples', 'herpes labial'] },
  { code: 'B02.9', display: 'Herpes zóster sem complicação', synonyms: ['cobreiro'] },
  { code: 'B35.9', display: 'Dermatofitose não especificada', synonyms: ['micose', 'tinea', 'pano branco'] },
  { code: 'B37.0', display: 'Estomatite por Candida', synonyms: ['sapinho', 'candidíase oral'] },
  { code: 'B37.3', display: 'Candidíase da vulva e da vagina', synonyms: ['candidíase vaginal'] },
  { code: 'B24', display: 'Doença pelo vírus da imunodeficiência humana [HIV] não especificada', synonyms: ['aids', 'hiv'] },

  // Aparelho Respiratório
  { code: 'J00', display: 'Nasofaringite aguda [resfriado comum]', synonyms: ['resfriado', 'coriza', 'gripe leve'] },
  { code: 'J01.9', display: 'Sinusite aguda não especificada', synonyms: ['dor na face', 'sinusite'] },
  { code: 'J02.9', display: 'Faringite aguda não especificada', synonyms: ['dor de garganta', 'garganta inflamada'] },
  { code: 'J03.9', display: 'Amigdalite aguda não especificada', synonyms: ['placas na garganta', 'amigdalite purulenta'] },
  { code: 'J06.9', display: 'Infecção aguda das vias aéreas superiores não especificada', synonyms: ['IVAS', 'infecção respiratória'] },
  { code: 'J11.1', display: 'Influenza [gripe] devida a vírus não identificado', synonyms: ['gripe', 'febre e tosse', 'influenza'] },
  { code: 'J18.9', display: 'Pneumonia não especificada', synonyms: ['infecção no pulmão', 'pneumonia'] },
  { code: 'J20.9', display: 'Bronquite aguda não especificada', synonyms: ['bronquite'] },
  { code: 'J30.4', display: 'Rinite alérgica não especificada', synonyms: ['rinite', 'espirros', 'alergia nasal'] },
  { code: 'J44.9', display: 'Doença pulmonar obstrutiva crônica não especificada', synonyms: ['DPOC', 'enfisema'] },
  { code: 'J45.9', display: 'Asma não especificada', synonyms: ['bronquite asmática', 'falta de ar', 'chiado'] },

  // Aparelho Circulatório
  { code: 'I10', display: 'Hipertensão essencial (primária)', synonyms: ['pressão alta', 'HAS', 'hipertensão arterial'] },
  { code: 'I11.9', display: 'Doença cardíaca hipertensiva sem insuficiência cardíaca', synonyms: ['cardiopatia hipertensiva'] },
  { code: 'I20.9', display: 'Angina pectoris não especificada', synonyms: ['dor no peito', 'angina'] },
  { code: 'I21.9', display: 'Infarto agudo do miocárdio não especificado', synonyms: ['IAM', 'ataque cardíaco', 'infarto'] },
  { code: 'I50.9', display: 'Insuficiência cardíaca não especificada', synonyms: ['ICC', 'coração fraco', 'insuficiência cardíaca'] },
  { code: 'I48', display: 'Flutter e fibrilação atrial', synonyms: ['arritmia', 'palpitação'] },
  { code: 'I83.9', display: 'Varizes dos membros inferiores sem úlcera ou inflamação', synonyms: ['varizes', 'veias dilatadas'] },
  { code: 'I95.9', display: 'Hipotensão não especificada', synonyms: ['pressão baixa', 'tontura por pressão'] },

  // Doenças Endócrinas, Nutricionais e Metabólicas
  { code: 'E10.9', display: 'Diabetes mellitus insulino-dependente sem complicações', synonyms: ['diabetes tipo 1', 'DM1'] },
  { code: 'E11.9', display: 'Diabetes mellitus não-insulino-dependente sem complicações', synonyms: ['diabetes tipo 2', 'DM2', 'açúcar no sangue', 'glicemia alta'] },
  { code: 'E14.9', display: 'Diabetes mellitus não especificado sem complicações', synonyms: ['diabetes'] },
  { code: 'E66.9', display: 'Obesidade não especificada', synonyms: ['excesso de peso', 'obesidade'] },
  { code: 'E78.0', display: 'Hipercolesterolemia pura', synonyms: ['colesterol alto', 'colesterol elevado'] },
  { code: 'E78.1', display: 'Hipergliceridemia pura', synonyms: ['triglicerídeos altos', 'triglicérides'] },
  { code: 'E78.5', display: 'Hiperlipidemia não especificada', synonyms: ['gordura no sangue', 'dislipidemia'] },
  { code: 'E03.9', display: 'Hipotireoidismo não especificado', synonyms: ['tireoide lenta', 'hipotireoidismo'] },
  { code: 'E05.9', display: 'Tireotoxicose não especificada', synonyms: ['hipertireoidismo'] },
  { code: 'E55.9', display: 'Deficiência não especificada de vitamina D', synonyms: ['vitamina D baixa'] },
  { code: 'E86', display: 'Depleção de volume', synonyms: ['desidratação'] },

  // Aparelho Digestivo
  { code: 'K21.9', display: 'Doença de refluxo gastroesofágico sem esofagite', synonyms: ['refluxo', 'azia', 'queimação'] },
  { code: 'K29.7', display: 'Gastrite não especificada', synonyms: ['dor no estômago', 'gastrite'] },
  { code: 'K30', display: 'Dispepsia', synonyms: ['má digestão', 'estômago pesado'] },
  { code: 'K52.9', display: 'Gastroenterite e colite não-infecciosas não especificadas', synonyms: ['dor de barriga'] },
  { code: 'K58.9', display: 'Síndrome do cólon irritável sem diarreia', synonyms: ['intestino irritável'] },
  { code: 'K59.0', display: 'Constipação', synonyms: ['prisão de ventre', 'intestino preso'] },
  { code: 'K80.2', display: 'Calculose da vesícula biliar sem colecistite', synonyms: ['pedra na vesícula', 'cálculo biliar'] },
  { code: 'K64.9', display: 'Hemorroidas não especificadas', synonyms: ['hemorroida', 'sangramento anal'] },

  // Sistema Músculo-Esquelético e Tecido Conjuntivo
  { code: 'M54.5', display: 'Dor lombar baixa', synonyms: ['lombalgia', 'dor na coluna', 'dor nas costas', 'bico de papagaio'] },
  { code: 'M54.2', display: 'Cervicalgia', synonyms: ['dor no pescoço', 'torcicolo'] },
  { code: 'M54.9', display: 'Dorsalgia não especificada', synonyms: ['dor nas costas'] },
  { code: 'M79.7', display: 'Fibromialgia', synonyms: ['dores no corpo', 'fibromialgia'] },
  { code: 'M25.5', display: 'Dor articular', synonyms: ['artralgia', 'dor na junta'] },
  { code: 'M19.9', display: 'Artrose não especificada', synonyms: ['osteoartrose', 'desgaste na junta'] },
  { code: 'M77.9', display: 'Entesopatia não especificada', synonyms: ['tendinite', 'bursite'] },
  { code: 'M62.8', display: 'Outros transtornos musculares especificados', synonyms: ['dor muscular', 'mialgia'] },

  // Sistema Nervoso e Transtornos Mentais
  { code: 'G43.9', display: 'Enxaqueca não especificada', synonyms: ['enxaqueca', 'migrânea'] },
  { code: 'G44.2', display: 'Cefaleia tensional', synonyms: ['dor de cabeça tensional'] },
  { code: 'R51', display: 'Cefaleia', synonyms: ['dor de cabeça'] },
  { code: 'F41.1', display: 'Ansiedade generalizada', synonyms: ['TAG', 'ansiedade', 'crise de ansiedade'] },
  { code: 'F41.0', display: 'Transtorno de pânico [ansiedade paroxística episódica]', synonyms: ['síndrome do pânico', 'crise de pânico'] },
  { code: 'F41.9', display: 'Transtorno ansioso não especificado', synonyms: ['ansiedade'] },
  { code: 'F32.9', display: 'Episódio depressivo não especificado', synonyms: ['depressão', 'tristeza profunda'] },
  { code: 'F51.0', display: 'Insônia não-orgânica', synonyms: ['insônia', 'dificuldade para dormir'] },
  { code: 'F90.0', display: 'Transtorno do déficit da atenção e da hiperatividade', synonyms: ['TDAH', 'déficit de atenção'] },

  // Aparelho Geniturinário
  { code: 'N39.0', display: 'Infecção do trato urinário de localização não especificada', synonyms: ['ITU', 'infecção urinária', 'urina ardendo'] },
  { code: 'N30.0', display: 'Cistite aguda', synonyms: ['cistite', 'ardor ao urinar'] },
  { code: 'N20.0', display: 'Calculose do rim', synonyms: ['cálculo renal', 'pedra nos rins', 'cólica renal'] },
  { code: 'N76.0', display: 'Vaginite aguda', synonyms: ['corrimento', 'infecção vaginal'] },
  { code: 'N94.6', display: 'Dismenorreia não especificada', synonyms: ['cólica menstrual'] },
  { code: 'N95.1', display: 'Estados menopáusicos e do climatério feminino', synonyms: ['menopausa', 'fogachos'] },

  // Pele e Tecido Subcutâneo
  { code: 'L20.9', display: 'Dermatite atópica não especificada', synonyms: ['atopia', 'eczema'] },
  { code: 'L23.9', display: 'Dermatite alérgica de contato de causa não especificada', synonyms: ['alergia na pele', 'dermatite'] },
  { code: 'L50.9', display: 'Urticária não especificada', synonyms: ['urticária', 'empolamento'] },
  { code: 'L70.0', display: 'Acne vulgar', synonyms: ['espinhas', 'cravos'] },
  { code: 'L03.9', display: 'Celulite não especificada', synonyms: ['infecção de pele', 'celulite infecciosa'] },
  { code: 'L60.0', display: 'Unha encravada', synonyms: ['onicocriptose'] },

  // Sintomas e Sinais Gerais
  { code: 'R50.9', display: 'Febre não especificada', synonyms: ['febre', 'temperatura alta'] },
  { code: 'R53', display: 'Mal-estar e fadiga', synonyms: ['cansaço', 'fraqueza', 'astenia'] },
  { code: 'R11', display: 'Náusea e vômitos', synonyms: ['enjoo', 'vômito', 'ânsia'] },
  { code: 'R42', display: 'Tontura e instabilidade', synonyms: ['vertigem', 'labirintite', 'zonzeira'] },
  { code: 'R05', display: 'Tosse', synonyms: ['tosse seca', 'tosse com catarro'] },
  { code: 'R07.4', display: 'Dor torácica não especificada', synonyms: ['dor no peito'] },
  { code: 'R10.4', display: 'Outras dores abdominais e as não especificadas', synonyms: ['dor abdominal', 'dor na barriga'] },

  // Exames e Check-ups Gerais
  { code: 'Z00.0', display: 'Exame médico geral', synonyms: ['check-up', 'avaliação de rotina', 'exame periódico'] },
  { code: 'Z01.4', display: 'Exame ginecológico (geral) (de rotina)', synonyms: ['preventivo', 'papanicolau'] },
  { code: 'Z76.0', display: 'Emissão de repetição de receita', synonyms: ['renovação de receita'] },
];

/**
 * Remove acentuação e converte para minúsculas
 */
function normalizeStr(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca inteligente no catálogo de CID-10 por código, descrição ou sinônimos em português
 */
export function searchCID10(query: string, limit = 50): Array<{ code: string; display: string }> {
  if (!query || !query.trim()) {
    return CID10_DATA.slice(0, limit).map(({ code, display }) => ({ code, display }));
  }

  const q = normalizeStr(query);

  const scoredResults = CID10_DATA.map((item) => {
    const itemCode = normalizeStr(item.code);
    const itemDisplay = normalizeStr(item.display);
    const synonyms = item.synonyms ? item.synonyms.map(normalizeStr) : [];

    let score = 0;

    // Correspondência exata no código (ex: "J00", "I10")
    if (itemCode === q) {
      score = 100;
    }
    // Começa com o código (ex: "J0" -> J00, J01, J02...)
    else if (itemCode.startsWith(q)) {
      score = 80;
    }
    // Contém o código
    else if (itemCode.includes(q)) {
      score = 60;
    }
    // Começa com o termo na descrição (ex: "hiper" -> Hipertensão)
    else if (itemDisplay.startsWith(q)) {
      score = 50;
    }
    // Contém na descrição
    else if (itemDisplay.includes(q)) {
      score = 40;
    }
    // Contém em algum sinônimo popular (ex: "pressao alta" -> I10)
    else if (synonyms.some((s) => s.includes(q) || q.includes(s))) {
      score = 30;
    }

    return { item, score };
  });

  return scoredResults
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => ({
      code: entry.item.code,
      display: entry.item.display,
    }));
}
