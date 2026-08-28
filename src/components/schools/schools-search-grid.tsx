'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, GraduationCap, Shirt, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/common/whatsapp-button';

export interface SchoolItemData {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  productCount?: number;
}

interface SchoolsSearchGridProps {
  schools: SchoolItemData[];
  whatsappNumber?: string;
}

export function SchoolsSearchGrid({ schools, whatsappNumber = '905323137837' }: SchoolsSearchGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSchools = React.useMemo(() => {
    if (!searchQuery.trim()) return schools;
    const q = searchQuery.toLowerCase().trim();
    return schools.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
    );
  }, [schools, searchQuery]);

  return (
    <div className="space-y-8 w-full">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Okul adı ara (örn: Selahaddin Eyyubi, Hikmet Kiler, Bitlis Lisesi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 h-13 text-sm sm:text-base rounded-2xl border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-lg"
            >
              Temizle
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-amber-500" />
            <span>Kıyafeti Tedarik Edilen Okullar</span>
          </span>
          <span>{filteredSchools.length} Okul Listeleniyor</span>
        </div>
      </div>

      {/* Responsive School Grid */}
      {filteredSchools.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">Aradığınız Okul Bulunamadı</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Aradığınız okul henüz listeye eklenmemiş olabilir. WhatsApp hattımızdan doğrudan sorabilirsiniz.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs font-semibold">
              Tüm Okul Listesini Göster
            </Button>
            <WhatsAppButton
              whatsappNumber={whatsappNumber}
              variant="medium"
              label="WhatsApp'tan Okul Sor"
              message={`Merhaba, Esco Giyim'de ${searchQuery} okulunun kıyafetleri mevcut mu?`}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSchools.map((school) => {
            const waMsg = `Merhaba, Esco Giyim web sitenizden ulaşıyorum. "${school.name}" resmi okul formaları hakkında bilgi ve beden danışmak istiyorum.`;

            return (
              <Card
                key={school.id}
                className="group flex flex-col justify-between overflow-hidden border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 bg-white"
              >
                {/* Photo header link */}
                <Link
                  href={`/schools/${school.slug}`}
                  className="block relative h-48 w-full bg-slate-100 overflow-hidden shrink-0 cursor-pointer"
                >
                  {school.logoUrl ? (
                    <Image
                      src={school.logoUrl}
                      alt={school.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <GraduationCap className="h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="amber" className="text-[10px] font-bold gap-1 shadow-md">
                      <GraduationCap className="h-3 w-3" />
                      <span>Resmi Forması Mevcut</span>
                    </Badge>
                  </div>
                </Link>

                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {!school.logoUrl && (
                      <div className="flex items-center justify-between">
                        <Badge variant="amber" className="text-[10px] font-bold gap-1">
                          <GraduationCap className="h-3 w-3" />
                          <span>Kıyafeti Mevcut</span>
                        </Badge>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Stokta
                        </span>
                      </div>
                    )}

                    <Link href={`/schools/${school.slug}`} className="block group-hover:text-amber-600 transition">
                      <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug line-clamp-2 min-h-[3rem]">
                        {school.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed min-h-[3rem]">
                      {school.name} resmi kız ve erkek öğrenci okul formaları stoklarımızda mevcuttur.
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Shirt className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>Selanik Kumaş Tişört & Sweatshirt</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Tüm Bedenler & Paça Tadilatı</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-auto space-y-2">
                    <Link
                      href={`/schools/${school.slug}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 transition shadow-sm"
                    >
                      <span>Okul Kıyafetlerini İncele</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 transition shadow-sm group-hover:shadow-md"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span>WhatsApp İle Sor / Sipariş Ver</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

