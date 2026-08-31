import { Router } from 'express';
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from './team.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.get('/', getTeam);
router.post('/', requireAuth, createTeamMember);
router.patch('/:id', requireAuth, updateTeamMember);
router.delete('/:id', requireAuth, deleteTeamMember);

export default router;
