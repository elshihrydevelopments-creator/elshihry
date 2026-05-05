'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

import { SmartUploader } from '@/components/admin/SmartUploader';
import { useToast } from '@/components/admin/ToastProvider';
import { notifyContentUpdated } from '@/lib/content-sync';

interface SectionEditorProps {
  sectionKey: string;
  label: string;
  description?: string;
  defaultOpen?: boolean;
}

export function SectionEditor({ sectionKey, label, description, defaultOpen = false }: SectionEditorProps) {
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sections?section_key=${sectionKey}&locale=${locale}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else {
        toast('تعذر تحميل بيانات هذا القسم', 'error');
        setData({});
      }
    } catch {
      toast('خطأ في الاتصال بالشبكة', 'error');
    }
    setLoading(false);
  }, [locale, sectionKey, toast]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        void fetchData();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [fetchData, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_key: sectionKey, locale, data }),
      });

      if (res.ok) {
        notifyContentUpdated();
        toast(`تم حفظ "${label}" بنجاح`);
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

  const handleLifestyleImageChange = (index: number, nextUrl: string) => {
    const currentImages = Array.isArray(data?.images) ? [...data.images] : [];
    currentImages[index] = nextUrl;
    setData({ ...data, images: currentImages });
  };

  return (
    <div className="glass-panel overflow-hidden rounded-3xl border border-white/8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full flex-col items-start gap-4 p-4 text-right transition-colors hover:bg-white/3 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="h-2 w-2 rounded-full bg-gold" />
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white">{label}</h3>
            {description && <p className="mt-0.5 text-sm text-white/40">{description}</p>}
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-normal">
          <span className="rounded-lg border border-white/10 px-2 py-1 text-xs font-mono text-white/25" dir="ltr">
            {sectionKey}
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-white/40" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/40" />
          )}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/8 p-4 sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-1 sm:w-auto">
              <button
                onClick={() => setLocale('ar')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-none ${locale === 'ar' ? 'bg-gold text-rich-black' : 'text-white/50 hover:text-white'}`}
              >
                العربية
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-none ${locale === 'en' ? 'bg-gold text-rich-black' : 'text-white/50 hover:text-white'}`}
              >
                English
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading || !data}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2 text-sm font-bold text-rich-black transition-colors hover:bg-white disabled:opacity-40 sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ وتحديث
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : data ? (
            <div className="space-y-5">
              {sectionKey === 'hero' && (
                <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">رابط الفيديو</h4>
                  <input
                    value={data.videoUrl || ''}
                    onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                    placeholder="https://res.cloudinary.com/.../video.mp4"
                    className="w-full rounded-xl border border-white/10 bg-rich-black px-4 py-3 font-mono text-sm text-white focus:border-gold/50 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              )}

              {Object.entries(data).map(([key, val]: [string, any]) => {
                if (key === 'videoUrl') return null;
                if (sectionKey === 'lifestyle' && key === 'images') return null;

                if (typeof val === 'string') {
                  const isImageField = key.toLowerCase().includes('image');

                  return (
                    <div key={key}>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">{key}</label>
                      {isImageField ? (
                        <SmartUploader
                          value={val ? [val] : []}
                          onChange={(urls) => handleFieldChange(key, urls[0] || '')}
                          label={key}
                        />
                      ) : val.length > 60 ? (
                        <textarea
                          rows={3}
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full resize-none rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
                        />
                      ) : (
                        <input
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-sm text-white focus:border-gold/50 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                }

                if (sectionKey === 'lifestyle' && key === 'items' && Array.isArray(val)) {
                  const imageValues = Array.isArray(data.images) ? data.images : [];

                  return (
                    <div key={key} className="overflow-hidden rounded-2xl border border-gold/20 bg-gold/5">
                      <div className="border-b border-white/8 bg-white/3 px-5 py-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-gold">Lifestyle Items & Images</label>
                      </div>
                      <div className="space-y-6 p-4">
                        {val.map((item: any, idx: number) => (
                          <div key={idx} className="space-y-4 rounded-2xl border border-white/8 bg-rich-black p-4">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs font-mono text-white/30">#{idx + 1}</p>
                              <p className="text-xs text-white/45">
                                كل عنصر له صورته الخاصة في الصفحة الرئيسية
                              </p>
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                                item
                              </label>
                              <input
                                value={item}
                                onChange={(e) => handleFieldChange(key, e.target.value, true, idx)}
                                className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                                image
                              </label>
                              <SmartUploader
                                value={imageValues[idx] ? [imageValues[idx]] : []}
                                onChange={(urls) => handleLifestyleImageChange(idx, urls[0] || '')}
                                label={`صورة العنصر ${idx + 1}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (Array.isArray(val)) {
                  return (
                    <div key={key} className="overflow-hidden rounded-2xl border border-white/8">
                      <div className="border-b border-white/8 bg-white/3 px-5 py-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">{key}</label>
                      </div>
                      <div className="space-y-3 p-4">
                        {val.map((item: any, idx: number) => (
                          <div key={idx} className="space-y-3 rounded-xl border border-white/5 bg-rich-black p-4">
                            <p className="mb-2 text-xs font-mono text-white/30">#{idx + 1}</p>
                            {typeof item === 'string' ? (
                              <input
                                value={item}
                                onChange={(e) => handleFieldChange(key, e.target.value, true, idx)}
                                className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
                              />
                            ) : (
                              Object.entries(item).map(([subK, subV]: [string, any]) => (
                                <div key={subK}>
                                  <span className="mb-1 block text-xs uppercase tracking-wider text-white/40">{subK}</span>
                                  {typeof subV === 'string' && subV.length > 60 ? (
                                    <textarea
                                      rows={2}
                                      value={subV}
                                      onChange={(e) => handleFieldChange(key, e.target.value, true, idx, subK)}
                                      className="w-full resize-none rounded-xl border border-white/10 bg-rich-black-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
                                    />
                                  ) : (
                                    <input
                                      value={String(subV)}
                                      onChange={(e) => handleFieldChange(key, e.target.value, true, idx, subK)}
                                      className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
                                    />
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-sm text-white/25">
              تعذر تحميل البيانات - تأكد من ضبط قاعدة البيانات
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
