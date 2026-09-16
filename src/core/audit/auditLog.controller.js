import prisma from '../../lib/prisma.js';

export const getAuditLogs = async (req, res) => {
  const { entityType, entityId, severity } = req.query;
  const where = {};
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  if (severity) where.severity = severity;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { actor: { select: { name: true, email: true } } },
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
