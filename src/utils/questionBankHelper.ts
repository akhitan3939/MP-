import { Question, TestSeries } from '../types';
import { EXCLUSIVE_FREE_MOCK_QUESTIONS } from '../data/freeMockQuestions';
import { getPatwariQuestionsForSet, ALL_20_PATWARI_SETS } from '../data/patwariSetsData';
import { getAgriQuestionsForSet, ALL_20_AGRI_SETS } from '../data/agriSetsData';

export interface MockCategoryOption {
  id: string;
  nameHi: string;
  nameEn: string;
  isMultiSet: boolean;
  totalSets?: number;
  totalQuestionsPerSet: number;
  badge: string;
  typeLabelHi: string;
  icon: string;
}

export const MOCK_CATEGORY_OPTIONS: MockCategoryOption[] = [
  {
    id: 'free_mock_40',
    nameHi: '🎯 40-प्रश्न फ्री मॉक टेस्ट (ऑल-एमपी)',
    nameEn: '🎯 40-Q Free Mock Test (All-MP)',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 40,
    badge: 'फ्री डेमो (FREE)',
    typeLabelHi: 'निःशुल्क डेमो टेस्ट (Free Demo)',
    icon: 'Sparkles',
  },
  {
    id: 'ts_patwari_2026',
    nameHi: '🏛️ समूह-02 उपसमूह-04: पटवारी एवं समकक्ष (20 सेट्स)',
    nameEn: '🏛️ Group-02 Sub-04: Patwari & Equivalent (20 Sets)',
    isMultiSet: true,
    totalSets: 20,
    totalQuestionsPerSet: 200,
    badge: '200 प्रश्न / 20 सेट्स',
    typeLabelHi: '20 फुल मॉक सेट्स (20 Full Sets)',
    icon: 'Award',
  },
  {
    id: 'ts_agri_ext_2026',
    nameHi: '🌾 समूह-02 उपसमूह-01: कृषि विस्तार अधिकारी (RAEO/SADO)',
    nameEn: '🌾 Group-02 Sub-01: Agri Extension Officer (RAEO/SADO)',
    isMultiSet: true,
    totalSets: 20,
    totalQuestionsPerSet: 200,
    badge: '200 प्रश्न / 20 सेट्स',
    typeLabelHi: '20 फुल मॉक सेट्स (20 Full Sets)',
    icon: 'Leaf',
  },
  {
    id: 'ts_mppsc_pre_2026',
    nameHi: '🏛️ MPPSC राज्य सेवा प्रारंभिक परीक्षा (GS + CSAT)',
    nameEn: '🏛️ MPPSC State Service Prelims 2026',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 100,
    badge: 'आयोग पैटर्न',
    typeLabelHi: 'एकल परीक्षा मॉक (Single Exam Mock)',
    icon: 'BookOpen',
  },
  {
    id: 'ts_police_si_2026',
    nameHi: '🎖️ MP पुलिस आरक्षक एवं सब-इंस्पेक्टर (SI) खाकी बैच',
    nameEn: '🎖️ MP Police SI & Constable Mock Batch',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 100,
    badge: 'खाकी वर्दी स्पेशल',
    typeLabelHi: 'एकल परीक्षा मॉक (Single Exam Mock)',
    icon: 'Shield',
  },
  {
    id: 'ts_vyapam_group4_2026',
    nameHi: '💻 MP व्यापम समूह-4 (सहायक ग्रेड-3 / स्टेनो / CPCT)',
    nameEn: '💻 MP Vyapam Group-4 AG-3 & Steno',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 100,
    badge: 'CPCT पैटर्न',
    typeLabelHi: 'एकल परीक्षा मॉक (Single Exam Mock)',
    icon: 'Monitor',
  },
  {
    id: 'ts_vanrakshak_2026',
    nameHi: '🌲 MP वनरक्षक (Forest Guard) एवं क्षेत्ररक्षक',
    nameEn: '🌲 MP Forest Guard (Vanrakshak)',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 100,
    badge: 'वन विभाग स्पेशल',
    typeLabelHi: 'एकल परीक्षा मॉक (Single Exam Mock)',
    icon: 'TreePine',
  },
  {
    id: 'ts_mptet_2026',
    nameHi: '📚 MP TET शिक्षक पात्रता परीक्षा (वर्ग 2 व 3)',
    nameEn: '📚 MP TET Teacher Eligibility Test',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 150,
    badge: 'शिक्षाशास्त्र विशेष',
    typeLabelHi: 'एकल परीक्षा मॉक (Single Exam Mock)',
    icon: 'GraduationCap',
  },
  {
    id: 'all_questions',
    nameHi: '🌐 समस्त प्रश्न बैंक (Master Repository)',
    nameEn: '🌐 All Questions Master Repository',
    isMultiSet: false,
    totalSets: 1,
    totalQuestionsPerSet: 0,
    badge: 'मास्टर डेटाबेस',
    typeLabelHi: 'समस्त प्रश्न बैंक (All Questions)',
    icon: 'Database',
  }
];

/**
 * Accurately decodes which Exam Series and which Mock Set a question belongs to.
 */
export function getSeriesAndSetInfo(
  question: Partial<Question>,
  testSeriesList: TestSeries[] = []
): { seriesId: string; seriesNameHi: string; setNameHi: string; setNumber: number; isMultiSet: boolean } {
  const qId = question.id || '';
  let seriesId = question.seriesId || '';
  let setNumber = Number(question.setNumber || 0);

  // Infer from ID if missing
  if (qId.startsWith('pat_set_')) {
    seriesId = 'ts_patwari_2026';
    const match = qId.match(/pat_set_(\d+)_/);
    if (match && !setNumber) setNumber = parseInt(match[1], 10);
  } else if (qId.startsWith('agri_set_')) {
    seriesId = 'ts_agri_ext_2026';
    const match = qId.match(/agri_set_(\d+)_/);
    if (match && !setNumber) setNumber = parseInt(match[1], 10);
  } else if (qId.startsWith('free_q_') || seriesId === 'free_mock_40') {
    seriesId = 'free_mock_40';
    setNumber = 1;
  }

  if (!setNumber || setNumber < 1) setNumber = 1;

  // Find series title
  let seriesNameHi = 'सामान्य मॉक टेस्ट';
  let isMultiSet = false;

  if (seriesId === 'free_mock_40') {
    seriesNameHi = '🎯 40-प्रश्न फ्री डेमो मॉक टेस्ट (ऑल-एमपी)';
    isMultiSet = false;
  } else {
    const foundTs = testSeriesList.find(ts => ts.id === seriesId);
    const foundCat = MOCK_CATEGORY_OPTIONS.find(c => c.id === seriesId);
    if (foundTs) {
      seriesNameHi = foundTs.titleHi || foundTs.titleEn;
      isMultiSet = (foundTs.totalTests || 20) > 1 || seriesId === 'ts_patwari_2026' || seriesId === 'ts_agri_ext_2026';
    } else if (foundCat) {
      seriesNameHi = foundCat.nameHi;
      isMultiSet = foundCat.isMultiSet;
    }
  }

  const setNameHi = isMultiSet ? `सेट #${setNumber}` : (seriesId === 'free_mock_40' ? 'फ्री डेमो सेट' : 'मुख्य मॉक टेस्ट');

  return {
    seriesId,
    seriesNameHi,
    setNameHi,
    setNumber,
    isMultiSet
  };
}

/**
 * Returns the full list of questions for a selected mock type and set number,
 * prioritizing any admin-customized or user-saved questions in AppContext.
 */
export function getResolvedMockQuestions(
  mockType: string,
  setNumber: number = 1,
  appContextQuestions: Question[] = []
): Question[] {
  let baseQuestions: Question[] = [];

  if (mockType === 'free_mock_40') {
    // Map exclusive 40 questions
    baseQuestions = EXCLUSIVE_FREE_MOCK_QUESTIONS.map(q => ({
      ...q,
      seriesId: 'free_mock_40',
      setNumber: 1
    }));
  } else if (mockType === 'ts_patwari_2026') {
    baseQuestions = getPatwariQuestionsForSet(setNumber).map(q => ({
      ...q,
      seriesId: 'ts_patwari_2026',
      setNumber: setNumber
    }));
  } else if (mockType === 'ts_agri_ext_2026') {
    baseQuestions = getAgriQuestionsForSet(setNumber).map(q => ({
      ...q,
      seriesId: 'ts_agri_ext_2026',
      setNumber: setNumber
    }));
  } else if (mockType === 'all_questions') {
    // Return all questions across everything
    const free = EXCLUSIVE_FREE_MOCK_QUESTIONS.map(q => ({ ...q, seriesId: 'free_mock_40', setNumber: 1 }));
    const patwariSet1 = getPatwariQuestionsForSet(1).map(q => ({ ...q, seriesId: 'ts_patwari_2026', setNumber: 1 }));
    const agriSet1 = getAgriQuestionsForSet(1).map(q => ({ ...q, seriesId: 'ts_agri_ext_2026', setNumber: 1 }));
    const otherCustom = appContextQuestions.filter(q => 
      q.seriesId !== 'free_mock_40' && 
      !q.id.startsWith('pat_set_') && 
      !q.id.startsWith('agri_set_')
    );
    baseQuestions = [...free, ...patwariSet1, ...agriSet1, ...otherCustom];
  } else {
    // Other series: check AppContext questions or provide standard questions
    const matching = appContextQuestions.filter(q => q.seriesId === mockType);
    if (matching.length > 0) {
      baseQuestions = matching.map(q => ({ ...q, setNumber: q.setNumber || 1 }));
    } else {
      // Fallback base questions
      baseQuestions = EXCLUSIVE_FREE_MOCK_QUESTIONS.slice(0, 15).map((q, idx) => ({
        ...q,
        id: `${mockType}_q_${idx + 1}`,
        seriesId: mockType,
        setNumber: 1,
        topic: `${q.subject} - अभ्यास प्रश्न`
      }));
    }
  }

  // Merge with any custom overrides in appContextQuestions by ID
  const customMap = new Map<string, Question>();
  appContextQuestions.forEach(cq => {
    customMap.set(cq.id, cq);
  });

  const resolvedBase = baseQuestions.map(bq => {
    if (customMap.has(bq.id)) {
      return { ...bq, ...customMap.get(bq.id), setNumber: bq.setNumber || setNumber };
    }
    return { ...bq, setNumber: bq.setNumber || setNumber };
  });

  // Also include newly added custom questions for this series and set number that are NOT in baseQuestions
  const baseIds = new Set(resolvedBase.map(q => q.id));
  const additionalCustom = appContextQuestions.filter(cq => {
    if (baseIds.has(cq.id)) return false;
    if (mockType === 'all_questions') return true;
    if (cq.seriesId !== mockType) return false;
    
    // Check set number match for multi-set
    if (mockType === 'ts_patwari_2026' || mockType === 'ts_agri_ext_2026') {
      const qSetNum = cq.setNumber || (cq.id.includes(`set_${setNumber}_`) ? setNumber : 1);
      return qSetNum === setNumber;
    }
    return true;
  });

  return [...resolvedBase, ...additionalCustom];
}

/**
 * Returns ALL questions across all sets for a given series.
 * (e.g. all 20 sets of Patwari, RAEO, or all questions of MPPSC)
 */
export function getAllQuestionsForSeries(
  seriesId: string,
  appContextQuestions: Question[] = [],
  totalSets: number = 20
): Question[] {
  if (seriesId === 'free_mock_40') {
    return getResolvedMockQuestions('free_mock_40', 1, appContextQuestions);
  }

  if (seriesId === 'ts_patwari_2026') {
    const allPat: Question[] = [];
    for (let s = 1; s <= totalSets; s++) {
      const setQs = getResolvedMockQuestions('ts_patwari_2026', s, appContextQuestions);
      allPat.push(...setQs.map(q => ({ ...q, setNumber: s })));
    }
    return allPat;
  }

  if (seriesId === 'ts_agri_ext_2026') {
    const allAgri: Question[] = [];
    for (let s = 1; s <= totalSets; s++) {
      const setQs = getResolvedMockQuestions('ts_agri_ext_2026', s, appContextQuestions);
      allAgri.push(...setQs.map(q => ({ ...q, setNumber: s })));
    }
    return allAgri;
  }

  if (seriesId === 'all_questions') {
    const allMaster: Question[] = [];
    allMaster.push(...getAllQuestionsForSeries('ts_patwari_2026', appContextQuestions, 20));
    allMaster.push(...getAllQuestionsForSeries('ts_agri_ext_2026', appContextQuestions, 20));
    allMaster.push(...getResolvedMockQuestions('free_mock_40', 1, appContextQuestions));
    const others = appContextQuestions.filter(q => 
      q.seriesId !== 'ts_patwari_2026' && 
      q.seriesId !== 'ts_agri_ext_2026' && 
      q.seriesId !== 'free_mock_40'
    );
    allMaster.push(...others);
    return allMaster;
  }

  // Generic series
  const matching = appContextQuestions.filter(q => q.seriesId === seriesId);
  if (matching.length > 0) {
    return matching;
  }

  return getResolvedMockQuestions(seriesId, 1, appContextQuestions);
}
