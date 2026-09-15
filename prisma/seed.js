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
// Full-resolution client photo drop (Sept 2026), one real folder per
// project — uploaded to ImageKit under /media and tagged to match. Replaces
// the handful of general-purpose shots (agricultural tools, NGO school,
// scholastic materials, hairdressing) that were being reused across nearly
// every project for lack of anything more specific.
const IK_MEDIA = `${IK}/oling-dawn-kerjew-projects/media`;
const NEW_PHOTOS = {
  afghanRefugees: [
    `${IK_MEDIA}/afghan-refugees-1_5qZo2FfAg.jpeg`,
    `${IK_MEDIA}/afghan-refugees-2_j83OtHvtW9.jpeg`,
    `${IK_MEDIA}/afghan-refugees-3_TW37k1tXWq.jpeg`,
    `${IK_MEDIA}/afghan-refugees-4_eRS5JCmOr.jpeg`,
    `${IK_MEDIA}/afghan-refugees-5_Wa9TwS2tCX.jpeg`,
    `${IK_MEDIA}/afghan-refugees-6_cVg1pvNN2d.jpeg`,
  ],
  arovaSchool: [
    `${IK_MEDIA}/arova-school-1_NnNJwIafa.jpg`,
    `${IK_MEDIA}/arova-school-2_bKLuPrxiV.jpg`,
    `${IK_MEDIA}/arova-school-3_E4NtjKzdn.jpg`,
    `${IK_MEDIA}/arova-school-4_f5dregfkn.jpg`,
    `${IK_MEDIA}/arova-school-5_3xEb6v6jee.jpg`,
    `${IK_MEDIA}/arova-school-6_0c8b3j32o6.jpg`,
  ],
  // 1-3 are the mill/factory interior, 4-6 the hair salon — one trip covered both.
  factorySalon: [
    `${IK_MEDIA}/factory-salon-1_OPdDVSbtZ.jpg`,
    `${IK_MEDIA}/factory-salon-2_dcwO4oXdH.jpg`,
    `${IK_MEDIA}/factory-salon-3_Wlslznsgp.jpg`,
    `${IK_MEDIA}/factory-salon-4_ciYiw4DhI.jpg`,
    `${IK_MEDIA}/factory-salon-5_TU320TxnCX.jpg`,
    `${IK_MEDIA}/factory-salon-6_HFR1JgorB.jpg`,
  ],
  grindingMill: [
    `${IK_MEDIA}/grinding-mill-1_i7WvdvrPR.jpg`,
    `${IK_MEDIA}/grinding-mill-2_d1opFesJ9.jpg`,
    `${IK_MEDIA}/grinding-mill-3_j7sfnhK0ib.jpg`,
    `${IK_MEDIA}/grinding-mill-4_UvVBZbLgG.jpg`,
    `${IK_MEDIA}/grinding-mill-5_CnqqnVmiU.jpg`,
    `${IK_MEDIA}/grinding-mill-6_V5gDppu7w.jpg`,
  ],
  hoes: [
    `${IK_MEDIA}/hoes-1_r5oKc6-Ib.JPG`,
    `${IK_MEDIA}/hoes-2_LQR_akFsM.JPG`,
    `${IK_MEDIA}/hoes-3_ePN0TrNh_.JPG`,
    `${IK_MEDIA}/hoes-4_gxuRAw4wc.JPG`,
    `${IK_MEDIA}/hoes-5_8X99yQQ_G.JPG`,
    `${IK_MEDIA}/hoes-6_485KK_WJD.JPG`,
  ],
  saloon: [
    `${IK_MEDIA}/saloon-1_SQrBT3Ym_.jpg`,
    `${IK_MEDIA}/saloon-2_6pIuESn-3z.jpg`,
    `${IK_MEDIA}/saloon-3_dxke8s3-C1.jpg`,
    `${IK_MEDIA}/saloon-4_G9IUIbZ5RA.jpg`,
    `${IK_MEDIA}/saloon-5_bnhBEI-xG.jpg`,
  ],
  sudaneseRefugees: [
    `${IK_MEDIA}/sudanese-refugees-1_hKWDOf06T.jpeg`,
    `${IK_MEDIA}/sudanese-refugees-2_D_ftO6ZdI.jpeg`,
    `${IK_MEDIA}/sudanese-refugees-3_M-95daAn8.jpeg`,
    `${IK_MEDIA}/sudanese-refugees-4_oln1IloK2.jpeg`,
    `${IK_MEDIA}/sudanese-refugees-5_9cxTSl1c3.jpeg`,
    `${IK_MEDIA}/sudanese-refugees-6_CODg11hHI.jpeg`,
  ],
  // Mosque in Lira — a real community/interfaith gathering space, wired to
  // the Peacebuilding & Social Cohesion concept below.
  mosqueLira: [
    `${IK_MEDIA}/mosque-lira-1_4lSZ99__xj.jpeg`,
    `${IK_MEDIA}/mosque-lira-2_bRPmOplHW.jpeg`,
    `${IK_MEDIA}/mosque-lira-3_COBi3V7za.jpeg`,
    `${IK_MEDIA}/mosque-lira-4_WQUFdgCTM.jpeg`,
    `${IK_MEDIA}/mosque-lira-5_i-zvSQ7MvC.jpeg`,
  ],
};

/*
  Explicit exception to the "real photos only" rule above: these 5 concept
  projects are abstract policy/systems proposals (a social security fund, an
  electoral-sensitisation campaign, a legal-aid casework programme, a
  cookstove/reforestation programme, an information-management platform) with
  no corresponding field photo anywhere in ODKHC's library — checked against
  every photo uploaded this batch plus the existing media library. Used here
  only on explicit request (2026-09-15) to replace the icon-only placeholder.
  All from Pexels (https://www.pexels.com/license/ — free for commercial use,
  no attribution required), chosen for a plain, non-editorial documentary
  look consistent with the rest of the site rather than a "stock photo" feel.
  Swap for a real ODKHC photo the moment one exists.
*/
const STOCK_PHOTOS = {
  ballotBox: 'https://images.pexels.com/photos/7103169/pexels-photo-7103169.jpeg?auto=compress&cs=tinysrgb&w=1600',
  savingsSecurity: 'https://images.pexels.com/photos/3943727/pexels-photo-3943727.jpeg?auto=compress&cs=tinysrgb&w=1600',
  serverRoom: 'https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&w=1600',
  legalConsultation: 'https://images.pexels.com/photos/8111895/pexels-photo-8111895.jpeg?auto=compress&cs=tinysrgb&w=1600',
  solarCooker: 'https://images.pexels.com/photos/31686958/pexels-photo-31686958.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

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
    coverImage: `${IK_BUILD}/mulago-oxygen-plant.jpg`,
    gallery: [`${IK_BUILD}/build-04-finish.jpg`],
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
    coverImage: NEW_PHOTOS.hoes[3],
    gallery: [NEW_PHOTOS.hoes[0], NEW_PHOTOS.hoes[1], NEW_PHOTOS.hoes[2], NEW_PHOTOS.hoes[4], NEW_PHOTOS.hoes[5]],
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
    coverImage: NEW_PHOTOS.saloon[4],
    gallery: [NEW_PHOTOS.saloon[0], NEW_PHOTOS.saloon[1], NEW_PHOTOS.saloon[2], NEW_PHOTOS.saloon[3], NEW_PHOTOS.factorySalon[3], NEW_PHOTOS.factorySalon[4], NEW_PHOTOS.factorySalon[5]],
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
    coverImage: NEW_PHOTOS.grindingMill[2],
    gallery: [NEW_PHOTOS.grindingMill[0], NEW_PHOTOS.grindingMill[1], NEW_PHOTOS.grindingMill[3], NEW_PHOTOS.grindingMill[4], NEW_PHOTOS.grindingMill[5]],
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
    coverImage: NEW_PHOTOS.arovaSchool[5],
    gallery: [NEW_PHOTOS.arovaSchool[1], NEW_PHOTOS.arovaSchool[2], NEW_PHOTOS.arovaSchool[4], NEW_PHOTOS.arovaSchool[0], NEW_PHOTOS.arovaSchool[3]],
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
    coverImage: NEW_PHOTOS.afghanRefugees[4],
    gallery: [NEW_PHOTOS.afghanRefugees[0], NEW_PHOTOS.afghanRefugees[1], NEW_PHOTOS.afghanRefugees[2], NEW_PHOTOS.afghanRefugees[3], NEW_PHOTOS.afghanRefugees[5]],
    publishStatus: 'published',
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
    coverImage: NEW_PHOTOS.sudaneseRefugees[1],
    gallery: [NEW_PHOTOS.sudaneseRefugees[0], NEW_PHOTOS.sudaneseRefugees[2], NEW_PHOTOS.sudaneseRefugees[3], NEW_PHOTOS.sudaneseRefugees[4], NEW_PHOTOS.sudaneseRefugees[5]],
    publishStatus: 'published',
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

  /*
    Project concepts submitted by Dr. Oling Dawn Kerjew to Mrs. Shamilla
    (ODKHC consultant, Robert Schuman Foundation and Trust representative) —
    "Projects' Titles to Shamilla", Ref ProjectsTitles:0001/692026, 6 Sept
    2026. These are proposal-stage concepts pitched to a donor, not executed
    programmes — status is Planned and every description says so explicitly
    ("at concept stage... seeking donor partnership"), same framing already
    used for the four other Planned/co-financing construction listings above.
    Published live at Dr. Kerjew's request (2026-09-14).
    Deliberately no stock/web imagery: a concept only gets a coverImage where
    it genuinely overlaps a photo already in the organisation's own library
    (agriculture, education, women's skilling, cooperative enterprise,
    construction/health facilities) — reused fairly liberally across
    thematically-adjacent concepts once "add images" was requested. Six
    concepts with no honest visual match at all (electoral sensitisation,
    social security funds, legal aid/protection, peacebuilding, clean
    cooking/environmental restoration, refugee info-management systems) stay
    text/icon-only rather than borrowing an unrelated photo.
  */
  {
    slug: 'waste-to-clean-energy-and-green-jobs',
    title: 'Waste to Clean Energy and Green Jobs Project',
    category: 'Clean Energy',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Waste-to-energy plants converting urban and rural waste into renewable energy while creating green-industry jobs.',
    description: [
      'Establish waste-to-energy plants to convert urban and rural waste into renewable energy, while creating employment opportunities in green industries.',
      'Aligned with SDG 7 (Affordable & Clean Energy), SDG 8 (Decent Work & Economic Growth), SDG 11 (Sustainable Cities) and SDG 13 (Climate Action).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: `${IK_BUILD}/build-03-install.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'higher-education-institutions-for-refugees-and-host-communities',
    title: 'Establishment of Learning Institutions of Higher Education for Refugees and Host Communities',
    category: 'Education',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Inclusive universities and vocational colleges providing equitable access to higher education for refugees and host communities.',
    description: [
      'Build inclusive universities and vocational colleges to provide equitable access to higher education for refugees and host communities.',
      'Aligned with SDG 4 (Quality Education), SDG 10 (Reduced Inequalities) and SDG 16 (Peace, Justice & Strong Institutions).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.arovaSchool[1],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'social-security-protection-multipurpose-funds',
    title: 'Universal Workers and Farmers, Informal Workers and Refugees — Social Security Protection Multipurpose Funds',
    category: 'Social Protection',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'National-level funds providing pensions, health insurance and financial safety nets for informal workers, farmers and refugees.',
    description: [
      'Create national-level Social Security Protection Multipurpose Funds to provide pensions, health insurance and financial safety nets for informal workers, farmers and refugees.',
      'Aligned with SDG 1 (No Poverty), SDG 3 (Good Health & Well-being) and SDG 8 (Decent Work & Economic Growth).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: STOCK_PHOTOS.savingsSecurity,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'multipurpose-cooperatives-digital-marketplace-empowerment',
    title: 'Universal Workers and Farmers Multipurpose Cooperatives Society — Digital Marketplace Empowerment',
    category: 'Economic Development',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Cooperatives integrating digital platforms for market access, financial inclusion and collective bargaining.',
    description: [
      'Establish cooperatives that integrate digital platforms for market access, financial inclusion and collective bargaining for farmers, refugees and informal workers.',
      'Aligned with SDG 9 (Industry, Innovation & Infrastructure) and SDG 12 (Responsible Consumption & Production).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: `${IK}/oling-dawn-kerjew-projects/media/20250802_091710_akIjulqSV.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'youth-and-females-practical-skilling',
    title: 'Youth and Females Practical Skilling Projects',
    category: 'Women & Girls Empowerment',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Hands-on vocational training — hairdressing, baking, fabrication, construction — to give youth and women employable skills.',
    description: [
      'Provide hands-on vocational training (hairdressing, baking, fabrication, construction) to empower youth and women with employable skills.',
      'Aligned with SDG 5 (Gender Equality) and SDG 8 (Decent Work & Economic Growth).',
      'This builds on training already run in Lira — this concept proposes taking that model to more districts, and is seeking donor partnership to do so.',
    ],
    coverImage: NEW_PHOTOS.saloon[0],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'child-labour-prevention-and-back-to-school-education',
    title: 'Child Labour Prevention, Back-to-School Education, and Digital Literacy Programs',
    category: 'Education',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Campaigns to eliminate child labour, reintegrate vulnerable children into school, and provide digital literacy.',
    description: [
      'Implement campaigns and programmes to eliminate child labour, reintegrate vulnerable children into schools, and provide digital literacy.',
      'Aligned with SDG 4 (Quality Education), SDG 8.7 (End Child Labour) and SDG 10 (Reduced Inequalities).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: `${IK}/Oling-Dawn-Kerjew-/distributing_scholarstic_materials_to_under_priviledged_students_20250811_121004.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'advanced-practical-agronomic-research-initiative',
    title: 'Advanced Practical Agronomic Research Initiative (APARI)',
    category: 'Agriculture & Food Security',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Climate-smart agricultural research and finance studies to strengthen resilience among rural farmers and refugees.',
    description: [
      'Conduct climate-smart agricultural research and finance studies to strengthen resilience among rural farmers and refugees.',
      'Aligned with SDG 2 (Zero Hunger), SDG 13 (Climate Action) and SDG 15 (Life on Land).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.hoes[0],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'ethical-digital-adoption-and-rural-green-finance',
    title: 'Ethical Digital Adoption and Inclusive Rural Green Finance Project',
    category: 'Climate Finance & Green Growth',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Ethical digital technologies and inclusive green financing models to help rural communities access climate finance.',
    description: [
      'Promote ethical digital technologies and inclusive green financing models for rural communities to access climate finance.',
      'Aligned with SDG 9 (Innovation), SDG 13 (Climate Action) and SDG 17 (Partnerships).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.factorySalon[0],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'national-sensitisation-on-peaceful-elections-and-human-rights',
    title: 'National Sensitisation on Peaceful Electoral Process and Human Rights Protection',
    category: 'Peace & Governance',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'A five-year nationwide civic education campaign promoting peaceful elections, democracy and human rights protection.',
    description: [
      'Conduct civic education campaigns nationwide, over five years, to promote peaceful elections, democracy and human rights protection.',
      'Aligned with SDG 16 (Peace, Justice & Strong Institutions).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: STOCK_PHOTOS.ballotBox,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'refugees-and-informal-workers-business-development-academy',
    title: 'Refugees and Informal Workers Business Development Academy',
    category: 'Economic Development',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Academies training refugees and informal workers in entrepreneurship, business management and financial literacy.',
    description: [
      'Establish academies to train refugees and informal workers in entrepreneurship, business management and financial literacy.',
      'Aligned with SDG 8 (Decent Work & Economic Growth) and SDG 10 (Reduced Inequalities).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.saloon[1],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'farmers-producers-organization-development',
    title: 'Community-Based Farmers Producers Organization (FPO) Development Project',
    category: 'Agriculture & Food Security',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Strengthening farmer producer organizations to improve collective production, marketing and access to finance.',
    description: [
      'Strengthen farmer producer organizations to improve collective production, marketing and access to finance.',
      'Aligned with SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption & Production).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.hoes[1],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'direct-rural-climate-financing-and-conservation',
    title: 'Direct Rural Climate Financing, Agronomic Environment Conservation and Sustainability Campaign Project',
    category: 'Climate Finance & Green Growth',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Channelling climate finance directly to rural farmers and communities for conservation and sustainable agriculture.',
    description: [
      'Channel climate finance directly to rural farmers and communities for conservation and sustainable agriculture practices.',
      'Aligned with SDG 13 (Climate Action) and SDG 15 (Life on Land).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.hoes[2],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'integrated-digital-platforms-for-agriculture-and-social-security',
    title: 'Integrated Digital Platforms for Agricultural Market Access and Social Security Protection',
    category: 'Digital Innovation',
    location: 'Uganda (Nationwide)',
    status: 'Planned',
    year: 2026,
    summary: 'Digital platforms connecting farmers to markets while onboarding them into social security systems.',
    description: [
      'Build digital platforms that connect farmers to markets, while onboarding them into social security systems.',
      'Aligned with SDG 9 (Innovation & Infrastructure), SDG 1 (No Poverty) and SDG 2 (Zero Hunger).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.hoes[4],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'integrated-primary-health-care-and-reproductive-health',
    title: 'Integrated Primary Health Care, Maternal, Newborn and Sexual and Reproductive Health Services',
    category: 'Healthcare',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Strengthening health systems in refugee-hosting districts — maternal and newborn care, reproductive health, immunisation, mental health and essential medicines.',
    description: [
      'Strengthen health systems in refugee-hosting districts by expanding maternal and newborn care, reproductive health, immunization, mental health, and essential medicines. Prioritises women, adolescent girls, children, persons with disabilities and vulnerable groups.',
      'Aligned with SDG 3 (Good Health & Well-being), SDG 5 (Gender Equality) and SDG 10 (Reduced Inequalities).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: `${IK_BUILD}/entebbe-health-center.jpg`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'accelerated-education-and-safe-learning-spaces',
    title: 'Accelerated Education, School Retention and Safe Learning Spaces',
    category: 'Education',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Accelerated learning for children with interrupted schooling, and better retention through teacher support and gender-responsive facilities.',
    description: [
      'Provide accelerated learning for children with interrupted schooling; improve retention through teacher support, psychosocial services, school feeding, and gender-responsive facilities. Focus on girls, children with disabilities, and at-risk learners.',
      'Aligned with SDG 4 (Quality Education), SDG 5 (Gender Equality) and SDG 10 (Reduced Inequalities).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.arovaSchool[3],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'integrated-refugee-protection-legal-aid-and-gbv-case-management',
    title: 'Integrated Refugee Protection, Legal Aid, GBV Prevention and Case Management',
    category: 'Refugee Support',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Community-based protection systems, legal aid, GBV prevention and response, child protection and psychosocial support.',
    description: [
      'Establish community-based protection systems, legal aid services, GBV prevention and response, child protection, and psychosocial support. Strengthen survivor-centered referral pathways and awareness of rights.',
      'Aligned with SDG 16 (Peace, Justice & Strong Institutions) and SDG 5 (Gender Equality).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: STOCK_PHOTOS.legalConsultation,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'sustainable-livelihoods-and-economic-inclusion',
    title: 'Sustainable Livelihoods, Skills Development and Economic Inclusion',
    category: 'Economic Development',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Vocational training, entrepreneurship development, financial inclusion, apprenticeships and enterprise support for refugees and host communities.',
    description: [
      'Provide vocational training, entrepreneurship development, financial inclusion, apprenticeships, and enterprise support to refugees and host communities, promoting resilience and self-reliance.',
      'Aligned with SDG 8 (Decent Work & Economic Growth) and SDG 1 (No Poverty).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.saloon[2],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'climate-smart-agriculture-and-food-security',
    title: 'Climate Smart Agriculture, Nutrition and Household Food Security',
    category: 'Agriculture & Food Security',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Climate-smart farming, drought-tolerant inputs, nutrition gardens, irrigation and agroforestry paired with nutrition education.',
    description: [
      'Introduce climate-smart farming, drought-tolerant inputs, nutrition gardens, irrigation, agroforestry, and market linkages, combined with nutrition education to strengthen resilience.',
      'Aligned with SDG 2 (Zero Hunger), SDG 13 (Climate Action) and SDG 15 (Life on Land).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: `${IK}/Oling-Dawn-Kerjew-/distributing_agricultural_tools_hoes_MG_7659.JPG`,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'alternative-clean-energy-and-environmental-restoration',
    title: 'Alternative Clean Energy — Safe Cooking and Environmental Restoration',
    category: 'Clean Energy',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Clean cookstoves, solar lighting and alternative fuels, paired with tree planting and restoration of degraded landscapes.',
    description: [
      'Expand access to clean cookstoves, solar lighting, alternative fuels, and institutional solar facilities. Support tree planting, agroforestry, and restoration of degraded landscapes.',
      'Aligned with SDG 7 (Affordable & Clean Energy), SDG 13 (Climate Action) and SDG 15 (Life on Land).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: STOCK_PHOTOS.solarCooker,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'peacebuilding-conflict-prevention-and-social-cohesion',
    title: 'Peacebuilding, Conflict Prevention and Social Cohesion',
    category: 'Peace & Governance',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Dialogue platforms, peace committees and mediation mechanisms alongside joint livelihood initiatives.',
    description: [
      'Establish dialogue platforms, peace committees, mediation mechanisms, and joint livelihood initiatives. Promote youth and women’s peacebuilding and collaborative natural resource management.',
      'Aligned with SDG 16 (Peace, Justice & Strong Institutions) and SDG 17 (Partnerships for the Goals).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.mosqueLira[2],
    gallery: [NEW_PHOTOS.mosqueLira[0], NEW_PHOTOS.mosqueLira[1], NEW_PHOTOS.mosqueLira[3], NEW_PHOTOS.mosqueLira[4]],
    publishStatus: 'published',
  },
  {
    slug: 'digital-skills-connectivity-and-employment',
    title: 'Digital Skills, Connectivity and Employment Opportunities for Informal Workers, Refugees and Youth',
    category: 'Digital Innovation',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Digital learning hubs and connectivity, linking youth to online work and entrepreneurship.',
    description: [
      'Create digital learning hubs, expand connectivity, provide digital literacy and employability training, and link youth to online work and entrepreneurship. Ensure inclusion of young women and disadvantaged groups.',
      'Aligned with SDG 9 (Industry, Innovation & Infrastructure) and SDG 8 (Decent Work & Economic Growth).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: NEW_PHOTOS.factorySalon[1],
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'refugee-information-management-and-coordination',
    title: 'Integrated Refugee Information Management, Accountability and Multi-Sector Coordination Project',
    category: 'Refugee Support',
    location: 'Refugee-hosting districts, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'Multisector assessments, service mapping, referral tracking and accountability systems, improving coordination across government, UN agencies, NGOs and the private sector.',
    description: [
      'Strengthen multisector assessments, service mapping, monitoring, referral tracking, community feedback, and accountability systems. Improve coordination among government, UN agencies, NGOs, and private sector.',
      'Aligned with SDG 16 (Peace, Justice & Strong Institutions) and SDG 17 (Partnerships for the Goals).',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation.',
    ],
    coverImage: STOCK_PHOTOS.serverRoom,
    gallery: [],
    publishStatus: 'published',
  },
  {
    slug: 'concrete-construction-facility-for-affordable-habitat',
    title: 'Establishment of Concrete Construction Facility for Affordable Habitat for Refugees and Vulnerable Host Communities',
    category: 'Low-Cost Construction',
    location: 'Refugee settlements & host communities, Uganda',
    status: 'Planned',
    year: 2026,
    summary: 'A sustainable low-cost construction facility producing affordable, durable, climate-resilient housing for refugees and vulnerable host households.',
    description: [
      'Develop a sustainable low-cost construction facility that produces affordable, durable housing units using locally available materials and climate-resilient designs — eco-friendly concrete technologies, modular construction methods, and community-driven housing cooperatives. Provides safe, dignified shelter for refugees and vulnerable host households, reducing overcrowding in settlements and strengthening resilience against climate shocks.',
      'Key components: affordable housing units for refugees and host communities; construction-skills training for youth and informal workers; green building standards and climate-smart designs; integrated sanitation, water and energy-efficient systems; and cooperative ownership and financing models.',
      'Aligned with SDG 11 (Sustainable Cities & Communities), SDG 9 (Industry, Innovation & Infrastructure), SDG 8 (Decent Work & Economic Growth) and SDG 13 (Climate Action). Adds a Habitat & Shelter dimension to the organisation’s wider National Refugee & Host Community Resilience Program, complementing its health, education and livelihoods work.',
      'This programme is at concept stage, submitted to the Robert Schuman Foundation and Trust, and is seeking donor partnership to move to implementation. See also the related, currently-published Low-Cost Construction case study for the modular building system this facility would scale.',
    ],
    coverImage: `${IK_BUILD}/build-02-transport.jpg`,
    gallery: [],
    publishStatus: 'published',
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
