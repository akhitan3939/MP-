import React, { useState, useRef, useMemo } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  X as CloseIcon, 
  Download, 
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
  Check, 
  FileText, 
  Languages, 
  HelpCircle, 
  BookOpen, 
  Lock, 
  Sliders, 
  ArrowRight,
  Calculator,
  Edit3
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question, TestSeries } from '../../types';
import { exportToXls, exportToCsv } from '../../utils/exportReports';
import { MathFormattedText } from '../common/MathFormattedText';
import { MathEquationToolbar } from './MathEquationToolbar';

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
    mode: 'replace' | 'append',
    seriesId: string,
    setNumber: number
  ) => Promise<{ success: boolean; count: number }>;
}

const DEFAULT_SUBJECTS = [
  'सामान्य ज्ञान व म.प्र. सामान्य ज्ञान',
  'सामान्य गणित एवं संख्यात्मक अभिरुचि',
  'सामान्य विज्ञान (भौतिक, रसायन, जीव)',
  'सामान्य हिन्दी',
  'सामान्य अंग्रेजी',
  'तर्कशक्ति (General Reasoning)',
  'सामान्य प्रबंधन (Management)',
  'कंप्यूटर ज्ञान (Computer Knowledge)',
  'कृषि विस्तार एवं कृषि विज्ञान'
];

const SAMPLE_PASTE_TEXT = `1. प्रश्न: मध्य प्रदेश का राजकीय पक्षी कौन सा है?
(A) दूधराज (शाह बुलबुल / पैराडाइज फ्लाईकैचर)
(B) मोर
(C) सोन चिड़िया
(D) खरमोर
उत्तर: A
व्याख्या: मध्य प्रदेश का राजकीय पक्षी दूधराज (पैराडाइज फ्लाईकैचर) है, जिसे 1981 में घोषित किया गया था।

2. प्रश्न: यदि x² - 5x + 6 = 0 है, तो x के मान क्या होंगे?
(A) 2 और 3
(B) -2 और -3
(C) 1 और 6
(D) 0 और 5
उत्तर: A
व्याख्या: (x - 2)(x - 3) = 0 ⟹ x = 2, 3

3. प्रश्न: 144 का वर्गमूल (√144) क्या है?
(A) 10
(B) 12
(C) 14
(D) 16
उत्तर: B
व्याख्या: 12 × 12 = 144, अतः √144 = 12`;

export const BulkQuestionUploadModal: React.FC<BulkQuestionUploadModalProps> = ({
  isOpen,
  onClose,
  testSeries,
  questions = [],
  initialSeriesId,
  initialSetNumber = 1,
  onSaveBulk
}) => {
  // Navigation Tabs: 'easyPaste' (Text/Paste) | 'excelUpload' (Excel/CSV) | 'preview' | 'formatGuide'
  const [activeTab, setActiveTab] = useState<'easyPaste' | 'excelUpload' | 'preview' | 'formatGuide'>('easyPaste');

  // Selected Target Series & Set
  const [targetSeriesId, setTargetSeriesId] = useState<string>(
    initialSeriesId || (testSeries.length > 0 ? testSeries[0].id : 'ts_patwari_2026')
  );
  const [targetSetNumber, setTargetSetNumber] = useState<number>(initialSetNumber || 1);
  const [useFileSetNumbers, setUseFileSetNumbers] = useState<boolean>(false);

  // Common defaults
  const [defaultSubject, setDefaultSubject] = useState<string>('सामान्य ज्ञान व म.प्र. सामान्य ज्ञान');
  const [defaultTopic, setDefaultTopic] = useState<string>('');
  
  // Easy Paste text state
  const [pastedText, setPastedText] = useState<string>('');
  const pasteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-translate toggle & states
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationProgress, setTranslationProgress] = useState<{ current: number; total: number } | null>(null);

  // Parsed Questions state
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [rawRowCount, setRawRowCount] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  // Success audit result report
  const [uploadResultReport, setUploadResultReport] = useState<BulkUploadResultReport | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected series object & capacity limits
  const selectedSeriesObj = testSeries.find(s => s.id === targetSeriesId);
  const isMultiSet = (selectedSeriesObj?.totalTests || 0) > 1 || 
                     targetSeriesId === 'ts_patwari_2026' || 
                     targetSeriesId === 'ts_agri_ext_2026';
  const totalSetsAvailable = selectedSeriesObj?.totalTests || (isMultiSet ? 20 : 1);
  const targetLimit = selectedSeriesObj?.totalQuestions || 100;

  // Existing count in target set
  const currentCount = useMemo(() => {
    return questions.filter(q => 
      q.seriesId === targetSeriesId && 
      (Number(q.setNumber) || 1) === targetSetNumber
    ).length;
  }, [questions, targetSeriesId, targetSetNumber]);

  const remainingBefore = Math.max(0, targetLimit - currentCount);
  const progressPercentBefore = Math.min(100, Math.round((currentCount / targetLimit) * 100));

  const projectedAfterCount = importMode === 'replace' 
    ? parsedQuestions.length 
    : (currentCount + parsedQuestions.length);
  const projectedPercent = Math.min(100, Math.round((projectedAfterCount / targetLimit) * 100));
  const projectedRemaining = Math.max(0, targetLimit - projectedAfterCount);

  // Insert symbol/template into textarea at cursor position
  const handleInsertSymbol = (sym: string) => {
    if (!pasteTextareaRef.current) {
      setPastedText(prev => prev + sym);
      return;
    }
    const el = pasteTextareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const newVal = val.substring(0, start) + sym + val.substring(end);
    setPastedText(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + sym.length, start + sym.length);
    }, 0);
  };

  // Helper to parse option index from A/B/C/D or 1/2/3/4
  const parseCorrectOptionIndex = (val: any): number => {
    if (val === undefined || val === null) return 0;
    const s = String(val).trim().toUpperCase();
    if (s.startsWith('A') || s.startsWith('1') || s.startsWith('क')) return 0;
    if (s.startsWith('B') || s.startsWith('2') || s.startsWith('ख')) return 1;
    if (s.startsWith('C') || s.startsWith('3') || s.startsWith('ग')) return 2;
    if (s.startsWith('D') || s.startsWith('4') || s.startsWith('घ')) return 3;
    const n = parseInt(s, 10);
    if (!isNaN(n) && n >= 1 && n <= 4) return n - 1;
    return 0;
  };

  // Auto-translate & in-depth academic explanation generator via server endpoint
  const performAutoTranslate = async (questionsList: Question[]) => {
    if (questionsList.length === 0) return questionsList;
    setIsTranslating(true);
    try {
      const batchSize = 15; // smaller batch for rich, detailed explanations
      const updated = [...questionsList];
      
      for (let i = 0; i < updated.length; i += batchSize) {
        const slice = updated.slice(i, i + batchSize);
        setTranslationProgress({ current: i + 1, total: updated.length });

        const res = await fetch('/api/questions/auto-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questions: slice.map(q => ({
              id: q.id,
              questionHi: q.questionHi,
              optionsHi: q.options.map(o => o.textHi),
              correctOptionIndex: Number(q.correctOptionIndex ?? q.correctOption) || 0,
              explanationHi: q.explanationHi || '',
              subject: q.subject || defaultSubject
            })),
            enrichExplanation: true
          })
        });

        const data = await res.json();
        if (data && data.success && Array.isArray(data.translations)) {
          const map = new Map<string, any>();
          data.translations.forEach((t: any) => map.set(t.id, t));

          for (let j = i; j < Math.min(i + batchSize, updated.length); j++) {
            const q = updated[j];
            const t = map.get(q.id);
            if (t) {
              updated[j] = {
                ...q,
                questionEn: t.questionEn || q.questionEn || q.questionHi,
                options: q.options.map((opt, oIdx) => ({
                  ...opt,
                  textEn: (t.optionsEn && t.optionsEn[oIdx]) || opt.textEn || opt.textHi
                })),
                explanationHi: t.explanationHi || q.explanationHi,
                explanationEn: t.explanationEn || q.explanationEn || q.explanationHi
              };
            }
          }
        }
      }
      return updated;
    } catch (err) {
      console.warn('Auto translate & explanation warning:', err);
      return questionsList;
    } finally {
      setIsTranslating(false);
      setTranslationProgress(null);
    }
  };

  // Enrich a single question's explanation in 1 click
  const handleEnrichSingleQuestion = async (index: number) => {
    const targetQ = parsedQuestions[index];
    if (!targetQ) return;
    setIsTranslating(true);
    showToast(`🧠 प्रश्न #${index + 1} की विस्तृत व्याख्या AI द्वारा तैयार हो रही है...`);
    try {
      const res = await fetch('/api/questions/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: [{
            id: targetQ.id,
            questionHi: targetQ.questionHi,
            optionsHi: targetQ.options.map(o => o.textHi),
            correctOptionIndex: Number(targetQ.correctOptionIndex ?? targetQ.correctOption) || 0,
            explanationHi: targetQ.explanationHi || '',
            subject: targetQ.subject || defaultSubject
          }],
          enrichExplanation: true
        })
      });

      const data = await res.json();
      if (data?.success && Array.isArray(data.translations) && data.translations[0]) {
        const t = data.translations[0];
        setParsedQuestions(prev => {
          const next = [...prev];
          next[index] = {
            ...targetQ,
            questionEn: t.questionEn || targetQ.questionEn || targetQ.questionHi,
            options: targetQ.options.map((opt, oIdx) => ({
              ...opt,
              textEn: (t.optionsEn && t.optionsEn[oIdx]) || opt.textEn || opt.textHi
            })),
            explanationHi: t.explanationHi || targetQ.explanationHi,
            explanationEn: t.explanationEn || targetQ.explanationEn || targetQ.explanationHi
          };
          return next;
        });
        showToast(`🎉 प्रश्न #${index + 1} की विस्तृत प्रामाणिक व्याख्या तैयार!`);
      } else {
        showToast('⚠️ व्याख्या तैयार करने में समस्या आई।');
      }
    } catch (err) {
      console.error('Error enriching question:', err);
      showToast('❌ तकनीकी त्रुटि, पुनः प्रयास करें।');
    } finally {
      setIsTranslating(false);
    }
  };

  // Intelligent text parser for copy-pasted questions
  const handleParsePastedText = async () => {
    if (!pastedText.trim()) {
      showToast('⚠️ कृपया पहले प्रश्न टेक्स्ट दर्ज करें या पेस्ट करें।');
      return;
    }

    const clean = pastedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const rawLines = clean.split('\n');

    const questionBlocks: string[] = [];
    let currentBlock: string[] = [];

    const isQuestionStart = (line: string): boolean => {
      const t = line.trim();
      return (
        /^(?:(?:प्रश्न|प्र\.|Q(?:uestion)?)\s*[:\.\d\-]*|\d+[\.\)\:\-]\s*|\[\d+\])/i.test(t)
      );
    };

    for (const line of rawLines) {
      if (isQuestionStart(line) && currentBlock.length > 0) {
        questionBlocks.push(currentBlock.join('\n'));
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) {
      questionBlocks.push(currentBlock.join('\n'));
    }

    const finalBlocks = questionBlocks.length > 0 ? questionBlocks : clean.split(/\n\s*\n+/);
    const parsed: Question[] = [];
    const baseSlot = currentCount + 1;

    finalBlocks.forEach((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      let questionHi = '';
      const optionsHi: string[] = ['', '', '', ''];
      let correctOptionIndex = 0;
      let explanationHi = '';

      const regularLines: string[] = [];

      lines.forEach(line => {
        const matchA = line.match(/^(?:(?:\(?[A|a|1|क]\)?[\.\:\)\s]+)|(?:विकल्प\s*[A|1|क][\:\.\s]+))(.+)$/);
        const matchB = line.match(/^(?:(?:\(?[B|b|2|ख]\)?[\.\:\)\s]+)|(?:विकल्प\s*[B|2|ख][\:\.\s]+))(.+)$/);
        const matchC = line.match(/^(?:(?:\(?[C|c|3|ग]\)?[\.\:\)\s]+)|(?:विकल्प\s*[C|3|ग][\:\.\s]+))(.+)$/);
        const matchD = line.match(/^(?:(?:\(?[D|d|4|घ]\)?[\.\:\)\s]+)|(?:विकल्प\s*[D|4|घ][\:\.\s]+))(.+)$/);

        const matchAns = line.match(/^(?:(?:उत्तर|सही उत्तर|Ans(?:wer)?|Correct)\s*[\:\.\-\)]*\s*)(.+)$/i);
        const matchExp = line.match(/^(?:(?:व्याख्या|विवरण|हल|Explanation|Solution|Note)\s*[\:\.\-\)]*\s*)(.+)$/i);

        if (matchAns) {
          correctOptionIndex = parseCorrectOptionIndex(matchAns[1].trim());
        } else if (matchExp) {
          explanationHi = matchExp[1].trim();
        } else if (matchA) {
          optionsHi[0] = matchA[1].trim();
        } else if (matchB) {
          optionsHi[1] = matchB[1].trim();
        } else if (matchC) {
          optionsHi[2] = matchC[1].trim();
        } else if (matchD) {
          optionsHi[3] = matchD[1].trim();
        } else {
          regularLines.push(line);
        }
      });

      if (regularLines.length > 0) {
        questionHi = regularLines.join(' ')
          .replace(/^(?:(?:प्रश्न|प्र\.|Q(?:uestion)?)\s*[:\.\d\-]*|\d+[\.\)\:\-]\s*|\[\d+\])\s*/i, '')
          .trim();
      }

      // If options were not marked with prefixes, extract last 4 lines
      if (!optionsHi[0] && !optionsHi[1] && regularLines.length >= 5) {
        questionHi = regularLines.slice(0, regularLines.length - 4).join(' ')
          .replace(/^(?:(?:प्रश्न|प्र\.|Q(?:uestion)?)\s*[:\.\d\-]*|\d+[\.\)\:\-]\s*|\[\d+\])\s*/i, '')
          .trim();
        optionsHi[0] = regularLines[regularLines.length - 4];
        optionsHi[1] = regularLines[regularLines.length - 3];
        optionsHi[2] = regularLines[regularLines.length - 2];
        optionsHi[3] = regularLines[regularLines.length - 1];
      }

      if (!questionHi) {
        questionHi = `प्रश्न #${idx + 1}`;
      }

      // Default empty options
      if (!optionsHi[0]) optionsHi[0] = 'विकल्प A';
      if (!optionsHi[1]) optionsHi[1] = 'विकल्प B';
      if (!optionsHi[2]) optionsHi[2] = 'विकल्प C';
      if (!optionsHi[3]) optionsHi[3] = 'विकल्प D';

      const qId = `q_easy_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      const slotNum = Math.min(targetLimit, baseSlot + idx);

      parsed.push({
        id: qId,
        seriesId: targetSeriesId,
        setNumber: targetSetNumber,
        slotNumber: slotNum,
        subject: defaultSubject,
        topic: defaultTopic || defaultSubject,
        section: defaultSubject,
        difficulty: 'medium',
        marks: 1,
        negativeMarks: 0,
        questionHi,
        questionEn: '',
        options: [
          { id: `${qId}_opt_1`, textHi: optionsHi[0], textEn: '' },
          { id: `${qId}_opt_2`, textHi: optionsHi[1], textEn: '' },
          { id: `${qId}_opt_3`, textHi: optionsHi[2], textEn: '' },
          { id: `${qId}_opt_4`, textHi: optionsHi[3], textEn: '' }
        ],
        correctOption: correctOptionIndex,
        correctOptionIndex: correctOptionIndex,
        explanationHi: explanationHi || '',
        explanationEn: '',
        isLocked: true, // GUARANTEED PERSISTENT LOCK
        lockedAt: new Date().toISOString()
      });
    });

    if (parsed.length === 0) {
      showToast('⚠️ कोई मान्य प्रश्न नहीं मिले। कृपया फॉर्मेट जांचें।');
      return;
    }

    setRawRowCount(finalBlocks.length);
    showToast(`✅ ${parsed.length} प्रश्न सफलतापूर्वक तैयार!`);

    let finalQuestions = parsed;
    if (autoTranslateEnabled) {
      showToast('🔄 AI द्वारा अंग्रेजी अनुवाद शुरू हो रहा है...');
      finalQuestions = await performAutoTranslate(parsed);
      showToast('🎉 अनुवाद पूर्ण! प्रश्न प्रिव्यू में उपलब्ध हैं।');
    }

    setParsedQuestions(finalQuestions);
    setActiveTab('preview');
  };

  // Helper to read flexible column names
  const getVal = (row: any, possibleKeys: string[]): string => {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
        return String(row[key]).trim();
      }
      const lowerKey = key.toLowerCase();
      for (const actualKey of Object.keys(row)) {
        if (actualKey.trim().toLowerCase() === lowerKey && row[actualKey] !== undefined && row[actualKey] !== null) {
          const v = String(row[actualKey]).trim();
          if (v !== '') return v;
        }
      }
    }
    return '';
  };

  // Parse Excel / CSV files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        setRawRowCount(rawData.length);

        if (!rawData || rawData.length === 0) {
          setValidationErrors(['अपलोड की गई फ़ाइल में कोई डेटा नहीं मिला।']);
          return;
        }

        const validQuestions: Question[] = [];
        const errors: string[] = [];
        const baseSlot = currentCount + 1;

        rawData.forEach((row, idx) => {
          const rowNum = idx + 2;

          const qHi = getVal(row, ['प्रश्न (हिन्दी)', 'Question (Hindi)', 'प्रश्न', 'Question', 'qHi', 'questionHi', 'सवाल']);
          const qEn = getVal(row, ['प्रश्न (English)', 'Question (English)', 'Question_En', 'qEn', 'questionEn']);

          const optA = getVal(row, ['विकल्प A', 'Option A', 'optA', 'Option 1', 'विकल्प 1', 'A']);
          const optB = getVal(row, ['विकल्प B', 'Option B', 'optB', 'Option 2', 'विकल्प 2', 'B']);
          const optC = getVal(row, ['विकल्प C', 'Option C', 'optC', 'Option 3', 'विकल्प 3', 'C']);
          const optD = getVal(row, ['विकल्प D', 'Option D', 'optD', 'Option 4', 'विकल्प 4', 'D']);

          const correctVal = getVal(row, ['सही उत्तर विकल्प', 'सही उत्तर', 'Correct Option', 'Answer', 'Ans', 'Correct', 'उत्तर']);
          const explanationHi = getVal(row, ['व्याख्या (Solution)', 'व्याख्या (हिन्दी)', 'व्याख्या', 'Explanation', 'Solution', 'हल', 'विवरण']);
          const explanationEn = getVal(row, ['व्याख्या (English)', 'Explanation (English)', 'Explanation_En']);

          if (!qHi && !qEn) {
            errors.push(`पंक्ति ${rowNum}: प्रश्न का विवरण (Question text) खाली है।`);
            return;
          }

          if (!optA || !optB) {
            errors.push(`पंक्ति ${rowNum}: कम से कम विकल्प A और B होना अनिवार्य है।`);
            return;
          }

          const correctIndex = parseCorrectOptionIndex(correctVal);
          const qId = `q_xl_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
          const slotNum = Math.min(targetLimit, baseSlot + validQuestions.length);

          const subjectVal = getVal(row, ['विषय (Subject)', 'विषय', 'Subject']) || defaultSubject;
          const topicVal = getVal(row, ['टॉपिक', 'Topic']) || defaultTopic || subjectVal;

          validQuestions.push({
            id: qId,
            seriesId: targetSeriesId,
            setNumber: targetSetNumber,
            slotNumber: slotNum,
            subject: subjectVal,
            topic: topicVal,
            section: subjectVal,
            difficulty: 'medium',
            marks: 1,
            negativeMarks: 0,
            questionHi: qHi || qEn,
            questionEn: qEn || '',
            options: [
              { id: `${qId}_1`, textHi: optA, textEn: '' },
              { id: `${qId}_2`, textHi: optB, textEn: '' },
              { id: `${qId}_3`, textHi: optC || 'विकल्प C', textEn: '' },
              { id: `${qId}_4`, textHi: optD || 'विकल्प D', textEn: '' }
            ],
            correctOption: correctIndex,
            correctOptionIndex: correctIndex,
            explanationHi: explanationHi || '',
            explanationEn: explanationEn || '',
            isLocked: true, // LOCKED FOR SAFETY
            lockedAt: new Date().toISOString()
          });
        });

        setValidationErrors(errors);

        if (validQuestions.length > 0) {
          showToast(`✅ ${validQuestions.length} प्रश्न फ़ाइल से लोड हुए!`);
          let finalQs = validQuestions;
          if (autoTranslateEnabled) {
            showToast('🔄 AI द्वारा अंग्रेजी अनुवाद प्रारंभ...');
            finalQs = await performAutoTranslate(validQuestions);
            showToast('🎉 अनुवाद पूर्ण!');
          }
          setParsedQuestions(finalQs);
          setActiveTab('preview');
        } else {
          showToast('❌ फ़ाइल में कोई वैध प्रश्न नहीं मिले।');
        }
      } catch (err: any) {
        console.error('File parsing error:', err);
        setValidationErrors([`फ़ाइल पढ़ने में त्रुटि: ${err.message || 'फ़ाइल का प्रारूप अमान्य है'}`]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Download Sample Files
  const handleDownloadSample = (type: 'simple' | 'detailed', format: 'xls' | 'csv') => {
    let sampleData: any[] = [];

    if (type === 'simple') {
      // Simple 7-column format as shown in founder's table:
      // [ प्रश्न (हिन्दी) | विकल्प A | विकल्प B | विकल्प C | विकल्प D | सही उत्तर | व्याख्या ]
      sampleData = [
        {
          'प्रश्न (हिन्दी)': 'मध्य प्रदेश का सबसे बड़ा राष्ट्रीय उद्यान कौन सा है?',
          'विकल्प A': 'कान्हा किसली राष्ट्रीय उद्यान',
          'विकल्प B': 'बांधवगढ़ राष्ट्रीय उद्यान',
          'विकल्प C': 'पेंच राष्ट्रीय उद्यान',
          'विकल्प D': 'पन्ना राष्ट्रीय उद्यान',
          'सही उत्तर': 'A',
          'व्याख्या': 'कान्हा किसली राष्ट्रीय उद्यान मण्डला व बालाघाट जिले में 940 वर्ग किमी क्षेत्र में स्थित है। यह 1955 में नेशनल पार्क और 1973-74 में म.प्र. का पहला प्रोजेक्ट टाइगर बना।'
        },
        {
          'प्रश्न (हिन्दी)': 'चंबल नदी का उद्गम मध्य प्रदेश के किस जिले से होता है?',
          'विकल्प A': 'इंदौर (महू, जानापाव पहाड़ी)',
          'विकल्प B': 'अनूपपुर (अमरकंटक)',
          'विकल्प C': 'बैतूल (मुलताई)',
          'विकल्प D': 'धार (सरदारपुर)',
          'सही उत्तर': 'A',
          'व्याख्या': '' // (खाली छोड़ सकते हैं - AI पूरी विस्तृत व्याख्या, अन्य विकल्पों का विश्लेषण व परीक्षा तथ्य स्वतः तैयार करेगा!)
        },
        {
          'प्रश्न (हिन्दी)': 'यदि x² - 5x + 6 = 0 है, तो x के मान क्या होंगे?',
          'विकल्प A': '2 और 3',
          'विकल्प B': '-2 और -3',
          'विकल्प C': '1 और 6',
          'विकल्प D': '0 और 5',
          'सही उत्तर': 'A',
          'व्याख्या': '' // (गणित: AI स्वतः सूत्र, नियम और चरण-दर-चरण पूरा हल लिखेगा!)
        },
        {
          'प्रश्न (हिन्दी)': 'साधारण ब्याज का सूत्र क्या है?',
          'विकल्प A': 'SI = (P × R × T) / 100',
          'विकल्प B': 'SI = P(1 + R/100)ⁿ',
          'विकल्प C': 'SI = P + R + T',
          'विकल्प D': 'SI = (P × R) / T',
          'सही उत्तर': 'A',
          'व्याख्या': ''
        }
      ];
    } else {
      // Detailed 14-column format
      sampleData = [
        {
          'क्र.सं. (Q#)': 1,
          'मॉक सीरीज़': selectedSeriesObj?.titleHi || 'पटवारी',
          'सेट नं.': targetSetNumber,
          'विषय (Subject)': defaultSubject,
          'टॉपिक': 'म.प्र. राष्ट्रीय उद्यान',
          'कठिनाई (Difficulty)': 'medium',
          'प्रश्न (हिन्दी)': 'मध्य प्रदेश में कान्हा राष्ट्रीय उद्यान किस जिले में है?',
          'प्रश्न (English)': 'In which district of MP is Kanha National Park situated?',
          'विकल्प A': 'मण्डला',
          'विकल्प B': 'शिवपुरी',
          'विकल्प C': 'पन्ना',
          'विकल्प D': 'रीवा',
          'सही उत्तर': 'A',
          'व्याख्या (Solution)': 'कान्हा किसली राष्ट्रीय उद्यान मण्डला जिले में है।'
        }
      ];
    }

    const fileName = `MP_Pariksha_Setu_${type === 'simple' ? 'Simple_6Column' : 'Full'}_Template_${new Date().toISOString().split('T')[0]}`;
    if (format === 'xls') {
      exportToXls(sampleData, fileName);
    } else {
      exportToCsv(sampleData, fileName);
    }
    showToast(`📥 ${type === 'simple' ? 'सरल 6-कॉलम' : 'विस्तृत'} टेम्पलेट डाउनलोड हो गया!`);
  };

  // Confirm Import & Save Bulk
  const handleConfirmImport = async () => {
    if (parsedQuestions.length === 0) {
      showToast('⚠️ सहेजने के लिए कोई प्रश्न नहीं हैं।');
      return;
    }

    setIsSaving(true);
    try {
      // Always ensure questions are locked and have correct series and set
      const sanitized = parsedQuestions.map((q, idx) => ({
        ...q,
        seriesId: targetSeriesId,
        setNumber: targetSetNumber,
        slotNumber: q.slotNumber || (currentCount + idx + 1),
        isLocked: true, // GUARANTEED PERSISTENT LOCK
        lockedAt: q.lockedAt || new Date().toISOString()
      }));

      const result = await onSaveBulk(sanitized, importMode, targetSeriesId, targetSetNumber);
      if (result && result.success) {
        const savedCount = result.count || sanitized.length;
        const totalRows = rawRowCount > 0 ? rawRowCount : sanitized.length;
        const newQuestionsCount = currentCount + savedCount;
        const remainingSlots = Math.max(0, targetLimit - newQuestionsCount);

        setUploadResultReport({
          totalInFile: totalRows,
          validParsed: sanitized.length,
          invalidRows: Math.max(0, totalRows - sanitized.length),
          successfullySaved: savedCount,
          seriesId: targetSeriesId,
          seriesNameHi: selectedSeriesObj?.titleHi || 'चयनित सीरीज़',
          setNameHi: `सेट #${targetSetNumber}`,
          setNumber: targetSetNumber,
          targetLimit,
          questionsBefore: currentCount,
          questionsAfter: newQuestionsCount,
          remainingSlots,
          isCompleted: remainingSlots === 0
        });

        showToast(`🎉 कुल ${savedCount} प्रश्न सर्वर पर स्थायी रूप से सहेजे व लॉक हो गए!`);
      } else {
        showToast('⚠️ प्रश्न सहेजने में समस्या आई, कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('❌ तकनीकी त्रुटि, कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl my-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-70 bg-stone-900 text-amber-300 px-4 py-3 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center gap-2 text-xs font-black animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#2D2424] dark:text-white flex items-center gap-2">
                <span>⚡ सुपर ईज़ी बल्क प्रश्न लोडर (Easy Bulk Question Upload Engine)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300">
                  AI ट्रांसलेट + मैथ फॉर्मूला युक्त
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                सीधे हिन्दी में लिखें/पेस्ट करें या 6-कॉलम एक्सेल अपलोड करें — अंग्रेजी अनुवाद और गणित सूत्र सिस्टम स्वयं करेगा!
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Target Series, Set & Subject Selector Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-300 dark:border-amber-800/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-stone-900 dark:text-amber-300 flex items-center gap-1.5 uppercase">
              <Layers className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
              <span>लक्ष्य सीरीज़, सेट व विषय चयन (Target Selection)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDownloadSample('simple', 'xls')}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                title="सरल 6-कॉलम एक्सेल टेम्पलेट (केवल प्रश्न, विकल्प A,B,C,D और उत्तर)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>सरल 6-कॉलम एक्सेल (.xls)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSample('simple', 'csv')}
                className="px-2.5 py-1 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                title="सरल CSV टेम्पलेट"
              >
                <Download className="w-3.5 h-3.5" />
                <span>सरल CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 1. Series Dropdown */}
            <div>
              <label className="block font-black text-stone-600 dark:text-stone-300 mb-1">
                1. परीक्षा सीरीज़ चुनें:
              </label>
              <select
                value={targetSeriesId}
                onChange={(e) => setTargetSeriesId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-bold text-stone-900 dark:text-amber-300"
              >
                <option value="free_mock_40">🎁 40-प्रश्न फ्री डेमो मॉक टेस्ट</option>
                {testSeries.map(ts => {
                  const isTsMulti = (ts.totalTests || 0) > 1 || ts.id === 'ts_patwari_2026' || ts.id === 'ts_agri_ext_2026';
                  return (
                    <option key={ts.id} value={ts.id}>
                      {isTsMulti ? '📚' : '🎯'} {ts.titleHi || ts.titleEn}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Set Dropdown */}
            <div>
              <label className="block font-black text-stone-600 dark:text-stone-300 mb-1">
                2. मॉक टेस्ट सेट:
              </label>
              <select
                value={targetSetNumber}
                onChange={(e) => setTargetSetNumber(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono font-bold text-stone-900 dark:text-amber-300"
              >
                {Array.from({ length: totalSetsAvailable }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    सेट #{num} {num === 1 ? '(फ्री डेमो सेट)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Default Subject */}
            <div>
              <label className="block font-black text-stone-600 dark:text-stone-300 mb-1">
                3. डिफ़ॉल्ट विषय (Subject):
              </label>
              <select
                value={defaultSubject}
                onChange={(e) => setDefaultSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-bold text-stone-900 dark:text-amber-300"
              >
                {DEFAULT_SUBJECTS.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Set Capacity Indicator */}
          <div className="pt-2 border-t border-amber-200/80 dark:border-stone-800/80 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Gauge className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
                <span>सेट क्षमता: <strong className="text-[#7A2A1E] dark:text-[#D4A017]">{targetLimit} प्रश्न</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-black">
                  ✓ वर्तमान: {currentCount}
                </span>
                <span className="text-stone-400">•</span>
                <span className={remainingBefore > 0 ? 'text-amber-700 dark:text-amber-400 font-black' : 'text-emerald-600 font-black'}>
                  {remainingBefore > 0 ? `⏳ शेष: ${remainingBefore}` : '🎯 सेट पूर्ण'}
                </span>
              </div>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressPercentBefore}%` }}
              />
              {parsedQuestions.length > 0 && (
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100 - progressPercentBefore, (parsedQuestions.length / targetLimit) * 100)}%` }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
          <button
            onClick={() => setActiveTab('easyPaste')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'easyPaste' 
                ? 'bg-[#7A2A1E] text-white shadow' 
                : 'text-stone-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>1. आसान टेक्स्ट पेस्ट मोड (Easy Paste)</span>
          </button>

          <button
            onClick={() => setActiveTab('excelUpload')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'excelUpload' 
                ? 'bg-[#7A2A1E] text-white shadow' 
                : 'text-stone-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>2. एक्सेल / CSV फ़ाइल अपलोड</span>
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
            <Eye className="w-3.5 h-3.5" />
            <span>3. पूर्वावलोकन व AI अनुवाद ({parsedQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('formatGuide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ml-auto ${
              activeTab === 'formatGuide' 
                ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-white' 
                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>स्टेप गाइड (How to Use)</span>
          </button>
        </div>

        {/* TAB 1: EASY TEXT PASTE MODE */}
        {activeTab === 'easyPaste' && (
          <div className="space-y-4">
            {/* Math Formula Toolbar */}
            <MathEquationToolbar
              onInsert={handleInsertSymbol}
              title="गणित सूत्र व समीकरण टूलबार (Math Toolbar: क्लिक कर जोड़ें)"
              previewText={pastedText.slice(0, 140)}
            />

            {/* Paste Box Header & Sample Button */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <span>अपने प्रश्न, 4 विकल्प और सही उत्तर यहाँ पेस्ट करें:</span>
                <span className="text-[10px] font-normal text-stone-500">
                  (हिन्दी में 1 या 50 प्रश्न एक साथ जोड़ सकते हैं)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPastedText(SAMPLE_PASTE_TEXT)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer border border-amber-300/40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ 1-क्लिक नमूना लोड करें</span>
                </button>
                {pastedText && (
                  <button
                    type="button"
                    onClick={() => setPastedText('')}
                    className="px-2 py-1 text-[11px] text-stone-400 hover:text-rose-500 font-bold transition cursor-pointer"
                  >
                    साफ़ करें
                  </button>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={pasteTextareaRef}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={10}
                placeholder={`उदाहरण:\n1. मध्य प्रदेश की राजधानी क्या है?\n(A) भोपाल\n(B) इंदौर\n(C) ग्वालियर\n(D) जबलपुर\nउत्तर: A\nव्याख्या: मध्य प्रदेश की राजधानी भोपाल है।`}
                className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 text-xs font-mono leading-relaxed text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4A017] shadow-inner resize-y"
              />
            </div>

            {/* Action Bar: Auto-Translate & Deep Explanation Toggle + Parse Button */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800 flex flex-wrap items-center justify-between gap-3 border border-amber-200 dark:border-stone-700">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-black text-stone-800 dark:text-stone-200 max-w-xl">
                <input
                  type="checkbox"
                  checked={autoTranslateEnabled}
                  onChange={(e) => setAutoTranslateEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#7A2A1E] cursor-pointer mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="flex items-center gap-1.5 text-stone-900 dark:text-amber-300">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>🤖 AI द्वारा अंग्रेजी अनुवाद + गहन व विस्तृत व्याख्या बनाएं (Auto-Translate & Deep Explanation)</span>
                  </span>
                  <p className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                    व्याख्या खाली होने पर भी AI मुख्य अवधारणा, अन्य विकल्पों का विश्लेषण, परीक्षा उपयोगी तथ्य व गणित के चरण-दर-चरण हल स्वतः तैयार करेगा।
                  </p>
                </div>
              </label>

              <button
                type="button"
                onClick={handleParsePastedText}
                disabled={!pastedText.trim() || isTranslating}
                className="px-6 py-2.5 rounded-xl bg-[#7A2A1E] hover:bg-[#963E2F] disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-2 shadow cursor-pointer ml-auto"
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI प्रोसेस कर रहा है... ({translationProgress?.current}/{translationProgress?.total})</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>🚀 प्रश्नों को प्रोसेस करें (Parse & Preview) →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: EXCEL / CSV UPLOAD MODE */}
        {activeTab === 'excelUpload' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-850 border border-amber-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-900 dark:text-amber-300 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>सरल 6-कॉलम एक्सेल या विस्तृत 14-कॉलम एक्सेल दोनों समर्थित हैं</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDownloadSample('simple', 'xls')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>सरल 6-कॉलम फॉर्मेट डाउनलोड (.xls)</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                सरल 6-कॉलम एक्सेल में केवल: <strong>प्रश्न (हिन्दी)</strong>, <strong>विकल्प A</strong>, <strong>विकल्प B</strong>, <strong>विकल्प C</strong>, <strong>विकल्प D</strong>, <strong>सही उत्तर (A/B/C/D)</strong> भरें। बाकी सब अपने-आप भर जाएगा!
              </p>
            </div>

            {/* Dropzone */}
            <div className="p-8 border-2 border-dashed border-[#D4A017] rounded-3xl bg-amber-50/20 dark:bg-stone-950 text-center space-y-3 hover:bg-amber-50/40 transition">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-stone-800 dark:text-stone-200">
                  अपनी एक्सेल (.xlsx, .xls) या CSV फ़ाइल यहाँ चुनें
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  फाइल चुनते ही प्रश्न स्वतः लोड एवं मान्य हो जाएंगे
                </p>
              </div>
              <label className="inline-block px-6 py-2.5 rounded-xl bg-[#7A2A1E] hover:bg-[#963E2F] text-white text-xs font-black shadow transition cursor-pointer">
                <span>📁 फ़ाइल ब्राउज़ करें (Choose File)</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Auto-translate & Deep Explanation toggle for Excel mode */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-stone-700 dark:text-stone-300 p-3.5 rounded-xl bg-amber-50/60 dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
              <input
                type="checkbox"
                checked={autoTranslateEnabled}
                onChange={(e) => setAutoTranslateEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7A2A1E] cursor-pointer mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="flex items-center gap-1.5 text-stone-900 dark:text-amber-300 font-black">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>अपलोड होते ही स्वतः AI से अंग्रेजी अनुवाद व गहन व्याख्या बनाएं (Auto-Translate & Deep AI Explanation)</span>
                </span>
                <p className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                  'व्याख्या' कॉलम खाली छोड़ सकते हैं — AI खुद पूरी विस्तृत व्याख्या, हल व परीक्षा तथ्य तैयार कर देगा!
                </p>
              </div>
            </label>

            {validationErrors.length > 0 && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl space-y-1 text-xs text-rose-700 dark:text-rose-300">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>फ़ाइल में निम्नलिखित चेतावनियाँ मिलीं:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {validationErrors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PREVIEW & AI TRANSLATE TAB */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Header with Auto-Translate & Deep Explanation Button */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-stone-850 border border-amber-300 dark:border-amber-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-stone-900 dark:text-amber-300 flex items-center gap-2">
                  <span>कुल {parsedQuestions.length} प्रश्न सहेजने हेतु तैयार</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300">
                    🔒 स्थायी लॉक सुरक्षित
                  </span>
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  नीचे प्रश्नों की व्याख्या जांचें। 'AI से व्याख्या गहरी बनाएं' बटन से AI पूरी गहराई से विस्तृत व्याख्या तैयार करता है।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const translated = await performAutoTranslate(parsedQuestions);
                    setParsedQuestions(translated);
                    showToast('🎉 सभी प्रश्नों की गहन व्याख्या व अंग्रेजी अनुवाद तैयार!');
                  }}
                  disabled={isTranslating}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      <span>AI तैयार कर रहा है ({translationProgress?.current}/{translationProgress?.total})...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>🧠 AI से सभी की गहन व्याख्या व अनुवाद बनाएं</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Questions Cards List */}
            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              {parsedQuestions.map((q, idx) => (
                <div 
                  key={q.id || idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2.5 shadow-2xs"
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#7A2A1E] text-amber-300 font-mono font-black text-[11px]">
                        Q#{idx + 1}
                      </span>
                      <span className="text-stone-400 font-bold text-[11px]">
                        स्लॉट: {q.slotNumber || (idx + 1)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[10px] font-bold">
                        {q.subject}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> ऑटो-लॉक
                    </span>
                  </div>

                  {/* Hindi Question Text with Math Formatter */}
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                    <MathFormattedText text={q.questionHi} />
                  </div>

                  {/* English Question Text (if translated) */}
                  {q.questionEn && q.questionEn !== q.questionHi && (
                    <div className="text-[11px] font-medium text-stone-600 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-900/60 p-2 rounded-xl border border-stone-200 dark:border-stone-700">
                      <strong>EN:</strong> <MathFormattedText text={q.questionEn} />
                    </div>
                  )}

                  {/* Options 2x2 Grid with Math Formatter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = q.correctOption === oIdx;
                      const optLabel = String.fromCharCode(65 + oIdx);
                      return (
                        <div
                          key={opt.id || oIdx}
                          className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                            isCorrect 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 font-bold text-emerald-900 dark:text-emerald-200' 
                              : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 flex-1 mr-1">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCorrect 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                            }`}>
                              {optLabel}
                            </span>
                            <span className="truncate">
                              <MathFormattedText text={opt.textHi} />
                              {opt.textEn && opt.textEn !== opt.textHi && (
                                <span className="text-stone-400 ml-1 italic">({opt.textEn})</span>
                              )}
                            </span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider shrink-0">
                              ✓ सही उत्तर
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation with In-depth AI Formatter & Quick Enrich Button */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-stone-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>विस्तृत प्रामाणिक व्याख्या (Comprehensive Solution & Analysis)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEnrichSingleQuestion(idx)}
                        disabled={isTranslating}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 text-[10px] font-bold flex items-center gap-1 border border-amber-300/40 transition cursor-pointer disabled:opacity-40"
                        title="इस प्रश्न की व्याख्या AI द्वारा और गहरी, विस्तृत व प्रामाणिक बनाएं"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>⚡ AI से व्याख्या और गहरी बनाएं</span>
                      </button>
                    </div>

                    {q.explanationHi ? (
                      <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700/60 text-[11px] leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-line font-sans">
                        <MathFormattedText text={q.explanationHi} />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/40 border border-dashed border-stone-300 dark:border-stone-700 text-[11px] text-stone-400 flex items-center justify-between">
                        <span>💡 कोई व्याख्या नहीं दी गई है — AI से स्वतः बनाने हेतु दाईं ओर का बटन दबाएं</span>
                        <button
                          type="button"
                          onClick={() => handleEnrichSingleQuestion(idx)}
                          disabled={isTranslating}
                          className="text-[10px] font-bold text-amber-700 dark:text-amber-400 underline cursor-pointer"
                        >
                          व्याख्या तैयार करें →
                        </button>
                      </div>
                    )}

                    {q.explanationEn && q.explanationEn !== q.explanationHi && (
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-900/40 p-2 rounded-lg border border-stone-200/50 dark:border-stone-800 whitespace-pre-line">
                        <strong>EN Explanation:</strong> <MathFormattedText text={q.explanationEn} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FORMAT GUIDE (STEP-BY-STEP HINDI GUIDE) */}
        {activeTab === 'formatGuide' && (
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-stone-900 dark:text-white">
                आसान 5 स्टेप्स में प्रश्न लोड करने की मार्गदर्शिका (Step-by-Step Guide)
              </h4>
            </div>

            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2A1E] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <div className="font-black text-stone-900 dark:text-white">सीरीज़, सेट व विषय चुनें</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    ऊपर पीले बॉक्स में जिस परीक्षा (जैसे पटवारी या कॉन्स्टेबल), सेट नंबर और विषय में प्रश्न डालने हैं, उसे चुनें।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2A1E] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <div className="font-black text-stone-900 dark:text-white">हिन्दी में प्रश्न व विकल्प पेस्ट करें (या सरल 6-कॉलम एक्सेल अपलोड करें)</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    "आसान टेक्स्ट पेस्ट" में प्रश्न, A/B/C/D विकल्प और 'उत्तर: A' लिखें या वर्ड/पीडीएफ/व्हाट्सएप से सीधा कॉपी-पेस्ट करें।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2A1E] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <div className="font-black text-stone-900 dark:text-white">गणित समीकरण व फॉर्मूला टूलबार</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    यदि गणित के प्रश्न हैं, तो ऊपर दिए गए टूलबार से <strong>x²</strong>, <strong>√x</strong>, <strong>½</strong>, <strong>π</strong>, <strong>±</strong> या बने-बनाए सूत्र 1-क्लिक में जोड़ें।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2A1E] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <div className="font-black text-stone-900 dark:text-white">🤖 AI स्वतः अनुवाद + विस्तृत व प्रामाणिक व्याख्या (Deep AI Explanation)</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    संस्थापक के निर्देशानुसार AI केवल एक पंक्ति का संक्षेप नहीं, बल्कि पूरा गहराई से समझाता है — <strong>मुख्य अवधारणा, पृष्ठभूमि, अन्य 3 विकल्पों का विश्लेषण, परीक्षा-उपयोगी महत्वपूर्ण तथ्य</strong> तथा गणित के प्रश्नों में <strong>सूत्र व चरण-दर-चरण पूरा हल</strong>। 'व्याख्या' खाली छोड़ने पर भी AI इसे स्वतः तैयार करता है!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2A1E] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <div className="font-black text-stone-900 dark:text-white">सत्यापित करें एवं सहेजें (Permanent Save & Lock)</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    "सहेजें" बटन दबाते ही आपके प्रश्न सर्वर डिस्क पर स्थायी रूप से सुरक्षित और लॉक हो जाएंगे!
                  </p>
                </div>
              </div>
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
            {activeTab !== 'preview' && parsedQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition cursor-pointer"
              >
                प्रिव्यू देखें ({parsedQuestions.length} प्रश्न) →
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
                    {parsedQuestions.length > 0 ? `सत्यापित करें एवं ${parsedQuestions.length} प्रश्न सेव व लॉक करें` : 'प्रश्न सेव करें'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Success Audit Report Modal */}
      {uploadResultReport && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center justify-between">
                <span>अपलोड ऑडिट रिपोर्ट (Upload Audit)</span>
                <span className="text-emerald-600 font-mono font-bold">100% PERSISTENT & LOCKED</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <div className="text-stone-400 text-[11px] font-bold">कुल प्रोसेस किए गए:</div>
                  <div className="text-base font-mono font-black text-stone-900 dark:text-white">
                    {uploadResultReport.totalInFile}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-0.5">
                  <div className="text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">सफलतापूर्वक सेव व लॉक:</div>
                  <div className="text-base font-mono font-black text-emerald-700 dark:text-emerald-300">
                    {uploadResultReport.successfullySaved}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 space-y-0.5">
                  <div className="text-amber-800 dark:text-amber-300 text-[11px] font-bold">सेट क्षमता सीमा:</div>
                  <div className="text-base font-mono font-black text-amber-900 dark:text-amber-300">
                    {uploadResultReport.targetLimit} प्रश्न
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-300 dark:border-blue-800 space-y-0.5">
                  <div className="text-blue-800 dark:text-blue-300 text-[11px] font-bold">सेट में वर्तमान कुल प्रश्न:</div>
                  <div className="text-base font-mono font-black text-blue-900 dark:text-blue-300">
                    {uploadResultReport.questionsAfter} प्रश्न
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-750 border border-amber-300 dark:border-amber-800/80 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-stone-700 dark:text-stone-300">
                    🎯 सेट स्थिति:
                  </span>
                  <span className={`font-mono font-black px-2 py-0.5 rounded ${
                    uploadResultReport.remainingSlots === 0 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#7A2A1E] text-[#D4A017]'
                  }`}>
                    {uploadResultReport.remainingSlots === 0 
                      ? '✓ सेट 100% पूर्ण' 
                      : `${uploadResultReport.remainingSlots} प्रश्न शेष`}
                  </span>
                </div>
              </div>
            </div>

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
