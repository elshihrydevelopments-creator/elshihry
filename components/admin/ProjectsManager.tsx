'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Building2, ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react';

import { SmartUploader } from '@/components/admin/SmartUploader';
import { useToast } from '@/components/admin/ToastProvider';
import type { AdminProjectPayload, ProjectAggregate } from '@/lib/project-landings/types';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function createEmptyProject(): AdminProjectPayload {
  return {
    amenities: [],
    area_name: '',
    city: '',
    cover_url: '',
    delivery_date: '',
    description_ar: '',
    description_en: '',
    details: [
      { sort_order: 0, text_ar: '', text_en: '' },
      { sort_order: 1, text_ar: '', text_en: '' },
    ],
    display_order: 0,
    faq_blocks: [],
    gallery: [],
    governorate: '',
    location_ar: '',
    location_en: '',
    payment_plan_summary: '',
    project_type: '',
    published: true,
    slug: '',
    stats: [
      { label_ar: 'الموقع', label_en: 'Location', sort_order: 0, value: '' },
      { label_ar: 'التسليم', label_en: 'Delivery', sort_order: 1, value: '' },
    ],
    status: '',
    title_ar: '',
    title_en: '',
    unit_types: [],
  };
}

function mapAggregateToPayload(project: ProjectAggregate): AdminProjectPayload {
  return {
    amenities: project.amenities,
    area_name: project.area_name ?? '',
    city: project.city ?? '',
    cover_url: project.cover_url ?? '',
    delivery_date: project.delivery_date ?? '',
    description_ar: project.description_ar,
    description_en: project.description_en,
    details: project.details.map((detail, index) => ({
      id: detail.id,
      sort_order: detail.sort_order ?? index,
      text_ar: detail.text_ar,
      text_en: detail.text_en,
    })),
    display_order: project.display_order,
    faq_blocks: project.faq_blocks,
    gallery: project.gallery.map((image, index) => ({
      alt_ar: image.alt_ar ?? '',
      alt_en: image.alt_en ?? '',
      id: image.id,
      image_url: image.image_url,
      sort_order: image.sort_order ?? index,
    })),
    governorate: project.governorate ?? '',
    id: project.id,
    location_ar: project.location_ar,
    location_en: project.location_en,
    payment_plan_summary: project.payment_plan_summary ?? '',
    project_type: project.project_type ?? '',
    published: project.published,
    slug: project.slug,
    stats: project.stats.map((stat, index) => ({
      id: stat.id,
      label_ar: stat.label_ar,
      label_en: stat.label_en,
      sort_order: stat.sort_order ?? index,
      value: stat.value,
    })),
    status: project.status ?? '',
    title_ar: project.title_ar,
    title_en: project.title_en,
    unit_types: project.unit_types,
  };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-lg font-bold text-white">{children}</h3>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{children}</span>;
}

export function ProjectsManager() {
  const [items, setItems] = useState<ProjectAggregate[]>([]);
  const [editingProject, setEditingProject] = useState<AdminProjectPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/projects');
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to load projects');
      }

      setItems(json.data || []);
    } catch (error: any) {
      toast(error.message || 'تعذر تحميل المشاريع', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.display_order - b.display_order || a.title_ar.localeCompare(b.title_ar)),
    [items]
  );

  const handleSave = async () => {
    if (!editingProject) return;

    if (!editingProject.title_ar || !editingProject.title_en || !editingProject.description_ar || !editingProject.description_en) {
      toast('أدخل عناوين ووصف المشروع بالعربية والإنجليزية', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editingProject,
        slug: editingProject.slug || slugify(editingProject.title_en),
        details: editingProject.details
          .map((detail, index) => ({ ...detail, sort_order: index }))
          .filter((detail) => detail.text_ar.trim() && detail.text_en.trim()),
        gallery: editingProject.gallery.map((image, index) => ({ ...image, sort_order: index })).filter((image) => image.image_url),
        stats: editingProject.stats
          .map((stat, index) => ({ ...stat, sort_order: index }))
          .filter((stat) => stat.label_ar.trim() && stat.label_en.trim() && stat.value.trim()),
      };

      const response = await fetch(editingProject.id ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects', {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: editingProject.id ? 'PATCH' : 'POST',
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to save project');
      }

      toast('تم حفظ المشروع بنجاح');
      setEditingProject(null);
      await loadProjects();
    } catch (error: any) {
      toast(error.message || 'تعذر حفظ المشروع', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">معرض المشاريع</h2>
          <p className="mt-1 text-sm text-white/35">الإدارة الآن مرتبطة بجدول المشاريع الحقيقي داخل قاعدة البيانات.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditingProject(createEmptyProject())}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
        >
          <Plus className="h-4 w-4" />
          مشروع جديد
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          {sortedItems.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setEditingProject(mapAggregateToPayload(project))}
              className="glass-panel w-full cursor-pointer rounded-[2rem] border border-white/8 p-4 text-right transition hover:border-gold/25"
            >
              <div className="flex items-center gap-4">
                <img
                  src={project.cover_url || '/logo.webp'}
                  alt={project.title_ar}
                  className="h-20 w-20 rounded-[1.4rem] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-bold text-white">{project.title_ar}</p>
                  <p className="mt-1 truncate text-sm text-white/45">{project.title_en}</p>
                  <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-gold/70">{project.slug}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(mapAggregateToPayload(project))}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white/75 transition hover:border-gold/30 hover:text-gold"
                >
                  تعديل المشروع
                </button>
                <Link
                  href={`/admin/project-land-edit/${project.id}` as any}
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  صفحة الهبوط
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel rounded-[2.4rem] border border-white/8 p-5 md:p-6">
          {!editingProject ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center text-center text-white/30">
              <Building2 className="mb-4 h-16 w-16" />
              <p className="text-lg">اختر مشروعًا من القائمة أو أنشئ مشروعًا جديدًا</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{editingProject.id ? 'تعديل المشروع' : 'مشروع جديد'}</h3>
                  <p className="mt-1 text-sm text-white/40">سيتم إنشاء صفحة هبوط تلقائيًا لهذا المشروع عند الحفظ.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  حفظ المشروع
                </button>
              </div>

              <div className="grid gap-6">
                <section className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                  <SectionTitle>البيانات الأساسية</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <FieldLabel>الاسم بالعربية</FieldLabel>
                      <input
                        value={editingProject.title_ar}
                        onChange={(event) => setEditingProject({ ...editingProject, title_ar: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                      />
                    </label>
                    <label className="block">
                      <FieldLabel>Title In English</FieldLabel>
                      <input
                        dir="ltr"
                        value={editingProject.title_en}
                        onChange={(event) =>
                          setEditingProject({
                            ...editingProject,
                            slug: slugify(event.target.value),
                            title_en: event.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                      />
                    </label>
                    <label className="block">
                      <FieldLabel>الموقع بالعربية</FieldLabel>
                      <input
                        value={editingProject.location_ar}
                        onChange={(event) => setEditingProject({ ...editingProject, location_ar: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                      />
                    </label>
                    <label className="block">
                      <FieldLabel>Location In English</FieldLabel>
                      <input
                        dir="ltr"
                        value={editingProject.location_en}
                        onChange={(event) => setEditingProject({ ...editingProject, location_en: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                      />
                    </label>
                  </div>

                  <div className="mt-4">
                    <FieldLabel>Slug</FieldLabel>
                    <input
                      dir="ltr"
                      value={editingProject.slug}
                      readOnly
                      className="w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 font-mono text-sm text-gold/70 outline-none"
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <FieldLabel>الوصف بالعربية</FieldLabel>
                      <textarea
                        rows={5}
                        value={editingProject.description_ar}
                        onChange={(event) => setEditingProject({ ...editingProject, description_ar: event.target.value })}
                        className="w-full resize-none rounded-[1.2rem] border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                      />
                    </label>
                    <label className="block">
                      <FieldLabel>Description In English</FieldLabel>
                      <textarea
                        rows={5}
                        value={editingProject.description_en}
                        onChange={(event) => setEditingProject({ ...editingProject, description_en: event.target.value })}
                        className="w-full resize-none rounded-[1.2rem] border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                      />
                    </label>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                  <SectionTitle>الصور</SectionTitle>
                  <div className="space-y-5">
                    <div>
                      <FieldLabel>صورة الغلاف</FieldLabel>
                      <SmartUploader value={editingProject.cover_url || ''} onChange={(urls) => setEditingProject({ ...editingProject, cover_url: urls[0] || '' })} />
                    </div>
                    <div>
                      <FieldLabel>معرض الصور</FieldLabel>
                      <SmartUploader
                        multiple
                        value={editingProject.gallery.map((item) => item.image_url)}
                        onChange={(urls) =>
                          setEditingProject({
                            ...editingProject,
                            gallery: urls.map((url, index) => ({
                              image_url: url,
                              sort_order: index,
                              alt_ar: editingProject.gallery[index]?.alt_ar || '',
                              alt_en: editingProject.gallery[index]?.alt_en || '',
                            })),
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                  <SectionTitle>الإحصائيات</SectionTitle>
                  <div className="space-y-4">
                    {editingProject.stats.map((stat, index) => (
                      <div key={`stat-${index}`} className="grid gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4 md:grid-cols-3">
                        <label className="block">
                          <FieldLabel>Label AR</FieldLabel>
                          <input
                            value={stat.label_ar}
                            onChange={(event) =>
                              setEditingProject({
                                ...editingProject,
                                stats: editingProject.stats.map((item, innerIndex) => (innerIndex === index ? { ...item, label_ar: event.target.value } : item)),
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                          />
                        </label>
                        <label className="block">
                          <FieldLabel>Label EN</FieldLabel>
                          <input
                            value={stat.label_en}
                            onChange={(event) =>
                              setEditingProject({
                                ...editingProject,
                                stats: editingProject.stats.map((item, innerIndex) => (innerIndex === index ? { ...item, label_en: event.target.value } : item)),
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                          />
                        </label>
                        <label className="block">
                          <FieldLabel>Value</FieldLabel>
                          <input
                            value={stat.value}
                            onChange={(event) =>
                              setEditingProject({
                                ...editingProject,
                                stats: editingProject.stats.map((item, innerIndex) => (innerIndex === index ? { ...item, value: event.target.value } : item)),
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                          />
                        </label>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({
                          ...editingProject,
                          stats: [...editingProject.stats, { label_ar: '', label_en: '', sort_order: editingProject.stats.length, value: '' }],
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white/70 transition hover:border-gold/30 hover:text-gold"
                    >
                      <Plus className="h-4 w-4" />
                      إضافة إحصائية
                    </button>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                  <SectionTitle>المميزات</SectionTitle>
                  <div className="space-y-4">
                    {editingProject.details.map((detail, index) => (
                      <div key={`detail-${index}`} className="grid gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4 md:grid-cols-[1fr_1fr_56px]">
                        <label className="block">
                          <FieldLabel>الميزة بالعربية</FieldLabel>
                          <input
                            value={detail.text_ar}
                            onChange={(event) =>
                              setEditingProject({
                                ...editingProject,
                                details: editingProject.details.map((item, innerIndex) => (innerIndex === index ? { ...item, text_ar: event.target.value } : item)),
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                          />
                        </label>
                        <label className="block">
                          <FieldLabel>Feature In English</FieldLabel>
                          <input
                            value={detail.text_en}
                            onChange={(event) =>
                              setEditingProject({
                                ...editingProject,
                                details: editingProject.details.map((item, innerIndex) => (innerIndex === index ? { ...item, text_en: event.target.value } : item)),
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white outline-none focus:border-gold/40"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProject({
                              ...editingProject,
                              details: editingProject.details.filter((_, innerIndex) => innerIndex !== index),
                            })
                          }
                          className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-red-400/15 bg-red-400/8 text-red-300 transition hover:bg-red-400/15"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({
                          ...editingProject,
                          details: [...editingProject.details, { sort_order: editingProject.details.length, text_ar: '', text_en: '' }],
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white/70 transition hover:border-gold/30 hover:text-gold"
                    >
                      <Plus className="h-4 w-4" />
                      إضافة ميزة
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
