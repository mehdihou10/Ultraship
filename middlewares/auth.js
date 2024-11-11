const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send('Invalid token');
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).send('No token provided');
    }
  };

  module.exports = authMiddleware
  