'use client';

import { motion } from 'motion/react';
import { Home, Megaphone, Sparkles, TrendingUp, Quote } from 'lucide-react';
import { SectionEditor } from '@/components/admin/SectionEditor';

const sections = [
  {
    key: 'hero',
    label: 'القسم الرئيسي — Hero',
    description: 'الشارة، العنوان، النص التعريفي، وأزرار الدعوة للعمل',
    icon: Home,
    defaultOpen: true,
  },
  {
    key: 'lifestyle',
    label: 'أسلوب الحياة — Lifestyle',
    description: 'عنوان القسم وعناصر القائمة المتحركة',
    icon: Sparkles,
  },
  {
    key: 'philosophy',
    label: 'الفلسفة — Philosophy',
    description: 'الاقتباس الفلسفي الظاهر بخط كبير',
    icon: Quote,
  },
];

export default function HomePageEditor() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/10">
            <Home className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">الصفحة الرئيسية</h1>
            <p className="mt-0.5 text-sm text-white/40">تعديل محتوى جميع أقسام الصفحة الرئيسية للموقع</p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/8" />

        <div className="space-y-4">
          {sections.map((section) => (
            <SectionEditor
              key={section.key}
              sectionKey={section.key}
              label={section.label}
              description={section.description}
              defaultOpen={section.defaultOpen}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
