import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  AtSign,
  Eye,
  EyeOff,
  Sparkles, 
  UserPlus, 
  LogIn, 
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  RotateCw,
  MessageSquare,
  Globe,
  MapPin,
  CheckSquare,
  Square
} from 'lucide-react';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/statesAndDistricts';
import { MP_DISTRICTS } from '../data/initialData';

export const TARGET_EXAMS_LIST = [
  { id: 'MP Patwari 2026', label: 'समूह-02 उपसमूह-04 (पटवारी एवं समकक्ष भर्ती 2026)', short: 'पटवारी 2026' },
  { id: 'MP ESB Group 2 SubGroup 1 RAEO', label: 'समूह-2 उपसमूह-1 (ग्रामीण कृषि विस्तार अधिकारी - RAEO & SADO 2026)', short: 'RAEO / SADO' },
  { id: 'MPPSC Prelims 2026', label: 'MPPSC राज्य सेवा प्रारंभिक परीक्षा 2026 (GS Paper 1 + CSAT Paper 2)', short: 'MPPSC 2026' },
  { id: 'MP Police Constable / SI', label: 'म.प्र. पुलिस आरक्षक (Constable) एवं उपनिरीक्षक (SI 2026)', short: 'Police Constable / SI' },
  { id: 'MP Vyapam Group 4', label: 'म.प्र. व्यापम समूह-4 (सहायक ग्रेड-3, स्टेनो, टाइपिस्ट व डाटा एंट्री)', short: 'ग्रुप-4 स्टेनो' },
  { id: 'MP Vanrakshak', label: 'म.प्र. वनरक्षक, क्षेत्ररक्षक एवं जेल प्रहरी भर्ती परीक्षा', short: 'वनरक्षक / जेल प्रहरी' },
  { id: 'MP TET Varg 2/3', label: 'म.प्र. प्राथमिक व माध्यमिक शिक्षक पात्रता परीक्षा (TET वर्ग 2/3)', short: 'MP TET' },
  { id: 'All India General Competition', label: 'ऑल इंडिया / अन्य राज्य प्रतियोगी परीक्षाएँ (SSC, Railway, Banking, State PSC)', short: 'ऑल इंडिया सामान्य' }
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register, resetPassword, users, lang } = useApp();
  
  // Split modes: 'login' | 'register' | 'admin' | 'forgot'
  const [mode, setMode] = useState<'login' | 'register' | 'admin' | 'forgot'>('login');
  
  // Student form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // All India State & District Selection
  const [selectedState, setSelectedState] = useState<string>('मध्यप्रदेश (Madhya Pradesh)');
  const [customState, setCustomState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('भोपाल (Bhopal)');
  const [customDistrict, setCustomDistrict] = useState<string>('');

  // Target Exams - Multi-select Checkboxes with "All" Option
  const [selectedTargetExams, setSelectedTargetExams] = useState<string[]>(
    TARGET_EXAMS_LIST.map(e => e.id)
  );
  const [errorMsg, setErrorMsg] = useState('');

  // Admin form fields (Empty by default for manual entry)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Forgot password form fields & state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [foundAccount, setFoundAccount] = useState<{ name: string; email: string; phone: string; username?: string } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync mode when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setErrorMsg('');
      setShowPassword(false);
      setAdminUsername('');
      setAdminPassword('');
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
      setForgotStep(1);
      setForgotOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }, [isAuthModalOpen, authModalMode]);

  // Timer for OTP resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        setErrorMsg(lang === 'hi' ? 'कृपया सभी अनिवार्य जानकारी (पूरा नाम, ईमेल, मोबाइल नंबर) भरें।' : 'Please fill all required fields (Name, Email, Phone).');
        return;
      }
      if (phone.trim().length < 10) {
        setErrorMsg(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        return;
      }
      if (password.trim().length < 4) {
        setErrorMsg(lang === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'Password must be at least 4 characters.');
        return;
      }

      const desiredUsername = username.trim() || email.trim().split('@')[0];

      const finalState = selectedState.includes('अन्य')
        ? (customState.trim() || 'अन्य राज्य (Other State)')
        : selectedState;

      const finalDistrict = (selectedDistrict.includes('अन्य') || selectedState.includes('अन्य'))
        ? (customDistrict.trim() || 'अन्य जिला (Other District)')
        : selectedDistrict;

      if (selectedTargetExams.length === 0) {
        setErrorMsg(lang === 'hi' ? 'कृपया कम से कम एक लक्ष्य परीक्षा चुनें (या "सभी चुनें" पर क्लिक करें)।' : 'Please select at least one target exam.');
        return;
      }

      const finalTargetExam = selectedTargetExams.length === TARGET_EXAMS_LIST.length
        ? 'सभी प्रतियोगी परीक्षाएँ (All Exams)'
        : selectedTargetExams.map(id => TARGET_EXAMS_LIST.find(e => e.id === id)?.short || id).join(', ');

      const success = register({
        name: name.trim(),
        username: desiredUsername,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password.trim(),
        state: finalState,
        district: finalDistrict,
        targetExam: finalTargetExam,
        role: 'student'
      });

      if (!success) {
        setErrorMsg(lang === 'hi' ? 'इस ईमेल या यूज़रनेम से पहले ही खाता बना है। कृपया सीधे लॉगिन करें।' : 'Account already exists. Please log in directly.');
      }
    } else {
      // Student Login
      if (!emailOrUsername.trim()) {
        setErrorMsg(lang === 'hi' ? 'कृपया अपना पंजीकृत यूज़रनेम या ईमेल दर्ज करें।' : 'Please enter your username or registered email.');
        return;
      }
      if (!password.trim()) {
        setErrorMsg(lang === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
        return;
      }

      const success = login(emailOrUsername.trim().toLowerCase(), password.trim(), 'student');
      if (!success) {
        setErrorMsg(
          lang === 'hi' 
            ? '❌ अमान्य यूज़रनेम/ईमेल या पासवर्ड। यदि पहली बार आए हैं तो नीचे "नया खाता बनाएँ (Sign Up)" पर क्लिक करें, अथवा पासवर्ड भूल जाने पर "पासवर्ड भूल गए?" लिंक का उपयोग करें।' 
            : '❌ Invalid username or password. Please check your credentials or use Forgot Password.'
        );
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया एडमिन आईडी एवं पासवर्ड दर्ज करें।' : 'Please enter Admin username and password.');
      return;
    }

    const success = login(adminUsername.trim(), adminPassword.trim(), 'admin');
    if (!success) {
      setErrorMsg(lang === 'hi' ? '❌ गलत एडमिन यूज़रनेम या पासवर्ड।' : '❌ Invalid admin credentials.');
    }
  };

  const handleOneClickDemoStudent = () => {
    setEmailOrUsername('aspirant');
    setPassword('student123');
    login('aspirant', 'student123', 'student');
  };

  // Forgot Password: Step 1 Submit (Find Account & Generate OTP)
  const handleForgotSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!forgotIdentifier.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना पंजीकृत ईमेल आईडी, मोबाइल नंबर या यूज़रनेम दर्ज करें।' : 'Please enter your registered email, mobile number, or username.');
      return;
    }

    const cleanId = forgotIdentifier.trim().toLowerCase();
    const matchedUser = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.phone && u.phone.trim() === forgotIdentifier.trim())
    );

    if (!matchedUser) {
      setErrorMsg(
        lang === 'hi' 
          ? '❌ इस विवरण से कोई पंजीकृत खाता नहीं मिला। कृपया मोबाइल नंबर/ईमेल जांचें अथवा नया खाता बनाएँ।' 
          : '❌ No account found with these details. Please verify or create a new account.'
      );
      return;
    }

    // Generate simulated 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setForgotOtp('');
    setFoundAccount({
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      username: matchedUser.username
    });
    setForgotStep(2);
    setResendCooldown(30);
    setErrorMsg('');
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setResendCooldown(30);
    setErrorMsg('');
  };

  // Forgot Password: Step 2 Submit (Verify OTP & Set New Password)
  const handleForgotResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!forgotOtp.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया 4-अंकों का वेरिफिकेशन OTP दर्ज करें।' : 'Please enter 4-digit verification OTP.');
      return;
    }

    // Accept generated OTP or standard helper 1234
    if (forgotOtp.trim() !== generatedOtp && forgotOtp.trim() !== '1234') {
      setErrorMsg(lang === 'hi' ? '❌ अमान्य OTP कोड। कृपया नीचे दर्शाया गया सही कोड दर्ज करें।' : '❌ Invalid OTP code. Please enter the correct code.');
      return;
    }

    if (!newPassword.trim() || newPassword.trim().length < 4) {
      setErrorMsg(lang === 'hi' ? 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'New password must be at least 4 characters.');
      return;
    }

    if (newPassword.trim() !== confirmNewPassword.trim()) {
      setErrorMsg(lang === 'hi' ? '❌ नया पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।' : '❌ New password and confirmation do not match.');
      return;
    }

    const res = resetPassword(forgotIdentifier.trim(), newPassword.trim());
    if (res.success) {
      setForgotStep(3);
      setErrorMsg('');
    } else {
      setErrorMsg(res.message);
    }
  };

  // Step 3 Complete & Login
  const handleCompleteResetAndLogin = () => {
    if (foundAccount) {
      const loginId = foundAccount.username || foundAccount.email;
      setEmailOrUsername(loginId);
      setPassword(newPassword);
      login(loginId, newPassword, 'student');
    } else {
      setMode('login');
      setForgotStep(1);
    }
  };

  // Mask sensitive info for privacy display
  const getMaskedPhone = (phoneStr?: string) => {
    if (!phoneStr || phoneStr.length < 6) return '******';
    return phoneStr.substring(0, 2) + '******' + phoneStr.substring(phoneStr.length - 2);
  };

  const getMaskedEmail = (emailStr?: string) => {
    if (!emailStr || !emailStr.includes('@')) return '******';
    const parts = emailStr.split('@');
    const namePart = parts[0];
    const maskedName = namePart.length > 2 ? namePart.substring(0, 2) + '***' : namePart + '***';
    return `${maskedName}@${parts[1]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border-2 border-[#D4A017] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className={`text-white p-5 border-b relative ${
          mode === 'admin' 
            ? 'bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-emerald-600' 
            : mode === 'forgot'
            ? 'bg-gradient-to-r from-[#5E1F16] via-[#7A2A1E] to-[#5E1F16] border-[#D4A017]/70'
            : 'bg-gradient-to-r from-[#7A2A1E] via-[#5E1F16] to-[#7A2A1E] border-[#963E2F]'
        }`}>
          <button 
            onClick={closeAuthModal} 
            className="absolute top-4 right-4 text-stone-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow ${
              mode === 'admin' ? 'bg-emerald-500 text-stone-950' : 'bg-[#D4A017] text-[#2D2424]'
            }`}>
              {mode === 'admin' ? '👑' : mode === 'forgot' ? '🔑' : 'म.प्र.'}
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                {mode === 'register' ? (lang === 'hi' ? '📝 नया परीक्षार्थी खाता (Sign Up)' : 'Aspirant Registration') :
                 mode === 'admin' ? (lang === 'hi' ? '🔒 एडमिन कंसोल लॉगिन (Admin Only)' : 'Admin Console Login') :
                 mode === 'forgot' ? (lang === 'hi' ? '🔐 पासवर्ड रीसेट (Password Recovery)' : 'Reset Forgotten Password') :
                 (lang === 'hi' ? '🔑 परीक्षार्थी लॉगिन (Student Login)' : 'Student Login')}
              </h3>
              <p className="text-xs text-[#D4A017] font-medium">
                {mode === 'admin'
                  ? (lang === 'hi' ? 'केवल अधिकृत पोर्टल प्रबंधकों के लिए' : 'Authorized Personnel Only')
                  : mode === 'forgot'
                  ? (lang === 'hi' ? 'सुरक्षित OTP सत्यापन के माध्यम से नया पासवर्ड बनाएं' : 'Secure OTP verification & Password Reset')
                  : 'MP परीक्षा सेतु • मध्यप्रदेश प्रतियोगी परीक्षा पोर्टल'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection ONLY between Student Signup & Login when in regular student mode */}
        {mode !== 'admin' && mode !== 'forgot' && (
          <div className="grid grid-cols-2 bg-stone-100 dark:bg-stone-950 p-1.5 border-b border-stone-200 dark:border-stone-800 gap-1.5">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#7A2A1E] text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === 'hi' ? 'लॉगिन करें (Login)' : 'Student Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#D4A017] text-stone-950 shadow-md font-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया साइन-अप (Sign Up)' : 'New Sign Up'}</span>
            </button>
          </div>
        )}

        {/* Header navigation bar when in Forgot Mode */}
        {mode === 'forgot' && (
          <div className="bg-stone-100 dark:bg-stone-950 px-4 py-2 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className="text-[#7A2A1E] dark:text-[#D4A017] font-black flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'लॉगिन पर वापस जाएँ' : 'Back to Login'}</span>
            </button>
            <div className="text-stone-500 font-bold">
              {forgotStep === 1 && 'चरण 1/2: खाता पहचान'}
              {forgotStep === 2 && 'चरण 2/2: OTP & नया पासवर्ड'}
              {forgotStep === 3 && '✅ पासवर्ड रीसेट पूर्ण'}
            </div>
          </div>
        )}

        {/* Error message banner */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-3 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="shrink-0 text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM CONTENT */}
        {mode === 'admin' ? (
          /* ========================================================================= */
          /* DEDICATED ADMIN LOGIN FLOW (Only Admin credentials & controls) */
          /* ========================================================================= */
          <form onSubmit={handleAdminSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
            <div className="bg-emerald-50 dark:bg-stone-950 border border-emerald-200 dark:border-stone-800 rounded-2xl p-3.5 space-y-1">
              <div className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>सुरक्षित एडमिनिस्ट्रेटर कंसोल</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                यहाँ से आप टेस्ट सीरीज़, प्रश्नोत्तरी, मॉक सेट्स, बैनर, छात्र खाते व पेमेंट ऑर्डर प्रबंधित कर सकते हैं।
              </p>
            </div>

            <div>
              <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                एडमिन आईडी / Username *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="अपना एडमिन यूज़रनेम दर्ज करें"
                  required
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                एडमिन पासवर्ड / Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{lang === 'hi' ? '👑 एडमिन पोर्टल में प्रवेश करें' : 'Login to Admin Console'}</span>
            </button>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="text-stone-600 dark:text-stone-400 hover:text-[#7A2A1E] dark:hover:text-[#D4A017] text-xs font-bold underline cursor-pointer"
              >
                ← छात्र / परीक्षार्थी लॉगिन पर वापस जाएँ
              </button>
            </div>
          </form>
        ) : mode === 'forgot' ? (
          /* ========================================================================= */
          /* FORGOT PASSWORD FLOW (Step 1: ID -> Step 2: OTP & New Pass -> Step 3: Success) */
          /* ========================================================================= */
          <div className="p-5 overflow-y-auto text-xs">
            {forgotStep === 1 && (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-[#D4A017]/50 rounded-2xl p-3.5 space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
                    <span>पासवर्ड रिकवरी सहायता (Find Your Account)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                    अपना पंजीकृत <strong>मोबाइल नंबर, ईमेल आईडी या यूज़रनेम</strong> दर्ज करें। हम आपके खाते की पहचान कर सत्यापन कोड (OTP) भेजेंगे।
                  </p>
                </div>

                <div>
                  <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                    पंजीकृत ईमेल, मोबाइल नंबर या यूज़रनेम *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="उदा. 9826012345 या aspirant या email@domain.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    डेमो छात्र खाते के लिए <code className="font-bold text-amber-800 dark:text-amber-300">aspirant</code> दर्ज करें।
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#7A2A1E] hover:bg-[#963E2F] text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4A017]" />
                  <span>{lang === 'hi' ? '📩 OTP कोड भेजें (Send OTP)' : 'Send Verification OTP'}</span>
                </button>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(''); }}
                    className="text-stone-600 dark:text-stone-400 hover:text-[#7A2A1E] dark:text-stone-400 font-bold underline cursor-pointer"
                  >
                    ← मुझे पासवर्ड याद आ गया, लॉगिन करें
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                {/* Account Details & Simulation OTP Badge */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-950 dark:text-emerald-300 text-xs">
                      👤 {foundAccount?.name} ({foundAccount?.username || 'छात्र'})
                    </span>
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      खाता सत्यापित
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400 flex flex-wrap gap-x-3">
                    <span>📱 मो.: <strong>{getMaskedPhone(foundAccount?.phone)}</strong></span>
                    <span>✉️ ईमेल: <strong>{getMaskedEmail(foundAccount?.email)}</strong></span>
                  </div>
                  
                  {/* Visual OTP simulation notification for flawless UX */}
                  <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/80 bg-white/70 dark:bg-stone-900/60 p-2 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-stone-800 dark:text-stone-200 font-medium">
                      <span>📩 SMS सत्यापन कोड:</span>
                      <span className="font-mono font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] tracking-widest bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        {generatedOtp}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotOtp(generatedOtp)}
                      className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded"
                    >
                      ऑटो-भरें
                    </button>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-black text-stone-700 dark:text-stone-300">
                      4-अंकीय सत्यापन OTP कोड *
                    </label>
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleResendOtp}
                      className={`text-[11px] font-bold flex items-center gap-1 ${
                        resendCooldown > 0 
                          ? 'text-stone-400 cursor-not-allowed' 
                          : 'text-[#7A2A1E] dark:text-[#D4A017] hover:underline cursor-pointer'
                      }`}
                    >
                      <RotateCw className={`w-3 h-3 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                      <span>{resendCooldown > 0 ? `पुनः भेजें (${resendCooldown}s)` : 'OTP पुनः भेजें'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="उदा. 4-अंकों का OTP कोड"
                    maxLength={4}
                    required
                    className="w-full text-center tracking-widest font-mono text-base font-black py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                    नया पासवर्ड (New Password) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="कम से कम 4 अक्षर"
                      required
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                    नए पासवर्ड की पुष्टि करें (Confirm Password) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="वही पासवर्ड दोबारा दर्ज करें"
                      required
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4A017] hover:bg-[#c08f12] text-stone-950 font-black uppercase tracking-wider rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{lang === 'hi' ? '🔐 नया पासवर्ड सुरक्षित करें' : 'Save New Password'}</span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setErrorMsg(''); }}
                    className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 font-bold underline cursor-pointer text-[11px]"
                  >
                    ← पिछला चरण (मोबाइल/ईमेल बदलें)
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-md animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="font-display font-black text-lg text-emerald-800 dark:text-emerald-300">
                    बधाई हो! पासवर्ड रीसेट सफल रहा
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    आपका नया पासवर्ड सुरक्षित रूप से अपडेट कर दिया गया है। अब आप सीधे पोर्टल में प्रवेश कर सकते हैं।
                  </p>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-left text-xs space-y-1">
                  <div className="text-stone-500 font-medium">खाता नाम: <strong className="text-stone-900 dark:text-white">{foundAccount?.name}</strong></div>
                  <div className="text-stone-500 font-medium">यूज़रनेम: <strong className="text-stone-900 dark:text-white">{foundAccount?.username || foundAccount?.email}</strong></div>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteResetAndLogin}
                  className="w-full py-3.5 bg-[#7A2A1E] hover:bg-[#963E2F] text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#D4A017]" />
                  <span>{lang === 'hi' ? '🚀 अभी नए पासवर्ड से लॉगिन करें' : 'Login Now with New Password'}</span>
                </button>
              </div>
            )}
          </div>
        ) : mode === 'login' ? (
          /* ========================================================================= */
          /* STUDENT LOGIN FORM (Clean, Simple, Zero Confusion) */
          /* ========================================================================= */
          <form onSubmit={handleStudentSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
            
            {/* Quick 1-click student demo */}
            <div className="bg-amber-50/80 dark:bg-stone-950 p-3 rounded-2xl border border-amber-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-black text-stone-900 dark:text-white block text-xs">डेमो छात्र खाता</span>
                <span className="text-[11px] text-stone-500">ID: <code className="font-mono font-bold text-amber-900 dark:text-amber-300">aspirant</code> | Pass: <code className="font-mono font-bold text-amber-900 dark:text-amber-300">student123</code></span>
              </div>
              <button
                type="button"
                onClick={handleOneClickDemoStudent}
                className="px-3 py-1.5 bg-[#7A2A1E] hover:bg-[#963E2F] text-[#D4A017] rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
              >
                ⚡ 1-क्लिक लॉगिन
              </button>
            </div>

            <div>
              <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                यूज़रनेम या ईमेल पता / Username or Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="उदा. aspirant या yourname@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-black text-stone-700 dark:text-stone-300">
                  पासवर्ड / Password *
                </label>
                <button
                  type="button"
                  onClick={() => { 
                    setMode('forgot'); 
                    setForgotStep(1); 
                    setForgotIdentifier(emailOrUsername); 
                    setErrorMsg(''); 
                  }}
                  className="text-[11px] font-black text-[#7A2A1E] dark:text-[#D4A017] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>पासवर्ड भूल गए? (Forgot?)</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  required
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7A2A1E] hover:bg-[#963E2F] text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4 text-[#D4A017]" />
              <span>{lang === 'hi' ? '🔑 लॉगिन करें' : 'Login Now'}</span>
            </button>

            {/* Quick Switch to Sign-up */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center gap-2 text-center text-xs">
              <div>
                <span className="text-stone-500 font-medium">खाता नहीं है? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="text-[#7A2A1E] dark:text-[#D4A017] font-black underline hover:opacity-80 cursor-pointer ml-1"
                >
                  यहाँ नया साइन-अप (Sign Up) करें
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* STUDENT SIGN UP FORM (Simple, Clear Registration) */
          /* ========================================================================= */
          <form onSubmit={handleStudentSubmit} className="p-5 space-y-3.5 overflow-y-auto text-xs">
            <div>
              <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                पूरा नाम / Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. अमित कुमार"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                  यूज़रनेम / Username *
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                    placeholder="उदा. amit2026"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                  ईमेल पता / Email ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amit@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                  मोबाइल नंबर / Mobile *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-अंकीय नंबर"
                    maxLength={10}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-stone-700 dark:text-stone-300 mb-1">
                  पासवर्ड / Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="कम से कम 4 अक्षर"
                    required
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* All-India Welcoming Banner */}
            <div className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-stone-800 dark:to-stone-900 border border-blue-200 dark:border-stone-700 rounded-xl flex items-center gap-2">
              <span className="text-base">🇮🇳</span>
              <div className="text-[11px] leading-tight">
                <span className="font-extrabold text-blue-950 dark:text-blue-200 block">
                  {lang === 'hi' ? 'सम्पूर्ण भारत (All-India) परीक्षार्थी पंजीकरण' : 'All-India Aspirant Portal'}
                </span>
                <span className="text-stone-500 dark:text-stone-400">
                  {lang === 'hi' ? 'म.प्र. एवं देश के किसी भी राज्य/जिले के अभ्यर्थी पंजीकरण कर सकते हैं।' : 'Aspirants from any State or District across India can register.'}
                </span>
              </div>
            </div>

            {/* State & District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* State Selection */}
              <div>
                <label className="block font-black text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>राज्य / State *</span>
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSelectedState(newState);
                    const newDistricts = getDistrictsForState(newState);
                    setSelectedDistrict(newDistricts[0] || 'अन्य जिला (Other District)');
                    setCustomState('');
                    setCustomDistrict('');
                  }}
                  className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017] text-xs"
                >
                  {ALL_INDIAN_STATES.map(s => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>

                {/* Custom State Input when "अन्य राज्य / केंद्र शासित प्रदेश" is selected */}
                {selectedState.includes('अन्य') && (
                  <div className="mt-1.5 animate-fadeIn">
                    <input
                      type="text"
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      placeholder="अपने राज्य का नाम लिखें (Type State Name)"
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* District Selection */}
              <div>
                <label className="block font-black text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
                  <span>गृह जिला / District *</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    if (!e.target.value.includes('अन्य')) {
                      setCustomDistrict('');
                    }
                  }}
                  className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#D4A017] text-xs"
                >
                  {getDistrictsForState(selectedState).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Custom District Input when "अन्य जिला" or "अन्य राज्य" is selected */}
                {(selectedDistrict.includes('अन्य') || selectedState.includes('अन्य')) && (
                  <div className="mt-1.5 animate-fadeIn">
                    <input
                      type="text"
                      value={customDistrict}
                      onChange={(e) => setCustomDistrict(e.target.value)}
                      placeholder="अपने जिले/शहर का नाम लिखें (Type District/City)"
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Target Exam Selection (Multi-select Checkboxes with 'All' Option) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-black text-stone-700 dark:text-stone-300 text-xs">
                  {lang === 'hi' ? '🎯 लक्ष्य प्रतियोगी परीक्षाएँ / Target Exams *' : '🎯 Target Competitive Exams *'}
                </label>

                {/* Select All Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedTargetExams.length === TARGET_EXAMS_LIST.length) {
                      setSelectedTargetExams([]);
                    } else {
                      setSelectedTargetExams(TARGET_EXAMS_LIST.map(e => e.id));
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer border ${
                    selectedTargetExams.length === TARGET_EXAMS_LIST.length
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-amber-50 hover:border-amber-400 dark:hover:bg-stone-700'
                  }`}
                >
                  {selectedTargetExams.length === TARGET_EXAMS_LIST.length ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span>
                    {selectedTargetExams.length === TARGET_EXAMS_LIST.length
                      ? (lang === 'hi' ? '✓ सभी चयनित (All)' : '✓ All Selected')
                      : (lang === 'hi' ? 'सभी चुनें (Select All)' : 'Select All')}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded-full font-mono font-bold">
                    {selectedTargetExams.length}/{TARGET_EXAMS_LIST.length}
                  </span>
                </button>
              </div>

              {/* Checkboxes List / Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/50 scrollbar-thin">
                {TARGET_EXAMS_LIST.map((exam) => {
                  const isChecked = selectedTargetExams.includes(exam.id);
                  return (
                    <div
                      key={exam.id}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedTargetExams(selectedTargetExams.filter(id => id !== exam.id));
                        } else {
                          setSelectedTargetExams([...selectedTargetExams, exam.id]);
                        }
                      }}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-left cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 text-stone-900 dark:text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/80 text-stone-600 dark:text-stone-300 hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by parent div
                        className="mt-0.5 w-4 h-4 text-[#D4A017] rounded border-stone-300 focus:ring-[#D4A017] cursor-pointer accent-[#D4A017]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold leading-tight line-clamp-2">
                          {exam.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D4A017] hover:bg-[#c08f12] text-stone-950 font-black uppercase tracking-wider rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'hi' ? '📝 नया खाता बनाएँ & फ्री टेस्ट पाएँ' : 'Create Account & Start Free Test'}</span>
            </button>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-center text-xs">
              <span className="text-stone-500 font-medium">पहले से पंजीकृत हैं? </span>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="text-[#7A2A1E] dark:text-[#D4A017] font-black underline hover:opacity-80 cursor-pointer ml-1"
              >
                यहाँ लॉगिन करें (Login)
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
