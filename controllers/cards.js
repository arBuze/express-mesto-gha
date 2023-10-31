const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

/* возвращаем все карточки */
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next(new ServerError('Ошибка сервера')));
};

/* создание карточки */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

/* удаление карточки */
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError('Нельзя удалить карточку другого пользователя'));
      }
      return Card.deleteOne(card);
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id карточки'));
      }
      next(new ServerError('Ошибка сервера'));
    });

  /* Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(SERVER_ERR).send({ message: 'Ошибка сервера' });
    }); */
};

/* лайк карточки */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id карточки'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

/* снятие лайка */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id карточки'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};
