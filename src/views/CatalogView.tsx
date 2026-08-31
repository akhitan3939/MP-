import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TestCard } from '../components/TestCard';
import { ExamCategory } from '../types';
import { Search, Filter, SlidersHorizontal, BookOpen, Sparkles, HelpCircle } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { testSeries, viewParams, lang, platformSettings } = useApp();
  
  const initialCategory = (viewParams?.category as ExamCategory) || 'all';
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const categories: { id: ExamCategory; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'सभी (All)', labelEn: 'All Exams', icon: '🏛️' },
    { id: 'agri', labelHi: 'कृषि (समूह-02 उपसमूह-01)', labelEn: 'Agri (Group-02 Sub-01)', icon: '🌱' },
    { id: 'patwari', labelHi: 'समूह-02 उपसमूह-04', labelEn: 'Group-02 Sub-04', icon: '🌾' },
    { id: 'mppsc', labelHi: 'MPPSC प्रारंभिक', labelEn: 'MPPSC Prelims', icon: '📜' },
    { id: 'police', labelHi: 'MP पुलिस SI/कांस्टेबल', labelEn: 'Police SI/Constable', icon: '🎖️' },
    { id: 'vyapam', labelHi: 'व्यापम (ESB Group-4)', labelEn: 'MP Vyapam', icon: '💼' },
    { id: 'vanrakshak', labelHi: 'वनरक्षक / जेल प्रहरी', labelEn: 'Forest Guard', icon: '🌲' },
    { id: 'tet', labelHi: 'शिक्षक पात्रता (TET)', labelEn: 'MP TET', icon: '📚' },
  ];

  let filtered = testSeries.filter(s => {
    // Hide inactive series from catalog so students cannot buy or view inactive ones
    if (s.isActive === false) return false;
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      s.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.departmentHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFree = !showFreeOnly || s.freeTestsCount > 0;
    return matchesCat && matchesSearch && matchesFree;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'popular') return b.enrolledCount - a.enrolledCount;
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header with Big Logo */}
      <div className="bg-[#7A2A1E] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#D4A017] border-b-6 border-r-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gond-pattern opacity-15 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4A017]">
              {lang === 'hi' ? 'मध्यप्रदेश प्रतियोगी परीक्षा टेस्ट बैंक' : 'MP Govt Exam Test Series Catalog'}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              {lang === 'hi' ? 'समस्त टेस्ट सीरीज़ एवं मॉक टेस्ट पैकेज' : 'All Mock Test Packages (2026 Edition)'}
            </h1>
            <p className="text-[#FFFBF2]/90 text-xs sm:text-sm max-w-2xl font-medium">
              {lang === 'hi'
                ? 'नवीनतम पाठ्यक्रम व परीक्षा समिति (ESB / MPPSC) द्वारा निर्धारित ब्लू-प्रिंट के अनुरूप तैयार द्विभाषी मॉक टेस्ट।'
                : 'Curated by top educators and state rank holders based on the latest 2026 syllabus guidelines.'}
            </p>
          </div>

          {/* Large Logo Emblem */}
          <div className="relative group shrink-0 hidden sm:block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white p-1.5 shadow-2xl border-4 border-[#D4A017] flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
              <img 
                src={platformSettings?.logoUrl || '/logo.svg'} 
                alt="MP परीक्षा सेतु Logo" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/logo.svg') {
                    target.src = '/logo.svg';
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search + Category + Sort */}
      <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 border-b-4 border-r-4 border-[#7A2A1E] dark:border-[#D4A017] rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'परीक्षा का नाम, विषय या विभाग खोजें...' : 'Search by exam name, syllabus or department...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#EAD8B1] dark:border-stone-700 bg-white dark:bg-stone-800 text-[#2D2424] dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#7A2A1E] font-medium"
            />
          </div>

          {/* Sort & Free Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FFFBF2] dark:bg-stone-800 px-3 py-1.5 rounded-xl border-2 border-[#EAD8B1] dark:border-stone-700 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7A2A1E] dark:text-[#D4A017]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#2D2424] dark:text-stone-200 font-black uppercase tracking-wider focus:outline-none cursor-pointer text-xs"
              >
                <option value="popular">{lang === 'hi' ? 'लोकप्रियता (Popular)' : 'Popularity'}</option>
                <option value="rating">{lang === 'hi' ? 'टॉप रेटिंग (Top Rated)' : 'Rating'}</option>
                <option value="priceLow">{lang === 'hi' ? 'कीमत: कम से ज्यादा' : 'Price: Low to High'}</option>
                <option value="priceHigh">{lang === 'hi' ? 'कीमत: ज्यादा से कम' : 'Price: High to Low'}</option>
              </select>
            </div>

            <button
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition ${
                showFreeOnly
                  ? 'bg-emerald-700 border-emerald-800 text-white shadow'
                  : 'bg-[#FFFBF2] dark:bg-stone-800 border-[#EAD8B1] dark:border-stone-700 text-[#2D2424] dark:text-stone-300'
              }`}
            >
              🎁 {lang === 'hi' ? 'फ्री डेमो उपलब्ध' : 'Free Demo'}
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#EAD8B1]/40 dark:border-stone-800">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#D4A017] text-black shadow-sm border border-[#D4A017]'
                    : 'bg-[#FFFBF2] dark:bg-stone-800/80 border border-[#EAD8B1] dark:border-stone-700 text-[#2D2424] dark:text-stone-300 hover:border-[#7A2A1E]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Results */}
      <div>
        <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
          <span>{lang === 'hi' ? `कुल ${filtered.length} टेस्ट सीरीज़ उपलब्ध` : `Showing ${filtered.length} test series`}</span>
          <span>{lang === 'hi' ? 'नवीनतम परीक्षा पैटर्न 2026' : 'Updated for 2026 Pattern'}</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((series) => (
              <TestCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
            <HelpCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-stone-800 dark:text-stone-200">
              {lang === 'hi' ? 'कोई टेस्ट सीरीज़ नहीं मिली' : 'No Results Found'}
            </h3>
            <p className="text-stone-500 text-xs mt-1">
              {lang === 'hi' ? 'कृपया अन्य फ़िल्टर या खोज शब्द आज़माएँ।' : 'Please reset filters or search terms.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setShowFreeOnly(false); }}
              className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-lg"
            >
              {lang === 'hi' ? 'सभी सीरीज़ देखें' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
