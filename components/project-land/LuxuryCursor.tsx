'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type CursorState = 'default' | 'expand' | 'shrink';

export function LuxuryCursor() {
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>('default');

  const x = useMotionValue(-80);
  const y = useMotionValue(-80);
  const springX = useSpring(x, { damping: 28, stiffness: 320 });
  const springY = useSpring(y, { damping: 28, stiffness: 320 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, blockquote';
    const IMAGE_SELECTOR = '[data-masterpiece-card], [data-aura-text]';

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX - 28);
      y.set(event.clientY - 28);
      setVisible(true);

      const target = event.target instanceof Element ? event.target : null;

      // Check explicit data-cursor marker first (highest priority)
      const cursorEl = target?.closest<HTMLElement>('[data-cursor]') ?? null;

      if (cursorEl) {
        setLabel(cursorEl.dataset.cursor || '');
        setCursorState('expand');
        return;
      }

      // Check if hovering an image element or image-rich card
      const isOverImage =
        target?.tagName === 'IMG' ||
        target?.closest(IMAGE_SELECTOR) !== null ||
        target?.closest('[data-masterpiece-img]') !== null;

      if (isOverImage) {
        setLabel('');
        setCursorState('expand');
        return;
      }

      // Shrink over plain text nodes
      const isOverText = target?.closest(TEXT_SELECTOR) !== null;

      if (isOverText) {
        setLabel('');
        setCursorState('shrink');
        return;
      }

      // Default branded ring
      setLabel('');
      setCursorState('default');
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [x, y]);

  const scaleValue = cursorState === 'expand' ? 1.65 : cursorState === 'shrink' ? 0.42 : 1;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-14 min-w-14 items-center justify-center rounded-full border border-gold/45 bg-rich-black/40 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold shadow-[0_0_30px_rgba(241,213,130,0.18)] backdrop-blur-md mix-blend-screen md:flex"
      style={{ x: springX, y: springY }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: scaleValue,
      }}
      transition={{ damping: 22, stiffness: 280, type: 'spring' }}
    >
      {label}
    </motion.div>
  );
}
