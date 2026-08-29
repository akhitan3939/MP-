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
  ListOrdered
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
    lang, 
    navigate, 
    openCertificateModal, 
    openNotesModal, 
    openRemindersModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ENROLLED' | 'ATTEMPTS' | 'BOOKMARKS' | 'NOTES'>('ENROLLED');
  const [selectedSetPerSeries, setSelectedSetPerSeries] = useState<{ [key: string]: number }>({
    'ts_patwari_2026': 1
  });

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
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {currentUser?.district || 'मध्यप्रदेश'}
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
            <span className="text-[10px] uppercase font-bold text-stone-400">अर्जित XP स्कोर</span>
            <div className="font-mono font-extrabold text-2xl text-amber-500 mt-1">
              {currentUser?.xp || 0} XP
            </div>
            <div className="text-[11px] text-amber-600 font-bold mt-0.5">{currentUser?.streak || 1} दिन स्ट्रीक 🔥</div>
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

    </div>
  );
};
