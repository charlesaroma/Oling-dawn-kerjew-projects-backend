import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { teamMemberSchema, teamMemberUpdateSchema } from '../../../shared/schemas/team.schema.js';

export const getTeam = async (req, res) => {
  const team = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(team);
};

export const createTeamMember = async (req, res) => {
  const result = teamMemberSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const member = await prisma.teamMember.create({ data: result.data });

  await writeAuditLog({
    action: 'Team member added',
    entityType: 'TeamMember',
    entityId: member.id,
    actorId: req.userId,
    changes: { name: member.name },
    req,
  });

  res.status(201).json(member);
};

export const updateTeamMember = async (req, res) => {
  const result = teamMemberUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const member = await prisma.teamMember.update({ where: { id: req.params.id }, data: result.data });

  await writeAuditLog({
    action: 'Team member updated',
    entityType: 'TeamMember',
    entityId: member.id,
    actorId: req.userId,
    changes: result.data,
    req,
  });

  res.json(member);
};

export const deleteTeamMember = async (req, res) => {
  await prisma.teamMember.delete({ where: { id: req.params.id } });

  await writeAuditLog({
    action: 'Team member removed',
    entityType: 'TeamMember',
    entityId: req.params.id,
    actorId: req.userId,
    severity: 'Warning',
    req,
  });

  res.json({ message: 'Team member removed' });
};
