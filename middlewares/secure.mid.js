const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role === role) {
      next()
    } else {
      next(createError(403, 'Forbidden'))
    }
  }
}