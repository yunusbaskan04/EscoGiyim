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

  // 4. Sample Schools & Uniform Products
  await prisma.productSize.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.school.deleteMany();

  const school1 = await prisma.school.create({
    data: {
      name: 'Atatürk Anadolu Lisesi',
      slug: 'ataturk-anadolu-lisesi',
      logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&auto=format&fit=crop&q=80',
      description: 'Atatürk Anadolu Lisesi resmi kız ve erkek öğrenci kıyafetleri, tişört ve lacivert sweat takımları.',
      sortOrder: 1,
      isActive: true,
      products: {
        create: [
          {
            name: 'Kısa Kollu Polo Yaka Tişört',
            slug: 'ataturk-al-kisa-kollu-polo-tisort',
            description: '%100 Pamuklu nefes alabilen lakost kumaş, arma nakışlı göğüs logosu ve yıpranmaya dayanıklı yaka.',
            sortOrder: 1,
            isActive: true,
            images: {
              create: [
                { imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', isCover: true, sortOrder: 1 },
                { imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', isCover: false, sortOrder: 2 },
              ],
            },
            sizes: {
              create: [
                { name: 'XS / 12-13 Yaş', sortOrder: 1 },
                { name: 'S', sortOrder: 2 },
                { name: 'M', sortOrder: 3 },
                { name: 'L', sortOrder: 4 },
                { name: 'XL', sortOrder: 5 },
              ],
            },
          },
          {
            name: 'Fermuarlı Kapüşonlu Sweatshirt',
            slug: 'ataturk-al-fermuarli-kapusonlu-sweatshirt',
            description: 'Üç iplik şardonlu sıcak tutan premium kumaş, dayanıklı fermuar ve armalı okul nakışı.',
            sortOrder: 2,
            isActive: true,
            images: {
              create: [
                { imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', isCover: true, sortOrder: 1 },
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

  const school2 = await prisma.school.create({
    data: {
      name: 'Cumhuriyet Ortaokulu',
      slug: 'cumhuriyet-ortaokulu',
      logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
      description: 'Cumhuriyet Ortaokulu kız ve erkek formalı yazlık - kışlık öğrenci takımları.',
      sortOrder: 2,
      isActive: true,
      products: {
        create: [
          {
            name: 'Kışlık Bisiklet Yaka Swetshirt',
            slug: 'cumhuriyet-oo-kislik-swetshirt',
            description: 'Bordo pamuk kumaş, esnek manşetler ve okul amblemli göğüs baskısı.',
            sortOrder: 1,
            isActive: true,
            images: {
              create: [
                { imageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80', isCover: true, sortOrder: 1 },
              ],
            },
            sizes: {
              create: [
                { name: '8-9 Yaş', sortOrder: 1 },
                { name: '10-11 Yaş', sortOrder: 2 },
                { name: '12-13 Yaş', sortOrder: 3 },
                { name: 'S', sortOrder: 4 },
              ],
            },
          },
          {
            name: 'Eşofman Altı & Üstü Takım',
            slug: 'cumhuriyet-oo-esofman-takimi',
            description: 'Mikro kumaş leke tutmaz eşofman takımı, hareket kolaylığı sağlayan bel lastiği.',
            sortOrder: 2,
            isActive: true,
            images: {
              create: [
                { imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80', isCover: true, sortOrder: 1 },
              ],
            },
            sizes: {
              create: [
                { name: '8-9 Yaş', sortOrder: 1 },
                { name: '10-11 Yaş', sortOrder: 2 },
                { name: '12-13 Yaş', sortOrder: 3 },
                { name: '14-15 Yaş', sortOrder: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  const school3 = await prisma.school.create({
    data: {
      name: 'Milli Egemenlik İlkokulu',
      slug: 'milli-egemenlik-ilkokulu',
      logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80',
      description: 'Milli Egemenlik İlkokulu minik öğrenciler için pamuklu ve cilde dost sevimli formalar.',
      sortOrder: 3,
      isActive: true,
      products: {
        create: [
          {
            name: 'İlkokul Kısa Kollu Bordo Tişört',
            slug: 'milli-egemenlik-ilkokul-tisort',
            description: '%100 Organik pamuklu hassas çocuk cildine uygun okul tişörtü.',
            sortOrder: 1,
            isActive: true,
            images: {
              create: [
                { imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', isCover: true, sortOrder: 1 },
              ],
            },
            sizes: {
              create: [
                { name: '6-7 Yaş', sortOrder: 1 },
                { name: '8-9 Yaş', sortOrder: 2 },
                { name: '10-11 Yaş', sortOrder: 3 },
              ],
            },
          },
        ],
      },
    },
  });

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
