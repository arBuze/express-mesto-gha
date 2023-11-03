const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  validateGetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/validate');

router.get('/', getAllUsers); /* возвращаем всех пользователей */
router.get('/me', getCurrentUser); /* возвращаем данные о текущем пользователе */

/* возвращаем пользователя по id */
router.get('/:userId', validateGetUserById, getUserById);

/* обновление профиля */
router.patch('/me', validateUpdateProfile, updateProfile);

/* обновление аватара */
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
