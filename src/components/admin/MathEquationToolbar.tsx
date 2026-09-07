import React, { useState } from 'react';
import { 
  Calculator, 
  Pi, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Plus, 
  Sigma,
  Eye
} from 'lucide-react';
import { MathFormattedText } from '../common/MathFormattedText';

interface MathEquationToolbarProps {
  onInsert: (symbolOrTemplate: string) => void;
  compact?: boolean;
  title?: string;
  previewText?: string;
}

export const MathEquationToolbar: React.FC<MathEquationToolbarProps> = ({
  onInsert,
  compact = false,
  title = 'गणित सूत्र व समीकरण टूलबार (Math & Equation Bar)',
  previewText
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(!compact);
  const [activeCategory, setActiveCategory] = useState<'powers' | 'operators' | 'geometry' | 'templates'>('powers');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const handleSymbolClick = (sym: string) => {
    onInsert(sym);
    setCopiedSymbol(sym);
    setTimeout(() => setCopiedSymbol(null), 1200);
  };

  // Groups of symbols
  const SYMBOL_GROUPS = {
    powers: [
      { label: 'x²', insert: 'x²', desc: 'वर्ग (Square)' },
      { label: 'x³', insert: 'x³', desc: 'घन (Cube)' },
      { label: 'xⁿ', insert: 'xⁿ', desc: 'घात (Power n)' },
      { label: 'x^y', insert: '^{2}', desc: 'कस्टम घात' },
      { label: 'x_n', insert: '_{1}', desc: 'पाद (Subscript)' },
      { label: '√x', insert: '√x', desc: 'वर्गमूल (Square Root)' },
      { label: '∛x', insert: '∛x', desc: 'घनमूल (Cube Root)' },
      { label: '√(a+b)', insert: '√(a+b)', desc: 'व्यंजक वर्गमूल' },
      { label: '½', insert: '½', desc: 'आधा (Half)' },
      { label: '⅓', insert: '⅓', desc: 'एक तिहाई' },
      { label: '¼', insert: '¼', desc: 'एक चौथाई' },
      { label: '¾', insert: '¾', desc: 'तीन चौथाई' },
      { label: 'a/b', insert: '(a/b)', desc: 'भिन्न (Fraction)' },
      { label: '\\frac{a}{b}', insert: '\\frac{a}{b}', desc: 'स्टैक्ड भिन्न' },
    ],
    operators: [
      { label: '±', insert: '±', desc: 'प्लस-माइनस' },
      { label: '×', insert: '×', desc: 'गुणा' },
      { label: '÷', insert: '÷', desc: 'भाग' },
      { label: '≠', insert: '≠', desc: 'बराबर नहीं' },
      { label: '≈', insert: '≈', desc: 'लगभग बराबर' },
      { label: '≤', insert: '≤', desc: 'छोटा या बराबर' },
      { label: '≥', insert: '≥', desc: 'बड़ा या बराबर' },
      { label: '%', insert: '%', desc: 'प्रतिशत' },
      { label: '∝', insert: '∝', desc: 'समानुपाती' },
      { label: '∞', insert: '∞', desc: 'अनंत (Infinity)' },
      { label: '∑', insert: '∑', desc: 'योग (Summation)' },
      { label: '∫', insert: '∫', desc: 'समाकलन (Integral)' },
      { label: '₹', insert: '₹', desc: 'रुपया' },
    ],
    geometry: [
      { label: 'π', insert: 'π', desc: 'पाई (Pi = 22/7)' },
      { label: 'θ', insert: 'θ', desc: 'थीटा (कोण)' },
      { label: 'α', insert: 'α', desc: 'अल्फा' },
      { label: 'β', insert: 'β', desc: 'बीटा' },
      { label: 'γ', insert: 'γ', desc: 'गामा' },
      { label: 'Δ', insert: 'Δ', desc: 'डेल्टा / अंतर' },
      { label: '∠', insert: '∠', desc: 'कोण (Angle)' },
      { label: '°', insert: '°', desc: 'डिग्री (अंश)' },
      { label: '⊥', insert: '⊥', desc: 'लंबवत (Perpendicular)' },
      { label: '∥', insert: '∥', desc: 'समानांतर (Parallel)' },
      { label: '△', insert: '△', desc: 'त्रिभुज' },
      { label: 'cm²', insert: 'cm²', desc: 'वर्ग सेंटीमीटर' },
      { label: 'm²', insert: 'm²', desc: 'वर्ग मीटर' },
      { label: 'm³', insert: 'm³', desc: 'घन मीटर' },
      { label: 'km/h', insert: 'km/h', desc: 'किमी/घंटा' },
    ],
    templates: [
      { 
        name: 'द्विघात समीकरण', 
        template: 'ax² + bx + c = 0',
        desc: 'Quadratic Equation'
      },
      { 
        name: 'श्रीधराचार्य सूत्र', 
        template: 'x = [-b ± √(b² - 4ac)] / 2a',
        desc: 'Quadratic Formula'
      },
      { 
        name: 'पाइथागोरस प्रमेय', 
        template: 'कर्ण² = आधार² + लम्ब²',
        desc: 'Pythagoras: c² = a² + b²'
      },
      { 
        name: 'वृत्त का क्षेत्रफल', 
        template: 'A = πr²',
        desc: 'Area of Circle'
      },
      { 
        name: 'वृत्त की परिधि', 
        template: 'C = 2πr',
        desc: 'Circumference of Circle'
      },
      { 
        name: 'त्रिभुज क्षेत्रफल', 
        template: 'क्षेत्रफल = ½ × आधार × ऊंचाई',
        desc: 'Area = 1/2 * b * h'
      },
      { 
        name: 'साधारण ब्याज (SI)', 
        template: 'SI = (P × R × T) / 100',
        desc: 'Simple Interest'
      },
      { 
        name: 'चक्रवृद्धि ब्याज (CI)', 
        template: 'A = P(1 + R/100)ⁿ',
        desc: 'Compound Amount'
      },
      { 
        name: 'लाभ प्रतिशत', 
        template: 'लाभ% = (लाभ / क्रय मूल्य) × 100',
        desc: 'Profit Percentage'
      },
      { 
        name: 'हानि प्रतिशत', 
        template: 'हानि% = (हानि / क्रय मूल्य) × 100',
        desc: 'Loss Percentage'
      },
      { 
        name: 'चाल, दूरी व समय', 
        template: 'चाल = दूरी / समय',
        desc: 'Speed = Distance / Time'
      },
      { 
        name: 'औसत सूत्र', 
        template: 'औसत = (राशियों का कुल योग) / (राशियों की संख्या)',
        desc: 'Average Formula'
      },
      { 
        name: 'सर्वसमिका (a+b)²', 
        template: '(a + b)² = a² + 2ab + b²',
        desc: 'Identity (a+b)^2'
      },
      { 
        name: 'सर्वसमिका a²-b²', 
        template: 'a² - b² = (a + b)(a - b)',
        desc: 'Difference of Squares'
      },
    ]
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-2xl p-3 shadow-2xs transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>{title}</span>
              {copiedSymbol && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> जोड़ा गया
                </span>
              )}
            </span>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              क्लिक करें — चिन्ह कर्सर वाली जगह तुरंत जुड़ जाएगा
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1 cursor-pointer transition"
        >
          <span>{isOpen ? 'टूल छिपाएँ' : 'सिंबल दिखाएँ'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div className="mt-3 space-y-2.5 pt-2.5 border-t border-stone-200 dark:border-stone-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveCategory('powers')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'powers'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              घातांक, मूल व भिन्न (x², √, ½)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('operators')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'operators'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              संक्रियाएँ (±, ×, ÷, ≠, ≤)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('geometry')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'geometry'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              ज्यामिति व त्रिकोणमिति (π, θ, °, Δ)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('templates')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'templates'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              1-क्लिक सूत्र टेम्पलेट्स (Formulas)
            </button>
          </div>

          {/* Symbols Grid */}
          {activeCategory !== 'templates' ? (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white dark:bg-stone-950/60 rounded-xl border border-stone-200 dark:border-stone-800">
              {SYMBOL_GROUPS[activeCategory].map((sym, idx) => (
                <button
                  key={`${sym.label}_${idx}`}
                  type="button"
                  onClick={() => handleSymbolClick(sym.insert)}
                  title={`${sym.desc} — क्लिक कर जोड़ें`}
                  className="px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-300 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span className="text-sm font-bold">{sym.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white dark:bg-stone-950/60 rounded-xl border border-stone-200 dark:border-stone-800">
              {SYMBOL_GROUPS.templates.map((tpl, idx) => (
                <button
                  key={`tpl_${idx}`}
                  type="button"
                  onClick={() => handleSymbolClick(` ${tpl.template} `)}
                  title={`क्लिक कर पूरा सूत्र जोड़ें: ${tpl.template}`}
                  className="p-2 text-left bg-stone-50 dark:bg-stone-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/50 border border-stone-200 dark:border-stone-700 rounded-xl transition cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-800 dark:text-amber-400 group-hover:underline">
                      {tpl.name}
                    </span>
                    <Plus className="w-3 h-3 text-stone-400 group-hover:text-amber-600" />
                  </div>
                  <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5 truncate">
                    {tpl.template}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Live Preview if previewText is supplied */}
          {previewText && previewText.trim() && (
            <div className="mt-2 p-2 bg-amber-50/50 dark:bg-stone-950/40 border border-amber-200/60 dark:border-stone-800 rounded-xl">
              <div className="flex items-center gap-1 text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
                <Eye className="w-3 h-3" />
                <span>लाइव गणित प्रीव्यू (Student View Preview):</span>
              </div>
              <div className="text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-100 dark:border-stone-800">
                <MathFormattedText text={previewText} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
