'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function FacebookPixel({ pixelId, event = 'PageView' }: { pixelId: string; event?: 'PageView' | 'Lead' }) {
  useEffect(() => {
    if (!pixelId) return;

    const w = window as any;
    if (w.fbq) {
      w.fbq('init', pixelId);
      w.fbq('track', event);
    }
  }, [pixelId, event]);

  if (!pixelId) return null;

  return (
    <>
      <Script
        id={`fb-pixel-${pixelId}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', '${event}');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=${event}&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
