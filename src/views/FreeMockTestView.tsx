import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Target,
  FileText,
  UserCheck
} from 'lucide-react';
import { EXCLUSIVE_FREE_MOCK_QUESTIONS } from '../data/freeMockQuestions';

export const FreeMockTestView: React.FC = () => {
  const { lang, navigate, openAuthModal, currentUser } = useApp();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');

  const totalQuestions = EXCLUSIVE_FREE_MOCK_QUESTIONS.length; // Exactly 40 questions
  const totalMarks = 40;
  const durationMinutes = 30;

  // Distinct subjects in the 40-question mock
  const subjectsBreakdown = [
    { nameHi: 'म.प्र. GK एवं सामान्य ज्ञान', nameEn: 'MP GK & General Studies', count: 8, color: 'from-amber-500 to-amber-700', icon: '🏛️' },
    { nameHi: 'सामान्य हिन्दी व्याकरण', nameEn: 'General Hindi', count: 6, color: 'from-orange-500 to-orange-700', icon: '📖' },
    { nameHi: 'संख्यात्मक अभियोग्यता (गणित)', nameEn: 'Quantitative Aptitude (Maths)', count: 6, color: 'from-blue-500 to-blue-700', icon: '📐' },
    { nameHi: 'तार्किक योग्यता (Reasoning)', nameEn: 'Logical Reasoning', count: 6, color: 'from-purple-500 to-purple-700', icon: '🧩' },
    { nameHi: 'कंप्यूटर विज्ञान एवं IT ज्ञान', nameEn: 'Computer Science & IT', count: 6, color: 'from-emerald-500 to-emerald-700', icon: '💻' },
    { nameHi: 'सामान्य विज्ञान (Science)', nameEn: 'General Science', count: 4, color: 'from-teal-500 to-teal-700', icon: '🔬' },
    { nameHi: 'सामान्य अंग्रेजी (English)', nameEn: 'General English', count: 4, color: 'from-rose-500 to-rose-700', icon: '🔤' },
  ];

  const handleStartFreeExam = () => {
    navigate('cbtExam', { isFreeMock40: true, id: 'free_mock_40' });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#7A2A1E] via-[#5E1F16] to-[#7A2A1E] text-white rounded-3xl p-6 sm:p-10 border-4 border-[#D4A017] shadow-2xl relative overflow-hidden">
          {/* Subtle decorative background circle */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#D4A017]/10 blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              
              <div className="inline-flex items-center gap-2 bg-[#D4A017] text-stone-950 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow">
                <Sparkles className="w-4 h-4 fill-stone-950" />
                <span>{lang === 'hi' ? '100% निःशुल्क एवं बिना किसी पेमेंट के' : '100% Free • No Payment Required'}</span>
              </div>

              <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                {lang === 'hi' ? (
                  <>
                    ऑल-मध्यप्रदेश <span className="text-[#D4A017]">फ्री मॉक टेस्ट</span> (40 प्रश्न)
                  </>
                ) : (
                  <>
                    All-MP <span className="text-[#D4A017]">Free Mock Test</span> (40 Questions)
                  </>
                )}
              </h1>

              <p className="text-[#EAD8B1] text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                {lang === 'hi'
                  ? 'यह विशेष 40 प्रश्नों का स्वतंत्र मॉक टेस्ट है, जो किसी भी पेड पैकेज से अलग एवं सभी परीक्षार्थियों के लिए पूर्णतः निःशुल्क उपलब्ध है। असली CBT इंटरफ़ेस, ऑल-एमपी रैंक व तुरंत AI विश्लेषण के साथ अपनी तैयारी जाँचें।'
                  : 'This exclusive 40-question standalone mock test is completely free for all aspirants, separate from paid series. Test your readiness with genuine CBT interface, All-MP rank, and AI evaluation.'}
              </p>

              {/* Badges / Specs row */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5E1F16] border border-[#D4A017]/50 text-xs font-mono font-bold text-[#D4A017]">
                  <HelpCircle className="w-4 h-4" />
                  <span>40 {lang === 'hi' ? 'चयनित प्रश्न' : 'Selected Questions'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5E1F16] border border-[#D4A017]/50 text-xs font-mono font-bold text-white">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>30 {lang === 'hi' ? 'मिनट अवधि' : 'Minutes Duration'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5E1F16] border border-[#D4A017]/50 text-xs font-mono font-bold text-emerald-300">
                  <Award className="w-4 h-4" />
                  <span>40 {lang === 'hi' ? 'पूर्णांक (1 अंक/प्रश्न)' : 'Marks (1 Mark/Q)'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5E1F16] border border-[#D4A017]/50 text-xs font-mono font-bold text-[#EAD8B1]">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>{lang === 'hi' ? 'नो निगेटिव मार्किंग' : 'No Negative Marking'}</span>
                </div>
              </div>

            </div>

            {/* Right Action CTA card */}
            <div className="lg:col-span-4 bg-stone-900/90 border-2 border-[#D4A017] rounded-2xl p-5 text-center shadow-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D4A017] text-stone-950 flex items-center justify-center shadow-lg font-black text-2xl animate-bounce">
                🎯
              </div>

              <div>
                <div className="text-xs uppercase font-black text-[#D4A017] tracking-wider">
                  {lang === 'hi' ? 'तुरंत शुरू करें' : 'Ready to begin?'}
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  {lang === 'hi' ? 'असली CBT परीक्षा स्क्रीन' : 'Live Online Examination'}
                </div>
              </div>

              <button
                onClick={handleStartFreeExam}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-[#D4A017] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>{lang === 'hi' ? 'फ्री मॉक टेस्ट प्रारंभ करें (40 Qs)' : 'Start 40Q Free Mock'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-stone-400 font-medium">
                {lang === 'hi' ? '✓ शून्य शुल्क • तुरंत स्कोरकार्ड व ऑल-एमपी रैंक' : '✓ Zero fee • Instant scorecard & state rank'}
              </p>
            </div>
          </div>
        </div>

        {/* Syllabus & Question Distribution Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#7A2A1E] dark:text-[#D4A017]" />
                <span>{lang === 'hi' ? '40 प्रश्नों का विषयवार विभाजन (Syllabus Breakdown)' : '40-Question Subject Distribution'}</span>
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-0.5">
                {lang === 'hi' ? 'मध्यप्रदेश की सभी प्रतियोगी परीक्षाओं के मानक पैटर्न के अनुसार तैयार' : 'Crafted according to MP government exam standards'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {subjectsBreakdown.map((subj, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm hover:border-[#D4A017] transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{subj.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white leading-snug">
                      {lang === 'hi' ? subj.nameHi : subj.nameEn}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                      {lang === 'hi' ? 'विस्तृत समाधान व व्याख्या सहित' : 'With detailed explanation'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    {lang === 'hi' ? 'प्रश्न संख्या:' : 'Questions:'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-mono font-black text-xs">
                    {subj.count} Qs ({(subj.count / totalQuestions * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why this mock test is unique */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#7A2A1E] dark:text-[#D4A017]" />
            <span>{lang === 'hi' ? 'इस 40-प्रश्न फ्री मॉक टेस्ट की मुख्य विशेषताएँ:' : 'Key Features of This 40-Question Free Mock:'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-950 border border-amber-200/60 dark:border-stone-800 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                1
              </div>
              <h4 className="font-black text-stone-900 dark:text-white text-sm">
                {lang === 'hi' ? 'अलग व स्वतंत्र प्रश्न बैंक' : 'Distinct Question Bank'}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                {lang === 'hi' ? 'ये 40 प्रश्न किसी भी पेड सीरीज़ से नहीं लिए गए हैं, बल्कि विशेष रूप से फ्री मॉक के लिए नए तैयार किए गए हैं।' : 'These 40 questions are specially formulated for the free mock, not recycled from paid series.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-950 border border-amber-200/60 dark:border-stone-800 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                2
              </div>
              <h4 className="font-black text-stone-900 dark:text-white text-sm">
                {lang === 'hi' ? 'असली MPESB/MPPSC जैसा CBT' : 'Authentic CBT Experience'}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                {lang === 'hi' ? 'कैलकुलेटर, स्क्रैचपैड, मार्क फॉर रिव्यू, सेक्शनल स्विच और टाइमर के साथ वास्तविक परीक्षा अनुभव।' : 'Complete with calculator, scratchpad, review markers, timer, and question palette.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-950 border border-amber-200/60 dark:border-stone-800 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#7A2A1E] text-white flex items-center justify-center font-black">
                3
              </div>
              <h4 className="font-black text-stone-900 dark:text-white text-sm">
                {lang === 'hi' ? 'ऑल-एमपी लाइव रैंक व AI रिपोर्ट' : 'Live MP Rank & AI Analysis'}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                {lang === 'hi' ? 'टेस्ट सबमिट करते ही 55 जिलों के अभ्यर्थियों के बीच अपनी रैंक और Google AI द्वारा कमजोर विषयों का सुधार सुझाव प्राप्त करें।' : 'Instant state percentile rank along with AI diagnosis of weak and strong subjects.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-600 dark:text-stone-400 font-bold">
              {lang === 'hi' ? '★ अभी तक 28,450+ छात्र यह फ्री मॉक टेस्ट दे चुके हैं।' : '★ Over 28,450+ students have attempted this free mock test.'}
            </div>

            <button
              onClick={handleStartFreeExam}
              className="w-full sm:w-auto py-3 px-6 bg-[#7A2A1E] hover:bg-[#963E2F] text-[#D4A017] border-2 border-[#D4A017] font-black text-xs uppercase tracking-wider rounded-xl shadow transition"
            >
              {lang === 'hi' ? '🚀 अभी फ्री टेस्ट शुरू करें (40 प्रश्न)' : '🚀 Start Free Test Now (40 Qs)'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
