import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './utils/logger.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { db } from './config/database.js';

// Routes
import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import customerRoutes from './routes/customer.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// ─── View Engine ──────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// ─── Security Headers ─────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.tile.openstreetmap.org", "blob:"],
      connectSrc: ["'self'", "https://v6.exchangerate-api.com"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// ─── Core Middleware ──────────────────────────────────────
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(generalLimiter);

// ─── Static Files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  etag: true
}));

// ─── Authentication (sets req.user on every request) ──────
app.use(authenticate);

// ─── Template Globals ─────────────────────────────────────
app.use(async (req, res, next) => {
  // Load site settings from DB for templates
  try {
    const settings = await db('site_settings').select('setting_key', 'setting_value');
    const siteSettings = {};
    settings.forEach(s => { siteSettings[s.setting_key] = s.setting_value; });
    res.locals.site = {
      name: siteSettings.site_name || 'City One Adventures',
      tagline: siteSettings.site_tagline || 'Uganda Tours, Safaris & Travel Experiences',
      email: siteSettings.contact_email || 'info@cityoneadventure.com',
      phone: siteSettings.contact_phone || '0786870308',
      address: siteSettings.contact_address || 'Kampala Road, Liberty Tower, Level 3',
      city: siteSettings.contact_city || 'Kampala, Uganda',
      whatsapp: siteSettings.contact_whatsapp || '0786870308',
      facebook: siteSettings.social_facebook || '',
      instagram: siteSettings.social_instagram || '',
      twitter: siteSettings.social_twitter || '',
      youtube: siteSettings.social_youtube || '',
      currency: siteSettings.default_currency || 'USD',
      ga_id: siteSettings.ga_measurement_id || process.env.GA_MEASUREMENT_ID || ''
    };
  } catch (err) {
    // DB might not be set up yet
    res.locals.site = {
      name: 'City One Adventures',
      tagline: 'Uganda Tours, Safaris & Travel Experiences',
      email: 'info@cityoneadventure.com',
      phone: '0786870308',
      address: 'Kampala Road, Liberty Tower, Level 3',
      city: 'Kampala, Uganda',
      whatsapp: '0786870308',
      facebook: 'https://facebook.com/CityOneAdventures',
      instagram: 'https://instagram.com/CityOneAdventures',
      twitter: 'https://twitter.com/CityOneAdventures',
      youtube: 'https://youtube.com/@CityOneAdventures',
      currency: 'USD', ga_id: ''
    };
  }
  res.locals.currentPath = req.path;
  res.locals.layout = req.path.startsWith('/admin') ? 'layouts/admin' : 'layouts/main';
  res.locals.appUrl = process.env.APP_URL || 'http://localhost:3000';
  next();
});

// ─── Routes ───────────────────────────────────────────────
app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/api', apiRoutes);
app.use('/account', customerRoutes);
app.use('/admin', adminRoutes);

// ─── Error Handling ───────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
async function startServer() {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    logger.info('Database connected successfully');
  } catch (err) {
    logger.warn('Database not available — server will start but DB features will not work');
    logger.warn('Run "npm run db:setup" to initialize the database');
  }

  app.listen(PORT, () => {
    logger.info(`City One Adventures running at http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

export default app;
