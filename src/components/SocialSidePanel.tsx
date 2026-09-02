import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Send, 
  MessageCircle, 
  ExternalLink, 
  Sparkles, 
  X, 
  Flame, 
  ChevronRight, 
  ChevronLeft,
  Heart,
  MessageSquare,
  Share2,
  Play,
  CheckCircle2,
  TrendingUp,
  Volume2,
  Radio,
  Clock,
  Eye,
  Award
} from 'lucide-react';

interface SocialFeedItem {
  id: string;
  platform: 'facebook' | 'instagram' | 'telegram' | 'youtube';
  author: string;
  handle: string;
  timeAgoHi: string;
  timeAgoEn: string;
  badgeHi?: string;
  badgeEn?: string;
  contentHi: string;
  contentEn: string;
  mediaType?: 'image' | 'video' | 'poll' | 'tip';
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  urlSuffix?: string;
  pollOptions?: { text: string; votesPercent: number }[];
}

export const SocialSidePanel: React.FC = () => {
  const { lang, platformSettings, showToast, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activePlatformFilter, setActivePlatformFilter] = useState<'all' | 'facebook' | 'instagram' | 'telegram'>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedFeedItem, setExpandedFeedItem] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(3);

  const tickerContainerRef = useRef<HTMLDivElement>(null);

  const fbUrl = platformSettings?.facebookUrl || 'https://facebook.com/groups/mpparikshasetu';
  const instaUrl = platformSettings?.instagramUrl || 'https://instagram.com/mpparikshasetu_official';
  const tgUrl = platformSettings?.telegramUrl || 'https://t.me/mpparikshasetu_mp';
  const ytUrl = platformSettings?.youtubeUrl || 'https://youtube.com/@mpparikshasetu';
  const waUrl = platformSettings?.whatsappCommunityUrl || 'https://chat.whatsapp.com/mpparikshasetu';

  // Live Sample Stream of Facebook Posts, Instagram Reels, MP GK Shorts & Polls
  const FEED_ITEMS: SocialFeedItem[] = [
    {
      id: 'fb-1',
      platform: 'facebook',
      author: 'MP Pariksha Setu Official Group',
      handle: 'facebook.com/groups/mpparikshasetu',
      timeAgoHi: '12 मिनट पहले',
      timeAgoEn: '12 mins ago',
      badgeHi: '🔥 ट्रेंडिंग पोस्ट',
      badgeEn: 'Trending Post',
      contentHi: '📢 MP समूह-02 (पटवारी 2026) के लिए सामान्य प्रबंधन (General Management) और ग्रामीण अर्थव्यवस्था के 100 अतिमहत्वपूर्ण पिछले वर्षों के प्रश्न उत्तर सहित पीडीएफ ग्रुप में अपलोड कर दी गई है। सभी साथी तुरंत डाउनलोड करें!',
      contentEn: 'General Management & Rural Economy PYQs PDF for MP Patwari 2026 has been uploaded in our Facebook Study Group!',
      mediaType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      likesCount: 342,
      commentsCount: 89,
      tags: ['#MPPatwari2026', '#GeneralManagement', '#StudyGroup'],
      urlSuffix: fbUrl
    },
    {
      id: 'insta-1',
      platform: 'instagram',
      author: '@mpparikshasetu_official',
      handle: 'instagram.com/mpparikshasetu_official',
      timeAgoHi: '25 मिनट पहले',
      timeAgoEn: '25 mins ago',
      badgeHi: '⚡ 60s GK रील ट्रिक',
      badgeEn: '60s Reel Trick',
      contentHi: '🎯 ट्रिक: "मध्यप्रदेश की नदियाँ व उनके उद्गम स्थल" याद करने का सुपर फॉर्मूला! अमरकंटक से निकलने वाली 3 प्रमुख नदियाँ (नर्मदा, सोन, जोहिला) याद रखें। पूरा वीडियो बायो में देखें 🎬',
      contentEn: 'Trick to memorize MP River origins: Narmada, Son, and Johila originate from Amarkantak! Watch the 60s reel on Instagram.',
      mediaType: 'video',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      likesCount: 1250,
      commentsCount: 144,
      tags: ['#MPGKTricks', '#InstagramReels', '#MPPSC2026'],
      urlSuffix: instaUrl
    },
    {
      id: 'fb-2',
      platform: 'facebook',
      author: 'MP Pariksha Setu Page',
      handle: 'facebook.com/mpparikshasetu',
      timeAgoHi: '1 घंटा पहले',
      timeAgoEn: '1 hr ago',
      badgeHi: '📊 लाइव पोल',
      badgeEn: 'Live Poll',
      contentHi: '❓ आज का परीक्षा प्रश्न: मध्य प्रदेश का पहला जैव आरक्षित मंडल (Biosphere Reserve) कौन सा है?',
      contentEn: 'Daily MP GK Question: Which is the first Biosphere Reserve in Madhya Pradesh?',
      mediaType: 'poll',
      likesCount: 521,
      commentsCount: 230,
      tags: ['#DailyPoll', '#MPGK', '#PoliceSI'],
      pollOptions: [
        { text: 'पचमढ़ी (Pachmarhi - 1999)', votesPercent: 78 },
        { text: 'पन्ना (Panna)', votesPercent: 12 },
        { text: 'अचानकमार-अमरकंटक', votesPercent: 10 }
      ],
      urlSuffix: fbUrl
    },
    {
      id: 'insta-2',
      platform: 'instagram',
      author: '@mpparikshasetu_official',
      handle: 'instagram.com/mpparikshasetu_official',
      timeAgoHi: '2 घंटे पहले',
      timeAgoEn: '2 hrs ago',
      badgeHi: '🏆 टॉपर की सलाह',
      badgeEn: 'Topper Tips',
      contentHi: '💡 2024 पटवारी परीक्षा में 168 अंक लाने वाले टॉपर अमन दुबे की स्ट्रैटेजी: "रोजाना 1 फुल लेंथ मॉक टेस्ट और AI से कमजोर विषयों का रिवीजन ही सफलता की कुंजी है।"',
      contentEn: 'Topper Strategy: "Taking 1 full-length CBT mock daily and revising weak subjects with AI feedback is the key to cracking MP exams!"',
      mediaType: 'tip',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      likesCount: 980,
      commentsCount: 76,
      tags: ['#ToppersTalk', '#StudyMotivation', '#MPVyapam'],
      urlSuffix: instaUrl
    },
    {
      id: 'tg-1',
      platform: 'telegram',
      author: 'MP Pariksha Setu Channel',
      handle: 't.me/mpparikshasetu_mp',
      timeAgoHi: '3 घंटे पहले',
      timeAgoEn: '3 hrs ago',
      badgeHi: '📑 नया पीडीएफ',
      badgeEn: 'New PDF Release',
      contentHi: '📥 म.प्र. समसामयिकी (Current Affairs) पिछले 6 माह की 1500+ MCQs मैगजीन टेलीग्राम पर नि:शुल्क उपलब्ध है। लिंक पर क्लिक कर तुरंत डाउनलोड करें।',
      contentEn: 'Free MP Current Affairs 6-month magazine with 1500+ MCQs is now available on Telegram channel!',
      likesCount: 610,
      commentsCount: 42,
      tags: ['#CurrentAffairs', '#FreePDF', '#TelegramChannel'],
      urlSuffix: tgUrl
    }
  ];

  const filteredItems = FEED_ITEMS.filter(item => {
    if (activePlatformFilter === 'all') return true;
    return item.platform === activePlatformFilter;
  });

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const isAlreadyLiked = prev[id];
      const newState = { ...prev, [id]: !isAlreadyLiked };
      if (!isAlreadyLiked) {
        showToast('❤️ पोस्ट पसंद की गई!');
      }
      return newState;
    });
  };

  const handlePollVote = (optionIndex: number) => {
    if (selectedPollOption !== null) return;
    setSelectedPollOption(optionIndex);
    if (optionIndex === 0) {
      showToast('🎉 बिल्कुल सही उत्तर! पचमढ़ी (1999) पहला बायोस्फीयर रिज़र्व है।');
    } else {
      showToast('❌ सही उत्तर "पचमढ़ी (1999)" है। अगली बार बेहतर प्रयास करें!');
    }
  };

  const handleSharePost = (item: SocialFeedItem) => {
    const text = `${item.contentHi}\n\n👉 म.प्र. परीक्षा सेतु के ऑफिशियल सोशल चैनल से जुड़ें: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: item.author,
        text: text,
        url: item.urlSuffix || window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('📋 पोस्ट का टेक्स्ट व लिंक क्लिपबोर्ड में कॉपी हो गया!');
    }
  };

  const openChannel = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING SIDE TAB TRIGGER (Docked on Right Edge) */}
      {/* ========================================================================= */}
      <div 
        id="floating-social-side-tab"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end pointer-events-auto"
      >
        {/* Continuous Scrolling Live Ticker Pill (Vertical mini ticker preview) */}
        {!isOpen && (
          <div 
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="group cursor-pointer bg-[#7A2A1E] dark:bg-stone-900 border-l-2 border-y-2 border-[#D4A017] rounded-l-2xl shadow-2xl p-2.5 sm:p-3 hover:bg-[#5E1F16] dark:hover:bg-stone-800 transition-all duration-300 transform hover:-translate-x-1 flex flex-col items-center gap-2 max-w-[56px] sm:max-w-[64px]"
            title="लाइव सोशल मीडिया फीड खोलें (Facebook & Instagram Live Updates)"
          >
            {/* Live Indicator Pulse */}
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>

            {/* Social Icons Stack */}
            <div className="flex flex-col gap-1.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <Instagram className="w-4 h-4" />
              </div>
            </div>

            {/* Vertical Hindi Text */}
            <div className="writing-vertical-rl text-[11px] font-black text-[#D4A017] tracking-wider py-1 select-none flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse rotate-90" />
              <span>लाइव सोशल</span>
            </div>

            {/* Unread updates pill */}
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[9px] font-black animate-bounce shadow">
                {unreadCount} नई
              </span>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. EXPANDED SLIDE-OUT SOCIAL MEDIA SIDE PANEL (Drawer) */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop with smooth blur */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container */}
          <div 
            className="relative w-full max-w-md sm:max-w-lg bg-stone-50 dark:bg-stone-900 border-l-4 border-[#D4A017] shadow-2xl flex flex-col h-full z-10 animate-slideLeft overflow-hidden"
          >
            {/* Top Cultural Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#7A2A1E] via-[#8E3224] to-[#5E1F16] text-white border-b-2 border-[#D4A017] shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D4A017] text-stone-950 flex items-center justify-center font-black shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base sm:text-lg text-white leading-tight flex items-center gap-2">
                      <span>लाइव सोशल मीडिया फ़ीड</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono animate-pulse">
                        LIVE
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#EAD8B1] font-medium">
                      Facebook & Instagram के ताज़ा अपडेट्स व रील्स
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20 cursor-pointer"
                  title="पैनल बंद करें (Close)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Direct Channel Links Strip */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
                <button
                  onClick={() => openChannel(fbUrl)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#1877F2] text-white font-bold text-[11px] hover:brightness-110 shadow-xs transition"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>फेसबुक</span>
                </button>
                <button
                  onClick={() => openChannel(instaUrl)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-[11px] hover:brightness-110 shadow-xs transition"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>इंस्टा</span>
                </button>
                <button
                  onClick={() => openChannel(tgUrl)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#229ED9] text-white font-bold text-[11px] hover:brightness-110 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>टेलीग्राम</span>
                </button>
                <button
                  onClick={() => openChannel(ytUrl)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#FF0000] text-white font-bold text-[11px] hover:brightness-110 shadow-xs transition"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>यूट्यूब</span>
                </button>
              </div>

              {/* Platform Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                <button
                  onClick={() => setActivePlatformFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    activePlatformFilter === 'all'
                      ? 'bg-[#D4A017] text-stone-950 shadow-xs'
                      : 'bg-black/30 text-stone-200 hover:bg-black/50 border border-white/10'
                  }`}
                >
                  🌐 सभी अपडेट्स ({FEED_ITEMS.length})
                </button>
                <button
                  onClick={() => setActivePlatformFilter('facebook')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1 ${
                    activePlatformFilter === 'facebook'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-black/30 text-stone-200 hover:bg-black/50 border border-white/10'
                  }`}
                >
                  <Facebook className="w-3 h-3" />
                  <span>फेसबुक ({FEED_ITEMS.filter(f => f.platform === 'facebook').length})</span>
                </button>
                <button
                  onClick={() => setActivePlatformFilter('instagram')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1 ${
                    activePlatformFilter === 'instagram'
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-xs'
                      : 'bg-black/30 text-stone-200 hover:bg-black/50 border border-white/10'
                  }`}
                >
                  <Instagram className="w-3 h-3" />
                  <span>इंस्टाग्राम ({FEED_ITEMS.filter(f => f.platform === 'instagram').length})</span>
                </button>
                <button
                  onClick={() => setActivePlatformFilter('telegram')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1 ${
                    activePlatformFilter === 'telegram'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-black/30 text-stone-200 hover:bg-black/50 border border-white/10'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>टेलीग्राम</span>
                </button>
              </div>
            </div>

            {/* Scrolling Pattern Banner with Pause/Play Indicator */}
            <div className="px-4 py-2 bg-amber-100 dark:bg-stone-800/80 border-b border-amber-200 dark:border-stone-700 flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2 font-bold text-[11px]">
                <TrendingUp className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
                <span>लाइव स्क्रोलिंग फ़ीड (ऑटो-अपडेट सक्रिय)</span>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:bg-stone-100"
              >
                {isPaused ? '▶️ ऑटो-स्क्रॉल चालू करें' : '⏸️ रोकें (Pause)'}
              </button>
            </div>

            {/* Feed Cards Stream Container with Scrolling Effect */}
            <div 
              ref={tickerContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-stone-200/60 dark:divide-stone-800"
            >
              {filteredItems.map((item) => {
                const isFacebook = item.platform === 'facebook';
                const isInstagram = item.platform === 'instagram';
                const isTelegram = item.platform === 'telegram';
                const isLiked = !!likedPosts[item.id];
                const currentLikes = item.likesCount + (isLiked ? 1 : 0);

                return (
                  <div 
                    key={item.id}
                    className="pt-4 first:pt-0 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition duration-200 space-y-3"
                  >
                    {/* Post Header (Author, Badge, Time) */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 ${
                          isFacebook ? 'bg-blue-600' :
                          isInstagram ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' :
                          'bg-sky-500'
                        }`}>
                          {isFacebook && <Facebook className="w-5 h-5" />}
                          {isInstagram && <Instagram className="w-5 h-5" />}
                          {isTelegram && <Send className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white leading-tight">
                              {item.author}
                            </h4>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                            <span>{item.timeAgoHi}</span>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">{item.handle}</span>
                          </div>
                        </div>
                      </div>

                      {item.badgeHi && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          isFacebook ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200' :
                          isInstagram ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200' :
                          'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200'
                        }`}>
                          {item.badgeHi}
                        </span>
                      )}
                    </div>

                    {/* Content Text */}
                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                      {lang === 'hi' ? item.contentHi : item.contentEn}
                    </p>

                    {/* Media Thumbnail / Reel Video Preview */}
                    {item.imageUrl && (
                      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950 group">
                        <img 
                          src={item.imageUrl} 
                          alt="Post Media" 
                          className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                        />
                        {item.mediaType === 'video' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                              <Play className="w-6 h-6 fill-rose-600 ml-1" />
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-bold">
                              0:59 Reel
                            </span>
                          </div>
                        )}
                        {isInstagram && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-black shadow flex items-center gap-1">
                            <Instagram className="w-3 h-3" />
                            <span>Instagram Reel</span>
                          </div>
                        )}
                        {isFacebook && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#1877F2] text-white text-[9px] font-black shadow flex items-center gap-1">
                            <Facebook className="w-3 h-3" />
                            <span>Facebook Update</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Poll Block */}
                    {item.mediaType === 'poll' && item.pollOptions && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-stone-800 border-2 border-amber-200 dark:border-stone-700 space-y-2">
                        <span className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-wider block">
                          🗳️ अपना उत्तर चुनें (Click to Vote):
                        </span>
                        <div className="space-y-1.5">
                          {item.pollOptions.map((opt, idx) => {
                            const isSelected = selectedPollOption === idx;
                            const isVoted = selectedPollOption !== null;
                            const isCorrect = idx === 0;

                            return (
                              <button
                                key={idx}
                                onClick={() => handlePollVote(idx)}
                                disabled={isVoted}
                                className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between border ${
                                  isSelected
                                    ? isCorrect 
                                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                      : 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200'
                                    : isVoted && isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-amber-500'
                                }`}
                              >
                                <span>{opt.text}</span>
                                {isVoted && (
                                  <span className="font-mono text-[11px] font-black">
                                    {opt.votesPercent}%
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Hash Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar (Like, Comments, Share, Open Channel) */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(item.id)}
                          className={`flex items-center gap-1.5 font-bold transition px-2 py-1 rounded-lg ${
                            isLiked 
                              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' 
                              : 'text-stone-500 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                          <span className="font-mono">{currentLikes}</span>
                        </button>

                        <button
                          onClick={() => openChannel(item.urlSuffix || fbUrl)}
                          className="flex items-center gap-1.5 font-bold text-stone-500 hover:text-blue-600 hover:bg-stone-100 dark:hover:bg-stone-800 px-2 py-1 rounded-lg transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-mono">{item.commentsCount}</span>
                        </button>

                        <button
                          onClick={() => handleSharePost(item)}
                          className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-white transition"
                          title="शेयर करें (Share Post)"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Direct Link to View on Platform */}
                      <button
                        onClick={() => openChannel(item.urlSuffix || (isFacebook ? fbUrl : instaUrl))}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs text-white shadow-xs transition ${
                          isFacebook ? 'bg-[#1877F2] hover:bg-[#0c63d4]' :
                          isInstagram ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700' :
                          'bg-[#229ED9] hover:bg-[#1a85b9]'
                        }`}
                      >
                        <span>{isFacebook ? 'फेसबुक पर देखें' : isInstagram ? 'रील्स देखें' : 'टेलीग्राम खोलें'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Callout Bar */}
            <div className="p-4 bg-white dark:bg-stone-950 border-t-2 border-[#EAD8B1] dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
                <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                <span>दैनिक 10+ फ्री क्विज व पीडीएफ अपडेट्स</span>
              </div>

              <button
                onClick={() => {
                  const shareUrl = window.location.origin;
                  if (navigator.share) {
                    navigator.share({
                      title: 'MP Pariksha Setu',
                      text: 'मध्य प्रदेश प्रतियोगी परीक्षा तैयारी के लिए आज ही जुड़ें!',
                      url: shareUrl
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    showToast('🔗 पोर्टल लिंक कॉपी हो गया!');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-[#7A2A1E] text-[#D4A017] hover:bg-[#5E1F16] font-black text-xs border border-[#D4A017] shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>मित्रों को जोड़ें</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
