import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Award, 
  CheckCircle,
  Clock,
  Play
} from 'lucide-react';

interface BannerItem {
  id: number;
  tagHi: string;
  tagEn: string;
  badgeColor: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  highlightHi: string;
  highlightEn: string;
  ctaTextHi: string;
  ctaTextEn: string;
  ctaAction: 'cbt_demo' | 'navigate_catalog' | 'navigate_leaderboard' | 'navigate_notes' | 'open_signup' | 'open_pass';
  seriesId?: string;
  bgGradient: string;
  accentColor: string;
  icon: React.ReactNode;
}

export const BannerCarousel: React.FC = () => {
  const { lang, navigate, openAuthModal, openRazorpayModal, testSeries, siteBanners } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Dynamic banners from Admin CMS mapped to carousel items
  const adminMappedBanners: BannerItem[] = (siteBanners || [])
    .filter(b => b.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((b, idx) => ({
      id: 100 + idx,
      tagHi: b.badgeText || '💥 विशेष घोषणा',
      tagEn: b.badgeText || 'Special Highlight',
      badgeColor: 'bg-[#D4A017] text-stone-950',
      titleHi: b.titleHi,
      titleEn: b.titleEn || b.titleHi,
      subtitleHi: b.subtitleHi,
      subtitleEn: b.subtitleEn || b.subtitleHi,
      highlightHi: '100% प्रामाणिक सामग्री • अद्यतन परीक्षा पैटर्न • विस्तृत समाधान',
      highlightEn: '100% Authentic Content • Updated Pattern • Detailed Solutions',
      ctaTextHi: b.buttonTextHi || 'अभी देखें',
      ctaTextEn: b.buttonTextEn || 'View Now',
      ctaAction: (b.targetView === 'cbtExam' ? 'cbt_demo' : 'navigate_catalog') as any,
      seriesId: b.targetId || 'ts_patwari_2026',
      bgGradient: 'from-[#7A2A1E] via-[#5E1F16] to-[#3B140E]',
      accentColor: '#D4A017',
      icon: <Award className="w-10 h-10 sm:w-14 sm:h-14 text-[#D4A017]" />
    }));

  const defaultBanners: BannerItem[] = [
    {
      id: 1,
      tagHi: '🔥 सबसे लोकप्रिय • MPESB',
      tagEn: '🔥 Top Trending • MPESB',
      badgeColor: 'bg-amber-500 text-stone-950',
      titleHi: 'मध्यप्रदेश पटवारी चयन परीक्षा 2026',
      titleEn: 'MP Patwari Selection Exam 2026',
      subtitleHi: '50 फुल लेंथ टेस्ट • पंचायती राज, सामान्य ज्ञान, गणित, कंप्यूटर व हिन्दी',
      subtitleEn: '50 Full Length Mocks • Panchayati Raj, MP GK, Maths, Computer & Hindi',
      highlightHi: '100% नवीन परीक्षा पैटर्न पर आधारित + ऑल-एमपी लाइव रैंक',
      highlightEn: '100% New Exam Pattern with State Rank & Instant Percentile',
      ctaTextHi: 'निःशुल्क डेमो टेस्ट दें',
      ctaTextEn: 'Start Free Demo',
      ctaAction: 'cbt_demo',
      seriesId: 'ts_patwari_2026',
      bgGradient: 'from-[#6E1C12] via-[#852317] to-[#451009]',
      accentColor: '#D4A017',
      icon: <Award className="w-10 h-10 sm:w-14 sm:h-14 text-[#D4A017]" />
    },
    {
      id: 2,
      tagHi: '🏛️ म.प्र. लोक सेवा आयोग',
      tagEn: '🏛️ MP Public Service Commission',
      badgeColor: 'bg-orange-500 text-white',
      titleHi: 'MPPSC राज्य सेवा प्रारंभिक परीक्षा 2026 (GS + CSAT)',
      titleEn: 'MPPSC State Services Prelims 2026 (GS + CSAT)',
      subtitleHi: 'द्विभाषी (हिन्दी/English) • 10,000+ उच्च स्तरीय प्रश्न व्याख्या सहित',
      subtitleEn: 'Bilingual (Hindi/English) • 10,000+ High-Yield Questions with Deep Solutions',
      highlightHi: 'मध्यप्रदेश विशेष सामान्य ज्ञान, जनजातियां, रियासतें एवं समसामयिकी',
      highlightEn: 'MP Special History, Tribal Heritage, Dynasties & 2026 Current Affairs',
      ctaTextHi: 'सीरीज़ में एनरोल करें',
      ctaTextEn: 'Explore MPPSC Pack',
      ctaAction: 'navigate_catalog',
      seriesId: 'ts_mppsc_pre_2026',
      bgGradient: 'from-[#1E3A8A] via-[#1E293B] to-[#0F172A]',
      accentColor: '#60A5FA',
      icon: <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-blue-400" />
    },
    {
      id: 3,
      tagHi: '👮 वर्दी का सपना • MP Police',
      tagEn: '👮 MP Police Sub-Inspector & Constable',
      badgeColor: 'bg-emerald-500 text-stone-950',
      titleHi: 'MP पुलिस सब-इंस्पेक्टर (SI) & आरक्षक चयन 2026',
      titleEn: 'MP Police SI & Constable Master Mock Drill 2026',
      subtitleHi: '60 विषयवार टेस्ट • विज्ञान, रीजनिंग, म.प्र. सामान्य ज्ञान, हिन्दी व गणित',
      subtitleEn: '60 Subject Drills • Science, Reasoning, MP GK, Hindi & Numerical Ability',
      highlightHi: 'शारीरिक दक्षता गाइड + वास्तविक समयबद्ध सीबीटी परीक्षा माहौल',
      highlightEn: 'Physical Standard Guidelines + Real CBT Simulation with Timer',
      ctaTextHi: 'टेस्ट सीरीज़ देखें',
      ctaTextEn: 'View Police Series',
      ctaAction: 'navigate_catalog',
      seriesId: 'ts_police_si_2026',
      bgGradient: 'from-[#064E3B] via-[#047857] to-[#022C22]',
      accentColor: '#34D399',
      icon: <ShieldCheck className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-400" />
    },
    {
      id: 4,
      tagHi: '🌲 वन विभाग भर्ती',
      tagEn: '🌲 MP Forest Department',
      badgeColor: 'bg-teal-500 text-stone-950',
      titleHi: 'MP वनरक्षक (Forest Guard) & क्षेत्ररक्षक 2026',
      titleEn: 'MP Vanrakshak & Field Guard Test Series 2026',
      subtitleHi: 'पर्यावरण, म.प्र. राष्ट्रीय उद्यान, अभयारण्य, सामान्य विज्ञान व गणित',
      subtitleEn: 'Environment, MP National Parks, Sanctuaries, Science & Quant',
      highlightHi: 'पिछले 10 वर्षों के हल प्रश्न पत्र (PYQs) + 40 फुल लेंथ टेस्ट',
      highlightEn: '10-Year Solved PYQs + 40 Full Length Timed Mocks',
      ctaTextHi: 'अभी शुरू करें',
      ctaTextEn: 'Start Practicing',
      ctaAction: 'navigate_catalog',
      seriesId: 'ts_forest_guard_2026',
      bgGradient: 'from-[#134E4A] via-[#115E59] to-[#042F2E]',
      accentColor: '#2DD4BF',
      icon: <Flame className="w-10 h-10 sm:w-14 sm:h-14 text-teal-300" />
    },
    {
      id: 5,
      tagHi: '💻 MPESB ग्रुप-4 व स्टेनो',
      tagEn: '💻 MP Vyapam Group-4 & Steno',
      badgeColor: 'bg-purple-500 text-white',
      titleHi: 'MP ग्रुप-4 / सहायक ग्रेड-3 / स्टेनो टाइपिस्ट 2026',
      titleEn: 'MP Group-4 / Assistant Grade-3 / Steno Mock Test 2026',
      subtitleHi: 'CPCT पैटर्न कंप्यूटर दक्षता, सामान्य हिन्दी, अंग्रेजी, गणित व तर्कशक्ति',
      subtitleEn: 'CPCT Pattern Computer Proficiency, General Hindi, English & Logic',
      highlightHi: 'कंप्यूटर शॉर्टकट कुंजी, एमएस ऑफिस 365 व टाइपिंग टेस्ट टिप्स',
      highlightEn: 'MS Office 365, Shortcut Keys & Accurate Typing Exam Simulations',
      ctaTextHi: 'ग्रुप-4 टेस्ट देखें',
      ctaTextEn: 'View Group 4 Pack',
      ctaAction: 'navigate_catalog',
      seriesId: 'ts_group4_2026',
      bgGradient: 'from-[#581C87] via-[#6B21A8] to-[#3B0764]',
      accentColor: '#C084FC',
      icon: <FileText className="w-10 h-10 sm:w-14 sm:h-14 text-purple-300" />
    },
    {
      id: 6,
      tagHi: '🎓 शिक्षक पात्रता परीक्षा',
      tagEn: '🎓 MP Teacher Eligibility Test',
      badgeColor: 'bg-amber-600 text-white',
      titleHi: 'MP संविदा शिक्षक (TET वर्ग-2 & वर्ग-3) चयन 2026',
      titleEn: 'MP TET Varg-2 & Varg-3 Master Series 2026',
      subtitleHi: 'बाल विकास एवं शिक्षाशास्त्र (CDP), हिन्दी, संस्कृत/अंग्रेजी व मुख्य विषय',
      subtitleEn: 'Child Development & Pedagogy, Hindi, Sanskrit/English & Subject Core',
      highlightHi: 'NCERT & SCERT म.प्र. पाठ्यपुस्तक आधारित प्रमाणित मॉक टेस्ट',
      highlightEn: 'NCERT & MP SCERT Textbook Aligned Verified Question Bank',
      ctaTextHi: 'TET टेस्ट सीरीज़ देखें',
      ctaTextEn: 'View TET Pack',
      ctaAction: 'navigate_catalog',
      seriesId: 'ts_mptet_varg2_2026',
      bgGradient: 'from-[#78350F] via-[#92400E] to-[#451A03]',
      accentColor: '#FBBF24',
      icon: <Award className="w-10 h-10 sm:w-14 sm:h-14 text-amber-300" />
    },
    {
      id: 7,
      tagHi: '🤖 AI तकनीक',
      tagEn: '🤖 Powered by AI',
      badgeColor: 'bg-indigo-600 text-white',
      titleHi: 'AI-पावर्ड स्मार्ट स्कोर व कमजोरी विश्लेषण',
      titleEn: 'AI-Powered Diagnostic Weakness Analytics',
      subtitleHi: 'टेस्ट सबमिट करते ही पाएँ 7-दिवसीय कस्टमाइज़्ड स्टडी टाइमटेबल व शॉर्टकट ट्रिक्स',
      subtitleEn: 'Instant AI breakdown of wrong questions, conceptual fixes & 7-day study plan',
      highlightHi: 'शून्य प्रतीक्षा समय • आपकी तैयारी को दे 3x गति और सटीकता',
      highlightEn: 'Zero Latency Instant Result Cards with District Percentile Benchmarks',
      ctaTextHi: 'AI रिपोर्ट का अनुभव लें',
      ctaTextEn: 'Experience AI Engine',
      ctaAction: 'cbt_demo',
      seriesId: 'ts_patwari_2026',
      bgGradient: 'from-[#312E81] via-[#3730A3] to-[#1E1B4B]',
      accentColor: '#818CF8',
      icon: <Cpu className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-300" />
    },
    {
      id: 8,
      tagHi: '🏆 ऑल-मध्यप्रदेश प्रतिस्पर्धा',
      tagEn: '🏆 All-MP Live Leaderboard',
      badgeColor: 'bg-yellow-500 text-stone-950',
      titleHi: 'ऑल-एमपी लाइव मेरिट लीडरबोर्ड (55 जिले)',
      titleEn: 'All-MP Live State Merit Leaderboard (55 Districts)',
      subtitleHi: 'इंदौर, भोपाल, ग्वालियर, जबलपुर, रीवा, सागर व उज्जैन के 50,000+ छात्रों संग रैंक',
      subtitleEn: 'Compare real ranks with top aspirants from all 55 MP districts daily',
      highlightHi: 'जिलावार कटऑफ अनुमान, टॉपर्स की टाइमिंग व पर्सेंटाइल ट्रैकिंग',
      highlightEn: 'District-wise cutoffs, topper speed breakdown and percentile tracking',
      ctaTextHi: 'लाइव रैंक चेक करें',
      ctaTextEn: 'View Live Rankings',
      ctaAction: 'navigate_leaderboard',
      bgGradient: 'from-[#713F12] via-[#854D0E] to-[#361E05]',
      accentColor: '#FACC15',
      icon: <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400" />
    },
    {
      id: 9,
      tagHi: '📖 मुफ़्त स्टडी मटेरियल',
      tagEn: '📖 Free Study Material',
      badgeColor: 'bg-emerald-600 text-white',
      titleHi: 'मध्यप्रदेश सामान्य ज्ञान हस्तलिखित ई-नोट्स & PDF',
      titleEn: 'Free MP GK Handwritten E-Notes & Official Maps PDF',
      subtitleHi: 'नर्मदा व अन्य नदियाँ, राष्ट्रीय उद्यान, 55 जिलों का सार संग्रह एवं प्रमुख मेले',
      subtitleEn: 'Rivers, Dynasties, Schemes, National Parks & District Compendium PDF',
      highlightHi: '100% निःशुल्क डाउनलोड करें और ऑफलाइन कभी भी रिवीज़न करें',
      highlightEn: '100% Free Download & Offline Reading on Mobile or Desktop',
      ctaTextHi: 'ई-नोट्स डाउनलोड करें',
      ctaTextEn: 'Download Free PDF',
      ctaAction: 'navigate_notes',
      bgGradient: 'from-[#065F46] via-[#047857] to-[#022C22]',
      accentColor: '#6EE7B7',
      icon: <FileText className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-300" />
    },
    {
      id: 10,
      tagHi: '🏷️ महाबचत कॉम्बो ऑफर',
      tagEn: '🏷️ Maha Bachat Combo Offer',
      badgeColor: 'bg-rose-600 text-white',
      titleHi: 'MP All-Access Pass: 1 साल तक सभी 10+ टेस्ट सीरीज़ अनलॉक',
      titleEn: 'MP All-Access Mega Pass: Unlock All 10+ Test Series for 1 Year',
      subtitleHi: 'पटवारी + MPPSC + पुलिस + वनरक्षक + ग्रुप 4 + TET (असीमित प्रयास)',
      subtitleEn: 'Patwari + MPPSC + Police + Forest Guard + Group 4 + TET all-in-one',
      highlightHi: 'फ्लैट 60% की विशेष छूट • कूपन कोड: "MPSEK60" लागू करें',
      highlightEn: 'Flat 60% OFF with Instant GST Invoice & Money-back Guarantee',
      ctaTextHi: 'ऑल-एक्सेस पास प्राप्त करें',
      ctaTextEn: 'Get All-Access Pass',
      ctaAction: 'open_pass',
      bgGradient: 'from-[#881337] via-[#9F1239] to-[#4C0519]',
      accentColor: '#FB7185',
      icon: <Zap className="w-10 h-10 sm:w-14 sm:h-14 text-rose-300" />
    }
  ];

  const banners: BannerItem[] = adminMappedBanners.length > 0 ? [...adminMappedBanners, ...defaultBanners] : defaultBanners;

  // 4-second auto-scroll timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerAction = (banner: BannerItem) => {
    if (banner.ctaAction === 'cbt_demo') {
      navigate('cbtExam', { id: banner.seriesId || 'ts_patwari_2026', setId: 1, isDemoMode: true });
    } else if (banner.ctaAction === 'navigate_catalog') {
      navigate('catalog');
    } else if (banner.ctaAction === 'navigate_leaderboard') {
      navigate('leaderboard');
    } else if (banner.ctaAction === 'navigate_notes') {
      navigate('notes');
    } else if (banner.ctaAction === 'open_signup') {
      openAuthModal('register');
    } else if (banner.ctaAction === 'open_pass') {
      const series = testSeries.find(s => s.id === 'ts_patwari_2026') || testSeries[0];
      if (series) openRazorpayModal(series);
    }
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const currentBanner = banners[currentIndex];

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Container */}
      <div 
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentBanner.bgGradient} border-2 border-[#D4A017] border-b-8 border-r-8 shadow-2xl transition-all duration-700`}
      >
        {/* Background Decorative Pattern & Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Top Header Row of Banner: Tag + 4s Auto-scroll Indicator */}
        <div className="relative z-10 px-6 sm:px-10 pt-6 sm:pt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow ${currentBanner.badgeColor}`}>
              {lang === 'hi' ? currentBanner.tagHi : currentBanner.tagEn}
            </span>
            <span className="text-white/70 text-xs font-bold font-mono bg-black/30 px-2.5 py-0.5 rounded-lg border border-white/10">
              {currentIndex + 1} / {banners.length}
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-[11px] font-bold bg-black/40 px-3 py-1 rounded-xl border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#D4A017] animate-pulse" />
            <span>4s ऑटो-स्क्रॉल {isPaused ? '(रोका गया)' : ''}</span>
          </div>
        </div>

        {/* Main Banner Content */}
        <div className="relative z-10 px-6 sm:px-10 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Headings & Value Props */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {lang === 'hi' ? currentBanner.titleHi : currentBanner.titleEn}
            </h2>

            <p className="text-[#FFFBF2]/90 text-xs sm:text-base font-medium leading-relaxed max-w-2xl">
              {lang === 'hi' ? currentBanner.subtitleHi : currentBanner.subtitleEn}
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D4A017] bg-black/30 w-fit px-3.5 py-1.5 rounded-xl border border-[#D4A017]/30">
              <Sparkles className="w-4 h-4 shrink-0 text-[#D4A017]" />
              <span>{lang === 'hi' ? currentBanner.highlightHi : currentBanner.highlightEn}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleBannerAction(currentBanner)}
                className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#c08f12] text-black font-black uppercase tracking-wider text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                <span>{lang === 'hi' ? currentBanner.ctaTextHi : currentBanner.ctaTextEn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>{lang === 'hi' ? 'नया छात्र रजिस्ट्रेशन' : 'New Registration'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Visual Feature Badge */}
          <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-black/30 border-2 border-white/15 backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-3 max-w-xs transform hover:rotate-1 transition">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 shadow-inner">
                {currentBanner.icon}
              </div>
              <div className="text-white font-display font-black text-sm">
                MP परीक्षा सेतु प्रामाणिक सामग्री
              </div>
              <div className="text-[11px] text-[#EAD8B1] font-medium leading-normal">
                मध्य प्रदेश सामान्य ज्ञान, पंचायती राज, हिन्दी, गणित व विज्ञान का सबसे विश्वसनीय मंच।
              </div>
            </div>
          </div>

        </div>

        {/* 4-Second Animated Progress Bar at Bottom of Card */}
        <div className="w-full bg-black/40 h-1.5">
          <div 
            key={currentIndex}
            className="h-full bg-[#D4A017] transition-all"
            style={{
              animation: isPaused ? 'none' : 'progressBar 4s linear forwards'
            }}
          />
        </div>

        {/* Navigation Arrow Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-xl z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-xl z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

      {/* Pagination Dot Selectors (10 Banners) */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto py-1">
        {banners.map((b, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={b.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-8 sm:w-10 bg-[#7A2A1E] dark:bg-[#D4A017]' 
                  : 'w-2.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
              }`}
              title={`Banner ${idx + 1}: ${b.titleHi}`}
            />
          );
        })}
      </div>

      {/* CSS Keyframes for progress bar animation */}
      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
