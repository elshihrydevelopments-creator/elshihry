'use client';

import { useEffect, useMemo, useState } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';
import { Calculator, TrendingUp } from 'lucide-react';

import { MagneticButton } from '@/components/project-land/MagneticButton';
import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { ProjectUnitRecord } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

function formatCurrency(value: number, isArabic: boolean) {
  return new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-EG', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'EGP',
  }).format(value);
}

function AnimatedNumber({ formatter, value }: { formatter: (value: number) => string; value: number }) {
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(formatter(value));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(formatter(latest)),
    });

    return () => controls.stop();
  }, [formatter, motionValue, value]);

  return <span>{display}</span>;
}

export function ProjectRoiCalculator({
  isArabic,
  units,
}: {
  isArabic: boolean;
  units: ProjectUnitRecord[];
}) {
  const availablePrices = units
    .map((unit) => unit.price_egp)
    .filter((price): price is number => typeof price === 'number' && Number.isFinite(price) && price > 0);
  const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : 3500000;
  const maxPrice = availablePrices.length > 0 ? Math.max(...availablePrices) : 18000000;
  const [price, setPrice] = useState(Math.round((minPrice + maxPrice) / 2));
  const [yieldRate, setYieldRate] = useState(8);
  const [appreciationRate, setAppreciationRate] = useState(12);
  const annualRent = price * (yieldRate / 100);
  const projectedValue = price * (1 + appreciationRate / 100);
  const monthlyRent = annualRent / 12;
  const stats = useMemo(
    () => [
      {
        label: isArabic ? 'دخل إيجاري سنوي متوقع' : 'Expected Annual Rent',
        value: annualRent,
      },
      {
        label: isArabic ? 'دخل شهري تقريبي' : 'Approx. Monthly Rent',
        value: monthlyRent,
      },
      {
        label: isArabic ? 'قيمة متوقعة بعد سنة' : 'Projected Value After 1 Year',
        value: projectedValue,
      },
    ],
    [annualRent, isArabic, monthlyRent, projectedValue]
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.6rem] border border-gold/18 bg-[radial-gradient(circle_at_top_left,rgba(241,213,130,0.15),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-6 md:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <div className={cn('mb-5 flex items-center gap-3', isArabic ? 'flex-row-reverse' : '')}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/12 text-gold">
                <Calculator className="h-5 w-5" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-gold">{isArabic ? 'حاسبة استثمار' : 'Investor Calculator'}</p>
            </div>
            <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="leading-tight">
              {isArabic ? 'اقرأ العائد المتوقع قبل طلب الأسعار الخاصة' : 'Read The Potential Return Before Requesting Private Pricing'}
            </SplitRevealHeading>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62">
              {isArabic
                ? 'الأرقام تقديرية وتساعدك على المقارنة الأولية. المستشار العقاري يراجع معك السعر النهائي وخطة السداد والتوفر الحالي.'
                : 'These numbers are indicative for early comparison. Your advisor confirms final pricing, payment plan, and current availability.'}
            </p>
            <MagneticButton
              href="#lead-form"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-rich-black hover:bg-white"
            >
              {isArabic ? 'احصل على ملف الأسعار والمخططات' : 'Get Private Pricing & Floorplans'}
              <TrendingUp className="h-4 w-4" />
            </MagneticButton>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-rich-black/44 p-5 backdrop-blur-md md:p-6">
            <div className="space-y-6">
              {[
                {
                  label: isArabic ? 'قيمة الوحدة' : 'Unit Price',
                  max: maxPrice,
                  min: minPrice,
                  onChange: setPrice,
                  step: 50000,
                  value: price,
                  valueLabel: formatCurrency(price, isArabic),
                },
                {
                  label: isArabic ? 'عائد إيجاري سنوي' : 'Annual Rental Yield',
                  max: 14,
                  min: 4,
                  onChange: setYieldRate,
                  step: 0.5,
                  value: yieldRate,
                  valueLabel: `${yieldRate}%`,
                },
                {
                  label: isArabic ? 'نمو سنوي متوقع' : 'Expected Appreciation',
                  max: 22,
                  min: 4,
                  onChange: setAppreciationRate,
                  step: 0.5,
                  value: appreciationRate,
                  valueLabel: `${appreciationRate}%`,
                },
              ].map((slider) => (
                <label key={slider.label} className="block" data-cursor="Drag">
                  <span className={cn('mb-3 flex items-center justify-between gap-4 text-sm text-white/66', isArabic ? 'flex-row-reverse' : '')}>
                    <span>{slider.label}</span>
                    <span className="font-semibold text-gold">{slider.valueLabel}</span>
                  </span>
                  <input
                    className="h-2 w-full accent-gold"
                    max={slider.max}
                    min={slider.min}
                    onChange={(event) => slider.onChange(Number(event.target.value))}
                    step={slider.step}
                    type="range"
                    value={slider.value}
                  />
                </label>
              ))}
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/38">{stat.label}</p>
                  <p className="mt-3 text-lg font-bold text-white">
                    <AnimatedNumber formatter={(value) => formatCurrency(value, isArabic)} value={stat.value} />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
