const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateDislikeCard,
} = require('../middlewares/validate');

router.get('/', getCards); /* возвращаем все карточки */

/* создание карточки */
router.post('/', validateCreateCard, createCard);

/* удаление карточки */
router.delete('/:cardId', validateDeleteCard, deleteCard);

/* лайк карточки */
router.put('/:cardId/likes', validateLikeCard, likeCard);

/* снятие лайка */
router.delete('/:cardId/likes', validateDislikeCard, dislikeCard);

module.exports = router;
