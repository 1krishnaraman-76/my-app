const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiting
 * Prevents DDoS and brute-force scanning
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Auth specific rate limiting
 * Extra restriction for logins and registration to prevent password cracking
 */
const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 OTP/Login requests per hour
  message: {
    success: false,
    error: 'Too many authorization attempts. Please try again after an hour.'
  }
});

/**
 * XSS & SQL Injection sanitization middleware
 * Basic check for dangerous HTML scripts or database commands in user string inputs
 */
const inputShield = (req, res, next) => {
  const sanitize = (val) => {
    if (typeof val === 'string') {
      // Basic block for HTML tag injection
      let clean = val.replace(/<[^>]*>/g, '');
      // Strip dangerous characters frequently associated with unescaped SQL injections
      clean = clean.replace(/['";\-]/g, '');
      return clean.trim();
    }
    return val;
  };

  if (req.body) {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = sanitize(req.body[key]);
      }
    }
  }

  if (req.query) {
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        req.query[key] = sanitize(req.query[key]);
      }
    }
  }

  next();
};

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  inputShield
};
