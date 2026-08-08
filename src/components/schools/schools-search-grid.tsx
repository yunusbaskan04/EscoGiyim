'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, GraduationCap, ArrowRight, Shirt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface SchoolItemData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  productCount: number;
}

interface SchoolsSearchGridProps {
  schools: SchoolItemData[];
}

export function SchoolsSearchGrid({ schools }: SchoolsSearchGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSchools = React.useMemo(() => {
    if (!searchQuery.trim()) return schools;
    const q = searchQuery.toLowerCase().trim();
    return schools.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
    );
  }, [schools, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Okul adı veya bölge ara (örn: Atatürk Anadolu Lisesi)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 h-12 text-base rounded-2xl border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
        <span>Toplam {filteredSchools.length} okul gösteriliyor</span>
        {searchQuery && <span>&quot;{searchQuery}&quot; için sonuçlar</span>}
      </div>

      {/* Responsive Grid */}
      {filteredSchools.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">Aramanıza Uygun Okul Bulunamadı</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Farklı bir arama terimi deneyebilir veya aradığınız okul listede yoksa doğrudan bize sorabilirsiniz.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs font-semibold">
            Tüm Okulları Göster
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school) => (
            <Card
              key={school.id}
              className="group flex flex-col justify-between overflow-hidden border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 h-full"
            >
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden shrink-0">
                <Image
                  src={
                    school.logoUrl ||
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={school.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <Badge variant="amber" className="shadow-md font-bold gap-1">
                    <Shirt className="h-3.5 w-3.5" />
                    <span>{school.productCount} Kıyafet Çeşidi</span>
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-2 min-h-[3.25rem]">
                    {school.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2.25rem]">
                    {school.description || 'Resmi okul üniformaları, polo tişörtler, eşofman takımları ve sweatshirt modelleri.'}
                  </p>
                </div>

                <Link href={`/schools/${school.slug}`} className="block pt-2 mt-auto">
                  <Button
                    variant="primary"
                    className="w-full justify-between font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition"
                  >
                    <span>Üniformaları İncele</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
