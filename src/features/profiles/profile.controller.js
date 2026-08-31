import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { profileSchema, profileUpdateSchema } from '../../../shared/schemas/profile.schema.js';

export const getProfiles = async (req, res) => {
  const profiles = await prisma.profile.findMany({ orderBy: { registeredDate: 'desc' } });
  res.json(profiles);
};

export const getProfile = async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { id: req.params.id } });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};

export const createProfile = async (req, res) => {
  const result = profileSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const profile = await prisma.profile.create({ data: result.data });

  await writeAuditLog({
    action: 'Profile created',
    entityType: 'Profile',
    entityId: profile.id,
    actorId: req.userId,
    changes: { fullName: profile.fullName },
    req,
  });

  res.status(201).json(profile);
};

export const updateProfile = async (req, res) => {
  const result = profileUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const profile = await prisma.profile.update({ where: { id: req.params.id }, data: result.data });

  await writeAuditLog({
    action: 'Profile updated',
    entityType: 'Profile',
    entityId: profile.id,
    actorId: req.userId,
    changes: result.data,
    req,
  });

  res.json(profile);
};

export const deleteProfile = async (req, res) => {
  await prisma.profile.delete({ where: { id: req.params.id } });

  await writeAuditLog({
    action: 'Profile deleted',
    entityType: 'Profile',
    entityId: req.params.id,
    actorId: req.userId,
    severity: 'Warning',
    req,
  });

  res.json({ message: 'Profile deleted' });
};
