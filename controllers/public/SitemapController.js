import { db } from '../../config/database.js';

export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || 'https://cityoneadventure.com';
    
    // Fetch dynamic content
    const tours = await db('tour_packages').select('slug', 'updated_at').where('status', 'published');
    const destinations = await db('destinations').select('slug', 'updated_at').where('is_active', true);
    
    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Static routes
    const staticRoutes = ['', '/tours', '/destinations', '/about', '/contact', '/login', '/register'];
    const now = new Date().toISOString();
    
    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }
    
    // Dynamic tours
    for (const tour of tours) {
      const lastmod = tour.updated_at ? new Date(tour.updated_at).toISOString() : now;
      xml += `  <url>\n    <loc>${baseUrl}/tours/${tour.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }
    
    // Dynamic destinations
    for (const dest of destinations) {
      const lastmod = dest.updated_at ? new Date(dest.updated_at).toISOString() : now;
      xml += `  <url>\n    <loc>${baseUrl}/destinations/${dest.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).end();
  }
};
