/*
  Force-seed a single admin account.

  seed.js deliberately applies passwords only on create, so it can never clobber
  a password someone changed from the dashboard. That also means it cannot fix
  an account whose password has drifted. This script is the explicit override:
  it sets the password whether the row exists or not, and verifies the hash by
  reading it back.

    npm run seed:account
    npm run seed:account -- <email> <password> "<name>" "<role>"
*/
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const [email, password, name, role] = [
  process.argv[2] || 'info@olingdawnkerjewprojects.org',
  process.argv[3] || 'freedom2022025',
  process.argv[4] || 'Oling Dawn Kerjew',
  process.argv[5] || 'Administrator',
];

async function main() {
  const existing = await prisma.user.findUnique({ where: { email } });
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash, isActive: true },
    create: { name, email, passwordHash, role },
  });

  // Verify against what actually landed in the database, not the write result.
  const user = await prisma.user.findUnique({ where: { email } });
  const verified = await bcrypt.compare(password, user.passwordHash);
  if (!verified) throw new Error(`Password did not verify for ${email}`);

  console.log(`${existing ? 'Updated' : 'Created'} ${email} (${user.role}) — password verified, isActive=${user.isActive}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
