import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, ChevronRight, Bell } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcements, lang, navigate } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only active announcements
  const activeAnnouncements = announcements.filter(a => a.isActive !== false);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeAnnouncements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  if (activeAnnouncements.length === 0) return null;

  const current = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  const handleAction = () => {
    if (current.targetUrl) {
      window.open(current.targetUrl, '_blank');
      return;
    }
    if (current.targetView) {
      navigate(current.targetView as any);
      return;
    }
    if (current.tag === 'VACANCY') {
      navigate('catalog', { category: 'patwari' });
    } else if (current.tag === 'LIVE_TEST') {
      navigate('freeMockTest');
    } else {
      navigate('catalog');
    }
  };

  const getTagLabel = () => {
    switch (current.tag) {
      case 'VACANCY':
        return lang === 'hi' ? 'नवीन भर्ती' : 'New Vacancy';
      case 'ADMIT_CARD':
        return lang === 'hi' ? 'प्रवेश पत्र' : 'Admit Card';
      case 'RESULT':
        return lang === 'hi' ? 'परीक्षा परिणाम' : 'Exam Result';
      case 'LIVE_TEST':
        return lang === 'hi' ? 'लाइव मॉक' : 'Live Mock';
      case 'OFFER':
        return lang === 'hi' ? 'विशेष ऑफर' : 'Special Offer';
      case 'EXAM_DATE':
        return lang === 'hi' ? 'परीक्षा तिथि' : 'Exam Date';
      case 'NEWS':
        return lang === 'hi' ? 'राज्य समाचार' : 'State News';
      default:
        return lang === 'hi' ? 'महत्वपूर्ण सूचना' : 'Official Notice';
    }
  };

  return (
    <div className="bg-[#5E1F16] text-white text-xs sm:text-sm font-bold py-1.5 sm:py-2 px-3 sm:px-4 shadow-sm border-b-2 border-[#D4A017] w-full z-30 transition-all">
      <div className="flex items-center gap-2 sm:gap-4 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-[#D4A017] text-stone-950 px-2 sm:px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
            {current.isNew ? (
              <Flame className="w-3.5 h-3.5 text-[#7A2A1E] animate-pulse shrink-0" />
            ) : (
              <Bell className="w-3.5 h-3.5 text-[#7A2A1E] shrink-0" />
            )}
            <span>{getTagLabel()}</span>
          </span>
          <span className="font-bold text-[#FFFBF2] truncate tracking-tight text-xs sm:text-sm animate-in fade-in duration-300">
            {lang === 'hi' ? current.titleHi : current.titleEn}
          </span>
        </div>

        <button
          onClick={handleAction}
          className="shrink-0 inline-flex items-center gap-1 bg-[#D4A017] hover:bg-[#c08f12] text-black font-black text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-lg shadow-sm transition btn-press-effect cursor-pointer whitespace-nowrap"
        >
          <span>{lang === 'hi' ? (current.linkTextHi || 'अभी देखें') : (current.linkTextEn || 'View Now')}</span>
          <ChevronRight className="w-3 h-3 text-[#7A2A1E] shrink-0" />
        </button>
      </div>
    </div>
  );
};
