import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as PageController from '../controllers/public/PageController.js';
import * as TourController from '../controllers/public/TourController.js';
import * as DestinationController from '../controllers/public/DestinationController.js';

const router = express.Router();

router.get('/', PageController.home);
router.get('/about', PageController.about);
router.get('/contact', PageController.contact);

router.get('/tours', TourController.listTours);
router.get('/tours/:slug', TourController.tourDetails);

router.get('/destinations', DestinationController.listDestinations);
router.get('/destinations/:slug', DestinationController.destinationDetails);

export default router;
