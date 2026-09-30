import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  File, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  HardDrive, 
  RefreshCw, 
  ShieldCheck, 
  X as CloseIcon,
  CheckCircle2,
  FolderArchive,
  Layers,
  Sparkles
} from 'lucide-react';
import { StoredFile, Language } from '../types';

interface AdminStorageManagerProps {
  storedFiles: StoredFile[];
  uploadStoredFile: (payload: { 
    name: string; 
    originalName?: string; 
    mimeType: string; 
    size: number; 
    dataBase64: string; 
    category?: 'pdf' | 'image' | 'doc' | 'other' 
  }) => Promise<StoredFile | null>;
  deleteStoredFile: (id: string) => Promise<boolean>;
  showToast: (msg: string) => void;
  lang?: Language;
}

export const AdminStorageManager: React.FC<AdminStorageManagerProps> = ({
  storedFiles,
  uploadStoredFile,
  deleteStoredFile,
  showToast,
  lang = 'hi'
}) => {
  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'pdf' | 'image' | 'doc' | 'other'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Upload Form states
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'auto' | 'pdf' | 'image' | 'doc' | 'other'>('auto');
  const [lastUploadedFile, setLastUploadedFile] = useState<StoredFile | null>(null);

  // Modal states
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<StoredFile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format date from 1st day to current date
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Copy link handler
  const handleCopyLink = (file: StoredFile) => {
    const fullUrl = file.url.startsWith('http') 
      ? file.url 
      : `${window.location.origin}${file.url}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(file.id);
      showToast(
        lang === 'hi' 
          ? `🔗 फ़ाइल लिंक कॉपी हो गया! अब आप इसे प्रश्न, टेस्ट या नोट्स में उपयोग कर सकते हैं।` 
          : `🔗 Link copied to clipboard!`
      );
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(() => {
      // Fallback
      showToast(file.url);
    });
  };

  // Process and upload file
  const processUpload = async (file: globalThis.File) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showToast('❌ फ़ाइल आकार 50 MB से अधिक नहीं हो सकता।');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        if (!base64Data) {
          showToast('❌ फ़ाइल पढ़ने में त्रुटि आई।');
          setIsUploading(false);
          return;
        }

        let cat: 'pdf' | 'image' | 'doc' | 'other' = 'other';
        if (selectedCategory !== 'auto') {
          cat = selectedCategory;
        } else {
          if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
            cat = 'pdf';
          } else if (file.type.startsWith('image/')) {
            cat = 'image';
          } else if (file.name.match(/\.(doc|docx|xls|xlsx|csv|txt)$/i)) {
            cat = 'doc';
          }
        }

        const uploaded = await uploadStoredFile({
          name: customTitle.trim() || file.name,
          originalName: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          dataBase64: base64Data,
          category: cat
        });

        if (uploaded) {
          setLastUploadedFile(uploaded);
          setCustomTitle('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        showToast('❌ फ़ाइल लोड करने में त्रुटि।');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('File upload error:', err);
      showToast('❌ फ़ाइल अपलोड में त्रुटि: ' + (err.message || 'Unknown error'));
      setIsUploading(false);
    }
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  // Stats calculation
  const totalFiles = storedFiles.length;
  const totalSizeBytes = storedFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const pdfCount = storedFiles.filter(f => f.category === 'pdf').length;
  const imageCount = storedFiles.filter(f => f.category === 'image').length;
  const docCount = storedFiles.filter(f => f.category === 'doc').length;
  const otherCount = storedFiles.filter(f => f.category === 'other').length;

  // Filtered files
  const filteredFiles = storedFiles.filter(file => {
    if (categoryFilter !== 'ALL' && file.category !== categoryFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      file.name.toLowerCase().includes(q) ||
      file.originalName.toLowerCase().includes(q) ||
      file.url.toLowerCase().includes(q) ||
      file.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Storage Summary Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-teal-900 via-[#1A3636] to-stone-900 border-2 border-teal-500/30 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-black shadow-inner shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">
                  क्लाउड स्टोरेज एवं फ़ाइल लिंक प्रबंधक (Universal Cloud File Storage)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[10px] font-mono font-black uppercase">
                  Disk Storage
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-1 max-w-2xl leading-relaxed">
                यहाँ आप अपनी समस्त PDF नोट्स, प्रश्न पत्र, छवियाँ (Images/Banners) व अध्ययन सामग्री अपलोड कर सकते हैं। अपलोड के तुरंत बाद 1-क्लिक में लिंक कॉपी करके उसे टेस्ट सीरीज़, प्रश्नों या वेबसाइट पर सीधे उपयोग करें।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">कुल फ़ाइलें</span>
              <span className="font-mono font-black text-xl text-teal-300">{totalFiles}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">उपयोग की गई स्पेस</span>
              <span className="font-mono font-black text-xl text-amber-300">{formatSize(totalSizeBytes)}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="w-4 h-4 text-rose-400" />
              <span className="text-stone-300 font-medium">PDF दस्तावेज़:</span>
            </div>
            <span className="font-mono font-black text-sm text-white">{pdfCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-300 font-medium">छवियाँ (Images):</span>
            </div>
            <span className="font-mono font-black text-sm text-white">{imageCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span className="text-stone-300 font-medium">वर्ड / एक्सेल Docs:</span>
            </div>
            <span className="font-mono font-black text-sm text-white">{docCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <FolderArchive className="w-4 h-4 text-sky-400" />
              <span className="text-stone-300 font-medium">अन्य सामग्री:</span>
            </div>
            <span className="font-mono font-black text-sm text-white">{otherCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Drag-and-Drop & File Upload Form */}
      <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-teal-600" />
            <h4 className="font-black text-sm text-stone-900 dark:text-white">
              नई फ़ाइल अपलोड करें (Upload to Cloud Storage)
            </h4>
          </div>
          <span className="text-xs text-stone-400 font-mono">अधिकतम 50 MB प्रति फ़ाइल</span>
        </div>

        {/* Upload Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              फ़ाइल का कस्टम शीर्षक (वैकल्पिक / Optional Title)
            </label>
            <input 
              type="text"
              placeholder="उदा. MP पटवारी 2026 सामान्य ज्ञान नोट्स भाग-1"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              फ़ाइल श्रेणी (Category)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="auto">⚡ स्वतः पहचानें (Auto-Detect)</option>
              <option value="pdf">📄 PDF दस्तावेज़ (PDF Notes)</option>
              <option value="image">🖼️ छवि / फ़ोटो (Image / Banner)</option>
              <option value="doc">📝 दस्तावेज़ (Word / Excel / Text)</option>
              <option value="other">📦 अन्य फ़ाइल (Other)</option>
            </select>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive 
              ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 scale-[1.01]' 
              : 'border-stone-300 dark:border-stone-700 hover:border-teal-500 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-teal-50/20'
          }`}
        >
          <input 
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.gif,.doc,.docx,.xls,.xlsx,.csv,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processUpload(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center shadow-xs">
              {isUploading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            
            <div>
              <div className="text-xs font-black text-stone-800 dark:text-stone-200">
                {isUploading 
                  ? 'सर्वर पर फ़ाइल अपलोड हो रही है, कृपया प्रतीक्षा करें...' 
                  : 'यहाँ फ़ाइल ड्रैग करके छोड़ें अथवा क्लिक करके चुनें'}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                समर्थित: PDF, PNG, JPG, JPEG, WEBP, SVG, DOC, DOCX, XLS, CSV (Max: 50MB)
              </p>
            </div>

            <button
              type="button"
              disabled={isUploading}
              className="mt-1 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-black shadow-md cursor-pointer transition flex items-center gap-1.5"
            >
              <span>{isUploading ? 'अपलोड हो रहा है...' : '📂 फ़ाइल चुनें'}</span>
            </button>
          </div>
        </div>

        {/* Recently Uploaded Link Banner with 1-Click Copy */}
        {lastUploadedFile && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <span>सफलतापूर्वक अपलोड!</span>
                  <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
                    ({formatSize(lastUploadedFile.size)})
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-stone-300 truncate font-mono mt-0.5">
                  {lastUploadedFile.url}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyLink(lastUploadedFile)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition hover:scale-105"
              >
                {copiedId === lastUploadedFile.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>🔗 लिंक कॉपी करें</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPreviewFile(lastUploadedFile)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
              >
                प्रीव्यू
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Search Bar, Category Filters & View Toggle */}
      <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input 
              type="text"
              placeholder="फ़ाइल नाम, ओरिजिनल नाम या लिंक खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-black' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              ⊞ ग्रिड व्यू
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-black' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              ☰ तालिका व्यू
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> फ़िल्टर:
          </span>
          {[
            { id: 'ALL', label: `सभी फ़ाइलें (${totalFiles})` },
            { id: 'pdf', label: `📄 PDF दस्तावेज़ (${pdfCount})` },
            { id: 'image', label: `🖼️ छवियाँ / Images (${imageCount})` },
            { id: 'doc', label: `📝 वर्ड व एक्सेल (${docCount})` },
            { id: 'other', label: `📦 अन्य (${otherCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Files Display (Grid View) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => {
            const isCopied = copiedId === file.id;
            const isImage = file.category === 'image';
            const isPdf = file.category === 'pdf';

            return (
              <div 
                key={file.id}
                className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 hover:border-teal-500/60 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3 transition duration-150 group"
              >
                <div className="space-y-3">
                  {/* Thumbnail / Category Icon */}
                  <div className="h-32 w-full rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 overflow-hidden flex items-center justify-center relative">
                    {isImage ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                        }}
                      />
                    ) : isPdf ? (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shadow-xs">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-black text-rose-600 uppercase">PDF DOCUMENT</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 flex items-center justify-center shadow-xs">
                          <File className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-black text-amber-700 uppercase">
                          {file.category.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Badge Category */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase">
                      {file.category}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                      {formatSize(file.size)}
                    </div>
                  </div>

                  {/* File Metadata */}
                  <div>
                    <h5 className="font-black text-xs text-stone-900 dark:text-white line-clamp-1" title={file.name}>
                      {file.name}
                    </h5>
                    <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5" title={file.originalName}>
                      {file.originalName}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1 flex items-center justify-between">
                      <span>{formatDate(file.uploadedAt)}</span>
                      <span className="font-mono text-[9px] text-stone-400">{file.id.slice(0, 12)}</span>
                    </div>
                  </div>

                  {/* Direct Link Preview Bar */}
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-1 text-[11px] font-mono">
                    <span className="truncate text-stone-600 dark:text-stone-300 text-[10px]">
                      {file.url}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(file)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                    }`}
                    title="पब्लिक लिंक कॉपी करें"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>लिंक कॉपी करें</span>
                      </>
                    )}
                  </button>

                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition cursor-pointer"
                    title="प्रीव्यू देखें"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Download Button */}
                  <a
                    href={file.url}
                    download={file.originalName}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition cursor-pointer"
                    title="डाउनलोड करें"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmFile(file)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 hover:text-white text-rose-700 dark:text-rose-300 transition cursor-pointer border border-rose-200 dark:border-rose-900"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Files Display (Table View) */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/80 border-b-2 border-stone-200 dark:border-stone-700 text-stone-500 uppercase text-[10px] font-black">
                <th className="py-3 px-3">प्रकार</th>
                <th className="py-3 px-3">फ़ाइल नाम व ओरिजिनल नाम</th>
                <th className="py-3 px-3">साइज (Size)</th>
                <th className="py-3 px-3">सार्वजनिक लिंक (URL)</th>
                <th className="py-3 px-3">अपलोड दिनांक</th>
                <th className="py-3 px-3 text-center">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {filteredFiles.map((file) => {
                const isCopied = copiedId === file.id;

                return (
                  <tr key={file.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition">
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black font-mono uppercase ${
                        file.category === 'pdf' 
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                          : file.category === 'image'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                      }`}>
                        {file.category === 'pdf' ? '📄 PDF' : file.category === 'image' ? '🖼️ IMG' : '📝 DOC'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-black text-stone-900 dark:text-white">{file.name}</div>
                      <div className="text-[10px] font-mono text-stone-400 truncate max-w-xs">{file.originalName}</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-stone-700 dark:text-stone-300">
                      {formatSize(file.size)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-stone-600 dark:text-stone-300 truncate max-w-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg">
                          {file.url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(file)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                            isCopied 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-stone-200 dark:bg-stone-700 hover:bg-teal-600 hover:text-white text-stone-700 dark:text-stone-200'
                          }`}
                          title="लिंक कॉपी करें"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[11px] text-stone-500 whitespace-nowrap">
                      {formatDate(file.uploadedAt)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition"
                          title="प्रीव्यू"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={file.url}
                          download={file.originalName}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition"
                          title="डाउनलोड"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirmFile(file)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                          title="डिलीट"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto text-2xl">
            📁
          </div>
          <h4 className="font-black text-sm text-stone-800 dark:text-white">
            {searchQuery ? 'कोई मिलती-जुलती फ़ाइल नहीं मिली' : 'अभी कोई फ़ाइल अपलोड नहीं की गई है'}
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            ऊपर दिए गए 'फ़ाइल चुनें' अथवा ड्रैग-एंड-ड्रॉप क्षेत्र से अपनी पहली PDF नोट्स या इमेज अपलोड करें।
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border-2 border-teal-500 rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">
                  {previewFile.category === 'pdf' ? '📄' : previewFile.category === 'image' ? '🖼️' : '📝'}
                </span>
                <div className="min-w-0">
                  <h4 className="font-black text-sm text-stone-900 dark:text-white truncate">
                    {previewFile.name}
                  </h4>
                  <div className="text-[10px] font-mono text-stone-400">
                    {formatSize(previewFile.size)} • {formatDate(previewFile.uploadedAt)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 transition"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Link Banner */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 rounded-2xl flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-teal-800 dark:text-teal-300 truncate">
                {previewFile.url}
              </span>
              <button
                onClick={() => handleCopyLink(previewFile)}
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs flex items-center gap-1 shrink-0 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>कॉपी करें</span>
              </button>
            </div>

            {/* Content Preview Frame */}
            <div className="max-h-[60vh] overflow-auto rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-2">
              {previewFile.category === 'image' ? (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name} 
                  className="max-h-[55vh] object-contain rounded-xl"
                />
              ) : previewFile.category === 'pdf' ? (
                <iframe 
                  src={previewFile.url} 
                  title={previewFile.name}
                  className="w-full h-[55vh] rounded-xl border-none"
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <File className="w-12 h-12 text-stone-400 mx-auto" />
                  <div className="text-xs font-bold text-stone-600 dark:text-stone-400">
                    इस फ़ाइल का सीधा प्रीव्यू उपलब्ध नहीं है। आप इसे सीधे डाउनलोड कर सकते हैं।
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <a
                href={previewFile.url}
                download={previewFile.originalName}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>डाउनलोड</span>
              </a>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-black text-base text-stone-900 dark:text-white">
                क्या आप वाकई यह फ़ाइल हटाना चाहते हैं?
              </h4>
              <p className="text-xs text-stone-500 font-mono">
                {deleteConfirmFile.name} ({formatSize(deleteConfirmFile.size)})
              </p>
              <p className="text-[11px] text-rose-600 pt-1">
                चेतावनी: डिलीट करने के बाद इस फ़ाइल का लिंक कहीं भी काम नहीं करेगा।
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmFile(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition"
              >
                रद्द करें
              </button>
              <button
                onClick={async () => {
                  const id = deleteConfirmFile.id;
                  setDeleteConfirmFile(null);
                  await deleteStoredFile(id);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition shadow-md cursor-pointer"
              >
                हाँ, स्थायी हटाएं
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
