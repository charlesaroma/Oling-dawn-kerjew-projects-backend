import prisma from '../../lib/prisma.js';

export const getAuditLogs = async (req, res) => {
  const { entityType, entityId } = req.query;
  const where = {};
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(logs);
};

export async function writeAuditLog({ action, entityType, entityId, actorId, actorName, changes, severity, req }) {
  return prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      actorId,
      actorName,
      changes,
      severity: severity || 'Info',
      ipAddress: req?.ip,
      userAgent: req?.get?.('user-agent'),
    },
  });
}
