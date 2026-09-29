import { db } from '../../config/database.js';

class Tour {
  static async findAll(filters = {}) {
    const query = db('tour_packages')
      .select('tour_packages.*', 'tour_categories.name as category_name')
      .leftJoin('tour_categories', 'tour_packages.category_id', 'tour_categories.id')
      .where('tour_packages.status', 'published');

    if (filters.isFeatured) {
      query.where('tour_packages.is_featured', true);
    }
    
    if (filters.limit) {
      query.limit(filters.limit);
    }

    return await query.orderBy('sort_order', 'asc');
  }

  static async findBySlug(slug) {
    const tour = await db('tour_packages')
      .select('tour_packages.*', 'tour_categories.name as category_name')
      .leftJoin('tour_categories', 'tour_packages.category_id', 'tour_categories.id')
      .where('tour_packages.slug', slug)
      .andWhere('tour_packages.status', 'published')
      .first();

    if (!tour) return null;

    // Fetch related data
    const [itineraries, images, inclusions] = await Promise.all([
      db('tour_itineraries').where('tour_id', tour.id).orderBy('day_number', 'asc'),
      db('tour_images').where('tour_id', tour.id).orderBy('sort_order', 'asc'),
      db('tour_inclusions').where('tour_id', tour.id).orderBy('sort_order', 'asc')
    ]);

    tour.itineraries = itineraries;
    tour.images = images;
    tour.included = inclusions.filter(i => i.type === 'included');
    tour.excluded = inclusions.filter(i => i.type === 'excluded');

    return tour;
  }
}

export default Tour;
