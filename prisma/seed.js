import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_IMAGE_CATEGORIES = ['profiles', 'projects', 'blog', 'team', 'gallery'];

// The organisation's own account plus the developer's. Passwords are only
// applied on create — re-running the seed never overwrites a password that
// someone has since changed from the dashboard.
const ADMINS = [
  { name: 'Oling Dawn Kerjew', email: 'info@olingdawnkerjewprojects.org', password: 'freedom2022025', role: 'Administrator' },
  { name: 'Charles Aroma', email: 'charlesaroma9@gmail.com', password: 'Dev@2026!', role: 'Software Developer' },
];

async function seedAdmins() {
  // Remove the old demo admin left over from earlier development.
  await prisma.user.deleteMany({ where: { email: 'admin@odkhc.local' } });

  for (const { name, email, password, role } of ADMINS) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { name, role },
      create: { name, email, passwordHash, role },
    });
    console.log(`Seeded admin user: ${email}`);
  }
}

async function seedSiteConfig() {
  const existing = await prisma.siteConfig.findFirst();
  if (existing) {
    console.log('SiteConfig already seeded, skipping');
    return;
  }

  await prisma.siteConfig.create({
    data: {
      orgName: 'Oling Dawn Kerjew Humanitarian and Charities NGO',
      shortName: 'ODKHC',
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

// Project copy and locations reconciled against the organisation's own site
// (olingdawnkerjew.org/programs.php and /gallery.php). Photographs are the
// real ones from the ImageKit library, matched to projects using that site's
// own captions. Anything without a photograph stays a draft.
const IK = 'https://ik.imagekit.io/u8h0uidte';
// Construction imagery is served from the site's own public folder, not ImageKit.
const IK_BUILD = `${IK}/oling-dawn-kerjew-projects/construction`;

const PROJECTS = [
  /*
    The low-cost construction programme. ODKHC's own briefing lists its
    completed interventions (school, mill, hairdressing, scholastic materials,
    Afghan meeting, gardening tools) — construction is not among them, and the
    briefing states plainly that "what is missing is the capital". These are
    therefore seeded as Planned, not Completed. The photographs illustrate the
    modular system delivered by the building partner, not finished ODKHC sites.
  */
  {
    slug: 'refugee-resettlement-housing',
    title: 'Refugee & Resettlement Housing',
    category: 'Low-Cost Construction',
    location: 'Kampala Metropolitan & Northern Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Prefabricated modular concrete homes for displaced households, built at non-profit cost so families stop paying rent that accumulates into nothing. Seeking co-financing.',
    description: [
      'A refugee family renting a modest room in Kampala pays roughly UGX 700,000 a month. Over five years that is UGX 42 million — enough to own a low-cost housing unit outright, with nothing to show for it at the end.',
      'Rather than subsidising rent indefinitely, this programme builds the asset itself: reinforced concrete modules cast under factory control, transported to site and craned into position on prepared foundations.',
      'The programme is at proposal stage and is seeking co-financing partners able to fund construction at district scale.',
    ],
    coverImage: `${IK_BUILD}/solution-unit.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'health-centres-and-clinics',
    title: 'Health Centres and Clinics',
    category: 'Low-Cost Construction',
    location: 'Northern Uganda & Kampala',
    status: 'Planned',
    year: 2026,
    summary: 'Modular health facilities placed close enough to reach on foot, for households who currently navigate hospitals alone and without income. Seeking co-financing.',
    description: [
      'Urban refugee households report that care which is free on paper still costs money in practice, and that chronic conditions become emergencies before they are treated.',
      'The same modular system that produces housing produces clinics and treatment rooms — cast off site, assembled quickly, and durable enough to serve for decades rather than a season.',
      'The programme is at proposal stage and is seeking co-financing partners.',
    ],
    coverImage: `${IK_BUILD}/build-04-finish.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'schools-and-teaching-blocks',
    title: 'Schools and Teaching Blocks',
    category: 'Low-Cost Construction',
    location: 'Oyam, Lira & Lango Sub-Region',
    status: 'Planned',
    year: 2026,
    summary: 'Classrooms, teaching blocks and dormitories built from repeatable modules — replacing damaged roofing and inadequate sanitation at underfunded schools. Seeking co-financing.',
    description: [
      'Visits to schools in Kamdini Sub County surfaced damaged roofing, inadequate toilets and buildings that will not survive many more rainy seasons.',
      'Modular construction answers this directly: one mould produces two one-room units, four produce an 80m² block, and storeys stack where density is needed.',
      'The programme is at proposal stage and is seeking co-financing partners.',
    ],
    coverImage: `${IK_BUILD}/modular-storeys.jpg`,
    gallery: [`${IK_BUILD}/modular-row.jpg`],
    publishStatus: 'published',
  },
  {
    slug: 'roads-bridges-drainage',
    title: 'Roads, Bridges, Drainage and Culverts',
    category: 'Low-Cost Construction',
    location: 'Northern Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Access infrastructure that keeps produce and patients moving year-round, and stops communities being cut off in the wet season. Seeking co-financing.',
    description: [
      'Access is the constraint behind much of the rest of the work: a mill is only useful if produce can reach it, and a clinic only useful if patients can.',
      'The programme covers roads, bridges, drainage and box culverts, using the same precast approach our building partner has already delivered on national infrastructure contracts.',
      'The programme is at proposal stage and is seeking co-financing partners.',
    ],
    coverImage: `${IK_BUILD}/namanve-bridges.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'farming-tools-distribution',
    title: 'Farming Tools for Anywalonino Women',
    category: 'Economic Development',
    location: 'Anywalonino Village, Lira, Uganda',
    status: 'Completed',
    year: 2025,
    summary: 'Hoes and farming materials distributed to smallholder farmers and community women in Anywalonino village, Lira.',
    description: [
      'Oling Dawn Kerjew distributed hoes and farming materials to smallholder farmers and community women in Anywalonino village, Lira.',
      'Hand tools remain the limiting factor for many households farming on small plots. Putting them directly into the hands of the women who work the land raises what a family can plant and harvest in a single season.',
    ],
    coverImage: `${IK}/Oling-Dawn-Kerjew-/distributing_agricultural_tools_hoes_MG_7659.JPG`,
    gallery: [
      `${IK}/Oling-Dawn-Kerjew-/_MG_7666.JPG`,
      `${IK}/Oling-Dawn-Kerjew-/_MG_7686.JPG`,
    ],
    publishStatus: 'published',
  },
  {
    slug: 'hairdressing-skills-training',
    title: 'Hairdressing and Design Skills Training',
    category: "Women & Girls Empowerment",
    location: 'Anywalonino Village (Odokomit Trading Centre), Lira, Uganda',
    status: 'Completed',
    year: 2025,
    summary: 'A skills training programme in hairdressing and design for women and girls at Odokomit Trading Centre, Lira.',
    description: [
      'Oling Dawn Kerjew ran a hairdressing and design skills training programme for women and girls in Anywalonino village, at the Odokomit Trading Centre in Lira.',
      'The training is built around a trade that can be practised locally with modest equipment, so participants can begin earning in their own community rather than having to migrate for work.',
    ],
    coverImage: `${IK}/Oling-Dawn-Kerjew-/ladies_hairdressing_training_20250812_123723.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'kamdini-grinding-mill',
    title: 'Myene Community Grinding Mill',
    category: 'Community Empowerment',
    location: 'Myene, Kamdini Sub County, Oyam District, Uganda',
    status: 'Ongoing',
    year: 2025,
    summary: 'A 50-horsepower grinding and hauling mill serving Myene in Kamdini Sub County, letting residents mill produce affordably close to home.',
    description: [
      'Residents of Kamdini Sub County previously had to travel long distances and pay high prices to grind their produce.',
      'Oling Dawn Kerjew established a 50-horsepower grinding and hauling mill at Myene so the community can mill at low cost, close to home. The income generated covers electricity, maintenance and the salaries of the workers who run it.',
      'The mill also operates as a small and medium enterprise in its own right, milling and hauling produce for the surrounding sub-county.',
    ],
    coverImage: `${IK}/oling-dawn-kerjew-projects/media/20250802_091710_akIjulqSV.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'arova-high-school-scholastic-materials',
    title: 'Scholastic Materials for Myene Secondary School',
    category: 'Education',
    location: 'Myene Village, Kamdini Sub County, Oyam District, Uganda',
    status: 'Ongoing',
    year: 2025,
    summary: 'Scholastic materials distributed to students at an underserved secondary school in Myene village, alongside conversations with staff about the condition of the school.',
    description: [
      'Oling Dawn Kerjew distributed scholastic materials to students at an underserved and underprivileged secondary school in Myene village, Kamdini Sub County, Oyam District.',
      'During the visit the team listened directly to students and staff about the challenges they face, including damaged roofing, inadequate toilets and a school pickup truck that is currently broken down.',
      'These conversations are shaping how future support for the school is planned.',
    ],
    coverImage: `${IK}/Oling-Dawn-Kerjew-/distributing_scholarstic_materials_to_under_priviledged_students_20250811_121004.jpg`,
    gallery: [`${IK}/Oling-Dawn-Kerjew-/NGO_secondary_school_20250811_120553.jpg`],
    publishStatus: 'published',
  },
  {
    slug: 'afghan-refugee-support',
    title: 'Afghan Refugee Mobilisation and Peace Initiative',
    category: 'Refugee Support',
    location: 'Old Kampala, Uganda',
    status: 'Ongoing',
    year: 2026,
    summary: 'Meetings with Afghan refugee community leaders in Old Kampala towards a memorandum of understanding on support and peace-building.',
    description: [
      'A community of Afghan refugees fled their country after the Taliban took power, seeking security and safety in Uganda.',
      'Oling Dawn Kerjew met with Afghan refugee community leaders in Old Kampala to discuss a memorandum of understanding covering support and peace-building work.',
      'As a minority community with limited access to funding, their livelihoods remain at risk, and the initiative is focused on understanding and responding to their most pressing needs.',
    ],
    gallery: [],
    publishStatus: 'draft',
  },
  {
    slug: 'sudanese-refugee-food-aid',
    title: 'Food Aid for Sudanese Refugees',
    category: 'Refugee Support',
    location: 'Kiryandongo District, Bweyale Town, Uganda',
    status: 'Completed',
    year: 2026,
    summary: 'In partnership with MAMA AFRICA, food aid including bread was distributed to Sudanese refugees living in a camp in Kiryandongo District.',
    description: [
      'Working alongside partner organisation MAMA AFRICA, Oling Dawn Kerjew helped distribute food aid, including bread, to Sudanese refugees living in a camp in Kiryandongo District, Bweyale Town.',
      'The distribution reached families who fled conflict and are now rebuilding their lives far from home, providing immediate relief to households facing food insecurity.',
    ],
    gallery: [],
    publishStatus: 'draft',
  },
  {
    slug: 'digital-marketplace-partnership',
    title: 'Digital Marketplace Partnership for Smallholder Farmers',
    category: 'Economic Development',
    location: 'Oyam District, Northern Uganda',
    status: 'Ongoing',
    year: 2025,
    summary: 'An MOU with fromyfarm.app, Digital Green and MCash connecting smallholder farmers to a digital marketplace, expanding access to buyers and fair prices.',
    description: [
      'Oling Dawn Kerjew partnered with fromyfarm.app, Digital Green and MCash through a signed MOU to bring smallholder farmers onto a digital marketplace platform.',
      'The partnership gives farmers direct access to buyers, fairer pricing and digital tools to grow their income, extending the same spirit of self-reliance behind the community grinding mill.',
    ],
    gallery: [],
    publishStatus: 'draft',
  },
];

/*
  Upsert by slug rather than skipping when the table is non-empty, so copy and
  photograph corrections actually land. Note this does overwrite dashboard
  edits to these seven seeded projects — anything created in the dashboard is
  untouched.
*/
async function seedProjects() {
  for (const project of PROJECTS) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  const published = PROJECTS.filter((p) => p.publishStatus === 'published').length;
  console.log(`Seeded ${PROJECTS.length} projects (${published} published, ${PROJECTS.length - published} draft)`);
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
  await seedAdmins();
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
