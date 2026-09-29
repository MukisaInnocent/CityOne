/**
 * Database Schema Migration — City One Adventures
 * Creates all tables for the tour and travel management system
 */
export async function up(knex) {

  // ─── ROLES & PERMISSIONS ─────────────────────────────────
  await knex.schema.createTable('roles', t => {
    t.increments('id').primary();
    t.string('name', 50).notNullable().unique();
    t.string('display_name', 100).notNullable();
    t.text('description');
    t.boolean('is_system').defaultTo(false);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('permissions', t => {
    t.increments('id').primary();
    t.string('name', 100).notNullable().unique();
    t.string('display_name', 150).notNullable();
    t.string('module', 50).notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('role_permissions', t => {
    t.increments('id').primary();
    t.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    t.integer('permission_id').unsigned().notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    t.unique(['role_id', 'permission_id']);
  });

  await knex.schema.createTable('departments', t => {
    t.increments('id').primary();
    t.string('name', 100).notNullable();
    t.text('description');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // ─── USERS ───────────────────────────────────────────────
  await knex.schema.createTable('users', t => {
    t.increments('id').primary();
    t.string('email', 255).notNullable().unique();
    t.string('password_hash', 255).notNullable();
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.string('phone', 30);
    t.string('avatar', 500);
    t.integer('role_id').unsigned().notNullable().references('id').inTable('roles');
    t.integer('department_id').unsigned().references('id').inTable('departments');
    t.string('country_code', 3);
    t.string('city', 100);
    t.text('address');
    t.date('date_of_birth');
    t.string('nationality', 100);
    t.string('passport_number', 50);
    t.boolean('is_active').defaultTo(true);
    t.boolean('email_verified').defaultTo(false);
    t.datetime('last_login');
    t.timestamps(true, true);
    t.index(['email']);
    t.index(['role_id']);
  });

  await knex.schema.createTable('password_resets', t => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('token', 255).notNullable().unique();
    t.datetime('expires_at').notNullable();
    t.boolean('used').defaultTo(false);
    t.timestamps(true, true);
  });

  // ─── GEOGRAPHY ───────────────────────────────────────────
  await knex.schema.createTable('countries', t => {
    t.increments('id').primary();
    t.string('name', 100).notNullable();
    t.string('code', 3).notNullable().unique();
    t.string('code3', 3);
    t.string('phone_code', 10);
    t.string('currency_code', 3);
    t.string('continent', 30);
    t.string('region', 50);
    t.string('flag_emoji', 10);
    t.boolean('is_active').defaultTo(true);
    t.index(['code']);
  });

  await knex.schema.createTable('currencies', t => {
    t.increments('id').primary();
    t.string('code', 3).notNullable().unique();
    t.string('name', 100).notNullable();
    t.string('symbol', 10).notNullable();
    t.decimal('exchange_rate', 12, 6).defaultTo(1.000000);
    t.boolean('is_active').defaultTo(true);
    t.datetime('rate_updated_at');
    t.timestamps(true, true);
    t.index(['code']);
  });

  await knex.schema.createTable('destinations', t => {
    t.increments('id').primary();
    t.string('name', 200).notNullable();
    t.string('slug', 250).notNullable().unique();
    t.integer('country_id').unsigned().notNullable().references('id').inTable('countries');
    t.string('region', 100);
    t.text('short_description');
    t.text('description', 'longtext');
    t.text('attractions', 'longtext');
    t.text('travel_info', 'longtext');
    t.string('featured_image', 500);
    t.string('map_lat', 20);
    t.string('map_lng', 20);
    t.string('meta_title', 200);
    t.text('meta_description');
    t.boolean('is_featured').defaultTo(false);
    t.boolean('is_active').defaultTo(true);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.index(['slug']);
    t.index(['country_id']);
    t.index(['is_featured', 'is_active']);
  });

  // ─── TOURS ───────────────────────────────────────────────
  await knex.schema.createTable('tour_categories', t => {
    t.increments('id').primary();
    t.string('name', 100).notNullable();
    t.string('slug', 120).notNullable().unique();
    t.text('description');
    t.string('icon', 50);
    t.string('image', 500);
    t.boolean('is_active').defaultTo(true);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('tour_packages', t => {
    t.increments('id').primary();
    t.string('title', 300).notNullable();
    t.string('slug', 350).notNullable().unique();
    t.integer('category_id').unsigned().references('id').inTable('tour_categories');
    t.text('short_description');
    t.text('description', 'longtext');
    t.integer('duration_days').notNullable().defaultTo(1);
    t.integer('duration_nights').defaultTo(0);
    t.decimal('price_adult', 12, 2).notNullable();
    t.decimal('price_child', 12, 2);
    t.string('currency_code', 3).defaultTo('USD');
    t.string('difficulty', 30);
    t.integer('min_people').defaultTo(1);
    t.integer('max_people').defaultTo(20);
    t.string('featured_image', 500);
    t.string('meta_title', 200);
    t.text('meta_description');
    t.enu('status', ['draft', 'published', 'archived']).defaultTo('draft');
    t.boolean('is_featured').defaultTo(false);
    t.decimal('avg_rating', 3, 2).defaultTo(0);
    t.integer('review_count').defaultTo(0);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.index(['slug']);
    t.index(['category_id']);
    t.index(['status', 'is_featured']);
    t.index(['price_adult']);
  });

  await knex.schema.createTable('tour_itineraries', t => {
    t.increments('id').primary();
    t.integer('tour_id').unsigned().notNullable().references('id').inTable('tour_packages').onDelete('CASCADE');
    t.integer('day_number').notNullable();
    t.string('title', 200).notNullable();
    t.text('description', 'longtext');
    t.string('accommodation', 200);
    t.string('meals', 100);
    t.string('image', 500);
    t.index(['tour_id', 'day_number']);
  });

  await knex.schema.createTable('tour_images', t => {
    t.increments('id').primary();
    t.integer('tour_id').unsigned().notNullable().references('id').inTable('tour_packages').onDelete('CASCADE');
    t.string('image_url', 500).notNullable();
    t.string('alt_text', 300);
    t.string('caption', 300);
    t.boolean('is_primary').defaultTo(false);
    t.integer('sort_order').defaultTo(0);
    t.index(['tour_id']);
  });

  await knex.schema.createTable('tour_inclusions', t => {
    t.increments('id').primary();
    t.integer('tour_id').unsigned().notNullable().references('id').inTable('tour_packages').onDelete('CASCADE');
    t.string('item', 300).notNullable();
    t.enu('type', ['included', 'excluded']).notNullable();
    t.integer('sort_order').defaultTo(0);
    t.index(['tour_id', 'type']);
  });

  await knex.schema.createTable('tour_destinations', t => {
    t.increments('id').primary();
    t.integer('tour_id').unsigned().notNullable().references('id').inTable('tour_packages').onDelete('CASCADE');
    t.integer('destination_id').unsigned().notNullable().references('id').inTable('destinations').onDelete('CASCADE');
    t.integer('visit_order').defaultTo(0);
    t.unique(['tour_id', 'destination_id']);
  });

  await knex.schema.createTable('tour_availability', t => {
    t.increments('id').primary();
    t.integer('tour_id').unsigned().notNullable().references('id').inTable('tour_packages').onDelete('CASCADE');
    t.date('start_date').notNullable();
    t.date('end_date').notNullable();
    t.integer('slots_available').defaultTo(20);
    t.integer('slots_booked').defaultTo(0);
    t.decimal('price_override', 12, 2);
    t.boolean('is_active').defaultTo(true);
    t.index(['tour_id', 'start_date']);
  });

  // ─── BOOKINGS ────────────────────────────────────────────
  await knex.schema.createTable('bookings', t => {
    t.increments('id').primary();
    t.string('booking_ref', 20).notNullable().unique();
    t.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    t.integer('tour_id').unsigned().references('id').inTable('tour_packages');
    t.date('travel_date').notNullable();
    t.date('end_date');
    t.integer('adults').notNullable().defaultTo(1);
    t.integer('children').defaultTo(0);
    t.decimal('subtotal', 12, 2).notNullable();
    t.decimal('tax', 12, 2).defaultTo(0);
    t.decimal('discount', 12, 2).defaultTo(0);
    t.decimal('total_amount', 12, 2).notNullable();
    t.string('currency_code', 3).defaultTo('USD');
    t.enu('status', ['pending', 'confirmed', 'partially_paid', 'paid', 'cancelled', 'completed', 'refunded']).defaultTo('pending');
    t.text('special_requests');
    t.text('cancellation_reason');
    t.datetime('confirmed_at');
    t.datetime('cancelled_at');
    t.datetime('completed_at');
    t.integer('confirmed_by').unsigned().references('id').inTable('users');
    t.timestamps(true, true);
    t.index(['booking_ref']);
    t.index(['user_id']);
    t.index(['tour_id']);
    t.index(['status']);
    t.index(['travel_date']);
  });

  await knex.schema.createTable('booking_passengers', t => {
    t.increments('id').primary();
    t.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings').onDelete('CASCADE');
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.enu('type', ['adult', 'child']).defaultTo('adult');
    t.date('date_of_birth');
    t.string('nationality', 100);
    t.string('passport_number', 50);
    t.string('dietary_requirements', 200);
    t.text('medical_notes');
    t.index(['booking_id']);
  });

  await knex.schema.createTable('booking_items', t => {
    t.increments('id').primary();
    t.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings').onDelete('CASCADE');
    t.string('item_type', 50).notNullable(); // tour, hotel, transport, transfer
    t.string('item_name', 300).notNullable();
    t.integer('quantity').defaultTo(1);
    t.decimal('unit_price', 12, 2).notNullable();
    t.decimal('total_price', 12, 2).notNullable();
    t.text('details');
    t.index(['booking_id']);
  });

  await knex.schema.createTable('booking_status_history', t => {
    t.increments('id').primary();
    t.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings').onDelete('CASCADE');
    t.string('old_status', 30);
    t.string('new_status', 30).notNullable();
    t.text('notes');
    t.integer('changed_by').unsigned().references('id').inTable('users');
    t.timestamps(true, true);
    t.index(['booking_id']);
  });

  // ─── PAYMENTS ────────────────────────────────────────────
  await knex.schema.createTable('payments', t => {
    t.increments('id').primary();
    t.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings');
    t.string('transaction_ref', 100).unique();
    t.string('payment_method', 50);
    t.string('gateway', 30); // flutterwave, bank_transfer, cash
    t.decimal('amount', 12, 2).notNullable();
    t.string('currency_code', 3).defaultTo('USD');
    t.enu('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).defaultTo('pending');
    t.string('gateway_ref', 200);
    t.text('gateway_response');
    t.datetime('paid_at');
    t.timestamps(true, true);
    t.index(['booking_id']);
    t.index(['transaction_ref']);
    t.index(['status']);
  });

  await knex.schema.createTable('payment_transactions', t => {
    t.increments('id').primary();
    t.integer('payment_id').unsigned().notNullable().references('id').inTable('payments').onDelete('CASCADE');
    t.string('type', 30).notNullable(); // initiate, callback, verify, refund
    t.text('request_data', 'longtext');
    t.text('response_data', 'longtext');
    t.integer('status_code');
    t.timestamps(true, true);
    t.index(['payment_id']);
  });

  await knex.schema.createTable('refunds', t => {
    t.increments('id').primary();
    t.integer('payment_id').unsigned().notNullable().references('id').inTable('payments');
    t.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings');
    t.decimal('amount', 12, 2).notNullable();
    t.string('currency_code', 3).defaultTo('USD');
    t.enu('status', ['pending', 'processing', 'completed', 'failed']).defaultTo('pending');
    t.text('reason');
    t.string('gateway_ref', 200);
    t.integer('processed_by').unsigned().references('id').inTable('users');
    t.datetime('processed_at');
    t.timestamps(true, true);
    t.index(['payment_id']);
    t.index(['booking_id']);
  });

  // ─── HOTELS ──────────────────────────────────────────────
  await knex.schema.createTable('hotels', t => {
    t.increments('id').primary();
    t.string('name', 200).notNullable();
    t.string('slug', 250).notNullable().unique();
    t.integer('destination_id').unsigned().references('id').inTable('destinations');
    t.integer('star_rating').defaultTo(3);
    t.text('short_description');
    t.text('description', 'longtext');
    t.text('amenities');
    t.string('address', 300);
    t.string('phone', 30);
    t.string('email', 255);
    t.string('website', 300);
    t.string('featured_image', 500);
    t.string('map_lat', 20);
    t.string('map_lng', 20);
    t.decimal('price_from', 12, 2);
    t.string('currency_code', 3).defaultTo('USD');
    t.boolean('is_active').defaultTo(true);
    t.boolean('is_featured').defaultTo(false);
    t.timestamps(true, true);
    t.index(['slug']);
    t.index(['destination_id']);
  });

  await knex.schema.createTable('hotel_rooms', t => {
    t.increments('id').primary();
    t.integer('hotel_id').unsigned().notNullable().references('id').inTable('hotels').onDelete('CASCADE');
    t.string('name', 150).notNullable();
    t.text('description');
    t.integer('max_occupancy').defaultTo(2);
    t.decimal('price_per_night', 12, 2).notNullable();
    t.string('currency_code', 3).defaultTo('USD');
    t.integer('total_rooms').defaultTo(1);
    t.string('image', 500);
    t.boolean('is_active').defaultTo(true);
    t.index(['hotel_id']);
  });

  await knex.schema.createTable('hotel_bookings', t => {
    t.increments('id').primary();
    t.integer('booking_id').unsigned().references('id').inTable('bookings');
    t.integer('hotel_id').unsigned().notNullable().references('id').inTable('hotels');
    t.integer('room_id').unsigned().references('id').inTable('hotel_rooms');
    t.date('check_in').notNullable();
    t.date('check_out').notNullable();
    t.integer('rooms').defaultTo(1);
    t.integer('guests').defaultTo(2);
    t.decimal('total_price', 12, 2);
    t.enu('status', ['pending', 'confirmed', 'cancelled']).defaultTo('pending');
    t.timestamps(true, true);
    t.index(['booking_id']);
    t.index(['hotel_id']);
  });

  // ─── TRANSPORTATION ──────────────────────────────────────
  await knex.schema.createTable('transportation', t => {
    t.increments('id').primary();
    t.string('name', 200).notNullable();
    t.string('type', 50).notNullable(); // car, van, bus, 4x4, boat
    t.text('description');
    t.integer('capacity').defaultTo(4);
    t.decimal('price_per_day', 12, 2);
    t.decimal('price_per_km', 12, 2);
    t.string('currency_code', 3).defaultTo('USD');
    t.string('image', 500);
    t.boolean('has_driver').defaultTo(true);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('transport_bookings', t => {
    t.increments('id').primary();
    t.integer('booking_id').unsigned().references('id').inTable('bookings');
    t.integer('transport_id').unsigned().notNullable().references('id').inTable('transportation');
    t.string('pickup_location', 300);
    t.string('dropoff_location', 300);
    t.datetime('pickup_datetime');
    t.integer('passengers').defaultTo(1);
    t.decimal('total_price', 12, 2);
    t.enu('status', ['pending', 'confirmed', 'cancelled']).defaultTo('pending');
    t.text('notes');
    t.timestamps(true, true);
    t.index(['booking_id']);
  });

  // ─── VISA ────────────────────────────────────────────────
  await knex.schema.createTable('visa_requirements', t => {
    t.increments('id').primary();
    t.integer('country_id').unsigned().notNullable().references('id').inTable('countries');
    t.string('visa_type', 100).notNullable();
    t.text('requirements', 'longtext');
    t.text('documents_needed', 'longtext');
    t.decimal('fee', 12, 2);
    t.string('currency_code', 3).defaultTo('USD');
    t.string('processing_time', 100);
    t.text('notes');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
    t.index(['country_id']);
  });

  // ─── REVIEWS ─────────────────────────────────────────────
  await knex.schema.createTable('reviews', t => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    t.integer('tour_id').unsigned().references('id').inTable('tour_packages').onDelete('CASCADE');
    t.integer('hotel_id').unsigned().references('id').inTable('hotels').onDelete('CASCADE');
    t.integer('booking_id').unsigned().references('id').inTable('bookings');
    t.integer('rating').notNullable(); // 1-5
    t.string('title', 200);
    t.text('content');
    t.enu('status', ['pending', 'approved', 'rejected', 'hidden']).defaultTo('pending');
    t.text('admin_response');
    t.timestamps(true, true);
    t.index(['tour_id', 'status']);
    t.index(['hotel_id', 'status']);
    t.index(['user_id']);
  });

  // ─── NOTIFICATIONS ───────────────────────────────────────
  await knex.schema.createTable('notifications', t => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('type', 50).notNullable();
    t.string('title', 200).notNullable();
    t.text('message');
    t.string('link', 500);
    t.boolean('is_read').defaultTo(false);
    t.timestamps(true, true);
    t.index(['user_id', 'is_read']);
  });

  // ─── CONTACT & ENQUIRIES ─────────────────────────────────
  await knex.schema.createTable('contact_messages', t => {
    t.increments('id').primary();
    t.string('name', 150).notNullable();
    t.string('email', 255).notNullable();
    t.string('phone', 30);
    t.string('subject', 200);
    t.text('message').notNullable();
    t.enu('status', ['new', 'read', 'replied', 'archived']).defaultTo('new');
    t.text('admin_notes');
    t.integer('replied_by').unsigned().references('id').inTable('users');
    t.timestamps(true, true);
    t.index(['status']);
  });

  await knex.schema.createTable('enquiries', t => {
    t.increments('id').primary();
    t.string('name', 150).notNullable();
    t.string('email', 255).notNullable();
    t.string('phone', 30);
    t.integer('tour_id').unsigned().references('id').inTable('tour_packages');
    t.integer('destination_id').unsigned().references('id').inTable('destinations');
    t.date('travel_date');
    t.integer('travelers').defaultTo(1);
    t.text('message');
    t.string('budget_range', 50);
    t.enu('status', ['new', 'contacted', 'quoted', 'converted', 'closed']).defaultTo('new');
    t.text('admin_notes');
    t.integer('assigned_to').unsigned().references('id').inTable('users');
    t.timestamps(true, true);
    t.index(['status']);
    t.index(['tour_id']);
  });

  // ─── CMS / CONTENT ──────────────────────────────────────
  await knex.schema.createTable('site_settings', t => {
    t.increments('id').primary();
    t.string('setting_key', 100).notNullable().unique();
    t.text('setting_value', 'longtext');
    t.string('setting_type', 20).defaultTo('text'); // text, textarea, image, boolean, json
    t.string('group', 50).defaultTo('general');
    t.string('label', 150);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.index(['setting_key']);
    t.index(['group']);
  });

  await knex.schema.createTable('pages', t => {
    t.increments('id').primary();
    t.string('title', 200).notNullable();
    t.string('slug', 250).notNullable().unique();
    t.text('content', 'longtext');
    t.string('meta_title', 200);
    t.text('meta_description');
    t.enu('status', ['draft', 'published']).defaultTo('draft');
    t.timestamps(true, true);
    t.index(['slug']);
  });

  await knex.schema.createTable('faqs', t => {
    t.increments('id').primary();
    t.string('question', 500).notNullable();
    t.text('answer').notNullable();
    t.string('category', 100);
    t.integer('sort_order').defaultTo(0);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('media', t => {
    t.increments('id').primary();
    t.string('filename', 300).notNullable();
    t.string('original_name', 300);
    t.string('mime_type', 100);
    t.integer('file_size');
    t.string('path', 500).notNullable();
    t.string('alt_text', 300);
    t.string('category', 50);
    t.integer('uploaded_by').unsigned().references('id').inTable('users');
    t.timestamps(true, true);
  });

  // ─── AUDIT & SYSTEM ─────────────────────────────────────
  await knex.schema.createTable('audit_logs', t => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users');
    t.string('action', 100).notNullable();
    t.string('entity_type', 50);
    t.integer('entity_id');
    t.text('details');
    t.string('ip_address', 45);
    t.timestamps(true, true);
    t.index(['user_id']);
    t.index(['entity_type', 'entity_id']);
  });

  await knex.schema.createTable('email_logs', t => {
    t.increments('id').primary();
    t.string('to_email', 255).notNullable();
    t.string('subject', 300);
    t.string('template', 100);
    t.enu('status', ['sent', 'failed', 'queued']).defaultTo('queued');
    t.text('error_message');
    t.timestamps(true, true);
  });
}

export async function down(knex) {
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
    await knex.schema.dropTableIfExists(table);
  }
}
