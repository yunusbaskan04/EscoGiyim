import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { History, Shield, Activity } from 'lucide-react';

export const revalidate = 0;

export default async function AdminActivityLogsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const logs = await safeQuery(
    () =>
      db.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    []
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white flex items-center gap-2">
          <History className="h-7 w-7 text-amber-500" />
          <span>Güvenlik & İşlem Logları (Audit Logs)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Yönetici tarafından gerçekleştirilen tüm ekleme, silme, güncelleme ve oturum işlemleri.</p>
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <Shield className="mx-auto h-12 w-12 text-slate-600" />
          <p className="font-semibold text-sm">Henüz kayıtlı işlem logu bulunmuyor.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl divide-y divide-slate-800">
          <div className="bg-slate-950 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 grid grid-cols-12 gap-4">
            <span className="col-span-2">İşlem Türü</span>
            <span className="col-span-2">Varlık (Entity)</span>
            <span className="col-span-5">Açıklama / Detay</span>
            <span className="col-span-3 text-right">Tarih</span>
          </div>

          {logs.map((log) => (
            <div key={log.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center text-xs hover:bg-slate-800/40 transition">
              <div className="col-span-2">
                <Badge
                  variant={
                    log.action === 'CREATE'
                      ? 'success'
                      : log.action === 'DELETE' || log.action === 'SOFT_DELETE'
                      ? 'danger'
                      : 'amber'
                  }
                  className="font-bold text-[10px]"
                >
                  {log.action}
                </Badge>
              </div>

              <div className="col-span-2 font-semibold text-slate-200 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-amber-400" />
                <span>{log.entityType}</span>
              </div>

              <div className="col-span-5 text-slate-300 truncate">
                {log.details || '—'}
              </div>

              <div className="col-span-3 text-right text-[11px] text-slate-400 font-mono">
                {formatDate(log.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
