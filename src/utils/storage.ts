import { 
  UserProfile, 
  TestSeries, 
  Question, 
  TestAttempt, 
  LeaderboardEntry, 
  OrderTransaction, 
  Coupon, 
  Announcement, 
  OfflineNote, 
  StudyReminder,
  SiteBanner,
  PlatformSettings,
  MockSetMetadata,
  NavigationMenuItem 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_TEST_SERIES, 
  INITIAL_QUESTIONS, 
  INITIAL_LEADERBOARD, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTES 
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'mp_setu_users_v4_clean',
  CURRENT_USER_ID: 'mp_setu_current_user_v2',
  TEST_SERIES: 'mp_setu_test_series_v4',
  QUESTIONS: 'mp_setu_questions_v3',
  ATTEMPTS: 'mp_setu_attempts_v1',
  LEADERBOARD: 'mp_setu_leaderboard_v2',
  ORDERS: 'mp_setu_orders_v2_clean',
  COUPONS: 'mp_setu_coupons_v1',
  ANNOUNCEMENTS: 'mp_setu_announcements_v1',
  NOTES: 'mp_setu_notes_v1',
  REMINDERS: 'mp_setu_reminders_v1',
  ENROLLED_SERIES_MAP: 'mp_setu_enrolled_map_v2',
  BOOKMARKED_QUESTIONS: 'mp_setu_bookmarked_q_v1',
  THEME: 'mp_setu_theme_v1',
  LANG: 'mp_setu_lang_v1',
  SITE_BANNERS: 'mp_setu_banners_v3',
  PLATFORM_SETTINGS: 'mp_setu_settings_v2',
  MOCK_SETS: 'mp_setu_mock_sets_v2',
  NAV_MENUS: 'mp_setu_nav_menus_v2',
};

export const INITIAL_NAV_MENUS: NavigationMenuItem[] = [
  {
    id: 'nav_home',
    labelHi: 'मुख्य पृष्ठ',
    labelEn: 'Home',
    placement: 'both',
    targetType: 'view',
    targetValue: 'home',
    iconName: 'BookOpen',
    isActive: true,
    order: 1,
    subTextHi: 'होम पेज',
    subTextEn: 'Home Page'
  },
  {
    id: 'nav_free_mock',
    labelHi: '🎯 40-प्रश्न फ्री मॉक टेस्ट',
    labelEn: '🎯 Free Mock (40 Qs)',
    placement: 'both',
    targetType: 'view',
    targetValue: 'freeMockTest',
    iconName: 'Sparkles',
    highlight: true,
    badgeTextHi: 'मुफ़्त DEMO',
    badgeTextEn: 'FREE DEMO',
    isActive: true,
    order: 2,
    subTextHi: 'निःशुल्क अभ्यास',
    subTextEn: 'Free Practice'
  },
  {
    id: 'nav_catalog',
    labelHi: 'टेस्ट सीरीज़',
    labelEn: 'Test Series',
    placement: 'both',
    targetType: 'view',
    targetValue: 'catalog',
    iconName: 'Award',
    isActive: true,
    order: 3,
    subTextHi: 'सभी पैकेज',
    subTextEn: 'All Packages'
  },
  {
    id: 'nav_leaderboard',
    labelHi: 'ऑल-एमपी रैंक',
    labelEn: 'All MP Rank',
    placement: 'both',
    targetType: 'view',
    targetValue: 'leaderboard',
    iconName: 'Trophy',
    isActive: true,
    order: 4,
    subTextHi: 'राज्य मेरिट सूची',
    subTextEn: 'State Merit'
  },
  {
    id: 'nav_notes',
    labelHi: 'ई-नोट्स (PDF)',
    labelEn: 'E-Notes (PDF)',
    placement: 'both',
    targetType: 'modal',
    targetValue: 'notes',
    iconName: 'FileText',
    isActive: true,
    order: 5,
    subTextHi: 'हस्तलिखित नोट्स',
    subTextEn: 'PDF Notes'
  },
  {
    id: 'nav_dashboard',
    labelHi: 'मेरा डैशबोर्ड',
    labelEn: 'My Dashboard',
    placement: 'both',
    targetType: 'view',
    targetValue: 'dashboard',
    iconName: 'LayoutDashboard',
    isActive: true,
    order: 6,
    subTextHi: 'स्कोरकार्ड व XP',
    subTextEn: 'Scorecard & XP'
  }
];

export const INITIAL_BANNERS: SiteBanner[] = [
  {
    id: 'ban_1',
    titleHi: 'समूह-02 उपसमूह-04 संयुक्त भर्ती परीक्षा 2026 — 20 फुल मॉक टेस्ट सीरीज़',
    titleEn: 'Group-02 SubGroup-04 Combined Recruitment 2026 — 20 Full Mock Series',
    subtitleHi: '200 प्रश्न प्रति टेस्ट (8 विषय) • 180 मिनट CBT सिमुलेटर • AI विश्लेषण व ऑल-एमपी रैंक',
    subtitleEn: '200 Questions per test (8 Sections) • 180 Mins CBT • AI Report & State Rank',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    badgeText: '🔥 सर्वाधिक लोकप्रिय (Bestseller)',
    buttonTextHi: '20 फुल मॉक टेस्ट सीरीज़ देखें',
    buttonTextEn: 'View 20 Full Mock Series',
    targetView: 'testDetail',
    targetId: 'ts_patwari_2026',
    isActive: true,
    order: 1
  },
  {
    id: 'ban_2',
    titleHi: 'MPPSC प्रारंभिक परीक्षा 2026 — 50+ विषयवार व फुल टेस्ट',
    titleEn: 'MPPSC State Service Prelims 2026 — 50+ Topic & Full Tests',
    subtitleHi: 'नवीनतम आयोग पैटर्न, MP स्पेशल GK, समसामयिकी व CSAT के विस्तृत द्विभाषी हल',
    subtitleEn: 'Latest Commission pattern, MP Special GK, Current Affairs & CSAT with full explanations',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
    badgeText: '🏛️ म.प्र. लोक सेवा आयोग',
    buttonTextHi: 'सीरीज़ विवरण देखें',
    buttonTextEn: 'View Series Details',
    targetView: 'testDetail',
    targetId: 'ts_mppsc_pre_2026',
    isActive: true,
    order: 2
  },
  {
    id: 'ban_3',
    titleHi: 'MP पुलिस सब-इंस्पेक्टर (SI) 2026 — स्पेशल खाकी वर्दी बैच',
    titleEn: 'MP Police SI 2026 — Special Khaki Mock Batch',
    subtitleHi: 'हिंदी, अंग्रेजी, विज्ञान व MP GK के 30+ टेस्ट • ऑल-एमपी लाइव कटऑफ व रैंक',
    subtitleEn: 'Hindi, English, Science & MP GK 30+ Tests • All-MP Live Cutoff & Merit Rank',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    badgeText: '🎖️ खाकी वर्दी संकल्प',
    buttonTextHi: 'टेस्ट सीरीज़ देखें',
    buttonTextEn: 'Explore Tests',
    targetView: 'testDetail',
    targetId: 'ts_police_si_2026',
    isActive: true,
    order: 3
  }
];

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  siteTitle: 'MP परीक्षा सेतु',
  siteTagline: 'मध्यप्रदेश प्रतियोगी परीक्षा सर्वोत्तम टेस्ट पोर्टल',
  helplinePhone: '+91 98930 12345',
  helplineWhatsapp: '919893012345',
  supportEmail: 'support@mppariksha.in',
  topTickerTextHi: '🔥 MP पटवारी 2026 के सभी 20 सेट्स लाइव! सेट #1 मुफ़्त डेमो अभी दें • कोड \'SETU50\' पर ₹50 फ्लैट छूट',
  topTickerTextEn: '🔥 MP Patwari 2026 All 20 Sets Live! Attempt Set #1 Free Demo • Use coupon \'SETU50\' for ₹50 Off',
  topTickerEnabled: true,
  paymentGatewayMode: 'LIVE',
  enableAiEvaluation: true,
  maintenanceMode: false,
  facebookUrl: 'https://facebook.com/groups/mpparikshasetu',
  instagramUrl: 'https://instagram.com/mpparikshasetu_official',
  telegramUrl: 'https://t.me/mpparikshasetu_mp',
  youtubeUrl: 'https://youtube.com/@mpparikshasetu',
  whatsappCommunityUrl: 'https://chat.whatsapp.com/mpparikshasetu'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing key ${key} to storage:`, e);
  }
}

function normalizeQuestion(q: any): Question {
  const optionsHi = Array.isArray(q.optionsHi) && q.optionsHi.length > 0
    ? q.optionsHi
    : (Array.isArray(q.options) ? q.options.map((o: any) => typeof o === 'string' ? o : o.textHi || o.textEn || '') : ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D']);

  const optionsEn = Array.isArray(q.optionsEn) && q.optionsEn.length > 0
    ? q.optionsEn
    : (Array.isArray(q.options) ? q.options.map((o: any) => typeof o === 'string' ? o : o.textEn || o.textHi || '') : ['Option A', 'Option B', 'Option C', 'Option D']);

  const correctIndex = q.correctOption !== undefined 
    ? Number(q.correctOption) 
    : (q.correctOptionIndex !== undefined ? Number(q.correctOptionIndex) : 0);

  const options = Array.isArray(q.options) && q.options.length > 0
    ? q.options.map((o: any, idx: number) => ({
        id: o.id || `opt_${idx}`,
        textHi: typeof o === 'string' ? o : o.textHi || optionsHi[idx] || '',
        textEn: typeof o === 'string' ? o : o.textEn || optionsEn[idx] || ''
      }))
    : optionsHi.map((text: string, idx: number) => ({
        id: `opt_${idx}`,
        textHi: text,
        textEn: optionsEn[idx] || text
      }));

  return {
    ...q,
    options,
    optionsHi,
    optionsEn,
    imageUrl: q.imageUrl || undefined,
    imageCaption: q.imageCaption || undefined,
    correctOption: correctIndex,
    correctOptionIndex: correctIndex,
    subject: q.subject || q.section || 'General Studies',
    section: q.section || q.subject || 'General Studies',
  };
}

function normalizeTestSeries(s: any): TestSeries {
  return {
    ...s,
    featuresHi: Array.isArray(s.featuresHi) && s.featuresHi.length > 0
      ? s.featuresHi
      : [
          '100% नवीनतम MP ESB / आयोग पाठ्यक्रम आधारित',
          'AI आधारित व्यक्तिगत विश्लेषण व कमजोर क्षेत्र पहचान',
          'ऑल-मध्यप्रदेश लाइव मेरिट रैंक व परसेंटाइल',
          'विस्तृत द्विभाषी (Hindi + English) समाधान व व्याख्या',
          'मुफ्त डाउनलोड योग्य हस्तलिखित ई-नोट्स एवं PDF'
        ],
    featuresEn: Array.isArray(s.featuresEn) && s.featuresEn.length > 0
      ? s.featuresEn
      : [
          '100% based on latest MP ESB / Commission exam pattern',
          'AI-driven personalized analysis & weakness detector',
          'All-MP State Live Merit Rank & Percentile Score',
          'Comprehensive bilingual (Hindi + English) solutions',
          'Free downloadable handwritten study notes & PDFs'
        ],
    syllabus: Array.isArray(s.syllabus) ? s.syllabus : [],
    freeTestsCount: s.freeTestsCount !== undefined ? s.freeTestsCount : (s.isFreeDemoAvailable ? 1 : 0),
    isActive: s.isActive !== false,
  };
}

export const StorageService = {
  getUsers: (): UserProfile[] => {
    const raw = getStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const list = Array.isArray(raw) ? raw : INITIAL_USERS;
    return list.map(u => {
      if (u.role === 'admin' || u.id === 'usr_admin') {
        return {
          ...u,
          name: 'प्रशासक (Akhilesh Korsne)',
          username: 'akhitan_3939',
          password: 'Tanmayee*1234',
          email: 'akhitan3939@mppariksha.in',
          role: 'admin' as const
        };
      }
      return u;
    });
  },
  setUsers: (users: UserProfile[]) => setStorage(STORAGE_KEYS.USERS, users),

  getCurrentUserId: (): string => getStorage(STORAGE_KEYS.CURRENT_USER_ID, 'usr_student_1'),
  setCurrentUserId: (id: string) => setStorage(STORAGE_KEYS.CURRENT_USER_ID, id),

  getTestSeries: (): TestSeries[] => {
    const raw = getStorage(STORAGE_KEYS.TEST_SERIES, INITIAL_TEST_SERIES);
    if (!Array.isArray(raw) || raw.length === 0) {
      return INITIAL_TEST_SERIES.map(normalizeTestSeries);
    }
    const map = new Map<string, any>();
    INITIAL_TEST_SERIES.forEach(s => map.set(s.id, s));
    raw.forEach((s: any) => {
      if (map.has(s.id)) {
        map.set(s.id, { ...map.get(s.id), ...s, syllabus: map.get(s.id).syllabus, totalQuestions: map.get(s.id).totalQuestions, totalMarks: map.get(s.id).totalMarks });
      } else {
        map.set(s.id, s);
      }
    });
    return Array.from(map.values()).map(normalizeTestSeries);
  },
  setTestSeries: (series: TestSeries[]) => setStorage(STORAGE_KEYS.TEST_SERIES, series.map(normalizeTestSeries)),

  getQuestions: (): Question[] => {
    const raw = getStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    if (!Array.isArray(raw) || raw.length === 0) {
      return INITIAL_QUESTIONS.map(normalizeQuestion);
    }
    const map = new Map<string, any>();
    INITIAL_QUESTIONS.forEach(q => map.set(q.id, q));
    raw.forEach((q: any) => map.set(q.id, { ...(map.get(q.id) || {}), ...q }));
    return Array.from(map.values()).map(normalizeQuestion);
  },
  setQuestions: (questions: Question[]) => setStorage(STORAGE_KEYS.QUESTIONS, questions.map(normalizeQuestion)),

  getAttempts: (): TestAttempt[] => getStorage(STORAGE_KEYS.ATTEMPTS, []),
  setAttempts: (attempts: TestAttempt[]) => setStorage(STORAGE_KEYS.ATTEMPTS, attempts),

  getLeaderboard: (): LeaderboardEntry[] => {
    const raw = getStorage(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    const list = Array.isArray(raw) ? raw : INITIAL_LEADERBOARD;
    return list.map(e => {
      if (e.userName && (e.userName.toLowerCase().includes('akhilesh') || e.userName.includes('अखिलेश'))) {
        return {
          ...e,
          userName: 'परीक्षार्थी (Aspirant)'
        };
      }
      return e;
    });
  },
  setLeaderboard: (lb: LeaderboardEntry[]) => setStorage(STORAGE_KEYS.LEADERBOARD, lb),

  getOrders: (): OrderTransaction[] => {
    const raw = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const list = Array.isArray(raw) ? raw : INITIAL_ORDERS;
    return list.map(o => {
      if (o.userName && (o.userName.toLowerCase().includes('akhilesh') || o.userName.includes('अखिलेश') || o.userEmail?.includes('korsne'))) {
        return {
          ...o,
          userName: 'परीक्षार्थी (Aspirant)',
          userEmail: 'student@mppariksha.in'
        };
      }
      return o;
    });
  },
  setOrders: (orders: OrderTransaction[]) => setStorage(STORAGE_KEYS.ORDERS, orders),

  getCoupons: (): Coupon[] => getStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS),
  setCoupons: (coupons: Coupon[]) => setStorage(STORAGE_KEYS.COUPONS, coupons),

  getAnnouncements: (): Announcement[] => getStorage(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  setAnnouncements: (announcements: Announcement[]) => setStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements),

  getNotes: (): OfflineNote[] => getStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES),
  setNotes: (notes: OfflineNote[]) => setStorage(STORAGE_KEYS.NOTES, notes),

  getReminders: (): StudyReminder[] => getStorage(STORAGE_KEYS.REMINDERS, [
    {
      id: 'rem_1',
      title: 'प्रातःकाल MP स्पेशल GK व समसामयिकी क्विज़',
      time: '07:30',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isEnabled: true,
      topic: 'MP GK 2026'
    },
    {
      id: 'rem_2',
      title: 'सायंकाल ऑल-एमपी फुल मॉक टेस्ट',
      time: '20:00',
      days: ['Tue', 'Thu', 'Sat', 'Sun'],
      isEnabled: true,
      topic: 'Patwari & MPPSC Mock'
    }
  ]),
  setReminders: (reminders: StudyReminder[]) => setStorage(STORAGE_KEYS.REMINDERS, reminders),

  getEnrolledMap: (): Record<string, string[]> => getStorage(STORAGE_KEYS.ENROLLED_SERIES_MAP, {}),
  setEnrolledMap: (map: Record<string, string[]>) => setStorage(STORAGE_KEYS.ENROLLED_SERIES_MAP, map),

  getBookmarkedQuestions: (): string[] => getStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, ['q_pat_1', 'q_pat_5']),
  setBookmarkedQuestions: (ids: string[]) => setStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, ids),

  getTheme: (): 'light' | 'dark' => getStorage(STORAGE_KEYS.THEME, 'light'),
  setTheme: (t: 'light' | 'dark') => setStorage(STORAGE_KEYS.THEME, t),

  getLang: (): 'hi' | 'en' => getStorage(STORAGE_KEYS.LANG, 'hi'),
  setLang: (l: 'hi' | 'en') => setStorage(STORAGE_KEYS.LANG, l),

  getSiteBanners: (): SiteBanner[] => getStorage(STORAGE_KEYS.SITE_BANNERS, INITIAL_BANNERS),
  setSiteBanners: (banners: SiteBanner[]) => setStorage(STORAGE_KEYS.SITE_BANNERS, banners),

  getPlatformSettings: (): PlatformSettings => getStorage(STORAGE_KEYS.PLATFORM_SETTINGS, INITIAL_PLATFORM_SETTINGS),
  setPlatformSettings: (settings: PlatformSettings) => setStorage(STORAGE_KEYS.PLATFORM_SETTINGS, settings),

  getNavMenus: (): NavigationMenuItem[] => getStorage(STORAGE_KEYS.NAV_MENUS, INITIAL_NAV_MENUS),
  setNavMenus: (menus: NavigationMenuItem[]) => setStorage(STORAGE_KEYS.NAV_MENUS, menus),
};
