const express = require('express');
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory, getAllCategoriesAdmin
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCategories);
router.get('/admin/all', protect, adminOnly, getAllCategoriesAdmin);
router.post('/', protect, adminOnly, upload.single('image'), createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
