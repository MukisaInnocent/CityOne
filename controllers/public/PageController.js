import Tour from '../../models/Tour.js';
import Destination from '../../models/Destination.js';
import { logger } from '../../utils/logger.js';

export const home = async (req, res, next) => {
  try {
    const featuredTours = await Tour.findAll({ isFeatured: true, limit: 3 });
    const featuredDestinations = await Destination.findAll({ isFeatured: true, limit: 4 });
    
    res.render('public/home', {
      title: 'Home',
      tours: featuredTours,
      destinations: featuredDestinations
    });
  } catch (error) {
    logger.error('Error fetching home page data: ' + error.message);
    // Render with empty arrays if DB fails
    res.render('public/home', {
      title: 'Home',
      tours: [],
      destinations: []
    });
  }
};

export const about = (req, res) => {
  res.render('public/about', { title: 'About Us' });
};

export const contact = (req, res) => {
  res.render('public/contact', { title: 'Contact Us' });
};
