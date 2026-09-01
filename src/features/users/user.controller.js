import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { updateAccountSchema } from '../../../shared/schemas/user.schema.js';

export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateMe = async (req, res) => {
  const result = updateAccountSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: result.data,
    select: { id: true, name: true, email: true, role: true },
  });

  await writeAuditLog({
    action: 'Account details updated',
    entityType: 'User',
    entityId: user.id,
    actorId: req.userId,
    changes: result.data,
    req,
  });

  res.json(user);
};
