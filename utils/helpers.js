import slugify from 'slugify';

/** Generate URL-safe slug */
export function createSlug(text) {
  return slugify(text, { lower: true, strict: true, trim: true });
}

/** Generate booking reference: TOUR-YYYY-NNNNNN */
export function generateBookingRef(sequenceNum) {
  const year = new Date().getFullYear();
  const padded = String(sequenceNum).padStart(6, '0');
  return `TOUR-${year}-${padded}`;
}

/** Format currency amount */
export function formatCurrency(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/** Format date for display */
export function formatDate(date, format = 'medium') {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** Truncate text with ellipsis */
export function truncate(text, length = 150) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/** Sanitize filename */
export function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
}

/** Calculate pagination */
export function paginate(page = 1, limit = 12, total = 0) {
  const currentPage = Math.max(1, parseInt(page));
  const perPage = Math.min(100, Math.max(1, parseInt(limit)));
  const totalPages = Math.ceil(total / perPage);
  const offset = (currentPage - 1) * perPage;

  return {
    currentPage,
    perPage,
    total,
    totalPages,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

/** Build pagination URL params */
export function paginationUrl(baseUrl, page, extraParams = {}) {
  const params = new URLSearchParams({ page, ...extraParams });
  return `${baseUrl}?${params.toString()}`;
}

/** Check if request is AJAX */
export function isAjax(req) {
  return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
}

/** Escape HTML entities */
export function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

export default {
  createSlug, generateBookingRef, formatCurrency, formatDate,
  truncate, sanitizeFilename, paginate, paginationUrl, isAjax, escapeHtml
};
