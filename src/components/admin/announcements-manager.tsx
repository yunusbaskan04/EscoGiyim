'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AnnouncementStatus } from '@/types/enums';
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/features/announcements/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone, Plus, Edit2, Trash2, X } from 'lucide-react';

export interface AnnouncementAdminItem {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  sortOrder: number;
}

interface AnnouncementsManagerProps {
  announcements: AnnouncementAdminItem[];
}

export function AnnouncementsManager({ announcements }: AnnouncementsManagerProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AnnouncementAdminItem | null>(null);

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [status, setStatus] = React.useState<AnnouncementStatus>(AnnouncementStatus.PUBLISHED);
  const [sortOrder, setSortOrder] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setStatus(AnnouncementStatus.PUBLISHED);
    setSortOrder(announcements.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AnnouncementAdminItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setStatus(item.status);
    setSortOrder(item.sortOrder);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      if (editingItem) {
        await updateAnnouncement(editingItem.id, {
          title,
          content,
          status,
          sortOrder,
        });
      } else {
        await createAnnouncement({
          title,
          content,
          status,
          sortOrder,
        });
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'İşlem başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, t: string) => {
    if (!confirm(`"${t}" duyurusunu silmek istediğinizden emin misiniz?`)) return;
    try {
      await deleteAnnouncement(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold gap-2 text-xs">
          <Plus className="h-4 w-4" />
          <span>Yeni Duyuru Oluştur</span>
        </Button>
      </div>

      {announcements.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <Megaphone className="mx-auto h-12 w-12 text-slate-600" />
          <p className="font-semibold text-sm">Kayıtlı duyuru bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <Card key={item.id} className="bg-slate-900 border-slate-800 text-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === 'PUBLISHED'
                          ? 'success'
                          : item.status === 'DRAFT'
                          ? 'amber'
                          : 'danger'
                      }
                    >
                      {item.status}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">Sıra #{item.sortOrder}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(item)}
                    className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold p-2"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-xs font-semibold p-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-white">
                {editingItem ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Duyuru Başlığı *</label>
                <Input
                  required
                  placeholder="örn: 2026-2027 Okul Sezonu Formalarımız Stoklarımızda!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Duyuru İçeriği *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Site tepesinde görünecek duyuru metni..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Yayın Durumu (Enum)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AnnouncementStatus)}
                    className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-white focus:ring-amber-500 text-xs"
                  >
                    <option value={AnnouncementStatus.PUBLISHED}>PUBLISHED (Yayında)</option>
                    <option value={AnnouncementStatus.DRAFT}>DRAFT (Taslak)</option>
                    <option value={AnnouncementStatus.ARCHIVED}>ARCHIVED (Arşivlendi)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Sıra Numarası</label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value || '0', 10))}
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400">
                  İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
                  {loading ? 'Kaydediliyor...' : editingItem ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
