import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  Users, 
  Award, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Scale,
  Sparkles,
  Printer
} from 'lucide-react';

export const LegalAndAboutView: React.FC = () => {
  const { lang, activeView, viewParams, navigate, platformSettings } = useApp();

  const getTargetTab = (): 'about' | 'terms' | 'privacy' | 'refund' => {
    if (viewParams?.tab && ['about', 'terms', 'privacy', 'refund'].includes(viewParams.tab)) {
      return viewParams.tab as any;
    }
    if (activeView === 'aboutUs' || activeView === 'about') return 'about';
    if (activeView === 'terms') return 'terms';
    if (activeView === 'privacy') return 'privacy';
    if (activeView === 'refund') return 'refund';
    return 'about';
  };

  const [activeTab, setActiveTab] = useState<'about' | 'terms' | 'privacy' | 'refund'>(getTargetTab());

  useEffect(() => {
    setActiveTab(getTargetTab());
  }, [activeView, viewParams?.tab]);

  const supportEmail = platformSettings?.supportEmail || 'mpparikshasetu.support@gmail.com';
  const supportPhone = platformSettings?.helplinePhone || '+91 98765 43210';
  const siteTitle = platformSettings?.siteTitle || 'MP परीक्षा सेतु';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#5E1F16] via-[#7A2A1E] to-[#963E2F] rounded-3xl p-6 sm:p-10 text-white shadow-xl border-2 border-[#D4A017] mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/50 text-[#D4A017] text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'आधिकारिक नीति एवं संस्थागत विवरण' : 'Official Policies & Institutional Disclosure'}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              {siteTitle} <span className="text-[#D4A017]">{lang === 'hi' ? 'दिशानिर्देश व नीतियां' : 'Guidelines & Policies'}</span>
            </h1>
            <p className="text-[#EAD8B1] text-xs sm:text-sm font-medium leading-relaxed">
              {lang === 'hi' 
                ? 'पारदर्शिता, छात्र सुरक्षा एवं गुणवत्तापूर्ण शिक्षा हमारे सर्वोच्च सिद्धांत हैं। यहाँ हमारी कार्यप्रणाली, नियम व नीतियों का विस्तृत विवरण उपलब्ध है।'
                : 'Transparency, student trust, and educational excellence are our core principles. Find our detailed operational terms and policies below.'}
            </p>
          </div>

          {/* Print / Help Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFBF2] border border-white/20 text-xs font-bold transition cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4 text-[#D4A017]" />
              <span>{lang === 'hi' ? 'प्रिंट / सेव PDF' : 'Print / Save PDF'}</span>
            </button>
            <a
              href={`mailto:${supportEmail}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-[#2D2424] font-black text-xs transition shadow-md cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सपोर्ट संपर्क' : 'Contact Support'}</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/15 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#D4A017] text-[#2D2424] shadow-lg scale-105'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'hi' ? '1. हमारे बारे में (About Us)' : '1. About Us'}</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#D4A017] text-[#2D2424] shadow-lg scale-105'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{lang === 'hi' ? '2. नियम एवं शर्तें (Terms & Conditions)' : '2. Terms & Conditions'}</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#D4A017] text-[#2D2424] shadow-lg scale-105'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{lang === 'hi' ? '3. गोपनीयता नीति (Privacy Policy)' : '3. Privacy Policy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-[#D4A017] text-[#2D2424] shadow-lg scale-105'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'hi' ? '4. रिफंड एवं गणना नीति (Refund & Calculation Policy)' : '4. Refund & Calculation Policy'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-xl">
        
        {/* ======================================================== */}
        {/* TAB 1: ABOUT US */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#7A2A1E] dark:text-[#D4A017] flex items-center justify-center font-black">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-stone-900 dark:text-stone-100">
                    {lang === 'hi' ? 'हमारे बारे में (About MP परीक्षा सेतु)' : 'About MP Pariksha Setu'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lang === 'hi' ? 'मध्यप्रदेश के प्रतियोगी छात्रों का सबसे विश्वसनीय और प्रामाणिक परीक्षा मंच' : 'Madhya Pradesh\'s Premier Dedicated CBT Mock Test & Learning Platform'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center gap-2 text-[#7A2A1E] dark:text-[#D4A017] font-black text-base">
                  <Sparkles className="w-5 h-5" />
                  <span>{lang === 'hi' ? 'हमारा विज़न (Our Vision)' : 'Our Vision'}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'hi'
                    ? 'मध्यप्रदेश के प्रत्येक गांव, कस्बे और शहर के मेधावी छात्र तक बिना किसी आर्थिक बाधा के राज्य स्तरीय प्रतियोगी परीक्षाओं (MPPSC, MPESB पटवारी, पुलिस SI/आरक्षक, RAEO, वनरक्षक आदि) की आधुनिकतम और प्रामाणिक टेस्ट सीरीज़ पहुँचाना।'
                    : 'To empower every aspirant across Madhya Pradesh with accessible, high-quality, and authentic exam simulation tools conforming 100% to official government examination standards.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-stone-800/60 border border-emerald-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-black text-base">
                  <Award className="w-5 h-5" />
                  <span>{lang === 'hi' ? 'हमारा मिशन (Our Mission)' : 'Our Mission'}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'hi'
                    ? 'वास्तविक परीक्षा जैसा कंप्यूटर आधारित टेस्ट (CBT) अनुभव, द्विभाषी प्रश्न (हिन्दी व English), विषयवार गहन AI विश्लेषण, और ऑल-एमपी मेरिट रैंकिंग प्रदान करके छात्रों की सफलता दर को अधिकतम करना।'
                    : 'Delivering real exam-like CBT software, curated bilingual question banks with detailed explanations, comprehensive AI analytics, and statewide ranking.'}
                </p>
              </div>
            </div>

            {/* Key Pillars */}
            <div className="space-y-4">
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'हमारे मुख्य स्तंभ (Key Platform Pillars)' : 'Key Platform Pillars'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>100% वास्तविक CBT सॉफ्टवेयर</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                    MPESB / Vyapam व MPPSC के आधिकारिक परीक्षा हॉल जैसा रंग-कोडेड पैलेट, टाइमर, और द्विभाषी इंटरफ़ेस।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>प्रामाणिक प्रश्न व विस्तृत हल</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                    म.प्र. सामान्य ज्ञान, सामान्य प्रबंधन, विज्ञान, गणित और कृषि के सभी प्रश्नों का विशेषज्ञ-सत्यापित विश्लेषण।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="font-black text-sm text-[#7A2A1E] dark:text-[#D4A017] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ऑल-एमपी रियल-टाइम मेरिट</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                    लाखों साथी अभ्यर्थियों के बीच अपनी राज्य स्तरीय रैंक, परसेंटाइल और कमज़ोर विषयों की सटीक पहचान।
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Council & Faculty */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3">
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
                <span>शैक्षणिक विशेषज्ञता व गुणवत्ता नियंत्रण (Academic Integrity)</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                हमारे प्रश्न पत्र पूर्व चयनित अधिकारियों, विषय विशेषज्ञों तथा वरिष्ठ प्राध्यापकों की निगरानी में तैयार किए जाते हैं। प्रत्येक टेस्ट को नवीनतम परीक्षा पैटर्न, नकारात्मक अंकन नियमों (यदि लागू हो), तथा MP शासन के नवीनतम गजट व समसामयिकी के अनुसार अद्यतन किया जाता है।
              </p>
            </div>

            {/* Quick Contact Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-black text-sm text-[#D4A017]">क्या आपके पास कोई प्रश्न या सुझाव है?</div>
                <div className="text-xs text-stone-300">हमारी सहायता टीम प्रतिदिन सुबह 9:00 से शाम 8:00 बजे तक उपलब्ध है।</div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={`mailto:${supportEmail}`}
                  className="px-4 py-2 rounded-xl bg-[#D4A017] text-[#2D2424] font-black text-xs hover:bg-[#b8890f] transition"
                >
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TERMS AND CONDITIONS */}
        {/* ======================================================== */}
        {activeTab === 'terms' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#7A2A1E] dark:text-[#D4A017] flex items-center justify-center font-black">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-stone-900 dark:text-stone-100">
                    {lang === 'hi' ? 'नियम एवं शर्तें (Terms and Conditions)' : 'Terms & Conditions of Use'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    अंतिम अद्यतन: 01 सितम्बर 2026 • नियम एवं उपयोगकर्ता अनुबंध
                  </p>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-6">
              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>1. स्वीकृति एवं पात्रता (Acceptance & Eligibility)</span>
                </h4>
                <p className="leading-relaxed">
                  इस वेबसाइट (<strong>{siteTitle}</strong>) का उपयोग करके या किसी भी टेस्ट सीरीज़ / डिजिटल सामग्री में नामांकन करके, आप इन नियमों एवं शर्तों से पूर्णतः बंधे होने की सहमति देते हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया पोर्टल की सेवाओं का उपयोग न करें।
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>2. उपयोगकर्ता खाता एवं सुरक्षा (User Account & Security)</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>उपयोगकर्ता को पंजीकरण के दौरान अपना सही नाम, वैध ईमेल आईडी और मोबाइल नंबर प्रदान करना अनिवार्य है।</li>
                  <li>खाते के पासवर्ड और साख (Credentials) की गोपनीयता बनाए रखना उपयोगकर्ता की स्वयं की जिम्मेदारी है।</li>
                  <li><strong>सिंगल यूजर पॉलिसी:</strong> एक खाता केवल एक छात्र के व्यक्तिगत अध्ययन के लिए है। एक ही खाते को एकाधिक व्यक्तियों के साथ साझा करना या व्यावसायिक उपयोग करना नियमों का उल्लंघन है और इससे खाता स्थायी रूप से निलंबित हो सकता है।</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>3. बौद्धिक संपदा अधिकार (Intellectual Property & Copyright)</span>
                </h4>
                <p className="leading-relaxed">
                  पोर्टल पर उपलब्ध सभी मॉक टेस्ट, प्रश्न, विस्तृत हल, ई-नोट्स (PDF), ग्राफिक्स, सॉफ्टवेयर कोड और ब्रांड ट्रेडमार्क <strong>{siteTitle}</strong> की अनन्य बौद्धिक संपदा हैं। हमारी पूर्व लिखित अनुमति के बिना किसी भी सामग्री को कॉपी, डाउनलोड करके बेचना, स्क्रीन-रिकॉर्ड करके यूट्यूब/टेलीग्राम पर प्रसारित करना भारतीय कॉपीराइट अधिनियम के अंतर्गत दंडनीय अपराध है।
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>4. टेस्ट सीरीज़ एवं सामग्री की वैधता (Validity of Purchased Content)</span>
                </h4>
                <p className="leading-relaxed">
                  प्रत्येक खरीदी गई टेस्ट सीरीज़ की वैधता संबंधित भर्ती परीक्षा के संपन्न होने तक या खरीद तिथि से अधिकतम 1 वर्ष (365 दिन) तक मान्य रहती है। वैधता अवधि समाप्त होने के बाद छात्र को पुनः नामांकन कराना हो सकता है।
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>5. शासकीय सम्बद्धता अस्वीकरण (Government Affiliation Disclaimer)</span>
                </h4>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <strong>महत्वपूर्ण अस्वीकरण:</strong> <em>{siteTitle}</em> एक स्वतंत्र निजी प्रतियोगी परीक्षा तैयारी एवं मॉक टेस्ट मंच है। हम मध्यप्रदेश कर्मचारी चयन मंडल (MPESB / Vyapam), MPPSC अथवा मध्यप्रदेश शासन के किसी विभाग के आधिकारिक प्रतिनिधि नहीं हैं। हमारे प्रश्न व टेस्ट शासकीय पाठ्यक्रम और पूर्व वर्षों के पैटर्न पर आधारित शैक्षणिक अभ्यास हेतु बनाए गए हैं।
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>6. क्षेत्राधिकार एवं विवाद निवारण (Jurisdiction)</span>
                </h4>
                <p className="leading-relaxed">
                  इस अनुबंध और सेवाओं से संबंधित किसी भी कानूनी विवाद का समाधान भारत के कानूनों के अनुसार होगा और इसका अनन्य क्षेत्राधिकार <strong>भोपाल, मध्यप्रदेश (Bhopal Jurisdiction)</strong> की अदालतों के अधीन होगा।
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRIVACY POLICY */}
        {/* ======================================================== */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#7A2A1E] dark:text-[#D4A017] flex items-center justify-center font-black">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-stone-900 dark:text-stone-100">
                    {lang === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy & Data Protection Policy'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    छात्र डेटा सुरक्षा, एन्क्रिप्शन एवं गोपनीयता मानक
                  </p>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-6">
              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>1. हम कौन सी जानकारी एकत्र करते हैं? (Information Collected)</span>
                </h4>
                <p className="leading-relaxed">
                  छात्रों को निर्बाध सेवा प्रदान करने हेतु हम निम्नलिखित जानकारी एकत्र करते हैं:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>व्यक्तिगत पहचान:</strong> पूरा नाम, ईमेल पता, वैध 10-अंकीय मोबाइल नंबर, प्रोफाइल फोटो (वैकल्पिक)।</li>
                  <li><strong>अकादमिक व प्रदर्शन डेटा:</strong> टेस्ट में प्राप्त अंक, समय प्रबंधन, हल किए गए प्रश्न, ऑल-एमपी रैंक, बुकमार्क किए गए प्रश्न।</li>
                  <li><strong>तकनीकी डेटा:</strong> डिवाइस का प्रकार, ब्राउज़र संस्करण, स्क्रीन रिज़ॉल्यूशन, और लॉगिन सत्र कुकीज़।</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>2. एकत्रित जानकारी का उपयोग (Purpose of Data Usage)</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>छात्र के खाते को प्रमाणित करने और अनलॉक की गई टेस्ट सीरीज़ की सुरक्षा बनाए रखने के लिए।</li>
                  <li>राज्य स्तरीय मेरिट सूची और AI आधारित स्कोरकार्ड विश्लेषण तैयार करने के लिए।</li>
                  <li>महत्वपूर्ण परीक्षा सूचनाएं, प्रवेश पत्र अलर्ट और सिस्टम अपडेट भेजने के लिए।</li>
                  <li>भुगतान रसीद (GST Invoice) जारी करने और छात्र सहायता प्रदान करने के लिए।</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>3. भुगतान डेटा सुरक्षा (Razorpay 256-Bit SSL Security)</span>
                </h4>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                  <strong>पूर्ण वित्तीय सुरक्षा:</strong> हम आपके क्रेडिट/डेबिट कार्ड नंबर, CVV, नेटबैंकिंग पासवर्ड या UPI पिन को कभी भी अपने सर्वर पर स्टोर नहीं करते हैं। सभी वित्तीय लेन-देन भारत के अग्रणी और RBI-सत्यापित पेमेंट गेटवे <strong>Razorpay</strong> के माध्यम से 256-Bit बैंक-ग्रेड एन्क्रिप्शन पर सुरक्षित रूप से प्रोसेस किए जाते हैं।
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>4. तीसरे पक्ष से डेटा साझा न करने की नीति (No Third-Party Selling)</span>
                </h4>
                <p className="leading-relaxed">
                  हम आपके व्यक्तिगत डेटा (मोबाइल नंबर, ईमेल) को किसी भी तीसरे पक्ष विज्ञापनदाता, टेलीमार्केटर या बाहरी कोचिंग संस्थान को कभी नहीं बेचते, किराए पर नहीं देते और न ही अनुचित रूप से साझा करते हैं।
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>5. खाता व डेटा हटाने का अधिकार (Data Deletion Rights)</span>
                </h4>
                <p className="leading-relaxed">
                  यदि कोई छात्र अपना खाता अथवा परीक्षा इतिहास हटाना चाहता है, तो वह हमारे सपोर्ट ईमेल <a href={`mailto:${supportEmail}`} className="text-[#7A2A1E] dark:text-[#D4A017] font-bold underline">{supportEmail}</a> पर अनुरोध भेज सकता है। सत्यापन के 7 कार्यदिवसों के भीतर डेटा सुरक्षित रूप से मिटा दिया जाता है।
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: REFUND & CANCELLATION POLICY */}
        {/* ======================================================== */}
        {activeTab === 'refund' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#7A2A1E] dark:text-[#D4A017] flex items-center justify-center font-black">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-stone-900 dark:text-stone-100">
                    {lang === 'hi' ? 'रिफंड एवं गणना नीति (Refund & Calculation Policy)' : 'Refund & Calculation Policy'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    डिजिटल टेस्ट सीरीज़ खरीद, रद्दीकरण, मूल्य, जीएसटी, प्राप्तांक व रिफंड गणना मानक
                  </p>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-6">
              
              <section className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-300 dark:border-stone-700">
                <h4 className="font-black text-amber-950 dark:text-amber-200 text-sm flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>डिजिटल उत्पाद नीति (Digital Goods Instant Delivery Policy)</span>
                </h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  MP परीक्षा सेतु द्वारा प्रदान की जाने वाली टेस्ट सीरीज़, मॉक टेस्ट और ई-नोट्स <strong>डिजिटल बौद्धिक सामग्री (Digital Goods)</strong> की श्रेणी में आते हैं। भुगतान सफल होते ही सभी 20 सेट्स व ई-नोट्स छात्र के खाते में तत्काल प्रभाव से पूर्णतः अनलॉक हो जाते हैं।
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>1. रद्दीकरण नीति (Cancellation Policy)</span>
                </h4>
                <p className="leading-relaxed">
                  चूँकि डिजिटल सामग्री की डिलीवरी तत्काल और अपरिवर्तनीय (Instant Delivery) होती है, इसलिए एक बार लेन-देन सफलतापूर्वक पूरा हो जाने के बाद सामान्य परिस्थितियों में ऑर्डर रद्द करने का विकल्प उपलब्ध नहीं होता है। हम छात्रों को सलाह देते हैं कि वे किसी भी पेड सीरीज़ को खरीदने से पहले पोर्टल पर उपलब्ध <strong>निःशुल्क 40-प्रश्न डेमो मॉक टेस्ट</strong> अवश्य देकर देखें।
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>2. रिफंड के लिए मान्य परिस्थितियां (Eligible Refund Scenarios)</span>
                </h4>
                <p className="leading-relaxed">
                  केवल निम्नलिखित विशेष तकनीकी परिस्थितियों में 100% रिफंड प्रदान किया जाएगा:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 space-y-1.5">
                    <div className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>दोहरा भुगतान (Duplicate / Double Payment)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                      यदि नेटवर्क समस्या या गेटवे ग्लिच के कारण एक ही टेस्ट सीरीज़ के लिए छात्र के बैंक से दो बार पैसे कट जाते हैं, तो अतिरिक्त कटी राशि स्वतः 5-7 कार्यदिवसों में मूल खाते में वापस भेज दी जाएगी।
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 space-y-1.5">
                    <div className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>तकनीकी विफलता (Non-Delivery of Access)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                      यदि बैंक से पैसे कटने के बाद भी 24 घंटे के भीतर टेस्ट सीरीज़ अनलॉक नहीं होती और हमारी तकनीकी टीम समस्या का समाधान करने में असमर्थ रहती है, तो पूरा रिफंड प्रोसेस किया जाएगा।
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>3. गैर-रिफंडेबल परिस्थितियां (Non-Refundable Scenarios)</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>गलती से गलत टेस्ट सीरीज़ चुन लेना यदि छात्र ने पहले ही उसमें से 1 या अधिक टेस्ट हल कर लिए हों या ई-नोट्स डाउनलोड कर लिए हों।</li>
                  <li>व्यक्तिगत तैयारी में बदलाव, परीक्षा स्थगित होना या छात्र द्वारा पढ़ाई बंद कर देना।</li>
                  <li>डिवाइस या धीमे इंटरनेट की समस्या जो छात्र के व्यक्तिगत स्तर पर हो।</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <span>4. रिफंड अनुरोध कैसे दर्ज करें? (How to Request a Refund)</span>
                </h4>
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    यदि आपका मामला उपरोक्त मान्य श्रेणी में आता है, तो कृपया लेन-देन के <strong>48 घंटे</strong> के भीतर हमें ईमेल करें:
                  </p>
                  <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700 font-mono text-xs text-stone-800 dark:text-stone-200 space-y-1">
                    <div>📧 <strong>ईमेल:</strong> {supportEmail}</div>
                    <div>📝 <strong>विषय:</strong> Refund Request - [आपका Order ID / Transaction ID]</div>
                    <div>📋 <strong>विवरण:</strong> पंजीकृत मोबाइल नंबर, नाम, बैंक कटौती का स्क्रीनशॉट</div>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    हमारी वित्तीय टीम 24-48 घंटे के भीतर अनुरोध की जांच करती है और स्वीकृत होने पर रिफंड राशि मूल भुगतान स्रोत (UPI / Bank Account) में 5 से 7 कार्यदिवसों (Working Days) में क्रेडिट हो जाती है।
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#D4A017]" />
                  <span>5. मूल्य, जीएसटी एवं गणना नीति (Pricing, Tax, Score & Refund Calculation Policy)</span>
                </h4>
                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-4">
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                    MP परीक्षा सेतु छात्रों के प्रति 100% वित्तीय और अंकगणितीय पारदर्शिता में विश्वास रखता है। नीचे हमारे सभी मूल्य, कर, छूट, टेस्ट अंक व रिफंड गणना के आधिकारिक फॉर्मूले दिए गए हैं:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    {/* Calculation 1: Price & GST Breakdown */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                      <div className="font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>मूल्य एवं जीएसटी गणना (Price & 18% GST Formula)</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 font-mono text-[11px] bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                        अंतिम देय राशि = (सीरीज़ आधार मूल्य - कूपन छूट) + 18% GST<br />
                        GST = (शुद्ध मूल्य × 18) ÷ 100 (9% CGST + 9% SGST)
                      </p>
                      <p className="text-[11px] text-stone-500">
                        उदाहरण: ₹99 की सीरीज़ पर ₹83.90 बेस प्राइस + ₹15.10 GST शामिल होता है। छात्र से कोई छिपा हुआ अतिरिक्त शुल्क नहीं लिया जाता।
                      </p>
                    </div>

                    {/* Calculation 2: 100% Zero-Deduction Refund */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                      <div className="font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>रिफंड गणना नियम (Full Refund Calculation)</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 font-mono text-[11px] bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                        स्वीकृत रिफंड राशि = छात्र द्वारा भुगतान की गई कुल राशि × 100%<br />
                        (कटौती: ₹0 शून्य गेटवे या कन्वीनियंस चार्ज)
                      </p>
                      <p className="text-[11px] text-stone-500">
                        दोहरा भुगतान या तकनीकी विफलता के मामले में कोई भी रद्दीकरण शुल्क नहीं काटा जाता, पूरी राशि उसी माध्यम में लौटाई जाती है।
                      </p>
                    </div>

                    {/* Calculation 3: Test CBT Scoring & Negative Marking */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                      <div className="font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>मॉक टेस्ट प्राप्तांक गणना (CBT Score Formula)</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 font-mono text-[11px] bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                        कुल प्राप्तांक = (सही उत्तर × 1.0) - (गलत उत्तर × नेगेटिव मार्किंग)<br />
                        अनुत्तरित प्रश्न (Unattempted) = 0 अंक (कोई पेनल्टी नहीं)
                      </p>
                      <p className="text-[11px] text-stone-500">
                        MP पटवारी/वनरक्षक में नेगेटिव मार्किंग 0 होती है, जबकि MP पुलिस SI या MPPSC में परीक्षा नियमावली अनुसार कटौती लागू होती है।
                      </p>
                    </div>

                    {/* Calculation 4: Rank & Percentile Formula */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                      <div className="font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>रैंक व पर्सेंटाइल गणना (Percentile Formula)</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 font-mono text-[11px] bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                        पर्सेंटाइल = [ (कुल प्रतिभागी - आपकी रैंक) ÷ कुल प्रतिभागी ] × 100
                      </p>
                      <p className="text-[11px] text-stone-500">
                        यह फॉर्मूला दर्शाता है कि राज्य के कितने प्रतिशत छात्र आपके प्राप्तांक से नीचे रहे, जिससे वास्तविक प्रतिस्पर्धा का सटीक आकलन होता है।
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Quick Links / Back to Catalog */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs">
        <div className="flex items-center gap-2 font-bold text-stone-700 dark:text-stone-300">
          <BookOpen className="w-4 h-4 text-[#7A2A1E] dark:text-[#D4A017]" />
          <span>तैयारी शुरू करें और अपना पहला मॉक टेस्ट दें</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('freeMockTest')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition cursor-pointer"
          >
            🎯 40-प्रश्न फ्री टेस्ट
          </button>
          <button
            onClick={() => navigate('catalog')}
            className="px-4 py-2 rounded-xl bg-[#7A2A1E] text-[#D4A017] font-black border border-[#D4A017] hover:bg-[#5E1F16] transition cursor-pointer"
          >
            📚 सभी टेस्ट सीरीज़ देखें
          </button>
        </div>
      </div>
    </div>
  );
};
