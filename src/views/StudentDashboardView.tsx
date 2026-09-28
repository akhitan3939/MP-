import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Award, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  Bookmark, 
  Bell, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Flame, 
  Download, 
  Play, 
  Trophy,
  Sparkles,
  Zap,
  ListOrdered,
  Gift,
  Share2,
  Tag,
  Copy,
  Check,
  Percent,
  Layers,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ALL_20_PATWARI_SETS } from '../data/patwariSetsData';
import { ALL_20_AGRI_SETS } from '../data/agriSetsData';
import { TestSeries } from '../types';

export const StudentDashboardView: React.FC = () => {
  const { 
    currentUser, 
    testSeries, 
    attempts, 
    enrolledSeriesIds, 
    bookmarkedQuestionIds, 
    questions, 
    reminders, 
    coupons,
    lang, 
    navigate, 
    openCertificateModal, 
    openNotesModal, 
    openRemindersModal,
    openShareModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ENROLLED' | 'PAID_REPORTS' | 'ATTEMPTS' | 'BOOKMARKS' | 'COUPONS'>('PAID_REPORTS');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [selectedSetPerSeries, setSelectedSetPerSeries] = useState<{ [key: string]: number }>({
    'ts_patwari_2026': 1
  });
  const [expandedSeriesReports, setExpandedSeriesReports] = useState<{ [seriesId: string]: boolean }>({
    'ts_patwari_2026': true
  });
  const [attemptFilter, setAttemptFilter] = useState<'ALL' | 'PAID' | 'FREE'>('ALL');

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(lang === 'hi' ? `कूपन कोड '${code}' कॉपी किया गया!` : `Coupon '${code}' copied!`);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const enrolledSeries = testSeries.filter(s => enrolledSeriesIds.includes(s.id));
  const userAttempts = attempts.filter(a => a.userId === currentUser?.id);
  const bookmarkedQuestions = questions.filter(q => bookmarkedQuestionIds.includes(q.id));

  // Categorized user attempts
  const isPaidAttempt = (a: any) => Boolean(
    a.isPaidTest || 
    (a.totalQuestions && a.totalQuestions > 40) || 
    (a.seriesId && a.seriesId !== 'free_mock_40' && a.seriesId !== 'free_exclusive_mock') ||
    a.testType === 'PAID_SERIES'
  );

  const paidAttempts = userAttempts.filter(isPaidAttempt);
  const freeAttempts = userAttempts.filter(a => !isPaidAttempt(a));

  const filteredUserAttempts = attemptFilter === 'PAID' 
    ? paidAttempts 
    : attemptFilter === 'FREE' 
    ? freeAttempts 
    : userAttempts;

  const totalTestsAttempted = userAttempts.length;
  const avgAccuracy = totalTestsAttempted > 0 
    ? +(userAttempts.reduce((acc, cur) => acc + (cur.accuracy || 0), 0) / totalTestsAttempted).toFixed(1)
    : 0;
  const bestScore = userAttempts.length > 0
    ? Math.max(...userAttempts.map(a => a.score || 0))
    : 0;

  // Helper to get sets metadata for a given test series
  const getSetsListForSeries = (s: TestSeries) => {
    if (s.id === 'ts_agri_ext_2026') return ALL_20_AGRI_SETS;
    if (s.id === 'ts_patwari_2026') return ALL_20_PATWARI_SETS;
    const total = s.totalTests || 20;
    return Array.from({ length: total }, (_, i) => ({
      setNumber: i + 1,
      titleHi: `मॉक टेस्ट सेट #${i + 1} (फुल लेंथ 200 प्रश्न)`,
      titleEn: `Mock Test Set #${i + 1} (Full Length 200 Qs)`,
      isFreeDemo: i === 0,
      totalQuestions: s.totalQuestions || 200,
      durationMinutes: s.durationMinutes || 180,
      totalMarks: s.totalMarks || 200
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Student Profile & Stats Banner */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center font-display font-extrabold text-2xl text-stone-950 shadow-md">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 dark:text-white">
                  {currentUser?.name || 'परीक्षार्थी'}
                </h1>
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <span>📍</span>
                  <span>{currentUser?.district || 'भोपाल'}{currentUser?.state ? ` (${currentUser.state})` : ''}</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                लक्ष्य: <strong className="text-stone-800 dark:text-stone-200">{currentUser?.targetExam}</strong> • {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openRemindersModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{lang === 'hi' ? 'स्टडी रिमाइंडर' : 'Reminders'}</span>
            </button>

            <button
              onClick={() => openNotesModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold shadow transition"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'hi' ? 'ई-नोट्स (PDF)' : 'E-Notes'}</span>
            </button>
          </div>
        </div>

        {/* 4 Performance KPI Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">कुल टेस्ट हल किए</span>
            <div className="font-mono font-extrabold text-2xl text-stone-900 dark:text-white mt-1">
              {totalTestsAttempted} Mocks
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">नियमित अभ्यास जारी</div>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">औसत सटीकता (Accuracy)</span>
            <div className="font-mono font-extrabold text-2xl text-blue-600 dark:text-blue-400 mt-1">
              {avgAccuracy}%
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">लक्ष्य 85%+ रखें</div>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">दैनिक अध्ययन स्ट्रीक</span>
            <div className="font-mono font-extrabold text-2xl text-orange-500 mt-1 flex items-center gap-1.5">
              <span>{currentUser?.streak || 1} दिन</span>
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">लगातार सक्रिय अभ्यास</div>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">सर्वश्रेष्ठ प्राप्तांक</span>
            <div className="font-mono font-extrabold text-2xl text-purple-600 dark:text-purple-400 mt-1">
              {bestScore} अंक
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">ऑल-एमपी मेरिट तैयार</div>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('PAID_REPORTS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'PAID_REPORTS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{lang === 'hi' ? `💎 सशुल्क टेस्ट रिपोर्ट व सेट्स प्रोग्रेस` : `Paid Test Series Reports`}</span>
        </button>

        <button
          onClick={() => setActiveTab('ENROLLED')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'ENROLLED'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{lang === 'hi' ? `नामांकित टेस्ट सीरीज़ (${enrolledSeries.length})` : `My Test Series (${enrolledSeries.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('ATTEMPTS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'ATTEMPTS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{lang === 'hi' ? `टेस्ट परिणाम व AI रिपोर्ट (${userAttempts.length})` : `Attempt History (${userAttempts.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('BOOKMARKS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'BOOKMARKS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{lang === 'hi' ? `बुकमार्क प्रश्न बैंक (${bookmarkedQuestions.length})` : `Saved Questions (${bookmarkedQuestions.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('COUPONS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'COUPONS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>{lang === 'hi' ? `विशेष डिस्काउंट कूपन` : `Discount Coupons`}</span>
        </button>
      </div>

      {/* TAB: PAID TEST SERIES REPORTS (Comprehensive Set Breakdown & Results) */}
      {activeTab === 'PAID_REPORTS' && (
        <div className="space-y-6">
          {enrolledSeries.length > 0 ? (
            <div className="space-y-6">
              {enrolledSeries.map(series => {
                const sets = getSetsListForSeries(series);
                const totalSetsCount = sets.length;
                const seriesAttempts = userAttempts.filter(a => a.seriesId === series.id);
                
                // Set-by-set mapping
                const setAttemptMap = new Map<number, any[]>();
                seriesAttempts.forEach(att => {
                  const sNum = (att as any).setNumber || 1;
                  if (!setAttemptMap.has(sNum)) {
                    setAttemptMap.set(sNum, []);
                  }
                  setAttemptMap.get(sNum)!.push(att);
                });

                const attemptedSetsCount = setAttemptMap.size;
                const pendingSetsCount = Math.max(0, totalSetsCount - attemptedSetsCount);
                const completionPercentage = totalSetsCount > 0 ? Math.round((attemptedSetsCount / totalSetsCount) * 100) : 0;
                
                const seriesTotalScore = seriesAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
                const seriesAvgScore = seriesAttempts.length > 0 ? +(seriesTotalScore / seriesAttempts.length).toFixed(1) : 0;
                const seriesBestScore = seriesAttempts.length > 0 ? Math.max(...seriesAttempts.map(a => a.score || 0)) : 0;
                const seriesBestRank = seriesAttempts.length > 0 ? Math.min(...seriesAttempts.map(a => a.rank || 9999)) : null;

                const isExpanded = expandedSeriesReports[series.id] !== false;

                return (
                  <div 
                    key={series.id}
                    className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-md space-y-6"
                  >
                    {/* Header: Title, Department, Progress Overview */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                            {series.department || 'मध्यप्रदेश शासन'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                            💎 सशुल्क टेस्ट सीरीज़ (Active)
                          </span>
                        </div>
                        <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-white">
                          {lang === 'hi' ? series.titleHi : series.titleEn}
                        </h2>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          {lang === 'hi' 
                            ? `कुल ${totalSetsCount} फुल टेस्ट सेट्स (200 प्रश्न प्रति टेस्ट) • असीमित पुनः प्रयास • ऑल-एमपी रैंक व AI रिपोर्ट` 
                            : `Full Mock Series (${totalSetsCount} Sets) • Unlimited Re-attempts • State Rank & AI Diagnostics`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedSeriesReports(prev => ({ ...prev, [series.id]: !isExpanded }))}
                          className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span>{isExpanded ? (lang === 'hi' ? 'सेट्स सूची संक्षिप्त करें' : 'Collapse Sets') : (lang === 'hi' ? 'सभी सेट्स विवरण देखें' : 'View All Sets')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & KPI Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-950/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">टेस्ट प्रोग्रेस</span>
                        <div className="font-mono font-black text-lg sm:text-xl text-stone-900 dark:text-white mt-0.5">
                          {attemptedSetsCount} / {totalSetsCount} टेस्ट
                        </div>
                        <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                          {completionPercentage}% पूर्ण ({pendingSetsCount} शेष)
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">कुल प्रयास (Attempts)</span>
                        <div className="font-mono font-black text-lg sm:text-xl text-blue-600 dark:text-blue-400 mt-0.5">
                          {seriesAttempts.length} बार
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          असीमित पुनः प्रयास उपलब्ध
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">सर्वश्रेष्ठ स्कोर (Top Score)</span>
                        <div className="font-mono font-black text-lg sm:text-xl text-purple-600 dark:text-purple-400 mt-0.5">
                          {seriesAttempts.length > 0 ? `${seriesBestScore} अंक` : '—'}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {seriesAttempts.length > 0 ? `औसत: ${seriesAvgScore} अंक` : 'पहला टेस्ट दें'}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">सर्वश्रेष्ठ ऑल-एमपी रैंक</span>
                        <div className="font-mono font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {seriesBestRank ? `#${seriesBestRank}` : '—'}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          राज्य मेरिट सूची
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
                        <span>पाठ्यक्रम पूर्णता स्थिति (Coverage):</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{completionPercentage}% ({attemptedSetsCount} हल किए, {pendingSetsCount} शेष)</span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(4, completionPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Set-by-Set Status Matrix & Actions */}
                    {isExpanded && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-black text-base text-stone-900 dark:text-white flex items-center gap-2">
                            <ListOrdered className="w-4 h-4 text-amber-500" />
                            <span>{lang === 'hi' ? `सभी ${totalSetsCount} सेट्स का परिणाम व स्थिति (Set-by-Set Breakdown):` : `All ${totalSetsCount} Sets Status & Scorecard:`}</span>
                          </h3>
                          <span className="text-[11px] text-stone-500">
                            हरे रंग (✓) वाले टेस्ट पूर्ण हैं, धूसर (⏳) टेस्ट शेष हैं।
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {sets.map(s => {
                            const attemptsForSet = setAttemptMap.get(s.setNumber) || [];
                            const isAttempted = attemptsForSet.length > 0;
                            const latestAttempt = isAttempted 
                              ? attemptsForSet.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0] 
                              : null;
                            const bestScoreForSet = isAttempted ? Math.max(...attemptsForSet.map(a => a.score || 0)) : 0;
                            const maxMarksForSet = latestAttempt?.totalMarks || 200;

                            return (
                              <div
                                key={s.setNumber}
                                className={`p-4 rounded-2xl border-2 transition flex flex-col justify-between gap-3 ${
                                  isAttempted
                                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/40'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                                      isAttempted ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                                    }`}>
                                      SET #{s.setNumber}
                                    </span>
                                    {isAttempted ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>पूर्ण ({attemptsForSet.length} प्रयास)</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>शेष (Pending)</span>
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 dark:text-white line-clamp-1">
                                    {lang === 'hi' ? s.titleHi : s.titleEn}
                                  </h4>

                                  {isAttempted && latestAttempt ? (
                                    <div className="space-y-1 pt-1 border-t border-emerald-200 dark:border-emerald-900/60 text-xs">
                                      <div className="flex items-center justify-between">
                                        <span className="text-stone-500">सर्वश्रेष्ठ प्राप्तांक:</span>
                                        <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                                          {bestScoreForSet} / {maxMarksForSet} ({((bestScoreForSet / maxMarksForSet) * 100).toFixed(1)}%)
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-stone-500">ऑल-एमपी रैंक:</span>
                                        <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                                          #{latestAttempt.rank} / {latestAttempt.totalParticipants}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                                        <span>सटीकता: {latestAttempt.accuracy}%</span>
                                        <span>{new Date(latestAttempt.completedAt).toLocaleDateString('hi-IN')}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-800">
                                      200 प्रश्न • 180 मिनट • 8 विषय
                                    </div>
                                  )}
                                </div>

                                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2">
                                  {isAttempted && latestAttempt ? (
                                    <>
                                      <button
                                        onClick={() => navigate('resultAnalytics', { attemptId: latestAttempt.id })}
                                        className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-[11px] font-bold text-center transition flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                                        <span>AI रिपोर्ट</span>
                                      </button>
                                      <button
                                        onClick={() => navigate('cbtExam', { id: series.id, setId: s.setNumber })}
                                        className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                        title="पुनः अभ्यास करें"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>पुनः दें</span>
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => navigate('cbtExam', { id: series.id, setId: s.setNumber })}
                                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>🚀 अभी सेट #{s.setNumber} टेस्ट दें</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-4">
              <Award className="w-16 h-16 text-amber-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-stone-800 dark:text-white">
                  {lang === 'hi' ? 'कोई सशुल्क टेस्ट सीरीज़ सक्रिय नहीं है' : 'No Paid Test Series Active'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  {lang === 'hi' 
                    ? 'अपनी परीक्षा की तैयारी को पुख्ता करने के लिए 20 फुल लेंथ टेस्ट सीरीज़ अनलॉक करें। सभी सेट्स की विस्तृत AI रिपोर्ट और ऑल-एमपी रैंक उपलब्ध होगी।' 
                    : 'Unlock full test series packages to access 20 full sets, detailed AI reports, and state merit ranks.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('catalog')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition cursor-pointer"
                >
                  {lang === 'hi' ? '📚 टेस्ट सीरीज़ कैटलॉग देखें' : 'View Test Series'}
                </button>
                <button
                  onClick={() => navigate('freeMockTest')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs sm:text-sm shadow-lg transition cursor-pointer"
                >
                  {lang === 'hi' ? '🎯 40-प्रश्न फ्री डेमो दें' : 'Try Free Demo Mock'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: Enrolled Test Series */}
      {activeTab === 'ENROLLED' && (
        <div className="space-y-4">
          {enrolledSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledSeries.map(series => (
                <div 
                  key={series.id}
                  className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                      {series.department}
                    </span>
                    <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">
                      {lang === 'hi' ? series.titleHi : series.titleEn}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {lang === 'hi' ? series.descriptionHi : series.descriptionEn}
                    </p>
                    <div className="text-xs font-mono text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                      {series.totalTests} Full Mocks • Unlimited Re-attempts
                    </div>
                  </div>

                  <div className="mt-4 pt-3 space-y-3 border-t border-stone-100 dark:border-stone-800">
                    {series.id === 'ts_patwari_2026' && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                          <ListOrdered className="w-3.5 h-3.5 text-amber-500" />
                          <span>{lang === 'hi' ? 'सेट चुनें (Select Set):' : 'Choose Mock Set:'}</span>
                        </label>
                        <select
                          value={selectedSetPerSeries[series.id] || 1}
                          onChange={(e) => setSelectedSetPerSeries({
                            ...selectedSetPerSeries,
                            [series.id]: Number(e.target.value)
                          })}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-bold rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                        >
                          {ALL_20_PATWARI_SETS.map(s => (
                            <option key={s.setNumber} value={s.setNumber}>
                              सेट #{s.setNumber}: {s.titleHi}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setActiveTab('PAID_REPORTS');
                          setExpandedSeriesReports({ [series.id]: true });
                        }}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        {lang === 'hi' ? '📊 सेट्स रिपोर्ट कार्ड' : 'View Sets Report'}
                      </button>

                      <button
                        onClick={() => navigate('cbtExam', { 
                          id: series.id, 
                          setId: series.id === 'ts_patwari_2026' ? (selectedSetPerSeries[series.id] || 1) : 1 
                        })}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>
                          {series.id === 'ts_patwari_2026'
                            ? (lang === 'hi' ? `सेट #${selectedSetPerSeries[series.id] || 1} शुरू करें` : `Start Set #${selectedSetPerSeries[series.id] || 1}`)
                            : (lang === 'hi' ? 'टेस्ट शुरू करें' : 'Start CBT')}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
              <Award className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
                अभी तक कोई टेस्ट सीरीज़ नामांकित नहीं है
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                अपनी पसंदीदा परीक्षा चुनें और पूर्ण मॉक टेस्ट पैकेज अनलॉक करें।
              </p>
              <button
                onClick={() => navigate('catalog')}
                className="mt-4 px-5 py-2.5 bg-amber-500 text-stone-950 font-extrabold rounded-xl text-xs shadow cursor-pointer"
              >
                टेस्ट सीरीज़ कैटलॉग देखें
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Attempts History (With Paid vs Free Filter & Set Info) */}
      {activeTab === 'ATTEMPTS' && (
        <div className="space-y-4">
          
          {/* Sub-Filters: All vs Paid vs Free Mocks */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAttemptFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  attemptFilter === 'ALL'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {lang === 'hi' ? `सभी टेस्ट परिणाम (${userAttempts.length})` : `All Results (${userAttempts.length})`}
              </button>
              <button
                onClick={() => setAttemptFilter('PAID')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  attemptFilter === 'PAID'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>💎</span>
                <span>{lang === 'hi' ? `सशुल्क टेस्ट सीरीज़ (${paidAttempts.length})` : `Paid Tests (${paidAttempts.length})`}</span>
              </button>
              <button
                onClick={() => setAttemptFilter('FREE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  attemptFilter === 'FREE'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>🎯</span>
                <span>{lang === 'hi' ? `फ्री डेमो मॉक (${freeAttempts.length})` : `Free Demo (${freeAttempts.length})`}</span>
              </button>
            </div>

            <div className="text-xs text-stone-500 font-medium">
              कुल {filteredUserAttempts.length} टेस्ट परिणाम
            </div>
          </div>

          {filteredUserAttempts.length > 0 ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">प्रकार / Type</th>
                      <th className="py-3 px-4">परीक्षा / Test Name</th>
                      <th className="py-3 px-4">प्राप्तांक / Score</th>
                      <th className="py-3 px-4">ऑल-एमपी रैंक</th>
                      <th className="py-3 px-4">सटीकता</th>
                      <th className="py-3 px-4">तारीख</th>
                      <th className="py-3 px-4 text-right">एक्शन</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200 font-medium">
                    {filteredUserAttempts.map(att => {
                      const isPaid = isPaidAttempt(att);
                      const setNum = (att as any).setNumber || 1;

                      return (
                        <tr key={att.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                          <td className="py-3.5 px-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-black text-[10px] border border-amber-300 dark:border-amber-800">
                                <span>💎</span>
                                <span>सशुल्क SET #{setNum}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-black text-[10px] border border-emerald-300 dark:border-emerald-800">
                                <span>🎯</span>
                                <span>फ्री डेमो</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                            <div>{att.seriesTitle}</div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                              {att.totalQuestions || 40} प्रश्न • {Math.floor(att.durationSeconds / 60)} मिनट
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                            {att.score} / {att.totalMarks} ({att.percentage}%)
                          </td>
                          <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            #{att.rank} / {att.totalParticipants}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            {att.accuracy}%
                          </td>
                          <td className="py-3.5 px-4 text-stone-500">
                            {new Date(att.completedAt).toLocaleDateString('hi-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => navigate('resultAnalytics', { attemptId: att.id })}
                              className="px-2.5 py-1 bg-stone-900 dark:bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-bold text-[11px] cursor-pointer shadow-xs"
                            >
                              AI रिपोर्ट
                            </button>
                            <button
                              onClick={() => openCertificateModal(att)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] cursor-pointer shadow-xs"
                            >
                              प्रमाणपत्र
                            </button>
                            <button
                              onClick={() => navigate('cbtExam', { id: att.seriesId, setId: setNum })}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg font-bold text-[11px] cursor-pointer"
                              title="पुनः टेस्ट दें"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <Award className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-stone-700 dark:text-stone-300">
                {attemptFilter === 'PAID'
                  ? 'अभी तक कोई सशुल्क टेस्ट नहीं दिया गया है।'
                  : attemptFilter === 'FREE'
                  ? 'अभी तक कोई फ्री डेमो टेस्ट नहीं दिया गया है।'
                  : 'अभी तक कोई टेस्ट सबमिट नहीं किया गया।'}
              </div>
              <button
                onClick={() => navigate('catalog')}
                className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs cursor-pointer shadow-sm"
              >
                टेस्ट सीरीज़ देखें व अभ्यास शुरू करें
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Saved Bookmarked Questions */}
      {activeTab === 'BOOKMARKS' && (
        <div className="space-y-4">
          {bookmarkedQuestions.length > 0 ? (
            <div className="space-y-3">
              {bookmarkedQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-500">
                    <span>Q{idx + 1}. [{q.subject}]</span>
                    <span className="text-emerald-600 font-mono">+{q.marks} अंक</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-white">
                    {q.questionHi}
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl text-xs text-stone-600 dark:text-stone-300">
                    <strong className="text-emerald-600">सही उत्तर:</strong> {(q.optionsHi || q.options?.map((o: any) => typeof o === 'string' ? o : o.textHi || o.textEn || '') || [])[q.correctOption !== undefined ? q.correctOption : (q.correctOptionIndex || 0)] || 'विकल्प A'}
                    <div className="mt-1 text-stone-500">{q.explanationHi}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <Bookmark className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <div className="text-sm font-bold">कोई बुकमार्क प्रश्न नहीं मिला</div>
              <p className="text-xs text-stone-500 mt-0.5">टेस्ट देते समय कठिन प्रश्नों को बुकमार्क करें।</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Discount Coupons & Offers */}
      {activeTab === 'COUPONS' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 1. Offers Hero Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs">
                <Gift className="w-3.5 h-3.5 fill-current" />
                <span>MP परीक्षा सेतु विशेष डिस्काउंट व ऑफर्स</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                सक्रिय डिस्काउंट कूपन्स (Active Promo Offers)
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                {lang === 'hi'
                  ? 'नीचे दिए गए कूपन कोड को कॉपी करें और किसी भी टेस्ट सीरीज़ के चेकआउट पर लागू करके भारी छूट पाएँ!'
                  : 'Copy the coupon codes below and apply at checkout for instant discounts on premium test series!'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => openShareModal({
                  seriesTitle: 'MP ESB 2026 संपूर्ण मॉक टेस्ट सीरीज़'
                })}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>दोस्तों के साथ पोर्टल शेयर करें</span>
              </button>
            </div>
          </div>

          {/* 2. Active Platform Coupons Grid */}
          <div className="space-y-4">
            <h3 className="font-display font-black text-lg text-stone-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              <span>उपलब्ध कूपन कोड्स (Available Coupon Codes)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div 
                  key={coupon.code}
                  className="p-5 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% की छूट` : `₹${coupon.discountValue} की फ्लैट छूट`}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {coupon.expiresAt ? `वैधता: ${coupon.expiresAt}` : 'वैधता: 31 दिस. 2026'}
                      </span>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-300 dark:border-amber-800 flex items-center justify-between font-mono font-black text-base text-amber-600 dark:text-amber-400">
                      <span>{coupon.code}</span>
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1 transition cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCoupon === coupon.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-stone-950" />
                            <span>कॉपी हुआ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-950" />
                            <span>कॉपी करें</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {coupon.descriptionHi || coupon.descriptionEn || 'सभी 20-सेट फुल लेंथ मॉक टेस्ट सीरीज़ पर लागू।'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-bold">✓ 100% सत्यापित कूपन</span>
                    <button
                      onClick={() => navigate('catalog')}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      टेस्ट सीरीज़ देखें →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Study Tips & Benefits Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>नि:शुल्क डेमो टेस्ट्स</span>
              </div>
              <p className="text-xs text-stone-500">प्रत्येक टेस्ट सीरीज़ का पहला सेट पूर्णतः नि:शुल्क अभ्यास हेतु उपलब्ध है।</p>
            </div>

            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-600">
                <Flame className="w-4 h-4" />
                <span>दैनिक अध्ययन स्ट्रीक</span>
              </div>
              <p className="text-xs text-stone-500">प्रतिदिन कम से कम एक टेस्ट हल करके अपनी स्ट्रीक को लगातार सक्रिय रखें।</p>
            </div>

            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-600">
                <Award className="w-4 h-4" />
                <span>ऑल-एमपी ई-सर्टिफिकेट</span>
              </div>
              <p className="text-xs text-stone-500">टेस्ट पूरा करने पर तुरंत आधिकारिक रैंक व मार्क्स वाला सत्यापन प्रमाणपत्र डाउनलोड करें।</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
