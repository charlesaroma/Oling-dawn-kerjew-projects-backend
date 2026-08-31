import prisma from '../lib/prisma.js';

export async function connectDB() {
  await prisma.$connect();
  console.log('MongoDB connected');
}
