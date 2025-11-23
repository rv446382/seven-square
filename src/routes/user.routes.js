const express = require('express');
const {
  getProfile,
  getAllUsers,
  updateProfile,
  softDeleteUser
} = require('../controllers/user.controller');

const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/', protect, getAllUsers);
router.put('/update', protect, upload.single('image'), updateProfile);
router.delete('/:id', protect, softDeleteUser);

module.exports = router;
