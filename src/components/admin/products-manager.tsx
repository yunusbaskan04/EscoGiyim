'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export interface ProductAdminItem {
  id: string;
  schoolId: string;
  schoolName: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  images: { id?: string; url: string; isCover: boolean; sortOrder: number }[];
  sizes: { id?: string; name: string; sortOrder: number }[];
}

export interface SchoolOption {
  id: string;
  name: string;
}

interface ProductsManagerProps {
  products?: ProductAdminItem[];
  schools?: SchoolOption[];
}

export function ProductsManager({ products, schools }: ProductsManagerProps) {
  return (
    <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-300 space-y-4 max-w-xl mx-auto my-12">
      <GraduationCap className="mx-auto h-12 w-12 text-amber-500" />
      <h2 className="text-xl font-bold font-serif text-white">Okul Listesi Yönetimi</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        Okul forması ürün fotoğrafları yerine veritabanındaki tüm anlaşmalı okullarımız "Okul Listesi Yönetimi" bölümünden doğrudan yönetilmektedir.
      </p>
      <Link href="/admin/schools" className="inline-block pt-2">
        <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
          Okul Listesi Yönetimine Git
        </Button>
      </Link>
    </div>
  );
}
