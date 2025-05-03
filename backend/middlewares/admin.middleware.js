const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }
    next();
  };
  
  module.exports = adminMiddleware;
  