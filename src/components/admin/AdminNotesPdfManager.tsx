import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Folder, 
  FolderOpen, 
  HardDrive, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileUp, 
  RefreshCw, 
  BookOpen, 
  Sparkles, 
  Printer, 
  FileCode, 
  Check, 
  X, 
  Filter,
  Save,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { OfflineNote } from '../../types';
import { exportNoteToPdfPrint } from '../../utils/exportReports';

interface StorageFile {
  fileName: string;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
  modifiedAt: string;
}

interface AdminNotesPdfManagerProps {
  notes: OfflineNote[];
  saveNote: (note: OfflineNote) => void;
  deleteNote: (id: string) => void;
  showToast: (msg: string) => void;
  onPreviewStudentModal?: (note?: OfflineNote) => void;
}

const CATEGORY_OPTIONS = [
  'मध्यप्रदेश सामान्य ज्ञान (MP GK)',
  'सामान्य हिंदी (General Hindi)',
  'गणित एवं तार्किक योग्यता (Maths & Reasoning)',
  'सामान्य विज्ञान एवं पर्यावरण (General Science)',
  'पंचायती राज एवं ग्रामीण अर्थव्यवस्था',
  'कंप्यूटर विज्ञान एवं IT',
  'सामान्य प्रबंधन (Management)',
  'करेंट अफेयर्स एवं समसामयिकी',
  'मध्यप्रदेश इतिहास व संस्कृति',
  'विविध व वन-लाइनर सार संग्रह'
];

export const AdminNotesPdfManager: React.FC<AdminNotesPdfManagerProps> = ({
  notes,
  saveNote,
  deleteNote,
  showToast,
  onPreviewStudentModal
}) => {
  // Navigation Tabs: 'CMS' (Notes Cards & Editor) vs 'STORAGE' (Server Folder Explorer & Direct Upload)
  const [activeTab, setActiveTab] = useState<'CMS' | 'STORAGE'>('CMS');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal / Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<OfflineNote> | null>(null);

  // Content Editor Tab inside Modal: 'WRITE' (Markdown/Text) vs 'UPLOAD_PDF' (Upload File)
  const [editorMode, setEditorMode] = useState<'WRITE' | 'UPLOAD_PDF'>('WRITE');

  // Direct File Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageFileInputRef = useRef<HTMLInputElement>(null);

  // Server Storage Folder State
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);
  const [storageTotalMb, setStorageTotalMb] = useState('0');
  const [storageFolderLocation, setStorageFolderLocation] = useState('');
  const [selectedStorageFileForAttach, setSelectedStorageFileForAttach] = useState<StorageFile | null>(null);

  // Fetch storage files from server
  const fetchStorageFiles = async () => {
    setIsLoadingStorage(true);
    try {
      const res = await fetch('/api/notes/storage-files');
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const data = await res.json();
      if (data.success) {
        setStorageFiles(data.files || []);
        setStorageTotalMb(data.totalSizeMb || '0');
        setStorageFolderLocation(data.storageFolder || 'data/uploads/pdf_notes');
      }
    } catch (err: any) {
      console.warn('Storage files fetch error:', err);
    } finally {
      setIsLoadingStorage(false);
    }
  };

  useEffect(() => {
    fetchStorageFiles();
  }, []);

  // Filtered Notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch = !searchQuery || 
      n.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summaryHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.fileName && n.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingNote({
      id: `note_${Date.now()}`,
      titleHi: '',
      titleEn: '',
      category: 'मध्यप्रदेश सामान्य ज्ञान (MP GK)',
      fileSize: '3.5 MB',
      pages: 15,
      downloadCount: 0,
      summaryHi: '',
      summaryEn: '',
      sampleContentHi: '',
      pdfUrl: '',
      fileName: '',
      uploadedAt: new Date().toISOString(),
      isPublished: true
    });
    setEditorMode('WRITE');
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (note: OfflineNote) => {
    setEditingNote({ ...note });
    setEditorMode(note.pdfUrl ? 'UPLOAD_PDF' : 'WRITE');
    setIsEditorOpen(true);
  };

  // Handle PDF File Upload via Base64 to Server Endpoint
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isDirectToStorage = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast('⚠️ कृपया केवल .PDF फ़ाइल अपलोड करें!');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('⚠️ फ़ाइल का आकार 20MB से अधिक नहीं होना चाहिए!');
      return;
    }

    setUploading(true);
    setUploadProgressMsg(`अपलोड हो रहा है: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/notes/upload-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: base64Data,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              mimeType: file.type
            })
          });

          const data = await res.json();
          if (data.success) {
            showToast(`✅ ${file.name} सर्वर स्टोरेज में सुरक्षित सहेजा गया!`);
            fetchStorageFiles();

            if (!isDirectToStorage) {
              setEditingNote(prev => ({
                ...prev,
                pdfUrl: data.url,
                fileName: data.fileName,
                fileSize: data.fileSize,
                uploadedAt: data.uploadedAt,
                // Automatically fill titles if empty
                titleHi: prev?.titleHi || file.name.replace(/\.[^/.]+$/, ''),
                titleEn: prev?.titleEn || file.name.replace(/\.[^/.]+$/, ''),
                summaryHi: prev?.summaryHi || `${file.name} - मध्यप्रदेश प्रतियोगी परीक्षा हेतु प्रामाणिक डिजिटल अध्ययन सामग्री।`,
                sampleContentHi: prev?.sampleContentHi || `फ़ाइल नाम: ${file.name}\nआकार: ${data.fileSize}\nअपलोड दिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\nयह PDF फ़ाइल सफलतापूर्वक सर्वर पर होस्ट की गई है। नीचे दिए गए डाउनलोड बटन से विद्यार्थी इसे सीधे एक्सेस व सेव कर सकते हैं।`
              }));
            }
          } else {
            showToast(`❌ अपलोड विफल: ${data.message || 'Unknown error'}`);
          }
        } catch (postErr: any) {
          console.error('Upload request error:', postErr);
          showToast('❌ सर्वर नेटवर्क त्रुटि: फ़ाइल अपलोड नहीं हो सकी।');
        } finally {
          setUploading(false);
          setUploadProgressMsg('');
          if (e.target) e.target.value = '';
        }
      };

      reader.onerror = () => {
        setUploading(false);
        setUploadProgressMsg('');
        showToast('❌ फ़ाइल पढ़ने में त्रुटि आई।');
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploading(false);
      setUploadProgressMsg('');
      showToast('❌ अपलोड प्रक्रिया में त्रुटि');
    }
  };

  // Delete File from Server Storage Folder
  const handleDeleteStorageFile = async (fileName: string) => {
    if (!window.confirm(`क्या आप स्टोरेज से "${fileName}" फ़ाइल हमेशा के लिए हटाना चाहते हैं?`)) return;

    try {
      const res = await fetch(`/api/notes/storage-files/${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('🗑️ फ़ाइल स्टोरेज से हटा दी गई।');
        fetchStorageFiles();
      } else {
        showToast(`❌ त्रुटि: ${data.message}`);
      }
    } catch (err: any) {
      showToast('❌ सर्वर पर फ़ाइल हटाने में त्रुटि');
    }
  };

  // Attach an existing storage file to the current note editor
  const handleAttachExistingFile = (file: StorageFile) => {
    setEditingNote(prev => ({
      ...prev,
      pdfUrl: file.url,
      fileName: file.fileName,
      fileSize: file.sizeFormatted,
      uploadedAt: file.createdAt,
      titleHi: prev?.titleHi || file.fileName.replace(/^[0-9]+_/, '').replace(/\.[^/.]+$/, ''),
      titleEn: prev?.titleEn || file.fileName.replace(/^[0-9]+_/, '').replace(/\.[^/.]+$/, ''),
      summaryHi: prev?.summaryHi || `सर्वर स्टोरेज से संलग्न: ${file.fileName}`,
      sampleContentHi: prev?.sampleContentHi || `संलग्न फ़ाइल: ${file.fileName}\nसाइज: ${file.sizeFormatted}\nURL: ${file.url}`
    }));
    showToast(`📎 फ़ाइल '${file.fileName}' नोट के साथ जोड़ दी गई!`);
  };

  // Save Note Form
  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote?.titleHi) {
      showToast('⚠️ कृपया ई-नोट का हिंदी शीर्षक दर्ज करें!');
      return;
    }

    const noteToSave: OfflineNote = {
      id: editingNote.id || `note_${Date.now()}`,
      titleHi: editingNote.titleHi.trim(),
      titleEn: (editingNote.titleEn || editingNote.titleHi).trim(),
      category: editingNote.category || 'मध्यप्रदेश सामान्य ज्ञान (MP GK)',
      fileSize: editingNote.fileSize || '3.5 MB',
      pages: Number(editingNote.pages || 15),
      downloadCount: Number(editingNote.downloadCount || 0),
      summaryHi: editingNote.summaryHi || 'एमपी परीक्षा हेतु महत्वपूर्ण प्रामाणिक हस्तलिखित नोट्स।',
      summaryEn: editingNote.summaryEn || 'Handwritten study material for MP competitive examinations.',
      sampleContentHi: editingNote.sampleContentHi || 'महत्वपूर्ण तथ्य, वस्तुनिष्ठ सारांश व परीक्षा उपयोगी बिंदु।',
      pdfUrl: editingNote.pdfUrl || undefined,
      fileName: editingNote.fileName || undefined,
      uploadedAt: editingNote.uploadedAt || new Date().toISOString(),
      author: editingNote.author || 'MP परीक्षा सेतु विशेषज्ञ संकाय',
      isPublished: editingNote.isPublished !== false
    };

    saveNote(noteToSave);
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  // Quick Print / Download Preview for any note
  const handlePreviewDownload = (note: OfflineNote) => {
    if (note.pdfUrl) {
      window.open(note.pdfUrl, '_blank');
      showToast('📄 PDF नई विंडो में खोली जा रही है');
    } else {
      exportNoteToPdfPrint(note);
      showToast('🖨️ PDF प्रिंट / डाउनलोड पूर्वावलोकन तैयार');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card with Stats & Dual Tab Switcher */}
      <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-[#7A2A1E] text-white flex items-center justify-center font-black shadow-md shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-[#2D2424] dark:text-white">
                  हस्तलिखित नोट्स, PDF सामग्री CMS व स्टोरेज
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                  PERSISTENT STORAGE
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                सीधे अपने कंप्यूटर से ओरिजिनल PDF अपलोड करें, ऑनलाइन कंटेंट लिखें या स्टोरेज फ़ोल्डर में सहेजी गई फ़ाइलों को मैनेज करें।
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onPreviewStudentModal && (
              <button
                type="button"
                onClick={() => onPreviewStudentModal()}
                className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                title="विद्यार्थियों को यह कैसा दिखेगा"
              >
                <Eye className="w-3.5 h-3.5 text-stone-500" />
                <span>विद्यार्थी व्यू देखें</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] text-xs font-black rounded-xl flex items-center gap-1.5 transition shadow-sm border border-[#D4A017]/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नया ई-नोट / PDF जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: CMS vs Storage Folder */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('CMS')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'CMS'
                  ? 'bg-white dark:bg-stone-900 text-[#7A2A1E] dark:text-[#D4A017] shadow-sm font-black'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>ई-नोट्स कैटलॉग CMS ({notes.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('STORAGE');
                fetchStorageFiles();
              }}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'STORAGE'
                  ? 'bg-white dark:bg-stone-900 text-[#7A2A1E] dark:text-[#D4A017] shadow-sm font-black'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span>सर्वर PDF स्टोरेज फ़ोल्डर ({storageFiles.length} फ़ाइलें • {storageTotalMb} MB)</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              क्लाउड डिस्क सिंक: एक्टिव
            </span>
            <span className="font-mono text-stone-400">
              📁 {storageFolderLocation || 'data/uploads/pdf_notes'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: E-NOTES CMS (CARDS & SEARCH) */}
      {/* ========================================================= */}
      {activeTab === 'CMS' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="नोट्स शीर्षक या फ़ाइल नाम खोजें..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">सभी विषय एवं श्रेणियां ({notes.length})</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                onClick={handleOpenCreateModal}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नया नोट</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-700 dark:text-stone-300">कोई ई-नोट नहीं मिला</h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                आपके द्वारा खोजा गया नोट मौजूद नहीं है या अभी तक कोई नोट जोड़ा नहीं गया है।
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-[#7A2A1E] text-[#D4A017] text-xs font-bold rounded-xl inline-flex items-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>पहला ई-नोट जोड़ें</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map(note => (
                <div 
                  key={note.id}
                  className="p-5 bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition duration-200 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                        {note.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                        {note.fileSize}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#2D2424] dark:text-white line-clamp-1 group-hover:text-cyan-600 transition">
                      {note.titleHi}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {note.summaryHi}
                    </p>

                    {/* PDF Attachment Badge */}
                    {note.pdfUrl ? (
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-mono font-bold">{note.fileName || 'संलग्न PDF उपलब्ध'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-500">
                        <FileCode className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>हस्तलिखित टेक्स्ट सारांश (ऑनलाइन रेंडर)</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">
                      {note.pages} पृष्ठ • {note.downloadCount || 0} डाउनलोड
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePreviewDownload(note)}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 hover:text-emerald-700 text-stone-600 dark:text-stone-300 transition"
                        title="PDF पूर्वावलोकन / डाउनलोड"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(note)}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-cyan-100 hover:text-cyan-700 text-stone-600 dark:text-stone-300 transition"
                        title="एडिट करें / फ़ाइल बदलें"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`क्या आप '${note.titleHi}' ई-नोट को हटाना चाहते हैं?`)) {
                            deleteNote(note.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="नोट हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: SERVER STORAGE FOLDER (REAL DISK EXPLORER) */}
      {/* ========================================================= */}
      {activeTab === 'STORAGE' && (
        <div className="space-y-5">
          {/* Storage Directory Info Card */}
          <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-sm sm:text-base text-[#2D2424] dark:text-white">
                  सर्वर डिस्क स्टोरेज डायरेक्टरी: <span className="font-mono text-cyan-600">{storageFolderLocation || 'data/uploads/pdf_notes'}</span>
                </h4>
              </div>
              <p className="text-xs text-stone-500">
                यहाँ अपलोड की जाने वाली सभी PDF फ़ाइलें हमेशा सर्वर हार्ड ड्राइव पर सुरक्षित रहती हैं। कोड अपडेट या रीस्टार्ट होने पर भी यह डेटा नष्ट नहीं होता।
              </p>
            </div>

            {/* Direct Upload Button to Storage */}
            <div className="flex items-center gap-2">
              <input
                ref={storageFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={e => handleFileUpload(e, true)}
              />
              <button
                type="button"
                onClick={() => fetchStorageFiles()}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 text-xs font-bold transition"
                title="फ़ाइल सूची रीफ्रेश करें"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingStorage ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => storageFileInputRef.current?.click()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow cursor-pointer disabled:opacity-50"
              >
                <FileUp className="w-4 h-4" />
                <span>{uploading ? 'अपलोडिंग...' : 'सीधे PDF फ़ाइल अपलोड करें'}</span>
              </button>
            </div>
          </div>

          {/* Upload Progress Notification */}
          {uploading && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-3 text-xs font-bold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>{uploadProgressMsg || 'फ़ाइल सर्वर स्टोरेज में भेजी जा रही है... कृपया प्रतीक्षा करें'}</span>
            </div>
          )}

          {/* Storage Files Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/30">
              <span className="text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                📁 सर्वर पर उपलब्ध PDF फ़ाइलें ({storageFiles.length})
              </span>
              <span className="text-xs font-mono text-stone-400">
                कुल प्रयुक्त स्थान: {storageTotalMb} MB
              </span>
            </div>

            {storageFiles.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <HardDrive className="w-10 h-10 text-stone-300 mx-auto" />
                <div className="text-sm font-bold text-stone-600 dark:text-stone-300">स्टोरेज फ़ोल्डर खाली है</div>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  ऊपर दिए गए 'सीधे PDF फ़ाइल अपलोड करें' बटन से अपने नोट्स या परीक्षा सामग्री अपलोड करें।
                </p>
                <button
                  onClick={() => storageFileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>फ़ाइल अपलोड करें</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {storageFiles.map((file, idx) => {
                  const isLinkedToAnyNote = notes.some(n => n.fileName === file.fileName || (n.pdfUrl && n.pdfUrl.includes(file.fileName)));

                  return (
                    <div 
                      key={file.fileName}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate max-w-xs md:max-w-md font-mono">
                              {file.fileName}
                            </span>
                            {isLinkedToAnyNote ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                🔗 लिंक्ड (सक्रिय ई-नोट)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                                अप्रयुक्त (Unlinked)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-0.5">
                            <span className="font-mono">{file.sizeFormatted}</span>
                            <span>•</span>
                            <span>{new Date(file.modifiedAt || file.createdAt).toLocaleDateString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>•</span>
                            <span className="font-mono text-stone-400">{file.url}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>देखें</span>
                        </a>

                        <button
                          onClick={() => {
                            // Create or link as note
                            setEditingNote({
                              id: `note_${Date.now()}`,
                              titleHi: file.fileName.replace(/^[0-9]+_/, '').replace(/\.[^/.]+$/, ''),
                              titleEn: file.fileName.replace(/^[0-9]+_/, '').replace(/\.[^/.]+$/, ''),
                              category: 'मध्यप्रदेश सामान्य ज्ञान (MP GK)',
                              fileSize: file.sizeFormatted,
                              pages: 20,
                              downloadCount: 0,
                              summaryHi: `फ़ाइल: ${file.fileName} - मध्यप्रदेश भर्ती परीक्षा ई-नोट।`,
                              sampleContentHi: `फ़ाइल: ${file.fileName}\nसाइज: ${file.sizeFormatted}\nपाथ: ${file.url}`,
                              pdfUrl: file.url,
                              fileName: file.fileName,
                              uploadedAt: file.createdAt
                            });
                            setEditorMode('UPLOAD_PDF');
                            setIsEditorOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 text-xs font-bold flex items-center gap-1 transition"
                          title="इस फ़ाइल को नए ई-नोट में बदलें"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>नोट बनाएं</span>
                        </button>

                        <button
                          onClick={() => handleDeleteStorageFile(file.fileName)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          title="सर्वर से फ़ाइल हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT NOTE & PDF UPLOADER */}
      {/* ========================================================= */}
      {isEditorOpen && editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border-2 border-[#EAD8B1] dark:border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#7A2A1E] text-white flex items-center justify-between border-b-2 border-[#D4A017]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#D4A017]" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {editingNote.id && notes.some(n => n.id === editingNote.id)
                      ? 'ई-नोट व PDF सामग्री संपादित करें'
                      : 'नया ई-नोट / PDF सामग्री जोड़ें'}
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    PDF अपलोड करें या ऑनलाइन हस्तलिखित नोट्स तैयार करें
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsEditorOpen(false);
                  setEditingNote(null);
                }} 
                className="p-1 text-stone-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNoteSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Mode Selector Tabs inside Modal */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEditorMode('WRITE')}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    editorMode === 'WRITE'
                      ? 'bg-white dark:bg-stone-900 text-[#7A2A1E] dark:text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-600" />
                  <span>1. हस्तलिखित कंटेंट लिखें</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('UPLOAD_PDF')}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    editorMode === 'UPLOAD_PDF'
                      ? 'bg-white dark:bg-stone-900 text-[#7A2A1E] dark:text-[#D4A017] shadow-sm font-black'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. PDF फ़ाइल अपलोड / संलग्न करें</span>
                </button>
              </div>

              {/* Basic Details (Title & Category) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                    <span>नोट्स शीर्षक (हिंदी में) *</span>
                    <span className="text-[10px] text-stone-400">जैसे: म.प्र. नदियाँ, सिंचाई परियोजनाएं व जलप्रपात</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. मध्यप्रदेश सामान्य ज्ञान सार संग्रह 2026"
                    value={editingNote.titleHi || ''}
                    onChange={e => setEditingNote({ ...editingNote, titleHi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    विषय / श्रेणी
                  </label>
                  <select
                    value={editingNote.category || CATEGORY_OPTIONS[0]}
                    onChange={e => setEditingNote({ ...editingNote, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      पृष्ठ संख्या (Pages)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={editingNote.pages || 15}
                      onChange={e => setEditingNote({ ...editingNote, pages: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      फ़ाइल साइज
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 4.2 MB"
                      value={editingNote.fileSize || '3.5 MB'}
                      onChange={e => setEditingNote({ ...editingNote, fileSize: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  संक्षिप्त सारांश (Summary)
                </label>
                <textarea
                  rows={2}
                  placeholder="विद्यार्थियों को संक्षेप में बताएं कि इस पीडीएफ/नोट्स में क्या विशेष है..."
                  value={editingNote.summaryHi || ''}
                  onChange={e => setEditingNote({ ...editingNote, summaryHi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* MODE 1: Write Content Online */}
              {editorMode === 'WRITE' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>हस्तलिखित नोट्स सामग्री / वन-लाइनर्स (Full Study Content)</span>
                    </label>
                    <span className="text-[10px] text-stone-400">
                      छात्र इसे सीधे पढ़ सकेंगे और स्वतः PDF के रूप में डाउनलोड कर सकेंगे
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    placeholder="यहाँ नोट्स का पूरा कंटेंट, मुख्य बिंदु, तालिकाएँ, परीक्षा में बार-बार पूछे जाने वाले प्रश्न व तथ्य टाइप करें..."
                    value={editingNote.sampleContentHi || ''}
                    onChange={e => setEditingNote({ ...editingNote, sampleContentHi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* MODE 2: Upload PDF File */}
              {editorMode === 'UPLOAD_PDF' && (
                <div className="space-y-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={e => handleFileUpload(e, false)}
                  />

                  {editingNote.pdfUrl ? (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="text-xs font-black text-emerald-900 dark:text-emerald-100 font-mono">
                              {editingNote.fileName || 'PDF फ़ाइल संलग्न है'}
                            </div>
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-300">
                              साइज: {editingNote.fileSize} • यूआरएल: {editingNote.pdfUrl}
                            </div>
                          </div>
                        </div>
                        <a
                          href={editingNote.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>देखें</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer"
                        >
                          🔄 दूसरी PDF फ़ाइल बदलें
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setEditingNote({ ...editingNote, pdfUrl: undefined, fileName: undefined })}
                          className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          हटाएं
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-8 border-2 border-dashed border-cyan-400 dark:border-cyan-700 rounded-2xl text-center hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition cursor-pointer space-y-3"
                    >
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                          {uploading ? 'अपलोड हो रहा है...' : 'अपने कंप्यूटर से PDF फ़ाइल चुनें'}
                        </div>
                        <div className="text-xs text-stone-400 mt-1">
                          अधिकतम 20 MB (.pdf फ़ॉर्मेट)। फ़ाइल तुरंत सर्वर पर स्थायी रूप से सहेजी जाएगी।
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Attach from Existing Storage */}
                  {storageFiles.length > 0 && (
                    <div className="pt-3 border-t border-stone-200 dark:border-stone-700 space-y-2">
                      <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-amber-500" />
                        <span>या सर्वर स्टोरेज में पहले से मौजूद PDF से चुनें:</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono"
                        onChange={e => {
                          const found = storageFiles.find(f => f.fileName === e.target.value);
                          if (found) handleAttachExistingFile(found);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>-- स्टोरेज से फ़ाइल चुनें --</option>
                        {storageFiles.map(f => (
                          <option key={f.fileName} value={f.fileName}>
                            {f.fileName} ({f.sizeFormatted})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-[#7A2A1E] hover:bg-[#5E1F16] text-[#D4A017] border border-[#D4A017]/40 text-xs font-black shadow-md flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>ई-नोट सेव करें</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
