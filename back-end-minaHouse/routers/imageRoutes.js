const express = require('express');
const imageUpload = require('../controllers/imageUpload');
const router = express.Router();

router.post('/', imageUpload);

module.exports = router