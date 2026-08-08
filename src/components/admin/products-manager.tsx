'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
} from '@/features/products/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shirt,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Upload,
  Search,
  CheckCircle2,
  X,
  Star,
  Loader2,
  GraduationCap,
  Tag,
} from 'lucide-react';

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
  products: ProductAdminItem[];
  schools: SchoolOption[];
}

export function ProductsManager({ products: initialProducts, schools }: ProductsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = React.useState(initialProducts);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showTrash, setShowTrash] = React.useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductAdminItem | null>(null);

  // Form Fields
  const [schoolId, setSchoolId] = React.useState('');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);
  
  // Normalized relations in form
  const [images, setImages] = React.useState<{ url: string; isCover: boolean; sortOrder: number }[]>([]);
  const [sizes, setSizes] = React.useState<{ name: string; sortOrder: number }[]>([]);
  const [newSizeInput, setNewSizeInput] = React.useState('');
  
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  React.useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [searchParams]);

  const presetSizes = ['6-7 Yaş', '8-9 Yaş', '10-11 Yaş', '12-13 Yaş', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'Özel Dikim'];

  const openCreateModal = () => {
    setEditingProduct(null);
    setSchoolId(schools[0]?.id || '');
    setName('');
    setDescription('');
    setSortOrder(products.length + 1);
    setIsActive(true);
    setImages([]);
    setSizes([
      { name: 'S', sortOrder: 1 },
      { name: 'M', sortOrder: 2 },
      { name: 'L', sortOrder: 3 },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductAdminItem) => {
    setEditingProduct(product);
    setSchoolId(product.schoolId);
    setName(product.name);
    setDescription(product.description || '');
    setSortOrder(product.sortOrder);
    setIsActive(product.isActive);
    setImages(product.images.map((img) => ({ url: img.url, isCover: img.isCover, sortOrder: img.sortOrder })));
    setSizes(product.sizes.map((sz) => ({ name: sz.name, sortOrder: sz.sortOrder })));
    setIsModalOpen(true);
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [
            ...prev,
            {
              url: data.url,
              isCover: prev.length === 0, // first image becomes cover automatically
              sortOrder: prev.length + 1,
            },
          ]);
        }
      }
    } catch {
      alert('Görsel yüklenirken hata oluştu.');
    } finally {
      setUploadingImage(false);
    }
  };

  const setCoverImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isCover: idx === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      // ensure at least one image is cover if available
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  // Size Tag Handlers
  const addSizeTag = (sizeName: string) => {
    const trimmed = sizeName.trim();
    if (!trimmed) return;
    if (sizes.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    setSizes((prev) => [...prev, { name: trimmed, sortOrder: prev.length + 1 }]);
    setNewSizeInput('');
  };

  const removeSizeTag = (sizeName: string) => {
    setSizes((prev) => prev.filter((s) => s.name !== sizeName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) {
      alert('Lütfen bir okul seçin.');
      return;
    }
    if (!name.trim()) return;

    setLoading(true);
    try {
      const formattedImages = images.map((img) => ({
        imageUrl: img.url,
        isCover: img.isCover,
        sortOrder: img.sortOrder,
      }));

      const payload = {
        schoolId,
        name: name.trim(),
        description: description.trim(),
        sortOrder,
        isActive,
        images: formattedImages,
        sizes,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string, productName: string) => {
    if (!confirm(`"${productName}" ürününü çöp kutusuna taşımak istediğinizden emin misiniz?`)) return;
    try {
      await softDeleteProduct(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreProduct(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesDeleted = showTrash ? p.isDeleted : !p.isDeleted;
    const matchesSchool = selectedSchoolFilter === 'ALL' || p.schoolId === selectedSchoolFilter;
    const matchesSearch =
      !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesDeleted && matchesSchool && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Filters & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* School Filter Dropdown */}
          <select
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white focus:ring-amber-500"
          >
            <option value="ALL">Tüm Okullar ({schools.length})</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Ürün adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showTrash ? 'secondary' : 'outline'}
            onClick={() => setShowTrash(!showTrash)}
            className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs font-semibold gap-2"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
            <span>{showTrash ? 'Aktif Ürünler' : 'Çöp Kutusu'}</span>
          </Button>

          <Button
            onClick={openCreateModal}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Üniforma Ekle</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <Shirt className="mx-auto h-12 w-12 text-slate-600" />
          <p className="font-semibold text-sm">
            {showTrash ? 'Çöp kutusunda ürün bulunmuyor.' : 'Kayıtlı ürün bulunamadı.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const coverImage = product.images.find((img) => img.isCover) || product.images[0];
            const displayUrl = coverImage
              ? coverImage.url
              : 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80';

            return (
              <Card key={product.id} className="bg-slate-900 border-slate-800 text-white overflow-hidden flex flex-col justify-between">
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <Image src={displayUrl} alt={product.name} fill className="object-cover opacity-90" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={product.isActive ? 'success' : 'danger'}>
                      {product.isActive ? 'Yayında' : 'Pasif'}
                    </Badge>
                    {product.isDeleted && <Badge variant="danger">Çöp</Badge>}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    {product.images.length} Görsel
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{product.schoolName}</span>
                    </div>

                    <h3 className="text-lg font-bold font-serif text-white">{product.name}</h3>

                    {/* Sizes preview */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.sizes.map((sz, idx) => (
                        <Badge key={idx} variant="amber" className="text-[10px]">
                          {sz.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    {!product.isDeleted ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(product)}
                          className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold gap-1"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                          <span>Düzenle</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleSoftDelete(product.id, product.name)}
                          className="text-xs font-semibold p-2"
                          title="Sil (Çöp)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleRestore(product.id)}
                        className="w-full text-xs font-semibold gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Ürünü Geri Yükle</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-white">
                {editingProduct ? 'Üniformayı Düzenle' : 'Yeni Okul Forması Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* School selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Ait Olduğu Okul *</label>
                <select
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-white focus:ring-amber-500 text-xs"
                >
                  <option value="">-- Okul Seçiniz --</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Kıyafet Adı *</label>
                <Input
                  required
                  placeholder="örn: Kısa Kollu Polo Yaka Tişört"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Ürün Açıklaması & Kumaş Özellikleri</label>
                <textarea
                  rows={3}
                  placeholder="%100 Pamuklu lakost kumaş, nakış amblemli göğüs logosu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              {/* Requirement #1: ProductImage Manager */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Ürün Fotoğrafları (Kapak Resmi Seçin)</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition">
                    {uploadingImage ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>Fotoğraf Ekle</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {images.length === 0 ? (
                  <p className="text-slate-500 italic">Henüz fotoğraf yüklenmedi.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950"
                      >
                        <Image src={img.url} alt="Product image" fill className="object-cover" />
                        
                        {/* Cover Image Toggle */}
                        <button
                          type="button"
                          onClick={() => setCoverImage(idx)}
                          className={`absolute top-1.5 left-1.5 p-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                            img.isCover ? 'bg-amber-500 text-slate-950' : 'bg-slate-950/80 text-slate-300'
                          }`}
                        >
                          <Star className="h-3 w-3 fill-current" />
                          <span>{img.isCover ? 'Kapak' : 'Kapak Yap'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600/80 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirement #2: ProductSize Manager */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="font-semibold text-slate-300">Mevcut Beden Yönetimi</label>
                
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Hızlı Beden Ekle:</span>
                  {presetSizes.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addSizeTag(preset)}
                      className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition font-medium text-[11px]"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Custom size input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Özel beden yazıp ekleyin (örn: 14-15 Yaş veya 3XL)..."
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 text-xs"
                  />
                  <Button
                    type="button"
                    onClick={() => addSizeTag(newSizeInput)}
                    className="bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
                  >
                    Ekle
                  </Button>
                </div>

                {/* Size Badges List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {sizes.map((sz) => (
                    <span
                      key={sz.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{sz.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSizeTag(sz.name)}
                        className="hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
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
                    className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-white focus:ring-amber-500 text-xs"
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
                  {loading ? 'Kaydediliyor...' : editingProduct ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
