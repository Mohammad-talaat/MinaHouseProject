const express = require('express')
const router = express.Router()
const { authenticateUser, authorizePermissions} = require('../middleware/authentication');
const {
    createProduct,
    getAllProducts,
    getSingleProduct,

   updateProduct,
    deleteProduct
} = require('../controllers/productController')



router.route('/').get(getAllProducts).post(authenticateUser,authorizePermissions('admin', 'owner'),createProduct)
router.route('/:id').get(getSingleProduct).delete(authenticateUser,authorizePermissions('admin', 'owner'), deleteProduct).patch(authenticateUser,authorizePermissions('admin','owner'), updateProduct)


module.exports = router;