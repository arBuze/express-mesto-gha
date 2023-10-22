const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERR,
} = require('../utils/constants');

/* возвращаем всех пользователей */
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERR).send({ message: 'Ошибка сервера' }));
};

/* возвращаем пользователя по id */
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный _id' });
      }
      return res.status(SERVER_ERR).send({ message: 'Ошибка сервера' });
    });
};

/* создание пользователя */
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(SERVER_ERR).send({ message: 'Ошибка сервера' });
    });
};

/* обновление профиля */
module.exports.updateProfile = (req, res) => {
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
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(SERVER_ERR).send({ message: 'Ошибка сервера' });
    });
};

/* обновление аватара */
module.exports.updateAvatar = (req, res) => User.findByIdAndUpdate(
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
      return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(SERVER_ERR).send({ message: 'Ошибка сервера' });
  });
