const express = require('express')
const router = express.Router();

const { register,
        login,
        logout,
        admin,
        addAdmin,
        forgotPassword,
        resetPassword} = require('../controllers/authController')

 const       {
            authenticateUser,
            authorizePermissions,
          } = require('../middleware/authentication')
router.post('/login',login);
router.post('/register',register);
router.get('/logout',logout);
router.post('/admin',admin);
router.post('/addAdmin',authenticateUser,authorizePermissions('owner'),addAdmin);

router.post('/reset-password',resetPassword);
router.post('/forgot-password',forgotPassword);

module.exports = router;


