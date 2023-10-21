const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

/* возвращаем все карточки */
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERR).send({ message: 'Ошибка сервера' }));
};

/* создание карточки */
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(SERVER_ERR).send({ message: 'Ошибка сервера' });
    });
};

/* удаление карточки */
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send(card);
    })
    .catch(() => res.status(SERVER_ERR).send({ message: 'Ошибка сервера' }));
};

/* лайк карточки */
module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        }
        return res.send(card);
      })
      .catch(() => res.status(SERVER_ERR).send({ message: 'Ошибка сервера' }));
  } else {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
  }
};

/* снятие лайка */
module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        }
        return res.send(card);
      })
      .catch(() => res.status(SERVER_ERR).send({ message: 'Ошибка сервера' }));
  } else {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
  }
};
