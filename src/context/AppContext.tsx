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
  MockSetMetadata,
  ShareModalParams,
  NavigationMenuItem 
} from '../types';
import { StorageService, INITIAL_NAV_MENUS } from '../utils/storage';
import { calculateAttemptXp } from '../utils/xpSystem';

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
  navMenuItems: NavigationMenuItem[];
  topNavItems: NavigationMenuItem[];
  bottomNavItems: NavigationMenuItem[];
  footerNavItems: NavigationMenuItem[];
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
  handleNavAction: (item: NavigationMenuItem) => void;
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

  isShareModalOpen: boolean;
  shareModalParams: ShareModalParams | null;
  openShareModal: (params?: ShareModalParams) => void;
  closeShareModal: () => void;

  // Actions
  awardXp: (amount: number, reason?: string) => void;
  redeemXpForCoupon: (xpToRedeem: number) => { success: boolean; couponCode?: string; message: string };
  login: (identifier: string, password?: string, role?: 'student' | 'admin') => boolean;
  register: (user: Omit<UserProfile, 'id' | 'joinedAt' | 'xp' | 'streak' | 'badges'>) => { success: boolean; message: string; user?: UserProfile };
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
  saveUser: (user: UserProfile) => { success: boolean; message: string };
  deleteUser: (userId: string) => { success: boolean; message: string };
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
  uploadLogo: (logoDataOrUrl: string) => Promise<{ success: boolean; logoUrl?: string; message: string }>;
  saveNote: (note: OfflineNote) => void;
  deleteNote: (id: string) => void;
  saveNavMenuItem: (item: NavigationMenuItem) => void;
  deleteNavMenuItem: (id: string) => void;
  toggleNavMenuItemActive: (id: string) => void;
  reorderNavMenuItem: (id: string, direction: 'up' | 'down') => void;
  resetNavMenusToDefault: () => void;
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
  const [navMenuItems, setNavMenuItems] = useState<NavigationMenuItem[]>(() => StorageService.getNavMenus());
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

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareModalParams, setShareModalParams] = useState<ShareModalParams | null>(null);

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

  // Load server-persisted state on initial startup
  useEffect(() => {
    fetch('/api/app-data')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          const s = data.data;
          if (Array.isArray(s.testSeries) && s.testSeries.length > 0) {
            setTestSeries(s.testSeries);
            StorageService.setTestSeries(s.testSeries);
          }
          if (s.platformSettings && typeof s.platformSettings === 'object' && Object.keys(s.platformSettings).length > 0) {
            setPlatformSettings(prev => ({ ...prev, ...s.platformSettings }));
            StorageService.setPlatformSettings({ ...platformSettings, ...s.platformSettings });
          }
          if (Array.isArray(s.siteBanners) && s.siteBanners.length > 0) {
            setSiteBanners(s.siteBanners);
            StorageService.setSiteBanners(s.siteBanners);
          }
          if (Array.isArray(s.announcements) && s.announcements.length > 0) {
            setAnnouncements(s.announcements);
            StorageService.setAnnouncements(s.announcements);
          }
          if (Array.isArray(s.coupons) && s.coupons.length > 0) {
            setCoupons(s.coupons);
            StorageService.setCoupons(s.coupons);
          }
          if (Array.isArray(s.navMenuItems) && s.navMenuItems.length > 0) {
            setNavMenuItems(s.navMenuItems);
            StorageService.setNavMenus(s.navMenuItems);
          }
        }
      })
      .catch(e => {
        console.log('App running in offline/local storage mode:', e);
      });
  }, []);

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
  useEffect(() => { StorageService.setNavMenus(navMenuItems); }, [navMenuItems]);
  useEffect(() => { StorageService.setEnrolledMap(enrolledMap); }, [enrolledMap]);
  useEffect(() => { StorageService.setBookmarkedQuestions(bookmarkedIds); }, [bookmarkedIds]);

  const currentUser = users.find(u => u.id === currentUserId) || null;
  const enrolledSeriesIds = currentUser ? (enrolledMap[currentUser.id] || []) : [];

  // Top, Bottom and Footer dynamic menu items
  const topNavItems = navMenuItems
    .filter(m => (m.placement === 'top' || m.placement === 'both' || m.placement === 'all') && m.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const bottomNavItems = navMenuItems
    .filter(m => (m.placement === 'bottom' || m.placement === 'both' || m.placement === 'all') && m.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const footerNavItems = navMenuItems
    .filter(m => (m.placement === 'footer' || m.placement === 'bottom' || m.placement === 'both' || m.placement === 'all') && m.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

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

  const handleNavAction = (item: NavigationMenuItem) => {
    if (!item) return;
    if (item.targetType === 'view') {
      navigate(item.targetValue);
    } else if (item.targetType === 'category') {
      navigate('catalog', { category: item.targetValue });
    } else if (item.targetType === 'modal') {
      if (item.targetValue === 'notes') {
        openNotesModal();
      } else if (item.targetValue === 'reminders') {
        openRemindersModal();
      } else if (item.targetValue === 'auth' || item.targetValue === 'login') {
        openAuthModal('login');
      } else {
        navigate('home');
      }
    } else if (item.targetType === 'external') {
      if (item.targetValue) {
        if (item.openInNewTab) {
          window.open(item.targetValue, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = item.targetValue;
        }
      }
    }
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

  const register = (data: Omit<UserProfile, 'id' | 'joinedAt' | 'xp' | 'streak' | 'badges'>): { success: boolean; message: string; user?: UserProfile } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = (data.username || '').trim().toLowerCase();
    const cleanPhone = (data.phone || '').trim().replace(/\D/g, '').slice(-10);

    // Check duplicate phone number
    if (cleanPhone.length >= 10 && users.some(u => (u.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone)) {
      const msg = lang === 'hi' 
        ? `❌ यह मोबाइल नंबर (+91-${cleanPhone}) पहले से पंजीकृत है! कृपया किसी अन्य नंबर का उपयोग करें या सीधे लॉगिन करें।` 
        : `❌ Mobile number (+91-${cleanPhone}) is already registered! Please login or use another number.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Check if email already registered
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      const msg = lang === 'hi'
        ? `❌ यह ईमेल (${cleanEmail}) पहले से पंजीकृत है! कृपया सीधे लॉगिन करें।`
        : `❌ Email (${cleanEmail}) is already registered! Please login directly.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Check if username already taken
    if (cleanUsername && users.some(u => u.username && u.username.toLowerCase() === cleanUsername)) {
      const msg = lang === 'hi'
        ? `❌ यूज़रनेम '@${cleanUsername}' पहले से लिया जा चुका है। कृपया दूसरा यूज़रनेम चुनें।`
        : `❌ Username '@${cleanUsername}' is already taken. Please choose another username.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    const autoUsername = cleanUsername || cleanEmail.split('@')[0];

    const newUser: UserProfile = {
      ...data,
      phone: cleanPhone || data.phone.trim(),
      username: autoUsername,
      id: `usr_${Date.now()}`,
      joinedAt: new Date().toISOString(),
      xp: 500,
      streak: 1,
      badges: ['🌟 New Aspirant', '🎯 MP Ready']
    };

    setUsers(prev => {
      const updated = [newUser, ...prev];
      StorageService.setUsers(updated);
      return updated;
    });
    setCurrentUserId(newUser.id);
    StorageService.setCurrentUserId(newUser.id);
    
    const successMsg = lang === 'hi' 
      ? `🎉 स्वागत है, ${newUser.name}! आपका पंजीकरण सफल रहा और ₹500 वेलकम बोनस XP मिला।` 
      : `🎉 Welcome, ${newUser.name}! Registration successful with 500 XP bonus.`;
    showToast(successMsg);
    return { success: true, message: successMsg, user: newUser };
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

  const openShareModal = (params?: ShareModalParams) => {
    setShareModalParams(params || null);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareModalParams(null);
  };

  const awardXp = (amount: number, reason?: string) => {
    const user = currentUser || users[1];
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, xp: (u.xp || 0) + amount } : u));
    showToast(lang === 'hi' ? `🎉 +${amount} XP रिवॉर्ड मिला! ${reason ? `(${reason})` : ''}` : `🎉 +${amount} XP awarded! ${reason ? `(${reason})` : ''}`);
  };

  const redeemXpForCoupon = (xpToRedeem: number): { success: boolean; couponCode?: string; message: string } => {
    const user = currentUser || users[1];
    const currentXp = user.xp || 0;

    if (currentXp < xpToRedeem) {
      const msg = lang === 'hi'
        ? `⚠️ आपके पास पर्याप्त XP नहीं हैं। आवश्यक: ${xpToRedeem} XP, उपलब्ध: ${currentXp} XP`
        : `⚠️ Insufficient XP. Required: ${xpToRedeem} XP, Available: ${currentXp} XP`;
      showToast(msg);
      return { success: false, message: msg };
    }

    let discountAmount = 50;
    if (xpToRedeem >= 2000) discountAmount = 200;
    else if (xpToRedeem >= 1000) discountAmount = 100;
    else if (xpToRedeem >= 500) discountAmount = 50;

    const generatedCode = `XP${discountAmount}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Deduct user's XP
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, xp: Math.max(0, u.xp - xpToRedeem) } : u));

    // Create new Coupon in system
    const newCoupon: Coupon = {
      code: generatedCode,
      discountType: 'flat',
      discountValue: discountAmount,
      minAmount: discountAmount + 50,
      descriptionHi: `${xpToRedeem} XP रिडीम करने पर ₹${discountAmount} की विशेष छूट`,
      descriptionEn: `₹${discountAmount} flat discount from ${xpToRedeem} XP redemption`,
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageCount: 0,
      isActive: true
    };

    setCoupons(prev => [newCoupon, ...prev]);

    const successMsg = lang === 'hi'
      ? `🎉 बधाई! ${xpToRedeem} XP के बदले ₹${discountAmount} की छूट वाला विशेष कूपन कोड '${generatedCode}' सक्रिय हो गया है!`
      : `🎉 Success! Redeemed ${xpToRedeem} XP for ₹${discountAmount} discount coupon '${generatedCode}'!`;

    showToast(successMsg);
    return { success: true, couponCode: generatedCode, message: successMsg };
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

    // Calculate Dynamic XP Breakdown (+10 for correct, -5 penalty for wrong, streak & speed bonus)
    const xpBreakdown = calculateAttemptXp({
      correctCount: rawAttempt.correctAnswers || 0,
      incorrectCount: rawAttempt.incorrectAnswers || 0,
      unattemptedCount: rawAttempt.unattempted || 0,
      streak: user.streak || 1,
      durationSeconds: rawAttempt.durationSeconds,
      totalQuestions: rawAttempt.totalQuestions || 100,
    });

    const newAttempt: TestAttempt = {
      ...rawAttempt,
      id: `att_${Date.now()}`,
      certificateId,
      rank,
      totalParticipants,
      percentile,
      xpBreakdown,
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

    // Award / Penalize XP dynamically (Net XP applied to user profile)
    setUsers(prev => prev.map(u => u.id === user.id ? { 
      ...u, 
      xp: Math.max(0, (u.xp || 0) + xpBreakdown.netXp), 
      streak: (u.streak || 0) + 1 
    } : u));

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

  // Admin Handlers with Instant Multi-User Server Persistence
  const saveUser = (user: UserProfile): { success: boolean; message: string } => {
    const cleanPhone = (user.phone || '').replace(/\D/g, '').slice(-10);
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const cleanUsername = (user.username || '').trim().toLowerCase();

    // Check duplicate phone for other users
    if (cleanPhone.length >= 10 && users.some(u => u.id !== user.id && (u.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone)) {
      const msg = lang === 'hi' 
        ? `❌ यह मोबाइल नंबर (+91-${cleanPhone}) किसी अन्य छात्र के पास पहले से दर्ज है!` 
        : `❌ Mobile number (+91-${cleanPhone}) is already registered with another user!`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Check duplicate email for other users
    if (cleanEmail && users.some(u => u.id !== user.id && (u.email || '').trim().toLowerCase() === cleanEmail)) {
      const msg = lang === 'hi' 
        ? `❌ यह ईमेल (${cleanEmail}) किसी अन्य खाते में पहले से उपयोग में है!` 
        : `❌ Email (${cleanEmail}) is already in use by another user!`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Check duplicate username for other users
    if (cleanUsername && users.some(u => u.id !== user.id && (u.username || '').trim().toLowerCase() === cleanUsername)) {
      const msg = lang === 'hi' 
        ? `❌ यह यूज़रनेम '@${cleanUsername}' किसी अन्य यूज़र के पास पहले से है!` 
        : `❌ Username '@${cleanUsername}' is already taken!`;
      showToast(msg);
      return { success: false, message: msg };
    }

    setUsers(prev => {
      const exists = prev.some(u => u.id === user.id);
      const updated = exists ? prev.map(u => u.id === user.id ? user : u) : [user, ...prev];
      StorageService.setUsers(updated);
      return updated;
    });

    const successMsg = lang === 'hi' ? '✅ यूज़र विवरण सफलतापूर्वक सहेज लिया गया।' : '✅ User profile updated successfully.';
    showToast(successMsg);
    return { success: true, message: successMsg };
  };

  const deleteUser = (userId: string): { success: boolean; message: string } => {
    if (userId === currentUser?.id) {
      const msg = lang === 'hi' ? '⚠️ आप वर्तमान में सक्रिय लॉगिन किए गए स्वयं के एडमिन खाते को नहीं हटा सकते।' : '⚠️ Cannot delete currently active logged in admin account.';
      showToast(msg);
      return { success: false, message: msg };
    }

    const target = users.find(u => u.id === userId);
    if (!target) {
      const msg = lang === 'hi' ? '❌ यूज़र नहीं मिला।' : '❌ User not found.';
      return { success: false, message: msg };
    }

    setUsers(prev => {
      const updated = prev.filter(u => u.id !== userId);
      StorageService.setUsers(updated);
      return updated;
    });

    const successMsg = lang === 'hi' ? `🗑️ यूज़र '${target.name}' सफलतापूर्वक हटा दिया गया।` : `🗑️ User '${target.name}' deleted successfully.`;
    showToast(successMsg);
    return { success: true, message: successMsg };
  };

  const saveTestSeries = (series: TestSeries) => {
    setTestSeries(prev => {
      const exists = prev.some(s => s.id === series.id);
      const updated = exists ? prev.map(s => s.id === series.id ? series : s) : [series, ...prev];
      StorageService.setTestSeries(updated);
      return updated;
    });
    fetch('/api/test-series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(series)
    }).catch(e => console.warn('Server sync error for test-series:', e));
    showToast(lang === 'hi' ? 'टेस्ट सीरीज़ सहेजी गई' : 'Test series saved');
  };

  const deleteTestSeries = (seriesId: string) => {
    setTestSeries(prev => {
      const updated = prev.filter(s => s.id !== seriesId);
      StorageService.setTestSeries(updated);
      return updated;
    });
    setQuestions(prev => {
      const updated = prev.filter(q => q.seriesId !== seriesId);
      StorageService.setQuestions(updated);
      return updated;
    });
    fetch(`/api/test-series/${seriesId}`, { method: 'DELETE' }).catch(e => console.warn('Server sync error for test-series deletion:', e));
    showToast(lang === 'hi' ? 'टेस्ट सीरीज़ हटाई गई' : 'Test series deleted');
  };

  const toggleTestSeriesActive = (seriesId: string) => {
    let newStatus = true;
    setTestSeries(prev => {
      const updated = prev.map(s => {
        if (s.id === seriesId) {
          newStatus = s.isActive === false ? true : false;
          return { ...s, isActive: newStatus };
        }
        return s;
      });
      StorageService.setTestSeries(updated);
      return updated;
    });
    fetch('/api/test-series/toggle-active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesId, isActive: newStatus })
    }).catch(e => console.warn('Server sync error for toggle active:', e));

    showToast(
      lang === 'hi' 
        ? (newStatus ? '🟢 परीक्षा सक्रिय कर दी गई है (होमपेज पर दृश्यमान)' : '🔴 परीक्षा निष्क्रिय कर दी गई है (होमपेज से छिपी हुई)') 
        : (newStatus ? '🟢 Exam marked ACTIVE (Visible on Homepage)' : '🔴 Exam marked INACTIVE (Hidden from Homepage)')
    );
  };

  const saveQuestion = (question: Question) => {
    setQuestions(prev => {
      const exists = prev.some(q => q.id === question.id);
      const updated = exists ? prev.map(q => q.id === question.id ? question : q) : [question, ...prev];
      StorageService.setQuestions(updated);
      return updated;
    });
    showToast(lang === 'hi' ? 'प्रश्न सहेजा गया' : 'Question saved');
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(prev => {
      const updated = prev.filter(q => q.id !== questionId);
      StorageService.setQuestions(updated);
      return updated;
    });
    showToast(lang === 'hi' ? 'प्रश्न हटाया गया' : 'Question deleted');
  };

  const saveAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => {
      const exists = prev.some(a => a.id === announcement.id);
      const updated = exists ? prev.map(a => a.id === announcement.id ? announcement : a) : [announcement, ...prev];
      StorageService.setAnnouncements(updated);
      fetch('/api/app-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcements: updated })
      }).catch(e => console.warn('Server sync error:', e));
      return updated;
    });
    showToast(lang === 'hi' ? 'अधिसूचना अपडेट की गई' : 'Announcement updated');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => {
      const updated = prev.filter(a => a.id !== id);
      StorageService.setAnnouncements(updated);
      fetch('/api/app-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcements: updated })
      }).catch(e => console.warn('Server sync error:', e));
      return updated;
    });
    showToast(lang === 'hi' ? 'अधिसूचना हटाई गई' : 'Announcement deleted');
  };

  const saveCoupon = (coupon: Coupon) => {
    setCoupons(prev => {
      const exists = prev.some(c => c.code === coupon.code);
      const updated = exists ? prev.map(c => c.code === coupon.code ? coupon : c) : [coupon, ...prev];
      StorageService.setCoupons(updated);
      fetch('/api/app-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupons: updated })
      }).catch(e => console.warn('Server sync error:', e));
      return updated;
    });
    showToast(lang === 'hi' ? 'कूपन कोड सहेजा गया' : 'Coupon code saved');
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.code !== code);
      StorageService.setCoupons(updated);
      fetch('/api/app-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupons: updated })
      }).catch(e => console.warn('Server sync error:', e));
      return updated;
    });
    showToast(lang === 'hi' ? 'कूपन हटाया गया' : 'Coupon deleted');
  };

  const saveSiteBanner = (banner: SiteBanner) => {
    setSiteBanners(prev => {
      const exists = prev.some(b => b.id === banner.id);
      const updated = exists ? prev.map(b => b.id === banner.id ? banner : b) : [banner, ...prev];
      StorageService.setSiteBanners(updated);
      fetch('/api/app-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteBanners: updated })
      }).catch(e => console.warn('Server sync error:', e));
      return updated;
    });
    showToast(lang === 'hi' ? 'बैनर सहेजा गया' : 'Banner saved successfully');
  };

  const deleteSiteBanner = (id: string) => {
    setSiteBanners(prev => {
      const updated = prev.filter(b => b.id !== id);
      StorageService.setSiteBanners(updated);
      fetch('/api/app-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteBanners: updated })
      }).catch(e => console.warn('Server sync error:', e));
      return updated;
    });
    showToast(lang === 'hi' ? 'बैनर हटाया गया' : 'Banner deleted');
  };

  const savePlatformSettings = (settings: PlatformSettings) => {
    setPlatformSettings(settings);
    StorageService.setPlatformSettings(settings);
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(e => console.warn('Server sync error for settings:', e));
    showToast(lang === 'hi' ? 'प्लेटफ़ॉर्म सेटिंग्स अपडेट हुईं (सभी यूज़र्स के लिए लागू)' : 'Platform settings updated globally');
  };

  const uploadLogo = async (logoDataOrUrl: string): Promise<{ success: boolean; logoUrl?: string; message: string }> => {
    try {
      // 1. Immediately update local state & StorageService so changes appear instantly on screen
      const immediateSettings: PlatformSettings = { 
        ...platformSettings, 
        logoUrl: logoDataOrUrl 
      };
      setPlatformSettings(immediateSettings);
      StorageService.setPlatformSettings(immediateSettings);

      const isBase64 = logoDataOrUrl.startsWith('data:image');
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isBase64 ? { logoData: logoDataOrUrl } : { logoUrl: logoDataOrUrl })
      });
      const data = await res.json();
      if (data && data.success && data.logoUrl) {
        const updated = { ...immediateSettings, logoUrl: data.logoUrl };
        setPlatformSettings(updated);
        StorageService.setPlatformSettings(updated);
        showToast(lang === 'hi' ? '✅ नया लोगो सफलतापूर्वक अपडेट व सहेजा गया!' : '✅ Logo updated & saved successfully!');
        return { success: true, logoUrl: data.logoUrl, message: data.message };
      }
      showToast(lang === 'hi' ? '✅ नया लोगो सक्रिय किया गया' : '✅ New logo activated');
      return { success: true, logoUrl: logoDataOrUrl, message: 'Updated locally' };
    } catch (err: any) {
      console.warn('Logo upload server sync error (local logo retained):', err);
      showToast(lang === 'hi' ? '✅ नया लोगो सक्रिय किया गया' : '✅ Logo activated');
      return { success: true, logoUrl: logoDataOrUrl, message: 'Active locally' };
    }
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

  const saveNavMenuItem = (item: NavigationMenuItem) => {
    setNavMenuItems(prev => {
      const exists = prev.some(m => m.id === item.id);
      if (exists) {
        return prev.map(m => m.id === item.id ? item : m);
      }
      return [...prev, item];
    });
    showToast(lang === 'hi' ? 'मेन्यू आइटम सफलतापूर्वक सहेजा गया' : 'Navigation menu item saved successfully');
  };

  const deleteNavMenuItem = (id: string) => {
    setNavMenuItems(prev => prev.filter(m => m.id !== id));
    showToast(lang === 'hi' ? 'मेन्यू आइटम हटा दिया गया' : 'Navigation menu item deleted');
  };

  const toggleNavMenuItemActive = (id: string) => {
    setNavMenuItems(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
    showToast(lang === 'hi' ? 'मेन्यू स्थिति अपडेट की गई' : 'Menu visibility updated');
  };

  const reorderNavMenuItem = (id: string, direction: 'up' | 'down') => {
    setNavMenuItems(prev => {
      const sorted = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      const index = sorted.findIndex(m => m.id === id);
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        const targetIdx = index - 1;
        const temp = sorted[index];
        sorted[index] = sorted[targetIdx];
        sorted[targetIdx] = temp;
      } else if (direction === 'down' && index < sorted.length - 1) {
        const targetIdx = index + 1;
        const temp = sorted[index];
        sorted[index] = sorted[targetIdx];
        sorted[targetIdx] = temp;
      }
      
      return sorted.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const resetNavMenusToDefault = () => {
    setNavMenuItems(INITIAL_NAV_MENUS);
    showToast(lang === 'hi' ? 'मेन्यू डिफ़ॉल्ट पर रीसेट किए गए' : 'Menus reset to default');
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
        navMenuItems,
        topNavItems,
        bottomNavItems,
        footerNavItems,
        enrolledSeriesIds,
        bookmarkedQuestionIds: bookmarkedIds,
        theme,
        lang,
        isOnline,
        cloudSyncStatus,

        activeView,
        viewParams,
        navigate,
        handleNavAction,
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

        isShareModalOpen,
        shareModalParams,
        openShareModal,
        closeShareModal,

        awardXp,
        redeemXpForCoupon,

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

        saveUser,
        deleteUser,
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
        uploadLogo,
        saveNote,
        deleteNote,
        saveNavMenuItem,
        deleteNavMenuItem,
        toggleNavMenuItemActive,
        reorderNavMenuItem,
        resetNavMenusToDefault,
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
