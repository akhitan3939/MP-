import React from 'react';
import { useApp } from '../context/AppContext';
import { DynamicNavIcon } from '../utils/navIcons';

export const BottomNavBar: React.FC = () => {
  const { bottomNavItems, activeView, handleNavAction, lang } = useApp();

  if (!bottomNavItems || bottomNavItems.length === 0) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#7A2A1E]/95 backdrop-blur-md border-t-2 border-[#D4A017] shadow-2xl px-2 py-1.5 transition-all">
      <nav className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        {bottomNavItems.map((item) => {
          const isActive = 
            (item.targetType === 'view' && activeView === item.targetValue) ||
            (item.targetType === 'category' && activeView === 'catalog');
          
          const label = lang === 'hi' ? item.labelHi : item.labelEn;
          const badgeText = lang === 'hi' ? item.badgeTextHi : item.badgeTextEn;

          return (
            <button
              key={item.id}
              onClick={() => handleNavAction(item)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#5E1F16] text-[#D4A017] shadow-inner border border-[#D4A017]/40'
                  : item.highlight
                  ? 'text-[#D4A017] hover:bg-[#5E1F16]/50'
                  : 'text-[#EAD8B1] hover:text-white hover:bg-[#5E1F16]/40'
              }`}
              title={label}
            >
              {/* Badge if present */}
              {badgeText && (
                <span className="absolute -top-1.5 px-1 py-0.2 bg-[#D4A017] text-[#2D2424] text-[8px] font-black rounded-full shadow-xs uppercase tracking-tighter">
                  {badgeText}
                </span>
              )}

              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                <DynamicNavIcon 
                  name={item.iconName} 
                  className={`w-4 h-4 ${isActive ? 'text-[#D4A017]' : item.highlight ? 'text-[#D4A017]' : 'text-white/80'}`} 
                />
              </div>

              <span className={`text-[10px] tracking-tight truncate max-w-[68px] leading-tight mt-0.5 ${
                isActive ? 'font-black text-[#D4A017]' : 'font-bold'
              }`}>
                {label}
              </span>

              {/* Active Indicator dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D4A017] mt-0.5 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
