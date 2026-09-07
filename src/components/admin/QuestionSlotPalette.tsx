import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  Unlock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Layers,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { Question } from '../../types';

interface QuestionSlotPaletteProps {
  mockId: string;
  mockNameHi: string;
  setNumber: number;
  targetCapacity: number;
  questionsInSet: Question[];
  onSelectSlot?: (slotNumber: number, question?: Question) => void;
  onAddNewAtSlot: (slotNumber: number) => void;
  onEditQuestion: (question: Question) => void;
  onQuickToggleLock?: (questionId: string, currentLock: boolean) => void;
  onMoveSlot?: (questionId: string, newSlotNumber: number) => void;
}

export const QuestionSlotPalette: React.FC<QuestionSlotPaletteProps> = ({
  mockId,
  mockNameHi,
  setNumber,
  targetCapacity = 100,
  questionsInSet,
  onSelectSlot,
  onAddNewAtSlot,
  onEditQuestion,
  onQuickToggleLock,
  onMoveSlot
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'filled' | 'empty' | 'locked' | 'draft'>('all');
  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState<number | null>(null);

  // 1. Build a robust Slot-to-Question map
  const { slotMap, unslottedQuestions, lockedCount, draftCount, filledCount } = useMemo(() => {
    const map = new Map<number, Question>();
    const unslotted: Question[] = [];
    let locked = 0;
    let draft = 0;

    // First, map questions that have explicit slotNumber
    questionsInSet.forEach((q) => {
      const s = q.slotNumber;
      if (s && s >= 1 && s <= targetCapacity && !map.has(s)) {
        map.set(s, q);
      } else {
        unslotted.push(q);
      }
    });

    // Fill remaining unslotted questions into available empty slots in order
    let currentSlot = 1;
    unslotted.forEach((q) => {
      while (map.has(currentSlot) && currentSlot <= targetCapacity) {
        currentSlot++;
      }
      if (currentSlot <= targetCapacity) {
        map.set(currentSlot, q);
        currentSlot++;
      } else {
        // Overflow slot
        map.set(map.size + 1, q);
      }
    });

    // Count stats
    map.forEach((q) => {
      if (q.isLocked === true) {
        locked++;
      } else {
        draft++;
      }
    });

    return {
      slotMap: map,
      unslottedQuestions: unslotted,
      lockedCount: locked,
      draftCount: draft,
      filledCount: map.size
    };
  }, [questionsInSet, targetCapacity]);

  const effectiveCapacity = Math.max(targetCapacity, slotMap.size);
  const emptyCount = Math.max(0, effectiveCapacity - filledCount);
  const completionPercent = Math.min(100, Math.round((filledCount / effectiveCapacity) * 100));

  // Generate slots array 1..effectiveCapacity
  const allSlots = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= effectiveCapacity; i++) {
      arr.push(i);
    }
    return arr;
  }, [effectiveCapacity]);

  // Filter slots based on active filterMode
  const displayedSlots = useMemo(() => {
    return allSlots.filter((slotNum) => {
      const q = slotMap.get(slotNum);
      if (filterMode === 'all') return true;
      if (filterMode === 'filled') return !!q;
      if (filterMode === 'empty') return !q;
      if (filterMode === 'locked') return q && q.isLocked === true;
      if (filterMode === 'draft') return q && !q.isLocked;
      return true;
    });
  }, [allSlots, slotMap, filterMode]);

  const activeQuestionDetail = selectedSlotForDetail ? slotMap.get(selectedSlotForDetail) : null;

  return (
    <div className="bg-white dark:bg-stone-900 border-2 border-amber-300/80 dark:border-stone-800 rounded-3xl shadow-sm overflow-hidden transition-all">
      {/* 1. Header Bar with KPI Overview and Collapse Button */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/70 via-stone-50 to-orange-50/40 dark:from-stone-900 dark:to-stone-850 border-b border-amber-200/60 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7A2A1E] text-[#D4A017] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#D4A017]" />
                <span>प्रश्न स्लॉट स्थिति पैलेट (QUESTION SLOTS PALETTE)</span>
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-mono font-black text-stone-600 dark:text-stone-300">
                SET #{setNumber}
              </span>
            </div>
            
            <h3 className="text-sm sm:text-base font-black text-[#2D2424] dark:text-white flex items-center gap-2">
              <span>{mockNameHi}</span>
              <span className="text-xs text-stone-400 font-normal">
                (स्लॉट 1 से {effectiveCapacity} का लाइव विज़ुअल ग्रिड)
              </span>
            </h3>
          </div>

          {/* Quick Collapse / Expand Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-50 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <span>{isCollapsed ? 'पैलेट विस्तार करें (Expand)' : 'पैलेट संक्षिप्त करें (Collapse)'}</span>
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* KPI Strip & Progress Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3 pt-3 border-t border-amber-200/50 dark:border-stone-800 text-xs">
          <div className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-500 font-bold block">कुल मानक क्षमता</span>
            <span className="text-base font-black font-mono text-[#2D2424] dark:text-white">
              {effectiveCapacity} Qs
            </span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>🔒 लॉक / फाइनल</span>
            </span>
            <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400">
              {lockedCount}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              <span>🔓 ड्राफ्ट / समीक्षा</span>
            </span>
            <span className="text-base font-black font-mono text-amber-700 dark:text-amber-400">
              {draftCount}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 border-dashed">
            <span className="text-[10px] text-stone-500 font-bold block flex items-center gap-1">
              <Plus className="w-3 h-3 text-stone-400" />
              <span>⚪ खाली स्लॉट (Blank)</span>
            </span>
            <span className="text-base font-black font-mono text-stone-600 dark:text-stone-300">
              {emptyCount}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-stone-500">पूर्णता दर:</span>
              <span className="font-mono font-black text-[#7A2A1E] dark:text-[#D4A017]">
                {completionPercent}%
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completionPercent >= 100 
                    ? 'bg-emerald-500' 
                    : completionPercent >= 50 
                    ? 'bg-amber-500' 
                    : 'bg-orange-500'
                }`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Palette Body (Collapsible) */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Sub-bar: Filter Buttons & Color Legend */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-stone-500 mr-1">फ़िल्टर करें:</span>
              
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#7A2A1E] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                सभी स्लॉट ({effectiveCapacity})
              </button>

              <button
                onClick={() => setFilterMode('locked')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                  filterMode === 'locked'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>लॉक ({lockedCount})</span>
              </button>

              <button
                onClick={() => setFilterMode('draft')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                  filterMode === 'draft'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                }`}
              >
                <Unlock className="w-3 h-3" />
                <span>ड्राफ्ट ({draftCount})</span>
              </button>

              <button
                onClick={() => setFilterMode('empty')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                  filterMode === 'empty'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>⚪ केवल खाली ({emptyCount})</span>
              </button>
            </div>

            {/* Visual Color Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-stone-500 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-emerald-600 shadow-xs inline-block"></span>
                <span>भरा व लॉक</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-amber-500 shadow-xs inline-block"></span>
                <span>भरा व अनलॉक</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md border border-dashed border-stone-400 bg-stone-100 dark:bg-stone-800 inline-block"></span>
                <span>खाली स्लॉट (Blank)</span>
              </div>
            </div>

          </div>

          {/* 3. The Responsive Color Matrix Grid */}
          <div className="p-3 bg-stone-50/60 dark:bg-stone-850/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 max-h-[420px] overflow-y-auto pr-1">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-1.5 sm:gap-2">
              {displayedSlots.map((slotNum) => {
                const question = slotMap.get(slotNum);
                const isOccupied = !!question;
                const isLocked = question?.isLocked === true;
                const isSelected = selectedSlotForDetail === slotNum;

                let btnStyle = '';
                let statusLabel = '';

                if (isOccupied && isLocked) {
                  btnStyle = isSelected 
                    ? 'bg-emerald-700 text-white border-2 border-black dark:border-white ring-2 ring-emerald-400 shadow-md scale-105' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-700 shadow-xs';
                  statusLabel = `Q#${slotNum}: [लॉक/फाइनल] ${question.questionHi.slice(0, 45)}...`;
                } else if (isOccupied && !isLocked) {
                  btnStyle = isSelected 
                    ? 'bg-amber-600 text-white border-2 border-black dark:border-white ring-2 ring-amber-400 shadow-md scale-105' 
                    : 'bg-amber-500 hover:bg-amber-400 text-white border border-amber-600 shadow-xs';
                  statusLabel = `Q#${slotNum}: [ड्राफ्ट/समीक्षा] ${question.questionHi.slice(0, 45)}...`;
                } else {
                  btnStyle = isSelected 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-[#7A2A1E] dark:text-[#D4A017] border-2 border-[#7A2A1E] shadow-sm scale-105' 
                    : 'bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-[#7A2A1E] dark:hover:text-[#D4A017] hover:border-[#7A2A1E] border border-dashed border-stone-300 dark:border-stone-700 hover:bg-amber-50/50';
                  statusLabel = `Q#${slotNum}: खाली स्लॉट (क्लिक करके इस नंबर पर नया प्रश्न जोड़ें)`;
                }

                return (
                  <button
                    key={slotNum}
                    type="button"
                    title={statusLabel}
                    onClick={() => {
                      setSelectedSlotForDetail(slotNum);
                      if (onSelectSlot) {
                        onSelectSlot(slotNum, question);
                      }
                    }}
                    className={`h-11 sm:h-12 rounded-xl text-xs font-mono font-black flex flex-col items-center justify-center transition-all cursor-pointer relative group ${btnStyle}`}
                  >
                    <span className="text-[11px] font-black leading-none">
                      {slotNum}
                    </span>

                    <span className="text-[9px] mt-0.5 opacity-90 flex items-center justify-center">
                      {isOccupied ? (
                        isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />
                      ) : (
                        <span className="text-stone-300 dark:text-stone-600 group-hover:text-[#7A2A1E]">+</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Active Selected Slot Action Drawer / Inspection Card */}
          {selectedSlotForDetail !== null && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/80 border-2 border-amber-300 dark:border-amber-700 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#7A2A1E] text-[#D4A017] text-xs font-mono font-black">
                      स्लॉट Q#{selectedSlotForDetail}
                    </span>
                    {activeQuestionDetail ? (
                      activeQuestionDetail.isLocked ? (
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>लॉक किया गया प्रश्न</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          <span>ड्राफ्ट प्रश्न (संपादन योग्य)</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-md">
                        ⚪ यह स्लॉट अभी खाली (Blank) है
                      </span>
                    )}
                  </div>

                  {activeQuestionDetail ? (
                    <div className="text-xs font-medium text-stone-900 dark:text-white pt-1 line-clamp-2">
                      <span className="font-black text-[#7A2A1E] dark:text-[#D4A017] mr-1">
                        [{activeQuestionDetail.subject || 'विषय'}]
                      </span>
                      {activeQuestionDetail.questionHi}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 dark:text-stone-400 pt-0.5">
                      इस सीरियल नंबर पर कोई प्रश्न नहीं है। आप सीधे इस स्थान (Slot Q#{selectedSlotForDetail}) पर नया प्रश्न दर्ज कर सकते हैं।
                    </p>
                  )}
                </div>

                {/* Actions for this Slot */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {activeQuestionDetail ? (
                    <>
                      {/* Scroll to question in list */}
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(`q-card-${activeQuestionDetail.id}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('ring-4', 'ring-amber-400');
                            setTimeout(() => {
                              el.classList.remove('ring-4', 'ring-amber-400');
                            }, 2500);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <span>सूची में देखें ↓</span>
                      </button>

                      {/* Edit Question */}
                      <button
                        type="button"
                        onClick={() => onEditQuestion(activeQuestionDetail)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>संपादित करें</span>
                      </button>

                      {/* Quick Lock / Unlock */}
                      {onQuickToggleLock && (
                        <button
                          type="button"
                          onClick={() => onQuickToggleLock(activeQuestionDetail.id, activeQuestionDetail.isLocked || false)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs ${
                            activeQuestionDetail.isLocked 
                              ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300' 
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          {activeQuestionDetail.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>{activeQuestionDetail.isLocked ? 'अनलॉक करें' : 'लॉक करें'}</span>
                        </button>
                      )}
                    </>
                  ) : (
                    /* Add New Question at this empty slot */
                    <button
                      type="button"
                      onClick={() => onAddNewAtSlot(selectedSlotForDetail)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>इस स्लॉट (Q#{selectedSlotForDetail}) पर नया प्रश्न जोड़ें</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedSlotForDetail(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
