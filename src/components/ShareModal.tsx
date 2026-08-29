import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Gift, 
  Send, 
  QrCode, 
  Award,
  Flame,
  MessageCircle
} from 'lucide-react';
import { AudioAlert } from '../utils/audioAlert';

export const ShareModal: React.FC = () => {
  const { 
    isShareModalOpen, 
    closeShareModal, 
    shareModalParams, 
    currentUser, 
    lang, 
    awardXp, 
    showToast 
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);
  const [hasEarnedShareXp, setHasEarnedShareXp] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  if (!isShareModalOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://mp-pariksha-setu.web.app';
  const referralCode = currentUser?.username || currentUser?.id?.substring(0, 8) || 'MPSETU2026';
  const shareUrl = shareModalParams?.url 
    ? `${shareModalParams.url}${shareModalParams.url.includes('?') ? '&' : '?'}ref=${referralCode}`
    : `${currentOrigin}/?ref=${referralCode}`;

  const testTitle = shareModalParams?.seriesTitle || 'मध्यप्रदेश शासन भर्ती 2026 मॉक टेस्ट';
  const score = shareModalParams?.score !== undefined ? shareModalParams.score : null;
  const total = shareModalParams?.totalMarks !== undefined ? shareModalParams.totalMarks : null;
  const rank = shareModalParams?.rank !== undefined ? shareModalParams.rank : null;

  // Viral Challenge Pre-filled Text
  const shareTextHi = score !== null && total !== null
    ? `🎯 मैंने *MP परीक्षा सेतु* पर ${testTitle} में ${total} में से ${score} अंक प्राप्त किए${rank ? ` (ऑल-एमपी रैंक: #${rank})` : ''}!\n\nक्या आप 55 जिलों के अभ्यर्थियों के बीच मुझसे बेहतर स्कोर कर सकते हैं? 🏆\n\n👉 अभी अपना फ्री मॉक टेस्ट दें और ऑल-एमपी रैंक देखें:\n${shareUrl}`
    : `🏛️ *MP परीक्षा सेतु* — मध्यप्रदेश पटवारी, MPPSC, पुलिस आरक्षक व समूह-2 भर्ती परीक्षाओं के लिए 100% नवीनतम CBT मॉक टेस्ट पोर्टल!\n\n✨ 20 फुल मॉक सेट्स • ऑल-एमपी लाइव मेरिट रैंक • AI विस्तृत रिपोर्ट • हस्तलिखित ई-नोट्स PDF\n\n👉 अभी फ्री टेस्ट दें और अपनी तैयारी परखें:\n${shareUrl}`;

  const shareTextEn = score !== null && total !== null
    ? `🎯 I scored ${score}/${total} in ${testTitle} on MP Pariksha Setu${rank ? ` (State Rank: #${rank})` : ''}!\nCan you beat my score?\n👉 Take your free mock test now:\n${shareUrl}`
    : `🏛️ MP Pariksha Setu — Premium CBT Mock Test Simulator for MP Govt Exams (Patwari, MPPSC, Police & Group-2)!\n👉 Join now:\n${shareUrl}`;

  const defaultShareText = lang === 'hi' ? shareTextHi : shareTextEn;

  const handleRewardXp = () => {
    if (!hasEarnedShareXp) {
      setHasEarnedShareXp(true);
      AudioAlert.playXpGainSound();
      awardXp(50, 'वायरल शेयर बोनस (+50 XP)');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(defaultShareText);
    setCopied(true);
    handleRewardXp();
    showToast(lang === 'hi' ? '📋 शेयर संदेश व लिंक कॉपी हो गया! (+50 XP रिवॉर्ड मिला 🎉)' : '📋 Link copied! (+50 XP awarded 🎉)');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    handleRewardXp();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultShareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleTelegramShare = () => {
    handleRewardXp();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(lang === 'hi' ? `🎯 MP परीक्षा सेतु - ${testTitle}` : `🎯 MP Pariksha Setu - ${testTitle}`)}`;
    window.open(tgUrl, '_blank');
  };

  const handleTwitterShare = () => {
    handleRewardXp();
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultShareText)}`;
    window.open(twUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MP Pariksha Setu',
          text: defaultShareText,
          url: shareUrl,
        });
        handleRewardXp();
        showToast(lang === 'hi' ? '🎉 सफलतापूर्वक शेयर किया गया! (+50 XP)' : '🎉 Shared successfully! (+50 XP)');
      } catch (e) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Reward Badge */}
        <div className="bg-gradient-to-r from-[#7A2A1E] via-[#963E2F] to-[#7A2A1E] text-white p-6 relative">
          <button 
            onClick={closeShareModal}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-stone-950 font-black text-xs rounded-full shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'शेयर करें & +50 XP पाएँ' : 'Share & Earn +50 XP'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {lang === 'hi' ? 'दोस्तों को चैलेंज करें' : 'Challenge Aspirants'}
            </span>
          </div>

          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
            {lang === 'hi' ? 'अभ्यर्थियों के साथ शेयर करें' : 'Share with MP Aspirants'}
          </h3>
          <p className="text-xs text-amber-100/90 mt-1">
            {lang === 'hi' 
              ? 'व्हाट्सएप ग्रुप्स व टेलीग्राम चैनल्स में शेयर करके अपने साथियों को मॉक टेस्ट के लिए आमंत्रित करें।'
              : 'Share in your study groups to challenge peers and earn instant XP bonuses!'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Challenge Preview Card */}
          {score !== null && total !== null ? (
            <div className="p-4 bg-amber-50 dark:bg-stone-800/80 border-2 border-amber-300 dark:border-amber-500/40 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'आपका परीक्षा परिणाम' : 'Your Exam Result'}
                </div>
                <div className="font-display font-black text-lg text-stone-900 dark:text-white">
                  {testTitle}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  {lang === 'hi' ? `स्कोर: ${score}/${total} अंक` : `Score: ${score}/${total}`}
                  {rank && <span className="font-bold text-[#7A2A1E] dark:text-amber-400 ml-2">🏆 रैंक: #{rank}</span>}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
                🎯
              </div>
            </div>
          ) : null}

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-stone-500 dark:text-stone-400">
              {lang === 'hi' ? '1-क्लिक शेयर विकल्प' : '1-Click Fast Share'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2.5 p-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{lang === 'hi' ? 'WhatsApp पर भेजें' : 'Share to WhatsApp'}</span>
              </button>

              {/* Telegram Button */}
              <button
                onClick={handleTelegramShare}
                className="flex items-center justify-center gap-2.5 p-3.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>{lang === 'hi' ? 'Telegram पर भेजें' : 'Share to Telegram'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Twitter/X Button */}
              <button
                onClick={handleTwitterShare}
                className="flex items-center justify-center gap-2 p-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Twitter / X</span>
              </button>

              {/* Native Mobile Share Button */}
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 p-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition cursor-pointer border border-stone-300 dark:border-stone-700"
              >
                <Share2 className="w-4 h-4 text-[#7A2A1E] dark:text-amber-400" />
                <span>{lang === 'hi' ? 'अन्य ऐप्स में शेयर' : 'More Apps'}</span>
              </button>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-stone-500 dark:text-stone-400 flex items-center justify-between">
              <span>{lang === 'hi' ? 'आपका रेफरल लिंक' : 'Your Referral Link'}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                कोड: {referralCode}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-700 dark:text-stone-300 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#7A2A1E] hover:bg-[#963E2F] text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'कॉपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* QR Code Toggle */}
          <div>
            <button
              onClick={() => setShowQr(!showQr)}
              className="text-xs font-bold text-[#7A2A1E] dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQr ? (lang === 'hi' ? 'QR कोड छिपाएं' : 'Hide QR Code') : (lang === 'hi' ? 'मोबाइल स्कैन हेतु QR कोड दिखाएं' : 'Show Scan QR Code')}</span>
            </button>

            {showQr && (
              <div className="mt-3 p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-center flex flex-col items-center justify-center animate-fadeIn">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR Code"
                  className="w-36 h-36 rounded-xl border-4 border-white dark:border-stone-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 font-medium">
                  {lang === 'hi' ? 'कैमरा या गूगल लेंस से स्कैन करके सीधे पोर्टल खोलें' : 'Scan with Camera or Google Lens'}
                </p>
              </div>
            )}
          </div>

          {/* XP Reward Status Alert */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {lang === 'hi' 
                ? 'प्रत्येक शेयर पर आपको तुरंत +50 XP पॉइंट मिलते हैं जिन्हें आप छूट कूपन में बदल सकते हैं!' 
                : 'Earn +50 XP on every share to unlock exclusive fee discount coupons!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
