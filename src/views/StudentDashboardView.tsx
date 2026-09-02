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
  Percent
} from 'lucide-react';
import { ALL_20_PATWARI_SETS } from '../data/patwariSetsData';

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

  const [activeTab, setActiveTab] = useState<'ENROLLED' | 'ATTEMPTS' | 'BOOKMARKS' | 'COUPONS'>('ENROLLED');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [selectedSetPerSeries, setSelectedSetPerSeries] = useState<{ [key: string]: number }>({
    'ts_patwari_2026': 1
  });

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(lang === 'hi' ? `कूपन कोड '${code}' कॉपी किया गया!` : `Coupon '${code}' copied!`);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const enrolledSeries = testSeries.filter(s => enrolledSeriesIds.includes(s.id));
  const userAttempts = attempts.filter(a => a.userId === currentUser?.id);
  const bookmarkedQuestions = questions.filter(q => bookmarkedQuestionIds.includes(q.id));

  const totalTestsAttempted = userAttempts.length;
  const avgAccuracy = totalTestsAttempted > 0 
    ? +(userAttempts.reduce((acc, cur) => acc + cur.accuracy, 0) / totalTestsAttempted).toFixed(1)
    : 0;
  const bestScore = userAttempts.length > 0
    ? Math.max(...userAttempts.map(a => a.score))
    : 0;

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
          onClick={() => setActiveTab('ENROLLED')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'ENROLLED'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          {lang === 'hi' ? `नामांकित टेस्ट सीरीज़ (${enrolledSeries.length})` : `My Test Series (${enrolledSeries.length})`}
        </button>

        <button
          onClick={() => setActiveTab('ATTEMPTS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'ATTEMPTS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          {lang === 'hi' ? `टेस्ट परिणाम व AI रिपोर्ट (${userAttempts.length})` : `Attempt History (${userAttempts.length})`}
        </button>

        <button
          onClick={() => setActiveTab('BOOKMARKS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'BOOKMARKS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          {lang === 'hi' ? `बुकमार्क प्रश्न बैंक (${bookmarkedQuestions.length})` : `Saved Questions (${bookmarkedQuestions.length})`}
        </button>

        <button
          onClick={() => setActiveTab('COUPONS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'COUPONS'
              ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>{lang === 'hi' ? `विशेष डिस्काउंट कूपन` : `Discount Coupons`}</span>
        </button>
      </div>

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
                        onClick={() => navigate('testDetail', { id: series.id })}
                        className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 cursor-pointer"
                      >
                        {lang === 'hi' ? '20 सेट्स सूची' : 'View All Sets'}
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
                className="mt-4 px-5 py-2.5 bg-amber-500 text-stone-950 font-extrabold rounded-xl text-xs shadow"
              >
                टेस्ट सीरीज़ कैटलॉग देखें
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Attempts History */}
      {activeTab === 'ATTEMPTS' && (
        <div className="space-y-3">
          {userAttempts.length > 0 ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4">परीक्षा / Test Name</th>
                      <th className="py-3 px-4">प्राप्तांक / Score</th>
                      <th className="py-3 px-4">ऑल-एमपी रैंक</th>
                      <th className="py-3 px-4">सटीकता</th>
                      <th className="py-3 px-4">तारीख</th>
                      <th className="py-3 px-4 text-right">एक्शन</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200 font-medium">
                    {userAttempts.map(att => (
                      <tr key={att.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                          {att.seriesTitle}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {att.score} / {att.totalMarks} ({att.percentage}%)
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600">
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
                            className="px-2.5 py-1 bg-stone-900 dark:bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            AI रिपोर्ट
                          </button>
                          <button
                            onClick={() => openCertificateModal(att)}
                            className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg text-[11px]"
                          >
                            प्रमाणपत्र
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <Award className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <div className="text-sm font-bold">अभी तक कोई टेस्ट सबमिट नहीं किया गया</div>
              <button
                onClick={() => navigate('cbtExam', { id: 'ts_patwari_2026' })}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                पहला मॉक टेस्ट दें
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
