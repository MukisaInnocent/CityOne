import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';
import { db } from '../config/database.js';

/** Verify JWT from cookie or Authorization header */
export async function authenticate(req, res, next) {
  try {
    let token = null;

    // Check cookie first, then Authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret);
    const user = await db('users')
      .select('users.*', 'roles.name as role_name')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .where('users.id', decoded.userId)
      .where('users.is_active', true)
      .first();

    if (!user) {
      res.clearCookie('token');
      req.user = null;
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role_name,
      roleId: user.role_id
    };

    // Make user available in templates
    res.locals.currentUser = req.user;
    next();
  } catch (error) {
    res.clearCookie('token');
    req.user = null;
    next();
  }
}

/** Require authentication — redirect to login if not authenticated */
export function requireAuth(req, res, next) {
  if (!req.user) {
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

/** Require specific role(s) */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect('/login');
    }

    if (!roles.includes(req.user.role)) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return res.status(403).render('errors/403', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page.'
      });
    }

    next();
  };
}

/** Generate JWT token */
export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role_name || user.role },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );
}

/** Set auth cookie */
export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
}

export default { authenticate, requireAuth, requireRole, generateToken, setAuthCookie };
