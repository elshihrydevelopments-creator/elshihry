'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Save } from 'lucide-react';

import {
  AddButton,
  DraftMediaItem,
  DraftUnit,
  LabeledInput,
  LabeledTextarea,
  MEDIA_KEY_CONFIG,
  MediaItemCard,
  SectionAccordion,
  STATUS_OPTIONS,
  UnitCard,
} from '@/components/admin/project-land/EditorPrimitives';
import { ProjectLandingStatusBadge } from '@/components/admin/project-land/ProjectLandingStatusBadge';
import { SmartUploader } from '@/components/admin/SmartUploader';
import { useToast } from '@/components/admin/ToastProvider';
import type {
  LocalizedLandingSections,
  ProjectLandingAggregate,
  ProjectLandingSectionKey,
  ProjectLandingStatus,
} from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

export function ProjectLandingEditor({ projectId }: { projectId: string }) {
  const [data, setData] = useState<ProjectLandingAggregate | null>(null);
  const [activeLocale, setActiveLocale] = useState<'ar' | 'en'>('ar');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<DraftMediaItem[]>([]);
  const [units, setUnits] = useState<DraftUnit[]>([]);
  const { toast } = useToast();

  const loadLanding = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/project-landings/${projectId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      const agg: ProjectLandingAggregate = json.data;
      setData(agg);
      setMediaItems([
        ...agg.media.life_timeline,
        ...agg.media.highlight_bento,
        ...agg.media.day_exterior,
        ...agg.media.night_exterior,
      ].map((m) => ({ ...m })));
      setUnits(agg.units.map((u) => ({ ...u })));
    } catch (e: any) {
      toast(e.message || 'تعذر التحميل', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => { void loadLanding(); }, [loadLanding]);

  const currentSections = useMemo(() => data?.sections[activeLocale], [activeLocale, data]);

  function updateSectionData<K extends ProjectLandingSectionKey>(
    key: K,
    updater: (c: LocalizedLandingSections['ar'][K]['data']) => LocalizedLandingSections['ar'][K]['data']
  ) {
    setData((cur) => {
      if (!cur) return cur;
      return {
        ...cur,
        sections: {
          ...cur.sections,
          [activeLocale]: {
            ...cur.sections[activeLocale],
            [key]: {
              ...cur.sections[activeLocale][key],
              data: updater(cur.sections[activeLocale][key].data as never),
            },
          },
        },
      };
    });
  }

  // ── Media helpers ───────────────────────────────────────────────────────
  function addMedia(mediaKey: string, locale: 'ar' | 'en') {
    const item: DraftMediaItem = {
      _isNew: true,
      caption: '',
      id: `new-${Date.now()}-${Math.random()}`,
      image_url: '',
      is_enabled: true,
      locale,
      media_key: mediaKey as never,
      sort_order: mediaItems.filter((m) => m.media_key === mediaKey && m.locale === locale).length,
      title: '',
      video_url: null,
    };
    setMediaItems((p) => [...p, item]);
  }

  function updateMedia(id: string, updated: DraftMediaItem) {
    setMediaItems((p) => p.map((m) => (m.id === id ? updated : m)));
  }

  function removeMedia(id: string) {
    setMediaItems((p) => p.filter((m) => m.id !== id));
  }

  // ── Unit helpers ────────────────────────────────────────────────────────
  function addUnit() {
    setUnits((p) => [
      ...p,
      {
        _isNew: true,
        area_sqm: null, availability_status: 'available',
        bathrooms: null, bedrooms: null, floor_number: null,
        floorplan_url: null, id: `new-${Date.now()}`, image_url: null,
        price_egp: null, project_id: projectId,
        sort_order: p.length, title_ar: '', title_en: '',
        unit_type_ar: '', unit_type_en: '',
      },
    ]);
  }

  async function removeUnit(id: string) {
    if (!id.startsWith('new-')) {
      await fetch(`/api/admin/project-landings/${projectId}/units`, {
        body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' }, method: 'DELETE',
      }).catch(() => {});
    }
    setUnits((p) => p.filter((u) => u.id !== id));
  }

  // ── Save all ────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      // 1. Sections
      const r1 = await fetch(`/api/admin/project-landings/${projectId}`, {
        body: JSON.stringify({ sections: data.sections, status: data.landing.status, thumbnailUrl: data.landing.thumbnail_url }),
        headers: { 'Content-Type': 'application/json' }, method: 'PATCH',
      });
      if (!r1.ok) throw new Error((await r1.json()).error);

      // 2. Media
      const mediaToSave = mediaItems.filter((m) => m.image_url);
      if (mediaToSave.length > 0) {
        const payload = mediaToSave.map(({ _isNew, ...m }) => _isNew ? { ...m, id: undefined } : m);
        const r2 = await fetch(`/api/admin/project-landings/${projectId}/media`, {
          body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }, method: 'PUT',
        });
        if (!r2.ok) throw new Error((await r2.json()).error);
      }

      // 3. Units
      const unitsToSave = units.filter((u) => u.title_ar || u.title_en);
      if (unitsToSave.length > 0) {
        const payload = unitsToSave.map(({ _isNew, ...u }) => _isNew ? { ...u, id: undefined } : u);
        const r3 = await fetch(`/api/admin/project-landings/${projectId}/units`, {
          body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }, method: 'PUT',
        });
        if (!r3.ok) throw new Error((await r3.json()).error);
      }

      await loadLanding();
      toast('تم حفظ كل البيانات بنجاح ✓');
    } catch (e: any) {
      toast(e.message || 'حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data || !currentSections) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  const hero = currentSections.hero.data;
  const overview = currentSections.overview.data;
  const benefits = currentSections.benefits.data;
  const locationMap = currentSections.location_map.data;
  const faq = currentSections.faq.data;
  const leadForm = currentSections.lead_form.data;
  const seo = currentSections.seo.data;

  return (
    <div className="space-y-5">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 rounded-[2.2rem] border border-white/8 bg-rich-black/90 p-5 backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <ProjectLandingStatusBadge status={data.landing.status} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/25">{data.project.slug}</p>
              <h2 className="text-xl font-bold text-white">{data.project.title_ar}</h2>
              <p className="text-xs text-white/40">{data.project.title_en}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Locale */}
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              {(['ar', 'en'] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLocale(loc)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition',
                    activeLocale === loc ? 'bg-gold text-rich-black' : 'text-white/55 hover:text-white'
                  )}
                >
                  {loc === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>
            {/* Status */}
            <select
              value={data.landing.status}
              onChange={(e) => setData((c) => c ? { ...c, landing: { ...c.landing, status: e.target.value as ProjectLandingStatus } } : c)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-rich-black">{o.label}</option>
              ))}
            </select>
            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'جارٍ الحفظ...' : 'حفظ الكل'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Thumbnail ── */}
      <SectionAccordion id="s-thumbnail" title="الصورة المصغرة — Thumbnail" defaultOpen>
        <SmartUploader
          value={data.landing.thumbnail_url || ''}
          onChange={(urls) => setData((c) => c ? { ...c, landing: { ...c.landing, thumbnail_url: urls[0] || '' } } : c)}
        />
      </SectionAccordion>

      {/* ── Hero ── */}
      {/* ── Hero ── */}
      <SectionAccordion id="s-hero" title="واجهة المشروع — Hero" defaultOpen>
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Eyebrow" value={hero.eyebrow} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, eyebrow: e.target.value }))} />
          <LabeledInput label="Headline — العنوان الرئيسي" value={hero.headline} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, headline: e.target.value }))} />
        </div>
        <LabeledTextarea rows={4} label="Subheadline — العنوان الفرعي" value={hero.subheadline} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, subheadline: e.target.value }))} />
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Primary CTA Text" value={hero.primaryCtaLabel} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, primaryCtaLabel: e.target.value }))} />
          <LabeledInput label="Primary CTA Link" value={hero.primaryCtaHref} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, primaryCtaHref: e.target.value }))} />
          <LabeledInput label="Secondary CTA Text" value={hero.secondaryCtaLabel} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, secondaryCtaLabel: e.target.value }))} />
          <LabeledInput label="Secondary CTA Link" value={hero.secondaryCtaHref} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, secondaryCtaHref: e.target.value }))} />
        </div>
        <div className="my-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">أرقام وإحصائيات الهيرو (تظهر في الأسفل) — Hero Stats</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(hero.stats || []).map((stat, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold">إحصائية {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => updateSectionData('hero', (c) => ({ ...c, stats: c.stats.filter((_, j) => j !== i) }))}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    حذف
                  </button>
                </div>
                <LabeledInput
                  label="Label (الاسم)"
                  value={stat.label}
                  onChange={(e) => updateSectionData('hero', (c) => ({ ...c, stats: c.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s) }))}
                />
                <LabeledInput
                  label="Value (القيمة)"
                  value={stat.value}
                  onChange={(e) => updateSectionData('hero', (c) => ({ ...c, stats: c.stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s) }))}
                />
              </div>
            ))}
          </div>
          {(!hero.stats || hero.stats.length < 4) && (
            <AddButton
              label="إضافة إحصائية جديدة (حد أقصى ٤)"
              onClick={() => updateSectionData('hero', (c) => ({ ...c, stats: [...(c.stats || []), { label: '', value: '' }] }))}
            />
          )}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Hero Image</p>
        <SmartUploader value={hero.heroImageUrl || ''} onChange={(urls) => updateSectionData('hero', (c) => ({ ...c, heroImageUrl: urls[0] || '' }))} />
        <LabeledInput label="Hero Image Alt Text" value={hero.heroImageAlt} onChange={(e) => updateSectionData('hero', (c) => ({ ...c, heroImageAlt: e.target.value }))} />
      </SectionAccordion>

      {/* ── Lifestyle Timeline ── */}
      <SectionAccordion id="s-timeline" title="يوم كامل داخل التجربة — Lifestyle Timeline">
        <LabeledInput label="Title" value={currentSections.lifestyle_timeline.data.title} onChange={(e) => updateSectionData('lifestyle_timeline', (c) => ({ ...c, title: e.target.value }))} />
        <LabeledTextarea rows={3} label="Description" value={currentSections.lifestyle_timeline.data.description} onChange={(e) => updateSectionData('lifestyle_timeline', (c) => ({ ...c, description: e.target.value }))} />
        
        <div className="mt-6 space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">لحظات اليوم — Timeline Items</p>
          {currentSections.lifestyle_timeline.data.items.map((item, i) => (
            <div key={i} className="group relative space-y-4 rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold">لحظة {i + 1}</span>
                <button
                  type="button"
                  onClick={() => updateSectionData('lifestyle_timeline', (c) => ({ ...c, items: c.items.filter((_, j) => j !== i) }))}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  حذف
                </button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <LabeledInput
                    label="العنوان (مثال: ٧ صباحًا | قهوة بإطلالة)"
                    value={item.title}
                    onChange={(e) => updateSectionData('lifestyle_timeline', (c) => ({ ...c, items: c.items.map((it, j) => j === i ? { ...it, title: e.target.value } : it) }))}
                  />
                  <LabeledTextarea
                    rows={3}
                    label="الوصف"
                    value={item.caption}
                    onChange={(e) => updateSectionData('lifestyle_timeline', (c) => ({ ...c, items: c.items.map((it, j) => j === i ? { ...it, caption: e.target.value } : it) }))}
                  />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">صورة اللحظة</p>
                  <SmartUploader
                    value={item.imageUrl}
                    onChange={(urls) => updateSectionData('lifestyle_timeline', (c) => ({ ...c, items: c.items.map((it, j) => j === i ? { ...it, imageUrl: urls[0] || '' } : it) }))}
                  />
                </div>
              </div>
            </div>
          ))}
          <AddButton
            label="إضافة لحظة جديدة"
            onClick={() => updateSectionData('lifestyle_timeline', (c) => ({ ...c, items: [...c.items, { title: '', caption: '', imageUrl: '' }] }))}
          />
        </div>
      </SectionAccordion>

      {/* ── Overview & Benefits ── */}
      <SectionAccordion id="s-content" title="المميزات والخدمات — Highlights & Benefits">
        <LabeledInput label="Overview Title" value={overview.title} onChange={(e) => updateSectionData('overview', (c) => ({ ...c, title: e.target.value }))} />
        <LabeledTextarea rows={5} label="Overview Description" value={overview.description} onChange={(e) => updateSectionData('overview', (c) => ({ ...c, description: e.target.value }))} />
        <LabeledTextarea
          rows={5}
          label="Highlights — نقطة لكل سطر"
          value={overview.highlights.join('\n')}
          onChange={(e) => updateSectionData('overview', (c) => ({ ...c, highlights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }))}
        />
        <div className="my-2 h-px bg-white/5" />
        <LabeledInput label="Benefits Section Title" value={benefits.title} onChange={(e) => updateSectionData('benefits', (c) => ({ ...c, title: e.target.value }))} />
        {benefits.items.map((item, i) => (
          <div key={i} className="grid gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4 md:grid-cols-2">
            <LabeledInput
              label={`ميزة ${i + 1} — العنوان`}
              value={item.title}
              onChange={(e) => updateSectionData('benefits', (c) => ({ ...c, items: c.items.map((b, j) => j === i ? { ...b, title: e.target.value } : b) }))}
            />
            <LabeledTextarea
              rows={3}
              label={`ميزة ${i + 1} — الوصف`}
              value={item.description}
              onChange={(e) => updateSectionData('benefits', (c) => ({ ...c, items: c.items.map((b, j) => j === i ? { ...b, description: e.target.value } : b) }))}
            />
          </div>
        ))}
        <AddButton
          label="إضافة ميزة جديدة"
          onClick={() => updateSectionData('benefits', (c) => ({ ...c, items: [...c.items, { title: '', description: '' }] }))}
        />
      </SectionAccordion>

      {/* ── Location Map ── */}
      <SectionAccordion id="s-location" title="خريطة الموقع — Location Map">
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Eyebrow" value={locationMap.eyebrow} onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, eyebrow: e.target.value }))} />
          <LabeledInput label="Title" value={locationMap.title} onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, title: e.target.value }))} />
        </div>
        <LabeledTextarea rows={3} label="Description" value={locationMap.description} onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, description: e.target.value }))} />
        <LabeledInput label="Google Maps URL" value={locationMap.mapHref} placeholder="https://maps.google.com/..." onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, mapHref: e.target.value }))} />
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Card Title" value={locationMap.cardTitle} onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, cardTitle: e.target.value }))} />
          <LabeledInput label="Map Image Alt" value={locationMap.mapImageAlt} onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, mapImageAlt: e.target.value }))} />
        </div>
        <LabeledTextarea
          rows={4}
          label="نقاط المنطقة — نقطة لكل سطر"
          value={locationMap.points.join('\n')}
          onChange={(e) => updateSectionData('location_map', (c) => ({ ...c, points: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }))}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Map Background Image</p>
            <SmartUploader value={locationMap.mapImageUrl || ''} onChange={(urls) => updateSectionData('location_map', (c) => ({ ...c, mapImageUrl: urls[0] || '' }))} />
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Card Image</p>
            <SmartUploader value={locationMap.cardImageUrl || ''} onChange={(urls) => updateSectionData('location_map', (c) => ({ ...c, cardImageUrl: urls[0] || '' }))} />
          </div>
        </div>
      </SectionAccordion>

      {/* ── Masterpiece Details ── */}
      <SectionAccordion id="s-masterpiece" title="تفاصيل التحفة المعمارية — Masterpiece Details" badge="جديد">
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Eyebrow" value={currentSections.masterpiece_details.data.eyebrow} onChange={(e) => updateSectionData('masterpiece_details', (c) => ({ ...c, eyebrow: e.target.value }))} />
          <LabeledInput label="Title" value={currentSections.masterpiece_details.data.title} onChange={(e) => updateSectionData('masterpiece_details', (c) => ({ ...c, title: e.target.value }))} />
        </div>
        <LabeledTextarea rows={3} label="Description" value={currentSections.masterpiece_details.data.description} onChange={(e) => updateSectionData('masterpiece_details', (c) => ({ ...c, description: e.target.value }))} />
        <LabeledInput label="CTA Label" value={currentSections.masterpiece_details.data.ctaLabel} onChange={(e) => updateSectionData('masterpiece_details', (c) => ({ ...c, ctaLabel: e.target.value }))} />
        <div className="my-2 h-px bg-white/5" />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">صور المواد والتشطيبات (يرجى إضافتها من قسم الميديا بالأسفل)</p>
      </SectionAccordion>

      {/* ── Panoramic Aura ── */}
      <SectionAccordion id="s-panoramic" title="الأجواء البانورامية — Panoramic Aura" badge="جديد">
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Eyebrow" value={currentSections.panoramic_aura.data.eyebrow} onChange={(e) => updateSectionData('panoramic_aura', (c) => ({ ...c, eyebrow: e.target.value }))} />
          <LabeledInput label="Title" value={currentSections.panoramic_aura.data.title} onChange={(e) => updateSectionData('panoramic_aura', (c) => ({ ...c, title: e.target.value }))} />
        </div>
        <LabeledTextarea rows={3} label="Description" value={currentSections.panoramic_aura.data.description} onChange={(e) => updateSectionData('panoramic_aura', (c) => ({ ...c, description: e.target.value }))} />
        <LabeledInput label="CTA Label" value={currentSections.panoramic_aura.data.ctaLabel} onChange={(e) => updateSectionData('panoramic_aura', (c) => ({ ...c, ctaLabel: e.target.value }))} />
        
        <div className="my-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">المقاييس البانورامية — Metrics</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {currentSections.panoramic_aura.data.metrics.map((metric, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <LabeledInput
                  label={`Metric ${i + 1} Label`}
                  value={metric.label}
                  onChange={(e) => updateSectionData('panoramic_aura', (c) => ({ ...c, metrics: c.metrics.map((m, j) => j === i ? { ...m, label: e.target.value } : m) }))}
                />
                <LabeledInput
                  label={`Metric ${i + 1} Value`}
                  value={metric.value}
                  onChange={(e) => updateSectionData('panoramic_aura', (c) => ({ ...c, metrics: c.metrics.map((m, j) => j === i ? { ...m, value: e.target.value } : m) }))}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* ── Units ── */}
      <SectionAccordion id="s-units" title={`قائمة الوحدات والمساحات — Units & Inventory (${units.length})`} badge="جديد">
        <p className="text-xs text-white/40">
          الوحدات تظهر في جريد الوحدات أسفل الصفحة — أضف، عدّل، أو احذف.
        </p>
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onChange={(u) => setUnits((p) => p.map((x) => (x.id === unit.id ? u : x)))}
            onDelete={() => removeUnit(unit.id)}
          />
        ))}
        <AddButton label="إضافة وحدة جديدة" onClick={addUnit} />
      </SectionAccordion>

      {/* ── FAQ ── */}
      <SectionAccordion id="s-faq" title="الأسئلة الشائعة — FAQ">
        <LabeledInput label="Section Title" value={faq.title} onChange={(e) => updateSectionData('faq', (c) => ({ ...c, title: e.target.value }))} />
        {faq.items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold">سؤال {i + 1}</span>
              <button
                type="button"
                onClick={() => updateSectionData('faq', (c) => ({ ...c, items: c.items.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400 hover:text-red-300"
              >
                حذف
              </button>
            </div>
            <LabeledInput
              label="السؤال"
              value={item.question}
              onChange={(e) => updateSectionData('faq', (c) => ({ ...c, items: c.items.map((q, j) => j === i ? { ...q, question: e.target.value } : q) }))}
            />
            <LabeledTextarea
              rows={4}
              label="الإجابة"
              value={item.answer}
              onChange={(e) => updateSectionData('faq', (c) => ({ ...c, items: c.items.map((q, j) => j === i ? { ...q, answer: e.target.value } : q) }))}
            />
          </div>
        ))}
        <AddButton
          label="إضافة سؤال جديد"
          onClick={() => updateSectionData('faq', (c) => ({ ...c, items: [...c.items, { question: '', answer: '' }] }))}
        />
      </SectionAccordion>

      {/* ── Lead Form ── */}
      <SectionAccordion id="s-leadform" title="نموذج طلب التفاصيل — Lead Form">
        <LabeledInput label="Form Title" value={leadForm.title} onChange={(e) => updateSectionData('lead_form', (c) => ({ ...c, title: e.target.value }))} />
        <LabeledTextarea rows={4} label="Description" value={leadForm.description} onChange={(e) => updateSectionData('lead_form', (c) => ({ ...c, description: e.target.value }))} />
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="Submit Button Text" value={leadForm.submitLabel} onChange={(e) => updateSectionData('lead_form', (c) => ({ ...c, submitLabel: e.target.value }))} />
          <LabeledInput label="Success Message" value={leadForm.successMessage} onChange={(e) => updateSectionData('lead_form', (c) => ({ ...c, successMessage: e.target.value }))} />
        </div>
        <LabeledTextarea rows={3} label="Privacy Note" value={leadForm.privacyNote} onChange={(e) => updateSectionData('lead_form', (c) => ({ ...c, privacyNote: e.target.value }))} />
      </SectionAccordion>

      {/* ── SEO ── */}
      <SectionAccordion id="s-seo" title="إعدادات محركات البحث — SEO">
        <LabeledInput label="SEO Title" value={seo.title} onChange={(e) => updateSectionData('seo', (c) => ({ ...c, title: e.target.value }))} />
        <LabeledTextarea rows={4} label="SEO Description" value={seo.description} onChange={(e) => updateSectionData('seo', (c) => ({ ...c, description: e.target.value }))} />
        <LabeledInput label="Facebook Pixel ID" value={seo.fbPixelId || ''} onChange={(e) => updateSectionData('seo', (c) => ({ ...c, fbPixelId: e.target.value }))} />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">OG Image</p>
        <SmartUploader value={seo.ogImage || ''} onChange={(urls) => updateSectionData('seo', (c) => ({ ...c, ogImage: urls[0] || '' }))} />
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={seo.indexable} onChange={(e) => updateSectionData('seo', (c) => ({ ...c, indexable: e.target.checked }))} className="accent-gold" />
          <span className="text-sm text-white/60">قابل للفهرسة (Indexable)</span>
        </label>
      </SectionAccordion>

      {/* ── Media ── */}
      <SectionAccordion id="s-media" title="الميديا — صور وفيديوهات الصفحة">
        <p className="text-xs text-white/40">
          الميديا مستقلة عن اللغة المختارة أعلاه — كل عنصر يحمل اللغة الخاصة به.
        </p>
        {MEDIA_KEY_CONFIG.map(({ hint, key, label, supportsVideo }) => {
          const items = mediaItems.filter((m) => m.media_key === key);
          return (
            <div key={key} className="space-y-3 rounded-[1.6rem] border border-white/8 bg-white/[0.015] p-4">
              <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-white/38">{hint}</p>
              </div>
              {items.map((item) => (
                <MediaItemCard
                  key={item.id}
                  item={item}
                  supportsVideo={supportsVideo}
                  onChange={(u) => updateMedia(item.id, u)}
                  onDelete={() => removeMedia(item.id)}
                />
              ))}
              <div className="grid gap-2 sm:grid-cols-2">
                <AddButton label="+ عربي" onClick={() => addMedia(key, 'ar')} />
                <AddButton label="+ English" onClick={() => addMedia(key, 'en')} />
              </div>
            </div>
          );
        })}
      </SectionAccordion>

      {/* ── Bottom save ── */}
      <div className="flex justify-end pt-2 pb-10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'جارٍ الحفظ...' : 'حفظ كل التعديلات'}
        </button>
      </div>
    </div>
  );
}
