
const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken; // needs cookie-parser
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  req.user = { userId: decoded.userId, email: decoded.email };
  next();
}

module.exports = { requireAuth };