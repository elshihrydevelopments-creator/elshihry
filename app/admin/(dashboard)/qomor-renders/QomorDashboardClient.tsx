'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Diamond, LayoutTemplate, Users, Rocket, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { seedQomorRendersProject } from './actions';

interface QomorDashboardClientProps {
  projectExists: boolean;
  leadsCount: number;
  projectId: string | null;
}

export function QomorDashboardClient({ projectExists, leadsCount, projectId }: QomorDashboardClientProps) {
  const router = useRouter();
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsDeploying(true);
    setError(null);
    try {
      const result = await seedQomorRendersProject();
      if (!result.success) {
        setError(result.error || 'حدث خطأ غير متوقع');
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم.');
    } finally {
      setIsDeploying(false);
    }
  };

  if (!projectExists) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gold/5 border border-gold/20 shadow-[0_0_50px_rgba(241,213,130,0.15)]">
          <Diamond className="h-12 w-12 text-gold animate-pulse" />
        </div>
        <h1 className="mb-4 text-3xl font-extralight text-white md:text-5xl">مشروع قمر ريندرز</h1>
        <p className="mx-auto mb-10 max-w-lg text-sm leading-7 text-white/60 md:text-base">
          هذا المشروع الاستثنائي غير مدرج في قاعدة البيانات حالياً. اضغط على الزر أدناه ليتم زراعة كافة البيانات الأولية وإعداد صفحة الهبوط الخاصة به تلقائياً.
        </p>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={isDeploying}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-rich-black transition-all hover:scale-105 hover:bg-white disabled:opacity-70 disabled:hover:scale-100"
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>جاري إطلاق المشروع...</span>
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              <span>إطلاق وإعداد المشروع الآن</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold border border-gold/20">
            <Diamond className="h-3 w-3" /> المشروع الأهم
          </span>
          <h1 className="text-3xl font-extralight text-white md:text-4xl">قمر ريندرز</h1>
          <p className="mt-2 text-sm text-white/50">لوحة التحكم الحصرية والمباشرة لإدارة تفاصيل المشروع الأهم للشركة.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link 
          href={`/admin/project-land-edit/${projectId}`}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-gold/30 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(241,213,130,0.1)]"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-transform group-hover:scale-110">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white">تعديل صفحة الهبوط</h2>
          <p className="text-sm text-white/60">تحكم بالكامل في نصوص، صور، فيديو الهيرو، وجميع أقسام صفحة Qomor Renders الجذابة.</p>
          <div className="mt-6 flex items-center text-xs font-bold text-gold">
            <span>الدخول للمحرر</span>
            <ArrowLeft className="ml-1 h-3 w-3 transition-transform group-hover:-translate-x-1" />
          </div>
        </Link>

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white">العملاء المحتملين (Leads)</h2>
          <p className="text-sm text-white/60">أشخاص قاموا بتسجيل بياناتهم خصيصاً في صفحة قمر ريندرز.</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-end gap-2 text-3xl font-light text-white">
              {leadsCount} <span className="mb-1 text-xs text-white/40">عميل جديد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
