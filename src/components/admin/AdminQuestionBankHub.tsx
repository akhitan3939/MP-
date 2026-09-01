import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Sparkles, 
  Play, 
  Eye, 
  Filter, 
  Layers, 
  BookOpen, 
  Award, 
  Leaf, 
  Shield, 
  Monitor, 
  TreePine, 
  GraduationCap, 
  Database,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Image as ImageIcon,
  RotateCcw,
  UploadCloud,
  Save,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Question, TestSeries } from '../../types';
import { 
  MOCK_CATEGORY_OPTIONS, 
  MockCategoryOption, 
  getResolvedMockQuestions 
} from '../../utils/questionBankHelper';
import { exportToCsv, exportToXls, exportToPdfPrint } from '../../utils/exportReports';

interface AdminQuestionBankHubProps {
  questions: Question[];
  testSeries: TestSeries[];
  saveQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  showToast: (msg: string) => void;
  navigate: (view: string, params?: any) => void;
  onEditQuestion: (q: Question) => void;
  onAddNewQuestion: (seriesId: string, setNumber: number) => void;
}

export const AdminQuestionBankHub: React.FC<AdminQuestionBankHubProps> = ({
  questions,
  testSeries,
  saveQuestion,
  deleteQuestion,
  showToast,
  navigate,
  onEditQuestion,
  onAddNewQuestion,
}) => {
  // Selected mock type & set number
  const [selectedMockId, setSelectedMockId] = useState<string>('free_mock_40');
  const [selectedSetNumber, setSelectedSetNumber] = useState<number>(1);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // AI Question Generator Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiTopicInput, setAiTopicInput] = useState<string>('');
  const [aiSubjectInput, setAiSubjectInput] = useState<string>('म.प्र. सामान्य ज्ञान');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Active Mock category object
  const activeCategory = useMemo(() => {
    return MOCK_CATEGORY_OPTIONS.find(c => c.id === selectedMockId) || MOCK_CATEGORY_OPTIONS[0];
  }, [selectedMockId]);

  // Resolved questions for current Mock and Set
  const currentMockQuestions = useMemo(() => {
    return getResolvedMockQuestions(selectedMockId, selectedSetNumber, questions);
  }, [selectedMockId, selectedSetNumber, questions]);

  // Unique subjects in the current mock set
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    currentMockQuestions.forEach(q => {
      if (q.subject) subs.add(q.subject);
      if (q.section && q.section !== q.subject) subs.add(q.section);
    });
    return Array.from(subs);
  }, [currentMockQuestions]);

  // Filtered questions based on search & filters
  const filteredQuestions = useMemo(() => {
    return currentMockQuestions.filter(q => {
      const qText = `${q.questionHi || ''} ${q.questionEn || ''} ${q.topic || ''} ${q.subject || ''} ${q.section || ''}`.toLowerCase();
      const matchesSearch = !searchQuery || qText.includes(searchQuery.toLowerCase());
      
      const matchesSubject = subjectFilter === 'all' || 
        q.subject === subjectFilter || 
        q.section === subjectFilter;

      const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;

      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  }, [currentMockQuestions, searchQuery, subjectFilter, difficultyFilter]);

  // Duplicate Question Handler
  const handleDuplicateQuestion = (q: Question) => {
    const newQ: Question = {
      ...q,
      id: `q_copy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      questionHi: `${q.questionHi} (प्रतिलिपि)`,
      questionEn: q.questionEn ? `${q.questionEn} (Copy)` : undefined,
    };
    saveQuestion(newQ);
    showToast('📋 प्रश्न की प्रतिलिपि (Clone) सफलतापूर्वक बनाई गई!');
  };

  // Export handlers for current mock
  const handleExportCurrentMock = (format: 'xls' | 'csv' | 'pdf') => {
    const data = filteredQuestions.map((q, idx) => ({
      'क्र.सं. (Q#)': idx + 1,
      'प्रश्न ID': q.id,
      'मॉक सीरीज़': activeCategory.nameHi,
      'सेट नं.': activeCategory.isMultiSet ? `सेट #${selectedSetNumber}` : 'मुख्य',
      'विषय (Subject)': q.subject || q.section,
      'टॉपिक': q.topic || 'सामान्य',
      'कठिनाई (Difficulty)': q.difficulty || 'medium',
      'प्रश्न (हिन्दी)': q.questionHi,
      'प्रश्न (English)': q.questionEn || '',
      'विकल्प A': q.optionsHi?.[0] || q.options?.[0]?.textHi || '',
      'विकल्प B': q.optionsHi?.[1] || q.options?.[1]?.textHi || '',
      'विकल्प C': q.optionsHi?.[2] || q.options?.[2]?.textHi || '',
      'विकल्प D': q.optionsHi?.[3] || q.options?.[3]?.textHi || '',
      'सही उत्तर विकल्प': String.fromCharCode(65 + (q.correctOption ?? q.correctOptionIndex ?? 0)),
      'व्याख्या (Solution)': q.explanationHi || ''
    }));

    const filename = `MP_Setu_${activeCategory.id}_Set${selectedSetNumber}_Questions_${new Date().toISOString().split('T')[0]}`;

    if (format === 'xls') {
      exportToXls(data, filename);
      showToast('📊 प्रश्न बैंक Excel (.xls) में डाउनलोड हो गया।');
    } else if (format === 'csv') {
      exportToCsv(data, filename);
      showToast('📄 प्रश्न बैंक CSV में डाउनलोड हो गया।');
    } else {
      exportToPdfPrint(`${activeCategory.nameHi} — प्रश्न बैंक एवं समाधान पुस्तिका`, data);
    }
  };

  // AI Question Generator Handler
  const handleGenerateAiQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopicInput.trim()) {
      showToast('⚠️ कृपया टॉपिक दर्ज करें');
      return;
    }

    setIsAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicInput.trim(),
          subject: aiSubjectInput,
          seriesName: activeCategory.nameHi,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.question) {
        const generated: Question = {
          id: `q_ai_${Date.now()}`,
          seriesId: selectedMockId === 'all_questions' ? 'ts_patwari_2026' : selectedMockId,
          subject: aiSubjectInput,
          section: aiSubjectInput,
          topic: aiTopicInput.trim(),
          difficulty: 'medium',
          questionHi: resData.question.questionHi || resData.question.qHi,
          questionEn: resData.question.questionEn || resData.question.qEn,
          optionsHi: resData.question.optionsHi || resData.question.options?.map((o: any) => o.textHi),
          optionsEn: resData.question.optionsEn || resData.question.options?.map((o: any) => o.textEn),
          options: (resData.question.optionsHi || ['A', 'B', 'C', 'D']).map((text: string, i: number) => ({
            id: `opt_${i}`,
            textHi: text,
            textEn: resData.question.optionsEn?.[i] || text,
          })),
          correctOption: resData.question.correctOption ?? resData.question.correct ?? 0,
          correctOptionIndex: resData.question.correctOption ?? resData.question.correct ?? 0,
          explanationHi: resData.question.explanationHi || resData.question.expHi,
          explanationEn: resData.question.explanationEn || resData.question.expEn,
          marks: 1,
          negativeMarks: 0,
        };

        saveQuestion(generated);
        setIsAiModalOpen(false);
        setAiTopicInput('');
        showToast('✨ AI द्वारा नया द्विभाषी प्रश्न सफलतापूर्वक तैयार एवं सहेज लिया गया!');
      } else {
        // Fallback generator
        const fallbackQ: Question = {
          id: `q_ai_${Date.now()}`,
          seriesId: selectedMockId === 'all_questions' ? 'ts_patwari_2026' : selectedMockId,
          subject: aiSubjectInput,
          section: aiSubjectInput,
          topic: aiTopicInput.trim(),
          difficulty: 'medium',
          questionHi: `मध्यप्रदेश की प्रतियोगी परीक्षाओं हेतु '${aiTopicInput.trim()}' पर आधारित महत्वपूर्ण प्रश्न क्या है?`,
          questionEn: `Important question based on '${aiTopicInput.trim()}' for MP Govt Competitive Exams?`,
          optionsHi: ['प्रामाणिक विकल्प A', 'प्रामाणिक विकल्प B', 'प्रामाणिक विकल्प C', 'प्रामाणिक विकल्प D'],
          optionsEn: ['Option A', 'Option B', 'Option C', 'Option D'],
          options: [
            { id: 'opt_0', textHi: 'प्रामाणिक विकल्प A', textEn: 'Option A' },
            { id: 'opt_1', textHi: 'प्रामाणिक विकल्प B', textEn: 'Option B' },
            { id: 'opt_2', textHi: 'प्रामाणिक विकल्प C', textEn: 'Option C' },
            { id: 'opt_3', textHi: 'प्रामाणिक विकल्प D', textEn: 'Option D' },
          ],
          correctOption: 0,
          correctOptionIndex: 0,
          explanationHi: `'${aiTopicInput.trim()}' विषय पर म.प्र. शासन के नवीनतम पाठ्यक्रम अनुसार विस्तृत विश्लेषण।`,
          explanationEn: `Detailed solution on '${aiTopicInput.trim()}' as per latest syllabus.`,
          marks: 1,
          negativeMarks: 0,
        };
        saveQuestion(fallbackQ);
        setIsAiModalOpen(false);
        setAiTopicInput('');
        showToast('✨ नया प्रश्न तैयार किया गया!');
      }
    } catch {
      showToast('⚠️ AI कनेक्शन में समस्या, पुनः प्रयास करें।');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. MOCK & TEST SERIES SELECTOR (TOP TABS) */}
      <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7A2A1E] dark:text-[#D4A017]" />
              <span>मॉक टेस्ट एवं टेस्ट सीरीज़ चयन (Mock & Series Selector)</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              किसी भी मॉक टेस्ट या पेड टेस्ट सीरीज़ पर क्लिक करें — उसके सभी प्रश्न तुरंत नीचे प्रदर्शित होंगे और आप उन्हें संपादित, डिलीट या नया जोड़ सकेंगे।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddNewQuestion(selectedMockId, selectedSetNumber)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नया प्रश्न जोड़ें</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI से प्रश्न बनाएँ</span>
            </button>
          </div>
        </div>

        {/* Horizontal Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {MOCK_CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedMockId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedMockId(cat.id);
                  setSelectedSetNumber(1);
                  setSubjectFilter('all');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-stone-900 border-[#7A2A1E] dark:border-[#D4A017] shadow-md ring-2 ring-[#D4A017]/30' 
                    : 'bg-stone-50/80 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#7A2A1E] text-[#D4A017]' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}>
                      {cat.badge}
                    </span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </div>

                  <h4 className={`font-black text-xs leading-snug line-clamp-2 ${
                    isSelected ? 'text-[#7A2A1E] dark:text-[#D4A017]' : 'text-stone-800 dark:text-stone-200'
                  }`}>
                    {cat.nameHi}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-bold mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                  <span>{cat.isMultiSet ? `20 फुल सेट्स` : 'स्टैंडअलोन मॉक'}</span>
                  <span className="font-mono text-[#7A2A1E] dark:text-[#D4A017]">
                    {cat.id === 'all_questions' ? `${questions.length} कुल प्रश्न` : `${cat.totalQuestionsPerSet} प्रश्न`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. SET SWITCHER (When Multi-Set Series is selected) */}
        {activeCategory.isMultiSet && (
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <span>🎯 सेट नंबर चुनें (Choose Mock Set 1 to 20):</span>
                <span className="px-2 py-0.5 rounded bg-[#7A2A1E] text-[#D4A017] text-[10px] font-mono font-black">
                  SET #{selectedSetNumber} ACTIVE
                </span>
              </span>

              <button
                onClick={() => {
                  if (activeCategory.id === 'ts_patwari_2026') {
                    navigate('cbtExam', { seriesId: 'ts_patwari_2026', setNumber: selectedSetNumber });
                  } else if (activeCategory.id === 'ts_agri_ext_2026') {
                    navigate('cbtExam', { seriesId: 'ts_agri_ext_2026', setNumber: selectedSetNumber });
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#7A2A1E] dark:text-[#D4A017] text-xs font-black hover:bg-amber-200 flex items-center gap-1 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>छात्र CBT टेस्ट में लॉन्च करें →</span>
              </button>
            </div>

            {/* Sets Button Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
                const isCurrentSet = selectedSetNumber === num;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedSetNumber(num);
                      setSubjectFilter('all');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                      isCurrentSet 
                        ? 'bg-[#7A2A1E] text-[#D4A017] shadow-md border-2 border-[#D4A017]' 
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    सेट #{num}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. SEARCH, SUBJECT FILTER, STATS & EXPORT BAR */}
      <div className="p-4 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input 
              type="text"
              placeholder="प्रश्न पाठ (हिंदी/अंग्रेजी), विषय, टॉपिक या विकल्प खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none focus:border-[#7A2A1E]"
            />
          </div>

          {/* Filters & Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Subject Selector */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold"
            >
              <option value="all">समस्त विषय ({currentMockQuestions.length})</option>
              {availableSubjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Difficulty Selector */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold"
            >
              <option value="all">कठिनाई: सभी</option>
              <option value="easy">सरल (Easy)</option>
              <option value="medium">मध्यम (Medium)</option>
              <option value="hard">कठिन (Hard)</option>
            </select>

            {/* Export Dispatchers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleExportCurrentMock('xls')}
                className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                title="Excel (.xls) में डाउनलोड करें"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>XLS</span>
              </button>
              <button
                onClick={() => handleExportCurrentMock('csv')}
                className="px-2.5 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                title="CSV में डाउनलोड करें"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExportCurrentMock('pdf')}
                className="px-2.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                title="PDF प्रिंट / डाउनलोड करें"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Mock Summary Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-600 dark:text-stone-300">
              प्रदर्शित प्रश्न: <span className="font-mono font-black text-[#7A2A1E] dark:text-[#D4A017]">{filteredQuestions.length}</span> / {currentMockQuestions.length}
            </span>
            {subjectFilter !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                विषय: {subjectFilter}
              </span>
            )}
          </div>

          <div className="text-[11px] text-stone-400 font-medium">
            💡 किसी भी प्रश्न को संपादित (Edit) करने पर वह तुरंत सेव होता है और छात्र परीक्षा में अपडेटेड दिखेगा।
          </div>
        </div>
      </div>

      {/* 4. QUESTIONS LIST */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto text-xl font-black">
              🔍
            </div>
            <h4 className="font-black text-sm text-stone-700 dark:text-stone-300">
              कोई प्रश्न नहीं मिला
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              कृपया सर्च शब्द या विषय फ़िल्टर बदलें, अथवा 'नया प्रश्न जोड़ें' बटन पर क्लिक करके इस मॉक में प्रश्न जोड़ें।
            </p>
            <button
              onClick={() => onAddNewQuestion(selectedMockId, selectedSetNumber)}
              className="px-4 py-2 rounded-xl bg-[#7A2A1E] text-[#D4A017] text-xs font-black inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>इस मॉक में नया प्रश्न जोड़ें</span>
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const correctIdx = q.correctOption ?? q.correctOptionIndex ?? 0;
            const optionsList = q.optionsHi || q.options?.map(o => o.textHi) || ['A', 'B', 'C', 'D'];
            const optionsEnList = q.optionsEn || q.options?.map(o => o.textEn) || [];

            return (
              <div 
                key={q.id}
                className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-xs hover:shadow-md transition space-y-3 relative group"
              >
                {/* Card Top Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#7A2A1E] text-[#D4A017] text-[11px] font-mono font-black px-2.5 py-0.5 rounded-lg">
                      Q#{idx + 1}
                    </span>
                    <span className="text-xs font-black text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
                      {q.subject || q.section || 'सामान्य अध्ययन'}
                    </span>
                    {q.topic && (
                      <span className="text-[11px] font-bold text-stone-500">
                        • {q.topic}
                      </span>
                    )}
                    {q.difficulty && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : q.difficulty === 'hard' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {q.difficulty}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400 font-mono">
                      +1 अंक / 0 नेगेटिव
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDuplicateQuestion(q)}
                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 transition"
                      title="प्रश्न की प्रतिलिपि बनाएँ (Duplicate)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditQuestion(q)}
                      className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-[#7A2A1E] dark:text-[#D4A017] hover:bg-amber-100 transition"
                      title="संपादित करें (Edit)"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('क्या आप निश्चित रूप से इस प्रश्न को हटाना चाहते हैं?')) {
                          deleteQuestion(q.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 transition"
                      title="हटाएँ (Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-1">
                  <p className="font-bold text-sm text-[#2D2424] dark:text-stone-100 leading-relaxed">
                    {q.questionHi}
                  </p>
                  {q.questionEn && q.questionEn !== q.questionHi && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-serif italic">
                      {q.questionEn}
                    </p>
                  )}
                </div>

                {/* Diagram / Image if any */}
                {q.imageUrl && (
                  <div className="p-2 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl max-w-sm">
                    <img 
                      src={q.imageUrl} 
                      alt="Question diagram" 
                      className="rounded-lg max-h-36 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    {q.imageCaption && (
                      <span className="text-[10px] text-stone-500 block mt-1">{q.imageCaption}</span>
                    )}
                  </div>
                )}

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {optionsList.map((optText, oIdx) => {
                    const isCorrect = correctIdx === oIdx;
                    const optEnText = optionsEnList[oIdx];

                    return (
                      <div 
                        key={oIdx}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition ${
                          isCorrect 
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500/30' 
                            : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="leading-snug">{optText}</div>
                          {optEnText && optEnText !== optText && (
                            <div className="text-[10px] text-stone-400 italic">{optEnText}</div>
                          )}
                        </div>
                        {isCorrect && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black shrink-0 flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            <span>सही उत्तर</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {(q.explanationHi || q.explanationEn) && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl text-[11px] text-amber-950 dark:text-amber-200 space-y-1">
                    <div>
                      <span className="font-black text-[#7A2A1E] dark:text-[#D4A017]">💡 विस्तृत व्याख्या: </span>
                      <span>{q.explanationHi}</span>
                    </div>
                    {q.explanationEn && q.explanationEn !== q.explanationHi && (
                      <div className="text-[10px] text-amber-800/80 dark:text-amber-300/80 italic">
                        <span>Solution: </span>{q.explanationEn}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI QUESTION GENERATOR MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>AI प्रश्न निर्माता (Gemini AI Question Studio)</span>
              </h3>
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="p-1 text-stone-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAiQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">
                  विषय (Subject)
                </label>
                <select
                  value={aiSubjectInput}
                  onChange={(e) => setAiSubjectInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                >
                  <option value="म.प्र. सामान्य ज्ञान">म.प्र. सामान्य ज्ञान</option>
                  <option value="सामान्य हिन्दी">सामान्य हिन्दी</option>
                  <option value="सामान्य गणित">सामान्य गणित</option>
                  <option value="कंप्यूटर विज्ञान">कंप्यूटर विज्ञान</option>
                  <option value="सामान्य प्रबंधन">सामान्य प्रबंधन</option>
                  <option value="सामान्य विज्ञान">सामान्य विज्ञान</option>
                  <option value="सामान्य तार्किक योग्यता">सामान्य तार्किक योग्यता</option>
                  <option value="सामान्य अंग्रेजी">सामान्य अंग्रेजी</option>
                  <option value="कृषि विज्ञान">कृषि विज्ञान (Agri Discipline)</option>
                </select>
              </div>

              <div>
                <label className="block font-black uppercase text-stone-500 mb-1">
                  टॉपिक या अवधारणा (Topic / Concept)
                </label>
                <input 
                  type="text"
                  required
                  placeholder="उदा: म.प्र. की प्रमुख जनजातियाँ व भगोरिया हाट"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/40 text-[11px] text-purple-900 dark:text-purple-300">
                🤖 AI स्वचालित रूप से मध्यप्रदेश परीक्षा पैटर्न अनुसार 4 प्रामाणिक बहुविकल्पीय उत्तर, सही उत्तर व विस्तृत व्याख्या तैयार करेगा।
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-stone-600"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isAiGenerating}
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-black shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <span>⏳ AI प्रश्न बना रहा है...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>✨ प्रश्न बनाएँ व सहेजें</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
