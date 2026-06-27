const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'SMARTPASSPORT_SECURE_JWT_SIGNING_KEY_2026';

/**
 * Middleware: Authenticate User
 * Validates the JWT inside the Authorization header
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Expected format: Bearer <token>
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Invalid or expired access token.' 
        });
      }

      // Attach user payload to request context
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Access token is missing.' 
    });
  }
};

/**
 * Middleware: Role Authorization
 * Restricts route access to specific roles
 * @param {Array<string>} roles - Authorized roles list
 */
const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: User not authenticated.' 
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Forbidden: Restricted access. Requires role in [${roles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  JWT_SECRET
};
