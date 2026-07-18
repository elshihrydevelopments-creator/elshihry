'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { FacebookPixel } from '@/components/project-land/FacebookPixel';

interface ThankYouClientProps {
  locale: 'ar' | 'en';
  slug: string;
  projectTitle: string;
  clientName: string;
  clientPhone: string;
  fbPixelId?: string;
}

function FadeUp({ delay, children, className }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.72, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function ThankYouClient({ locale, slug, projectTitle, clientName, clientPhone, fbPixelId }: ThankYouClientProps) {
  const isArabic = locale === 'ar';

  // Mask phone: show first 3 + last 2 digits, rest as *
  const maskedPhone = clientPhone.length > 5
    ? clientPhone.slice(0, 3) + '*'.repeat(clientPhone.length - 5) + clientPhone.slice(-2)
    : clientPhone;

  const steps = isArabic
    ? ['استلام الطلب ✓', 'مراجعة البيانات', 'التواصل خلال ٢٤ ساعة']
    : ['Received ✓', 'Under review', 'Contact within 24h'];

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[#08090a] px-6 pt-36 pb-20 selection:bg-gold/25 selection:text-white"
    >
      {fbPixelId && <FacebookPixel pixelId={fbPixelId} event="Lead" />}
      {/* ── Atmospheric lighting ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[25%] top-[-10%] h-[70vh] w-[55vw] rounded-full bg-gold/[0.065] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[15%] h-[50vh] w-[45vw] rounded-full bg-white/[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        {/* ── Top label ── */}
        <FadeUp delay={0} className="text-center ">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold/70">
            {isArabic ? 'الشحري للتطوير العقاري' : 'El Shihry Real Estate'}
          </p>
          <div className="mx-auto my-8 h-px w-14 bg-[linear-gradient(90deg,transparent,rgba(241,213,130,0.55),transparent)]" />
        </FadeUp>

        {/* ── Main two-column layout ── */}
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

          {/* ── Left: Heading + message ── */}
          <div className="text-center lg:text-start">

            <FadeUp delay={0.1}>
              <h1 className="text-[clamp(2.6rem,6.5vw,5rem)] font-extralight leading-[1.1] tracking-[-0.04em] text-white">
                {isArabic ? (
                  <>شكرًا لك{clientName && <>,<br /><span className="font-light italic text-gold">{clientName}</span></>}</>
                ) : (
                  <>Thank you{clientName && <>,<br /><span className="font-light italic text-gold">{clientName}</span></>}</>
                )}
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <span className="mt-6 inline-block rounded-full border border-white/8 bg-white/[0.03] px-5 py-2 text-sm text-white/45">
                {projectTitle}
              </span>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-8 max-w-lg text-base font-light leading-[2] text-white/45 lg:max-w-none">
                {isArabic
                  ? 'تم استلام طلبك بنجاح. سيتواصل معك أحد مستشارينا في أقرب وقت لتزويدك بكافة تفاصيل المشروع، الأسعار الحصرية، ومخططات الوحدات.'
                  : 'Your request has been received. One of our advisors will reach out to you shortly with full project details, exclusive pricing, and unit floorplans.'}
              </p>
            </FadeUp>

            {/* Progress steps */}
            <FadeUp delay={0.4} className="mt-10">
              <div className={`flex flex-wrap items-center justify-center gap-0 lg:justify-start`}>
                {steps.map((step, i) => (
                  <div key={i} className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} items-center`}>
                    <div className="flex flex-col items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-bold ${
                        i === 0
                          ? 'border-gold/50 bg-gold/10 text-gold shadow-[0_0_18px_rgba(241,213,130,0.18)]'
                          : 'border-white/8 bg-white/[0.025] text-white/22'
                      }`}>
                        {i + 1}
                      </div>
                      <p className={`w-24 text-center text-[10.5px] font-semibold tracking-wide ${i === 0 ? 'text-gold/75' : 'text-white/22'}`}>
                        {step}
                      </p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mb-7 h-px w-10 bg-white/8 sm:w-14" />
                    )}
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* CTAs */}
            <FadeUp delay={0.5} className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href={slug === 'qomor-renders' ? `/${locale}/qomor-renders` : `/${locale}/projects/${slug}/land`}
                className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-gold/30 px-8 text-xs font-bold uppercase tracking-[0.22em] text-gold transition-all duration-500 hover:border-gold"
              >
                <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-rich-black">
                  {isArabic ? 'العودة للمشروع' : 'Back to Project'}
                </span>
              </Link>
              <Link
                href={`/${locale}`}
                className="inline-flex h-12 items-center rounded-full px-6 text-xs font-bold uppercase tracking-[0.22em] text-white/22 transition-colors hover:text-white/50"
              >
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
            </FadeUp>
          </div>

          {/* ── Right: Confirmation card ── */}
          <FadeUp delay={0.35}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
              {/* Inner glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,rgba(241,213,130,0.07),transparent_55%)]" />

              {/* Header */}
              <div className="relative mb-6 pb-5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                  {isArabic ? 'تفاصيل طلبك' : 'Your Request Details'}
                </p>
              </div>

              {/* Fields */}
              <div className="relative space-y-4">
                {/* Name */}
                <div className="rounded-[1.2rem] border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/28">
                    {isArabic ? 'الاسم الكامل' : 'Full Name'}
                  </p>
                  <p className="mt-1.5 text-base font-light text-white/80">{clientName}</p>
                </div>

                {/* Phone */}
                {clientPhone && (
                  <div className="rounded-[1.2rem] border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/28">
                      {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                    </p>
                    <p className="mt-1.5 font-light tracking-widest text-white/80" dir="ltr">{maskedPhone}</p>
                  </div>
                )}

                {/* Status */}
                <div className="rounded-[1.2rem] border border-gold/15 bg-gold/[0.05] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/50">
                    {isArabic ? 'حالة الطلب' : 'Status'}
                  </p>
                  <div className="mt-2 flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold/80" />
                    </span>
                    <p className="text-sm font-medium text-gold/80">
                      {isArabic ? 'قيد المراجعة' : 'Under review'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <p className="relative mt-6 text-[11px] leading-6 text-white/22">
                {isArabic
                  ? 'سيتم التواصل معك خلال ٢٤ ساعة على الرقم المسجّل.'
                  : 'You will be contacted within 24 hours on the registered number.'}
              </p>
            </div>
          </FadeUp>
        </div>

      </div>
    </div>
  );
}
