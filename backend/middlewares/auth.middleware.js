const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
module.exports = authMiddleware;
