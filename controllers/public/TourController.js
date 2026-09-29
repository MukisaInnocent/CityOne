import Tour from '../../models/Tour.js';
import { logger } from '../../utils/logger.js';

export const listTours = async (req, res, next) => {
  try {
    const tours = await Tour.findAll();
    res.render('public/tours', {
      title: 'Our Tours',
      tours
    });
  } catch (error) {
    logger.error('Error fetching tours: ' + error.message);
    res.render('public/tours', {
      title: 'Our Tours',
      tours: []
    });
  }
};

export const tourDetails = async (req, res, next) => {
  try {
    const tour = await Tour.findBySlug(req.params.slug);
    
    if (!tour) {
      return next(); // Pass to 404 handler
    }
    
    res.render('public/tour_details', {
      title: tour.title,
      tour,
      meta_description: tour.meta_description || tour.short_description
    });
  } catch (error) {
    next(error);
  }
};
