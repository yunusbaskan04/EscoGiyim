'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createFaqItem, updateFaqItem, deleteFaqItem } from '@/features/faq/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Plus, Edit2, Trash2, X } from 'lucide-react';

export interface FaqAdminItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isPublished: boolean;
}

interface FaqManagerProps {
  faqs: FaqAdminItem[];
}

export function FaqManager({ faqs }: FaqManagerProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingFaq, setEditingFaq] = React.useState<FaqAdminItem | null>(null);

  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [category, setCategory] = React.useState('Genel');
  const [sortOrder, setSortOrder] = React.useState(0);
  const [isPublished, setIsPublished] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('Genel');
    setSortOrder(faqs.length + 1);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqAdminItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'Genel');
    setSortOrder(faq.sortOrder);
    setIsPublished(faq.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setLoading(true);
    try {
      if (editingFaq) {
        await updateFaqItem(editingFaq.id, {
          question,
          answer,
          category,
          sortOrder,
          isPublished,
        });
      } else {
        await createFaqItem({
          question,
          answer,
          category,
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

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`"${q}" sorusunu silmek istediğinizden emin misiniz?`)) return;
    try {
      await deleteFaqItem(id);
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
          <span>Yeni Soru Ekle</span>
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <HelpCircle className="mx-auto h-12 w-12 text-slate-600" />
          <p className="font-semibold text-sm">Kayıtlı S.S.S sorusu bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="bg-slate-900 border-slate-800 text-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={faq.isPublished ? 'success' : 'danger'}>
                      {faq.isPublished ? 'Yayında' : 'Pasif'}
                    </Badge>
                    <Badge variant="amber" className="text-[10px]">
                      {faq.category || 'Genel'}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">Sıra #{faq.sortOrder}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{faq.question}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(faq)}
                    className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold p-2"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(faq.id, faq.question)}
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
                {editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Soru Başlığı *</label>
                <Input
                  required
                  placeholder="örn: İnternet sitenizden doğrudan sipariş verebilir miyim?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Cevap İçeriği *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ayrıntılı anlaşılır yanıt..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Kategori</label>
                  <Input
                    placeholder="örn: Sipariş & İletişim"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Yayın Durumu</label>
                  <select
                    value={isPublished.toString()}
                    onChange={(e) => setIsPublished(e.target.value === 'true')}
                    className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-white focus:ring-amber-500 text-xs"
                  >
                    <option value="true">Yayında (Aktif)</option>
                    <option value="false">Gizli (Pasif)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400">
                  İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
                  {loading ? 'Kaydediliyor...' : editingFaq ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
