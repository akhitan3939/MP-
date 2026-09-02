import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Lock, 
  BookOpen, 
  Calendar,
  Share2
} from 'lucide-react';
import { UserProfile } from '../types';
import { toPng } from 'html-to-image';

interface RegistrationSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onProceedToDashboard?: () => void;
}

export const RegistrationSlipModal: React.FC<RegistrationSlipModalProps> = ({
  isOpen,
  onClose,
  user,
  onProceedToDashboard
}) => {
  const slipRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const regNumber = `MPPS-2026-${(user.id || '').replace(/\D/g, '').slice(-5) || '94821'}`;
  const formattedDate = user.joinedAt 
    ? new Date(user.joinedAt).toLocaleString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : new Date().toLocaleDateString('hi-IN');

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Download as High-Resolution PNG
  const handleDownloadImage = async () => {
    if (!slipRef.current) return;
    try {
      setIsDownloadingImage(true);
      const dataUrl = await toPng(slipRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
      });

      const link = document.createElement('a');
      const safeName = (user.name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `MP_Pariksha_Setu_RegSlip_${safeName}_${regNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating registration slip image:', err);
      // If canvas image generation encounters browser limitations, fallback to print
      window.print();
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Top Bar with Actions */}
        <div className="bg-gradient-to-r from-[#7A2A1E] via-[#5E1F16] to-[#7A2A1E] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#D4A017]/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-[#2D2424] flex items-center justify-center font-black text-base shadow">
              ✓
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white">
                पंजीकरण विवरण स्लिप (Registration Slip)
              </h3>
              <p className="text-xs text-[#D4A017] font-medium">
                सफलतापूर्वक पंजीकृत • विवरण सुरक्षित सहेजें या डाउनलोड करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Printable Slip Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-50/50 dark:bg-stone-950/40">
          
          {/* THE OFFICIAL REGISTRATION SLIP CARD (Target for HTML2Canvas & Print) */}
          <div 
            ref={slipRef}
            id="printable-registration-slip"
            className="bg-white text-stone-900 border-4 border-[#D4A017] rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden space-y-4"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Watermark Background Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
              <div className="w-72 h-72 rounded-full border-8 border-[#7A2A1E] flex items-center justify-center text-center font-black text-6xl text-[#7A2A1E] rotate-[-20deg]">
                MP SETU<br />2026
              </div>
            </div>

            {/* Slip Header */}
            <div className="border-b-2 border-dashed border-[#D4A017]/60 pb-4 text-center relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A2A1E] text-[#D4A017] text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>मध्यप्रदेश शासन प्रतियोगी परीक्षा सेतु • 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#7A2A1E] tracking-tight">
                छात्र पंजीकरण एवं प्रवेश रसीद
              </h2>
              <p className="text-xs text-stone-500 font-bold mt-0.5">
                Official Student Registration & Access Confirmation Slip
              </p>
              
              {/* Registration Number & Date */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs bg-[#FDFBF7] p-2.5 rounded-xl border border-[#EAD8B1]">
                <div>
                  <span className="text-stone-500 font-bold">पंजीकरण संख्या (Reg No): </span>
                  <span className="font-mono font-black text-[#7A2A1E] text-sm">{regNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold">दिनांक व समय: </span>
                  <span className="font-mono font-bold text-stone-800">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="space-y-3 text-xs">
              
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px] font-bold mb-0.5">परीक्षार्थी का पूरा नाम (Full Name):</span>
                  <div className="font-black text-sm text-[#7A2A1E] flex items-center justify-between">
                    <span>{user.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">सत्यापित</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px] font-bold mb-0.5">लॉगिन यूज़रनेम (Username):</span>
                  <div className="font-mono font-black text-sm text-stone-900 flex items-center justify-between">
                    <span>@{user.username || user.email.split('@')[0]}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.username || user.email.split('@')[0], 'username')}
                      className="text-stone-400 hover:text-[#7A2A1E] p-1 rounded transition cursor-pointer"
                      title="यूज़रनेम कॉपी करें"
                    >
                      {copiedField === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px] font-bold mb-0.5">पंजीकृत मोबाइल नंबर (Mobile No):</span>
                  <div className="font-mono font-black text-sm text-stone-900 flex items-center justify-between">
                    <span>+91 {user.phone}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> OTP OK
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px] font-bold mb-0.5">ईमेल पता (Email Address):</span>
                  <div className="font-mono font-bold text-xs text-stone-800 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="p-3 bg-amber-50/70 border border-[#D4A017]/60 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-stone-600 text-[11px] font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#7A2A1E]" />
                    <span>लॉगिन पासवर्ड (Account Password):</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-stone-500 hover:text-[#7A2A1E] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'छुपाएँ' : 'दिखाएँ'}</span>
                    </button>
                    {user.password && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(user.password || '', 'password')}
                        className="text-stone-500 hover:text-[#7A2A1E] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>कॉपी</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="font-mono font-black text-sm text-[#7A2A1E]">
                  {showPassword ? (user.password || '••••••••') : '••••••••'}
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  ⚠️ कृपया अपने पासवर्ड को सुरक्षित रखें और किसी अन्य के साथ साझा न करें।
                </p>
              </div>

              {/* State & District and Target Exams */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px] font-bold mb-0.5">राज्य व गृह जिला (State & District):</span>
                  <div className="font-bold text-xs text-stone-900">
                    {user.district}{user.state ? ` (${user.state})` : ''}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px] font-bold mb-0.5">लक्ष्य परीक्षा (Target Exam):</span>
                  <div className="font-bold text-xs text-[#7A2A1E] truncate">
                    {user.targetExam || 'समूह-02 पटवारी एवं MP प्रतियोगी परीक्षाएँ'}
                  </div>
                </div>
              </div>

              {/* Welcome Free Mock Pass Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-emerald-950">मुफ़्त मॉक टेस्ट पास (Free Mock Pass)</div>
                    <div className="text-[10px] text-emerald-700">ऑल-एमपी लाइव रैंकिंग और विस्तृत AI व्याख्या सक्रिय</div>
                  </div>
                </div>
                <div className="font-bold text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                  UNLOCKED
                </div>
              </div>
            </div>

            {/* Slip Footer & Seal */}
            <div className="pt-3 border-t-2 border-dashed border-[#D4A017]/60 flex items-center justify-between text-[10px] text-stone-500">
              <div>
                <div className="font-bold text-stone-700">MP Pariksha Setu E-Verification</div>
                <div>पोर्टल: mppariksha.in • हेल्पलाइन: support@mppariksha.in</div>
              </div>
              <div className="text-right">
                <div className="font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SEAL OF AUTHENTICITY</span>
                </div>
                <div className="font-mono text-stone-400">STATUS: ACTIVE & VALID</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Download Image Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isDownloadingImage}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingImage ? 'इमेज तैयार हो रही है...' : '🖼️ डाउनलोड इमेज (PNG)'}</span>
            </button>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] border-2 border-[#D4A017] text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>📄 प्रिंट / सेव PDF</span>
            </button>
          </div>

          {/* Continue / Dashboard Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onProceedToDashboard) onProceedToDashboard();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#c49214] text-stone-950 text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>डैशबोर्ड पर जाएँ (Continue) →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
