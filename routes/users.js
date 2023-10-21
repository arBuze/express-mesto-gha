const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers); /* возвращаем всех пользователей */
router.get('/:userId', getUserById); /* возвращаем пользователя по id */
router.post('/', createUser); /* создание пользователя */
router.patch('/me', updateProfile); /* обновление профиля */
router.patch('/me/avatar', updateAvatar); /* обновление аватара */

module.exports = router;
