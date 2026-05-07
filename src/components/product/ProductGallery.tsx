'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasImages = images.length > 0;
  const thumbCount = Math.max(4, images.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="w-full aspect-square lg:aspect-auto lg:h-[420px] rounded-xl bg-[#F0F0F0] flex items-center justify-center relative overflow-hidden">
        {hasImages && images[selectedIndex] ? (
          <Image
            src={images[selectedIndex]}
            alt="Producto"
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Package size={64} className="text-[#CCCCCC]" />
            <span className="text-xs text-[#CCCCCC] uppercase tracking-widest">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: thumbCount }).map((_, index) => {
          const src = images[index];
          return (
            <button
              key={index}
              onClick={() => src && setSelectedIndex(index)}
              className={cn(
                'w-[80px] h-[80px] shrink-0 rounded-lg border-2 bg-[var(--bg-input)] flex items-center justify-center transition-colors overflow-hidden relative',
                selectedIndex === index && src
                  ? 'border-[var(--primary)]'
                  : 'border-[#EAEAEA] hover:border-[var(--text-muted)]',
              )}
            >
              {src ? (
                <Image src={src} alt={`Imagen ${index + 1}`} fill className="object-cover" unoptimized />
              ) : (
                <Package size={18} className="text-[#DDDDDD]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
