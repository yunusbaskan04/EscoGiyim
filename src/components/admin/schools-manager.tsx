'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createSchool,
  updateSchool,
  softDeleteSchool,
  restoreSchool,
  updateSchoolSortOrder,
} from '@/features/schools/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Upload,
  Search,
  CheckCircle2,
  X,
  Shirt,
  Loader2,
} from 'lucide-react';

export interface SchoolAdminItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  productCount: number;
}

interface SchoolsManagerProps {
  schools: SchoolAdminItem[];
}

export function SchoolsManager({ schools: initialSchools }: SchoolsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [schools, setSchools] = React.useState(initialSchools);
  const [showTrash, setShowTrash] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSchool, setEditingSchool] = React.useState<SchoolAdminItem | null>(null);

  // Form states
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);

  React.useEffect(() => {
    setSchools(initialSchools);
  }, [initialSchools]);

  // Open modal automatically if URL has ?action=new
  React.useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingSchool(null);
    setName('');
    setDescription('');
    setLogoUrl('');
    setSortOrder(schools.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (school: SchoolAdminItem) => {
    setEditingSchool(school);
    setName(school.name);
    setDescription(school.description || '');
    setLogoUrl(school.logoUrl || '');
    setSortOrder(school.sortOrder);
    setIsActive(school.isActive);
    setIsModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'schools');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setLogoUrl(data.url);
      } else {
        alert(data.error || 'Logo yükleme başarısız.');
      }
    } catch {
      alert('Logo yüklenirken bir hata oluştu.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('logoUrl', logoUrl);
      formData.append('sortOrder', sortOrder.toString());
      formData.append('isActive', isActive.toString());

      if (editingSchool) {
        await updateSchool(editingSchool.id, formData);
      } else {
        await createSchool(formData);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'İşlem başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string, schoolName: string) => {
    if (!confirm(`"${schoolName}" okulunu silmek istediğinizden emin misiniz? (Çöp kutusuna taşınacaktır)`)) return;
    try {
      await softDeleteSchool(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreSchool(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMoveRank = async (index: number, direction: 'up' | 'down') => {
    const activeSchools = schools.filter((s) => s.isDeleted === showTrash);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeSchools.length) return;

    const newArr = [...activeSchools];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;

    const payload = newArr.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    try {
      await updateSchoolSortOrder(payload);
      router.refresh();
    } catch (err: any) {
      alert('Sıralama güncellenemedi: ' + err.message);
    }
  };

  const filteredSchools = schools.filter((s) => {
    const matchesDeleted = showTrash ? s.isDeleted : !s.isDeleted;
    const matchesSearch =
      !searchQuery.trim() || s.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesDeleted && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Okul adı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showTrash ? 'secondary' : 'outline'}
            onClick={() => setShowTrash(!showTrash)}
            className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs font-semibold gap-2"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
            <span>{showTrash ? 'Aktif Okulları Göster' : 'Çöp Kutusu'}</span>
          </Button>

          <Button
            onClick={openCreateModal}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Okul Ekle</span>
          </Button>
        </div>
      </div>

      {/* List / Cards */}
      {filteredSchools.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-600" />
          <p className="font-semibold text-sm">
            {showTrash ? 'Çöp kutusunda okul bulunmuyor.' : 'Kayıtlı okul bulunamadı.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school, index) => (
            <Card key={school.id} className="bg-slate-900 border-slate-800 text-white overflow-hidden flex flex-col justify-between">
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                <Image
                  src={
                    school.logoUrl ||
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={school.name}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={school.isActive ? 'success' : 'danger'}>
                    {school.isActive ? 'Yayında' : 'Pasif'}
                  </Badge>
                  {school.isDeleted && <Badge variant="danger">Silindi (Çöp)</Badge>}
                </div>
                <div className="absolute top-3 right-3 bg-slate-950/80 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-800">
                  Sıra #{school.sortOrder}
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-serif text-white">{school.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {school.description || 'Açıklama girilmemiş.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
                    <Shirt className="h-3.5 w-3.5" />
                    <span>{school.productCount} Adet Okul Forması Kayıtlı</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  {!school.isDeleted ? (
                    <>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveRank(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp className="h-4 w-4 text-slate-300" />
                        </button>
                        <button
                          onClick={() => handleMoveRank(index, 'down')}
                          disabled={index === filteredSchools.length - 1}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown className="h-4 w-4 text-slate-300" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(school)}
                          className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold gap-1"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                          <span>Düzenle</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleSoftDelete(school.id, school.name)}
                          className="text-xs font-semibold p-2"
                          title="Sil (Çöp kutusu)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRestore(school.id)}
                      className="w-full text-xs font-semibold gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Okulu Geri Yükle</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog Form for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-white">
                {editingSchool ? 'Okulu Düzenle' : 'Yeni Okul Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Okul Adı *</label>
                <Input
                  required
                  placeholder="örn: Pendik Atatürk Anadolu Lisesi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Açıklama</label>
                <textarea
                  rows={3}
                  placeholder="Okul hakkında kısa bilgi, bina veya vizyon özeti..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              {/* Logo Picker */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Okul Logosu / Bina Görseli</label>
                <div className="flex items-center gap-3">
                  {logoUrl && (
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <Image src={logoUrl} alt="Logo preview" fill className="object-cover" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-950 p-3 hover:border-amber-500 transition text-slate-300 font-medium">
                    {uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    ) : (
                      <Upload className="h-4 w-4 text-amber-500" />
                    )}
                    <span>{logoUrl ? 'Görseli Değiştir' : 'Logo Yükle'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Sıralama Numarası</label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value || '0', 10))}
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Yayın Durumu</label>
                  <select
                    value={isActive.toString()}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    <option value="true">Yayında (Aktif)</option>
                    <option value="false">Taslak (Pasif)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400">
                  İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
                  {loading ? 'Kaydediliyor...' : editingSchool ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
