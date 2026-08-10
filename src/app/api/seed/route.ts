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
        businessName: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
        phone: '+90 532 313 78 37',
        whatsapp: '905323137837',
        instagramUrl: 'https://instagram.com/escogiyimokul',
        facebookUrl: 'https://facebook.com/escogiyimokul',
        heroTitle: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
        aboutTitle: 'Esco Giyim Kalitesi ve Usta İşçilik',
        aboutContent: 'Esco Giyim olarak Bitlis ve çevresindeki seçkin okullara %100 pamuk Selanik kumaştan üretilen resmi okul üniformaları ve erkek giyim ürünleri temin etmekteyiz. Çocuğunuzun gün boyu hareket özgürlüğünü kısıtlamayan, anti-alerjik ve yıkamaya dayanıklı kumaşlarımızla hazırız.',
      },
      create: {
        id: 'default',
        businessName: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
        phone: '+90 532 313 78 37',
        whatsapp: '905323137837',
        address: 'ESCO GİYİM, Hüsrev Paşa, Çam sitesi İpek Apt. Altı, 13000 Bitlis Merkez / Bitlis',
        mapsEmbedUrl: 'https://www.google.com/maps/embed',
        instagramUrl: 'https://instagram.com/escogiyimokul',
        facebookUrl: 'https://facebook.com/escogiyimokul',
        workingHours: 'Pazartesi - Cumartesi: 08:30 - 19:30 | Pazar: Kapalı',
        heroTitle: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
        heroSubtitle: 'Kaliteli pamuk Selanik kumaş seçimlerimizle resmi okul kıyafetlerinde ve erkek giyimde şıklığı ve dayanıklılığı bir arada sunuyoruz.',
        aboutTitle: 'Esco Giyim Kalitesi ve Usta İşçilik',
        aboutContent: 'Esco Giyim olarak Bitlis ve çevresindeki seçkin okullara %100 pamuk Selanik kumaştan üretilen resmi okul üniformaları ve erkek giyim ürünleri temin etmekteyiz.',
      },
    });

    // Clear and populate flyer poster schools
    await db.school.deleteMany();

    const initialSchools = [
      {
        name: 'Ş.Ö.Ergin Komut İlkokulu',
        slug: 's-o-ergin-komut-ilkokulu',
        description: 'Resmi kız ve erkek öğrenci Selanik kumaş polo yaka tişört, kışlık sweatshirt ve ilkokul takımları.',
        sortOrder: 1,
      },
      {
        name: 'Ş.Hüsamettin Kandemir Ortaokulu',
        slug: 's-husamettin-kandemir-ortaokulu',
        description: 'Resmi onaylı nakış amblemli Selanik kumaş tişört, sweatshirt ve ortaokul eşofman takımı.',
        sortOrder: 2,
      },
      {
        name: 'Ş.Mahir Ayabak İlk & Ortaokulu',
        slug: 's-mahir-ayabak-ilk-ortaokulu',
        description: 'İlkokul ve ortaokul öğrencilerimiz için %100 pamuklu resmi renk kodlarında okul formaları.',
        sortOrder: 3,
      },
      {
        name: 'Ş.Mahir Ayabak İmam Hatip Ortaokulu',
        slug: 's-mahir-ayabak-imam-hatip-ortaokulu',
        description: 'Resmi İmam Hatip ortaokul amblemli Selanik kumaş tişört, sweatshirt ve okul kıyafetleri.',
        sortOrder: 4,
      },
      {
        name: 'Milli İrade İlk & Ortaokulu',
        slug: 'milli-irade-ilk-ortaokulu',
        description: 'Milli İrade ilkokul ve ortaokul resmi Selanik kumaş tişört ve kışlık eşofman takımı.',
        sortOrder: 5,
      },
      {
        name: 'T.O.B.B. İlkokulu',
        slug: 'tobb-ilkokulu',
        description: 'TOBB İlkokulu minik öğrencilerimiz için cilde dost terletmeyen anti-alerjik pamuklu okul formaları.',
        sortOrder: 6,
      },
      {
        name: 'Selahaddin Eyyubi Ortaokulu',
        slug: 'selahaddin-eyyubi-ortaokulu',
        description: 'Resmi amblemli Selanik dokuma polo yaka tişört, kışlık sweatshirt ve eşofman takımı.',
        sortOrder: 7,
      },
      {
        name: 'Ahmet Eren İlkokulu',
        slug: 'ahmet-eren-ilkokulu',
        description: 'Ahmet Eren İlkokulu kız ve erkek öğrenci pamuklu resmi polo tişört ve okul kıyafetleri.',
        sortOrder: 8,
      },
      {
        name: 'Zübeyde Hanım İlkokulu',
        slug: 'zubeyde-hanim-ilkokulu',
        description: 'Zübeyde Hanım İlkokulu resmi renk ve amblemlerine uygun pamuklu Selanik kumaş tişörtler.',
        sortOrder: 9,
      },
      {
        name: 'Yalnızçamlar İlk & Ortaokulu',
        slug: 'yalnizcamlar-ilk-ortaokulu',
        description: 'Yalnızçamlar ilk ve ortaokulu öğrenci Selanik kumaş tişört, sweatshirt ve spor takımları.',
        sortOrder: 10,
      },
      {
        name: 'N.Fazıl Kısakürek İlk & Ortaokulu',
        slug: 'n-fazil-kisakurek-ilk-ortaokulu',
        description: 'Necip Fazıl Kısakürek ilk ve ortaokulu onaylı nakış amblemli Selanik kumaş okul kıyafetleri.',
        sortOrder: 11,
      },
      {
        name: 'Hikmet Kiler Fen Lisesi',
        slug: 'hikmet-kiler-fen-lisesi',
        description: 'Fen Lisesi resmi onaylı amblemli Selanik kumaş polo yaka tişört, kışlık hırka ve sweatshirt.',
        sortOrder: 12,
      },
      {
        name: 'Bitlis Anadolu Lisesi',
        slug: 'bitlis-anadolu-lisesi',
        description: 'Bitlis Anadolu Lisesi resmi kız ve erkek öğrenci Selanik kumaş tişört ve kışlık sweatshirt.',
        sortOrder: 13,
      },
      {
        name: 'Cemil Özgür M.T.A.L.',
        slug: 'cemil-ozgur-mtal',
        description: 'Cemil Özgür M.T.A.L. resmi amblemli Selanik kumaş polo tişört ve lise kıyafet kombinleri.',
        sortOrder: 14,
      },
      {
        name: 'Said Nursi İmam Hatip Lisesi',
        slug: 'said-nursi-imam-hatip-lisesi',
        description: 'Said Nursi İmam Hatip Lisesi resmi öğrenci üniformaları, tişört ve kışlık sweatshirt modelleri.',
        sortOrder: 15,
      },
    ];

    for (const sch of initialSchools) {
      await db.school.create({
        data: {
          name: sch.name,
          slug: sch.slug,
          description: sch.description,
          sortOrder: sch.sortOrder,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ message: 'Veritabanı başarıyla tohumlandı.', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
