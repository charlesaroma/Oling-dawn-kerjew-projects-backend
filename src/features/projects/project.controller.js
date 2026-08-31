import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { slugify } from '../../core/utils/slugify.js';
import { projectSchema, projectUpdateSchema } from '../../../shared/schemas/project.schema.js';

export const getProjects = async (req, res) => {
  const { publishStatus } = req.query;
  const where = publishStatus ? { publishStatus } : {};
  const projects = await prisma.project.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(projects);
};

export const getProjectBySlug = async (req, res) => {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const createProject = async (req, res) => {
  const result = projectSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const data = { ...result.data, slug: result.data.slug?.trim() || slugify(result.data.title) };
  const project = await prisma.project.create({ data });

  await writeAuditLog({
    action: 'Project created',
    entityType: 'Project',
    entityId: project.id,
    actorId: req.userId,
    changes: { title: project.title },
    req,
  });

  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const result = projectUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const data = { ...result.data };
  if (data.slug !== undefined) data.slug = data.slug.trim() || undefined;
  if (data.slug === undefined) delete data.slug;

  const project = await prisma.project.update({ where: { id: req.params.id }, data });

  await writeAuditLog({
    action: 'Project updated',
    entityType: 'Project',
    entityId: project.id,
    actorId: req.userId,
    changes: result.data,
    req,
  });

  res.json(project);
};

export const deleteProject = async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });

  await writeAuditLog({
    action: 'Project deleted',
    entityType: 'Project',
    entityId: req.params.id,
    actorId: req.userId,
    severity: 'Warning',
    req,
  });

  res.json({ message: 'Project deleted' });
};
