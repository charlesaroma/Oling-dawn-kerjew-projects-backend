import { Router } from 'express';
import {
  getImageCategories, createImageCategory, updateImageCategory, deleteImageCategory, reorderImageCategories,
} from './imageCategory.controller.js';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getImageCategories);
router.post('/', createImageCategory);
router.put('/reorder', reorderImageCategories);
router.patch('/:id', updateImageCategory);
router.delete('/:id', deleteImageCategory);

export default router;
