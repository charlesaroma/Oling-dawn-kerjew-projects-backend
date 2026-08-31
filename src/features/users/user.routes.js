import { Router } from 'express';
import { getMe } from './user.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.get('/me', requireAuth, getMe);

export default router;
