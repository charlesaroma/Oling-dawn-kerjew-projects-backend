import { Router } from 'express';
import { getProfiles, getProfile, createProfile, updateProfile, deleteProfile } from './profile.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getProfiles);
router.get('/:id', getProfile);
router.post('/', createProfile);
router.patch('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router;
