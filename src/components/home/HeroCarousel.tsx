'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useRegionStore } from '@/store/useRegionStore';
import { useMounted } from '@/lib/useMounted';
import api from '@/lib/axios';
import Link from 'next/link';

interface ApiBanner {
  id: number;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  imageUrlMobile?: string | null;
  targetUrl?: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

// Fallback slides when no banners are configured
const FALLBACK_SLIDES: ApiBanner[] = [
  {
    id: 0,
    title: 'Descubre Productos\nQue Definen Tu Estilo',
    subtitle: 'Esenciales para el hogar moderno — relojes premium, accesorios y más.',
    imageUrl: 'https://images.unsplash.com/photo-1767396858167-96df7b775931?w=1440&q=80',
    position: 'main',
    sortOrder: 0,
    isActive: true,
  },
  {
    id: 1,
    title: 'Relojes Premium\nPara Toda Ocasión',
    subtitle: 'Precisión y diseño atemporal. Explora nuestra colección insignia.',
    imageUrl: 'https://images.unsplash.com/photo-1583607314031-76f40f069cce?w=1440&q=80',
    position: 'main',
    sortOrder: 1,
    isActive: true,
  },
];

export default function HeroCarousel() {
  const { theme } = useTheme();
  const layout = theme.layout ?? 'default';
  const mounted = useMounted();
  const selectedRegion = useRegionStore((s) => s.selectedRegion);
  const [slides, setSlides] = useState<ApiBanner[]>(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banners from backend
  useEffect(() => {
    if (!mounted) return;

    const fetchBanners = async () => {
      try {
        let data: ApiBanner[] = [];

        if (selectedRegion?.id) {
          const res = await api.get<{ data: ApiBanner[] }>(
            `/api/banners/active/region/${selectedRegion.id}`,
            { params: { position: 'main' } },
          );
          data = res.data.data ?? [];
        } else {
          const res = await api.get<{ data: ApiBanner[] }>('/api/banners', {
            params: { isActive: true, position: 'main', limit: 10 },
          });
          data = res.data.data ?? [];
        }

        if (data.length > 0) {
          setSlides(data.sort((a, b) => a.sortOrder - b.sortOrder));
          setCurrentSlide(0);
        }
      } catch {
        // Keep fallback slides on error
      }
    };

    fetchBanners();
  }, [mounted, selectedRegion?.id]);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div
      className={cn(
        'hero-carousel w-full h-[320px] sm:h-[420px] relative overflow-hidden',
      )}
      style={{
        backgroundColor: 'var(--banner-primary)',
        borderRadius: 'var(--banner-radius)',
        color: 'var(--banner-text)',
      }}
    >
      {slides.map((slide, index) => {
        const imageUrl =
          typeof window !== 'undefined' && window.innerWidth < 640 && slide.imageUrlMobile
            ? slide.imageUrlMobile
            : slide.imageUrl;

        const hasImage = Boolean(imageUrl);

        const inner = (
          <>
            {hasImage && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: hasImage
                  ? 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)'
                  : 'var(--banner-gradient)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-6 sm:pb-10 lg:px-20 lg:pb-[52px]">
              <div className="flex flex-col gap-3 lg:gap-4">
                <h1 className="text-2xl sm:text-4xl lg:text-[52px] font-bold leading-[1.1] whitespace-pre-line" style={{ color: 'var(--banner-text)' }}>
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: 'var(--banner-text)', opacity: 0.9 }}>
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          </>
        );

        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
          >
            {slide.targetUrl ? (
              <Link href={slide.targetUrl} className="absolute inset-0 block">
                {inner}
              </Link>
            ) : (
              inner
            )}
          </div>
        );
      })}

      {/* Arrows */}
      <button
        onClick={goToPrev}
        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-3 lg:left-6 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/15 border border-white/25 items-center justify-center hover:bg-white/25 transition z-10"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={goToNext}
        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-3 lg:right-6 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/15 border border-white/25 items-center justify-center hover:bg-white/25 transition z-10"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-20 flex items-center gap-3 z-10">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'rounded transition-all',
                index === currentSlide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30',
              )}
            />
          ))}
        </div>
        <span className="text-white/50 text-xs">{currentSlide + 1} / {totalSlides}</span>
      </div>
    </div>
  );
}
