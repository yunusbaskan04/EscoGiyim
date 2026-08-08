import Link from 'next/link';
import { Scissors, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-2xl">
          <Scissors className="h-10 w-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-black font-serif text-amber-500 tracking-widest block">404</span>
          <h1 className="text-2xl font-bold font-serif text-white">Sayfa Bulunamadı</h1>
          <p className="text-sm text-slate-300">
            Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak erişilemiyor olabilir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold gap-2">
              <Home className="h-4 w-4" />
              <span>Ana Sayfaya Dön</span>
            </Button>
          </Link>
          <Link href="/schools" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Okul Kataloğuna Git</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
