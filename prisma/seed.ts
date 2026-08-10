import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Esco Şah database...');

  // 1. Default Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@escosah.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminEscoSah2026!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashedPassword },
    create: {
      email: adminEmail,
      name: 'Esco Şah Yönetici',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Esco Şah Terzilik & Okul Kıyafetleri',
      phone: '+90 532 313 78 37',
      whatsapp: '905323137837',
      address: 'Fevzi Çakmak Mah. İstanbul Cad. No:42/A, Pendik / İstanbul',
      mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.286392!2d29.231211!3d40.880412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDUyJzE5LjUiTiAyOcKwMTMnNTIuMyJF!5e0!3m2!1str!2str!4v1620000000000',
      instagramUrl: 'https://instagram.com/escosahterzi',
      facebookUrl: 'https://facebook.com/escosahterzi',
      workingHours: 'Pazartesi - Cumartesi: 08:30 - 19:30 | Pazar: Kapalı',
      heroTitle: 'Esco Şah Terzilik & Resmi Okul Kıyafetleri',
      heroSubtitle: '30 yılı aşkın terzilik tecrübemiz ve kaliteli kumaş seçimlerimizle resmi okul kıyafetlerinde şıklığı ve dayanıklılığı bir arada sunuyoruz.',
      aboutTitle: 'Esco Şah Kalitesi ve Usta İşçilik',
      aboutContent: 'Esco Şah Terzilik olarak uzun yıllardır Pendik ve çevresindeki seçkin okullara özel dikim ve hazır seri okul üniformaları temin etmekteyiz. Çocuğunuzun gün boyu hareket özgürlüğünü kısıtlamayan, anti-alerjik ve yıkamaya dayanıklı kumaşlarımızla okul sezonuna hazırız.',
    },
  });

  // 3. Announcements
  await prisma.announcement.deleteMany();
  await prisma.announcement.createMany({
    data: [
      {
        title: '2026-2027 Okul Sezonu Formalarımız Stoklarımızda!',
        content: 'Yeni eğitim ve öğretim yılı için tüm resmi okul kıyafetleri ve eşofman takımları magazamızda satışa çıkmıştır.',
        status: 'PUBLISHED',
        sortOrder: 1,
      },
      {
        title: 'Özel Ölçü Dikim Randevuları Başladı',
        content: 'Standart bedenler dışında özel ölçü okul kıyafeti dikimlerimiz için magazamıza uğrayabilir veya telefonla bilgi alabilirsiniz.',
        status: 'PUBLISHED',
        sortOrder: 2,
      },
    ],
  });

  // 4. Sample Schools
  await prisma.school.deleteMany();

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
    await prisma.school.create({
      data: {
        name: sch.name,
        slug: sch.slug,
        description: sch.description,
        sortOrder: sch.sortOrder,
        isActive: true,
      },
    });
  }

  // 5. Gallery Images
  await prisma.galleryImage.deleteMany();
  await prisma.galleryImage.createMany({
    data: [
      {
        title: 'Esco Şah Terzilik Mağaza Önü',
        category: 'STORE',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
        sortOrder: 1,
      },
      {
        title: 'Usta Terzi Dikiş Masası',
        category: 'TAILORING',
        imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458e5e?w=800&auto=format&fit=crop&q=80',
        sortOrder: 2,
      },
      {
        title: 'Özel Dikiş Kumaş Koleksiyonları',
        category: 'TAILORING',
        imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80',
        sortOrder: 3,
      },
      {
        title: 'Okul Üniforması Nakış Detayı',
        category: 'PRODUCT',
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        sortOrder: 4,
      },
      {
        title: 'Hazır Kıyafet Teşhir Alanı',
        category: 'STORE',
        imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
        sortOrder: 5,
      },
      {
        title: 'Özel Düğme & İplik Çeşitleri',
        category: 'OTHER',
        imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
        sortOrder: 6,
      },
    ],
  });

  // 6. FAQ Items
  await prisma.faqItem.deleteMany();
  await prisma.faqItem.createMany({
    data: [
      {
        question: 'İnternet sitenizden doğrudan sipariş ve ödeme yapabilir miyim?',
        answer: 'Sitemiz bir e-ticaret sitesi değildir. Kıyafet modellerimizi, kumaş kalitemizi ve beden seçeneklerimizi inceleyebilir; WhatsApp veya telefon aracılığıyla doğrudan bizimle iletişime geçerek sipariş ve bilgi alabilirsiniz.',
        category: 'Sipariş & İletişim',
        sortOrder: 1,
        isPublished: true,
      },
      {
        question: 'Okul kıyafetlerinde özel beden / terzi dikimi yapıyor musunuz?',
        answer: 'Evet! Standart beden tablosuna uymayan veya özel ölçü gerektiren öğrencilerimiz için usta terzilerimiz tarafından tam oturan özel dikim yapılmaktadır.',
        category: 'Terzilik & Beden',
        sortOrder: 2,
        isPublished: true,
      },
      {
        question: 'Formalarınızda hangi tür kumaşlar kullanılmaktadır?',
        answer: 'Tüm ürünlerimizde %100 pamuklu lakost, üç iplik şardonlu sweathirt kumaşları ve terletmeyen anti-alerjik kumaşlar kullanılmaktadır. Yıkamalara karşı çekme ve renk solması yapmaz.',
        category: 'Kalite & Kumaş',
        sortOrder: 3,
        isPublished: true,
      },
      {
        question: 'Anlaşmalı olduğumuz okulun logosu formalarda mevcut mu?',
        answer: 'Anlaşmalı olduğumuz tüm okulların resmi nakış ve baskı amblemleri orjinal kalıplara ve renk kodlarına uygun şekilde formalara işlenmiştir.',
        category: 'Okul Üniformaları',
        sortOrder: 4,
        isPublished: true,
      },
      {
        question: 'Değişim ve tadilat imkanı sunuyor musunuz?',
        answer: 'Mağazamızdan satın aldığınız etiketi sökülmemiş ve giyilmemiş tüm okul kıyafetlerinde beden değişimi yapılmakta; boy ve paça tadilatları terzihanemizde ücretsiz tamamlanmaktadır.',
        category: 'Hizmetlerimiz',
        sortOrder: 5,
        isPublished: true,
      },
    ],
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
