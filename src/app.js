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

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

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
