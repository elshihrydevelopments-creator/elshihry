import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { ToastProvider } from '@/components/admin/ToastProvider';

const ibmPlex = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: ['300', '400', '500', '700'] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // We use arabic font for dashboard
  return (
    <div dir="rtl" className={`min-h-screen bg-rich-black text-white ${ibmPlex.className}`}>
      <ToastProvider>
        {/* We only render Sidebar if not on login page, but since layout applies to /admin, we will handle login page separately or check pathname. 
            Wait, we can't easily check pathname in server component layout without headers(). 
            Instead, we can put standard Admin content inside an inner shell. */}
        {children}
      </ToastProvider>
    </div>
  );
}
