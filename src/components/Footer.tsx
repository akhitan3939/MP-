import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Lock, 
  Heart,
  Facebook,
  Instagram,
  Youtube,
  Send,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Sparkles,
  Activity
} from 'lucide-react';
import { DynamicNavIcon } from '../utils/navIcons';

export const Footer: React.FC = () => {
  const { lang, navigate, footerNavItems, handleNavAction, platformSettings, openAuthModal } = useApp();

  const wc = platformSettings?.websiteContent;
  const configuredChannels = platformSettings?.socialChannels || [];

  const fbUrl = platformSettings?.facebookUrl || 'https://facebook.com/groups/mpparikshasetu';
  const instaUrl = platformSettings?.instagramUrl || 'https://instagram.com/mpparikshasetu_official';
  const tgUrl = platformSettings?.telegramUrl || 'https://t.me/mpparikshasetu_mp';
  const ytUrl = platformSettings?.youtubeUrl || 'https://youtube.com/@mpparikshasetu';
  const waUrl = platformSettings?.whatsappCommunityUrl || 'https://chat.whatsapp.com/mpparikshasetu';

  const addressText = lang === 'hi'
    ? (wc?.footerAddressHi && !wc.footerAddressHi.includes('परीक्षा सेतु') && !wc.footerAddressHi.includes('एमपी नगर') ? wc.footerAddressHi : 'भोपाल')
    : (wc?.footerAddressEn && !wc.footerAddressEn.includes('Pariksha Setu') && !wc.footerAddressEn.includes('MP Nagar') ? wc.footerAddressEn : 'Bhopal');

  const aboutText = lang === 'hi'
    ? (wc?.footerAboutHi || platformSettings?.siteTagline || 'मध्यप्रदेश की समस्त राज्य स्तरीय भर्ती परीक्षाओं (MPPSC, पटवारी, पुलिस SI/आरक्षक, व्यापम ESB, वनरक्षक, TET) के लिए समर्पित डिजिटल मॉक टेस्ट एवं AI मूल्यांकन मंच।')
    : (wc?.footerAboutEn || 'India\'s most authentic bilingual CBT Mock Test Portal for MPESB, MPPSC, and MP Police examinations.');

  const copyrightText = wc?.footerCopyrightText || '© 2026 MP परीक्षा सेतु (MP Pariksha Setu) • मध्यप्रदेश शासन भर्ती परीक्षा तैयारी मंच। सर्वाधिकार सुरक्षित।';

  // Hit Counter & Last Updated calculations (starts at 50 minimum)
  const rawHits = typeof platformSettings?.visitorHitsCount === 'number' && platformSettings.visitorHitsCount >= 50
    ? platformSettings.visitorHitsCount
    : (typeof wc?.visitorHitsCount === 'number' && wc.visitorHitsCount >= 50 ? wc.visitorHitsCount : 50);

  const formattedHitDigits = String(rawHits).padStart(6, '0').split('');

  const lastUpdatedDateText = lang === 'hi'
    ? (platformSettings?.lastUpdatedDateHi || wc?.lastUpdatedDateHi || '01 सितम्बर 2026')
    : (platformSettings?.lastUpdatedDateEn || wc?.lastUpdatedDateEn || '01 September 2026');

  const showHitCounter = platformSettings?.showHitCounter !== false && wc?.showHitCounter !== false;
  const showLastUpdated = platformSettings?.showLastUpdated !== false && wc?.showLastUpdated !== false;

  return (
    <footer className="bg-[#5E1F16] text-[#FFFBF2] border-t-4 border-[#D4A017] text-xs mt-auto">
      {/* Cultural Border Ribbon */}
      <div className="h-1 bg-[#D4A017]"></div>

      {/* Official Hit Counter & Last Updated Metadata Ribbon */}
      {(showHitCounter || showLastUpdated) && (
        <div className="bg-[#48160E] border-b border-[#963E2F]/80 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            
            {/* Hit Counter Block */}
            {showHitCounter && (
              <div className="flex items-center gap-3 bg-[#330F0A] border border-[#D4A017]/40 px-3.5 py-1.5 rounded-2xl shadow-inner">
                <div className="flex items-center gap-1.5 text-[#D4A017] font-black text-[11px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm"></span>
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कुल विज़िटर्स (वेबसाइट हिट्स)' : 'Total Visitors (Hits)'}:</span>
                </div>
                
                {/* Digit Reels */}
                <div className="flex items-center gap-1">
                  {formattedHitDigits.map((digit, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center justify-center w-5 sm:w-6 h-6 sm:h-7 bg-gradient-to-b from-[#220906] to-[#120403] text-[#D4A017] font-mono font-black text-xs sm:text-sm rounded border border-[#D4A017]/60 shadow-sm"
                    >
                      {digit}
                    </span>
                  ))}
                </div>

                <span className="text-[10px] text-[#EAD8B1] font-mono font-bold hidden sm:inline">
                  (50+ Verified)
                </span>
              </div>
            )}

            {/* Middle Trust Badge */}
            <div className="hidden lg:flex items-center gap-2 text-[#EAD8B1] text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
              <span>SSL 256-Bit Encrypted • NIC CBT 2026 Standards</span>
            </div>

            {/* Last Updated Date Block */}
            {showLastUpdated && (
              <div className="flex items-center gap-2 bg-[#330F0A] border border-[#D4A017]/40 px-3.5 py-1.5 rounded-2xl text-[11px] font-bold text-[#FFFBF2] shadow-inner">
                <Calendar className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                <span className="text-[#EAD8B1]">{lang === 'hi' ? 'पोर्टल अंतिम अद्यतन:' : 'Last Updated:'}</span>
                <span className="text-[#D4A017] font-black tracking-wide font-mono">{lastUpdatedDateText}</span>
              </div>
            )}

          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Cultural Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {platformSettings?.logoUrl ? (
                <img 
                  src={platformSettings.logoUrl} 
                  alt={platformSettings.siteTitle || 'MP परीक्षा सेतु'} 
                  className="w-10 h-10 rounded-full object-cover bg-white shadow-md border border-[#D4A017]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.svg';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#D4A017] p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full rounded-full bg-[#7A2A1E] flex items-center justify-center font-black text-[#D4A017] text-sm">
                    MP
                  </div>
                </div>
              )}
              <span className="font-display font-black text-xl text-white tracking-tight">
                {platformSettings?.siteTitle || 'MP परीक्षा सेतु'}
              </span>
            </div>
            <p className="text-[#EAD8B1] text-xs leading-relaxed font-medium">
              {aboutText}
            </p>
            <div className="flex items-center gap-2 text-[#D4A017] text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Govt Exam Syllabus 2026</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#D4A017]">
              {lang === 'hi' ? 'प्रमुख टेस्ट सीरीज़' : 'Target Test Series'}
            </h4>
            <ul className="space-y-1.5 text-white/80 font-bold text-xs">
              <li>
                <button onClick={() => navigate('catalog', { category: 'patwari' })} className="hover:text-[#D4A017] transition">
                  • MP पटवारी चयन परीक्षा 2026
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { category: 'mppsc' })} className="hover:text-[#D4A017] transition">
                  • MPPSC प्रारंभिक परीक्षा (GS+CSAT)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { category: 'police' })} className="hover:text-[#D4A017] transition">
                  • MP पुलिस आरक्षक & SI भर्ती टेस्ट
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { category: 'vyapam' })} className="hover:text-[#D4A017] transition">
                  • MP व्यापम समूह-4 / AG-3 टेस्ट
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { category: 'vanrakshak' })} className="hover:text-[#D4A017] transition">
                  • MP वनरक्षक एवं क्षेत्ररक्षक
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Tools & Dynamic Footer Menus */}
          <div className="space-y-2.5">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#D4A017]">
              {lang === 'hi' ? 'महत्वपूर्ण लिंक्स व मेन्यू' : 'Important Links & Menu'}
            </h4>
            <ul className="space-y-1.5 text-white/80 font-bold text-xs">
              {footerNavItems.map((item) => {
                const label = lang === 'hi' ? item.labelHi : item.labelEn;
                const badge = lang === 'hi' ? item.badgeTextHi : item.badgeTextEn;
                return (
                  <li key={item.id}>
                    <button 
                      onClick={() => handleNavAction(item)} 
                      className="hover:text-[#D4A017] transition flex items-center gap-1.5 text-left cursor-pointer group"
                    >
                      <DynamicNavIcon name={item.iconName} className="w-3.5 h-3.5 text-[#D4A017] shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-0.5 transition-transform">{label}</span>
                      {badge && (
                        <span className="px-1.5 py-0.5 bg-[#D4A017] text-[#2D2424] text-[8px] font-black rounded ml-1 uppercase">
                          {badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#D4A017]">
              {lang === 'hi' ? 'सपोर्ट व संपर्क' : 'Support & Contact'}
            </h4>
            <div className="space-y-2 text-[#EAD8B1] font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                <a 
                  href={`mailto:${platformSettings?.supportEmail || 'mpparikshasetu.support@gmail.com'}`}
                  className="hover:underline hover:text-white transition font-mono text-[11px] sm:text-xs"
                >
                  {platformSettings?.supportEmail || 'mpparikshasetu.support@gmail.com'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                <span>{addressText}</span>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2 border-t border-[#963E2F] space-y-2">
              <div className="text-[10px] text-[#D4A017] uppercase font-black tracking-wider">
                {lang === 'hi' ? 'सोशल मीडिया से जुड़ें' : 'Follow Us on Social Media'}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white transition hover:scale-110 shadow-xs"
                  title="Facebook Page & Group"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white transition hover:scale-110 shadow-xs"
                  title="Instagram Reels & Tips"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={tgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#229ED9] hover:bg-[#1f8fc4] text-white transition hover:scale-110 shadow-xs"
                  title="Telegram Channel (PDF & Quiz)"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href={ytUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#FF0000] hover:bg-[#e60000] text-white transition hover:scale-110 shadow-xs"
                  title="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white transition hover:scale-110 shadow-xs"
                  title="WhatsApp Alerts Community"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Payment Badges */}
            <div className="pt-2 border-t border-[#963E2F]">
              <div className="text-[10px] text-[#EAD8B1] uppercase font-black tracking-wider mb-1">सुरक्षित पेमेंट गेटवे पार्टनर</div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 bg-[#7A2A1E] rounded border border-[#D4A017]/40 text-white font-bold">Razorpay</span>
                <span className="px-2 py-0.5 bg-[#7A2A1E] rounded border border-[#D4A017]/40 text-[#D4A017] font-bold">UPI / QR</span>
                <span className="px-2 py-0.5 bg-[#7A2A1E] rounded border border-[#D4A017]/40 text-emerald-300 font-bold">SSL 256-bit</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Admin Login Link */}
        <div className="mt-10 pt-6 border-t border-[#963E2F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#EAD8B1] text-[11px] font-bold">
          <div>
            {copyrightText}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#D4A017] font-black uppercase tracking-wider">जय मध्यप्रदेश • जय हिन्द 🇮🇳</span>
            
            {/* Dedicated Admin Portal Access Link at bottom */}
            <span className="text-[#963E2F]">|</span>
            <button
              onClick={() => openAuthModal('admin')}
              className="px-3 py-1.5 rounded-lg bg-[#5E1F16] hover:bg-[#963E2F] text-[#D4A017] border border-[#D4A017]/40 flex items-center gap-1.5 transition cursor-pointer text-xs font-mono font-bold shadow-sm"
              title="Secure Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>{lang === 'hi' ? '🔒 एडमिन पोर्टल लॉगिन (Admin Only)' : '🔒 Staff / Admin Portal Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
