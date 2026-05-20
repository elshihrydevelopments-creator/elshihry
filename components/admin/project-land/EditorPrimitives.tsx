'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

import { SmartUploader } from '@/components/admin/SmartUploader';
import type { ProjectLandingMediaItem, ProjectUnitRecord } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

// ── Types ───────────────────────────────────────────────────────────────────

export type DraftMediaItem = Omit<ProjectLandingMediaItem, 'project_landing_id'> & {
  _isNew?: boolean;
};

export type DraftUnit = ProjectUnitRecord & { _isNew?: boolean };

export const MEDIA_KEY_CONFIG = [
  {
    hint: 'صور المواد والتشطيبات (رخام، زجاج، خشب، إضاءة) — تظهر في سيكشن تفاصيل التحفة',
    key: 'highlight_bento',
    label: 'تفاصيل التحفة — Masterpiece Details',
    supportsVideo: false,
  },
  {
    hint: 'الطبقة الخلفية للباراليكس — تتحرك ببطء (عمق الخلفية)',
    key: 'day_exterior',
    label: 'الأجواء البانورامية — طبقة الخلفية',
    supportsVideo: false,
  },
  {
    hint: 'الطبقة الأمامية للباراليكس — تتحرك أسرع لإيجاد عمق ثلاثي الأبعاد',
    key: 'night_exterior',
    label: 'الأجواء البانورامية — طبقة العمق',
    supportsVideo: false,
  },
] as const;

export const STATUS_OPTIONS = [
  { label: 'مسودة', value: 'draft' },
  { label: 'منشور', value: 'published' },
  { label: 'مؤرشف', value: 'archived' },
] as const;

export const UNIT_AVAILABILITY_OPTIONS = [
  { label: 'متاح', value: 'available' },
  { label: 'محجوز', value: 'reserved' },
  { label: 'مباع', value: 'sold' },
];

// ── Form primitives ─────────────────────────────────────────────────────────

export function LabeledInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-gold/40 transition-colors"
      />
    </label>
  );
}

export function LabeledTextarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{label}</span>
      <textarea
        {...props}
        className="w-full resize-none rounded-[1.2rem] border border-white/10 bg-rich-black-light px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-gold/40 transition-colors"
      />
    </label>
  );
}

export function LabeledSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-sm text-white outline-none focus:border-gold/40 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-rich-black">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// ── Accordion section ───────────────────────────────────────────────────────

export function SectionAccordion({
  badge,
  children,
  defaultOpen = false,
  id,
  title,
}: {
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-5 text-left md:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-white">{title}</span>
          {badge ? (
            <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              {badge}
            </span>
          ) : null}
        </div>
        {open ? (
          <ChevronDown className="h-5 w-5 shrink-0 text-white/40" />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-white/40" />
        )}
      </button>
      {open ? (
        <div className="border-t border-white/6 p-5 md:p-6">
          <div className="space-y-4">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

// ── Media item card ─────────────────────────────────────────────────────────

export function MediaItemCard({
  item,
  onChange,
  onDelete,
  supportsVideo,
}: {
  item: DraftMediaItem;
  onChange: (updated: DraftMediaItem) => void;
  onDelete: () => void;
  supportsVideo: boolean;
}) {
  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/38">
          {item.locale === 'ar' ? 'عربي' : 'English'}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <SmartUploader value={item.image_url} onChange={(urls) => onChange({ ...item, image_url: urls[0] || '' })} />
      <div className="grid gap-3 md:grid-cols-2">
        <LabeledInput
          label="العنوان / Title"
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
        />
        <LabeledInput
          label="التعليق / Caption"
          value={item.caption}
          onChange={(e) => onChange({ ...item, caption: e.target.value })}
        />
      </div>
      {supportsVideo ? (
        <LabeledInput
          label="رابط الفيديو (اختياري)"
          value={item.video_url || ''}
          placeholder="https://..."
          onChange={(e) => onChange({ ...item, video_url: e.target.value || null })}
        />
      ) : null}
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={item.is_enabled}
          onChange={(e) => onChange({ ...item, is_enabled: e.target.checked })}
          className="accent-gold"
        />
        <span className="text-xs text-white/50">مفعّل / Enabled</span>
      </label>
    </div>
  );
}

// ── Unit card ───────────────────────────────────────────────────────────────

export function UnitCard({
  onChange,
  onDelete,
  unit,
}: {
  onChange: (updated: DraftUnit) => void;
  onDelete: () => void;
  unit: DraftUnit;
}) {
  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
          {unit.title_ar || 'وحدة جديدة'}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <LabeledInput label="الاسم عربي" value={unit.title_ar} onChange={(e) => onChange({ ...unit, title_ar: e.target.value })} />
        <LabeledInput label="Name English" value={unit.title_en} onChange={(e) => onChange({ ...unit, title_en: e.target.value })} />
        <LabeledInput label="نوع الوحدة عربي" value={unit.unit_type_ar} onChange={(e) => onChange({ ...unit, unit_type_ar: e.target.value })} />
        <LabeledInput label="Unit Type English" value={unit.unit_type_en} onChange={(e) => onChange({ ...unit, unit_type_en: e.target.value })} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <LabeledInput label="السعر (EGP)" type="number" value={unit.price_egp ?? ''} onChange={(e) => onChange({ ...unit, price_egp: e.target.value ? Number(e.target.value) : null })} />
        <LabeledInput label="المساحة (م²)" type="number" value={unit.area_sqm ?? ''} onChange={(e) => onChange({ ...unit, area_sqm: e.target.value ? Number(e.target.value) : null })} />
        <LabeledInput label="الدور" type="number" value={unit.floor_number ?? ''} onChange={(e) => onChange({ ...unit, floor_number: e.target.value ? Number(e.target.value) : null })} />
        <LabeledInput label="غرف نوم" type="number" value={unit.bedrooms ?? ''} onChange={(e) => onChange({ ...unit, bedrooms: e.target.value ? Number(e.target.value) : null })} />
        <LabeledInput label="حمامات" type="number" value={unit.bathrooms ?? ''} onChange={(e) => onChange({ ...unit, bathrooms: e.target.value ? Number(e.target.value) : null })} />
        <LabeledSelect
          label="الحالة"
          value={unit.availability_status}
          options={UNIT_AVAILABILITY_OPTIONS}
          onChange={(v) => onChange({ ...unit, availability_status: v as 'available' | 'reserved' | 'sold' })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">صورة الوحدة</p>
          <SmartUploader value={unit.image_url || ''} onChange={(urls) => onChange({ ...unit, image_url: urls[0] || null })} />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">مخطط الوحدة</p>
          <SmartUploader value={unit.floorplan_url || ''} onChange={(urls) => onChange({ ...unit, floorplan_url: urls[0] || null })} />
        </div>
      </div>
    </div>
  );
}

// ── Add button ──────────────────────────────────────────────────────────────

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-[1.4rem] border-2 border-dashed border-white/12',
        'py-4 text-sm font-bold text-white/40 transition hover:border-gold/30 hover:text-gold'
      )}
    >
      <span className="text-lg leading-none">+</span>
      {label}
    </button>
  );
}
