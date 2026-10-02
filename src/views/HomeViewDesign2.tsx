import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TestCard } from '../components/TestCard';
import { BannerCarousel } from '../components/BannerCarousel';
import { LatestNewsSection } from '../components/LatestNewsSection';
import { SocialMediaSection } from '../components/SocialMediaSection';
import { SocialLiveTicker } from '../components/SocialLiveTicker';
import { HomeNotificationPopup } from '../components/HomeNotificationPopup';
import { DesignSwitcherPill } from '../components/DesignSwitcherPill';
import { 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Award, 
  Flame, 
  ArrowRight, 
  Shield, 
  BookOpen, 
  Users, 
  Cpu, 
  FileText, 
  Zap, 
  Search,
  HelpCircle,
  GraduationCap,
  UserPlus,
  Smartphone,
  Check,
  Clock,
  Layers,
  BarChart3,
  Wifi,
  Battery,
  ChevronRight,
  Globe2,
  Lock,
  Compass
} from 'lucide-react';
import { ExamCategory } from '../types';

export const HomeViewDesign2: React.FC = () => {
  const { testSeries, lang, navigate, openNotesModal, openAuthModal, platformSettings, portalDesignStyle, setPortalDesignStyle, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive phone preview states
  const [interactiveOption, setInteractiveOption] = useState<number | null>(1); // default option B (Pachmarhi)
  const [timerSeconds, setTimerSeconds] = useState(7184); // 01:59:44 countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const categories: { id: ExamCategory; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'समस्त परीक्षाएं (All)', labelEn: 'All Exams', icon: '🏛️' },
    { id: 'patwari', labelHi: 'समूह-02 उपसमूह-04 (पटवारी)', labelEn: 'Group-02 Sub-04', icon: '🌾' },
    { id: 'agri', labelHi: 'कृषि (समूह-02 उपसमूह-01)', labelEn: 'Agri (Group-02 Sub-01)', icon: '🌱' },
    { id: 'mppsc', labelHi: 'MPPSC प्रारंभिक (GS+CSAT)', labelEn: 'MPPSC Prelims', icon: '📜' },
    { id: 'police', labelHi: 'MP पुलिस आरक्षक & SI', labelEn: 'MP Police SI/Constable', icon: '🎖️' },
    { id: 'vyapam', labelHi: 'व्यापम समूह-4 / AG-3', labelEn: 'MP Vyapam (ESB)', icon: '💼' },
    { id: 'vanrakshak', labelHi: 'वनरक्षक / क्षेत्ररक्षक', labelEn: 'MP Forest Guard', icon: '🌲' },
    { id: 'tet', labelHi: 'MP शिक्षक पात्रता (TET)', labelEn: 'MP TET Varg 2/3', icon: '📚' },
  ];

  const filteredSeries = testSeries.filter(s => {
    if (s.isActive === false) return false;
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      s.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.departmentHi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 bg-[#070A10] text-stone-100 selection:bg-emerald-500 selection:text-black">
      
      {/* Launch Notification Popup */}
      <HomeNotificationPopup 
        popupConfig={platformSettings?.popupConfig}
        lang={lang}
        navigate={navigate}
      />

      {/* ========================================================= */}
      {/* 1. HERO SECTION: ULTRA-MODERN TECH & FLAGSHIP PHONE SHOWCASE */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-16 sm:pb-24 border-b border-white/10 bg-radial from-slate-900/90 via-[#070A10] to-[#04060A]">
        
        {/* Ambient Glowing Flares (Mobile Company Aesthetic) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-emerald-500/15 via-cyan-500/15 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute -top-32 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Micro-grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          {/* Top Switcher Banner Alert (Admin Only) */}
          {currentUser?.role === 'admin' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-400 font-black tracking-wide uppercase text-[11px]">
                  ⚡ Design 2 Active
                </span>
                <span className="text-stone-400 hidden sm:inline">•</span>
                <span className="text-stone-300 font-medium text-xs">
                  {lang === 'hi' 
                    ? 'एडमिन कंट्रोल: फ्लैगशिप मोबाइल कंपनी स्टाइल एनिमेशन थीम सक्रिय है।' 
                    : 'Admin Control: Modern Mobile Tech & Fluid Animations Edition is live.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400 font-medium hidden md:inline">
                  {lang === 'hi' ? 'स्टाइल बदलें:' : 'Switch Style:'}
                </span>
                <DesignSwitcherPill compact={false} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & High-Tech Pitch */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Brand Medallion & Trust Chip */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                  <div className="w-full h-full bg-[#0A0E17] rounded-[14px] flex items-center justify-center overflow-hidden">
                    <img 
                      src={platformSettings?.logoUrl || '/logo.svg'} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-wider uppercase font-mono">
                    MP PARIKSHA SETU • PRO CBT 2026
                  </div>
                  <div className="text-[11px] text-stone-400 font-medium">
                    {lang === 'hi' ? 'मध्य प्रदेश शासन भर्ती परीक्षा हेतु फ्लैगशिप सीबीटी मंच' : 'Next-Gen MP State Exam Computer-Based Testing'}
                  </div>
                </div>
              </div>

              {/* Main Headline (Apple-style Typography) */}
              <h1 className="font-display font-black text-3xl sm:text-5xl xl:text-6xl text-white tracking-tight leading-[1.12]">
                {lang === 'hi' ? (
                  <>
                    अगली पीढ़ी का <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">CBT परीक्षा इंजन</span> — गति, सटीकता और सफलता।
                  </>
                ) : (
                  <>
                    Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">CBT Exam Engine</span> — Pure Speed, Total Mastery.
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {lang === 'hi' 
                  ? '0.02s अल्ट्रा-लो लेटेंसी, रीयल-टाइम OMR सिमुलेशन, 11,555+ प्रामाणिक प्रश्न बैंक और 52 जिलों के टॉपर्स के साथ अपनी रैंक की तत्काल तुलना करें।' 
                  : 'Engineered for top aspirants. Experience 0.02s ultra-low latency, full Vyapam hall CBT simulation, and 11,555+ curated questions with district-level rank analytics.'}
              </p>

              {/* Dual Flagship CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
                {/* Glowing Primary CTA */}
                <button
                  type="button"
                  onClick={() => navigate('freeMockTest')}
                  className="w-full sm:w-auto p-[1.5px] rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-98 cursor-pointer group"
                >
                  <div className="px-6 py-3.5 rounded-[15px] bg-[#0A0E17] group-hover:bg-transparent transition-colors flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400 group-hover:text-black transition-colors" />
                    <span className="font-black text-sm text-white group-hover:text-black transition-colors">
                      {lang === 'hi' ? '🚀 मुफ़्त 40-प्रश्न लाइव टेस्ट शुरू करें' : '🚀 Start Free 40-Q Live Mock'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                {/* Secondary Frosted Glass CTA */}
                <button
                  type="button"
                  onClick={() => navigate('catalog')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-stone-200 hover:text-white font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'hi' ? '📱 समस्त टेस्ट सीरीज़ एक्सप्लोर करें' : 'Explore All Series'}</span>
                </button>
              </div>

              {/* Hardware Spec Ticker */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-400 border-t border-white/10 font-mono">
                <div>
                  <span className="text-white font-black text-sm tabular-nums">11,555+</span>
                  <div className="text-[10px] text-stone-400 uppercase">Master Questions</div>
                </div>
                <div className="h-6 w-px bg-white/10"></div>
                <div>
                  <span className="text-emerald-400 font-black text-sm tabular-nums">0.02s</span>
                  <div className="text-[10px] text-stone-400 uppercase">Engine Latency</div>
                </div>
                <div className="h-6 w-px bg-white/10"></div>
                <div>
                  <span className="text-cyan-400 font-black text-sm tabular-nums">52 MP</span>
                  <div className="text-[10px] text-stone-400 uppercase">Districts Active</div>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Perspective Smartphone Interactive Mockup */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent rounded-[3rem] blur-2xl pointer-events-none"></div>

              {/* Floating Tech Badge 1: 0.02s Quantum Latency */}
              <div className="hidden sm:flex absolute -top-4 -left-4 z-20 items-center gap-2 px-3 py-2 rounded-xl bg-[#0F1420]/90 border border-emerald-500/40 shadow-xl backdrop-blur-xl animate-float-slow">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-white">0.02s Instant Response</div>
                  <div className="text-[9px] text-emerald-400 font-mono">Zero Lag Engine</div>
                </div>
              </div>

              {/* Floating Tech Badge 2: All MP Rank #1 */}
              <div className="hidden sm:flex absolute -bottom-4 -right-4 z-20 items-center gap-2 px-3 py-2 rounded-xl bg-[#0F1420]/90 border border-cyan-500/40 shadow-xl backdrop-blur-xl animate-float-reverse">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-white">ऑल MP रैंक #1 सिम्युलेटर</div>
                  <div className="text-[9px] text-cyan-400 font-mono">52 Districts Benchmark</div>
                </div>
              </div>

              {/* The Smartphone Device Frame */}
              <div className="relative w-full max-w-[340px] sm:max-w-[370px] rounded-[2.8rem] bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 p-3 shadow-2xl border border-white/20 animate-screen-glow">
                
                {/* Outer Bezel & Matte Edge */}
                <div className="relative rounded-[2.3rem] bg-[#0A0D14] overflow-hidden border border-white/10 shadow-inner flex flex-col text-stone-100">
                  
                  {/* Dynamic Island / Camera & Speaker Pill */}
                  <div className="pt-2 pb-1 px-6 flex items-center justify-between text-[11px] text-stone-400 font-mono select-none">
                    <span className="font-bold text-white">9:41</span>
                    <div className="w-20 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5 shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-stone-900 border border-emerald-500/40"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3 h-3 text-white" />
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Simulated Mobile CBT Interface */}
                  <div className="p-4 space-y-3.5 text-xs">
                    
                    {/* Exam Header inside Mobile */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                          MP ESB 2026 LIVE CBT
                        </div>
                        <div className="text-xs font-black text-white">
                          समूह-02 उपसमूह-04 (पटवारी)
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400 animate-spin" />
                        <span>{formatTimer(timerSeconds)}</span>
                      </div>
                    </div>

                    {/* Question Header & Live Question */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-stone-400">
                        <span className="font-bold text-stone-300">प्रश्न संख्या 01 / 40</span>
                        <span className="text-emerald-400 font-mono">+1.00 अंक | 0.00 ऋणात्मक</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-stone-200 leading-relaxed">
                        मध्य प्रदेश का पहला <strong>बायोस्फीयर रिजर्व (Biosphere Reserve)</strong> कौन सा है, जिसे यूनेस्को (UNESCO) द्वारा भी मान्यता प्राप्त है?
                      </div>
                    </div>

                    {/* Interactive Clickable Options */}
                    <div className="space-y-1.5">
                      {[
                        { id: 0, letter: 'A', text: 'कान्हा किसली राष्ट्रीय उद्यान (मण्डला)' },
                        { id: 1, letter: 'B', text: 'पचमढ़ी बायोस्फीयर रिजर्व (नर्मदापुरम)' },
                        { id: 2, letter: 'C', text: 'अमरकंटक-अचानकमार बायोस्फीयर' },
                        { id: 3, letter: 'D', text: 'पन्ना बायोस्फीयर रिजर्व (पन्ना-छतरपुर)' }
                      ].map(opt => {
                        const isSelected = interactiveOption === opt.id;
                        const isCorrect = opt.id === 1;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setInteractiveOption(opt.id)}
                            className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? isCorrect
                                  ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-xs shadow-emerald-500/20'
                                  : 'bg-rose-950/70 border-rose-500 text-white'
                                : 'bg-white/[0.03] border-white/5 hover:border-white/20 text-stone-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${
                                isSelected ? (isCorrect ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white') : 'bg-white/10 text-stone-400'
                              }`}>
                                {opt.letter}
                              </span>
                              <span className="text-[11px] leading-tight font-medium">{opt.text}</span>
                            </div>
                            {isSelected && isCorrect && (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Real-time OMR Palette Simulation */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-stone-400">उत्तरित: <strong>01</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="text-stone-400">समीक्षा: <strong>02</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-stone-600"></span>
                        <span className="text-stone-400">शेष: <strong>37</strong></span>
                      </div>
                    </div>

                    {/* Action button inside phone */}
                    <button
                      type="button"
                      onClick={() => navigate('freeMockTest')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs flex items-center justify-center gap-1 shadow hover:brightness-110 cursor-pointer"
                    >
                      <span>पूर्ण 40-प्रश्न टेस्ट में खोलें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                  </div>

                  {/* Home Indicator Bar */}
                  <div className="py-2 flex justify-center">
                    <div className="w-28 h-1 rounded-full bg-white/20"></div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 2. FLAGSHIP BENTO GRID: HIGH-TECH ARCHITECTURE CAPABILITIES */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>FLIGHT-GRADE TESTING ENGINE</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            {lang === 'hi' ? 'आधुनिक टेक के साथ बनाई गई उन्नत परीक्षा प्रणाली' : 'Engineered for Flawless Speed & Exam Precision'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-normal">
            {lang === 'hi' 
              ? 'बिना किसी रुकावट या हैंग के, हर क्लिक पर तत्काल रिस्पॉन्स और सटीक मूल्यांकन।' 
              : 'Designed with zero lag, instant bilingual switches, and district-level competitive rank benchmarking.'}
          </p>
        </div>

        {/* Bento Grid 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Bento Tile 1 */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300 group space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                {lang === 'hi' ? '0.02s क्वांटम लेटेंसी' : '0.02s Quantum Latency'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {lang === 'hi'
                  ? 'प्रश्नों के बीच स्विच करते समय 0 सेकंड का विलंब। परीक्षा कक्ष जैसी तेज़ गति एवं कीबोर्ड शॉर्टकट सपोर्ट।'
                  : 'Zero latency question switching with instant option feedback and keyboard shortkey navigation.'}
              </p>
            </div>
            <div className="text-[11px] text-emerald-400/80 font-mono font-semibold flex items-center gap-1">
              <span>Next-Gen Response</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Tile 2 */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.05] transition-all duration-300 group space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <Globe2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                {lang === 'hi' ? 'तत्काल द्विभाषी स्विच (HI/EN)' : 'Instant Bilingual Switch'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {lang === 'hi'
                  ? 'परीक्षा के दौरान किसी भी प्रश्न को 1-क्लिक में हिंदी या अंग्रेजी में बदलें बिना पेज रीलोड किए।'
                  : 'Toggle any question between Hindi and English instantly during the active test with zero reload.'}
              </p>
            </div>
            <div className="text-[11px] text-cyan-400/80 font-mono font-semibold flex items-center gap-1">
              <span>Hindi & English Engine</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Tile 3 */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.05] transition-all duration-300 group space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                {lang === 'hi' ? 'अधिकृत Vyapam OMR सिमुलेशन' : 'Exact Vyapam OMR Replica'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {lang === 'hi'
                  ? 'वास्तविक ESB परीक्षा केंद्र की तरह 5-रंगीन प्रश्न स्थिति पैलेट: हरा, लाल, बैंगनी एवं चिह्नित।'
                  : 'Authentic 5-state color coded OMR palette identical to real MP Vyapam computer lab screens.'}
              </p>
            </div>
            <div className="text-[11px] text-amber-400/80 font-mono font-semibold flex items-center gap-1">
              <span>Official Exam Hall UI</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Tile 4 */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-teal-500/50 hover:bg-white/[0.05] transition-all duration-300 group space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-teal-400 transition-colors">
                {lang === 'hi' ? '52 जिलों की ऑल MP रैंक' : '52 Districts Rank Analytics'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {lang === 'hi'
                  ? 'इंदौर, भोपाल, जबलपुर सहित पूरे मप्र के छात्रों के बीच अपनी पर्सेंटाइल, कमजोर विषय व कट-ऑफ देखें।'
                  : 'Deep performance analytics, district percentiles, negative mark impact, and verified certificates.'}
              </p>
            </div>
            <div className="text-[11px] text-teal-400/80 font-mono font-semibold flex items-center gap-1">
              <span>State-Wide Percentile</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. TEST SERIES SHOWCASE WITH TECH GLASS CARDS */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{lang === 'hi' ? 'सक्रिय टेस्ट सीरीज़ एवं मॉक सेट्स' : 'Active Test Series Catalog'}</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {lang === 'hi' ? 'नवीनतम परीक्षा पैटर्न 2026 के अनुसार तैयार प्रामाणिक सेट्स' : 'Verified test series for MP State Govt Recruitment'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'परीक्षा या विषय खोजें...' : 'Search test series...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-stone-100 text-xs focus:outline-none focus:border-emerald-500 placeholder-stone-500"
            />
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black scale-102'
                  : 'bg-white/[0.04] text-stone-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'hi' ? cat.labelHi : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeries.map(series => (
            <div key={series.id} className="transition-transform duration-300 hover:-translate-y-1">
              <TestCard series={series} />
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================= */}
      {/* 4. BANNER CAROUSEL & LATEST NOTIFICATIONS */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <BannerCarousel />
        <LatestNewsSection />
        <SocialLiveTicker />
        <SocialMediaSection />
      </section>

      {/* Floating Bottom Quick Design Switcher Button (Admin Only) */}
      {currentUser?.role === 'admin' && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 z-40">
          <DesignSwitcherPill compact={true} />
        </div>
      )}

    </div>
  );
};
