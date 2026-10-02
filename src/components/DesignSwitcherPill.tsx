import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Landmark, Sparkles } from 'lucide-react';

interface DesignSwitcherPillProps {
  className?: string;
  compact?: boolean;
}

export const DesignSwitcherPill: React.FC<DesignSwitcherPillProps> = ({ className = '', compact = false }) => {
  const { portalDesignStyle, setPortalDesignStyle, lang, currentUser } = useApp();

  // Strict Security: Only admin can view or interact with the design switcher
  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div 
      className={`inline-flex items-center p-1 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 border border-amber-500/40 shadow-xl backdrop-blur-md transition-all ${className}`}
      title="पोर्टल डिज़ाइन / स्टाइल बदलें (Design 1: Govt Heritage ↔ Design 2: Mobile Tech Animations)"
    >
      {/* Design 1 Button */}
      <button
        type="button"
        onClick={() => setPortalDesignStyle('design1')}
        className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
          portalDesignStyle === 'design1'
            ? 'bg-gradient-to-r from-[#7A2A1E] to-[#9E3628] text-[#D4A017] shadow-md border border-[#D4A017]/40 scale-102'
            : 'text-stone-300 hover:text-white hover:bg-white/5'
        }`}
      >
        <Landmark className={`w-3.5 h-3.5 ${portalDesignStyle === 'design1' ? 'text-[#D4A017]' : 'text-stone-400'}`} />
        <span className="whitespace-nowrap font-bold">
          {compact ? 'Design 1' : (lang === 'hi' ? '🏛️ Design 1 (क्लासिक)' : '🏛️ Design 1 (Classic)')}
        </span>
      </button>

      {/* Design 2 Button */}
      <button
        type="button"
        onClick={() => setPortalDesignStyle('design2')}
        className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
          portalDesignStyle === 'design2'
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/40 scale-102'
            : 'text-stone-300 hover:text-white hover:bg-white/5'
        }`}
      >
        <Smartphone className={`w-3.5 h-3.5 ${portalDesignStyle === 'design2' ? 'text-cyan-300 animate-pulse' : 'text-stone-400'}`} />
        <span className="whitespace-nowrap font-bold flex items-center gap-1">
          {compact ? 'Design 2' : (lang === 'hi' ? '⚡ Design 2 (मोबाइल टेक)' : '⚡ Design 2 (Mobile Tech)')}
          {portalDesignStyle === 'design2' && (
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          )}
        </span>
      </button>
    </div>
  );
};
