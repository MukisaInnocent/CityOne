import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all customer routes
router.use(requireAuth);
router.use(requireRole('customer'));

router.get('/', (req, res) => res.render('customer/dashboard', { title: 'My Dashboard' }));
router.get('/bookings', (req, res) => res.render('customer/bookings', { title: 'My Bookings' }));
router.get('/profile', (req, res) => res.render('customer/profile', { title: 'My Profile' }));

export default router;
