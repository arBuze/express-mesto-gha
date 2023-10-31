const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/* ошибки */
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ServerError = require('../errors/ServerError');

const { JWT_SECRET = 'secret-key' } = process.env;

/* возвращаем всех пользователей */
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next(new ServerError('Ошибка сервера')));
};

/* возвращаем пользователя по id */
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

/* получение данных текущего пользователя */
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

/* создание пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

/* обновление профиля */
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        about,
      },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

/* обновление аватара */
module.exports.updateAvatar = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  {
    $set: {
      avatar: req.body.avatar,
    },
  },
  {
    returnDocument: 'after',
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) {
      next(NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    }
    next(new ServerError('Ошибка сервера'));
  });

/* логин */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch(next);
};
