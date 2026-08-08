import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { AnnouncementsManager, AnnouncementAdminItem } from '@/components/admin/announcements-manager';
import { AnnouncementStatus } from '@/types/enums';

export const revalidate = 0;

export default async function AdminAnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const itemsDb = await safeQuery(
    () =>
      db.announcement.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    []
  );

  const announcements: AnnouncementAdminItem[] = itemsDb.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    status: a.status as AnnouncementStatus,
    sortOrder: a.sortOrder,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white">Duyuru Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">Ana sayfa tepesinde görüntülenecek duyuru ve haberleri yönetin.</p>
      </div>

      <AnnouncementsManager announcements={announcements} />
    </div>
  );
}
