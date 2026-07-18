'use client';

import { motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { SectionEditor } from '@/components/admin/SectionEditor';

export default function ContactPageEditor() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-400/10">
            <Phone className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">صفحة التواصل</h1>
            <p className="mt-0.5 text-sm text-white/40">عنوان الصفحة، الوصف، وعناوين النماذج</p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/8" />

        <div className="space-y-4">
          <SectionEditor
            sectionKey="contactPage"
            label="قسم التواصل — Contact"
            description="عنوان الصفحة الرئيسي، وصف الخدمة، عنوان نموذج الطلب وعنوان قسم المكاتب"
            defaultOpen={true}
          />
          <SectionEditor
            sectionKey="contact"
            label="بيانات التواصل المباشر — Direct Contact Details & Form"
            description="بيانات الاتصال (العنوان، الهاتف، البريد الإلكتروني، روابط التواصل الاجتماعي والواتساب)"
            defaultOpen={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
