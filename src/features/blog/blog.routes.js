import { Router } from 'express';
import { getPosts, getPostBySlug, createPost, updatePost, deletePost } from './blog.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', requireAuth, createPost);
router.patch('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

export default router;
