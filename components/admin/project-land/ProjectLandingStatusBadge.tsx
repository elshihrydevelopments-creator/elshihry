'use client';

import { cn } from '@/lib/utils';
import type { ProjectLandingStatus } from '@/lib/project-landings/types';

export function ProjectLandingStatusBadge({
  status,
}: {
  status: ProjectLandingStatus;
}) {
  const labels: Record<ProjectLandingStatus, string> = {
    archived: 'مؤرشف',
    draft: 'مسودة',
    published: 'منشور',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em]',
        status === 'published' && 'bg-emerald-400/15 text-emerald-300',
        status === 'draft' && 'bg-amber-400/15 text-amber-300',
        status === 'archived' && 'bg-white/10 text-white/55'
      )}
    >
      {labels[status]}
    </span>
  );
}
