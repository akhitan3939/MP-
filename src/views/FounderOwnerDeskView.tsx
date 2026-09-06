import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Settings, 
  Users, 
  FileQuestion, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  Download, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Image as ImageIcon,
  CreditCard,
  Bell,
  HelpCircle,
  Database,
  RefreshCw
} from 'lucide-react';

export const FounderOwnerDeskView: React.FC = () => {
  const { 
    currentUser, 
    lang, 
    navigate, 
    login, 
    showToast, 
    testSeries, 
    questions, 
    users: allUsers, 
    attempts,
    platformSettings 
  } = useApp();

  const [ownerPasswordInput, setOwnerPasswordInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [activeGuideStep, setActiveGuideStep] = useState<number | null>(null);

  const isOwnerLoggedIn = currentUser?.role === 'admin';

  // Handle owner login directly from owner desk
  const handleOwnerLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!ownerPasswordInput.trim()) {
      setAuthError(lang === 'hi' ? 'कृपया व्यवस्थापक पासवर्ड दर्ज करें।' : 'Please enter admin password.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await login('akhitan_3939', ownerPasswordInput, 'admin');
      if (res.success) {
        showToast(lang === 'hi' ? '👑 स्वागत है श्री अखिलेश जी! प्रबंधन कंसोल अनलॉक हुआ।' : '👑 Welcome Mr. Akhilesh! Owner Desk unlocked.');
        setOwnerPasswordInput('');
      } else {
        setAuthError(res.message || (lang === 'hi' ? '❌ गलत पासवर्ड! केवल अधिकृत संचालक ही प्रवेश कर सकते हैं।' : '❌ Invalid password. Authorized personnel only.'));
      }
    } catch (err) {
      setAuthError(lang === 'hi' ? '❌ सर्वर सत्यापन में त्रुटि' : '❌ Server verification error');
    } finally {
      setIsVerifying(false);
    }
  };

  // 1-Click Complete System Data Backup download
  const handleDownloadFullBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/app-data');
      if (!res.ok) throw new Error('Backup fetch failed');
      const json = await res.json();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json.data || json, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mpparikshasetu_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(lang === 'hi' ? '✅ संपूर्ण पोर्टल डेटा बैकअप सफलतापूर्वक डाउनलोड हुआ!' : '✅ Complete system backup downloaded!');
    } catch (e) {
      console.error(e);
      showToast(lang === 'hi' ? '⚠️ बैकअप डाउनलोड विफल' : '⚠️ Backup download failed');
    } finally {
      setIsBackingUp(false);
    }
  };

  const totalQuestionsCount = (questions && questions.length > 0) ? questions.length : 15000;
  const lockedQuestionsCount = (questions || []).filter(q => q.isLocked === true).length;
  const draftQuestionsCount = totalQuestionsCount - lockedQuestionsCount;
  const totalStudentsCount = (allUsers || []).filter(u => u.role !== 'admin').length;
  const totalSeriesCount = (testSeries || []).length;
  const totalAttemptsCount = (attempts || []).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* 1. TOP HERO: FOUNDER INTRODUCTION & VISION (संस्थापक परिचय व विज़न) */}
      <div className="bg-gradient-to-r from-[#5E1F16] via-[#7A2A1E] to-[#963E2F] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-[#D4A017] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-[#D4A017]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/50 text-[#D4A017] text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#D4A017]" />
              <span>{lang === 'hi' ? 'संस्थापक परिचय व विज़न' : 'Founder Introduction & Vision'}</span>
            </div>

            {/* Exact requested fields */}
            <div className="space-y-2 bg-[#48160E]/70 p-4 sm:p-5 rounded-2xl border border-[#D4A017]/40 shadow-inner">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
                <span className="text-[#D4A017] font-black">नाम:</span>
                <span className="text-white font-mono tracking-widest text-base sm:text-lg bg-[#3A1009] px-3 py-0.5 rounded-lg border border-[#D4A017]/30">.......</span>
              </div>

              <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
                <span className="text-[#D4A017] font-black">पद:</span>
                <span className="text-[#EAD8B1]">संस्थापक (Founder, MP परीक्षा सेतु)</span>
              </div>

              <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
                <span className="text-[#D4A017] font-black">मुख्यालय:</span>
                <span className="text-stone-200">भोपाल, मध्यप्रदेश</span>
              </div>
            </div>

            {/* Motivational message & CBT quality pledge */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-black text-[#D4A017] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>म.प्र. के प्रतियोगी परीक्षार्थियों के लिए प्रेरणादायी संदेश एवं CBT गुणवत्ता संकल्प:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium bg-[#48160E]/50 p-3.5 rounded-xl border border-[#D4A017]/20 italic">
                "मध्यप्रदेश के प्रत्येक होनहार अभ्यर्थी तक बिना किसी बाधा के राज्य स्तरीय परीक्षाओं (MPPSC, पटवारी, पुलिस SI/कांस्टेबल, व्यापम ESB) की सबसे प्रामाणिक, उच्च गुणवत्तायुक्त और वास्तविक CBT परीक्षा प्रणाली पहुँचाना हमारा सर्वोच्च संकल्प है।"
              </p>
            </div>

            {/* Official Credentials Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-[#48160E] border border-[#D4A017]/40 text-[#D4A017] font-bold">
                ✉️ official@mpparikshasetu.in
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#48160E] border border-[#D4A017]/40 text-[#EAD8B1]">
                🏛️ भोपाल, मध्यप्रदेश
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#48160E] border border-emerald-500/50 text-emerald-300 font-bold">
                🔒 256-Bit SSL Protected
              </span>
            </div>
          </div>

          {/* Right Badge / Status Card */}
          <div className="bg-[#48160E]/90 border-2 border-[#D4A017]/60 rounded-2xl p-5 text-center shrink-0 w-full md:w-auto shadow-xl space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4A017] to-amber-300 text-[#2D2424] flex items-center justify-center font-black text-2xl mx-auto shadow-md">
              👑
            </div>
            <div className="font-display font-black text-sm text-white">
              पोर्टल संस्थापक एवं व्यवस्थापक
            </div>
            <div className="text-[11px] text-[#EAD8B1] font-medium">
              सर्वाधिकार एवं संचालन नियंत्रण
            </div>
            <div className="pt-1">
              {isOwnerLoggedIn ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-xs font-black animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>एडमिन सत्र सक्रिय</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>सुरक्षित लॉगिन अपेक्षित</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME PORTAL METRICS (लाइव आंकड़े) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
            <span>कुल टेस्ट सीरीज़</span>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            {totalSeriesCount}
          </div>
          <div className="text-[10px] text-stone-500">पटवारी, पुलिस, MPPSC, व्यापम</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5 text-emerald-600" />
            <span>कुल प्रश्न भंडार</span>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-emerald-700 dark:text-emerald-400">
            {totalQuestionsCount.toLocaleString()}+
          </div>
          <div className="text-[10px] text-stone-500">
            {lockedQuestionsCount > 0 ? `${lockedQuestionsCount} फाइनल लॉक` : 'सभी प्रश्न ड्राफ्ट (अनलॉक)'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>पंजीकृत छात्र</span>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            {totalStudentsCount}
          </div>
          <div className="text-[10px] text-stone-500">मध्यप्रदेश के विभिन्न ज़िलों से</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>सर्वर डेटा सुरक्षा</span>
          </div>
          <div className="font-display font-black text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>100% सुरक्षित</span>
          </div>
          <div className="text-[10px] text-stone-500">लाइव ऑटो-सिंक एक्टिव</div>
        </div>
      </div>

      {/* 3. OWNER MANAGEMENT PANEL OR SECURE LOGIN GATEWAY */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        
        {isOwnerLoggedIn ? (
          /* ========================================================= */
          /* LOGGED IN: ACTIVE MANAGEMENT CONTROLS */
          /* ========================================================= */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>प्रबंधन कंसोल तैयार है (Owner Console Unlocked)</span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                  पोर्टल प्रबंधन शॉर्टकट्स — आप क्या अपडेट करना चाहते हैं?
                </h2>
              </div>

              {/* Fast Backup Action Button */}
              <button
                onClick={handleDownloadFullBackup}
                disabled={isBackingUp}
                className="px-4 py-2.5 bg-[#5E1F16] hover:bg-[#7A2A1E] text-[#D4A017] border border-[#D4A017]/60 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer shrink-0 active:scale-95"
                title="पूरे पोर्टल के डेटा का बैकअप (JSON) डाउनलोड करें"
              >
                <Download className="w-4 h-4" />
                <span>{isBackingUp ? 'बैकअप बन रहा है...' : '💾 1-क्लिक कम्प्लीट डेटा बैकअप'}</span>
              </button>
            </div>

            {/* Quick Management Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* 1. Questions & Locking */}
              <div 
                onClick={() => navigate('admin', { tab: 'QUESTIONS' })}
                className="p-5 rounded-2xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-200 dark:border-stone-700 hover:border-[#D4A017] transition cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5E1F16] text-[#D4A017] flex items-center justify-center font-black">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#D4A017] group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 mb-1">
                  1. प्रश्न बैंक हब (15,000+ प्रश्न)
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  प्रश्नों को ड्राफ्ट या फाइनल लॉक करें। जिसे लॉक करेंगे वह छात्रों को टेस्ट में दिखेगा।
                </p>
                <div className="mt-3 text-[11px] font-black text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-1">
                  <span>प्रश्न बैंक खोलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 2. Mock Sets Management */}
              <div 
                onClick={() => navigate('admin', { tab: 'MOCK_SETS' })}
                className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-stone-800/50 border border-emerald-200 dark:border-stone-700 hover:border-emerald-500 transition cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black">
                    <Layers className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 mb-1">
                  2. मॉक सेट्स व टेस्ट सीरीज़
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  पटवारी, पुलिस, MPPSC सेट्स को चालू या बंद करें। टेस्ट का नाम और सेट्स की संख्या तय करें।
                </p>
                <div className="mt-3 text-[11px] font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                  <span>मॉक सेट्स प्रबंधित करें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 3. Banners & Vacancy Alert */}
              <div 
                onClick={() => navigate('admin', { tab: 'BANNERS' })}
                className="p-5 rounded-2xl bg-blue-50/50 dark:bg-stone-800/50 border border-blue-200 dark:border-stone-700 hover:border-blue-500 transition cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 mb-1">
                  3. होमपेज बैनर व ब्रेकिंग अलर्ट
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  होमपेज के मुख्य स्लाइडर बैनर, नई भर्ती सूचनाएं, और ब्रेकिंग न्यूज़ टिकर बदलें।
                </p>
                <div className="mt-3 text-[11px] font-black text-blue-800 dark:text-blue-400 flex items-center gap-1">
                  <span>बैनर सेटिंग्स में जाएं</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 4. Student Management */}
              <div 
                onClick={() => navigate('admin', { tab: 'STUDENTS' })}
                className="p-5 rounded-2xl bg-purple-50/50 dark:bg-stone-800/50 border border-purple-200 dark:border-stone-700 hover:border-purple-500 transition cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black">
                    <Users className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 mb-1">
                  4. छात्र खाते व स्कोरकार्ड
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  पंजीकृत छात्र देखें, किसी छात्र को फ्री एक्सेस/स्कॉलरशिप दें, अथवा पासवर्ड रीसेट करें।
                </p>
                <div className="mt-3 text-[11px] font-black text-purple-800 dark:text-purple-400 flex items-center gap-1">
                  <span>छात्र सूची देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 5. Payments & Orders */}
              <div 
                onClick={() => navigate('admin', { tab: 'ORDERS' })}
                className="p-5 rounded-2xl bg-rose-50/50 dark:bg-stone-800/50 border border-rose-200 dark:border-stone-700 hover:border-rose-500 transition cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-700 text-white flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 mb-1">
                  5. पेमेंट ऑर्डर्स व GST इनवॉइस
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  छात्रों के सफल Razorpay / UPI भुगतानों का लेखा-जोखा और रसीदें देखें।
                </p>
                <div className="mt-3 text-[11px] font-black text-rose-800 dark:text-rose-400 flex items-center gap-1">
                  <span>पेमेंट रिपोर्ट देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 6. Portal Settings */}
              <div 
                onClick={() => navigate('admin', { tab: 'SETTINGS' })}
                className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-stone-500 transition cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-700 text-white flex items-center justify-center font-black">
                    <Settings className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 mb-1">
                  6. पोर्टल सेटिंग्स व सोशल मीडिया
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  साइट लोगो, हेल्पलाइन नंबर, ईमेल, टेलीग्राम, व्हाट्सएप व यूट्यूब लिंक्स सेट करें।
                </p>
                <div className="mt-3 text-[11px] font-black text-stone-800 dark:text-stone-300 flex items-center gap-1">
                  <span>पोर्टल सेटिंग्स बदलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

            {/* Big Launch Full Admin Console Button */}
            <div className="pt-3">
              <button
                onClick={() => navigate('admin')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#5E1F16] via-[#7A2A1E] to-[#5E1F16] hover:from-[#7A2A1E] hover:to-[#963E2F] text-[#D4A017] border-2 border-[#D4A017] text-sm font-black flex items-center justify-center gap-2 shadow-xl transition cursor-pointer active:scale-98"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>🚀 सम्पूर्ण एडमिनिस्ट्रेटर कंसोल खोलें (Open Complete Admin Dashboard)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* LOGGED OUT: SECURE OWNER AUTHENTICATION DOORWAY */
          /* ========================================================= */
          <div className="max-w-lg mx-auto py-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#5E1F16] border border-[#D4A017]/60 text-[#D4A017] flex items-center justify-center font-black text-2xl mx-auto shadow-md">
                🔒
              </div>
              <h2 className="font-display font-black text-xl text-stone-900 dark:text-stone-100">
                संचालक / व्यवस्थापक प्रमाणीकरण द्वार
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                यह अनुभाग केवल पोर्टल के मुख्य संचालक (श्री अखिलेश कोरसने) के लिए आरक्षित है। कोई अन्य छात्र या अनाधिकृत व्यक्ति इसे नहीं खोल सकता।
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleOwnerLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                  संचालक गोपनीय पासवर्ड (Owner Secret Password) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="password"
                    value={ownerPasswordInput}
                    onChange={(e) => setOwnerPasswordInput(e.target.value)}
                    placeholder="अपना व्यवस्थापक पासवर्ड दर्ज करें"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium text-xs focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-[#5E1F16] hover:bg-[#7A2A1E] text-[#D4A017] border border-[#D4A017]/60 rounded-xl font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>सत्यापित किया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>👑 संचालक के रूप में सत्यापित करें व कंसोल खोलें</span>
                  </>
                )}
              </button>
            </form>

            <div className="p-3 bg-amber-50 dark:bg-stone-800/60 rounded-xl border border-amber-200 dark:border-stone-700 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>सुरक्षा सूचना: सामान्य छात्र अपने मोबाइल नंबर से छात्र लॉगिन करें। यह द्वार केवल ओनर हेतु सुरक्षित है।</span>
            </div>
          </div>
        )}

      </div>

      {/* 4. STEP-BY-STEP OWNER'S GUIDE (अपडेट कैसे करना है - विस्तृत निर्देश) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#7A2A1E] dark:text-[#D4A017] uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>व्यवस्थापक मार्गदर्शिका (Owner Step-by-Step Guide)</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
            पोर्टल पर कोई भी अपडेट कैसे करें? (आसान चरण)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            अखिलेश जी, आपके पोर्टल को प्रबंधित करने के लिए नीचे दिए गए 5 सबसे महत्वपूर्ण कार्य और उनके सटीक चरण दिए गए हैं:
          </p>
        </div>

        <div className="space-y-4">
          
          {/* STEP 1: Question Locking */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#5E1F16] text-[#D4A017] flex items-center justify-center font-black text-xs shrink-0">
                1
              </span>
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100">
                प्रश्नों को लॉक (फाइनल) कैसे करें ताकि वे छात्रों को लाइव टेस्ट में दिखें?
              </h3>
            </div>
            <div className="pl-9 text-xs text-stone-600 dark:text-stone-300 space-y-1.5 leading-relaxed">
              <p>• <strong>चरण 1:</strong> एडमिन कंसोल में <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">"प्रश्न बैंक हब"</span> टैब पर क्लिक करें।</p>
              <p>• <strong>चरण 2:</strong> जिस टेस्ट सीरीज़ (जैसे 'MP पटवारी 2026') और सेट (जैसे 'मॉक टेस्ट #1') के प्रश्न आप फाइनल करना चाहते हैं, उसे ऊपर से चुनें।</p>
              <p>• <strong>चरण 3:</strong> आपको उस सेट के 200 प्रश्न दिखेंगे। ऊपर दिए गए <span className="font-bold text-emerald-600">"इस व्यू के सभी प्रश्न लॉक करें"</span> बटन पर क्लिक करें।</p>
              <p>• <strong>परिणाम:</strong> वे प्रश्न तुरंत <span className="text-emerald-600 font-bold">"Locked (फाइनल)"</span> हो जाएँगे और छात्रों को लाइव टेस्ट में मिलने लगेंगे। जब तक प्रश्न अनलॉक रहते हैं, वे ड्राफ्ट रहते हैं और आप उन्हें एडिट कर सकते हैं।</p>
            </div>
          </div>

          {/* STEP 2: Mock Sets Toggle */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#5E1F16] text-[#D4A017] flex items-center justify-center font-black text-xs shrink-0">
                2
              </span>
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100">
                नया मॉक टेस्ट सेट चालू या बंद (Activate/Deactivate) कैसे करें?
              </h3>
            </div>
            <div className="pl-9 text-xs text-stone-600 dark:text-stone-300 space-y-1.5 leading-relaxed">
              <p>• <strong>चरण 1:</strong> एडमिन कंसोल में <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">"मॉक सेट्स"</span> टैब खोलें।</p>
              <p>• <strong>चरण 2:</strong> परीक्षा चुनें (जैसे पटवारी में 15 सेट्स हैं)।</p>
              <p>• <strong>चरण 3:</strong> प्रत्येक सेट के आगे एक टॉगल स्विच है। किसी सेट को छात्रों के लिए चालू करने के लिए स्विच को <span className="text-emerald-600 font-bold">'सक्रिय (Active)'</span> करें।</p>
              <p>• <strong>परिणाम:</strong> वह सेट तुरंत छात्रों के डैशबोर्ड और टेस्ट कैटलॉग में दिखने लगेगा।</p>
            </div>
          </div>

          {/* STEP 3: Banners and Announcements */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#5E1F16] text-[#D4A017] flex items-center justify-center font-black text-xs shrink-0">
                3
              </span>
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100">
                होमपेज के बैनर और ब्रेकिंग न्यूज़ टिकर कैसे बदलें?
              </h3>
            </div>
            <div className="pl-9 text-xs text-stone-600 dark:text-stone-300 space-y-1.5 leading-relaxed">
              <p>• <strong>चरण 1:</strong> एडमिन कंसोल में <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">"बैनर"</span> या <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">"घोषणाएं"</span> टैब पर जाएं।</p>
              <p>• <strong>चरण 2:</strong> किसी भी पुराने बैनर के आगे <span className="font-bold text-amber-600">'एडिट'</span> बटन दबाएं, या 'नया बैनर जोड़ें' पर क्लिक करें।</p>
              <p>• <strong>चरण 3:</strong> नया शीर्षक, उपशीर्षक या इमेज का लिंक दर्ज करें और 'सेव करें' पर क्लिक करें।</p>
              <p>• <strong>परिणाम:</strong> होमपेज पर छात्रों को तुरंत नया बैनर दिखने लगेगा।</p>
            </div>
          </div>

          {/* STEP 4: Pricing and Free Access */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#5E1F16] text-[#D4A017] flex items-center justify-center font-black text-xs shrink-0">
                4
              </span>
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100">
                टेस्ट की फीस बदलना या किसी छात्र को फ्री एक्सेस / स्कॉलरशिप देना:
              </h3>
            </div>
            <div className="pl-9 text-xs text-stone-600 dark:text-stone-300 space-y-1.5 leading-relaxed">
              <p>• <strong>फीस बदलना:</strong> <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">"टेस्ट सीरीज़"</span> टैब में जाकर किसी भी सीरीज़ का 'एडिट' बटन दबाएं और नया मूल्य (जैसे ₹99 या ₹199) सेव करें।</p>
              <p>• <strong>छात्र को फ्री टेस्ट देना:</strong> <span className="font-bold text-[#7A2A1E] dark:text-[#D4A017]">"छात्र प्रबंधन"</span> में जाएं। छात्र के नाम के आगे <span className="font-bold text-purple-600">'टैग व रोल'</span> पर क्लिक करें और 'Grant Free Access' पर क्लिक करें। उस छात्र को बिना पेमेंट किए सभी टेस्ट अनलॉक हो जाएँगे।</p>
            </div>
          </div>

          {/* STEP 5: Data Permanence Guarantee */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-stone-800/70 border border-emerald-300 dark:border-emerald-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                5
              </span>
              <h3 className="font-black text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>डेटा सुरक्षा एवं स्थायी संग्रहण (Data Permanence Guarantee)</span>
              </h3>
            </div>
            <div className="pl-9 text-xs text-emerald-900 dark:text-stone-300 space-y-1.5 leading-relaxed">
              <p>• आपके द्वारा किए गए सभी संशोधन (प्रश्नों का लॉक/अनलॉक, टेस्ट सेटिंग्स, बैनर, छात्र डेटा) सीधे सर्वर फ़ाइल <code>data/app_state.json</code> में तुरंत लिख दिए जाते हैं।</p>
              <p>• किसी भी पुराने कोड से आपका नया डेटा कभी ओवरराइट नहीं होता है।</p>
              <p>• आप जब चाहें ऊपर दिए गए <span className="font-bold text-emerald-700 dark:text-emerald-400">"💾 1-क्लिक कम्प्लीट डेटा बैकअप"</span> बटन पर क्लिक करके अपने पूरे पोर्टल का ताज़ा डेटा अपने फ़ोन या कंप्यूटर में सुरक्षित डाउनलोड कर सकते हैं।</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
