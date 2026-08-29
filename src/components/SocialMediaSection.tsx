import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Send, 
  MessageCircle, 
  Users, 
  ExternalLink, 
  Sparkles, 
  Bell, 
  CheckCircle2, 
  Share2,
  Copy,
  Check
} from 'lucide-react';

export const SocialMediaSection: React.FC = () => {
  const { lang, platformSettings, showToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  const fbUrl = platformSettings?.facebookUrl || 'https://facebook.com/groups/mpparikshasetu';
  const instaUrl = platformSettings?.instagramUrl || 'https://instagram.com/mpparikshasetu_official';
  const tgUrl = platformSettings?.telegramUrl || 'https://t.me/mpparikshasetu_mp';
  const ytUrl = platformSettings?.youtubeUrl || 'https://youtube.com/@mpparikshasetu';
  const waUrl = platformSettings?.whatsappCommunityUrl || 'https://chat.whatsapp.com/mpparikshasetu';

  const handleShare = () => {
    const shareUrl = window.location.origin;
    if (navigator.share) {
      navigator.share({
        title: 'MP परीक्षा सेतु — मध्यप्रदेश प्रतियोगी परीक्षा टेस्ट पोर्टल',
        text: 'मध्यप्रदेश पटवारी, MPPSC, पुलिस SI एवं व्यापम परीक्षाओं के 250+ ऑनलाइन टेस्ट व AI मूल्यांकन के लिए अभी जुड़ें!',
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('🔗 पोर्टल का लिंक कॉपी हो गया है! इसे व्हाट्सएप या फेसबुक पर साझा करें।');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const SOCIAL_CHANNELS = [
    {
      id: 'facebook',
      nameHi: 'फेसबुक पेज एवं स्टडी ग्रुप',
      nameEn: 'Facebook Page & Community',
      handle: 'facebook.com/mpparikshasetu',
      badgeHi: '25,000+ परीक्षार्थी',
      badgeEn: '25K+ Aspirants',
      icon: Facebook,
      bgColor: 'bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800/80',
      hoverBorder: 'hover:border-blue-500',
      btnBg: 'bg-[#1877F2] hover:bg-[#0c63d4] text-white',
      url: fbUrl,
      descHi: 'म.प्र. भर्ती परीक्षा चर्चा, पुराने प्रश्नपत्र, टॉपर्स अनुभव और दैनिक पोल प्रश्नोत्तरी।',
      descEn: 'MP Govt exam discussions, PYQ analysis, toppers guidance & daily polls.',
      highlights: ['डेली GK प्रश्नोत्तरी', 'भर्ती अधिसूचना चर्चा', 'संदेह निवारण']
    },
    {
      id: 'instagram',
      nameHi: 'इंस्टाग्राम रील्स व एग्जाम टिप्स',
      nameEn: 'Instagram Reels & Exam Tips',
      handle: '@mpparikshasetu_official',
      badgeHi: '45,000+ फॉलोअर्स',
      badgeEn: '45K+ Followers',
      icon: Instagram,
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-200 dark:border-rose-800/80',
      hoverBorder: 'hover:border-rose-500',
      btnBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      url: instaUrl,
      descHi: '60-सेकंड में MP GK ट्रिक्स, करंट अफेयर्स इंफोग्राफिक्स और परीक्षा मोटिवेशन रील्स।',
      descEn: '60-second MP GK memory tricks, Current affairs infographics & exam reels.',
      highlights: ['शॉर्टकट मेमोरी ट्रिक्स', 'डेली करंट अफेयर्स', 'स्टडी इंफोग्राफिक्स']
    },
    {
      id: 'telegram',
      nameHi: 'टेलीग्राम सुपर चैनल (PDF व क्विज़)',
      nameEn: 'Telegram Super Channel',
      handle: 't.me/mpparikshasetu_mp',
      badgeHi: '68,000+ मेंबर्स',
      badgeEn: '68K+ Members',
      icon: Send,
      bgColor: 'bg-sky-500',
      textColor: 'text-sky-600 dark:text-sky-400',
      borderColor: 'border-sky-200 dark:border-sky-800/80',
      hoverBorder: 'hover:border-sky-500',
      btnBg: 'bg-[#229ED9] hover:bg-[#1a85b9] text-white',
      url: tgUrl,
      descHi: 'हस्तलिखित नोट्स PDF, 50+ प्रश्नों का दैनिक लाइव क्विज और त्वरित रिज़ल्ट अलर्ट।',
      descEn: 'Free handwritten notes PDFs, daily 50+ Qs live quizzes & instant alerts.',
      highlights: ['फ्री नोट्स डाउनलोड', 'लाइव टाइमर क्विज़', 'कटऑफ अपडेट्स']
    },
    {
      id: 'youtube',
      nameHi: 'यूट्यूब चैनल (लाइव मैराथन क्लासेज)',
      nameEn: 'YouTube Channel (Live Classes)',
      handle: '@mpparikshasetu',
      badgeHi: '90,000+ सब्सक्राइबर्स',
      badgeEn: '90K+ Subscribers',
      icon: Youtube,
      bgColor: 'bg-red-600',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800/80',
      hoverBorder: 'hover:border-red-500',
      btnBg: 'bg-[#FF0000] hover:bg-[#cc0000] text-white',
      url: ytUrl,
      descHi: 'विस्तृत विषयवार मैराथन क्लासेज, पिछले वर्षों के पेपर का हल व परीक्षा रणनीति।',
      descEn: 'Subject-wise marathon classes, previous year paper solutions & strategies.',
      highlights: ['लाइव प्रश्न हल', 'परीक्षा विश्लेषण', 'रणनीति सेशन्स']
    },
    {
      id: 'whatsapp',
      nameHi: 'व्हाट्सएप जॉब अलर्ट कम्युनिटी',
      nameEn: 'WhatsApp Job Alerts Group',
      handle: 'MP Pariksha Setu Alerts',
      badgeHi: '10,000+ छात्र जुड़े',
      badgeEn: '10K+ Students',
      icon: MessageCircle,
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800/80',
      hoverBorder: 'hover:border-emerald-500',
      btnBg: 'bg-[#25D366] hover:bg-[#1da851] text-white font-black',
      url: waUrl,
      descHi: 'सीधे आपके व्हाट्सएप पर नई भर्ती, एडमिट कार्ड व फ्री मॉक टेस्ट का नोटिफिकेशन।',
      descEn: 'Direct WhatsApp notifications for new vacancies, admit cards & test releases.',
      highlights: ['तत्काल भर्ती अलर्ट', 'एडमिट कार्ड सूचना', 'सीधा संपर्क']
    }
  ];

  return (
    <section id="social-community-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#FFFDF9] via-amber-50/40 to-orange-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
        
        {/* Gond Cultural Motif background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A017]/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EAD8B1] dark:border-stone-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A2A1E]/10 dark:bg-[#D4A017]/20 border border-[#7A2A1E]/20 dark:border-[#D4A017]/40 text-[#7A2A1E] dark:text-[#D4A017] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सोशल मीडिया व कम्युनिटी' : 'Official Social Channels'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2D2424] dark:text-white tracking-tight">
              {lang === 'hi' ? (
                <>
                  जुड़ें हमारे <span className="text-[#7A2A1E] dark:text-[#D4A017]">सोशल मीडिया नेटवर्क</span> से
                </>
              ) : (
                <>
                  Connect with our <span className="text-[#7A2A1E] dark:text-[#D4A017]">Social Media Network</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              {lang === 'hi'
                ? 'फेसबुक, इंस्टाग्राम, टेलीग्राम, यूट्यूब व व्हाट्सएप पर मध्यप्रदेश के 1,00,000+ गंभीर परीक्षार्थियों के साथ जुड़ें और पाएँ रोज़ाना फ्री क्विज़, पीडीएफ नोट्स, वैकेंसी अपडेट्स व टॉपर्स टिप्स।'
                : 'Join 1,00,000+ dedicated MP aspirants on Facebook, Instagram, Telegram, YouTube & WhatsApp for daily quizzes, notes & alerts.'}
            </p>
          </div>

          {/* Quick Share with Friends Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] border-2 border-[#D4A017] text-xs font-black uppercase tracking-wider shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#D4A017]" />}
              <span>{copiedLink ? (lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!') : (lang === 'hi' ? 'दोस्तों के साथ साझा करें' : 'Share with Friends')}</span>
            </button>
          </div>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOCIAL_CHANNELS.map((item) => {
            const IconComponent = item.icon;
            const title = lang === 'hi' ? item.nameHi : item.nameEn;
            const badge = lang === 'hi' ? item.badgeHi : item.badgeEn;
            const desc = lang === 'hi' ? item.descHi : item.descEn;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-stone-900 border-2 ${item.borderColor} ${item.hoverBorder} rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all group`}
              >
                {/* Top: Icon, Title & Follower Badge */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${item.bgColor} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-[#2D2424] dark:text-white leading-tight">
                          {title}
                        </h3>
                        <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                          {item.handle}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[10px] whitespace-nowrap border border-stone-200 dark:border-stone-700">
                      {badge}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                    {desc}
                  </p>

                  {/* Bullet Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 text-[10px] font-bold border border-stone-200 dark:border-stone-700/60"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 ${item.btnBg} text-xs font-black uppercase tracking-wider shadow-sm transition hover:scale-[1.02] active:scale-95`}
                  >
                    <span>
                      {item.id === 'facebook' && (lang === 'hi' ? 'फेसबुक पर जुड़ें' : 'Join on Facebook')}
                      {item.id === 'instagram' && (lang === 'hi' ? 'इंस्टाग्राम पर फॉलो करें' : 'Follow on Instagram')}
                      {item.id === 'telegram' && (lang === 'hi' ? 'टेलीग्राम चैनल से जुड़ें' : 'Join Telegram')}
                      {item.id === 'youtube' && (lang === 'hi' ? 'यूट्यूब सब्सक्राइब करें' : 'Subscribe YouTube')}
                      {item.id === 'whatsapp' && (lang === 'hi' ? 'व्हाट्सएप ग्रुप से जुड़ें' : 'Join WhatsApp')}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Trust Banner */}
        <div className="bg-[#7A2A1E] text-white rounded-2xl p-4 sm:p-5 border-2 border-[#D4A017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-[#7A2A1E] flex items-center justify-center font-black shrink-0 shadow">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-[#D4A017]">
                {lang === 'hi' ? 'MP परीक्षा सेतु ऑफिशियल डिस्कशन फोरम' : 'MP Pariksha Setu Official Discussion Hub'}
              </h4>
              <p className="text-xs text-[#EAD8B1] font-medium">
                {lang === 'hi'
                  ? 'सभी सोशल चैनलों पर केवल प्रामाणिक व म.प्र. शासन भर्ती कैलेंडर आधारित अध्ययन सामग्री ही साझा की जाती है।'
                  : 'Only verified study material aligned with MP Govt examination syllabus is published.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#5E1F16] hover:bg-[#963E2F] rounded-xl text-white border border-[#D4A017]/40 transition"
              title="Facebook"
            >
              <Facebook className="w-4 h-4 text-[#D4A017]" />
            </a>
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#5E1F16] hover:bg-[#963E2F] rounded-xl text-white border border-[#D4A017]/40 transition"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 text-[#D4A017]" />
            </a>
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#5E1F16] hover:bg-[#963E2F] rounded-xl text-white border border-[#D4A017]/40 transition"
              title="Telegram"
            >
              <Send className="w-4 h-4 text-[#D4A017]" />
            </a>
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#5E1F16] hover:bg-[#963E2F] rounded-xl text-white border border-[#D4A017]/40 transition"
              title="YouTube"
            >
              <Youtube className="w-4 h-4 text-[#D4A017]" />
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#5E1F16] hover:bg-[#963E2F] rounded-xl text-white border border-[#D4A017]/40 transition"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#D4A017]" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
