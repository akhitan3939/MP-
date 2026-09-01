import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  BookCheck, 
  Star, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Award,
  Play,
  Download,
  ListOrdered,
  HelpCircle,
  Zap
} from 'lucide-react';
import { ALL_20_PATWARI_SETS } from '../data/patwariSetsData';
import { ALL_20_AGRI_SETS } from '../data/agriSetsData';

export const TestDetailView: React.FC = () => {
  const { testSeries, viewParams, lang, navigate, isEnrolled, openRazorpayModal, openNotesModal, currentUser } = useApp();
  
  const seriesId = viewParams?.id || 'ts_agri_ext_2026';
  const series = testSeries.find(s => s.id === seriesId);

  // If deleted or not found
  if (!series || (series.isActive === false && currentUser?.role !== 'admin')) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center text-2xl font-black">
          ⚠️
        </div>
        <h2 className="font-display font-black text-2xl text-stone-800 dark:text-white">
          {lang === 'hi' ? 'यह टेस्ट सीरीज़ वर्तमान में उपलब्ध नहीं है' : 'This Test Series is Currently Unavailable'}
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto">
          {lang === 'hi' 
            ? 'प्रशासक द्वारा यह टेस्ट सीरीज़ निष्क्रिय अथवा अपडेट की जा रही है। कृपया अन्य सक्रिय मॉक टेस्ट देखें।' 
            : 'This test series has been deactivated or is undergoing maintenance. Please explore our active mock tests.'}
        </p>
        <button
          onClick={() => navigate('catalog')}
          className="px-6 py-3 rounded-2xl bg-[#7A2A1E] text-[#D4A017] font-black border-2 border-[#D4A017] shadow-lg hover:bg-[#5E1F16] transition"
        >
          {lang === 'hi' ? 'सभी उपलब्ध टेस्ट सीरीज़ देखें' : 'View Available Test Series'}
        </button>
      </div>
    );
  }

  const enrolled = isEnrolled(series.id);
  const isPatwari = series.id === 'ts_patwari_2026';
  const isAgri = series.id === 'ts_agri_ext_2026';
  const has20Sets = isPatwari || isAgri;

  const disabledNumbers: number[] = Array.isArray(series.disabledSetNumbers) ? series.disabledSetNumbers : [];
  const maxSetsCount = typeof series.activeSetsCount === 'number' ? series.activeSetsCount : (series.totalTests || 20);

  const [filterMode, setFilterMode] = useState<'all' | 'free' | 'full'>('all');

  const rawSetsList = isAgri ? ALL_20_AGRI_SETS : ALL_20_PATWARI_SETS;

  // Active sets list: For students/visitors strictly exclude disabled sets. Admin sees all with indicator.
  const visibleSetsList = rawSetsList.filter(set => {
    if (currentUser?.role === 'admin') return true;
    const isSetDisabled = disabledNumbers.includes(set.setNumber);
    const isWithinAttachedCount = set.setNumber <= (series.totalTests || 20);
    return !isSetDisabled && isWithinAttachedCount;
  });

  const [selectedSetNumber, setSelectedSetNumber] = useState<number>(() => {
    const firstActive = visibleSetsList.find(s => !disabledNumbers.includes(s.setNumber));
    return firstActive ? firstActive.setNumber : (visibleSetsList[0]?.setNumber || 1);
  });

  const setsToDisplay = visibleSetsList.filter(set => {
    if (filterMode === 'free') return set.setNumber <= 10;
    if (filterMode === 'full') return set.setNumber > 10;
    return true;
  });

  const activeCountOnly = rawSetsList.filter(s => !disabledNumbers.includes(s.setNumber) && s.setNumber <= (series.totalTests || 20)).length;

  const handleLaunchSelectedSet = (setNum?: number) => {
    const targetNum = setNum || selectedSetNumber;
    if (enrolled) {
      navigate('cbtExam', { id: series.id, setId: targetNum });
    } else {
      openRazorpayModal(series);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('catalog')}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'hi' ? '← सभी टेस्ट सीरीज़ पर वापस जाएँ' : '← Back to all test series'}</span>
      </button>

      {/* Main Hero Header Card */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                {lang === 'hi' ? series.departmentHi : series.department}
              </span>
              {series.badgeTagHi && (
                <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
                  {lang === 'hi' ? series.badgeTagHi : series.badgeTagEn}
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-stone-900 dark:text-white leading-tight">
              {lang === 'hi' ? series.titleHi : series.titleEn}
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-base leading-relaxed">
              {lang === 'hi' ? series.descriptionHi : series.descriptionEn}
            </p>

            {/* Meta statistics bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">कुल टेस्ट / Tests</span>
                <span className="font-bold text-stone-900 dark:text-white text-sm sm:text-base">
                  {currentUser?.role === 'admin' ? `${activeCountOnly} / ${series.totalTests || 20} Active Mocks` : `${activeCountOnly} Full Mocks`}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">समय / Duration</span>
                <span className="font-bold text-stone-900 dark:text-white text-sm sm:text-base">{series.durationMinutes} Minutes</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">भाषा / Medium</span>
                <span className="font-bold text-stone-900 dark:text-white text-sm sm:text-base">द्विभाषी (Hindi + English)</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">रेटिंग / Rating</span>
                <span className="font-bold text-amber-500 text-sm sm:text-base flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500" /> {series.rating} ({series.enrolledCount} enrolled)
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Box on Right */}
          <div className="lg:col-span-4 bg-stone-50 dark:bg-stone-950/80 border-2 border-amber-500/50 rounded-2xl p-6 text-center space-y-4 shadow-md">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                {lang === 'hi' ? 'विशेष ऑफर मूल्य' : 'Special Offer Price'}
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="font-mono font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-white">
                  ₹{series.price}
                </span>
                <span className="font-mono text-base text-stone-400 line-through">
                  ₹{series.originalPrice}
                </span>
              </div>
              <span className="inline-block mt-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full">
                {Math.round(((series.originalPrice - series.price) / series.originalPrice) * 100)}% Instant Discount
              </span>
            </div>

            {/* If 20-sets series (Patwari or Agri), show intuitive Set Selector Dropdown */}
            {has20Sets && (
              <div className="text-left bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3 rounded-xl space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300">
                  🎯 {lang === 'hi' ? `सक्रिय सेट चुनें (${activeCountOnly} उपलब्ध):` : `Select Active Mock Set (${activeCountOnly} available):`}
                </label>
                <select
                  value={selectedSetNumber}
                  onChange={(e) => setSelectedSetNumber(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-bold rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                >
                  {visibleSetsList.map(s => {
                    const isSetDisabled = disabledNumbers.includes(s.setNumber);
                    return (
                      <option key={s.setNumber} value={s.setNumber}>
                        सेट #{s.setNumber}: {s.titleHi} {isSetDisabled ? '🔴 (एडमिन: निष्क्रिय)' : (!enrolled ? '🔒 (पेमेंट के बाद अनलॉक)' : '🟢 (अनलॉक)')}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {enrolled ? (
              <button
                onClick={() => handleLaunchSelectedSet(selectedSetNumber)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{has20Sets ? (lang === 'hi' ? `सेट #${selectedSetNumber} शुरू करें` : `Start Set #${selectedSetNumber}`) : (lang === 'hi' ? 'टेस्ट देना शुरू करें' : 'Start CBT Mock Test')}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => openRazorpayModal(series)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition hover:scale-105 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'सभी 20 सेट्स अनलॉक करें (₹' + series.price + ')' : 'Unlock All 20 Sets (₹' + series.price + ')'}</span>
                </button>

                <button
                  onClick={() => navigate('cbtExam', { isFreeMock40: true, id: 'free_mock_40' })}
                  className="w-full py-2.5 bg-white dark:bg-stone-900 border border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🎁 {lang === 'hi' ? '40 प्रश्नों का अलग मुफ़्त डेमो टेस्ट दें' : 'Take Separate 40Q Free Demo Mock'}</span>
                </button>
              </div>
            )}

            <div className="text-[11px] text-stone-500 space-y-1 text-left pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>असीमित पुनः प्रयास (Unlimited Re-attempts)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>AI विस्तृत उत्तर कुंजी & रैंक</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>ऑफलाइन PDF नोट्स व हल शामिल</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 20 Full-Length Mock Test Sets Selection Grid */}
      {has20Sets && (
        <div className="bg-white dark:bg-stone-900 border-2 border-amber-500/40 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] mb-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
                <span>20 Full Mock Test Sets Repository (200 प्रश्न प्रति सेट)</span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 dark:text-white">
                {isAgri 
                  ? (lang === 'hi' ? 'समूह-2 उपसमूह-1 (RAEO/कृषि): संपूर्ण 20 टेस्ट सेट्स सूची' : 'Group-2 SubGroup-1 (RAEO/Agri): Complete 20 Test Sets')
                  : (lang === 'hi' ? 'MP पटवारी 2026: संपूर्ण 20 टेस्ट सेट्स सूची' : 'MP Patwari 2026: Complete 20 Test Sets List')}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {isAgri 
                  ? (lang === 'hi'
                      ? 'सभी 20 सेट्स 200-200 प्रश्नों (भाग-1 सामान्य 100 प्रश्न + भाग-2 कृषि 100 प्रश्न) एवं 180 मिनट के सटीक परीक्षा समय के साथ तैयार हैं।'
                      : 'All 20 sets ready with 200 questions (Part-1 General 100 + Part-2 Agri 100) and 180 mins timer.')
                  : (lang === 'hi' 
                      ? 'सभी 20 सेट्स 200-200 प्रश्नों, 8 विषयों एवं 180 मिनट के सटीक परीक्षा समय के साथ तैयार हैं।' 
                      : 'All 20 sets ready with 200 questions, 8 subjects, and 180 mins timer.')}
              </p>
            </div>

            {/* Filter Toggle (Set Ranges) */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterMode === 'all' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'}`}
              >
                {lang === 'hi' ? 'सभी 20 सेट्स (All 20)' : 'All 20 Sets'}
              </button>
              <button
                onClick={() => setFilterMode('free')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterMode === 'free' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'}`}
              >
                {lang === 'hi' ? 'सेट 1–10' : 'Sets 1-10'}
              </button>
              <button
                onClick={() => setFilterMode('full')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterMode === 'full' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'}`}
              >
                {lang === 'hi' ? 'सेट 11–20' : 'Sets 11-20'}
              </button>
            </div>
          </div>

          {/* 20 Sets Grid */}
          {setsToDisplay.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 dark:bg-stone-850/50 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-2">
              <span className="text-2xl">📭</span>
              <h4 className="font-bold text-sm text-stone-700 dark:text-stone-300">
                {lang === 'hi' ? 'वर्तमान में इस श्रेणी में कोई सक्रिय टेस्ट सेट उपलब्ध नहीं है।' : 'No active test sets currently available in this filter.'}
              </h4>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'कृपया अन्य श्रेणी चुनें अथवा बाद में पुनः प्रयास करें।' : 'Please check back later or switch filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {setsToDisplay.map((mockSet) => {
                const canAccess = enrolled;
                const isSetDisabled = disabledNumbers.includes(mockSet.setNumber);

                return (
                  <div
                    key={mockSet.setNumber}
                    className={`relative rounded-2xl border-2 p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                      isSetDisabled 
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 opacity-90' 
                        : 'bg-stone-50 dark:bg-stone-850/70 border-stone-200 dark:border-stone-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-950">
                          SET #{mockSet.setNumber}
                        </span>
                        {isSetDisabled ? (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1">
                            🔴 एडमिन: निष्क्रिय
                          </span>
                        ) : enrolled ? (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            ✓ अनलॉक
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> 200 Qs मॉक
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-sm text-stone-900 dark:text-white leading-snug line-clamp-1">
                        {lang === 'hi' ? mockSet.titleHi : mockSet.titleEn}
                      </h4>

                      <div className="grid grid-cols-3 gap-1 text-[11px] text-stone-600 dark:text-stone-300 bg-white/70 dark:bg-stone-900/60 p-2 rounded-xl border border-stone-200/60 dark:border-stone-800 text-center">
                        <div>
                          <span className="block text-[9px] text-stone-400 font-bold uppercase">प्रश्न</span>
                          <span className="font-bold">{mockSet.totalQuestions}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-stone-400 font-bold uppercase">अंक</span>
                          <span className="font-bold">{mockSet.totalMarks}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-stone-400 font-bold uppercase">समय</span>
                          <span className="font-bold">{mockSet.durationMinutes}m</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-200/80 dark:border-stone-800">
                      {isSetDisabled ? (
                        <div className="py-2 px-3 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-bold rounded-xl text-center">
                          ⚠️ यह सेट वर्तमान में निष्क्रिय है
                        </div>
                      ) : canAccess ? (
                        <button
                          onClick={() => navigate('cbtExam', { id: series.id, setId: mockSet.setNumber })}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{lang === 'hi' ? `सेट #${mockSet.setNumber} शुरू करें` : `Start Set #${mockSet.setNumber}`}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openRazorpayModal(series)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? '20 सेट्स अनलॉक करें (₹' + series.price + ')' : 'Unlock Mock Set'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Syllabus & Features Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Syllabus & Subjects */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Syllabus Section */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
              <BookCheck className="w-5 h-5 text-amber-500" />
              <span>{lang === 'hi' ? 'पाठ्यक्रम एवं विषय वार अंक विभाजन' : 'Syllabus & Subject Weightage'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(series?.syllabus || []).map((subj: any, idx: number) => {
                const title = typeof subj === 'string' 
                  ? subj 
                  : (lang === 'hi' ? (subj?.sectionHi || subj?.section) : (subj?.section || subj?.sectionHi));
                const meta = typeof subj === 'object' && subj && (subj.questionsCount || subj.marks) 
                  ? `${subj.questionsCount || 0} Qs • ${subj.marks || 0} Marks` 
                  : null;

                return (
                  <div 
                    key={idx}
                    className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-xs sm:text-sm text-stone-800 dark:text-stone-200">{title}</span>
                    </div>
                    {meta && (
                      <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 shrink-0 bg-stone-200/60 dark:bg-stone-700/60 px-2 py-0.5 rounded">
                        {meta}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Features Included */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{lang === 'hi' ? 'इस टेस्ट पैकेज में क्या शामिल है?' : 'What is included in this package?'}</span>
            </h3>

            <div className="space-y-2.5">
              {((lang === 'hi' ? series?.featuresHi : series?.featuresEn) || (lang === 'hi' ? [
                '100% नवीनतम MP ESB / आयोग पाठ्यक्रम आधारित',
                'AI आधारित व्यक्तिगत विश्लेषण व कमजोर क्षेत्र पहचान',
                'ऑल-मध्यप्रदेश लाइव मेरिट रैंक व परसेंटाइल',
                'विस्तृत द्विभाषी (Hindi + English) समाधान व व्याख्या',
                'मुफ्त डाउनलोड योग्य हस्तलिखित ई-नोट्स एवं PDF'
              ] : [
                '100% based on latest MP ESB / Commission exam pattern',
                'AI-driven personalized analysis & weakness detector',
                'All-MP State Live Merit Rank & Percentile Score',
                'Comprehensive bilingual (Hindi + English) solutions',
                'Free downloadable handwritten study notes & PDFs'
              ])).map((feat: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    ✓
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Free Handouts & Help */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Download className="w-4 h-4" />
              <span>{lang === 'hi' ? 'मुफ्त ई-नोट्स संलग्न' : 'Free E-Notes Included'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              इस टेस्ट सीरीज़ के साथ आपको 5 प्रमुख विषयों के हस्तलिखित नोट्स और म.प्र. समसामयिकी 2026 PDF मुफ्त प्राप्त होगी।
            </p>
            <button
              onClick={() => openNotesModal()}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-xl text-xs font-bold transition"
            >
              📥 {lang === 'hi' ? 'नोट्स संग्रह देखें' : 'View Notes Repository'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
