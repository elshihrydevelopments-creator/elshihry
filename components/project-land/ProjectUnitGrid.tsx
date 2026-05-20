'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Bath, BedDouble, Layers3, Maximize2, SlidersHorizontal } from 'lucide-react';

import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { ProjectUnitRecord } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type GalleryImage = { alt: string; src: string };

type DisplayUnit = ProjectUnitRecord & {
  displayTitle: string;
  displayType: string;
};

function formatPrice(value: number | null, isArabic: boolean) {
  if (!value) {
    return isArabic ? 'السعر عند الطلب' : 'Price on request';
  }

  return new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-EG', {
    maximumFractionDigits: 0,
    notation: value >= 1000000 ? 'compact' : 'standard',
    style: 'currency',
    currency: 'EGP',
  }).format(value);
}

export function ProjectUnitGrid({
  galleryImages,
  isArabic,
  projectUnitTypes,
  units,
}: {
  galleryImages: GalleryImage[];
  isArabic: boolean;
  projectUnitTypes: string[];
  units: ProjectUnitRecord[];
}) {
  const fallbackImage = galleryImages[0]?.src || '/logo.webp';
  const displayUnits = useMemo<DisplayUnit[]>(() => {
    if (units.length > 0) {
      return units.map((unit) => ({
        ...unit,
        displayTitle: isArabic ? unit.title_ar || unit.title_en : unit.title_en || unit.title_ar,
        displayType: isArabic ? unit.unit_type_ar || unit.unit_type_en : unit.unit_type_en || unit.unit_type_ar,
      }));
    }

    const fallbackTypes = projectUnitTypes.length > 0 ? projectUnitTypes : [isArabic ? 'وحدة مميزة' : 'Signature Unit'];

    return fallbackTypes.slice(0, 4).map((type, index) => ({
      area_sqm: null,
      availability_status: 'available',
      bathrooms: null,
      bedrooms: null,
      displayTitle: type,
      displayType: type,
      floor_number: null,
      floorplan_url: null,
      id: `fallback-${type}-${index}`,
      image_url: galleryImages[index % Math.max(galleryImages.length, 1)]?.src || fallbackImage,
      price_egp: null,
      project_id: '',
      sort_order: index,
      title_ar: type,
      title_en: type,
      unit_type_ar: type,
      unit_type_en: type,
    }));
  }, [fallbackImage, galleryImages, isArabic, projectUnitTypes, units]);
  const prices = displayUnits.map((unit) => unit.price_egp).filter((price): price is number => typeof price === 'number' && price > 0);
  const areas = displayUnits.map((unit) => unit.area_sqm).filter((area): area is number => typeof area === 'number' && area > 0);
  const floors = displayUnits.map((unit) => unit.floor_number).filter((floor): floor is number => typeof floor === 'number');
  const [maxPrice, setMaxPrice] = useState(prices.length > 0 ? Math.max(...prices) : 0);
  const [minArea, setMinArea] = useState(areas.length > 0 ? Math.min(...areas) : 0);
  const [floor, setFloor] = useState('all');
  const [availability, setAvailability] = useState('all');
  const scarcityByType = displayUnits.reduce<Record<string, number>>((acc, unit) => {
    if (unit.availability_status === 'available') {
      acc[unit.displayType] = (acc[unit.displayType] ?? 0) + 1;
    }

    return acc;
  }, {});
  const filteredUnits = displayUnits.filter((unit) => {
    const priceMatch = maxPrice === 0 || !unit.price_egp || unit.price_egp <= maxPrice;
    const areaMatch = minArea === 0 || !unit.area_sqm || unit.area_sqm >= minArea;
    const floorMatch = floor === 'all' || String(unit.floor_number ?? '') === floor;
    const availabilityMatch = availability === 'all' || unit.availability_status === availability;

    return priceMatch && areaMatch && floorMatch && availabilityMatch;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
      <div className={cn('mb-8 max-w-3xl md:mb-10', isArabic ? 'mr-auto text-right' : 'text-left')}>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold md:text-xs md:tracking-[0.34em]">{isArabic ? 'الوحدات والتوفر' : 'Units & Availability'}</p>
        <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="mt-3 text-2xl sm:text-3xl md:text-5xl leading-tight">
          {isArabic ? 'اختر الوحدة قبل أن تضيق فرص التوفر' : 'Choose The Unit Before Availability Narrows'}
        </SplitRevealHeading>
      </div>

      <motion.div layout className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayUnits.map((unit) => {
          const image = unit.image_url || fallbackImage;
          const floorplan = unit.floorplan_url || image;

          return (
            <motion.article
              layout
              className="group relative min-h-[380px] md:min-h-[460px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.035] md:rounded-[2.4rem]"
              initial={{ opacity: 0, y: 20 }}
              key={unit.id}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="absolute inset-0">
                <Image src={image} alt={unit.displayTitle} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-80 transition duration-1000 group-hover:opacity-0 group-hover:scale-110" />
                <Image src={floorplan} alt={`${unit.displayTitle} floorplan`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-0 transition duration-1000 group-hover:opacity-90 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/20 to-transparent" />
              </div>
              <div className={cn('relative z-10 flex min-h-[380px] md:min-h-[460px] flex-col justify-end p-6 md:p-8', isArabic ? 'text-right' : 'text-left')}>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-gold/80">{unit.displayType}</p>
                <h3 className="mt-2 text-xl font-light tracking-tight text-white md:mt-3 md:text-2xl lg:text-3xl">{unit.displayTitle}</h3>
                <p className="mt-1.5 text-base font-medium text-white/90 md:mt-2 md:text-xl">{formatPrice(unit.price_egp, isArabic)}</p>
                
                <div className={cn('mt-5 grid grid-cols-4 gap-2.5 md:mt-8 md:gap-3', isArabic ? 'text-right' : 'text-left')}>
                  {[
                    { icon: Maximize2, label: unit.area_sqm ? `${unit.area_sqm} m²` : '-' },
                    { icon: BedDouble, label: unit.bedrooms != null ? `${unit.bedrooms}` : '-' },
                    { icon: Bath, label: unit.bathrooms != null ? `${unit.bathrooms}` : '-' },
                    { icon: Layers3, label: unit.floor_number != null ? `${unit.floor_number}` : '-' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-black/30 p-2.5 backdrop-blur-md transition group-hover:border-gold/20 md:rounded-2xl md:p-3">
                        <Icon className="mb-1.5 h-3.5 w-3.5 text-gold md:mb-2 md:h-4 md:w-4" />
                        <span className="text-[9px] font-medium text-white/70 md:text-[10px]">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
