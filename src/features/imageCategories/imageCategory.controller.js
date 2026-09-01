import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { imageCategorySchema, imageCategoryUpdateSchema, reorderSchema } from '../../../shared/schemas/imageCategory.schema.js';

export const getImageCategories = async (req, res) => {
  const categories = await prisma.imageCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(categories);
};

export const createImageCategory = async (req, res) => {
  const result = imageCategorySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const count = await prisma.imageCategory.count();
  const category = await prisma.imageCategory.create({
    data: { ...result.data, sortOrder: result.data.sortOrder ?? count },
  });

  await writeAuditLog({
    action: 'Image category created',
    entityType: 'ImageCategory',
    entityId: category.id,
    actorId: req.userId,
    changes: { name: category.name },
    req,
  });

  req.app.get('io')?.emit('imageCategories:created', category);
  res.status(201).json(category);
};

export const updateImageCategory = async (req, res) => {
  const result = imageCategoryUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const existing = await prisma.imageCategory.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Category not found' });

  const category = await prisma.imageCategory.update({ where: { id: req.params.id }, data: result.data });

  if (result.data.name && result.data.name !== existing.name) {
    await prisma.media.updateMany({ where: { tag: existing.name }, data: { tag: category.name } });
    req.app.get('io')?.emit('media:categoryRenamed', { from: existing.name, to: category.name });
  }

  await writeAuditLog({
    action: 'Image category updated',
    entityType: 'ImageCategory',
    entityId: category.id,
    actorId: req.userId,
    changes: result.data,
    req,
  });

  req.app.get('io')?.emit('imageCategories:updated', category);
  res.json(category);
};

export const deleteImageCategory = async (req, res) => {
  await prisma.imageCategory.delete({ where: { id: req.params.id } });

  await writeAuditLog({
    action: 'Image category deleted',
    entityType: 'ImageCategory',
    entityId: req.params.id,
    actorId: req.userId,
    severity: 'Warning',
    req,
  });

  req.app.get('io')?.emit('imageCategories:deleted', { id: req.params.id });
  res.json({ message: 'Category deleted' });
};

export const reorderImageCategories = async (req, res) => {
  const result = reorderSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  await prisma.$transaction(
    result.data.map(({ id, sortOrder }) => prisma.imageCategory.update({ where: { id }, data: { sortOrder } })),
  );

  const categories = await prisma.imageCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  req.app.get('io')?.emit('imageCategories:reordered', categories);
  res.json(categories);
};
