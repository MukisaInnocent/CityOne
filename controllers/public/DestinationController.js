import Destination from '../../models/Destination.js';
import { logger } from '../../utils/logger.js';

export const listDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll();
    res.render('public/destinations', {
      title: 'Destinations',
      destinations
    });
  } catch (error) {
    logger.error('Error fetching destinations: ' + error.message);
    res.render('public/destinations', {
      title: 'Destinations',
      destinations: []
    });
  }
};

export const destinationDetails = async (req, res, next) => {
  try {
    const destination = await Destination.findBySlug(req.params.slug);
    
    if (!destination) {
      return next(); // Pass to 404 handler
    }
    
    res.render('public/destination_details', {
      title: destination.name,
      destination,
      meta_description: destination.meta_description || destination.short_description
    });
  } catch (error) {
    next(error);
  }
};
