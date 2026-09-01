import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';

import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/users/user.routes.js';
import profileRoutes from './features/profiles/profile.routes.js';
import projectRoutes from './features/projects/project.routes.js';
import blogRoutes from './features/blog/blog.routes.js';
import teamRoutes from './features/team/team.routes.js';
import siteConfigRoutes from './features/siteConfig/siteConfig.routes.js';
import mediaRoutes from './features/media/media.routes.js';
import imageCategoryRoutes from './features/imageCategories/imageCategory.routes.js';
import auditLogRoutes from './core/audit/auditLog.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const statusHtml = readFileSync(join(__dirname, 'views', 'status.html'), 'utf-8')
  .replace('__ENVIRONMENT__', env.NODE_ENV || 'development');

const app = express();

// FRONTEND_URL may be a comma-separated list (production domain + local dev),
// matching the lakes-of-grace reference's pattern. Exported so server.js can
// reuse the same list for socket.io's CORS config.
// Trailing slashes are stripped so a stray "/" in the FRONTEND_URL env var
// (browsers never send one in the Origin header) can't silently break CORS.
export const allowedOrigins = env.FRONTEND_URL.split(',').map((s) => s.trim().replace(/\/+$/, ''));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'https://olingdawnkerjewprojects.org', 'https://ik.imagekit.io'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    },
  },
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());

// The ImageKit webhook needs the raw request body to verify its HMAC
// signature — this carve-out must be registered before the global JSON
// parser below, or req.body arrives already parsed and verification breaks.
app.use('/api/media/webhook', (req, res, next) => {
  if (req.method === 'POST') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
});

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

app.get('/', (req, res) => {
  res.type('html').send(statusHtml);
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/site-config', siteConfigRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/image-categories', imageCategoryRoutes);
app.use('/api/audit-logs', auditLogRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

export default app;
