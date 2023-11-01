const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
