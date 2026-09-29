/**
 * Seed Data — City One Adventures
 * Realistic demo data for development and testing
 */
import bcrypt from 'bcrypt';

export async function seed(knex) {
  // Clear all tables in reverse dependency order
  const tables = [
    'email_logs', 'audit_logs', 'media', 'faqs', 'pages', 'site_settings',
    'enquiries', 'contact_messages', 'notifications', 'reviews',
    'visa_requirements', 'transport_bookings', 'transportation',
    'hotel_bookings', 'hotel_rooms', 'hotels',
    'refunds', 'payment_transactions', 'payments',
    'booking_status_history', 'booking_items', 'booking_passengers', 'bookings',
    'tour_availability', 'tour_destinations', 'tour_inclusions', 'tour_images',
    'tour_itineraries', 'tour_packages', 'tour_categories',
    'destinations', 'currencies', 'countries',
    'password_resets', 'users', 'departments',
    'role_permissions', 'permissions', 'roles'
  ];

  for (const table of tables) {
    await knex(table).del();
  }

  // ─── ROLES ───────────────────────────────────────────────
  await knex('roles').insert([
    { id: 1, name: 'super_admin', display_name: 'Super Administrator', description: 'Full system access', is_system: true },
    { id: 2, name: 'admin', display_name: 'Administrator', description: 'Manage operational content and bookings', is_system: true },
    { id: 3, name: 'staff', display_name: 'Staff', description: 'Access assigned modules', is_system: true },
    { id: 4, name: 'customer', display_name: 'Customer', description: 'Access own profile, bookings and reviews', is_system: true }
  ]);

  // ─── PERMISSIONS ─────────────────────────────────────────
  const permissionModules = {
    users: ['view', 'create', 'edit', 'delete'],
    tours: ['view', 'create', 'edit', 'delete', 'publish'],
    destinations: ['view', 'create', 'edit', 'delete'],
    bookings: ['view', 'create', 'edit', 'cancel', 'confirm'],
    payments: ['view', 'process', 'refund'],
    hotels: ['view', 'create', 'edit', 'delete'],
    transport: ['view', 'create', 'edit', 'delete'],
    reviews: ['view', 'moderate', 'delete'],
    content: ['view', 'edit'],
    settings: ['view', 'edit'],
    reports: ['view', 'export'],
    media: ['view', 'upload', 'delete']
  };

  const permissions = [];
  let permId = 1;
  for (const [mod, actions] of Object.entries(permissionModules)) {
    for (const action of actions) {
      permissions.push({
        id: permId++,
        name: `${mod}.${action}`,
        display_name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${mod}`,
        module: mod
      });
    }
  }
  await knex('permissions').insert(permissions);

  // Super admin gets all permissions
  const allPerms = permissions.map(p => ({ role_id: 1, permission_id: p.id }));
  await knex('role_permissions').insert(allPerms);

  // Admin gets most permissions
  const adminPerms = permissions
    .filter(p => !['users.delete', 'settings.edit'].includes(p.name))
    .map(p => ({ role_id: 2, permission_id: p.id }));
  await knex('role_permissions').insert(adminPerms);

  // Staff gets limited permissions
  const staffPerms = permissions
    .filter(p => ['tours.view', 'destinations.view', 'bookings.view', 'bookings.confirm', 'reviews.view', 'hotels.view', 'transport.view'].includes(p.name))
    .map(p => ({ role_id: 3, permission_id: p.id }));
  await knex('role_permissions').insert(staffPerms);

  // ─── DEPARTMENTS ─────────────────────────────────────────
  await knex('departments').insert([
    { id: 1, name: 'Management', description: 'Company management and leadership' },
    { id: 2, name: 'Operations', description: 'Tour operations and logistics' },
    { id: 3, name: 'Sales', description: 'Sales and customer acquisition' },
    { id: 4, name: 'Customer Service', description: 'Customer support and relations' },
    { id: 5, name: 'Marketing', description: 'Marketing and promotions' }
  ]);

  // ─── USERS ───────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const customerPassword = await bcrypt.hash('Customer@123', 12);

  await knex('users').insert([
    {
      id: 1, email: 'admin@cityoneadventure.com', password_hash: hashedPassword,
      first_name: 'System', last_name: 'Administrator', phone: '+256786870308',
      role_id: 1, department_id: 1, is_active: true, email_verified: true
    },
    {
      id: 2, email: 'manager@cityoneadventure.com', password_hash: hashedPassword,
      first_name: 'James', last_name: 'Mukisa', phone: '+256700123456',
      role_id: 2, department_id: 1, is_active: true, email_verified: true
    },
    {
      id: 3, email: 'staff@cityoneadventure.com', password_hash: hashedPassword,
      first_name: 'Grace', last_name: 'Namara', phone: '+256701234567',
      role_id: 3, department_id: 2, is_active: true, email_verified: true
    },
    {
      id: 4, email: 'demo@customer.com', password_hash: customerPassword,
      first_name: 'John', last_name: 'Smith', phone: '+1555123456',
      role_id: 4, country_code: 'US', city: 'New York', is_active: true, email_verified: true,
      nationality: 'American'
    },
    {
      id: 5, email: 'sarah@customer.com', password_hash: customerPassword,
      first_name: 'Sarah', last_name: 'Johnson', phone: '+44789654123',
      role_id: 4, country_code: 'GB', city: 'London', is_active: true, email_verified: true,
      nationality: 'British'
    }
  ]);

  // ─── COUNTRIES (key countries) ───────────────────────────
  const countries = [
    { id: 1, name: 'Uganda', code: 'UG', code3: 'UGA', phone_code: '+256', currency_code: 'UGX', continent: 'Africa', region: 'East Africa', flag_emoji: '🇺🇬' },
    { id: 2, name: 'Kenya', code: 'KE', code3: 'KEN', phone_code: '+254', currency_code: 'KES', continent: 'Africa', region: 'East Africa', flag_emoji: '🇰🇪' },
    { id: 3, name: 'Tanzania', code: 'TZ', code3: 'TZA', phone_code: '+255', currency_code: 'TZS', continent: 'Africa', region: 'East Africa', flag_emoji: '🇹🇿' },
    { id: 4, name: 'Rwanda', code: 'RW', code3: 'RWA', phone_code: '+250', currency_code: 'RWF', continent: 'Africa', region: 'East Africa', flag_emoji: '🇷🇼' },
    { id: 5, name: 'South Africa', code: 'ZA', code3: 'ZAF', phone_code: '+27', currency_code: 'ZAR', continent: 'Africa', region: 'Southern Africa', flag_emoji: '🇿🇦' },
    { id: 6, name: 'United States', code: 'US', code3: 'USA', phone_code: '+1', currency_code: 'USD', continent: 'North America', region: 'North America', flag_emoji: '🇺🇸' },
    { id: 7, name: 'United Kingdom', code: 'GB', code3: 'GBR', phone_code: '+44', currency_code: 'GBP', continent: 'Europe', region: 'Western Europe', flag_emoji: '🇬🇧' },
    { id: 8, name: 'Canada', code: 'CA', code3: 'CAN', phone_code: '+1', currency_code: 'CAD', continent: 'North America', region: 'North America', flag_emoji: '🇨🇦' },
    { id: 9, name: 'Australia', code: 'AU', code3: 'AUS', phone_code: '+61', currency_code: 'AUD', continent: 'Oceania', region: 'Oceania', flag_emoji: '🇦🇺' },
    { id: 10, name: 'Germany', code: 'DE', code3: 'DEU', phone_code: '+49', currency_code: 'EUR', continent: 'Europe', region: 'Western Europe', flag_emoji: '🇩🇪' },
    { id: 11, name: 'France', code: 'FR', code3: 'FRA', phone_code: '+33', currency_code: 'EUR', continent: 'Europe', region: 'Western Europe', flag_emoji: '🇫🇷' },
    { id: 12, name: 'India', code: 'IN', code3: 'IND', phone_code: '+91', currency_code: 'INR', continent: 'Asia', region: 'South Asia', flag_emoji: '🇮🇳' },
    { id: 13, name: 'China', code: 'CN', code3: 'CHN', phone_code: '+86', currency_code: 'CNY', continent: 'Asia', region: 'East Asia', flag_emoji: '🇨🇳' },
    { id: 14, name: 'Japan', code: 'JP', code3: 'JPN', phone_code: '+81', currency_code: 'JPY', continent: 'Asia', region: 'East Asia', flag_emoji: '🇯🇵' },
    { id: 15, name: 'Brazil', code: 'BR', code3: 'BRA', phone_code: '+55', currency_code: 'BRL', continent: 'South America', region: 'South America', flag_emoji: '🇧🇷' },
    { id: 16, name: 'Nigeria', code: 'NG', code3: 'NGA', phone_code: '+234', currency_code: 'NGN', continent: 'Africa', region: 'West Africa', flag_emoji: '🇳🇬' },
    { id: 17, name: 'Egypt', code: 'EG', code3: 'EGY', phone_code: '+20', currency_code: 'EGP', continent: 'Africa', region: 'North Africa', flag_emoji: '🇪🇬' },
    { id: 18, name: 'Ethiopia', code: 'ET', code3: 'ETH', phone_code: '+251', currency_code: 'ETB', continent: 'Africa', region: 'East Africa', flag_emoji: '🇪🇹' },
    { id: 19, name: 'DR Congo', code: 'CD', code3: 'COD', phone_code: '+243', currency_code: 'CDF', continent: 'Africa', region: 'Central Africa', flag_emoji: '🇨🇩' },
    { id: 20, name: 'United Arab Emirates', code: 'AE', code3: 'ARE', phone_code: '+971', currency_code: 'AED', continent: 'Asia', region: 'Middle East', flag_emoji: '🇦🇪' }
  ];
  await knex('countries').insert(countries);

  // ─── CURRENCIES ──────────────────────────────────────────
  await knex('currencies').insert([
    { code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate: 1.000000, is_active: true },
    { code: 'EUR', name: 'Euro', symbol: '€', exchange_rate: 0.920000, is_active: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', exchange_rate: 0.790000, is_active: true },
    { code: 'UGX', name: 'Uganda Shilling', symbol: 'UGX', exchange_rate: 3750.000000, is_active: true },
    { code: 'KES', name: 'Kenya Shilling', symbol: 'KES', exchange_rate: 153.000000, is_active: true },
    { code: 'TZS', name: 'Tanzania Shilling', symbol: 'TZS', exchange_rate: 2510.000000, is_active: true },
    { code: 'RWF', name: 'Rwanda Franc', symbol: 'RWF', exchange_rate: 1280.000000, is_active: true },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchange_rate: 1.360000, is_active: true },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchange_rate: 1.530000, is_active: true },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', exchange_rate: 18.200000, is_active: true }
  ]);

  // ─── DESTINATIONS ────────────────────────────────────────
  await knex('destinations').insert([
    {
      id: 1, name: 'Kampala', slug: 'kampala', country_id: 1, region: 'Central Uganda',
      short_description: 'A vibrant city mix of culture, food, markets, and modern urban energy.',
      description: 'Kampala, the capital of Uganda, is a bustling metropolis set on seven hills. It offers a rich blend of modern urban life and deep-rooted cultural heritage. Visitors can explore the Kasubi Tombs, Uganda Museum, vibrant Owino Market, and the city\'s diverse culinary scene. The nightlife is lively, and the city serves as a gateway to all of Uganda\'s natural wonders.',
      attractions: 'Kasubi Tombs, Uganda Museum, Owino Market, Gadafi Mosque, Ndere Cultural Centre, Bahai Temple, Kabaka\'s Palace',
      featured_image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
      map_lat: '0.3476', map_lng: '32.5825', is_featured: true, is_active: true, sort_order: 1,
      meta_title: 'Kampala City Tours | Explore Uganda\'s Capital', meta_description: 'Discover Kampala, Uganda\'s vibrant capital city. Cultural tours, heritage sites, markets, and urban adventures await.'
    },
    {
      id: 2, name: 'Jinja', slug: 'jinja', country_id: 1, region: 'Eastern Uganda',
      short_description: 'Adventure capital of Uganda with rivers, cliffs, and unforgettable views.',
      description: 'Known as the adventure capital of East Africa, Jinja sits at the source of the Nile. It offers world-class white-water rafting, bungee jumping, kayaking, and boat cruises. The town itself has a charming colonial-era atmosphere with craft markets and local restaurants. It is an essential stop for thrill-seekers and nature lovers alike.',
      attractions: 'Source of the Nile, White-water rafting, Bungee jumping, Kayaking, Jinja Bridge, Local craft markets',
      featured_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      map_lat: '0.4244', map_lng: '33.2041', is_featured: true, is_active: true, sort_order: 2,
      meta_title: 'Jinja Adventures | Source of the Nile Tours', meta_description: 'Visit Jinja, Uganda\'s adventure capital. White-water rafting, source of the Nile, bungee jumping, and more.'
    },
    {
      id: 3, name: 'Murchison Falls National Park', slug: 'murchison-falls', country_id: 1, region: 'Northwestern Uganda',
      short_description: 'Wildlife encounters, river cruises, and dramatic landscapes in one trip.',
      description: 'Murchison Falls National Park is Uganda\'s largest and oldest conservation area. The Nile thunders through a narrow gorge before plunging 43 meters into the basin below. Game drives reveal elephants, giraffes, lions, leopards, and hippos. A boat cruise to the bottom of the falls is one of Africa\'s most unforgettable experiences.',
      attractions: 'Murchison Falls, Nile boat cruise, Game drives, Chimpanzee tracking, Budongo Forest, Top of the Falls hike',
      featured_image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
      map_lat: '2.2833', map_lng: '31.6667', is_featured: true, is_active: true, sort_order: 3,
      meta_title: 'Murchison Falls National Park Safari | Uganda Wildlife', meta_description: 'Experience Murchison Falls National Park. Game drives, Nile cruises, and dramatic waterfalls in Uganda\'s largest park.'
    },
    {
      id: 4, name: 'Queen Elizabeth National Park', slug: 'queen-elizabeth', country_id: 1, region: 'Western Uganda',
      short_description: 'Game drives, crater lakes, and iconic African plains across a rich ecosystem.',
      description: 'Queen Elizabeth National Park spans nearly 2,000 square kilometers of varied landscape including savanna, forests, wetlands, and lakes. Famous for its tree-climbing lions in the Ishasha sector and the Kazinga Channel boat cruise with hippos, crocodiles, and abundant birdlife. The park offers one of the most diverse wildlife viewing experiences in Africa.',
      attractions: 'Kazinga Channel boat cruise, Tree-climbing lions, Game drives, Crater lakes, Kyambura Gorge chimps, Birding',
      featured_image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
      map_lat: '-0.2000', map_lng: '30.0000', is_featured: true, is_active: true, sort_order: 4,
      meta_title: 'Queen Elizabeth National Park | Uganda Safari Tours', meta_description: 'Explore Queen Elizabeth National Park. Tree-climbing lions, Kazinga Channel, crater lakes, and incredible biodiversity.'
    },
    {
      id: 5, name: 'Bwindi Impenetrable Forest', slug: 'bwindi', country_id: 1, region: 'Southwestern Uganda',
      short_description: 'Mountain gorilla trekking and misty forest trails in a truly memorable setting.',
      description: 'Bwindi Impenetrable National Park is a UNESCO World Heritage Site and one of the most important biodiversity areas on Earth. It is home to approximately half the world\'s remaining mountain gorillas. Gorilla trekking here is a life-changing experience, offering intimate encounters with these gentle giants in their misty forest habitat.',
      attractions: 'Mountain gorilla trekking, Batwa cultural experience, Forest walks, Birding, Waterfall trails',
      featured_image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
      map_lat: '-1.0500', map_lng: '29.6167', is_featured: true, is_active: true, sort_order: 5,
      meta_title: 'Bwindi Gorilla Trekking | Mountain Gorilla Tours Uganda', meta_description: 'Trek mountain gorillas in Bwindi Impenetrable Forest. A UNESCO World Heritage Site and the ultimate Uganda experience.'
    },
    {
      id: 6, name: 'Fort Portal', slug: 'fort-portal', country_id: 1, region: 'Western Uganda',
      short_description: 'Crystalline waterfalls, green hills, and a relaxed countryside pace.',
      description: 'Fort Portal is a picturesque town surrounded by rolling green hills, tea plantations, and crater lakes. Known as the tourism city of Uganda, it offers a tranquil base for exploring the Rwenzori Mountains, Kibale Forest for chimpanzee tracking, and the stunning Amabere Caves. The local Toro Kingdom culture adds depth to any visit.',
      attractions: 'Crater lakes, Amabere Caves, Tea plantations, Rwenzori Mountains gateway, Kibale Forest nearby, Tooro Palace',
      featured_image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      map_lat: '0.6710', map_lng: '30.2750', is_featured: true, is_active: true, sort_order: 6,
      meta_title: 'Fort Portal & Crater Lakes | Uganda Travel', meta_description: 'Discover Fort Portal, Uganda\'s tourism city. Crater lakes, caves, tea plantations, and Rwenzori Mountain views.'
    }
  ]);

  // ─── TOUR CATEGORIES ─────────────────────────────────────
  await knex('tour_categories').insert([
    { id: 1, name: 'Wildlife Safari', slug: 'wildlife-safari', description: 'Classic African game drives and wildlife encounters', icon: 'binoculars', is_active: true, sort_order: 1 },
    { id: 2, name: 'Gorilla Trekking', slug: 'gorilla-trekking', description: 'Mountain gorilla tracking experiences', icon: 'trees', is_active: true, sort_order: 2 },
    { id: 3, name: 'Adventure', slug: 'adventure', description: 'Adrenaline-pumping outdoor activities', icon: 'compass', is_active: true, sort_order: 3 },
    { id: 4, name: 'Cultural', slug: 'cultural', description: 'Cultural immersion and heritage tours', icon: 'landmark', is_active: true, sort_order: 4 },
    { id: 5, name: 'Bird Watching', slug: 'bird-watching', description: 'Birding safaris across Uganda', icon: 'bird', is_active: true, sort_order: 5 },
    { id: 6, name: 'Multi-Day Safari', slug: 'multi-day-safari', description: 'Extended safari experiences', icon: 'map', is_active: true, sort_order: 6 }
  ]);

  // ─── TOUR PACKAGES ───────────────────────────────────────
  await knex('tour_packages').insert([
    {
      id: 1, title: 'Wildlife Safari Escape', slug: 'wildlife-safari-escape', category_id: 1,
      short_description: 'A classic Uganda safari with game drives, scenic views, and memorable wildlife sightings.',
      description: 'Embark on an unforgettable 4-day wildlife safari through Queen Elizabeth National Park. Experience morning and evening game drives across vast savanna plains, cruise the Kazinga Channel to see hippos and crocodiles, and witness the famous tree-climbing lions in the Ishasha sector. This tour includes comfortable lodge accommodation, experienced safari guides, and all park entry fees.',
      duration_days: 4, duration_nights: 3, price_adult: 1250.00, price_child: 850.00,
      currency_code: 'USD', difficulty: 'Easy', min_people: 2, max_people: 12,
      featured_image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
      status: 'published', is_featured: true, avg_rating: 4.80, review_count: 12, sort_order: 1,
      meta_title: 'Wildlife Safari Escape | 4-Day Queen Elizabeth Safari', meta_description: 'Experience the best of Uganda wildlife on this 4-day safari through Queen Elizabeth National Park. Game drives, boat cruises, and tree-climbing lions.'
    },
    {
      id: 2, title: 'Gorilla Trekking Adventure', slug: 'gorilla-trekking-adventure', category_id: 2,
      short_description: 'A guided trekking experience into one of the world\'s most treasured mountain gorilla habitats.',
      description: 'Journey into the misty depths of Bwindi Impenetrable Forest for a once-in-a-lifetime encounter with mountain gorillas. Your experienced trackers will lead you through dense forest to find a habituated gorilla family. Spend one precious hour observing these magnificent creatures in their natural habitat. This tour includes gorilla permits, accommodation, meals, and transport from Kampala.',
      duration_days: 3, duration_nights: 2, price_adult: 1800.00, price_child: null,
      currency_code: 'USD', difficulty: 'Moderate', min_people: 2, max_people: 8,
      featured_image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
      status: 'published', is_featured: true, avg_rating: 4.95, review_count: 8, sort_order: 2,
      meta_title: 'Gorilla Trekking Adventure | Bwindi Forest Uganda', meta_description: 'Trek mountain gorillas in Bwindi Impenetrable Forest. An intimate 3-day experience with permits, accommodation, and expert guides.'
    },
    {
      id: 3, title: 'Source of the Nile Experience', slug: 'source-of-the-nile-experience', category_id: 3,
      short_description: 'Enjoy the Nile, adrenaline activities, culture, and a relaxed scenic getaway.',
      description: 'Discover the adventure capital of East Africa with this action-packed 2-day tour. Visit the source of the Nile, enjoy white-water rafting on Grade 5 rapids, try bungee jumping, and take a sunset boat cruise. The trip includes comfortable accommodation by the river, meals, and all activity fees. Perfect for thrill-seekers and nature lovers.',
      duration_days: 2, duration_nights: 1, price_adult: 450.00, price_child: 320.00,
      currency_code: 'USD', difficulty: 'Moderate', min_people: 2, max_people: 16,
      featured_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      status: 'published', is_featured: true, avg_rating: 4.70, review_count: 15, sort_order: 3,
      meta_title: 'Source of the Nile Experience | Jinja Adventure Tour', meta_description: 'Adventure in Jinja, Uganda. White-water rafting, bungee jumping, source of the Nile, and sunset cruises in 2 unforgettable days.'
    },
    {
      id: 4, title: 'Kampala & Culture Journey', slug: 'kampala-culture-journey', category_id: 4,
      short_description: 'Explore Kampala\'s vibrant neighborhoods, heritage sites, and local experiences.',
      description: 'Immerse yourself in the rich cultural tapestry of Uganda\'s capital city. Visit the Kasubi Tombs (UNESCO World Heritage Site), explore the Uganda Museum, wander through the colorful Owino Market, and experience a traditional dance performance at Ndere Cultural Centre. This tour includes a local guide, transportation, entrance fees, and a traditional lunch.',
      duration_days: 2, duration_nights: 1, price_adult: 280.00, price_child: 180.00,
      currency_code: 'USD', difficulty: 'Easy', min_people: 1, max_people: 20,
      featured_image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
      status: 'published', is_featured: false, avg_rating: 4.60, review_count: 6, sort_order: 4,
      meta_title: 'Kampala Culture Journey | Uganda Capital City Tour', meta_description: 'Explore Kampala\'s cultural heritage. Visit museums, heritage sites, markets, and experience traditional Ugandan culture.'
    },
    {
      id: 5, title: 'Murchison Falls Grand Safari', slug: 'murchison-falls-grand-safari', category_id: 6,
      short_description: 'A comprehensive 5-day safari through Uganda\'s largest and most spectacular national park.',
      description: 'Experience the full glory of Murchison Falls National Park on this 5-day expedition. Enjoy multiple game drives to spot the Big Five, cruise to the base of the thundering falls, hike to the top for panoramic views, and track chimpanzees in Budongo Forest. Includes luxury lodge accommodation, all meals, park fees, and experienced guides.',
      duration_days: 5, duration_nights: 4, price_adult: 1650.00, price_child: 1100.00,
      currency_code: 'USD', difficulty: 'Easy', min_people: 2, max_people: 10,
      featured_image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
      status: 'published', is_featured: true, avg_rating: 4.85, review_count: 9, sort_order: 5,
      meta_title: 'Murchison Falls Grand Safari | 5-Day Uganda Safari', meta_description: '5-day Murchison Falls safari with game drives, Nile cruise, chimp tracking, and luxury accommodation.'
    },
    {
      id: 6, title: 'Uganda Birding Expedition', slug: 'uganda-birding-expedition', category_id: 5,
      short_description: 'A specialized birding safari across Uganda\'s top birding hotspots.',
      description: 'Uganda is home to over 1,000 bird species, making it one of the world\'s premier birding destinations. This 7-day expedition visits Bwindi, Queen Elizabeth NP, Murchison Falls, and the Entebbe Botanical Gardens. Led by expert ornithological guides, you\'ll spot shoebills, African green broadbills, and hundreds of other species.',
      duration_days: 7, duration_nights: 6, price_adult: 2200.00, price_child: null,
      currency_code: 'USD', difficulty: 'Easy', min_people: 2, max_people: 8,
      featured_image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      status: 'published', is_featured: false, avg_rating: 4.90, review_count: 4, sort_order: 6,
      meta_title: 'Uganda Birding Expedition | 7-Day Bird Watching Safari', meta_description: '7-day birding safari across Uganda. Spot over 300 species including shoebills, broadbills, and Albertine Rift endemics.'
    }
  ]);

  // ─── TOUR-DESTINATION MAPPING ────────────────────────────
  await knex('tour_destinations').insert([
    { tour_id: 1, destination_id: 4, visit_order: 1 }, // Safari -> Queen Elizabeth
    { tour_id: 2, destination_id: 5, visit_order: 1 }, // Gorilla -> Bwindi
    { tour_id: 3, destination_id: 2, visit_order: 1 }, // Nile -> Jinja
    { tour_id: 4, destination_id: 1, visit_order: 1 }, // Culture -> Kampala
    { tour_id: 5, destination_id: 3, visit_order: 1 }, // Murchison -> Murchison
    { tour_id: 6, destination_id: 5, visit_order: 1 }, // Birding -> Bwindi
    { tour_id: 6, destination_id: 4, visit_order: 2 }, // Birding -> Queen Elizabeth
    { tour_id: 6, destination_id: 3, visit_order: 3 }, // Birding -> Murchison
  ]);

  // ─── TOUR ITINERARIES ────────────────────────────────────
  await knex('tour_itineraries').insert([
    // Wildlife Safari Escape (4 days)
    { tour_id: 1, day_number: 1, title: 'Kampala to Queen Elizabeth National Park', description: 'Depart Kampala early morning. Drive through the scenic Ugandan countryside with stops at the equator. Arrive at Queen Elizabeth NP in the afternoon for an evening game drive.', accommodation: 'Safari Lodge', meals: 'Lunch, Dinner' },
    { tour_id: 1, day_number: 2, title: 'Full Day Game Drive & Kazinga Channel', description: 'Morning game drive in the Kasenyi sector. Afternoon boat cruise on the Kazinga Channel to see hippos, elephants, crocodiles, and abundant birdlife.', accommodation: 'Safari Lodge', meals: 'Breakfast, Lunch, Dinner' },
    { tour_id: 1, day_number: 3, title: 'Ishasha Tree-Climbing Lions', description: 'Drive south to the Ishasha sector, famous for its tree-climbing lions. Game drives through stunning fig-tree savanna with excellent opportunities for wildlife photography.', accommodation: 'Safari Lodge', meals: 'Breakfast, Lunch, Dinner' },
    { tour_id: 1, day_number: 4, title: 'Return to Kampala', description: 'Final morning game drive. Depart for Kampala with scenic stops along the way. Arrive in Kampala by evening.', accommodation: null, meals: 'Breakfast, Lunch' },
    // Gorilla Trekking (3 days)
    { tour_id: 2, day_number: 1, title: 'Kampala to Bwindi', description: 'Depart Kampala and drive to Bwindi Impenetrable Forest. Enjoy the scenic journey through rolling hills and rural Uganda. Evening briefing at the lodge.', accommodation: 'Bwindi Lodge', meals: 'Lunch, Dinner' },
    { tour_id: 2, day_number: 2, title: 'Gorilla Trekking Day', description: 'Early morning briefing at park headquarters. Begin the trek into the forest with experienced trackers. Spend one hour with a habituated gorilla family. Return for celebration lunch.', accommodation: 'Bwindi Lodge', meals: 'Breakfast, Lunch, Dinner' },
    { tour_id: 2, day_number: 3, title: 'Batwa Experience & Return', description: 'Optional morning Batwa pygmy community visit. Depart for Kampala. Arrive by evening with unforgettable memories.', accommodation: null, meals: 'Breakfast, Lunch' },
    // Source of the Nile (2 days)
    { tour_id: 3, day_number: 1, title: 'Kampala to Jinja & Adventure', description: 'Drive to Jinja (2 hours). Visit the source of the Nile. Choose activities: white-water rafting, bungee jumping, or kayaking. Sunset boat cruise on the Nile.', accommodation: 'Riverside Lodge', meals: 'Lunch, Dinner' },
    { tour_id: 3, day_number: 2, title: 'Jinja Town & Return', description: 'Morning visit to Jinja town and local craft markets. Optional tubing on the Nile. Depart for Kampala after lunch.', accommodation: null, meals: 'Breakfast, Lunch' },
  ]);

  // ─── TOUR INCLUSIONS/EXCLUSIONS ──────────────────────────
  const inclusions = [];
  // Tour 1: Wildlife Safari
  ['Safari vehicle and driver-guide', 'All park entry fees', 'Kazinga Channel boat cruise', '3 nights lodge accommodation', 'All meals as per itinerary', 'Bottled water during drives', 'Airport/hotel pickup and drop-off'].forEach((item, i) => {
    inclusions.push({ tour_id: 1, item, type: 'included', sort_order: i });
  });
  ['International flights', 'Travel insurance', 'Tips and gratuities', 'Personal expenses', 'Alcoholic beverages'].forEach((item, i) => {
    inclusions.push({ tour_id: 1, item, type: 'excluded', sort_order: i });
  });
  // Tour 2: Gorilla Trekking
  ['Gorilla trekking permit', 'Safari vehicle and driver', '2 nights lodge accommodation', 'All meals as per itinerary', 'Park entry fees', 'Bottled water', 'Airport/hotel transfers'].forEach((item, i) => {
    inclusions.push({ tour_id: 2, item, type: 'included', sort_order: i });
  });
  ['International flights', 'Travel insurance', 'Tips for porters and guides', 'Personal hiking gear', 'Alcoholic beverages'].forEach((item, i) => {
    inclusions.push({ tour_id: 2, item, type: 'excluded', sort_order: i });
  });
  await knex('tour_inclusions').insert(inclusions);

  // ─── TOUR IMAGES ─────────────────────────────────────────
  await knex('tour_images').insert([
    { tour_id: 1, image_url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80', alt_text: 'Wildlife on the plains of Queen Elizabeth National Park', is_primary: true, sort_order: 1 },
    { tour_id: 1, image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80', alt_text: 'Dramatic landscapes of Uganda national parks', is_primary: false, sort_order: 2 },
    { tour_id: 2, image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80', alt_text: 'Misty Bwindi Impenetrable Forest', is_primary: true, sort_order: 1 },
    { tour_id: 3, image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80', alt_text: 'Scenic Jinja and source of the Nile', is_primary: true, sort_order: 1 },
    { tour_id: 4, image_url: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80', alt_text: 'Kampala city and cultural heritage', is_primary: true, sort_order: 1 },
    { tour_id: 5, image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80', alt_text: 'Murchison Falls panoramic view', is_primary: true, sort_order: 1 },
  ]);

  // ─── TOUR AVAILABILITY ───────────────────────────────────
  const availability = [];
  for (let tourId = 1; tourId <= 6; tourId++) {
    for (let month = 0; month < 12; month++) {
      const start = new Date(2026, month, 1);
      const end = new Date(2026, month + 1, 0);
      availability.push({
        tour_id: tourId,
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        slots_available: 20,
        slots_booked: Math.floor(Math.random() * 8),
        is_active: true
      });
    }
  }
  await knex('tour_availability').insert(availability);

  // ─── HOTELS ──────────────────────────────────────────────
  await knex('hotels').insert([
    {
      id: 1, name: 'Kampala Grand Hotel', slug: 'kampala-grand-hotel', destination_id: 1, star_rating: 4,
      short_description: 'A modern hotel in the heart of Kampala with excellent amenities.',
      description: 'Located in central Kampala, this 4-star hotel offers comfortable rooms, a rooftop restaurant with city views, swimming pool, business center, and easy access to major attractions.',
      amenities: 'WiFi, Swimming Pool, Restaurant, Bar, Room Service, Parking, Airport Shuttle, Gym',
      address: 'Kampala Road, Central Business District', phone: '+256700111222', email: 'info@kampalagrand.demo',
      featured_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      price_from: 120.00, is_active: true, is_featured: true
    },
    {
      id: 2, name: 'Nile River Safari Lodge', slug: 'nile-river-safari-lodge', destination_id: 2, star_rating: 4,
      short_description: 'Riverside lodge with stunning Nile views and adventure activities.',
      description: 'Set on the banks of the River Nile in Jinja, this lodge offers spectacular views, comfortable tented rooms, and direct access to adventure activities including rafting and kayaking.',
      amenities: 'WiFi, Restaurant, Bar, River Views, Adventure Desk, Garden, Parking',
      address: 'Nile Bank, Jinja', phone: '+256700222333', email: 'info@nilelodge.demo',
      featured_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      price_from: 95.00, is_active: true, is_featured: true
    },
    {
      id: 3, name: 'Bwindi Gorilla Resort', slug: 'bwindi-gorilla-resort', destination_id: 5, star_rating: 5,
      short_description: 'Luxury eco-lodge on the edge of Bwindi Impenetrable Forest.',
      description: 'This award-winning eco-lodge sits on a ridge overlooking Bwindi forest. Spacious bandas with private balconies, gourmet dining, and the ideal base for gorilla trekking.',
      amenities: 'WiFi, Restaurant, Bar, Spa, Gorilla Trekking Desk, Fireplace, Views, Gift Shop',
      address: 'Bwindi Ridge, Southwestern Uganda', phone: '+256700333444', email: 'info@bwindiresort.demo',
      featured_image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
      price_from: 250.00, is_active: true, is_featured: true
    }
  ]);

  // ─── HOTEL ROOMS ─────────────────────────────────────────
  await knex('hotel_rooms').insert([
    { hotel_id: 1, name: 'Standard Double Room', description: 'Comfortable room with queen bed, city views, and modern amenities.', max_occupancy: 2, price_per_night: 120.00, total_rooms: 20, is_active: true },
    { hotel_id: 1, name: 'Deluxe Suite', description: 'Spacious suite with separate living area, premium furnishings, and panoramic views.', max_occupancy: 3, price_per_night: 220.00, total_rooms: 8, is_active: true },
    { hotel_id: 2, name: 'Riverside Tent', description: 'Luxury tented accommodation with Nile views and private deck.', max_occupancy: 2, price_per_night: 95.00, total_rooms: 12, is_active: true },
    { hotel_id: 2, name: 'Family Cottage', description: 'Two-bedroom cottage perfect for families, with garden views.', max_occupancy: 5, price_per_night: 180.00, total_rooms: 4, is_active: true },
    { hotel_id: 3, name: 'Forest Banda', description: 'Private banda with balcony overlooking the forest. Includes fireplace.', max_occupancy: 2, price_per_night: 250.00, total_rooms: 10, is_active: true },
    { hotel_id: 3, name: 'Honeymoon Suite', description: 'Romantic suite with outdoor bathtub, private dining area, and forest views.', max_occupancy: 2, price_per_night: 400.00, total_rooms: 3, is_active: true }
  ]);

  // ─── TRANSPORTATION ──────────────────────────────────────
  await knex('transportation').insert([
    { id: 1, name: 'Safari Land Cruiser', type: '4x4', description: 'Toyota Land Cruiser with pop-up roof for game viewing. Ideal for safari trips.', capacity: 6, price_per_day: 180.00, has_driver: true, is_active: true },
    { id: 2, name: 'Airport Shuttle Van', type: 'van', description: 'Comfortable minivan for airport transfers and city tours.', capacity: 8, price_per_day: 80.00, has_driver: true, is_active: true },
    { id: 3, name: 'Safari Minibus', type: 'bus', description: 'Comfortable minibus for group safari tours and extended trips.', capacity: 14, price_per_day: 150.00, has_driver: true, is_active: true },
    { id: 4, name: 'Executive Sedan', type: 'car', description: 'Comfortable sedan for business transfers and city travel.', capacity: 3, price_per_day: 100.00, has_driver: true, is_active: true }
  ]);

  // ─── VISA REQUIREMENTS ───────────────────────────────────
  await knex('visa_requirements').insert([
    {
      country_id: 1, visa_type: 'Uganda Tourist Visa',
      requirements: 'All foreign nationals require a visa to enter Uganda unless exempted. Visas can be obtained online through the Uganda e-visa system.',
      documents_needed: 'Valid passport (6+ months validity), Passport-size photos, Yellow fever vaccination certificate, Return flight ticket, Proof of accommodation, Sufficient funds',
      fee: 50.00, currency_code: 'USD', processing_time: '2-5 business days',
      notes: 'Apply online at visas.immigration.go.ug. East African Tourist Visa ($100) covers Uganda, Kenya, and Rwanda.',
      is_active: true
    },
    {
      country_id: 2, visa_type: 'Kenya e-Visa',
      requirements: 'Most visitors require a visa. Electronic Travel Authorization (eTA) is available for many nationalities.',
      documents_needed: 'Valid passport, Passport photo, Return ticket, Proof of accommodation',
      fee: 30.00, currency_code: 'USD', processing_time: '2-3 business days',
      notes: 'Apply online at etakenya.go.ke',
      is_active: true
    },
    {
      country_id: 4, visa_type: 'Rwanda Tourist Visa',
      requirements: 'Visa on arrival available for all African Union nationals. Others can apply online.',
      documents_needed: 'Valid passport, Passport photo, Return ticket, Proof of accommodation, Yellow fever certificate',
      fee: 30.00, currency_code: 'USD', processing_time: '3-5 business days',
      notes: 'East African Tourist Visa available for combined Uganda-Kenya-Rwanda trips.',
      is_active: true
    }
  ]);

  // ─── REVIEWS ─────────────────────────────────────────────
  await knex('reviews').insert([
    { user_id: 4, tour_id: 1, booking_id: null, rating: 5, title: 'Incredible Safari Experience', content: 'The wildlife safari exceeded all expectations. Our guide was incredibly knowledgeable and we saw elephants, lions, hippos, and so many birds. The lodge was comfortable and the food was excellent.', status: 'approved' },
    { user_id: 5, tour_id: 2, booking_id: null, rating: 5, title: 'Life-Changing Gorilla Trek', content: 'Meeting the mountain gorillas was the most extraordinary experience of my life. The team was professional, the trek was challenging but rewarding, and the moment you see the gorillas is absolutely magical.', status: 'approved' },
    { user_id: 4, tour_id: 3, booking_id: null, rating: 4, title: 'Great Adventure in Jinja', content: 'White-water rafting on the Nile was incredible! The sunset cruise was peaceful and beautiful. Would highly recommend this for anyone who loves adventure and nature.', status: 'approved' },
    { user_id: 5, tour_id: 1, booking_id: null, rating: 5, title: 'Professional and Memorable', content: 'Professional guidance, thoughtful recommendations, and a vacation that felt both exciting and well organized. The team really cared about making our trip special.', status: 'approved' },
    { user_id: 4, tour_id: 5, booking_id: null, rating: 5, title: 'Murchison Falls Was Stunning', content: 'The boat cruise to the falls was breathtaking. We saw so many animals during the game drives. Five days was perfect - enough time to truly experience the park.', status: 'approved' },
  ]);

  // ─── SITE SETTINGS ──────────────────────────────────────
  await knex('site_settings').insert([
    // General
    { setting_key: 'site_name', setting_value: 'City One Adventures', setting_type: 'text', group: 'general', label: 'Site Name', sort_order: 1 },
    { setting_key: 'site_tagline', setting_value: 'Uganda Tours, Safaris & Travel Experiences', setting_type: 'text', group: 'general', label: 'Site Tagline', sort_order: 2 },
    { setting_key: 'site_description', setting_value: 'Plan memorable Uganda tours, safaris, gorilla trekking, cultural trips, and custom travel experiences with City One Adventures.', setting_type: 'textarea', group: 'general', label: 'Site Description', sort_order: 3 },
    { setting_key: 'default_currency', setting_value: 'USD', setting_type: 'text', group: 'general', label: 'Default Currency', sort_order: 4 },

    // Contact
    { setting_key: 'contact_email', setting_value: 'info@cityoneadventure.com', setting_type: 'text', group: 'contact', label: 'Contact Email', sort_order: 1 },
    { setting_key: 'contact_phone', setting_value: '+256786870308', setting_type: 'text', group: 'contact', label: 'Phone Number', sort_order: 2 },
    { setting_key: 'contact_whatsapp', setting_value: '+256786870308', setting_type: 'text', group: 'contact', label: 'WhatsApp Number', sort_order: 3 },
    { setting_key: 'contact_address', setting_value: 'Kampala Road, Liberty Tower, Level 3', setting_type: 'text', group: 'contact', label: 'Address', sort_order: 4 },
    { setting_key: 'contact_city', setting_value: 'Kampala, Uganda', setting_type: 'text', group: 'contact', label: 'City', sort_order: 5 },

    // Social
    { setting_key: 'social_facebook', setting_value: 'https://facebook.com/CityOneAdventures', setting_type: 'text', group: 'social', label: 'Facebook URL', sort_order: 1 },
    { setting_key: 'social_instagram', setting_value: 'https://instagram.com/CityOneAdventures', setting_type: 'text', group: 'social', label: 'Instagram URL', sort_order: 2 },
    { setting_key: 'social_twitter', setting_value: 'https://twitter.com/CityOneAdventures', setting_type: 'text', group: 'social', label: 'Twitter/X URL', sort_order: 3 },
    { setting_key: 'social_youtube', setting_value: 'https://youtube.com/@CityOneAdventures', setting_type: 'text', group: 'social', label: 'YouTube URL', sort_order: 4 },

    // Homepage
    { setting_key: 'hero_eyebrow', setting_value: 'Uganda tours, safaris & travel experiences', setting_type: 'text', group: 'homepage', label: 'Hero Eyebrow Text', sort_order: 1 },
    { setting_key: 'hero_title', setting_value: 'Discover Uganda. Experience the Adventure.', setting_type: 'text', group: 'homepage', label: 'Hero Title', sort_order: 2 },
    { setting_key: 'hero_subtitle', setting_value: 'City One Adventures helps travelers explore the best of Uganda through curated tours, cultural experiences, wildlife encounters, and memorable journeys across the country.', setting_type: 'textarea', group: 'homepage', label: 'Hero Subtitle', sort_order: 3 },
    { setting_key: 'hero_image', setting_value: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1400&q=80', setting_type: 'image', group: 'homepage', label: 'Hero Background Image', sort_order: 4 },

    // About
    { setting_key: 'about_title', setting_value: 'About City One Adventures: Your Uganda Travel Experts', setting_type: 'text', group: 'about', label: 'About Page Title', sort_order: 1 },
    { setting_key: 'about_description', setting_value: 'City One Adventures is a Ugandan tour and travel company dedicated to creating meaningful, safe, and inspiring experiences for visitors exploring Uganda. From wildlife safaris to cultural escapes and custom itineraries, the company focuses on genuine guest experiences, careful planning, and memorable travel moments.', setting_type: 'textarea', group: 'about', label: 'About Description', sort_order: 2 },
    { setting_key: 'about_mission', setting_value: 'To deliver authentic, well-managed travel experiences that help travelers discover the best of Uganda.', setting_type: 'textarea', group: 'about', label: 'Mission Statement', sort_order: 3 },
    { setting_key: 'about_vision', setting_value: 'To become a trusted name for accessible, memorable, and responsible tourism across Uganda and East Africa.', setting_type: 'textarea', group: 'about', label: 'Vision Statement', sort_order: 4 },

    // SEO
    { setting_key: 'ga_measurement_id', setting_value: '', setting_type: 'text', group: 'seo', label: 'Google Analytics ID', sort_order: 1 },

    // Footer
    { setting_key: 'footer_tagline', setting_value: 'Professional and personalized travel experiences for discovering Uganda through authentic, memorable tourism.', setting_type: 'textarea', group: 'footer', label: 'Footer Tagline', sort_order: 1 },
  ]);

  // ─── FAQS ────────────────────────────────────────────────
  await knex('faqs').insert([
    { question: 'What is the best time to visit Uganda?', answer: 'Uganda can be visited year-round, but the best times for wildlife viewing and gorilla trekking are during the dry seasons: June-September and December-February. The wet seasons (March-May and October-November) offer fewer crowds and lush landscapes.', category: 'general', sort_order: 1, is_active: true },
    { question: 'How much does gorilla trekking cost?', answer: 'A gorilla trekking permit in Uganda costs $700 per person for foreign non-residents. Our packages include the permit, accommodation, meals, transport, and an experienced guide. Total package prices vary based on duration and accommodation level.', category: 'tours', sort_order: 2, is_active: true },
    { question: 'Is Uganda safe for tourists?', answer: 'Yes, Uganda is generally safe for tourists. The main tourist areas and national parks are well-managed and secure. We recommend standard travel precautions and working with a reputable tour operator like City One Adventures for the safest experience.', category: 'general', sort_order: 3, is_active: true },
    { question: 'Do I need a visa to visit Uganda?', answer: 'Most foreign nationals need a visa to enter Uganda. You can apply for an e-visa online at visas.immigration.go.ug. The standard tourist visa costs $50. An East African Tourist Visa ($100) covers Uganda, Kenya, and Rwanda.', category: 'travel', sort_order: 4, is_active: true },
    { question: 'What vaccinations do I need?', answer: 'A Yellow Fever vaccination certificate is mandatory for entry into Uganda. We also recommend vaccinations for Hepatitis A and B, Typhoid, and anti-malaria medication. Consult your travel doctor at least 6 weeks before your trip.', category: 'travel', sort_order: 5, is_active: true },
    { question: 'Can you customize a tour for our group?', answer: 'Absolutely! We specialize in creating customized itineraries tailored to your interests, budget, and schedule. Contact us with your requirements and we will design the perfect Uganda experience for you.', category: 'tours', sort_order: 6, is_active: true },
  ]);

  // ─── PAGES (CMS) ────────────────────────────────────────
  await knex('pages').insert([
    { title: 'Terms & Conditions', slug: 'terms', content: '<h2>Terms and Conditions</h2><p>These terms and conditions govern your use of City One Adventures services. By booking a tour or service, you agree to these terms.</p><h3>Booking and Payment</h3><p>A deposit of 30% is required to confirm your booking. The remaining balance is due 30 days before the tour start date.</p><h3>Cancellation Policy</h3><p>Cancellations made 30+ days before departure: full refund minus processing fee. 15-29 days: 50% refund. Less than 15 days: no refund.</p>', status: 'published' },
    { title: 'Privacy Policy', slug: 'privacy', content: '<h2>Privacy Policy</h2><p>City One Adventures is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p><h3>Information We Collect</h3><p>We collect information you provide when booking tours, creating an account, or contacting us, including name, email, phone number, and travel preferences.</p>', status: 'published' },
  ]);
}
