import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Download, FileText, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

export const NotesModal: React.FC = () => {
  const { isNotesModalOpen, closeNotesModal, selectedNote, notes, lang, showToast } = useApp();
  const [activeNote, setActiveNote] = useState(selectedNote || notes[0]);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  if (!isNotesModalOpen) return null;

  const current = selectedNote || activeNote || notes[0];

  const handleDownload = (noteId: string) => {
    if (!downloadedIds.includes(noteId)) {
      setDownloadedIds(prev => [...prev, noteId]);
    }
    showToast(lang === 'hi' ? '📥 नोट्स ऑफलाइन स्टोरेज में डाउनलोड हो गए।' : '📥 Notes saved to offline cache & PDF ready.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              {lang === 'hi' ? 'मध्यप्रदेश स्पेशल ई-नोट्स & हस्तलिखित सार संग्रह' : 'MP Special E-Notes & Handwritten Repository'}
            </h3>
          </div>
          <button onClick={closeNotesModal} className="p-1 text-stone-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          
          {/* Notes Sidebar Selector */}
          <div className="border-r border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-stone-950/60 overflow-y-auto space-y-2 max-h-48 md:max-h-full">
            <div className="text-[10px] uppercase font-bold text-stone-400 px-2 mb-1">उपलब्ध ई-नोट्स ({notes.length})</div>
            {notes.map(n => {
              const isSelected = n.id === current.id;
              const isDownloaded = downloadedIds.includes(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => setActiveNote(n)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 font-bold' 
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{n.category}</span>
                    {isDownloaded && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <div className="font-semibold line-clamp-1">{lang === 'hi' ? n.titleHi : n.titleEn}</div>
                  <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">{n.pages} {lang === 'hi' ? 'पेज' : 'pages'} • {n.fileSize}</div>
                </button>
              );
            })}
          </div>

          {/* Active Note Preview Panel */}
          <div className="md:col-span-2 p-5 overflow-y-auto space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  {current.category}
                </span>
                <h4 className="font-display font-bold text-lg text-stone-900 dark:text-white mt-1">
                  {lang === 'hi' ? current.titleHi : current.titleEn}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {lang === 'hi' ? current.summaryHi : current.summaryEn}
                </p>
              </div>

              {/* Sample Content Viewer Box */}
              <div className="bg-stone-100 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1.5">
                  <span>📖 {lang === 'hi' ? 'हस्तलिखित सारांश पूर्वावलोकन' : 'Handwritten Preview'}</span>
                  <span>{current.pages} Pages • High Yield</span>
                </div>
                <pre className="font-sans text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                  {current.sampleContentHi}
                </pre>
              </div>
            </div>

            {/* Download CTA Button */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                📥 {current.downloadCount.toLocaleString()} {lang === 'hi' ? 'छात्रों ने डाउनलोड किया' : 'downloads'}
              </span>

              <button
                onClick={() => handleDownload(current.id)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadedIds.includes(current.id) 
                    ? (lang === 'hi' ? 'ऑफलाइन सुरक्षित (पुनः डाउनलोड करें)' : 'Cached Offline (Download Again)')
                    : (lang === 'hi' ? `PDF डाउनलोड करें (${current.fileSize})` : `Download PDF (${current.fileSize})`)}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
