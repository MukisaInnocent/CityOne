import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(requireAuth);
router.use(requireRole('super_admin', 'admin', 'staff'));

router.get('/', (req, res) => res.render('admin/dashboard', { title: 'Admin Dashboard' }));
router.get('/tours', (req, res) => res.render('admin/tours/index', { title: 'Manage Tours' }));
router.get('/destinations', (req, res) => res.render('admin/destinations/index', { title: 'Manage Destinations' }));
router.get('/bookings', (req, res) => res.render('admin/bookings/index', { title: 'Manage Bookings' }));
router.get('/users', requireRole('super_admin', 'admin'), (req, res) => res.render('admin/users/index', { title: 'Manage Users' }));
router.get('/settings', requireRole('super_admin'), (req, res) => res.render('admin/settings/index', { title: 'Site Settings' }));

export default router;
