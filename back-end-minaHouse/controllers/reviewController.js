const Review = require('../models/review')
const product = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermission} = require('../utils/checkPermissions')


const createReview = async(req,res)=>{
    const {product:productId} = req.body
    const {user:userId} = req.body
    //req.body.user = req.user.userId
    const isValidProduct = await product.findOne({_id:productId})
    if(!isValidProduct){
        throw new CustomError.NotFoundError(`no product with id: ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({product:productId,user:userId})
   
    if(alreadySubmitted){
        throw new CustomError.BadRequestError('already submitted')
    }
    
    const review = await Review.create(req.body)
    res.status(StatusCodes.OK).json({review})
}
const updateReview = async(req,res)=>{
    const {id:reviewId} = req.params
    const { rating,comment} = req.body

    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError('no review with this id')
    }
  
    
    review.rating=rating;
    review.comment=comment
    await review.save();
    res.status(StatusCodes.OK).json({review})
}
const deleteReview = async(req,res)=>{
    const {id:reviewId} = req.params

    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError('no review with this id')
    }
    //checkPermission(req.user,review.user.toString())
    await review.remove()
    res.status(StatusCodes.OK).json({msg: 'review removed successfully!'})
}
const getSingleProductReviews =async(req,res)=>{
    const {id:productId} = req.params
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
}


module.exports = {
    
    updateReview,
    deleteReview,
    createReview,
    getSingleProductReviews
}