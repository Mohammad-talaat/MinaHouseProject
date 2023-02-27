const express = require('express')
const router = express.Router()

const category = require('../controllers/categoryController')
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router.route('/').get(category.getAllCategories).post(authenticateUser, authorizePermissions('admin', 'owner'), category.addCategory)
router.route('/:id').get(category.getCategory).patch(authenticateUser, authorizePermissions('admin', 'owner'), category.updateCategory).delete(authenticateUser, authorizePermissions('admin'), category.deleteCategory)

module.exports = router