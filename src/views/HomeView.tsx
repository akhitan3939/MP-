import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TestCard } from '../components/TestCard';
import { BannerCarousel } from '../components/BannerCarousel';
import { SocialMediaSection } from '../components/SocialMediaSection';
import { SocialLiveTicker } from '../components/SocialLiveTicker';
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
  UserPlus
} from 'lucide-react';
import { ExamCategory } from '../types';

export const HomeView: React.FC = () => {
  const { testSeries, lang, navigate, openNotesModal, openAuthModal, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ExamCategory; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'समस्त परीक्षाएं (All)', labelEn: 'All Exams', icon: '🏛️' },
    { id: 'agri', labelHi: 'कृषि (समूह-02 उपसमूह-01)', labelEn: 'Agri (Group-02 Sub-01)', icon: '🌱' },
    { id: 'patwari', labelHi: 'समूह-02 उपसमूह-04', labelEn: 'Group-02 Sub-04', icon: '🌾' },
    { id: 'mppsc', labelHi: 'MPPSC प्रारंभिक (GS+CSAT)', labelEn: 'MPPSC Prelims', icon: '📜' },
    { id: 'police', labelHi: 'MP पुलिस आरक्षक & SI', labelEn: 'MP Police SI/Constable', icon: '🎖️' },
    { id: 'vyapam', labelHi: 'व्यापम समूह-4 / AG-3', labelEn: 'MP Vyapam (ESB)', icon: '💼' },
    { id: 'vanrakshak', labelHi: 'वनरक्षक / क्षेत्ररक्षक', labelEn: 'MP Forest Guard', icon: '🌲' },
    { id: 'tet', labelHi: 'MP शिक्षक पात्रता (TET)', labelEn: 'MP TET Varg 2/3', icon: '📚' },
  ];

  const filteredSeries = testSeries.filter(s => {
    // Hide inactive series from homepage so students cannot purchase/view inactive ones
    if (s.isActive === false) return false;
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      s.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.departmentHi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Hero Section with MP Cultural Motifs */}
      <section className="relative overflow-hidden bg-[#7A2A1E] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 border-b-4 border-[#D4A017]">
        
        {/* Background Gond Motif Overlay */}
        <div className="absolute inset-0 bg-gond-pattern pointer-events-none opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5E1F16]/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[#5E1F16] border-2 border-[#D4A017]/60 text-[#D4A017] text-xs sm:text-sm font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-inner">
                <Shield className="w-4 h-4 text-[#D4A017]" />
                <span>{lang === 'hi' ? 'मध्यप्रदेश की प्रामाणिक परीक्षा टेस्ट सीरीज़' : 'Madhya Pradesh Govt Exam Portal 2026'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-black text-3xl sm:text-5xl xl:text-6xl text-white tracking-tight leading-[1.12]">
                {lang === 'hi' ? (
                  <>
                    <span className="text-[#D4A017]">समूह-02 (पटवारी), MPPSC,</span> पुलिस व व्यापम — अब सफलता पक्की!
                  </>
                ) : (
                  <>
                    <span className="text-[#D4A017]">Group-02 (Patwari), MPPSC,</span> Police & Vyapam CBT Mock Tests
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-[#FFFBF2]/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {lang === 'hi'
                  ? 'असली परीक्षा जैसा माहौल, हिंदी व अंग्रेजी द्विभाषी प्रश्न, तुरंत रिज़ल्ट और AI द्वारा विस्तृत उत्तर विश्लेषण व कमजोर क्षेत्रों का सुधार प्लान।'
                  : 'Experience authentic MP CBT exams, bilingual questions in Hindi & English, instant scores, and AI detailed evaluations.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => navigate('freeMockTest')}
                  className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#c08f12] text-stone-950 font-black uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xl shadow-amber-900/30 transition hover:scale-105 active:scale-95 text-sm sm:text-base border-2 border-white/40 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-stone-950" />
                  <span>{lang === 'hi' ? '🎯 40-प्रश्न फ्री मॉक टेस्ट शुरू करें' : 'Start 40-Question Free Mock'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const catalogEl = document.getElementById('catalog-section');
                    catalogEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-[#5E1F16] hover:bg-[#963E2F] text-white border-2 border-[#D4A017]/60 font-black uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-[#D4A017]" />
                  <span>{lang === 'hi' ? 'टेस्ट सीरीज़ देखें' : 'Test Series Catalog'}</span>
                </button>

                <button
                  onClick={() => openNotesModal()}
                  className="inline-flex items-center gap-2 bg-[#7A2A1E]/80 hover:bg-[#963E2F] text-[#EAD8B1] hover:text-white border border-[#D4A017]/40 font-bold uppercase tracking-wider px-4 py-3.5 rounded-xl shadow transition text-xs sm:text-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#D4A017]" />
                  <span>{lang === 'hi' ? 'GK नोट्स (PDF)' : 'Free Notes'}</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#963E2F] text-center lg:text-left text-xs text-[#EAD8B1]">
                <div>
                  <div className="font-mono font-black text-[#D4A017] text-xl sm:text-2xl">50,000+</div>
                  <div className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">{lang === 'hi' ? 'सक्रिय परीक्षार्थी' : 'Aspirants'}</div>
                </div>
                <div>
                  <div className="font-mono font-black text-white text-xl sm:text-2xl">250+</div>
                  <div className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">{lang === 'hi' ? 'मॉक टेस्ट उपलब्ध' : 'Mock Tests'}</div>
                </div>
                <div>
                  <div className="font-mono font-black text-[#D4A017] text-xl sm:text-2xl">AI</div>
                  <div className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">{lang === 'hi' ? 'तुरंत स्कोर विश्लेषण' : 'Instant AI Analysis'}</div>
                </div>
              </div>

            </div>

            {/* Right Hero Card / Interactive Seal Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-[#5E1F16] border-2 border-[#D4A017] rounded-3xl p-6 shadow-2xl relative">
                
                {/* Traditional Arch Header */}
                <div className="flex items-center justify-between border-b border-[#963E2F] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017] animate-ping"></span>
                    <span className="text-xs font-black text-[#D4A017] uppercase tracking-wider">
                      {lang === 'hi' ? 'लाइव मॉक टेस्ट एक्टिव' : 'Live Mock Active'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#EAD8B1]">2026 Batch</span>
                </div>

                {/* Featured Test Spotlight */}
                <div className="bg-[#7A2A1E] border-2 border-[#D4A017]/40 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-black text-[#D4A017] uppercase tracking-wider">विशेष मुफ़्त डेमो टेस्ट</span>
                    <span className="bg-emerald-500 text-stone-950 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                      40 MCQs • FREE DEMO
                    </span>
                  </div>
                  <h4 className="font-display font-black text-base text-white mt-1">
                    ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)
                  </h4>
                  <p className="text-xs text-[#EAD8B1] mt-1 font-medium">
                    40 प्रश्न • 30 मिनट • MP GK, हिन्दी, गणित, रीजनिंग, कंप्यूटर, विज्ञान, अंग्रेजी
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-[#D4A017]">
                      28,450+ {lang === 'hi' ? 'छात्रों ने दिया' : 'attempted'}
                    </div>
                    <button
                      onClick={() => navigate('cbtExam', { isFreeMock40: true, id: 'free_mock_40' })}
                      className="inline-flex items-center gap-1 bg-[#D4A017] hover:bg-[#c08f12] text-black text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow transition cursor-pointer"
                    >
                      <span>{lang === 'hi' ? '40-प्रश्न डेमो दें' : 'Start 40Q Demo'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Features Pillars Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#7A2A1E]/80 border border-[#963E2F] rounded-xl flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#D4A017] shrink-0" />
                    <span className="text-white text-[11px] font-bold">AI मूल्यांकन</span>
                  </div>
                  <div className="p-2.5 bg-[#7A2A1E]/80 border border-[#963E2F] rounded-xl flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#D4A017] shrink-0" />
                    <span className="text-white text-[11px] font-bold">ऑल-एमपी लाइव रैंक</span>
                  </div>
                  <div className="p-2.5 bg-[#7A2A1E]/80 border border-[#963E2F] rounded-xl flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#D4A017] shrink-0" />
                    <span className="text-white text-[11px] font-bold">तुरंत स्कोरकार्ड</span>
                  </div>
                  <div className="p-2.5 bg-[#7A2A1E]/80 border border-[#963E2F] rounded-xl flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4A017] shrink-0" />
                    <span className="text-white text-[11px] font-bold">ऑफलाइन PDF नोट्स</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 10-Item 4-Second Auto-Scrolling Banner Carousel */}
      <section className="pt-2">
        <BannerCarousel />
      </section>

      {/* 3. New Student Sign Up Quick Callout Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-[#D4A017] to-amber-600 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-950 text-[#D4A017] flex items-center justify-center font-black shrink-0 shadow">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base leading-tight">
                {lang === 'hi' ? 'नया छात्र पंजीकरण (Free Registration) करें और ₹500 वेलकम बोनस XP पाएँ!' : 'New Aspirant Free Sign Up & Get ₹500 Welcome Bonus XP!'}
              </h3>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {lang === 'hi' ? '55 जिलों के 50,000+ अभ्यर्थियों के साथ ऑल-एमपी लाइव रैंक और निःशुल्क ई-नोट्स अनलॉक करें।' : 'Join 50,000+ aspirants across 55 MP districts with live state rank and free e-notes.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal('register')}
              className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-[#D4A017] text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-md transition hover:scale-105"
            >
              {lang === 'hi' ? '📝 नया खाता बनाएँ (Sign Up)' : 'Sign Up Free'}
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2.5 bg-white/80 hover:bg-white text-stone-950 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow transition"
            >
              {lang === 'hi' ? 'लॉगिन करें' : 'Login'}
            </button>
          </div>
        </div>
      </section>

      {/* 4. Test Series Catalog & Filters Section */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#7A2A1E] dark:text-[#D4A017]">
              {lang === 'hi' ? 'भर्ती वार मॉक टेस्ट पैक' : 'Exam Test Series Catalog'}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#2D2424] dark:text-white mt-1 tracking-tight">
              {lang === 'hi' ? 'मध्यप्रदेश प्रमुख भर्ती टेस्ट सीरीज़' : 'Explore MP Govt Exam Test Series'}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm mt-1 font-medium">
              {lang === 'hi' 
                ? 'ऑनलाइन खरीद के साथ कभी भी टेस्ट दें, असीमित पुनः प्रयास और AI फीडबैक पाएँ।' 
                : 'Purchase once, attempt anytime with unlimited re-attempts and real-time AI feedback.'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'परीक्षा या विषय खोजें...' : 'Search exams or subjects...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-[#EAD8B1] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#2D2424] dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#7A2A1E] shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#D4A017] text-black shadow-md border-2 border-[#D4A017] scale-105'
                    : 'bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 text-[#2D2424] dark:text-stone-300 hover:border-[#7A2A1E] dark:hover:border-[#D4A017]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Test Series Cards Grid */}
        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeries.map((series) => (
              <TestCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border-2 border-[#EAD8B1] dark:border-stone-800 p-8 shadow-sm">
            <HelpCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-display font-black text-lg text-[#2D2424] dark:text-stone-200">
              {lang === 'hi' ? 'कोई टेस्ट सीरीज़ नहीं मिली' : 'No Test Series Found'}
            </h3>
            <p className="text-stone-500 text-xs mt-1 font-medium">
              {lang === 'hi' ? 'कृपया अन्य श्रेणी या खोज शब्द चुनें।' : 'Please adjust your search keywords or category.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#D4A017] hover:bg-[#c08f12] text-black text-xs font-black uppercase tracking-wider rounded-xl shadow transition"
            >
              {lang === 'hi' ? 'सभी टेस्ट सीरीज़ देखें' : 'View All Series'}
            </button>
          </div>
        )}

      </section>

      {/* 3. Why MP Pariksha Setu - Feature Pillars Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#5E1F16] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#D4A017] border-b-8 border-r-8 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4A017]">
              {lang === 'hi' ? 'अत्याधुनिक परीक्षा तकनीक' : 'High Tech & High Yield'}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-1 tracking-tight">
              {lang === 'hi' ? 'MP परीक्षा सेतु ही क्यों चुनें?' : 'Why Prepare with MP Pariksha Setu?'}
            </h2>
            <p className="text-[#FFFBF2]/90 text-xs sm:text-sm mt-1 font-medium">
              मध्यप्रदेश की सभी भर्ती परीक्षाओं के वास्तविक पैटर्न पर आधारित विशेष सुविधाएँ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-[#7A2A1E] border-2 border-[#D4A017]/40 rounded-2xl space-y-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-black flex items-center justify-center font-black shadow">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-lg text-white">
                {lang === 'hi' ? 'AI आंसर इवैल्यूएशन' : 'AI Answer Evaluation'}
              </h3>
              <p className="text-xs text-[#EAD8B1] leading-relaxed font-medium">
                टेस्ट सबमिट करते ही AI आपके गलत प्रश्नों के पीछे के कारणों, शॉर्टकट ट्रिक्स और 7-दिवसीय वैयक्तिकृत अध्ययन टाइमटेबल तैयार करता है।
              </p>
            </div>

            <div className="p-6 bg-[#7A2A1E] border-2 border-[#D4A017]/40 rounded-2xl space-y-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-black flex items-center justify-center font-black shadow">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-lg text-white">
                {lang === 'hi' ? 'ऑल-एमपी लाइव लीडरबोर्ड' : 'All-MP Live Leaderboard'}
              </h3>
              <p className="text-xs text-[#EAD8B1] leading-relaxed font-medium">
                मध्यप्रदेश के सभी 55 जिलों (इंदौर, भोपाल, ग्वालियर, जबलपुर आदि) के हजारों छात्रों के साथ लाइव रैंक, पर्सेंटाइल और प्रोग्रेस ग्राफ।
              </p>
            </div>

            <div className="p-6 bg-[#7A2A1E] border-2 border-[#D4A017]/40 rounded-2xl space-y-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-black flex items-center justify-center font-black shadow">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-lg text-white">
                {lang === 'hi' ? 'सुरक्षित Razorpay चेकआउट' : 'Secure Razorpay Checkout'}
              </h3>
              <p className="text-xs text-[#EAD8B1] leading-relaxed font-medium">
                UPI (GPay, PhonePe, Paytm), QR कोड, कार्ड्स द्वारा तुरंत भुगतान, GST टैक्स इनवॉइस और तत्काल टेस्ट अनलॉक।
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Social Media & Aspirants Community Network */}
      <SocialMediaSection />

    </div>
  );
};
