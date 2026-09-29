import React, { useState, useRef } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Building,
  Calendar,
  Layers,
  Check,
  ShieldCheck,
  Info,
  Files
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Dropzone } from '../components/common/Dropzone';
import { BatchFileCleaner } from '../components/common/BatchFileCleaner';
import { TrustBadge } from '../components/common/TrustBadge';
import { ScoreMeter } from '../components/common/ScoreMeter';
import { parsePdfMetadata, stripPdfMetadata } from '../utils/pdfEngine';
import { parseDocMetadata, stripDocMetadata } from '../utils/docEngine';
import { PdfMetadataInfo, DocMetadataInfo } from '../types';
import { logActivity } from '../utils/storage';
import { playPop, playHover, playSuccess } from '../utils/soundEngine';

interface UnifiedDocCleanerViewProps {
  onNavigate: (path: string) => void;
  defaultFormatFilter?: 'all' | 'pdf' | 'office';
}

export const UnifiedDocCleanerView: React.FC<UnifiedDocCleanerViewProps> = ({
  onNavigate,
  defaultFormatFilter = 'all'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'doc' | null>(null);
  
  // Specific parsed metadata
  const [pdfData, setPdfData] = useState<PdfMetadataInfo | null>(null);
  const [docData, setDocData] = useState<DocMetadataInfo | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [cleanedFileName, setCleanedFileName] = useState('');
  const [strippedItems, setStrippedItems] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'office'>(defaultFormatFilter);

  const downloadSectionRef = useRef<HTMLDivElement>(null);

  const currentPrivacyScore = pdfData ? (isDone ? 100 : pdfData.privacyScore) : docData ? (isDone ? 100 : docData.privacyScore) : 100;

  const needsCleaning = Boolean(
    (pdfData && (
      Boolean(pdfData.author) ||
      Boolean(pdfData.title) ||
      Boolean(pdfData.creator) ||
      Boolean(pdfData.producer) ||
      Boolean(pdfData.creationDate) ||
      Boolean(pdfData.modificationDate) ||
      pdfData.privacyScore < 100
    )) ||
    (docData && (
      Boolean(docData.creator) ||
      Boolean(docData.lastModifiedBy) ||
      Boolean(docData.company) ||
      Boolean(docData.manager) ||
      Boolean(docData.created) ||
      Boolean(docData.modified) ||
      docData.privacyScore < 100
    ))
  );

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);
    setIsDone(false);
    setCleanedBlob(null);
    setPdfData(null);
    setDocData(null);

    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';

    try {
      if (ext === 'pdf' || selectedFile.type === 'application/pdf') {
        setFileType('pdf');
        const data = await parsePdfMetadata(selectedFile);
        setPdfData(data);
        logActivity({
          toolId: 'document-pdf-cleaner',
          toolName: 'Document & PDF Cleaner (PDF Scan)',
          targetName: selectedFile.name,
          type: 'scan',
          scoreBefore: data.privacyScore,
        });
      } else {
        setFileType('doc');
        const data = await parseDocMetadata(selectedFile);
        setDocData(data);
        logActivity({
          toolId: 'document-pdf-cleaner',
          toolName: 'Document & PDF Cleaner (Office Scan)',
          targetName: selectedFile.name,
          type: 'scan',
          scoreBefore: data.privacyScore,
        });
      }
    } catch (e) {
      console.error('Failed reading document metadata:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanDocument = async () => {
    if (!file || !fileType) return;
    setIsCleaning(true);
    playPop();

    try {
      if (fileType === 'pdf') {
        const res = await stripPdfMetadata(file);
        setCleanedBlob(res.blob);
        setCleanedFileName(res.fileName);
        setStrippedItems(res.strippedItems);
        setIsDone(true);
        playPop();
        setTimeout(() => playSuccess(), 120);

        setTimeout(() => {
          if (downloadSectionRef.current) {
            downloadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#10B981', '#6366F1'],
          });
        } catch (e) {}

        logActivity({
          toolId: 'document-pdf-cleaner',
          toolName: 'Document & PDF Cleaner (Cleaned PDF)',
          targetName: file.name,
          type: 'clean',
          scoreBefore: pdfData?.privacyScore || 60,
          scoreAfter: 100,
          itemsRemovedCount: res.strippedItems.length,
          bytesRemoved: Math.max(0, file.size - res.blob.size),
        });
      } else {
        const res = await stripDocMetadata(file);
        setCleanedBlob(res.blob);
        setCleanedFileName(res.fileName);
        setStrippedItems(res.strippedItems);
        setIsDone(true);
        playPop();
        setTimeout(() => playSuccess(), 120);

        setTimeout(() => {
          if (downloadSectionRef.current) {
            downloadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#10B981', '#6366F1'],
          });
        } catch (e) {}

        logActivity({
          toolId: 'document-pdf-cleaner',
          toolName: 'Document & PDF Cleaner (Cleaned Office Doc)',
          targetName: file.name,
          type: 'clean',
          scoreBefore: docData?.privacyScore || 60,
          scoreAfter: 100,
          itemsRemovedCount: res.strippedItems.length,
          bytesRemoved: Math.max(0, file.size - res.blob.size),
        });
      }
    } catch (e) {
      console.error('Failed cleaning document:', e);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedBlob || !cleanedFileName) return;
    playPop();
    const url = URL.createObjectURL(cleanedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    playPop();
    setFile(null);
    setFileType(null);
    setPdfData(null);
    setDocData(null);
    setCleanedBlob(null);
    setIsDone(false);
  };

  // Accepted formats depending on active tab
  const getAcceptedFormats = () => {
    if (activeTab === 'pdf') return ['PDF'];
    if (activeTab === 'office') return ['DOCX', 'XLSX', 'PPTX'];
    return ['PDF', 'DOCX', 'XLSX', 'PPTX'];
  };

  const getAcceptedMimeTypes = () => {
    if (activeTab === 'pdf') return ['application/pdf'];
    if (activeTab === 'office') {
      return [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
    }
    return [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-sm">
          <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Unified Document & PDF Sanitizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          PDF & Document Metadata Cleaner
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Sanitize author identities, creation timestamps, corporate company tags, and edit histories from PDF documents and Microsoft Office (Word, Excel, PowerPoint) files in one place.
        </p>
        <div className="pt-1 flex justify-center">
          <TrustBadge type="local" showExplanation />
        </div>
      </div>

      {/* Format Category Filter Pills (When no file selected) */}
      {!file && (
        <div className="flex justify-center">
          <div className="p-1.5 rounded-full clay-card flex flex-wrap items-center justify-center gap-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab('all');
              }}
              onMouseEnter={playHover}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'clay-pill-active' : 'clay-pill-inactive'
              }`}
            >
              All Formats (PDF, DOCX, XLSX, PPTX)
            </button>
            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab('pdf');
              }}
              onMouseEnter={playHover}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pdf' ? 'clay-pill-active' : 'clay-pill-inactive'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>PDF Documents</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab('office');
              }}
              onMouseEnter={playHover}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'office' ? 'clay-pill-active' : 'clay-pill-inactive'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
              <span>Office Documents (Word / Excel / PPT)</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Switcher: Single vs Batch */}
      <div className="flex justify-center">
        <div className="p-1.5 rounded-full clay-card flex items-center gap-1 shadow-sm">
          <button
            id="doc-mode-single"
            type="button"
            onClick={() => {
              playPop();
              setMode('single');
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'single' ? 'clay-pill-active' : 'clay-pill-inactive'
            }`}
          >
            Single Document Audit
          </button>
          <button
            id="doc-mode-batch"
            type="button"
            onClick={() => {
              playPop();
              setMode('batch');
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'batch' ? 'clay-pill-active' : 'clay-pill-inactive'
            }`}
          >
            <Files className="w-3.5 h-3.5" />
            <span>Batch Mode (Multiple Files)</span>
          </button>
        </div>
      </div>

      {/* Batch Processing Mode */}
      {mode === 'batch' && (
        <div className="space-y-6 animate-fadeIn">
          <BatchFileCleaner
            title={`Drop multiple ${activeTab === 'pdf' ? 'PDF' : activeTab === 'office' ? 'Office' : 'PDF & Office'} documents to clean at once`}
            subtitle="Queue PDF, DOCX, XLSX, or PPTX documents for simultaneous in-browser privacy stripping"
            acceptedFormats={getAcceptedFormats()}
            acceptedMimeTypes={getAcceptedMimeTypes()}
            sampleType={activeTab === 'pdf' ? 'pdf' : activeTab === 'office' ? 'doc' : 'doc-and-pdf'}
            accentColor="blue"
            toolName="Document & PDF Batch Sanitizer"
          />
        </div>
      )}

      {/* Single Mode Upload Dropzone */}
      {mode === 'single' && !file && (
        <div className="space-y-6 animate-fadeIn">
          <Dropzone
            onFileSelected={handleFileSelected}
            acceptedFormats={getAcceptedFormats()}
            acceptedMimeTypes={getAcceptedMimeTypes()}
            title={`Drop your ${activeTab === 'pdf' ? 'PDF' : activeTab === 'office' ? 'Office' : 'PDF or Office'} document here`}
            subtitle={
              activeTab === 'pdf'
                ? 'or choose a PDF document from your computer'
                : activeTab === 'office'
                ? 'or choose a Word (DOCX), Excel (XLSX), or PowerPoint (PPTX) file'
                : 'or choose a PDF, DOCX, XLSX, or PPTX file'
            }
            sampleType={activeTab === 'pdf' ? 'pdf' : activeTab === 'office' ? 'doc' : 'doc-and-pdf'}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Single Mode Document Analysis and Clean Workspace */}
      {mode === 'single' && file && (pdfData || docData) && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="clay-card p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 w-full overflow-hidden">
            <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto min-w-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl clay-icon-pod flex items-center justify-center shrink-0 ${
                  fileType === 'pdf'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {fileType === 'pdf' ? (
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                  <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7" />
                )}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Target Document
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      fileType === 'pdf'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {fileType === 'pdf' ? 'PDF File' : 'Office Document'}
                  </span>
                </div>
                <h2
                  className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate block"
                  title={file.name}
                >
                  {file.name}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                  {pdfData && (
                    <>
                      <span>•</span>
                      <span>{pdfData.pageCount || 1} page(s)</span>
                    </>
                  )}
                  {docData && (
                    <>
                      <span>•</span>
                      <span className="font-mono uppercase">{docData.fileType}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/80 dark:border-slate-800">
              <ScoreMeter score={currentPrivacyScore} size="md" />
              <button
                type="button"
                onClick={reset}
                onMouseEnter={playHover}
                className="clay-circle-btn w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Inspect another document"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Success Banner / Download Sign */}
          {isDone && (
            <div
              ref={downloadSectionRef}
              id="download-doc-sign"
              className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 space-y-5 animate-fadeIn shadow-lg shadow-emerald-500/10 scroll-mt-28"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        Sanitization Complete
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      Cleaned {fileType === 'pdf' ? 'PDF' : 'Office Document'} Ready for Download
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Author tags, internal software keys, revision histories, and timestamps have been sanitized.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  onMouseEnter={playHover}
                  className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/35 flex items-center justify-center gap-2 active:scale-[0.98] shrink-0 cursor-pointer animate-pulse hover:animate-none"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Clean {fileType === 'pdf' ? 'PDF' : 'Document'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-3 border-t border-emerald-500/20">
                {strippedItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{item} purged</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inspection Details Grid - PDF Mode */}
          {fileType === 'pdf' && pdfData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 sm:p-7 rounded-3xl clay-card space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <User className="w-4 h-4" />
                  <span>Author & Document Metadata</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Author:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      {pdfData.author || 'None found'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Title:</span>
                    <span className="text-slate-800 dark:text-slate-200">{pdfData.title || 'None found'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Subject:</span>
                    <span className="text-slate-800 dark:text-slate-200">{pdfData.subject || 'None found'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Keywords:</span>
                    <span className="text-slate-800 dark:text-slate-200">{pdfData.keywords || 'None found'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl clay-card space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Application & Timestamps</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Creator Software:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {pdfData.creator || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">PDF Producer:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {pdfData.producer || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Creation Date:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {pdfData.creationDate ? pdfData.creationDate.split('T')[0] : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Modified Date:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {pdfData.modificationDate ? pdfData.modificationDate.split('T')[0] : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inspection Details Grid - Office Mode */}
          {fileType === 'doc' && docData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 sm:p-7 rounded-3xl clay-card space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <User className="w-4 h-4" />
                  <span>Author & Revision Details</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Author:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      {docData.creator || 'None found'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Last Modified By:</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {docData.lastModifiedBy || 'None found'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Title:</span>
                    <span className="text-slate-800 dark:text-slate-200">{docData.title || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Editing Time:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {docData.totalTime ? `${docData.totalTime} mins` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl clay-card space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <Building className="w-4 h-4" />
                  <span>Enterprise & System Fields</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Company:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {docData.company || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Manager:</span>
                    <span className="text-slate-800 dark:text-slate-200">{docData.manager || 'None'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Application:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {docData.application || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-sans">Created Date:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {docData.created ? docData.created.split('T')[0] : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button if not cleaned */}
          {!isDone && (
            <div className="p-6 sm:p-8 rounded-3xl clay-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Clean this {fileType === 'pdf' ? 'PDF Document' : 'Office Document'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {fileType === 'pdf'
                    ? 'Resets document properties, clears author tags, and eliminates creation timestamps.'
                    : 'Modifies internal XML packages, removes contributor profiles, and repacks into a clean file.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCleanDocument}
                disabled={isCleaning}
                onMouseEnter={playHover}
                className={`w-full sm:w-auto px-7 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer transition-all ${
                  needsCleaning
                    ? 'clay-button-pro sanitize-attention-glow text-white'
                    : 'clay-button-pro'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isCleaning
                    ? 'Sanitizing Document...'
                    : `Sanitize & Download Clean ${fileType === 'pdf' ? 'PDF' : 'Document'}`}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SEO / FAQ */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-slate-400">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">How are documents & PDFs processed?</h4>
          <p className="leading-relaxed">
            All processing occurs strictly client-side inside your browser sandbox. PDF metadata is parsed and neutralized using web binary stream parsers, while Office documents (.docx, .xlsx, .pptx) are unpacked in memory to sanitize the XML property bundles before being cleanly repacked.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Will document layout or formatting change?</h4>
          <p className="leading-relaxed">
            No. Your text formatting, pages, tables, fonts, formulas, and presentations remain completely intact. Only metadata tags (author, company, editing duration, creation history) are cleared.
          </p>
        </div>
      </div>
    </div>
  );
};
