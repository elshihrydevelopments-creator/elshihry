'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { MagneticButton } from '@/components/project-land/MagneticButton';
import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import { trackEvent } from '@/lib/analytics';
import type { LandingLeadFormSection } from '@/lib/project-landings/types';
import type { Locale } from '@/lib/site-content';
import { cn } from '@/lib/utils';

function isValidPhone(value: string) {
  return value.replace(/[^\d+]/g, '').length >= 8;
}

function FloatingInput({
  dir,
  label,
  name,
  type = 'text',
  valid,
}: {
  dir?: 'ltr' | 'rtl';
  label: string;
  name: string;
  type?: string;
  valid?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.label
        animate={{ opacity: active ? 0.72 : 0.42, scale: active ? 0.82 : 1, y: active ? -16 : 0 }}
        className="pointer-events-none absolute start-5 top-4 origin-start text-sm font-semibold text-white"
      >
        {label}
      </motion.label>
      <input
        className={cn(
          'h-16 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-5 pt-5 text-white outline-none transition shadow-[0_0_0_rgba(241,213,130,0)]',
          'focus:border-gold/55 focus:bg-gold/[0.035] focus:shadow-[0_0_30px_rgba(241,213,130,0.12)]'
        )}
        dir={dir}
        name={name}
        onBlur={() => setFocused(false)}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setFocused(true)}
        required
        type={type}
        value={value}
      />
      <AnimatePresence>
        {valid && value ? (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="absolute end-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-300"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
          >
            <Check className="h-4 w-4" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function LeadCaptureForm({
  locale,
  projectSlug,
  section,
}: {
  locale: Locale;
  projectSlug: string;
  section: LandingLeadFormSection;
}) {
  const isArabic = locale === 'ar';
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [whatsappValid, setWhatsappValid] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const payload = {
      full_name: String(formData.get('full_name') || ''),
      locale,
      phone: String(formData.get('phone') || ''),
      project_slug: projectSlug,
      source_path: typeof window !== 'undefined' ? window.location.pathname : `/projects/${projectSlug}/land`,
      whatsapp_number: String(formData.get('whatsapp_number') || ''),
      utm_source: searchParams?.get('utm_source') || '',
      utm_medium: searchParams?.get('utm_medium') || '',
      utm_campaign: searchParams?.get('utm_campaign') || '',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      const response = await fetch('/api/project-landings/leads', {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit the form');
      }

      trackEvent('form_submit', { locale, source: 'project_landing', slug: projectSlug });
      const params = new URLSearchParams({
        name: payload.full_name,
        phone: payload.phone,
      });
      router.push(`/${locale}/projects/${projectSlug}/thank-you?${params.toString()}`);
    } catch (error: any) {
      setErrorMessage(
        error?.message ||
          (isArabic ? 'تعذر إرسال الطلب حالياً. حاول مرة أخرى.' : 'We could not submit your request right now. Please try again.')
      );
      setSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-gold/20 bg-white/[0.045] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:rounded-[2.6rem] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,213,130,0.17),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent)]" />
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.75fr)] lg:items-center lg:gap-8"
          initial={{ opacity: 0, scale: 0.98 }}
        >
          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold md:text-xs md:tracking-[0.34em]">{isArabic ? 'دعوة خاصة' : 'Private Invitation'}</p>
            <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="mt-3 text-2xl leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
              {isArabic ? 'كن جزءاً من عالم الشحري' : section.title}
            </SplitRevealHeading>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/64 md:text-base md:leading-8">
              {isArabic ? 'سجل بياناتك وسيتواصل معك مستشارك العقاري في أقرب وقت.' : section.description}
            </p>
            <p className="mt-4 inline-flex rounded-full border border-gold/25 bg-gold/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold md:mt-6 md:px-4 md:py-2 md:text-xs md:tracking-[0.18em]">
              {isArabic ? 'احصل على الأسعار الخاصة ومخططات الوحدات PDF' : 'Get Private Pricing & Floorplans PDF'}
            </p>
          </div>

          <form className="space-y-4 rounded-[1.5rem] border border-gold/18 bg-rich-black/44 p-4 backdrop-blur-xl md:space-y-5 md:rounded-[2rem] md:p-6" onSubmit={handleSubmit}>
            <FloatingInput label={isArabic ? 'الاسم الكامل' : 'Full Name'} name="full_name" />
            <div onChange={(event) => setPhoneValid(isValidPhone((event.target as HTMLInputElement).value))}>
              <FloatingInput dir="ltr" label={isArabic ? 'رقم الهاتف' : 'Phone Number'} name="phone" valid={phoneValid} />
            </div>
            <div onChange={(event) => setWhatsappValid(isValidPhone((event.target as HTMLInputElement).value))}>
              <FloatingInput dir="ltr" label={isArabic ? 'رقم واتساب' : 'WhatsApp Number'} name="whatsapp_number" valid={whatsappValid} />
            </div>

            <MagneticButton
              className="relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gold px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-rich-black transition hover:bg-white disabled:opacity-60 md:gap-3 md:rounded-2xl md:px-6 md:py-4 md:text-sm md:tracking-[0.2em]"
              disabled={submitting}
              type="submit"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/45 [animation:shimmer_3.2s_infinite]" />
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isArabic ? 'احجز استشارتك المجانية الآن' : 'Book your free consultation now'}
            </MagneticButton>

            <p className="text-[10px] leading-5 text-white/38 md:text-xs md:leading-6">{section.privacyNote}</p>
            {errorMessage ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-xs text-red-200 md:rounded-2xl md:px-4 md:py-3 md:text-sm">{errorMessage}</p> : null}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
