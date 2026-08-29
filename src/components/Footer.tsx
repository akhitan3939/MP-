import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Mail, MapPin, Award, CheckCircle2, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, navigate, openNotesModal, openAuthModal } = useApp();

  return (
    <footer className="bg-[#5E1F16] text-[#FFFBF2] border-t-4 border-[#D4A017] text-xs mt-auto">
      {/* Cultural Border Ribbon */}
      <div className="h-1 bg-[#D4A017]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Cultural Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#D4A017] p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full rounded-full bg-[#7A2A1E] flex items-center justify-center font-black text-[#D4A017] text-sm">
                  MP
                </div>
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                MP परीक्षा <span className="text-[#D4A017]">सेतु</span>
              </span>
            </div>
            <p className="text-[#EAD8B1] text-xs leading-relaxed font-medium">
              मध्यप्रदेश की समस्त राज्य स्तरीय भर्ती परीक्षाओं (MPPSC, पटवारी, पुलिस SI/आरक्षक, व्यापम ESB, वनरक्षक, TET) के लिए समर्पित डिजिटल मॉक टेस्ट एवं AI मूल्यांकन मंच।
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

          {/* Col 3: Student Tools */}
          <div className="space-y-2.5">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#D4A017]">
              {lang === 'hi' ? 'छात्र सुविधाएँ' : 'Student Resources'}
            </h4>
            <ul className="space-y-1.5 text-white/80 font-bold text-xs">
              <li>
                <button onClick={() => navigate('freeMockTest')} className="hover:text-[#D4A017] transition text-[#D4A017] font-black flex items-center gap-1">
                  <span>🎯 ऑल-म.प्र. फ्री मॉक टेस्ट (40 Qs)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('leaderboard')} className="hover:text-[#D4A017] transition">
                  🏆 ऑल-मध्यप्रदेश लाइव लीडरबोर्ड
                </button>
              </li>
              <li>
                <button onClick={() => openNotesModal()} className="hover:text-[#D4A017] transition">
                  📥 हस्तलिखित म.प्र. GK ई-नोट्स (PDF)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-[#D4A017] transition">
                  📊 विस्तृत स्कोरकार्ड व AI विश्लेषण
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog')} className="hover:text-[#D4A017] transition">
                  🎯 निःशुल्क डेमो टेस्ट पूर्वावलोकन
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#D4A017]">
              {lang === 'hi' ? 'हेल्पलाइन व संपर्क' : 'Support & Helpline'}
            </h4>
            <div className="space-y-1.5 text-[#EAD8B1] font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>+91 97521 09876 (10 AM - 7 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>support@mpparikshasetu.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>MP नगर, जोन-II, भोपाल (म.प्र.) 462011</span>
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
            © 2026 MP परीक्षा सेतु (MP Pariksha Setu) • मध्यप्रदेश शासन भर्ती परीक्षा तैयारी मंच। सर्वाधिकार सुरक्षित।
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
