const express = require('express')
const router = express.Router()
const {authenticateUser , authorizePermissions} = require('../middleware/authentication')
const {
    getAllUsers,
    getSingelUser,
    showCurrenteUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController')
router.route('/').get(authenticateUser,authorizePermissions('admin','owner'),getAllUsers)
router.route('/showMe').get(authenticateUser,showCurrenteUser)
router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)
router.route('/:id').get(authenticateUser,getSingelUser)
module.exports = router