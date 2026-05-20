'use client';

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode, useRef } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'type'> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export function MagneticButton({ children, className, href, type = 'button', ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  function handleMove(event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    const element = ref.current;

    if (!element || window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.22;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.22;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function handleLeave() {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.style.transform = 'translate3d(0, 0, 0)';
  }

  const sharedProps = {
    ...props,
    className: cn('will-change-transform', className),
    onMouseLeave: handleLeave,
    onMouseMove: handleMove,
  };

  if (href) {
    return (
      <Link ref={ref as any} href={href as any} {...(sharedProps as any)}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref as any} type={type} {...(sharedProps as any)}>
      {children}
    </button>
  );
}
