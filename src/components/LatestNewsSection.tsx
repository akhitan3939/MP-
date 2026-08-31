import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Announcement, AnnouncementTag } from '../types';
import { 
  Bell, 
  Flame, 
  Calendar, 
  ExternalLink, 
  ChevronRight, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Award, 
  X,
  Share2,
  PlusCircle,
  Clock,
  ArrowUpRight,
  Radio
} from 'lucide-react';

interface LatestNewsSectionProps {
  className?: string;
  maxHeight?: string;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ 
  className = '',
  maxHeight = 'h-[360px] sm:h-[400px]'
}) => {
  const { announcements, lang, navigate, currentUser } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<'normal' | 'slow' | 'fast'>('normal');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showAllModal, setShowAllModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter active announcements only
  const activeAnnouncements = announcements.filter(a => a.isActive !== false);

  // Filtered list by category tag
  const filteredAnnouncements = activeAnnouncements.filter(a => {
    if (selectedTag === 'ALL') return true;
    return a.tag === selectedTag;
  });

  // Sort pinned first
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Speed in pixels per step
  const speedMap = {
    slow: 0.4,
    normal: 0.8,
    fast: 1.6
  };

  // Continuous smooth vertical auto-up-scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused || isHovered || sortedAnnouncements.length <= 2) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollStep = (currentTime: number) => {
      if (!container) return;
      const delta = currentTime - lastTime;

      // Run smooth scroll approximately at ~60fps
      if (delta >= 16) {
        const step = speedMap[scrollSpeed];
        container.scrollTop += step;

        // Seamless loop when reaching bottom
        if (container.scrollTop >= container.scrollHeight - container.clientHeight - 2) {
          container.scrollTop = 0;
        }
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isHovered, scrollSpeed, sortedAnnouncements.length]);

  // Manual scroll controls
  const handleManualScroll = (direction: 'up' | 'down') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 100;
    if (direction === 'up') {
      container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
    } else {
      if (container.scrollTop >= container.scrollHeight - container.clientHeight - 5) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += scrollAmount;
      }
    }
  };

  // Tag metadata helper
  const getTagBadge = (tag: AnnouncementTag) => {
    switch (tag) {
      case 'VACANCY':
        return {
          label: lang === 'hi' ? 'भर्ती' : 'Vacancy',
          bg: 'bg-emerald-600',
          textColor: 'text-emerald-700 dark:text-emerald-300',
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800'
        };
      case 'ADMIT_CARD':
        return {
          label: lang === 'hi' ? 'प्रवेश पत्र' : 'Admit Card',
          bg: 'bg-amber-600',
          textColor: 'text-amber-700 dark:text-amber-300',
          badgeBg: 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800'
        };
      case 'RESULT':
        return {
          label: lang === 'hi' ? 'परिणाम' : 'Result',
          bg: 'bg-purple-600',
          textColor: 'text-purple-700 dark:text-purple-300',
          badgeBg: 'bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-800'
        };
      case 'LIVE_TEST':
        return {
          label: lang === 'hi' ? 'लाइव मॉक' : 'Live Mock',
          bg: 'bg-rose-600',
          textColor: 'text-rose-700 dark:text-rose-300',
          badgeBg: 'bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800'
        };
      case 'OFFER':
        return {
          label: lang === 'hi' ? 'ऑफर' : 'Offer',
          bg: 'bg-[#D4A017]',
          textColor: 'text-amber-800 dark:text-[#D4A017]',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/50 border-[#D4A017]'
        };
      case 'EXAM_DATE':
        return {
          label: lang === 'hi' ? 'परीक्षा तिथि' : 'Exam Date',
          bg: 'bg-cyan-600',
          textColor: 'text-cyan-700 dark:text-cyan-300',
          badgeBg: 'bg-cyan-100 dark:bg-cyan-950/70 border-cyan-300 dark:border-cyan-800'
        };
      case 'NEWS':
        return {
          label: lang === 'hi' ? 'समाचार' : 'News',
          bg: 'bg-indigo-600',
          textColor: 'text-indigo-700 dark:text-indigo-300',
          badgeBg: 'bg-indigo-100 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-800'
        };
      case 'NOTICE':
      default:
        return {
          label: lang === 'hi' ? 'सूचना' : 'Notice',
          bg: 'bg-blue-600',
          textColor: 'text-blue-700 dark:text-blue-300',
          badgeBg: 'bg-blue-100 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800'
        };
    }
  };

  const handleActionClick = (ann: Announcement) => {
    if (ann.targetUrl) {
      window.open(ann.targetUrl, '_blank');
      return;
    }

    if (ann.targetView) {
      navigate(ann.targetView as any);
      return;
    }

    if (ann.tag === 'LIVE_TEST') {
      navigate('freeMockTest');
    } else if (ann.tag === 'VACANCY' || ann.tag === 'OFFER') {
      navigate('catalog');
    } else {
      setSelectedAnnouncement(ann);
    }
  };

  return (
    <aside className={`w-full flex flex-col h-full ${className}`}>
      <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl shadow-xl overflow-hidden transition-all flex flex-col h-full">
        
        {/* Compact Header Ribbon */}
        <div className="bg-gradient-to-r from-[#7A2A1E] via-[#5E1F16] to-[#7A2A1E] text-white p-3 sm:p-3.5 border-b-2 border-[#D4A017] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gond-pattern opacity-10 pointer-events-none"></div>

          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#D4A017] text-stone-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    LIVE
                  </span>
                  <span className="text-[10px] font-bold text-[#EAD8B1] truncate">
                    {lang === 'hi' ? 'सूचना पट्ट' : 'Notice Board'}
                  </span>
                </div>
                <h3 className="font-display font-black text-sm sm:text-base text-white tracking-tight leading-tight truncate">
                  {lang === 'hi' ? 'नवीनतम सूचनाएँ एवं समाचार' : 'Latest News & Bulletins'}
                </h3>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => navigate('admin')}
                  className="p-1.5 rounded-lg bg-[#D4A017] hover:bg-[#c08f12] text-stone-950 font-black text-[10px] shadow transition cursor-pointer"
                  title="अधिसूचना प्रबंधन (Admin)"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Pause/Play */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-[#EAD8B1] hover:text-white transition border border-[#D4A017]/30 text-[10px] font-bold cursor-pointer"
                title={isPaused ? 'चलाएँ (Play)' : 'रोकें (Pause)'}
              >
                {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
              </button>

              {/* Up/Down buttons */}
              <button
                onClick={() => handleManualScroll('up')}
                className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-[#EAD8B1] hover:text-white transition border border-[#D4A017]/30 cursor-pointer"
                title="ऊपर स्क्रॉल करें"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleManualScroll('down')}
                className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-[#EAD8B1] hover:text-white transition border border-[#D4A017]/30 cursor-pointer"
                title="नीचे स्क्रॉल करें"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Mini Category Filter Chips Bar */}
        <div className="bg-stone-100 dark:bg-stone-850 px-3 py-1.5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] shrink-0">
          {[
            { id: 'ALL', labelHi: 'सभी', labelEn: 'All' },
            { id: 'VACANCY', labelHi: '📢 भर्ती', labelEn: 'Vacancy' },
            { id: 'ADMIT_CARD', labelHi: '🎫 एडमिट', labelEn: 'Admit' },
            { id: 'RESULT', labelHi: '🏆 परिणाम', labelEn: 'Result' },
            { id: 'LIVE_TEST', labelHi: '⚡ टेस्ट', labelEn: 'Mock' },
            { id: 'OFFER', labelHi: '🎁 ऑफर', labelEn: 'Offers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTag(tab.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                selectedTag === tab.id
                  ? 'bg-[#7A2A1E] text-[#D4A017] shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {lang === 'hi' ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Up-Scrolling Stream Content */}
        <div 
          className="relative bg-stone-50/60 dark:bg-stone-900/60 p-2.5 sm:p-3 flex-1 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Pause Status Indicator on Hover */}
          {(isHovered || isPaused) && (
            <div className="absolute top-2 right-3 z-20 inline-flex items-center gap-1 bg-stone-900/85 text-amber-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow backdrop-blur-xs border border-amber-400/30">
              <Pause className="w-2 h-2" />
              <span>{lang === 'hi' ? 'रोक दिया गया' : 'Paused'}</span>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className={`${maxHeight} overflow-y-auto space-y-2 pr-0.5 scroll-smooth`}
            style={{ scrollbarWidth: 'none' }}
          >
            {sortedAnnouncements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-stone-400 space-y-1.5">
                <Bell className="w-6 h-6 opacity-40 text-[#D4A017]" />
                <div className="font-bold text-xs text-stone-600 dark:text-stone-300">
                  {lang === 'hi' ? 'इस श्रेणी में अभी कोई सूचना नहीं है।' : 'No notifications in this tag.'}
                </div>
                <button
                  onClick={() => setSelectedTag('ALL')}
                  className="text-[11px] text-[#7A2A1E] dark:text-[#D4A017] font-black underline cursor-pointer"
                >
                  {lang === 'hi' ? 'सभी देखें' : 'View all'}
                </button>
              </div>
            ) : (
              // Double list rendering for seamless endless scrolling loop
              [...sortedAnnouncements, ...sortedAnnouncements].map((ann, idx) => {
                const tagInfo = getTagBadge(ann.tag);

                return (
                  <div
                    key={`${ann.id}_${idx}`}
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="p-2.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 hover:border-[#D4A017] dark:hover:border-[#D4A017] shadow-xs hover:shadow-md transition-all duration-150 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Left vertical status highlight line */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${tagInfo.bg}`}></div>

                    <div className="space-y-1 pl-1.5">
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${tagInfo.badgeBg} ${tagInfo.textColor}`}>
                            {tagInfo.label}
                          </span>

                          {ann.isPinned && (
                            <span className="text-[9px] font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-1 py-0.2 rounded border border-amber-200">
                              📌 PIN
                            </span>
                          )}

                          {ann.isNew && (
                            <span className="inline-flex items-center gap-0.5 bg-rose-600 text-white px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider animate-pulse">
                              <Flame className="w-2.5 h-2.5 fill-current" />
                              <span>NEW</span>
                            </span>
                          )}
                        </div>

                        {ann.date && (
                          <span className="text-[10px] text-stone-400 font-mono flex items-center gap-0.5 shrink-0">
                            <Clock className="w-2.5 h-2.5 text-[#D4A017]" />
                            <span>{ann.date}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-xs sm:text-[13px] text-stone-900 dark:text-white group-hover:text-[#7A2A1E] dark:group-hover:text-[#D4A017] transition-colors leading-snug line-clamp-2">
                        {lang === 'hi' ? ann.titleHi : ann.titleEn}
                      </h4>

                      {/* Bottom Link Action */}
                      <div className="flex items-center justify-between text-[10px] pt-1 text-stone-400 border-t border-stone-100 dark:border-stone-800">
                        <span className="truncate max-w-[150px]">
                          {ann.descriptionHi ? (lang === 'hi' ? ann.descriptionHi : ann.descriptionEn) : 'आधिकारिक सूचना'}
                        </span>
                        <span className="text-[#7A2A1E] dark:text-[#D4A017] font-black flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0">
                          <span>{lang === 'hi' ? (ann.linkTextHi || 'विवरण') : (ann.linkTextEn || 'Open')}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Compact Footer strip with View All Modal trigger */}
        <div className="bg-stone-100 dark:bg-stone-850 px-3 py-2 text-[11px] font-bold text-stone-600 dark:text-stone-300 flex items-center justify-between border-t border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{lang === 'hi' ? `${activeAnnouncements.length} सक्रिय सूचनाएँ` : `${activeAnnouncements.length} Active`}</span>
          </div>

          <button
            onClick={() => setShowAllModal(true)}
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#7A2A1E] dark:text-[#D4A017] hover:underline cursor-pointer"
          >
            <span>{lang === 'hi' ? 'सभी बुलेटिन देखें →' : 'View All Notices →'}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. SINGLE NOTIFICATION DETAIL POPUP MODAL */}
      {/* ========================================================================= */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getTagBadge(selectedAnnouncement.tag).badgeBg} ${getTagBadge(selectedAnnouncement.tag).textColor}`}>
                  {getTagBadge(selectedAnnouncement.tag).label}
                </span>

                {selectedAnnouncement.isNew && (
                  <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                    NEW
                  </span>
                )}

                {selectedAnnouncement.date && (
                  <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#D4A017]" />
                    <span>{selectedAnnouncement.date}</span>
                  </span>
                )}
              </div>

              <h3 className="font-display font-black text-base sm:text-lg text-[#2D2424] dark:text-white leading-tight">
                {lang === 'hi' ? selectedAnnouncement.titleHi : selectedAnnouncement.titleEn}
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="text-xs text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                {lang === 'hi' 
                  ? (selectedAnnouncement.descriptionHi || selectedAnnouncement.titleHi)
                  : (selectedAnnouncement.descriptionEn || selectedAnnouncement.titleEn)
                }
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span>स्रोत: म.प्र. परीक्षा संकुल</span>
                <span>ID: {selectedAnnouncement.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: selectedAnnouncement.titleHi,
                      text: `${selectedAnnouncement.titleHi}\n\nMP परीक्षा सेतु पर देखें:`,
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(`${selectedAnnouncement.titleHi} - MP परीक्षा सेतु 2026`);
                    alert(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!');
                  }
                }}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition font-bold flex items-center justify-center cursor-pointer"
                title="शेयर करें"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200 transition cursor-pointer"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const ann = selectedAnnouncement;
                  setSelectedAnnouncement(null);
                  handleActionClick(ann);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black text-xs border border-[#D4A017] shadow-md hover:scale-[1.02] transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>{lang === 'hi' ? (selectedAnnouncement.linkTextHi || 'अभी देखें') : (selectedAnnouncement.linkTextEn || 'Open')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL ARCHIVE MODAL (VIEW ALL NOTIFICATIONS) */}
      {/* ========================================================================= */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl max-h-[85vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#7A2A1E] text-[#D4A017] flex items-center justify-center font-black">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[#2D2424] dark:text-white">
                    {lang === 'hi' ? 'समस्त अधिसूचनाएँ व परीक्षा बुलेटिन' : 'All Exam Bulletins & Notices'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'hi' ? 'म.प्र. की सभी प्रतियोगी परीक्षाओं के आधिकारिक अपडेट्स' : 'Complete repository of Madhya Pradesh state exam notices'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'सूचना या भर्ती खोजें (उदा: पटवारी, पुलिस, ESB)...' : 'Search notices (e.g. Patwari, Police)...'}
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-white focus:outline-none focus:border-[#D4A017]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {activeAnnouncements
                .filter(a => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return a.titleHi.toLowerCase().includes(q) || a.titleEn.toLowerCase().includes(q) || (a.descriptionHi && a.descriptionHi.toLowerCase().includes(q));
                })
                .map(ann => {
                  const tagInfo = getTagBadge(ann.tag);

                  return (
                    <div
                      key={ann.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:border-[#D4A017] transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${tagInfo.badgeBg} ${tagInfo.textColor}`}>
                          {tagInfo.label}
                        </span>
                        {ann.date && (
                          <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4A017]" />
                            <span>{ann.date}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-[#2D2424] dark:text-white">
                        {lang === 'hi' ? ann.titleHi : ann.titleEn}
                      </h4>

                      {(ann.descriptionHi || ann.descriptionEn) && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                          {lang === 'hi' ? ann.descriptionHi : ann.descriptionEn}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-end">
                        <button
                          onClick={() => {
                            setShowAllModal(false);
                            handleActionClick(ann);
                          }}
                          className="inline-flex items-center gap-1 bg-[#7A2A1E] text-[#D4A017] text-[11px] font-black px-3 py-1 rounded-xl border border-[#D4A017] shadow-xs hover:scale-105 transition cursor-pointer"
                        >
                          <span>{lang === 'hi' ? (ann.linkTextHi || 'विवरण') : (ann.linkTextEn || 'Open')}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 text-xs">
              <span className="text-stone-500 text-[11px]">
                {lang === 'hi' ? `कुल ${activeAnnouncements.length} सूचनाएं` : `${activeAnnouncements.length} notices`}
              </span>
              <button
                onClick={() => setShowAllModal(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 transition cursor-pointer"
              >
                {lang === 'hi' ? 'वापस' : 'Back'}
              </button>
            </div>

          </div>
        </div>
      )}

    </aside>
  );
};
