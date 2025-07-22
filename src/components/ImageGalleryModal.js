"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGalleryModal({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Ensure modal takes full viewport height on mobile
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.height = 'unset';
      document.body.style.height = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.height = 'unset';
      document.body.style.height = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  // Touch handlers for mobile swipe gestures
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      style={{
        minHeight: '100vh',
        minHeight: '100dvh' // Dynamic viewport height for mobile browsers
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header with close button and counter - Mobile optimized */}
      <div className="flex items-center justify-between p-4 md:p-6 bg-black/50 backdrop-blur-sm">
        <div className="text-white text-sm md:text-base font-medium">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors p-2 -m-2"
        >
          <X size={24} className="md:hidden" />
          <X size={32} className="hidden md:block" />
        </button>
      </div>

      {/* Main Image Container */}
      <div 
        className="flex-1 relative flex items-center justify-center px-4 md:px-8 min-h-0"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ minHeight: 'calc(100vh - 200px)', minHeight: 'calc(100dvh - 200px)' }}
      >
        {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 hidden md:block"
            >
              <ChevronLeft size={48} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 hidden md:block"
            >
              <ChevronRight size={48} />
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="relative w-full h-full max-w-4xl">
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>

        {/* Mobile swipe indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-xs md:hidden bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            Swipe left or right to navigate
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile optimized */}
      <div className="p-4 md:p-6 bg-black/50 backdrop-blur-sm">
        {/* Mobile Navigation Buttons */}
        {images.length > 1 && (
          <div className="flex items-center justify-center space-x-6 mb-4 md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-white font-medium">
              {currentIndex + 1} of {images.length}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Thumbnail Strip - Responsive */}
        {images.length > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2 md:space-x-3 overflow-x-auto max-w-full md:max-w-md px-2 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-white scale-110 shadow-lg' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 48px, 64px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
