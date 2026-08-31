import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';
import {
  getMedia, getMediaItem, createMedia, deleteMedia, getAuthParams, recordMedia, updateMedia,
} from './media.controller.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const router = Router();

router.use(requireAuth);
router.get('/', getMedia);
router.get('/auth', getAuthParams);
router.post('/record', recordMedia);
router.get('/:id', getMediaItem);
router.post('/', upload.array('files', 20), createMedia);
router.patch('/:id', updateMedia);
router.delete('/:id', deleteMedia);

export default router;
