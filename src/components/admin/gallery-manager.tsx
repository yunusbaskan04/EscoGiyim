'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GalleryCategory } from '@/types/enums';
import { createGalleryImage, deleteGalleryImage } from '@/features/gallery/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Plus, Trash2, Upload, Loader2, X } from 'lucide-react';

export interface GalleryAdminItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  sortOrder: number;
}

interface GalleryManagerProps {
  images: GalleryAdminItem[];
}

export function GalleryManager({ images }: GalleryManagerProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<GalleryCategory>(GalleryCategory.STORE);
  const [imageUrl, setImageUrl] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'gallery');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Yükleme hatası.');
      }
    } catch {
      alert('Fotoğraf yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    setLoading(true);
    try {
      await createGalleryImage({
        title,
        category,
        imageUrl,
        sortOrder,
      });

      setIsModalOpen(false);
      setTitle('');
      setImageUrl('');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Kayıt hatası.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`"${itemTitle}" fotoğrafını silmek istediğinizden emin misiniz?`)) return;
    try {
      await deleteGalleryImage(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setTitle('');
            setImageUrl('');
            setSortOrder(images.length + 1);
            setIsModalOpen(true);
          }}
          className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold gap-2 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Fotoğraf Yükle</span>
        </Button>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <Camera className="mx-auto h-12 w-12 text-slate-600" />
          <p className="font-semibold text-sm">Galeride kayıtlı fotoğraf bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="bg-slate-900 border-slate-800 text-white overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <Image src={img.imageUrl} alt={img.title} fill className="object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge variant="amber" className="text-[10px] font-bold">
                    {img.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold truncate text-slate-200">{img.title}</span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(img.id, img.title)}
                  className="p-1.5 h-8 w-8"
                  title="Fotoğrafı Sil"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-white">Galeriye Fotoğraf Ekle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Fotoğraf Başlığı *</label>
                <Input
                  required
                  placeholder="örn: Atölye Dikiş Masası"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Kategori (Enum) *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                  className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-white focus:ring-amber-500 text-xs"
                >
                  <option value={GalleryCategory.STORE}>STORE (Mağazamız)</option>
                  <option value={GalleryCategory.PRODUCT}>PRODUCT (Ürünlarımız)</option>
                  <option value={GalleryCategory.TAILORING}>TAILORING (Terzilik & Atölye)</option>
                  <option value={GalleryCategory.OTHER}>OTHER (Diğer)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Görsel Yükle *</label>
                {imageUrl && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 hover:border-amber-500 transition text-slate-300 font-medium">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  ) : (
                    <Upload className="h-4 w-4 text-amber-500" />
                  )}
                  <span>{imageUrl ? 'Görseli Değiştir' : 'Fotoğraf Seç ve Yükle'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400">
                  İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
                  {loading ? 'Yükleniyor...' : 'Galeriye Ekle'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
