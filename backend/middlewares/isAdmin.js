module.exports = async (req, res, next) => {
  if (!req.query.isAdmin) {
    const error = new Error('Unauthorized Access Denied(Only for Admins)');
    error.statusCode = 403;
    return next(error);
  }
  next();
};
