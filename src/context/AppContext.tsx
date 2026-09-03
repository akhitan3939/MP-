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
  enrolledMap: Record<string, string[]>;
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
  pendingPurchaseSeries: TestSeries | null;
  setPendingPurchaseSeries: (series: TestSeries | null) => void;
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
  login: (identifier: string, password?: string, role?: 'student' | 'admin') => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  register: (user: Omit<UserProfile, 'id' | 'joinedAt' | 'streak' | 'badges'>) => { success: boolean; message: string; user?: UserProfile };
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
  toggleMockSetActive: (seriesId: string, setNumber: number) => void;
  updateSeriesSetsConfig: (seriesId: string, config: { totalTests?: number; disabledSetNumbers?: number[]; activeSetsCount?: number }) => void;
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
  toggleUserAccess: (userId: string, seriesId: string, options?: { reason?: string }) => void;
  setUserEnrolledSeries: (userId: string, seriesIds: string[], reason?: string) => void;
  addUserWithSeries: (userData: Partial<UserProfile>, selectedSeriesIds: string[], reason?: string) => { success: boolean; message: string; user?: UserProfile };
  grantAllSeriesToUser: (userId: string, reason?: string) => void;
  revokeAllSeriesFromUser: (userId: string) => void;
  toggleUserRole: (userId: string) => void;
  toggleUserDummyStatus: (userId: string) => void;
  resetStudentPassword: (userId: string, newPass: string) => void;
  broadcastPushNotification: (title: string, message: string) => void;
  refreshCloudData: () => Promise<void>;
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

  // Helper to parse route from window.location for robust mobile, tablet, laptop & desktop link opening
  const parseCurrentUrlRoute = (): { view: string; params: Record<string, any> } => {
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      
      let view = 'home';
      const params: Record<string, any> = {};

      if (searchParams.get('view')) {
        view = searchParams.get('view')!;
        searchParams.forEach((value, key) => {
          if (key !== 'view') params[key] = value === 'true' ? true : value === 'false' ? false : value;
        });
      } else if (hash) {
        const [hashRoute, hashQuery] = hash.split('?');
        if (hashRoute) {
          view = hashRoute;
        }
        if (hashQuery) {
          const hp = new URLSearchParams(hashQuery);
          hp.forEach((value, key) => {
            params[key] = value === 'true' ? true : value === 'false' ? false : value;
          });
        }
      }

      if (params.isFreeMock40 === 'true' || params.isFreeMock40 === true) params.isFreeMock40 = true;
      if (params.attemptId) params.attemptId = String(params.attemptId);

      return { view: view || 'home', params };
    } catch {
      return { view: 'home', params: {} };
    }
  };

  const initialRoute = parseCurrentUrlRoute();

  // Navigation View & Params
  const [activeView, setActiveView] = useState<string>(initialRoute.view || 'home');
  const [viewParams, setViewParams] = useState<Record<string, any>>(initialRoute.params || {});

  // URL hash / popstate listener for back/forward and cross-device deep links
  useEffect(() => {
    const handleUrlChange = () => {
      const { view, params } = parseCurrentUrlRoute();
      if (view) {
        setActiveView(view);
        setViewParams(params);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin' | 'forgot'>('login');

  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState<boolean>(false);
  const [selectedSeriesForPurchase, setSelectedSeriesForPurchase] = useState<TestSeries | null>(null);
  const [pendingPurchaseSeries, setPendingPurchaseSeries] = useState<TestSeries | null>(null);

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
      refreshCloudData().finally(() => setCloudSyncStatus('synced'));
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

  // Comprehensive Cloud Data Refresh & State Merging
  const refreshCloudData = async (): Promise<void> => {
    try {
      setCloudSyncStatus('syncing');
      const res = await fetch('/api/app-data');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success && data.data) {
        const s = data.data;

        // 1. Merge Users (Server + Local Storage) with deletion blacklist enforcement
        if (Array.isArray(s.users)) {
          const serverDeleted: string[] = Array.isArray(s.deletedUserIds) ? s.deletedUserIds : [];
          const localDeleted: string[] = StorageService.getDeletedUserIds();
          const allDeleted = new Set([...serverDeleted, ...localDeleted]);

          // Keep local deleted list in sync with server
          serverDeleted.forEach(id => StorageService.addDeletedUserId(id));

          setUsers(prev => {
            const userMap = new Map<string, UserProfile>();
            // Load non-deleted server users first (authoritative)
            s.users.forEach((u: UserProfile) => {
              if (u && u.id && !allDeleted.has(u.id)) {
                userMap.set(u.id, u);
              }
            });
            // Keep local non-deleted users that aren't yet on server (exclude initial dummy/seed users that were deleted on server)
            (prev || []).forEach(u => {
              if (u && u.id && !userMap.has(u.id) && !allDeleted.has(u.id)) {
                if (!u.id.startsWith('usr_student_') && u.id !== 'usr_sample_demo_1') {
                  userMap.set(u.id, u);
                }
              }
            });
            const mergedUsers = Array.from(userMap.values());
            StorageService.setUsers(mergedUsers);
            return mergedUsers;
          });

          // If current logged-in user was deleted, log out immediately
          if (currentUserId && allDeleted.has(currentUserId)) {
            setCurrentUserId('');
            StorageService.setCurrentUserId('');
          }
        }

        // 2. Merge Test Attempts
        if (Array.isArray(s.attempts) && s.attempts.length > 0) {
          setAttempts(prev => {
            const attemptMap = new Map<string, TestAttempt>();
            (prev || []).forEach(a => { if (a && a.id) attemptMap.set(a.id, a); });
            s.attempts.forEach((a: TestAttempt) => { if (a && a.id) attemptMap.set(a.id, { ...(attemptMap.get(a.id) || {}), ...a }); });
            const mergedAttempts = Array.from(attemptMap.values()).sort((a, b) => {
              const timeA = new Date(a.completedAt || a.startedAt || 0).getTime();
              const timeB = new Date(b.completedAt || b.startedAt || 0).getTime();
              return timeB - timeA;
            });
            StorageService.setAttempts(mergedAttempts);
            return mergedAttempts;
          });
        }

        // 3. Merge Orders / Grants
        if (Array.isArray(s.orders)) {
          setOrders(prev => {
            const orderMap = new Map<string, OrderTransaction>();
            (prev || []).forEach(o => { if (o && o.id) orderMap.set(o.id, o); });
            s.orders.forEach((o: OrderTransaction) => { if (o && o.id) orderMap.set(o.id, { ...(orderMap.get(o.id) || {}), ...o }); });
            const mergedOrders = Array.from(orderMap.values()).sort((a, b) => {
              const timeA = new Date(a.createdAt || 0).getTime();
              const timeB = new Date(b.createdAt || 0).getTime();
              return timeB - timeA;
            });
            StorageService.setOrders(mergedOrders);
            return mergedOrders;
          });
        }

        // 4. Merge Enrolled Map
        if (s.enrolledMap && typeof s.enrolledMap === 'object') {
          setEnrolledMap(prev => {
            const merged: Record<string, string[]> = { ...prev };
            Object.keys(s.enrolledMap).forEach(uid => {
              const serverList = Array.isArray(s.enrolledMap[uid]) ? s.enrolledMap[uid] : [];
              const localList = merged[uid] || [];
              merged[uid] = Array.from(new Set([...localList, ...serverList]));
            });
            StorageService.setEnrolledMap(merged);
            return merged;
          });
        }

        // 5. Test Series
        if (Array.isArray(s.testSeries) && s.testSeries.length > 0) {
          setTestSeries(s.testSeries);
          StorageService.setTestSeries(s.testSeries);
        }

        // 6. Platform Settings
        if (s.platformSettings && typeof s.platformSettings === 'object' && Object.keys(s.platformSettings).length > 0) {
          setPlatformSettings(prev => {
            const updated = { ...prev, ...s.platformSettings };
            StorageService.setPlatformSettings(updated);
            return updated;
          });
        }

        // 7. Site Banners, Announcements, Coupons, Menus
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
        if (Array.isArray(s.notes) && s.notes.length > 0) {
          setNotes(s.notes);
          StorageService.setNotes(s.notes);
        }
      }
    } catch (err) {
      console.log('App running in offline/local storage fallback:', err);
    } finally {
      setCloudSyncStatus('synced');
    }
  };

  // Load server-persisted state on initial startup & periodically
  useEffect(() => {
    // Initial fetch
    refreshCloudData();

    // Periodic live sync every 15 seconds so admin/students see live registrations & attempts
    const interval = setInterval(() => {
      refreshCloudData();
    }, 15000);

    // Auto-track hit counter (starts at 50 minimum)
    try {
      const hasCountedSession = sessionStorage.getItem('mp_hit_counted_v1');
      if (!hasCountedSession) {
        sessionStorage.setItem('mp_hit_counted_v1', '1');
        const nextLocal = StorageService.incrementHitCounter(1);
        setPlatformSettings(prev => ({
          ...prev,
          visitorHitsCount: Math.max(50, nextLocal)
        }));

        fetch('/api/hit-counter/increment', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data && data.success && typeof data.count === 'number') {
              const serverCount = Math.max(50, data.count);
              StorageService.setHitCounter(serverCount);
              setPlatformSettings(prev => ({
                ...prev,
                visitorHitsCount: serverCount,
                lastUpdatedDateHi: data.lastUpdatedDateHi || prev.lastUpdatedDateHi,
                lastUpdatedDateEn: data.lastUpdatedDateEn || prev.lastUpdatedDateEn
              }));
            }
          })
          .catch(() => {});
      } else {
        fetch('/api/hit-counter')
          .then(res => res.json())
          .then(data => {
            if (data && data.success && typeof data.count === 'number') {
              const serverCount = Math.max(50, data.count);
              StorageService.setHitCounter(serverCount);
              setPlatformSettings(prev => ({
                ...prev,
                visitorHitsCount: serverCount,
                lastUpdatedDateHi: data.lastUpdatedDateHi || prev.lastUpdatedDateHi,
                lastUpdatedDateEn: data.lastUpdatedDateEn || prev.lastUpdatedDateEn,
                showHitCounter: data.showHitCounter !== undefined ? data.showHitCounter : prev.showHitCounter,
                showLastUpdated: data.showLastUpdated !== undefined ? data.showLastUpdated : prev.showLastUpdated
              }));
            }
          })
          .catch(() => {});
      }
    } catch {
      // safe fallback
    }

    return () => clearInterval(interval);
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

    // Update URL hash smoothly for cross-device sharing (Mobile, Tablet, Laptop, Desktop)
    try {
      if (typeof window !== 'undefined' && window.history) {
        const q = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            q.set(k, String(v));
          }
        });
        const qStr = q.toString();
        const newHash = `#${view}${qStr ? `?${qStr}` : ''}`;
        if (window.location.hash !== newHash) {
          window.history.pushState({ view, params }, '', newHash);
        }
      }
    } catch {
      // safe fallback
    }
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

  const login = async (
    identifier: string,
    password?: string,
    role: 'student' | 'admin' = 'student'
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    const rawId = (identifier || '').trim();
    const cleanId = rawId.toLowerCase();
    const phoneDigits = rawId.replace(/\D/g, '').slice(-10);
    const deletedIds = new Set(StorageService.getDeletedUserIds());

    // 1. Try immediate local match
    let found = users.filter(u => u && u.id && !deletedIds.has(u.id)).find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uUsername = (u.username || '').toLowerCase().trim();
      const uPhoneDigits = (u.phone || '').replace(/\D/g, '').slice(-10);

      // Match 10-digit phone
      if (phoneDigits.length === 10 && uPhoneDigits === phoneDigits) return true;
      // Match email
      if (cleanId && uEmail === cleanId) return true;
      // Match username
      if (cleanId && uUsername === cleanId) return true;
      // Match user id
      if (rawId && u.id === rawId) return true;
      return false;
    });

    // Special fallback for admin credentials
    if (!found && role === 'admin' && (cleanId === 'akhitan_3939' || cleanId === 'akhitan3939@mppariksha.in' || cleanId === 'admin')) {
      found = users.find(u => u.role === 'admin');
    }

    // Demo student fallback
    if (!found && role === 'student' && cleanId === 'aspirant') {
      found = users.find(u => u.username === 'aspirant' || u.id === 'usr_sample_demo_1');
    }

    const inputPass = (password || '').trim();

    if (found) {
      if (role === 'admin' && found.role !== 'admin') {
        const msg = lang === 'hi' ? '❌ यह खाता व्यवस्थापक (Admin) नहीं है।' : '❌ Account does not have admin privileges.';
        showToast(msg);
        return { success: false, message: msg };
      }

      const userPass = (found.password || '').trim();
      const isPassCorrect = !inputPass || !userPass || userPass === inputPass || ((inputPass === 'Student@123' || inputPass === 'student123' || inputPass === '123456') && (found.isDummyUser || !found.password));

      if (isPassCorrect) {
        setCurrentUserId(found.id);
        StorageService.setCurrentUserId(found.id);
        closeAuthModal();
        showToast(lang === 'hi' ? `🎉 स्वागत है, ${found.name}!` : `🎉 Welcome, ${found.name}!`);

        if (pendingPurchaseSeries) {
          const targetSeries = pendingPurchaseSeries;
          setPendingPurchaseSeries(null);
          setTimeout(() => {
            openRazorpayModal(targetSeries);
          }, 350);
        }

        // Inform server asynchronously to keep session recorded
        fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: rawId, password: inputPass, role })
        }).catch(() => {});

        return { success: true, message: 'लॉगिन सफल रहा', user: found };
      }
    }

    // 2. If not matched locally or local password failed, query the Server (vital for Incognito / new browsers)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: rawId, password: inputPass, role })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const serverUser: UserProfile = data.user;

        // Save server user to local state and storage
        setUsers(prev => {
          const exists = prev.some(u => u.id === serverUser.id);
          const updated = exists ? prev.map(u => u.id === serverUser.id ? serverUser : u) : [serverUser, ...prev];
          StorageService.setUsers(updated);
          return updated;
        });

        // Set enrolled series from server if provided
        if (Array.isArray(data.enrolledSeries) && data.enrolledSeries.length > 0) {
          setEnrolledMap(prev => {
            const updated = { ...prev, [serverUser.id]: data.enrolledSeries };
            StorageService.setEnrolledMap(updated);
            return updated;
          });
        }

        setCurrentUserId(serverUser.id);
        StorageService.setCurrentUserId(serverUser.id);
        closeAuthModal();
        showToast(lang === 'hi' ? `🎉 स्वागत है, ${serverUser.name}!` : `🎉 Welcome, ${serverUser.name}!`);

        if (pendingPurchaseSeries) {
          const targetSeries = pendingPurchaseSeries;
          setPendingPurchaseSeries(null);
          setTimeout(() => {
            openRazorpayModal(targetSeries);
          }, 350);
        }

        return { success: true, message: data.message || 'लॉगिन सफल', user: serverUser };
      } else {
        const fallbackMsg = lang === 'hi' 
          ? (data.message || '❌ अमान्य मोबाइल नंबर, ईमेल या पासवर्ड।') 
          : (data.message || '❌ Invalid mobile number, email, or password.');
        return { success: false, message: fallbackMsg };
      }
    } catch (err) {
      console.warn('Login network error:', err);
      const errNetMsg = lang === 'hi' 
        ? '❌ सर्वर से संपर्क नहीं हो सका। कृपया अपना नेटवर्क कनेक्शन जांचें।' 
        : '❌ Network error connecting to server. Please check internet connection.';
      return { success: false, message: errNetMsg };
    }
  };

  const register = (data: Omit<UserProfile, 'id' | 'joinedAt' | 'streak' | 'badges'>): { success: boolean; message: string; user?: UserProfile } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = (data.username || '').trim().toLowerCase();
    const cleanPhone = (data.phone || '').trim().replace(/\D/g, '').slice(-10);

    // Check duplicates strictly against active (non-deleted) users
    const deletedIds = new Set(StorageService.getDeletedUserIds());
    const activeUsers = users.filter(u => u && u.id && !deletedIds.has(u.id));

    // Check duplicate phone number
    if (cleanPhone.length >= 10 && activeUsers.some(u => (u.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone)) {
      const msg = lang === 'hi' 
        ? `❌ यह मोबाइल नंबर (+91-${cleanPhone}) पहले से पंजीकृत है! कृपया अपना पासवर्ड डालकर लॉगिन करें अथवा दूसरा नंबर उपयोग करें।` 
        : `❌ Mobile number (+91-${cleanPhone}) is already registered! Please login or use another number.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Check if email already registered
    if (cleanEmail && activeUsers.some(u => (u.email || '').toLowerCase().trim() === cleanEmail)) {
      const msg = lang === 'hi'
        ? `❌ यह ईमेल (${cleanEmail}) पहले से पंजीकृत है! कृपया सीधे लॉगिन करें।`
        : `❌ Email (${cleanEmail}) is already registered! Please login directly.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Check if username already taken
    if (cleanUsername && activeUsers.some(u => (u.username || '').toLowerCase().trim() === cleanUsername)) {
      const msg = lang === 'hi'
        ? `❌ यूज़रनेम '@${cleanUsername}' पहले से लिया जा चुका है। कृपया दूसरा यूज़रनेम चुनें।`
        : `❌ Username '@${cleanUsername}' is already taken. Please choose another username.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    const autoUsername = cleanUsername || (cleanEmail ? cleanEmail.split('@')[0] : `user_${cleanPhone}`);

    const newUser: UserProfile = {
      ...data,
      phone: cleanPhone || data.phone.trim(),
      username: autoUsername,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      joinedAt: new Date().toISOString(),
      streak: 1,
      badges: ['🌟 New Aspirant', '🎯 MP Ready'],
      isDummyUser: false,
      userType: 'authentic'
    };

    // Remove new user ID from deletedUserIds if ever present
    StorageService.removeDeletedUserId(newUser.id);

    setUsers(prev => {
      const updated = [newUser, ...prev.filter(u => u && u.id && !deletedIds.has(u.id))];
      StorageService.setUsers(updated);
      return updated;
    });
    setCurrentUserId(newUser.id);
    StorageService.setCurrentUserId(newUser.id);

    // Immediate server sync to persist registration directly to disk
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(err => console.warn('Registration server sync error:', err));
    
    const successMsg = lang === 'hi' 
      ? `🎉 स्वागत है, ${newUser.name}! आपका पंजीकरण सफल रहा।` 
      : `🎉 Welcome, ${newUser.name}! Registration successful.`;
    showToast(successMsg);

    if (pendingPurchaseSeries) {
      const targetSeries = pendingPurchaseSeries;
      setPendingPurchaseSeries(null);
      setTimeout(() => {
        openRazorpayModal(targetSeries);
      }, 350);
    }

    return { success: true, message: successMsg, user: newUser };
  };

  const resetPassword = (identifier: string, newPassword: string): { success: boolean; message: string; user?: UserProfile } => {
    const cleanId = identifier.trim().toLowerCase();
    
    const phoneDigits = identifier.replace(/\D/g, '').slice(-10);
    const deletedIds = new Set(StorageService.getDeletedUserIds());
    
    const userIndex = users.findIndex(u => {
      if (!u || !u.id || deletedIds.has(u.id)) return false;
      const uPhoneDigits = (u.phone || '').replace(/\D/g, '').slice(-10);
      if (phoneDigits.length === 10 && uPhoneDigits === phoneDigits) return true;
      if (cleanId && (u.email || '').toLowerCase().trim() === cleanId) return true;
      if (cleanId && (u.username || '').toLowerCase().trim() === cleanId) return true;
      return false;
    });

    if (userIndex === -1) {
      const msg = lang === 'hi' 
        ? 'इस ईमेल, यूज़रनेम या मोबाइल नंबर से कोई सक्रिय पंजीकृत खाता नहीं मिला।' 
        : 'No active registered account found with this email, username, or phone number.';
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

    // Sync updated user to server
    fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    }).catch(err => console.warn('Reset password server sync error:', err));

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

    // If user is not logged in, prompt to register/login first
    if (!currentUser) {
      setPendingPurchaseSeries(series);
      openAuthModal('register');
      showToast(
        lang === 'hi' 
          ? `🔐 '${series.titleHi}' अनलॉक करने के लिए कृपया पहले साइन-अप या लॉगिन करें। लॉगिन के बाद पेमेंट विंडो स्वतः खुलेगी।` 
          : `🔐 Please register or login first to unlock '${series.titleEn}'. Payment window will open right after login.`
      );
      return;
    }

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
    const user = currentUser || {
      id: `usr_guest_${Date.now()}`,
      name: 'परीक्षार्थी (Guest Aspirant)',
      email: 'student@mpparikshasetu.in',
      phone: '9893000000',
      role: 'student' as const,
      district: 'भोपाल (Bhopal)',
      state: 'मध्यप्रदेश (MP)'
    };
    const finalAmount = Math.max(0, series.price - discount);
    const gstAmount = +(finalAmount * 0.18).toFixed(2);
    const invoiceNumber = `INV-MPSETU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isDummy = user.isDummyUser === true;
    const utrNumber = `UTR-${paymentMethod}-${new Date().getFullYear()}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder: OrderTransaction = {
      id: `txn_${Date.now()}`,
      orderId: `order_MP_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      razorpayPaymentId: `pay_RZP_MP_${Math.random().toString(36).substring(2, 10)}`,
      utrNumber,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userDistrict: user.district,
      userState: user.state || 'मध्यप्रदेश (MP)',
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
      invoiceNumber,
      isDummyUser: isDummy
    };

    // Update orders list
    setOrders(prev => [newOrder, ...prev]);

    // Enroll user in series
    let updatedEnrolledMap: Record<string, string[]> = {};
    setEnrolledMap(prev => {
      const userList = prev[user.id] || [];
      if (!userList.includes(series.id)) {
        updatedEnrolledMap = { ...prev, [user.id]: [...userList, series.id] };
        return updatedEnrolledMap;
      }
      updatedEnrolledMap = prev;
      return prev;
    });

    // Update series enrolled count
    setTestSeries(prev => prev.map(s => s.id === series.id ? { ...s, enrolledCount: s.enrolledCount + 1 } : s));

    // Immediate server sync for order and enrollment
    fetch('/api/orders/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => console.warn('Order sync error:', err));

    fetch('/api/enrolled-map/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEnrolledMap)
    }).catch(err => console.warn('EnrolledMap sync error:', err));

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

  // Test Attempt Submissions (Instantaneous - 0 lag, highly resilient)
  const submitTestAttempt = async (
    rawAttempt: Omit<TestAttempt, 'id' | 'certificateId' | 'rank' | 'totalParticipants' | 'percentile'>
  ): Promise<TestAttempt> => {
    // 1. Safe user fallback so guest or any student can submit without errors
    const defaultGuestUser: UserProfile = {
      id: 'usr_guest',
      name: 'परीक्षार्थी (Aspirant)',
      email: 'student@mpparikshasetu.in',
      phone: '9893000000',
      role: 'student',
      district: 'भोपाल (Bhopal)',
      state: 'मध्यप्रदेश (MP)',
      streak: 1,
      badges: ['🎯 MP Aspirant', '📝 Mock Tested']
    };

    const user: UserProfile = currentUser || defaultGuestUser;

    const safeScore = Number(rawAttempt.score) || 0;
    const safeTotalMarks = Number(rawAttempt.totalMarks) || 40;
    const safeTotalQuestions = Number(rawAttempt.totalQuestions) || 40;
    const safeDuration = Number(rawAttempt.durationSeconds) || 60;
    const safeCorrect = Number(rawAttempt.correctAnswers) || 0;
    const safeIncorrect = Number(rawAttempt.incorrectAnswers) || 0;
    const safeUnattempted = Number(rawAttempt.unattempted) || Math.max(0, safeTotalQuestions - (safeCorrect + safeIncorrect));

    const totalParticipants = 1250 + (attempts?.length || 0) * 15;
    const scoreRatio = safeTotalMarks > 0 ? Math.max(0, Math.min(1, safeScore / safeTotalMarks)) : 0;
    const rank = Math.max(1, Math.floor((1 - scoreRatio) * totalParticipants) + 1);
    const percentile = +((1 - (rank / totalParticipants)) * 100).toFixed(1);
    const certificateId = `CERT-MPSETU-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const instantAiReport = buildInstantEvaluationReport({
      seriesTitle: rawAttempt.seriesTitle || 'मॉक टेस्ट',
      score: safeScore,
      totalMarks: safeTotalMarks,
      studentName: user.name || 'परीक्षार्थी',
    });

    const newAttempt: TestAttempt = {
      ...rawAttempt,
      id: `att_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: user.id || 'usr_guest',
      userName: user.name || 'परीक्षार्थी',
      userDistrict: user.district || 'भोपाल (Bhopal)',
      score: safeScore,
      totalMarks: safeTotalMarks,
      totalQuestions: safeTotalQuestions,
      correctAnswers: safeCorrect,
      incorrectAnswers: safeIncorrect,
      unattempted: safeUnattempted,
      durationSeconds: safeDuration,
      certificateId,
      rank,
      totalParticipants,
      percentile,
      aiReport: instantAiReport
    };

    // Save to attempts state immediately and sync to StorageService
    setAttempts(prev => {
      const updated = [newAttempt, ...(prev || [])];
      StorageService.setAttempts(updated);
      return updated;
    });

    // Immediate server sync for test attempts to disk
    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAttempt)
    }).catch(err => console.warn('Attempt server sync error:', err));

    // Update Leaderboard if top score
    const newLeaderboardEntry: LeaderboardEntry = {
      rank,
      userId: user.id || 'usr_guest',
      userName: user.name || 'परीक्षार्थी',
      district: user.district || 'भोपाल',
      score: safeScore,
      totalMarks: safeTotalMarks,
      accuracy: rawAttempt.accuracy || Math.round((safeCorrect / Math.max(1, safeCorrect + safeIncorrect)) * 100),
      timeTaken: `${Math.floor(safeDuration / 60)}m ${safeDuration % 60}s`,
      seriesTitle: rawAttempt.seriesTitle,
      seriesId: rawAttempt.seriesId,
      streak: user.streak || 1,
      badge: rank <= 3 ? '🏆 Top 3 All-MP' : rank <= 10 ? '⭐ Top 10 Aspirant' : '🎯 Qualifier',
      date: new Date().toISOString().split('T')[0]
    };

    setLeaderboard(prev => {
      const filtered = (prev || []).filter(p => !(p.userId === user.id && p.seriesId === rawAttempt.seriesId));
      const updated = [...filtered, newLeaderboardEntry].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
      const ranked = updated.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      StorageService.setLeaderboard(ranked);
      return ranked;
    });

    // Update streak for student
    if (user.id && user.id !== 'usr_guest') {
      setUsers(prev => {
        const updated = (prev || []).map(u => u.id === user.id ? { 
          ...u, 
          streak: (u.streak || 0) + 1 
        } : u);
        StorageService.setUsers(updated);
        return updated;
      });
    }

    // Non-blocking background AI enhancement (does not block immediate result display)
    try {
      fetch('/api/ai/evaluate-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesTitle: rawAttempt.seriesTitle,
          score: safeScore,
          totalMarks: safeTotalMarks,
          durationSeconds: safeDuration,
          sectionScores: rawAttempt.sectionScores,
          studentName: user.name,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.report) {
            setAttempts(prev => {
              const updated = (prev || []).map(a => a.id === newAttempt.id ? { ...a, aiReport: data.report } : a);
              StorageService.setAttempts(updated);
              return updated;
            });
          }
        })
        .catch(e => {
          console.warn('Background AI evaluation note:', e);
        });
    } catch {
      // safe fallback
    }

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

    fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).catch(err => console.warn('User update sync warning:', err));

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

    const targetPhone = (target.phone || '').replace(/\D/g, '').slice(-10);
    const targetEmail = (target.email || '').trim().toLowerCase();

    // 1. Blacklist user ID in local storage so cloud sync never resurrects it
    StorageService.addDeletedUserId(userId);

    // 2. If the active session belongs to this user, log out immediately
    if (currentUserId === userId) {
      setCurrentUserId('');
      StorageService.setCurrentUserId('');
    }

    // 3. Remove user from local users state (and any matching phone/email duplicate)
    setUsers(prev => {
      const updated = prev.filter(u => {
        if (u.id === userId) return false;
        if (targetPhone.length === 10 && (u.phone || '').replace(/\D/g, '').slice(-10) === targetPhone) return false;
        if (targetEmail && (u.email || '').trim().toLowerCase() === targetEmail) return false;
        return true;
      });
      StorageService.setUsers(updated);
      return updated;
    });

    // 4. Remove enrolled series mapping for this user
    setEnrolledMap(prev => {
      const updated = { ...prev };
      delete updated[userId];
      StorageService.setEnrolledMap(updated);
      return updated;
    });

    // 5. Delete on server and persist to server disk
    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(data => {
        console.log(`[MP Setu] User ${userId} successfully removed on server:`, data);
      })
      .catch(err => console.warn('User delete sync warning:', err));

    const successMsg = lang === 'hi' ? `🗑️ यूज़र '${target.name}' को सफलतापूर्वक पोर्टल से स्थायी रूप से हटा दिया गया है।` : `🗑️ User '${target.name}' permanently deleted.`;
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
    
    fetch(`/api/test-series/${seriesId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.testSeries)) {
          setTestSeries(data.testSeries);
          StorageService.setTestSeries(data.testSeries);
        }
      })
      .catch(e => console.warn('Server sync error for test-series deletion:', e));

    showToast(lang === 'hi' ? '🗑️ टेस्ट सीरीज़ सफलतापूर्वक हटाई गई' : '🗑️ Test series deleted successfully');
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
    }).then(res => res.json()).then(data => {
      if (data && data.success && Array.isArray(data.testSeries)) {
        setTestSeries(data.testSeries);
        StorageService.setTestSeries(data.testSeries);
      }
    }).catch(e => console.warn('Server sync error for toggle active:', e));

    showToast(
      lang === 'hi' 
        ? (newStatus ? '🟢 परीक्षा सक्रिय कर दी गई है (होमपेज पर दृश्यमान)' : '🔴 परीक्षा निष्क्रिय कर दी गई है (होमपेज से छिपी हुई)') 
        : (newStatus ? '🟢 Exam marked ACTIVE (Visible on Homepage)' : '🔴 Exam marked INACTIVE (Hidden from Homepage)')
    );
  };

  const toggleMockSetActive = (seriesId: string, setNumber: number) => {
    let willBeActive = true;
    let updatedDisabled: number[] = [];
    setTestSeries(prev => {
      const updated = prev.map(s => {
        if (s.id === seriesId) {
          const currentDisabled = Array.isArray(s.disabledSetNumbers) ? [...s.disabledSetNumbers] : [];
          if (currentDisabled.includes(setNumber)) {
            updatedDisabled = currentDisabled.filter(n => n !== setNumber);
            willBeActive = true;
          } else {
            updatedDisabled = [...currentDisabled, setNumber];
            willBeActive = false;
          }
          const totalPossible = s.id === 'ts_patwari_2026' || s.id === 'ts_agri_ext_2026' ? 20 : (s.totalTests || 20);
          const activeCount = Math.max(0, totalPossible - updatedDisabled.length);
          return {
            ...s,
            totalTests: totalPossible,
            disabledSetNumbers: updatedDisabled,
            activeSetsCount: activeCount
          };
        }
        return s;
      });
      StorageService.setTestSeries(updated);
      return updated;
    });

    fetch('/api/test-series/toggle-set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesId, setNumber, isActive: willBeActive })
    }).then(res => res.json()).then(data => {
      if (data && data.success && Array.isArray(data.testSeries)) {
        setTestSeries(data.testSeries);
        StorageService.setTestSeries(data.testSeries);
      }
    }).catch(e => console.warn('Server sync error for toggle set:', e));

    showToast(
      lang === 'hi'
        ? (willBeActive ? `🟢 सेट #${setNumber} सक्रिय किया गया (छात्रों को दिखेगा)` : `🔴 सेट #${setNumber} निष्क्रिय किया गया (छात्रों से छिपा हुआ)`)
        : (willBeActive ? `🟢 Set #${setNumber} ACTIVE (Visible to students)` : `🔴 Set #${setNumber} INACTIVE (Hidden from students)`)
    );
  };

  const updateSeriesSetsConfig = (seriesId: string, config: { totalTests?: number; disabledSetNumbers?: number[]; activeSetsCount?: number }) => {
    setTestSeries(prev => {
      const updated = prev.map(s => {
        if (s.id === seriesId) {
          const totalTests = typeof config.totalTests === 'number' ? config.totalTests : s.totalTests;
          const disabledSetNumbers = Array.isArray(config.disabledSetNumbers) ? config.disabledSetNumbers : (s.disabledSetNumbers || []);
          const activeSetsCount = typeof config.activeSetsCount === 'number' ? config.activeSetsCount : Math.max(0, (totalTests || 20) - disabledSetNumbers.length);
          return {
            ...s,
            totalTests,
            disabledSetNumbers,
            activeSetsCount
          };
        }
        return s;
      });
      StorageService.setTestSeries(updated);
      return updated;
    });

    fetch('/api/test-series/save-sets-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesId, ...config })
    }).then(res => res.json()).then(data => {
      if (data && data.success && Array.isArray(data.testSeries)) {
        setTestSeries(data.testSeries);
        StorageService.setTestSeries(data.testSeries);
      }
    }).catch(e => console.warn('Server sync error for save sets config:', e));

    showToast(lang === 'hi' ? 'सेट्स विन्यास अपडेट किया गया' : 'Sets configuration updated');
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
    const cleanSettings = {
      ...settings,
      visitorHitsCount: typeof settings.visitorHitsCount === 'number' ? Math.max(50, settings.visitorHitsCount) : 50
    };
    setPlatformSettings(cleanSettings);
    StorageService.setPlatformSettings(cleanSettings);
    if (cleanSettings.visitorHitsCount) {
      StorageService.setHitCounter(cleanSettings.visitorHitsCount);
    }
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanSettings)
    }).catch(e => console.warn('Server sync error for settings:', e));

    fetch('/api/hit-counter/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        count: cleanSettings.visitorHitsCount,
        lastUpdatedDateHi: cleanSettings.lastUpdatedDateHi,
        lastUpdatedDateEn: cleanSettings.lastUpdatedDateEn,
        showHitCounter: cleanSettings.showHitCounter,
        showLastUpdated: cleanSettings.showLastUpdated
      })
    }).catch(e => console.warn('Server hit counter update error:', e));

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

  const toggleUserAccess = (userId: string, seriesId: string, options?: { reason?: string }) => {
    const targetUser = users.find(u => u.id === userId);
    const targetSeries = testSeries.find(s => s.id === seriesId);
    const studentName = targetUser?.name || 'छात्र';
    const seriesTitle = targetSeries ? (lang === 'hi' ? targetSeries.titleHi : targetSeries.titleEn) : 'टेस्ट सीरीज़';

    let updatedEnrolledMap: Record<string, string[]> = {};
    let willBeEnrolled = false;
    setEnrolledMap(prev => {
      const list = prev[userId] || [];
      const has = list.includes(seriesId);
      if (has) {
        willBeEnrolled = false;
        updatedEnrolledMap = { ...prev, [userId]: list.filter(id => id !== seriesId) };
      } else {
        willBeEnrolled = true;
        updatedEnrolledMap = { ...prev, [userId]: [...list, seriesId] };
      }
      return updatedEnrolledMap;
    });

    fetch('/api/enrolled-map/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEnrolledMap)
    }).catch(err => console.warn('Enrolled sync error:', err));

    if (willBeEnrolled) {
      // Create ₹0 Admin Free Grant Transaction for records & audit
      if (targetUser && targetSeries) {
        const grantOrder: OrderTransaction = {
          id: `txn_grant_${Date.now()}`,
          orderId: `order_FREE_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          razorpayPaymentId: 'FREE_ADMIN_SCHOLARSHIP_GRANT',
          userId: targetUser.id,
          userName: targetUser.name,
          userEmail: targetUser.email,
          userPhone: targetUser.phone,
          seriesId: targetSeries.id,
          seriesTitle: lang === 'hi' ? targetSeries.titleHi : targetSeries.titleEn,
          amount: targetSeries.price || 0,
          discount: targetSeries.price || 0,
          gstAmount: 0,
          finalAmount: 0,
          paymentMethod: 'UPI',
          status: 'SUCCESS',
          couponCode: options?.reason || 'ADMIN_FREE_GRANT',
          createdAt: new Date().toISOString(),
          invoiceNumber: `INV-GRANT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        };
        setOrders(prev => [grantOrder, ...prev.filter(o => !(o.userId === userId && o.seriesId === seriesId && o.finalAmount === 0))]);
        fetch('/api/orders/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(grantOrder)
        }).catch(err => console.warn('Grant order sync error:', err));
      }
      showToast(
        lang === 'hi' 
          ? `🎁 ${studentName} को '${seriesTitle}' मुफ़्त (₹0 Free Access) में प्रदान कर दी गई!` 
          : `🎁 '${seriesTitle}' granted FREE to ${studentName}!`
      );
    } else {
      showToast(
        lang === 'hi' 
          ? `🔒 ${studentName} से '${seriesTitle}' का मुफ़्त एक्सेस वापस लिया गया।` 
          : `🔒 Revoked free access of '${seriesTitle}' from ${studentName}.`
      );
    }
  };

  const setUserEnrolledSeries = (userId: string, seriesIds: string[], reason?: string) => {
    const targetUser = users.find(u => u.id === userId);
    const studentName = targetUser?.name || 'छात्र';

    let updatedEnrolledMap: Record<string, string[]> = {};
    setEnrolledMap(prev => {
      if (seriesIds.length === 0) {
        const copy = { ...prev };
        delete copy[userId];
        updatedEnrolledMap = copy;
        return copy;
      }
      updatedEnrolledMap = { ...prev, [userId]: seriesIds };
      return updatedEnrolledMap;
    });

    fetch('/api/enrolled-map/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEnrolledMap)
    }).catch(err => console.warn('Enrolled sync error:', err));

    // Audit and record free grant transaction for each assigned series
    if (targetUser && seriesIds.length > 0) {
      const grantOrders: OrderTransaction[] = seriesIds.map(sid => {
        const s = testSeries.find(item => item.id === sid);
        return {
          id: `txn_grant_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          orderId: `order_GRANT_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          razorpayPaymentId: 'FREE_ADMIN_SCHOLARSHIP_GRANT',
          userId: targetUser.id,
          userName: targetUser.name,
          userEmail: targetUser.email,
          userPhone: targetUser.phone,
          userDistrict: targetUser.district,
          userState: targetUser.state,
          seriesId: sid,
          seriesTitle: s ? (lang === 'hi' ? s.titleHi : s.titleEn) : sid,
          amount: s?.price || 0,
          discount: s?.price || 0,
          gstAmount: 0,
          finalAmount: 0,
          paymentMethod: 'UPI',
          status: 'SUCCESS',
          couponCode: reason || 'ADMIN_CHECKBOX_GRANT',
          createdAt: new Date().toISOString(),
          invoiceNumber: `INV-GRANT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          isDummyUser: targetUser.isDummyUser === true
        };
      });

      setOrders(prev => {
        const filtered = prev.filter(o => !(o.userId === userId && o.finalAmount === 0));
        return [...grantOrders, ...filtered];
      });

      grantOrders.forEach(go => {
        fetch('/api/orders/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(go)
        }).catch(err => console.warn('Grant order sync error:', err));
      });
    }

    showToast(
      lang === 'hi' 
        ? `✅ ${studentName} के लिए ${seriesIds.length} टेस्ट सीरीज़ चेकबॉक्स द्वारा सुरक्षित कर दी गईं!` 
        : `✅ ${seriesIds.length} Test series access set for ${studentName}!`
    );
  };

  const addUserWithSeries = (userData: Partial<UserProfile>, selectedSeriesIds: string[], reason?: string): { success: boolean; message: string; user?: UserProfile } => {
    const cleanPhone = (userData.phone || '').replace(/\D/g, '').slice(-10);
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    if (!userData.name || userData.name.trim().length === 0) {
      const msg = lang === 'hi' ? '❌ कृपया छात्र का नाम दर्ज करें।' : '❌ Please enter student name.';
      showToast(msg);
      return { success: false, message: msg };
    }

    if (cleanPhone.length < 10) {
      const msg = lang === 'hi' ? '❌ कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।' : '❌ Please enter valid 10-digit phone number.';
      showToast(msg);
      return { success: false, message: msg };
    }

    const deletedIds = new Set(StorageService.getDeletedUserIds());
    const activeUsers = users.filter(u => u && u.id && !deletedIds.has(u.id));

    // CHECK IF THIS PHONE ALREADY BELONGS TO AN ACTIVE USER:
    const existingUser = activeUsers.find(u => (u.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone);

    if (existingUser) {
      // User-friendly update: Update existing user's details & assign test series!
      const updatedUser: UserProfile = {
        ...existingUser,
        name: userData.name?.trim() || existingUser.name,
        password: userData.password?.trim() || existingUser.password || 'Student@123',
        district: userData.district || existingUser.district,
        state: userData.state || existingUser.state,
        targetExam: userData.targetExam || existingUser.targetExam,
        role: userData.role || existingUser.role,
        isDummyUser: userData.isDummyUser !== undefined ? userData.isDummyUser : existingUser.isDummyUser,
        userType: userData.isDummyUser ? 'dummy' : 'authentic',
        customTag: userData.customTag || reason || existingUser.customTag,
        grantReason: reason || userData.grantReason || existingUser.grantReason
      };

      setUsers(prev => {
        const updated = prev.map(u => u.id === existingUser.id ? updatedUser : u);
        StorageService.setUsers(updated);
        return updated;
      });

      // Sync updated user to server
      fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(e => console.warn('User update sync error:', e));

      // Assign selected series
      if (selectedSeriesIds.length > 0) {
        setUserEnrolledSeries(existingUser.id, selectedSeriesIds, reason || 'ADMIN_USER_UPDATE_GRANT');
      }

      const msg = lang === 'hi'
        ? `✅ छात्र '${updatedUser.name}' (+91-${cleanPhone}) पहले से पंजीकृत था — विवरण व पासवर्ड अपडेट कर दिया गया और चयनित ${selectedSeriesIds.length} टेस्ट सीरीज़ असाइन कर दी गईं!`
        : `✅ User '${updatedUser.name}' (+91-${cleanPhone}) profile and password updated, ${selectedSeriesIds.length} series assigned!`;

      showToast(msg);
      return { success: true, message: msg, user: updatedUser };
    }

    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser: UserProfile = {
      id: newId,
      name: userData.name.trim(),
      username: userData.username?.trim() || `usr_${cleanPhone}`,
      email: cleanEmail || `${cleanPhone}@mpparikshasetu.in`,
      phone: cleanPhone,
      password: userData.password?.trim() || 'Student@123',
      role: userData.role || 'student',
      district: userData.district || 'भोपाल (Bhopal)',
      state: userData.state || 'मध्यप्रदेश (MP)',
      targetExam: userData.targetExam || 'MP पटवारी 2026',
      streak: typeof userData.streak === 'number' ? userData.streak : 1,
      badges: ['🌱 New Aspirant', '🎁 Direct Admin Enrolled'],
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isDummyUser: userData.isDummyUser === true,
      userType: (userData.isDummyUser === true ? 'dummy' : 'authentic') as 'dummy' | 'authentic',
      customTag: userData.customTag || reason || undefined,
      grantReason: reason || userData.grantReason || undefined,
      tagColor: userData.tagColor || 'amber'
    };

    // Remove newId from deleted list if present
    StorageService.removeDeletedUserId(newId);

    // 1. Save user to state & storage
    setUsers(prev => {
      const updated = [newUser, ...prev.filter(u => u.id !== newId)];
      StorageService.setUsers(updated);
      return updated;
    });

    // 2. Sync to server
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(e => console.warn('User register sync error:', e));

    // 3. Assign selected test series via checkboxes
    if (selectedSeriesIds.length > 0) {
      setUserEnrolledSeries(newUser.id, selectedSeriesIds, reason || 'ADMIN_NEW_USER_GRANT');
    }

    const successMsg = lang === 'hi'
      ? `🎉 छात्र '${newUser.name}' को सफलतापूर्वक जोड़ा गया और ${selectedSeriesIds.length} टेस्ट सीरीज़ चेकबॉक्स द्वारा तुरंत असाइन कर दी गईं!`
      : `🎉 User '${newUser.name}' added with ${selectedSeriesIds.length} test series granted!`;

    showToast(successMsg);
    return { success: true, message: successMsg, user: newUser };
  };

  const grantAllSeriesToUser = (userId: string, reason?: string) => {
    const targetUser = users.find(u => u.id === userId);
    const studentName = targetUser?.name || 'छात्र';
    const allActiveSeriesIds = testSeries.filter(s => s.isActive !== false).map(s => s.id);

    let updatedEnrolledMap: Record<string, string[]> = {};
    setEnrolledMap(prev => {
      const existing = prev[userId] || [];
      const combined = Array.from(new Set([...existing, ...allActiveSeriesIds]));
      updatedEnrolledMap = { ...prev, [userId]: combined };
      return updatedEnrolledMap;
    });

    fetch('/api/enrolled-map/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEnrolledMap)
    }).catch(err => console.warn('Enrolled sync error:', err));

    // Create VIP Free Grant record
    if (targetUser) {
      const vipOrder: OrderTransaction = {
        id: `txn_grant_vip_${Date.now()}`,
        orderId: `order_VIP_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        razorpayPaymentId: 'VIP_ALL_ACCESS_GRANT',
        userId: targetUser.id,
        userName: targetUser.name,
        userEmail: targetUser.email,
        userPhone: targetUser.phone,
        seriesId: 'all_series_vip',
        seriesTitle: lang === 'hi' ? 'सभी टेस्ट सीरीज़ (VIP ऑल-एक्सेस पास)' : 'All Test Series (VIP All-Access Pass)',
        amount: 0,
        discount: 0,
        gstAmount: 0,
        finalAmount: 0,
        paymentMethod: 'UPI',
        status: 'SUCCESS',
        couponCode: reason || 'VIP_SCHOLARSHIP_ALL_PASS',
        createdAt: new Date().toISOString(),
        invoiceNumber: `INV-VIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setOrders(prev => [vipOrder, ...prev]);
      fetch('/api/orders/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vipOrder)
      }).catch(err => console.warn('VIP order sync error:', err));
    }

    showToast(
      lang === 'hi' 
        ? `🌟 बधाई! ${studentName} को पोर्टल की सभी टेस्ट सीरीज़ का VIP ऑल-एक्सेस मुफ़्त में मिल गया!` 
        : `🌟 VIP All-Access granted FREE to ${studentName}!`
    );
  };

  const revokeAllSeriesFromUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    const studentName = targetUser?.name || 'छात्र';

    let updatedEnrolledMap: Record<string, string[]> = {};
    setEnrolledMap(prev => {
      const copy = { ...prev };
      delete copy[userId];
      updatedEnrolledMap = copy;
      return copy;
    });

    fetch('/api/enrolled-map/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEnrolledMap)
    }).catch(err => console.warn('Enrolled sync error:', err));

    showToast(
      lang === 'hi' 
        ? `🔒 ${studentName} के सभी टेस्ट सीरीज़ एक्सेस रीसेट (हटाए) कर दिए गए।` 
        : `🔒 All granted series revoked for ${studentName}.`
    );
  };

  const toggleUserRole = (userId: string) => {
    let targetUpdated: UserProfile | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'student' : 'admin';
        targetUpdated = { ...u, role: nextRole };
        return targetUpdated;
      }
      return u;
    }));
    if (targetUpdated) {
      fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetUpdated)
      }).catch(err => console.warn('User update sync error:', err));
    }
    showToast(lang === 'hi' ? 'उपयोगकर्ता रोल अपडेट किया गया' : 'User role updated');
  };

  const toggleUserDummyStatus = (userId: string) => {
    let targetUpdated: UserProfile | undefined;
    let nextIsDummy = false;
    setUsers(prev => {
      const updated = prev.map(u => {
        if (u.id === userId) {
          nextIsDummy = !(u.isDummyUser === true);
          targetUpdated = {
            ...u,
            isDummyUser: nextIsDummy,
            userType: (nextIsDummy ? 'dummy' : 'authentic') as 'dummy' | 'authentic'
          };
          return targetUpdated;
        }
        return u;
      });
      StorageService.setUsers(updated);
      return updated;
    });

    // Update related orders in state & storage
    setOrders(prev => {
      const updatedOrders = prev.map(o => {
        if (o.userId === userId) {
          return { ...o, isDummyUser: nextIsDummy };
        }
        return o;
      });
      StorageService.setOrders(updatedOrders);
      return updatedOrders;
    });

    if (targetUpdated) {
      fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetUpdated)
      }).catch(err => console.warn('User dummy update sync error:', err));
    }

    showToast(
      nextIsDummy
        ? (lang === 'hi' ? '🧪 छात्र को "Dummy User (डमी खाता)" के रूप में चिह्नित किया गया।' : '🧪 Marked as Dummy User.')
        : (lang === 'hi' ? '🟢 छात्र को "Valid User (सत्यापित वास्तविक छात्र)" के रूप में टैग किया गया।' : '🟢 Tagged as Valid Authentic User.')
    );
  };

  const resetStudentPassword = (userId: string, newPass: string) => {
    let targetUpdated: UserProfile | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        targetUpdated = { ...u, password: newPass };
        return targetUpdated;
      }
      return u;
    }));
    if (targetUpdated) {
      fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetUpdated)
      }).catch(err => console.warn('User pass update sync error:', err));
    }
    showToast(lang === 'hi' ? 'पासवर्ड सफलतापूर्वक रीसेट हुआ' : 'Password reset successfully');
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
        enrolledMap,
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
        pendingPurchaseSeries,
        setPendingPurchaseSeries,
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
        toggleMockSetActive,
        updateSeriesSetsConfig,
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
        setUserEnrolledSeries,
        addUserWithSeries,
        grantAllSeriesToUser,
        revokeAllSeriesFromUser,
        toggleUserRole,
        toggleUserDummyStatus,
        resetStudentPassword,
        broadcastPushNotification,
        refreshCloudData
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
