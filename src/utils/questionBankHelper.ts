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
    id: 'ts_police_si_2026',
    nameHi: '🎖️ MP पुलिस आरक्षक एवं सब-इंस्पेक्टर (SI) खाकी बैच',
    nameEn: '🎖️ MP Police SI & Constable Mock Batch',
    isMultiSet: true,
    totalSets: 35,
    totalQuestionsPerSet: 100,
    badge: '35 सेट्स खाकी स्पेशल',
    typeLabelHi: '35 फुल मॉक सेट्स (35 Full Sets)',
    icon: 'Shield',
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
    isMultiSet: true,
    totalSets: 60,
    totalQuestionsPerSet: 100,
    badge: '60 सेट्स आयोग पैटर्न',
    typeLabelHi: '60 फुल मॉक सेट्स (60 Full Sets)',
    icon: 'BookOpen',
  },
  {
    id: 'ts_vyapam_group4_2026',
    nameHi: '💻 MP व्यापम समूह-4 (सहायक ग्रेड-3 / स्टेनो / CPCT)',
    nameEn: '💻 MP Vyapam Group-4 AG-3 & Steno',
    isMultiSet: true,
    totalSets: 35,
    totalQuestionsPerSet: 100,
    badge: '35 सेट्स CPCT पैटर्न',
    typeLabelHi: '35 फुल मॉक सेट्स (35 Full Sets)',
    icon: 'Monitor',
  },
  {
    id: 'ts_vanrakshak_2026',
    nameHi: '🌲 MP वनरक्षक (Forest Guard) एवं क्षेत्ररक्षक',
    nameEn: '🌲 MP Forest Guard (Vanrakshak)',
    isMultiSet: true,
    totalSets: 30,
    totalQuestionsPerSet: 100,
    badge: '30 सेट्स वन विभाग स्पेशल',
    typeLabelHi: '30 फुल मॉक सेट्स (30 Full Sets)',
    icon: 'TreePine',
  },
  {
    id: 'ts_mptet_2026',
    nameHi: '📚 MP TET शिक्षक पात्रता परीक्षा (वर्ग 2 व 3)',
    nameEn: '📚 MP TET Teacher Eligibility Test',
    isMultiSet: true,
    totalSets: 40,
    totalQuestionsPerSet: 150,
    badge: '40 सेट्स शिक्षाशास्त्र विशेष',
    typeLabelHi: '40 फुल मॉक सेट्स (40 Full Sets)',
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
 * Returns dynamic category options synchronized with live test series (package sets count)
 */
export function getDynamicMockCategoryOptions(testSeriesList: TestSeries[] = []): MockCategoryOption[] {
  const result: MockCategoryOption[] = [];

  // 1. Always start with 40-Q Free Mock
  result.push(MOCK_CATEGORY_OPTIONS[0]);

  // 2. Map all test series from live AppContext / package configuration
  testSeriesList.forEach(ts => {
    const defaultOpt = MOCK_CATEGORY_OPTIONS.find(c => c.id === ts.id);
    const totalSets = Number(ts.totalTests) || defaultOpt?.totalSets || (ts.id === 'ts_patwari_2026' || ts.id === 'ts_agri_ext_2026' ? 20 : 1);
    const isMultiSet = totalSets > 1;
    const questionsPerSet = ts.totalQuestions || defaultOpt?.totalQuestionsPerSet || (ts.id === 'ts_patwari_2026' || ts.id === 'ts_agri_ext_2026' ? 200 : 100);

    result.push({
      id: ts.id,
      nameHi: ts.titleHi || defaultOpt?.nameHi || 'मॉक टेस्ट सीरीज़',
      nameEn: ts.titleEn || defaultOpt?.nameEn || 'Mock Test Series',
      isMultiSet,
      totalSets,
      totalQuestionsPerSet: questionsPerSet,
      badge: isMultiSet ? `${totalSets} सेट्स बंडल` : 'एकल मॉक',
      typeLabelHi: isMultiSet ? `${totalSets} फुल मॉक सेट्स` : 'एकल मॉक टेस्ट',
      icon: defaultOpt?.icon || 'Award'
    });
  });

  // 3. Any category in default options not yet included (except all_questions and free_mock_40)
  MOCK_CATEGORY_OPTIONS.forEach(cat => {
    if (cat.id !== 'free_mock_40' && cat.id !== 'all_questions' && !result.some(r => r.id === cat.id)) {
      result.push(cat);
    }
  });

  // 4. Always end with all_questions master repository
  result.push(MOCK_CATEGORY_OPTIONS[MOCK_CATEGORY_OPTIONS.length - 1]);

  return result;
}

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
  const targetSet = Number(setNumber) || 1;

  if (mockType === 'free_mock_40') {
    // Return 40 questions of free mock merged with custom overrides
    const customMap = new Map<string, Question>();
    appContextQuestions.forEach(cq => {
      if (cq.seriesId === 'free_mock_40' || cq.id.startsWith('free_q_')) {
        customMap.set(cq.id, cq);
      }
    });

    const base = EXCLUSIVE_FREE_MOCK_QUESTIONS.map(q => {
      if (customMap.has(q.id)) {
        return { ...q, ...customMap.get(q.id), seriesId: 'free_mock_40', setNumber: 1 };
      }
      return { ...q, seriesId: 'free_mock_40', setNumber: 1 };
    });

    const baseIds = new Set(base.map(q => q.id));
    const extra = appContextQuestions.filter(q => (q.seriesId === 'free_mock_40' || q.id.startsWith('free_q_')) && !baseIds.has(q.id));
    return [...base, ...extra].sort((a, b) => (a.slotNumber || 9999) - (b.slotNumber || 9999));
  }

  if (mockType === 'ts_patwari_2026') {
    const baseQuestions = getPatwariQuestionsForSet(targetSet).map(q => ({
      ...q,
      seriesId: 'ts_patwari_2026',
      setNumber: targetSet
    }));

    const customMap = new Map<string, Question>();
    appContextQuestions.forEach(cq => {
      if (cq.seriesId === 'ts_patwari_2026' || cq.id.startsWith(`pat_set_${targetSet}_`)) {
        customMap.set(cq.id, cq);
      }
    });

    const resolvedBase = baseQuestions.map(bq => {
      if (customMap.has(bq.id)) {
        return { ...bq, ...customMap.get(bq.id), setNumber: targetSet };
      }
      return bq;
    });

    const baseIds = new Set(resolvedBase.map(q => q.id));
    const extra = appContextQuestions.filter(cq => {
      if (baseIds.has(cq.id)) return false;
      if (cq.seriesId !== 'ts_patwari_2026' && !cq.id.startsWith('pat_set_')) return false;
      const qSet = Number(cq.setNumber) || (cq.id.match(/pat_set_(\d+)_/) ? parseInt(cq.id.match(/pat_set_(\d+)_/)![1], 10) : 1);
      return qSet === targetSet;
    });

    return [...resolvedBase, ...extra].sort((a, b) => (a.slotNumber || 9999) - (b.slotNumber || 9999));
  }

  if (mockType === 'ts_agri_ext_2026') {
    const baseQuestions = getAgriQuestionsForSet(targetSet).map(q => ({
      ...q,
      seriesId: 'ts_agri_ext_2026',
      setNumber: targetSet
    }));

    const customMap = new Map<string, Question>();
    appContextQuestions.forEach(cq => {
      if (cq.seriesId === 'ts_agri_ext_2026' || cq.id.startsWith(`agri_set_${targetSet}_`)) {
        customMap.set(cq.id, cq);
      }
    });

    const resolvedBase = baseQuestions.map(bq => {
      if (customMap.has(bq.id)) {
        return { ...bq, ...customMap.get(bq.id), setNumber: targetSet };
      }
      return bq;
    });

    const baseIds = new Set(resolvedBase.map(q => q.id));
    const extra = appContextQuestions.filter(cq => {
      if (baseIds.has(cq.id)) return false;
      if (cq.seriesId !== 'ts_agri_ext_2026' && !cq.id.startsWith('agri_set_')) return false;
      const qSet = Number(cq.setNumber) || (cq.id.match(/agri_set_(\d+)_/) ? parseInt(cq.id.match(/agri_set_(\d+)_/)![1], 10) : 1);
      return qSet === targetSet;
    });

    return [...resolvedBase, ...extra].sort((a, b) => (a.slotNumber || 9999) - (b.slotNumber || 9999));
  }

  if (mockType === 'all_questions') {
    return getAllQuestionsForSeries('all_questions', appContextQuestions, 20);
  }

  // ALL OTHER SERIES (e.g. ts_police_si_2026, ts_mppsc_pre_2026, ts_vyapam_group4_2026, etc.):
  // Strictly return only questions that match this mockType AND this targetSet!
  // NO FAKE FALLBACKS! Sets with no questions remain completely blank.
  const matching = appContextQuestions.filter(q => {
    if (q.seriesId !== mockType) return false;
    const qSet = Number(q.setNumber) || 1;
    return qSet === targetSet;
  });

  return matching.sort((a, b) => (a.slotNumber || 9999) - (b.slotNumber || 9999));
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
  return appContextQuestions.filter(q => q.seriesId === seriesId);
}
