import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GalleryCategory, AnnouncementStatus } from '@/types/enums';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@escogiyim.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminEscoGiyim2026!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Admin
    await db.admin.upsert({
      where: { email: adminEmail },
      update: { passwordHash: hashedPassword },
      create: {
        email: adminEmail,
        name: 'Esco Giyim Yönetici',
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Site Settings
    await db.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        businessName: 'Esco Giyim Terzilik & Okul Kıyafetleri',
        instagramUrl: 'https://instagram.com/escogiyim',
        facebookUrl: 'https://facebook.com/escogiyim',
        heroTitle: 'Esco Giyim Terzilik & Resmi Okul Kıyafetleri',
        aboutTitle: 'Esco Giyim Kalitesi ve Usta İşçilik',
        aboutContent: 'Esco Giyim Terzilik olarak uzun yıllardır Pendik ve çevresindeki seçkin okullara özel dikim ve hazır seri okul üniformaları temin etmekteyiz. Çocuğunuzun gün boyu hareket özgürlüğünü kısıtlamayan, anti-alerjik ve yıkamaya dayanıklı kumaşlarımızla okul sezonuna hazırız.',
      },
      create: {
        id: 'default',
        businessName: 'Esco Giyim Terzilik & Okul Kıyafetleri',
        phone: '+90 532 123 45 67',
        whatsapp: '905321234567',
        address: 'Fevzi Çakmak Mah. İstanbul Cad. No:42/A, Pendik / İstanbul',
        mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.286392!2d29.231211!3d40.880412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDUyJzE5LjUiTiAyOcKwMTMnNTIuMyJF!5e0!3m2!1str!2str!4v1620000000000',
        instagramUrl: 'https://instagram.com/escogiyim',
        facebookUrl: 'https://facebook.com/escogiyim',
        workingHours: 'Pazartesi - Cumartesi: 08:30 - 19:30 | Pazar: Kapalı',
        heroTitle: 'Esco Giyim Terzilik & Resmi Okul Kıyafetleri',
        heroSubtitle: '30 yılı aşkın terzilik tecrübemiz ve kaliteli kumaş seçimlerimizle resmi okul kıyafetlerinde şıklığı ve dayanıklılığı bir arada sunuyoruz.',
        aboutTitle: 'Esco Giyim Kalitesi ve Usta İşçilik',
        aboutContent: 'Esco Giyim Terzilik olarak uzun yıllardır Pendik ve çevresindeki seçkin okullara özel dikim ve hazır seri okul üniformaları temin etmekteyiz. Çocuğunuzun gün boyu hareket özgürlüğünü kısıtlamayan, anti-alerjik ve yıkamaya dayanıklı kumaşlarımızla okul sezonuna hazırız.',
      },
    });

    // Check existing schools count
    const count = await db.school.count();
    if (count === 0) {
      await db.school.create({
        data: {
          name: 'Atatürk Anadolu Lisesi',
          slug: 'ataturk-anadolu-lisesi',
          logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&auto=format&fit=crop&q=80',
          description: 'Atatürk Anadolu Lisesi resmi kız ve erkek öğrenci kıyafetleri.',
          products: {
            create: [
              {
                name: 'Kısa Kollu Polo Yaka Tişört',
                slug: 'ataturk-al-polo-tisort',
                description: '%100 Pamuklu lakost kumaş, nakışlı göğüs logosu.',
                images: {
                  create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', isCover: true },
                  ],
                },
                sizes: {
                  create: [
                    { name: 'S', sortOrder: 1 },
                    { name: 'M', sortOrder: 2 },
                    { name: 'L', sortOrder: 3 },
                    { name: 'XL', sortOrder: 4 },
                  ],
                },
              },
            ],
          },
        },
      });
    }

    return NextResponse.json({ message: 'Veritabanı başarıyla tohumlandı.', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
