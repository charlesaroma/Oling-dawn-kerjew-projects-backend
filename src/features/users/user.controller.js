import prisma from '../../lib/prisma.js';

export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};
