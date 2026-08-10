import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { SchoolsManager, SchoolAdminItem } from '@/components/admin/schools-manager';

export const revalidate = 0;

export default async function AdminSchoolsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const schoolsDb = await safeQuery(
    () =>
      db.school.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    []
  );

  const schools: SchoolAdminItem[] = schoolsDb.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logoUrl,
    description: s.description,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    isDeleted: s.isDeleted,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white">Okul Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">Okul ekleyin, düzenleyin, sırasını değiştirin veya logo yükleyin.</p>
      </div>

      <SchoolsManager schools={schools} />
    </div>
  );
}
