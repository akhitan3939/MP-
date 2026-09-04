import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Layers, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  TrendingUp, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  RefreshCw, 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  FolderSync, 
  Save, 
  UploadCloud, 
  PieChart, 
  Activity,
  Award,
  Zap
} from 'lucide-react';
import { Question, TestSeries } from '../../types';
import { MOCK_CATEGORY_OPTIONS, getResolvedMockQuestions } from '../../utils/questionBankHelper';
import { exportToXls, exportToCsv } from '../../utils/exportReports';

interface QuestionAnalyticsDashboardProps {
  questions: Question[];
  testSeries: TestSeries[];
  onSelectExamAndSet?: (examId: string, setNumber: number) => void;
  onOpenBulkUpload?: () => void;
  onAddNewQuestion?: (seriesId: string, setNumber: number) => void;
  showToast?: (msg: string) => void;
}

export interface ExamStatItem {
  id: string;
  nameHi: string;
  nameEn: string;
  badge: string;
  isMultiSet: boolean;
  totalSetsConfigured: number;
  activeSetsCount: number;
  inactiveSetsCount: number;
  targetQuestionsPerSet: number;
  totalCapacityTarget: number;
  totalQuestionsUploaded: number;
  remainingToTarget: number;
  completionRate: number;
  disabledSetNumbers: number[];
  setsBreakdown: {
    setNumber: number;
    isActive: boolean;
    questionsCount: number;
    targetCount: number;
    completionRate: number;
    status: 'full' | 'in_progress' | 'empty';
    subjectsCount: Record<string, number>;
  }[];
  subjectsBreakdown: Record<string, number>;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export const QuestionAnalyticsDashboard: React.FC<QuestionAnalyticsDashboardProps> = ({
  questions,
  testSeries,
  onSelectExamAndSet,
  onOpenBulkUpload,
  onAddNewQuestion,
  showToast
}) => {
  const [filterExamType, setFilterExamType] = useState<'all' | 'multi' | 'single'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExamDetailId, setSelectedExamDetailId] = useState<string>('ts_patwari_2026');

  // Compute PowerBI-grade statistics across all exams
  const examStats = useMemo<ExamStatItem[]>(() => {
    // Filter out the 'all_questions' meta category
    const categories = MOCK_CATEGORY_OPTIONS.filter(c => c.id !== 'all_questions');

    return categories.map(cat => {
      const seriesObj = testSeries.find(s => s.id === cat.id);
      const isMultiSet = cat.isMultiSet;
      
      const totalSets = isMultiSet 
        ? (cat.id === 'ts_patwari_2026' || cat.id === 'ts_agri_ext_2026' ? 20 : (seriesObj?.totalTests || 20))
        : 1;

      const disabledSets = Array.isArray(seriesObj?.disabledSetNumbers) ? seriesObj.disabledSetNumbers : [];
      const activeSetsCount = Math.max(0, totalSets - disabledSets.length);
      const inactiveSetsCount = disabledSets.length;

      const targetPerSet = cat.totalQuestionsPerSet || 100;
      const totalCapacityTarget = totalSets * targetPerSet;

      // Calculate sets breakdown
      const setsBreakdown = [];
      let totalQuestionsUploaded = 0;
      const subjectsBreakdown: Record<string, number> = {};
      const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };

      for (let s = 1; s <= totalSets; s++) {
        const setQuestions = getResolvedMockQuestions(cat.id, s, questions);
        const count = setQuestions.length;
        totalQuestionsUploaded += count;

        const setSubjects: Record<string, number> = {};
        setQuestions.forEach(q => {
          const subj = q.subject || q.section || 'General Studies';
          setSubjects[subj] = (setSubjects[subj] || 0) + 1;
          subjectsBreakdown[subj] = (subjectsBreakdown[subj] || 0) + 1;

          const diff = q.difficulty || 'medium';
          if (diff === 'easy') difficultyBreakdown.easy++;
          else if (diff === 'hard') difficultyBreakdown.hard++;
          else difficultyBreakdown.medium++;
        });

        const rate = targetPerSet > 0 ? Math.min(100, Math.round((count / targetPerSet) * 100)) : 100;
        const status: 'full' | 'in_progress' | 'empty' = 
          count >= targetPerSet ? 'full' : count > 0 ? 'in_progress' : 'empty';

        setsBreakdown.push({
          setNumber: s,
          isActive: !disabledSets.includes(s),
          questionsCount: count,
          targetCount: targetPerSet,
          completionRate: rate,
          status,
          subjectsCount: setSubjects
        });
      }

      const remainingToTarget = Math.max(0, totalCapacityTarget - totalQuestionsUploaded);
      const completionRate = totalCapacityTarget > 0 
        ? Math.min(100, Math.round((totalQuestionsUploaded / totalCapacityTarget) * 100)) 
        : 100;

      return {
        id: cat.id,
        nameHi: cat.nameHi,
        nameEn: cat.nameEn,
        badge: cat.badge,
        isMultiSet,
        totalSetsConfigured: totalSets,
        activeSetsCount,
        inactiveSetsCount,
        targetQuestionsPerSet: targetPerSet,
        totalCapacityTarget,
        totalQuestionsUploaded,
        remainingToTarget,
        completionRate,
        disabledSetNumbers: disabledSets,
        setsBreakdown,
        subjectsBreakdown,
        difficultyBreakdown
      };
    });
  }, [questions, testSeries]);

  // Overall Totals
  const totalSummary = useMemo(() => {
    let totalQuestions = 0;
    let totalTarget = 0;
    let totalSets = 0;
    let activeSets = 0;
    let inactiveSets = 0;
    let fullyPreparedSets = 0;

    examStats.forEach(item => {
      totalQuestions += item.totalQuestionsUploaded;
      totalTarget += item.totalCapacityTarget;
      totalSets += item.totalSetsConfigured;
      activeSets += item.activeSetsCount;
      inactiveSets += item.inactiveSetsCount;
      fullyPreparedSets += item.setsBreakdown.filter(s => s.status === 'full').length;
    });

    const remainingTotal = Math.max(0, totalTarget - totalQuestions);
    const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalQuestions / totalTarget) * 100)) : 100;

    return {
      totalExamsCount: examStats.length,
      totalQuestions,
      totalTarget,
      remainingTotal,
      overallProgress,
      totalSets,
      activeSets,
      inactiveSets,
      fullyPreparedSets
    };
  }, [examStats]);

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return examStats.filter(e => {
      if (filterExamType === 'multi' && !e.isMultiSet) return false;
      if (filterExamType === 'single' && e.isMultiSet) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return e.nameHi.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q) || e.badge.toLowerCase().includes(q);
      }
      return true;
    });
  }, [examStats, filterExamType, searchQuery]);

  // Detail item for drill-down
  const activeDetailExam = useMemo(() => {
    return examStats.find(e => e.id === selectedExamDetailId) || examStats[0];
  }, [examStats, selectedExamDetailId]);

  // Export Analytics to XLS
  const handleExportAnalyticsXls = () => {
    const rows: any[] = [];
    examStats.forEach(e => {
      e.setsBreakdown.forEach(s => {
        rows.push({
          'परीक्षा नाम (Exam)': e.nameHi,
          'सीरीज़ कोड': e.id,
          'प्रकार': e.isMultiSet ? '20 सेट्स सीरीज़' : 'एकल स्टैंडअलोन',
          'सेट संख्या (Set #)': s.setNumber,
          'स्थिति (Status)': s.isActive ? 'सक्रिय (ACTIVE)' : 'निष्क्रिय (INACTIVE)',
          'मौजूदा प्रश्न (Uploaded)': s.questionsCount,
          'लक्ष्य प्रश्न (Target)': s.targetCount,
          'शेष प्रश्न (Remaining)': Math.max(0, s.targetCount - s.questionsCount),
          'तैयारी प्रतिशत (Completion %)': `${s.completionRate}%`,
          'सेट प्रगति': s.status === 'full' ? 'पूर्ण (Ready)' : s.status === 'in_progress' ? 'प्रगति पर' : 'खाली'
        });
      });
    });

    exportToXls(rows, `MP_Pariksha_Setu_Question_Analytics_${new Date().toISOString().slice(0, 10)}.xlsx`);
    if (showToast) showToast('📊 PowerBI शैली संपूर्ण प्रश्न विश्लेषण रिपोर्ट (.xlsx) डाउनलोड हो गई!');
  };

  // Export Questions Master JSON Backup
  const handleDownloadMasterBackup = () => {
    const backupData = {
      portal: 'MP Pariksha Setu',
      timestamp: new Date().toISOString(),
      totalQuestions: questions.length,
      questions: questions
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mp_pariksha_questions_master_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (showToast) showToast('💾 समस्त प्रश्नों का मास्टर JSON बैकअप सुरक्षित डाउनलोड हो गया!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Persistence Guarantee Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border-2 border-[#D4A017] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#7A2A1E] text-[#D4A017] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>PowerBI प्रश्न इंटेलिजेंस डैशबोर्ड</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5 border border-emerald-300/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>स्थायी क्लाउड + लोकल स्टोरेज सुरक्षित (Code Update Safe)</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2D2424] dark:text-white">
              परीक्षावार सेट्स, एक्टिव/इनएक्टिव व प्रश्न क्षमता विश्लेषण
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
              प्रत्येक परीक्षा में कुल कितने सेट्स हैं, कौन से सेट्स सक्रिय हैं, किस सेट में कितने प्रश्न अपलोड हो चुके हैं, और पूर्ण होने के लिए कितने शेष हैं — संपूर्ण डेटा रीयल-टाइम में ट्रैक करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportAnalyticsXls}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer"
              title="PowerBI / Excel विस्तृत रिपोर्ट डाउनलोड करें"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>एनालिटिक्स एक्सपोर्ट (.xlsx)</span>
            </button>

            <button
              onClick={handleDownloadMasterBackup}
              className="px-4 py-2.5 bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] rounded-xl text-xs font-black flex items-center gap-2 border border-[#D4A017]/60 shadow-sm transition cursor-pointer"
              title="कोड अपडेट या बैकअप के लिए समस्त प्रश्नों का JSON बैकअप लें"
            >
              <Save className="w-4 h-4" />
              <span>1-क्लिक मास्टर बैकअप</span>
            </button>
          </div>
        </div>

        {/* Reassurance Callout: Code Update & Questions Security */}
        <div className="mt-4 pt-4 border-t border-[#D4A017]/30 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="font-black text-stone-800 dark:text-stone-100">डेटा कभी डिलीट नहीं होगा</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                प्रश्न ब्राउज़र के <code>localStorage</code> और सर्वर के <code>data/app_state.json</code> दोनों में स्थायी रूप से सुरक्षित रहते हैं।
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
              ⚡
            </div>
            <div>
              <div className="font-black text-stone-800 dark:text-stone-100">कोड अपडेट के बाद भी सुरक्षित</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                कोड बदलने या नया बिल्ड आने पर भी आपका अपलोड किया हुआ डेटाबेस और कस्टम प्रश्न अक्षुण्ण बने रहेंगे।
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
              📦
            </div>
            <div>
              <div className="font-black text-stone-800 dark:text-stone-100">100% पोर्टेबल बैकअप</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                ऊपर दिए गए "1-क्लिक मास्टर बैकअप" बटन से आप जब चाहें अपने पूरे प्रश्न बैंक को डाउनलोड करके सुरक्षित रख सकते हैं।
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI PowerBI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Questions */}
        <div className="bg-white dark:bg-stone-900 border-2 border-amber-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-xs font-bold">कुल अपलोड प्रश्न</span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#7A2A1E] dark:text-[#D4A017]">
            {totalSummary.totalQuestions.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1 font-bold">
            <span className="text-emerald-600">🎯 लक्ष्य:</span> {totalSummary.totalTarget.toLocaleString()} प्रश्न
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-[#7A2A1E] dark:bg-[#D4A017] h-full rounded-full transition-all duration-500" 
              style={{ width: `${totalSummary.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Card 2: Total Sets Configured */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-xs font-bold">कुल टेस्ट सेट्स</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2D2424] dark:text-white">
            {totalSummary.totalSets}
          </div>
          <div className="text-[10px] text-stone-500 mt-1 font-bold">
            {totalSummary.totalExamsCount} प्रमुख म.प्र. परीक्षाओं में
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 font-bold">
            20-सेट्स सीरीज़ + 1-मॉक प्रारूप
          </div>
        </div>

        {/* Card 3: Active Sets */}
        <div className="bg-white dark:bg-stone-900 border-2 border-emerald-200 dark:border-emerald-950 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
            <span className="text-xs font-bold">सक्रिय सेट्स (Active)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totalSummary.activeSets}
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-bold">
            छात्र CBT टेस्ट में लाइव दिख रहे हैं
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            {Math.round((totalSummary.activeSets / totalSummary.totalSets) * 100)}% एक्टिविटी दर
          </div>
        </div>

        {/* Card 4: Inactive Sets */}
        <div className="bg-white dark:bg-stone-900 border-2 border-rose-200 dark:border-rose-950 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 mb-1">
            <span className="text-xs font-bold">निष्क्रिय सेट्स (Inactive)</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
            {totalSummary.inactiveSets}
          </div>
          <div className="text-[10px] text-rose-700 dark:text-rose-400 mt-1 font-bold">
            छात्रों से छिपे हुए (Disabled)
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            एडमिन पैनल से कभी भी ऑन कर सकते हैं
          </div>
        </div>

        {/* Card 5: Remaining to Upload */}
        <div className="bg-white dark:bg-stone-900 border-2 border-orange-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-orange-700 dark:text-orange-400 mb-1">
            <span className="text-xs font-bold">शेष आवश्यक प्रश्न</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600 dark:text-orange-400">
            {totalSummary.remainingTotal.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-500 mt-1 font-bold">
            100% क्षमता पूर्ण करने हेतु
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-black">
            {totalSummary.fullyPreparedSets} सेट्स 100% तैयार हैं
          </div>
        </div>

        {/* Card 6: Overall Progress Rate */}
        <div className="bg-gradient-to-br from-[#7A2A1E] to-[#5E1F16] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#EAD8B1] mb-1">
              <span className="text-xs font-bold">समग्र पोर्टल तैयारी</span>
              <TrendingUp className="w-4 h-4 text-[#D4A017]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D4A017]">
              {totalSummary.overallProgress}%
            </div>
          </div>
          <div className="text-[10px] text-[#EAD8B1] font-bold">
            CBT मानक: 200 प्रश्न / 20 सेट्स
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Left Exam Cards & Right Set Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (5 Cols): Exam Selector & Progress Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-black text-sm text-[#2D2424] dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
                  <span>परीक्षा सूची व तैयारी दर</span>
                </h3>
                <span className="text-[11px] text-stone-500">विस्तृत सेट्स देखने हेतु किसी परीक्षा पर क्लिक करें</span>
              </div>

              {/* Filter Multi vs Single */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setFilterExamType('all')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                    filterExamType === 'all' 
                      ? 'bg-white dark:bg-stone-700 text-[#7A2A1E] dark:text-[#D4A017] shadow-xs' 
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  सभी ({examStats.length})
                </button>
                <button
                  onClick={() => setFilterExamType('multi')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                    filterExamType === 'multi' 
                      ? 'bg-white dark:bg-stone-700 text-[#7A2A1E] dark:text-[#D4A017] shadow-xs' 
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  20 सेट्स ({examStats.filter(e => e.isMultiSet).length})
                </button>
                <button
                  onClick={() => setFilterExamType('single')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                    filterExamType === 'single' 
                      ? 'bg-white dark:bg-stone-700 text-[#7A2A1E] dark:text-[#D4A017] shadow-xs' 
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  1 मॉक ({examStats.filter(e => !e.isMultiSet).length})
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="परीक्षा नाम से खोजें (उदा. पटवारी, कृषि, MPPSC)..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold focus:outline-none focus:border-[#7A2A1E]"
              />
            </div>

            {/* Exam Cards Scrollable List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredExams.map(exam => {
                const isSelected = selectedExamDetailId === exam.id;

                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamDetailId(exam.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-stone-800 border-[#7A2A1E] dark:border-[#D4A017] shadow-md ring-2 ring-[#D4A017]/30'
                        : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#7A2A1E] text-[#D4A017]' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}>
                          {exam.badge}
                        </span>
                        <h4 className="font-black text-xs text-[#2D2424] dark:text-white mt-1 leading-snug line-clamp-2">
                          {exam.nameHi}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                        exam.isMultiSet 
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300' 
                          : 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300'
                      }`}>
                        {exam.isMultiSet ? '📚 20 सेट्स' : '🎯 1 मॉक'}
                      </span>
                    </div>

                    {/* Stats Grid inside Card */}
                    <div className="grid grid-cols-4 gap-1.5 py-2 my-2 border-y border-stone-200/60 dark:border-stone-700/60 text-center text-[10px]">
                      <div>
                        <span className="text-stone-400 block text-[9px]">कुल सेट्स</span>
                        <span className="font-black font-mono">{exam.totalSetsConfigured}</span>
                      </div>
                      <div>
                        <span className="text-emerald-600 block text-[9px]">सक्रिय (Active)</span>
                        <span className="font-black font-mono text-emerald-700 dark:text-emerald-400">{exam.activeSetsCount}</span>
                      </div>
                      <div>
                        <span className="text-rose-600 block text-[9px]">इनएक्टिव</span>
                        <span className="font-black font-mono text-rose-700 dark:text-rose-400">{exam.inactiveSetsCount}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px]">प्रश्न अपलोड</span>
                        <span className="font-black font-mono text-[#7A2A1E] dark:text-[#D4A017]">{exam.totalQuestionsUploaded}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className="text-stone-500">तैयारी पूर्णता:</span>
                        <span className="font-mono font-black text-[#7A2A1E] dark:text-[#D4A017]">
                          {exam.completionRate}% ({exam.totalQuestionsUploaded}/{exam.totalCapacityTarget})
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            exam.completionRate >= 100 
                              ? 'bg-emerald-500' 
                              : exam.completionRate >= 50 
                              ? 'bg-amber-500' 
                              : 'bg-orange-500'
                          }`}
                          style={{ width: `${exam.completionRate}%` }}
                        />
                      </div>
                    </div>

                    {exam.remainingToTarget > 0 && (
                      <div className="mt-2 text-[10px] text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>लक्ष्य हेतु {exam.remainingToTarget} प्रश्न और अपलोड करने हैं</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols): Drill-Down Interactive Set Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Header of Selected Exam */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7A2A1E] text-[#D4A017] text-[10px] font-black uppercase">
                    विस्तृत विश्लेषण (Deep Dive)
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-mono font-bold text-stone-500">ID: {activeDetailExam.id}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#2D2424] dark:text-white mt-1">
                  {activeDetailExam.nameHi}
                </h3>
              </div>

              {/* Quick Actions for Selected Exam */}
              <div className="flex items-center gap-2">
                {onOpenBulkUpload && (
                  <button
                    onClick={onOpenBulkUpload}
                    className="px-3 py-2 bg-[#7A2A1E] hover:bg-[#5E1F16] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                    <span>इसमें बल्क अपलोड करें</span>
                  </button>
                )}
                {onAddNewQuestion && (
                  <button
                    onClick={() => onAddNewQuestion(activeDetailExam.id, 1)}
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <span>+ प्रश्न जोड़ें</span>
                  </button>
                )}
              </div>
            </div>

            {/* Selected Exam KPI Summary Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div>
                <div className="text-[10px] text-stone-500 uppercase font-black">कुल सेट्स</div>
                <div className="text-lg font-black font-mono text-[#2D2424] dark:text-white">
                  {activeDetailExam.totalSetsConfigured}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold">
                  {activeDetailExam.activeSetsCount} एक्टिव • {activeDetailExam.inactiveSetsCount} इनएक्टिव
                </div>
              </div>

              <div>
                <div className="text-[10px] text-stone-500 uppercase font-black">प्रति सेट मानक प्रश्न</div>
                <div className="text-lg font-black font-mono text-[#7A2A1E] dark:text-[#D4A017]">
                  {activeDetailExam.targetQuestionsPerSet} Qs
                </div>
                <div className="text-[10px] text-stone-500 font-bold">
                  कुल लक्ष्य: {activeDetailExam.totalCapacityTarget} प्रश्न
                </div>
              </div>

              <div>
                <div className="text-[10px] text-stone-500 uppercase font-black">वर्तमान प्रश्न संख्या</div>
                <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {activeDetailExam.totalQuestionsUploaded}
                </div>
                <div className="text-[10px] text-stone-500 font-bold">
                  {activeDetailExam.completionRate}% पूर्णता दर
                </div>
              </div>

              <div>
                <div className="text-[10px] text-stone-500 uppercase font-black">शेष आवश्यक प्रश्न</div>
                <div className={`text-lg font-black font-mono ${
                  activeDetailExam.remainingToTarget === 0 ? 'text-emerald-600' : 'text-orange-600'
                }`}>
                  {activeDetailExam.remainingToTarget}
                </div>
                <div className="text-[10px] text-stone-500 font-bold">
                  {activeDetailExam.remainingToTarget === 0 ? '✓ पूर्णत: तैयार' : 'अपलोड की प्रतीक्षा में'}
                </div>
              </div>
            </div>

            {/* Sets Grid Matrix (PowerBI Style Tiles) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-[#2D2424] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
                  <span>सेट्स की स्थिति एवं प्रश्न संख्या (Sets Status Matrix)</span>
                </h4>
                <span className="text-[11px] text-stone-500">
                  किसी भी सेट पर क्लिक करके सीधे उसके प्रश्न खोलें
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {activeDetailExam.setsBreakdown.map((set) => {
                  const isFull = set.status === 'full';
                  const isEmpty = set.status === 'empty';

                  return (
                    <div
                      key={set.setNumber}
                      onClick={() => {
                        if (onSelectExamAndSet) {
                          onSelectExamAndSet(activeDetailExam.id, set.setNumber);
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        !set.isActive
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 opacity-80'
                          : isFull
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 hover:border-emerald-500'
                          : isEmpty
                          ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 border-dashed hover:border-amber-400'
                          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="font-black text-xs text-[#2D2424] dark:text-white">
                          सेट #{set.setNumber}
                        </span>

                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          set.isActive 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        }`}>
                          {set.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="my-1">
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-mono font-black text-base text-[#2D2424] dark:text-white">
                            {set.questionsCount}
                          </span>
                          <span className="text-[10px] text-stone-500 font-bold">
                            / {set.targetCount} प्रश्न
                          </span>
                        </div>

                        {/* Progress Bar for Set */}
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              isFull ? 'bg-emerald-500' : isEmpty ? 'bg-stone-300' : 'bg-amber-500'
                            }`}
                            style={{ width: `${set.completionRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[10px]">
                        <span className={`font-bold ${
                          isFull ? 'text-emerald-700 dark:text-emerald-400' : isEmpty ? 'text-stone-400' : 'text-amber-700 dark:text-amber-400'
                        }`}>
                          {isFull ? '✓ पूर्ण' : isEmpty ? 'खाली (0 Qs)' : `${set.completionRate}% भरा हुआ`}
                        </span>

                        <span className="text-stone-400 hover:text-black dark:hover:text-white flex items-center text-[9px] font-bold">
                          खोलें <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subject Distribution & Difficulty Breakdown */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Subject Breakdown */}
              <div className="bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="font-black text-xs text-[#2D2424] dark:text-white mb-2 flex items-center justify-between">
                  <span>विषयवार प्रश्न वितरण (Subject Balance)</span>
                  <span className="text-[10px] text-stone-500">{Object.keys(activeDetailExam.subjectsBreakdown).length} विषय</span>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-xs">
                  {Object.keys(activeDetailExam.subjectsBreakdown).length === 0 ? (
                    <div className="text-[11px] text-stone-400 italic py-2">इस परीक्षा में अभी कोई प्रश्न अपलोड नहीं हैं।</div>
                  ) : (
                    Object.entries(activeDetailExam.subjectsBreakdown).map(([subj, rawCount]) => {
                      const count = Number(rawCount) || 0;
                      const pct = activeDetailExam.totalQuestionsUploaded > 0 
                        ? Math.round((count / activeDetailExam.totalQuestionsUploaded) * 100) 
                        : 0;

                      return (
                        <div key={subj} className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-700 dark:text-stone-300 truncate max-w-[180px] font-bold">{subj}</span>
                          <span className="font-mono font-black text-stone-900 dark:text-stone-100">
                            {count} प्रश्न ({pct}%)
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="font-black text-xs text-[#2D2424] dark:text-white mb-2">
                  कठिनाई स्तर वितरण (Difficulty Level)
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">सरल (Easy)</span>
                    <span className="font-mono font-black text-base text-emerald-800 dark:text-emerald-300">
                      {activeDetailExam.difficultyBreakdown.easy}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-bold">मध्यम (Medium)</span>
                    <span className="font-mono font-black text-base text-amber-800 dark:text-amber-300">
                      {activeDetailExam.difficultyBreakdown.medium}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <span className="text-[10px] text-rose-700 dark:text-rose-400 block font-bold">कठिन (Hard)</span>
                    <span className="font-mono font-black text-base text-rose-800 dark:text-rose-300">
                      {activeDetailExam.difficultyBreakdown.hard}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 text-[10px] text-stone-500 leading-tight">
                  💡 MP ESB परीक्षा मानक अनुसार 40% सरल, 40% मध्यम और 20% कठिन प्रश्नों का संतुलित अनुपात अनुशंसित है।
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
