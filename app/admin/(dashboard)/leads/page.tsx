import { Users } from 'lucide-react';

import { LeadsManager } from '@/components/admin/leads/LeadsManager';

export default function AdminLeadsPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">العملاء</h1>
            <p className="mt-0.5 text-sm text-white/40">تجميع كل leads المرتبطة بصفحات الهبوط مع تحديثات فورية</p>
          </div>
        </div>

        <div className="my-10 h-px bg-white/5" />
        <LeadsManager />
      </div>
    </div>
  );
}
