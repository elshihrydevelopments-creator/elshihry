'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Loader2, Pencil, Trash2, Globe } from 'lucide-react';

import { ProjectLandingStatusBadge } from '@/components/admin/project-land/ProjectLandingStatusBadge';
import { useToast } from '@/components/admin/ToastProvider';
import type { ProjectLandingRecord } from '@/lib/project-landings/types';

export function ProjectLandingsManager() {
  const [items, setItems] = useState<ProjectLandingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/project-landings');
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to load project landings');
      }

      setItems(json.data || []);
    } catch (error: any) {
      toast(error.message || 'تعذر تحميل صفحات الهبوط', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleArchive = async (projectId: string) => {
    setArchivingId(projectId);
    try {
      const response = await fetch(`/api/admin/project-landings/${projectId}`, { method: 'DELETE' });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to archive landing');
      }

      toast('تم أرشفة صفحة الهبوط بنجاح');
      await loadItems();
    } catch (error: any) {
      toast(error.message || 'تعذر أرشفة صفحة الهبوط', 'error');
    } finally {
      setArchivingId(null);
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
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel group overflow-hidden rounded-[2.4rem] border border-white/8"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={item.thumbnail_url || item.project_thumbnail || '/logo.webp'}
                alt={item.project_title_ar || item.project_title_en || 'Project landing'}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/25 to-transparent" />
              <div className="absolute right-5 top-5">
                <ProjectLandingStatusBadge status={item.status} />
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{item.project_slug}</p>
                <h3 className="text-2xl font-bold text-white">{item.project_title_ar}</h3>
                <p className="text-sm text-white/45">{item.project_title_en}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/project-land-edit/${item.project_id}` as any}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
                >
                  <Pencil className="h-4 w-4" />
                  تعديل
                </Link>
                <a
                  href={item.project_slug === 'qomor-renders' ? '/ar/qomor-renders' : `/ar/projects/${item.project_slug}/land`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white/70 transition hover:border-gold/30 hover:text-gold"
                >
                  <Globe className="h-4 w-4" />
                  معاينة
                </a>
                <button
                  type="button"
                  onClick={() => handleArchive(item.project_id)}
                  disabled={archivingId === item.project_id}
                  className="inline-flex items-center gap-2 rounded-full border border-red-400/18 bg-red-400/8 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-red-300 transition hover:bg-red-400/14 disabled:opacity-60"
                >
                  {archivingId === item.project_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  أرشفة
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
