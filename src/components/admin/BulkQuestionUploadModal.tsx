import React, { useState, useRef, useMemo } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  X as CloseIcon, 
  Download, 
  HelpCircle,
  Eye,
  Layers,
  Sparkles,
  FileCheck,
  RefreshCw,
  Gauge,
  Info,
  TrendingUp,
  AlertTriangle,
  Table,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question, TestSeries } from '../../types';
import { exportToXls, exportToCsv } from '../../utils/exportReports';
import { MOCK_CATEGORY_OPTIONS, getResolvedMockQuestions } from '../../utils/questionBankHelper';

export interface BulkUploadResultReport {
  totalInFile: number;
  validParsed: number;
  invalidRows: number;
  successfullySaved: number;
  seriesId: string;
  seriesNameHi: string;
  setNameHi: string;
  setNumber: number;
  targetLimit: number;
  questionsBefore: number;
  questionsAfter: number;
  remainingSlots: number;
  isCompleted: boolean;
}

interface BulkQuestionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  testSeries: TestSeries[];
  questions?: Question[];
  initialSeriesId?: string;
  initialSetNumber?: number;
  onSaveBulk: (
    questions: Question[],
    mode: 'append' | 'replace',
    seriesId: string,
    setNumber: number
  ) => Promise<{ success: boolean; count: number }>;
  showToast: (msg: string) => void;
}

export const BulkQuestionUploadModal: React.FC<BulkQuestionUploadModalProps> = ({
  isOpen,
  onClose,
  testSeries,
  questions = [],
  initialSeriesId = 'ts_patwari_2026',
  initialSetNumber = 1,
  onSaveBulk,
  showToast
}) => {
  const [targetSeriesId, setTargetSeriesId] = useState<string>(initialSeriesId);
  const [targetSetNumber, setTargetSetNumber] = useState<number>(initialSetNumber);
  const [useFileSetNumbers, setUseFileSetNumbers] = useState<boolean>(true);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  
  const [fileName, setFileName] = useState<string>('');
  const [rawRowCount, setRawRowCount] = useState<number>(0);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [invalidCount, setInvalidCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'formatGuide'>('upload');
  
  // Post-upload Detailed Success Status Modal
  const [uploadResultReport, setUploadResultReport] = useState<BulkUploadResultReport | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Selected series info
  const selectedSeriesObj = testSeries.find(ts => ts.id === targetSeriesId);
  const selectedCatObj = MOCK_CATEGORY_OPTIONS.find(c => c.id === targetSeriesId);
  const isMultiSet = (selectedSeriesObj?.totalTests || 0) > 1 || selectedCatObj?.isMultiSet || targetSeriesId === 'ts_patwari_2026' || targetSeriesId === 'ts_agri_ext_2026';
  const totalSetsAvailable = selectedSeriesObj?.totalTests || selectedCatObj?.totalSets || 20;

  // Current questions in the target set before upload
  const existingSetQuestions = useMemo(() => {
    return getResolvedMockQuestions(targetSeriesId, targetSetNumber, questions);
  }, [targetSeriesId, targetSetNumber, questions]);

  // Target standard limit for questions in this set/test
  const targetLimit = useMemo(() => {
    if (targetSeriesId === 'free_mock_40') return 40;
    if (selectedSeriesObj?.totalQuestions) return selectedSeriesObj.totalQuestions;
    if (selectedCatObj?.totalQuestionsPerSet) return selectedCatObj.totalQuestionsPerSet;
    return 100;
  }, [targetSeriesId, selectedSeriesObj, selectedCatObj]);

  const currentCount = existingSetQuestions.length;
  const remainingBefore = Math.max(0, targetLimit - currentCount);
  const progressPercentBefore = Math.min(100, Math.round((currentCount / targetLimit) * 100));

  // Projected counts with parsed questions
  const projectedAfterCount = importMode === 'replace' 
    ? parsedQuestions.length 
    : currentCount + parsedQuestions.length;
  const projectedRemaining = Math.max(0, targetLimit - projectedAfterCount);
  const projectedPercent = Math.min(100, Math.round((projectedAfterCount / targetLimit) * 100));

  // Download Sample Excel Format
  const handleDownloadSample = (format: 'xls' | 'csv') => {
    const sampleData = [
      {
        'क्र.सं. (Q#)': 1,
        'प्रश्न ID': `q_sample_1`,
        'मॉक सीरीज़': selectedSeriesObj?.titleHi || selectedCatObj?.nameHi || 'समूह-02 उपसमूह-04: पटवारी',
        'सेट नं.': isMultiSet ? `सेट #${targetSetNumber}` : 'मुख्य',
        'विषय (Subject)': 'सामान्य ज्ञान (General Knowledge)',
        'टॉपिक': 'मध्यप्रदेश के राष्ट्रीय उद्यान',
        'कठिनाई (Difficulty)': 'medium',
        'प्रश्न (हिन्दी)': 'मध्यप्रदेश का सबसे पहला एवं सबसे बड़ा राष्ट्रीय उद्यान कौन सा है?',
        'प्रश्न (English)': 'Which is the first and largest national park in Madhya Pradesh?',
        'विकल्प A': 'कान्हा किसली राष्ट्रीय उद्यान (मण्डला)',
        'विकल्प B': 'बाधवगढ़ राष्ट्रीय उद्यान (उमरिया)',
        'विकल्प C': 'पेंच राष्ट्रीय उद्यान (सिवनी-छिंदवाड़ा)',
        'विकल्प D': 'पन्ना राष्ट्रीय उद्यान (पन्ना-छतरपुर)',
        'सही उत्तर विकल्प': 'A',
        'व्याख्या (Solution)': 'कान्हा किसली म.प्र. का सबसे बड़ा राष्ट्रीय उद्यान है (940 वर्ग किमी)। इसे 1955 में नेशनल पार्क तथा 1973 में टाइगर रिजर्व बनाया गया।'
      },
      {
        'क्र.सं. (Q#)': 2,
        'प्रश्न ID': `q_sample_2`,
        'मॉक सीरीज़': selectedSeriesObj?.titleHi || selectedCatObj?.nameHi || 'समूह-02 उपसमूह-04: पटवारी',
        'सेट नं.': isMultiSet ? `सेट #${targetSetNumber}` : 'मुख्य',
        'विषय (Subject)': 'सामान्य हिन्दी (General Hindi)',
        'टॉपिक': 'संधि एवं समास',
        'कठिनाई (Difficulty)': 'easy',
        'प्रश्न (हिन्दी)': 'निम्न में से "सूर्योदय" शब्द में कौन सी संधि है?',
        'प्रश्न (English)': 'Which Sandhi is present in the word "Suryodaya"?',
        'विकल्प A': 'दीर्घ स्वर संधि',
        'विकल्प B': 'गुण स्वर संधि',
        'विकल्प C': 'वृद्धि स्वर संधि',
        'विकल्प D': 'यण स्वर संधि',
        'सही उत्तर विकल्प': 'B',
        'व्याख्या (Solution)': 'सूर्य + उदय = सूर्योदय (अ + उ = ओ)। अतः यह गुण स्वर संधि का प्रामाणिक उदाहरण है।'
      },
      {
        'क्र.सं. (Q#)': 3,
        'प्रश्न ID': `q_sample_3`,
        'मॉक सीरीज़': selectedSeriesObj?.titleHi || selectedCatObj?.nameHi || 'समूह-02 उपसमूह-04: पटवारी',
        'सेट नं.': isMultiSet ? `सेट #${targetSetNumber}` : 'मुख्य',
        'विषय (Subject)': 'सामान्य गणित (Mathematics)',
        'टॉपिक': 'प्रतिशत एवं लाभ-हानि',
        'कठिनाई (Difficulty)': 'medium',
        'प्रश्न (हिन्दी)': 'यदि किसी वस्तु का क्रय मूल्य ₹500 है और उसे ₹625 में बेचा जाता है, तो लाभ प्रतिशत क्या होगा?',
        'प्रश्न (English)': 'If the cost price of an article is ₹500 and it is sold for ₹625, what is the profit percentage?',
        'विकल्प A': '20%',
        'विकल्प B': '25%',
        'विकल्प C': '30%',
        'विकल्प D': '15%',
        'सही उत्तर विकल्प': 'B',
        'व्याख्या (Solution)': 'लाभ = 625 - 500 = ₹125। लाभ प्रतिशत = (125 / 500) * 100 = 25%।'
      }
    ];

    const fileName = `MP_Pariksha_Setu_Question_Upload_Template_${new Date().toISOString().split('T')[0]}`;
    if (format === 'xls') {
      exportToXls(sampleData, fileName);
    } else {
      exportToCsv(sampleData, fileName);
    }
    showToast('📥 नमूना (Sample) फ़ाइल डाउनलोड हो गई!');
  };

  // Helper to parse option index from A/B/C/D or 1/2/3/4
  const parseCorrectOptionIndex = (val: any): number => {
    if (val === undefined || val === null) return 0;
    const s = String(val).trim().toUpperCase();
    if (s === 'A' || s === '1' || s === 'OPTION A' || s === 'विकल्प A') return 0;
    if (s === 'B' || s === '2' || s === 'OPTION B' || s === 'विकल्प B') return 1;
    if (s === 'C' || s === '3' || s === 'OPTION C' || s === 'विकल्प C') return 2;
    if (s === 'D' || s === '4' || s === 'OPTION D' || s === 'विकल्प D') return 3;
    const n = parseInt(s, 10);
    if (!isNaN(n) && n >= 1 && n <= 4) return n - 1;
    return 0;
  };

  // Helper to parse set number from row
  const parseSetNumberFromRow = (rawVal: any, defaultSet: number): number => {
    if (!rawVal) return defaultSet;
    const str = String(rawVal).trim();
    const match = str.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num >= 1 && num <= 30) return num;
    }
    return defaultSet;
  };

  // Flexible column name finder
  const getVal = (row: any, possibleKeys: string[]): string => {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
        return String(row[key]).trim();
      }
      // Case-insensitive check
      const lowerKey = key.toLowerCase();
      for (const actualKey of Object.keys(row)) {
        if (actualKey.trim().toLowerCase() === lowerKey && row[actualKey] !== undefined && row[actualKey] !== null) {
          const v = String(row[actualKey]).trim();
          if (v) return v;
        }
      }
    }
    return '';
  };

  // File Upload and Parse Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showToast('⚠️ फ़ाइल में कोई डेटा पंक्ति नहीं मिली।');
          setIsProcessing(false);
          return;
        }

        setRawRowCount(rawJson.length);
        const validList: Question[] = [];
        let invalid = 0;

        rawJson.forEach((row, idx) => {
          const qHi = getVal(row, ['प्रश्न (हिन्दी)', 'प्रश्न (हिंदी)', 'question (hindi)', 'questionhi', 'question_hi', 'प्रश्न']);
          const qEn = getVal(row, ['प्रश्न (english)', 'question (english)', 'questionen', 'question_en', 'question']);
          
          const optA = getVal(row, ['विकल्प a', 'विकल्प 1', 'option a', 'option 1', 'opt_a']);
          const optB = getVal(row, ['विकल्प b', 'विकल्प 2', 'option b', 'option 2', 'opt_b']);
          const optC = getVal(row, ['विकल्प c', 'विकल्प 3', 'option c', 'option 3', 'opt_c']);
          const optD = getVal(row, ['विकल्प d', 'विकल्प 4', 'option d', 'option 4', 'opt_d']);

          const correctRaw = getVal(row, ['सही उत्तर विकल्प', 'सही उत्तर', 'correct option', 'correct', 'answer']);
          const correctIdx = parseCorrectOptionIndex(correctRaw);

          const subject = getVal(row, ['विषय (subject)', 'विषय', 'subject', 'section']) || 'म.प्र. सामान्य ज्ञान';
          const topic = getVal(row, ['टॉपिक', 'topic', 'उपविषय']) || 'सामान्य';
          const difficultyRaw = getVal(row, ['कठिनाई (difficulty)', 'कठिनाई', 'difficulty']).toLowerCase();
          const difficulty = (difficultyRaw === 'easy' || difficultyRaw === 'hard') ? difficultyRaw : 'medium';
          
          const expHi = getVal(row, ['व्याख्या (solution)', 'व्याख्या', 'solution', 'explanation', 'explanationhi']) || 'विस्तृत समाधान उपलब्ध है।';
          const expEn = getVal(row, ['व्याख्या (english)', 'explanation (english)', 'explanationen']);

          const explicitId = getVal(row, ['प्रश्न id', 'id', 'question id', 'question_id']);
          const setRaw = getVal(row, ['सेट नं.', 'सेट नंबर', 'set', 'set no', 'set number']);
          
          const resolvedSetNumber = useFileSetNumbers 
            ? parseSetNumberFromRow(setRaw, targetSetNumber)
            : targetSetNumber;

          // Validate minimum fields: question text and at least 2 options
          if (!qHi && !qEn) {
            invalid++;
            return;
          }
          if (!optA && !optB) {
            invalid++;
            return;
          }

          const qId = explicitId || `q_bulk_${targetSeriesId}_set${resolvedSetNumber}_${Date.now()}_${idx + 1}`;

          const formattedQuestion: Question = {
            id: qId,
            seriesId: targetSeriesId,
            setNumber: resolvedSetNumber,
            subject: subject,
            section: subject,
            topic: topic,
            difficulty: difficulty,
            questionHi: qHi || qEn,
            questionEn: qEn || qHi,
            optionsHi: [optA || 'विकल्प A', optB || 'विकल्प B', optC || 'विकल्प C', optD || 'विकल्प D'],
            optionsEn: [optA, optB, optC, optD],
            options: [
              { id: 'opt_0', textHi: optA || 'विकल्प A', textEn: optA || 'Option A' },
              { id: 'opt_1', textHi: optB || 'विकल्प B', textEn: optB || 'Option B' },
              { id: 'opt_2', textHi: optC || 'विकल्प C', textEn: optC || 'Option C' },
              { id: 'opt_3', textHi: optD || 'विकल्प D', textEn: optD || 'Option D' }
            ],
            correctOption: correctIdx,
            correctOptionIndex: correctIdx,
            explanationHi: expHi,
            explanationEn: expEn || expHi,
            marks: 1,
            negativeMarks: 0
          };

          validList.push(formattedQuestion);
        });

        setParsedQuestions(validList);
        setInvalidCount(invalid);
        setActiveTab('preview');
        showToast(`✅ ${validList.length} में से ${validList.length} मान्य प्रश्न फ़ाइल से तैयार हुए!`);
      } catch (err) {
        console.error('File parsing error:', err);
        showToast('❌ फ़ाइल पढ़ने में त्रुटि। कृपया टेम्पलेट अनुसार Excel/CSV चुनें।');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Submit Bulk Questions
  const handleConfirmImport = async () => {
    if (parsedQuestions.length === 0) {
      showToast('⚠️ अपलोड करने हेतु कोई मान्य प्रश्न नहीं है।');
      return;
    }

    setIsSaving(true);
    try {
      const res = await onSaveBulk(
        parsedQuestions,
        importMode,
        targetSeriesId,
        targetSetNumber
      );

      if (res.success) {
        const savedCount = res.count;
        const totalRows = rawRowCount || (parsedQuestions.length + invalidCount);
        const finalAfter = importMode === 'replace' ? savedCount : (currentCount + savedCount);
        const finalRemaining = Math.max(0, targetLimit - finalAfter);
        const sName = selectedSeriesObj?.titleHi || selectedCatObj?.nameHi || 'मॉक टेस्ट सीरीज़';
        const setName = isMultiSet ? `सेट #${targetSetNumber}` : 'मुख्य टेस्ट';

        // Prepare Detailed Report
        setUploadResultReport({
          totalInFile: totalRows,
          validParsed: parsedQuestions.length,
          invalidRows: invalidCount,
          successfullySaved: savedCount,
          seriesId: targetSeriesId,
          seriesNameHi: sName,
          setNameHi: setName,
          setNumber: targetSetNumber,
          targetLimit: targetLimit,
          questionsBefore: currentCount,
          questionsAfter: finalAfter,
          remainingSlots: finalRemaining,
          isCompleted: finalAfter >= targetLimit
        });

        showToast(`🎉 कुल ${totalRows} में से ${savedCount} प्रश्न सफलतापूर्वक अपडेट हो गए!`);
      } else {
        showToast('⚠️ प्रश्न सहेजने में समस्या आई, कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Import error:', err);
      showToast('❌ तकनीकी त्रुटि, कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <span>एक्सेल / CSV से प्रश्न बल्क अपलोड (Bulk Question Upload Engine)</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                डाउनलोड किए गए सेट के फॉर्मेट अनुसार अपनी Excel (.xlsx, .xls) या CSV फ़ाइल से 1 क्लिक में प्रश्नों को जोड़ें व अपडेट करें।
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Target Series & Set Selector Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-300 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-900 dark:text-amber-300 flex items-center gap-1.5 uppercase">
              <Layers className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
              <span>लक्ष्य परीक्षा एवं मॉक सेट चयन (Target Series & Set)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadSample('xls')}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>एक्सेल टेम्पलेट (.xls)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSample('csv')}
                className="px-2.5 py-1 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV टेम्पलेट</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Series Dropdown */}
            <div>
              <label className="block font-black text-stone-600 dark:text-stone-300 mb-1">
                1. किस परीक्षा / सीरीज़ में अपलोड करना है?
              </label>
              <select
                value={targetSeriesId}
                onChange={(e) => setTargetSeriesId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-bold text-stone-900 dark:text-amber-300"
              >
                <option value="free_mock_40">🎁 [एकल/Standalone] 40-प्रश्न फ्री डेमो मॉक टेस्ट (All-MP Demo)</option>
                {testSeries.map(ts => {
                  const isTsMultiSet = (ts.totalTests || 0) > 1 || ts.id === 'ts_patwari_2026' || ts.id === 'ts_agri_ext_2026';
                  const typeBadge = isTsMultiSet ? `[20 Full Sets]` : `[एकल/Standalone]`;
                  return (
                    <option key={ts.id} value={ts.id}>
                      {isTsMultiSet ? '📚' : '🎯'} {typeBadge} {ts.titleHi || ts.titleEn} (₹{ts.price})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Set Selector */}
            <div>
              <label className="block font-black text-stone-600 dark:text-stone-300 mb-1">
                2. किस मॉक सेट में जोड़ना है?
              </label>
              {isMultiSet ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <select
                      value={targetSetNumber}
                      onChange={(e) => setTargetSetNumber(Number(e.target.value))}
                      className="flex-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono font-bold text-stone-900 dark:text-amber-300"
                    >
                      {Array.from({ length: totalSetsAvailable }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          सेट #{num} {num === 1 ? '(फ्री डेमो सेट)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useFileSetNumbers}
                      onChange={(e) => setUseFileSetNumbers(e.target.checked)}
                      className="rounded accent-[#7A2A1E]"
                    />
                    <span>यदि एक्सेल में 'सेट नं.' कॉलम है तो उसी अनुसार सेट तय करें</span>
                  </label>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span>एकल स्टैंडअलोन टेस्ट (Single Standalone Mock)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200 font-black">
                    केवल 1 मुख्य सेट
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* REALTIME QUESTION LIMIT & REMAINING TRACKER BAR */}
          <div className="pt-3 border-t border-amber-200/80 dark:border-stone-800/80 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Gauge className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
                <span>इस टेस्ट सेट की क्षमता (Question Limit):</span>
                <span className="font-mono font-black text-[#7A2A1E] dark:text-[#D4A017]">
                  {targetLimit} प्रश्न
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-black">
                  ✓ वर्तमान में उपलब्ध: {currentCount}
                </span>
                <span className="text-stone-400">•</span>
                <span className={remainingBefore > 0 ? 'text-amber-700 dark:text-amber-400 font-black' : 'text-emerald-600 font-black'}>
                  {remainingBefore > 0 ? `⏳ शेष बचे हैं: ${remainingBefore} प्रश्न` : '🎯 सेट पूर्ण (Full)'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressPercentBefore}%` }}
                title={`वर्तमान: ${currentCount}/${targetLimit} प्रश्न`}
              />
              {parsedQuestions.length > 0 && importMode === 'append' && (
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100 - progressPercentBefore, (parsedQuestions.length / targetLimit) * 100)}%` }}
                  title={`अपलोड होने वाले: +${parsedQuestions.length} प्रश्न`}
                />
              )}
            </div>

            {/* Projected Status when File is Loaded */}
            {parsedQuestions.length > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-stone-800 border border-amber-300/80 dark:border-stone-700 text-[11px] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>अपलोड के बाद स्थिति:</span>
                  <span className="font-mono font-black text-[#7A2A1E] dark:text-[#D4A017]">
                    {projectedAfterCount} / {targetLimit} प्रश्न
                  </span>
                  <span>({projectedPercent}%)</span>
                </div>
                <div>
                  {projectedRemaining === 0 ? (
                    <span className="font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      🎉 यह सेट 100% पूर्ण हो जाएगा!
                    </span>
                  ) : (
                    <span className="font-bold text-amber-900 dark:text-amber-300">
                      पूर्ण होने हेतु अभी <strong>{projectedRemaining}</strong> प्रश्न और शेष रहेंगे।
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Upload / Preview / Format Guide */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'bg-[#7A2A1E] text-white shadow' 
                : 'text-stone-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>1. फ़ाइल चुनें व अपलोड करें</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            disabled={parsedQuestions.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 ${
              activeTab === 'preview' 
                ? 'bg-[#7A2A1E] text-white shadow' 
                : 'text-stone-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>
              2. प्रिव्यू एवं सत्यापन ({rawRowCount > 0 ? `${rawRowCount} में से ` : ''}{parsedQuestions.length} मान्य प्रश्न)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('formatGuide')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formatGuide' 
                ? 'bg-[#7A2A1E] text-white shadow' 
                : 'text-stone-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-amber-400" />
            <span>3. एक्सेल फॉर्मेट देखें एवं डाउनलोड करें (Format & Columns)</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD AREA */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* Drag and drop upload zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-amber-400 dark:border-amber-700/80 hover:border-amber-600 rounded-3xl bg-stone-50/60 dark:bg-stone-850/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-8 h-8 text-[#7A2A1E] dark:text-[#D4A017]" />
              </div>

              <div>
                <h4 className="font-black text-sm text-stone-900 dark:text-white">
                  यहाँ क्लिक करें या अपनी Excel (.xlsx, .xls) अथवा .CSV फ़ाइल ड्रैग करें
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  समर्थित फाइलें: <strong>.xlsx, .xls, .csv</strong> • UTF-8 हिन्दी (देवनागरी) फॉन्ट पूर्ण समर्थित
                </p>
              </div>

              {fileName && (
                <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-black rounded-full flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>चयनित फ़ाइल: {fileName}</span>
                </div>
              )}
            </div>

            {/* Import Mode: Append or Replace */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">
                अपलोड विधि (Import Action):
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="accent-[#7A2A1E]"
                  />
                  <span>पुराने प्रश्नों में जोड़ें / अपडेट करें (Merge & Append)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700 dark:text-rose-400">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="accent-rose-700"
                  />
                  <span>केवल इस सेट के पुराने प्रश्न हटाकर ये नए रखें (Replace Set)</span>
                </label>
              </div>
            </div>

            {/* Instructions checklist */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs space-y-2 text-blue-900 dark:text-blue-300">
              <div className="flex items-center justify-between">
                <div className="font-black flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>आवश्यक कॉलम निर्देश (Format Guidelines):</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('formatGuide')}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/80 hover:bg-blue-200 text-blue-800 dark:text-blue-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>पूरा फॉर्मेट व सैंपल तालिका देखें →</span>
                </button>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-600 dark:text-stone-300">
                <li>कॉलम नाम: <strong>प्रश्न (हिन्दी), विकल्प A, विकल्प B, विकल्प C, विकल्प D, सही उत्तर विकल्प (A, B, C, D), व्याख्या</strong>।</li>
                <li>वैकल्पिक कॉलम: <strong>प्रश्न (English), विषय (Subject), टॉपिक, कठिनाई (easy/medium/hard), सेट नं.</strong>।</li>
                <li>यदि आप पहले से डाउनलोड की गई एक्सेल शीट में ही प्रश्न जोड़ रहे हैं, तो वह 100% स्वतः मैच हो जाएगी।</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: FORMAT GUIDE & SAMPLE DOWNLOAD */}
        {activeTab === 'formatGuide' && (
          <div className="space-y-4">
            {/* Header with Download CTAs */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-850 dark:to-stone-800 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  <span>बल्क अपलोड एक्सेल / CSV फॉर्मेट संरचना (Column Specification)</span>
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  अपनी एक्सेल शीट में नीचे दिए गए कॉलम नामों का उपयोग करें। आप तुरंत तैयार सैंपल फ़ाइल डाउनलोड कर उसमें डेटा भर सकते हैं।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadSample('xls')}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>सैंपल एक्सेल (.xls) डाउनलोड करें</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSample('csv')}
                  className="px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>सैंपल .CSV डाउनलोड</span>
                </button>
              </div>
            </div>

            {/* Visual Columns Table */}
            <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-3 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <span className="text-xs font-black text-stone-700 dark:text-stone-200 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>सैंपल डेटा प्रिव्यू (Sample Rows Preview):</span>
                </span>
                <span className="text-[11px] font-bold text-stone-500">
                  कुल 13 मानक कॉलम समर्थित हैं
                </span>
              </div>

              <div className="overflow-x-auto max-h-72 scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-amber-100/70 dark:bg-stone-900 border-b border-amber-200 dark:border-stone-700 text-stone-800 dark:text-amber-300">
                      <th className="p-2.5 font-black whitespace-nowrap">क्र.सं.</th>
                      <th className="p-2.5 font-black whitespace-nowrap">प्रश्न (हिन्दी)*</th>
                      <th className="p-2.5 font-black whitespace-nowrap">विकल्प A*</th>
                      <th className="p-2.5 font-black whitespace-nowrap">विकल्प B*</th>
                      <th className="p-2.5 font-black whitespace-nowrap">विकल्प C*</th>
                      <th className="p-2.5 font-black whitespace-nowrap">विकल्प D*</th>
                      <th className="p-2.5 font-black whitespace-nowrap bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300">
                        सही उत्तर विकल्प*
                      </th>
                      <th className="p-2.5 font-black whitespace-nowrap">व्याख्या (Solution)</th>
                      <th className="p-2.5 font-black whitespace-nowrap">विषय (Subject)</th>
                      <th className="p-2.5 font-black whitespace-nowrap">टॉपिक</th>
                      <th className="p-2.5 font-black whitespace-nowrap">कठिनाई</th>
                      <th className="p-2.5 font-black whitespace-nowrap">सेट नं.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-750 text-stone-700 dark:text-stone-300">
                    <tr className="bg-white dark:bg-stone-850 hover:bg-stone-50">
                      <td className="p-2.5 font-mono font-bold text-center">1</td>
                      <td className="p-2.5 font-medium min-w-[220px]">
                        मध्यप्रदेश का सबसे पहला एवं सबसे बड़ा राष्ट्रीय उद्यान कौन सा है?
                      </td>
                      <td className="p-2.5 min-w-[140px]">कान्हा किसली राष्ट्रीय उद्यान</td>
                      <td className="p-2.5 min-w-[140px]">बांधवगढ़ राष्ट्रीय उद्यान</td>
                      <td className="p-2.5 min-w-[140px]">पेंच राष्ट्रीय उद्यान</td>
                      <td className="p-2.5 min-w-[140px]">पन्ना राष्ट्रीय उद्यान</td>
                      <td className="p-2.5 font-mono font-black text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                        A
                      </td>
                      <td className="p-2.5 text-stone-500 min-w-[180px]">
                        कान्हा किसली म.प्र. का सबसे बड़ा राष्ट्रीय उद्यान है (940 वर्ग किमी)।
                      </td>
                      <td className="p-2.5 whitespace-nowrap">सामान्य ज्ञान</td>
                      <td className="p-2.5 whitespace-nowrap">म.प्र. राष्ट्रीय उद्यान</td>
                      <td className="p-2.5 whitespace-nowrap font-mono text-amber-600">medium</td>
                      <td className="p-2.5 whitespace-nowrap font-mono">1</td>
                    </tr>
                    <tr className="bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-50">
                      <td className="p-2.5 font-mono font-bold text-center">2</td>
                      <td className="p-2.5 font-medium min-w-[220px]">
                        'खजुराहो के मंदिर' किस राजवंश के शासकों द्वारा बनवाए गए थे?
                      </td>
                      <td className="p-2.5 min-w-[140px]">परमार वंश</td>
                      <td className="p-2.5 min-w-[140px]">चंदेल वंश</td>
                      <td className="p-2.5 min-w-[140px]">गुप्त वंश</td>
                      <td className="p-2.5 min-w-[140px]">मौर्य वंश</td>
                      <td className="p-2.5 font-mono font-black text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                        B
                      </td>
                      <td className="p-2.5 text-stone-500 min-w-[180px]">
                        खजुराहो के मंदिर चंदेल शासकों द्वारा 950 से 1050 ईस्वी के मध्य बनवाए गए।
                      </td>
                      <td className="p-2.5 whitespace-nowrap">म.प्र. इतिहास</td>
                      <td className="p-2.5 whitespace-nowrap">चंदेल वंश एवं स्थापत्य</td>
                      <td className="p-2.5 whitespace-nowrap font-mono text-emerald-600">easy</td>
                      <td className="p-2.5 whitespace-nowrap font-mono">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanatory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>सही उत्तर कैसे लिखें?</span>
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  'सही उत्तर विकल्प' कॉलम में केवल <strong>A, B, C, या D</strong> (या 1, 2, 3, 4) लिखें। सिस्टम इसे स्वतः पहचान लेगा।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
                <span className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>सेट व स्टैंडअलोन प्रकार</span>
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  यदि परीक्षा <strong>फुल 20 सेट्स</strong> वाली है तो ऊपर सेट ड्रॉपडाउन से चुनें, अथवा एक्सेल में <strong>'सेट नं.'</strong> कॉलम में 1 से 20 लिखें।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-1">
                <span className="font-black text-purple-800 dark:text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>हिन्दी / English दोहरी भाषा</span>
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  यदि आप दोनों भाषाओं में प्रश्न अपलोड करना चाहते हैं तो <strong>'प्रश्न (English)'</strong> कॉलम भी शामिल कर सकते हैं।
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="px-5 py-2.5 rounded-xl bg-[#7A2A1E] hover:bg-[#963E2F] text-white font-black text-xs inline-flex items-center gap-2 shadow cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-amber-300" />
                <span>फॉर्मेट समझ लिया, अब फ़ाइल अपलोड करें →</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PREVIEW AREA */}
        {activeTab === 'preview' && (
          <div className="space-y-3">
            {/* Detailed Success / Validation summary badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    फ़ाइल के {rawRowCount} में से {parsedQuestions.length} प्रश्न पूरी तरह मान्य व तैयार!
                  </span>
                </span>
                {invalidCount > 0 && (
                  <span className="text-rose-600 font-bold text-[11px] bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                    ⚠️ {invalidCount} अधूरी पंक्तियाँ छोड़ दी गईं
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-stone-600 dark:text-stone-300">
                <span>सीरीज़ क्षमता: <strong className="text-[#7A2A1E] dark:text-[#D4A017]">{targetLimit}</strong></span>
                <span>•</span>
                <span>वर्तमान: <strong>{currentCount}</strong></span>
                <span>•</span>
                <span>अपलोड बाद शेष: <strong className="text-emerald-700 dark:text-emerald-400">{projectedRemaining}</strong></span>
              </div>
            </div>

            {/* Preview table / cards */}
            <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-2">
              {parsedQuestions.slice(0, 15).map((q, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#7A2A1E] text-[#D4A017] font-mono font-black px-2 py-0.5 rounded text-[10px]">
                        Q#{idx + 1}
                      </span>
                      <span className="font-bold text-stone-700 dark:text-stone-300">
                        {q.subject} • {q.topic}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono">
                        सेट #{q.setNumber || targetSetNumber}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      ID: {q.id}
                    </span>
                  </div>

                  <p className="font-bold text-stone-900 dark:text-white">
                    {q.questionHi}
                  </p>

                  {q.questionEn && q.questionEn !== q.questionHi && (
                    <p className="text-[11px] text-stone-500 italic">
                      {q.questionEn}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    {(q.optionsHi || ['A', 'B', 'C', 'D']).map((opt, i) => (
                      <div 
                        key={i}
                        className={`p-1.5 rounded-lg border ${
                          (q.correctOption ?? 0) === i 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-300' 
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        <span className="font-bold mr-1">{String.fromCharCode(65 + i)}:</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>

                  {q.explanationHi && (
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                      💡 <strong>व्याख्या:</strong> {q.explanationHi}
                    </div>
                  )}
                </div>
              ))}
              {parsedQuestions.length > 15 && (
                <div className="text-center py-2 text-xs font-bold text-stone-400">
                  ... एवं {parsedQuestions.length - 15} अन्य प्रश्न सफलतापूर्वक तैयार हैं।
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            रद्द करें (Cancel)
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'upload' && parsedQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition cursor-pointer"
              >
                प्रिव्यू देखें ({rawRowCount > 0 ? `${rawRowCount} में से ` : ''}{parsedQuestions.length} प्रश्न) →
              </button>
            )}

            <button
              type="button"
              disabled={parsedQuestions.length === 0 || isSaving}
              onClick={handleConfirmImport}
              className="px-6 py-2.5 rounded-xl bg-[#7A2A1E] hover:bg-[#963E2F] disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>सहेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>
                    {parsedQuestions.length > 0 ? `सत्यापित करें एवं ${parsedQuestions.length} प्रश्न सेव करें` : 'प्रश्न सेव करें'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* POST-UPLOAD SUCCESS REPORT MODAL (Detailed Result Breakdown) */}
      {uploadResultReport && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                बल्क प्रश्न अपलोड सफलतापूर्वक संपन्न!
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {uploadResultReport.seriesNameHi} • {uploadResultReport.setNameHi}
              </p>
            </div>

            {/* Scorecard / Stats Breakdown Box */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center justify-between">
                <span>अपलोड सांख्यिकी (Upload Audit Report)</span>
                <span className="text-emerald-600 font-mono font-bold">100% LIVE SYNC</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* 1. File to Valid Ratio */}
                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <div className="text-stone-400 text-[11px] font-bold">फ़ाइल में कुल प्रश्न:</div>
                  <div className="text-base font-mono font-black text-stone-900 dark:text-white">
                    {uploadResultReport.totalInFile} पंक्ति
                  </div>
                </div>

                {/* 2. Successfully Saved */}
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-0.5">
                  <div className="text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">सफलतापूर्वक अपडेट:</div>
                  <div className="text-base font-mono font-black text-emerald-700 dark:text-emerald-300">
                    {uploadResultReport.successfullySaved} / {uploadResultReport.totalInFile}
                  </div>
                </div>

                {/* 3. Target Limit */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 space-y-0.5">
                  <div className="text-amber-800 dark:text-amber-300 text-[11px] font-bold">सीरीज़/सेट सीमा (Limit):</div>
                  <div className="text-base font-mono font-black text-amber-900 dark:text-amber-300">
                    {uploadResultReport.targetLimit} प्रश्न
                  </div>
                </div>

                {/* 4. Total Active in this Set Now */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-300 dark:border-blue-800 space-y-0.5">
                  <div className="text-blue-800 dark:text-blue-300 text-[11px] font-bold">वर्तमान कुल प्रश्न (Now):</div>
                  <div className="text-base font-mono font-black text-blue-900 dark:text-blue-300">
                    {uploadResultReport.questionsAfter} प्रश्न
                  </div>
                </div>
              </div>

              {/* Remaining questions count banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-750 border border-amber-300 dark:border-amber-800/80 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-stone-700 dark:text-stone-300">
                    🎯 सीमा अनुसार शेष बचे प्रश्न (Remaining):
                  </span>
                  <span className={`font-mono font-black px-2 py-0.5 rounded ${
                    uploadResultReport.remainingSlots === 0 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#7A2A1E] text-[#D4A017]'
                  }`}>
                    {uploadResultReport.remainingSlots === 0 
                      ? '✓ 0 (पूर्ण)' 
                      : `${uploadResultReport.remainingSlots} प्रश्न शेष`}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  {uploadResultReport.remainingSlots === 0 
                    ? `बधाई! यह मॉक टेस्ट सेट पूरे ${uploadResultReport.targetLimit} प्रश्नों के साथ पूरी तरह तैयार है।`
                    : `इस सेट को पूर्ण (${uploadResultReport.targetLimit} प्रश्न) करने हेतु अभी ${uploadResultReport.remainingSlots} प्रश्नों की आवश्यकता है।`}
                </div>
              </div>

              {uploadResultReport.invalidRows > 0 && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  ℹ️ {uploadResultReport.invalidRows} पंक्तियाँ प्रश्न पाठ अथवा विकल्पों के अभाव में अस्वीकृत हुईं।
                </div>
              )}
            </div>

            {/* OK Button */}
            <button
              type="button"
              onClick={() => {
                setUploadResultReport(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-[#7A2A1E] hover:bg-[#963E2F] text-amber-300 font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>समझ गया, प्रश्न बैंक में देखें (Done)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
