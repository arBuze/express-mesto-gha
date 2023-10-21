const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); /* возвращаем все карточки */
router.post('/', createCard); /* создание карточки */
router.delete('/:cardId', deleteCard); /* удаление карточки */
router.put('/:cardId/likes', likeCard); /* лайк карточки */
router.delete('/:cardId/likes', dislikeCard); /* снятие лайка */

module.exports = router;
