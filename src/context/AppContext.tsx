import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  Language,
  ThemeMode,
  SiteBanner,
  PlatformSettings,
  MockSetMetadata 
} from '../types';
import { StorageService } from '../utils/storage';

interface AppContextType {
  // Global State
  currentUser: UserProfile | null;
  users: UserProfile[];
  testSeries: TestSeries[];
  questions: Question[];
  attempts: TestAttempt[];
  leaderboard: LeaderboardEntry[];
  orders: OrderTransaction[];
  coupons: Coupon[];
  announcements: Announcement[];
  notes: OfflineNote[];
  reminders: StudyReminder[];
  siteBanners: SiteBanner[];
  platformSettings: PlatformSettings;
  enrolledSeriesIds: string[];
  bookmarkedQuestionIds: string[];
  theme: ThemeMode;
  lang: Language;
  isOnline: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';

  // Navigation & UI States
  activeView: string;
  viewParams: Record<string, any>;
  navigate: (view: string, params?: Record<string, any>) => void;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  
  // Modals
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register' | 'admin' | 'forgot') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register' | 'admin' | 'forgot';
  
  isRazorpayModalOpen: boolean;
  selectedSeriesForPurchase: TestSeries | null;
  openRazorpayModal: (series: TestSeries) => void;
  closeRazorpayModal: () => void;
  
  isNotesModalOpen: boolean;
  selectedNote: OfflineNote | null;
  openNotesModal: (note?: OfflineNote) => void;
  closeNotesModal: () => void;

  isRemindersModalOpen: boolean;
  openRemindersModal: () => void;
  closeRemindersModal: () => void;

  isCertificateModalOpen: boolean;
  selectedAttemptForCert: TestAttempt | null;
  openCertificateModal: (attempt: TestAttempt) => void;
  closeCertificateModal: () => void;

  // Actions
  login: (identifier: string, password?: string, role?: 'student' | 'admin') => boolean;
  register: (user: Omit<UserProfile, 'id' | 'joinedAt' | 'xp' | 'streak' | 'badges'>) => boolean;
  resetPassword: (identifier: string, newPassword: string) => { success: boolean; message: string; user?: UserProfile };
  logout: () => void;
  switchUser: (userId: string) => void;
  
  // Purchasing & Enrolling
  completePurchase: (series: TestSeries, paymentMethod: 'UPI' | 'QR' | 'CARD' | 'NETBANKING' | 'WALLET' | 'PAYMENT_LINK' | 'EMI', couponCode?: string, discount?: number) => OrderTransaction;
  isEnrolled: (seriesId: string) => boolean;

  // CBT Test Actions
  submitTestAttempt: (attempt: Omit<TestAttempt, 'id' | 'certificateId' | 'rank' | 'totalParticipants' | 'percentile'>) => Promise<TestAttempt>;
  toggleBookmarkQuestion: (questionId: string) => void;

  // Notifications & Reminders
  addReminder: (reminder: Omit<StudyReminder, 'id'>) => void;
  toggleReminder: (reminderId: string) => void;
  deleteReminder: (reminderId: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Admin Operations
  saveTestSeries: (series: TestSeries) => void;
  deleteTestSeries: (seriesId: string) => void;
  toggleTestSeriesActive: (seriesId: string) => void;
  saveQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  saveAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  saveSiteBanner: (banner: SiteBanner) => void;
  deleteSiteBanner: (id: string) => void;
  savePlatformSettings: (settings: PlatformSettings) => void;
  saveNote: (note: OfflineNote) => void;
  deleteNote: (id: string) => void;
  refundOrder: (orderId: string) => void;
  toggleUserAccess: (userId: string, seriesId: string) => void;
  toggleUserRole: (userId: string) => void;
  resetStudentPassword: (userId: string, newPass: string) => void;
  grantStudentXp: (userId: string, xp: number) => void;
  broadcastPushNotification: (title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core Data States
  const [users, setUsers] = useState<UserProfile[]>(() => StorageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => StorageService.getCurrentUserId());
  const [testSeries, setTestSeries] = useState<TestSeries[]>(() => StorageService.getTestSeries());
  const [questions, setQuestions] = useState<Question[]>(() => StorageService.getQuestions());
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => StorageService.getAttempts());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => StorageService.getLeaderboard());
  const [orders, setOrders] = useState<OrderTransaction[]>(() => StorageService.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [notes, setNotes] = useState<OfflineNote[]>(() => StorageService.getNotes());
  const [reminders, setReminders] = useState<StudyReminder[]>(() => StorageService.getReminders());
  const [siteBanners, setSiteBanners] = useState<SiteBanner[]>(() => StorageService.getSiteBanners());
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => StorageService.getPlatformSettings());
  const [enrolledMap, setEnrolledMap] = useState<Record<string, string[]>>(() => StorageService.getEnrolledMap());
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => StorageService.getBookmarkedQuestions());
  
  // Theme & Locale
  const [theme, setThemeState] = useState<ThemeMode>(() => StorageService.getTheme());
  const [lang, setLangState] = useState<Language>(() => StorageService.getLang());
  
  // Network & Sync
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Navigation View
  const [activeView, setActiveView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin' | 'forgot'>('login');

  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState<boolean>(false);
  const [selectedSeriesForPurchase, setSelectedSeriesForPurchase] = useState<TestSeries | null>(null);

  const [isNotesModalOpen, setIsNotesModalOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<OfflineNote | null>(null);

  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState<boolean>(false);

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [selectedAttemptForCert, setSelectedAttemptForCert] = useState<TestAttempt | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setCloudSyncStatus('syncing');
      setTimeout(() => setCloudSyncStatus('synced'), 800);
      showToast(lang === 'hi' ? '✅ आप पुनः ऑनलाइन हैं। क्लाउड डेटा सिंक हो गया।' : '✅ Back online. Cloud data synchronized.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setCloudSyncStatus('offline');
      showToast(lang === 'hi' ? '📶 ऑफलाइन मोड सक्रिय। स्थानीय टेस्ट एवं नोट्स उपलब्ध हैं।' : '📶 Offline mode active. Local tests and notes available.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang]);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    StorageService.setTheme(theme);
  }, [theme]);

  // Save changes to storage
  useEffect(() => { StorageService.setUsers(users); }, [users]);
  useEffect(() => { StorageService.setCurrentUserId(currentUserId); }, [currentUserId]);
  useEffect(() => { StorageService.setTestSeries(testSeries); }, [testSeries]);
  useEffect(() => { StorageService.setQuestions(questions); }, [questions]);
  useEffect(() => { StorageService.setAttempts(attempts); }, [attempts]);
  useEffect(() => { StorageService.setLeaderboard(leaderboard); }, [leaderboard]);
  useEffect(() => { StorageService.setOrders(orders); }, [orders]);
  useEffect(() => { StorageService.setCoupons(coupons); }, [coupons]);
  useEffect(() => { StorageService.setAnnouncements(announcements); }, [announcements]);
  useEffect(() => { StorageService.setNotes(notes); }, [notes]);
  useEffect(() => { StorageService.setReminders(reminders); }, [reminders]);
  useEffect(() => { StorageService.setSiteBanners(siteBanners); }, [siteBanners]);
  useEffect(() => { StorageService.setPlatformSettings(platformSettings); }, [platformSettings]);
  useEffect(() => { StorageService.setEnrolledMap(enrolledMap); }, [enrolledMap]);
  useEffect(() => { StorageService.setBookmarkedQuestions(bookmarkedIds); }, [bookmarkedIds]);

  const currentUser = users.find(u => u.id === currentUserId) || null;
  const enrolledSeriesIds = currentUser ? (enrolledMap[currentUser.id] || []) : [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const navigate = (view: string, params: Record<string, any> = {}) => {
    setActiveView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    StorageService.setLang(newLang);
  };

  // Auth Functions
  const openAuthModal = (mode: 'login' | 'register' | 'admin' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (identifier: string, password?: string, role: 'student' | 'admin' = 'student'): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    
    // Find by email OR username
    let found = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase() === cleanId)
    );

    if (!found && role === 'admin' && (cleanId === 'akhitan_3939' || cleanId === 'akhitan3939@mppariksha.in' || cleanId === 'admin')) {
      found = users.find(u => u.role === 'admin');
    }

    if (!found) {
      return false;
    }

    // Role safeguard: if admin login requested, ensure account has admin role
    if (role === 'admin' && found.role !== 'admin') {
      return false;
    }

    // If password provided, verify it strictly
    if (password !== undefined && password !== '') {
      if (found.password && found.password.trim() !== password.trim()) {
        return false;
      }
    }

    setCurrentUserId(found.id);
    StorageService.setCurrentUserId(found.id);
    closeAuthModal();
    showToast(lang === 'hi' ? `स्वागत है, ${found.name}!` : `Welcome, ${found.name}!`);
    return true;
  };

  const register = (data: Omit<UserProfile, 'id' | 'joinedAt' | 'xp' | 'streak' | 'badges'>): boolean => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = (data.username || '').trim().toLowerCase();

    // Check if email already registered
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return false;
    }

    // Check if username already taken
    if (cleanUsername && users.some(u => u.username && u.username.toLowerCase() === cleanUsername)) {
      return false;
    }

    const autoUsername = cleanUsername || cleanEmail.split('@')[0];

    const newUser: UserProfile = {
      ...data,
      username: autoUsername,
      id: `usr_${Date.now()}`,
      joinedAt: new Date().toISOString(),
      xp: 500,
      streak: 1,
      badges: ['🌟 New Aspirant', '🎯 MP Ready']
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    StorageService.setCurrentUserId(newUser.id);
    closeAuthModal();
    showToast(lang === 'hi' ? `🎉 स्वागत है, ${newUser.name}! आपका पंजीकरण सफल रहा और ₹500 वेलकम बोनस XP मिला।` : `🎉 Welcome, ${newUser.name}! Registration successful with 500 XP bonus.`);
    return true;
  };

  const resetPassword = (identifier: string, newPassword: string): { success: boolean; message: string; user?: UserProfile } => {
    const cleanId = identifier.trim().toLowerCase();
    
    const userIndex = users.findIndex(u => 
      u.email.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.phone && u.phone.trim() === identifier.trim())
    );

    if (userIndex === -1) {
      const msg = lang === 'hi' 
        ? 'इस ईमेल, यूज़रनेम या मोबाइल नंबर से कोई पंजीकृत खाता नहीं मिला।' 
        : 'No registered account found with this email, username, or phone number.';
      return { success: false, message: msg };
    }

    const targetUser = users[userIndex];
    const updatedUser: UserProfile = {
      ...targetUser,
      password: newPassword.trim()
    };

    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);
    StorageService.setUsers(newUsers);

    const msg = lang === 'hi'
      ? `✅ पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।`
      : `✅ Password updated successfully! You can now login with your new password.`;

    showToast(msg);
    return { success: true, message: msg, user: updatedUser };
  };

  const logout = () => {
    setCurrentUserId('');
    StorageService.setCurrentUserId('');
    showToast(lang === 'hi' ? 'सफलतापूर्वक लॉगआउट हो गया। अब आप पुनः लॉगिन कर सकते हैं।' : 'Successfully logged out. You can now login again.');
    navigate('home');
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      showToast(lang === 'hi' ? `स्विच किया गया: ${target.name} (${target.role})` : `Switched to ${target.name} (${target.role})`);
    }
  };

  // Modals for Purchase
  const openRazorpayModal = (series: TestSeries) => {
    setSelectedSeriesForPurchase(series);
    setIsRazorpayModalOpen(true);
  };

  const closeRazorpayModal = () => {
    setIsRazorpayModalOpen(false);
    setSelectedSeriesForPurchase(null);
  };

  const openNotesModal = (note?: OfflineNote) => {
    setSelectedNote(note || null);
    setIsNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setSelectedNote(null);
  };

  const openRemindersModal = () => setIsRemindersModalOpen(true);
  const closeRemindersModal = () => setIsRemindersModalOpen(false);

  const openCertificateModal = (attempt: TestAttempt) => {
    setSelectedAttemptForCert(attempt);
    setIsCertificateModalOpen(true);
  };

  const closeCertificateModal = () => {
    setIsCertificateModalOpen(false);
    setSelectedAttemptForCert(null);
  };

  const isEnrolled = (seriesId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return enrolledSeriesIds.includes(seriesId);
  };

  const completePurchase = (
    series: TestSeries, 
    paymentMethod: 'UPI' | 'QR' | 'CARD' | 'NETBANKING' | 'WALLET' | 'PAYMENT_LINK' | 'EMI', 
    couponCode?: string,
    discount: number = 0
  ): OrderTransaction => {
    const user = currentUser || users[1];
    const finalAmount = Math.max(0, series.price - discount);
    const gstAmount = +(finalAmount * 0.18).toFixed(2);
    const invoiceNumber = `INV-MPSETU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: OrderTransaction = {
      id: `txn_${Date.now()}`,
      orderId: `order_MP_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      razorpayPaymentId: `pay_RZP_MP_${Math.random().toString(36).substring(2, 10)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      seriesId: series.id,
      seriesTitle: lang === 'hi' ? series.titleHi : series.titleEn,
      amount: series.price,
      discount,
      gstAmount,
      finalAmount,
      paymentMethod,
      status: 'SUCCESS',
      couponCode,
      createdAt: new Date().toISOString(),
      invoiceNumber
    };

    // Update orders list
    setOrders(prev => [newOrder, ...prev]);

    // Enroll user in series
    setEnrolledMap(prev => {
      const userList = prev[user.id] || [];
      if (!userList.includes(series.id)) {
        return { ...prev, [user.id]: [...userList, series.id] };
      }
      return prev;
    });

    // Update series enrolled count
    setTestSeries(prev => prev.map(s => s.id === series.id ? { ...s, enrolledCount: s.enrolledCount + 1 } : s));

    // Award XP
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, xp: u.xp + 300 } : u));

    closeRazorpayModal();
    showToast(lang === 'hi' ? `🎉 बधाई! ${series.titleHi} सफलतापूर्वक अनलॉक हो गई।` : `🎉 Congrats! ${series.titleEn} unlocked successfully.`);
    
    return newOrder;
  };

  // Helper for immediate analytical report generation
  const buildInstantEvaluationReport = (params: {
    seriesTitle: string;
    score: number;
    totalMarks: number;
    studentName: string;
  }) => {
    const { seriesTitle, score, totalMarks, studentName } = params;
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    
    let summary = `${studentName}, आपने ${seriesTitle} में ${totalMarks} में से ${score} अंक (${percentage.toFixed(1)}%) प्राप्त किए हैं। `;
    if (percentage >= 75) {
      summary += 'आपका स्कोर मेरिट स्तर का है। लगातार रिवीजन और मॉक टेस्ट अभ्यास जारी रखें।';
    } else if (percentage >= 50) {
      summary += 'आपकी अवधारणात्मक पकड़ अच्छी है। कमजोर खंडों पर थोड़ा अतिरिक्त समय देकर आप 80%+ स्कोर कर सकते हैं।';
    } else {
      summary += 'मध्यप्रदेश सामान्य ज्ञान, पंचायती राज व गणित के मूल सिद्धांतों का दैनिक अभ्यास आवश्यक है।';
    }

    return {
      overallSummaryHi: summary,
      overallSummaryEn: `Great attempt ${studentName}! You scored ${score}/${totalMarks} (${percentage.toFixed(1)}%) in ${seriesTitle}. Consistent mock practice will help you achieve the top rank.`,
      keyStrengthsHi: [
        'मध्यप्रदेश सामान्य ज्ञान (इतिहास व भौगोलिक अवस्थिति) में उच्च सटीकता',
        'प्रति प्रश्न समय प्रबंधन संतुलित रहा',
        'मूल अवधारणात्मक प्रश्नों में आत्मविश्वास'
      ],
      keyStrengthsEn: [
        'High accuracy in MP Special GK questions',
        'Balanced time management across sections',
        'Strong conceptual clarity in core topics'
      ],
      criticalWeaknessesHi: [
        'पंचायती राज व भू-अभिलेख शब्दावली में रिवीजन की आवश्यकता',
        'कठिन प्रश्नों में एलिमिनेशन तकनीक का अधिक प्रयोग करें',
        'कंप्यूटर व विज्ञान खंड में नियमित अभ्यास करें'
      ],
      criticalWeaknessesEn: [
        'Panchayati Raj and administrative terminologies need review',
        'Refine elimination techniques on tricky options',
        'Practice daily MCQs in Computer & General Science'
      ],
      sevenDayPlanHi: [
        'दिन 1-2: म.प्र. की नदियाँ, राष्ट्रीय उद्यान व प्रमुख खनिज सार संग्रह पढ़ें',
        'दिन 3: 73वां संविधान संशोधन व म.प्र. पंचायती राज 1993 के 29 विषय याद करें',
        'दिन 4: हिन्दी व्याकरण (संधि, समास, रस, शुद्ध वर्तनी) के 100 अभ्यास प्रश्न हल करें',
        'दिन 5: कंप्यूटर विज्ञान एवं एमएस ऑफिस शॉर्टकट कुंजियों का रिवीज़न करें',
        'दिन 6: पिछले 5 वर्षों के MP व्यापम/MPPSC प्रश्नपत्र (PYQ) हल करें',
        'दिन 7: ऑल-एमपी फुल मॉक टेस्ट दें और गलत प्रश्नों का गहन विश्लेषण करें'
      ],
      sevenDayPlanEn: [
        'Day 1-2: Review MP Rivers, National Parks and Important Minerals',
        'Day 3: Master 73rd Amendment & 29 Subjects of MP Panchayati Raj',
        'Day 4: Solve 100 practice MCQs on Hindi Grammar & Vocabulary',
        'Day 5: Revise Computer shortcuts and network fundamentals',
        'Day 6: Solve MP Previous Year Papers (PYQs)',
        'Day 7: Attempt 1 Full Length Mock Test under strict timed conditions'
      ],
      memoryTricksHi: [
        'नर्मदा नदी उद्गम: "अमरकंटक से निकली नर्मदा, 1077 किमी एमपी में बही (कुल 1312)"',
        'भील जनजाति उत्सव: "भगोरिया = गुलालिया + गोल गधेड़ो + उजाड़िया"',
        'पंचायती राज दिवस: "24 अप्रैल (73वां संशोधन 1993)"'
      ],
      memoryTricksEn: [
        'Narmada river mnemonic: "Origins in Amarkantak, flows 1077 km in MP, 1312 km total"',
        'Bhil Tribe festival: "Bhagoriya = Gulaliya + Gol Gadhedo + Ujariya"',
        'Panchayati Raj Day: "24 April 1993"'
      ],
      expectedCutoffScore: Math.round(totalMarks * 0.76),
      percentileRank: Math.min(99.5, Math.max(50, Math.round(percentage * 1.1)))
    };
  };

  // Test Attempt Submissions (Instantaneous - 0 lag)
  const submitTestAttempt = async (
    rawAttempt: Omit<TestAttempt, 'id' | 'certificateId' | 'rank' | 'totalParticipants' | 'percentile'>
  ): Promise<TestAttempt> => {
    const user = currentUser || users[1];
    const totalParticipants = 1250 + attempts.length * 15;
    const rank = Math.max(1, Math.floor((1 - (rawAttempt.score / rawAttempt.totalMarks)) * totalParticipants) + 1);
    const percentile = +((1 - (rank / totalParticipants)) * 100).toFixed(1);
    const certificateId = `CERT-MPSETU-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const instantAiReport = buildInstantEvaluationReport({
      seriesTitle: rawAttempt.seriesTitle,
      score: rawAttempt.score,
      totalMarks: rawAttempt.totalMarks,
      studentName: user.name,
    });

    const newAttempt: TestAttempt = {
      ...rawAttempt,
      id: `att_${Date.now()}`,
      certificateId,
      rank,
      totalParticipants,
      percentile,
      aiReport: instantAiReport
    };

    // Save to attempts state immediately
    setAttempts(prev => [newAttempt, ...prev]);

    // Update Leaderboard if top score
    const newLeaderboardEntry: LeaderboardEntry = {
      rank,
      userId: user.id,
      userName: user.name,
      district: user.district,
      score: rawAttempt.score,
      totalMarks: rawAttempt.totalMarks,
      accuracy: rawAttempt.accuracy,
      timeTaken: `${Math.floor(rawAttempt.durationSeconds / 60)}m ${rawAttempt.durationSeconds % 60}s`,
      seriesTitle: rawAttempt.seriesTitle,
      seriesId: rawAttempt.seriesId,
      streak: user.streak,
      badge: rank <= 3 ? '🏆 Top 3 All-MP' : rank <= 10 ? '⭐ Top 10 Aspirant' : '🎯 Qualifier',
      date: new Date().toISOString().split('T')[0]
    };

    setLeaderboard(prev => {
      const filtered = prev.filter(p => !(p.userId === user.id && p.seriesId === rawAttempt.seriesId));
      const updated = [...filtered, newLeaderboardEntry].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
      return updated.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    });

    // Award XP
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, xp: u.xp + 150, streak: u.streak + 1 } : u));

    // Non-blocking background AI enhancement (does not block immediate result display)
    fetch('/api/ai/evaluate-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seriesTitle: rawAttempt.seriesTitle,
        score: rawAttempt.score,
        totalMarks: rawAttempt.totalMarks,
        durationSeconds: rawAttempt.durationSeconds,
        sectionScores: rawAttempt.sectionScores,
        studentName: user.name,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.report) {
          setAttempts(prev => prev.map(a => a.id === newAttempt.id ? { ...a, aiReport: data.report } : a));
        }
      })
      .catch(e => {
        console.warn('Background AI enhancement note:', e);
      });

    return newAttempt;
  };

  const toggleBookmarkQuestion = (questionId: string) => {
    setBookmarkedIds(prev => {
      const exists = prev.includes(questionId);
      const updated = exists ? prev.filter(id => id !== questionId) : [...prev, questionId];
      showToast(exists ? (lang === 'hi' ? 'बुकमार्क हटाया गया' : 'Bookmark removed') : (lang === 'hi' ? 'प्रश्न बुकमार्क किया गया' : 'Question bookmarked'));
      return updated;
    });
  };

  // Study Reminders
  const addReminder = (data: Omit<StudyReminder, 'id'>) => {
    const newRem: StudyReminder = { ...data, id: `rem_${Date.now()}` };
    setReminders(prev => [...prev, newRem]);
    showToast(lang === 'hi' ? '🔔 नया अध्ययन रिमाइंडर सेट किया गया!' : '🔔 Study reminder added!');
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Admin Handlers
  const saveTestSeries = (series: TestSeries) => {
    setTestSeries(prev => {
      const exists = prev.some(s => s.id === series.id);
      if (exists) {
        return prev.map(s => s.id === series.id ? series : s);
      }
      return [series, ...prev];
    });
    showToast(lang === 'hi' ? 'टेस्ट सीरीज़ सहेजी गई' : 'Test series saved');
  };

  const deleteTestSeries = (seriesId: string) => {
    setTestSeries(prev => prev.filter(s => s.id !== seriesId));
    setQuestions(prev => prev.filter(q => q.seriesId !== seriesId));
    showToast(lang === 'hi' ? 'टेस्ट सीरीज़ हटाई गई' : 'Test series deleted');
  };

  const toggleTestSeriesActive = (seriesId: string) => {
    let newStatus = true;
    setTestSeries(prev => prev.map(s => {
      if (s.id === seriesId) {
        newStatus = s.isActive === false ? true : false;
        return { ...s, isActive: newStatus };
      }
      return s;
    }));
    showToast(
      lang === 'hi' 
        ? (newStatus ? '🟢 परीक्षा सक्रिय कर दी गई है (होमपेज पर दृश्यमान)' : '🔴 परीक्षा निष्क्रिय कर दी गई है (होमपेज से छिपी हुई)') 
        : (newStatus ? '🟢 Exam marked ACTIVE (Visible on Homepage)' : '🔴 Exam marked INACTIVE (Hidden from Homepage)')
    );
  };

  const saveQuestion = (question: Question) => {
    setQuestions(prev => {
      const exists = prev.some(q => q.id === question.id);
      if (exists) {
        return prev.map(q => q.id === question.id ? question : q);
      }
      return [question, ...prev];
    });
    showToast(lang === 'hi' ? 'प्रश्न सहेजा गया' : 'Question saved');
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    showToast(lang === 'hi' ? 'प्रश्न हटाया गया' : 'Question deleted');
  };

  const saveAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => {
      const exists = prev.some(a => a.id === announcement.id);
      if (exists) {
        return prev.map(a => a.id === announcement.id ? announcement : a);
      }
      return [announcement, ...prev];
    });
    showToast(lang === 'hi' ? 'अधिसूचना अपडेट की गई' : 'Announcement updated');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast(lang === 'hi' ? 'अधिसूचना हटाई गई' : 'Announcement deleted');
  };

  const saveCoupon = (coupon: Coupon) => {
    setCoupons(prev => {
      const exists = prev.some(c => c.code === coupon.code);
      if (exists) {
        return prev.map(c => c.code === coupon.code ? coupon : c);
      }
      return [coupon, ...prev];
    });
    showToast(lang === 'hi' ? 'कूपन कोड सहेजा गया' : 'Coupon code saved');
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast(lang === 'hi' ? 'कूपन हटाया गया' : 'Coupon deleted');
  };

  const saveSiteBanner = (banner: SiteBanner) => {
    setSiteBanners(prev => {
      const exists = prev.some(b => b.id === banner.id);
      if (exists) {
        return prev.map(b => b.id === banner.id ? banner : b);
      }
      return [banner, ...prev];
    });
    showToast(lang === 'hi' ? 'बैनर सहेजा गया' : 'Banner saved successfully');
  };

  const deleteSiteBanner = (id: string) => {
    setSiteBanners(prev => prev.filter(b => b.id !== id));
    showToast(lang === 'hi' ? 'बैनर हटाया गया' : 'Banner deleted');
  };

  const savePlatformSettings = (settings: PlatformSettings) => {
    setPlatformSettings(settings);
    showToast(lang === 'hi' ? 'प्लेटफ़ॉर्म सेटिंग्स अपडेट हुईं' : 'Platform settings updated');
  };

  const saveNote = (note: OfflineNote) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === note.id);
      if (exists) {
        return prev.map(n => n.id === note.id ? note : n);
      }
      return [note, ...prev];
    });
    showToast(lang === 'hi' ? 'पीडीएफ / ई-नोट सहेजा गया' : 'Study note saved');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast(lang === 'hi' ? 'नोट हटाया गया' : 'Study note deleted');
  };

  const refundOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'REFUNDED' } : o));
    showToast(lang === 'hi' ? 'रिफंड प्रोसेस किया गया' : 'Refund processed successfully');
  };

  const toggleUserAccess = (userId: string, seriesId: string) => {
    setEnrolledMap(prev => {
      const list = prev[userId] || [];
      const has = list.includes(seriesId);
      const updated = has ? list.filter(id => id !== seriesId) : [...list, seriesId];
      return { ...prev, [userId]: updated };
    });
    showToast(lang === 'hi' ? 'छात्र की सब्सक्रिप्शन स्थिति बदली गई' : 'User enrollment toggled');
  };

  const toggleUserRole = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'student' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
    showToast(lang === 'hi' ? 'उपयोगकर्ता रोल अपडेट किया गया' : 'User role updated');
  };

  const resetStudentPassword = (userId: string, newPass: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    showToast(lang === 'hi' ? 'पासवर्ड सफलतापूर्वक रीसेट हुआ' : 'Password reset successfully');
  };

  const grantStudentXp = (userId: string, xpToAdd: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, xp: (u.xp || 0) + xpToAdd } : u));
    showToast(lang === 'hi' ? `+${xpToAdd} XP छात्र को प्रदान किए गए` : `+${xpToAdd} XP granted to student`);
  };

  const broadcastPushNotification = (title: string, message: string) => {
    showToast(`📢 [BROADCAST]: ${title} — ${message}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        testSeries,
        questions,
        attempts,
        leaderboard,
        orders,
        coupons,
        announcements,
        notes,
        reminders,
        siteBanners,
        platformSettings,
        enrolledSeriesIds,
        bookmarkedQuestionIds: bookmarkedIds,
        theme,
        lang,
        isOnline,
        cloudSyncStatus,

        activeView,
        viewParams,
        navigate,
        toggleTheme,
        setLanguage,

        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,

        isRazorpayModalOpen,
        selectedSeriesForPurchase,
        openRazorpayModal,
        closeRazorpayModal,

        isNotesModalOpen,
        selectedNote,
        openNotesModal,
        closeNotesModal,

        isRemindersModalOpen,
        openRemindersModal,
        closeRemindersModal,

        isCertificateModalOpen,
        selectedAttemptForCert,
        openCertificateModal,
        closeCertificateModal,

        login,
        register,
        resetPassword,
        logout,
        switchUser,

        completePurchase,
        isEnrolled,
        submitTestAttempt,
        toggleBookmarkQuestion,

        addReminder,
        toggleReminder,
        deleteReminder,
        toastMessage,
        showToast,

        saveTestSeries,
        deleteTestSeries,
        toggleTestSeriesActive,
        saveQuestion,
        deleteQuestion,
        saveAnnouncement,
        deleteAnnouncement,
        saveCoupon,
        deleteCoupon,
        saveSiteBanner,
        deleteSiteBanner,
        savePlatformSettings,
        saveNote,
        deleteNote,
        refundOrder,
        toggleUserAccess,
        toggleUserRole,
        resetStudentPassword,
        grantStudentXp,
        broadcastPushNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
