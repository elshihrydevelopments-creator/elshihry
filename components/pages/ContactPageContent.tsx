'use client';

import type { FormEvent } from 'react';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/components/LanguageProvider';
import { openLeadWhatsApp } from '@/lib/lead-utils';
import { getWhatsAppUrl, siteConfig } from '@/lib/site-config';

export function ContactPageContent() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';
  const whatsappUrl = `https://wa.me/${copy.contact.whatsapp}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    trackEvent('form_submit', { locale, source: 'contact_page' });
    openLeadWhatsApp({
      email: String(formData.get('email') || ''),
      locale,
      message: String(formData.get('message') || ''),
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      source: 'contact_page',
      whatsappNumber: copy.contact.whatsapp,
    });
  };

  return (
    <div className="overflow-hidden px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 text-5xl font-bold text-white md:text-7xl"
          >
            {copy.contactPage.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-light leading-relaxed text-white/60"
          >
            {copy.contactPage.description}
          </motion.p>
        </div>

        <div className="grid items-start gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel relative rounded-[3.5rem] border border-white/10 p-8 md:p-12"
          >
            <h2 className="mb-10 text-3xl font-bold text-white">{copy.contactPage.formTitle}</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="px-1 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                  {isArabic ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-white transition-colors focus:border-gold/50 focus:outline-none"
                  placeholder={isArabic ? 'اسمك الكريم' : 'Your prestigious name'}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="px-1 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-white transition-colors placeholder:text-start focus:border-gold/50 focus:outline-none"
                    placeholder={copy.contact.phone}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="px-1 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-white transition-colors focus:border-gold/50 focus:outline-none"
                    placeholder={copy.contact.email}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="px-1 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                  {isArabic ? 'رسالتك' : 'Your Inquiry'}
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full resize-none rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-white transition-colors focus:border-gold/50 focus:outline-none"
                  placeholder={isArabic ? 'كيف يمكننا مساعدتك؟' : 'How may we assist you today?'}
                />
              </div>

              <button className="w-full rounded-2xl bg-gold py-6 text-lg font-bold tracking-[0.2em] text-rich-black uppercase shadow-[0_12px_40px_rgba(241,213,130,0.25)] transition-all hover:translate-y-[-2px] hover:shadow-[0_15px_50px_rgba(241,213,130,0.4)] active:translate-y-[0px]">
                {isArabic ? 'إرسال الطلب' : 'Send Inquiry'}
              </button>
            </form>

            <div className="absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[100px]" />
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: isArabic ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-white">{copy.contactPage.infoTitle}</h2>

              <div className="grid gap-8 sm:grid-cols-2">
                {[
                  { icon: MapPin, title: isArabic ? 'العنوان' : 'Address', value: copy.contact.address },
                  { icon: Phone, title: isArabic ? 'اتصل بنا' : 'Call center', value: copy.contact.phone },
                  { icon: Mail, title: isArabic ? 'البريد' : 'Email', value: copy.contact.email },
                  { icon: Clock, title: isArabic ? 'ساعات العمل' : 'Working hours', value: isArabic ? '9ص - 10م' : '9AM - 10PM' },
                ].map((item, index) => (
                  <div key={index} className="glass-panel space-y-3 rounded-3xl border border-white/5 p-8">
                    <item.icon className="mb-2 h-6 w-6 text-gold" />
                    <h4 className="text-xs font-bold tracking-[0.1em] text-white/40 uppercase">{item.title}</h4>
                    <p className="text-lg font-medium text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('whatsapp_click', { locale, placement: 'contact_page' })}
              className="glass-panel group relative flex cursor-pointer items-center gap-8 overflow-hidden rounded-[3rem] border border-white/5 p-10"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-rich-black">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-white">
                  {isArabic ? 'دردشة حية' : 'Live Concierge'}
                </h3>
                <p className="text-sm lowercase text-white/50">
                  {isArabic ? 'تحدث معنا مباشرة عبر الواتساب' : 'Speak directly with our VIP agents'}
                </p>
              </div>
              <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-gold/5 blur-3xl group-hover:bg-gold/10" />
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}
