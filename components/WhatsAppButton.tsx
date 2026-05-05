'use client';

import React from 'react';
import CircularText from './ui/CircularText';
import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';
import { getWhatsAppUrl } from '@/lib/site-config';
import { motion } from 'motion/react';

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="32"
    height="32"
    stroke="currentColor"
    strokeWidth="0"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049a11.866 11.866 0 001.591 5.918L0 24l6.141-1.612a11.812 11.812 0 005.903 1.576h.005c6.636 0 12.046-5.414 12.049-12.051a11.758 11.758 0 00-3.535-8.513" />
  </svg>
);

export function WhatsAppButton() {
  const { locale } = useLanguage();
  const isArabic = locale === 'ar';

  const text = isArabic
    ? 'الشحري للتطوير العقاري • '
    : 'EL SHIHRY DEVELOPMENTS • ';

  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="fixed bottom-8 right-8 z-[1001]">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', { locale, placement: 'floating_button' })}
        className="relative block w-[90px] h-[90px]"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        aria-label="Contact us on WhatsApp"
      >
        {/* Circular Text */}
        <div className="absolute inset-0 z-40">
          <CircularText
            text={text}
            spinDuration={15}
            onHover="slowDown"
            className="w-[90px] h-[90px] text-gold opacity-100"
          />
        </div>

        {/* Central Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-gold text-rich-black shadow-[0_8px_24px_rgba(241,213,130,0.3)] border border-white/10 z-30 hover:shadow-[0_12px_32px_rgba(241,213,130,0.5)] transition-shadow duration-300">
           <WhatsAppIcon />
        </div>
        
      </motion.a>
    </div>
  );
}
