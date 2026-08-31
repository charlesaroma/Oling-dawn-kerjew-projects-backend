import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_IMAGE_CATEGORIES = ['profiles', 'projects', 'blog', 'team', 'gallery'];

async function seedAdmin() {
  const passwordHash = await bcrypt.hash('odkhc-admin-2026', 12);
  await prisma.user.upsert({
    where: { email: 'admin@odkhc.local' },
    update: {},
    create: {
      name: 'Oling Dawn Kerjew Projects Admin',
      email: 'admin@odkhc.local',
      passwordHash,
      role: 'admin',
    },
  });
  console.log('Seeded admin user: admin@odkhc.local');
}

async function seedSiteConfig() {
  const existing = await prisma.siteConfig.findFirst();
  if (existing) {
    console.log('SiteConfig already seeded, skipping');
    return;
  }

  await prisma.siteConfig.create({
    data: {
      orgName: 'Oling Dawn Kerjew Projects',
      shortName: 'ODKP',
      tagline: 'Service to humanity, for God and mankind.',
      description:
        "Oling Dawn Kerjew Projects is a registered NGO delivering low-cost, non-profit construction of hospitals, schools, roads and bridges for the nation, alongside sustainable education, healthcare, women's empowerment and community development to underprivileged populations across Uganda, with special focus on needy children, women and girls, and the families of Uganda's security personnel.",
      emails: ['info@olingdawnkerjew.org', 'odkhumanitarianandcharities@gmail.com'],
      phones: ['+256 772 888 566', '+256 772 375 736'],
      registeredAddress: 'Adebe Cell, Western Ward, Kamdini Town Council, Oyam South County, Oyam District, Northern Uganda',
      postalAddress: 'P.O. Box 331793, Lira, Uganda',
      registeredYear: '2025',
      navLinks: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Projects', path: '/projects' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Blog', path: '/blog' },
        { label: 'Contact', path: '/contact' },
      ],
      socialLinks: [
        { label: 'X', url: 'https://x.com/ODKHC_NGO' },
        { label: 'Instagram', url: 'https://www.instagram.com/odk_humanitarianandcharities/' },
        { label: 'TikTok', url: 'https://www.tiktok.com/@odkhc_ngo' },
      ],
    },
  });
  console.log('Seeded SiteConfig');
}

async function seedImageCategories() {
  const count = await prisma.imageCategory.count();
  if (count > 0) {
    console.log('Image categories already seeded, skipping');
    return;
  }

  await prisma.imageCategory.createMany({
    data: DEFAULT_IMAGE_CATEGORIES.map((name, i) => ({ name, sortOrder: i })),
  });
  console.log(`Seeded image categories: ${DEFAULT_IMAGE_CATEGORIES.join(', ')}`);
}

async function main() {
  await seedAdmin();
  await seedSiteConfig();
  await seedImageCategories();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
