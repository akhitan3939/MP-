import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';

export const StudyReminderModal: React.FC = () => {
  const { isRemindersModalOpen, closeRemindersModal, reminders, addReminder, toggleReminder, deleteReminder, lang } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('19:00');
  const [newTopic, setNewTopic] = useState('MP Patwari Daily Mock');

  if (!isRemindersModalOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReminder({
      title: newTitle.trim(),
      time: newTime,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isEnabled: true,
      topic: newTopic
    });

    setNewTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              {lang === 'hi' ? 'दैनिक अध्ययन एवं टेस्ट रिमाइंडर' : 'Daily Study & Test Reminders'}
            </h3>
          </div>
          <button onClick={closeRemindersModal} className="p-1 text-stone-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            {lang === 'hi'
              ? 'नियमित मॉक टेस्ट अभ्यास हेतु अपने सुविधाजनक समय पर अलर्ट शेड्यूल करें।'
              : 'Set automated reminders for daily mock tests and MP GK revisions.'}
          </p>

          {/* Active Reminders List */}
          <div className="space-y-2">
            {reminders.map(rem => (
              <div 
                key={rem.id}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rem.isEnabled}
                    onChange={() => toggleReminder(rem.id)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">{rem.title}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{rem.time}</span>
                      <span>• {rem.topic}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Reminder Form */}
          <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {lang === 'hi' ? '➕ नया रिमाइंडर जोड़ें' : '➕ Add New Reminder'}
            </div>

            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={lang === 'hi' ? 'रिमाइंडर शीर्षक (उदा. रात 8 बजे पटवारी टेस्ट)' : 'Reminder title'}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">समय / Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">विषय / Topic</label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white"
                >
                  <option value="MP GK 2026">MP GK & Current</option>
                  <option value="Patwari Mock">Patwari Mock Test</option>
                  <option value="MPPSC Prelims">MPPSC Prelims GS</option>
                  <option value="Hindi Vyakaran">Hindi Grammar</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition"
            >
              {lang === 'hi' ? 'रिमाइंडर सुरक्षित करें' : 'Save Reminder'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
