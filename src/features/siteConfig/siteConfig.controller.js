import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { siteConfigSchema } from '../../../shared/schemas/siteConfig.schema.js';

export const getSiteConfig = async (req, res) => {
  const config = await prisma.siteConfig.findFirst();
  if (!config) return res.status(404).json({ message: 'Site config not set' });
  res.json(config);
};

export const putSiteConfig = async (req, res) => {
  const result = siteConfigSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const existing = await prisma.siteConfig.findFirst();
  const config = existing
    ? await prisma.siteConfig.update({ where: { id: existing.id }, data: result.data })
    : await prisma.siteConfig.create({ data: result.data });

  await writeAuditLog({
    action: 'Site settings updated',
    entityType: 'SiteConfig',
    entityId: config.id,
    actorId: req.userId,
    req,
  });

  res.json(config);
};
