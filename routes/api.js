import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import * as AuthController from '../controllers/api/AuthController.js';

const router = express.Router();

// Auth Endpoints
router.post('/auth/login', authLimiter, AuthController.login);
router.post('/auth/register', authLimiter, AuthController.register);
router.post('/auth/logout', AuthController.logout);

export default router;
