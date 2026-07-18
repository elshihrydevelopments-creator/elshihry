'use client';

import { motion } from 'motion/react';
import { FileText, Home, Users, Building2, BookOpen, Phone, Globe, ChevronLeft, LayoutTemplate, UserRoundSearch } from 'lucide-react';
import Link from 'next/link';

const PAGE_CARDS = [
  {
    href: '/admin/pages/home',
    label: 'الصفحة الرئيسية',
    desc: 'Hero · Lifestyle · Philosophy',
    icon: Home,
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/15',
    count: 3,
  },
  {
    href: '/admin/pages/about',
    label: 'من نحن',
    desc: 'الرؤية · الإنجازات · القيادة · القيم',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/15',
    count: 1,
  },
  {
    href: '/admin/pages/projects',
    label: 'المشاريع',
    desc: 'إدارة قاعدة بيانات المشاريع ومحتوى كل مشروع',
    icon: Building2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/15',
    count: 1,
  },
  {
    href: '/admin/pages/blog',
    label: 'المدونة',
    desc: 'عنوان القسم · الوصف · إدارة المقالات',
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/15',
    count: 1,
  },
  {
    href: '/admin/pages/contact',
    label: 'التواصل',
    desc: 'عنوان الصفحة · الوصف · نماذج الاتصال',
    icon: Phone,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/15',
    count: 1,
  },
  {
    href: '/admin/pages/global',
    label: 'العناصر المشتركة',
    desc: 'Navigation · Footer · Approach',
    icon: Globe,
    color: 'text-white/60',
    bg: 'bg-white/8',
    border: 'border-white/10',
    count: 3,
  },
  {
    href: '/admin/project-land',
    label: 'صفحات الهبوط',
    desc: 'Landing page مستقلة لكل مشروع مع إدارة حالة النشر',
    icon: LayoutTemplate,
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/15',
    count: 1,
  },
  {
    href: '/admin/leads',
    label: 'العملاء',
    desc: 'تجميع العملاء المحتملين وتحديث حالتهم بشكل فوري',
    icon: UserRoundSearch,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/15',
    count: 1,
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 sm:mb-10">
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-4xl">نظرة عامة</h1>
          <p className="text-white/40">اختر الصفحة أو النظام الذي تريد متابعته أو تعديله</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:mb-10 xl:grid-cols-3">
          {PAGE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={card.href as any}
                  className={`group flex h-full flex-col rounded-[2rem] border p-5 glass-panel transition-all duration-300 hover:bg-white/4 hover:border-opacity-40 sm:rounded-3xl sm:p-6 ${card.border}`}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs font-mono ${card.color} opacity-40 transition-opacity group-hover:opacity-70`}>
                      {card.count} {card.count === 1 ? 'قسم' : 'أقسام'}
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-white">{card.label}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-white/35">{card.desc}</p>
                  <div className={`mt-5 flex items-center gap-1 text-xs font-bold tracking-wider ${card.color} opacity-0 transition-opacity group-hover:opacity-100`}>
                    <span>فتح القسم</span>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="glass-panel rounded-[2rem] border border-white/5 p-5 sm:rounded-3xl sm:p-8">
          <h2 className="mb-5 text-lg font-bold text-white">إجراءات سريعة</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={'/admin/project-land' as any}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-bold text-gold transition-colors hover:bg-gold/15 sm:w-auto"
            >
              <LayoutTemplate className="h-4 w-4" />
              إدارة صفحات الهبوط
            </Link>
            <Link
              href={'/admin/leads' as any}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-400/15 sm:w-auto"
            >
              <UserRoundSearch className="h-4 w-4" />
              متابعة العملاء
            </Link>
            <Link
              href={'/admin/blog' as any}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/8 bg-white/5 px-5 py-3 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <FileText className="h-4 w-4" />
              كتابة مقال جديد
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
