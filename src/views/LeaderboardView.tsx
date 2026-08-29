import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Award, Flame, Search, MapPin, Filter, Star, Sparkles, UserCheck, Globe } from 'lucide-react';
import { MP_DISTRICTS } from '../data/initialData';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, currentUser, lang, navigate } = useApp();
  
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = leaderboard.filter(entry => {
    const matchesDistrict = selectedDistrict === 'ALL' || 
      entry.district === selectedDistrict || 
      (entry.state && entry.state === selectedDistrict);
    const matchesExam = selectedExam === 'ALL' || entry.seriesId === selectedExam;
    const matchesSearch = searchQuery === '' || 
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.state && entry.state.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesExam && matchesSearch;
  });

  const currentUserEntry = leaderboard.find(e => e.userId === currentUser?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gond-pattern opacity-10 pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? '🇮🇳 ऑल-इंडिया व राज्य स्तरीय लाइव रैंक सूची 2026' : 'All-India & State Live Ranking 2026'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            {lang === 'hi' ? 'अखिल भारतीय व राज्य स्तरीय मेधावी परीक्षार्थी लीडरबोर्ड' : 'All-India & MP Aspirants Merit Leaderboard'}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl">
            {lang === 'hi'
              ? 'मध्यप्रदेश के सभी 55 जिलों एवं संपूर्ण भारत के लाखों परीक्षार्थियों के साथ अपनी लाइव रैंक, स्कोर व पर्सेंटाइल देखें और मेरिट में स्थान बनाएँ।'
              : 'Compete with aspirants across MP and All India, maintain study streaks, and claim your place in the merit list.'}
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((top, idx) => {
          const podiumStyles = [
            { rank: 1, medal: '🥇 1st Rank', border: 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/30', tag: 'bg-amber-500 text-stone-950' },
            { rank: 2, medal: '🥈 2nd Rank', border: 'border-slate-300 bg-slate-50/40 dark:bg-slate-900/40', tag: 'bg-slate-300 text-stone-900' },
            { rank: 3, medal: '🥉 3rd Rank', border: 'border-amber-700 bg-orange-50/40 dark:bg-orange-950/20', tag: 'bg-amber-700 text-white' },
          ][idx];

          return (
            <div 
              key={top.userId + idx}
              className={`p-5 rounded-2xl border-2 ${podiumStyles.border} relative overflow-hidden shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${podiumStyles.tag}`}>
                    {podiumStyles.medal}
                  </span>
                  <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" /> {top.streak}d Streak
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white">
                  {top.userName}
                </h3>
                
                <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{top.district}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">प्राप्तांक / Score</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white text-base">
                    {top.score} / {top.totalMarks}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">सटीकता / Accuracy</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
                    {top.accuracy}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User's Own Standings Card */}
      {currentUser && (
        <div className="bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 font-mono font-extrabold text-lg flex items-center justify-center shadow">
              {currentUserEntry ? `#${currentUserEntry.rank}` : '#--'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-stone-900 dark:text-white">
                  {currentUser.name} (आपकी लाइव रैंक)
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                  {currentUser.district}{currentUser.state ? ` (${currentUser.state})` : ''}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                कुल अर्जित XP: <strong className="text-amber-600 dark:text-amber-400 font-mono">{currentUser.xp} XP</strong> • दैनिक अध्ययन स्ट्रीक: <strong className="text-orange-500 font-mono">{currentUser.streak} दिन 🔥</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('catalog')}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl text-xs shadow transition"
          >
            {lang === 'hi' ? 'रैंक सुधारें (नया टेस्ट दें)' : 'Improve Rank (Take Test)'}
          </button>
        </div>
      )}

      {/* Leaderboard Table & Filters */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="परीक्षार्थी, राज्य या जिला खोजें..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-medium"
            />
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold"
            >
              <option value="ALL">🇮🇳 संपूर्ण भारत (All India Rankings)</option>
              <optgroup label="मध्यप्रदेश के प्रमुख जिले">
                {MP_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </optgroup>
              <optgroup label="अन्य राज्य">
                <option value="उत्तर प्रदेश">उत्तर प्रदेश (Uttar Pradesh)</option>
                <option value="राजस्थान">राजस्थान (Rajasthan)</option>
                <option value="बिहार">बिहार (Bihar)</option>
                <option value="छत्तीसगढ़">छत्तीसगढ़ (Chhattisgarh)</option>
                <option value="दिल्ली">दिल्ली (Delhi NCR)</option>
                <option value="हरियाणा">हरियाणा (Haryana)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold"
            >
              <option value="ALL">समस्त भर्ती परीक्षाएं (All Exams)</option>
              <option value="ts_patwari_2026">MP पटवारी 2026</option>
              <option value="ts_mppsc_pre_2026">MPPSC Prelims GS</option>
              <option value="ts_police_constable_2026">MP Police Constable</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase">
              <tr>
                <th className="py-3 px-3">रैंक (Rank)</th>
                <th className="py-3 px-3">परीक्षार्थी / Aspirant</th>
                <th className="py-3 px-3">राज्य व जिला</th>
                <th className="py-3 px-3">प्राप्तांक (Score)</th>
                <th className="py-3 px-3">सटीकता (Accuracy)</th>
                <th className="py-3 px-3">समय (Time)</th>
                <th className="py-3 px-3">उपलब्धि बैज</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200 font-medium">
              {filteredLeaderboard.map((row) => (
                <tr key={row.userId} className={row.userId === currentUser?.id ? 'bg-amber-50 dark:bg-amber-950/20 font-bold' : ''}>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-extrabold text-sm text-stone-900 dark:text-white">
                      #{row.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-stone-900 dark:text-white">{row.userName}</div>
                    <div className="text-[10px] text-stone-500">{row.seriesTitle}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-[11px]">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {row.district}{row.state ? ` (${row.state})` : ''}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold">
                    {row.score} / {row.totalMarks}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {row.accuracy}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-stone-500">
                    {row.timeTaken}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                      {row.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
