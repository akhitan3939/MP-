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
    icon: 'Database',
  }
];

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
      seriesId: 'free_mock_40'
    }));
  } else if (mockType === 'ts_patwari_2026') {
    baseQuestions = getPatwariQuestionsForSet(setNumber);
  } else if (mockType === 'ts_agri_ext_2026') {
    baseQuestions = getAgriQuestionsForSet(setNumber);
  } else if (mockType === 'all_questions') {
    // Return all questions across everything
    const free = EXCLUSIVE_FREE_MOCK_QUESTIONS.map(q => ({ ...q, seriesId: 'free_mock_40' }));
    const patwariSet1 = getPatwariQuestionsForSet(1);
    const agriSet1 = getAgriQuestionsForSet(1);
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
      baseQuestions = matching;
    } else {
      // Fallback base questions
      baseQuestions = EXCLUSIVE_FREE_MOCK_QUESTIONS.slice(0, 15).map((q, idx) => ({
        ...q,
        id: `${mockType}_q_${idx + 1}`,
        seriesId: mockType,
        topic: `${q.subject} - अभ्यास प्रश्न`
      }));
    }
  }

  // Merge with any custom overrides in appContextQuestions by ID
  const customMap = new Map<string, Question>();
  appContextQuestions.forEach(cq => {
    customMap.set(cq.id, cq);
  });

  return baseQuestions.map(bq => {
    if (customMap.has(bq.id)) {
      return { ...bq, ...customMap.get(bq.id) };
    }
    return bq;
  });
}
