'use client';

import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { SectionEditor } from '@/components/admin/SectionEditor';

export default function AboutPageEditor() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-400/10">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">صفحة من نحن</h1>
            <p className="mt-0.5 text-sm text-white/40">الرؤية، الإنجازات، القيادة، والقيم</p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/8" />

        <div className="space-y-4">
          <SectionEditor
            sectionKey="about"
            label="قسم من نحن — About"
            description="الرؤية المؤسسية، الفقرات، والإنجازات التاريخية"
            defaultOpen={true}
          />
          <SectionEditor
            sectionKey="aboutLeadership"
            label="قسم القيادة"
            description="الاسم، المنصب، الاقتباس، وصورة سيكشن القيادة"
          />
          <SectionEditor
            sectionKey="aboutValues"
            label="قسم قيمنا الجوهرية"
            description="عنوان السيكشن وبطاقات القيم الجوهرية"
          />
        </div>
      </motion.div>
    </div>
  );
}
