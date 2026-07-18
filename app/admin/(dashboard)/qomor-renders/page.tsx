import { createClient } from '@/lib/supabase/server';
import { QomorDashboardClient } from './QomorDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إدارة قمر ريندرز - El Shihry Admin',
};

// Force dynamic because we are reading live DB state
export const dynamic = 'force-dynamic';

export default async function QomorRendersAdminPage() {
  const supabase = await createClient();

  // 1. Check if the project exists
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', 'qomor-renders')
    .single();

  const projectExists = !!project;

  // 2. Count leads originating from this specific landing page
  let leadsCount = 0;
  if (projectExists) {
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .like('landing_page_path', '%qomor-renders%');
      
    leadsCount = count || 0;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">
      <QomorDashboardClient 
        projectExists={projectExists} 
        leadsCount={leadsCount} 
        projectId={project?.id || null}
      />
    </div>
  );
}
