import { notFound, redirect } from 'next/navigation';

import { getProjectLandingByProjectId } from '@/lib/project-landings/queries';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectLandAliasPage({ params }: PageProps) {
  const { projectId } = await params;
  const landing = await getProjectLandingByProjectId(projectId);

  if (!landing || landing.landing.status !== 'published') {
    notFound();
  }

  redirect(`/ar/projects/${landing.project.slug}/land`);
}
