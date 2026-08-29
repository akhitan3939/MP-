import React from 'react';
import { TestSeries } from '../types';
import { useApp } from '../context/AppContext';
import { Clock, FileText, CheckCircle2, Lock, ArrowRight, Star, Sparkles, BookCheck, Shield } from 'lucide-react';

interface TestCardProps {
  series: TestSeries;
}

export const TestCard: React.FC<TestCardProps> = ({ series }) => {
  const { lang, isEnrolled, openRazorpayModal, navigate } = useApp();
  const enrolled = isEnrolled(series.id);

  return (
    <div className="group relative bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 border-b-4 border-r-4 border-[#7A2A1E] dark:border-[#D4A017] rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Header & Department Ribbon */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-white bg-[#7A2A1E] px-2.5 py-1 rounded shadow-xs">
            <Shield className="w-3 h-3 text-[#D4A017]" />
            {lang === 'hi' ? series.departmentHi : series.department}
          </span>
          
          {series.badgeTagHi && (
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#2D2424] bg-[#D4A017] px-2.5 py-1 rounded shadow-xs shrink-0">
              <Sparkles className="w-3 h-3 text-[#7A2A1E]" />
              {lang === 'hi' ? series.badgeTagHi : series.badgeTagEn}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => navigate('testDetail', { id: series.id })}
          className="font-display font-black text-lg sm:text-xl text-[#2D2424] dark:text-white group-hover:text-[#7A2A1E] dark:group-hover:text-[#D4A017] cursor-pointer transition line-clamp-2 leading-snug tracking-tight"
        >
          {lang === 'hi' ? series.titleHi : series.titleEn}
        </h3>

        {/* Short Description */}
        <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-medium">
          {lang === 'hi' ? series.descriptionHi : series.descriptionEn}
        </p>

        {/* Exam Meta Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#EAD8B1]/60 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold">
          <div className="flex items-center gap-1.5 font-bold">
            <FileText className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017] shrink-0" />
            <span>{series.totalTests} {lang === 'hi' ? 'टेस्ट' : 'Mocks'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{series.durationMinutes} {lang === 'hi' ? 'मिनट' : 'Mins'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <BookCheck className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
            <span>{series.pdfNotesCount} {lang === 'hi' ? 'नोट्स' : 'Notes'}</span>
          </div>
        </div>
      </div>

      {/* Perforated Admit Card Notch */}
      <div className="ticket-perforation bg-white dark:bg-stone-900"></div>

      {/* Bottom Pricing & Action Section */}
      <div className="p-5 pt-3 bg-[#FFFBF2] dark:bg-stone-950/60 border-t border-[#EAD8B1]/40 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#2D2424] dark:text-white">
              ₹{series.price}
            </span>
            <span className="font-mono text-xs text-stone-500 line-through font-bold">
              ₹{series.originalPrice}
            </span>
            <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
              {Math.round(((series.originalPrice - series.price) / series.originalPrice) * 100)}% OFF
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400 font-bold mt-0.5">
            <Star className="w-3 h-3 text-[#D4A017] fill-[#D4A017]" />
            <span>{series.rating}</span>
            <span>• {series.enrolledCount.toLocaleString()} {lang === 'hi' ? 'छात्र' : 'enrolled'}</span>
          </div>
        </div>

        {enrolled ? (
          <button
            onClick={() => navigate('cbtExam', { id: series.id })}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <span>{lang === 'hi' ? 'टेस्ट दें' : 'Start Test'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              onClick={() => navigate('cbtExam', { isFreeMock40: true, id: 'free_mock_40' })}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider px-3 py-2 rounded-xl shadow-sm transition hover:scale-105 active:scale-95 text-xs cursor-pointer"
              title={lang === 'hi' ? '40 प्रश्नों का 100% मुफ़्त डेमो टेस्ट दें' : 'Start 40Q Free Demo Test'}
            >
              <span>🎁 {lang === 'hi' ? 'फ्री डेमो (40 Qs)' : 'Demo (40Q)'}</span>
            </button>
            <button
              onClick={() => openRazorpayModal(series)}
              className="inline-flex items-center gap-1.5 bg-[#D4A017] hover:bg-[#c08f12] text-black font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md transition hover:scale-105 active:scale-95 text-xs cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>{lang === 'hi' ? 'अनलॉक करें' : 'Buy Now'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
