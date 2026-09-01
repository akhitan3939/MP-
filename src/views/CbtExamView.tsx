import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  Calculator, 
  HelpCircle, 
  FileSpreadsheet, 
  AlertTriangle, 
  X, 
  Send, 
  Languages, 
  Edit3, 
  Maximize,
  Sparkles,
  Info,
  Lock,
  ArrowLeft,
  Home,
  LogOut,
  Layers,
  BookOpen,
  ZoomIn,
  Image as ImageIcon,
  Play,
  Volume2,
  VolumeX,
  Bell,
  AlertCircle
} from 'lucide-react';
import { AudioAlert } from '../utils/audioAlert';
import { Question, SectionScore, TestSeries } from '../types';
import { getPatwariQuestionsForSet, ALL_20_PATWARI_SETS } from '../data/patwariSetsData';
import { getAgriQuestionsForSet, ALL_20_AGRI_SETS } from '../data/agriSetsData';
import { EXCLUSIVE_FREE_MOCK_QUESTIONS } from '../data/freeMockQuestions';

export const CbtExamView: React.FC = () => {
  const { 
    testSeries, 
    questions: allQuestions, 
    viewParams, 
    currentUser, 
    submitTestAttempt, 
    navigate, 
    lang, 
    toggleBookmarkQuestion, 
    bookmarkedQuestionIds,
    showToast,
    isEnrolled,
    openRazorpayModal
  } = useApp();

  const isFreeMock40 = Boolean(viewParams?.isFreeMock40 || viewParams?.id === 'free_mock_40' || viewParams?.isDemoMode);
  const seriesId = viewParams?.id || (isFreeMock40 ? 'free_mock_40' : 'ts_patwari_2026');
  const foundSeries = isFreeMock40 
    ? {
        id: 'free_mock_40',
        titleHi: 'ऑल-मध्यप्रदेश फ्री मॉक टेस्ट (40 प्रश्न)',
        titleEn: 'All-MP Free Mock Test (40 Questions)',
        category: 'patwari' as const,
        department: 'Govt of MP',
        departmentHi: 'म.प्र. शासन',
        descriptionHi: '40 प्रश्नों का विशेष फ्री मॉक टेस्ट',
        descriptionEn: '40 Questions Standalone Free Mock Test',
        durationMinutes: 30,
        totalMarks: 40,
        totalQuestions: 40,
        totalTests: 1,
        negativeMarking: 0,
        isFreeDemoAvailable: true,
        freeTestsCount: 1,
        isFeatured: true,
        enrolledCount: 28450,
        rating: 4.9,
        pdfNotesCount: 5,
        price: 0,
        originalPrice: 0,
        syllabus: [
          { section: 'MP GK', sectionHi: 'म.प्र. सामान्य ज्ञान', questionsCount: 8, marks: 8 },
          { section: 'General Hindi', sectionHi: 'सामान्य हिन्दी', questionsCount: 6, marks: 6 },
          { section: 'Quantitative Aptitude', sectionHi: 'गणित', questionsCount: 6, marks: 6 },
          { section: 'Reasoning', sectionHi: 'तार्किक योग्यता', questionsCount: 6, marks: 6 },
          { section: 'Computer Science', sectionHi: 'कंप्यूटर ज्ञान', questionsCount: 6, marks: 6 },
          { section: 'General Science', sectionHi: 'सामान्य विज्ञान', questionsCount: 4, marks: 4 },
          { section: 'General English', sectionHi: 'सामान्य अंग्रेजी', questionsCount: 4, marks: 4 }
        ]
      }
    : testSeries.find(s => s.id === seriesId);

  // If deleted or deactivated
  if (!isFreeMock40 && (!foundSeries || (foundSeries.isActive === false && currentUser?.role !== 'admin'))) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center text-2xl font-black">
          ⚠️
        </div>
        <h2 className="font-display font-black text-2xl text-stone-800 dark:text-white">
          {lang === 'hi' ? 'यह टेस्ट वर्तमान में उपलब्ध नहीं है' : 'This Test is Currently Unavailable'}
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto">
          {lang === 'hi' 
            ? 'प्रशासक द्वारा यह टेस्ट सीरीज़ निष्क्रिय की गई है। कृपया अन्य टेस्ट में भाग लें।' 
            : 'This test series is inactive. Please choose another test series.'}
        </p>
        <button
          onClick={() => navigate('catalog')}
          className="px-6 py-3 rounded-2xl bg-[#7A2A1E] text-[#D4A017] font-black border-2 border-[#D4A017] shadow-lg hover:bg-[#5E1F16] transition"
        >
          {lang === 'hi' ? 'सभी टेस्ट सीरीज़ देखें' : 'View Test Series'}
        </button>
      </div>
    );
  }

  const series: TestSeries = foundSeries || testSeries[0];
  const initialSetNumber = viewParams?.setId ? Number(viewParams.setId) : 1;

  // Pre-Exam vs Running Exam state
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [chosenSetNumber, setChosenSetNumber] = useState<number>(initialSetNumber);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [preExamFilter, setPreExamFilter] = useState<'all' | 'free' | 'full'>('all');
  
  // Filter questions for this series and chosen set
  const examQuestions = isFreeMock40
    ? EXCLUSIVE_FREE_MOCK_QUESTIONS
    : series.id === 'ts_agri_ext_2026'
    ? getAgriQuestionsForSet(chosenSetNumber)
    : series.id === 'ts_patwari_2026'
    ? getPatwariQuestionsForSet(chosenSetNumber)
    : allQuestions.filter(q => q.seriesId === series.id);
  const questionsList = examQuestions.length > 0 ? examQuestions : allQuestions.slice(0, 10);

  // Helper to extract question subject / section consistently
  const getQuestionSubject = (q: Question | undefined): string => {
    if (!q) return 'General Studies';
    return q.section || q.subject || 'सामान्य अध्ययन';
  };

  // Extract unique subjects & their question counts
  const availableSubjects = Array.from(new Set(questionsList.map(q => getQuestionSubject(q))));
  
  const getSubjectQuestionCount = (subj: string) => {
    return questionsList.filter(q => getQuestionSubject(q) === subj).length;
  };

  // CBT Examination States
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [reviewedQuestionIds, setReviewedQuestionIds] = useState<string[]>([]);
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<string[]>([questionsList[0]?.id || 'q1']);
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [examLang, setExamLang] = useState<'hi' | 'en'>(lang || 'hi');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);

  // Utility Modals: Calculator, Scratchpad, Question Paper
  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);
  const [calcInput, setCalcInput] = useState<string>('');
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [scratchText, setScratchText] = useState<string>('');
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState<boolean>(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<{ url: string; caption?: string } | null>(null);

  // Time Alert Selection State (User can set maximum 2 alerts before exam ends)
  const defaultAlerts = isFreeMock40 ? [5, 2] : [10, 5];
  const [selectedAlertMinutes, setSelectedAlertMinutes] = useState<number[]>(defaultAlerts);
  const [isSoundAlertEnabled, setIsSoundAlertEnabled] = useState<boolean>(true);
  const [activeAlertBanner, setActiveAlertBanner] = useState<{ minutesLeft: number; message: string } | null>(null);
  const [triggeredAlertMinutes, setTriggeredAlertMinutes] = useState<number[]>([]);

  // Function to toggle alert minute (max 2 alerts enforced)
  const toggleAlertMinute = (min: number) => {
    if (selectedAlertMinutes.includes(min)) {
      setSelectedAlertMinutes(prev => prev.filter(m => m !== min));
    } else {
      if (selectedAlertMinutes.length >= 2) {
        showToast(lang === 'hi' ? '⚠️ आप अधिकतम 2 समय अलर्ट चुन सकते हैं।' : '⚠️ You can select a maximum of 2 alert times.');
        return;
      }
      setSelectedAlertMinutes(prev => [...prev, min].sort((a, b) => b - a));
    }
  };

  const testAlertSound = () => {
    AudioAlert.playTestBeep();
    showToast(lang === 'hi' ? '🔊 2 सेकंड का टेस्ट बीप बजाया गया!' : '🔊 Played 2-second test beep sound!');
  };

  // Timer State (Total Duration in Seconds)
  const initialDuration = series.durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const startTimeRef = useRef<number>(Date.now());

  const handleStartExam = () => {
    if (!agreedTerms) {
      showToast(lang === 'hi' ? '⚠️ कृपया पहले परीक्षा निर्देश सहमति चेकबॉक्स पर टिक करें।' : '⚠️ Please accept the instructions checkbox to proceed.');
      return;
    }

    if (!isFreeMock40 && !isEnrolled(series.id)) {
      openRazorpayModal(series);
      return;
    }

    startTimeRef.current = Date.now();
    setTimeLeft(series.durationMinutes * 60);
    setCurrentIdx(0);
    setUserAnswers({});
    setReviewedQuestionIds([]);
    setVisitedQuestionIds([questionsList[0]?.id || 'q1']);
    setTriggeredAlertMinutes([]);
    setActiveAlertBanner(null);
    setIsExamStarted(true);
    showToast(
      lang === 'hi' 
        ? (isFreeMock40 
            ? '🚀 40 प्रश्नों का ऑल-मध्यप्रदेश फ्री मॉक टेस्ट प्रारंभ हो गया है। शुभकामनाएँ!' 
            : `🚀 सेट #${chosenSetNumber} का 200 प्रश्नों का पेपर प्रारंभ हो गया है। शुभकामनाएँ!`)
        : (isFreeMock40
            ? '🚀 40-Question All-MP Free Mock Test started. All the best!'
            : `🚀 Exam paper Set #${chosenSetNumber} started. All the best!`)
    );
  };

  // Countdown timer effect - ONLY runs when isExamStarted is true!
  useEffect(() => {
    if (!isExamStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }

        const nextTime = prev - 1;
        
        // Check for audio / visual end-of-exam alerts (at exact minute markers)
        if (nextTime > 0 && nextTime % 60 === 0) {
          const minutesRemaining = Math.floor(nextTime / 60);
          if (selectedAlertMinutes.includes(minutesRemaining) && !triggeredAlertMinutes.includes(minutesRemaining)) {
            setTriggeredAlertMinutes(curr => [...curr, minutesRemaining]);
            if (isSoundAlertEnabled) {
              AudioAlert.playExamBeepAlert();
            }
            setActiveAlertBanner({
              minutesLeft: minutesRemaining,
              message: lang === 'hi'
                ? `⏰ समय चेतावनी: परीक्षा समाप्त होने में केवल ${minutesRemaining} मिनट शेष हैं! कृपया सभी प्रश्नों की अंतिम समीक्षा कर लें।`
                : `⏰ Time Warning: Only ${minutesRemaining} minute(s) remaining! Please finalize your answers.`
            });
          }
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, selectedAlertMinutes, triggeredAlertMinutes, isSoundAlertEnabled, lang]);

  // Update visited status when changing index
  useEffect(() => {
    const qId = questionsList[currentIdx]?.id;
    if (qId && !visitedQuestionIds.includes(qId)) {
      setVisitedQuestionIds(prev => [...prev, qId]);
    }
  }, [currentIdx]);

  const currentQ = questionsList[currentIdx] || questionsList[0];

  // When current question changes, keep section tab synced if not in ALL view
  useEffect(() => {
    const subj = getQuestionSubject(currentQ);
    if (selectedSection !== 'ALL' && selectedSection !== subj) {
      setSelectedSection(subj);
    }
  }, [currentIdx]);

  // Section button click handler: Switch section and jump to first question
  const handleSectionClick = (subj: string) => {
    setSelectedSection(subj);
    if (subj === 'ALL') {
      showToast(lang === 'hi' ? '📑 सभी विषय प्रदर्शित किए जा रहे हैं' : '📑 Showing all sections');
      return;
    }

    const firstQuestionIndex = questionsList.findIndex(q => getQuestionSubject(q) === subj);
    if (firstQuestionIndex !== -1) {
      setCurrentIdx(firstQuestionIndex);
      showToast(lang === 'hi' ? `📂 अनुभाग चुना: ${subj} (प्रश्न ${firstQuestionIndex + 1})` : `📂 Switched to ${subj} (Q${firstQuestionIndex + 1})`);
    } else {
      showToast(lang === 'hi' ? `📂 अनुभाग: ${subj}` : `📂 Section: ${subj}`);
    }
  };

  // Helper stats calculation
  const answeredCount = Object.keys(userAnswers).length;
  const markedForReviewCount = reviewedQuestionIds.length;
  const notAnsweredCount = visitedQuestionIds.filter(id => userAnswers[id] === undefined && !reviewedQuestionIds.includes(id)).length;
  const notVisitedCount = Math.max(0, questionsList.length - visitedQuestionIds.length);

  // Filtered questions in palette based on active section
  const paletteQuestions = selectedSection === 'ALL'
    ? questionsList
    : questionsList.filter(q => getQuestionSubject(q) === selectedSection);

  // Navigation handlers
  const handleSelectOption = (optIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setReviewedQuestionIds(prev => 
      prev.includes(currentQ.id) 
        ? prev.filter(id => id !== currentQ.id) 
        : [...prev, currentQ.id]
    );
  };

  const handleNext = () => {
    if (currentIdx < questionsList.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Submit test attempt
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const elapsedSeconds = Math.max(10, Math.floor((Date.now() - startTimeRef.current) / 1000));
    
    // Evaluate scores
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let totalScore = 0;
    let totalPossibleMarks = 0;

    const sectionMap: Record<string, { correct: number; incorrect: number; total: number; marks: number }> = {};

    questionsList.forEach(q => {
      const qMarks = Number(q.marks) || 1;
      totalPossibleMarks += qMarks;
      const selected = userAnswers[q.id];
      const subj = getQuestionSubject(q);
      const correctIdx = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q.correctOption !== undefined ? q.correctOption : 0);
      
      if (!sectionMap[subj]) {
        sectionMap[subj] = { correct: 0, incorrect: 0, total: 0, marks: 0 };
      }
      sectionMap[subj].total += 1;

      if (selected !== undefined) {
        if (selected === correctIdx) {
          correctAnswersCount++;
          totalScore += qMarks;
          sectionMap[subj].correct += 1;
          sectionMap[subj].marks += qMarks;
        } else {
          incorrectAnswersCount++;
          totalScore -= (Number(q.negativeMarks) || 0);
          sectionMap[subj].incorrect += 1;
        }
      }
    });

    const finalObtainedMarks = Math.max(0, +totalScore.toFixed(2));
    const effectiveTotalMarks = totalPossibleMarks || (isFreeMock40 ? 40 : 100);
    const percentage = +((finalObtainedMarks / effectiveTotalMarks) * 100).toFixed(2);
    
    // Calculate simulated State Rank
    const simulatedTotalCandidates = series.enrolledCount || 8500;
    let calculatedRank = Math.max(1, Math.round((1 - (percentage / 100)) * simulatedTotalCandidates * 0.45));
    if (percentage > 90) calculatedRank = Math.floor(Math.random() * 15) + 1;
    else if (percentage > 80) calculatedRank = Math.floor(Math.random() * 80) + 16;
    else if (percentage > 70) calculatedRank = Math.floor(Math.random() * 250) + 90;

    const sectionBreakdown: SectionScore[] = Object.keys(sectionMap).map(sectionName => {
      const data = sectionMap[sectionName];
      const accuracy = data.correct + data.incorrect > 0 
        ? Math.round((data.correct / (data.correct + data.incorrect)) * 100)
        : 0;
      return {
        sectionName,
        subject: sectionName,
        totalQuestions: data.total,
        attempted: data.correct + data.incorrect,
        correct: data.correct,
        incorrect: data.incorrect,
        marksObtained: data.marks,
        maxMarks: data.total * (currentQ?.marks || 1),
        accuracy
      };
    });

    try {
      const attempt = await submitTestAttempt({
        userId: currentUser?.id || 'usr_guest',
        userName: currentUser?.name || 'परीक्षार्थी (Aspirant)',
        userDistrict: currentUser?.district || 'भोपाल (Bhopal)',
        seriesId: isFreeMock40 ? 'free_mock_40' : (series?.id || 'free_mock_40'),
        seriesTitle: isFreeMock40 ? 'ऑल-मध्यप्रदेश फ्री मॉक टेस्ट (40 प्रश्न)' : (examLang === 'hi' ? series.titleHi : series.titleEn),
        startedAt: new Date(startTimeRef.current).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
        score: finalObtainedMarks,
        totalMarks: effectiveTotalMarks,
        percentage,
        accuracy: (correctAnswersCount + incorrectAnswersCount) > 0 ? Math.round((correctAnswersCount / (correctAnswersCount + incorrectAnswersCount)) * 100) : 0,
        correctAnswers: correctAnswersCount,
        incorrectAnswers: incorrectAnswersCount,
        unattempted: Math.max(0, questionsList.length - (correctAnswersCount + incorrectAnswersCount)),
        totalQuestions: questionsList.length,
        answers: userAnswers,
        sectionScores: sectionBreakdown
      });

      showToast(lang === 'hi' ? '🎉 परीक्षा सफलतापूर्वक सबमिट हुई! AI रिपोर्ट तैयार है।' : '🎉 Exam submitted! AI report ready.');
      navigate('resultAnalytics', { attemptId: attempt.id });
    } catch (err) {
      console.error('Error submitting exam:', err);
      showToast('Error saving score. Redirecting to result...');
      navigate('resultAnalytics');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // PRE-EXAM SCREEN (Set Selection & Instructions before the paper and timer starts)
  if (!isExamStarted) {
    const isEnrolledInSeries = isEnrolled(series.id);
    const isChosenSetFree = isFreeMock40 || isEnrolledInSeries;
    const setsList = series.id === 'ts_agri_ext_2026'
      ? ALL_20_AGRI_SETS
      : series.id === 'ts_patwari_2026'
      ? ALL_20_PATWARI_SETS
      : [];

    const filteredSets = setsList.filter(s => {
      if (preExamFilter === 'free') return s.setNumber <= 10;
      if (preExamFilter === 'full') return s.setNumber > 10;
      return true;
    });

    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
        {/* Pre-Exam Official Header */}
        <header className="bg-stone-900 text-stone-100 border-b-2 border-amber-500 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(isFreeMock40 ? 'freeMockTest' : 'testDetail', { id: series.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'वापस जाएँ' : 'Back'}</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xs">
              म.प्र.
            </div>
            <div>
              <h1 className="font-display font-extrabold text-sm sm:text-base text-white">
                {lang === 'hi' ? 'मध्य प्रदेश कर्मचारी चयन मंडल (MP ESB) — ऑनलाइन CBT परीक्षा केंद्र' : 'MP ESB Online Computer Based Test Portal'}
              </h1>
              <p className="text-[11px] text-amber-400 font-mono">
                {lang === 'hi' ? (isFreeMock40 ? '40-प्रश्न फ्री डेमो मॉक टेस्ट (₹0 शुल्क)' : 'परीक्षा पूर्व निर्देश एवं 20 सेट्स चयन') : 'Pre-Exam Instructions & 20 Sets Selection'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 text-xs">
              <span className="text-stone-400">अभ्यर्थी (Candidate):</span>
              <span className="font-bold text-white">{currentUser?.name || 'Candidate #2026'}</span>
            </div>
            <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setExamLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${examLang === 'hi' ? 'bg-amber-500 text-stone-950' : 'text-stone-300'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setExamLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${examLang === 'en' ? 'bg-amber-500 text-stone-950' : 'text-stone-300'}`}
              >
                English
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
          
          {/* BANNER: Free vs Paid */}
          {isChosenSetFree ? (
            <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-950 to-stone-900 border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                  {isFreeMock40 ? '🎁' : '✓'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-black text-[11px] uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {isFreeMock40 ? '100% मुफ़्त डेमो टेस्ट मोड (Free Demo Test)' : 'प्रीमियम टेस्ट सीरीज़ सक्रिय (Active Subscription)'}
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white">
                    {isFreeMock40 
                      ? 'ऑल-मध्यप्रदेश फ्री मॉक टेस्ट (40 प्रश्न • 30 मिनट)' 
                      : `${series.titleHi} — सेट #${chosenSetNumber} (फुल 200 प्रश्न)`}
                  </h3>
                  <p className="text-emerald-200 text-xs mt-0.5">
                    {isFreeMock40
                      ? 'यह डेमो टेस्ट सभी विद्यार्थियों के लिए 100% मुफ़्त है। बिना किसी भुगतान के असली परीक्षा जैसा अनुभव लें!'
                      : 'आप इस 200 प्रश्नों के फुल टेस्ट को हल करने के लिए अधिकृत हैं। ऑल-एमपी लाइव रैंक व AI विश्लेषण सक्रिय है।'}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-mono font-black text-xs uppercase tracking-wider shadow">
                  {isFreeMock40 ? 'शुल्क: ₹0 (मुफ़्त)' : '🟢 अनलॉक (Paid Access)'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-950/90 via-stone-900 to-[#5E1F16] border-2 border-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                  🔒
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] uppercase tracking-wider mb-1">
                    <Lock className="w-3.5 h-3.5" /> संपूर्ण 20 फुल लेंथ टेस्ट सेट्स पैकेज (पेमेंट आवश्यक)
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white">
                    {series.titleHi} (20 सेट्स • 4,000 बहुविकल्पीय प्रश्न)
                  </h3>
                  <p className="text-[#EAD8B1] text-xs mt-0.5">
                    सभी 20 सेट्स (200 प्रश्न प्रत्येक) अनलॉक करने के लिए ₹{series.price} में ऑनलाइन पेमेंट करें अथवा अलग से 40 प्रश्नों का मुफ़्त डेमो टेस्ट दें।
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate('cbtExam', { isFreeMock40: true, id: 'free_mock_40' })}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow cursor-pointer"
                >
                  🎁 40-प्रश्न मुफ़्त डेमो दें
                </button>
                <button
                  onClick={() => openRazorpayModal(series)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>20 सेट्स अनलॉक करें (₹{series.price})</span>
                </button>
              </div>
            </div>
          )}

          {/* Exam Title & Overview Banner */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                <span>{lang === 'hi' ? 'वास्तविक परीक्षा 2026 सिमुलेटर' : 'Official CBT Simulator 2026'}</span>
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-white">
                {lang === 'hi' ? series.titleHi : series.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {lang === 'hi'
                  ? (isFreeMock40
                      ? 'यह 40 प्रश्नों का अलग मुफ़्त डेमो टेस्ट आपको असली परीक्षा का पूर्ण अनुभव देने के लिए तैयार किया गया है।'
                      : 'कृपया 20 सेट्स में से वांछित सेट चुनें, निर्देश पढ़ें और फिर परीक्षा प्रारंभ करें।')
                  : 'Experience authentic MP CBT exams, bilingual questions, and instant AI analytics.'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 shrink-0">
              <div className="text-center px-2">
                <span className="block text-[10px] uppercase font-bold text-stone-400">कुल प्रश्न</span>
                <span className="font-mono font-black text-lg text-stone-900 dark:text-white">{questionsList.length} Qs</span>
              </div>
              <div className="h-8 w-px bg-stone-300 dark:bg-stone-700" />
              <div className="text-center px-2">
                <span className="block text-[10px] uppercase font-bold text-stone-400">समय</span>
                <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">{isFreeMock40 ? '30 Mins' : `${series.durationMinutes} Mins`}</span>
              </div>
              <div className="h-8 w-px bg-stone-300 dark:bg-stone-700" />
              <div className="text-center px-2">
                <span className="block text-[10px] uppercase font-bold text-stone-400">पूर्णांक</span>
                <span className="font-mono font-black text-lg text-amber-500">{questionsList.length} Marks</span>
              </div>
            </div>
          </div>

          {/* STEP 1: SET SELECTION COMPONENT (For Multi-set series like Patwari & Agri RAEO) */}
          {filteredSets.length > 0 && !isFreeMock40 && (
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <h3 className="font-display font-black text-lg text-stone-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center">1</span>
                    <span>{lang === 'hi' ? 'मॉक टेस्ट सेट चयन (Select Mock Set 1 to 20):' : 'Select Your Mock Paper Set (1 to 20):'}</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lang === 'hi' ? `वर्तमान में चुना गया सेट: Set #${chosenSetNumber}` : `Currently Selected Set: Set #${chosenSetNumber}`}
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setPreExamFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${preExamFilter === 'all' ? 'bg-amber-500 text-stone-950' : 'text-stone-600 dark:text-stone-400'}`}
                  >
                    <span>सभी 20 सेट्स</span>
                  </button>
                  <button
                    onClick={() => setPreExamFilter('free')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${preExamFilter === 'free' ? 'bg-amber-500 text-stone-950' : 'text-stone-600 dark:text-stone-400'}`}
                  >
                    <span>सेट 1–10</span>
                  </button>
                  <button
                    onClick={() => setPreExamFilter('full')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${preExamFilter === 'full' ? 'bg-amber-500 text-stone-950' : 'text-stone-600 dark:text-stone-400'}`}
                  >
                    <span>सेट 11–20</span>
                  </button>
                </div>
              </div>

              {/* Set Selection Matrix (Set 1 to Set 20) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5 max-h-64 overflow-y-auto p-1">
                {filteredSets.map(s => {
                  const isSelected = chosenSetNumber === s.setNumber;
                  const isUnlocked = isEnrolled(series.id);

                  return (
                    <button
                      key={s.setNumber}
                      onClick={() => setChosenSetNumber(s.setNumber)}
                      className={`relative p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between gap-1 cursor-pointer ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/15 dark:bg-amber-950/50 shadow-md scale-105 ring-2 ring-amber-500/40'
                          : 'border-stone-200 dark:border-stone-800 hover:border-amber-400/60 bg-stone-50 dark:bg-stone-850/50'
                      }`}
                    >
                      <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${isSelected ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}>
                        SET #{s.setNumber}
                      </span>
                      <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400">200 Qs</span>
                      {!isUnlocked ? (
                        <span className="text-[9px] font-bold text-stone-400 flex items-center gap-0.5">🔒 लॉक</span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-500">🟢 उपलब्ध</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Set Preview Bar */}
              <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isChosenSetFree 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60' 
                  : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow ${
                    isChosenSetFree ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-stone-950'
                  }`}>
                    #{chosenSetNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                      <span>{series.id === 'ts_agri_ext_2026' ? `समूह-2 उपसमूह-1 (RAEO/कृषि) — मॉक टेस्ट सेट #${chosenSetNumber}` : `MP पटवारी 2026 — फुल मॉक टेस्ट सेट #${chosenSetNumber}`}</span>
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {series.id === 'ts_agri_ext_2026' 
                        ? '200 बहुविकल्पीय प्रश्न (भाग-1 सामान्य 100 प्रश्न + भाग-2 कृषि 100 प्रश्न) • 180 मिनट का समय • द्विभाषी'
                        : '200 बहुविकल्पीय प्रश्न (8 विषय × 25 प्रश्न) • 180 मिनट का समय • द्विभाषी (Hindi/English)'}
                    </p>
                  </div>
                </div>

                {!isChosenSetFree ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('cbtExam', { isFreeMock40: true, id: 'free_mock_40' })}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      🎁 40Q मुफ़्त डेमो टेस्ट दें
                    </button>
                    <button
                      onClick={() => openRazorpayModal(series)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>20 सेट्स अनलॉक करें (₹{series.price})</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    ✓ हल करने के लिए तैयार (Ready to Attempt)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: EXAM INSTRUCTIONS & MARKING SCHEME */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-black text-lg text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-xs font-black flex items-center justify-center">2</span>
              <span>{lang === 'hi' ? 'महत्वपूर्ण परीक्षा निर्देश (Examination Instructions):' : 'Important Exam Instructions:'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
              <div className="space-y-2 bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>प्रश्न पत्र एवं अंकन योजना (Marking Scheme)</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                  <li>
                    {isFreeMock40 
                      ? 'कुल 40 प्रश्न पूछे जाएँगे, प्रत्येक प्रश्न 1 अंक का होगा।' 
                      : 'कुल 200 प्रश्न पूछे जाएँगे, प्रत्येक प्रश्न 1 अंक का होगा।'}
                  </li>
                  <li>
                    {isFreeMock40
                      ? 'परीक्षा की कुल समयावधि 30 मिनट होगी।'
                      : 'परीक्षा की कुल समयावधि 180 मिनट (3 घंटे) होगी।'}
                  </li>
                  <li><strong>नकारात्मक अंकन (Negative Marking): नहीं है</strong> (0 अंक)।</li>
                  <li>परीक्षार्थी किसी भी समय विभिन्न विषयों के बीच स्विच कर सकते हैं।</li>
                </ul>
              </div>

              <div className="space-y-2 bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>प्रश्न पैलेट के रंग संकेतक (Palette Legend)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">✓</span>
                    <span>उत्तर दिया (Answered)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">✕</span>
                    <span>उत्तर नहीं दिया (Not Answered)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">⚑</span>
                    <span>समीक्षा हेतु चिह्नित (Marked)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-300 text-[10px] font-bold flex items-center justify-center">•</span>
                    <span>नहीं देखा (Not Visited)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: EXAM END AUDIO ALERTS CONFIGURATION (User can choose up to 2 alerts) */}
          <div className="bg-white dark:bg-stone-900 border-2 border-amber-300/80 dark:border-amber-700/60 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center">3</span>
                  <span className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span>{lang === 'hi' ? 'समय समाप्ति पूर्व बीप अलर्ट (अधिकतम 2 अलर्ट सेट करें):' : 'Exam End Beep Alerts (Set Max 2 Alerts):'}</span>
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'hi' 
                    ? 'परीक्षा समाप्त होने से पहले आपको कब बीप व स्क्रीन अलर्ट चाहिए? नीचे से अपनी पसंद के 2 समय चुनें।'
                    : 'Choose up to 2 time markers when you want a 2-second audio beep and screen alert before exam ends.'}
                </p>
              </div>

              {/* Sound Toggle & Test Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={testAlertSound}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-amber-300 dark:border-amber-700"
                  title="2-second Beep Test"
                >
                  <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{lang === 'hi' ? '🔊 2-सेकंड बीप टेस्ट' : '🔊 Test Beep'}</span>
                </button>

                <button
                  onClick={() => setIsSoundAlertEnabled(!isSoundAlertEnabled)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    isSoundAlertEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {isSoundAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isSoundAlertEnabled ? (lang === 'hi' ? 'ध्वनि चालू' : 'Sound ON') : (lang === 'hi' ? 'ध्वनि म्यूट' : 'Sound Muted')}</span>
                </button>
              </div>
            </div>

            {/* Alert Time Buttons Selection (30m, 15m, 10m, 5m, 2m, 1m) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { mins: 30, labelHi: '30 मिनट पहले', labelEn: '30 Mins Before' },
                  { mins: 15, labelHi: '15 मिनट पहले', labelEn: '15 Mins Before' },
                  { mins: 10, labelHi: '10 मिनट पहले', labelEn: '10 Mins Before' },
                  { mins: 5, labelHi: '5 मिनट पहले', labelEn: '5 Mins Before' },
                  { mins: 2, labelHi: '2 मिनट पहले', labelEn: '2 Mins Before' },
                  { mins: 1, labelHi: '1 मिनट पहले (अंतिम)', labelEn: '1 Min Before (Final)' },
                ].map(({ mins, labelHi, labelEn }) => {
                  const isSelected = selectedAlertMinutes.includes(mins);
                  return (
                    <button
                      key={mins}
                      onClick={() => toggleAlertMinute(mins)}
                      className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-md ring-2 ring-amber-400/40'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-stone-950 text-amber-400 font-black' : 'border border-stone-400 text-transparent'}`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      <span>{lang === 'hi' ? labelHi : labelEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Indicator */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    {selectedAlertMinutes.length === 0 ? (
                      <span className="text-stone-500 dark:text-stone-400">{lang === 'hi' ? 'कोई अलर्ट नहीं चुना गया (कोई बीप नहीं बजेगी)' : 'No alert chosen (Silent mode)'}</span>
                    ) : (
                      <span>
                        {lang === 'hi' 
                          ? `सक्रिय अलर्ट (${selectedAlertMinutes.length}/2): परीक्षा खत्म होने के ${selectedAlertMinutes.join(' मिनट व ')} मिनट पहले 2-सेकंड की बीप बजेगी।` 
                          : `Active Alerts (${selectedAlertMinutes.length}/2): 2-second beep will trigger at ${selectedAlertMinutes.join(' & ')} mins remaining.`}
                      </span>
                    )}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200">
                  {selectedAlertMinutes.length}/2 अलर्ट
                </span>
              </div>
            </div>
          </div>

          {/* STEP 4: DECLARATION & START ACTION */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border-2 border-emerald-500/40">
            <div className="flex items-start gap-3">
              <input
                id="exam-agreement-checkbox"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400 bg-stone-800 border-stone-700 cursor-pointer"
              />
              <label htmlFor="exam-agreement-checkbox" className="text-xs sm:text-sm text-stone-300 cursor-pointer leading-relaxed select-none">
                {lang === 'hi'
                  ? (isFreeMock40
                      ? 'मैंने उपर्युक्त सभी निर्देश ध्यानपूर्वक पढ़ और समझ लिए हैं। मैं सहमत हूँ कि "40 प्रश्नों का फ्री टेस्ट प्रारंभ करें" बटन पर क्लिक करते ही 30 मिनट का समय शुरू होगा।'
                      : 'मैंने उपर्युक्त सभी निर्देश ध्यानपूर्वक पढ़ और समझ लिए हैं। मैं सहमत हूँ कि "सेट #' + chosenSetNumber + ' का पेपर प्रारंभ करें" बटन पर क्लिक करते ही 180 मिनट (3 घंटे) का समय शुरू होगा।')
                  : (isFreeMock40
                      ? 'I have read and understood all instructions. I confirm that clicking the start button will launch the 30-minute countdown for 40 questions.'
                      : 'I have read and understood all instructions. I confirm that clicking the start button will launch the 180-minute countdown for Set #' + chosenSetNumber + '.')}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-800">
              <button
                onClick={() => navigate(isFreeMock40 ? 'freeMockTest' : 'testDetail', { id: series.id })}
                className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                ← {lang === 'hi' ? (isFreeMock40 ? 'वापस फ्री मॉक पेज' : 'वापस टेस्ट सूची') : 'Back'}
              </button>

              <button
                onClick={handleStartExam}
                disabled={!agreedTerms}
                className={`w-full sm:w-auto px-8 py-4 font-black rounded-2xl text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  agreedTerms
                    ? (isChosenSetFree
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 hover:scale-105 shadow-emerald-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950 hover:scale-105 shadow-amber-500/30')
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                }`}
              >
                {isChosenSetFree ? (
                  <>
                    <Play className="w-5 h-5 fill-stone-950" />
                    <span>
                      {lang === 'hi'
                        ? (isFreeMock40 
                            ? '🚀 40 प्रश्नों का फ्री मॉक टेस्ट प्रारंभ करें (₹0 शुल्क)' 
                            : `🚀 सेट #${chosenSetNumber} का 200 प्रश्नों का पेपर प्रारंभ करें`)
                        : (isFreeMock40
                            ? '🚀 Start 40 Questions Free Mock (Free)'
                            : `🚀 Start Exam Paper for Set #${chosenSetNumber}`)}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-stone-950" />
                    <span>
                      {lang === 'hi'
                        ? `🔒 सभी 20 सेट्स अनलॉक करें (₹${series.price})`
                        : `🔒 Unlock All 20 Sets (₹${series.price})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      
      {/* 1. Official CBT Header Bar */}
      <header className="bg-stone-900 text-stone-100 border-b-2 border-amber-500 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-md gap-2">
        
        {/* Left: Exit/Back Button + Exam Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => setShowExitConfirmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700 text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            title="परीक्षा से बाहर निकलें / Exit Test"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'बाहर निकलें' : 'Exit'}</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-extrabold text-xs shrink-0">
            म.प्र.
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-amber-500 text-stone-950 shrink-0">
                SET #{chosenSetNumber}
              </span>
              <div className="font-display font-bold text-xs sm:text-sm text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {examLang === 'hi' ? series.titleHi : series.titleEn}
              </div>
            </div>
            <div className="text-[10px] text-amber-400 font-mono hidden sm:block">
              MP ESB CBT 2026 — 200 Questions Full Mock Set #{chosenSetNumber} (8 Sections)
            </div>
          </div>
        </div>

        {/* Center/Right: Timer & Auxiliary Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Timer Display */}
          <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm md:text-base font-bold shadow-inner ${
            timeLeft < 300 
              ? 'bg-rose-900 text-rose-200 border border-rose-500 animate-pulse' 
              : 'bg-stone-800 text-amber-400 border border-stone-700'
          }`}>
            <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Bilingual Toggle */}
          <button
            onClick={() => setExamLang(examLang === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{examLang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Candidate Profile Box */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-stone-800">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow">
              {currentUser?.name?.charAt(0) || 'प'}
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">{currentUser?.name || (examLang === 'hi' ? 'परीक्षार्थी' : 'Candidate')}</div>
              <div className="text-[9px] text-stone-400 font-mono">Roll: MP26-0918</div>
            </div>
          </div>

        </div>

      </header>

      {/* 2. CBT Utility Quick-Bar (ACTIVE SECTION BUTTONS + TOOLS) */}
      <div className="bg-stone-200 dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
        
        {/* Section Selectors — Fully Interactive Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
          <span className="font-bold text-stone-700 dark:text-stone-300 mr-1 hidden md:inline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>अनुभाग (Section):</span>
          </span>

          {/* All Subjects Tab */}
          <button
            onClick={() => handleSectionClick('ALL')}
            className={`px-3 py-1.5 rounded-lg font-black text-xs transition cursor-pointer flex items-center gap-1 shrink-0 ${
              selectedSection === 'ALL'
                ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <span>सभी विषय (All)</span>
            <span className="px-1.5 py-0.2 bg-stone-900/20 rounded-full text-[10px]">
              {questionsList.length}
            </span>
          </button>

          {/* Dynamic Subject / Section Tabs */}
          {availableSubjects.map(subj => {
            const isSelected = selectedSection === subj;
            const count = getSubjectQuestionCount(subj);
            const isCurrentQSubject = getQuestionSubject(currentQ) === subj;

            return (
              <button
                key={subj}
                onClick={() => handleSectionClick(subj)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400 font-black'
                    : isCurrentQSubject
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-700'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700'
                }`}
              >
                <span>{subj}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-stone-950 text-amber-400' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CBT Auxiliary Tools (Calculator, Scratchpad, Question Paper) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 font-bold cursor-pointer"
            title="Open Virtual Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">कैलकुलेटर</span>
          </button>

          <button
            onClick={() => setIsScratchpadOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 font-bold cursor-pointer"
            title="Open Rough Scratchpad"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">रफ शीट</span>
          </button>

          <button
            onClick={() => setIsQuestionPaperOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 font-bold cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">प्रश्न पत्र</span>
          </button>
        </div>

      </div>

      {/* 3. Main CBT Workspace (Question View on Left + Palette on Right) */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Col (8 Cols): Current Question & Options */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Question Meta Header */}
          <div className="p-3.5 sm:p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500 text-stone-950 font-mono font-extrabold text-xs rounded-lg shadow-sm">
                प्रश्न {currentIdx + 1} / {questionsList.length}
              </span>
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                विषय: <strong className="text-stone-900 dark:text-white">{getQuestionSubject(currentQ)}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                +{currentQ.marks} अंक
              </span>
              {currentQ.negativeMarks ? (
                <span className="text-rose-600 dark:text-rose-400 font-mono">
                  -{currentQ.negativeMarks} निगेटिव
                </span>
              ) : (
                <span className="text-stone-500 dark:text-stone-400">
                  (कोई निगेटिव मार्किंग नहीं)
                </span>
              )}
            </div>
          </div>

          {/* Question Body */}
          <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto">
            
            {/* Question Text */}
            <div className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 leading-relaxed">
              {examLang === 'hi' ? currentQ.questionHi : currentQ.questionEn}
            </div>

            {/* Optional MCQ Image attachment */}
            {currentQ.imageUrl && (
              <div className="my-3 p-3 bg-stone-50 dark:bg-stone-950/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="relative group max-w-md mx-auto overflow-hidden rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
                  <img
                    src={currentQ.imageUrl}
                    alt={currentQ.imageCaption || 'Question figure'}
                    className="w-full max-h-72 object-contain mx-auto cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.02]"
                    onClick={() => setZoomedImageUrl({ url: currentQ.imageUrl!, caption: currentQ.imageCaption })}
                  />
                  <button
                    type="button"
                    onClick={() => setZoomedImageUrl({ url: currentQ.imageUrl!, caption: currentQ.imageCaption })}
                    className="absolute bottom-2 right-2 px-2.5 py-1 bg-stone-950/80 hover:bg-black text-white text-[11px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-md opacity-90 hover:opacity-100 transition cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>बड़ा करें (Zoom)</span>
                  </button>
                </div>
                {currentQ.imageCaption && (
                  <p className="text-center text-xs font-medium text-stone-600 dark:text-stone-400 italic">
                    {currentQ.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {((examLang === 'hi' 
                ? (currentQ.optionsHi || currentQ.options?.map((o: any) => typeof o === 'string' ? o : o.textHi || o.textEn || '')) 
                : (currentQ.optionsEn || currentQ.options?.map((o: any) => typeof o === 'string' ? o : o.textEn || o.textHi || ''))
              ) || []).map((optText: string, optIdx: number) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const optionLabel = ['(A)', '(B)', '(C)', '(D)', '(E)'][optIdx];

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-white shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 bg-white dark:bg-stone-900/60 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 transition ${
                      isSelected 
                        ? 'bg-amber-500 text-stone-950 shadow-sm' 
                        : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}>
                      {isSelected ? '✓' : optionLabel}
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-normal pt-0.5">
                      {optText}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Action Button Bar (Mark for Review, Clear, Prev, Next) */}
          <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReview}
                className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                  reviewedQuestionIds.includes(currentQ.id)
                    ? 'bg-purple-700 text-white border-purple-800'
                    : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{reviewedQuestionIds.includes(currentQ.id) ? 'रिव्यू से हटाएं' : 'मार्क फॉर रिव्यू (Review)'}</span>
              </button>

              {userAnswers[currentQ.id] !== undefined && (
                <button
                  onClick={handleClearResponse}
                  className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition cursor-pointer"
                >
                  उत्तर साफ़ करें (Clear)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 disabled:opacity-40 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold transition cursor-pointer"
              >
                ← पिछला (Prev)
              </button>

              {currentIdx < questionsList.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  सहेजें एवं अगला (Save & Next) →
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold shadow-lg transition hover:scale-105 cursor-pointer"
                >
                  फाइनल सबमिट करें (Submit)
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Right Col (4 Cols): Question Palette & Summary Grid */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl shadow-sm p-4 overflow-hidden">
          
          <div className="space-y-4">
            
            {/* Palette Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {answeredCount}
                </span>
                <span className="text-stone-600 dark:text-stone-400">उत्तर दिया (Answered)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {notAnsweredCount}
                </span>
                <span className="text-stone-600 dark:text-stone-400">उत्तर नहीं दिया (Not Ans)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {markedForReviewCount}
                </span>
                <span className="text-stone-600 dark:text-stone-400">रिव्यू हेतु मार्क (Review)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[10px] flex items-center justify-center">
                  {notVisitedCount}
                </span>
                <span className="text-stone-600 dark:text-stone-400">नहीं देखा (Not Visited)</span>
              </div>
            </div>

            {/* Question Matrix */}
            <div>
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>प्रश्न तालिका</span>
                  {selectedSection !== 'ALL' && (
                    <span className="text-amber-500 font-bold">({selectedSection})</span>
                  )}
                </span>
                <span className="text-stone-400 font-mono text-[11px]">
                  {paletteQuestions.length} प्रश्न
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
                {questionsList.map((q, idx) => {
                  const qSubject = getQuestionSubject(q);
                  const isCurrent = idx === currentIdx;
                  const hasAnswer = userAnswers[q.id] !== undefined;
                  const isReviewed = reviewedQuestionIds.includes(q.id);
                  const isVisited = visitedQuestionIds.includes(q.id);
                  const isMatchesFilter = selectedSection === 'ALL' || qSubject === selectedSection;

                  let colorClass = 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700';
                  
                  if (hasAnswer && isReviewed) {
                    colorClass = 'bg-purple-700 text-white border-purple-800 ring-1 ring-amber-400';
                  } else if (hasAnswer) {
                    colorClass = 'bg-emerald-600 text-white border-emerald-700';
                  } else if (isReviewed) {
                    colorClass = 'bg-purple-600 text-white border-purple-700';
                  } else if (isVisited) {
                    colorClass = 'bg-rose-600 text-white border-rose-700';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIdx(idx);
                        if (selectedSection !== 'ALL' && qSubject !== selectedSection) {
                          setSelectedSection(qSubject);
                        }
                      }}
                      className={`h-9 rounded-xl font-mono font-bold text-xs border flex items-center justify-center transition cursor-pointer ${colorClass} ${
                        isCurrent ? 'ring-3 ring-amber-400 scale-105 shadow-md z-10' : ''
                      } ${!isMatchesFilter ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}
                      title={`Q${idx + 1}: ${qSubject}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Action Controls */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 mt-4 space-y-2">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold rounded-xl shadow-lg transition hover:scale-105 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>परीक्षा सबमिट करें (Submit Test)</span>
            </button>

            <button
              onClick={() => setShowExitConfirmModal(true)}
              className="w-full py-2 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'परीक्षा छोड़ें / वापस जाएँ' : 'Leave / Exit Test'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. EXIT CONFIRMATION MODAL */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">
                  {lang === 'hi' ? 'क्या आप परीक्षा से बाहर जाना चाहते हैं?' : 'Exit Examination?'}
                </h3>
                <span className="text-[11px] text-stone-500">
                  {examLang === 'hi' ? series.titleHi : series.titleEn}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-950/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
              {lang === 'hi' 
                ? 'यदि आप अभी बाहर जाते हैं तो आपकी वर्तमान प्रगति रद्द हो जाएगी। आप कभी भी टेस्ट सीरीज़ सूची या डैशबोर्ड से दोबारा इस परीक्षा को प्रारंभ कर सकते हैं।' 
                : 'If you exit now, your current progress will not be submitted. You can restart the test anytime from the catalog.'}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowExitConfirmModal(false);
                  navigate('studentDashboard');
                }}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-100 dark:text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4" />
                <span>{lang === 'hi' ? 'हाँ, छात्र डैशबोर्ड पर जाएँ (Dashboard)' : 'Go to Student Dashboard'}</span>
              </button>

              <button
                onClick={() => {
                  setShowExitConfirmModal(false);
                  navigate('catalog');
                }}
                className="w-full py-2.5 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'hi' ? 'सभी टेस्ट सीरीज़ देखें (Catalog)' : 'Go to Test Catalog'}</span>
              </button>

              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="w-full py-2 text-stone-500 hover:text-stone-900 dark:hover:text-white font-semibold text-xs transition"
              >
                {lang === 'hi' ? 'नहीं, परीक्षा जारी रखें (Cancel & Continue)' : 'Cancel & Continue Exam'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border-2 border-amber-500 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display font-extrabold text-lg text-stone-900 dark:text-white">
                क्या आप परीक्षा सबमिट करना चाहते हैं?
              </h3>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              सबमिट करने के बाद आप उत्तरों में संशोधन नहीं कर सकेंगे। AI तुरंत आपके अंकों का मूल्यांकन एवं विस्तृत विश्लेषण तैयार करेगा।
            </p>

            {/* Live Attempt Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 p-3 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">कुल प्रश्न:</span>
                <span className="font-bold">{questionsList.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">उत्तर दिए:</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">पुनर्विचार हेतु:</span>
                <span className="font-bold text-purple-600">{markedForReviewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">शेष समय:</span>
                <span className="font-mono font-bold text-amber-500">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold rounded-xl text-xs hover:bg-stone-300"
              >
                परीक्षा जारी रखें (Cancel)
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                {isSubmitting ? 'मूल्यांकन हो रहा है...' : 'हाँ, सबमिट करें'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Exam End Warning Alert Popup Banner (Triggers at user-selected minutes) */}
      {activeAlertBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/90 border-2 border-amber-500 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 text-white animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0 animate-bounce">
                ⏰
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Bell className="w-3 h-3" /> समय चेतावनी अलर्ट (Time Alert)
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
                  {lang === 'hi' 
                    ? `केवल ${activeAlertBanner.minutesLeft} मिनट शेष हैं!` 
                    : `Only ${activeAlertBanner.minutesLeft} Minute(s) Left!`}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              {activeAlertBanner.message}
            </p>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => AudioAlert.playTestBeep()}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{lang === 'hi' ? 'पुनः बीप बजाएं' : 'Replay Beep'}</span>
              </button>

              <button
                onClick={() => setActiveAlertBanner(null)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                {lang === 'hi' ? 'समझ गया, परीक्षा जारी रखें' : 'Got it, Continue Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm">
          <div className="bg-stone-900 text-white border border-stone-700 rounded-2xl p-4 w-72 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <span className="font-bold text-xs text-amber-400">Virtual Calculator</span>
              <button onClick={() => setIsCalcOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3 bg-stone-950 rounded-xl font-mono text-right text-lg text-emerald-400 overflow-x-auto min-h-[44px]">
              {calcInput || '0'}
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs font-bold font-mono">
              {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') setCalcInput('');
                    else if (btn === '=') {
                      try {
                        // eslint-disable-next-line no-eval
                        const res = Function(`'use strict'; return (${calcInput})`)();
                        setCalcInput(String(res));
                      } catch {
                        setCalcInput('Error');
                      }
                    } else {
                      setCalcInput(prev => prev + btn);
                    }
                  }}
                  className={`p-2.5 rounded-lg border transition ${
                    btn === '=' ? 'bg-amber-500 text-stone-950 border-amber-400' :
                    btn === 'C' ? 'bg-rose-900 text-rose-200 border-rose-800' :
                    'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Rough Scratchpad Modal */}
      {isScratchpadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl p-4 max-w-lg w-full shadow-2xl space-y-3 flex flex-col h-96">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
              <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-emerald-500" />
                रफ कार्य शीट (Rough Scratchpad)
              </span>
              <button onClick={() => setIsScratchpadOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              value={scratchText}
              onChange={(e) => setScratchText(e.target.value)}
              placeholder="यहाँ गणितीय गणनाएँ या नोट्स लिखें (यह आपके सबमिशन का हिस्सा नहीं है)..."
              className="flex-1 w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono text-xs text-stone-900 dark:text-stone-100 focus:outline-none resize-none"
            />

            <div className="flex justify-between text-[11px] text-stone-500">
              <button onClick={() => setScratchText('')} className="text-rose-500 underline font-bold">
                रफ शीट साफ़ करें
              </button>
              <button onClick={() => setIsScratchpadOpen(false)} className="px-3 py-1 bg-stone-800 text-white rounded-lg">
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Question Paper View Modal */}
      {isQuestionPaperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-3xl p-5 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-800">
              <span className="font-bold text-sm text-stone-900 dark:text-white">
                सम्पूर्ण प्रश्न पत्र पूर्वावलोकन (Question Paper Overview)
              </span>
              <button onClick={() => setIsQuestionPaperOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {questionsList.map((q, idx) => (
                <div key={q.id} className="p-3 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                  <div className="flex justify-between font-bold text-stone-500">
                    <span>Q{idx + 1}. [{getQuestionSubject(q)}]</span>
                    <span>+{q.marks} अंक</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {examLang === 'hi' ? q.questionHi : q.questionEn}
                  </div>
                  {q.imageUrl && (
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                      <img src={q.imageUrl} alt="Question Diagram" className="w-12 h-12 object-cover rounded" />
                      <span className="text-[11px] text-stone-500 italic">{q.imageCaption || 'चित्र संलग्न है'}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-1.5 text-stone-700 dark:text-stone-300 pl-2">
                    {((examLang === 'hi' 
                      ? (q.optionsHi || q.options?.map((o: any) => typeof o === 'string' ? o : o.textHi || o.textEn || '')) 
                      : (q.optionsEn || q.options?.map((o: any) => typeof o === 'string' ? o : o.textEn || o.textHi || ''))
                    ) || []).map((opt: string, oIdx: number) => (
                      <div key={oIdx}>
                        {['(A)', '(B)', '(C)', '(D)'][oIdx]} {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. High-Definition Zoom Modal for Question Images */}
      {zoomedImageUrl && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setZoomedImageUrl(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-700 rounded-3xl p-4 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center pb-2 border-b border-stone-800 text-stone-200">
              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                <ImageIcon className="w-4 h-4" />
                <span>{zoomedImageUrl.caption || 'प्रश्न चित्र उच्च-रिज़ॉल्यूशन पूर्वावलोकन'}</span>
              </span>
              <button
                onClick={() => setZoomedImageUrl(null)}
                className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-2 overflow-auto max-h-[75vh] flex items-center justify-center">
              <img
                src={zoomedImageUrl.url}
                alt={zoomedImageUrl.caption || 'HD Question Diagram'}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            {zoomedImageUrl.caption && (
              <div className="pt-2 text-center text-xs text-stone-300 font-medium">
                {zoomedImageUrl.caption}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
