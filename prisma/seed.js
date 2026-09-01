import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_IMAGE_CATEGORIES = ['profiles', 'projects', 'blog', 'team', 'gallery'];

async function seedAdmin() {
  const email = 'charlesaroma9@gmail.com';
  const passwordHash = await bcrypt.hash('Dev@2026!', 12);

  // Remove the old demo admin left over from earlier development.
  await prisma.user.deleteMany({ where: { email: 'admin@odkhc.local' } });

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Charles Aroma',
      email,
      passwordHash,
      role: 'Software Developer',
    },
  });
  console.log(`Seeded admin user: ${email}`);
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

// Real project copy, carried over from the old localStorage-only site.
// coverImage/gallery are intentionally left empty — real photos get
// attached via the dashboard's Media Library once available. Seeded as
// drafts so nothing photo-less goes live before a staff member reviews it.
const PROJECTS = [
  {
    slug: 'sudanese-refugee-food-aid',
    title: 'Food Aid for Sudanese Refugees',
    category: 'Refugee Support',
    location: 'Kiryandongo District, Bweyale Town, Uganda',
    status: 'Completed',
    year: 2026,
    summary: 'In partnership with MAMA AFRICA organization, we distributed food aid, including bread, to Sudanese refugees staying in a camp in Kiryandongo District.',
    description: [
      'Working alongside our partner organization MAMA AFRICA, Oling Dawn Kerjew Projects helped distribute food aid, including bread, to Sudanese refugees living in a camp in Kiryandongo District, Bweyale Town.',
      'The distribution reached families who fled conflict and are now rebuilding their lives far from home, providing immediate relief to households facing food insecurity.',
    ],
  },
  {
    slug: 'arova-high-school-scholastic-materials',
    title: 'Scholastic Materials for Arova High School',
    category: 'Education',
    location: 'Oyam District, Kamdini Sub County, Myene Village, Uganda',
    status: 'Ongoing',
    year: 2026,
    summary: 'We distributed scholastic materials to students at Arova High School and listened to their concerns about school conditions, including damaged roofs, toilets, and the school\'s broken pickup truck.',
    description: [
      'Oling Dawn Kerjew Projects distributed scholastic materials to students at Arova High School in Oyam District, Kamdini Sub County, Myene Village.',
      'During the visit, we listened directly to students and staff about the challenges they face, including damaged roofing, inadequate toilets, and a school pickup truck that is currently broken down.',
      'These conversations are shaping how we plan future support for the school.',
    ],
  },
  {
    slug: 'afghan-refugee-support',
    title: 'Supporting Afghan Refugees in Uganda',
    category: 'Refugee Support',
    location: 'Uganda',
    status: 'Ongoing',
    year: 2026,
    summary: 'Afghan refugees who fled after the Taliban took power came to Uganda seeking safety, but face funding shortages that put their livelihoods at risk.',
    description: [
      'A small community of Afghan refugees fled their country after the Taliban took power, seeking security and safety in Uganda.',
      'As a minority community with limited access to funding, their livelihoods remain at risk. Oling Dawn Kerjew Projects is working to understand and respond to their most pressing needs.',
    ],
  },
  {
    slug: 'kamdini-grinding-mill',
    title: 'Kamdini Community Grinding Mill',
    category: 'Community Empowerment',
    location: 'Kamdini Sub County, Oyam District, Uganda',
    status: 'Ongoing',
    year: 2025,
    summary: 'A community grinding mill helping residents of Kamdini Sub County grind their produce affordably, with proceeds covering electricity, maintenance, and workers\' salaries.',
    description: [
      'Residents of Kamdini Sub County previously had to travel long distances and pay high prices to grind their produce.',
      'Oling Dawn Kerjew Projects provided a grinding mill so the community can grind at low cost, close to home. The income generated covers electricity, maintenance, and the salaries of the workers who run it.',
    ],
  },
  {
    slug: 'digital-marketplace-partnership',
    title: 'Digital Marketplace Partnership for Smallholder Farmers',
    category: 'Economic Development',
    location: 'Oyam District, Northern Uganda',
    status: 'Ongoing',
    year: 2025,
    summary: 'Oling Dawn Kerjew Projects signed an MOU with fromyfarm.app, Digital Green, and MCash to connect smallholder farmers in our communities with a digital marketplace, expanding their access to buyers and fair prices.',
    description: [
      'Oling Dawn Kerjew Projects partnered with fromyfarm.app, Digital Green, and MCash through a signed MOU to bring smallholder farmers in our communities onto a digital marketplace platform.',
      'The partnership is designed to give farmers direct access to buyers, fairer pricing, and digital tools to grow their income, extending the same spirit of self-reliance behind our community grinding mill.',
    ],
  },
];

async function seedProjects() {
  const count = await prisma.project.count();
  if (count > 0) {
    console.log('Projects already seeded, skipping');
    return;
  }

  await prisma.project.createMany({
    data: PROJECTS.map((p) => ({ ...p, publishStatus: 'draft' })),
  });
  console.log(`Seeded ${PROJECTS.length} projects (as drafts)`);
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
  await seedProjects();
  await seedImageCategories();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
