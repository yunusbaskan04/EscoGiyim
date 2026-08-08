'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LightboxImage {
  id?: string;
  url: string;
  title?: string;
  description?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function LightboxModal({ isOpen, images, initialIndex = 0, onClose }: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isZoomed, setIsZoomed] = React.useState(false);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  React.useEffect(() => {
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

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md transition-opacity">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="rounded-full bg-slate-800/80 p-2.5 text-white hover:bg-slate-700 transition"
          title={isZoomed ? 'Küçült' : 'Büyüt'}
        >
          {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-slate-800/80 p-2.5 text-white hover:bg-slate-700 transition"
          title="Kapat (Esc)"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Image Display */}
      <div className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-2xl">
        <div
          className={cn(
            'relative transition-transform duration-300 ease-out',
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.title || 'Resim görünümü'}
            width={1200}
            height={900}
            className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-800/80 p-3 text-white hover:bg-slate-700 transition shadow-lg"
            title="Önceki Resim"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-800/80 p-3 text-white hover:bg-slate-700 transition shadow-lg"
            title="Sonraki Resim"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Bottom Info & Thumbnail Carousel */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3 px-4">
        {currentImage.title && (
          <div className="rounded-lg bg-slate-900/80 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            {currentImage.title} ({currentIndex + 1} / {images.length})
          </div>
        )}

        {images.length > 1 && (
          <div className="flex max-w-full gap-2 overflow-x-auto p-1 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  idx === currentIndex
                    ? 'border-amber-500 scale-105 shadow-md'
                    : 'border-slate-700 opacity-60 hover:opacity-100'
                )}
              >
                <Image src={img.url} alt="Küçük resim" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
