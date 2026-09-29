import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Film,
  Music,
  FileText,
  Link2Off,
  KeyRound,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import { playPop, playClayCardHover } from '../../utils/soundEngine';
import { FileTypeIcon } from '../common/FileTypeIcon';

interface ClayToolsDirectoryProps {
  onNavigate: (path: string) => void;
}

export interface ClayToolItem {
  id: string;
  name: string;
  summary: string;
  desc: string;
  format: string;
  path: string;
  categories: Array<'Privacy Checkup' | 'Media' | 'Links' | 'Security'>;
  icon: React.ComponentType<{ className?: string }>;
  fileType: 'pdf' | 'jpg' | 'docx' | 'mp4' | 'mp3' | 'url' | 'key' | 'shield';
}

export const CLAY_TOOLS: ClayToolItem[] = [
  {
    id: 'exif-remover',
    name: 'Photo Privacy Inspector & Cleaner',
    summary: 'EXIF, GPS, camera specs scrubber',
    desc: 'Inspect and strip GPS coordinates, camera specs, device serials, and timestamps from photos before sharing.',
    format: 'JPG, JPEG, PNG',
    path: '/tools/exif-remover',
    categories: ['Privacy Checkup', 'Media'],
    icon: Eye,
    fileType: 'jpg',
  },
  {
    id: 'video-metadata-cleaner',
    name: 'Video Metadata Inspector',
    summary: 'MP4, MOV tracking data inspector',
    desc: 'Inspect and scrub user data (UDTA), GPS coordinates, creation timestamps, and device tracking tokens from videos.',
    format: 'MP4, MOV',
    path: '/tools/video-metadata-cleaner',
    categories: ['Privacy Checkup', 'Media'],
    icon: Film,
    fileType: 'mp4',
  },
  {
    id: 'audio-metadata-cleaner',
    name: 'Audio Metadata Cleaner',
    summary: 'ID3 tags and hidden metadata remover',
    desc: 'Purge ID3v1 and ID3v2 tags, embedded album artwork, comments, and artist hardware markers from MP3 audio.',
    format: 'MP3',
    path: '/tools/audio-metadata-cleaner',
    categories: ['Media'],
    icon: Music,
    fileType: 'mp3',
  },
  {
    id: 'document-pdf-cleaner',
    name: 'PDF & Document Metadata Cleaner',
    summary: 'PDF, DOCX, XLSX, PPTX scrubber',
    desc: 'Sanitize author identities, creation timestamps, corporate tags, and revision traces from PDF documents and Office files.',
    format: 'PDF, DOCX, XLSX, PPTX',
    path: '/tools/document-metadata-cleaner',
    categories: ['Privacy Checkup'],
    icon: FileText,
    fileType: 'pdf',
  },
  {
    id: 'url-privacy-cleaner',
    name: 'URL Privacy Cleaner',
    summary: 'UTM, fbclid, gclid tracking token stripper',
    desc: 'Sanitize URLs by stripping UTM marketing tags, Facebook click IDs, Google click IDs, and referral tracking tokens.',
    format: 'HTTP, HTTPS, Links',
    path: '/tools/url-privacy-cleaner',
    categories: ['Links'],
    icon: Link2Off,
    fileType: 'url',
  },
  {
    id: 'password-generator',
    name: 'Password, Passphrase & Username Generator',
    summary: 'CSPRNG keys, Diceware passphrases & aliases',
    desc: 'Generate cryptographically secure passwords, memorable Diceware passphrases, and anonymous pseudonyms with local entropy.',
    format: 'Keys, Words & Aliases',
    path: '/tools/password-generator',
    categories: ['Security'],
    icon: KeyRound,
    fileType: 'key',
  },
];

export const ClayToolsDirectory: React.FC<ClayToolsDirectoryProps> = ({ onNavigate }) => {
  const tools = CLAY_TOOLS;

  const handleToolClick = (path: string) => {
    playPop();
    onNavigate(path);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16">
      {/* Centered Utility Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 
          id="tools-directory-title"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          Tools Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Client-side utilities designed to inspect, scrub, and protect your digital privacy.
        </p>
      </div>

      {/* Quick Tools Section */}
      <div id="quick-tools-section" className="mt-8 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Quick Tools
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Instant 1-Click Launch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Quick Tool 1: Metadata Remover (Photo / EXIF) */}
          <div
            id="quick-tool-meta-data-remover"
            role="button"
            tabIndex={0}
            onClick={() => handleToolClick('/tools/exif-remover')}
            onMouseEnter={playClayCardHover}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToolClick('/tools/exif-remover');
              }
            }}
            className="clay-card p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer group hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all select-none"
            aria-label="Open Metadata Remover"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl clay-icon-pod flex items-center justify-center shrink-0 p-2 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <FileTypeIcon type="jpg" className="w-7 h-7" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Metadata Remover
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    EXIF & GPS
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Purge GPS coordinates, camera specs & timestamps
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Quick Tool 2: PDF Metadata Remover */}
          <div
            id="quick-tool-pdf-metadata-remover"
            role="button"
            tabIndex={0}
            onClick={() => handleToolClick('/tools/document-metadata-cleaner')}
            onMouseEnter={playClayCardHover}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToolClick('/tools/document-metadata-cleaner');
              }
            }}
            className="clay-card p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer group hover:border-rose-400/60 dark:hover:border-rose-500/60 transition-all select-none"
            aria-label="Open PDF Metadata Remover"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl clay-icon-pod flex items-center justify-center shrink-0 p-2 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                <FileTypeIcon type="pdf" className="w-7 h-7" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    PDF Metadata Remover
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                    PDF & Docs
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Scrub author names, corporate info & revision tags
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid: Dynamic 3-Column Desktop, 2-Column Tablet, and 1-Column Mobile Layout */}
      <motion.div 
        id="tools-clay-grid"
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full max-w-7xl mx-auto mt-8 sm:mt-10"
      >
        <AnimatePresence>
          {tools.map((tool, idx) => {
            const IconComp = tool.icon;
            return (
              <motion.div
                key={tool.id}
                id={`tool-card-${tool.id}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, delay: idx * 0.02 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleToolClick(tool.path)}
                onMouseEnter={playClayCardHover}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToolClick(tool.path);
                  }
                }}
                aria-label={`Open ${tool.name}: ${tool.summary}`}
                className="clay-card min-h-[260px] sm:min-h-[280px] p-5 sm:p-6 lg:p-6 flex flex-col justify-between cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 select-none"
              >
                <div>
                  {/* Top Row: Embossed squircle pod on left with distinct file type SVG, emerald status badge on right */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-[20px] clay-icon-pod flex items-center justify-center shrink-0 p-2.5">
                        <FileTypeIcon type={tool.fileType} className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      {/* Secondary micro indicator icon */}
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-[#1A2438] border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <IconComp className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <span className="clay-status-pill text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 tracking-wide flex items-center gap-1.5 min-h-[24px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      100% In-Browser
                    </span>
                  </div>

                  {/* Title & Summaries */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wide">
                    {tool.summary}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 line-clamp-3 font-normal">
                    {tool.desc}
                  </p>
                </div>

                {/* Bottom Row: File format label on left, Launch link with accessible 44px+ touch target on right */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 mt-4 sm:mt-5 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate max-w-[50%]">
                    {tool.format}
                  </span>
                  <div className="inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                    <span>Launch Tool</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
