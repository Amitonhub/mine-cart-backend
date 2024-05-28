const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const accessToken = req.headers?.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkAuth };