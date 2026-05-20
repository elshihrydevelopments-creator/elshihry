'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
        animate={{ opacity: active ? 0.72 : 0.42, scale: active ? 0.82 : 1, y: active ? -14 : 0 }}
        className="pointer-events-none absolute start-4 top-4 origin-start text-xs font-semibold text-white"
      >
        {label}
      </motion.label>
      <input
        className={cn(
          'h-14 w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 pt-4 text-sm text-white outline-none transition shadow-[0_0_0_rgba(241,213,130,0)]',
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
            className="absolute end-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-300"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
          >
            <Check className="h-3 w-3" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  projectSlug: string;
  section: LandingLeadFormSection;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  locale,
  projectSlug,
  section,
}: LeadCaptureModalProps) {
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
    const payload = {
      full_name: String(formData.get('full_name') || ''),
      locale,
      phone: String(formData.get('phone') || ''),
      project_slug: projectSlug,
      source_path: typeof window !== 'undefined' ? window.location.pathname : `/projects/${projectSlug}/land`,
      whatsapp_number: String(formData.get('whatsapp_number') || ''),
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

      trackEvent('form_submit', { locale, source: 'project_landing_modal', slug: projectSlug });
      const params = new URLSearchParams({
        name: payload.full_name,
        phone: payload.phone,
      });
      
      onClose(); // Close modal before redirecting
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-gold/24 bg-[#0a0a0b]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
          >
            {/* Top gold ambient light */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/14 blur-3xl" />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className={cn('flex-1', isArabic ? 'text-right' : 'text-left')}>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">{isArabic ? 'دعوة خاصة' : 'Private Invitation'}</p>
                <h3 className="mt-1 text-2xl font-light text-white leading-snug">
                  {isArabic ? 'كن جزءاً من عالم الشحري' : section.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className={cn('text-xs leading-5 text-white/60 mb-5', isArabic ? 'text-right' : 'text-left')}>
              {isArabic ? 'سجل بياناتك وسيتواصل معك مستشارك العقاري في أقرب وقت.' : section.description}
            </p>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <FloatingInput label={isArabic ? 'الاسم الكامل' : 'Full Name'} name="full_name" />
              <div onChange={(event) => setPhoneValid(isValidPhone((event.target as HTMLInputElement).value))}>
                <FloatingInput dir="ltr" label={isArabic ? 'رقم الهاتف' : 'Phone Number'} name="phone" valid={phoneValid} />
              </div>
              <div onChange={(event) => setWhatsappValid(isValidPhone((event.target as HTMLInputElement).value))}>
                <FloatingInput dir="ltr" label={isArabic ? 'رقم واتساب' : 'WhatsApp Number'} name="whatsapp_number" valid={whatsappValid} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-rich-black transition hover:bg-white disabled:opacity-60"
              >
                <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/45 [animation:shimmer_3.2s_infinite]" />
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isArabic ? 'احجز استشارتك المجانية الآن' : 'Book your free consultation now'}
              </button>

              <p className={cn('text-[10px] leading-4 text-white/40', isArabic ? 'text-right' : 'text-left')}>{section.privacyNote}</p>
              
              {errorMessage && (
                <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-200">
                  {errorMessage}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
