import { db } from '../config/database.js';

class Destination {
  static async findAll(filters = {}) {
    const query = db('destinations')
      .select('destinations.*', 'countries.name as country_name')
      .leftJoin('countries', 'destinations.country_id', 'countries.id')
      .where('destinations.is_active', true);

    if (filters.isFeatured) {
      query.where('destinations.is_featured', true);
    }
    
    if (filters.limit) {
      query.limit(filters.limit);
    }

    return await query.orderBy('destinations.sort_order', 'asc');
  }

  static async findBySlug(slug) {
    return await db('destinations')
      .select('destinations.*', 'countries.name as country_name')
      .leftJoin('countries', 'destinations.country_id', 'countries.id')
      .where('destinations.slug', slug)
      .andWhere('destinations.is_active', true)
      .first();
  }
}

export default Destination;
