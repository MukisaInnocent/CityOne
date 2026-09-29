import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('public/login', { title: 'Log In' }));
router.get('/register', (req, res) => res.render('public/register', { title: 'Register' }));
router.get('/forgot-password', (req, res) => res.render('public/forgot_password', { title: 'Forgot Password' }));

// We will implement auth APIs in routes/api.js
// This file is just for the auth UI pages.

export default router;
