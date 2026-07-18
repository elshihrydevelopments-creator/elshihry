'use client';

import type { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPinned,
  Phone,
} from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';
import { openLeadWhatsApp } from '@/lib/lead-utils';
import { siteImages, type Locale } from '@/lib/site-content';
import { getMailtoHref, getPhoneHref, getSocialLinks, siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

type SectionCopy = {
  blog: {
    badge: string;
    cta: string;
    description: string;
    heading: string;
  };
  contact: {
    address: string;
    addressLabel: string;
    button: string;
    description: string;
    detailsHeading: string;
    email: string;
    emailLabel: string;
    formHeading: string;
    formNote: string;
    heading: string;
    interestLabel: string;
    interestOptions: string[];
    mapLabel: string;
    nameLabel: string;
    phone: string;
    phoneLabel: string;
    sectionLabel: string;
    socialHeading: string;
  };
  faq: {
    description: string;
    eyebrow: string;
    heading: string;
    items: Array<{
      answer: string;
      question: string;
    }>;
  };
  partners: {
    description: string;
    eyebrow: string;
    heading: string;
    logoLabel: string;
    logos: string[];
  };
};

const sectionCopy: Record<Locale, SectionCopy> = {
  en: {
    partners: {
      eyebrow: 'Partners',
      heading: 'Partners in Success',
      description:
        'A trusted network of consultants, contractors, and advisors helping every project move from concept to confident delivery.',
      logoLabel: 'Partner',
      logos: ['North Gate', 'BlueStone', 'Axis One', 'Urban Crest', 'PrimeOak', 'Vista Line'],
    },
    faq: {
      eyebrow: 'FAQ',
      heading: 'Frequently Asked Questions',
      description:
        'Clear answers for the details clients usually ask first, especially around payment flexibility and delivery timing.',
      items: [
        {
          question: 'Do you offer flexible payment plans for residential units?',
          answer:
            'Yes. Payment plans are typically structured with a reservation amount, a contract down payment, and equal installments that can extend across construction milestones.',
        },
        {
          question: 'Can the payment plan be customized for investors buying more than one unit?',
          answer:
            'For multi-unit buyers, we can usually review a tailored structure based on unit type, contract value, and the current stage of the project.',
        },
        {
          question: 'How are delivery dates communicated and updated?',
          answer:
            'Every project has a target delivery schedule shared during the sales process, and clients receive milestone updates whenever there is progress on-site or an approved timeline adjustment.',
        },
      ],
    },
    contact: {
      sectionLabel: 'Contact',
      heading: "Let's Start the Right Conversation",
      description:
        'Share your interest and our team will help you compare projects, payment options, and expected delivery timelines.',
      formHeading: 'Request a Call Back',
      formNote: 'We usually reply within one business day.',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      interestLabel: 'Interest',
      interestOptions: ['Select an interest', 'Apartment', 'Villa', 'Commercial Unit', 'Investment Opportunity'],
      button: 'Send Inquiry',
      detailsHeading: 'Direct Contact Details',
      addressLabel: 'Address',
      address: 'Villa 472, North El Choueifat, opposite Downtown, Fifth Settlement, New Cairo 11835, Egypt',
      mapLabel: 'View on Google Maps',
      phone: '010 20008256',
      email: 'esgroup@gmail.com',
      socialHeading: 'Follow Us',
    },
    blog: {
      badge: 'News',
      heading: 'Latest Updates',
      description: 'A clean overview of project milestones, launches, and market-facing announcements.',
      cta: 'Read More',
    },
  },
  ar: {
    partners: {
      eyebrow: 'الشراكات',
      heading: 'شركاء النجاح',
      description:
        'شبكة موثوقة من الاستشاريين والمقاولين والشركاء التنفيذيين تساعد كل مشروع ينتقل من الفكرة إلى التسليم بثقة.',
      logoLabel: 'شريك',
      logos: ['نورث جيت', 'بلو ستون', 'أكسس ون', 'أوربن كريست', 'برايم أوك', 'فيستا لاين'],
    },
    faq: {
      eyebrow: 'الاسئلة',
      heading: 'الاسئلة الشائعة',
      description:
        'إجابات واضحة على أكثر الأسئلة التي يطرحها العملاء، خاصة ما يتعلق بأنظمة السداد ومواعيد التسليم.',
      items: [
        {
          question: 'هل يوجد أنظمة سداد مرنة للوحدات السكنية؟',
          answer:
            'نعم، غالبًا يتم تنظيم السداد من خلال مبلغ حجز، ثم مقدم تعاقد، وبعده أقساط متساوية مرتبطة بمراحل التنفيذ والجدول الزمني للمشروع.',
        },
        {
          question: 'هل يمكن تخصيص خطة السداد للمستثمر الذي يشتري أكثر من وحدة؟',
          answer:
            'في حالة شراء أكثر من وحدة يمكن مراجعة هيكل سداد مناسب حسب نوع الوحدة وقيمة التعاقد والمرحلة الحالية للمشروع.',
        },
        {
          question: 'كيف يتم توضيح مواعيد التسليم وتحديثها؟',
          answer:
            'يتم عرض الجدول المستهدف للتسليم أثناء عملية البيع، ثم مشاركة العملاء بأي تحديثات مرتبطة بمراحل التنفيذ أو أي تعديل معتمد على الجدول.',
        },
      ],
    },
    contact: {
      sectionLabel: 'تواصل',
      heading: 'ابدأ معنا المحادثة المناسبة',
      description:
        'شاركنا اهتمامك وسيساعدك فريقنا في مقارنة المشروعات وخطط السداد ومواعيد التسليم المتوقعة.',
      formHeading: 'اطلب مكالمة من فريقنا',
      formNote: 'عادة نقوم بالرد خلال يوم عمل واحد.',
      nameLabel: 'الاسم',
      phoneLabel: 'رقم الهاتف',
      emailLabel: 'البريد الإلكتروني',
      interestLabel: 'نوع الاهتمام',
      interestOptions: ['اختر نوع الاهتمام', 'شقة', 'فيلا', 'وحدة تجارية', 'فرصة استثمارية'],
      button: 'إرسال الطلب',
      detailsHeading: 'بيانات التواصل المباشر',
      addressLabel: 'العنوان',
      address: 'فيلا 472 - شمال الشويفات - أمام داون تاون - التجمع الخامس - القاهرة الجديدة 11835، مصر',
      mapLabel: 'عرض على Google Maps',
      phone: '010 20008256',
      email: 'esgroup@gmail.com',
      socialHeading: 'تابعنا',
    },
    blog: {
      badge: 'أخبار',
      heading: 'آخر التحديثات',
      description: 'نظرة سريعة على مستجدات المشروعات، الإطلاقات الجديدة، وأهم الأخبار المرتبطة بالسوق.',
      cta: 'اقرأ المزيد',
    },
  },
};

function SectionIntro({
  eyebrow,
  title,
  description,
  isArabic,
}: {
  eyebrow: string;
  title: string;
  description: string;
  isArabic: boolean;
}) {
  return (
    <div className={cn('max-w-3xl space-y-4', isArabic ? 'text-right' : 'text-left')}>
      <p
        className={cn(
          'text-xs font-semibold tracking-[0.3em] text-gold',
          isArabic ? '' : 'uppercase'
        )}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="text-sm leading-7 text-white/70 sm:text-base">{description}</p>
    </div>
  );
}

export function FunctionalSections() {
  const { locale, copy: siteCopy, localizeHref } = useLanguage();
  const copy = {
    ...sectionCopy[locale],
    contact: siteCopy.contact,
  };
  const isArabic = locale === 'ar';
  const localizedAddress = copy.contact.address;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localizedAddress)}`;
  const phoneHref = `tel:${copy.contact.phone.replace(/\s+/g, '')}`;
  const blogItems = siteCopy.blog.items.slice(0, 3);
  
  const socialLinks = [
    { platform: 'facebook', href: copy.contact.facebook, icon: Facebook },
    { platform: 'instagram', href: copy.contact.instagram, icon: Instagram },
    { platform: 'linkedin', href: copy.contact.linkedin, icon: Linkedin },
  ].filter(item => Boolean(item.href)).map(item => ({
    ...item,
    label: item.platform[0].toUpperCase() + item.platform.slice(1)
  }));

  const handleLeadSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const interest = String(formData.get('interest') || '');
    trackEvent('form_submit', { locale, source: 'home_contact' });
    openLeadWhatsApp({
      email: String(formData.get('email') || ''),
      interest: interest && interest !== copy.contact.interestOptions[0] ? interest : '',
      locale,
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      source: 'home_contact',
      whatsappNumber: copy.contact.whatsapp,
    });
  };

  return (
    <section className="motion-safe bg-rich-black px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-rich-black-light shadow-[0_8px_32px_0_rgba(241,213,130,0.02)]">
        <section className="border-b border-white/10 px-6 py-14 sm:px-10 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionIntro
              eyebrow={copy.faq.eyebrow}
              title={copy.faq.heading}
              description={copy.faq.description}
              isArabic={isArabic}
            />
            <div>
              {copy.faq.items.map((item, index) => (
                <details key={item.question} className="group border-b border-white/10 py-5" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <span className={cn('text-base font-semibold leading-7 text-white sm:text-lg', isArabic ? 'text-right' : 'text-left')}>
                      {item.question}
                    </span>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/50 transition group-open:rotate-180 group-open:border-gold group-open:text-gold">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className={cn('max-w-3xl pt-4 text-sm leading-7 text-white/70 sm:text-base', isArabic ? 'text-right' : 'text-left')}>
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-6 py-14 sm:px-10 lg:px-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <SectionIntro
              eyebrow={copy.blog.badge}
              title={copy.blog.heading}
              description={copy.blog.description}
              isArabic={isArabic}
            />
            <Link 
              href={localizeHref('/blog') as any}
              className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-gold hover:text-white transition-colors uppercase"
            >
               {isArabic ? 'مشاهدة الكل' : 'View All Insights'}
               <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {blogItems.map((card, index) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 shadow-lg transition hover:border-white/20"
              >
                <Link href={localizeHref(`/blog/${card.slug}`) as any}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-rich-black-light">
                    <Image
                      src={siteImages.lifestyle[index % siteImages.lifestyle.length]}
                      alt={card.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span
                      className={cn(
                        'absolute top-4 rounded-full bg-rich-black/90 border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-white shadow-sm backdrop-blur',
                        isArabic ? 'right-4' : 'left-4',
                        isArabic ? '' : 'uppercase'
                      )}
                    >
                      {card.date}
                    </span>
                    <span
                      className={cn(
                        'absolute bottom-4 rounded-full bg-gold/90 px-3 py-1 text-xs font-medium tracking-[0.2em] text-rich-black',
                        isArabic ? 'right-4' : 'left-4',
                        isArabic ? '' : 'uppercase'
                      )}
                    >
                      {card.tag}
                    </span>
                  </div>
                </Link>
                <div className={cn('space-y-4 px-6 py-6', isArabic ? 'text-right' : 'text-left')}>
                  <Link href={localizeHref(`/blog/${card.slug}`) as any}>
                    <h3 className="text-xl font-semibold leading-8 text-white hover:text-gold transition-colors">{card.title}</h3>
                  </Link>
                  <Link
                    href={localizeHref(`/blog/${card.slug}`) as any}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-white"
                    aria-label={`${copy.blog.cta}: ${card.title}`}
                  >
                    {copy.blog.cta}
                    <span className="sr-only">: {card.title}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 px-6 py-14 sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-lg sm:p-8">
              <SectionIntro
                eyebrow={copy.contact.sectionLabel}
                title={copy.contact.heading}
                description={copy.contact.description}
                isArabic={isArabic}
              />
              <div className={cn('mt-8', isArabic ? 'text-right' : 'text-left')}>
                <h3 className="text-lg font-semibold text-white">{copy.contact.formHeading}</h3>
                <p className="mt-2 text-sm text-white/70">{copy.contact.formNote}</p>
              </div>
              <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleLeadSubmit}>
                <label className={cn('space-y-2 text-sm font-medium text-white/80', isArabic ? 'text-right' : 'text-left')}>
                  <span>{copy.contact.nameLabel}</span>
                  <input
                    type="text"
                    name="name"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-rich-black-light px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-gold/50 focus:bg-rich-black"
                    placeholder={copy.contact.nameLabel}
                  />
                </label>
                <label className={cn('space-y-2 text-sm font-medium text-white/80', isArabic ? 'text-right' : 'text-left')}>
                  <span>{copy.contact.phoneLabel}</span>
                  <input
                    type="tel"
                    name="phone"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-rich-black-light px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-gold/50 focus:bg-rich-black"
                    placeholder={copy.contact.phone}
                  />
                </label>
                <label className={cn('space-y-2 text-sm font-medium text-white/80 sm:col-span-2', isArabic ? 'text-right' : 'text-left')}>
                  <span>{copy.contact.emailLabel}</span>
                  <input
                    type="email"
                    name="email"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-rich-black-light px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-gold/50 focus:bg-rich-black"
                    placeholder={copy.contact.email}
                  />
                </label>
                <label className={cn('space-y-2 text-sm font-medium text-white/80 sm:col-span-2', isArabic ? 'text-right' : 'text-left')}>
                  <span>{copy.contact.interestLabel}</span>
                  <select
                    name="interest"
                    defaultValue=""
                    className="h-12 w-full rounded-2xl border border-white/10 bg-rich-black-light px-4 text-sm text-white outline-none transition focus:border-gold/50 focus:bg-rich-black"
                  >
                    <option value="" disabled className="bg-rich-black text-white/50">
                      {copy.contact.interestOptions[0]}
                    </option>
                    {copy.contact.interestOptions.slice(1).map((option) => (
                      <option key={option} value={option} className="bg-rich-black text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <div className={cn('sm:col-span-2', isArabic ? 'text-right' : 'text-left')}>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-rich-black transition hover:bg-gold/90"
                  >
                    {copy.contact.button}
                  </button>
                </div>
              </form>
            </div>

            <aside className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 text-white shadow-[0_18px_45px_rgba(241,213,130,0.05)] sm:p-8">
              <h3 className={cn('text-2xl font-semibold tracking-tight', isArabic ? 'text-right' : 'text-left')}>
                {copy.contact.detailsHeading}
              </h3>
              <div className="mt-8 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <MapPinned className="h-5 w-5" />
                    </span>
                    <div className={cn('space-y-1', isArabic ? 'text-right' : 'text-left')}>
                      <p
                        className={cn(
                          'text-sm font-medium tracking-[0.22em] text-white/60',
                          isArabic ? '' : 'uppercase'
                        )}
                      >
                        {copy.contact.addressLabel}
                      </p>
                      <p className="text-sm leading-7 text-white/90">{localizedAddress}</p>
                      <Link
                        href={mapHref as any}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackEvent('project_cta_click', { locale, placement: 'map_link' })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gold"
                      >
                        {copy.contact.mapLabel}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div className={cn('space-y-1', isArabic ? 'text-right' : 'text-left')}>
                      <p
                        className={cn(
                          'text-sm font-medium tracking-[0.22em] text-white/60',
                          isArabic ? '' : 'uppercase'
                        )}
                      >
                        {copy.contact.phoneLabel}
                      </p>
                      <Link href={phoneHref as any} onClick={() => trackEvent('phone_click', { locale, placement: 'home_contact' })} className="text-sm leading-7 text-white/90">
                        {copy.contact.phone}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div className={cn('space-y-1', isArabic ? 'text-right' : 'text-left')}>
                      <p
                        className={cn(
                          'text-sm font-medium tracking-[0.22em] text-white/60',
                          isArabic ? '' : 'uppercase'
                        )}
                      >
                        {copy.contact.emailLabel}
                      </p>
                      <Link href={`mailto:${copy.contact.email}` as any} className="text-sm leading-7 text-white/90">
                        {copy.contact.email}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p
                  className={cn(
                    'text-sm font-medium tracking-[0.22em] text-white/60',
                    isArabic ? 'text-right' : 'text-left uppercase'
                  )}
                >
                  {copy.contact.socialHeading}
                </p>
                <div className={cn('mt-4 flex flex-wrap gap-3', isArabic ? 'justify-end' : 'justify-start')}>
                  {socialLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.label}
                        href={item.href as any}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10"
                        aria-label={item.label}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </section>
  );
}
