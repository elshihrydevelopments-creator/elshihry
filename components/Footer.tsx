'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { useLanguage } from '@/components/LanguageProvider';
import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer';
import { trackEvent } from '@/lib/analytics';
import { getMailtoHref, getPhoneHref, getSocialLinks, getWhatsAppUrl, siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

export function Footer() {
  const { copy, locale, localizeHref } = useLanguage();
  const isArabic = locale === 'ar';
  const footerLinks = copy.footer.links.filter((item) => item.hash !== 'vision');

  const socialLinks = getSocialLinks().map(({ href, platform }) => ({
    href,
    icon:
      platform === 'facebook'
        ? Facebook
        : platform === 'instagram'
          ? Instagram
          : platform === 'linkedin'
            ? Linkedin
            : Globe,
    label: platform[0].toUpperCase() + platform.slice(1),
  }));

  const contactInfo = [
    {
      icon: Phone,
      text: siteConfig.phoneDisplay,
      href: getPhoneHref(),
      isDirectional: true,
    },
    {
      icon: MessageCircle,
      text: siteConfig.whatsappDisplay,
      href: getWhatsAppUrl(),
      isDirectional: true,
      external: true,
    },
    {
      icon: Mail,
      text: siteConfig.email,
      href: getMailtoHref(),
      isDirectional: true,
    },
    {
      icon: MapPin,
      text: siteConfig.localizedAddress[locale],
      isDirectional: false,
    },
  ];

  const quickLinksTitle = isArabic ? 'استكشف' : 'Explore';
  const policyTitle = isArabic ? 'السياسات' : 'Policies';
  const followTitle = isArabic ? 'تابعنا' : 'Follow';
  const companySuffix = isArabic ? 'للتطوير العقاري' : 'Developments';

  return (
    <footer
      id="contact"
      className="relative mx-4 my-8 overflow-hidden rounded-[32px] border border-white/10 bg-rich-black-light/80 md:mx-8"
    >
      <FooterBackgroundGradient />

      <div className="relative z-10 px-6 py-12 md:px-10 md:py-14 lg:px-14">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.15fr_0.75fr_0.75fr_1fr]">
          <div className={cn('max-w-md', isArabic ? 'text-right' : 'text-left')}>
            <LocaleReveal localeKey={`footer-brand-${locale}`}>
              <Link href={localizeHref('/') as any} aria-label="El Shihry Home" className="mb-6 inline-block">
                <Image
                  src="/logo.webp"
                  alt="El Shihry Logo"
                  width={180}
                  height={72}
                  sizes="180px"
                  className="h-16 w-auto object-contain md:h-20"
                />
              </Link>

              <ScrollRevealHeading
                as="h2"
                localeKey={`footer-brand-title-${locale}`}
                className={cn(
                  'text-4xl font-bold tracking-tighter md:text-6xl',
                  isArabic ? 'leading-[1.25]' : 'uppercase leading-none',
                )}
                lines={[
                  copy.nav.brand,
                  <span key="footer-gold" className="text-gradient-gold">
                    {companySuffix}
                  </span>,
                ]}
              />

              <p className={cn('mt-6 text-sm text-white/75 md:text-base', isArabic ? 'leading-8' : 'leading-7')}>
                {copy.footer.description}
              </p>
            </LocaleReveal>
          </div>

          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h3 className="mb-6 text-sm font-semibold tracking-[0.28em] text-gold uppercase">{quickLinksTitle}</h3>
            <ul className="space-y-4 text-sm text-white/70 md:text-base">
              {footerLinks.map((item) => (
                <li key={item.hash}>
                  <Link href={localizeHref(item.href) as any} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h3 className="mb-6 text-sm font-semibold tracking-[0.28em] text-gold uppercase">{policyTitle}</h3>
            <ul className="space-y-4 text-sm text-white/70 md:text-base">
              <li>
                <Link href={localizeHref('/privacy-policy') as any} className="transition-colors hover:text-white">
                  {copy.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={localizeHref('/terms') as any} className="transition-colors hover:text-white">
                  {copy.footer.terms}
                </Link>
              </li>
              <li className="break-words leading-7 text-white/55">{siteConfig.localizedAddress[locale]}</li>
            </ul>
          </div>

          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h3 className="mb-6 text-sm font-semibold tracking-[0.28em] text-gold uppercase">
              {copy.footer.contactTitle}
            </h3>
            <ul className="space-y-4 text-sm text-white/85 md:text-base">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <li
                    key={item.text}
                    className={cn('flex items-start gap-3', isArabic ? 'flex-row-reverse text-right' : 'text-left')}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold shadow-[0_10px_30px_rgba(212,175,55,0.08)]">
                      <Icon size={18} />
                    </span>

                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noreferrer' : undefined}
                        onClick={() =>
                          item.href.startsWith('tel:') ? trackEvent('phone_click', { locale, placement: 'footer' }) : undefined
                        }
                        dir={item.isDirectional ? 'ltr' : undefined}
                        className={cn(
                          'min-w-0 flex-1 break-words leading-7 text-white/85 transition-colors hover:text-white',
                          item.isDirectional && 'font-medium tracking-[0.02em]',
                        )}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="min-w-0 flex-1 break-words leading-7 text-white/85">{item.text}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col gap-6 py-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between',
            isArabic ? 'md:flex-row-reverse' : '',
          )}
        >
          <div className={cn('flex flex-wrap items-center gap-3', isArabic ? 'md:flex-row-reverse' : '')}>
            <span className="text-[10px] tracking-[0.32em] text-gold/75 uppercase">{followTitle}</span>
            <div className="h-px w-12 bg-gold/20" />
            <div className={cn('flex flex-wrap items-center gap-3', isArabic ? 'flex-row-reverse' : '')}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          <LocaleReveal localeKey={`footer-bottom-${locale}`}>
            <p className={cn(isArabic ? 'text-right' : 'text-left')}>
              {isArabic ? (
                <>
                  <span dir="ltr">&copy; {new Date().getFullYear()}</span>{' '}
                  <span>شركة </span>
                  <a
                    href="https://www.getsinnovation.com/"
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="font-medium text-gold transition-colors hover:text-white"
                  >
                    GETS
                  </a>
                  <span>. {copy.footer.rights}</span>
                </>
              ) : (
                <>
                  <span dir="ltr">&copy; {new Date().getFullYear()} </span>
                  <a
                    href="https://www.getsinnovation.com/"
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="font-medium text-gold transition-colors hover:text-white"
                  >
                    GETS
                  </a>
                  <span>. {copy.footer.rights}</span>
                </>
              )}
            </p>
          </LocaleReveal>
        </div>

        <div className="hidden h-[16rem] items-center justify-center border-t border-white/8 pt-4 lg:flex">
          <TextHoverEffect text={isArabic ? 'الشحري' : 'El Shihry'} className="h-full w-full max-w-6xl" />
        </div>
      </div>
    </footer>
  );
}
