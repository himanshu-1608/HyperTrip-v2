const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

module.exports = async (req, res, next) => {
  const authorized = req.get('Authorization');
  if (authorized) {
    const token = authorized.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET);
    } catch (err) {
      const error = new Error('Server/Token Error.');
      error.statusCode = 500;
      return next(error);
    }
    if (!decodedToken) {
      const error = new Error('Unauthenticated User(Please Login OR Signup)');
      error.statusCode = 401;
      return next(error);
    }
    req.userId = decodedToken.userId;
    next();
  } else {
    const error = new Error('No Auth Token sent');
    error.statusCode = 401;
    return next(error);
  }
};
