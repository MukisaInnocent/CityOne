export default {
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
  bcryptRounds: 12,
  passwordResetExpiry: 60 * 60 * 1000, // 1 hour
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
};
