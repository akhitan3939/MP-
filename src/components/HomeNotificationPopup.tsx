import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Bell, 
  ExternalLink,
  Award
} from 'lucide-react';
import { PopupNotificationConfig } from '../types';

interface HomeNotificationPopupProps {
  popupConfig?: PopupNotificationConfig;
  lang: 'hi' | 'en';
  navigate: (view: string, params?: any) => void;
}

export const HomeNotificationPopup: React.FC<HomeNotificationPopupProps> = ({
  popupConfig,
  lang,
  navigate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!popupConfig || popupConfig.isActive === false) {
      setIsOpen(false);
      return;
    }

    // Check if session storage already dismissed it (if showOnlyOncePerSession is true)
    if (popupConfig.showOnlyOncePerSession) {
      const isDismissed = sessionStorage.getItem('mp_home_popup_dismissed');
      if (isDismissed) {
        setIsOpen(false);
        return;
      }
    }

    // Slight delay so the user lands on the page before the popup smoothly fades in
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    // Auto-close timer if specified
    let autoCloseTimer: any = null;
    if (popupConfig.autoCloseSeconds && popupConfig.autoCloseSeconds > 0) {
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, (popupConfig.autoCloseSeconds + 0.6) * 1000);
    }

    return () => {
      clearTimeout(timer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [popupConfig]);

  const handleClose = () => {
    setIsOpen(false);
    if (popupConfig?.showOnlyOncePerSession) {
      sessionStorage.setItem('mp_home_popup_dismissed', 'true');
    }
  };

  const handleActionClick = (link?: string) => {
    handleClose();
    if (!link) return;

    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.startsWith('/test/')) {
      const seriesId = link.replace('/test/', '');
      navigate('TEST_INSTRUCTIONS', { seriesId });
    } else if (link === '/catalog' || link === 'catalog') {
      const element = document.querySelector('#catalog');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('HOME');
      }
    } else {
      navigate(link);
    }
  };

  if (!isOpen || !popupConfig || popupConfig.isActive === false) {
    return null;
  }

  const title = (lang === 'hi' ? popupConfig.titleHi : popupConfig.titleEn) || popupConfig.titleHi;
  const message = (lang === 'hi' ? popupConfig.messageHi : popupConfig.messageEn) || popupConfig.messageHi;
  const buttonText = (lang === 'hi' ? popupConfig.buttonTextHi : popupConfig.buttonTextEn) || popupConfig.buttonTextHi || 'अभी देखें (View Now)';
  const secondaryBtnText = popupConfig.secondaryButtonTextHi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Decorative Header Accent */}
        <div className="bg-gradient-to-r from-[#7A2A1E] via-[#943628] to-[#7A2A1E] px-5 py-4 text-white relative">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close popup"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 pr-8">
            <span className="p-1.5 rounded-xl bg-[#D4A017] text-black shadow-xs">
              <Bell className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {popupConfig.badgeText && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
                  <span>{popupConfig.badgeText}</span>
                </span>
              )}
              <span className="text-xs font-mono font-bold text-[#EAD8B1]">
                मध्य प्रदेश परीक्षा सेतु अपडेट
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-black text-lg sm:text-xl text-white mt-2 leading-snug">
            {title}
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Optional Image */}
          {popupConfig.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 max-h-48 bg-stone-100 dark:bg-stone-800">
              <img 
                src={popupConfig.imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Message */}
          <div className="text-stone-700 dark:text-stone-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
            {message}
          </div>

          {/* Highlight Badge/Box (Optional) */}
          {popupConfig.highlightText && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                {popupConfig.highlightText}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            {popupConfig.buttonLink && (
              <button
                type="button"
                onClick={() => handleActionClick(popupConfig.buttonLink)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] font-black text-xs sm:text-sm border border-[#D4A017] shadow-md hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {secondaryBtnText && popupConfig.secondaryButtonLink && (
              <button
                type="button"
                onClick={() => handleActionClick(popupConfig.secondaryButtonLink)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition cursor-pointer"
              >
                {secondaryBtnText}
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto py-2.5 px-3 rounded-xl text-stone-500 hover:text-stone-700 dark:text-stone-400 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              बंद करें (Dismiss)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
