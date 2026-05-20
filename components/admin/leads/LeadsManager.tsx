'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useToast } from '@/components/admin/ToastProvider';
import { subscribeToLeadsRealtime } from '@/lib/project-landings/realtime';
import type { LeadStatus, ProjectLeadRecord } from '@/lib/project-landings/types';

const LEAD_STATUS_OPTIONS: Array<{ label: string; value: LeadStatus }> = [
  { label: 'جديد', value: 'new' },
  { label: 'تم التواصل', value: 'contacted' },
  { label: 'مؤهل', value: 'qualified' },
  { label: 'مغلق', value: 'closed' },
  { label: 'Spam', value: 'spam' },
];

export function LeadsManager() {
  const [items, setItems] = useState<ProjectLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/leads');
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to load leads');
      }

      setItems(json.data || []);
    } catch (error: any) {
      toast(error.message || 'تعذر تحميل العملاء', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => subscribeToLeadsRealtime(() => void loadItems()), [loadItems]);

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    setUpdatingLeadId(leadId);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to update lead status');
      }

      setItems((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
    } catch (error: any) {
      toast(error.message || 'تعذر تحديث حالة العميل', 'error');
    } finally {
      setUpdatingLeadId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2.4rem] border border-white/8 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-white/[0.03] text-white/55">
            <tr>
              <th className="px-5 py-4 text-right font-bold">العميل</th>
              <th className="px-5 py-4 text-right font-bold">التواصل</th>
              <th className="px-5 py-4 text-right font-bold">المشروع</th>
              <th className="px-5 py-4 text-right font-bold">وقت الإرسال</th>
              <th className="px-5 py-4 text-right font-bold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/6">
                <td className="px-5 py-4 align-top">
                  <p className="font-semibold text-white">{item.full_name}</p>
                  {item.message ? <p className="mt-2 max-w-sm text-xs leading-6 text-white/45">{item.message}</p> : null}
                </td>
                <td className="px-5 py-4 align-top">
                  <p dir="ltr">{item.phone}</p>
                  {item.whatsapp_number ? <p dir="ltr" className="mt-1 text-emerald-300/80">WhatsApp: {item.whatsapp_number}</p> : null}
                  {item.email ? <p dir="ltr" className="mt-1 text-white/45">{item.email}</p> : null}
                </td>
                <td className="px-5 py-4 align-top">
                  <p>{item.project_title}</p>
                  <p className="mt-1 text-xs font-mono text-white/40">{item.project_slug}</p>
                </td>
                <td className="px-5 py-4 align-top text-white/60">
                  {new Date(item.created_at).toLocaleString('en-GB')}
                </td>
                <td className="px-5 py-4 align-top">
                  <select
                    disabled={updatingLeadId === item.id}
                    value={item.status}
                    onChange={(event) => handleStatusChange(item.id, event.target.value as LeadStatus)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none"
                  >
                    {LEAD_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-rich-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
