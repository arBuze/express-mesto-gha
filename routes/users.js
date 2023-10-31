const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { urlRegex } = require('../utils/constants');

router.get('/', getAllUsers); /* возвращаем всех пользователей */
router.get('/me', getCurrentUser); /* возвращаем данные о текущем пользователе */

/* возвращаем пользователя по id */
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().alphanum().length(24),
    }),
  }),
  getUserById,
);

/* обновление профиля */
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

/* обновление аватара */
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(urlRegex),
    }),
  }),
  updateAvatar,
);

module.exports = router;
