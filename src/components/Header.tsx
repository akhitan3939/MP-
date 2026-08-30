import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Sun, 
  Moon, 
  Languages, 
  User, 
  LogOut, 
  Menu, 
  X, 
  CloudCheck, 
  WifiOff, 
  Flame,
  Award,
  ChevronDown,
  Sparkles,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { DynamicNavIcon } from '../utils/navIcons';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    navigate, 
    topNavItems,
    handleNavAction,
    platformSettings,
    theme, 
    toggleTheme, 
    lang, 
    setLanguage, 
    openAuthModal, 
    logout, 
    isOnline,
    openRemindersModal
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#7A2A1E] text-white border-b-4 border-[#D4A017] shadow-xl w-full">
      {/* Tier 1: Brand Logo & User Utilities */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Left Brand Logo & Emblem */}
          <div 
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shadow-md border-2 border-[#D4A017] flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img 
                src={platformSettings?.logoUrl || '/logo.svg'} 
                alt={platformSettings?.siteTitle || 'MP परीक्षा सेतु Logo'} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/logo.svg') {
                    target.src = '/logo.svg';
                  }
                }}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg sm:text-xl md:text-2xl text-white tracking-tight leading-none group-hover:text-[#FFFBF2] transition">
                  {platformSettings?.siteTitle ? (
                    platformSettings.siteTitle
                  ) : (
                    <>MP परीक्षा <span className="text-[#D4A017]">सेतु</span></>
                  )}
                </h1>
                <span className="bg-[#5E1F16] text-[#D4A017] text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider border border-[#D4A017]/40">
                  CBT 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#EAD8B1] hidden sm:block font-bold tracking-wide mt-0.5">
                {platformSettings?.siteTagline || 'मध्यप्रदेश प्रतियोगी परीक्षा टेस्ट सीरीज़ & AI मूल्यांकन'}
              </p>
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Cloud Sync Pill */}
            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 h-8 sm:h-9 bg-[#5E1F16] rounded-xl text-[11px] text-[#EAD8B1] border border-[#963E2F]"
              title={isOnline ? 'Cloud Synced' : 'Offline Mode Active'}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse"></span>
                  <span className="text-[#D4A017] font-mono text-[10px] font-bold uppercase tracking-wider">Cloud Sync</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-rose-300" />
                  <span className="text-rose-300 font-mono text-[10px] font-bold">Offline</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(lang === 'hi' ? 'en' : 'hi')}
              className="h-8 sm:h-9 flex items-center gap-1 px-2.5 sm:px-3 rounded-xl bg-[#5E1F16] hover:bg-[#963E2F] hover:border-[#D4A017]/70 text-[#D4A017] text-xs font-black uppercase tracking-wider border border-[#D4A017]/40 transition btn-press-effect cursor-pointer"
              title="Toggle Hindi/English Language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="h-8 sm:h-9 w-8 sm:w-9 flex items-center justify-center rounded-xl bg-[#5E1F16] hover:bg-[#963E2F] hover:border-[#D4A017]/70 text-[#EAD8B1] hover:text-[#D4A017] border border-[#963E2F] transition btn-press-effect cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D4A017]" /> : <Moon className="w-4 h-4 text-white" />}
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="h-9 flex items-center gap-2 px-3 rounded-xl bg-[#5E1F16] hover:bg-[#963E2F] hover:border-[#D4A017] border border-[#D4A017]/50 transition btn-press-effect cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#D4A017] text-[#7A2A1E] flex items-center justify-center font-black text-xs shadow shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-black text-white leading-tight flex items-center gap-1">
                      <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                      {currentUser.role === 'admin' && (
                        <span className="bg-[#D4A017] text-[#7A2A1E] text-[9px] px-1 rounded font-black">ADMIN</span>
                      )}
                    </div>
                    <div className="text-[9px] text-[#D4A017] font-bold font-mono">
                      {currentUser.xp} XP • {currentUser.streak}🔥
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#EAD8B1] hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-[#7A2A1E] border-2 border-[#D4A017] rounded-2xl shadow-2xl py-2 z-50 text-white divide-y divide-[#963E2F]"
                    onMouseLeave={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-bold text-[#EAD8B1] uppercase tracking-wider">{lang === 'hi' ? 'लॉगिन किया गया:' : 'Signed in as:'}</p>
                      <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-[#D4A017] font-bold">{currentUser.targetExam}</p>
                      <p className="text-[11px] text-white/70">{currentUser.district}</p>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' ? (
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate('admin');
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-black text-[#D4A017] hover:bg-[#963E2F] flex items-center gap-2 bg-[#5E1F16] cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4 text-[#D4A017]" />
                          <span>{lang === 'hi' ? '👑 सुपर एडमिन कंसोल' : 'Super Admin Console'}</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigate('dashboard');
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-[#963E2F] flex items-center gap-2 cursor-pointer"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-[#D4A017]" />
                            <span>{lang === 'hi' ? 'मेरा डैशबोर्ड व टेस्ट रिपोर्ट' : 'My Dashboard & Reports'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigate('notes');
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-[#963E2F] flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#D4A017]" />
                            <span>{lang === 'hi' ? 'ई-नोट्स (PDF लाइब्रेरी)' : 'E-Notes PDF Library'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              openRemindersModal();
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-[#963E2F] flex items-center gap-2 cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5 text-[#D4A017]" />
                            <span>{lang === 'hi' ? 'दैनिक अध्ययन रिमाइंडर' : 'Study Reminders'}</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-rose-300 hover:bg-[#963E2F] flex items-center gap-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'लॉगआउट करें (Sign Out)' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={() => openAuthModal('login')}
                  className="h-9 px-3 sm:px-4 rounded-xl bg-[#D4A017] hover:bg-[#e0b020] text-[#2D2424] text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  title="छात्र लॉगिन / साइन अप"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'hi' ? 'लॉगिन / साइन अप' : 'Login / Sign Up'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle (Below md) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-xl bg-[#5E1F16] hover:bg-[#963E2F] text-white border border-[#963E2F] btn-press-effect cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Dedicated Navigation Strip (Admin Dynamic Top Menus) */}
      <div className="w-full bg-[#5E1F16] border-t border-[#963E2F]/80 shadow-inner">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1.5 scroll-smooth justify-start md:justify-center">
            {topNavItems.map((item) => {
              const isActive = (item.targetType === 'view' && activeView === item.targetValue) ||
                (item.targetType === 'category' && activeView === 'catalog');
              const isHighlight = item.highlight;
              const label = lang === 'hi' ? item.labelHi : item.labelEn;
              const badge = lang === 'hi' ? item.badgeTextHi : item.badgeTextEn;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavAction(item)}
                  className={`h-9 flex items-center justify-center gap-1.5 px-3 sm:px-4 rounded-xl text-xs font-black tracking-wider transition-all active:scale-95 btn-press-effect cursor-pointer whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-[#963E2F] text-[#FFFBF2] border-2 border-[#D4A017] shadow-md'
                      : isHighlight
                      ? 'bg-[#7A2A1E] text-[#D4A017] hover:bg-[#963E2F] border border-[#D4A017]/70 shadow-xs'
                      : 'text-[#EAD8B1] hover:text-white hover:bg-[#963E2F]/70 border border-transparent'
                  }`}
                >
                  <DynamicNavIcon 
                    name={item.iconName} 
                    className={`w-3.5 h-3.5 shrink-0 ${isHighlight ? 'text-[#D4A017] animate-pulse' : 'text-[#D4A017]'}`} 
                  />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#D4A017] text-[#2D2424] text-[9px] font-black rounded uppercase tracking-tighter">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Console Tab - Shown ONLY when currentUser is admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className={`h-9 flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-black tracking-wider transition-all active:scale-95 btn-press-effect cursor-pointer whitespace-nowrap shrink-0 ${
                  activeView === 'admin'
                    ? 'bg-[#D4A017] text-[#2D2424] shadow-md border-2 border-white/50'
                    : 'bg-[#7A2A1E] text-[#D4A017] hover:bg-[#963E2F] border border-[#D4A017]/80'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'hi' ? '👑 एडमिन कंसोल' : 'Admin Console'}</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer for Handhelds */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#963E2F] py-3 space-y-1.5 bg-[#5E1F16] px-3 shadow-2xl animate-fadeIn">
          <div className="text-[10px] uppercase font-mono font-bold text-[#EAD8B1] px-2 mb-1 flex items-center justify-between">
            <span>{lang === 'hi' ? 'नेविगेशन मेन्यू (Top Menu)' : 'Navigation Menu'}</span>
            <span className="text-[9px] text-[#D4A017]">{topNavItems.length} लिंक</span>
          </div>
          {topNavItems.map((item) => {
            const isActive = (item.targetType === 'view' && activeView === item.targetValue);
            const isHighlight = item.highlight;
            const label = lang === 'hi' ? item.labelHi : item.labelEn;
            const badge = lang === 'hi' ? item.badgeTextHi : item.badgeTextEn;

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavAction(item);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition btn-press-effect ${
                  isActive
                    ? 'bg-[#D4A017] text-[#2D2424] font-black shadow-md'
                    : isHighlight
                    ? 'bg-[#7A2A1E] text-[#D4A017] border border-[#D4A017]/50 font-black'
                    : 'text-white hover:bg-[#963E2F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DynamicNavIcon 
                    name={item.iconName} 
                    className={`w-4 h-4 ${isActive ? 'text-[#2D2424]' : 'text-[#D4A017]'}`} 
                  />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="px-1.5 py-0.5 bg-[#D4A017] text-[#2D2424] text-[9px] font-black rounded">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                navigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black bg-[#D4A017] text-[#2D2424] uppercase tracking-wider mt-2 shadow-md btn-press-effect"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'hi' ? '👑 एडमिन कंसोल' : 'Admin Console'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

