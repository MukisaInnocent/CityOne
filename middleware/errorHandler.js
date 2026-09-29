import { logger } from '../utils/logger.js';

/** Global error handler */
export function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(`${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  const statusCode = err.statusCode || err.status || 500;
  const isApi = req.originalUrl.startsWith('/api/') ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  if (isApi) {
    return res.status(statusCode).json({
      error: statusCode === 500 ? 'Internal server error' : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  }

  // Render error page
  const template = statusCode === 404 ? 'errors/404'
    : statusCode === 403 ? 'errors/403'
    : 'errors/500';

  res.status(statusCode).render(template, {
    title: statusCode === 404 ? 'Page Not Found'
      : statusCode === 403 ? 'Access Denied'
      : 'Server Error',
    message: statusCode === 500
      ? 'Something went wrong. Please try again later.'
      : err.message
  });
}

/** 404 handler — must be registered after all routes */
export function notFoundHandler(req, res) {
  const isApi = req.originalUrl.startsWith('/api/');
  if (isApi) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
}

/** Async route wrapper — catches promise rejections */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default { errorHandler, notFoundHandler, asyncHandler };
