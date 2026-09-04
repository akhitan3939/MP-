export type Language = 'hi' | 'en';
export type ThemeMode = 'light' | 'dark';

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  state?: string;
  district: string;
  targetExam?: string;
  avatarUrl?: string;
  joinedAt?: string;
  createdAt?: string;
  streak: number;
  badges: string[];
  customTag?: string;
  tagColor?: string;
  grantReason?: string;
  isDummyUser?: boolean;
  userType?: 'authentic' | 'dummy';
}

export type ExamCategory = 
  | 'mppsc'
  | 'patwari'
  | 'police'
  | 'vyapam'
  | 'agri'
  | 'vanrakshak'
  | 'tet'
  | 'highcourt'
  | 'all';

export interface QuestionOption {
  id: string;
  textHi: string;
  textEn: string;
}

export interface Question {
  id: string;
  seriesId: string;
  section: string;
  subject?: string;
  questionHi: string;
  questionEn: string;
  imageUrl?: string;
  imageCaption?: string;
  options: QuestionOption[];
  optionsHi?: string[];
  optionsEn?: string[];
  correctOptionIndex: number;
  correctOption?: number;
  explanationHi: string;
  explanationEn: string;
  marks: number;
  negativeMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  setNumber?: number;
}

export interface TestSeriesSyllabusSection {
  section: string;
  sectionHi: string;
  questionsCount: number;
  marks: number;
}

export interface TestSeries {
  id: string;
  titleHi: string;
  titleEn: string;
  category: ExamCategory;
  department: string;
  departmentHi: string;
  descriptionHi: string;
  descriptionEn: string;
  price: number;
  originalPrice: number;
  totalTests: number;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: number;
  isFreeDemoAvailable: boolean;
  freeTestsCount?: number;
  isFeatured: boolean;
  enrolledCount: number;
  rating: number;
  syllabus: TestSeriesSyllabusSection[];
  pdfNotesCount: number;
  isActive?: boolean;
  disabledSetNumbers?: number[];
  activeSetsCount?: number;
  thumbnailUrl?: string;
  bannerUrl?: string;
  badgeTagHi?: string;
  badgeTagEn?: string;
  featuresHi?: string[];
  featuresEn?: string[];
}

export interface SiteBanner {
  id: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  imageUrl: string;
  badgeText?: string;
  buttonTextHi?: string;
  buttonTextEn?: string;
  targetView: string;
  targetId?: string;
  isActive: boolean;
  order: number;
}

export interface SocialChannelConfig {
  id: string; // 'whatsapp' | 'telegram' | 'youtube' | 'instagram' | 'facebook'
  nameHi: string;
  nameEn: string;
  handle: string;
  badgeHi: string;
  badgeEn: string;
  url: string;
  descHi: string;
  descEn: string;
  highlights: string[];
  isActive?: boolean;
}

export interface WebsiteContentConfig {
  // Hero Section
  heroTrustBadgeHi?: string;
  heroTrustBadgeEn?: string;
  heroTitleHi?: string;
  heroTitleEn?: string;
  heroSubtitleHi?: string;
  heroSubtitleEn?: string;
  heroCtaFreeMockHi?: string;
  heroCtaFreeMockEn?: string;
  heroCtaCatalogHi?: string;
  heroCtaCatalogEn?: string;
  heroCtaNotesHi?: string;
  heroCtaNotesEn?: string;
  
  // Hero Stats
  heroStat1Value?: string;
  heroStat1LabelHi?: string;
  heroStat1LabelEn?: string;
  heroStat2Value?: string;
  heroStat2LabelHi?: string;
  heroStat2LabelEn?: string;
  heroStat3Value?: string;
  heroStat3LabelHi?: string;
  heroStat3LabelEn?: string;

  // Hero Spotlight Card
  spotlightLivePillHi?: string;
  spotlightLivePillEn?: string;
  spotlightBadgeHi?: string;
  spotlightBadgeEn?: string;
  spotlightTitleHi?: string;
  spotlightTitleEn?: string;
  spotlightSubtitleHi?: string;
  spotlightSubtitleEn?: string;
  spotlightAttemptedTextHi?: string;
  spotlightAttemptedTextEn?: string;
  spotlightButtonHi?: string;
  spotlightButtonEn?: string;
  spotlightPillar1Text?: string;
  spotlightPillar2Text?: string;
  spotlightPillar3Text?: string;
  spotlightPillar4Text?: string;

  // New Student Welcome Bonus Bar
  regBannerTitleHi?: string;
  regBannerTitleEn?: string;
  regBannerSubtitleHi?: string;
  regBannerSubtitleEn?: string;
  regBannerBtn1Hi?: string;
  regBannerBtn1En?: string;
  regBannerBtn2Hi?: string;
  regBannerBtn2En?: string;

  // Catalog Section Headers
  catalogBadgeHi?: string;
  catalogBadgeEn?: string;
  catalogTitleHi?: string;
  catalogTitleEn?: string;
  catalogSubtitleHi?: string;
  catalogSubtitleEn?: string;

  // Why Choose Us Section
  whyChooseBadgeHi?: string;
  whyChooseBadgeEn?: string;
  whyChooseTitleHi?: string;
  whyChooseTitleEn?: string;
  whyChooseSubtitleHi?: string;
  whyChooseSubtitleEn?: string;
  pillar1TitleHi?: string;
  pillar1TitleEn?: string;
  pillar1DescHi?: string;
  pillar1DescEn?: string;
  pillar2TitleHi?: string;
  pillar2TitleEn?: string;
  pillar2DescHi?: string;
  pillar2DescEn?: string;
  pillar3TitleHi?: string;
  pillar3TitleEn?: string;
  pillar3DescHi?: string;
  pillar3DescEn?: string;

  // Social Section Headers
  socialSectionBadgeHi?: string;
  socialSectionBadgeEn?: string;
  socialSectionTitleHi?: string;
  socialSectionTitleEn?: string;
  socialSectionSubtitleHi?: string;
  socialSectionSubtitleEn?: string;
  socialChannels?: SocialChannelConfig[];

  // Footer Content
  footerAboutHi?: string;
  footerAboutEn?: string;
  footerAddressHi?: string;
  footerAddressEn?: string;
  footerDisclaimerHi?: string;
  footerDisclaimerEn?: string;
  footerCopyrightText?: string;
  visitorHitsCount?: number;
  lastUpdatedDateHi?: string;
  lastUpdatedDateEn?: string;
  showHitCounter?: boolean;
  showLastUpdated?: boolean;
}

export interface PlatformSettings {
  siteTitle: string;
  siteTagline: string;
  helplinePhone: string;
  helplineWhatsapp: string;
  supportEmail: string;
  logoUrl?: string;
  topTickerTextHi: string;
  topTickerTextEn: string;
  topTickerEnabled: boolean;
  paymentGatewayMode: 'LIVE' | 'TEST';
  enableAiEvaluation: boolean;
  maintenanceMode: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  youtubeUrl?: string;
  whatsappCommunityUrl?: string;
  visitorHitsCount?: number;
  lastUpdatedDateHi?: string;
  lastUpdatedDateEn?: string;
  showHitCounter?: boolean;
  showLastUpdated?: boolean;
  websiteContent?: WebsiteContentConfig;
  socialChannels?: SocialChannelConfig[];
}

export interface MockSetMetadata {
  setNumber: number;
  titleHi: string;
  titleEn: string;
  isFreeDemo: boolean;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  isLocked?: boolean;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  isMarkedForReview: boolean;
}

export interface SectionScore {
  sectionName: string;
  subject?: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  marksObtained: number;
  maxMarks: number;
  score?: number;
  totalMarks?: number;
  accuracy: number;
  weakAreas?: string[];
}

export interface AiEvaluationReport {
  overallSummaryHi?: string;
  overallSummaryEn?: string;
  summaryHi?: string;
  summaryEn?: string;
  summary?: string;
  keyStrengthsHi?: string[];
  keyStrengthsEn?: string[];
  keyInsights?: string[];
  keyInsightsHi?: string[];
  keyInsightsEn?: string[];
  criticalWeaknessesHi?: string[];
  criticalWeaknessesEn?: string[];
  sevenDayPlanHi?: string[];
  sevenDayPlanEn?: string[];
  sevenDayPlan?: { day: number; subject: string; focusTopic: string }[];
  memoryTricksHi?: string[];
  memoryTricksEn?: string[];
  mnemonicTip?: string;
  expectedCutoffScore: number;
  percentileRank: number;
}

export interface TestAttempt {
  id: string;
  userId: string;
  userName: string;
  userState?: string;
  userDistrict: string;
  seriesId: string;
  seriesTitle: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  rank: number;
  totalParticipants: number;
  percentile: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  unattempted?: number;
  totalQuestions?: number;
  answers: Record<string, UserAnswerRecord | number | any>;
  sectionScores: SectionScore[];
  aiReport?: AiEvaluationReport;
  certificateId: string;
}

export interface ShareModalParams {
  title?: string;
  text?: string;
  url?: string;
  score?: number;
  totalMarks?: number;
  seriesTitle?: string;
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  state?: string;
  district: string;
  avatarUrl?: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTaken: string;
  seriesTitle: string;
  seriesId: string;
  streak: number;
  badge: string;
  date: string;
}

export interface OrderTransaction {
  id: string;
  orderId: string;
  razorpayPaymentId: string;
  utrNumber?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userDistrict?: string;
  userState?: string;
  seriesId: string;
  seriesTitle: string;
  amount: number;
  discount: number;
  gstAmount: number;
  finalAmount: number;
  paymentMethod: 'UPI' | 'QR' | 'CARD' | 'NETBANKING' | 'WALLET' | 'PAYMENT_LINK' | 'EMI';
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  couponCode?: string;
  createdAt: string;
  invoiceNumber: string;
  isDummyUser?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minAmount: number;
  descriptionHi?: string;
  descriptionEn?: string;
  isActive: boolean;
  usageCount?: number;
  expiresAt?: string;
  validTill?: string;
}

export type AnnouncementTag = 
  | 'VACANCY' 
  | 'ADMIT_CARD' 
  | 'RESULT' 
  | 'OFFER' 
  | 'LIVE_TEST' 
  | 'NOTICE' 
  | 'EXAM_DATE' 
  | 'NEWS';

export interface Announcement {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi?: string;
  descriptionEn?: string;
  tag: AnnouncementTag;
  date?: string;
  publishedAt?: string;
  linkTextHi: string;
  linkTextEn: string;
  targetUrl?: string;
  targetView?: string;
  isPinned: boolean;
  isActive?: boolean;
  isNew?: boolean;
  order?: number;
}

export interface StudyReminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  isEnabled: boolean;
  topic: string;
}

export interface OfflineNote {
  id: string;
  titleHi: string;
  titleEn: string;
  category: string;
  fileSize: string;
  pages: number;
  downloadCount: number;
  summaryHi: string;
  summaryEn: string;
  sampleContentHi: string;
  pdfUrl?: string;
  fileName?: string;
  uploadedAt?: string;
  author?: string;
  isPublished?: boolean;
}

export type MenuPlacement = 'top' | 'bottom' | 'footer' | 'both' | 'all';
export type MenuTargetType = 'view' | 'category' | 'modal' | 'external';

export interface NavigationMenuItem {
  id: string;
  labelHi: string;
  labelEn: string;
  placement: MenuPlacement;
  targetType: MenuTargetType;
  targetValue: string;
  externalUrl?: string;
  iconName: string;
  highlight?: boolean;
  badgeTextHi?: string;
  badgeTextEn?: string;
  isActive: boolean;
  order: number;
  openInNewTab?: boolean;
  subTextHi?: string;
  subTextEn?: string;
}

