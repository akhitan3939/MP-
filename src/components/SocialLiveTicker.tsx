import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Send, 
  MessageCircle, 
  ExternalLink, 
  Flame, 
  Radio, 
  Sparkles, 
  Heart,
  TrendingUp
} from 'lucide-react';

export const SocialLiveTicker: React.FC = () => {
  const { lang, platformSettings, showToast } = useApp();
  const [isPaused, setIsPaused] = useState(false);

  const fbUrl = platformSettings?.facebookUrl || 'https://facebook.com/groups/mpparikshasetu';
  const instaUrl = platformSettings?.instagramUrl || 'https://instagram.com/mpparikshasetu_official';
  const tgUrl = platformSettings?.telegramUrl || 'https://t.me/mpparikshasetu_mp';
  const ytUrl = platformSettings?.youtubeUrl || 'https://youtube.com/@mpparikshasetu';

  const LIVE_SNIPPETS = [
    {
      id: 'fb-update-1',
      platform: 'facebook',
      badge: '📘 FB ग्रुप',
      title: 'पटवारी 2026 सामान्य प्रबंधन 100 अतिमहत्वपूर्ण प्रश्न PDF अपलोड',
      author: 'MP Pariksha Setu Community',
      url: fbUrl,
      time: '12 मिनट पहले'
    },
    {
      id: 'insta-reel-1',
      platform: 'instagram',
      badge: '📸 इंस्टा रील',
      title: '60s ट्रिक: MP की नदियाँ और उनके उद्गम स्थल का शॉर्टकट फॉर्मूला',
      author: '@mpparikshasetu_official',
      url: instaUrl,
      time: '25 मिनट पहले'
    },
    {
      id: 'fb-update-2',
      platform: 'facebook',
      badge: '📊 FB पोल',
      title: 'आज का लाइव प्रश्न: म.प्र. का प्रथम बायोस्फीयर रिज़र्व (78% छात्रों ने सही उत्तर दिया)',
      author: 'Daily Quiz Hub',
      url: fbUrl,
      time: '1 घंटा पहले'
    },
    {
      id: 'insta-reel-2',
      platform: 'instagram',
      badge: '🏆 टॉपर टिप्स',
      title: 'पटवारी टॉपर अमन दुबे की स्ट्रैटेजी: AI मॉक टेस्ट और कमजोर क्षेत्रों का रिवीजन',
      author: '@mpparikshasetu_official',
      url: instaUrl,
      time: '2 घंटे पहले'
    },
    {
      id: 'tg-update-1',
      platform: 'telegram',
      badge: '📑 टेलीग्राम',
      title: 'MP समसामयिकी 1500+ MCQs मैगजीन नि:शुल्क डाउनलोड के लिए उपलब्ध',
      author: 'MP Pariksha Setu Channel',
      url: tgUrl,
      time: '3 घंटे पहले'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-gradient-to-r from-[#7A2A1E] via-[#8E3224] to-[#5E1F16] border-2 border-[#D4A017] rounded-2xl p-2.5 sm:p-3 shadow-md text-white flex flex-col md:flex-row items-center gap-3 overflow-hidden">
        
        {/* Left Badge Indicator */}
        <div className="flex items-center gap-2 shrink-0 bg-[#5E1F16] px-3 py-1.5 rounded-xl border border-[#D4A017]/60 shadow-inner">
          <div className="relative">
            <span className="flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <Facebook className="w-3.5 h-3.5 text-blue-400" />
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <span className="text-xs font-black text-[#D4A017] uppercase tracking-wider whitespace-nowrap">
              {lang === 'hi' ? 'लाइव सोशल फीड' : 'Live Social Stream'}
            </span>
          </div>
        </div>

        {/* Middle Infinite Continuous Marquee Ticker */}
        <div 
          className="flex-1 overflow-hidden relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`flex items-center gap-6 whitespace-nowrap ${isPaused ? '' : 'animate-marquee'}`}>
            {[...LIVE_SNIPPETS, ...LIVE_SNIPPETS].map((snippet, idx) => (
              <a
                key={`${snippet.id}-${idx}`}
                href={snippet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FFFBF2] hover:text-[#D4A017] transition shrink-0 group bg-black/20 hover:bg-black/40 px-3 py-1 rounded-xl border border-white/10"
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  snippet.platform === 'facebook' ? 'bg-blue-600 text-white' :
                  snippet.platform === 'instagram' ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' :
                  'bg-sky-500 text-white'
                }`}>
                  {snippet.badge}
                </span>
                <span className="group-hover:underline underline-offset-2">{snippet.title}</span>
                <span className="text-[10px] font-mono text-[#EAD8B1] opacity-80">({snippet.time})</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Right CTA Links */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition hover:scale-105"
            title="Facebook Group"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:brightness-110 text-white shadow-xs transition hover:scale-105"
            title="Instagram Profile"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-xs transition hover:scale-105"
            title="Telegram Channel"
          >
            <Send className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
