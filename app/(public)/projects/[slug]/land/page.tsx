import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DefaultProjectLandingRedirect({ params }: PageProps) {
  const { slug } = await params;
  if (slug === 'qomor-renders') {
    redirect('/ar/qomor-renders');
  }
  redirect(`/ar/projects/${slug}/land`);
}
