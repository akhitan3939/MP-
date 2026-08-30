import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard,
  Image as ImageIcon,
  BookPlus,
  Target,
  FileQuestion,
  Users,
  CreditCard,
  Ticket,
  BellRing,
  Send,
  FileText,
  Settings,
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  RotateCcw,
  Download,
  Printer,
  Eye,
  Lock,
  Unlock,
  Sliders,
  Check,
  ExternalLink,
  Sparkles,
  TrendingUp,
  IndianRupee,
  Layers,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Key,
  Award,
  ChevronRight,
  Menu,
  X as CloseIcon,
  RefreshCw,
  Clock,
  CheckSquare,
  FileSpreadsheet,
  BarChart3,
  Navigation,
  Compass,
  ArrowUp,
  ArrowDown,
  Globe,
  SlidersHorizontal,
  Bookmark,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Share2,
  Gift
} from 'lucide-react';
import { 
  TestSeries, 
  Question, 
  Announcement, 
  Coupon, 
  UserProfile, 
  SiteBanner, 
  PlatformSettings, 
  OfflineNote, 
  MockSetMetadata,
  NavigationMenuItem,
  MenuPlacement,
  MenuTargetType,
  WebsiteContentConfig,
  SocialChannelConfig
} from '../types';
import { INITIAL_WEBSITE_CONTENT, INITIAL_SOCIAL_CHANNELS } from '../utils/storage';
import { exportToCsv, exportToXls, exportToPdfPrint, ExportColumn } from '../utils/exportReports';
import { DynamicNavIcon, NAV_ICON_MAP, NavIconKey } from '../utils/navIcons';

type AdminModuleTab = 
  | 'OVERVIEW'
  | 'WEBSITE_CONTENT'
  | 'REPORTS'
  | 'MENUS'
  | 'SOCIAL'
  | 'BANNERS'
  | 'SERIES'
  | 'MOCK_SETS'
  | 'QUESTIONS'
  | 'STUDENTS'
  | 'ORDERS'
  | 'COUPONS'
  | 'ANNOUNCEMENTS'
  | 'BROADCAST'
  | 'NOTES'
  | 'SETTINGS';

export const AdminDashboardView: React.FC = () => {
  const { 
    orders, 
    testSeries, 
    questions, 
    users, 
    announcements, 
    coupons, 
    siteBanners,
    platformSettings,
    notes,
    navMenuItems,
    topNavItems,
    bottomNavItems,
    footerNavItems,
    saveNavMenuItem,
    deleteNavMenuItem,
    toggleNavMenuItemActive,
    reorderNavMenuItem,
    resetNavMenusToDefault,
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
    refundOrder, 
    toggleUserAccess, 
    toggleUserRole,
    resetStudentPassword,
    grantStudentXp,
    broadcastPushNotification, 
    enrolledSeriesIds, 
    lang, 
    showToast,
    navigate
  } = useApp();

  // Active Admin Navigation Tab (All buttons on LEFT side)
  const [activeTab, setActiveTab] = useState<AdminModuleTab>('OVERVIEW');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Search States
  const [searchOrders, setSearchOrders] = useState('');
  const [searchStudents, setSearchStudents] = useState('');
  const [searchQuestions, setSearchQuestions] = useState('');
  const [searchMenus, setSearchMenus] = useState('');
  const [menuPlacementFilter, setMenuPlacementFilter] = useState<'all' | 'top' | 'footer' | 'bottom' | 'both'>('all');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Edit / Modal States
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<NavigationMenuItem> | null>(null);
  const [editingBanner, setEditingBanner] = useState<Partial<SiteBanner> | null>(null);
  const [editingSeries, setEditingSeries] = useState<Partial<TestSeries> | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [editingNote, setEditingNote] = useState<Partial<OfflineNote> | null>(null);
  const [editingSettings, setEditingSettings] = useState<PlatformSettings>({ ...platformSettings });
  
  React.useEffect(() => {
    setEditingSettings({ ...platformSettings });
  }, [platformSettings]);

  // Logo file upload handler
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ फ़ाइल साइज़ 5MB से कम होना चाहिए');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setEditingSettings(prev => ({ ...prev, logoUrl: base64 }));
      const res = await uploadLogo(base64);
      if (res && res.logoUrl) {
        setEditingSettings(prev => ({ ...prev, logoUrl: res.logoUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // CMS Sub-navigation tab
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'spotlight' | 'catalog_pillars' | 'footer' | 'social'>('hero');

  // Website Content Updater helper
  const updateWebsiteContent = (field: keyof WebsiteContentConfig, value: any) => {
    setEditingSettings(prev => ({
      ...prev,
      websiteContent: {
        ...(prev.websiteContent || {}),
        [field]: value
      }
    }));
  };

  // Social Channel Updater helper
  const updateSocialChannel = (index: number, updatedChannel: Partial<SocialChannelConfig>) => {
    setEditingSettings(prev => {
      const channels = [...(prev.socialChannels || [])];
      if (channels[index]) {
        channels[index] = { ...channels[index], ...updatedChannel };
      }
      return {
        ...prev,
        socialChannels: channels
      };
    });
  };

  // Reset Website Content to Default
  const handleResetWebsiteContent = () => {
    if (window.confirm('क्या आप वेबसाइट के समस्त टेक्स्ट व कंटेंट को मूल डिफ़ॉल्ट रूप में रीसेट करना चाहते हैं?')) {
      setEditingSettings(prev => ({
        ...prev,
        websiteContent: { ...INITIAL_WEBSITE_CONTENT }
      }));
      showToast('🔄 वेबसाइट कंटेंट डिफ़ॉल्ट रूप में रीसेट हो गया। सहेजने हेतु नीचे दिए बटन पर क्लिक करें।');
    }
  };

  // Reset Social Channels to Default
  const handleResetSocialChannels = () => {
    if (window.confirm('क्या आप समस्त सोशल मीडिया लिंक्स व विवरण को मूल डिफ़ॉल्ट रूप में रीसेट करना चाहते हैं?')) {
      setEditingSettings(prev => ({
        ...prev,
        socialChannels: [...INITIAL_SOCIAL_CHANNELS]
      }));
      showToast('🔄 सोशल मीडिया चैनल्स डिफ़ॉल्ट रूप में रीसेट हो गए। सहेजने हेतु नीचे दिए बटन पर क्लिक करें।');
    }
  };

  const [passwordModalUser, setPasswordModalUser] = useState<UserProfile | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('123456');

  // Bonus XP Modal
  const [xpModalUser, setXpModalUser] = useState<UserProfile | null>(null);
  const [bonusXpVal, setBonusXpVal] = useState<number>(500);

  // Push Broadcast
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  // 1. Sales & Metric Calculations
  const successfulOrders = orders.filter(o => o.status === 'SUCCESS');
  const totalRevenue = successfulOrders.reduce((sum, o) => sum + o.finalAmount, 0);
  const totalGstCollected = successfulOrders.reduce((sum, o) => sum + o.gstAmount, 0);
  const totalDiscountsGiven = successfulOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const refundCount = orders.filter(o => o.status === 'REFUNDED').length;
  const aov = successfulOrders.length > 0 ? Math.round(totalRevenue / successfulOrders.length) : 0;

  // Preset Thumbnail & Banner library for quick 1-click selection
  const IMAGE_PRESETS = [
    { name: 'म.प्र. पटवारी 2026 (Modern Tech)', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80' },
    { name: 'MPPSC सिविल सेवा (Library Books)', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80' },
    { name: 'MP पुलिस सब-इंस्पेक्टर (Uniform Batch)', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80' },
    { name: 'म.प्र. वनरक्षक / जेल प्रहरी (Forest Theme)', url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=1200&auto=format&fit=crop&q=80' },
    { name: 'MP ESB व्यापम ग्रुप-4 (Classroom)', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80' },
    { name: 'MP शिक्षक पात्रता परीक्षा TET (Books & Chalk)', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80' },
  ];

  // Handler: Save Menu Item
  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem?.labelHi) {
      showToast('⚠️ मेन्यू का नाम (Hindi Label) दर्ज करना अनिवार्य है');
      return;
    }

    const newItem: NavigationMenuItem = {
      id: editingMenuItem.id || `menu_${Date.now()}`,
      labelHi: editingMenuItem.labelHi || '',
      labelEn: editingMenuItem.labelEn || editingMenuItem.labelHi || '',
      iconName: (editingMenuItem.iconName as NavIconKey) || 'Compass',
      placement: editingMenuItem.placement || 'top',
      targetType: editingMenuItem.targetType || 'view',
      targetValue: editingMenuItem.targetValue || 'home',
      externalUrl: editingMenuItem.externalUrl || '',
      badgeTextHi: editingMenuItem.badgeTextHi || '',
      badgeTextEn: editingMenuItem.badgeTextEn || '',
      highlight: editingMenuItem.highlight ?? false,
      isActive: editingMenuItem.isActive ?? true,
      order: Number(editingMenuItem.order || (navMenuItems.length + 1))
    };

    saveNavMenuItem(newItem);
    setEditingMenuItem(null);
  };

  // Handler: Save Banner
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.titleHi || !editingBanner?.imageUrl) {
      showToast('⚠️ कृपया बैनर का शीर्षक व इमेज URL दर्ज करें');
      return;
    }

    const newBanner: SiteBanner = {
      id: editingBanner.id || `ban_${Date.now()}`,
      titleHi: editingBanner.titleHi || '',
      titleEn: editingBanner.titleEn || editingBanner.titleHi,
      subtitleHi: editingBanner.subtitleHi || '',
      subtitleEn: editingBanner.subtitleEn || editingBanner.subtitleHi,
      imageUrl: editingBanner.imageUrl || '',
      badgeText: editingBanner.badgeText || '💥 विशेष घोषणा',
      buttonTextHi: editingBanner.buttonTextHi || 'अभी देखें',
      buttonTextEn: editingBanner.buttonTextEn || 'View Now',
      targetView: editingBanner.targetView || 'catalog',
      targetId: editingBanner.targetId || '',
      isActive: editingBanner.isActive ?? true,
      order: Number(editingBanner.order || (siteBanners.length + 1))
    };

    saveSiteBanner(newBanner);
    setEditingBanner(null);
  };

  // Handler: Save Series (Including Thumbnail & Banner URL)
  const handleSaveSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeries?.titleHi || !editingSeries?.price) {
      showToast('⚠️ शीर्षक एवं मूल्य अनिवार्य हैं');
      return;
    }

    const newSeries: TestSeries = {
      id: editingSeries.id || `ts_custom_${Date.now()}`,
      titleHi: editingSeries.titleHi || '',
      titleEn: editingSeries.titleEn || editingSeries.titleHi,
      category: editingSeries.category || 'patwari',
      department: editingSeries.department || 'Govt of MP',
      departmentHi: editingSeries.departmentHi || 'म.प्र. शासन',
      price: Number(editingSeries.price),
      originalPrice: Number(editingSeries.originalPrice || editingSeries.price * 2),
      totalTests: Number(editingSeries.totalTests || 20),
      durationMinutes: Number(editingSeries.durationMinutes || 180),
      totalMarks: Number(editingSeries.totalMarks || 200),
      totalQuestions: Number(editingSeries.totalQuestions || 200),
      negativeMarking: Number(editingSeries.negativeMarking || 0),
      isActive: editingSeries.isActive ?? true,
      isFreeDemoAvailable: editingSeries.isFreeDemoAvailable ?? true,
      freeTestsCount: Number(editingSeries.freeTestsCount || 1),
      isFeatured: editingSeries.isFeatured ?? true,
      rating: Number(editingSeries.rating || 4.9),
      enrolledCount: Number(editingSeries.enrolledCount || 0),
      pdfNotesCount: Number(editingSeries.pdfNotesCount || 15),
      thumbnailUrl: editingSeries.thumbnailUrl || IMAGE_PRESETS[0].url,
      bannerUrl: editingSeries.bannerUrl || IMAGE_PRESETS[0].url,
      badgeTagHi: editingSeries.badgeTagHi || '🔥 म.प्र. नंबर-1 टेस्ट सीरीज़',
      badgeTagEn: editingSeries.badgeTagEn || 'Top Choice',
      descriptionHi: editingSeries.descriptionHi || 'मध्यप्रदेश शासन द्वारा आयोजित परीक्षा के 100% नवीनतम पाठ्यक्रम पर आधारित संपूर्ण टेस्ट सीरीज़।',
      descriptionEn: editingSeries.descriptionEn || 'Full syllabus test series strictly aligned with latest commission exam standards.',
      featuresHi: editingSeries.featuresHi || ['20 फुल मॉक सेट्स (200 Qs)', 'AI व्यक्तिगत व्याख्या', 'ऑल-एमपी लाइव मेरिट रैंक', 'हस्तलिखित ई-नोट्स PDF'],
      featuresEn: editingSeries.featuresEn || ['20 Full Mock Sets', 'AI Analysis', 'All-MP Live Merit', 'Handwritten PDF Notes'],
      syllabus: editingSeries.syllabus || [
        { section: 'MP General Knowledge', sectionHi: 'म.प्र. सामान्य ज्ञान', questionsCount: 25, marks: 25 },
        { section: 'General Hindi', sectionHi: 'सामान्य हिन्दी', questionsCount: 25, marks: 25 },
        { section: 'General Mathematics', sectionHi: 'सामान्य गणित', questionsCount: 25, marks: 25 },
        { section: 'General English', sectionHi: 'सामान्य अंग्रेजी', questionsCount: 25, marks: 25 },
        { section: 'Computer Science', sectionHi: 'कंप्यूटर विज्ञान', questionsCount: 25, marks: 25 },
        { section: 'General Management', sectionHi: 'सामान्य प्रबंधन', questionsCount: 25, marks: 25 },
        { section: 'General Science', sectionHi: 'सामान्य विज्ञान', questionsCount: 25, marks: 25 },
        { section: 'General Reasoning', sectionHi: 'सामान्य तार्किक योग्यता', questionsCount: 25, marks: 25 }
      ]
    };

    saveTestSeries(newSeries);
    setEditingSeries(null);
  };

  // Handler: Save Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.questionHi || editingQuestion.correctOption === undefined) {
      showToast('⚠️ प्रश्न का हिंदी पाठ एवं सही विकल्प चुनना अनिवार्य है');
      return;
    }

    const optHi = editingQuestion.optionsHi || ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D'];
    const optEn = editingQuestion.optionsEn || ['Option A', 'Option B', 'Option C', 'Option D'];

    const newQ: Question = {
      id: editingQuestion.id || `q_custom_${Date.now()}`,
      seriesId: editingQuestion.seriesId || testSeries[0]?.id || 'ts_patwari_2026',
      section: editingQuestion.section || 'General Studies',
      subject: editingQuestion.subject || 'म.प्र. सामान्य ज्ञान',
      topic: editingQuestion.topic || 'General Topic',
      difficulty: editingQuestion.difficulty || 'medium',
      questionHi: editingQuestion.questionHi || '',
      questionEn: editingQuestion.questionEn || editingQuestion.questionHi,
      imageUrl: editingQuestion.imageUrl ? editingQuestion.imageUrl.trim() : undefined,
      imageCaption: editingQuestion.imageCaption ? editingQuestion.imageCaption.trim() : undefined,
      options: optHi.map((text, i) => ({
        id: `opt_${i}`,
        textHi: text,
        textEn: optEn[i] || text
      })),
      optionsHi: optHi,
      optionsEn: optEn,
      correctOptionIndex: Number(editingQuestion.correctOption),
      correctOption: Number(editingQuestion.correctOption),
      explanationHi: editingQuestion.explanationHi || 'विस्तृत व्याख्या उपलब्ध है।',
      explanationEn: editingQuestion.explanationEn || 'Detailed solution available.',
      marks: Number(editingQuestion.marks || 1),
      negativeMarks: Number(editingQuestion.negativeMarks || 0)
    };

    saveQuestion(newQ);
    setEditingQuestion(null);
  };

  // Handler: Save Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement?.titleHi) return;

    const newAnn: Announcement = {
      id: editingAnnouncement.id || `ann_${Date.now()}`,
      titleHi: editingAnnouncement.titleHi || '',
      titleEn: editingAnnouncement.titleEn || editingAnnouncement.titleHi,
      tag: editingAnnouncement.tag || 'VACANCY',
      linkTextHi: editingAnnouncement.linkTextHi || 'अभी देखें',
      linkTextEn: editingAnnouncement.linkTextEn || 'View Now',
      isPinned: editingAnnouncement.isPinned ?? true,
      publishedAt: new Date().toISOString()
    };

    saveAnnouncement(newAnn);
    setEditingAnnouncement(null);
  };

  // Handler: Save Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code || !editingCoupon?.discountValue) return;

    const newC: Coupon = {
      code: (editingCoupon.code || '').toUpperCase().trim(),
      discountType: editingCoupon.discountType || 'flat',
      discountValue: Number(editingCoupon.discountValue),
      minAmount: Number(editingCoupon.minAmount || 199),
      validTill: editingCoupon.validTill || '2026-12-31',
      isActive: editingCoupon.isActive ?? true
    };

    saveCoupon(newC);
    setEditingCoupon(null);
  };

  // Handler: Save Note / PDF
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote?.titleHi) return;

    const newNote: OfflineNote = {
      id: editingNote.id || `note_${Date.now()}`,
      titleHi: editingNote.titleHi || '',
      titleEn: editingNote.titleEn || editingNote.titleHi,
      category: editingNote.category || 'मध्यप्रदेश सामान्य ज्ञान',
      fileSize: editingNote.fileSize || '3.5 MB',
      pages: Number(editingNote.pages || 24),
      downloadCount: Number(editingNote.downloadCount || 120),
      summaryHi: editingNote.summaryHi || 'एमपी परीक्षा हेतु महत्वपूर्ण हस्तलिखित नोट्स।',
      summaryEn: editingNote.summaryEn || 'Handwritten study material for MP exams.',
      sampleContentHi: editingNote.sampleContentHi || 'महत्वपूर्ण तथ्य, नदियाँ, जलप्रपात, खनिज व इतिहास।'
    };

    saveNote(newNote);
    setEditingNote(null);
  };

  // Broadcast push message
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    broadcastPushNotification(broadcastTitle, broadcastMsg);
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  const uDateFormatted = (user: UserProfile) => {
    const raw = user.joinedAt || user.createdAt;
    if (!raw) return 'N/A';
    try {
      return new Date(raw).toLocaleDateString('hi-IN');
    } catch {
      return 'N/A';
    }
  };

  // Export Sales CSV
  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Payment ID,Candidate,Email,Phone,Series,Amount,Discount,Final,Status,Date"]
      .concat(orders.map(o => `${o.orderId},${o.razorpayPaymentId},${o.userName},${o.userEmail},${o.userPhone},"${o.seriesTitle}",${o.amount},${o.discount},${o.finalAmount},${o.status},${o.createdAt}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MP_Pariksha_Setu_Sales_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 सेल्स रिपोर्ट CSV डाउनलोड हो गई।');
  };

  // Generic export dispatcher for Students
  const handleExportUsers = (format: 'xls' | 'csv' | 'pdf') => {
    const data = users.map(u => ({
      'छात्र ID': u.id,
      'नाम': u.name,
      'ईमेल': u.email,
      'मोबाइल': u.phone,
      'राज्य (State)': u.state || 'मध्यप्रदेश (MP)',
      'गृह जिला (District)': u.district,
      'लक्ष्य परीक्षा': u.targetExam,
      'रोल': u.role === 'admin' ? 'प्रशासक (Admin)' : 'छात्र (Student)',
      'XP अंक': u.xp || 0,
      'लगातार दिन (Streak)': u.streak || 0,
      'पंजीकरण दिनांक': new Date(u.joinedAt || u.createdAt || Date.now()).toLocaleDateString('hi-IN')
    }));
    const dateStr = new Date().toISOString().split('T')[0];
    if (format === 'xls') {
      exportToXls(data, `MP_Pariksha_Setu_Users_${dateStr}`);
      showToast('📊 छात्र डेटा Excel (.xls) में डाउनलोड हो गया।');
    } else if (format === 'csv') {
      exportToCsv(data, `MP_Pariksha_Setu_Users_${dateStr}`);
      showToast('📄 छात्र डेटा CSV में डाउनलोड हो गया।');
    } else {
      exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु — समस्त पंजीकृत छात्र मास्टर रिपोर्ट', data);
    }
  };

  // Generic export dispatcher for Orders
  const handleExportOrders = (format: 'xls' | 'csv' | 'pdf') => {
    const data = orders.map(o => ({
      'ऑर्डर ID': o.orderId,
      'इनवॉइस नंबर': o.invoiceNumber,
      'रेज़रपे Payment ID': o.razorpayPaymentId,
      'परीक्षार्थी नाम': o.userName,
      'ईमेल': o.userEmail,
      'मोबाइल': o.userPhone,
      'सीरीज़ पैकेज': o.seriesTitle,
      'मूल राशि (₹)': o.amount,
      'छूट (₹)': o.discount || 0,
      'GST राशि (₹)': o.gstAmount,
      'अंतिम भुगतान (₹)': o.finalAmount,
      'स्थिति': o.status,
      'दिनांक': new Date(o.createdAt).toLocaleString('hi-IN')
    }));
    const dateStr = new Date().toISOString().split('T')[0];
    if (format === 'xls') {
      exportToXls(data, `MP_Pariksha_Setu_Orders_${dateStr}`);
      showToast('📊 ऑर्डर्स रिपोर्ट Excel (.xls) में डाउनलोड हो गई।');
    } else if (format === 'csv') {
      exportToCsv(data, `MP_Pariksha_Setu_Orders_${dateStr}`);
      showToast('📄 ऑर्डर्स रिपोर्ट CSV में डाउनलोड हो गया।');
    } else {
      exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु — रेज़रपे ऑर्डर्स व लेन-देन रिपोर्ट', data);
    }
  };

  // Generic export dispatcher for Questions
  const handleExportQuestions = (format: 'xls' | 'csv' | 'pdf') => {
    const data = questions.map(q => ({
      'ID': q.id,
      'विषय (Subject)': q.subject,
      'अनुभाग (Section)': q.section,
      'टॉपिक': q.topic,
      'प्रश्न (हिन्दी)': q.questionHi,
      'विकल्प A': q.optionsHi?.[0] || '',
      'विकल्प B': q.optionsHi?.[1] || '',
      'विकल्प C': q.optionsHi?.[2] || '',
      'विकल्प D': q.optionsHi?.[3] || '',
      'सही विकल्प इंडेक्स': q.correctOption,
      'व्याख्या': q.explanationHi || ''
    }));
    const dateStr = new Date().toISOString().split('T')[0];
    if (format === 'xls') {
      exportToXls(data, `MP_Pariksha_Setu_Questions_${dateStr}`);
      showToast('📊 प्रश्न बैंक Excel (.xls) में डाउनलोड हो गया।');
    } else if (format === 'csv') {
      exportToCsv(data, `MP_Pariksha_Setu_Questions_${dateStr}`);
      showToast('📄 प्रश्न बैंक CSV में डाउनलोड हो गया।');
    } else {
      exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु — प्रश्न बैंक मास्टर ऑडिट रिपोर्ट', data);
    }
  };

  // Generic export dispatcher for Series
  const handleExportSeries = (format: 'xls' | 'csv' | 'pdf') => {
    const data = testSeries.map(ts => ({
      'सीरीज़ ID': ts.id,
      'शीर्षक (हिन्दी)': ts.titleHi,
      'श्रेणी (Category)': ts.category,
      'मूल्य (₹)': ts.price,
      'एमआरपी (₹)': ts.originalPrice,
      'कुल टेस्ट्स': ts.totalTests,
      'डेमो उपलब्ध': ts.isFreeDemoAvailable ? 'हाँ' : 'नहीं'
    }));
    const dateStr = new Date().toISOString().split('T')[0];
    if (format === 'xls') {
      exportToXls(data, `MP_Pariksha_Setu_Series_${dateStr}`);
      showToast('📊 टेस्ट सीरीज़ कैटलॉग Excel (.xls) में डाउनलोड हो गया।');
    } else if (format === 'csv') {
      exportToCsv(data, `MP_Pariksha_Setu_Series_${dateStr}`);
      showToast('📄 टेस्ट सीरीज़ कैटलॉग CSV में डाउनलोड हो गया।');
    } else {
      exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु — टेस्ट सीरीज़ कैटलॉग एवं मूल्य रिपोर्ट', data);
    }
  };

  // Navigation Items for the LEFT SIDEBAR
  const SIDEBAR_NAV_ITEMS: { id: AdminModuleTab; label: string; subLabel: string; icon: React.FC<any>; count?: number; badgeColor?: string }[] = [
    { id: 'OVERVIEW', label: 'डैशबोर्ड व राजस्व', subLabel: 'GMV & Key Metrics', icon: LayoutDashboard },
    { id: 'WEBSITE_CONTENT', label: 'वेबसाइट कंटेंट CMS (समस्त टेक्स्ट)', subLabel: 'Hero, Pillars, Footer, Banners', icon: Globe, badgeColor: 'bg-emerald-600' },
    { id: 'MENUS', label: 'शीर्ष व निचला मेन्यू प्रबंधक', subLabel: 'Top & Bottom Navigation', icon: Compass, count: navMenuItems.length, badgeColor: 'bg-amber-600' },
    { id: 'SOCIAL', label: 'सोशल मीडिया लिंक्स CMS', subLabel: 'FB, Insta, TG, YT, WA', icon: Share2, badgeColor: 'bg-rose-600' },
    { id: 'REPORTS', label: 'रिपोर्ट्स व डेटा एक्सपोर्ट', subLabel: 'XLS, PDF, CSV Reports', icon: FileSpreadsheet, count: users.length + orders.length, badgeColor: 'bg-emerald-600' },
    { id: 'BANNERS', label: 'बैनर व थंबनेल प्रबंधक', subLabel: 'Hero Banners & Posters', icon: ImageIcon, count: siteBanners.length, badgeColor: 'bg-indigo-600' },
    { id: 'SERIES', label: 'टेस्ट सीरीज़ व पैकेज', subLabel: 'Packages & Pricing', icon: BookPlus, count: testSeries.length, badgeColor: 'bg-[#7A2A1E]' },
    { id: 'MOCK_SETS', label: '20 मॉक सेट्स CMS', subLabel: 'Sets 1-20 Controller', icon: Target, count: 20, badgeColor: 'bg-emerald-700' },
    { id: 'QUESTIONS', label: 'प्रश्न बैंक CMS', subLabel: 'Questions & Solutions', icon: FileQuestion, count: questions.length, badgeColor: 'bg-amber-600' },
    { id: 'STUDENTS', label: 'छात्र व एक्सेस नियंत्रण', subLabel: 'Students & Role Access', icon: Users, count: users.length, badgeColor: 'bg-blue-600' },
    { id: 'ORDERS', label: 'रेज़रपे ऑर्डर्स व लेन-देन', subLabel: 'Transactions & Refunds', icon: CreditCard, count: orders.length, badgeColor: 'bg-teal-600' },
    { id: 'COUPONS', label: 'कूपन व डिस्काउंट कोड्स', subLabel: 'Promo Codes & Offers', icon: Ticket, count: coupons.length, badgeColor: 'bg-purple-600' },
    { id: 'ANNOUNCEMENTS', label: 'भर्ती टिकर व सूचनाएँ', subLabel: 'News & Vacancy Alerts', icon: BellRing, count: announcements.length, badgeColor: 'bg-rose-600' },
    { id: 'BROADCAST', label: 'लाइव पुश ब्रॉडकास्ट', subLabel: 'Instant Student Alerts', icon: Send },
    { id: 'NOTES', label: 'ई-नोट्स व पीडीएफ CMS', subLabel: 'Handwritten PDF Material', icon: FileText, count: notes.length, badgeColor: 'bg-cyan-700' },
    { id: 'SETTINGS', label: 'प्लेटफ़ॉर्म सेटिंग्स', subLabel: 'Site Branding & Gateway', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950 text-[#2D2424] dark:text-stone-100">
      
      {/* Mobile Top Bar to toggle Sidebar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#7A2A1E] text-white border-b-2 border-[#D4A017] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-[#D4A017]" />
          <span className="font-black text-sm tracking-wide">सुपर एडमिन कंसोल</span>
        </div>
        <button
          onClick={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
          className="p-2 rounded-xl bg-[#5E1F16] border border-[#D4A017]/50 text-[#D4A017] hover:bg-[#963E2F]"
        >
          {isSidebarMobileOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Container with LEFT SIDEBAR & RIGHT CONTENT */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: ALL ADMIN BUTTONS & MODULES DOCKED HERE */}
        {/* ========================================================= */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-stone-900 border-r-2 lg:border-2 border-[#EAD8B1] dark:border-stone-800 lg:rounded-3xl p-4 lg:p-5 shadow-2xl lg:shadow-md flex flex-col justify-between transition-transform duration-300
          lg:static lg:w-80 lg:translate-x-0 lg:h-fit lg:sticky lg:top-6
          ${isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-4">
            
            {/* Admin Profile & Root Header */}
            <div className="p-4 rounded-2xl bg-[#7A2A1E] text-white border-2 border-[#D4A017] border-b-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D4A017] flex items-center justify-center text-black font-black shadow">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm text-white leading-tight">सुपर एडमिनिस्ट्रेटर</h2>
                    <span className="text-[10px] text-[#EAD8B1] font-mono font-bold tracking-wide">
                      ALL MP ROOTS ACCESS
                    </span>
                  </div>
                </div>
                {/* Mobile close button */}
                <button
                  onClick={() => setIsSidebarMobileOpen(false)}
                  className="lg:hidden p-1.5 text-stone-300 hover:text-white"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px]">
                <span className="text-[#EAD8B1]">कुल बिक्री राजस्व:</span>
                <span className="font-mono font-black text-emerald-300">₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* Navigation Header */}
            <div className="px-2 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <span>प्रबंधन मॉड्यूल (Left Menu)</span>
              <span className="text-[10px] font-mono text-[#7A2A1E] dark:text-[#D4A017]">{SIDEBAR_NAV_ITEMS.length} टूल्स</span>
            </div>

            {/* Sidebar Buttons List */}
            <nav className="space-y-1.5 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {SIDEBAR_NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all border-2 ${
                      isActive 
                        ? 'bg-[#7A2A1E] text-white border-[#D4A017] border-b-4 border-r-4 shadow-md translate-x-1' 
                        : 'bg-[#FDFBF7] dark:bg-stone-800/60 border-[#EAD8B1] dark:border-stone-800 text-[#2D2424] dark:text-stone-200 hover:border-[#7A2A1E] dark:hover:border-[#D4A017] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isActive 
                          ? 'bg-[#D4A017] text-black shadow-xs' 
                          : 'bg-white dark:bg-stone-700 text-[#7A2A1E] dark:text-[#D4A017] border border-[#EAD8B1] dark:border-stone-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-black leading-snug truncate">{item.label}</div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-[#EAD8B1]' : 'text-stone-400'}`}>
                          {item.subLabel}
                        </div>
                      </div>
                    </div>

                    {item.count !== undefined && (
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        isActive ? 'bg-[#D4A017] text-black' : (item.badgeColor || 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200')
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions at Bottom of Sidebar */}
          <div className="pt-4 border-t border-[#EAD8B1] dark:border-stone-800 space-y-2">
            <button
              onClick={handleExportCsv}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs border border-emerald-500"
            >
              <Download className="w-3.5 h-3.5" />
              <span>सेल्स रिपोर्ट CSV डाउनलोड</span>
            </button>
            <button
              onClick={() => navigate('cbtExam', { seriesId: 'ts_patwari_2026', setNumber: 1 })}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white text-[11px] font-bold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>छात्र CBT टेस्ट पोर्टल खोलें</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN CONTENT AREA: DYNAMICALLY SWITCHED BY LEFT TABS */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* Top Banner Header */}
          <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7A2A1E]/10 dark:bg-[#D4A017]/20 text-[#7A2A1E] dark:text-[#D4A017] text-[11px] font-black uppercase tracking-wider">
                  सक्रिय मॉड्यूल: {SIDEBAR_NAV_ITEMS.find(i => i.id === activeTab)?.label}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs font-mono text-stone-500">Live Database Synced</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2D2424] dark:text-white mt-1">
                {activeTab === 'OVERVIEW' && '📊 समग्र विश्लेषण व राजस्व मेट्रिक्स'}
                {activeTab === 'MENUS' && '🧭 शीर्ष व निचला नेविगेशन मेन्यू प्रबंधक (Header & Footer / Mobile CMS)'}
                {activeTab === 'REPORTS' && '📑 विस्तृत रिपोर्ट्स व डेटा एक्सपोर्ट (XLS / PDF / CSV)'}
                {activeTab === 'BANNERS' && '🖼️ होमपेज बैनर, पोस्टर्स व थंबनेल प्रबंधक (CMS)'}
                {activeTab === 'SERIES' && '📚 टेस्ट सीरीज़, पैकेज व पाठ्यक्रम नियंत्रण'}
                {activeTab === 'MOCK_SETS' && '🎯 20 फुल मॉक सेट्स प्रबंधक (Set 1–20)'}
                {activeTab === 'QUESTIONS' && '📝 प्रश्न बैंक CMS (द्विभाषी प्रश्न व व्याख्या)'}
                {activeTab === 'STUDENTS' && '👥 छात्र विवरण, रोल स्विच व एक्सेस नियंत्रण'}
                {activeTab === 'ORDERS' && '💳 रेज़रपे ऑर्डर्स, जीएसटी व रिफंड प्रबंधन'}
                {activeTab === 'COUPONS' && '🏷️ डिस्काउंट कूपन्स व प्रोमो कोड्स'}
                {activeTab === 'ANNOUNCEMENTS' && '📢 भर्ती अधिसूचनाएँ व फ्लैश टिकर'}
                {activeTab === 'BROADCAST' && '🔔 समस्त छात्रों को लाइव पुश नोटिफिकेशन'}
                {activeTab === 'NOTES' && '📄 हस्तलिखित नोट्स व पीडीएफ सामग्री CMS'}
                {activeTab === 'SETTINGS' && '⚙️ प्लेटफ़ॉर्म सेटिंग्स, हेल्पडेस्क व पेमेंट गेटवे'}
              </h2>
            </div>

            {/* Quick Action Button for current tab */}
            <div className="flex items-center gap-2">
              {activeTab === 'MENUS' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resetNavMenusToDefault()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-bold transition"
                    title="डिफ़ॉल्ट मेन्यू रीसेट करें"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">रीसेट डिफ़ॉल्ट</span>
                  </button>
                  <button
                    onClick={() => setEditingMenuItem({
                      labelHi: '',
                      labelEn: '',
                      iconName: 'Compass',
                      placement: 'top',
                      targetType: 'view',
                      targetValue: 'freeMockTest',
                      externalUrl: '',
                      badgeTextHi: '',
                      badgeTextEn: '',
                      highlight: false,
                      isActive: true,
                      order: navMenuItems.length + 1
                    })}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>नया मेन्यू जोड़ें</span>
                  </button>
                </div>
              )}

              {activeTab === 'BANNERS' && (
                <button
                  onClick={() => setEditingBanner({
                    titleHi: '',
                    titleEn: '',
                    subtitleHi: '',
                    subtitleEn: '',
                    imageUrl: IMAGE_PRESETS[0].url,
                    badgeText: '🔥 विशेष ऑफर',
                    buttonTextHi: 'अभी देखें',
                    buttonTextEn: 'View Now',
                    targetView: 'cbtExam',
                    targetId: 'ts_patwari_2026',
                    isActive: true,
                    order: siteBanners.length + 1
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया बैनर जोड़ें</span>
                </button>
              )}

              {activeTab === 'SERIES' && (
                <button
                  onClick={() => setEditingSeries({
                    titleHi: '',
                    titleEn: '',
                    category: 'patwari',
                    price: 199,
                    originalPrice: 499,
                    totalTests: 20,
                    thumbnailUrl: IMAGE_PRESETS[0].url,
                    bannerUrl: IMAGE_PRESETS[0].url,
                    isFreeDemoAvailable: true,
                    freeTestsCount: 1
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>नई टेस्ट सीरीज़ बनाएँ</span>
                </button>
              )}

              {activeTab === 'QUESTIONS' && (
                <button
                  onClick={() => setEditingQuestion({
                    seriesId: testSeries[0]?.id || 'ts_patwari_2026',
                    section: 'MP General Knowledge',
                    subject: 'म.प्र. सामान्य ज्ञान',
                    topic: 'मध्यप्रदेश इतिहास व भूगोल',
                    questionHi: '',
                    questionEn: '',
                    optionsHi: ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D'],
                    optionsEn: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctOption: 0,
                    explanationHi: '',
                    marks: 1,
                    negativeMarks: 0
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया प्रश्न जोड़ें</span>
                </button>
              )}

              {activeTab === 'COUPONS' && (
                <button
                  onClick={() => setEditingCoupon({
                    code: 'MP2026',
                    discountType: 'flat',
                    discountValue: 50,
                    minAmount: 199,
                    validTill: '2026-12-31',
                    isActive: true
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया कूपन कोड बनाएँ</span>
                </button>
              )}

              {activeTab === 'ANNOUNCEMENTS' && (
                <button
                  onClick={() => setEditingAnnouncement({
                    titleHi: '',
                    titleEn: '',
                    tag: 'VACANCY',
                    linkTextHi: 'आधिकारिक सूचना देखें',
                    linkTextEn: 'View Notification',
                    isPinned: true
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>नई भर्ती सूचना जोड़ें</span>
                </button>
              )}

              {activeTab === 'NOTES' && (
                <button
                  onClick={() => setEditingNote({
                    titleHi: '',
                    titleEn: '',
                    category: 'मध्यप्रदेश सामान्य ज्ञान',
                    fileSize: '4.2 MB',
                    pages: 32,
                    summaryHi: '',
                    sampleContentHi: ''
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया ई-नोट / PDF जोड़ें</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & GMV ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 border-b-4 border-r-4 border-[#7A2A1E] rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-black tracking-wider text-stone-500">सकल बिक्री (Gross GMV)</span>
                  <div className="font-mono font-black text-3xl text-emerald-700 dark:text-emerald-400 mt-1">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 font-bold">{successfulOrders.length} सफल भुगतान</div>
                </div>

                <div className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 border-b-4 border-r-4 border-indigo-700 rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-black tracking-wider text-stone-500">कुल पंजीकृत छात्र</span>
                  <div className="font-mono font-black text-3xl text-indigo-700 dark:text-indigo-400 mt-1">
                    {users.length}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 font-bold">55 म.प्र. जिलों से सक्रिय</div>
                </div>

                <div className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 border-b-4 border-r-4 border-amber-600 rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-black tracking-wider text-stone-500">प्रश्न बैंक क्षमता</span>
                  <div className="font-mono font-black text-3xl text-amber-600 dark:text-amber-400 mt-1">
                    {questions.length}+
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 font-bold">8 विषयों में द्विभाषी हल</div>
                </div>

                <div className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 border-b-4 border-r-4 border-teal-700 rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-black tracking-wider text-stone-500">औसत ऑर्डर मूल्य (AOV)</span>
                  <div className="font-mono font-black text-3xl text-teal-700 dark:text-teal-400 mt-1">
                    ₹{aov}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 font-bold">₹{totalDiscountsGiven} कूपन छूट दी गई</div>
                </div>
              </div>

              {/* Quick Jump Modules */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-black text-[#2D2424] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4A017]" />
                  <span>त्वरित नियंत्रण केंद्र (Quick Access Hub)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('BANNERS')}
                    className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-stone-800/80 border-2 border-[#EAD8B1] hover:border-[#7A2A1E] text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <ImageIcon className="w-6 h-6 text-indigo-600" />
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="font-black text-sm mt-2">बैनर व थंबनेल बदलें</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">होमपेज कैरोसेल व पैकेज पोस्टर्स CMS</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('MOCK_SETS')}
                    className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-stone-800/80 border-2 border-[#EAD8B1] hover:border-[#7A2A1E] text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <Target className="w-6 h-6 text-emerald-600" />
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="font-black text-sm mt-2">20 मॉक सेट्स मैनेज करें</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Set #1 डेमो व Set #2-20 लॉकिंग</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('STUDENTS')}
                    className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-stone-800/80 border-2 border-[#EAD8B1] hover:border-[#7A2A1E] text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <Users className="w-6 h-6 text-blue-600" />
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="font-black text-sm mt-2">छात्र एक्सेस व रोल बदलें</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">1-क्लिक टेस्ट अनलॉक व पासवर्ड रीसेट</div>
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base">हाल के सफल रेज़रपे ट्रांजेक्शन (Recent Purchases)</h3>
                  <button
                    onClick={() => setActiveTab('ORDERS')}
                    className="text-xs font-black text-[#7A2A1E] dark:text-[#D4A017] hover:underline"
                  >
                    सभी {orders.length} ऑर्डर देखें →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-500 uppercase text-[10px] font-black">
                        <th className="py-2.5 px-3">ऑर्डर ID</th>
                        <th className="py-2.5 px-3">परीक्षार्थी</th>
                        <th className="py-2.5 px-3">टेस्ट सीरीज़</th>
                        <th className="py-2.5 px-3">राशि</th>
                        <th className="py-2.5 px-3">स्थिति</th>
                        <th className="py-2.5 px-3">दिनांक</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#7A2A1E] dark:text-[#D4A017]">{o.orderId}</td>
                          <td className="py-2.5 px-3 font-bold">{o.userName} ({o.userPhone})</td>
                          <td className="py-2.5 px-3">{o.seriesTitle}</td>
                          <td className="py-2.5 px-3 font-mono font-black text-emerald-600">₹{o.finalAmount}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              o.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-400 font-mono text-[11px]">
                            {new Date(o.createdAt).toLocaleDateString('hi-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: TOP & BOTTOM NAVIGATION MENUS CMS */}
          {/* ========================================================= */}
          {activeTab === 'MENUS' && (
            <div className="space-y-6">
              
              {/* Top Banner with Stats */}
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-stone-900 border-2 border-amber-300 dark:border-amber-800/60 rounded-3xl space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-950 dark:text-amber-300 font-black text-base">
                      <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      <span>शीर्ष व निचला नेविगेशन मेन्यू प्रबंधक (Top & Bottom Menu CMS)</span>
                    </div>
                    <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed max-w-3xl">
                      यहाँ से आप वेबसाइट के <strong>शीर्ष हेडर मेन्यू (Top Menu)</strong> एवं मोबाइल के <strong>निचले बॉटम मेन्यू / फुटर (Bottom Menu)</strong> में नए लिंक जोड़ सकते हैं, क्रम (order) बदल सकते हैं, और सीधे किसी भी व्यू, कैटेगरी, पीडीएफ नोट्स या एक्सटर्नल लिंक से जोड़ सकते हैं।
                    </p>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="px-3.5 py-2 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-amber-800 text-center shadow-xs">
                      <span className="text-[10px] uppercase font-black text-stone-400 block">कुल मेन्यू</span>
                      <span className="font-mono font-black text-base text-amber-700 dark:text-amber-400">{navMenuItems.length}</span>
                    </div>
                    <div className="px-3.5 py-2 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-amber-800 text-center shadow-xs">
                      <span className="text-[10px] uppercase font-black text-stone-400 block">🔝 शीर्ष हेडर</span>
                      <span className="font-mono font-black text-base text-amber-800 dark:text-amber-300">{topNavItems.length}</span>
                    </div>
                    <div className="px-3.5 py-2 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-amber-800 text-center shadow-xs">
                      <span className="text-[10px] uppercase font-black text-stone-400 block">🔻 फुटर मेन्यू</span>
                      <span className="font-mono font-black text-base text-emerald-800 dark:text-emerald-300">{footerNavItems.length}</span>
                    </div>
                    <div className="px-3.5 py-2 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-amber-800 text-center shadow-xs">
                      <span className="text-[10px] uppercase font-black text-stone-400 block">📱 निचला मोबाइल</span>
                      <span className="font-mono font-black text-base text-indigo-700 dark:text-indigo-400">{bottomNavItems.length}</span>
                    </div>
                  </div>
                </div>

                {/* Placement Filter Pills & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-200/80 dark:border-stone-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setMenuPlacementFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        menuPlacementFilter === 'all'
                          ? 'bg-[#7A2A1E] text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      सभी मेन्यू ({navMenuItems.length})
                    </button>
                    <button
                      onClick={() => setMenuPlacementFilter('top')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        menuPlacementFilter === 'top'
                          ? 'bg-[#7A2A1E] text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      🔝 शीर्ष हेडर ({navMenuItems.filter(m => m.placement === 'top' || m.placement === 'both' || m.placement === 'all').length})
                    </button>
                    <button
                      onClick={() => setMenuPlacementFilter('footer')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        menuPlacementFilter === 'footer'
                          ? 'bg-[#7A2A1E] text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      🔻 फुटर मेन्यू ({navMenuItems.filter(m => m.placement === 'footer' || m.placement === 'both' || m.placement === 'bottom' || m.placement === 'all').length})
                    </button>
                    <button
                      onClick={() => setMenuPlacementFilter('bottom')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        menuPlacementFilter === 'bottom'
                          ? 'bg-[#7A2A1E] text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      📱 मोबाइल बॉटम बार ({navMenuItems.filter(m => m.placement === 'bottom' || m.placement === 'all').length})
                    </button>
                    <button
                      onClick={() => setMenuPlacementFilter('both')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        menuPlacementFilter === 'both'
                          ? 'bg-[#7A2A1E] text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      ✨ हेडर + फुटर ({navMenuItems.filter(m => m.placement === 'both' || m.placement === 'all').length})
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="मेन्यू या लक्ष्य खोजें..."
                      value={searchMenus}
                      onChange={(e) => setSearchMenus(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:ring-1 focus:ring-[#7A2A1E]"
                    />
                  </div>
                </div>
              </div>

              {/* Menu Items Interactive List */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2 font-black text-sm text-[#2D2424] dark:text-white">
                    <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                    <span>मेन्यू सूची एवं क्रम नियंत्रण ({
                      navMenuItems.filter(m => {
                        const matchSearch = m.labelHi.toLowerCase().includes(searchMenus.toLowerCase()) ||
                          (m.labelEn || '').toLowerCase().includes(searchMenus.toLowerCase()) ||
                          m.targetValue.toLowerCase().includes(searchMenus.toLowerCase());
                        const matchPlace = menuPlacementFilter === 'all' 
                          ? true 
                          : menuPlacementFilter === 'top'
                          ? (m.placement === 'top' || m.placement === 'both' || m.placement === 'all')
                          : menuPlacementFilter === 'footer'
                          ? (m.placement === 'footer' || m.placement === 'both' || m.placement === 'bottom' || m.placement === 'all')
                          : menuPlacementFilter === 'bottom'
                          ? (m.placement === 'bottom' || m.placement === 'all')
                          : (m.placement === 'both' || m.placement === 'all');
                        return matchSearch && matchPlace;
                      }).length
                    } लिंक्स)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingMenuItem({
                        labelHi: '',
                        labelEn: '',
                        iconName: 'Compass',
                        placement: 'footer',
                        targetType: 'view',
                        targetValue: 'catalog',
                        externalUrl: '',
                        badgeTextHi: '',
                        badgeTextEn: '',
                        highlight: false,
                        isActive: true,
                        order: navMenuItems.length + 1
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] text-xs font-black border border-[#D4A017] shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ नया मेन्यू जोड़ें</span>
                    </button>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="space-y-3">
                  {navMenuItems
                    .filter(m => {
                      const matchSearch = m.labelHi.toLowerCase().includes(searchMenus.toLowerCase()) ||
                        (m.labelEn || '').toLowerCase().includes(searchMenus.toLowerCase()) ||
                        m.targetValue.toLowerCase().includes(searchMenus.toLowerCase()) ||
                        (m.badgeTextHi || '').toLowerCase().includes(searchMenus.toLowerCase());
                      const matchPlace = menuPlacementFilter === 'all' 
                        ? true 
                        : menuPlacementFilter === 'top'
                        ? (m.placement === 'top' || m.placement === 'both' || m.placement === 'all')
                        : menuPlacementFilter === 'footer'
                        ? (m.placement === 'footer' || m.placement === 'both' || m.placement === 'bottom' || m.placement === 'all')
                        : menuPlacementFilter === 'bottom'
                        ? (m.placement === 'bottom' || m.placement === 'all')
                        : (m.placement === 'both' || m.placement === 'all');
                      return matchSearch && matchPlace;
                    })
                    .sort((a, b) => a.order - b.order)
                    .map((item, index, arr) => {
                      const isFirst = index === 0;
                      const isLast = index === arr.length - 1;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            item.isActive
                              ? item.highlight
                                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-[#D4A017] shadow-xs'
                                : 'bg-[#FDFBF7] dark:bg-stone-800/40 border-[#EAD8B1] dark:border-stone-800 hover:border-amber-500'
                              : 'bg-stone-100/70 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 opacity-60'
                          }`}
                        >
                          {/* Left: Reorder controls, Icon, Title, Placement */}
                          <div className="flex items-center gap-3 min-w-0">
                            
                            {/* Reorder Buttons */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                disabled={isFirst}
                                onClick={() => reorderNavMenuItem(item.id, 'up')}
                                className={`p-1 rounded-lg border text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition ${
                                  isFirst ? 'opacity-30 cursor-not-allowed' : 'bg-white dark:bg-stone-800'
                                }`}
                                title="ऊपर ले जाएँ (Move Up)"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={isLast}
                                onClick={() => reorderNavMenuItem(item.id, 'down')}
                                className={`p-1 rounded-lg border text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition ${
                                  isLast ? 'opacity-30 cursor-not-allowed' : 'bg-white dark:bg-stone-800'
                                }`}
                                title="नीचे ले जाएँ (Move Down)"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Order Number Badge */}
                            <span className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                              {item.order}
                            </span>

                            {/* Icon Visual */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                              item.highlight 
                                ? 'bg-[#7A2A1E] text-[#D4A017] border border-[#D4A017]' 
                                : 'bg-white dark:bg-stone-800 text-[#7A2A1E] dark:text-[#D4A017] border border-stone-200 dark:border-stone-700'
                            }`}>
                              <DynamicNavIcon name={item.iconName} className="w-5 h-5" />
                            </div>

                            {/* Title and Metadata */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-sm text-[#2D2424] dark:text-white leading-tight">
                                  {item.labelHi}
                                </h4>
                                {item.labelEn && (
                                  <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                                    ({item.labelEn})
                                  </span>
                                )}
                                {item.badgeTextHi && (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                                    {item.badgeTextHi}
                                  </span>
                                )}
                                {item.highlight && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-black text-[10px]">
                                    ⭐ हाइलाइटेड
                                  </span>
                                )}
                              </div>

                              {/* Placement & Target description */}
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 flex-wrap">
                                {/* Placement badge */}
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  item.placement === 'top'
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300'
                                    : item.placement === 'footer'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300'
                                    : item.placement === 'bottom'
                                    ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 border border-indigo-300'
                                    : item.placement === 'both'
                                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-300'
                                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-300'
                                }`}>
                                  {item.placement === 'top' && '🔝 शीर्ष हेडर मेन्यू'}
                                  {item.placement === 'footer' && '🔻 फुटर मेन्यू लिंक्स'}
                                  {item.placement === 'bottom' && '📱 निचला मोबाइल नेव'}
                                  {item.placement === 'both' && '✨ हेडर व फुटर दोनों'}
                                  {item.placement === 'all' && '🌐 समस्त मेन्यू (All)'}
                                </span>

                                <span>•</span>

                                {/* Target destination tag */}
                                <span className="font-mono text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                                  {item.targetType === 'view' && `व्यू: ${item.targetValue}`}
                                  {item.targetType === 'category' && `कैटेगरी: ${item.targetValue}`}
                                  {item.targetType === 'modal' && `पॉपअप: ${item.targetValue}`}
                                  {item.targetType === 'external' && `URL: ${item.externalUrl}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Active Toggle Switch & Actions */}
                          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-stone-800 justify-between md:justify-end">
                            
                            {/* Live Active Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                              <span className="text-xs font-bold text-stone-500">
                                {item.isActive ? 'सक्रिय (Live)' : 'निष्क्रिय (Hidden)'}
                              </span>
                              <input
                                type="checkbox"
                                checked={item.isActive}
                                onChange={() => toggleNavMenuItemActive(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                            </label>

                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingMenuItem({ ...item })}
                              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#7A2A1E] hover:text-[#D4A017] transition border border-stone-200 dark:border-stone-700"
                              title="संपादित करें (Edit Menu)"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (window.confirm(`क्या आप मेन्यू "${item.labelHi}" को हटाना चाहते हैं?`)) {
                                  deleteNavMenuItem(item.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition border border-rose-200 dark:border-rose-800"
                              title="हटाएँ (Delete Menu)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Live Preview Simulator */}
              <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border-2 border-amber-500/50 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-400">
                    <Eye className="w-4 h-4" />
                    <span>लाइव मेन्यू पूर्वावलोकन (Live Dynamic Menu Preview)</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">Header, Footer & Mobile Bar Simulation</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Top Bar Preview */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                      1. शीर्ष हेडर मेन्यू बार (Top Header Preview):
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                      {topNavItems.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black whitespace-nowrap shadow-xs ${
                            item.highlight
                              ? 'bg-amber-400 text-stone-950 border-amber-300'
                              : 'bg-stone-800 text-stone-200 border-stone-700'
                          }`}
                        >
                          <DynamicNavIcon name={item.iconName} className="w-3.5 h-3.5" />
                          <span>{item.labelHi}</span>
                          {item.badgeTextHi && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px]">
                              {item.badgeTextHi}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Links Preview */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                      2. फुटर त्वरित नेविगेशन लिंक्स (Footer Quick Navigation Live Preview):
                    </span>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {footerNavItems.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold shadow-xs ${
                            item.highlight
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                              : 'bg-stone-900 text-stone-300 border-stone-800'
                          }`}
                        >
                          <DynamicNavIcon name={item.iconName} className="w-3 h-3 text-emerald-400" />
                          <span>{item.labelHi}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Mobile Bar Preview */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
                      3. मोबाइल निचला नेविगेशन बार (Mobile Bottom App Bar Preview):
                    </span>
                    <div className="grid grid-flow-col auto-cols-fr gap-1 bg-stone-900 p-2 rounded-2xl border border-stone-800 max-w-lg">
                      {bottomNavItems.map(item => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-800/80 text-center gap-1 text-[10px]"
                        >
                          <DynamicNavIcon name={item.iconName} className="w-4 h-4 text-amber-400" />
                          <span className="font-bold truncate max-w-[65px] text-stone-200">{item.labelHi}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: SOCIAL MEDIA PLATFORMS & COMMUNITY CMS */}
          {/* ========================================================= */}
          {activeTab === 'SOCIAL' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 rounded-3xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-300 font-black text-base sm:text-lg">
                      <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span>सोशल मीडिया प्लेटफॉर्म एवं कम्युनिटी लिंक्स CMS</span>
                    </div>
                    <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed max-w-3xl">
                      यहाँ से आप अपने WhatsApp स्टडी ग्रुप, Telegram सुपर चैनल, YouTube वीडियो लेक्चर्स, Instagram रील्स और Facebook कम्युनिटी के ऑफिशियल लिंक्स प्रबंधित कर सकते हैं। ये लिंक्स वेबसाइट के हेडर, फुटर, होमपेज व सोशल साइड पैनल में तुरंत अपडेट हो जाएँगे।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      savePlatformSettings(editingSettings);
                      showToast('✅ समस्त सोशल मीडिया लिंक्स सफलतापूर्वक सहेजे गए!');
                    }}
                    className="px-5 py-3 rounded-2xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] font-black text-xs uppercase tracking-wider border-2 border-[#D4A017] shadow-md transition shrink-0 flex items-center gap-2"
                  >
                    <span>💾 सभी लिंक्स सहेजें (Save Links)</span>
                  </button>
                </div>
              </div>

              {/* 5 Dedicated Channel Management Cards */}
              <div className="grid grid-cols-1 gap-4">
                
                {/* 1. WhatsApp Community / Channel Link */}
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-[#25D366]/40 dark:border-[#25D366]/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                          <span>1. व्हाट्सएप कम्युनिटी / ग्रुप लिंक (WhatsApp Community / Group)</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                            अति-महत्वपूर्ण
                          </span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          छात्रों को सीधे व्हाट्सएप ग्रुप से जोड़ने के लिए ग्रुप इनवाइट लिंक (chat.whatsapp.com/...) दर्ज करें।
                        </p>
                      </div>
                    </div>

                    {editingSettings.whatsappCommunityUrl && (
                      <a
                        href={editingSettings.whatsappCommunityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#25D366] border border-emerald-300 dark:border-emerald-700 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition"
                      >
                        <span>लिंक टेस्ट करें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      WhatsApp Invite Link URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        value={editingSettings.whatsappCommunityUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, whatsappCommunityUrl: e.target.value })}
                        className="flex-1 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-[#25D366]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingSettings.whatsappCommunityUrl) {
                            navigator.clipboard.writeText(editingSettings.whatsappCommunityUrl);
                            showToast('📋 व्हाट्सएप लिंक कॉपी हो गया');
                          } else {
                            showToast('⚠️ पहले व्हाट्सएप लिंक दर्ज करें');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs transition border border-stone-200 dark:border-stone-700"
                        title="लिंक कॉपी करें"
                      >
                        कॉपी करें
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Telegram Super Channel Link */}
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-[#229ED9]/40 dark:border-[#229ED9]/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shadow-sm">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                          <span>2. टेलीग्राम सुपर चैनल लिंक (Telegram Channel - Free PDF & Quiz)</span>
                          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px] font-bold">
                            PDF व क्विज़
                          </span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          दैनिक फ्री ई-नोट्स और टेस्ट अपडेट्स के लिए टेलीग्राम चैनल का लिंक (https://t.me/...) दर्ज करें।
                        </p>
                      </div>
                    </div>

                    {editingSettings.telegramUrl && (
                      <a
                        href={editingSettings.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#229ED9] border border-sky-300 dark:border-sky-700 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100 transition"
                      >
                        <span>लिंक टेस्ट करें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      Telegram Channel Link URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://t.me/mpparikshasetu_mp"
                        value={editingSettings.telegramUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, telegramUrl: e.target.value })}
                        className="flex-1 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-[#229ED9]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingSettings.telegramUrl) {
                            navigator.clipboard.writeText(editingSettings.telegramUrl);
                            showToast('📋 टेलीग्राम लिंक कॉपी हो गया');
                          } else {
                            showToast('⚠️ पहले टेलीग्राम लिंक दर्ज करें');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs transition border border-stone-200 dark:border-stone-700"
                      >
                        कॉपी करें
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. YouTube Channel Link */}
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-[#FF0000]/40 dark:border-[#FF0000]/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shadow-sm">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                          <span>3. यूट्यूब चैनल लिंक (YouTube Channel - Video Classes & Tips)</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[10px] font-bold">
                            वीडियो लेक्चर्स
                          </span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          वीडियो विश्लेषण, सिलेबस व कटऑफ गाइडेंस के लिए आधिकारिक यूट्यूब चैनल का लिंक दर्ज करें।
                        </p>
                      </div>
                    </div>

                    {editingSettings.youtubeUrl && (
                      <a
                        href={editingSettings.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#FF0000] border border-red-300 dark:border-red-700 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition"
                      >
                        <span>लिंक टेस्ट करें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      YouTube Channel Link URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://youtube.com/@mpparikshasetu"
                        value={editingSettings.youtubeUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, youtubeUrl: e.target.value })}
                        className="flex-1 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-[#FF0000]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingSettings.youtubeUrl) {
                            navigator.clipboard.writeText(editingSettings.youtubeUrl);
                            showToast('📋 यूट्यूब लिंक कॉपी हो गया');
                          } else {
                            showToast('⚠️ पहले यूट्यूब लिंक दर्ज करें');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs transition border border-stone-200 dark:border-stone-700"
                      >
                        कॉपी करें
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Instagram Profile & Reels Link */}
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-rose-300 dark:border-rose-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                          <span>4. इंस्टाग्राम प्रोफाइल व रील्स लिंक (Instagram Page & GK Reels)</span>
                          <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 text-[10px] font-bold">
                            60s GK रील्स
                          </span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          इंस्टाग्राम रील्स, शॉर्ट ट्रिक्स व परीक्षा इंफोग्राफिक्स के लिए इंस्टाग्राम लिंक दर्ज करें।
                        </p>
                      </div>
                    </div>

                    {editingSettings.instagramUrl && (
                      <a
                        href={editingSettings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-rose-600 border border-pink-300 dark:border-pink-700 text-xs font-bold flex items-center gap-1.5 hover:bg-pink-100 transition"
                      >
                        <span>लिंक टेस्ट करें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      Instagram Profile Link URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://instagram.com/mpparikshasetu_official"
                        value={editingSettings.instagramUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, instagramUrl: e.target.value })}
                        className="flex-1 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingSettings.instagramUrl) {
                            navigator.clipboard.writeText(editingSettings.instagramUrl);
                            showToast('📋 इंस्टाग्राम लिंक कॉपी हो गया');
                          } else {
                            showToast('⚠️ पहले इंस्टाग्राम लिंक दर्ज करें');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs transition border border-stone-200 dark:border-stone-700"
                      >
                        कॉपी करें
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Facebook Group & Page Link */}
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-[#1877F2]/40 dark:border-[#1877F2]/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-sm">
                        <Facebook className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                          <span>5. फेसबुक पेज / ग्रुप लिंक (Facebook Page & Discussion Group)</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                            स्टडी कम्युनिटी
                          </span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          एमपी परीक्षार्थी डिस्कशन फोरम एवं पुराने प्रश्नपत्रों की चर्चा के लिए फेसबुक लिंक दर्ज करें।
                        </p>
                      </div>
                    </div>

                    {editingSettings.facebookUrl && (
                      <a
                        href={editingSettings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] border border-blue-300 dark:border-blue-700 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition"
                      >
                        <span>लिंक टेस्ट करें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      Facebook Page/Group Link URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://facebook.com/groups/mpparikshasetu"
                        value={editingSettings.facebookUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, facebookUrl: e.target.value })}
                        className="flex-1 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-[#1877F2]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingSettings.facebookUrl) {
                            navigator.clipboard.writeText(editingSettings.facebookUrl);
                            showToast('📋 फेसबुक लिंक कॉपी हो गया');
                          } else {
                            showToast('⚠️ पहले फेसबुक लिंक दर्ज करें');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs transition border border-stone-200 dark:border-stone-700"
                      >
                        कॉपी करें
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Master Save Action Bar */}
              <div className="p-6 rounded-3xl bg-[#7A2A1E] text-white border-2 border-[#D4A017] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-base text-[#D4A017]">
                    क्या आपने सभी सोशल मीडिया लिंक्स अपडेट कर लिए हैं?
                  </h4>
                  <p className="text-xs text-stone-200 mt-0.5">
                    नीचे दिए गए बटन पर क्लिक करते ही ये लिंक्स संपूर्ण प्लेटफ़ॉर्म पर तुरंत लाइव हो जाएँगे।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    savePlatformSettings(editingSettings);
                    showToast('✅ समस्त सोशल मीडिया लिंक्स सफलतापूर्वक सहेजे गए!');
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-[#D4A017] hover:bg-[#b88b14] text-[#7A2A1E] font-black text-sm uppercase tracking-wider shadow-lg transition"
                >
                  💾 सभी लिंक्स सहेजें (Save All Links)
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: COMPREHENSIVE REPORTS & EXPORTS (XLS, PDF, CSV) */}
          {/* ========================================================= */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-6">
              
              {/* Top Banner with Summary & Quick Export Cards */}
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-black text-base">
                      <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                      <span>प्रशासनिक रिपोर्ट एवं डेटा एक्सपोर्ट सेंटर (XLS / PDF / CSV)</span>
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed max-w-3xl">
                      यहाँ से आप पंजीकृत छात्रों, टेस्ट सीरीज़ नामांकन, परीक्षा स्कोर व रेज़रपे राजस्व का संपूर्ण डेटा Excel (.xls), मुद्रण योग्य PDF (.pdf) और CSV (.csv) प्रारूप में एक क्लिक में सुरक्षित डाउनलोड कर सकते हैं।
                    </p>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white dark:bg-stone-900 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">कुल पंजीकृत छात्र</span>
                      <span className="font-mono font-black text-lg text-emerald-700 dark:text-emerald-400">{users.length}</span>
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-stone-900 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">कुल ऑर्डर्स</span>
                      <span className="font-mono font-black text-lg text-teal-700 dark:text-teal-400">{orders.length}</span>
                    </div>
                  </div>
                </div>

                {/* 4 Dedicated Quick Export Action Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  
                  {/* 1. All Users Report */}
                  <div className="p-4 bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-stone-800 dark:text-white">1. पंजीकृत छात्र रिपोर्ट</span>
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">छात्र नाम, मोबाइल, ईमेल, जिला, रोल, XP व स्ट्रीक</p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          const data = users.map(u => ({
                            'छात्र ID': u.id,
                            'नाम': u.name,
                            'ईमेल': u.email,
                            'मोबाइल': u.phone,
                            'गृह जिला': u.district,
                            'लक्ष्य परीक्षा': u.targetExam,
                            'रोल': u.role === 'admin' ? 'प्रशासक (Admin)' : 'छात्र (Student)',
                            'XP अंक': u.xp || 0,
                            'लगातार दिन (Streak)': u.streak || 0,
                            'पंजीकरण दिनांक': new Date(u.joinedAt || u.createdAt || Date.now()).toLocaleDateString('hi-IN')
                          }));
                          exportToXls(data, `MP_Pariksha_Setu_Users_${new Date().toISOString().split('T')[0]}`);
                          showToast('📊 छात्र रिपोर्ट Excel (.xls) डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black text-center"
                        title="Excel डाउनलोड"
                      >
                        Excel (.xls)
                      </button>
                      <button
                        onClick={() => {
                          const data = users.map(u => ({
                            'छात्र ID': u.id,
                            'नाम': u.name,
                            'ईमेल': u.email,
                            'मोबाइल': u.phone,
                            'गृह जिला': u.district,
                            'लक्ष्य परीक्षा': u.targetExam,
                            'रोल': u.role,
                            'XP': u.xp || 0,
                            'Streak': u.streak || 0
                          }));
                          exportToCsv(data, `MP_Pariksha_Setu_Users_${new Date().toISOString().split('T')[0]}`);
                          showToast('📄 छात्र रिपोर्ट CSV डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-[10px] font-bold text-center"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => {
                          const cols = [
                            { key: 'name', label: 'नाम' },
                            { key: 'phone', label: 'मोबाइल' },
                            { key: 'email', label: 'ईमेल' },
                            { key: 'district', label: 'जिला' },
                            { key: 'targetExam', label: 'लक्ष्य परीक्षा' },
                            { key: 'role', label: 'रोल' }
                          ];
                          exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु - समस्त पंजीकृत छात्र विवरण रिपोर्ट', cols, users);
                        }}
                        className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black text-center"
                        title="PDF प्रिंट"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* 2. Razorpay Orders & Sales Report */}
                  <div className="p-4 bg-white dark:bg-stone-900 border border-teal-200 dark:border-teal-800 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-stone-800 dark:text-white">2. राजस्व व ट्रांजेक्शन</span>
                        <CreditCard className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">ऑर्डर ID, पेमेंट ID, राशि, GST, छूट व इनवॉइस</p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          const data = orders.map(o => ({
                            'ऑर्डर ID': o.orderId,
                            'इनवॉइस नंबर': o.invoiceNumber,
                            'रेज़रपे Payment ID': o.razorpayPaymentId,
                            'छात्र नाम': o.userName,
                            'ईमेल': o.userEmail,
                            'मोबाइल': o.userPhone,
                            'सीरीज़ पैकेज': o.seriesTitle,
                            'मूल राशि (₹)': o.amount,
                            'छूट (₹)': o.discount || 0,
                            'GST राशि (₹)': o.gstAmount,
                            'अंतिम भुगतान (₹)': o.finalAmount,
                            'स्थिति': o.status,
                            'दिनांक': new Date(o.createdAt).toLocaleString('hi-IN')
                          }));
                          exportToXls(data, `MP_Pariksha_Setu_Orders_${new Date().toISOString().split('T')[0]}`);
                          showToast('📊 सेल्स रिपोर्ट Excel (.xls) डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-black text-center"
                      >
                        Excel (.xls)
                      </button>
                      <button
                        onClick={() => {
                          const data = orders.map(o => ({
                            'Order ID': o.orderId,
                            'Payment ID': o.razorpayPaymentId,
                            'Candidate': o.userName,
                            'Email': o.userEmail,
                            'Phone': o.userPhone,
                            'Package': o.seriesTitle,
                            'Amount': o.amount,
                            'Discount': o.discount,
                            'Final': o.finalAmount,
                            'Status': o.status,
                            'Date': o.createdAt
                          }));
                          exportToCsv(data, `MP_Pariksha_Setu_Orders_${new Date().toISOString().split('T')[0]}`);
                          showToast('📄 सेल्स रिपोर्ट CSV डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-[10px] font-bold text-center"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => {
                          const cols = [
                            { key: 'orderId', label: 'ऑर्डर ID' },
                            { key: 'userName', label: 'परीक्षार्थी' },
                            { key: 'userPhone', label: 'मोबाइल' },
                            { key: 'seriesTitle', label: 'सीरीज़' },
                            { key: 'finalAmount', label: 'भुगतान (₹)' },
                            { key: 'status', label: 'स्थिति' }
                          ];
                          exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु - रेज़रपे लेन-देन व राजस्व रिपोर्ट', cols, orders);
                        }}
                        className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black text-center"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* 3. Question Bank Audit Report */}
                  <div className="p-4 bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-stone-800 dark:text-white">3. प्रश्न बैंक ऑडिट रिपोर्ट</span>
                        <FileQuestion className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">विषय, अनुभाग, द्विभाषी प्रश्न, सही उत्तर व अंक भार</p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          const data = questions.map(q => ({
                            'ID': q.id,
                            'विषय (Subject)': q.subject,
                            'अनुभाग (Section)': q.section,
                            'टॉपिक': q.topic,
                            'प्रश्न (हिन्दी)': q.questionHi,
                            'विकल्प A': q.optionsHi[0] || '',
                            'विकल्प B': q.optionsHi[1] || '',
                            'विकल्प C': q.optionsHi[2] || '',
                            'विकल्प D': q.optionsHi[3] || '',
                            'सही विकल्प इंडेक्स': q.correctOption,
                            'व्याख्या': q.explanationHi
                          }));
                          exportToXls(data, `MP_Pariksha_Setu_Questions_${new Date().toISOString().split('T')[0]}`);
                          showToast('📊 प्रश्न बैंक रिपोर्ट Excel (.xls) डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-black text-center"
                      >
                        Excel (.xls)
                      </button>
                      <button
                        onClick={() => {
                          const data = questions.map(q => ({
                            'ID': q.id,
                            'Subject': q.subject,
                            'Section': q.section,
                            'Topic': q.topic,
                            'Question': q.questionHi,
                            'CorrectOption': q.correctOption
                          }));
                          exportToCsv(data, `MP_Pariksha_Setu_Questions_${new Date().toISOString().split('T')[0]}`);
                          showToast('📄 प्रश्न बैंक CSV डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-[10px] font-bold text-center"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => {
                          const cols = [
                            { key: 'subject', label: 'विषय' },
                            { key: 'topic', label: 'टॉपिक' },
                            { key: 'questionHi', label: 'प्रश्न (हिन्दी)' },
                            { key: 'correctOption', label: 'सही विकल्प (0-3)' }
                          ];
                          exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु - प्रश्न बैंक मास्टर ऑडिट रिपोर्ट', cols, questions.slice(0, 100));
                        }}
                        className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black text-center"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* 4. Test Series Catalog & Enrolment */}
                  <div className="p-4 bg-white dark:bg-stone-900 border border-purple-200 dark:border-purple-800 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-stone-800 dark:text-white">4. टेस्ट सीरीज़ कैटलॉग</span>
                        <BookPlus className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">सीरीज़ शीर्षक, श्रेणी, मूल्य, कुल टेस्ट्स व स्थिति</p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          const data = testSeries.map(ts => ({
                            'सीरीज़ ID': ts.id,
                            'शीर्षक (हिन्दी)': ts.titleHi,
                            'श्रेणी (Category)': ts.category,
                            'मूल्य (₹)': ts.price,
                            'एमआरपी (₹)': ts.originalPrice,
                            'कुल टेस्ट्स': ts.totalTests,
                            'डेमो उपलब्ध': ts.isFreeDemoAvailable ? 'हाँ' : 'नहीं'
                          }));
                          exportToXls(data, `MP_Pariksha_Setu_Series_${new Date().toISOString().split('T')[0]}`);
                          showToast('📊 टेस्ट सीरीज़ कैटलॉग Excel (.xls) डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black text-center"
                      >
                        Excel (.xls)
                      </button>
                      <button
                        onClick={() => {
                          const data = testSeries.map(ts => ({
                            'ID': ts.id,
                            'Title': ts.titleHi,
                            'Category': ts.category,
                            'Price': ts.price,
                            'TotalTests': ts.totalTests
                          }));
                          exportToCsv(data, `MP_Pariksha_Setu_Series_${new Date().toISOString().split('T')[0]}`);
                          showToast('📄 टेस्ट सीरीज़ CSV डाउनलोड हो गई।');
                        }}
                        className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-[10px] font-bold text-center"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => {
                          const cols = [
                            { key: 'titleHi', label: 'सीरीज़ नाम' },
                            { key: 'category', label: 'श्रेणी' },
                            { key: 'price', label: 'ऑफर मूल्य (₹)' },
                            { key: 'totalTests', label: 'कुल टेस्ट्स' }
                          ];
                          exportToPdfPrint('मध्य प्रदेश परीक्षा सेतु - टेस्ट सीरीज़ कैटलॉग एवं मूल्य रिपोर्ट', cols, testSeries);
                        }}
                        className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black text-center"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Master Registered Users Detailed Table Section */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>पंजीकृत छात्र मास्टर डेटा तालिका (Live Registered Students Table)</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      वेबसाइट पर रजिस्टर होने वाले सभी छात्रों की संपूर्ण जानकारी यहाँ लाइव अपडेट होती है।
                    </p>
                  </div>

                  {/* Filter / Search inside Table */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="छात्र, मोबाइल, जिला खोजें..."
                        value={searchStudents}
                        onChange={(e) => setSearchStudents(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none w-52"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        const filtered = users.filter(u => !searchStudents || 
                          u.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
                          u.district.toLowerCase().includes(searchStudents.toLowerCase()) ||
                          u.phone.includes(searchStudents)
                        );
                        const data = filtered.map(u => ({
                          'छात्र ID': u.id,
                          'नाम': u.name,
                          'ईमेल': u.email,
                          'मोबाइल': u.phone,
                          'गृह जिला': u.district,
                          'लक्ष्य परीक्षा': u.targetExam,
                          'रोल': u.role,
                          'XP अंक': u.xp || 0,
                          'Streak': u.streak || 0,
                          'पंजीकरण दिनांक': new Date(u.joinedAt || u.createdAt || Date.now()).toLocaleString('hi-IN')
                        }));
                        exportToXls(data, `MP_Pariksha_Setu_Filtered_Students_${new Date().toISOString().split('T')[0]}`);
                        showToast('📊 तालिका डेटा Excel (.xls) में एक्सपोर्ट हो गया।');
                      }}
                      className="px-3 py-1.5 bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] border border-[#D4A017] rounded-xl text-xs font-black flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>तालिका XLS</span>
                    </button>
                  </div>
                </div>

                {/* Table View of Users */}
                {users.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-700">
                    <Users className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <h4 className="font-black text-stone-700 dark:text-stone-300 text-sm">डैशबोर्ड पूर्णतः ब्लैंक (खाली) है</h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                      जैसे ही कोई नया छात्र वेबसाइट पर साइन अप करेगा, उसका नाम, मोबाइल नंबर, ईमेल, जिला और लक्ष्य परीक्षा यहाँ तत्काल लाइव प्रदर्शित होगी।
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 dark:bg-stone-800/80 border-b-2 border-stone-200 dark:border-stone-700 text-stone-500 uppercase text-[10px] font-black">
                          <th className="py-3 px-4">छात्र विवरण व ID</th>
                          <th className="py-3 px-4">संपर्क (मोबाइल व ईमेल)</th>
                          <th className="py-3 px-4">गृह जिला व परीक्षा</th>
                          <th className="py-3 px-4">रोल (Role)</th>
                          <th className="py-3 px-4">प्रगति (XP & Streak)</th>
                          <th className="py-3 px-4">पंजीकरण दिनांक</th>
                          <th className="py-3 px-4 text-center">कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                        {users
                          .filter(u => !searchStudents || 
                            u.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
                            u.district.toLowerCase().includes(searchStudents.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchStudents.toLowerCase()) ||
                            u.phone.includes(searchStudents)
                          )
                          .map(user => {
                            const isAdmin = user.role === 'admin';
                            return (
                              <tr key={user.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#7A2A1E] text-[#D4A017] flex items-center justify-center font-black text-xs shadow-sm">
                                      {user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-black text-stone-800 dark:text-white flex items-center gap-1.5">
                                        <span>{user.name}</span>
                                        {isAdmin && (
                                          <span className="px-1.5 py-0.2 rounded bg-[#D4A017] text-black text-[9px] font-black font-mono">
                                            ADMIN
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] font-mono text-stone-400">{user.id}</div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-stone-700 dark:text-stone-300">{user.phone}</div>
                                  <div className="text-[11px] text-stone-400">{user.email}</div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-stone-700 dark:text-stone-300">{user.district}</div>
                                  <div className="text-[11px] text-[#7A2A1E] dark:text-[#D4A017] font-semibold">{user.targetExam}</div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    isAdmin 
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                                  }`}>
                                    {isAdmin ? 'प्रशासक' : 'छात्र'}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-mono">
                                  <div className="font-black text-amber-600">{user.xp || 0} XP</div>
                                  <div className="text-[10px] text-stone-400">🔥 {user.streak || 0} दिन स्ट्रीक</div>
                                </td>

                                <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                                  {uDateFormatted(user)}
                                </td>

                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setPasswordModalUser(user);
                                        setNewPasswordVal('123456');
                                      }}
                                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300"
                                      title="पासवर्ड रीसेट"
                                    >
                                      <Key className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => toggleUserRole(user.id)}
                                      className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[10px] font-bold"
                                      title="रोल बदलें"
                                    >
                                      रोल
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BANNERS & THUMBNAILS CMS */}
          {/* ========================================================= */}
          {activeTab === 'BANNERS' && (
            <div className="space-y-6">
              
              {/* Info & Preset Selector */}
              <div className="p-5 bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-black text-sm">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  <span>होमपेज बैनर एवं टेस्ट पैकेज थंबनेल नियंत्रण (Visual Asset Management)</span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  यहाँ से आप वेबसाइट के होमपेज पर चलने वाले **स्लाइडर बैनर्स**, **प्रमोशनल पोस्टर्स**, और प्रत्येक टेस्ट सीरीज़ के **थंबनेल इमेज** को सीधे जोड़, हटा या अपडेट कर सकते हैं। आप कोई भी कस्टम Image URL पेस्ट कर सकते हैं अथवा नीचे दिए गए आधिकारिक MP प्रीसेट्स में से चुन सकते हैं।
                </p>
                
                {/* Image Presets Chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                    त्वरित प्रीसेट इमेजेस (1-Click Presets):
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigator.clipboard?.writeText(preset.url);
                          showToast(`✅ URL कॉपी किया: ${preset.name}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-600 hover:text-white transition shadow-xs flex items-center gap-1.5"
                      >
                        <span>{preset.name}</span>
                        <span className="text-[10px] opacity-60">(Copy URL)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Existing Banners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {siteBanners.map(banner => (
                  <div 
                    key={banner.id}
                    className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Banner Image Preview */}
                      <div className="relative h-44 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.titleHi}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Badges on top */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="bg-[#D4A017] text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                            {banner.badgeText || '💥 बैनर'}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            banner.isActive ? 'bg-emerald-600 text-white' : 'bg-stone-600 text-white'
                          }`}>
                            {banner.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Hidden)'}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="font-black text-sm line-clamp-1">{banner.titleHi}</h4>
                          <p className="text-[11px] text-stone-300 line-clamp-1">{banner.subtitleHi}</p>
                        </div>
                      </div>

                      {/* Banner Details */}
                      <div className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-stone-500 font-mono text-[11px]">
                          <span>क्रम संख्या (Order): #{banner.order}</span>
                          <span>टारगेट: {banner.targetView}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 font-mono text-[10px] text-stone-600 dark:text-stone-400 truncate">
                          URL: {banner.imageUrl}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <button
                        onClick={() => setEditingBanner({ ...banner })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold"
                      >
                        <Edit className="w-3.5 h-3.5 text-indigo-600" />
                        <span>संपादित करें</span>
                      </button>
                      <button
                        onClick={() => deleteSiteBanner(banner.id)}
                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100"
                        title="हटाएँ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: TEST SERIES PACKAGES CMS */}
          {/* ========================================================= */}
          {activeTab === 'SERIES' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border-2 border-[#D4A017] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-black text-amber-950 dark:text-amber-300 flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
                    <span>होमपेज परीक्षा विजिबिलिटी नियंत्रक (Active / Inactive Controller)</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    जिस परीक्षा को आप <strong>सक्रिय (Active)</strong> करेंगे, वही वेबसाइट के होमपेज व कैटलॉग पर छात्रों को दिखेगी और वे उसे खरीद सकेंगे। <strong>निष्क्रिय (Inactive)</strong> करने पर वह तुरंत छिप जाएगी।
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleExportSeries('xls')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                    title="टेस्ट सीरीज़ कैटलॉग Excel में डाउनलोड करें"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>XLS</span>
                  </button>
                  <button
                    onClick={() => handleExportSeries('csv')}
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                    title="टेस्ट सीरीज़ CSV में डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportSeries('pdf')}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                    title="टेस्ट सीरीज़ PDF प्रिंट / डाउनलोड करें"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testSeries.map(series => {
                  const isLive = series.isActive !== false;
                  return (
                    <div 
                      key={series.id}
                      className={`bg-white dark:bg-stone-900 border-2 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between transition-all ${
                        isLive 
                          ? 'border-[#EAD8B1] dark:border-stone-800' 
                          : 'border-rose-300 dark:border-rose-900/60 opacity-85'
                      }`}
                    >
                      <div>
                        {/* Package Cover Thumbnail */}
                        <div className="relative h-44 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                          <img 
                            src={series.thumbnailUrl || IMAGE_PRESETS[0].url} 
                            alt={series.titleHi}
                            className={`w-full h-full object-cover ${!isLive ? 'grayscale-40' : ''}`}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="bg-[#7A2A1E] text-[#D4A017] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#D4A017]/40 shadow">
                              {series.departmentHi}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isLive ? (
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> सक्रिय (LIVE)
                                </span>
                              ) : (
                                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> छिपा हुआ (INACTIVE)
                                </span>
                              )}
                              <span className="bg-[#D4A017] text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
                                ₹{series.price}
                              </span>
                            </div>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h4 className="font-black text-sm line-clamp-1">{series.titleHi}</h4>
                            <p className="text-[11px] text-stone-300 font-mono">
                              {series.totalTests} टेस्ट • {series.totalQuestions} Qs • {series.durationMinutes} मिनट
                            </p>
                          </div>
                        </div>

                        {/* Series Content info */}
                        <div className="p-4 space-y-2.5 text-xs">
                          {/* Active / Inactive Status Bar */}
                          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isLive 
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' 
                              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                          }`}>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                              <span className={`font-black text-[11px] ${isLive ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                                {isLive ? 'छात्र होमपेज पर देख व खरीद सकते हैं' : 'होमपेज से छिपा हुआ (खरीद बंद)'}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleTestSeriesActive(series.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                                isLive
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {isLive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-stone-500 font-medium pt-1">
                            <span>डेमो टेस्ट:</span>
                            <span className="font-bold text-emerald-600">
                              {series.isFreeDemoAvailable ? `हाँ (${series.freeTestsCount || 1} मुफ़्त)` : 'नहीं'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-stone-500 font-medium">
                            <span>अनुभाग (Sections):</span>
                            <span className="font-bold">{series.syllabus.length} विषय</span>
                          </div>
                          <div className="flex items-center justify-between text-stone-500 font-medium">
                            <span>ई-नोट्स PDF:</span>
                            <span className="font-bold">{series.pdfNotesCount || 10} फाइल्स</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                            {series.descriptionHi}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setEditingSeries({ ...series })}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
                          <span>संपादित करें / थंबनेल</span>
                        </button>
                        <button
                          onClick={() => deleteTestSeries(series.id)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100"
                          title="हटाएँ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: 20 MOCK SETS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'MOCK_SETS' && (
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-black text-sm">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <span>म.प्र. पटवारी 2026 — 20 फुल मॉक सेट्स नियंत्रक (20 Mock Sets Engine)</span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                    प्रत्येक सेट में 200 प्रश्न (8 विषय) व 180 मिनट का वास्तविक CBT सिमुलेटर शामिल है। सेट #1 पूर्णतः मुफ़्त डेमो है, और सेट #2 से #20 नामांकित छात्रों हेतु सुरक्षित हैं।
                  </p>
                </div>
                <button
                  onClick={() => navigate('cbtExam', { seriesId: 'ts_patwari_2026', setNumber: 1 })}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shrink-0"
                >
                  छात्र सेट चयन स्क्रीन देखें →
                </button>
              </div>

              {/* 20 Sets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 20 }, (_, idx) => {
                  const setNum = idx + 1;
                  const isDemo = setNum === 1;

                  return (
                    <div 
                      key={setNum}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isDemo 
                          ? 'bg-amber-50/80 dark:bg-amber-950/30 border-[#D4A017] shadow-sm' 
                          : 'bg-white dark:bg-stone-900 border-[#EAD8B1] dark:border-stone-800 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                            isDemo ? 'bg-[#D4A017] text-black' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}>
                            SET #{setNum}
                          </span>
                          {isDemo ? (
                            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">🎁 DEMO</span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </div>

                        <div className="font-black text-sm mt-2 text-[#2D2424] dark:text-white">
                          मॉक टेस्ट #{setNum}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">200 प्रश्न • 200 अंक</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">समय: 180 मिनट</div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                        <button
                          onClick={() => navigate('cbtExam', { seriesId: 'ts_patwari_2026', setNumber: setNum })}
                          className="flex-1 py-1.5 rounded-lg bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] text-[10px] font-black text-center"
                        >
                          टेस्ट लॉन्च करें
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: QUESTION BANK CMS */}
          {/* ========================================================= */}
          {activeTab === 'QUESTIONS' && (
            <div className="space-y-6">
              
              {/* Search & Filter Bar & Export Buttons */}
              <div className="p-4 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="प्रश्न पाठ, विषय या टॉपिक खोजें..."
                    value={searchQuestions}
                    onChange={(e) => setSearchQuestions(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none focus:border-[#7A2A1E]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedSubjectFilter}
                    onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold"
                  >
                    <option value="all">सभी विषय ({questions.length})</option>
                    <option value="म.प्र. सामान्य ज्ञान">म.प्र. सामान्य ज्ञान</option>
                    <option value="सामान्य हिन्दी">सामान्य हिन्दी</option>
                    <option value="सामान्य गणित">सामान्य गणित</option>
                    <option value="कंप्यूटर विज्ञान">कंप्यूटर विज्ञान</option>
                    <option value="सामान्य प्रबंधन">सामान्य प्रबंधन</option>
                    <option value="सामान्य विज्ञान">सामान्य विज्ञान</option>
                    <option value="सामान्य तार्किक योग्यता">तार्किक योग्यता</option>
                    <option value="सामान्य अंग्रेजी">सामान्य अंग्रेजी</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleExportQuestions('xls')}
                      className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                      title="प्रश्नोत्तरी Excel में डाउनलोड करें"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>XLS</span>
                    </button>
                    <button
                      onClick={() => handleExportQuestions('csv')}
                      className="px-2.5 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                      title="प्रश्नोत्तरी CSV में डाउनलोड करें"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => handleExportQuestions('pdf')}
                      className="px-2.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                      title="प्रश्नोत्तरी PDF प्रिंट / डाउनलोड करें"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions
                  .filter(q => {
                    const matchesSearch = !searchQuestions || 
                      q.questionHi.toLowerCase().includes(searchQuestions.toLowerCase()) ||
                      (q.subject && q.subject.toLowerCase().includes(searchQuestions.toLowerCase()));
                    const matchesSubject = selectedSubjectFilter === 'all' || q.subject === selectedSubjectFilter;
                    return matchesSearch && matchesSubject;
                  })
                  .slice(0, 40)
                  .map((q, idx) => (
                    <div 
                      key={q.id}
                      className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#7A2A1E] text-[#D4A017] text-[10px] font-mono font-black px-2 py-0.5 rounded">
                            Q#{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-stone-500">
                            {q.subject || q.section} • {q.topic}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingQuestion({ ...q })}
                            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300"
                            title="संपादित करें"
                          >
                            <Edit className="w-4 h-4 text-[#7A2A1E]" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(q.id)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                            title="हटाएँ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="font-bold text-sm text-[#2D2424] dark:text-stone-100 leading-relaxed">
                        {q.questionHi}
                      </p>

                      {/* Diagram Image if any */}
                      {q.imageUrl && (
                        <div className="p-2 bg-stone-50 dark:bg-stone-800 rounded-xl max-w-sm">
                          <img src={q.imageUrl} alt="Question diagram" className="rounded-lg max-h-36 object-contain" />
                        </div>
                      )}

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                        {(q.optionsHi || q.options?.map(o => o.textHi) || []).map((optText, oIdx) => {
                          const isCorrect = (q.correctOption ?? q.correctOptionIndex) === oIdx;
                          return (
                            <div 
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                isCorrect 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-200' 
                                  : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="truncate">{optText}</span>
                              {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanationHi && (
                        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-950 dark:text-amber-200">
                          <span className="font-black text-[#7A2A1E] dark:text-[#D4A017]">व्याख्या: </span>
                          {q.explanationHi}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: STUDENTS & ACCESS CONTROL */}
          {/* ========================================================= */}
          {activeTab === 'STUDENTS' && (
            <div className="space-y-6">
              {/* Search Bar & Export Buttons */}
              <div className="p-4 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="छात्र का नाम, जिला, मोबाइल नंबर या ईमेल खोजें..."
                    value={searchStudents}
                    onChange={(e) => setSearchStudents(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleExportUsers('xls')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                    title="Excel में डाउनलोड करें"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Excel (XLS)</span>
                  </button>
                  <button
                    onClick={() => handleExportUsers('csv')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                    title="CSV में डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportUsers('pdf')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                    title="PDF रिपोर्ट प्रिंट / डाउनलोड करें"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF / Print</span>
                  </button>
                </div>
              </div>

              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users
                  .filter(u => !searchStudents || 
                    u.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
                    u.district.toLowerCase().includes(searchStudents.toLowerCase()) ||
                    (u.state && u.state.toLowerCase().includes(searchStudents.toLowerCase())) ||
                    u.email.toLowerCase().includes(searchStudents.toLowerCase())
                  )
                  .map(user => {
                    const isAdmin = user.role === 'admin';
                    const enrolledCount = (enrolledSeriesIds || []).length;

                    return (
                      <div 
                        key={user.id}
                        className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-[#7A2A1E] text-[#D4A017] flex items-center justify-center font-black text-sm shadow">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-sm text-[#2D2424] dark:text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isAdmin && (
                                    <span className="px-2 py-0.5 rounded bg-[#D4A017] text-black text-[10px] font-black font-mono">
                                      ADMIN
                                    </span>
                                  )}
                                </h4>
                                <div className="text-[11px] text-stone-500">{user.email} • {user.phone}</div>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleUserRole(user.id)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                isAdmin 
                                  ? 'bg-rose-50 text-rose-700 border-rose-300' 
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                              }`}
                            >
                              {isAdmin ? 'रोल: छात्र करें' : 'रोल: एडमिन बनाएँ'}
                            </button>
                          </div>

                          <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-stone-500">राज्य व जिला (State & District):</span>
                              <span className="font-bold text-stone-900 dark:text-stone-100">
                                {user.district}{user.state ? ` (${user.state})` : ''}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-stone-500">लक्ष्य परीक्षा:</span>
                              <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">{user.targetExam}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-stone-500">XP व स्ट्रीक:</span>
                              <span className="font-mono font-bold text-amber-600">{user.xp || 0} XP • 🔥 {user.streak || 0} Days</span>
                            </div>
                          </div>
                        </div>

                        {/* Student Actions Bar */}
                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => toggleUserAccess(user.id, 'ts_patwari_2026')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center justify-center gap-1.5"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>पटवारी 2026 अनलॉक / लॉक</span>
                          </button>

                          <button
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewPasswordVal('123456');
                            }}
                            className="py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold"
                            title="पासवर्ड रीसेट"
                          >
                            <Key className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                          </button>

                          <button
                            onClick={() => {
                              setXpModalUser(user);
                              setBonusXpVal(500);
                            }}
                            className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold"
                            title="बोनस XP दें"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: RAZORPAY ORDERS & REFUNDS */}
          {/* ========================================================= */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-6">
              {/* Search Bar & Export Buttons */}
              <div className="p-4 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="ऑर्डर ID, रेज़रपे पेमेंट ID या छात्र का नाम खोजें..."
                    value={searchOrders}
                    onChange={(e) => setSearchOrders(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleExportOrders('xls')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                    title="Excel में डाउनलोड करें"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Excel (XLS)</span>
                  </button>
                  <button
                    onClick={() => handleExportOrders('csv')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                    title="CSV में डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportOrders('pdf')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                    title="PDF रिपोर्ट प्रिंट / डाउनलोड करें"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF / Print</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-800 border-b-2 border-stone-200 dark:border-stone-700 text-stone-500 uppercase text-[10px] font-black">
                        <th className="py-3 px-4">ऑर्डर ID व इनवॉइस</th>
                        <th className="py-3 px-4">रेज़रपे Payment ID</th>
                        <th className="py-3 px-4">परीक्षार्थी विवरण</th>
                        <th className="py-3 px-4">सीरीज़ पैकेज</th>
                        <th className="py-3 px-4">राशि व छूट</th>
                        <th className="py-3 px-4">स्थिति</th>
                        <th className="py-3 px-4">एक्शन</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                      {orders
                        .filter(o => !searchOrders || 
                          o.orderId.toLowerCase().includes(searchOrders.toLowerCase()) ||
                          o.razorpayPaymentId.toLowerCase().includes(searchOrders.toLowerCase()) ||
                          o.userName.toLowerCase().includes(searchOrders.toLowerCase())
                        )
                        .map(order => (
                          <tr key={order.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-[#7A2A1E] dark:text-[#D4A017]">{order.orderId}</div>
                              <div className="text-[10px] text-stone-400 font-mono">{order.invoiceNumber}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                              {order.razorpayPaymentId}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold">{order.userName}</div>
                              <div className="text-[10px] text-stone-400">{order.userPhone}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate">{order.seriesTitle}</td>
                            <td className="py-3.5 px-4 font-mono">
                              <div className="font-black text-emerald-600">₹{order.finalAmount}</div>
                              {order.discount > 0 && <div className="text-[10px] text-rose-500">-₹{order.discount} छूट</div>}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                order.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {order.status === 'SUCCESS' ? (
                                <button
                                  onClick={() => refundOrder(order.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-[10px] font-black"
                                >
                                  रिफंड करें
                                </button>
                              ) : (
                                <span className="text-[10px] text-stone-400 font-bold">रिफंडेड</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: COUPONS & PROMOS */}
          {/* ========================================================= */}
          {activeTab === 'COUPONS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {coupons.map(coupon => (
                  <div 
                    key={coupon.code}
                    className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-base px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {coupon.code}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          coupon.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {coupon.isActive ? 'सक्रिय' : 'बंद'}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs">
                        <div className="font-bold text-sm text-[#2D2424] dark:text-white">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% छूट` : `₹${coupon.discountValue} फ्लैट छूट`}
                        </div>
                        <div className="text-stone-500">न्यूनतम ऑर्डर: ₹{coupon.minAmount}</div>
                        <div className="text-stone-400 font-mono text-[11px]">वैधता: {coupon.validTill}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <button
                        onClick={() => setEditingCoupon({ ...coupon })}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>संपादित करें</span>
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.code)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="हटाएँ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: ANNOUNCEMENTS & RECRUITMENT TICKER */}
          {/* ========================================================= */}
          {activeTab === 'ANNOUNCEMENTS' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div 
                    key={ann.id}
                    className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-black shrink-0">
                        <BellRing className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black font-mono">
                            {ann.tag}
                          </span>
                          {ann.isPinned && (
                            <span className="text-[10px] font-black text-amber-600">📌 PINNED TICKER</span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-[#2D2424] dark:text-white mt-1">
                          {ann.titleHi}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingAnnouncement({ ...ann })}
                        className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold"
                      >
                        <Edit className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: BROADCAST PUSH NOTIFICATIONS */}
          {/* ========================================================= */}
          {activeTab === 'BROADCAST' && (
            <div className="max-w-2xl bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7A2A1E] text-[#D4A017] flex items-center justify-center font-black">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">समस्त छात्रों को लाइव पुश नोटिफिकेशन</h3>
                  <p className="text-xs text-stone-500">
                    यहाँ से भेजा गया संदेश सभी 55 जिलों के परीक्षार्थियों के स्क्रीन पर तुरंत दिखाई देगा।
                  </p>
                </div>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-500 mb-1">
                    संदेश शीर्षक (Notification Title)
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="उदा: 🔥 MP पटवारी सेट #2 लाइव हो गया है!"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-500 mb-1">
                    संदेश विवरण (Broadcast Message Body)
                  </label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="उदा: सभी परीक्षार्थी आज ही 180 मिनट का नया मॉक टेस्ट दें और ऑल-एमपी रैंक में अपना स्थान देखें..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] font-black text-xs uppercase tracking-wider border-2 border-[#D4A017] shadow-md transition"
                >
                  🚀 लाइव ब्रॉडकास्ट संदेश भेजें (Broadcast Now)
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: STUDY NOTES & PDF CMS */}
          {/* ========================================================= */}
          {activeTab === 'NOTES' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {notes.map(note => (
                  <div 
                    key={note.id}
                    className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                          {note.category}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">{note.fileSize}</span>
                      </div>

                      <h4 className="font-bold text-sm text-[#2D2424] dark:text-white mt-2">
                        {note.titleHi}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{note.summaryHi}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400">{note.pages} पृष्ठ • {note.downloadCount} डाउनलोड</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingNote({ ...note })}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200"
                        >
                          <Edit className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: WEBSITE CONTENT CMS (समस्त टेक्स्ट व सेक्शन संपादक) */}
          {/* ========================================================= */}
          {activeTab === 'WEBSITE_CONTENT' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-amber-500 to-[#7A2A1E] text-white flex items-center justify-center font-black shadow-md shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2D2424] dark:text-white flex items-center gap-2">
                      <span>संपूर्ण वेबसाइट कंटेंट CMS (Master Text Editor)</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-black uppercase">
                        LIVE SYNC
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      होमपेज हेडर, मुख्य बैनर, स्टैट्स, पिलर्स, कैटलॉग व फुटर का एक-एक शब्द यहाँ से बदलें — बिना कोड बदले तुरंत लाइव लागू होगा।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetWebsiteContent}
                    className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                    <span>डिफ़ॉल्ट टेक्स्ट रीसेट</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('home');
                      showToast('🌐 होमपेज पूर्वावलोकन');
                    }}
                    className="px-4 py-2 bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] text-xs font-black rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>होमपेज लाइव देखें</span>
                  </button>
                </div>
              </div>

              {/* CMS Sub-navigation Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 overflow-x-auto text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCmsSubTab('hero')}
                  className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
                    cmsSubTab === 'hero'
                      ? 'bg-[#7A2A1E] text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. मुख्य हीरो व स्टैट्स (Hero & Stats)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('spotlight')}
                  className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
                    cmsSubTab === 'spotlight'
                      ? 'bg-[#7A2A1E] text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>2. स्पॉटलाइट कार्ड व वेलकम बार (Spotlight & Bonus)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('catalog_pillars')}
                  className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
                    cmsSubTab === 'catalog_pillars'
                      ? 'bg-[#7A2A1E] text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3. कैटलॉग व 3 प्रमुख स्तंभ (Pillars & Catalog)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('footer')}
                  className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
                    cmsSubTab === 'footer'
                      ? 'bg-[#7A2A1E] text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>4. फुटर, पता व कानूनी कॉपीराइट (Footer & Legal)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('social')}
                  className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
                    cmsSubTab === 'social'
                      ? 'bg-[#7A2A1E] text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>5. सोशल मीडिया सेक्शन टेक्स्ट (Social Section)</span>
                </button>
              </div>

              {/* Master Content Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  savePlatformSettings(editingSettings);
                  showToast('✅ समस्त वेबसाइट कंटेंट सफलतापूर्वक अपडेट व सुरक्षित हो गया!');
                }}
                className="space-y-6"
              >
                {/* SUB-TAB 1: HERO & STATS */}
                {cmsSubTab === 'hero' && (
                  <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                        होमपेज हीरो बैनर व मुख्य टैगलाइन संपादक
                      </h4>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-black uppercase text-stone-500 mb-1">
                          शीर्ष ट्रस्ट बैज (Hero Top Trust Badge)
                        </label>
                        <input
                          type="text"
                          value={editingSettings.websiteContent?.heroTrustBadgeHi || ''}
                          onChange={(e) => updateWebsiteContent('heroTrustBadgeHi', e.target.value)}
                          placeholder="उदा: 🏆 100% नवीनतम MPESB & MPPSC पाठ्यक्रम 2026"
                          className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-black uppercase text-stone-500 mb-1">
                          मुख्य हीरो शीर्षक (Main Hero Headline / Title)
                        </label>
                        <textarea
                          rows={2}
                          value={editingSettings.websiteContent?.heroTitleHi || ''}
                          onChange={(e) => updateWebsiteContent('heroTitleHi', e.target.value)}
                          placeholder="उदा: मध्यप्रदेश शासन भर्ती परीक्षाओं की प्रामाणिक डिजिटल टेस्ट सीरीज़"
                          className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-black uppercase text-stone-500 mb-1">
                          उप-शीर्षक / विवरण (Hero Subtitle / Description)
                        </label>
                        <textarea
                          rows={3}
                          value={editingSettings.websiteContent?.heroSubtitleHi || ''}
                          onChange={(e) => updateWebsiteContent('heroSubtitleHi', e.target.value)}
                          placeholder="उदा: MPPSC, पटवारी, पुलिस SI/आरक्षक, ग्रुप-4 व्यापम, वनरक्षक एवं TET की तैयारी के लिए सर्वश्रेष्ठ ऑल-एमपी रैंक व AI व्याख्या युक्त मॉक टेस्ट।"
                          className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                        />
                      </div>

                      {/* Hero CTA Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बटन 1: फ्री डेमो बटन टेक्स्ट
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.heroCtaFreeMockHi || ''}
                            onChange={(e) => updateWebsiteContent('heroCtaFreeMockHi', e.target.value)}
                            placeholder="उदा: ⚡ 40 प्रश्नों का डेमो टेस्ट दें"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बटन 2: पैकेज कैटलॉग बटन
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.heroCtaCatalogHi || ''}
                            onChange={(e) => updateWebsiteContent('heroCtaCatalogHi', e.target.value)}
                            placeholder="उदा: 📚 संपूर्ण टेस्ट पैकेज देखें"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बटन 3: ई-नोट्स बटन टेक्स्ट
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.heroCtaNotesHi || ''}
                            onChange={(e) => updateWebsiteContent('heroCtaNotesHi', e.target.value)}
                            placeholder="उदा: 📄 फ्री हस्तलिखित PDF नोट्स"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-xs"
                          />
                        </div>
                      </div>

                      {/* Key Metric Stats Counters */}
                      <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                        <h5 className="font-black text-xs text-[#7A2A1E] dark:text-[#D4A017] uppercase">
                          3 प्रमुख आंकड़े व उपलब्धियां (Hero Key Stats Counters)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Stat 1 */}
                          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                            <label className="block font-black text-[10px] uppercase text-amber-800 dark:text-amber-300">
                              स्टैट 1: संख्या व लेबल
                            </label>
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.heroStat1Value || ''}
                              onChange={(e) => updateWebsiteContent('heroStat1Value', e.target.value)}
                              placeholder="50,000+"
                              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-black text-emerald-600"
                            />
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.heroStat1LabelHi || ''}
                              onChange={(e) => updateWebsiteContent('heroStat1LabelHi', e.target.value)}
                              placeholder="सक्रिय मध्य प्रदेश परीक्षार्थी"
                              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-[11px]"
                            />
                          </div>

                          {/* Stat 2 */}
                          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                            <label className="block font-black text-[10px] uppercase text-amber-800 dark:text-amber-300">
                              स्टैट 2: संख्या व लेबल
                            </label>
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.heroStat2Value || ''}
                              onChange={(e) => updateWebsiteContent('heroStat2Value', e.target.value)}
                              placeholder="98.4%"
                              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-black text-amber-600"
                            />
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.heroStat2LabelHi || ''}
                              onChange={(e) => updateWebsiteContent('heroStat2LabelHi', e.target.value)}
                              placeholder="सटीक परीक्षा पैटर्न मैचिंग"
                              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-[11px]"
                            />
                          </div>

                          {/* Stat 3 */}
                          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                            <label className="block font-black text-[10px] uppercase text-amber-800 dark:text-amber-300">
                              स्टैट 3: संख्या व लेबल
                            </label>
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.heroStat3Value || ''}
                              onChange={(e) => updateWebsiteContent('heroStat3Value', e.target.value)}
                              placeholder="20+"
                              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-black text-rose-600"
                            />
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.heroStat3LabelHi || ''}
                              onChange={(e) => updateWebsiteContent('heroStat3LabelHi', e.target.value)}
                              placeholder="फुल लेंथ AI CBT मॉक सेट्स"
                              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: SPOTLIGHT & WELCOME BONUS */}
                {cmsSubTab === 'spotlight' && (
                  <div className="space-y-6">
                    {/* Spotlight Card Form */}
                    <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                        <Target className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                          हीरो साइड लाइव मॉक टेस्ट स्पॉटलाइट कार्ड (Spotlight Card)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            लाइव पिल टैग (Live Pill Tag)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightLivePillHi || ''}
                            onChange={(e) => updateWebsiteContent('spotlightLivePillHi', e.target.value)}
                            placeholder="🔴 ऑल-एमपी लाइव परीक्षा"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बैज टैग (Badge Tag)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightBadgeHi || ''}
                            onChange={(e) => updateWebsiteContent('spotlightBadgeHi', e.target.value)}
                            placeholder="🔥 2026 स्पेशल बैच"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            कार्ड शीर्षक (Card Title)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightTitleHi || ''}
                            onChange={(e) => updateWebsiteContent('spotlightTitleHi', e.target.value)}
                            placeholder="MP पटवारी & MPPSC महा-मॉक टेस्ट"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            कार्ड उप-शीर्षक (Card Subtitle)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightSubtitleHi || ''}
                            onChange={(e) => updateWebsiteContent('spotlightSubtitleHi', e.target.value)}
                            placeholder="200 प्रश्न • 180 मिनट • ऑल-एमपी रैंक व व्याख्या"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            अटेम्प्टेड छात्र काउंटर टेक्स्ट
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightAttemptedTextHi || ''}
                            onChange={(e) => updateWebsiteContent('spotlightAttemptedTextHi', e.target.value)}
                            placeholder="1,240+ छात्रों ने अभी हल किया"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            स्टार्ट टेस्ट बटन टेक्स्ट
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightButtonHi || ''}
                            onChange={(e) => updateWebsiteContent('spotlightButtonHi', e.target.value)}
                            placeholder="🚀 अभी टेस्ट शुरू करें"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-amber-700 dark:text-amber-400"
                          />
                        </div>
                      </div>

                      {/* 4 Feature Points in Spotlight Card */}
                      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                        <label className="block font-black uppercase text-stone-500">
                          स्पॉटलाइट कार्ड के 4 प्रमुख फीचर्स (4 Bullet Points)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightPillar1Text || ''}
                            onChange={(e) => updateWebsiteContent('spotlightPillar1Text', e.target.value)}
                            placeholder="200 प्रश्नों का पूर्ण मानक टेस्ट"
                            className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightPillar2Text || ''}
                            onChange={(e) => updateWebsiteContent('spotlightPillar2Text', e.target.value)}
                            placeholder="ऑल-एमपी रियल टाइम मेरिट रैंक"
                            className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightPillar3Text || ''}
                            onChange={(e) => updateWebsiteContent('spotlightPillar3Text', e.target.value)}
                            placeholder="प्रत्येक प्रश्न की संपूर्ण व्याख्या व ट्रिक्स"
                            className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.spotlightPillar4Text || ''}
                            onChange={(e) => updateWebsiteContent('spotlightPillar4Text', e.target.value)}
                            placeholder="AI कमजोर विषय विश्लेषण रिपोर्ट"
                            className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* New Student Registration Welcome Bonus Bar */}
                    <div className="bg-white dark:bg-stone-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                        <Gift className="w-5 h-5 text-amber-600" />
                        <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                          नवीन छात्र स्वागत बोनस बैनर (Welcome Bonus Bar)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बैनर शीर्षक (Banner Title)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.regBannerTitleHi || ''}
                            onChange={(e) => updateWebsiteContent('regBannerTitleHi', e.target.value)}
                            placeholder="🎁 नए छात्रों हेतु विशेष स्वागत उपहार"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बैनर उप-शीर्षक (Banner Subtitle)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.regBannerSubtitleHi || ''}
                            onChange={(e) => updateWebsiteContent('regBannerSubtitleHi', e.target.value)}
                            placeholder="अभी रजिस्टर करें और पाएँ 500 बोनस XP और 1 फ्री फुल मॉक टेस्ट"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बटन 1 टेक्स्ट (Free Demo Button)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.regBannerBtn1Hi || ''}
                            onChange={(e) => updateWebsiteContent('regBannerBtn1Hi', e.target.value)}
                            placeholder="🎯 फ्री टेस्ट दें"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            बटन 2 टेक्स्ट (Register / Login Button)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.regBannerBtn2Hi || ''}
                            onChange={(e) => updateWebsiteContent('regBannerBtn2Hi', e.target.value)}
                            placeholder="🔐 रजिस्टर / लॉगिन करें"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: CATALOG & WHY CHOOSE US PILLARS */}
                {cmsSubTab === 'catalog_pillars' && (
                  <div className="space-y-6">
                    {/* Catalog Section Headers */}
                    <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                        <BookPlus className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                          टेस्ट सीरीज़ कैटलॉग सेक्शन हेडर्स (Catalog Section Copy)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            कैटलॉग बैज (Badge)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.catalogBadgeHi || ''}
                            onChange={(e) => updateWebsiteContent('catalogBadgeHi', e.target.value)}
                            placeholder="🎯 MP शासन सरकारी भर्तियाँ"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            कैटलॉग मुख्य शीर्षक (Title)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.catalogTitleHi || ''}
                            onChange={(e) => updateWebsiteContent('catalogTitleHi', e.target.value)}
                            placeholder="समस्त मध्य प्रदेश भर्ती परीक्षा टेस्ट सीरीज़"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            कैटलॉग उप-शीर्षक (Subtitle)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.catalogSubtitleHi || ''}
                            onChange={(e) => updateWebsiteContent('catalogSubtitleHi', e.target.value)}
                            placeholder="नवीनतम परीक्षा पैटर्न एवं सिलेबस के अनुसार तैयार सर्वोत्तम टेस्ट पैकेज"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Us Section & 3 Key Pillars */}
                    <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                        <Award className="w-5 h-5 text-amber-600" />
                        <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                          'परीक्षा सेतु क्यों चुनें' एवं 3 प्रमुख स्तंभ (Why Choose Us Pillars)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            सेक्शन बैज (Badge)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.whyChooseBadgeHi || ''}
                            onChange={(e) => updateWebsiteContent('whyChooseBadgeHi', e.target.value)}
                            placeholder="✨ परीक्षा सेतु की विशेषताएँ"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            सेक्शन मुख्य शीर्षक (Title)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.whyChooseTitleHi || ''}
                            onChange={(e) => updateWebsiteContent('whyChooseTitleHi', e.target.value)}
                            placeholder="मध्य प्रदेश के लाखों परीक्षार्थियों का नंबर-1 भरोसा"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            सेक्शन उप-शीर्षक (Subtitle)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.whyChooseSubtitleHi || ''}
                            onChange={(e) => updateWebsiteContent('whyChooseSubtitleHi', e.target.value)}
                            placeholder="परीक्षा से पहले वास्तविक परीक्षा जैसा अनुभव"
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>

                      {/* 3 Pillars Content Editor */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                        {/* Pillar 1 */}
                        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono font-black text-[10px]">
                            स्तंभ 1 (Pillar 1)
                          </span>
                          <div>
                            <label className="block font-black uppercase text-stone-500 mb-1">
                              शीर्षक (Title)
                            </label>
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.pillar1TitleHi || ''}
                              onChange={(e) => updateWebsiteContent('pillar1TitleHi', e.target.value)}
                              placeholder="100% सटीक MP परीक्षा पैटर्न"
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-black uppercase text-stone-500 mb-1">
                              विवरण (Description)
                            </label>
                            <textarea
                              rows={3}
                              value={editingSettings.websiteContent?.pillar1DescHi || ''}
                              onChange={(e) => updateWebsiteContent('pillar1DescHi', e.target.value)}
                              placeholder="MPESB एवं MPPSC के पिछले 10 वर्षों के हल प्रश्न-पत्रों एवं नवीनतम सिलेबस पर आधारित प्रामाणिक प्रश्न बैंक।"
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                            />
                          </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono font-black text-[10px]">
                            स्तंभ 2 (Pillar 2)
                          </span>
                          <div>
                            <label className="block font-black uppercase text-stone-500 mb-1">
                              शीर्षक (Title)
                            </label>
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.pillar2TitleHi || ''}
                              onChange={(e) => updateWebsiteContent('pillar2TitleHi', e.target.value)}
                              placeholder="ऑल-एमपी रियल टाइम मेरिट रैंक"
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-black uppercase text-stone-500 mb-1">
                              विवरण (Description)
                            </label>
                            <textarea
                              rows={3}
                              value={editingSettings.websiteContent?.pillar2DescHi || ''}
                              onChange={(e) => updateWebsiteContent('pillar2DescHi', e.target.value)}
                              placeholder="टेस्ट सबमिट करते ही 52 ज़िलों के हज़ारों छात्रों में अपनी वास्तविक स्थिति, पर्सेंटाइल व कट-ऑफ तुलना देखें।"
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                            />
                          </div>
                        </div>

                        {/* Pillar 3 */}
                        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                          <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-mono font-black text-[10px]">
                            स्तंभ 3 (Pillar 3)
                          </span>
                          <div>
                            <label className="block font-black uppercase text-stone-500 mb-1">
                              शीर्षक (Title)
                            </label>
                            <input
                              type="text"
                              value={editingSettings.websiteContent?.pillar3TitleHi || ''}
                              onChange={(e) => updateWebsiteContent('pillar3TitleHi', e.target.value)}
                              placeholder="AI व्यक्तिगत रिपोर्ट व ई-नोट्स"
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-black uppercase text-stone-500 mb-1">
                              विवरण (Description)
                            </label>
                            <textarea
                              rows={3}
                              value={editingSettings.websiteContent?.pillar3DescHi || ''}
                              onChange={(e) => updateWebsiteContent('pillar3DescHi', e.target.value)}
                              placeholder="कमजोर विषयों की पहचान, 7-दिवसीय अध्ययन योजना और विषयवार प्रीमियम हस्तलिखित PDF नोट्स तुरंत डाउनलोड।"
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: FOOTER & LEGAL CONTENT */}
                {cmsSubTab === 'footer' && (
                  <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <FileText className="w-5 h-5 text-rose-600" />
                      <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                        फुटर विवरण, ऑफिस पता व सर्वाधिकार कॉपीराइट (Footer CMS)
                      </h4>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-black uppercase text-stone-500 mb-1">
                          फुटर संस्था परिचय (Footer About Description)
                        </label>
                        <textarea
                          rows={3}
                          value={editingSettings.websiteContent?.footerAboutHi || ''}
                          onChange={(e) => updateWebsiteContent('footerAboutHi', e.target.value)}
                          placeholder="मध्यप्रदेश की समस्त राज्य स्तरीय भर्ती परीक्षाओं (MPPSC, पटवारी, पुलिस SI/आरक्षक, व्यापम ESB, वनरक्षक, TET) के लिए समर्पित डिजिटल मॉक टेस्ट एवं AI मूल्यांकन मंच।"
                          className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            ऑफिस पता (Office Location / Address)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.footerAddressHi || ''}
                            onChange={(e) => updateWebsiteContent('footerAddressHi', e.target.value)}
                            placeholder="परीक्षा सेतु भवन, एमपी नगर जोन-II, भोपाल (म.प्र.) 462011"
                            className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            कॉपीराइट पाठ (Copyright Notice Text)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.footerCopyrightText || ''}
                            onChange={(e) => updateWebsiteContent('footerCopyrightText', e.target.value)}
                            placeholder="© 2026 MP परीक्षा सेतु (MP Pariksha Setu) • सर्वाधिकार सुरक्षित।"
                            className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 5: SOCIAL SECTION TEXT */}
                {cmsSubTab === 'social' && (
                  <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <Share2 className="w-5 h-5 text-purple-600" />
                      <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider">
                        होमपेज सोशल मीडिया सेक्शन हेडिंग्स व विवरण (Social Section Text)
                      </h4>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            सोशल सेक्शन बैज (Badge Tag)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.socialSectionBadgeHi || ''}
                            onChange={(e) => updateWebsiteContent('socialSectionBadgeHi', e.target.value)}
                            placeholder="📲 24x7 एक्टिव कम्युनिटी"
                            className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-black uppercase text-stone-500 mb-1">
                            सोशल सेक्शन मुख्य शीर्षक (Main Heading)
                          </label>
                          <input
                            type="text"
                            value={editingSettings.websiteContent?.socialSectionTitleHi || ''}
                            onChange={(e) => updateWebsiteContent('socialSectionTitleHi', e.target.value)}
                            placeholder="मध्य प्रदेश के लाखों परीक्षार्थियों से जुड़ें"
                            className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-black uppercase text-stone-500 mb-1">
                          सोशल सेक्शन उप-शीर्षक / विवरण (Subtitle / Description)
                        </label>
                        <textarea
                          rows={2}
                          value={editingSettings.websiteContent?.socialSectionSubtitleHi || ''}
                          onChange={(e) => updateWebsiteContent('socialSectionSubtitleHi', e.target.value)}
                          placeholder="दैनिक 50 क्विज़, हस्तलिखित नोट्स PDF, कट-ऑफ विश्लेषण व तत्काल जॉब अलर्ट हेतु आधिकारिक चैनलों से जुड़ें।"
                          className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Master Save Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] font-black text-sm uppercase tracking-wider border-2 border-[#D4A017] shadow-xl transition hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  <span>💾 समस्त वेबसाइट कंटेंट सुरक्षित करें (Save Website Content)</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: SOCIAL MEDIA & COMMUNITY LINKS CMS */}
          {/* ========================================================= */}
          {activeTab === 'SOCIAL' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-blue-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2D2424] dark:text-white flex items-center gap-2">
                      <span>सोशल मीडिया व कम्युनिटी लिंक्स CMS</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-black uppercase">
                        DYNAMIC CMS
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      प्रत्येक सोशल चैनल (WhatsApp, Telegram, YouTube, Instagram, Facebook) के लिंक्स, सदस्य संख्या, बैज एवं विवरण अपनी इच्छानुसार बदलें।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetSocialChannels}
                    className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                    <span>डिफ़ॉल्ट रीसेट</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('social-community-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('home');
                      }
                      showToast('🌐 सोशल मीडिया सेक्शन लाइव पोर्टल पर देखें');
                    }}
                    className="px-4 py-2 bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] text-xs font-black rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>लाइव पोर्टल पर देखें</span>
                  </button>
                </div>
              </div>

              {/* Social Channels Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  savePlatformSettings(editingSettings);
                  showToast('✅ सभी सोशल मीडिया चैनल्स व लिंक्स सफलतापूर्वक सहेज लिए गए!');
                }}
                className="space-y-6"
              >
                {/* Editable Channel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(editingSettings.socialChannels || []).map((ch, idx) => {
                    const iconColor = ch.id === 'whatsapp' ? 'bg-[#25D366]'
                      : ch.id === 'telegram' ? 'bg-[#229ED9]'
                      : ch.id === 'youtube' ? 'bg-[#FF0000]'
                      : ch.id === 'instagram' ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                      : 'bg-[#1877F2]';

                    const borderAccent = ch.id === 'whatsapp' ? 'border-emerald-200 dark:border-emerald-900/60'
                      : ch.id === 'telegram' ? 'border-sky-200 dark:border-sky-900/60'
                      : ch.id === 'youtube' ? 'border-red-200 dark:border-red-900/60'
                      : ch.id === 'instagram' ? 'border-rose-200 dark:border-rose-900/60'
                      : 'border-blue-200 dark:border-blue-900/60';

                    return (
                      <div 
                        key={ch.id || idx}
                        className={`p-5 bg-white dark:bg-stone-900 border-2 ${borderAccent} rounded-3xl space-y-4 shadow-sm ${
                          ch.id === 'whatsapp' ? 'md:col-span-2' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${iconColor} text-white flex items-center justify-center shadow`}>
                              {ch.id === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                              {ch.id === 'telegram' && <Send className="w-5 h-5" />}
                              {ch.id === 'youtube' && <Youtube className="w-5 h-5" />}
                              {ch.id === 'instagram' && <Instagram className="w-5 h-5" />}
                              {ch.id === 'facebook' && <Facebook className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-[#2D2424] dark:text-white">
                                {ch.nameHi}
                              </h4>
                              <span className="text-[10px] text-stone-500 font-bold font-mono">
                                ID: {ch.id}
                              </span>
                            </div>
                          </div>

                          {ch.url && (
                            <a
                              href={ch.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 transition"
                              title="टेस्ट करें"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                              प्लेटफॉर्म नाम (Hindi Name)
                            </label>
                            <input
                              type="text"
                              value={ch.nameHi || ''}
                              onChange={(e) => updateSocialChannel(idx, { nameHi: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                              सदस्य / हैंडल टैग (Handle / Count)
                            </label>
                            <input
                              type="text"
                              value={ch.handle || ''}
                              onChange={(e) => updateSocialChannel(idx, { handle: e.target.value })}
                              placeholder="उदा: 68K+ मेंबर्स"
                              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                              बैज टेक्स्ट (Badge)
                            </label>
                            <input
                              type="text"
                              value={ch.badgeHi || ''}
                              onChange={(e) => updateSocialChannel(idx, { badgeHi: e.target.value })}
                              placeholder="उदा: ⚡ तत्काल जॉब अलर्ट्स"
                              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                              आधिकारिक लिंक URL (Direct Link)
                            </label>
                            <input
                              type="url"
                              value={ch.url || ''}
                              onChange={(e) => {
                                updateSocialChannel(idx, { url: e.target.value });
                                // Keep root platformSettings urls in sync
                                if (ch.id === 'whatsapp') setEditingSettings(prev => ({ ...prev, whatsappCommunityUrl: e.target.value }));
                                if (ch.id === 'telegram') setEditingSettings(prev => ({ ...prev, telegramUrl: e.target.value }));
                                if (ch.id === 'youtube') setEditingSettings(prev => ({ ...prev, youtubeUrl: e.target.value }));
                                if (ch.id === 'instagram') setEditingSettings(prev => ({ ...prev, instagramUrl: e.target.value }));
                                if (ch.id === 'facebook') setEditingSettings(prev => ({ ...prev, facebookUrl: e.target.value }));
                              }}
                              placeholder="https://..."
                              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="text-xs">
                          <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                            विवरण (Description)
                          </label>
                          <input
                            type="text"
                            value={ch.descHi || ''}
                            onChange={(e) => updateSocialChannel(idx, { descHi: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] font-black text-sm uppercase tracking-wider border-2 border-[#D4A017] shadow-xl transition hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>💾 सभी सोशल मीडिया लिंक्स व विवरण सहेजें (Save Social CMS)</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 12: PLATFORM SETTINGS & BRANDING */}
          {/* ========================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="max-w-3xl bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="w-11 h-11 rounded-2xl bg-[#7A2A1E] text-[#D4A017] flex items-center justify-center font-black shadow">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2D2424] dark:text-white">प्लेटफ़ॉर्म ब्रांडिंग व गेटवे सेटिंग्स</h3>
                  <p className="text-xs text-stone-500">हेल्पलाइन, टिकर टेक्स्ट, AI इवैल्यूएशन व पेमेंट मोड कॉन्फ़िगर करें।</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  savePlatformSettings(editingSettings);
                  showToast('✅ प्लेटफ़ॉर्म सेटिंग्स सफलतापूर्वक सहेज ली गईं!');
                }}
                className="space-y-4 text-xs"
              >
                {/* Logo Management Section */}
                <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/30 border-2 border-[#D4A017]/60 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>वेबसाइट लोगो प्रबंधन (Website Official Emblem & Logo)</span>
                      </h4>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        अपनी डिवाइस (मोबाइल/कंप्यूटर) से पोर्टल का लोगो चुनें। यह तुरंत हेडर, फुटर व वेबसाइट पर सक्रिय हो जाएगा।
                      </p>
                    </div>
                    {editingSettings.logoUrl && editingSettings.logoUrl !== '/logo.svg' && (
                      <button
                        type="button"
                        onClick={async () => {
                          setEditingSettings({ ...editingSettings, logoUrl: '/logo.svg' });
                          await uploadLogo('/logo.svg');
                          showToast('✅ डिफ़ॉल्ट परीक्षा सेतु लोगो रीसेट किया गया');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-300 transition text-xs shrink-0 flex items-center gap-1.5"
                      >
                        <span>डिफ़ॉल्ट लोगो रीसेट करें</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                    {/* Logo Live Preview */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border-2 border-[#D4A017]/40 w-32 h-32 shrink-0 shadow-md">
                      <img 
                        src={editingSettings.logoUrl || '/logo.svg'} 
                        alt="Logo Preview" 
                        className="max-h-24 max-w-24 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.svg';
                        }}
                      />
                      <span className="text-[9px] text-[#7A2A1E] dark:text-[#D4A017] font-bold mt-1">Live Preview</span>
                    </div>

                    {/* Logo File Upload Trigger */}
                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 text-xs">
                          नया लोगो अपलोड करें (PNG / JPG / SVG / WebP - अधिकतम 5MB):
                        </label>
                        <label className="flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-dashed border-[#D4A017] bg-white dark:bg-stone-900 hover:bg-amber-50/60 cursor-pointer transition font-bold text-[#7A2A1E] dark:text-[#D4A017] text-xs shadow-xs">
                          <Plus className="w-5 h-5" />
                          <span>डिवाइस से फ़ाइल चुनें व लोगो सेट करें (Select & Upload Logo)</span>
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                            onChange={handleLogoFileUpload}
                            className="hidden" 
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>अपलोड करते ही लोगो सभी छात्रों व हेडर/फुटर में स्वतः लाइव हो जाता है।</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase text-stone-500 mb-1">पोर्टल का नाम (Site Title)</label>
                    <input 
                      type="text"
                      value={editingSettings.siteTitle}
                      onChange={(e) => setEditingSettings({ ...editingSettings, siteTitle: e.target.value })}
                      className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-stone-500 mb-1">हेल्पलाइन WhatsApp नंबर</label>
                    <input 
                      type="text"
                      value={editingSettings.helplineWhatsapp}
                      onChange={(e) => setEditingSettings({ ...editingSettings, helplineWhatsapp: e.target.value })}
                      className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">शीर्ष घोषणा टिकर टेक्स्ट (Hindi Ticker)</label>
                  <input 
                    type="text"
                    value={editingSettings.topTickerTextHi}
                    onChange={(e) => setEditingSettings({ ...editingSettings, topTickerTextHi: e.target.value })}
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase text-stone-500 mb-1">सपोर्ट ईमेल</label>
                    <input 
                      type="email"
                      value={editingSettings.supportEmail}
                      onChange={(e) => setEditingSettings({ ...editingSettings, supportEmail: e.target.value })}
                      className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-stone-500 mb-1">रेज़रपे पेमेंट गेटवे मोड</label>
                    <select
                      value={editingSettings.paymentGatewayMode}
                      onChange={(e) => setEditingSettings({ ...editingSettings, paymentGatewayMode: e.target.value as any })}
                      className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                    >
                      <option value="LIVE">LIVE (वास्तविक भुगतान)</option>
                      <option value="TEST">TEST SANDBOX (परीक्षण)</option>
                    </select>
                  </div>
                </div>

                {/* Social Media Quick Links in Settings */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>सोशल मीडिया हैंडल्स (Social Links)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('SOCIAL')}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <span>विस्तृत सोशल CMS खोलें</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-500 mb-1 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>WhatsApp ग्रुप / कम्युनिटी लिंक</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        value={editingSettings.whatsappCommunityUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, whatsappCommunityUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-500 mb-1 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-sky-500" />
                        <span>Telegram चैनल लिंक</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://t.me/mpparikshasetu_mp"
                        value={editingSettings.telegramUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, telegramUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-500 mb-1 flex items-center gap-1.5">
                        <Youtube className="w-3.5 h-3.5 text-red-600" />
                        <span>YouTube चैनल लिंक</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/@mpparikshasetu"
                        value={editingSettings.youtubeUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, youtubeUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-500 mb-1 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-rose-500" />
                        <span>Instagram प्रोफाइल लिंक</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/mpparikshasetu_official"
                        value={editingSettings.instagramUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, instagramUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-500 mb-1 flex items-center gap-1.5">
                        <Facebook className="w-3.5 h-3.5 text-blue-600" />
                        <span>Facebook पेज / ग्रुप लिंक</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/groups/mpparikshasetu"
                        value={editingSettings.facebookUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, facebookUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingSettings.enableAiEvaluation}
                      onChange={(e) => setEditingSettings({ ...editingSettings, enableAiEvaluation: e.target.checked })}
                      className="w-4 h-4 rounded text-[#7A2A1E] focus:ring-0"
                    />
                    <span className="font-bold">AI शैक्षणिक विश्लेषण व 7-दिवसीय अध्ययन योजना सक्रिय रखें</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingSettings.topTickerEnabled}
                      onChange={(e) => setEditingSettings({ ...editingSettings, topTickerEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-[#7A2A1E] focus:ring-0"
                    />
                    <span className="font-bold">शीर्ष स्क्रॉलिंग फ्लैश टिकर बार प्रदर्शित करें</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] font-black text-sm uppercase tracking-wider border-2 border-[#D4A017] shadow-md transition"
                >
                  💾 सेटिंग्स सहेजें (Save Configuration)
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 0: NAVIGATION MENU ITEM CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                <span>{editingMenuItem.id ? 'नेविगेशन मेन्यू संपादित करें' : 'नया नेविगेशन मेन्यू आइटम जोड़ें'}</span>
              </h3>
              <button 
                onClick={() => setEditingMenuItem(null)} 
                className="p-1 text-stone-400 hover:text-black dark:hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Form */}
            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              
              {/* Menu Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">
                    मेन्यू का नाम (Hindi Label) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा: 🎯 40-प्रश्न फ्री टेस्ट"
                    value={editingMenuItem.labelHi || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, labelHi: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">
                    अंग्रेजी नाम (English Label)
                  </label>
                  <input 
                    type="text" 
                    placeholder="उदा: Free 40-Q Mock"
                    value={editingMenuItem.labelEn || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, labelEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium"
                  />
                </div>
              </div>

              {/* Placement & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">
                    मेन्यू कहाँ दिखेगा? (Placement) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingMenuItem.placement || 'top'}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, placement: e.target.value as MenuPlacement })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  >
                    <option value="top">🔝 शीर्ष हेडर मेन्यू (Top Header)</option>
                    <option value="footer">🔻 फुटर मेन्यू लिंक्स (Footer Quick Navigation)</option>
                    <option value="bottom">📱 निचला मोबाइल नेव (Mobile Bottom Navigation)</option>
                    <option value="both">✨ शीर्ष हेडर एवं फुटर दोनों (Top Header & Footer)</option>
                    <option value="all">🌐 समस्त मेन्यू (Header, Mobile & Footer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">
                    क्रम संख्या (Display Order)
                  </label>
                  <input 
                    type="number" 
                    value={editingMenuItem.order || 1}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Icon Picker Grid */}
              <div>
                <label className="block font-black uppercase text-stone-500 mb-1.5 flex items-center justify-between">
                  <span>मेन्यू आइकन चुनें (Select Icon)</span>
                  <span className="font-mono text-amber-600 font-bold">
                    चयनित: {editingMenuItem.iconName || 'Compass'}
                  </span>
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 max-h-36 overflow-y-auto">
                  {(Object.keys(NAV_ICON_MAP) as NavIconKey[]).map(iconKey => {
                    const isSelected = (editingMenuItem.iconName || 'Compass') === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setEditingMenuItem({ ...editingMenuItem, iconName: iconKey })}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition ${
                          isSelected
                            ? 'bg-[#7A2A1E] text-[#D4A017] border-[#D4A017] shadow-xs scale-105'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                        }`}
                        title={iconKey}
                      >
                        <DynamicNavIcon name={iconKey} className="w-4 h-4" />
                        <span className="text-[9px] truncate max-w-full font-mono">{iconKey.slice(0, 4)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Type & Action Destination */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black uppercase text-stone-500 mb-1">
                      क्लिक करने पर क्या खुलेगा? (Target Type)
                    </label>
                    <select
                      value={editingMenuItem.targetType || 'view'}
                      onChange={(e) => {
                        const newType = e.target.value as MenuTargetType;
                        let defaultVal = 'home';
                        if (newType === 'category') defaultVal = 'patwari';
                        if (newType === 'modal') defaultVal = 'notesModal';
                        if (newType === 'external') defaultVal = '';
                        setEditingMenuItem({ 
                          ...editingMenuItem, 
                          targetType: newType, 
                          targetValue: defaultVal 
                        });
                      }}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                    >
                      <option value="view">🌐 मुख्य स्क्रीन व्यू (Main App View)</option>
                      <option value="category">🏛️ परीक्षा श्रेणी (Exam Category Filter)</option>
                      <option value="modal">🪟 पॉपअप विंडो (Popup Modal)</option>
                      <option value="external">🔗 बाहरी वेब लिंक (External URL)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black uppercase text-stone-500 mb-1">
                      गंतव्य (Target Value)
                    </label>
                    
                    {/* View Options */}
                    {editingMenuItem.targetType === 'view' && (
                      <select
                        value={editingMenuItem.targetValue || 'home'}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, targetValue: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                      >
                        <option value="home">🏠 मुख्य होमपेज (Home)</option>
                        <option value="freeMockTest">🎯 40-प्रश्न फ्री मॉक टेस्ट (Free 40-Q Mock)</option>
                        <option value="catalog">📚 टेस्ट सीरीज़ कैटलॉग (Catalog)</option>
                        <option value="leaderboard">🏆 ऑल-मध्य प्रदेश लीडरबोर्ड (Leaderboard)</option>
                        <option value="notes">📄 ई-नोट्स व हस्तलिखित पीडीएफ (Notes)</option>
                        <option value="dashboard">👤 छात्र डैशबोर्ड (Student Dashboard)</option>
                        <option value="admin">⚙️ सुपर एडमिन कंसोल (Admin Console)</option>
                      </select>
                    )}

                    {/* Category Options */}
                    {editingMenuItem.targetType === 'category' && (
                      <select
                        value={editingMenuItem.targetValue || 'patwari'}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, targetValue: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                      >
                        <option value="patwari">🏛️ MP पटवारी 2026</option>
                        <option value="mppsc">🏛️ MPPSC सिविल सेवा</option>
                        <option value="police">👮 MP पुलिस SI / आरक्षक</option>
                        <option value="vyapam">📝 MP ESB व्यापम ग्रुप-4</option>
                        <option value="vanrakshak">🌲 वनरक्षक व जेल प्रहरी</option>
                        <option value="teaching">🎓 MP शिक्षक पात्रता TET</option>
                      </select>
                    )}

                    {/* Modal Options */}
                    {editingMenuItem.targetType === 'modal' && (
                      <select
                        value={editingMenuItem.targetValue || 'notesModal'}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, targetValue: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                      >
                        <option value="notesModal">📄 हस्तलिखित ई-नोट्स पॉपअप (Notes Modal)</option>
                        <option value="remindersModal">⏰ दैनिक अध्ययन अलार्म पॉपअप (Reminders Modal)</option>
                        <option value="authModal">🔐 छात्र लॉगिन व रजिस्ट्रेशन पॉपअप (Auth Modal)</option>
                      </select>
                    )}

                    {/* External Link */}
                    {editingMenuItem.targetType === 'external' && (
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editingMenuItem.externalUrl || ''}
                        onChange={(e) => setEditingMenuItem({ 
                          ...editingMenuItem, 
                          externalUrl: e.target.value,
                          targetValue: e.target.value
                        })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Badge & Special Highlighting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">
                    बैज टेक्स्ट (Badge Text - e.g. HOT, NEW, 40 Qs)
                  </label>
                  <input 
                    type="text" 
                    placeholder="उदा: 🔥 40 Qs या PDF"
                    value={editingMenuItem.badgeTextHi || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, badgeTextHi: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingMenuItem.highlight || false}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, highlight: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                    <span className="font-bold text-stone-700 dark:text-stone-300">
                      ⭐ चमकीला गोल्डन हाइलाइट दें
                    </span>
                  </label>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-[#D4A017]/60 flex items-center justify-between">
                <div>
                  <div className="font-black text-amber-950 dark:text-amber-200 text-xs">
                    मेन्यू लाइव विजिबिलिटी (Active Status)
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    सक्रिय रखने पर तुरंत छात्रों को शीर्ष हेडर या बॉटम मेन्यू में दिखेगा।
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isActive !== false}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-stone-600 dark:text-stone-300"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black border border-[#D4A017] shadow-sm hover:bg-[#5E1F16] transition"
                >
                  💾 मेन्यू सहेजें (Save Menu Item)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: BANNER CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <span>{editingBanner.id ? 'बैनर संपादित करें' : 'नया होमपेज बैनर जोड़ें'}</span>
              </h3>
              <button 
                onClick={() => setEditingBanner(null)} 
                className="p-1 text-stone-400 hover:text-black dark:hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">बैनर शीर्षक (Hindi Title)</label>
                <input 
                  type="text" 
                  required
                  placeholder="उदा: MP पटवारी 2026 महाभर्ती — 20 फुल मॉक टेस्ट"
                  value={editingBanner.titleHi || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, titleHi: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">उप-शीर्षक (Hindi Subtitle)</label>
                <input 
                  type="text" 
                  placeholder="उदा: 200 प्रश्न प्रति टेस्ट • AI रिपोर्ट • ऑल-एमपी रैंक"
                  value={editingBanner.subtitleHi || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitleHi: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">इमेज URL (Image URL / Poster)</label>
                <input 
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingBanner.imageUrl || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                />
              </div>

              {/* Live Image Preview */}
              {editingBanner.imageUrl && (
                <div className="p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden">
                  <span className="text-[10px] font-bold text-stone-500 block mb-1">लाइव इमेज पूर्वावलोकन (Preview):</span>
                  <img 
                    src={editingBanner.imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">बैज टैग (Badge)</label>
                  <input 
                    type="text"
                    placeholder="🔥 बेस्ट सेलर"
                    value={editingBanner.badgeText || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badgeText: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">क्रम संख्या (Order)</label>
                  <input 
                    type="number"
                    value={editingBanner.order || 1}
                    onChange={(e) => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-stone-600"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black border border-[#D4A017] shadow-sm"
                >
                  💾 बैनर सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TEST SERIES CREATE / EDIT WITH THUMBNAIL */}
      {/* ========================================================= */}
      {editingSeries && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <BookPlus className="w-5 h-5 text-[#7A2A1E]" />
                <span>{editingSeries.id ? 'टेस्ट सीरीज़ व थंबनेल संपादित करें' : 'नई टेस्ट सीरीज़ बनाएँ'}</span>
              </h3>
              <button 
                onClick={() => setEditingSeries(null)} 
                className="p-1 text-stone-400 hover:text-black dark:hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSeries} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">सीरीज़ शीर्षक (Hindi Title)</label>
                <input 
                  type="text" 
                  required
                  placeholder="उदा: म.प्र. पटवारी 2026 संपूर्ण मॉक टेस्ट सीरीज़"
                  value={editingSeries.titleHi || ''}
                  onChange={(e) => setEditingSeries({ ...editingSeries, titleHi: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              {/* Thumbnail & Banner Image inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">थंबनेल इमेज URL (Card Thumbnail)</label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    value={editingSeries.thumbnailUrl || ''}
                    onChange={(e) => setEditingSeries({ ...editingSeries, thumbnailUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">बैज टैग (Badge Tag)</label>
                  <input 
                    type="text"
                    placeholder="🔥 म.प्र. नंबर-1 सीरीज़"
                    value={editingSeries.badgeTagHi || ''}
                    onChange={(e) => setEditingSeries({ ...editingSeries, badgeTagHi: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>
              </div>

              {/* Thumbnail live preview */}
              {editingSeries.thumbnailUrl && (
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-stone-500 block mb-1">थंबनेल पूर्वावलोकन (Preview):</span>
                  <img 
                    src={editingSeries.thumbnailUrl} 
                    alt="Thumbnail preview" 
                    className="h-28 w-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">ऑफर मूल्य (₹)</label>
                  <input 
                    type="number"
                    required
                    value={editingSeries.price || ''}
                    onChange={(e) => setEditingSeries({ ...editingSeries, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">मूल कीमत (₹)</label>
                  <input 
                    type="number"
                    value={editingSeries.originalPrice || ''}
                    onChange={(e) => setEditingSeries({ ...editingSeries, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-stone-400 line-through"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">कुल टेस्ट</label>
                  <input 
                    type="number"
                    value={editingSeries.totalTests || 20}
                    onChange={(e) => setEditingSeries({ ...editingSeries, totalTests: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">समय (मिनट)</label>
                  <input 
                    type="number"
                    value={editingSeries.durationMinutes || 180}
                    onChange={(e) => setEditingSeries({ ...editingSeries, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">विवरण (Description)</label>
                <textarea 
                  rows={3}
                  value={editingSeries.descriptionHi || ''}
                  onChange={(e) => setEditingSeries({ ...editingSeries, descriptionHi: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-[#D4A017]/60 flex items-center justify-between">
                <div>
                  <div className="font-black text-amber-950 dark:text-amber-200 text-xs">
                    वेबसाइट होमपेज विजिबिलिटी (Live Status)
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    सक्रिय रखने पर छात्र होमपेज व कैटलॉग पर देख व खरीद सकेंगे।
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSeries.isActive !== false}
                    onChange={(e) => setEditingSeries({ ...editingSeries, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingSeries(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-stone-600"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black border border-[#D4A017] shadow-sm"
                >
                  💾 टेस्ट सीरीज़ सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: QUESTION CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-amber-600" />
                <span>{editingQuestion.id ? 'प्रश्न संपादित करें' : 'नया प्रश्न जोड़ें'}</span>
              </h3>
              <button 
                onClick={() => setEditingQuestion(null)} 
                className="p-1 text-stone-400 hover:text-black dark:hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">विषय (Subject)</label>
                  <select
                    value={editingQuestion.subject || 'म.प्र. सामान्य ज्ञान'}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, subject: e.target.value, section: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  >
                    <option value="म.प्र. सामान्य ज्ञान">म.प्र. सामान्य ज्ञान</option>
                    <option value="सामान्य हिन्दी">सामान्य हिन्दी</option>
                    <option value="सामान्य गणित">सामान्य गणित</option>
                    <option value="कंप्यूटर विज्ञान">कंप्यूटर विज्ञान</option>
                    <option value="सामान्य प्रबंधन">सामान्य प्रबंधन</option>
                    <option value="सामान्य विज्ञान">सामान्य विज्ञान</option>
                    <option value="सामान्य तार्किक योग्यता">सामान्य तार्किक योग्यता</option>
                    <option value="सामान्य अंग्रेजी">सामान्य अंग्रेजी</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black uppercase text-stone-500 mb-1">टॉपिक (Topic)</label>
                  <input 
                    type="text"
                    placeholder="उदा: नदियाँ व जलप्रपात"
                    value={editingQuestion.topic || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">प्रश्न का हिंदी पाठ (Question in Hindi)</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="प्रश्न यहाँ लिखें..."
                  value={editingQuestion.questionHi || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionHi: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block font-black uppercase text-stone-500">4 बहुविकल्पीय उत्तर (4 Options)</label>
                {['A', 'B', 'C', 'D'].map((letter, idx) => {
                  const opts = editingQuestion.optionsHi || ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D'];
                  const isCorrect = (editingQuestion.correctOption ?? 0) === idx;

                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion({ ...editingQuestion, correctOption: idx })}
                        className={`w-8 h-8 rounded-xl font-black text-xs shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600'
                        }`}
                        title="सही उत्तर के रूप में सेट करें"
                      >
                        {letter}
                      </button>
                      <input 
                        type="text"
                        required
                        value={opts[idx] || ''}
                        onChange={(e) => {
                          const updated = [...opts];
                          updated[idx] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, optionsHi: updated });
                        }}
                        className={`flex-1 p-2 rounded-xl border text-xs font-medium ${
                          isCorrect ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">विस्तृत व्याख्या व ट्रिक्स (Detailed Solution)</label>
                <textarea 
                  rows={3}
                  placeholder="हल एवं महत्वपूर्ण ट्रिक्स यहाँ लिखें..."
                  value={editingQuestion.explanationHi || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanationHi: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-stone-600"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black border border-[#D4A017] shadow-sm"
                >
                  💾 प्रश्न सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: PASSWORD RESET MODAL */}
      {/* ========================================================= */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-stone-700 dark:text-stone-300" />
              <span>पासवर्ड रीसेट — {passwordModalUser.name}</span>
            </h3>
            <p className="text-xs text-stone-500">
              इस छात्र के लिए नया पासवर्ड सेट करें:
            </p>
            <input 
              type="text"
              value={newPasswordVal}
              onChange={(e) => setNewPasswordVal(e.target.value)}
              className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold text-sm"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPasswordModalUser(null)}
                className="w-1/3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => {
                  resetStudentPassword(passwordModalUser.id, newPasswordVal);
                  setPasswordModalUser(null);
                }}
                className="w-2/3 py-2 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black text-xs"
              >
                नया पासवर्ड लागू करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: BONUS XP MODAL */}
      {/* ========================================================= */}
      {xpModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>बोनस XP प्रदान करें — {xpModalUser.name}</span>
            </h3>
            <p className="text-xs text-stone-500">
              छात्र के खाते में जोड़ने हेतु XP अंक दर्ज करें:
            </p>
            <input 
              type="number"
              value={bonusXpVal}
              onChange={(e) => setBonusXpVal(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold text-sm text-amber-600"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setXpModalUser(null)}
                className="w-1/3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => {
                  grantStudentXp(xpModalUser.id, bonusXpVal);
                  setXpModalUser(null);
                }}
                className="w-2/3 py-2 rounded-xl bg-amber-600 text-white font-black text-xs"
              >
                +XP छात्र को जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
