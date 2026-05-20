import { createClient } from '@/lib/supabase/client';

export function subscribeToLeadsRealtime(onRefresh: () => void) {
  const supabase = createClient();
  const channel = supabase
    .channel('admin-leads-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'leads' },
      () => onRefresh()
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
