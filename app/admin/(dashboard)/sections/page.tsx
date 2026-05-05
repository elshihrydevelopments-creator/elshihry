'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { motion } from 'motion/react';

import { useToast } from '@/components/admin/ToastProvider';
import { notifyContentUpdated } from '@/lib/content-sync';

const SECTIONS = [
  { key: 'hero', name: 'الصفحة الرئيسية - الهيرو' },
  { key: 'about', name: 'من نحن - القسم التعريفي' },
  { key: 'aboutLeadership', name: 'من نحن - القيادة' },
  { key: 'aboutValues', name: 'من نحن - قيمنا الجوهرية' },
  { key: 'arch', name: 'النهج ومحاور التطوير' },
  { key: 'projects', name: 'المشاريع' },
  { key: 'philosophy', name: 'الفلسفة' },
  { key: 'marquee', name: 'الشريط المتحرك' },
  { key: 'lifestyle', name: 'أسلوب الحياة' },
  { key: 'whyInvest', name: 'لماذا الاستثمار' },
];

export default function SectionsPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSectionData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sections?section_key=${activeSection}&locale=${locale}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else {
        toast('تأكد من إعدادات قاعدة البيانات لمزامنة المحتوى', 'error');
        setData({});
      }
    } catch (error) {
      console.error(error);
      toast('مشكلة في الاتصال بالشبكة', 'error');
    }
    setLoading(false);
  }, [activeSection, locale, toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchSectionData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchSectionData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_key: activeSection, locale, data }),
      });

      if (res.ok) {
        notifyContentUpdated();
        toast('تم حفظ القسم وتحديث الكاش بنجاح!');
      } else {
        toast('حدث خطأ أثناء الحفظ', 'error');
      }
    } catch {
      toast('مشكلة في الاتصال بالشبكة', 'error');
    }
    setSaving(false);
  };

  const handleFieldChange = (key: string, value: any, isArray = false, idx = -1, subKey = '') => {
    const newData = { ...data };
    if (isArray) {
      if (subKey) {
        newData[key][idx][subKey] = value;
      } else {
        newData[key][idx] = value;
      }
    } else {
      newData[key] = value;
    }
    setData(newData);
  };

  return (
    <div className="flex min-h-screen flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">محتوى الصفحات</h1>
          <p className="text-white/50">قم بتعديل محتوى الصفحة الرئيسية وقسم من نحن بكل سهولة</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-1">
            <button
              onClick={() => setLocale('ar')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-none ${locale === 'ar' ? 'bg-gold text-rich-black' : 'text-white/60 hover:text-white'}`}
            >
              العربية
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-none ${locale === 'en' ? 'bg-gold text-rich-black' : 'text-white/60 hover:text-white'}`}
            >
              English
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || !data}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-2 font-bold text-rich-black transition-colors hover:bg-white disabled:opacity-50 sm:w-auto"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            حفظ وتحديث
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 xl:flex-row">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-72 xl:flex-shrink-0 xl:grid-cols-1 xl:overflow-y-auto xl:pr-2">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`rounded-xl border px-4 py-4 text-right transition-all ${activeSection === section.key ? 'border-gold/50 bg-white/10 text-gold shadow-[0_0_15px_rgba(241,213,130,0.1)]' : 'border-transparent bg-transparent text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="font-bold">{section.name}</div>
              <div className="mt-1 text-xs font-mono opacity-50" dir="ltr">
                {section.key}
              </div>
            </button>
          ))}
        </div>

        <div className="glass-panel flex-1 overflow-y-auto rounded-[2rem] border border-white/10 p-4 sm:rounded-3xl sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : data ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {activeSection === 'hero' && (
                <div className="mb-8 rounded-2xl border border-gold/20 bg-gold/5 p-5 sm:p-6">
                  <h3 className="mb-4 text-xl font-bold text-gold">رابط ميديا الهيرو</h3>
                  <p className="mb-6 text-sm text-white/50">
                    لضمان سرعة الموقع (LCP)، استخدم روابط Cloudinary المباشرة.
                  </p>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-white/80">
                      رابط الفيديو (Cloudinary URL)
                    </label>
                    <input
                      value={data.videoUrl || ''}
                      onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                      placeholder="https://res.cloudinary.com/.../video.mp4"
                      className="w-full rounded-xl border border-white/10 bg-rich-black px-4 py-3 font-mono text-left text-white focus:border-gold/50"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {Object.entries(data).map(([key, val]: [string, any]) => {
                if (key === 'videoUrl') return null;

                if (typeof val === 'string') {
                  return (
                    <div key={key}>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-white/80">
                        {key}
                      </label>
                      {val.length > 50 ? (
                        <textarea
                          rows={4}
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                        />
                      ) : (
                        <input
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                        />
                      )}
                    </div>
                  );
                }

                if (Array.isArray(val)) {
                  return (
                    <div key={key} className="space-y-4 rounded-2xl border border-white/10 p-5 sm:p-6">
                      <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gold">
                        {key} (قائمة)
                      </label>
                      {val.map((item, idx) => (
                        <div key={idx} className="space-y-4 rounded-xl border border-white/5 bg-rich-black p-4">
                          {typeof item === 'string' ? (
                            <input
                              value={item}
                              onChange={(e) => handleFieldChange(key, e.target.value, true, idx)}
                              className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                            />
                          ) : (
                            Object.entries(item).map(([subKey, subValue]: [string, any]) => (
                              <div key={subKey}>
                                <span className="mb-1 block text-xs text-white/50">{subKey}</span>
                                <input
                                  value={subValue}
                                  onChange={(e) => handleFieldChange(key, e.target.value, true, idx, subKey)}
                                  className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-2 text-sm text-white focus:border-gold/50"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }

                return null;
              })}
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center text-white/30">
              الرجاء ضبط قاعدة البيانات أو الانتظار
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
