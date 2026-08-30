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
  targetExam: string;
  avatarUrl?: string;
  joinedAt: string;
  createdAt?: string;
  xp: number;
  streak: number;
  badges: string[];
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
  overallSummaryHi: string;
  overallSummaryEn: string;
  summary?: string;
  keyStrengthsHi: string[];
  keyStrengthsEn: string[];
  keyInsights?: string[];
  criticalWeaknessesHi: string[];
  criticalWeaknessesEn: string[];
  sevenDayPlanHi: string[];
  sevenDayPlanEn: string[];
  sevenDayPlan?: { day: number; subject: string; focusTopic: string }[];
  memoryTricksHi: string[];
  memoryTricksEn: string[];
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
  xpBreakdown?: {
    correctXp: number;
    penaltyXp: number;
    streakBonus: number;
    speedBonus: number;
    netXp: number;
  };
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
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
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

export interface Announcement {
  id: string;
  titleHi: string;
  titleEn: string;
  tag: 'VACANCY' | 'ADMIT_CARD' | 'RESULT' | 'OFFER' | 'LIVE_TEST';
  date?: string;
  publishedAt?: string;
  linkTextHi: string;
  linkTextEn: string;
  isPinned: boolean;
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

