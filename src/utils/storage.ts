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
  NavigationMenuItem,
  WebsiteContentConfig,
  SocialChannelConfig
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

export const INITIAL_SOCIAL_CHANNELS: SocialChannelConfig[] = [
  {
    id: 'whatsapp',
    nameHi: 'व्हाट्सएप जॉब अलर्ट कम्युनिटी',
    nameEn: 'WhatsApp Job Alerts Group',
    handle: 'MP Pariksha Setu Alerts',
    badgeHi: '10,000+ छात्र जुड़े',
    badgeEn: '10K+ Students',
    url: 'https://chat.whatsapp.com/mpparikshasetu',
    descHi: 'सीधे आपके व्हाट्सएप पर नई भर्ती, एडमिट कार्ड व फ्री मॉक टेस्ट का नोटिफिकेशन।',
    descEn: 'Direct WhatsApp notifications for new vacancies, admit cards & test releases.',
    highlights: ['तत्काल भर्ती अलर्ट', 'एडमिट कार्ड सूचना', 'सीधा संपर्क'],
    isActive: true,
  },
  {
    id: 'telegram',
    nameHi: 'टेलीग्राम सुपर चैनल (PDF व क्विज़)',
    nameEn: 'Telegram Super Channel',
    handle: 't.me/mpparikshasetu_mp',
    badgeHi: '68,000+ मेंबर्स',
    badgeEn: '68K+ Members',
    url: 'https://t.me/mpparikshasetu_mp',
    descHi: 'हस्तलिखित नोट्स PDF, 50+ प्रश्नों का दैनिक लाइव क्विज और त्वरित रिज़ल्ट अलर्ट।',
    descEn: 'Free handwritten notes PDFs, daily 50+ Qs live quizzes & instant alerts.',
    highlights: ['फ्री नोट्स डाउनलोड', 'लाइव टाइमर क्विज़', 'कटऑफ अपडेट्स'],
    isActive: true,
  },
  {
    id: 'youtube',
    nameHi: 'यूट्यूब चैनल (लाइव मैराथन क्लासेज)',
    nameEn: 'YouTube Channel (Live Classes)',
    handle: '@mpparikshasetu',
    badgeHi: '90,000+ सब्सक्राइबर्स',
    badgeEn: '90K+ Subscribers',
    url: 'https://youtube.com/@mpparikshasetu',
    descHi: 'विस्तृत विषयवार मैराथन क्लासेज, पिछले वर्षों के पेपर का हल व परीक्षा रणनीति।',
    descEn: 'Subject-wise marathon classes, previous year paper solutions & strategies.',
    highlights: ['लाइव प्रश्न हल', 'परीक्षा विश्लेषण', 'रणनीति सेशन्स'],
    isActive: true,
  },
  {
    id: 'instagram',
    nameHi: 'इंस्टाग्राम रील्स व एग्जाम टिप्स',
    nameEn: 'Instagram Reels & Exam Tips',
    handle: '@mpparikshasetu_official',
    badgeHi: '45,000+ फॉलोअर्स',
    badgeEn: '45K+ Followers',
    url: 'https://instagram.com/mpparikshasetu_official',
    descHi: '60-सेकंड में MP GK ट्रिक्स, करंट अफेयर्स इंफोग्राफिक्स और परीक्षा मोटिवेशन रील्स।',
    descEn: '60-second MP GK memory tricks, Current affairs infographics & exam reels.',
    highlights: ['शॉर्टकट मेमोरी ट्रिक्स', 'डेली करंट अफेयर्स', 'स्टडी इंफोग्राफिक्स'],
    isActive: true,
  },
  {
    id: 'facebook',
    nameHi: 'फेसबुक पेज एवं स्टडी ग्रुप',
    nameEn: 'Facebook Page & Community',
    handle: 'facebook.com/mpparikshasetu',
    badgeHi: '25,000+ परीक्षार्थी',
    badgeEn: '25K+ Aspirants',
    url: 'https://facebook.com/groups/mpparikshasetu',
    descHi: 'म.प्र. भर्ती परीक्षा चर्चा, पुराने प्रश्नपत्र, टॉपर्स अनुभव और दैनिक पोल प्रश्नोत्तरी।',
    descEn: 'MP Govt exam discussions, PYQ analysis, toppers guidance & daily polls.',
    highlights: ['डेली GK प्रश्नोत्तरी', 'भर्ती अधिसूचना चर्चा', 'संदेह निवारण'],
    isActive: true,
  }
];

export const INITIAL_WEBSITE_CONTENT: WebsiteContentConfig = {
  // Hero Section
  heroTrustBadgeHi: 'मध्यप्रदेश की प्रामाणिक परीक्षा टेस्ट सीरीज़',
  heroTrustBadgeEn: 'Madhya Pradesh Govt Exam Portal 2026',
  heroTitleHi: 'समूह-02 (पटवारी), MPPSC, पुलिस व व्यापम — अब सफलता पक्की!',
  heroTitleEn: 'Group-02 (Patwari), MPPSC, Police & Vyapam CBT Mock Tests',
  heroSubtitleHi: 'असली परीक्षा जैसा माहौल, हिंदी व अंग्रेजी द्विभाषी प्रश्न, तुरंत रिज़ल्ट और AI द्वारा विस्तृत उत्तर विश्लेषण व कमजोर क्षेत्रों का सुधार प्लान।',
  heroSubtitleEn: 'Experience authentic MP CBT exams, bilingual questions in Hindi & English, instant scores, and AI detailed evaluations.',
  heroCtaFreeMockHi: '🎯 40-प्रश्न फ्री मॉक टेस्ट शुरू करें',
  heroCtaFreeMockEn: 'Start 40-Question Free Mock',
  heroCtaCatalogHi: 'टेस्ट सीरीज़ देखें',
  heroCtaCatalogEn: 'Test Series Catalog',
  heroCtaNotesHi: 'GK नोट्स (PDF)',
  heroCtaNotesEn: 'Free Notes',

  // Hero Stats
  heroStat1Value: '50,000+',
  heroStat1LabelHi: 'सक्रिय परीक्षार्थी',
  heroStat1LabelEn: 'Aspirants',
  heroStat2Value: '250+',
  heroStat2LabelHi: 'मॉक टेस्ट उपलब्ध',
  heroStat2LabelEn: 'Mock Tests',
  heroStat3Value: 'AI',
  heroStat3LabelHi: 'तुरंत स्कोर विश्लेषण',
  heroStat3LabelEn: 'Instant AI Analysis',

  // Hero Spotlight Card
  spotlightLivePillHi: 'लाइव मॉक टेस्ट एक्टिव',
  spotlightLivePillEn: 'Live Mock Active',
  spotlightBadgeHi: 'विशेष मुफ़्त डेमो टेस्ट',
  spotlightBadgeEn: '40 MCQs • FREE DEMO',
  spotlightTitleHi: 'ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)',
  spotlightTitleEn: 'All-Madhya Pradesh 40-Questions Free Mock Test',
  spotlightSubtitleHi: '40 प्रश्न • 30 मिनट • MP GK, हिन्दी, गणित, रीजनिंग, कंप्यूटर, विज्ञान, अंग्रेजी',
  spotlightSubtitleEn: '40 Questions • 30 Mins • MP GK, Hindi, Maths, Reasoning, Computer, Science, English',
  spotlightAttemptedTextHi: '28,450+ छात्रों ने दिया',
  spotlightAttemptedTextEn: '28,450+ attempted',
  spotlightButtonHi: '40-प्रश्न डेमो दें',
  spotlightButtonEn: 'Start 40Q Demo',
  spotlightPillar1Text: 'AI मूल्यांकन',
  spotlightPillar2Text: 'ऑल-एमपी लाइव रैंक',
  spotlightPillar3Text: 'तुरंत स्कोरकार्ड',
  spotlightPillar4Text: 'ऑफलाइन PDF नोट्स',

  // New Student Welcome Bonus Bar
  regBannerTitleHi: 'नया छात्र पंजीकरण (Free Registration) करें और ₹500 वेलकम बोनस XP पाएँ!',
  regBannerTitleEn: 'New Aspirant Free Sign Up & Get ₹500 Welcome Bonus XP!',
  regBannerSubtitleHi: '55 जिलों के 50,000+ अभ्यर्थियों के साथ ऑल-एमपी लाइव रैंक और निःशुल्क ई-नोट्स अनलॉक करें।',
  regBannerSubtitleEn: 'Join 50,000+ aspirants across 55 MP districts with live state rank and free e-notes.',
  regBannerBtn1Hi: '📝 नया खाता बनाएँ (Sign Up)',
  regBannerBtn1En: 'Sign Up Free',
  regBannerBtn2Hi: 'लॉगिन करें',
  regBannerBtn2En: 'Login',

  // Catalog Section
  catalogBadgeHi: 'भर्ती वार मॉक टेस्ट पैक',
  catalogBadgeEn: 'Exam Test Series Catalog',
  catalogTitleHi: 'मध्यप्रदेश प्रमुख भर्ती टेस्ट सीरीज़',
  catalogTitleEn: 'Explore MP Govt Exam Test Series',
  catalogSubtitleHi: 'ऑनलाइन खरीद के साथ कभी भी टेस्ट दें, असीमित पुनः प्रयास और AI फीडबैक पाएँ।',
  catalogSubtitleEn: 'Purchase once, attempt anytime with unlimited re-attempts and real-time AI feedback.',

  // Why Choose Us Section
  whyChooseBadgeHi: 'अत्याधुनिक परीक्षा तकनीक',
  whyChooseBadgeEn: 'High Tech & High Yield',
  whyChooseTitleHi: 'MP परीक्षा सेतु ही क्यों चुनें?',
  whyChooseTitleEn: 'Why Prepare with MP Pariksha Setu?',
  whyChooseSubtitleHi: 'मध्यप्रदेश की सभी भर्ती परीक्षाओं के वास्तविक पैटर्न पर आधारित विशेष सुविधाएँ।',
  whyChooseSubtitleEn: 'Special features based on the actual pattern of all recruitment exams of Madhya Pradesh.',
  pillar1TitleHi: 'AI आंसर इवैल्यूएशन',
  pillar1TitleEn: 'AI Answer Evaluation',
  pillar1DescHi: 'टेस्ट सबमिट करते ही AI आपके गलत प्रश्नों के पीछे के कारणों, शॉर्टकट ट्रिक्स और 7-दिवसीय वैयक्तिकृत अध्ययन टाइमटेबल तैयार करता है।',
  pillar1DescEn: 'Instant AI breakdown of weak points, wrong question diagnosis, speed analytics, and 7-day personalized study timetable.',
  pillar2TitleHi: 'ऑल-एमपी लाइव लीडरबोर्ड',
  pillar2TitleEn: 'All-MP Live Leaderboard',
  pillar2DescHi: 'मध्यप्रदेश के सभी 55 जिलों (इंदौर, भोपाल, ग्वालियर, जबलपुर आदि) के हजारों छात्रों के साथ लाइव रैंक, पर्सेंटाइल और प्रोग्रेस ग्राफ।',
  pillar2DescEn: 'Live state-level rank, percentile comparison, and district ranking across all 55 districts of Madhya Pradesh.',
  pillar3TitleHi: 'सुरक्षित Razorpay चेकआउट',
  pillar3TitleEn: 'Secure Razorpay Checkout',
  pillar3DescHi: 'UPI (GPay, PhonePe, Paytm), QR कोड, कार्ड्स द्वारा तुरंत भुगतान, GST टैक्स इनवॉइस और तत्काल टेस्ट अनलॉक।',
  pillar3DescEn: 'Instant automated test activation via UPI QR, Cards, Netbanking with GST compliant instant invoice receipts.',

  // Social Section Headers
  socialSectionBadgeHi: 'मध्यप्रदेश की सबसे बड़ी प्रतियोगी छात्र कम्युनिटी',
  socialSectionBadgeEn: 'Madhya Pradesh Biggest Aspirant Community',
  socialSectionTitleHi: 'आधिकारिक सोशल मीडिया व स्टडी ग्रुप्स से जुड़ें',
  socialSectionTitleEn: 'Join Official Social Media & Study Groups',
  socialSectionSubtitleHi: 'दैनिक MP GK ट्रिक्स, हस्तलिखित नोट्स PDF, लाइव क्विज़, भर्ती नोटिफिकेशन व टॉपर्स गाइडेंस प्राप्त करें।',
  socialSectionSubtitleEn: 'Get daily MP GK tricks, handwritten notes PDFs, live quizzes, vacancy notifications & toppers guidance.',

  // Footer Content
  footerAboutHi: 'मध्यप्रदेश कर्मचारी चयन मंडल (MPESB), MPPSC एवं पुलिस भर्ती परीक्षाओं के लिए भारत का सबसे विश्वसनीय द्विभाषी CBT टेस्ट पोर्टल।',
  footerAboutEn: 'India\'s most authentic bilingual CBT Mock Test Portal for MPESB, MPPSC, and MP Police examinations.',
  footerAddressHi: 'परीक्षा सेतु भवन, एमपी नगर जोन-II, भोपाल (म.प्र.) 462011',
  footerAddressEn: 'Pariksha Setu Bhawan, MP Nagar Zone-II, Bhopal (M.P.) 462011',
  footerDisclaimerHi: 'यह एक स्वतंत्र प्रतियोगी परीक्षा तैयारी पोर्टल है और इसका किसी भी सरकारी विभाग या आयोग से सीधा संबंध नहीं है। समस्त प्रश्न व सामग्री शैक्षणिक उद्देश्य हेतु तैयार की गई है।',
  footerDisclaimerEn: 'This is an independent competitive examination test portal and is not directly affiliated with any government department or commission.',
  footerCopyrightText: '© 2026 MP परीक्षा सेतु (MP Pariksha Setu). सर्वाधिकार सुरक्षित। (All Rights Reserved).'
};

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  siteTitle: 'MP परीक्षा सेतु',
  siteTagline: 'मध्यप्रदेश प्रतियोगी परीक्षा सर्वोत्तम टेस्ट पोर्टल',
  helplinePhone: '+91 98930 12345',
  helplineWhatsapp: '919893012345',
  supportEmail: 'mpparikshasetu.support@gmail.com',
  logoUrl: '/logo.svg',
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
  whatsappCommunityUrl: 'https://chat.whatsapp.com/mpparikshasetu',
  websiteContent: INITIAL_WEBSITE_CONTENT,
  socialChannels: INITIAL_SOCIAL_CHANNELS
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

function normalizePlatformSettings(s: any): PlatformSettings {
  if (!s || typeof s !== 'object') return INITIAL_PLATFORM_SETTINGS;
  
  const mergedWebsiteContent: WebsiteContentConfig = {
    ...INITIAL_WEBSITE_CONTENT,
    ...(s.websiteContent || {})
  };

  const initialChannels = INITIAL_SOCIAL_CHANNELS.map(ch => ({ ...ch }));
  let mergedChannels: SocialChannelConfig[] = initialChannels;

  if (Array.isArray(s.socialChannels) && s.socialChannels.length > 0) {
    mergedChannels = initialChannels.map(defCh => {
      const found = s.socialChannels.find((c: any) => c.id === defCh.id);
      if (found) {
        return {
          ...defCh,
          ...found,
          highlights: Array.isArray(found.highlights) ? found.highlights : defCh.highlights
        };
      }
      return defCh;
    });
  } else {
    // Sync with top-level URLs if present
    mergedChannels = initialChannels.map(ch => {
      if (ch.id === 'whatsapp' && s.whatsappCommunityUrl) ch.url = s.whatsappCommunityUrl;
      if (ch.id === 'telegram' && s.telegramUrl) ch.url = s.telegramUrl;
      if (ch.id === 'youtube' && s.youtubeUrl) ch.url = s.youtubeUrl;
      if (ch.id === 'instagram' && s.instagramUrl) ch.url = s.instagramUrl;
      if (ch.id === 'facebook' && s.facebookUrl) ch.url = s.facebookUrl;
      return ch;
    });
  }

  return {
    ...INITIAL_PLATFORM_SETTINGS,
    ...s,
    websiteContent: mergedWebsiteContent,
    socialChannels: mergedChannels
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
    const raw = getStorage<any[] | null>(STORAGE_KEYS.TEST_SERIES, null);
    if (raw && Array.isArray(raw)) {
      return raw.map(normalizeTestSeries);
    }
    return INITIAL_TEST_SERIES.map(normalizeTestSeries);
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

  getPlatformSettings: (): PlatformSettings => {
    const raw = getStorage(STORAGE_KEYS.PLATFORM_SETTINGS, INITIAL_PLATFORM_SETTINGS);
    return normalizePlatformSettings(raw);
  },
  setPlatformSettings: (settings: PlatformSettings) => setStorage(STORAGE_KEYS.PLATFORM_SETTINGS, normalizePlatformSettings(settings)),

  getNavMenus: (): NavigationMenuItem[] => getStorage(STORAGE_KEYS.NAV_MENUS, INITIAL_NAV_MENUS),
  setNavMenus: (menus: NavigationMenuItem[]) => setStorage(STORAGE_KEYS.NAV_MENUS, menus),
};
