import { Router } from 'express';
import { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } from './project.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', requireAuth, createProject);
router.patch('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
