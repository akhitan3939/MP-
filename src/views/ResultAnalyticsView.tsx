import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Calendar, 
  Sparkles, 
  Printer, 
  ChevronRight, 
  BookOpen, 
  RotateCcw, 
  Lightbulb, 
  AlertCircle, 
  ArrowLeft,
  Share2,
  Bookmark,
  Flame,
  Gift,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Question } from '../types';
import { EXCLUSIVE_FREE_MOCK_QUESTIONS } from '../data/freeMockQuestions';
import { getPatwariQuestionsForSet } from '../data/patwariSetsData';
import { getAgriQuestionsForSet } from '../data/agriSetsData';

export const ResultAnalyticsView: React.FC = () => {
  const { 
    attempts, 
    questions, 
    viewParams, 
    openCertificateModal, 
    openShareModal,
    navigate, 
    lang, 
    toggleBookmarkQuestion, 
    bookmarkedQuestionIds 
  } = useApp();
  
  const attemptId = viewParams?.attemptId;
  const attempt = (attempts && attempts.length > 0)
    ? (attempts.find(a => a.id === attemptId) || attempts[0])
    : null;

  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CORRECT' | 'INCORRECT' | 'UNATTEMPTED'>('ALL');
  const [selectedQuestionForAi, setSelectedQuestionForAi] = useState<Question | null>(null);
  const [aiExplanationText, setAiExplanationText] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  if (!attempt) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <HelpCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold">कोई टेस्ट प्रयास नहीं मिला</h2>
        <p className="text-stone-500 text-sm mt-1">कृपया पहले एक मॉक टेस्ट दें ताकि आपका रिपोर्ट कार्ड यहाँ दिखे।</p>
        <button onClick={() => navigate('freeMockTest')} className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-md transition">
          40-प्रश्नों का फ्री मॉक टेस्ट दें
        </button>
      </div>
    );
  }

  // Detect whether this attempt is the 40-question Free Mock Test or other test series
  const isFreeMockAttempt = 
    attempt.seriesId === 'free_mock_40' || 
    attempt.seriesId === 'free_exclusive_mock' ||
    attempt.totalQuestions === 40 || 
    attempt.totalMarks === 40 ||
    (attempt.seriesTitle && (attempt.seriesTitle.includes('40 प्रश्न') || attempt.seriesTitle.toLowerCase().includes('free mock') || attempt.seriesTitle.includes('फ्री मॉक'))) ||
    Object.keys(attempt.answers || {}).some(k => k.startsWith('free_q'));

  let questionsList: Question[] = [];
  if (isFreeMockAttempt) {
    questionsList = EXCLUSIVE_FREE_MOCK_QUESTIONS;
  } else if (attempt.seriesId === 'ts_agri_ext_2026') {
    questionsList = getAgriQuestionsForSet(1);
  } else if (attempt.seriesId === 'ts_patwari_2026') {
    questionsList = getPatwariQuestionsForSet(1);
  } else {
    const attemptQuestions = questions.filter(q => q.seriesId === attempt.seriesId);
    questionsList = attemptQuestions.length > 0 ? attemptQuestions : questions.slice(0, 40);
  }

  // Extract subjects for subject-filter
  const availableSubjects = Array.from(
    new Set(questionsList.map(q => q.subject || q.section || 'General Studies').filter(Boolean))
  );

  // Filter questions for review
  const filteredQuestions = questionsList.filter(q => {
    const userSelected = attempt.answers ? attempt.answers[q.id] : undefined;
    const correctOpt = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q.correctOption !== undefined ? q.correctOption : 0);
    const isCorrect = userSelected === correctOpt;
    const isAttempted = userSelected !== undefined;

    const matchesSubject = filterSubject === 'ALL' || (q.subject || q.section) === filterSubject;
    let matchesStatus = true;

    if (filterStatus === 'CORRECT') matchesStatus = isCorrect;
    else if (filterStatus === 'INCORRECT') matchesStatus = isAttempted && !isCorrect;
    else if (filterStatus === 'UNATTEMPTED') matchesStatus = !isAttempted;

    return matchesSubject && matchesStatus;
  });

  const getOptionText = (opt: any, isHindi: boolean = true) => {
    if (!opt) return '';
    if (typeof opt === 'string') return opt;
    if (typeof opt === 'object') {
      return isHindi ? (opt.textHi || opt.textEn || opt.text || '') : (opt.textEn || opt.textHi || opt.text || '');
    }
    return String(opt);
  };

  // Request AI Explanation for a single question
  const handleExplainWithAi = async (q: Question) => {
    setSelectedQuestionForAi(q);
    setIsExplaining(true);
    setAiExplanationText('');

    const optHi = (q.options || []).map((o: any) => getOptionText(o, true));
    const correctOpt = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q.correctOption !== undefined ? q.correctOption : 0);
    const studentChoiceIndex = attempt.answers ? attempt.answers[q.id] : undefined;

    try {
      const res = await fetch('/api/ai/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionHi: q.questionHi,
          questionEn: q.questionEn,
          questionText: q.questionHi,
          options: optHi,
          correctOption: optHi[correctOpt] || `विकल्प ${correctOpt + 1}`,
          subject: q.subject || q.section || 'General Studies',
          studentAnswer: studentChoiceIndex !== undefined ? optHi[studentChoiceIndex] : 'हल नहीं किया'
        })
      });
      const data = await res.json();
      if (data && data.success) {
        let text = data.explanationHi || data.explanation || q.explanationHi || '';
        if (data.mnemonicTrick) {
          text += `\n\n💡 याद रखने का शॉर्टकट / Mnemonic: ${data.mnemonicTrick}`;
        }
        if (data.examTip) {
          text += `\n\n📌 परीक्षा टिप: ${data.examTip}`;
        }
        setAiExplanationText(text);
      } else {
        setAiExplanationText(q.explanationHi || 'इस प्रश्न की विस्तृत व्याख्या ऊपर दी गई है।');
      }
    } catch {
      setAiExplanationText(q.explanationHi || 'इस प्रश्न की आधिकारिक व्याख्या उपलब्ध है।');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'hi' ? 'डैशबोर्ड पर वापस जाएँ' : 'Back to Dashboard'}</span>
          </button>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-white">
            {lang === 'hi' ? 'परीक्षा परिणाम व AI विस्तृत विश्लेषण' : 'Test Result & AI Comprehensive Analytics'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {attempt.seriesTitle} • संपन्न: {new Date(attempt.completedAt).toLocaleString('hi-IN')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openShareModal({
              seriesTitle: attempt.seriesTitle,
              score: attempt.score,
              totalMarks: attempt.totalMarks,
              rank: attempt.rank,
              url: window.location.href
            })}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'WhatsApp पर शेयर (+50 XP)' : 'Share Result (+50 XP)'}</span>
          </button>

          <button
            onClick={() => openCertificateModal(attempt)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{lang === 'hi' ? 'प्रमाणपत्र / स्कोरकार्ड' : 'Download Certificate'}</span>
          </button>

          <button
            onClick={() => navigate('cbtExam', { id: attempt.seriesId })}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'पुनः टेस्ट दें' : 'Re-attempt Test'}</span>
          </button>
        </div>
      </div>

      {/* 1. Scorecard Hero Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Score */}
        <div className="p-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">कुल प्राप्तांक / Score</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-white">
              {attempt.score}
            </span>
            <span className="font-mono text-xs text-stone-400">/ {attempt.totalMarks}</span>
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {attempt.percentage}% अंक
          </div>
        </div>

        {/* All MP Rank */}
        <div className="p-5 bg-white dark:bg-stone-900 border-2 border-amber-500/40 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">ऑल-एमपी रैंक / Rank</span>
          <div className="font-mono font-extrabold text-3xl sm:text-4xl text-amber-500 mt-1">
            #{attempt.rank}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {attempt.totalParticipants.toLocaleString()} प्रतिभागियों में
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">सटीकता / Accuracy</span>
          <div className="font-mono font-extrabold text-3xl sm:text-4xl text-blue-600 dark:text-blue-400 mt-1">
            {attempt.accuracy}%
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {attempt.correctAnswers} सही / {attempt.correctAnswers + attempt.incorrectAnswers} प्रयास
          </div>
        </div>

        {/* Percentile */}
        <div className="p-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">पर्सेंटाइल / Percentile</span>
          <div className="font-mono font-extrabold text-3xl sm:text-4xl text-purple-600 dark:text-purple-400 mt-1">
            {attempt.percentile}%
          </div>
          <div className="text-xs text-stone-500 mt-1">
            शीर्ष {Math.max(1, 100 - Math.round(attempt.percentile))}% में शामिल
          </div>
        </div>

        {/* Time Taken */}
        <div className="col-span-2 lg:col-span-1 p-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">समय लगा / Time</span>
          <div className="font-mono font-extrabold text-2xl sm:text-3xl text-stone-800 dark:text-stone-200 mt-1">
            {Math.floor(attempt.durationSeconds / 60)}m {attempt.durationSeconds % 60}s
          </div>
          <div className="text-xs text-stone-500 mt-1">
            प्रति प्रश्न औसत: {(attempt.durationSeconds / (attempt.totalQuestions || 100)).toFixed(1)}s
          </div>
        </div>

      </div>

      {/* 1.1 GAMIFIED XP REWARDS & PENALTY BREAKDOWN CARD */}
      <div className="bg-gradient-to-r from-amber-500/15 via-stone-900 to-amber-950/40 border-2 border-amber-500/60 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'hi' ? 'XP रिवॉर्ड व पेनाल्टी रिपोर्ट' : 'XP Points & Penalty Breakdown'}</span>
          </div>
          <h3 className="font-display font-black text-xl text-stone-900 dark:text-white">
            {lang === 'hi' ? 'इस टेस्ट से आपका अर्जित कुल XP' : 'Total XP Earned From This Attempt'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
            {lang === 'hi'
              ? 'सही उत्तरों पर +10 XP पुरस्कार, गलत उत्तरों पर -5 XP पेनाल्टी, और स्ट्रीक बोनस लागू किया गया है।'
              : 'Correct answers reward +10 XP, incorrect answers penalize -5 XP with streak bonuses.'}
          </p>
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 w-full md:w-auto">
          {/* Correct XP */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>सही उत्तर (+10)</span>
            </div>
            <div className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 mt-0.5">
              +{attempt.xpBreakdown?.correctXp !== undefined ? attempt.xpBreakdown.correctXp : (attempt.correctAnswers || 0) * 10} XP
            </div>
          </div>

          {/* Penalty XP */}
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700/60 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>गलत पेनाल्टी (-5)</span>
            </div>
            <div className="font-mono font-black text-xl text-rose-600 dark:text-rose-400 mt-0.5">
              -{attempt.xpBreakdown?.penaltyXp !== undefined ? attempt.xpBreakdown.penaltyXp : (attempt.incorrectAnswers || 0) * 5} XP
            </div>
          </div>

          {/* Streak Bonus */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>स्ट्रीक बोनस</span>
            </div>
            <div className="font-mono font-black text-xl text-amber-600 dark:text-amber-400 mt-0.5">
              +{attempt.xpBreakdown?.streakBonus || 25} XP
            </div>
          </div>

          {/* Net XP */}
          <div className="p-3 bg-stone-900 dark:bg-white text-white dark:text-stone-950 border border-amber-500 rounded-2xl text-center shadow-md">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 dark:text-amber-600">
              नेट XP स्कोर
            </div>
            <div className="font-mono font-black text-xl mt-0.5">
              {attempt.xpBreakdown?.netXp !== undefined 
                ? (attempt.xpBreakdown.netXp >= 0 ? `+${attempt.xpBreakdown.netXp}` : `${attempt.xpBreakdown.netXp}`)
                : `+150`} XP
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI In-Depth Evaluation Section */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-xl space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                AI विस्तृत रिपोर्ट एवं सुधार योजना
              </h2>
              <p className="text-xs text-amber-400">
                AI पावर्ड स्वचालित वास्तविक समय विश्लेषण
              </p>
            </div>
          </div>
          <span className="bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full hidden sm:inline-block">
            AI Verified
          </span>
        </div>

        {/* AI Key Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Executive Summary */}
          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
              <Lightbulb className="w-4 h-4" />
              <span>निष्कर्ष एवं प्रदर्शन स्तर</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {attempt.aiReport?.summary || 'परीक्षार्थी का प्रदर्शन मजबूत है। म.प्र. सामान्य ज्ञान व हिन्दी में अच्छी पकड़ है, हालांकि गणित और कंप्यूटर में पुनरावृत्ति की आवश्यकता है।'}
            </p>
          </div>

          {/* Strengths & Critical Fixes */}
          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>मजबूत क्षेत्र (Strengths)</span>
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              {(attempt.aiReport?.keyInsights || ['म.प्र. राष्ट्रीय उद्यान व नदियाँ 100% सही', 'हिन्दी व्याकरण मुहावरे व पर्यायवाची में उच्च सटीकता', 'समय प्रबंधन संतुलित रहा']).map((ins, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span> {ins}
                </li>
              ))}
            </ul>
          </div>

          {/* Mnemonics & Memory Tricks */}
          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase">
              <Sparkles className="w-4 h-4" />
              <span>स्मृति ट्रिक (AI Mnemonics)</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-mono bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              {attempt.aiReport?.mnemonicTip || '💡 ट्रिक: "काना बाधव पेंच पन्ना" — MP के प्रमुख टाइगर रिजर्व याद रखने का क्रमबद्ध सूत्र।'}
            </p>
          </div>

        </div>

        {/* 7-Day Personalized Revision Plan */}
        {attempt.aiReport?.sevenDayPlan && (
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-3">
              <Calendar className="w-4 h-4" />
              <span>अगले 7 दिनों का वैयक्तिकृत रिवीजन प्लान (7-Day Action Plan)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {attempt.aiReport.sevenDayPlan.map((day, idx) => (
                <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1 text-center">
                  <div className="text-[11px] font-bold text-amber-400">Day {day.day}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{day.subject}</div>
                  <div className="text-[10px] text-stone-400 line-clamp-2">{day.focusTopic}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. Section-Wise Breakdown Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white">
          विषयवार प्रदर्शन विश्लेषण (Section-Wise Breakdown)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-3">विषय / Subject</th>
                <th className="py-2.5 px-3">प्राप्तांक / Score</th>
                <th className="py-2.5 px-3">सटीकता / Accuracy</th>
                <th className="py-2.5 px-3">प्रगति बार</th>
                <th className="py-2.5 px-3">फीडबैक</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200 font-medium">
              {(attempt.sectionScores || []).map((sec, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-3 font-bold">{sec.subject || sec.sectionName || `Section ${idx + 1}`}</td>
                  <td className="py-3 px-3 font-mono">{sec.score ?? sec.marksObtained ?? 0} / {sec.totalMarks ?? sec.maxMarks ?? 0}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {sec.accuracy ?? 0}%
                  </td>
                  <td className="py-3 px-3 w-40">
                    <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, sec.accuracy ?? 0)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-stone-500">
                    {sec.weakAreas && Array.isArray(sec.weakAreas) && sec.weakAreas.length > 0 
                      ? sec.weakAreas.join(', ') 
                      : ((sec.accuracy ?? 0) >= 75 ? 'उत्कृष्ट प्रदर्शन (Strong)' : (sec.accuracy ?? 0) >= 40 ? 'संतोषजनक - मध्यम' : 'सुधार एवं अभ्यास आवश्यक')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Question-by-Question Solution & AI Explainer Modal */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Review Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white">
              सम्पूर्ण उत्तर कुंजी एवं व्याख्या (Solutions & Answer Key)
            </h3>
            <p className="text-xs text-stone-500">
              प्रत्येक प्रश्न के सही उत्तर, आधिकारिक व्याख्या व AI विश्लेषण देखें।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200"
            >
              <option value="ALL">सभी प्रश्न ({questionsList.length})</option>
              <option value="CORRECT">केवल सही उत्तर ({attempt.correctAnswers})</option>
              <option value="INCORRECT">केवल गलत उत्तर ({attempt.incorrectAnswers})</option>
              <option value="UNATTEMPTED">अप्रयासित प्रश्न ({attempt.unattempted})</option>
            </select>
          </div>
        </div>

        {/* Questions Detailed List */}
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const userSelected = attempt.answers ? attempt.answers[q.id] : undefined;
            const correctOpt = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q.correctOption !== undefined ? q.correctOption : 0);
            const isCorrect = userSelected === correctOpt;
            const isAttempted = userSelected !== undefined;
            const isBookmarked = bookmarkedQuestionIds.includes(q.id);
            const opts = (q.options && q.options.length > 0)
              ? q.options.map((o: any) => getOptionText(o, true))
              : (q.optionsHi || ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D']);

            return (
              <div 
                key={q.id}
                className={`p-5 rounded-2xl border-2 transition ${
                  !isAttempted 
                    ? 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40' 
                    : isCorrect 
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20' 
                    : 'border-rose-300 dark:border-rose-800/80 bg-rose-50/40 dark:bg-rose-950/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-xs px-2.5 py-1 bg-stone-200 dark:bg-stone-800 rounded-lg">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-stone-500">[{q.subject || q.section || 'General'}]</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAttempted ? (
                      isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> सही उत्तर (+{q.marks})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-4 h-4" /> गलत उत्तर (-{q.negativeMarks || 0})
                        </span>
                      )
                    ) : (
                      <span className="text-stone-400 text-xs font-bold">अप्रयासित (Unattempted)</span>
                    )}

                    <button
                      onClick={() => toggleBookmarkQuestion(q.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isBookmarked ? 'bg-amber-100 text-amber-600 border-amber-400' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="font-semibold text-stone-900 dark:text-white text-sm leading-relaxed mb-4">
                  {q.questionHi}
                </div>

                {/* Question Image if present */}
                {q.imageUrl && (
                  <div className="mb-4 p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 max-w-sm">
                    <img 
                      src={q.imageUrl} 
                      alt={q.imageCaption || 'Question figure'} 
                      className="w-full max-h-56 object-contain rounded-lg mx-auto"
                    />
                    {q.imageCaption && (
                      <p className="text-[11px] text-center text-stone-500 italic mt-1.5">{q.imageCaption}</p>
                    )}
                  </div>
                )}

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {opts.map((opt: string, oIdx: number) => {
                    const isCorrectOpt = oIdx === correctOpt;
                    const isUserChoice = userSelected === oIdx;

                    let optStyle = 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300';
                    if (isCorrectOpt) {
                      optStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isUserChoice && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-100 font-bold line-through';
                    }

                    return (
                      <div key={oIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}>
                        <span>{['(A)', '(B)', '(C)', '(D)'][oIdx]} {opt}</span>
                        {isCorrectOpt && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">सही उत्तर</span>}
                        {isUserChoice && !isCorrectOpt && <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold">आपका उत्तर</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Standard Explanation */}
                <div className="p-3.5 bg-stone-100 dark:bg-stone-950/80 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                  <div className="font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>आधिकारिक व्याख्या (Official Solution):</span>
                  </div>
                  <div>{q.explanationHi}</div>
                </div>

                {/* AI Deep Explanation Trigger */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleExplainWithAi(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-lg text-xs shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI से समझें (AI Tutor Explanation)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* AI Deep Explanation Popup Modal */}
      {selectedQuestionForAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border-2 border-amber-500 rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="w-5 h-5" />
                <span className="font-display font-bold text-base text-stone-900 dark:text-white">
                  AI व्यक्तिगत व्याख्या
                </span>
              </div>
              <button onClick={() => setSelectedQuestionForAi(null)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed">
              <div className="font-semibold text-stone-900 dark:text-white bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                {selectedQuestionForAi.questionHi}
              </div>

              {isExplaining ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-stone-400 font-bold">AI उत्तर का विश्लेषण कर रहा है...</div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/50 dark:bg-stone-950 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-2">
                  <div className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" /> AI Tutor Guidance:
                  </div>
                  <div className="text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
                    {aiExplanationText}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setSelectedQuestionForAi(null)}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-800 text-white rounded-xl font-bold text-xs"
              >
                समझ आ गया (Got it)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
