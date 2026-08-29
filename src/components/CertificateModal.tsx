import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, Award, ShieldCheck, QrCode, CheckCircle2, Sparkles } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { isCertificateModalOpen, closeCertificateModal, selectedAttemptForCert, currentUser, lang } = useApp();

  if (!isCertificateModalOpen || !selectedAttemptForCert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border-2 border-amber-500 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls Bar */}
        <div className="bg-stone-900 text-stone-200 px-5 py-3 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white">
              {lang === 'hi' ? 'आधिकारिक परीक्षा स्कोरकार्ड व प्रमाणपत्र' : 'Official Performance Certificate'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रिंट / सेव PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={closeCertificateModal}
              className="p-1 rounded-full text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-stone-50 dark:bg-stone-950 flex flex-col items-center">
          
          {/* Certificate Inner Card */}
          <div className="w-full bg-white dark:bg-stone-900 border-4 border-double border-amber-600/60 rounded-2xl p-6 sm:p-8 shadow-inner relative text-center">
            
            {/* Corner Decorative Motifs */}
            <div className="absolute top-2 left-2 text-amber-500 text-lg">❖</div>
            <div className="absolute top-2 right-2 text-amber-500 text-lg">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-500 text-lg">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-500 text-lg">❖</div>

            {/* Emblem Homage */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-600 p-0.5 shadow-md flex items-center justify-center mb-3">
              <div className="w-full h-full rounded-full bg-stone-900 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-extrabold text-amber-400">म.प्र.</span>
                <span className="text-[8px] font-bold text-emerald-400 -mt-1">सेतु</span>
              </div>
            </div>

            <div className="text-[11px] uppercase font-extrabold tracking-widest text-amber-800 dark:text-amber-400">
              MP परीक्षा सेतु — मध्यप्रदेश प्रतियोगी परीक्षा बोर्ड
            </div>
            
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 dark:text-white mt-1">
              प्रवीणता प्रमाणपत्र (Certificate of Merit)
            </h2>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              प्रमाणित किया जाता है कि निम्नलिखित परीक्षार्थी ने ऑनलाइन CBT टेस्ट सफलतापूर्वक पूर्ण किया है।
            </p>

            {/* Candidate Details Grid */}
            <div className="my-6 py-4 px-5 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-xl text-left grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">परीक्षार्थी का नाम / Candidate</span>
                <span className="font-bold text-stone-900 dark:text-white text-sm">
                  {selectedAttemptForCert.userName}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">गृह जिला / District</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {selectedAttemptForCert.userDistrict}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">परीक्षा / Test Series</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {selectedAttemptForCert.seriesTitle}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">कुल प्राप्तांक / Score</span>
                <span className="font-mono font-extrabold text-stone-900 dark:text-white text-base">
                  {selectedAttemptForCert.score} / {selectedAttemptForCert.totalMarks} ({selectedAttemptForCert.percentage}%)
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">ऑल-एमपी रैंक / State Rank</span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                  AIR #{selectedAttemptForCert.rank}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">सटीकता / Accuracy</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                  {selectedAttemptForCert.accuracy}%
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">पर्सेंटाइल / Percentile</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                  {selectedAttemptForCert.percentile}%ile
                </span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-left text-[11px] text-stone-500">
              <div>
                <div className="font-mono font-bold text-stone-700 dark:text-stone-300">
                  ID: {selectedAttemptForCert.certificateId}
                </div>
                <div>Date: {new Date(selectedAttemptForCert.completedAt).toLocaleDateString('hi-IN')}</div>
              </div>
              
              <div className="text-right">
                <div className="font-display font-bold text-stone-900 dark:text-white text-xs">
                  डिजिटल मूल्यांकन नियंत्रक
                </div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3 h-3" /> Digitally Verified
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
