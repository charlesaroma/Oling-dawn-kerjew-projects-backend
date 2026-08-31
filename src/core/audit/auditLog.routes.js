import { Router } from 'express';
import { getAuditLogs } from './auditLog.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, getAuditLogs);

export default router;
