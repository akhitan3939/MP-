import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Flame, ChevronRight, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcements, lang, navigate } = useApp();
  const pinned = announcements.filter(a => a.isPinned);
  const activeAnnouncement = pinned[0] || announcements[0];

  if (!activeAnnouncement) return null;

  return (
    <div className="bg-[#5E1F16] text-white text-xs sm:text-sm font-bold py-1.5 sm:py-2 px-3 sm:px-4 shadow-sm border-b-2 border-[#D4A017] w-full z-30">
      <div className="flex items-center gap-2 sm:gap-4 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-[#D4A017] text-black px-2 sm:px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#7A2A1E] animate-pulse shrink-0" />
            <span>
              {activeAnnouncement.tag === 'VACANCY' ? (lang === 'hi' ? 'नवीन भर्ती' : 'New Vacancy') : 
               activeAnnouncement.tag === 'LIVE_TEST' ? (lang === 'hi' ? 'लाइव मॉक' : 'Live Mock') : 
               (lang === 'hi' ? 'अपडेट' : 'Update')}
            </span>
          </span>
          <span className="font-bold text-[#FFFBF2] truncate tracking-tight text-xs sm:text-sm">
            {lang === 'hi' ? activeAnnouncement.titleHi : activeAnnouncement.titleEn}
          </span>
        </div>

        <button
          onClick={() => {
            if (activeAnnouncement.tag === 'VACANCY') {
              navigate('catalog', { category: 'patwari' });
            } else if (activeAnnouncement.tag === 'LIVE_TEST') {
              navigate('leaderboard');
            } else {
              navigate('catalog');
            }
          }}
          className="shrink-0 inline-flex items-center gap-1 bg-[#D4A017] hover:bg-[#c08f12] text-black font-black text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-lg shadow-sm transition btn-press-effect cursor-pointer whitespace-nowrap"
        >
          <span>{lang === 'hi' ? activeAnnouncement.linkTextHi : activeAnnouncement.linkTextEn}</span>
          <ChevronRight className="w-3 h-3 text-[#7A2A1E] shrink-0" />
        </button>
      </div>
    </div>
  );
};
