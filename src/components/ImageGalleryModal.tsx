import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Share2,
  Download,
  Check
} from 'lucide-react';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title: string;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="image-gallery-modal"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col text-white select-none animate-fadeIn"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-orange-400 border border-slate-700">
            {currentIndex + 1} / {images.length}
          </span>
          <h3 className="text-sm font-semibold text-slate-200 truncate hidden sm:block">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="gallery-toggle-thumbnails-btn"
            onClick={() => setShowThumbnails(!showThumbnails)}
            title="Toggle Thumbnails Strip"
            className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
              showThumbnails ? 'bg-slate-800 text-orange-400' : ''
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="gallery-share-btn"
            onClick={handleShare}
            title="Share"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            id="gallery-fullscreen-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            id="gallery-close-btn"
            onClick={onClose}
            title="Close Gallery (Esc)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-grow flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              id="gallery-prev-btn"
              onClick={handlePrev}
              aria-label="Previous Photo"
              className="absolute left-3 sm:left-6 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-[#f97316] text-white border border-slate-700 hover:border-[#f97316] shadow-xl backdrop-blur-sm transition-all transform hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              id="gallery-next-btn"
              onClick={handleNext}
              aria-label="Next Photo"
              className="absolute right-3 sm:right-6 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-[#f97316] text-white border border-slate-700 hover:border-[#f97316] shadow-xl backdrop-blur-sm transition-all transform hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Active Image with smooth render */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - photo ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-200"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Thumbnails Footer Strip */}
      {showThumbnails && images.length > 1 && (
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto scrollbar-thin">
          <div className="flex items-center justify-center gap-2.5 min-w-max mx-auto">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                id={`gallery-thumb-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#f97316] scale-105 shadow-md shadow-orange-500/20 ring-2 ring-orange-500/30'
                    : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {currentIndex === idx && (
                  <div className="absolute inset-0 bg-[#f97316]/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
