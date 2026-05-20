import { FilePenLine } from 'lucide-react';

import { ProjectLandingEditor } from '@/components/admin/project-land/ProjectLandingEditor';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectLandingEditorPage({ params }: PageProps) {
  const { projectId } = await params;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
            <FilePenLine className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">project-land-edit</h1>
            <p className="mt-0.5 text-sm text-white/40">تحرير تفصيلي لكل عناصر صفحة الهبوط مع دعم العربية والإنجليزية</p>
          </div>
        </div>

        <div className="my-10 h-px bg-white/5" />
        <ProjectLandingEditor projectId={projectId} />
      </div>
    </div>
  );
}
