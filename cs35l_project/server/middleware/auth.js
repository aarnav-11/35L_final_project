
const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken; // needs cookie-parser
  if (!token) return res.status(403).json({ error: 'Unauthorized' });

  const decodedToken = verifyToken(token); //verifyToken returns a json object of the decodedToken token or null
  if (!decodedToken) return res.status(405).json({ error: 'Invalid token' });

  req.user = { userId: decodedToken.userId, email: decodedToken.email };
  next();
}

module.exports = { requireAuth };