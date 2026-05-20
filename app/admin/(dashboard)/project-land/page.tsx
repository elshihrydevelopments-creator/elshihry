import { LayoutTemplate } from 'lucide-react';

import { ProjectLandingsManager } from '@/components/admin/project-land/ProjectLandingsManager';

export default function ProjectLandingsPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
            <LayoutTemplate className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">صفحات الهبوط</h1>
            <p className="mt-0.5 text-sm text-white/40">إدارة صفحات الهبوط المرتبطة بكل مشروع ومتابعة حالتها</p>
          </div>
        </div>

        <div className="my-10 h-px bg-white/5" />
        <ProjectLandingsManager />
      </div>
    </div>
  );
}
