import prisma from '../../lib/prisma.js';
import { writeAuditLog } from '../../core/audit/auditLog.controller.js';
import { slugify } from '../../core/utils/slugify.js';
import { blogSchema, blogUpdateSchema } from '../../../shared/schemas/blog.schema.js';

export const getPosts = async (req, res) => {
  const { publishStatus } = req.query;
  const where = publishStatus ? { publishStatus } : {};
  const posts = await prisma.blogPost.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(posts);
};

export const getPostBySlug = async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

export const createPost = async (req, res) => {
  const result = blogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const data = { ...result.data, slug: result.data.slug?.trim() || slugify(result.data.title) };
  const post = await prisma.blogPost.create({ data });

  await writeAuditLog({
    action: 'Post created',
    entityType: 'BlogPost',
    entityId: post.id,
    actorId: req.userId,
    changes: { title: post.title },
    req,
  });

  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const result = blogUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }

  const data = { ...result.data };
  if (data.slug !== undefined) data.slug = data.slug.trim() || undefined;
  if (data.slug === undefined) delete data.slug;

  const post = await prisma.blogPost.update({ where: { id: req.params.id }, data });

  await writeAuditLog({
    action: 'Post updated',
    entityType: 'BlogPost',
    entityId: post.id,
    actorId: req.userId,
    changes: result.data,
    req,
  });

  res.json(post);
};

export const deletePost = async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } });

  await writeAuditLog({
    action: 'Post deleted',
    entityType: 'BlogPost',
    entityId: req.params.id,
    actorId: req.userId,
    severity: 'Warning',
    req,
  });

  res.json({ message: 'Post deleted' });
};
