const express = require('express')
const router = express.Router();


const  {
    updateReview,deleteReview,createReview, getSingleProductReviews
} = require('../controllers/reviewController')

const { authenticateUser} = require('../middleware/authentication')

router.route('/')
.post(createReview)

router.route('/:id')
.get(getSingleProductReviews)
.delete(deleteReview)
.patch(updateReview)

module.exports = router