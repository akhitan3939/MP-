/**
 * XP & Gamification System for MP Pariksha Setu
 * Implements rewards for correct answers (+10 XP), penalties for wrong answers (-5 XP),
 * streak multipliers, level tiers, and coupon redemption.
 */

export interface XpBreakdown {
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  correctXp: number;
  penaltyXp: number;
  streakBonus: number;
  speedBonus: number;
  netXp: number;
}

export interface XpTier {
  level: number;
  titleHi: string;
  titleEn: string;
  minXp: number;
  maxXp: number;
  badge: string;
  color: string;
  perksHi: string;
  perksEn: string;
}

export const XP_TIERS: XpTier[] = [
  {
    level: 1,
    titleHi: 'आरंभिक पटवारी / कांस्टेबल अभ्यर्थी',
    titleEn: 'Aspirant (Cadet)',
    minXp: 0,
    maxXp: 499,
    badge: '🥉 आरंभिक',
    color: 'from-amber-600 to-amber-800',
    perksHi: 'सभी निःशुल्क मॉक टेस्ट व 5 हस्तलिखित ई-नोट्स',
    perksEn: 'Access to free tests & 5 E-notes'
  },
  {
    level: 2,
    titleHi: 'नायब तहसीलदार (Officer Grade)',
    titleEn: 'Naib Tehsildar (Officer)',
    minXp: 500,
    maxXp: 1499,
    badge: '🥈 अधिकारी',
    color: 'from-blue-600 to-indigo-800',
    perksHi: '₹50 कूपन रिडीम, ऑल-एमपी स्टेट रैंक व लीडरबोर्ड फ़ीचर',
    perksEn: '₹50 Coupon redemption, State Rank & Live Leaderboard'
  },
  {
    level: 3,
    titleHi: 'डिप्टी कलेक्टर (State Ranker)',
    titleEn: 'Deputy Collector (Top Ranker)',
    minXp: 1500,
    maxXp: 3499,
    badge: '🥇 टॉप रेंकर',
    color: 'from-emerald-600 to-teal-800',
    perksHi: '₹100 कूपन रिडीम, विशेष AI व्याख्या व प्राथमिकता सपोर्ट',
    perksEn: '₹100 Coupon, Advanced AI explanations & priority support'
  },
  {
    level: 4,
    titleHi: 'IAS / SDM (Legendary Scholar)',
    titleEn: 'IAS / SDM (Legendary)',
    minXp: 3500,
    maxXp: 999999,
    badge: '👑 लेजेंडरी',
    color: 'from-purple-600 to-amber-600',
    perksHi: '₹200 कूपन रिडीम, VIP परीक्षा हॉल व 100% मेरिट स्कॉलरशिप',
    perksEn: '₹200 Coupon, VIP Hall & Merit Scholarship eligibility'
  }
];

export function getTierForXp(xp: number): XpTier {
  const safeXp = Math.max(0, xp);
  const found = XP_TIERS.slice().reverse().find(tier => safeXp >= tier.minXp);
  return found || XP_TIERS[0];
}

export function getNextTierProgress(xp: number): {
  currentTier: XpTier;
  nextTier: XpTier | null;
  progressPercent: number;
  xpNeeded: number;
} {
  const currentTier = getTierForXp(xp);
  const nextTierIndex = XP_TIERS.findIndex(t => t.level === currentTier.level + 1);
  const nextTier = nextTierIndex !== -1 ? XP_TIERS[nextTierIndex] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      xpNeeded: 0
    };
  }

  const range = nextTier.minXp - currentTier.minXp;
  const currentInRange = xp - currentTier.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  const xpNeeded = Math.max(0, nextTier.minXp - xp);

  return {
    currentTier,
    nextTier,
    progressPercent,
    xpNeeded
  };
}

/**
 * Calculate detailed XP Breakdown for a test attempt:
 * - Correct: +10 XP each
 * - Incorrect: -5 XP penalty each (Requested by user)
 * - Streak bonus: +25 XP (if streak >= 3)
 * - Speed & Accuracy bonus: +15 XP (if accuracy >= 70%)
 */
export function calculateAttemptXp(params: {
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  streak?: number;
  durationSeconds: number;
  totalQuestions: number;
}): XpBreakdown {
  const { correctCount, incorrectCount, unattemptedCount, streak = 1 } = params;

  const correctXp = correctCount * 10;
  const penaltyXp = incorrectCount * 5; // Negative penalty for wrong answer

  let streakBonus = 0;
  if (streak >= 7) streakBonus = 50;
  else if (streak >= 3) streakBonus = 25;

  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;
  let speedBonus = 0;
  if (accuracy >= 75) speedBonus = 20;
  else if (accuracy >= 60) speedBonus = 10;

  // Net XP cannot reduce user below -50 for a single test
  const rawNet = correctXp - penaltyXp + streakBonus + speedBonus;
  const netXp = Math.max(-50, rawNet);

  return {
    correctCount,
    incorrectCount,
    unattemptedCount,
    correctXp,
    penaltyXp,
    streakBonus,
    speedBonus,
    netXp
  };
}
