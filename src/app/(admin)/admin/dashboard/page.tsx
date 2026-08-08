import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Shirt,
  Camera,
  HelpCircle,
  Megaphone,
  Clock,
  History,
  ArrowRight,
  Plus,
  Activity,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }

  const [
    schoolsCount,
    productsCount,
    galleryCount,
    faqCount,
    announcementCount,
    latestProduct,
    latestSchool,
    recentLogs,
  ] = await Promise.all([
    safeQuery(() => db.school.count({ where: { isDeleted: false } }), 0),
    safeQuery(() => db.product.count({ where: { isDeleted: false } }), 0),
    safeQuery(() => db.galleryImage.count(), 0),
    safeQuery(() => db.faqItem.count(), 0),
    safeQuery(() => db.announcement.count(), 0),
    safeQuery(() => db.product.findFirst({ orderBy: { updatedAt: 'desc' } }), null),
    safeQuery(() => db.school.findFirst({ orderBy: { updatedAt: 'desc' } }), null),
    safeQuery(() => db.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }), []),
  ]);

  const lastUpdated = latestProduct?.updatedAt || latestSchool?.updatedAt || new Date();

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Yönetici Paneli Özet</h1>
          <p className="text-xs text-slate-400 mt-1">Esco Giyim Okul Kıyafetleri ve Site İçerik Yönetimi</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <Clock className="h-4 w-4" />
          <span suppressHydrationWarning>Son Güncelleme: {formatDate(lastUpdated)}</span>
        </div>
      </div>

      {/* Counter Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Schools Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Okul Sayısı</span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-extrabold font-serif text-white">{schoolsCount}</span>
            <Link href="/admin/schools">
              <Button size="sm" variant="ghost" className="text-xs text-amber-400 hover:text-amber-300 gap-1 p-0">
                <span>Yönet</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Okul Üniforması</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shirt className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-extrabold font-serif text-white">{productsCount}</span>
            <Link href="/admin/products">
              <Button size="sm" variant="ghost" className="text-xs text-emerald-400 hover:text-emerald-300 gap-1 p-0">
                <span>Yönet</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQs & Announcements Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">S.S.S & Duyurular</span>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-extrabold font-serif text-white">{faqCount + announcementCount}</span>
            <Link href="/admin/faq">
              <Button size="sm" variant="ghost" className="text-xs text-purple-400 hover:text-purple-300 gap-1 p-0">
                <span>İncele</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-amber-500" />
          <span>Hızlı İşlemler</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/admin/schools?action=new">
            <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-amber-400 gap-2 h-12 text-xs font-semibold">
              <GraduationCap className="h-4 w-4 text-amber-500" />
              <span>Yeni Okul Ekle</span>
            </Button>
          </Link>

          <Link href="/admin/products?action=new">
            <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-amber-400 gap-2 h-12 text-xs font-semibold">
              <Shirt className="h-4 w-4 text-emerald-500" />
              <span>Yeni Üniforma Ekle</span>
            </Button>
          </Link>

          <Link href="/admin/announcements?action=new">
            <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-amber-400 gap-2 h-12 text-xs font-semibold">
              <Megaphone className="h-4 w-4 text-purple-500" />
              <span>Duyuru Yayınla</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Activity Logs Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-500" />
            <span>Son İşlem ve Güvenlik Logları</span>
          </h2>
          <Link href="/admin/activity-logs" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
            <History className="h-3.5 w-3.5" />
            <span>Tüm Log Akışını Gör</span>
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
            Henüz işlem kaydı oluşturulmamıştır.
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-lg">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-3">
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
                  <span className="font-semibold text-slate-200">{log.entityType}</span>
                  {log.details && <span className="text-slate-400 hidden sm:inline">— {log.details}</span>}
                </div>
                <span className="text-[11px] text-slate-500">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
