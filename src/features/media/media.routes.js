import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../core/middlewares/auth.middleware.js';
import {
  getMedia, getMediaItem, createMedia, deleteMedia, getAuthParams, recordMedia, updateMedia,
} from './media.controller.js';
import { handleWebhook } from './media.webhook.controller.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const router = Router();

// Public — the marketing site's Gallery page reads the media library
// directly, unauthenticated, same as Project/BlogPost/TeamMember GETs.
router.get('/', getMedia);

// Public — called by ImageKit itself, not a logged-in user. Authenticated
// via HMAC signature instead of a JWT (see media.webhook.controller.js).
// Requires the raw request body, carved out ahead of express.json() in app.js.
router.post('/webhook', handleWebhook);

router.use(requireAuth);
router.get('/auth', getAuthParams);
router.post('/record', recordMedia);
router.get('/:id', getMediaItem);
router.post('/', upload.array('files', 20), createMedia);
router.patch('/:id', updateMedia);
router.delete('/:id', deleteMedia);

export default router;
