import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // If not logged in and not on login page, NextAuth middleware or session check redirects to /admin/login
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {session ? (
        <div className="flex flex-col md:flex-row min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1 w-full min-w-0 overflow-y-auto bg-slate-950 p-4 sm:p-6 md:p-10">
            {children}
          </main>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  );
}
