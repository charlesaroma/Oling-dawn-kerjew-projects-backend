import { Router } from 'express';
import { getSiteConfig, putSiteConfig } from './siteConfig.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.get('/', getSiteConfig);
router.put('/', requireAuth, putSiteConfig);

export default router;
