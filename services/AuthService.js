import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import authConfig from '../config/auth.js';
import { generateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  /**
   * Register a new customer
   */
  static async register(userData) {
    const { first_name, last_name, email, password } = userData;

    // Check if email exists
    const existing = await db('users').where({ email }).first();
    if (existing) {
      throw new Error('Email is already registered');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, authConfig.bcryptRounds);

    // Get customer role id
    const role = await db('roles').where({ name: 'customer' }).first();

    // Insert user
    const [userId] = await db('users').insert({
      first_name,
      last_name,
      email,
      password_hash,
      role_id: role.id,
      is_active: true
    });

    // Fetch created user
    const user = await db('users')
      .select('users.*', 'roles.name as role_name')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .where('users.id', userId)
      .first();

    const token = generateToken(user);
    
    logger.info(`New user registered: ${email}`);
    
    return {
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role_name },
      token
    };
  }

  /**
   * Authenticate a user
   */
  static async login(email, password) {
    const user = await db('users')
      .select('users.*', 'roles.name as role_name')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .where('users.email', email)
      .andWhere('users.is_active', true)
      .first();

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await db('users').where({ id: user.id }).update({ last_login: db.fn.now() });

    const token = generateToken(user);
    
    return {
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role_name },
      token
    };
  }
}

export default AuthService;
