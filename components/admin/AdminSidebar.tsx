'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Globe,
  LogOut,
  Home,
  Users,
  Building2,
  BookOpen,
  Phone,
  LayoutTemplate,
  UserRoundSearch,
  ChevronDown,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const PAGE_LINKS = [
  { href: '/admin/pages/home', label: 'الصفحة الرئيسية', icon: Home },
  { href: '/admin/pages/about', label: 'من نحن', icon: Users },
  { href: '/admin/pages/projects', label: 'المشاريع', icon: Building2 },
  { href: '/admin/pages/blog', label: 'المدونة', icon: BookOpen },
  { href: '/admin/pages/contact', label: 'تواصل', icon: Phone },
  { href: '/admin/pages/global', label: 'العناصر المشتركة', icon: Globe },
];

const FEATURE_LINKS = [
  { href: '/admin/project-land', label: 'صفحات الهبوط', icon: LayoutTemplate },
  { href: '/admin/leads', label: 'العملاء', icon: UserRoundSearch },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [pagesOpen, setPagesOpen] = useState(true);

  const handleLogout = async () => {
    onClose();

    try {
      await supabase.auth.signOut();
    } finally {
      router.replace('/admin/login' as any);
      router.refresh();
    }
  };

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : (pathname ?? '').startsWith(href));
  const handleNavigate = () => onClose();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-50 flex w-72 max-w-[86vw] flex-col border-l border-white/5 bg-rich-black-light shadow-[-24px_0_48px_rgba(0,0,0,0.28)] transition-transform duration-300 md:w-72 md:shadow-none',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex items-center justify-between border-b border-white/5 p-5 md:p-6">
        <Image
          src="/logo.webp"
          alt="El Shihry"
          width={120}
          height={40}
          sizes="120px"
          loading="eager"
          className="h-10 w-auto object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <Link
          href={'/admin' as any}
          onClick={handleNavigate}
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200',
            isActive('/admin') ? 'bg-gold/10 font-bold text-gold' : 'text-white/55 hover:bg-white/5 hover:text-white'
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>نظرة عامة</span>
        </Link>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => setPagesOpen((open) => !open)}
            className="flex w-full items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/25 transition-colors hover:text-white/40"
          >
            <span>صفحات الموقع</span>
            <ChevronDown className={cn('h-3 w-3 transition-transform', pagesOpen ? 'rotate-180' : '')} />
          </button>

          {pagesOpen ? (
            <div className="mt-1 space-y-1">
              {PAGE_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href as any}
                    onClick={handleNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200',
                      active ? 'bg-gold/10 font-bold text-gold' : 'text-white/55 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="pt-4">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">المحتوى</p>
          <Link
            href={'/admin/blog' as any}
            onClick={handleNavigate}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200',
              isActive('/admin/blog') ? 'bg-gold/10 font-bold text-gold' : 'text-white/55 hover:bg-white/5 hover:text-white'
            )}
          >
            <FileText className="h-4 w-4" />
            <span>المقالات</span>
          </Link>
        </div>

        <div className="pt-4">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">المشاريع والعملاء</p>
          <div className="mt-1 space-y-1">
            {FEATURE_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href as any}
                  onClick={handleNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200',
                    active ? 'bg-gold/10 font-bold text-gold' : 'text-white/55 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/5 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400/70 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
